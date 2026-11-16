// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for calendar-systems.doc.mjs.
export const docsZh = {
  "title": "日历系统",
  "description": "选择日历、哪些日历需要 Temporal、服务端渲染、阴阳历以及周数。",
  "sections": [
    {
      "section": "Choose a calendar",
      "title": "选择日历",
      "content": [
        {
          "type": "prose",
          "text": "`Calendar` 默认显示公历，除非你选择其他日历。将 `calendar` 传给 `<InternationalizationProvider>` 可为某个子树设置日历。仅设置区域设置永远不会改变日历：在传入 `calendar=\"persian\"` 之前，`fa-IR` 会以波斯语显示公历日期。带有 `-u-ca-` 关键字的区域设置（例如 `th-TH-u-ca-buddhist`）同样会保留公历日期；请设置 `calendar` 来选择日历。"
        },
        {
          "type": "code",
          "label": "波斯语界面中的波斯历日期"
        },
        {
          "type": "prose",
          "text": "日历与语言相互独立：`locale=\"en\" calendar=\"hebrew\"` 会用英语显示希伯来历日期。`Calendar` 也接受自己的 `calendar`，其优先级高于提供者。当同一屏幕并排显示两种日历时，请使用它。"
        },
        {
          "type": "prose",
          "text": "取值永远不会随日历改变。`value`、`defaultValue`、`onChange`、`min` 和 `max` 在任何日历下都保持公历 ISO 日期（`YYYY-MM-DD`），因此你的数据、服务端代码和现有处理函数都能继续工作。"
        }
      ]
    },
    {
      "section": "Supported calendars",
      "title": "支持的日历",
      "content": [
        {
          "type": "table",
          "headers": [
            "日历",
            "标识符",
            "需要 Temporal"
          ],
          "rows": [
            [
              "公历",
              "`gregory`, `iso8601`",
              "否"
            ],
            [
              "佛历",
              "`buddhist`",
              "否"
            ],
            [
              "民国纪年",
              "`roc`",
              "否"
            ],
            [
              "日本年号",
              "`japanese`",
              "否"
            ],
            [
              "波斯历",
              "`persian`",
              "是"
            ],
            [
              "印度国定历",
              "`indian`",
              "是"
            ],
            [
              "希伯来历",
              "`hebrew`",
              "是"
            ],
            [
              "伊斯兰历",
              "`islamic-umalqura`, `islamic-civil`, `islamic-tbla`",
              "是"
            ],
            [
              "中国农历",
              "`chinese`",
              "是"
            ],
            [
              "韩国农历",
              "`dangi`",
              "是"
            ],
            [
              "科普特历",
              "`coptic`",
              "是"
            ],
            [
              "埃塞俄比亚历",
              "`ethiopic`, `ethioaa`",
              "是"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "任何其他标识符（例如 `islamic`）都会显示公历日期，并在开发环境中警告一次。"
        }
      ]
    },
    {
      "section": "Load Temporal where the runtime lacks it",
      "title": "在运行时缺少 Temporal 时加载",
      "content": [
        {
          "type": "prose",
          "text": "月份不是公历的日历会使用运行时的 `Temporal` 来确定月份长度、闰月和年份。Chrome 和 Edge 144 及更高版本、Firefox 139 及更高版本以及 Node.js 26 及更高版本已内置该功能。Safari 和较旧的运行时则不包含。Astryx 不捆绑任何 polyfill，因此仅使用公历的应用不会付出任何额外成本。"
        },
        {
          "type": "prose",
          "text": "在缺少 `Temporal` 的环境中，请在应用渲染之前加载 `temporal-polyfill` 的完整构建。默认构建只包含公历（`gregory` 和 `iso8601`）。请仅在缺少 `Temporal` 的地方加载它：对于阴阳历，原生实现更准确。"
        },
        {
          "type": "code",
          "label": "仅在缺少 Temporal 时加载 polyfill"
        },
        {
          "type": "prose",
          "text": "如果在服务端渲染，也请在服务端加载它。`Calendar` 会在渲染期间解析其日历，因此没有 `Temporal` 的服务端会渲染公历日期，而具备 `Temporal` 的浏览器会渲染波斯历日期，进而导致水合失败。当两者都有 `Temporal` 或都缺少它时，它们会渲染相同的标记。"
        },
        {
          "type": "prose",
          "text": "如果缺少支持该日历的 `Temporal`，需要它的日历会显示公历日期，并在开发环境中于服务端和浏览器各警告一次。与公历对齐的日历（佛历、民国纪年和日本年号）在没有它的情况下可在任何环境中使用。"
        }
      ]
    },
    {
      "section": "Lunisolar calendars",
      "title": "阴阳历",
      "content": [
        {
          "type": "prose",
          "text": "在阴阳历中，月份从天文学计算出的新月开始，而各运行时对其中少数几个新月的判定并不一致。Astryx 遵循运行时的 `Temporal`，不会对其进行修正。"
        },
        {
          "type": "list",
          "items": [
            "Chrome、Edge、Firefox 和 Node.js 26 中的原生 `Temporal` 在 1900 年至 2100 年间与天文台官方数据一致。",
            "polyfill 则改为读取平台的 `Intl` 数据。在 polyfill 下，Node.js 24 在该范围内有九个中国农历月份和四个韩国农历月份的起始日与原生结果相差一天：2027 年中国农历年的第一个月在原生 `Temporal` 下从 2 月 6 日开始，在 polyfill 下则从 2 月 7 日开始。Safari 使用同类 `Intl` 数据，因此预计那里也会出现相同差异。",
            "在同一个浏览器内，用户看到的日期数字、屏幕阅读器播报的日期以及用户选取的值是一致的。只有两个不同的运行时才可能不一致。"
          ]
        },
        {
          "type": "prose",
          "text": "如果在服务端渲染，使用不同实现的服务端和浏览器可能对其中某个月份的起始日判断不一致。浏览器随后渲染该月份的方式会与服务端标记不同，React 会在水合期间于客户端重新渲染该部分。`temporal-polyfill/full/global` 导入会在存在原生 `Temporal` 时保留它，因此单靠该导入，Chrome、Edge 和 Firefox 仍使用原生 `Temporal`，而 Node.js 24 服务端则使用 polyfill。当这些日历在服务端与浏览器中渲染出相同标记比匹配官方数据更重要时，请在渲染之前于服务端和浏览器中调用来自 `temporal-polyfill/full/shim` 的 `installImplementation()`：即使存在原生 `Temporal`，它也会安装 polyfill。具备原生 `Temporal` 的服务端运行时（例如 Node.js 26）也能与原生浏览器保持一致。否则，不要替换原生 `Temporal`：那会降低原生环境的准确性。"
        }
      ]
    },
    {
      "section": "Week numbers",
      "title": "周数",
      "content": [
        {
          "type": "prose",
          "text": "`Calendar` 的 `hasWeekNumbers` 会在所有日历中显示 ISO 8601 周数。Temporal 仅为 `iso8601`（采用 ISO 8601 周数的公历）定义周编号。"
        }
      ]
    }
  ]
};
