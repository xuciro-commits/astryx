# @astryxdesign/lab

实验性 Astryx 组件。本包是组件晋升到 `@astryxdesign/core` 之前的暂存区。它**仅以 `@canary` dist-tag 发布**到 npm——从不会有稳定版（`latest`）发布。

## 用途

lab 中的组件：

- 可在 storybook 和 sandbox 中导入以供测试
- 仅可通过 `@canary` 标签发布，用于早期外部测试
- 可以自由迭代，无需担心破坏稳定版使用者
- 可与 `@astryxdesign/core` 组件组合使用（使用主题、遵循命名约定）
- 经过充分的工程评审后晋升到 `@astryxdesign/core`

关于组件如何从 lab → core 迁移（以及晋升门槛），请参阅 **[组件生命周期](https://github.com/meta/astryx/wiki/Component-Lifecycle)** wiki；关于组件晋升必须达到的标准，请参阅 **[组件加固协议](https://github.com/meta/astryx/wiki/Component-Hardening-Protocol)**。

## 本包内容与 core 的对比

**Lab：** 可用，具备基本属性，可能带有 stories。API 可能变化。未做无障碍加固，未经过 vibe 测试，未完整主题化。**仅限 canary——不承诺稳定性。**

**Core：** 完整的键盘/无障碍支持、hover 防护、主题化 story、状态呈现、规范符合性、经过 vibe 测试。通过 `latest` 发布给使用者。

## 晋升门槛：无障碍

[无障碍检查清单](https://github.com/meta/astryx/wiki/Accessibility-Checklist) 是晋升到 core 的硬性要求——必须在晋升 PR 中验证每一项，同时满足上文链接的加固标准。

Lab 组件获得与 core 相同的扫描覆盖（`pr-a11y` axe 审核和完整的 release-check 扫描也会对 lab 运行），但 lab 组件上的无障碍问题不会阻止 lab 合并——它们阻止的是**晋升**。在 lab 中自由迭代；通过检查清单即可晋升。

## 用法

在 monorepo 内（storybook/sandbox），导入通过 pnpm workspaces 解析：

```tsx
import {CodeEditor} from '@astryxdesign/lab';
```

### 在自己的项目中试用 lab 组件（canary）

Lab **仅**以 `@canary` dist-tag 发布，因此你必须显式请求该标签。没有 `latest` 版本可供安装。

```bash
npm install @astryxdesign/lab@canary @astryxdesign/core@canary
```

```tsx
import {CodeEditor} from '@astryxdesign/lab';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/lab/lab.css';
```

> Canary 构建跟随 `main` 的最新提交，最多每小时发布一次，也可按需发布（`0.x.y-canary.<sha>`）。任意两个版本之间都可能出现破坏——如果需要稳定性，请固定到确切版本。

## 为 Lab 组件编写文档（canary docsite）

Lab **仅出现在 canary docsite 上**——生产站点记录已发布的稳定版本，从不加载本包（参见 `apps/docsite/scripts/` 中的目标门禁，以及 `apps/docsite/src/__tests__/integration-targets.test.ts` 中的排除测试）。

编写流程与 Core 作者使用的双产物流程相同；唯一区别是可运行演示所在的位置（Core 将其 blocks 集中放在 `packages/cli/assets/templates/blocks/`，而 Lab 在此处拥有自己的 `blocks/` 目录）：

1. **组件文档** — `src/<Name>/<Name>.doc.mjs`，导出 `docs`（属性、用法、playground 配置、`examples`）。在 canary 上自动被识别；无需在任何地方注册。
2. **可运行演示** — `blocks/` 中的同名文件配对：`<BlockName>.tsx` + `<BlockName>.doc.mjs`（标记为 `type: 'block'` 的 `TemplateDoc`）。本包声明该目录后会自动发现——无需按组件配置。docsite 会将该配对渲染为组件页面的 showcase/examples，playground 可以导入本包导出的任何内容。

本包只需声明该目录一次：在 `astryx.integration.mjs` 中设置 `templates: './blocks'`，并在 `package.json` 的 `files` 列表中包含 `"blocks"`。新演示只需添加其 block 配对。

演示如何到达组件页面：**`exampleFor: '<Component>'`（或 `alsoExampleFor`）才是挂载 block 的机制**——页面会渲染归属于该组件的每个 block，无论 block 叫什么名字。block 的 `name` 是演示的显示名称；组件文档示例的 `labels` 是 CLI 片段标题。两者是相互独立的机制。

新演示请遵循以下约定：

- 让 block 描述符的 `name` 与组件文档示例的 `label` 相同，这样代码片段及其可运行演示会被视为同一组文档内容（`example-coverage` 报告以此命名约定为键——它不是 docsite 挂载演示的方式）。
- 恰好有一个归属 block 设置 `isShowcase: true`（主视觉演示——按惯例是第一个示例）。
- `displayName` 和 `description` 是 docsite 构建的必需项；为图库设置 `componentsUsed` 和 `aspectRatio`。

没有对应 block 的文档示例仅作为 CLI/代码片段存在——docsite 页面的演示完全来自 blocks。注意，反过来并不能仅凭名称推断：一个示例标签没有_同名_ block，本身并不意味演示缺失，因为组件可能以其他名称渲染演示（若干 Core 组件就是如此）。`example-coverage` docsite 测试输出会报告该配对的两侧；它是一份_报告_，不是门禁——Core 也有同样的非保证，而配对是否应作为 CI 门禁是全仓库尚未决定的问题。

> 注意：`astryx integration add template` 会为未声明任何模板根的包搭建 `./templates` 根目录。请改为显式声明 `templates: './blocks'`，与 charts 和 richtext 保持一致；统一这两种约定是仓库中待定的决策。

## 为什么没有稳定版本？

`package.json` 保留 `"private": true` 以及 `"astryx": { "canaryOnly": true }` 标记。发布工作流的稳定版（`latest`）任务会跳过 private 和 `canaryOnly` 包，而 canary 任务仅在其临时 CI 检出中移除 `private`（绝不在 git 中移除）以发布 `@canary` 标签。已提交的 `private: true` 是 npm 的硬性保证，确保永远不会发生稳定版发布——**请勿移除它。**
