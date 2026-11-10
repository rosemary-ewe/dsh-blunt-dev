import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DEFAULT_ORDER,
  SECTION,
  STYLE,
  apply,
  buildPrompt,
  inject,
  name,
} from '../lib/index.js'

/**
 * Minimal host stand-in: records what `apply` registers and runs the effect
 * factory the way the Cordis loader does.
 */
function makeCtx() {
  const sections = []
  const ctx = {
    effects: 0,
    effect(factory) {
      ctx.effects += 1
      return factory()
    },
    systemPrompt: {
      section(section) {
        sections.push(section)
        return () => {}
      },
    },
    sections,
  }
  return ctx
}

test('declares the plugin contract', () => {
  assert.equal(name, 'dsh-blunt-dev')
  assert.deepEqual(inject, ['systemPrompt'])
})

test('registers exactly one section at the documented order', () => {
  const ctx = makeCtx()
  apply(ctx, {})

  assert.equal(ctx.sections.length, 1)
  const [section] = ctx.sections
  assert.equal(section.name, SECTION)
  assert.equal(section.order, DEFAULT_ORDER)
  assert.equal(section.order, 46)
  assert.equal(ctx.effects, 1)
  assert.equal(typeof section.text, 'string')
})

test('style text opens and closes on the same workspace anchor', () => {
  assert.match(STYLE, /坐在工位上的老程序员/)
  assert.match(STYLE, /同事还坐旁边等着听/)
  // The closing line repeats the anchor, which is what keeps the model from
  // drifting back into essay voice mid-conversation.
  assert.ok(STYLE.trimEnd().endsWith('别端起来。'))
})

test('style text carries the four banned categories and the reword clause', () => {
  for (const category of ['开场反应类', '结构衔接类', '文豪类', '教师腔类', '互动收尾类']) {
    assert.ok(STYLE.includes(category), `missing category: ${category}`)
  }
  assert.match(STYLE, /换词也犯规/)
  // Spot-check the documented DeepSeek-specific phrases.
  assert.match(STYLE, /归根结底/)
  assert.match(STYLE, /这或许就是/)
  assert.match(STYLE, /科技的温度/)
  assert.match(STYLE, /自检/)
})

test('disabled config registers nothing', () => {
  const ctx = makeCtx()
  apply(ctx, { enabled: false })
  assert.equal(ctx.sections.length, 0)
  assert.equal(ctx.effects, 0)
})

test('extraBanned entries land in the highest-priority block', () => {
  const text = buildPrompt({ extraBanned: ['这或许就是技术的温度', '  ', '欢迎随时提问'] })
  assert.match(text, /个人黑名单（最高优先级/)
  assert.match(text, /这或许就是技术的温度、欢迎随时提问/)
  assert.equal(text.includes('  、'), false)
})

test('empty options leave the base style untouched', () => {
  assert.equal(buildPrompt({}), STYLE)
  assert.equal(buildPrompt({ extraBanned: [] }), STYLE)
  assert.equal(buildPrompt({ extraBanned: ['', '   '] }), STYLE)
  assert.equal(buildPrompt({ extraRules: '   ' }), STYLE)
})

test('extraRules appends after the base style', () => {
  const text = buildPrompt({ extraRules: '一律用中文回答。' })
  assert.ok(text.startsWith(STYLE))
  assert.match(text, /额外要求（比上面的规矩更具体，冲突时听这条）：\n一律用中文回答。/)
})

test('order override is honoured per row', () => {
  const ctx = makeCtx()
  apply(ctx, { order: 60 })
  assert.equal(ctx.sections[0].order, 60)
})

test('non-finite order falls back to the default', () => {
  const ctx = makeCtx()
  apply(ctx, { order: Number.NaN })
  assert.equal(ctx.sections[0].order, DEFAULT_ORDER)
})
