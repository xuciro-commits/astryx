<!-- SYNC CONTRACT: Architecture changes require documentation updates. -->

<div align="center">

<img src="https://lookaside.facebook.com/assets/astryx/Astryx-Banner.png" alt="Astryx" width="100%" />

# Astryx

一套完全可定制的开源设计系统，为当下的构建方式而生：<br/>由人以及与其并肩工作的智能体共同构建。

**目前处于 Beta 阶段** · 基于 [React 19+](https://react.dev) 与 [StyleX](https://stylexjs.com)

[![npm version](https://img.shields.io/npm/v/@astryxdesign/core?label=npm&color=cb3837&logo=npm)](https://www.npmjs.com/package/@astryxdesign/core)
[![license MIT](https://img.shields.io/npm/l/@astryxdesign/core?color=blue)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/meta/astryx/wiki/Contributing)

[![Docs](https://img.shields.io/badge/Docs-astryx.atmeta.com-6741d9?logo=readthedocs&logoColor=white)](https://astryx.atmeta.com)
[![Storybook](https://img.shields.io/badge/Storybook-live-ff4785?logo=storybook&logoColor=white)](https://astryx.atmeta.com/storybook/)
[![Sandbox](https://img.shields.io/badge/Sandbox-playground-A9792B)](https://astryx.atmeta.com/sandbox/)

**[文档](https://astryx.atmeta.com)** · **[Storybook](https://astryx.atmeta.com/storybook/)** · **[沙盒](https://astryx.atmeta.com/sandbox/)** · **[参与贡献](https://github.com/meta/astryx/wiki/Contributing)** · **[Discord](https://discord.com/invite/XnsUcFykEP)**

</div>

## 概览

Astryx 是一套在 Meta 内部成长了八年的开源设计系统，现已成为公司内使用最广泛、规模最大的设计系统，支撑着 13,000 多个应用，并由每天使用它的工程师、设计师和产品团队共同塑造。

它提供 150 多个无障碍组件、品牌级主题定制、深色模式、开箱即用的模板以及 CLI，并将这些能力整合为一套连贯的系统。你可以直接导入预构建的 CSS，使用带类型的 React 组件——无需构建插件，也无需引入新的样式库——人和 AI 助手都能用同一套工具进行构建。

**Astryx 的独特之处：**

- **开放的内部实现。** 组件在设计上支持任意层级的组合，而不是被封闭的顶层 API 锁住。你需要的构建模块会直接导出；当需要更深入地定制时，swizzle 可以将组件的完整源码弹出到你的项目中，由你完全掌控。
- **不锁定样式方案。** Astryx 使用 StyleX 编写样式，但这对使用者是透明的。你可以用 `className` 配合 Tailwind、CSS Modules 或普通 CSS 来覆盖样式——沿用项目现有的方案即可。
- **无需包裹即可定制。** 主题就是一组 CSS 自定义属性覆盖，设计师无需分叉或包裹组件源码，就能让 Astryx 呈现鲜明的品牌风格。
- **为人与智能体而构建。** API、文档和 CLI 一同设计，让人和 AI 助手基于同一份参考，以相同的方式构建。

## 快速开始

Astryx 需要 **React 19** 或更高版本（`react` 和 `react-dom` 是 `@astryxdesign/core` 的 peer dependencies）。

安装 Astryx、一个主题及其 peer dependencies：

```bash
# npm
npm install @astryxdesign/core @astryxdesign/theme-neutral @stylexjs/stylex
npm install -D @astryxdesign/cli

# pnpm
pnpm add @astryxdesign/core @astryxdesign/theme-neutral @stylexjs/stylex
pnpm add -D @astryxdesign/cli

# yarn
yarn add @astryxdesign/core @astryxdesign/theme-neutral @stylexjs/stylex
yarn add -D @astryxdesign/cli
```

你也可以在电脑上全局安装一次 CLI，这样 `astryx` 能在任意文件夹中使用，每个编码智能体也都能了解 Astryx；在项目内，它仍会运行项目自身的版本：

```bash
npm i -g @astryxdesign/cli
```

项目安装、全局安装，还是两者都要？`astryx docs global/project-global-or-both` 会比较这几种方式（推荐两者都要），`astryx docs global` 则解释全局模式的工作方式。

最简单的配置只需几行 CSS 导入加一个主题 Provider——无需构建插件，也无需 PostCSS 或 Babel 配置。完整指南（Next.js、Tailwind、Vite 和 CDN）见 **[`@astryxdesign/core` README](packages/core/README.md#quick-start)**。

为了稳定地使用 CLI，请在 `package.json` 中添加一个脚本：

```json
"scripts": {
  "astryx": "node node_modules/@astryxdesign/cli/clients/cli/bin/astryx.mjs"
}
```

然后通过 `npm run astryx -- component --list` 使用它。这样可避免 AI 助手或新开发者直接调用 CLI 时出现路径错误。

## 软件包

| 软件包                                     | 说明                                                                                     | README                             |
| ------------------------------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------- |
| [`@astryxdesign/core`](packages/core)      | 组件、主题系统与工具函数                                                                 | [README](packages/core/README.md)  |
| [`@astryxdesign/cli`](packages/cli)        | CLI 工具：组件文档、模板、脚手架、主题与 codemods                                        | [README](packages/cli/README.md)   |
| [`@astryxdesign/build`](packages/build)    | 用于 StyleX 源码构建的构建插件                                                           | [README](packages/build/README.md) |
| [`@astryxdesign/theme-*`](packages/themes) | 七套开箱即用、完全可定制的主题（neutral、butter、chocolate、matcha、stone、gothic、y2k） | [README](packages/themes)          |

> `@astryxdesign/lab`（实验性组件）仅供内部 Storybook 和沙盒使用，不发布到 npm。`@astryxdesign/vega`（Vega/Vega-Lite 图表包装器）和 `@astryxdesign/charts`（图表组件）仅以 `@canary` dist-tag 发布到 npm——目前还没有稳定版本。

## 原则

这些是 Astryx 对使用它构建产品的人所作出的承诺。

- **引导优于强制。** 组件提供的是能力，而不是与你对抗的护栏。设计观点存在于文档和示例中——只要你传入某个值，组件就会渲染它。
- **强大且成文的约定。** 每个组件都遵循相同的命名、属性和组合规则，并且都有详尽文档——因此学会几个组件后，其余组件也会感到熟悉，人和 AI 都能预判陌生组件的行为。
- **人与 AI 共用一套系统。** API、约定、文档和 CLI 一同设计，让人和 AI 助手以相同方式构建。每一项让 Astryx 对 AI 更友好的改动，也让它对人更友好。
- **以度量赢得信任。** 我们通过测试来验证约定，而不是凭空断言；对结论保持开放，并在新情况证明其错误时重新审视。

## 架构

### 基础

构建视觉统一、无障碍界面的基础要素：排版、色彩、布局和无障碍。

### 组件

一个包含 150 多个可复用 UI 构建模块的组件库，提供完整的 TypeScript 支持。

### 模式

经过实践检验的设计方案，覆盖常见交互与工作流：表格页面、详情页布局、表单向导、导航模式、数据录入流程。

## 项目结构

| 目录        | 用途                                       |
| ----------- | ------------------------------------------ |
| `apps/`     | 示例应用、文档站点和 Storybook             |
| `packages/` | 已发布的软件包：core、cli、build、themes   |
| `internal/` | 内部工具：测试工具、eslint 插件、vibe 测试 |

## 参与贡献

我们欢迎贡献！完整指南见 **[CONTRIBUTING.md](CONTRIBUTING.md)**。

有问题，或希望在 PR 上获得帮助？来
**[Discord](https://discord.com/invite/XnsUcFykEP)** 找我们。

我们的约定和评审细则位于
[贡献 Wiki](https://github.com/meta/astryx/wiki/Contributing)——
包括 [API 约定](https://github.com/meta/astryx/wiki/API-Conventions)、
[设计约定](https://github.com/meta/astryx/wiki/Design-Conventions)、
[组件生命周期](https://github.com/meta/astryx/wiki/Component-Lifecycle)、
[贡献模板](https://github.com/meta/astryx/wiki/Contributing-Templates)
以及 [博客评审细则](https://github.com/meta/astryx/wiki/Blog-Review-Rubric#three-required-scored-criteria)。在提交 PR 前请阅读相关细则。

贡献者快速开始：本仓库要求 **Node 22+（活跃 LTS 系列）**
和 **pnpm 11**。可直接安装 pnpm，或启用一次
[Corepack](https://nodejs.org/api/corepack.html)，让锁定的 pnpm 版本自动安装：

```bash
corepack enable
pnpm install
```

如果缺少 `corepack`，请直接安装 pnpm，或手动安装 Corepack；
参见 [CONTRIBUTING.md](CONTRIBUTING.md#troubleshooting) 中的故障排查说明。

Theme Showcase DOM 测试使用根目录的 `ui` 项目共享 DOM 与 StyleX 测试环境。请在仓库根目录运行
`pnpm exec vitest run --project ui apps/docsite/src/__tests__/theme-showcase/`。

## 许可证

MIT
