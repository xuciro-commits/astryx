// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for grade-template-with-agent.doc.mjs.
export const docsZh = {
  "title": "使用智能体评分并改进",
  "description": "为智能体提供评分标准和证据，让它能够发现问题、生成可复现的评分卡，并改进模板。",
  "sections": [
    {
      "section": "Give the agent the rubric",
      "title": "向智能体提供评分标准",
      "content": [
        {
          "type": "prose",
          "text": "针对模板评分标准 1.4，对某一个确切的包修订版进行评分。为智能体提供模板 ID、包名，以及一个能安装打包后包的干净应用，然后使用此提示词。替换每个尖括号中的值。第一轮为只读，以便原始分数和发现保持可见。"
        },
        {
          "type": "code",
          "label": "智能体评分提示词"
        }
      ]
    },
    {
      "section": "Require a scorecard",
      "title": "要求提供评分卡",
      "content": [
        null,
        {
          "type": "prose",
          "text": "各类别分数之和必须恰好等于总分，等级来自已公布的区间。仅当分数为 75 或更高，且每个包、文案、构建、资源及渲染应用检查都通过时，结论才为 `yes`。"
        }
      ]
    },
    {
      "section": "Improve and regrade",
      "title": "改进并重新评分",
      "content": [
        {
          "type": "list",
          "items": [
            "先修复发布阻塞问题。",
            "修复每个合理的扣分项，不要用辅助组件或包 CSS 将其隐藏。",
            "再次打包，复制到全新应用，并让智能体重复完整评分。保留之前的评分卡，以便改进可见。",
            "仅当不存在合理的修复空间时才停止，并记录每个仍然扣分的有意取舍。"
          ]
        }
      ]
    }
  ]
};
