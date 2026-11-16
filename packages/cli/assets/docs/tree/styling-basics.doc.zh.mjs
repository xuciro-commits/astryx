// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for styling-basics.doc.mjs.
export const docsZh = {
  "title": "基础",
  "description": "样式方案概述：xstyle 属性、Tailwind 集成、className/style 属性以及剩余属性。",
  "sections": [
    {
      "section": "Overview",
      "title": "概览",
      "content": [
        {
          "type": "prose",
          "text": "可以使用 `xstyle`（StyleX）、`className`（Tailwind 或你自己的 CSS），或通过别名映射到 Astryx 令牌的样式库来为组件设置样式。它们最终都解析为同一套令牌。"
        },
        {
          "type": "table",
          "headers": [
            "方案",
            "适用场景",
            "示例"
          ],
          "rows": [
            [
              "StyleX",
              "组件级覆盖、可复用样式、伪类和带类型的令牌",
              "`const styles = stylex.create(...); <Button xstyle={styles.save} />`"
            ],
            [
              "Tailwind 工具类",
              "页面布局、包装容器和工具类样式",
              "`className=\"flex gap-3 p-4\"`"
            ],
            [
              "className",
              "在组件上对接外部 CSS 或 Tailwind",
              "`className=\"my-card shadow-lg\"`"
            ],
            [
              "样式库令牌别名",
              "让 Panda、Chakra、MUI、Emotion、styled-components、UnoCSS、CSS Modules 或 Sass 与设计系统保持同步",
              "`colors.surface = 'var(--color-background-surface)'`"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "无论选择哪种方案，主题和深色模式都能正常工作。外部样式库请参阅 {@link namespace:styling-libraries}；其中涵盖 Tailwind、StyleX、Panda、Chakra、MUI、CSS-in-JS、CSS Modules、Sass，以及用于非 CSS 处理的 `useTheme()`。"
        }
      ]
    },
    {
      "section": "xstyle Prop",
      "title": "xstyle 属性",
      "content": [
        {
          "type": "prose",
          "text": "每个组件都接受 `xstyle` 属性用于自定义样式。它接受通过 `stylex.create()` 创建的 StyleX 样式，不接受内联对象或类名字符串。StyleX 样式在构建时编译，以实现最佳的样式去重和死代码消除。"
        },
        {
          "type": "code",
          "label": "简单覆盖"
        },
        {
          "type": "code",
          "label": "伪类和条件样式"
        },
        {
          "type": "list",
          "items": [
            "所有 xstyle 值都必须来自 stylex.create()",
            "stylex.create 中支持伪类（:hover、:focus-visible）",
            "所有 :hover 样式都必须使用 @media (hover: hover) 保护",
            "非 StyleX 样式（Tailwind、外部 CSS）请改用 className"
          ]
        }
      ]
    },
    {
      "section": "Tailwind Integration",
      "title": "Tailwind 集成",
      "content": [
        {
          "type": "prose",
          "text": "该包附带一个 Tailwind v4 主题桥接，把所有设计令牌映射到 Tailwind 工具类。只需导入一次，即可使用由设计令牌支持的 Tailwind 类：颜色、间距、圆角、阴影和排版都会解析到当前活动主题。"
        },
        {
          "type": "prose",
          "text": "导入方式以及全局 CSS 中需要的级联层顺序，请参阅 {@link generic:tailwind}。"
        },
        {
          "type": "code",
          "label": "Tailwind 工具类与组件并用"
        },
        {
          "type": "prose",
          "text": "该桥接是纯 CSS，不含任何 JS。主题变更（深色模式、自定义主题）会自动生效，因为工具类引用的 CSS 自定义属性与组件使用的是同一套。这是 Tailwind 的推荐路径；其他遵循同样别名模式的样式库请参阅 {@link namespace:styling-libraries}。"
        }
      ]
    },
    {
      "section": "className and style Props",
      "title": "className 和 style 属性",
      "content": [
        {
          "type": "prose",
          "text": "每个组件还接受标准的 `className` 和 `style` 属性。`className` 会追加在组件自身的类名之后。`style` 会在 StyleX 内联样式之后合并，因此发生冲突时使用方的值优先。"
        },
        {
          "type": "code",
          "label": "className 搭配 Tailwind 工具类"
        },
        {
          "type": "prose",
          "text": "布局和包装容器样式适合在 className 上使用 Tailwind 工具类。组件级覆盖（内边距、颜色、边框）建议使用 xstyle；它可以与 StyleX 去重和组件内部的样式管线集成。"
        }
      ]
    },
    {
      "section": "Rest Props (Prop Drilling)",
      "title": "剩余属性（Prop Drilling）",
      "content": [
        {
          "type": "prose",
          "text": "组件扩展 HTML 属性，并把剩余属性展开到根 DOM 元素上。这意味着 data-* 属性、aria-* 属性、事件处理函数和其他 HTML 属性都会自动透传。"
        },
        {
          "type": "code",
          "label": "数据属性、事件处理函数和 ARIA"
        },
        {
          "type": "code",
          "label": "Ref 转发"
        },
        {
          "type": "prose",
          "text": "少数 HTML 属性被有意从基础类型中省略（contentEditable、dangerouslySetInnerHTML）。children 也不在基础类型中；接受 children 的组件会显式声明它，因此基于插槽的组件不会悄悄丢弃 JSX children。"
        }
      ]
    }
  ]
};
