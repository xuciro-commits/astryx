// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for side-panels.doc.mjs.
export const docsZh = {
  "title": "侧面板",
  "description": "添加主从式侧面板：选中行时打开，而不是跳转到其他页面。",
  "sections": [
    {
      "section": "Side panels",
      "title": "侧面板",
      "content": [
        {
          "type": "prose",
          "text": "主从模式：选中一行时会打开固定宽度的侧面板，而不是跳转离开。"
        },
        {
          "type": "list",
          "items": [
            "将 LayoutPanel 放在 Layout 的 start 或 end 槽位中，并设置固定的宽度预算",
            "使用 hasDivider 将其与内容区域分隔开；使用 isScrollable 让较长的详情自行滚动",
            "如需用户可调整宽度，请将 useResizable() 与面板内边缘的 ResizeHandle 搭配使用：在 start 槽位中放在面板之后，在 end 槽位中配合 isReversed 放在面板之前",
            "此时由拖拽手柄负责分隔线，因此面板应设置 hasDivider={false}",
            "未选中任何内容时渲染 EmptyState，确保该区域不会塌陷"
          ]
        },
        {
          "type": "code",
          "label": "固定面板，然后是可变宽度的形式"
        },
        {
          "type": "prose",
          "text": "验证：在窄宽度下，面板会让出宽度而不是挤压内容（参见响应式指南），并且两个区域之间只有一个元素绘制边框。"
        }
      ]
    }
  ]
};
