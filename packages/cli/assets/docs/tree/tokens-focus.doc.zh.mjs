// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for tokens-focus.doc.mjs.
export const docsZh = {
  "title": "焦点令牌",
  "description": "所有绘制焦点环的组件共享的键盘焦点环。覆盖这些令牌可重新设置整个系统的焦点样式。",
  "sections": [
    {
      "section": "Focus Tokens",
      "title": "焦点令牌",
      "content": [
        {
          "type": "prose",
          "text": "所有绘制焦点环的组件共享的键盘焦点环。覆盖这些令牌可重新设置整个系统的焦点样式。"
        },
        {
          "type": "table",
          "headers": [
            "令牌",
            "Core 默认值"
          ],
          "rows": [
            [
              "--focus-outline-width",
              "2px"
            ],
            [
              "--focus-outline-style",
              "solid"
            ],
            [
              "--focus-outline-color",
              "var(--color-accent)"
            ],
            [
              "--focus-outline-offset",
              "3px"
            ]
          ]
        }
      ]
    }
  ]
};
