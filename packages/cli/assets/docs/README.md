# /packages/cli/assets/docs

为**使用** Astryx 构建产品的人提供的参考主题。不是关于构建 Astryx 本身的文档。

每个主题一个 `{topic}.doc.mjs`，外加可选的 `{topic}.doc.dense.mjs` / `{topic}.doc.zh.mjs` 叙述性覆盖层。`foundation/discovery/docs-discovery.mjs` 无需注册即可拾取这里的任何 `{topic}.doc.mjs`；`api/docs/_adapter.mjs` 会合并这些覆盖层。

你添加的内容会进入 `astryx docs <topic>`、`astryx search`、`--json` API、agent-docs 区块和文档站点——并随 npm 发布。

## 你在为谁写作

使用 Astryx 构建产品的人。他们的问题是：

- 一个组件是做什么用的，以及什么时候该改用别的东西
- props、它们的默认值，以及每个 prop 对他们所见内容的影响
- 如何组合它，以及要照抄的模式
- 它的代价——包体积，以及他们继承的无障碍（a11y）义务
- 如何为其设置主题，以及哪些目标是稳定的

**对你添加的任何内容，检验标准是：调用者会据此采取行动吗？** 他们不是在审查 PR，不是把组件从 lab 提升出来，也不是在给清单附上证据。

## 表明你是在为我们而不是为他们写作的迹象

- 第二人称指向了错误的读者——"评审者应该……"、"在提升组件之前……"、"为……附上证据"
- 读者必须为 Astryx 维护者满足的内部评分标准、就绪门槛、审计清单或签核
- 一张列出要验证的事项而不是要使用的事项的表格
- 任何关于 lab → core 的内容，那是我们的生命周期，不是他们的
- 把 Storybook、Playwright、CI 或 Simulator 说成读者会运行的工具

一个微妙之处：关于**系统行为**的陈述是面向调用者的，即使它听起来像流程。"组件的主题目标一旦发布就是稳定的"告诉调用者可以依赖什么；"评审者必须检查主题目标是否稳定"是写给我们的。同一个事实，不同的读者——**重写它，而不是移动它**。

当一份公开的编写质量评分标准能帮助人们评估他们通过 Astryx 创建的产物时，它也是面向调用者的。它必须仅凭公开输入就能完整、可操作地使用。它不得包含 Astryx 的内部批准、提升、证据发布或 CI 流程。当前的系统规范必须指定随附指南作为该评分标准的所有者。

## 其余内容放在哪里

这些材料通常质量不错；问题在于放置位置，而不是质量。它应放在 [wiki](https://github.com/meta/astryx/wiki) 中——**作为已经涵盖该内容的页面上的一个章节，而不是新页面。** wiki 已有近 60 页，其中几页相互重叠，因为每个散落的章节都单独占了一页。

| 你写的内容                        | 它应放的位置                                                                                                                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 组件如何评级——检查、评分          | [Component-Audit-Rubric](https://github.com/meta/astryx/wiki/Component-Audit-Rubric)                                                                                                 |
| lab → core 提升，组件必须满足什么 | [Component-Lifecycle](https://github.com/meta/astryx/wiki/Component-Lifecycle)                                                                                                       |
| 如何构建一个新组件                | [Component-Authoring-Guide](https://github.com/meta/astryx/wiki/Component-Authoring-Guide), [Creating-New-Components](https://github.com/meta/astryx/wiki/Creating-New-Components)   |
| 组件必须针对什么进行加固          | [Component-Hardening-Protocol](https://github.com/meta/astryx/wiki/Component-Hardening-Protocol), [Hardening-Audit-Guide](https://github.com/meta/astryx/wiki/Hardening-Audit-Guide) |
| 作为我们运行的检查的无障碍要求    | [Accessibility-Checklist](https://github.com/meta/astryx/wiki/Accessibility-Checklist)                                                                                               |
| 系统是如何组成的                  | [System-Architecture](https://github.com/meta/astryx/wiki/System-Architecture), [Theming-Infrastructure](https://github.com/meta/astryx/wiki/Theming-Infrastructure)                 |
| API 命名和形态决策                | [API-Conventions](https://github.com/meta/astryx/wiki/API-Conventions), [API-Arbitration](https://github.com/meta/astryx/wiki/API-Arbitration)                                       |
| 贡献者工作流、PR 流程             | [Contributing](https://github.com/meta/astryx/wiki/Contributing), [Contributing-with-AI-Assistants](https://github.com/meta/astryx/wiki/Contributing-with-AI-Assistants)             |
| 发布机制                          | [Release-Process](https://github.com/meta/astryx/wiki/Release-Process)                                                                                                               |
| 夜间代理角色做什么                | 从 [Night-Watch-Overview](https://github.com/meta/astryx/wiki/Night-Watch-Overview) 开始的 Night-Watch 系列页面                                                                      |

**找不到对应的行？** 它仍然不是面向调用者的。默认放到 [Contributing](https://github.com/meta/astryx/wiki/Contributing)，或者当它是某人在克隆仓库后遵循的步骤时，放到 `CONTRIBUTING.md`。永远不要默认放回本目录。

示例：一份响应式与交互就绪评分标准属于评级标准 → **Component-Audit-Rubric**；如果它是提升门槛，则归入 **Component-Lifecycle**。

## 代码示例中的导入

从 `astryx component <Name>` 打印的路径导入每个 Core 导出：如果 Core 有组件自己的入口，就用它（`@astryxdesign/core/VStack`、`@astryxdesign/core/Heading`）；`Theme`、`defineTheme` 和主题 API 的其余部分则用 `@astryxdesign/core/theme`。读者复制一个示例，然后阅读 `astryx component`，同一个导出的两条路径会被读成两个不同的东西。无构建 CDN 页面是例外：它的 import map 只列出包根。

## 章节是逐节阅读的

`astryx docs <topic> --index` 会列出一个主题的各个章节，然后读者按键打开其中一个章节。章节的键是它的 `id`，如果没有，则是由其标题派生的键。当章节标题可能变化时，给它一个 `id`，因为读者和扩展会链接到该键。同一主题中的两个章节不能共享一个键。让每个章节足够小，可以独立阅读：`astryx doctor` 会对任何超过 32 KB 的章节发出警告。
