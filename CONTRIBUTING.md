# 为 Astryx 做贡献

有关完整的贡献流程 — 我们接受什么、如何提议新组件以及 API 决策如何做出 — 请阅读 **[贡献 wiki](https://github.com/meta/astryx/wiki/Contributing)**。

关键页面：

- **[Pull request 意图](docs/contributing/pull-requests.md)** — 选择一个主要意图、其证据门槛，以及匹配的 PR 模板
- **[API 约定指南](docs/contributing/api-conventions.md)** — 与当前所有者记录关联的实用命名、组合、样式、提议和审查指导
- **[设计约定](https://github.com/meta/astryx/wiki/Design-Conventions)** — 设计侧标准：token、间距、圆角、层级、字体、颜色、动效和状态表达
- **[规范协议](https://github.com/meta/astryx/wiki/Component-Specification-Protocol)** — 新组件的 9 阶段流程
- **[组件生命周期](https://github.com/meta/astryx/wiki/Component-Lifecycle)** — 组件如何从 lab → core，模板如何从隐藏 → 可见
- **[API 仲裁](https://github.com/meta/astryx/wiki/API-Arbitration)** — 我们如何解决 API 设计问题
- **[贡献模板](https://github.com/meta/astryx/wiki/Contributing-Templates)** — 构建模板/区块以及模板评分标准
- **[博客审查标准](https://github.com/meta/astryx/wiki/Blog-Review-Rubric#three-required-scored-criteria)** — docsite 博客文章如何被审查
- **[借助 AI 贡献](https://github.com/meta/astryx/wiki/Contributing-with-AI-Assistants)** — 安全区域、规范协议以及与 AI 工具协作

本文件涵盖本地开发环境搭建。

---

## 前置条件

### Node.js

Node 版本保存在 `.nvmrc` 中（当前为 24.x 系列）。CI 通过 `node-version-file` 读取同一个文件，因此本地和 CI 永远不会漂移。不要在其他任何地方声明版本。

**通过 nvm（推荐）：**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.zshrc
nvm install   # no argument — reads .nvmrc
```

`fnm` 和 `mise` 也会读取 `.nvmrc`。`asdf` 不会；它的 `.tool-versions` 被 git 忽略，正是为了防止它成为竞争性的事实来源。

**通过 nodejs.org：**
从 https://nodejs.org 下载并安装

### pnpm

Astryx 使用 [pnpm](https://pnpm.io/) 作为包管理器（在 `package.json` 的 `packageManager` 字段中声明）。你可以直接安装 pnpm：

```bash
# Via npm
npm install -g pnpm@11

# Via Homebrew (macOS)
brew install pnpm

# Via standalone installer (no npm or Node.js required)
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=11.10.0 sh -

# Via GitHub releases (single binary, no dependencies)
# https://github.com/pnpm/pnpm/releases/latest
```

或者使用 [Corepack](https://nodejs.org/api/corepack.html) 安装 Astryx 固定的确切 pnpm 版本：

```bash
corepack enable
```

Corepack 随 Node.js 22 和 24 一起提供，但当前的 Node.js 25+ 版本不再内置它。如果 `corepack` 缺失且你希望走自动固定版本的路径，请先手动安装 Corepack：

```bash
npm install -g corepack
corepack enable
```

验证安装：

```bash
node --version   # v24.x.x
pnpm --version   # 11.x.x
```

## 开始使用

```bash
# Clone without downloading historical file contents up front
git clone --filter=blob:none https://github.com/meta/astryx.git
cd astryx

# Install dependencies
pnpm install

# Start Storybook for component development
cd apps/storybook
pnpm dev
```

### 运行 Storybook

Storybook 会将每个工作区包解析到其 `src/` 目录并自行编译，因此全新克隆的仓库无需先构建 — `pnpm install` 之后直接 `pnpm dev` 即可。

```bash
cd apps/storybook
pnpm dev
```

Storybook 将在 http://localhost:6006 打开，包含：

- **主题切换器** - 在基础 token（None）与捆绑的 Neutral、Butter、Chocolate、Matcha、Stone、Gothic 和 Y2K 主题之间切换，外加生成的 Probe 测试夹具
- **模式切换器** - 在浅色和深色模式之间切换
- **组件故事** - 可交互的组件示例

**如果你修改了 `@astryxdesign/core`：** 源码改动无需重新构建或重启即可更新。Storybook 和 docsite 还会监视 `packages/core/locales/*.json`，重新生成紧凑的运行时目录，并在语言环境编辑后重新加载已导入的消息。

### 运行文档站点

文档站点（`apps/docsite/`）是一个 Next.js 应用，在 https://astryx.atmeta.com 渲染组件文档。要在本地运行：

```bash
# First time only — build the workspace packages it depends on
pnpm build

# Start the doc site (Next dev server, defaults to localhost:3000)
pnpm docsite
```

`pnpm docsite` 是 `pnpm -F @astryxdesign/docsite dev` 的薄别名，它会在启动 Next 之前运行文档站点的 `generate` 步骤（主题 CSS、注册表、playground 作用域）。

> **注意：** `pnpm docs` 与 `npm docs` 内置命令冲突，后者会尝试在浏览器中打开包的 npm 页面。请改用 `pnpm docsite`。

## 项目结构

```
astryx/
├── apps/
│   ├── storybook/      # Component playground (localhost:6006)
│   ├── docsite/        # Doc site (localhost:3000)
│   └── sandbox/        # Development testing
│
├── packages/
│   ├── core/           # Core components (Button, Input, etc.)
│   ├── cli/            # CLI tooling (astryx)
│   ├── lab/            # Experimental components (not yet stable)
│   └── themes/         # Theme presets (neutral, stone, y2k, and more)
│
└── internal/           # Internal tooling (not published)
    └── test-utils/     # Shared test helpers
```

## 开发工作流

### 常用命令

| 命令              | 描述                                         |
| ----------------- | -------------------------------------------- |
| `pnpm install`    | 安装所有依赖                                 |
| `pnpm dev`        | 启动 Storybook（`pnpm storybook` 的别名）    |
| `pnpm build`      | 构建所有包                                   |
| `pnpm test`       | 运行所有测试                                 |
| `pnpm test:watch` | 以监视模式运行测试                           |
| `pnpm typecheck`  | 对每个包进行类型检查（在 `pnpm build` 之后） |
| `pnpm storybook`  | 在 localhost:6006 启动 Storybook             |
| `pnpm lint`       | 对所有包执行 lint                            |

## 添加新组件

组件使用**同目录测试** — 测试文件与组件放在一起。

### 1. 创建组件目录

```bash
mkdir -p packages/core/src/MyComponent
```

### 2. 创建组件文件

```
packages/core/src/MyComponent/
├── MyComponent.tsx        # Component implementation
├── MyComponent.test.tsx   # Unit tests (colocated)
├── MyComponent.doc.mjs    # Component doc (props, features, examples)
└── index.ts               # Public exports
```

故事（Stories）**不**与组件同目录 — 它们位于 Storybook 应用中：

```
apps/storybook/stories/MyComponent.stories.tsx
```

### 3. 组件模板

````tsx
// MyComponent.tsx
import type {HTMLAttributes, ReactNode, Ref} from 'react';

export interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
  /** Ref forwarded to the root element */
  ref?: Ref<HTMLDivElement>;
  /** Description for AI-assisted development */
  children: ReactNode;
}

/**
 * Brief description of the component.
 *
 * @example
 * ```
 * <MyComponent>Hello</MyComponent>
 * ```
 */
export function MyComponent({children, ref, ...props}: MyComponentProps) {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}

MyComponent.displayName = 'MyComponent';
````

### 4. 测试模板

```tsx
// MyComponent.test.tsx
import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MyComponent} from './MyComponent';

describe('MyComponent', () => {
  it('renders children', () => {
    render(<MyComponent>Hello</MyComponent>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### 5. 故事模板

故事位于 Storybook 应用中，而不是组件旁边 —
`apps/storybook/.storybook/main.ts` 通过
`'../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'` 发现它们，因此 `packages/` 下任何位置的 story 都不会被拾取。通过其发布入口点导入组件，并将其标题置于 `Core/` 下（对于 `@astryxdesign/lab` 则置于 `Lab/` 下）。

```tsx
// apps/storybook/stories/MyComponent.stories.tsx
import type {Meta, StoryObj} from '@storybook/react';
import {MyComponent} from '@astryxdesign/core/MyComponent';

const meta = {
  title: 'Core/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Hello World',
  },
};
```

### 6. 从包中导出

```ts
// packages/core/src/index.ts
export * from './MyComponent';
```

> **注意：** 不要手动编辑 `packages/core/package.json` 中的 `"exports"` 字段。
> 它由 `scripts/sync-exports.js` 从 `src/` 目录自动生成，并在改动落到 `main` 时自动提交。如果你需要验证组件会被包含，请运行 `pnpm sync:exports:check`。

### 面向用户的字符串与文本方向

组件通过 `useTranslator()` 读取面向用户的字符串，而不是硬编码它们：

```tsx
import {useTranslator} from '@astryxdesign/core/i18n';

function SaveButton() {
  const t = useTranslator();
  return <button>{t('@astryx.actions.save')}</button>;
}
```

Astryx 自身的字符串位于 `packages/core/locales/en.json`。`@astryx/no-hardcoded-i18n-string` ESLint 规则会拒绝硬编码字符串。对于默认值为已翻译字符串的 prop，给该 prop 起别名并在函数体里解析：解构 `label: labelFromProps`，然后 `const label = labelFromProps ?? t('@astryx.<component>.<key>')`。

响应文本方向的组件从 DOM 解析方向，而不是在渲染时用 JavaScript 读取。按以下顺序选择能起作用的最轻量工具：

1. **CSS 逻辑属性。** 使用 `insetInlineStart`、`paddingInlineEnd`、`marginInline` 等，而不是物理的 `left`/`right`。大多数镜像需求仅此即可：浏览器会根据环境中的 `dir` 翻转。`@astryx/no-physical-properties` ESLint 规则会强制执行此规则。
2. **方向图标：用 CSS 镜像，而不是换名字。** 渲染一个固定的字形，并用共享的 `rtlStyles.mirror` 包装（一个仅在 `[dir="rtl"]` 下应用的 `scaleX(-1)`）。它会通过层叠从祖先 `dir` 翻转，因此在服务端也能工作，不会出现 hydration 闪烁。不要在 JavaScript 中选择 `chevronLeft` 或 `chevronRight`。Pagination、Calendar 和 Carousel 就是这样处理它们的箭头的。

   ```tsx
   import * as stylex from '@stylexjs/stylex';
   import {rtlStyles} from '@astryxdesign/core';

   function NextButton() {
     // One glyph; CSS flips it under RTL. No direction read.
     return (
       <span {...stylex.props(rtlStyles.mirror)}>
         <Icon icon="chevronRight" />
       </span>
     );
   }
   ```

3. **行为：在事件发生时惰性读取 DOM。** 对于 CSS 无法表达的内容（方向键映射、拖拽和滚动计算），在交互时用 `isRtlElement(el)`（一个 `getComputedStyle().direction` 检查）读取方向，绝不要在渲染期间读取。焦点 hook（`useListFocus`、`useGridFocus`、`useTreeFocus`）已经从其容器检测方向，因此方向键会自然翻转；不要向它们传递方向标志。
4. **`useDirection()` context，作为最后手段。** 仅当你需要在渲染期间获得方向值且上述方案都不适用时使用。它是 SSR 安全的，在 provider 之外返回 `'ltr'`（就像 `useTranslator` 的静默回退），但当 provider 的方向与 `<html dir>` 不一致时，它是唯一可能在 hydration 时出现不匹配的路径。没有任何 Astryx 组件在渲染时从 context 读取方向。

### 添加语义图标

仅当某个字形为整个系统共享时，才添加语义图标名称：

1. 将名称添加到 `packages/core/src/Icon/globalIconRegistry.tsx` 中的 `IconName` 类型。
2. 将默认 SVG 添加到 `packages/core/src/Icon/defaultIcons.tsx`。
3. 在 `packages/cli/assets/docs/icons.doc.mjs` 的 Available Names 表格中添加一行。

属于某个组件的字形使用命名空间键（`numberInput:stepperDown`），这样共享的 `IconName` 列表不会增长。在 `defaultIcons` 中以相同的键提供其回退，以便在没有主题时该字形仍能渲染。

## 无障碍检查清单

每个新组件 — 以及对交互式组件的任何改动 — 都必须在审查前通过 **[无障碍检查清单](https://github.com/meta/astryx/wiki/Accessibility-Checklist)**（wiki）。该检查清单位于 wiki 上，以便无障碍专家无需代码 PR 即可完善它；审查者会以此阻塞（它是 [组件审计标准](https://github.com/meta/astryx/wiki/Component-Audit-Rubric) 上的 `A1`–`A16`），并且是从 lab → core 提升的硬性要求（见 `packages/lab/README.md`）。

有两条仓库侧规则值得在此重申：

- 组合共享原语 — `VisuallyHidden`、`useAnnounce`、`useFocusTrap` 以及焦点 hook（`useListFocus`、`useGridFocus`、`useTreeFocus`）— 而不是手工实现等价物。它们实现了 WAI-ARIA APG 模式并且只测试一次；对其中任何一个的定制重写都会被审查拒绝。
- CI 是执行层，而不是检查清单的替代品：`ci.yml` 中的 `pr-a11y` 作业在合并到 `main` 之后、每次发布之前（以及带有 `ci:run-a11y` 标签的 pull request 上）运行 axe 审计，覆盖整个组件表面的完整范围，并且 `useAnnounce` lint 规则会拒绝手工接线的 `aria-live` 区域。axe 只捕获静态的、DOM 层面的问题 — 键盘行为、焦点管理和播报时机正是检查清单和组件单元测试所覆盖的内容。

## 开发 `astryx` CLI

CLI（`packages/cli/`）采用分层结构，使行为、呈现和契约保持可分离：

- **`clients/cli/`** — Commander 程序和每个命令的处理器。处理器是一个*薄包装*：解析标志 → 调用匹配的 `api/` 函数 → 渲染（通过 `jsonOut` 输出 JSON，或通过 `clients/cli/formatters/` 中的格式化工具包输出文本）。
- **`api/`** — 编程 API（`@astryxdesign/cli/api`）。每个命令映射到 `api/<name>/`，其函数返回带类型的 `{ type, data }` 信封。这是行为的真实来源，因此 `astryx --json` 和导入的函数返回相同的数据。
- **`authoring/`** — 纯数据契约（`@astryxdesign/cli/authoring`）：你用来编写对象的 TypeScript 类型（config、integration、codemod 以及 doc-types），以及在加载边界运行的密封 zod 解析器。
- **`foundation/`** — 底层：上层一切构建于其上的横切基础设施 — `{ type, data }` JSON 契约、稳定的 `ERROR_CODES`、发现机制（组件、模板）、集成贡献验证器以及路径安全。它绝不导入 `api/` 或 `clients/`；如果 foundation 需要某个东西，那个东西就属于 foundation。

### CLI 自我记录

每个 CLI 表面都有一个与其描述对象同目录的带类型 `.doc.mjs`，并用来自 `@astryxdesign/cli/authoring` 的 `@type` 标注：

| CLI 表面                                                          | 文档类型                                       | 所在位置                                              |
| ----------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------- |
| 一个 API 函数（hook 或 `api/` 导出）                              | `FunctionDoc`                                  | `api/<name>/<fn>.doc.mjs`                             |
| 一个 CLI 命令                                                     | `CommandDoc`（通过 `fn` 引用其 `FunctionDoc`） | `clients/cli/commands/<name>.doc.mjs`                 |
| 一个编写对象（config、integration、codemod、doc-types、响应信封） | `SchemaDoc`                                    | 紧邻 schema（`authoring/**`、`foundation/response/`） |
| 一个封闭词汇表（错误码、响应类型）                                | `EnumDoc`                                      | `foundation/response/`                                |
| 一个长篇主题（tokens、principles、theming 等）                    | `ReferenceDoc`                                 | `assets/docs/<topic>.doc.mjs`                         |

这些文档不是自由格式。`parseDoc` 在加载时验证每一个，**漂移测试装置**（`packages/cli/test/drift/`）强制它们镜像其真实来源：每个 `CommandDoc` 的 `fn`/args/options 与实时 CLI 匹配，`EnumDoc` 与 `ERROR_CODES` / 清单的响应类型集合完全相等。发生漂移的文档会导致 CI 失败。

### 为你强制执行的内容

上述大多数约定都是机械性的，因此通过检查而非人工审查来保证：

| 规则                                                                                                                    | 执行方式                                                     |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 分层方向成立：`authoring/` 不导入其他层，`foundation/` 绝不导入 `api/` 或 `clients/`，`api/` 绝不导入 `clients/`        | ESLint（`no-restricted-imports`）                            |
| zod 保持密封在 `authoring/` 解析器之后                                                                                  | ESLint（`no-restricted-imports`）                            |
| 命令通过 `defineCommand` 注册，绝不直接注册到 Commander                                                                 | ESLint（`no-restricted-syntax`）                             |
| 命令处理器不得访问环境：不得导入文件系统、网络、子进程、Project 或发现模块（INV22）                                     | `pnpm check:cli-structure`                                   |
| API 模块（适配器或仅被适配器导入的辅助模块除外）不得访问环境（INV21）                                                   | `pnpm check:cli-structure`                                   |
| 命令处理器不得使用 `.padEnd()`、`.padStart()`、`.repeat()` 或 `new Block()` 构建文本（INV23、FR3）                      | ESLint（`no-restricted-syntax`）+ `pnpm check:cli-structure` |
| 每个可执行的 `CommandDoc` `fn` 必须命名一个从 `api/index.mjs` 导出的函数（FR1）                                         | `pnpm check:cli-structure`                                   |
| 从 `api/index.mjs` 导出的每个函数都必须有一个 `name` 匹配的 `FunctionDoc`（FR2）                                        | `pnpm check:cli-structure`                                   |
| 每种 doc-type 都随附 `type.ts` + `parse.mjs` + `<kind>.doc.mjs`，重新导出其解析器，并出现在 `parseDoc` 的 `@returns` 中 | `pnpm check:cli-structure`                                   |
| 每个 `api/<name>/` 都随附其 typedefs、一个 `FunctionDoc` 和一个测试                                                     | `pnpm check:cli-structure`                                   |
| 每个 `CommandDoc`/`EnumDoc` 都与实时 CLI 匹配                                                                           | 漂移测试装置                                                 |

你永远不用手写 `.d.mts` 声明。`packages/cli/scripts/sync-api-types.mjs` 从 `.mjs` JSDoc 为 `api/` 和 `authoring/` 两者生成它们 — 被 git 忽略，在 `prepack` 时重新生成，并标记 `@generated`。编辑 JSDoc 并运行 `pnpm -F @astryxdesign/cli sync:api-types`。

这一点很重要，因为手写声明会*遮蔽*其 `.mjs` 中的 JSDoc，而且无论哪种方式，它都可能在发布后说谎：缺少声明会让严格的消费者将解析器解析为 `any`（仅在打包时以 TS7016 暴露，因为本地类型检查在 `checkJs` 下运行，从不覆盖打包后的表面），而过时的 `parseDoc` 联合类型会在仍然编译的情况下悄悄从发布的类型中丢弃三种文档类型。生成消除了这两者。仍然手写的唯一声明是 `authoring/index.d.ts`，即精选的公共桶导出。

### 添加命令

在处理器*之前*编写文档：`defineCommand` 从 `CommandDoc` 构建 Commander 命令，因此处理器需要它先存在。

1. 在 `api/<name>/` 下添加行为，并带上同目录的 `<name>.type.mjs`（`Options` + `{ type, data }` 响应 typedefs — 形状的真实来源）和一个测试。
2. 编写文档 — 在 `api/<name>/<fn>.doc.mjs` 放一个 `FunctionDoc`，在 `clients/cli/commands/<name>.doc.mjs` 放一个 `CommandDoc`。复制 `blog` 这一对作为模板。
3. 在 `clients/cli/commands/<name>.mjs` 中编写薄处理器，用 `defineCommand(program, <name>Command, {fn: <name>Fn, action})` 注册它，使 `--help` 和清单来自文档。从 `clients/cli/index.mjs` 调用其 `register<Name>`。
4. 运行下面的检查。漂移测试装置会捕获与实时命令不一致的文档，`check:cli-structure` 会捕获缺失的 typedef、文档或测试。

### 测试 CLI

```bash
# Run the CLI locally (no build needed)
node packages/cli/clients/cli/bin/astryx.mjs --help

# Validate every colocated doc parses + mirrors its source of truth
pnpm -F @astryxdesign/cli test              # includes the drift suite
pnpm -F @astryxdesign/cli typecheck:authoring

# Structural conventions (doc-type quartets, api/ leaf contents). Also runs as
# part of `pnpm lint` via check:repo, and in the pre-commit hook.
pnpm check:cli-structure

# Keep the generated CLI README tables (commands, error codes, response types)
# in sync with the manifest + EnumDocs. After an intended change, refresh + review:
pnpm -F @astryxdesign/cli readme            # regenerate the tables
pnpm -F @astryxdesign/cli readme:check      # CI gate: fails on any un-refreshed drift
```

## 测试

### 运行测试

```bash
# All tests
pnpm test

# Watch mode
pnpm test:watch

# Specific package
pnpm -F @astryxdesign/core test

# One Vitest project, as CI runs it (CI shards each across legs)
pnpm test:ui            # the ui project, without the FR23 benchmark
pnpm test:ui:isolated   # the FR23 benchmark alone, as test-ui leg 1 runs it
pnpm test:node

# With coverage
pnpm test:coverage

# Accessibility and RTL audits over the built Storybook (see below)
pnpm a11y:audit
pnpm rtl:audit
```

### 测试结构

测试与组件同目录：

```
src/Button/
├── Button.tsx
└── Button.test.tsx   # Tests live here
```

### 测试放在哪里，以及 CI 如何找到它们

CI 按文件名收集测试，绝不从测试文件列表收集，因此新增测试无需编辑 `.github/workflows/`。将测试放在其类型被收集的位置，CI 就会拾取它：

| 类型                        | 放置位置                                                                                                          | 收集方式                                                                  | CI 作业                                                                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 单元和集成（jsdom 或 Node） | `*.test.ts(x)` / `*.test.mjs`，位于代码旁，且路径在 `vitest.config.ts` 的 `ui` 或 `node` 项目包含范围内           | `ui` 和 `node` Vitest 项目                                                | `test-ui`、`test-node`（分片）                                                                                                 |
| 浏览器无障碍或引擎行为      | `*.a11y.chromium.spec.ts`（Chromium）或 `*.a11y.browser.spec.ts`（Chromium 和 WebKit），位于 `packages/*/src/` 下 | `pnpm test:a11y-contract`；pull request 运行 `pnpm test:a11y-contract:pr` | `pr-a11y`（带 `ci:run-a11y`）；在 touched-components 检查中最多四个变更的 spec 文件；发布检查的 `a11y-contracts` 中的所有 spec |
| 视觉回归                    | 一个 Storybook 故事                                                                                               | 视觉计划                                                                  | `pr-visual`                                                                                                                    |

当 PR 更改 spec、其组件文件夹或它命名所指的组件时（`ChatSendButton.a11y.chromium.spec.ts`
属于 `core/ChatSendButton`），该浏览器 spec 会在 pull request 上运行。更改后的知识记录（`<Name>.spec.md`）
既不计入文件夹也不计入路径 token，因为没有浏览器会渲染它。
spec 头注释中的路由行会改变这一点，运行器拒绝任何其他值：

```ts
// @pr-a11y always                 every PR that changes components
// @pr-a11y scope core/Selector ^apps/storybook/stories/ComboboxA11y
//                                 also when one token matches: a component, or
//                                 a regular expression over changed paths
// @pr-a11y audit DateInput        only on a "[Component Audit] DateInput:" PR
// @pr-a11y release-only           never on a PR; the release check runs it
```

这些路由在 pull request 运行无障碍所有者时适用，而只有在带有 `ci:run-a11y` 标签时才会运行；`main` 和发布检查会运行每个 spec。没有该标签时，touched-components 检查仍会按这些相同的路由运行 pull request 添加或修改的最多四个 spec 文件，因此变更的 `audit` 或 `release-only` spec 会等待。`pnpm test:a11y-contract:pr origin/main --dry-run` 会打印从你的分支发起的 pull request 将运行什么（组件 token 需要 CI 的 `analysis.json`；没有它时运行器会说明并排除那些 spec）。spec 将其回执写入 `test-results/<name>/` 下，或者对于组件审计，写入顶层的 `<name>-audit-evidence/` 文件夹；CI 会将它们连同选择结果和报告一起上传为一个 `pr-a11y-evidence-<sha>` 产物。如果组件审计 pull request 的组件有审计 spec，该组件自己的 axe 检查也会运行；必须等待打开的对话框或菜单、评估不同组件集，或没有审计 spec 的审计，会在 `.github/a11y-audit-axe.json` 中有条目。

### 无障碍审计

合并到 `main`（在一批提交的最新提交处检查）、每次发布检查，以及带有 `ci:run-a11y` 标签且触及组件的 PR 都会运行 axe-core 审计（`pr-a11y` CI 作业）；在 PR 上，它覆盖变更组件的 Storybook 故事。当发现未列入签入基线 `.github/a11y-baseline.json` 的违规时，该作业会**失败**。违规以 `Component::Story::rule-id` 为键，因此无关的标记变动不会使基线条目失效。

要在本地复现并修复失败：

```bash
# One-time setup
pnpm storybook:build
npx playwright install chromium

# Audit specific components against the baseline (what CI does)
pnpm a11y:audit -- --components Button,Dialog
```

尽可能修复违规。如果它是已知的、有意的例外，请将其添加到基线（作用域限定为受影响的组件，并预期审查者会询问原因）：

```bash
pnpm a11y:baseline -- --components Button,Dialog
```

当审计报告基线条目为“resolved”时，从 `.github/a11y-baseline.json` 中删除它们 — 基线应只随时间缩小。

> **范围说明：** axe-core 仅自动化 WCAG 的一部分（大约三分之一的成功标准）。`pr-a11y` 作业变绿并不意味着组件可访问 — 键盘流程、焦点顺序、屏幕阅读器语义以及上下文中的对比度仍需要手动检查。

### 无障碍 spec 测试契约

axe 会发现广泛的标记违规；但它不知道 switch 必须能够重新关闭。位于 [`internal/a11y-spec/`](internal/a11y-spec/README.md) 的可复用**无障碍 spec 测试**将一个已采纳的 WAI-ARIA APG 模式编码为可追溯标准的契约，组件绑定到它。每个期望都指明其来源的 WCAG 成功标准或 APG 要求、能够观察它的证据层，以及它是否作为门禁。

它们在两条通道中运行，这种拆分正是要点：jsdom 在 `pnpm test` 中证明 DOM 层事实，而所有需要计算无障碍树、真实焦点或真实激活的内容在那里报告为 `unrun`，并在 Chromium 中证明。

```bash
# One-time setup
pnpm storybook:build
npx playwright install chromium

pnpm test:a11y-contract      # the Chromium lane, every spec (the release check)
pnpm test:a11y-contract:pr origin/main --dry-run   # what a PR from this branch runs (drop --dry-run to run it)
```

在新组件中采用这一模式，意味着要绑定到现有契约，而不是复制它的断言——参见该包的 README 以及
[`docs/specs/AST-020`](docs/specs/AST-020/spec.md) /
[`docs/specs/AST-021`](docs/specs/AST-021/spec.md)。

### RTL 审核

同样的事件还会运行 RTL 审核（`pr-rtl`）；在带标签的 PR 上，它会像 `pr-a11y` 一样限定在发生变更的组件范围内。它采用软门禁——发现的问题会显示在任务摘要中，但不会阻断。可在本地复现：`pnpm rtl:audit -- --filter Avatar`
（`--` 很重要：`pnpm -F` 本身就是 `--filter`）。报告会将每个纳入范围的组件归类为 **已测量**、**已验证不适用** 或 **覆盖缺口**；无法解释的全部“不适用”结果并不等于干净的 RTL 结果。发布检查的不带过滤运行会把同一契约应用到现有全部组件清单，而带标签的 PR 则把它应用到新增和变更的组件。参见 `apps/storybook/rtl-audit/README.md`。

### 模态框关闭可见性守卫

同一个 `pr-a11y` 任务还会运行一个额外的 Chromium 探测
（`.github/scripts/modal-close-visibility.js`，或针对已构建的 Storybook 运行 `pnpm guard:modal-close`）。它会打开脚本顶部列表中每个模态框 `<dialog>` 表面，关闭它，并在 `close()` 运行的那一刻对话框的计算 `display` 为 `none` 时失败。

一个在仍处于 `:modal` 时就被隐藏的对话框会吞掉页面上的所有点击，而浏览器并没有义务在 `close()` 最终运行时解除这种状态——Safari
26.1 就没有（#4290）。这个顺序来自 CSS 过渡，因此 jsdom 看不到它，单元测试套件无论哪种情况都会通过。当某个组件会延迟关闭 `<dialog>` 时，请在此处添加一个目标。

### 禁用状态悬停守卫

禁用元素绝不能绘制悬停状态：在所有引擎中，`:hover` 都会持续匹配禁用控件，因此为启用状态元素编写的悬停样式仍会在指针下被绘制。用 `:hover:where(:not(:disabled,[aria-disabled="true"]))` 守卫每一处作用于自身的 `:hover`——`:where()` 不增加特异性，因此该规则的权重与之前相同。`@astryx/no-hover-on-disabled`
lint 规则（可自动修复）在编写时强制执行这一点；`pnpm guard:disabled-hover
--storybook-dir apps/storybook/dist` 会在 Chromium 中扫描已构建的 Storybook，并对任何在强制 `:hover` 下绘制发生变化的禁用元素报错。

### 禁用状态光标守卫

禁用控件不得以交互式光标回应指针：光标是指针用户在决定点击之前获得的唯一可操作提示。请把每一处 `cursor` 都写成让禁用状态收回它的形式——
`cursor: {default: 'pointer', ':is(:disabled,[aria-disabled="true"])': 'default'}`
——包括 `disabled` 样式里的扁平 `cursor`，因为 StyleX 一次只合并一个属性，后一个声明会连同值一起替换前一个声明的条件。用 `default` 而不是 `not-allowed`：被 `pointer-events: none` 封住的禁用控件会显示其祖先所显示的内容，因此处处统一一个光标，胜过只能在一部分控件上绘制的更强光标。`@astryx/disabled-cursor` lint 规则（可自动修复）
在编写时强制执行这一点；`pnpm guard:disabled-cursor --storybook-dir
apps/storybook/dist` 会在 Chromium 中对已构建 Storybook 里的每个禁用元素做命中测试，并对任何其他光标报错。

### Playground 预览隔离

docsite 的 playground 在一个具有不透明来源（opaque origin）的沙箱 iframe 中运行用户编写的代码，仅通过经 nonce 认证的 MessagePort 握手与页面相连
（`apps/docsite/src/app/playground/previewChannel.ts`）。`docsite-browser` 任务中的浏览器契约（必需的 `docsite-test`
检查也会加入其中）会在生产构建上于 Chromium 中验证这一边界：重新加载的预览文档会用当前代码和主题恢复，而被预览代码导航过的文档则收不到任何内容。沙箱只存在于生产构建中（`next dev` 无法将其资源提供给不透明来源），因此这些测试规范需要先构建：

```bash
pnpm build                                   # workspace packages the docsite imports
pnpm -F @astryxdesign/docsite build
npx playwright install chromium

pnpm test:docsite-browser
```

## 版本管理与发布

我们使用 [Changesets](https://github.com/changesets/changesets) 进行版本管理，并在其上叠加了一层轻量的 Astryx 封装，使变更日志保持分类、注明贡献者，并与我们 1.0 之前的约定保持一致。

### 添加 Changeset

当你做出应当发布的变更时：

```bash
pnpm changeset:new
```

这个封装会：

1. **从 git diff 中检测你更改了哪些包**并预先选中它们——无需手动枚举 frontmatter。
2. **询问类别**（`breaking`、`experimental`、`component`、`feat`、`fix`、`perf`、`docs`、`chore`）——它决定变更日志分组和 1.0 之前的 semver 版本提升。
3. **记录贡献者**——默认使用你的 `gh`/git 身份，因此署名在编写时就记录下来（而不是从发布机器人的提交中重建）。
4. **根据类别推导 semver 提升**——`[breaking]` 变更提升 minor；`[experimental]` 和所有其他类别提升 patch（见下文）。

仅当最新稳定版本的有效使用者必须更改源代码或配置才能让受支持的功能契约继续工作，或失去稳定的公共表面时，才选择 `[breaking]`。仅改变现有内容的外观、间距、排版、布局样式或视觉默认值的变更，即使像素发生变化，也使用 `[fix]` 或 `[feat]`。其发布说明应写明新旧外观，以及在存在受支持的规避方式时如何保留旧外观。

它会写入一个普通的 `.changeset/<id>.md`——随你的 PR 一起提交。正文如下：

```md
---
'@astryxdesign/core': patch
---

[fix] Spinner inherits the variant foreground on themed buttons (#2717)
@yourhandle
```

对于非交互式使用，也可以通过标志传入所有内容：

```bash
pnpm changeset:new --category fix --summary "…" --pr 2717 --contributor yourhandle
```

> 裸的 `pnpm changeset` CLI 仍然可用，但你必须手动遵循正文约定（第一行
> `[category]` + 一行 `@handle`）。CI
> （`pnpm check:changesets`）会拒绝缺少类别或贡献者的 changeset，或 bump 与类别不匹配的 changeset（`[breaking]` 必须是
> `minor`；`[experimental]` 和所有其他类别必须是
> `patch`），或在 0.x 期间声明 `major` 提升的 changeset。

#### CI 何时要求提供 Changeset

每个拉取请求都会运行 `scripts/release/changeset-coverage.mjs`，它与发布覆盖审计在发布提交上运行的是同一个分类器。当拉取请求更改了已发布包交付的某些内容，而它新增或编辑的任何
Changeset 都没有点名该包时，检查就会失败：

- 包源代码，例如已发布包的 `packages/*/src`；
- `packages/cli` 下的 CLI 行为和输出（`api`、`clients`、
  `foundation`、`authoring`、`assets`）；
- 随包发布的文档：`packages/cli/assets/docs`、`*.doc.mjs` 以及包的 README；
- 面向使用者的 `package.json` 字段，例如 `exports`、`bin` 以及依赖或 peer 范围。

Story、沙箱、测试、fixture、快照、spec 记录、生成的
CHANGELOG、私有及仅金丝雀（canary）包（`lab`、`charts`、`vega`）、docsite
应用、CI 以及仓库工具都不会到达使用者，因此无需 Changeset。失败信息会指明包和要运行的命令，例如 `pnpm changeset:new --packages @astryxdesign/cli --category docs`。可在本地运行检查：
`node scripts/release/changeset-coverage.mjs pr --base origin/main --explain`。

翻译更新和新增语言无需 Changeset；对英文源消息或键的更改仍然需要。删除已发布的语言导入路径需遵循[破坏性变更政策](docs/specs/AST-017/spec.md)。

同一检查还会将 CLI 的机器可读 id 与最新版本进行比较：响应 `type` 值、响应字段、golden JSON 字段以及 `astryx doctor` 检查 id。删除或重命名已发布的 id 会破坏读取它的脚本。请恢复它，或在 `@astryxdesign/cli`
的 Changeset 中对删除加以分类：一条点名该 id 的 `[breaking]` 条目，或一段以
`Compatibility:` 开头、点名该 id 并说明为什么最新版本的使用者仍可继续工作的文字。请按失败信息打印的方式来命名 id，例如
`themes` 或 `DoctorCheck.fix`。这些响应中的目录值（例如模板 slug 和文档路由）属于数据，可以更改。

### 发布版本

- **main 声明下一个版本。** main 的 `package.json` 文件中固定组的版本即下一个计划发布的版本。在切版之前，负责人可以提高或降低它，但必须严格高于最新稳定版。必需的拉取请求 lint 不会将该声明与稳定版或进行中的切版进行比较。金丝雀发布器只有在存在一个普通的固定组声明高于最新稳定版时才发布，相等时跳过，低于稳定版或声明分裂时失败。受信任的合并回主分支操作不会改动 main 的声明；发布之后由单独的负责人变更声明下一计划。
- **0.x：类别说明变更所需的层级。** `[breaking]`
  Changeset 声明 `minor`，且只有在 main 已声明下一个 minor 时才会被接受。`[experimental]` 和所有其他类别声明 `patch`。
  Changeset 从不选择计划。CI 会拒绝 patch 计划上的 `[breaking]`，也会拒绝会把待处理的破坏性工作搁置的 minor 降为 patch 的 PR。可行路径是通过弃用保持旧用法兼容，或由负责人明确规划 minor。
- 所有可发布包都属于一个 `fixed` 组，因此它们以同一个版本一起发布。只有真正受影响的包才会获得变更日志条目。
- 作为贡献者，你永远不要更改声明的版本。说明兼容性意图并添加正确的 Changeset；发布规划由维护者负责。治理契约是 `spec:AST-017` FR46–FR51。

### 发布如何切出

首先，规范的完整范围 `release-check` 与 Main 工作流的完整单元测试运行必须都在当前 `main` 的一个确切提交上通过。Main 的调度器会在该提交仍为 tip 时，派发包含 main tip 上每一次 release-check（包括个人触发的）的单元测试运行。发布分支只能从同时具备两者的 SHA 切出，且该 SHA 仍须留在当前 main 历史中；缺少任一条件的 SHA，稳定版发布都会拒绝。minor 切版还需要发布负责人 Cindy 在创建分支前立即对确切的 `vX.Y.0` 明确签字确认。计划性或常设授权不覆盖 minor。

然后从该提交切出发布分支 `release/vX.Y.Z`，其中 `X.Y.Z` 是 main 声明的版本。仅在该分支上：

```bash
pnpm version-packages   # changelogs at the declared version + codemod promotion + formatting
```

`scripts/release/version-packages.mjs` 会按声明的版本接纳冻结的 Changesets，在该版本下写入它们的变更日志条目，然后删除它们；它从不更改包版本。随后该命令会提升暂存的 codemod、刷新精确的内部 pin，并格式化带贡献者署名的变更日志。在 Version Packages PR 合并之前，刷新并验证 `pnpm-lock.yaml`。打标签并发布之后，一个受信任的 `chore/merge-vX.Y.Z-to-main` PR 会将分支产出的精确输出和已冻结的删除压缩合并到当前 main，同时保留切版后的每一处更改和 main 的声明。随后由单独的负责人 PR 在固定组、精确内部 pin 和 lockfile 中声明下一计划——默认是 patch 后继版本，只有负责人明确点名时才为 minor。

在 Version Packages PR 合并之前，patch 发布需按照公开的 [Blog Review
Rubric](https://github.com/meta/astryx/wiki/Blog-Review-Rubric#three-required-scored-criteria)（`update` 配置档）对完整的生成变更日志和 GitHub Release 草稿进行自评分，并将结果记录在该 PR 上。每一项标准都必须通过；失败项在 PR 上修复后，对完整文本重新评分。minor 发布则要求 Cindy 对变更日志、发布说明和公开博客进行明确的人工编辑审批，并以同样方式记录。

## 寻找可着手的工作

标签标明哪些工作可以贡献：

- **`good first issue`** / **`help wanted`**——可以认领；从这里开始。
- **`discussion`**——仍在酝酿中，**尚不可贡献**。问题已记录，但解决方案尚未确定。在它被从 `discussion` 分类出来之前，请不要开始修复工作。欢迎提出评论和想法。

对于**拉取请求**，请使用 GitHub 原生的 **Draft** 状态来表示“尚未准备好审核/合并”——先将 PR 作为草稿打开，完成后再标记为可供审核。

## 对变更的期望

标准——一项变更必须满足什么、什么会阻断——都写在 **[Component Audit
Rubric](https://github.com/meta/astryx/wiki/Component-Audit-Rubric)** 上。它只在那处陈述一次，因此不会在本文件、审核者说明和 wiki 之间产生偏差。打开 PR 之前请先阅读：它与审核者应用于你变更的是同一页面，而且每项检查都有 id
（`A8`、`T1`、`P2`……），因此发现的问题总能指回其背后的规则。

你会在那里看到：

- **[会阻断的明确红线](https://github.com/meta/astryx/wiki/Component-Audit-Rubric#the-checks)**——
  硬编码颜色（`T1`、`T3`）· 移除可主题化表面（`T2`）· 在 StyleX 足够时使用原始 CSS（`T8`），或在存在原语时使用原始 HTML（`T29`）· 可访问路径损坏（`A8`）以及无障碍红线（`A1`、`A3`、
  `A14`）· 硬编码的用户可见字符串（`I1`、`I2`、`A16`）· 违反公共 API 约定（`P1`–`P10`）· 丢失透传属性和破坏性变更（`P2`、`P11`、`P12`）· 公共仓库泄露（`L15`）· 缺少 changeset（`X20`）。严重程度由**如果发布出去会破坏什么**决定，而不是由触发概率决定——该评分表会说明每条规则、其例外以及如何判定。
- **[适合你这类变更的标准](https://github.com/meta/astryx/wiki/Component-Audit-Rubric#reviewing-a-change)**——
  bug 修复需要提供它此前确实损坏、现在已修复的证据；新功能会运行可自动化的检查以及 diff 触及的一切检查；`core` 中的新组件会接受完整审计；`lab` 中的新组件有意从宽，审计是**晋升门禁**，而不是入场费。
- **[你的 diff 会触发哪些检查](https://github.com/meta/astryx/wiki/Component-Audit-Rubric#reviewing-a-change)**——
  一张从你触及的内容到会触发的检查的触发表，这样两行修复不会被当作新组件来审核。
- **[已记录的组件评级](https://github.com/meta/astryx/wiki/Component-Audit-Rubric#recording-an-audit)**——
  已审计的组件在 wiki 的 `component-scores.json` 账本中有一个分数和一个未解决阻断项数量，这是了解组件在你更改前处于什么状态的有用背景。大多数组件未审计，这意味着“没有证据”，而不是“没问题”。**没有任何 PR 会因为分数而被门禁阻断**，也从不要求你修复仅仅因为触碰文件而继承的问题。

### 推送之前

这些是本仓库的机械门禁。审核者在红灯处就会停下，而不是把判断力花在一个无法构建的 PR 上。

```bash
pnpm lint:strict   # CI severity, not the local warn tier — a warn-tier-green PR is not lint-clean
pnpm test          # the full suite, locally; CI is not your test runner
pnpm build
```

`pnpm lint:strict` 会先运行 `pnpm check:repo`，其中涵盖 `check:sync`、
`check:package-boundaries`、`check:changesets`、`check:demo-media`、
`check:executable-bits`、`check:cli-structure`、`check:use-client` 和
`check:i18n-catalog`——因此 `lint:strict` 通过也就同时通过了 changeset 和
`'use client'` 门禁。

此外，**任何视觉变更都要附上前后对比截图**，并为你新增或改动的任何内容更新 Storybook story。

## 拉取请求指南

1. 从 `main` 创建功能分支
2. 编写变更并附带测试
3. 通过[推送之前](#before-you-push)的要求：`pnpm lint:strict`、`pnpm test`、
   `pnpm build`
4. 如需要，添加 changeset：`pnpm changeset:new`
5. 打开一个描述清晰的 PR
6. **保持“Allow edits by maintainers”处于启用状态**（打开 PR 时默认勾选）。这让我们可以把你的分支 rebase 到最新的 `main` 上，以清除合并冲突并让 CI 继续针对当前
   `main` 通过，这样已就绪的 PR 不会在你离开时因过时而卡住。

> **为什么这有帮助。** `main` 变化很快，几天前还是绿色的分支也可能过时——CI 上次运行针对的是较旧的 `main`，或者出现合并冲突。启用维护者编辑后，我们可以为你执行 rebase 并重新运行 CI，而无需反复来回。（一个例外：修改
> `.github/workflows/**` 的 PR 无法代你推送——GitHub 要求作者本人更新这些文件；如果是这样我们会提醒你。）

### CI 何时在你的拉取请求上运行

- **草稿不运行 CI。** 将拉取请求标记为可供审核后，CI 才会启动，运行你的变更所触及的检查。
- **来自 fork 的拉取请求需要维护者打上 `ci:run` 标签后才会运行 CI。** 只有维护者能打标签，因此你无需开口：维护者会在初步查看后添加。该标签会在你下次推送时生效，或在维护者关闭并重新打开拉取请求时生效；只要标签保留，CI 就会在每次推送时运行。在此之前，必需的检查会以“Waiting for a maintainer's ci:run label”失败。
- **`ci:run-visual`、`ci:run-a11y` 和 `ci:run-rtl` 各自让拉取请求选择运行一套重型测试套件**（视觉回归、无障碍、RTL），否则这些套件会在拉取请求合并后在 `main` 上运行。拥有写权限的人会打上标签，以提供变更在合并前所需的证据；没有写权限的人打的标签不会运行任何东西。与 `ci:run` 一样，标签在下次推送或关闭再重新打开时生效，移除标签则会在下一次运行时停止该套件。当无障碍审计未运行时，拉取请求评论会点名 `ci:run-a11y`。
- **每个拉取请求都会运行受触及组件检查**（仅针对其变更的组件做视觉、无障碍和 RTL）：视觉部分在视觉任务中运行，无障碍和 RTL 在一个标准 runner 上的任务中运行。它还会单独运行该变更新增或修改的最多四个浏览器无障碍 spec 文件，因此新 spec 会在其自己的拉取请求上被检查（`audit` 或 `release-only` 的 spec 仍要等待其审计 PR 或发布检查），宽范围变更也包含在内。其组件审计会跳过宽范围变更，即触及超过五个组件或更改共享样式（主题、token、共享 `.stylex.ts` 文件）的变更；这些情况请添加 `ci:run-*` 标签。它是咨询性的：没有任何必需检查会等待它。
- **更改 CI 的拉取请求需说明其 CI 影响。** 当它更改工作流、复合操作或 CI 脚本时，其描述需包含一行 `CI impact:`：每个变更任务的 runner 类别（标准或非标准）、每次更新的任务分钟数与 runner 池使用量的前后对比，以及达到绿色的时间。拉取请求评论的 CI 影响部分会根据近期运行测量 `ci.yml` 的这些指标，将其他变更的工作流、复合操作和 CI 脚本标记为未测量，并标记迁移到非标准 runner、runner 池使用量增加超过 10%，或达到绿色的时间增加超过两分钟的任务。
- **来自本仓库分支的拉取请求无需标签即可运行 CI**，因为向本仓库推送分支需要写权限。从 fork 工作的维护者要么将分支推送到本仓库，要么自己打 `ci:run` 标签。
- **重型浏览器套件按作者共享。** 它们会为每位作者最早的十五个打开的拉取请求运行，每天最多一百次此类运行。超过任一限制的拉取请求会显示一个说明原因的失败检查，并会在其合并前重跑时完整运行。`.github/ENGOWNERS` 中列出的工程负责人不受限制。
- **来自共享 agent 登录账号的拉取请求会在就绪时及合并前运行重型套件。** 对已就绪的 agent 拉取请求推送会运行 lint，并在 CI 工作流中只运行 typecheck（路径过滤的工作流照常运行）；`test`、`build` 和 `docsite-test` 会以“Heavy CI deferred”失败（除非变更仅涉及 spec，那会运行所有内容），直到拉取请求被标记为就绪或重新打开，或其最新运行使用 **Re-run all jobs** 重跑，在那种情况下会在该 head 上运行所有内容。

## 代码风格

设计系统规则——StyleX 用法、语义 token、主题、API 约定、无障碍——都在 wiki 上，并从 [Component Audit
Rubric](https://github.com/meta/astryx/wiki/Component-Audit-Rubric) 索引。本仓库机械强制执行的内容：

- TypeScript 严格模式
- 将 `ref` 声明为 prop 的函数组件（React 19——不使用
  `forwardRef`；`@eslint-react/no-forward-ref` 会拒绝它，`@astryx/require-ref-prop` 要求在公开导出的 props 接口上有 `ref?: React.Ref<T>`）
- 任何导入 React 客户端 API 的文件，其第一条语句必须是 `'use client';`——前面只允许有注释和空行（`pnpm check:use-client`，属于 `pnpm check:repo`）
- 用于 AI 辅助开发的 JSDoc 注释，`@example` 围栏保持不加语言标记（纯 ` ``` `），否则 Storybook 自动文档无法渲染它们
- 类型与组件一同导出

## 故障排除

### 安装设置问题

**`pnpm: command not found`**

直接安装 pnpm：

```bash
npm install -g pnpm@11
```

或者，如果你想使用仓库固定的 pnpm 版本，可启用 Corepack：

```bash
corepack enable
```

**`corepack: command not found`**

手动安装 Corepack，然后启用它：

```bash
npm install -g corepack
corepack enable
```

Node 25+ 不包含 Corepack。你可以手动安装 Corepack，或直接安装 pnpm。

**意外的 Node.js 版本**

安装依赖前检查当前生效的版本：

```bash
node --version
```

如果你的 shell 选择了不同的版本（例如非 LTS 的 `stable` 发行版），请使用 22 或 24 之类的活跃 LTS 系列。

**CLI 路径问题**

如果在使用方应用中找不到 `astryx`，请添加根 `README.md` 中所示的包脚本，并通过你的包管理器运行它：

```bash
pnpm astryx -- component --list
```

### pnpm 安装问题

如果 `corepack enable` 成功，但 `pnpm` 无法下载其二进制文件
（例如 `ECONNRESET`、`fetch failed`，或来自 `registry.npmjs.org` 的 `503`），你的环境很可能阻止了出站网络访问。

**替代安装方法（无需 `registry.npmjs.org`）：**

```bash
brew install pnpm                        # Homebrew (macOS)
curl -fsSL https://get.pnpm.io/install.sh | sh -  # Standalone installer
npm install -g pnpm@11                   # Via npm
```

你也可以直接从 [GitHub Releases](https://github.com/pnpm/pnpm/releases/latest) 下载二进制文件。

**沙箱化 IDE 终端：** 如果你的 IDE 阻止所有网络，请先在普通终端中运行
`corepack enable && pnpm install`，然后在 IDE 中打开项目——`node_modules` 位于本地文件系统，使用时不需要网络。

### Storybook 问题

**“Failed to fetch dynamically imported module”**

- 原因：Core 包未构建或已过时
- 修复：`pnpm -F @astryxdesign/core build`，然后重启 Storybook

**“React is not defined”**

- 原因：preview.tsx 中缺少 React 导入
- 修复：确保 preview.tsx 顶部有 `import * as React from 'react';`

**“Unexpected 'stylex.defineVars' call at runtime”**

- 原因：StyleX 代码试图在未编译的情况下运行
- 修复：Storybook 应从 `dist/` 而不是 `src/` 加载。检查 vite.config.ts 的别名。

**变更未出现在 Storybook 中**

- 重新构建包：`pnpm -F @astryxdesign/core build`
- 强制刷新浏览器：Cmd+Shift+R（Mac）或 Ctrl+Shift+R（Windows）
- 清除 Storybook 缓存：删除 `apps/storybook/node_modules/.cache`

## 翻译

Astryx 通过 Crowdin 接受社区翻译。要帮助将 astryx 翻译成你的语言，请访问 <https://crowdin.com/project/astryx>。维护者审核自动生成的翻译 PR 后，新语言区域会被自动纳入。如果你更喜欢直接的方式，针对 `packages/core/locales/*.json` 的直接 PR 也可以。

Calendar 的紧凑星期标签（例如 `Su` 和 `Mo`）由 Unicode CLDR 数据生成，因为浏览器不提供该格式。

## 贡献者许可协议（“CLA”）

为了接受你的拉取请求，我们需要你提交 CLA。你只需做一次，即可为 Meta 的任何开源项目工作。

在此完成你的 CLA：<https://code.facebook.com/cla>

## 问题

我们使用 GitHub issue 跟踪公开 bug。请确保你的描述清晰，并包含足以复现该问题的说明。

Meta 有一个[漏洞赏金计划](https://bugbounty.meta.com/)，用于安全披露安全 bug。遇到此类情况，请按照该页面所述的流程处理，不要提交公开 issue。
