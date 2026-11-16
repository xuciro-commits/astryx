# @astryxdesign/theme-matcha

大地绿色主题，标题使用 Playwrite US Trad，正文使用 DM Sans。使用 [Lucide](https://lucide.dev) 图标。

## 安装

```bash
npm install @astryxdesign/theme-matcha
```

## 用法

用 `Theme` 包裹你的应用，并传入主题：

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {matchaTheme} from '@astryxdesign/theme-matcha/built';

function App() {
  return <Theme theme={matchaTheme}>{/* your app */}</Theme>;
}
```

### 导入路径

| 路径                                   | 使用场景                                                |
| -------------------------------------- | ------------------------------------------------------- |
| `@astryxdesign/theme-matcha`           | 源码构建（通过 `@astryxdesign/build` 进行 StyleX 编译） |
| `@astryxdesign/theme-matcha/built`     | 预构建产物（Tailwind、纯 CSS 或无构建步骤）             |
| `@astryxdesign/theme-matcha/theme.css` | 预构建的 CSS 文件（在你的样式表中导入）                 |

如果你使用 `@astryxdesign/build` 进行 StyleX 源码编译，请从裸路径导入；否则请使用 `/built`。

### CSS 导入

将主题 CSS 添加到你的样式表：

```css
@import '@astryxdesign/theme-matcha/theme.css';
```

## 已批准的调色板

Matcha 将生成请求保存在 `palette.config.json` 中，将已审查的 `astryx-oklch-v1` 输出保存在 `src/matchaPalettes.generated.ts` 中，并将独立的生成回执放在其旁边。该调色板使用独立的浅色和深色色阶；Tea Gold 由无锚点的金色种子生成，因此该家族保持平滑。运行时主题仅导入 `matchaPaletteRefs.generated.ts` 中选定的色标。

在组件中使用语义主题令牌。Matcha 的主题源码将其拥有的颜色角色映射到命名的调色板色标；组件从不直接读取原始调色板值。完整调色板是私有的创作和审计产物，而非包导出，且预构建主题和 CSS 仅包含解析后的值。更改调色板时，必须同时包含重新生成的回执、选定引用模块、令牌差异、测试和视觉审查。更改映射时，保持 `matchaTheme.ts` 与 CLI 模板副本同步。

该调色板不是组件样式 API、图表颜色 API 或无障碍保证。组件应读取语义令牌，图表应使用数据可视化颜色 API，每一对自定义前景/背景色仍需进行上下文对比度验证。

## 字体

此主题使用自定义字体：

| 角色 | 字体              |
| ---- | ----------------- |
| 正文 | DM Sans           |
| 标题 | Playwrite US Trad |
| 代码 | JetBrains Mono    |

**这些字体必须单独加载。** 主题仅按名称引用它们，并不捆绑字体文件。

将以下内容添加到 HTML 的 `<head>` 中：

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Playwrite+US+Trad:wght@100..400&display=swap" />
```

如果没有这些内容，主题将回退到系统字体。
