// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for browser-support.doc.mjs.
export const docsZh = {
  "title": "浏览器支持",
  "description": "Astryx 面向哪些浏览器、依赖哪些现代平台特性，以及如何为你的受众支持较旧的浏览器。",
  "sections": [
    {
      "section": "Overview",
      "title": "概览",
      "content": [
        {
          "type": "prose",
          "text": "Astryx 构建在现代 Web 平台特性之上：[`Popover`](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) API、CSS 锚点定位和 CSS `light-dark()`。这些特性让组件保持小巧、可访问且无依赖，但同时也设定了浏览器能够正确渲染一切的最低要求。"
        },
        {
          "type": "prose",
          "text": "设计系统无法决定自己的流量来自哪里，这由基于它构建的产品决定。这些产品的受众既可能是只使用最新版 Chrome 的内部工具，也可能是仍有相当比例旧版 Safari 用户的公开网站。因此，Astryx 不会像应用那样声明一个统一的硬性浏览器下限，而是定义若干层级，说明每个层级下哪些功能可用，并把最终决定权交给你。请选择与你的受众相匹配的层级。"
        }
      ]
    },
    {
      "section": "Support Tiers",
      "title": "支持层级",
      "content": [
        {
          "type": "prose",
          "text": "Astryx 官方支持第 1 层和第 2 层。第 3 层是尽力而为：组件不会崩溃，但定位和主题效果可能会降级。"
        },
        {
          "type": "table",
          "headers": [
            "层级",
            "基线",
            "代表性版本",
            "用户的实际体验"
          ],
          "rows": [
            [
              "第 1 层：完整保真",
              "当前基线（2026）",
              "Chrome 125+、Edge 125+、Safari 26+、Firefox 147+",
              "一切正常，包括 CSS 锚点定位。这是参考目标。"
            ],
            [
              "第 2 层：功能可用",
              "基线 − 2 年（2024）",
              "Chrome 114+、Edge 114+、Safari 17+、Firefox 125+",
              "组件可以打开、关闭并完全可用。仅缺少锚点定位，因此分层表面（工具提示、菜单、弹出框）可能无法定位在触发元素旁边。"
            ],
            [
              "第 3 层：低于第 2 层",
              "早于基线 − 2",
              "任何更旧的版本",
              "尽力而为。唯一的保证是「不会崩溃」。`light-dark()` 不可用，因此主题颜色可能回退到默认值。"
            ]
          ]
        }
      ]
    },
    {
      "section": "Which Features Set the Floor",
      "title": "哪些特性设定了最低要求",
      "content": [
        {
          "type": "prose",
          "text": "只有三项现代特性对浏览器提出了要求。Astryx 使用的其他特性（`:has()`、`color-mix()`、容器查询、`<dialog>` 元素）自 2023 年或更早便已广泛可用，无需特殊处理。"
        },
        {
          "type": "table",
          "headers": [
            "特性",
            "在 Astryx 中的作用",
            "广泛可用时间"
          ],
          "rows": [
            [
              "CSS 锚点定位",
              "相对于触发元素定位分层表面（工具提示、菜单、弹出框、下拉菜单）。",
              "2026 基线：最严格的要求。"
            ],
            [
              "`Popover` API",
              "通过顶层打开、堆叠分层表面，并支持轻量关闭（light-dismiss）。",
              "2025 基线。"
            ],
            [
              "CSS light-dark()",
              "将每个主题颜色元组编译成一个响应配色方案的值，是整个主题系统的基础。",
              "自 2024 年中起广泛可用。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "真正重要的差距在第 1 层和第 2 层之间：`Popover` API 和 `light-dark()` 的广泛可用时间远早于锚点定位。因此在第 2 层浏览器中，分层表面可以正确打开和关闭，只是没有定位。这是大多数使用者需要重点考虑的唯一特性。"
        }
      ]
    },
    {
      "section": "Which Components Are Affected",
      "title": "哪些组件受到影响",
      "content": [
        {
          "type": "prose",
          "text": "任何会打开菜单、弹出框、工具提示或下拉菜单的组件都带有这项浏览器要求：它会在覆盖层中渲染该表面，并相对于触发元素进行定位。包括："
        },
        {
          "type": "list",
          "items": [
            "Tooltip、HoverCard 和 Popover，以及任何会显示它们的属性（例如 Button 的 `tooltip`）",
            "DropdownMenu、MoreMenu 和 ContextMenu",
            "Selector、MultiSelector、ComplexSelector、Typeahead 和 PowerSearch（下拉表面）",
            "DateInput、DateRangeInput 和 DateTimeInput（日历弹出框）",
            "Tokenizer（建议菜单）",
            "Breadcrumbs、TabList、TopNav 和 SideNav 中的溢出菜单与飞出菜单",
            "Carousel（锚定控件）"
          ]
        },
        {
          "type": "prose",
          "text": "如果你的产品不打开任何菜单、弹出框、工具提示或下拉菜单，就没有锚点定位要求；它只需要 `light-dark()`（第 2 层及以上）来保证主题颜色正确。页面布局、排版、表单、按钮、卡片和表格即使低至第 2 层也能正常工作，无需特殊处理。"
        }
      ]
    },
    {
      "section": "What Astryx Guarantees",
      "title": "Astryx 的保证",
      "content": [
        {
          "type": "list",
          "items": [
            "缺少平台 API 时，组件绝不会抛出异常。当浏览器不支持 `Popover` API 时，层会回退为普通的可见性控制，而不是崩溃。",
            "第 1 层和第 2 层是官方支持并经过测试的。",
            "非分层组件低至第 2 层都能正确渲染。"
          ]
        },
        {
          "type": "list",
          "items": [
            "Astryx 不保证第 1 层（锚点定位）以下的层定位正确。为第 2 层受众弥补这一差距是使用者自己的选择，详见下文。",
            "Astryx 不提供 `light-dark()` 回退方案，因此第 2 层以下的主题颜色不受保证。"
          ]
        }
      ]
    },
    {
      "section": "The On-Screen Keyboard",
      "title": "屏幕键盘",
      "content": [
        {
          "type": "prose",
          "text": "在手机上，响应屏幕键盘的组件——完全展开的 `height='tall'` BottomSheet 和 ChatLayout 的输入区——用同样的方式测量键盘：布局视口高度减去视觉视口高度乘以缩放比例。当视觉视口因键盘而缩小时（例如 iOS 上 Safari 的浏览器模式和主屏幕应用模式、Android 上的 Firefox，以及 Android 上的 Chrome），它们会保持聚焦字段及其周围表面位于键盘上方，并让页面停留在原处。如果 Android 上的 Firefox 平移到了该字段，它们会在几帧内把页面移回原位。"
        },
        {
          "type": "prose",
          "text": "在 Android 上的 Chrome 中，ChatLayout 的输入区会随着 Gboard 的上下滑动跟随键盘移动。高版 BottomSheet 的聚焦字段会随 Gboard 上滑而跟随键盘，也会在字段失焦后随 Gboard 下滑而跟随键盘。滚动空间会一直保留，直到键盘收起。如果 Chrome 延迟报告隐藏（例如按下返回键，此时焦点仍然保留），它会从 Chrome 报告之时开始下滑。键盘状态被报告时，BottomSheet 会在同一帧内把字段放到键盘正上方，因此 Chrome 没有可平移到的被遮挡字段；如果 Chrome 仍然平移，BottomSheet 会在平移结束时把页面移回原位。Chrome 会遵循你的视口设置，Astryx 只在文档中说明这一点，从不设置它：视口 `<meta>` 元素由你的应用负责。默认情况下（`interactive-widget=resizes-visual`），Chrome 会将键盘覆盖在页面上，并平移到页面其他位置的聚焦字段。使用 `interactive-widget=resizes-content` 时，Chrome 会改为缩小布局视口，因此锚定在底部的内容会位于键盘上方，这些组件不会测量到键盘，也不会做任何改变：浏览器已经腾出了空间。"
        },
        {
          "type": "code",
          "label": "Android 上的 Chrome 会为键盘调整页面大小"
        }
      ]
    },
    {
      "section": "Supporting Older Browsers",
      "title": "支持较旧的浏览器",
      "content": [
        {
          "type": "prose",
          "text": "如果你的受众包含第 2 层浏览器，并且你需要正确的层定位，有三种方案可选，按成本从低到高排列。这些都需要你为受众自行决定，Astryx 不会强加任何方案。"
        },
        {
          "type": "list",
          "items": [
            "为锚点定位做 polyfill。在 `@supports` 检查后有条件地加载 CSS 锚点定位 polyfill，这样在第 1 层不产生任何开销。这是获得正确定位的最低成本方式；polyfill 可能无法覆盖所有 position-fallback 特性。",
            "提供 JS 定位回退。用 `CSS.supports(\"anchor-name\", \"--x\")` 检测是否缺少支持，并在返回 false 时使用基于测量的库（例如 floating-element positioner）为层定位。代码更多，但完全可控。",
            "接受定位降级。向你的用户说明，在第 2 层浏览器中分层表面可以正确打开，但可能不会紧挨触发元素显示。成本最低，对于使用最新浏览器的内部工具通常足够。"
          ]
        },
        {
          "type": "prose",
          "text": "在运行时做特性检测，而不是嗅探用户代理："
        },
        {
          "type": "code",
          "label": "特性检测"
        }
      ]
    },
    {
      "section": "How These Tiers Move Over Time",
      "title": "这些层级如何随时间演进",
      "content": [
        {
          "type": "prose",
          "text": "这些层级是滚动更新的，并不固定于特定版本。它们跟随 Web Baseline 年份："
        },
        {
          "type": "list",
          "items": [
            "第 1 层跟随当前 Baseline 年份。",
            "第 2 层跟随 Baseline 减两年。",
            "第 3 层是更旧的一切，仍为尽力而为。"
          ]
        },
        {
          "type": "prose",
          "text": "这不是随意划定的窗口：Baseline − 2 大致就是锚点定位开始不可用、而 `Popover` API 和 `light-dark()` 仍然可用的分界点，因此层级边界跟随的是真实的能力边界，而不是猜测的日期。上面的版本下限大约每年随新的 Baseline 年份发布而审查并前移一次。请始终进行特性检测，而不是硬编码版本号，这样你的应用会随平台演进而自动适配。"
        }
      ]
    }
  ]
};
