// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TabBar',
  displayName: 'Tab Bar',
  category: 'Navigation',
  keywords: [
    'tabbar',
    'tab bar',
    'bottom tabs',
    'bottom navigation',
    'bottom bar',
    'tab bar controller',
    'mobile navigation',
    'app sections',
    'badge',
    'more tab',
    'overflow tabs',
  ],
  description:
    "The bottom tab bar of a phone app, as on iOS 26: the app's top-level sections as a floating capsule above the bottom edge, with a selection lens that slides to the chosen tab. Each tab has an icon, a label and an optional badge. Under a finger, on iOS and Android alike, it behaves like iOS 26's: the lens lifts into glass as a finger lands, follows a finger dragged across the tabs and settles on the tab nearest where it lifts, while the bar flexes; under a mouse, a press is a plain button press: a click chooses a tab and the lens follows the theme's motion. With no tab selected, a held finger highlights the tab under it. Choosing the selected tab again scrolls its panel to the top and is reported separately, so a screen can also return to its root as iOS does. With more than five tabs the bar shows the first four and a More tab, and TabBarMoreList lists the rest. Experimental: lands in lab first.",
  components: [
    {
      name: 'TabBar',
      displayName: 'Tab Bar',
      description:
        "The bar. It sits fixed at the bottom of the viewport, over the page, so leave 83 px of room at the bottom of the scrolling content, and declare it on LayerProvider (inset={{blockEnd: 83}}) so menus, popovers and toasts clear it. You own the selection: pass the selected tab's value and update it in onChange.",
      props: [
        {
          name: 'value',
          type: 'string',
          description: "The selected tab's value.",
          required: true,
        },
        {
          name: 'onChange',
          type: '(value: string) => void',
          description:
            "Called with a tab's value when a different tab is chosen: a finger lifted over it (after a tap or a drag across the bar), a click, or Enter or Space on a focused tab.",
          required: true,
        },
        {
          name: 'onReselect',
          type: '(value: string) => void',
          description:
            "Called with the selected tab's value when it is chosen again, for example to return the tab's navigation stack to its root, as iOS does. On every reselect TabBar also scrolls the tab's panel (panelId) to its top.",
        },
        {
          name: 'label',
          type: 'string',
          description:
            'Names the tab bar for assistive technology. Without it, or aria-label or aria-labelledby (which win over it and reach the tab list), the tab list is named "Tabs" in the reader\'s language.',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description:
            'The tabs: TabBarItem elements, in order, as direct children. With more than five, the bar shows the first four and a More tab that holds the rest.',
          required: true,
        },
        {
          name: 'moreValue',
          type: 'string',
          description:
            "The More tab's value, with more than five tabs. Choosing More calls onChange with it (and onReselect while More holds a tab, to return to its list); More reads as selected while value is moreValue or any tab past the fourth. Render TabBarMoreList while value is moreValue, and a section chosen there inside More's own navigation stack.",
          default: "'more'",
        },
      ],
    },
    {
      name: 'TabBarItem',
      displayName: 'Tab Bar Item',
      description:
        'One tab: its value, label, icon and badge. TabBar reads its props and draws it; it renders nothing on its own.',
      props: [
        {
          name: 'value',
          type: 'string',
          description: 'Identifies the tab in value, onChange and onReselect.',
          required: true,
        },
        {
          name: 'label',
          type: 'string',
          description:
            "The tab's name, shown under its icon. Keep it to one short word.",
          required: true,
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description:
            "The tab's icon, an Icon at size lg. It is drawn in the current text colour, and in the accent colour while selected.",
          required: true,
        },
        {
          name: 'selectedIcon',
          type: 'ReactNode',
          description:
            'The icon while the tab is selected, typically its filled variant. Defaults to icon.',
        },
        {
          name: 'badge',
          type: 'string | number',
          description:
            'A badge over the icon\'s top-trailing corner: a count or a short string such as "!". It appears, changes and disappears without animating. Omit it or pass an empty string for none.',
        },
        {
          name: 'badgeLabel',
          type: 'string',
          description:
            'What assistive technology reads for the badge after the tab\'s label, such as "3 unread". Defaults to the badge itself.',
        },
        {
          name: 'panelId',
          type: 'string',
          description:
            "Id of the panel this tab controls, wired up as aria-controls. Put the same id on the section's panel element. Choosing the selected tab again scrolls that panel to its top: the panel itself when it scrolls, or else the first scroll area inside it.",
        },
        {
          name: 'aria-disabled',
          type: "boolean | 'true' | 'false'",
          description:
            "Disables the tab, as on Core's Tab: it stays focusable but dimmed and is never chosen. A tap, a click or a key on it, or a lift over it, selects nothing, and the arrow keys skip it. A finger that lands on it lifts no lens until it drags or reaches an enabled tab, which the lift then chooses. This differs from iOS on purpose. iOS ignores a touch that starts on a disabled tab, but TabBar follows the action-group rule: the tab you lift on acts.",
        },
      ],
    },
  ],
  usage: {
    description:
      "Use TabBar to switch between an app's three to five top-level sections on a phone, each keeping its own state and navigation stack. Keep each section's navigation stack in the app and return it to its root in onReselect.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep every tab visible and the set stable; give each a short label and an outline icon with a filled selectedIcon.',
      },
      {
        guidance: true,
        description:
          'Keep to five tabs where you can; with more, put the sections people use most first, since the rest move into More.',
      },
      {
        guidance: true,
        description:
          'Use a badge for something that needs attention in that section, such as unread items, and say what it counts in badgeLabel.',
      },
      {
        guidance: true,
        description:
          "Give each tab a panelId naming its section's panel, so assistive technology can associate the two. Put the section's content in a ScrollableArea inside that panel, so choosing the tab again scrolls it to the top.",
      },
      {
        guidance: true,
        description:
          'Disable a tab only while its section cannot open, and keep it in place, so the other tabs do not move.',
      },
      {
        guidance: false,
        description:
          "Don't use it for actions, for filters within one screen (use SegmentedControl) or for tabs inside a page (use TabList).",
      },
    ],
  },
};

