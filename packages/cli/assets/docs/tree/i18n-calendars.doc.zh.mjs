// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for i18n-calendars.doc.mjs.
export const docsZh = {
  "title": "其他日历",
  "description": "在值保持公历 ISO 日期的情况下，以波斯历、希伯来历、回历、佛历、日本历及其他日历显示日期。",
  "sections": [
    {
      "section": "Show dates in another calendar",
      "title": "在其他日历中显示日期",
      "content": [
        {
          "type": "prose",
          "text": "在 `<InternationalizationProvider>` 上为某个子树设置 `calendar`，或直接在 `Calendar` 上设置；未设置时，`Calendar` 使用公历。在所有日历中，值始终是公历 ISO 日期（`YYYY-MM-DD`）。"
        },
        {
          "type": "code",
          "label": "波斯语界面中的波斯历日期"
        },
        {
          "type": "prose",
          "text": "大多数日历需要运行时的 `Temporal`。Safari 和较旧的运行时缺少它：请在那里（服务器端和浏览器端）加载 `temporal-polyfill/full/global`。否则，这些日历会显示公历日期。支持的日历、服务端渲染以及阴阳历，参见 {@link namespace:calendars}。"
        }
      ]
    }
  ]
};
