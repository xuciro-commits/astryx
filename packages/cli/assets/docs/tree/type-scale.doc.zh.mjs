// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for type-scale.doc.mjs.
export const docsZh = {
  "title": "字号阶梯",
  "description": "行高、语义化字号阶梯令牌、展示文本、Heading 和 Text 组件、通过 defineTheme 自定义字号阶梯，以及在 iOS 上跟随读者的文字大小。",
  "sections": [
    {
      "section": "Line Height",
      "title": "行高",
      "content": [
        {
          "type": "prose",
          "text": "行高由分级目标比例计算，并对齐到 4px 的垂直网格。小号文本（<20px）目标比例为 1.5，中号文本（20–31px）为 1.4，大号文本（≥32px）为 1.25。系统强制最小间距为 fontSize + 4px。结果是存储在每项 --text-*-leading 令牌中的无单位比例。"
        },
        {
          "type": "prose",
          "text": "4px 网格很重要：每个行框都对齐到 4px 的增量，这能让基线、间距和组件高度保持可预测。当你提供基准值和比例时，expandTypeScale 工具会自动计算这些值，因此你永远不需要手动设置 line-height。"
        }
      ]
    },
    {
      "section": "Type Scale",
      "title": "字号阶梯",
      "content": [
        {
          "type": "prose",
          "text": "将字号、字重和行高组合为单一文本样式的语义化令牌。每个令牌三元组（--text-*-size、--text-*-weight、--text-*-leading）由 Text 和 Heading 使用。请使用组件属性，而不要组合原始的字体令牌。"
        },
        null
      ]
    },
    {
      "section": "Display Text",
      "title": "展示文本",
      "content": [
        {
          "type": "prose",
          "text": "展示变体（display-1、display-2、display-3）在 heading-1 之上延续等比数列，步长分别为 +6、+5 和 +4。它们使用常规字重（400）而非半粗体，并使用更紧的行高（约 1.2），因为大号文本在行距较小时阅读效果更好。展示文本类型用于主视觉横幅、营销标题和数据标注，不用于文档标题。"
        },
        {
          "type": "prose",
          "text": "展示文本通常需要标题语义以满足无障碍要求。使用 Heading 上的 type 属性来应用展示样式，同时保留正确的 HTML 元素：`<Heading level={1} type=\"display-1\">` 可在使用 `<h1>` 标签的同时获得 display-1 样式，从而让屏幕阅读器看到正确的文档大纲。"
        }
      ]
    },
    {
      "section": "Headings and text",
      "title": "标题与文本",
      "content": [
        {
          "type": "prose",
          "text": "使用 `Heading` 表达文档结构，其他内容使用 `Text`；二者都会将各自的属性映射到字号阶梯令牌。"
        },
        {
          "type": "code",
          "label": "用于文档结构的 Heading"
        },
        {
          "type": "code",
          "label": "用于正文、标签和展示文本的 Text"
        }
      ]
    },
    {
      "section": "Custom type scale",
      "title": "自定义字号阶梯",
      "content": [
        {
          "type": "prose",
          "text": "通过 `defineTheme` 中的 `base` 和 `ratio` 更改整个字号梯度；每个字号和行高都会根据它们重新计算。"
        },
        {
          "type": "code",
          "label": "通过 defineTheme 自定义字号阶梯"
        }
      ]
    },
    {
      "section": "Following the reader's text size on iOS",
      "title": "在 iOS 上跟随读者的文字大小",
      "content": [
        {
          "type": "prose",
          "text": "在 iPhone 上，读者会在「设置」（显示与文字大小，然后是更大字体）中选择文字大小，原生应用会随之放大或缩小文本。每个主题在 iPhone 的 Safari 中也是如此，它通过 `font: -apple-system-body` 暴露该选择：每个字号都会按照它所对应的 iOS 文本样式曲线跟随读者的选择，因此正文文本像 Body 一样缩放，`heading-1` 像 Title 1，展示文本像 Large Title，每个角色都保持其顺序。主题以长度固定的字号（例如 12px 的辅助字号）默认按照它所读取的阶梯曲线缩放；以 `em` 或 `%` 表示的字号跟随其父级，读取变量的字号跟随该变量。在默认大小下，每个字号都是主题自身的值。字体系列、间距、圆角和根字号始终不变，行高保持其比例，文本输入框在 iOS 上保持 16px 的下限；在 Android 上，系统字体缩放会通过 `env(preferred-text-scale)` 放大每个字号（在浏览器报告该值时）；两者都不支持的浏览器看不到任何变化。无需开启任何东西：没有主题选项、属性或文档特性开关。"
        },
        {
          "type": "prose",
          "text": "文本输入框等固定高度的控件会保持其高度，因此在无障碍字号下文本可能溢出。带标签的 `Button` 会随其标签一起增大。"
        }
      ]
    }
  ]
};
