# @astryxdesign/build

用于 Astryx 源码构建的构建插件。在 webpack 和 Vite 配置中，它的 babel、PostCSS 和 Vite 集成会以不同的类名前缀分别编译 Astryx 库代码和产品代码，从而实现相互独立的 CSS 层：

```
reset < astryx-base (library, astryx prefix) < astryx-theme < product (app, x prefix)
```

在 Turbopack 下，`withAstryx()` 和 `@astryxdesign/build/next/postcss` 会按照编译其预构建样式表的方式来编译 Astryx：相同的类名，位于 `@layer astryx-base` 中。

## 为什么？

StyleX 生成原子化 CSS：相同的声明 = 相同的类名。如果没有各自独立的前缀，库代码和产品代码的类名就会冲突，无法放入相互独立的 CSS 层，从而导致主题覆盖失效。

在 webpack 和 Vite 配置中，`@astryxdesign/build` 通过以下方式解决这个问题：

1. 使用 `astryx` 前缀编译 Astryx 库代码（`.astryx78zum5`）
2. 使用默认的 `x` 前缀编译产品代码（`.x78zum5`）
3. 将每组代码放入各自的 CSS `@layer`
4. 拒绝不支持的 StyleX 声明，而不是静默忽略它们

## 包

| 导出                               | 用途                                 | 平台                         |
| ---------------------------------- | ------------------------------------ | ---------------------------- |
| `@astryxdesign/build/babel`        | Babel 插件：按文件拆分类名前缀       | Next.js、任意 babel 流水线   |
| `@astryxdesign/build/postcss`      | PostCSS 插件：编译并拆分 CSS 层      | Next.js (webpack)            |
| `@astryxdesign/build/next`         | `withAstryx()`：Next.js 配置辅助函数 | Next.js (webpack, Turbopack) |
| `@astryxdesign/build/next/postcss` | PostCSS 插件：`@astryx;`             | Next.js (Turbopack)          |
| `@astryxdesign/build/vite`         | Vite 插件：封装 unplugin 并拆分层    | Vite、Storybook              |

## 安装

```bash
npm install -D @astryxdesign/build @stylexjs/babel-plugin @babel/core
```

使用 Vite 时，还需安装：

```bash
npm install -D @stylexjs/unplugin
```

---

## Next.js 配置（Turbopack）

在 Turbopack（Next.js 16 起的默认打包器）下，`withAstryx()` 会按照编译预构建样式表的方式，编译你的应用从源码导入的 Astryx 模块；`@astryxdesign/build/next/postcss` 则从这些源码生成每个源码构建包的预构建样式表：相同的规则和选择器、相同的顺序，位于 `@layer astryx-base` 内。安装的包和通过 workspace 链接的包都适用；Astryx 无需 Babel 配置。

1. `next.config.mjs`，包裹你的配置及其自身的 `turbopack.rules`：

   ```js
   import {withAstryx} from '@astryxdesign/build/next';
   export default withAstryx({/* your Next.js config */});
   ```

2. `postcss.config.js`，与你的应用已在使用的任何插件并列：

   ```js
   module.exports = {plugins: {'@astryxdesign/build/next/postcss': {}}};
   ```

3. 全局样式表，用 `@astryx;` 替代 `astryx.css`、`lab.css`、`charts.css` 和 `richtext.css`（每个带有预构建样式表的已安装包都会从源码构建，因此不要导入其中任何一个：导入一个就会导致构建失败）：

   ```css
   @import '@astryxdesign/core/reset.css';
   @import '@astryxdesign/theme-neutral/theme.css';

   @astryx;
   ```

   每个包的规则都以 `reset, astryx-base, astryx-theme` 的层顺序开头，就像 `reset.css` 和主题那样，因此无论分块顺序如何，该顺序都成立，无需你自己写一行代码。

你自己的 Turbopack 规则不会作用于 Astryx 源码，但 Babel 配置文件会，而且 Babel 的 `ignore` 无法排除 Astryx：要让它也不作用于 Astryx，请设置 `experimental.turbopackUseBuiltinBabel: false`，并通过 `turbopack.rules` 条目运行 `babel-loader`，`withAstryx()` 会像对待任何规则一样让它不作用于 Astryx 源码。

