# @astryxdesign/core

Astryx 设计系统的核心 UI 组件、主题系统与工具集。项目搭建请参阅下文的[快速开始](#快速开始)。

> **正在使用 AI 智能体构建？** 先添加 CLI，再运行 `init`：
>
> ```bash
> npm install -D @astryxdesign/cli   # or: pnpm add -D / yarn add -D / bun add -d
> npx @astryxdesign/cli init         # the CLI you just installed
> ```
>
> `init` 会把 Astryx 组件索引写入你的 `AGENTS.md`/`CLAUDE.md`，让智能体发现组件、模板和设计令牌，而不是靠猜测。需要一条不安装也能用的命令？同一个带作用域的命令就能做到：`npx @astryxdesign/cli <cmd>`。请始终使用带作用域的名称：在 `@astryxdesign/cli` 成为依赖之前，不带作用域的 `astryx` 会解析到一个无关的 npm 包。参见 [Astryx CLI](#astryx-cli)。

## 组件文档

通过 Astryx CLI 查阅任意组件的完整 API（属性、变体、示例、最佳实践和主题定制）：

```bash
npx @astryxdesign/cli init                   # one-time: writes the component guide into AGENTS.md / CLAUDE.md
npx @astryxdesign/cli component Button        # full docs for a component
npx @astryxdesign/cli component --list        # list all components
```

> 请使用带作用域的 `@astryxdesign/cli`：无论是否安装都能运行；而在 CLI 成为依赖之前，不带作用域的 `astryx` 会解析到一个无关的 npm 包。

## 页面布局

要构建完整页面？从模板开始，而不是从头拼装。
模板只包含内容；它们把 `Layout` 与页眉、内容和面板插槽组合成常见的页面模式（仪表盘、设置、表单、详情页）。
用你自己的应用外壳（`AppShell`、`TopNav`、`SideNav`）包裹它们，以添加全局导航。

需要 `@astryxdesign/cli`（`npm install -D @astryxdesign/cli`）：

```bash
astryx template --list              # browse all page and block templates
astryx template dashboard           # emit full page source
astryx template settings --skeleton # layout skeleton with spatial annotations
```

## Astryx CLI

CLI（`@astryxdesign/cli`）提供了额外的工具：

```bash
astryx --help                       # full listing of all commands
astryx component Button             # full docs + related block templates
astryx docs                         # reference docs (principles, tokens, theming, styling)
astryx docs theme                   # theming guide (Theme, defineTheme, light/dark)
astryx docs tokens                  # spacing, color, radius, typography token reference
astryx init                         # initialize Astryx in your project
astryx theme build                  # build theme CSS for production
astryx swizzle Button               # eject component source for customization
astryx upgrade --apply              # run codemods to migrate between versions
astryx discover                     # discover external Astryx packages
astryx gap-report                   # report a missing capability
```

> CLI 安装后，可用 `npx @astryxdesign/cli …` 或 `pnpm exec astryx …`（或你所用包管理器的等效命令）运行这些命令。

## 相关软件包

| 包                                                                                                | 描述                                                  |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [`@astryxdesign/cli`](https://github.com/meta/astryx/tree/main/packages/cli)                      | CLI 工具：组件文档、模板、脚手架、代码改造（codemod） |
| [`@astryxdesign/theme-neutral`](https://github.com/meta/astryx/tree/main/packages/themes/neutral) | 低饱和度、极简主题（Lucide 图标）                     |

## 资源

- [组件 Storybook](https://astryx.atmeta.com/storybook/)
- [GitHub 仓库](https://github.com/meta/astryx)

---

## 快速开始

Astryx 需要 **React 19** 或更高版本（`react` 和 `react-dom` 是 >= 19.0.0 的 peer 依赖）。

安装 Astryx 和一个主题：

```bash
npm install @astryxdesign/core @astryxdesign/theme-neutral @stylexjs/stylex
```

然后根据你的框架和样式方案，在下面选择对应的配置方式。

### Next.js（最简单）

这是最快的上手方式。无需构建插件，无需 PostCSS，无需 Babel 配置——Astryx 自带预构建的 CSS 和 JS，因此你只需导入三个样式表（顺序很重要），再用主题 Provider 包裹应用。

**`src/app/globals.css`**

```css
@import '@astryxdesign/core/reset.css';
@import '@astryxdesign/core/astryx.css';
@import '@astryxdesign/theme-neutral/theme.css';
```

导入顺序与级联层对应：`reset.css`（`@layer reset`）→ `astryx.css` 组件样式（`@layer astryx-base`）→ `theme.css` 令牌覆盖（`@layer astryx-theme`）。

**`src/app/providers.tsx`**

```tsx
'use client';

import Link from 'next/link';
import {Theme} from '@astryxdesign/core/theme';
import {LinkProvider} from '@astryxdesign/core/Link';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <Theme theme={neutralTheme}>
      <LinkProvider component={Link}>{children}</LinkProvider>
    </Theme>
  );
}
```

**`src/app/layout.tsx`**

```tsx
import './globals.css';
import {Providers} from './providers';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Next.js + Tailwind

无需构建插件；Astryx 自带可与 Tailwind 配合使用的预构建 CSS。

对于新应用，这个 `globals.css` 就是完整的文件。对于已经使用 Tailwind 的应用，请保留它自己的 `@import "tailwindcss"`，并把 `@layer` 行放在该导入之上，正如 `astryx docs styling-libraries/tailwind` 在“向已使用 Tailwind 的应用添加 Astryx”一节中所展示的那样。若把 `@layer` 行放在 Tailwind 导入之下，则会悄无声息地反转级联顺序。

**`src/app/globals.css`**

```css
@layer reset, theme, base, astryx-base, astryx-theme, components, utilities;

@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import '@astryxdesign/core/reset.css';
@import '@astryxdesign/core/astryx.css';
@import '@astryxdesign/theme-neutral/theme.css';
@import '@astryxdesign/core/tailwind-theme.css';
@import 'tailwindcss/utilities.css' layer(utilities);
```

`tailwind-theme.css` 导入通过 `@theme reference inline` 把系统令牌映射到 Tailwind 实用类，因此这些映射可以生成实用类，而无需在运行时重新声明令牌：

```tsx
// Without the bridge — verbose:
<div className="rounded-[var(--radius-container)] bg-[var(--color-background-surface)] text-[var(--color-text-primary)]">

// With the bridge — just works:
<div className="rounded-lg bg-surface text-primary">
```

一些有用的映射：

| Tailwind 类                                                  | Astryx 令牌                                                    |
| ------------------------------------------------------------ | -------------------------------------------------------------- |
| `text-primary` / `text-secondary`                            | `--color-text-primary` / `--color-text-secondary`              |
| `bg-surface` / `bg-card` / `bg-body`                         | `--color-background-surface` / `card` / `body`                 |
| `border-border` / `border-strong`                            | `--color-border` / `--color-border-emphasized`                 |
| `bg-info` / `bg-success` / `bg-warning` / `bg-error`         | 强状态填充色（`--color-<status>`）                             |
| `text-on-info` / `bg-info-muted` / `text-on-info-muted`      | 强填充内容色、浅色填充、浅色填充内容色                         |
| `text-success` / `text-warning` / `text-error` / `text-info` | 页面上的状态文本色（`--color-text-*`；也可用 `text-status-*`） |
| `border-success` / `border-warning` / `border-error`         | 状态边框色（`--color-border-*`）                               |
| `bg-blue-subtle` / `border-blue-ring` / `text-blue-vivid`    | 色相调色板（10 种色相）                                        |
| `rounded-sm` / `rounded-md` / `rounded-lg`                   | `--radius-inner` / `element` / `container`                     |
| `shadow-sm` / `shadow-md` / `shadow-lg`                      | `--shadow-low` / `med` / `high`                                |

间距以 `var(--spacing-1)` 作为基准单位，因此 `p-4` = 16px，与 Astryx 的 `--spacing-4` 一致。任意值仍可作为备用方案使用：`bg-[var(--color-background-surface)]`。

**`src/app/providers.tsx`**

```tsx
'use client';

import Link from 'next/link';
import {Theme} from '@astryxdesign/core/theme';
import {LinkProvider} from '@astryxdesign/core/Link';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <Theme theme={neutralTheme}>
      <LinkProvider component={Link}>{children}</LinkProvider>
    </Theme>
  );
}
```

**`src/app/layout.tsx`**

```tsx
import './globals.css';
import {Providers} from './providers';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

就是这样。开始使用组件：

```tsx
import {Button} from '@astryxdesign/core/Button';

export default function Page() {
  return <Button label="Hello Astryx" variant="primary" />;
}
```

### Next.js + StyleX

将预构建的 dist 与 StyleX 搭配使用，以编写你自己的样式。

```bash
npm install @astryxdesign/core @astryxdesign/theme-neutral @stylexjs/stylex
```

**`src/app/globals.css`**

```css
@import '@astryxdesign/core/reset.css';
@import '@astryxdesign/core/astryx.css';
@import '@astryxdesign/theme-neutral/theme.css';
```

Provider 和布局与 Tailwind 示例相同（使用 `@astryxdesign/theme-neutral/built`）。

### Vite

```bash
npm install @astryxdesign/core @astryxdesign/theme-neutral @stylexjs/stylex
```

CSS 导入和 Provider 与上面相同。无需构建插件；Astryx 自带预构建产物。

### 无需构建步骤（CDN）

对于原型、嵌入场景或没有打包器的页面，可以直接从公共 CDN 以 ES 模块加载组件。React 19 移除了 UMD 构建（“要使用 script 标签加载 React 19，我们建议使用基于 ESM 的 CDN，例如 esm.sh”），因此入口方式就是导入映射（import map）——已经没有可供全局包绑定的 `window.React` 了。

CLI 会为你生成这个页面，其中带有注释，并固定到你已安装的版本：

```bash
npx @astryxdesign/cli template --cdn   # writes cdn.template.html
```

```html
<!doctype html>
<html lang="en" data-astryx-theme="neutral">
  <head>
    <meta charset="utf-8" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@astryxdesign/core@0.4.1/src/reset.css" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@astryxdesign/core@0.4.1/dist/astryx.css" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@astryxdesign/theme-neutral@0.4.1/dist/theme.css" />
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@19.2.0",
          "react/jsx-runtime": "https://esm.sh/react@19.2.0/jsx-runtime",
          "react-dom": "https://esm.sh/react-dom@19.2.0",
          "react-dom/client": "https://esm.sh/react-dom@19.2.0/client",
          "@astryxdesign/core": "https://esm.sh/@astryxdesign/core@0.4.1?external=react,react-dom"
        }
      }
    </script>
    <style>
      body {
        font-family: var(--font-family-body);
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      import * as React from 'react';
      import {createRoot} from 'react-dom/client';
      import {Card, Stack, Heading, Text, Button} from '@astryxdesign/core';
      const e = React.createElement;
      createRoot(document.getElementById('root')).render(
        e(
          Stack,
          {padding: 6, align: 'start'},
          e(
            Card,
            {maxWidth: 480, elevation: 'low'},
            e(
              Stack,
              {gap: 3, align: 'start'},
              e(Heading, {level: 1}, 'Hello from a CDN'),
              e(Text, null, 'No bundler, no install, no build step.'),
              e(Button, {variant: 'primary', label: 'Try me'}),
            ),
          ),
        ),
      );
    </script>
  </body>
</html>
```

整个方案的关键在于六个细节：

- **`<html>` 上的 `data-astryx-theme`。** 主题 CSS 的作用域限定在该属性上，因此缺少它时，页面会用内置默认值渲染，而不是你刚刚加载的主题。
- **`?external=react,react-dom`。** 缺少它时，esm.sh 会打包自己的 React，每个 Hook 都会抛出 `Cannot read properties of null (reading 'useState')`。
- **导入映射中的 `react/jsx-runtime`。** 已发布的包会导入它；省略这个条目，页面就会报出 `Failed to resolve module specifier` 并停止运行。
- **在 `body` 上设置字体。** 三个样式表都没有设置文档字体：主题为正文元素设置样式，每个组件也为自身设置样式，而 `Button` 使用的是 `font: inherit`。没有这一条声明，它的标签会用浏览器的默认衬线字体渲染。
- **网页字体本身。** 主题只是 _指定_ 了 Figtree，从不加载它。没有 Google Fonts 链接，每位访问者都会在不知不觉中得到字体栈中的下一个字体。
- **不使用 JSX。** 没有任何工具编译这个文件，因此元素要用 `React.createElement` 创建。

> 固定每个版本。未指定版本的 CDN URL 会解析到最新发布版本，而且缓存策略非常激进（上面的 0.4.1 是真实的固定版本；`astryx template --cdn` 会写入你的版本）。原始 ESM 入口（`dist/index.js`）使用裸 `react` 导入，无法通过普通的 `<script src>` 运行——正是导入映射让这些说明符可以被解析。
