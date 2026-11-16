// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for tokens-shadow.doc.mjs.
export const docsZh = {
  "title": "阴影令牌",
  "description": "高度阴影（低、中、高）以及用于输入框状态环的内阴影。",
  "sections": [
    {
      "section": "Shadow Tokens",
      "title": "阴影令牌",
      "content": [
        {
          "type": "prose",
          "text": "高度阴影（低、中、高）以及用于输入框状态环的内阴影。"
        },
        {
          "type": "table",
          "headers": [
            "令牌",
            "Core 默认值"
          ],
          "rows": [
            [
              "--shadow-low",
              "0px 1px 1px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), 0px 2px 8px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2))"
            ],
            [
              "--shadow-med",
              "0px 1px 2px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), 0px 2px 12px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2))"
            ],
            [
              "--shadow-high",
              "0px 2px 2px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), 0px 8px 24px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))"
            ],
            [
              "--shadow-inset-hover",
              "inset 0px 0px 0px 2px light-dark(rgba(5, 54, 89, 0.15), rgba(223, 226, 229, 0.2))"
            ],
            [
              "--shadow-inset-selected",
              "inset 0px 0px 0px 2px rgba(1, 113, 227, 0.5)"
            ],
            [
              "--shadow-inset-success",
              "inset 0px 0px 0px 2px rgba(38, 167, 86, 0.3)"
            ],
            [
              "--shadow-inset-warning",
              "inset 0px 0px 0px 2px rgba(226, 164, 0, 0.3)"
            ],
            [
              "--shadow-inset-error",
              "inset 0px 0px 0px 2px rgba(227, 25, 59, 0.3)"
            ]
          ]
        }
      ]
    }
  ]
};