## Next.js 配置（webpack）

以下步骤在 `next dev --webpack` 和 `next build --webpack` 下运行。

### 1. babel.config.js

```js
const path = require('path');

module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      '@astryxdesign/build/babel',
      {
        dev: process.env.NODE_ENV !== 'production',
        runtimeInjection: false,
        propertyValidationMode: 'throw',
        treeshakeCompensation: true,
        enableInlinedConditionalMerge: true,
        aliases: {
          '@astryxdesign/core/*': [
            path.join(__dirname, 'node_modules/@astryxdesign/core/*'),
          ],
          '@astryxdesign/core': [
            path.join(__dirname, 'node_modules/@astryxdesign/core'),
          ],
        },
        unstable_moduleResolution: {type: 'commonJS'},
      },
    ],
  ],
};
```

自定义 Babel 配置会关闭 Next.js 的 SWC 编译器，而 `next/font` 需要 SWC。请从布局中移除 `next/font`（新建的 `create-next-app` 布局会导入 `next/font/google`），否则构建会失败并报错 `"next/font" requires SWC although Babel is being used`。

### 2. postcss.config.js

```js
const path = require('path');

module.exports = {
  plugins: {
    '@astryxdesign/build/postcss': {
      appDir: 'src',
      babelPlugins: [
        [
          '@stylexjs/babel-plugin',
          {
            dev: process.env.NODE_ENV !== 'production',
            runtimeInjection: false,
            treeshakeCompensation: true,
            enableInlinedConditionalMerge: true,
            aliases: {
              '@astryxdesign/core/*': [
                path.join(__dirname, 'node_modules/@astryxdesign/core/*'),
              ],
              '@astryxdesign/core': [
                path.join(__dirname, 'node_modules/@astryxdesign/core'),
              ],
            },
            unstable_moduleResolution: {type: 'commonJS'},
          },
        ],
      ],
    },
  },
};
```

### 3. next.config.mjs

或者使用 `@astryxdesign/build/next` 中的 `withAstryx()`，它会为你设置好这两项。当应用包含带有 `astryx-swizzle.json` 标记的经 swizzle 处理的副本时，请使用 `withAstryx()`：此手动配置不会在标记出现或消失时重新构建该副本。无论哪种方式，工作都发生在 `webpack` 钩子中，因此构建必须使用 `--webpack` 运行——参见本节顶部的说明。

```js
const nextConfig = {
  transpilePackages: ['@astryxdesign/core', '@astryxdesign/theme-neutral'],
  webpack: config => {
    // Resolve to source TypeScript instead of dist
    config.resolve.conditionNames = ['source', 'import', 'require', 'default'];
    return config;
  },
};

export default nextConfig;
```

### 4. CSS 文件

`src/app/layers.css`：

```css
@layer reset, astryx-base, astryx-theme, product;
```

`src/app/globals.css`：

```css
@import './layers.css';
@import '@astryxdesign/core/reset.css';
@import '@astryxdesign/theme-neutral/theme.css';

@stylex;
```

> `layers.css` 必须是单独的文件，因为 webpack 会把 `@import` 内容提升到内联 CSS 之上。

### 5. Browserslist

```json
{
  "browserslist": ["last 1 Chrome version"]
}
```

---

## Vite 配置

```ts
import {astryxStylex} from '@astryxdesign/build/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    ...astryxStylex({
      stylexOptions: {
        dev: process.env.NODE_ENV === 'development',
        runtimeInjection: false,
        propertyValidationMode: 'throw',
        treeshakeCompensation: true,
        unstable_moduleResolution: {
          type: 'commonJS',
          rootDir: __dirname,
        },
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@astryxdesign/core': path.resolve(
        __dirname,
        'node_modules/@astryxdesign/core/src',
      ),
    },
  },
  optimizeDeps: {
    exclude: ['@astryxdesign/core', '@astryxdesign/theme-neutral'],
  },
});
```

---

## 工作原理

### Babel 插件 (`@astryxdesign/build/babel`)

