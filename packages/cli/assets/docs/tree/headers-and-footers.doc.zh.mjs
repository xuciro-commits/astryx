// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for headers-and-footers.doc.mjs.
export const docsZh = {
  "title": "页眉和页脚",
  "description": "在主体滚动时固定页眉或页脚，使标题和提交操作始终可达。",
  "sections": [
    {
      "section": "Headers and footers",
      "title": "页眉和页脚",
      "content": [
        {
          "type": "prose",
          "text": "区域可以在主体滚动时固定页眉或页脚。两者都是 Layout 的插槽，在 Layout 上设置一次的内边距会作用于全部三个部分，因此页眉、主体和页脚共享同一条内容基线。"
        },
        {
          "type": "list",
          "items": [
            "页眉插槽中的 LayoutHeader：区域标题及其主要操作",
            "当页眉包含交互控件时，用 Toolbar 代替 LayoutHeader",
            "页脚插槽中的 LayoutFooter：用于提交工作且必须保持可达的操作",
            "Layout 上的 defaultHasDividers 会同时为两者添加分隔线，而不用为每个插槽单独设置 hasDivider"
          ]
        },
        {
          "type": "code",
          "label": "围绕滚动主体的固定页眉和页脚"
        },
        {
          "type": "prose",
          "text": "验证：滚动主体。页眉和页脚保持原位，其分隔线通栏延伸，并且三者仍共享同一条左侧内容基线。"
        }
      ]
    }
  ]
};
