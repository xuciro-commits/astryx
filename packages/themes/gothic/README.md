# @astryxdesign/theme-gothic

**仅深色**的氛围感哥特主题，专为 Astryx 打造——深蓝灰色表面、做旧质感的展示标题，以及如发光面板般在深色页面上闪耀的粉彩分类点缀。标题使用 Manufacturing Consent，正文使用 Fustat，并采用 [Lucide](https://lucide.dev) 图标。

> Gothic 是单模式主题：无论用户的系统颜色偏好如何，它始终渲染为深色。为了获得最佳的浏览器界面集成（滚动条、原生表单控件），请向 `Theme` 提供者传入 `mode="dark"`。

## 安装

```bash
npm install @astryxdesign/theme-gothic
```

## 用法

用 `Theme` 包裹你的应用，并传入主题：

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {gothicTheme} from '@astryxdesign/theme-gothic/built';

function App() {
  return (
    <Theme theme={gothicTheme} mode="dark">
      {/* your app */}
    </Theme>
  );
}
```

### 导入路径

| 路径                                   | 使用场景                                                |
| -------------------------------------- | ------------------------------------------------------- |
| `@astryxdesign/theme-gothic`           | 源码构建（通过 `@astryxdesign/build` 进行 StyleX 编译） |
| `@astryxdesign/theme-gothic/built`     | 预构建产物（Tailwind、纯 CSS 或无构建步骤）             |
| `@astryxdesign/theme-gothic/theme.css` | 预构建的 CSS 文件（在你的样式表中导入）                 |

如果你使用 `@astryxdesign/build` 进行 StyleX 源码编译，请从裸路径导入；否则请使用 `/built`。

### CSS 导入

将主题 CSS 添加到你的样式表：

```css
@import '@astryxdesign/theme-gothic/theme.css';
```

## 美学

Gothic 在设计上仅支持深色：每个令牌都是单一值，输出的 CSS 不包含 `light-dark()`，因此无论用户偏好浅色还是深色，主题的渲染效果都完全一致。

| 方面     | 选择                                          |
| -------- | --------------------------------------------- |
| 模式     | 仅深色，无浅色变体                            |
| 中性色   | 冷调蓝灰色（#101314 → #E8F1F6）               |
| 状态色   | 森林苔藓、血红、烛光琥珀                      |
| 分类色   | 深色上的粉彩：浅色背景、深色文字              |
| 圆角     | 轻微圆角（2–24px）                            |
| 动效     | 更慢 / 更具戏剧性（150ms → 800ms，0.75 比例） |
| 字号体系 | 基准 14px，比例 1.2                           |

## 字体

此主题使用自定义字体：

| 角色 | 字体                  | 风格             |
| ---- | --------------------- | ---------------- |
| 正文 | Fustat                | 干净现代的无衬线 |
| 标题 | Manufacturing Consent | 做旧展示字体     |
| 代码 | JetBrains Mono        | 清晰、等宽       |

**这些字体必须单独加载。** 主题仅按名称引用它们，并不捆绑字体文件。

将以下内容添加到 HTML 的 `<head>` 中：

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Fustat:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Manufacturing+Consent&display=swap" />
```

如果没有这些内容，主题将回退到系统字体（标题会依次回退到 Manufacturing Consent → UnifrakturMaguntia → Old English Text MT → serif）。

## 已审查的调色板与兼容色阶

Gothic 将生成请求保存在 `palette.config.json` 中，将已审查的 `astryx-oklch-v1` 输出保存在 `src/gothicPalettes.generated.ts` 中，并将独立的生成回执放在其旁边。维护中的主题会渲染该私有生成调色板中的选定值。

下文展示的公共 `gothicPalettes.family[stop]` 导出是冻结的已发布兼容色阶，而不是维护中的主题所渲染的调色板。其数字色标以及每个家族的 `hue` 和 `chroma` 元数据在 `gothicTheme.ts` 中保持字节级一致，因此现有使用者无需迁移。

该调色板仅支持深色。它保留 Gothic 的粉彩分类色，并使用精心挑选的宝石色调锚点来进行语法高亮。完整的生成调色板是私有创作数据；运行时主题仅导入 `gothicPaletteRefs.generated.ts` 中选定的色标。

在组件中使用语义主题令牌。Gothic 的主题源码将其拥有的角色映射到命名的调色板色标；组件从不直接读取原始调色板值。预构建主题和 CSS 包含解析后的值。更改调色板时，必须同时包含重新生成的回执、选定引用模块、令牌差异、测试和视觉审查。更改映射时，保持 `gothicTheme.ts` 与 CLI 模板副本同步。

```ts
import {gothicPalettes} from '@astryxdesign/theme-gothic';

const purple = gothicPalettes.purple[80];
const neutral = gothicPalettes.neutral[10];
```

该调色板是创作和审计参考，而非组件样式 API、图表颜色 API 或无障碍保证。组件应读取语义令牌，图表应使用数据可视化颜色 API，每一对自定义前景/背景色仍需进行上下文对比度验证。