export const docsZh = {
  "name": "TabBar",
  "displayName": "Tab Bar",
  "description": "手机应用的底部标签栏，如同 iOS 26：应用的顶层分区以浮动胶囊形式位于底边上方，选择透镜会滑动到所选标签。每个标签都有图标、标签和可选徽标。在手指下，无论在 iOS 还是 Android 上，它的行为都像 iOS 26：手指落下时透镜抬升为玻璃质感，跟随在标签间拖动的手指，并在抬起时停靠到最接近的标签上，同时栏会弯曲。在鼠标下，按下就是普通按钮按下：点击选择标签，透镜跟随主题动效。没有选中标签时，按住的手指会高亮其下的标签。再次选择已选中的标签会将其面板滚动到顶部，并单独上报，因此屏幕也可以像 iOS 那样返回根级。标签多于五个时，栏显示前四个和一个“More”标签，TabBarMoreList 列出其余标签。实验性：先落地于 lab。",
  "usage": {
    "description": "使用 TabBar 在手机上切换应用的三个到五个顶层分区，每个分区保留自己的状态和导航栈。将每个分区的导航栈保存在应用中，并在 onReselect 中将其返回到根级。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持每个标签可见且集合稳定；为每个标签提供简短标签和轮廓图标，并设置填充的 selectedIcon。"
      },
      {
        "guidance": true,
        "description": "尽量保持在五个标签以内；如果更多，请将人们最常使用的分区放在前面，因为其余会移入 More。"
      },
      {
        "guidance": true,
        "description": "为需要在该分区中关注的内容（例如未读项）使用徽标，并在 badgeLabel 中说明它统计的是什么。"
      },
      {
        "guidance": true,
        "description": "为每个标签提供一个 panelId，命名其分区的面板，以便辅助技术将两者关联。将该分区的内容放在该面板内的 ScrollableArea 中，这样再次选择该标签时会将其滚动到顶部。"
      },
      {
        "guidance": true,
        "description": "仅当分区无法打开时才禁用标签，并保持其位置不变，以免其他标签移动。"
      },
      {
        "guidance": false,
        "description": "不要将其用于操作、单个屏幕内的筛选（请使用 SegmentedControl）或页面内的标签页（请使用 TabList）。"
      }
    ]
  },
  "components": [
    {
      "name": "TabBar",
      "description": "标签栏。它固定在视口底部并覆盖页面，因此在滚动内容的底部预留 83 px 空间，并在 LayerProvider 上声明它（inset={{blockEnd: 83}}），让菜单、弹出层和 Toast 避开它。选择由你管理：传入所选标签的值，并在 onChange 中更新。",
      "propDescriptions": {
        "value": "所选标签的值。",
        "onChange": "当选择了不同的标签时，以该标签的值调用：手指在其上方抬起（轻点或横跨栏拖动之后）、点击，或聚焦标签上的 Enter 或 Space。",
        "onReselect": "当所选标签再次被选择时，以该标签的值调用，例如将标签的导航栈返回根级，如同 iOS。每次重新选择时，TabBar 还会将该标签的面板（panelId）滚动到顶部。",
        "label": "为辅助技术命名标签栏。如果没有它，或没有 aria-label 或 aria-labelledby（它们优先于它并到达标签列表），标签列表将以阅读器语言命名为“Tabs”。",
        "children": "标签：按顺序作为直接子元素的 TabBarItem 元素。超过五个时，栏显示前四个和一个包含其余标签的 More 标签。",
        "moreValue": "标签多于五个时，More 标签的值。选择 More 会以它调用 onChange（当 More 持有标签时还会调用 onReselect，以返回其列表）；当 value 为 moreValue 或任何第四个之后的标签时，More 都显示为选中。当 value 为 moreValue 时渲染 TabBarMoreList，并在 More 自己的导航栈中选择其中的分区。"
      }
    },
    {
      "name": "TabBarItem",
      "description": "一个标签：其值、标签、图标和徽标。TabBar 读取其属性并绘制它；它本身不渲染任何内容。",
      "propDescriptions": {
        "value": "在 value、onChange 和 onReselect 中标识标签。",
        "label": "标签的名称，显示在其图标下方。保持为一个简短的词。",
        "icon": "标签的图标，尺寸为 lg 的 Icon。它使用当前文本颜色绘制，选中时使用强调色。",
        "selectedIcon": "标签选中时的图标，通常是其填充变体。默认使用 icon。",
        "badge": "图标右上角的徽标：计数或诸如“!”的短字符串。它出现、变化和消失时都不带动画。省略它或传入空字符串表示不显示。",
        "badgeLabel": "辅助技术在标签标签之后为徽标读取的内容，例如“3 unread”。默认为徽标本身。",
        "panelId": "此标签所控制的面板的 Id，作为 aria-controls 接线。将该 Id 放在分区的面板元素上。再次选择已选中的标签会将该面板滚动到顶部：如果面板本身可滚动则滚动面板，否则滚动其中的第一个滚动区域。",
        "aria-disabled": "禁用标签，如同 Core 的 Tab：它保持可聚焦但变暗，且永远不会被选择。在其上轻点、点击或按键，或在其上方抬起，都不会选择任何内容，方向键会跳过它。落在其上的手指在拖动或到达可用标签之前不会抬起透镜，到达后由抬起操作选择。这与 iOS 有意不同。iOS 会忽略从禁用标签开始的触摸，但 TabBar 遵循操作组规则：你在其上抬起的标签会执行操作。"
      }
    }
  ]
};
