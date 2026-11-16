# @astryxdesign/theme-neutral

低调、极简的美学风格，采用 Figtree 字体排印。使用 [Lucide](https://lucide.dev) 图标。

## 安装

```bash
npm install @astryxdesign/theme-neutral
```

## 用法

用 `Theme` 包裹你的应用，并传入主题：

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';

function App() {
  return <Theme theme={neutralTheme}>{/* your app */}</Theme>;
}
```

### 导入路径

| 路径                                    | 使用场景                                                |
| --------------------------------------- | ------------------------------------------------------- |
| `@astryxdesign/theme-neutral`           | 源码构建（通过 `@astryxdesign/build` 进行 StyleX 编译） |
| `@astryxdesign/theme-neutral/built`     | 预构建产物（Tailwind、纯 CSS 或无构建步骤）             |
| `@astryxdesign/theme-neutral/theme.css` | 预构建的 CSS 文件（在你的样式表中导入）                 |

如果你使用 `@astryxdesign/build` 进行 StyleX 源码编译，请从裸路径导入；否则请使用 `/built`。

## 已批准的调色板

仓库将 Neutral 的生成请求保存在 `palette.config.json` 中，将精确的 `astryx-oklch-v1` 输出保存在 `src/neutralPalettes.generated.ts` 中，并将生成回执放在该文件旁边。`src/neutralPalettes.ts` 提供稳定的主题内导入入口。Neutral 目前在每个浅色和深色色阶中都使用 21 个编号色标，但这一布局是 Neutral 自身的决定，而非对其他主题的要求。

精确的纯色端点使用与色调家族相同的稳定调色板命名空间：`neutralPalettes.black` 和 `neutralPalettes.white`。主题定义可以将这些值直接赋给语义令牌，而不必将中性色阶的端点视为命名颜色。

```ts
import {neutralPalettes} from '@astryxdesign/theme-neutral';

const tokens = {
  '--color-background-inverted': [neutralPalettes.black, neutralPalettes.white],
};
```

Neutral 为彩色家族采用了柔和的深色边缘。色标 5 至 25 使用其实际彩度的 50%，然后在色标 60 处平滑恢复到标准的深色配方。黄色使用更温和的 65% 边缘乘数。浅色色阶、中性色阶以及色标 60 至 100 保持不变。

Neutral 是调色板感知主题模板的参考实现。模板可以遵循其归属、审查和对齐工作流，而无需复制其颜色或色标布局。

在组件中使用语义主题令牌。Neutral 的主题源码将这些角色映射到命名的调色板色标，而预构建主题和 CSS 包含其解析后的值。更改生成的调色板时，必须同时包含重新生成的回执、令牌差异、测试和视觉审查。

已提交的请求和回执保留了生成输入与来源信息。CLI 重新生成尚不是受支持的发布工作流；在该工具发布之前，请将生成的模块和回执视为已审查的产物，而不要手动编辑它们。

### CSS 导入

将主题 CSS 添加到你的样式表：

```css
@import '@astryxdesign/theme-neutral/theme.css';
```

这是组件级主题覆盖（颜色、圆角、字体排印）生效所必需的。

## 字体

此主题使用自定义字体：

| 角色 | 字体                 |
| ---- | -------------------- |
| 正文 | Figtree              |
| 标题 | Figtree              |
| 代码 | 系统等宽字体（内置） |

**Figtree 必须单独加载。** 主题仅按名称引用它，并不捆绑字体文件。

将以下内容添加到 HTML 的 `<head>` 中：

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" />
```

如果没有这些内容，主题将回退到系统字体。如果你希望完全避免外部字体请求（离线应用、禁止第三方请求的政策），这种回退是受支持的选择——系统字体栈的设计足以独立支撑。

## 相关包

| 包                                                                               | 描述                               |
| -------------------------------------------------------------------------------- | ---------------------------------- |
| [`@astryxdesign/core`](https://github.com/meta/astryx/tree/main/packages/core)   | 核心组件与主题系统                 |
| [`@astryxdesign/build`](https://github.com/meta/astryx/tree/main/packages/build) | 用于 StyleX 源码构建的构建插件     |
| [`@astryxdesign/cli`](https://github.com/meta/astryx/tree/main/packages/cli)     | CLI 工具，包括 `astryx docs theme` |
