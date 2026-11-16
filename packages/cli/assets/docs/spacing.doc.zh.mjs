// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for spacing.doc.mjs.
export const docsZh = {
  "title": "间距",
  "description": "用于内边距、间隙和外边距的间距刻度令牌：设计系统布局的节奏基础。",
  "sections": [
    {
      "section": "Overview",
      "title": "概览",
      "content": [
        {
          "type": "prose",
          "text": "设计系统使用以 4px 为基础单位的间距刻度，并以 rem 表示，因此间隙和内边距会像文字一样随读者的浏览器字号一起缩放：每一档为 0.25rem，在默认 16px 根字号下即 4px。组件的 `gap` 属性接受映射到这些令牌的档位值。该刻度在小尺寸端（2px、4px、6px）提供精细控制，在较大尺寸（4px 的倍数）下保持一致节奏。"
        }
      ]
    },
    {
      "section": "Scale",
      "title": "刻度",
      "content": [
        {
          "type": "prose",
          "text": "共十五个间距令牌，从 0 到 3rem（在默认 16px 根字号下为 0px 到 48px）。"
        },
        null
      ]
    },
    {
      "section": "Usage",
      "title": "用法",
      "content": [
        {
          "type": "prose",
          "text": "Stack、HStack、VStack、Grid、Toolbar、OverflowList 和 ChatMessageList 接受 `gap` 档位：0、0.5、1、1.5、2、3、4、5、6、8 或 10（×4px）。Carousel 接受 0 到 4 的档位。对于自定义布局，请在 StyleX 中使用间距令牌。"
        },
        {
          "type": "code",
          "label": "通过组件属性与 StyleX 设置间距"
        }
      ]
    },
    {
      "section": "Best Practices",
      "title": "最佳实践",
      "content": [
        {
          "type": "list",
          "items": [
            "在可用时使用组件的 gap 属性；它们会处理自动间距补偿。",
            "为保持一致性，请遵循该刻度。如果某个值不在刻度上，请重新考虑设计。",
            "紧凑的内部间距使用较小的档位（0.5–2），区块之间的间隙使用较大的档位（4–8）。"
          ]
        },
        {
          "type": "list",
          "items": [
            "使用刻度之外的任意像素值。",
            "在同一组件中混用间距令牌和原始 px/rem 值。"
          ]
        }
      ]
    }
  ]
};
