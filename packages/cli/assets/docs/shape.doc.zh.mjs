// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for shape.doc.mjs.
export const docsZh = {
  "title": "形状",
  "description": "用于统一组件圆角的边框半径令牌，从尖角到完整胶囊形。",
  "sections": [
    {
      "section": "Overview",
      "title": "概览",
      "content": [
        {
          "type": "prose",
          "text": "半径阶梯使用语义化命名体系：inner → element → container → page。每一级都对应特定场景。主题可以通过半径乘数缩放整个阶梯，并以 --radius-none 和 --radius-full 作为固定锚点。"
        }
      ]
    },
    {
      "section": "Radius Scale",
      "title": "半径阶梯",
      "content": [
        {
          "type": "prose",
          "text": "七个半径令牌，从 0px 到 9999px。"
        },
        null
      ]
    },
    {
      "section": "Concentric Radius",
      "title": "同心圆角",
      "content": [
        {
          "type": "prose",
          "text": "在带内边距的圆角容器内部，将嵌套元素的半径设为外侧半径减去内边距，使弧线保持同心。Card 不会为你的内容执行此计算。"
        },
        {
          "type": "code",
          "label": "同心圆角公式"
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
            "交互控件（按钮、输入框、选择器）使用 --radius-element。",
            "内容容器（卡片、面板、对话框）使用 --radius-container。",
            "胶囊形状（徽章、标签、头像状态点）使用 --radius-full。"
          ]
        },
        {
          "type": "list",
          "items": [
            "不要把小元素用 --radius-page；它本意是用于页面级容器。",
            "不要硬编码半径值；它们不会随主题的半径乘数缩放。"
          ]
        }
      ]
    }
  ]
};
