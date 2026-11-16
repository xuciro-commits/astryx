# Astryx + Tailwind（Dist 构建）

示例 Next.js 应用，将 Astryx 预构建的 dist CSS 与 Tailwind CSS v4 搭配使用。无需 StyleX 构建插件：Astryx 组件作为常规 npm 包通过 CSS 导入使用。

## 工作原理

Astryx 提供预编译的 CSS（`astryx.css`），所有组件样式以原子类形式位于 CSS 级联图层中。Tailwind 通过工具类处理布局、间距和自定义样式。两套系统通过显式图层顺序共存。

## CSS 图层顺序

共存的关键是在 `globals.css` 中预先声明**所有**图层：

```css
@layer reset, theme, base, astryx-base, astryx-theme, components, utilities;
```

这会得到正确的优先级（从低到高）：

| 图层           | 来源     | 作用                                    |
| -------------- | -------- | --------------------------------------- |
| `reset`        | Astryx   | CSS 重置（`:where()` 选择器，零特异性） |
| `theme`        | Tailwind | 主题变量（颜色、字体、间距）            |
| `base`         | Tailwind | Preflight 重置（元素级归一化）          |
| `astryx-base`  | Astryx   | 组件样式（按钮、卡片、输入框等）        |
| `astryx-theme` | Astryx   | 主题覆盖（排版、颜色映射）              |
| `components`   | Tailwind | 组件类（如有）                          |
| `utilities`    | Tailwind | 工具类：**优先于所有图层**              |
| _(未分层)_     | 使用方   | 你的自定义 CSS：最高优先级              |

如果没有此声明，Astryx 图层会在 Tailwind 声明的图层_之后_创建，导致 Astryx 组件样式优先级高于 Tailwind 工具类。也就是说，在 Astryx 组件上使用 `className="bg-red-500"` 将不起作用。

## 用法模式

### Astryx 负责组件，Tailwind 负责布局

```tsx
<main className="flex min-h-screen items-center p-8">
  <Card className="max-w-md">
    <VStack gap={4}>
      <Heading level={2}>Dashboard</Heading>
      <Button label="Save" variant="primary" />
    </VStack>
  </Card>
</main>
```

### Astryx Tailwind Bridge（推荐）

导入 `@astryxdesign/core/tailwind-theme.css`，将 Astryx 令牌注册为 Tailwind 主题变量。这会把所有 Astryx 设计令牌映射为原生 Tailwind 工具类，无需使用 `var()`：

```tsx
// Before (verbose arbitrary values):
<div className="rounded-[var(--radius-container)] bg-[var(--color-background-surface)] p-[var(--spacing-4)]">
  <p className="text-[var(--color-text-primary)]">Styled with Astryx tokens</p>
</div>

// After (with tailwind-theme.css):
<div className="rounded-lg bg-surface p-4">
  <p className="text-primary">Styled with Astryx tokens</p>
</div>
```

该 bridge 使用 Tailwind v4 的 `@theme reference inline`：`reference` 阻止运行时令牌声明，而 `inline` 生成读取 Astryx 现有 CSS 自定义属性的工具类。主题切换可以直接生效。

可用的工具类包括 `text-primary`、`text-secondary`、`bg-surface`、`bg-card`、`border-strong`、`text-error`、`bg-success`、`bg-blue-subtle`、`text-blue-vivid`、`border-blue-ring`，以及 80 多个其他工具类。

### 通过任意值使用 Astryx 令牌（备用方案）

如果你需要 bridge 未覆盖的令牌，仍可使用 Tailwind 的方括号语法：

```tsx
<div className="bg-[var(--color-background-surface)]">
  <p className="text-[var(--color-text-primary)]">Escape hatch</p>
</div>
```

### 在 Astryx 组件上使用 Tailwind 覆盖

所有 Astryx 组件都接受 `className`。`utilities` 图层中的 Tailwind 工具类会覆盖 `astryx-base` 中的 Astryx 组件样式：

```tsx
<Button label="Custom" variant="primary" className="rounded-full shadow-xl" />
<Text type="body" className="text-blue-600 italic">Custom styled text</Text>
```

### 混用 Astryx 和 Tailwind 组件

Shadcn 风格的 Tailwind 组件与 Astryx 一起渲染正常。两套 reset 几乎相同（同源于 modern-normalize），因此没有冲突：

```tsx
<div className="grid grid-cols-2 gap-6">
  <Card>...</Card>
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    ...
  </div>
</div>
```

## Reset 兼容性

Astryx reset 与 Tailwind Preflight 约有 80% 重叠。有意义的差异如下：

- **字体平滑**：Astryx 启用 `-webkit-font-smoothing: antialiased`；Tailwind 不启用
- **配色方案**：Astryx 将 `data-theme` 映射到 `color-scheme`，用于浅色/深色模式
- **占位符颜色**：Astryx 使用 `var(--color-text-secondary)` 令牌；Tailwind 使用 `color-mix()`

两套 reset 可以一起运行而不会冲突。彼此都不会破坏对方的组件。

## 运行

```bash
pnpm install
pnpm dev  # or: cd apps/example-nextjs-tailwind && npx next dev
```
