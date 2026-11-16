// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for write-good-templates.doc.mjs.
export const docsZh = {
  "title": "如何编写优质模板",
  "summary": "编写值得信赖的模板：了解“优质”的含义、为其评分的评分标准，以及如何让 Agent 为模板评分。",
  "slots": {
    "guides": {
      "title": "指南"
    }
  },
  "blocks": [
    {
      "i": 0,
      "type": "prose",
      "text": "优质模板不只是能渲染。它要为应用提供一个清晰的产品起点：易于理解、可安全修改，并且在 Astryx 将其复制出包后仍然完整。评分标准会对这种质量打分，让你在构建过程中随时评估。"
    },
    {
      "i": 1,
      "type": "list",
      "items": [
        "在读者阅读每个细节之前，其用途和主要任务就清晰明了。",
        "它组合使用 Astryx 组件，而不是用原生 HTML 或自定义样式重新实现组件行为。",
        "其层级、间距、交互和阅读顺序在窄宽度下以及所有支持的色彩模式中仍然有效。",
        "其源码、导入、样式、字体、图标、图像和媒体在复制后的位置仍然正常工作。",
        "其元数据让模板易于查找，并准确说明何时使用它。",
        "其示例内容足够真实，能够暴露溢出、空白和层级问题。"
      ]
    },
    {
      "i": 2,
      "type": "prose",
      "text": "为第一个可运行版本评分，并在每次源码、文档、依赖或资源变更后再次评分，每次发布前进行完整评分。请将源码、文档、复制后的文件和渲染后的应用放在一起评分；单独任何一项都不够。"
    },
    {
      "i": 3,
      "type": "list",
      "items": [
        "阅读 {@link generic:template-grading-rubric} 中的每条评分规则。",
        "先修复发布阻断问题，再处理每一项合理的扣分项。",
        "在干净的应用中，对打包后的包重复完整评分（{@link generic:test-template-in-app}）。",
        "要让 Agent 为模板评分并改进模板，请使用 {@link generic:grade-template-with-agent}。"
      ]
    },
    {
      "i": 4,
      "type": "prose",
      "text": "将每份评分卡与其包版本和评分标准版本保存在一起。"
    }
  ],
  "sections": []
};
