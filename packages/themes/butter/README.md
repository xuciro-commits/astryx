# @astryxdesign/theme-butter

为 Astryx 打造的金黄奶油主题，带有蓝色点缀。展示字体使用 Sarina，标题与正文使用 Outfit。

## 安装

```bash
npm install @astryxdesign/theme-butter
```

## 用法

```tsx
import {butterTheme} from '@astryxdesign/theme-butter/built';
import {Theme} from '@astryxdesign/core/theme';
import '@astryxdesign/theme-butter/theme.css';

function App() {
  return <Theme theme={butterTheme}>{/* Your app content */}</Theme>;
}
```

## 颜色

Butter 的已批准调色板由 `palette.config.json` 生成。它包含暖中性色、标志性蓝色以及九个分类色家族的完整浅色和深色色阶。`#225BFF` 和 `#FDEE8C` 分别是 Butter 标志性蓝色和黄色的精确锚点。绿色保持无锚点，以便其色阶保持平滑。

主题和组件角色使用语义令牌，其数据来自生成的小型 `butterPaletteRefs` 选择集。组件应使用这些语义令牌，而非原始调色板值。错误、警告和成功状态共享 Red、Yellow 和 Green，而不是各自维护重复的色阶。数据可视化颜色保持独立，不被此主题覆盖。

现有的 `butterPalettes` 导出保持不变，作为兼容性快照。完整的、经过审查的模式感知调色板仅限创作、测试和选定引用生成使用，因此采用它不会改变公共 API 形态，也不会迫使完整候选进入主题评估。

更改 `palette.config.json` 后，使用以下命令重新生成候选和回执：

```bash
pnpm -F @astryxdesign/theme-butter exec astryx theme palette generate \
  palette.config.json \
  --out src/butterPalettes.generated.ts \
  --preview .tmp-butter-palette-preview.html \
  --overwrite
```

在提交的 TypeScript 候选文件上保留标准版权头，在两种模式下审查预览，删除 `.tmp-butter-palette-preview.html`，然后运行 `pnpm generate:butter-palette-refs`。保持主题包与 CLI 模板副本同步。

## 字体排印

- **展示字体**：Sarina（手写体），通过内联样式按页面应用。
- **标题与正文**：Outfit，基准 14px，比例 1.25。
- **代码**：JetBrains Mono。

Sarina 和 Outfit 通过 Google Fonts 提供。将适当的 `<link rel="stylesheet" href="...">` 添加到文档的 `<head>` 中，以避免运行时获取字体。
