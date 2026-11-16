# @astryxdesign/theme-stone

温暖的石色与板岩主题，带有大地色中性色调。标题使用 Montserrat，正文使用 Figtree，并采用 [Lucide](https://lucide.dev) 图标。

## 安装

```bash
npm install @astryxdesign/theme-stone
```

## 用法

用 `Theme` 包裹你的应用，并传入主题：

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {stoneTheme} from '@astryxdesign/theme-stone/built';

function App() {
  return <Theme theme={stoneTheme}>{/* your app */}</Theme>;
}
```

### 导入路径

| 路径                                  | 使用场景                                                |
| ------------------------------------- | ------------------------------------------------------- |
| `@astryxdesign/theme-stone`           | 源码构建（通过 `@astryxdesign/build` 进行 StyleX 编译） |
| `@astryxdesign/theme-stone/built`     | 预构建产物（Tailwind、纯 CSS 或无构建步骤）             |
| `@astryxdesign/theme-stone/theme.css` | 预构建的 CSS 文件（在你的样式表中导入）                 |

如果你使用 `@astryxdesign/build` 进行 StyleX 源码编译，请从裸路径导入；否则请使用 `/built`。

## 已批准的调色板

Stone 将生成请求保存在 `palette.config.json` 中，将已审查的 `astryx-oklch-v1` 输出保存在 `src/stonePalettes.generated.ts` 中，并将独立的生成回执放在其旁边。`stonePaletteRefs.generated.ts` 提供由维护中的主题使用的小型运行时投影。

该调色板保留 Stone 精确配置的中性色和粉彩色锚点，同时生成独立的浅色和深色色阶。Green、Yellow、Teal 和 Cyan 使用经过审查的重新播种中间调，而不保留其已发布的兼容色阶值。完整调色板仍可用于创作和审计；运行时主题仅导入 `stonePaletteRefs.generated.ts` 中选定的色标。

在组件中使用语义主题令牌。Stone 的主题源码将这些角色映射到命名的调色板色标；组件从不直接读取原始调色板值。预构建主题和 CSS 包含解析后的值。更改生成的调色板时，必须同时包含重新生成的回执、选定引用模块、令牌差异、测试和视觉审查。更改映射时，保持 `stoneTheme.ts` 与 CLI 模板副本同步。

裸包导出保留原始的 `stonePalettes.family[stop]`、`stonePalettes.family.hue` 和 `stonePalettes.family.chroma` 结构。生成的浅色和深色色阶是私有创作产物，供维护中的主题、测试和审查工具使用，而非扩展的公共调色板 API：

```ts
import {stonePalettes} from '@astryxdesign/theme-stone';

const existingSharedRampValue = stonePalettes.orange[90];
```

该调色板是创作和审计参考，而非组件样式 API、图表颜色 API 或无障碍保证。组件应读取语义令牌，图表应使用数据可视化颜色 API，每一对自定义前景/背景色仍需进行上下文对比度验证。

### CSS 导入

将主题 CSS 添加到你的样式表：

```css
@import '@astryxdesign/theme-stone/theme.css';
```

## 字体

此主题使用自定义字体：

| 角色 | 字体           |
| ---- | -------------- |
| 正文 | Figtree        |
| 标题 | Montserrat     |
| 代码 | JetBrains Mono |

**这些字体必须单独加载。** 主题仅按名称引用它们，并不捆绑字体文件。

将以下内容添加到 HTML 的 `<head>` 中：

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap" />
```

如果没有这些内容，主题将回退到系统字体。
