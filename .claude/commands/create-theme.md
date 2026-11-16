# 创建 Astryx 主题

使用 `defineTheme` 创建新的 Astryx 主题。

> 请先阅读 `packages/cli/assets/theme.template.ts`
> （`astryx theme template` 会将其写入使用方项目）。它是整个主题表面经过
> 标注、受漂移保护的地图——每个字段、令牌族、覆盖语法——并指明了为每一项
> 打印权威参考的 CLI 命令。下文介绍的是主题的外包装；
> 模板才是要放进去的内容。

## 主题名称

$ARGUMENTS

## 说明

在 `packages/themes/{themeName}/` 创建新的主题包。

### 文件结构

```
packages/themes/{themeName}/
├── package.json
└── src/
    └── index.ts
```

### package.json

```json
{
  "name": "@astryxdesign/theme-{themeName}",
  "version": "0.0.1",
  "private": false,
  "description": "{Description} theme for Astryx",
  "license": "MIT",
  "sideEffects": false,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./theme.css": "./dist/theme.css"
  },
  "files": ["dist", "src"],
  "scripts": {
    "build:theme": "astryx theme build src/index.ts -o dist/theme.css"
  },
  "peerDependencies": {
    "@astryxdesign/core": "*"
  },
  "devDependencies": {
    "@astryxdesign/cli": "*"
  }
}
```

### 主题文件（src/index.ts）

```tsx
import {defineTheme} from '@astryxdesign/core/theme';

export const {themeName}Theme = defineTheme({
  name: '{themeName}',

  tokens: {
    // Colors — use [light, dark] tuples for automatic light-dark() conversion
    '--color-accent': ['#YOUR_LIGHT', '#YOUR_DARK'],
    '--color-accent-muted': ['#YOUR_LIGHT33', '#YOUR_DARK3F'],
    '--color-background-surface': ['#FFFFFF', '#1C1C1C'],
    '--color-background-body': ['#F5F5F5', '#121212'],

    // Radius — customize for different feel
    '--radius-page': '28px',
    '--radius-container': '12px',
    '--radius-element': '8px',
    '--radius-inner': '4px',

    // Typography — font families
    '--font-family-body': '-apple-system, BlinkMacSystemFont, sans-serif',
    '--font-family-heading': '-apple-system, BlinkMacSystemFont, sans-serif',
    '--font-family-code': '"SF Mono", Monaco, Consolas, monospace',

    // Only include tokens you want to override.
    // See packages/core/src/theme/tokens.stylex.ts for all available tokens.
  },

  components: {
    // Component style overrides using CSS class selectors
    // Keys: 'base' for all instances, 'prop:value' for variants
    button: {
      base: { fontWeight: '600' },
      'variant:secondary': { backgroundColor: 'rgba(0,0,0,0.06)' },
    },
    heading: {
      'level:1': {
        fontFamily: 'var(--font-family-heading)',
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 'var(--font-weight-semibold)',
        lineHeight: '1.2',
        color: 'var(--color-text-primary)',
        margin: '0',
      },
      // ... levels 2-6
    },
    text: {
      'type:body': {
        fontFamily: 'var(--font-family-body)',
        fontSize: 'var(--font-size-base)',
        fontWeight: 'var(--font-weight-normal)',
        lineHeight: 'var(--leading-base)',
        color: 'var(--color-text-primary)',
        margin: '0',
      },
      // ... other types: large, label, supporting, code
    },
  },

  // Optional: icon registry (import from a separate icons file)
  // icons: myIconRegistry,
});
```

## 关键概念

### 令牌值

- **字符串**：在浅色和深色模式下均按原样使用
- **[light, dark] 元组**：转换为 CSS `light-dark(light, dark)`

### 组件覆盖键

- `base`——应用于所有实例的样式
- `prop:value`——当某个视觉属性匹配时的样式（例如 `variant:secondary`）
- `prop:value+prop:value`——多个属性的交集（例如 `variant:editorial+level:1`）

### CSS 输出

组件覆盖会生成作用域 CSS：

```css
@scope ([data-astryx-theme="{themeName}"]) to ([data-astryx-theme]) {
  .astryx-button[data-variant='secondary'] {
    background-color: ...;
  }
  .astryx-heading[data-level='1'] {
    font-size: var(--font-size-2xl);
  }
}
```

### 分发

- **未构建**：`Theme` 在运行时生成 CSS 并注入 `<style>`
- **已构建**：`astryx theme build` 预编译为 CSS 文件

## 扩展现有主题

使用 `extends` 从另一个主题派生——继承令牌、组件、图标、字体。只需指定覆盖项。

```tsx
import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

export const brandTheme = defineTheme({
  name: 'brand',
  extends: neutralTheme,
  icons: myIcons, // swap icons
  tokens: {
    '--color-accent': ['#7B61FF', '#9B85FF'], // override accent
  },
});
```

子值优先。令牌和组件会深度合并；比例配置（排版、动效、圆角）整体替换。

## 参考

参见现有主题示例：

- `packages/themes/neutral/src/neutralTheme.ts` —— 使用 Geist 字体的灰度参考主题
- `packages/themes/stone/src/stoneTheme.ts` —— 带组件覆盖的温暖中性主题
- `packages/themes/y2k/src/y2kTheme.ts` —— 带大胆组件覆盖的展示主题

## 创建之后

1. 如需要，将主题加入根 `package.json` 的工作区
2. 将主题添加到 Storybook 预览：`apps/storybook/.storybook/preview.tsx`
3. 在浅色和深色模式下测试
