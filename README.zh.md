# dsh-blunt-dev

[English](README.md) | 中文

这是往系统提示词里注入一段固定程序员风格DeepSeek Harness 插件，装上之后，同一个 profile 里的对话不再写高考作文，开始像隔壁同事跟你讲事。

它针对的是 DeepSeek 特有的毛病：不是客服腔，是**文豪腔**。三句话的事也上 `###` 小标题，一段话加粗三处，列表项前面排 emoji，没让引用就引名言，结尾再来一段升华，把话题拔到"科技的温度"。

## 它改了什么

- **禁用词分五类意图**，每类覆盖同义词群（开场反应、结构衔接、文豪腔、教师腔、互动收尾），另加一条"换词也犯规"，堵死"总的来说 → 归根结底"这种绕路。
- **十五条禁用行为**：小标题、加粗、emoji、没让做就生成表格和引用、结尾升华、比喻成瘾、设问自答、排比连用、四字成语连发、复述问题、复读思考过程、问一个答六个、答完追问"还有什么想了解的"。
- **正面要求配真实正反例**，反例按 DeepSeek 的默认输出还原，包括 emoji、加粗、引名言三件套。
- **防矫枉过正**：准确性优先于风格，编造是红线（不确定就说"你去核实"），要正式文体时自动切书面。
- **深度思考专项**：推理是草稿纸，不是给用户看的公告。

## 安装

从 GitHub 装：

```sh
dsh plugin --profile web add github:rosemary-ewe/dsh-blunt-dev
```

npm 上发布之后也可以用包名：

```sh
dsh plugin --profile web add dsh-blunt-dev
```

装完重启 DSH。插件行会进到 profile 的 bundle 栈里，之后市场开关和 profile 的 patch 文件都管得着它。

## 配置

`cordis.patch.yml` 里那一行是你自己的：

```yaml
- id: blunt-dev
  name: dsh-blunt-dev
  config:
    enabled: true            # false 只停用不卸载
    extraBanned: []          # 个人黑名单，最高优先级
    extraRules: ''           # 追加规则，接在风格块后面
    order: 46                # 排在 persona（0）之后、工具引导（1000+）之前
```

最有用的字段是 `extraBanned`。哪天某句话开始让你膈应，把它加进数组，模型会被要求：出现就整段重写，换同义词也一样。这两个字段的内容会原样进入系统提示词，只放你信得过的文字。

## 验证

```sh
dsh --profile web --dump-config   # 组合后的配置树里能看到 blunt-dev 行
```

把仓库 clone 下来之后，`npm test` 会覆盖注册、段落顺序和配置处理。

## 兼容性

针对 `dsh` 0.2.0-rc.2 与 `@deepseek-ai/dsh-system-prompt` 0.2.0-rc.2 编写。插件只调用 `ctx.systemPrompt.section()`，rc 阶段一直稳定的注册接口。无运行时依赖、无构建步骤、无安装脚本。

## 许可

MIT
