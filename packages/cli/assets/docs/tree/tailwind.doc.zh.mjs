// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for tailwind.doc.mjs.
export const docsZh = {
  "title": "Tailwind",
  "description": "Tailwind v4 桥接、级联层顺序，以及由系统令牌支撑的工具类用法。",
  "sections": [
    {
      "section": "Tailwind",
      "title": "Tailwind",
      "content": [
        {
          "type": "prose",
          "text": "`@astryxdesign/core/tailwind-theme.css` 处的 Tailwind v4 桥接通过 `@theme reference inline` 把 Tailwind 主题变量映射到系统 CSS 变量，因此 `text-primary`、`bg-surface`、`border-border`、`rounded-lg` 和 `shadow-md` 等工具类会与当前主题保持同步，且不会输出相互竞争的运行时声明。"
        },
        {
          "type": "code",
          "label": "globals.css"
        },
        {
          "type": "prose",
          "text": "在任何导入之前预先声明所有层。这样 reset 位于最底层，Tailwind preflight 位于 reset 之上，组件/主题样式位于中间，Tailwind 工具类位于最后，`className` 上的工具类便能有意覆盖组件默认样式。"
        },
        {
          "type": "prose",
          "text": "一个层的排名由页面上第一个声明该层的样式表决定，因此只有 `globals.css` 最先加载时这个顺序才成立。把它设为根布局或应用入口中的第一个导入，放在任何导入 Astryx 或主题 CSS 的模块之前。这包括由 `{@command theme add}` 生成的 `astryx-themes` 模块，以及任何导入了某主题 `theme.css` 的根组件。如果主题样式表先加载，Tailwind preflight 会覆盖 Astryx 的基础样式，主题覆盖也会失效。如果 `globals.css` 无法排在最前，请把 `@layer` 行移到一个单独的 `layers.css` 中，改为最先导入它。"
        },
        {
          "type": "code",
          "label": "根布局或应用入口"
        },
        {
          "type": "code",
          "label": "由系统令牌支撑的 Tailwind 类"
        },
        {
          "type": "prose",
          "text": "Tailwind 桥接是通用互操作模式的具体示例：暴露另一个库的语义 API，但把值指向系统令牌变量。"
        }
      ]
    },
    {
      "section": "Add Astryx to an app that already uses Tailwind",
      "title": "将 Astryx 添加到已使用 Tailwind 的应用",
      "content": [
        {
          "type": "prose",
          "text": "Tailwind 章节中的配方是为新应用准备的完整 `globals.css`。已经使用 Tailwind 的应用会保留自己的文件：它的 `@import \"tailwindcss\"`、`@theme` 映射和 `:root` 变量都保持不变。只需在 Tailwind 导入上方加一行 `@layer`，并在其下方加入 Astryx 样式表。"
        },
        {
          "type": "code",
          "label": "globals.css（现有 Tailwind 应用）"
        },
        {
          "type": "prose",
          "text": "这个配方省略了 `tailwind-theme.css`。该桥接会把 Tailwind 主题名称映射到系统令牌，包括 `rounded-lg` 和 `shadow-md` 等 Tailwind 自带的默认值，因此在现有应用中，它会改变应用自身类所绘制的内容。只有当应用不使用它所映射的名称时，才应添加它。"
        },
        {
          "type": "prose",
          "text": "Astryx 的主题定义了自己的 CSS 自定义属性（颜色、间距、圆角、阴影、字体、动效等），完整列表见 {@link namespace:tokens}。与其中某个名称相同的应用令牌会以两种方式之一发生冲突。应用 `@theme` 键会采用 Astryx 的值，因为 `astryx.css` 在 `:root` 上设置这些令牌，其层级高于 Tailwind 的 `theme` 层：例如 `@theme { --spacing-4: 1.5rem }` 时，应用的 `gap-4` 仍为 16px。把该块标记为 `@theme inline`，应用的实用类就会保留应用自己的值。应用 `:root` 变量会替换 Astryx 的值，因此 Astryx 自己的组件会改变：`:root { --spacing-4: 1.5rem }` 会把 Astryx 的间距步长 4 从 16px 扩大到 24px。在根 Theme 组件再次设置某个令牌（例如 `--color-warning`）的地方，其内部应用自身的规则反而会读取 Astryx 的值。请重命名任何名称相同的应用令牌。"
        },
        {
          "type": "prose",
          "text": "把 `@layer` 行放在应用的 `@import \"tailwindcss\"` 上方，绝不要放在下方。`@layer` 语句只对页面尚未见过的层名排序，而 Tailwind 导入在加载时会命名 `theme`、`base`、`components` 和 `utilities`。放在该导入下方时，语句只能把 `reset`、`astryx-base` 和 `astryx-theme` 添加在 Tailwind 的 `utilities` 之后。这会颠倒级联：Astryx 的 reset 会压过应用中的每个工具类，例如移除应用工具类赋予控件的边框和内边距。这一切不会有任何提示：构建和浏览器控制台都保持干净，源码中的 `@layer` 行看起来也仍然正确，只有渲染后的页面才会暴露问题。"
        },
        {
          "type": "prose",
          "text": "Tailwind 章节中的加载顺序规则仍然适用：`globals.css` 必须是页面加载的第一个样式表，这样它的 `@layer` 行才能最先声明各层。"
        }
      ]
    }
  ]
};
