# @astryxdesign/theme-y2k

为 Astryx 打造的俏皮 Y2K 流行主题：柔和的浅紫蓝色主体、炭黑点缀、由 HCT 色调调色板衍生的全息分类色，正文/标题使用 Poppins，展示字号使用 Crimson Text 衬线字体。

## 安装

```bash
npm install @astryxdesign/theme-y2k
```

## 用法

用 `Theme` 包裹你的应用，并传入主题：

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {y2kTheme} from '@astryxdesign/theme-y2k/built';

function App() {
  return <Theme theme={y2kTheme}>{/* your app */}</Theme>;
}
```

### 导入路径

| 路径                                | 使用场景                                                |
| ----------------------------------- | ------------------------------------------------------- |
| `@astryxdesign/theme-y2k`           | 源码构建（通过 `@astryxdesign/build` 进行 StyleX 编译） |
| `@astryxdesign/theme-y2k/built`     | 预构建产物（Tailwind、纯 CSS 或无构建步骤）             |
| `@astryxdesign/theme-y2k/theme.css` | 预构建的 CSS 文件（在你的样式表中导入）                 |

如果你使用 `@astryxdesign/build` 进行 StyleX 源码编译，请从裸路径导入；否则请使用 `/built`。

### CSS 导入

将主题 CSS 添加到你的样式表：

```css
@import '@astryxdesign/theme-y2k/theme.css';
```

## 颜色

Y2K 的已批准调色板由 `palette.config.json` 生成。它包含中性色、标志性浅紫蓝色以及九个分类色家族的完整浅色和深色色阶。浅色中性色保留 Y2K 的温暖画布，深色中性色则沿着海军蓝深色表面从 `#0E0F1A` 过渡到薰衣草色 `#EDEFFC`。浅紫蓝色主体 `#CCCFFA` 和霓虹绿 `#C5E17A` 是精确锚点。蓝色使用无锚点的电光色阶，同时其组件表面保持接近原有的轻盈蓝色。

主题和组件角色使用语义令牌，其数据来自生成的小型 `y2kPaletteRefs` 选择集。组件应使用这些语义令牌，而非原始调色板值。数据可视化颜色保持独立，不被此主题覆盖。

现有的 `y2kPalettes` 导出保持不变，作为兼容性快照。完整的、经过审查的模式感知调色板仅限创作、测试和选定引用生成使用，因此采用它不会改变公共 API 形态，也不会迫使完整候选进入主题评估。

更改 `palette.config.json` 后，使用以下命令重新生成候选和回执：

```bash
node packages/cli/clients/cli/bin/astryx.mjs theme palette generate \
  packages/themes/y2k/palette.config.json \
  --out packages/themes/y2k/src/y2kPalettes.generated.ts \
  --preview .tmp-y2k-palette-preview.html \
  --overwrite
```

在提交的 TypeScript 候选文件上保留标准版权头，在两种模式下审查预览，删除 `.tmp-y2k-palette-preview.html`，然后运行 `pnpm generate:y2k-palette-refs`。保持主题包与 CLI 模板副本同步。

## 字体

此主题使用自定义字体：

| 角色        | 字体           |
| ----------- | -------------- |
| 正文 / 标题 | Poppins        |
| 展示字体    | Crimson Text   |
| 代码        | JetBrains Mono |

**这些字体必须单独加载。** 主题仅按名称引用它们，并不捆绑字体文件。

将以下内容添加到 HTML 的 `<head>` 中：

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=JetBrains+Mono:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" />
```

如果没有这些内容，主题将回退到系统字体（Crimson Text 会回退到衬线字体）。