使用两个内部实例封装 `@stylexjs/babel-plugin`：一个用于库文件，`classNamePrefix: 'astryx'`；另一个用于产品文件，使用默认的 `'x'`。根据文件路径将每个文件路由到正确的实例。

库文件匹配模式（可配置）：

- `packages/core/`
- `packages/themes/`
- `node_modules/@astryxdesign/`

经 swizzle 处理的副本同样属于库代码。Babel、PostCSS 和 Vite 集成会把包含 `astryx-swizzle.json` 标记的文件夹下的每个模块都以库前缀编译进 `@layer astryx-base`，因此主题对组件的覆盖能像作用于包内组件一样作用于该副本。`astryx swizzle` 会把标记写入它拥有的输出文件夹（由该副本创建的文件夹、空文件夹，或它之前标记过的文件夹），并注明该文件夹中的副本来自哪些包及其版本，例如 `{"packages": {"@astryxdesign/core": "0.7.10"}}`。若要手动标记一个只存放 swizzle 副本的文件夹，请将那个文件添加到其中；构建只读取该文件是否存在。不要把产品自身的组件放进已标记的文件夹。在 webpack 下，请对已标记的副本使用 `withAstryx()`：它会让每个应用模块依赖其上方的标记路径，因此当标记出现或消失时，开发会话或缓存构建会重新编译该副本。在其他会缓存转换结果的配置中，添加或删除标记后，请重启开发服务器并删除该缓存。Turbopack 构建目前还不会读取该标记。

### PostCSS 插件 (`@astryxdesign/build/postcss`)

以不同的前缀分两轮单独编译库和产品源码文件中的 StyleX。将结果包裹在具名的 `@layer` 块中：

- 库规则 → `@layer astryx-base`
- 产品规则 → `@layer product`

### Vite 插件 (`@astryxdesign/build/vite`)

封装 `@stylexjs/unplugin` 并拦截开发用的 CSS 端点（`/virtual:stylex.css`）。按文件路径划分收集到的规则，并提供拆分层的 CSS。生产构建会把这些规则写入一个可安全缓存的共享样式表，并从每个产出的 HTML 入口链接它，而不会交叉加载各入口自有的 CSS。

默认情况下，不支持的声明会使构建失败，并给出 StyleX 的替换指导。只有在迁移需要上游的 `warn` 或 `silent` 行为时，才在 `stylexOverrides`（现代 API）或 `stylexOptions`（旧版 API）中显式设置 `propertyValidationMode`。

生产构建还会检查 StyleX 样式表：其中读取了生成的 CSS 自定义属性（`--<prefix><hash>`），但构建中没有任何样式表声明它们，浏览器会丢弃这些属性。原因可能是：在样式中读取的某个 `.stylex.ts` 导出并非 `defineVars`/`defineConsts` 的值，或者其模块从未进入构建。构建会发出警告，指出变量名以及读取该变量的规则。只有样式表才算声明，因此应用在运行时设置（内联样式）的属性也会被报告：请为其取一个不在 StyleX 类名前缀之内的名称。

---

## 高级选项

### Babel 插件

```js
[
  '@astryxdesign/build/babel',
  {
    // Patterns to identify library files (default shown)
    libraryPatterns: [
      'packages/core/',
      'packages/themes/',
      'node_modules/@astryxdesign/',
    ],

    // Class name prefix for library styles (default: 'astryx')
    libraryPrefix: 'astryx',

    // Class name prefix for product styles (default: 'x')
    classNamePrefix: 'x',

    // ... all @stylexjs/babel-plugin options
  },
];
```

### PostCSS 插件

```js
'@astryxdesign/build/postcss': {
  appDir: 'src',           // Your app source directory
  babelPlugins: [...],     // StyleX babel plugin config
  libraryPrefix: 'astryx',   // Prefix for library CSS (default: 'astryx')
  extraInclude: [...],     // Additional glob patterns
  layers: {                // Layer names (defaults shown)
    library: 'astryx-base',
    product: 'product',
  },
}
```

## 相关

- [example-nextjs-source](../../apps/example-nextjs-source/)：完整的 Next.js 源码构建示例
- [`@stylexjs/babel-plugin`](https://github.com/facebook/stylex)：底层 StyleX 编译器
