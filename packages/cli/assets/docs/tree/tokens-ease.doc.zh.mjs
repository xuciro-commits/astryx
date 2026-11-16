// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for tokens-ease.doc.mjs.
export const docsZh = {
  "title": "缓动令牌",
  "description": "用于动画和过渡的缓动曲线。在主题的两个 `motion` 调节项中，`character` 设定 `--ease-entrance` 和 `--ease-move`：`crisp` 减速且不越界，`expressive` 轻微越界，在 `standard` 下两者都等于 `--ease-standard`；`--ease-exit` 在任何 character 下都保持自己的曲线。`tempo` 不影响曲线。时长比例自身的字段优先于调节项，显式的 `tokens` 优先于一切。这里的任何曲线都不影响跟随手指或系统的动效（拖动、惯性、橡皮筋效果、屏幕键盘），而且按压的计时、悬停意图延迟和手势阈值无论在何种 character 下都保持其时序。",
  "sections": [
    {
      "section": "Easing Tokens",
      "title": "缓动令牌",
      "content": [
        {
          "type": "prose",
          "text": "用于动画和过渡的缓动曲线。在主题的两个 `motion` 调节项中，`character` 设定 `--ease-entrance` 和 `--ease-move`：`crisp` 减速且不越界，`expressive` 轻微越界，在 `standard` 下两者都等于 `--ease-standard`；`--ease-exit` 在任何 character 下都保持自己的曲线。`tempo` 不影响曲线。时长比例自身的字段优先于调节项，显式的 `tokens` 优先于一切。这里的任何曲线都不影响跟随手指或系统的动效（拖动、惯性、橡皮筋效果、屏幕键盘），而且按压的计时、悬停意图延迟和手势阈值无论在何种 character 下都保持其时序。"
        },
        {
          "type": "table",
          "headers": [
            "令牌",
            "Core 默认值"
          ],
          "rows": [
            [
              "--ease-standard",
              "cubic-bezier(0.24, 1, 0.4, 1)"
            ],
            [
              "--ease-entrance",
              "cubic-bezier(0.24, 1, 0.4, 1)"
            ],
            [
              "--ease-move",
              "cubic-bezier(0.24, 1, 0.4, 1)"
            ],
            [
              "--ease-exit",
              "cubic-bezier(0.3, 0, 0.6, 0.6)"
            ]
          ]
        }
      ]
    }
  ]
};
