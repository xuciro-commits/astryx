# @astryxdesign/theme-chocolate

温暖巧克力主题，采用浓郁的棕色色调与舒适的米色背景。标题使用 Fraunces，正文使用 Albert Sans，并采用 [Lucide](https://lucide.dev) 图标。

## 安装

```bash
npm install @astryxdesign/theme-chocolate
```

## 用法

用 `Theme` 包裹你的应用，并传入主题：

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {chocolateTheme} from '@astryxdesign/theme-chocolate/built';

function App() {
  return <Theme theme={chocolateTheme}>{/* your app */}</Theme>;
}
```

### 导入路径

| 路径                                      | 使用场景                                                |
| ----------------------------------------- | ------------------------------------------------------- |
| `@astryxdesign/theme-chocolate`           | 源码构建（通过 `@astryxdesign/build` 进行 StyleX 编译） |
| `@astryxdesign/theme-chocolate/built`     | 预构建产物（Tailwind、纯 CSS 或无构建步骤）             |
| `@astryxdesign/theme-chocolate/theme.css` | 预构建的 CSS 文件（在你的样式表中导入）                 |

如果你使用 `@astryxdesign/build` 进行 StyleX 源码编译，请从裸路径导入；否则请使用 `/built`。

### CSS 导入

将主题 CSS 添加到你的样式表：

```css
@import '@astryxdesign/theme-chocolate/theme.css';
```

## 字体

此主题使用自定义字体：

| 角色 | 字体           |
| ---- | -------------- |
| 正文 | Albert Sans    |
| 标题 | Fraunces       |
| 代码 | JetBrains Mono |

**这些字体必须单独加载。** 主题仅按名称引用它们，并不捆绑字体文件。

将以下内容添加到 HTML 的 `<head>` 中：

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" />
```

如果没有这些内容，主题将回退到系统字体。
