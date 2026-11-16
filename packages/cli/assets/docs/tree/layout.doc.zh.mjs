// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for layout.doc.mjs.
export const docsZh = {
  "title": "布局",
  "summary": "由外向内构建应用布局：搭建各区域、组织内容结构、调整间距，然后适配不同宽度。",
  "slots": {
    "guides": {
      "title": "指南"
    }
  },
  "blocks": [
    {
      "i": 0,
      "type": "prose",
      "text": "由外向内构建布局。在编写任何内容之前，先确定外壳及其各区域的预算，然后逐步向内推进。内容优先的布局容易演变成一列带内边距的卡片，因为每个区域最终都会发明自己的容器。"
    },
    {
      "i": 1,
      "type": "list",
      "items": [
        "搭建：选择外壳、为每个区域分配预算，并选择导航方式",
        "结构：为每个区域的内容排列优先级，并选择其容器",
        "间距：让每个区域对齐到同一条内容线，然后设置间隙和密度",
        "断点：决定每个区域在宽度变化时的行为"
      ]
    },
    {
      "i": 2,
      "type": "prose",
      "text": "本指南讨论布局，而非组件 API。运行 `{@command build \"<idea>\"}` 从最接近你的应用类型的模板开始，运行 `{@command component <Name>}` 查看组件的属性。"
    }
  ],
  "sections": []
};
