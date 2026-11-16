// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Card',
  displayName: 'Card',
  group: 'Card',
  category: 'Container',
  keywords: ["card","surface","panel","container","elevated","shadow","box","paper","tile","well"],
  usage: {
    description:
      'Card is a bordered, elevated container for discrete, self-contained items: things you could reorder, remove, or interact with independently. Cards are NOT the default layout tool. Most content groups don\'t need a container at all; spacing and alignment create visual grouping naturally. Only reach for a Card when items need clear interaction boundaries or visual comparison in a grid.',
    bestPractices: [
      {guidance: true, description: 'Ask "could I reorder or remove this independently?" If yes, it\'s a card. If no, it\'s just a section of the page: use a heading + Stack or Section.'},
      {guidance: true, description: 'Use cards for discrete items: a single user profile, a single notification, a single metric, a product in a grid. Each card represents one "thing" with clear interaction boundaries.'},
      {guidance: true, description: 'Spacing and alignment alone create visual grouping. Not everything needs a container; try removing the card and see if the grouping is still clear from whitespace and typography.'},
      {guidance: true, description: 'Keep padding consistent across sibling cards so they align visually in a grid or list.'},
      {guidance: true, description: 'Pair a card with Layout when you need a structured header, scrollable content, and footer with actions.'},
      {guidance: true, description: 'Let cards share a row or grid on a phone: a card shrinks to fit its track and clips content that cannot wrap at its edge. Truncate long IDs, hashes, and URLs with Text maxLines={1} (the full value shows in a tooltip), and give wide content its own scroll region: Table scrolls by itself; put code or other wide content in a ScrollableArea.'},
      {guidance: false, description: 'Default to cards for visual grouping. A heading + Stack with proper spacing creates hierarchy without adding borders everywhere. Cards should be the exception, not the default.'},
      {guidance: false, description: 'Wrap page sections in cards. "General Settings", "Notification Preferences", form groups: these are page regions, use Section or heading + stack.'},
      {guidance: false, description: 'Create identical card grids (icon + heading + text, repeated). Vary the layout or question whether cards are needed at all.'},
      {guidance: false, description: 'Nest cards inside other cards; flatten the hierarchy or use spacing and dividers instead.'},
      {guidance: false, description: 'Use color variants for status; use Banner or Badge for that. Color cards are for categorization.'},
    ],
    anatomy: [
      {name: 'Container', required: true, description: 'The outer box with border, background, border-radius, and padding.'},
      {name: 'Content', required: true, description: 'Any children rendered inside the card. Often a stack of heading, text, and actions.'},
    ],
  },
  props: [
    {
      name: 'width',
      type: 'SizeValue',
      description: 'Width of the card (number = pixels, string = used as-is). In a flex row or grid track this is the preferred width: the card shrinks below it when the row is narrower. To hold the width in a flex row, wrap the card in StackItem (static by default) and let the row wrap or scroll. In Grid, set a consumer minWidth on the Card and size the track accordingly.',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description: 'Height of the card (number = pixels, string = used as-is).',
    },
    {
      name: 'maxWidth',
      type: 'SizeValue',
      description: 'Maximum width of the card.',
    },
    {
      name: 'minHeight',
      type: 'SizeValue',
      description: 'Minimum height of the card.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content to render inside the card.',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        "Internal padding using the spacing scale. Omit it and the card takes the theme's card padding rather than a step, so passing a step is a decision to override the theme, not a way to restate the default.",
      default: "the theme's card padding (spacing step 4 with no theme)",
    },
    {
      name: 'variant',
      type: "'default' | 'transparent' | 'muted' | 'blue' | 'cyan' | 'gray' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'",
      description:
        'Background color variant. `default` uses the standard card background. `transparent` drops the background entirely. `muted` uses the muted background for de-emphasised cards. The non-semantic variants use the corresponding `--color-background-<name>` token.',
      default: "'default'",
    },
    {
      name: 'elevation',
      type: "'none' | 'low' | 'med' | 'high'",
      description:
        'Resting shadow depth. `none` is flat; `low`/`med`/`high` map to the shadow token scale. Raise a card only when it needs to float above surrounding content.',
      default: "'none'",
    },
  ],
  examples: [
    {
      label: 'Cards sharing a row on a phone, with long IDs',
      code: `
import {Card} from '@astryxdesign/core/Card';
import {Grid} from '@astryxdesign/core/Grid';
import {VStack} from '@astryxdesign/core/VStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';

const payouts = [
  {label: 'Payout', amount: '$1,240.00', id: 'po_1Q8ZK4X7M2N5P3R6T9V1W4YB'},
  {label: 'Refund', amount: '-$86.50', id: 're_3NfK9Lm2Qx7Vb4Tz8Rw1Hy6C'},
  {label: 'Adjustment', amount: '$12.00', id: 'adj_7Hq2Wm9Kx4Lz8Vn3Rb6Tf1PD'},
];

// Each card takes one grid track and shrinks with it, so three cards fit a
// 390px phone without widening the page. The ID cannot wrap, so it truncates
// with maxLines={1} (the full value shows in a tooltip) instead of running
// past the card edge.
function PayoutCards() {
  return (
    <Grid columns={3} gap={3}>
      {payouts.map(payout => (
        <Card key={payout.id}>
          <VStack gap={1}>
            <Heading level={3}>{payout.label}</Heading>
            <Text hasTabularNumbers>{payout.amount}</Text>
            <Text type="supporting" maxLines={1}>
              {payout.id}
            </Text>
          </VStack>
        </Card>
      ))}
    </Grid>
  );
}
`,
    },
  ],
  playground: {
    defaults: {
      children: {
        __element: 'VStack',
        props: {gap: 2},
        children: [
          {__element: 'Heading', props: {level: 3}, children: 'Card Title'},
          {__element: 'Text', props: {type: 'body'}, children: 'Card content goes here. This is a standard card with a heading and body text.'},
        ],
      },
    },
  },
  theming: {
    container: true,
    targets: [
      {className: 'astryx-card', visualProps: ['variant', 'elevation']},
    ],
    vars: [
      {name: '--_card-radius', description: 'Border radius of the card', default: 'var(--radius-container)', private: true},
      {name: '--_card-elevation', description: 'Resting shadow of the card, set from the elevation prop. Composed into the card box-shadow list alongside --_card-ring rather than written as boxShadow directly, so a ring and an elevation can coexist.', default: '0 0 transparent', private: true},
      {name: '--_card-ring', description: 'Inset ring drawn in the card box-shadow list. SelectableCard sets it to show selection without taking over the shadow.', default: '0 0 transparent', private: true},
    ],
    derived: [
      {property: 'borderRadius', vars: ['--_card-radius']},
      {property: 'padding', expand: 'container'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Card",
  "displayName": "Card",
  "usage": {
    "description": "Card 是一个带边框、带高度的容器，用于离散、自包含的条目：可以独立重排、移除或交互的内容。卡片不是默认的布局工具。大多数内容分组根本不需要容器；间距和对齐会自然形成视觉分组。只有当条目需要明确的交互边界或在网格中进行视觉比较时，才使用 Card。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "问自己“我可以独立重排或移除它吗？”可以，它就是卡片。不可以，它只是页面中的一个区块：使用标题 + Stack 或 Section。"
      },
      {
        "guidance": true,
        "description": "将卡片用于离散条目：单个用户资料、单条通知、单个指标、网格中的一件商品。每张卡片代表一个有明确交互边界的“事物”。"
      },
      {
        "guidance": true,
        "description": "仅靠间距和对齐就能形成视觉分组。并非一切都需要容器；试着移除卡片，看看分组是否仍能通过留白和排版清晰呈现。"
      },
      {
        "guidance": true,
        "description": "让同级卡片的 `padding` 保持一致，以便它们在网格或列表中视觉对齐。"
      },
      {
        "guidance": true,
        "description": "当需要结构化页眉、可滚动内容和带操作的页脚时，将卡片与 Layout 搭配使用。"
      },
      {
        "guidance": true,
        "description": "在手机上让卡片共享一行或网格：卡片会收缩以适应其轨道，并在边缘处裁剪无法换行的内容。对长 ID、哈希和 URL 使用 `Text maxLines={1}` 截断（完整值会显示在 Tooltip 中），并为宽内容提供独立滚动区域：Table 本身会滚动；将代码或其他宽内容放入 ScrollableArea。"
      },
      {
        "guidance": false,
        "description": "默认将卡片用于视觉分组。带合适间距的标题 + Stack 就能建立层级，而无需到处添加边框。卡片应是例外，而不是默认选择。"
      },
      {
        "guidance": false,
        "description": "用卡片包裹页面区块。“General Settings”、“Notification Preferences”、表单组：这些是页面区域，请使用 Section 或标题 + 堆栈。"
      },
      {
        "guidance": false,
        "description": "创建完全相同的卡片网格（图标 + 标题 + 文本，重复排列）。应改变布局，或质疑是否真的需要卡片。"
      },
      {
        "guidance": false,
        "description": "在其他卡片内嵌套卡片；应展平层级，或改用间距和分隔线。"
      },
      {
        "guidance": false,
        "description": "将颜色变体用于状态；该场景请使用 Banner 或 Badge。彩色卡片用于分类。"
      }
    ],
    "anatomy": [
      {
        "name": "容器",
        "required": true,
        "description": "带边框、背景、border-radius 和内边距的外部盒子。"
      },
      {
        "name": "内容",
        "required": true,
        "description": "卡片内渲染的任意子元素。通常是由标题、文本和操作组成的堆栈。"
      }
    ]
  },
  "props": [
    {
      "name": "width",
      "type": "SizeValue",
      "description": "卡片的宽度（数字 = 像素，字符串 = 按原样使用）。在 flex 行或网格轨道中，这是首选宽度：当行更窄时卡片会收缩到其以下。要在 flex 行中保持宽度，请将卡片包裹在 StackItem 中（默认 static），并让该行换行或滚动。在 Grid 中，在 Card 上设置消费方 `minWidth`，并相应调整轨道尺寸。"
    },
    {
      "name": "height",
      "type": "SizeValue",
      "description": "卡片的高度（数字 = 像素，字符串 = 按原样使用）。"
    },
    {
      "name": "maxWidth",
      "type": "SizeValue",
      "description": "卡片的最大宽度。"
    },
    {
      "name": "minHeight",
      "type": "SizeValue",
      "description": "卡片的最小高度。"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "在卡片内渲染的内容。"
    },
    {
      "name": "padding",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "使用间距刻度的内部内边距。省略时，卡片采用主题的卡片内边距而不是某个刻度值，因此传入刻度值意味着决定覆盖主题，而不是重述默认值。",
      "default": "the theme's card padding (spacing step 4 with no theme)"
    },
    {
      "name": "variant",
      "type": "'default' | 'transparent' | 'muted' | 'blue' | 'cyan' | 'gray' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'",
      "description": "背景颜色变体。`default` 使用标准卡片背景。`transparent` 完全去除背景。`muted` 使用弱化背景以表示不强调的卡片。非语义变体使用相应的 `--color-background-<name>` 令牌。",
      "default": "'default'"
    },
    {
      "name": "elevation",
      "type": "'none' | 'low' | 'med' | 'high'",
      "description": "静止阴影深度。`none` 为扁平；`low`/`med`/`high` 映射到阴影令牌刻度。仅当卡片需要浮在周围内容上方时才提升。",
      "default": "'none'"
    }
  ],
  "theming": {
    "container": true,
    "targets": [
      {
        "className": "astryx-card",
        "visualProps": [
          "variant",
          "elevation"
        ]
      }
    ],
    "vars": [
      {
        "name": "--_card-radius",
        "description": "Border radius of the card",
        "default": "var(--radius-container)",
        "private": true
      },
      {
        "name": "--_card-elevation",
        "description": "Resting shadow of the card, set from the elevation prop.",
        "default": "0 0 transparent",
        "private": true
      },
      {
        "name": "--_card-ring",
        "description": "Inset ring drawn in the card box-shadow list.",
        "default": "0 0 transparent",
        "private": true
      }
    ],
    "derived": [
      {
        "property": "borderRadius",
        "vars": [
          "--_card-radius"
        ]
      },
      {
        "property": "padding",
        "expand": "container"
      }
    ]
  },
  "propDescriptions": {
    "width": "卡片的宽度（数字 = 像素，字符串 = 按原样使用）。在 flex 行或网格轨道中，这是首选宽度：当行更窄时卡片会收缩到其以下。要在 flex 行中保持宽度，请将卡片包裹在 StackItem 中（默认 static），并让该行换行或滚动。在 Grid 中，在 Card 上设置消费方 `minWidth`，并相应调整轨道尺寸。",
    "height": "卡片的高度（数字 = 像素，字符串 = 按原样使用）。",
    "maxWidth": "卡片的最大宽度。",
    "minHeight": "卡片的最小高度。",
    "children": "在卡片内渲染的内容。",
    "padding": "使用间距刻度的内部内边距。省略时，卡片采用主题的卡片内边距而不是某个刻度值，因此传入刻度值意味着决定覆盖主题，而不是重述默认值。",
    "variant": "背景颜色变体。`default` 使用标准卡片背景。`transparent` 完全去除背景。`muted` 使用弱化背景以表示不强调的卡片。非语义变体使用相应的 `--color-background-<name>` 令牌。",
    "elevation": "静止阴影深度。`none` 为扁平；`low`/`med`/`high` 映射到阴影令牌刻度。仅当卡片需要浮在周围内容上方时才提升。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'bordered container for DISCRETE items; NOT the default layout tool. Most content doesn\'t need a card.',
  usage: {
    description:
      'Card is for discrete items with clear interaction boundaries (one profile, one notification, one product). Cards are NOT the default. Spacing and alignment create visual grouping without borders. Ask: "could I reorder or remove this independently?" If no, don\'t use a card.',
    bestPractices: [
      {guidance: true, description: 'Ask "could I reorder/remove this independently?" If yes, it\'s a card. If no, it\'s just a page section: use heading + Stack or Section.'},
      {guidance: true, description: 'Use cards for discrete items: one profile, one notification, one metric, one product in a grid. Each card = one "thing" w/ clear interaction boundaries.'},
      {guidance: true, description: 'Spacing + alignment alone create visual grouping. Not everything needs a container; try removing the card; if grouping still reads from whitespace + typography, skip it.'},
      {guidance: true, description: 'Keep padding consistent across sibling cards so they align visually in a grid or list.'},
      {guidance: true, description: 'Pair a card w/ Layout when you need a structured header, scrollable content, and footer with actions.'},
      {guidance: true, description: 'Card shrinks to its row/grid track, clips unwrappable content at its edge. Long IDs/hashes/URLs → Text maxLines={1} (tooltip shows full value). Wide content → own scroll region (Table scrolls itself; ScrollableArea otherwise).'},
      {guidance: false, description: 'Default to cards for grouping. Heading + Stack w/ proper spacing creates hierarchy w/o borders everywhere. Cards are the exception, not the default.'},
      {guidance: false, description: 'Wrap page sections in cards. "General Settings", "Notification Preferences", form groups are page regions; use Section or heading + stack.'},
      {guidance: false, description: 'Create identical card grids (icon + heading + text, repeated). Vary the layout or question whether cards are needed at all.'},
      {guidance: false, description: 'Nest cards inside other cards; flatten the hierarchy or use spacing + dividers instead.'},
      {guidance: false, description: 'Use color variants for status; use Banner or Badge for that instead. Color cards are for categorization.'},
    ],
  },
  propDescriptions: {
    width: 'card width (number=px, string=as-is)',
    height: 'card height (number=px, string=as-is)',
    maxWidth: 'max card width',
    minHeight: 'min card height',
    children: 'content inside card',
    padding: "internal padding via spacing scale; omitted = the theme's card padding, NOT a fixed step. Passing a step overrides the theme.",
    variant: 'background color variant; `default` = standard card bg, `transparent` = no background at all, `muted` = muted bg for de-emphasised cards; non-semantic variants use the corresponding `--color-background-<name>` token',
    elevation: 'resting shadow depth: none (flat) | low | med | high (shadow token scale). Raise only to float above content.',
  },
};
