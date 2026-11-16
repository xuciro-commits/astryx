// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for template-assets.doc.mjs.
export const docsZh = {
  "title": "资源",
  "summary": "确保模板的样式、字体、图标、图像和视频在应用复制模板后仍然正常显示。",
  "slots": {
    "guides": {
      "title": "指南"
    }
  },
  "blocks": [
    {
      "i": 0,
      "type": "prose",
      "text": "被复制的文件不会一并带走同级资源（{@link generic:write-the-template-file}）。请为每个资源指定唯一的归属方："
    },
    {
      "i": 1,
      "type": "table",
      "headers": [
        "归属方",
        "适用场景",
        "复制后的源码如何获取它"
      ],
      "rows": [
        [
          "被复制的源码",
          "值较小、可编辑，且属于起始点",
          "将其保留在 `.tsx` 文件中"
        ],
        [
          "集成包",
          "资源应随包集中维护",
          "导入稳定的公开包路径"
        ],
        [
          "应用",
          "应用必须提供特定于产品的内容或品牌信息",
          "使用明确的占位符或应用公开 URL，并说明需要替换什么"
        ]
      ]
    },
    {
      "i": 2,
      "type": "prose",
      "text": "不要让模板看起来是自包含的，却依赖未在文档中说明的包文件或应用约定。"
    }
  ],
  "sections": []
};
