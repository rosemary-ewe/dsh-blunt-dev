# dsh-blunt-dev

English | [中文](README.zh.md)

A DeepSeek Harness plugin that injects one system-prompt section: a blunt
senior-developer voice. Install it and every session in that profile stops
writing like a 高考 essay and starts answering like the colleague at the next
desk.

It targets DeepSeek's specific failure mode — not customer-service flattery but
**essay voice**: `###` headings over three-sentence answers, three bolded
phrases per paragraph, emoji bullet leaders, a famous quote nobody asked for,
and a closing that elevates the topic to the temperature of technology.

## What it changes

- **Banned words, in five intent groups**, each covering its synonym family
  (openers, connectors, literary flourishes, teacher voice, closing prompts),
  plus a reword clause so "总的来说 → 归根结底" is not a way around the list.
- **Fifteen banned behaviours**: headings, bold spam, emoji, unrequested
  tables and quotes, closing elevation, metaphor stacking, self-Q&A, parallel
  triads, four-character idiom spam, question restatement, replaying the
  reasoning trace, six answers to one question, trailing "anything else?".
- **Positive requirements with real before/after examples**, including a
  faithful reproduction of the default DeepSeek output.
- **Exaggeration guards**: accuracy beats style, fabrication is the red line
  (say "not sure, go verify" instead), formal prose still available on request.
- **Deep-think clause**: the reasoning trace is scratch paper, never the reply.

## Install

From GitHub:

```sh
dsh plugin --profile web add github:rosemary-ewe/dsh-blunt-dev
```

From npm, once this package is published there:

```sh
dsh plugin --profile web add dsh-blunt-dev
```

Restart DSH after installing. The row lands in the profile's bundle stack; from
there the market's enable/disable toggle and the profile patch file both work on
it.

## Configure

The insert row in `cordis.patch.yml` is yours to edit:

```yaml
- id: blunt-dev
  name: dsh-blunt-dev
  config:
    enabled: true            # false disables without uninstalling
    extraBanned: []          # your personal blacklist, highest priority
    extraRules: ''           # extra rules appended after the style block
    order: 46                # after persona (0), before tool guidance (1000+)
```

`extraBanned` is the useful one: when a phrase starts grating, add it to the
array and the model is told to rewrite the whole sentence if it shows up —
synonym substitutions included. Values in `extraBanned` and `extraRules` are
inserted into the system prompt verbatim, so only put text there whose
instructions you would actually trust.

## Verify

```sh
dsh --profile web --dump-config   # the blunt-dev row is in the composed tree
```

After cloning the repo, `npm test` covers registration, section order, and the
config options.

## Compatibility

Built against `dsh` 0.2.0-rc.2 and `@deepseek-ai/dsh-system-prompt` 0.2.0-rc.2.
The plugin only calls `ctx.systemPrompt.section()`, the registry API that has
been stable across the rc line. No runtime dependencies, no build step, no
install scripts.

## License

MIT
