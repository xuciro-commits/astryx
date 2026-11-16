// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Avatar',
  displayName: 'Avatar',
  group: 'Avatar',
  category: 'Content',
  keywords: ["avatar","profile","user","photo","thumbnail","initials","gravatar","pfp","userpic"],
  usage: {
    description:
      'Avatar represents a person or team with a profile photo, initials, or a default icon. Use it in comment headers, contact lists, chat messages, user cards, and anywhere you need to identify someone visually.',
    bestPractices: [
      {guidance: true, description: 'Always pass a name so the avatar can show initials if the photo fails to load, and so screen readers can announce who it represents.'},
      {guidance: true, description: 'Pick a size that matches the context: xsm or sm for inline mentions, md or lg for lists and cards, xl for profile headers.'},
      {guidance: true, description: 'Add a status dot when knowing someone\'s availability matters, like in chat or team views.'},
      {guidance: true, description: 'When wrapping an Avatar in your own Tooltip or HoverCard, set tooltip={false} so the built-in name tooltip does not overlap yours.'},
      {guidance: true, description: 'Give every interactive avatar (href or onClick) a name or alt. It is the control\'s accessible name, and it warns in development when it is missing.'},
      {guidance: false, description: 'Rely on a status label to name an interactive avatar. "Online" says nothing about where the link goes.'},
      {guidance: false, description: 'Use Avatar for logos, product images, or anything that isn\'t a person or team. Use an image or icon instead.'},
      {guidance: false, description: 'Use xstyle or className to override shape. Use the shape prop instead so themes can control it globally.'},
    ],
    anatomy: [
      {name: 'Photo', required: false, description: 'The profile image, loaded from the src URL. Shown when available.'},
      {name: 'Initials', required: false, description: 'The first letter, digit or emoji of the first and last words of the name; punctuation is skipped. Shown when no photo is available. A name with no letters, digits or emoji shows the default icon instead. Like the photo, the initials are part of the picture: assistive technology reads the name, not the letters.'},
      {name: 'Default icon', required: false, description: 'A generic person silhouette. Shown when there is no photo or name.'},
      {name: 'Status dot', required: false, description: 'A small indicator in the bottom-right corner showing availability (online, away, busy). Each variant pairs colour with a distinct shape so status does not rely on colour alone.'},
    ],
  },
  theming: {
    targets: [
      {className: 'astryx-avatar', visualProps: ['size', 'shape']},
      {className: 'astryx-avatar-fallback', visualProps: ['size']},
      {className: 'astryx-avatar-status-dot', visualProps: ['variant']},
      {className: 'astryx-avatar-status-dot-glyph', visualProps: ['shape']},
    ],
    vars: [
      {name: '--_avatar-group-overlap', description: 'Negative inline offset applied to every avatar stacked in an AvatarGroup; the group pads its start edge by the same amount so the first avatar stays inside it. Set from the group size; a more negative value tightens the stack.', default: 'set at runtime from the group avatar size (px)', private: true},
      {name: '--_avatar-radius', description: 'Border radius of the avatar wrapper, content, focus ring, and the AvatarGroupOverflow "+N" chip. Set per shape variant by shapeStyles.', default: 'var(--radius-full)', private: true},
    ],
    derived: [
      {property: 'borderRadius', vars: ['--_avatar-radius']},
    ],
  },
  description: 'Displays a user avatar with image, initials fallback, and optional status indicator.',
  props: [
    {
      name: 'src',
      type: 'string',
      description: 'Primary image source URL.',
    },
    {
      name: 'fallbackSrc',
      type: 'string',
      description: 'Fallback image when primary fails.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'User name for initials and alt text.',
    },
    {
      name: 'alt',
      type: 'string',
      description: 'Alt text (falls back to name).',
    },
    {
      name: 'size',
      type:
        "'xsm' | 'sm' | 'md' | 'lg' | 'xl' | 16 | 20 | 24 | 32 | 36 | 40 | 48 | 60 | 64 | 72 | 96 | 128 | 144 | 180",
      description:
        "Avatar size: named sizes are 'xsm' (20px), 'sm' (24px), 'md' (36px), 'lg' (48px), and 'xl' (128px); numeric sizes must be one of the pixel values listed in the type. Inside an AvatarGroup, the group's size always overrides this prop, including when the group uses its default size.",
      default: "'md'",
    },
    {
      name: 'shape',
      type: "'circle' | 'rounded' | 'square'",
      description: "Shape variant of the avatar. 'circle' (default) stays fully round. 'rounded' uses the element radius token so it matches UI corner rounding and can be set globally via theme. 'square' has no radius. Status dot positioning adapts automatically: 4-o'clock on circle, bottom-right corner on rounded/square.",
      default: "'circle'",
    },
    {
      name: 'status',
      type: 'ReactNode',
      description: 'Corner content for status indicators. AvatarStatusDot reports its `label` to the avatar, which composes it into the accessible name (e.g. "Jane Doe, Online") so screen readers announce the status. Reporting goes through context, so it still works when the dot sits inside a wrapper component of your own.',
      slotElements: [
        {
          __element: 'AvatarStatusDot',
          props: {
            variant: 'success',
            label: 'Online',
          },
        },
      ],
    },
    {
      name: 'tooltip',
      type: 'string | boolean',
      description:
        "Tooltip shown on hover and keyboard focus. Omitted or true shows the avatar's name; a string shows that text instead; false shows no tooltip. Not auto-disabled when wrapped in your own Tooltip/HoverCard. Set tooltip={false} if you supply your own overlay. No tooltip is shown when tooltip is true/omitted and there is no name.",
      default: 'true',
    },
    {
      name: 'href',
      type: 'string',
      description:
        'When set, the avatar renders as an interactive link (`<a>` or a custom link component) pointing here. This follows the same element-swap rule as Button. Requires a meaningful accessible name via `alt` or `name`: an interactive avatar without one warns in development. Inside an AvatarGroup, interactive avatars share a single Tab stop and are reached with arrow keys.',
    },
    {
      name: 'as',
      type: 'ElementType',
      description:
        'Custom link component used when `href` is set (e.g. `next/link`). Overrides the provider-level LinkProvider default. Only applies with `href`.',
    },
    {
      name: 'target',
      type: 'string',
      description: 'Link target attribute. Only applies with `href`.',
    },
    {
      name: 'rel',
      type: 'string',
      description: 'Link rel attribute. Only applies with `href`.',
    },
    {
      name: 'onClick',
      type: '(e: MouseEvent) => void',
      description:
        'Click handler. When set without `href`, the avatar renders as a focusable `<button type="button">`. Requires a meaningful accessible name via `alt` or `name`: an interactive avatar without one warns in development.',
    },
  ],
  components: [
    {name: 'AvatarStatusDot'},
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "Avatar 用头像照片、首字母或默认图标来表示一个人或团队。可用于评论头部、联系人列表、聊天消息、用户卡片，以及任何需要通过视觉识别某人的地方。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "始终传入 name，这样照片加载失败时头像可以显示首字母，屏幕阅读器也能朗读出头像代表的是谁。"
      },
      {
        "guidance": true,
        "description": "选择与场景匹配的尺寸：行内提及时用 xsm 或 sm，列表和卡片用 md 或 lg，个人资料头部用 xl。"
      },
      {
        "guidance": true,
        "description": "当需要了解某人的可用状态时（例如聊天或团队视图中），添加状态圆点。"
      },
      {
        "guidance": true,
        "description": "如果用自定义的 Tooltip 或 HoverCard 包裹 Avatar，请设置 tooltip={false}，以免内置的姓名提示与自定义提示重叠。"
      },
      {
        "guidance": true,
        "description": "为每个可交互头像（href 或 onClick）提供 name 或 alt。它是控件的无障碍名称，缺失时开发环境会给出警告。"
      },
      {
        "guidance": false,
        "description": "不要依赖状态标签来命名可交互头像。“Online”并不能说明链接指向哪里。"
      },
      {
        "guidance": false,
        "description": "不要用 Avatar 表示徽标、产品图片或任何非个人或团队的内容，请改用图片或图标。"
      },
      {
        "guidance": false,
        "description": "不要用 xstyle 或 className 覆盖形状，请改用 shape 属性，以便主题全局控制。"
      }
    ],
    "anatomy": [
      {
        "name": "照片",
        "required": false,
        "description": "从 src URL 加载的个人资料图片。可用时显示。"
      },
      {
        "name": "首字母",
        "required": false,
        "description": "姓名首尾单词的首字母、数字或 emoji；标点会被跳过。没有可用照片时显示。如果姓名中没有任何字母、数字或 emoji，则改为显示默认图标。与照片一样，首字母属于图片的一部分：辅助技术读取的是姓名，而不是这些字母。"
      },
      {
        "name": "默认图标",
        "required": false,
        "description": "通用的用户剪影。没有照片或姓名时显示。"
      },
      {
        "name": "状态圆点",
        "required": false,
        "description": "右下角的小型指示器，显示可用状态（在线、离开、忙碌）。每种变体都将颜色与独特的形状搭配，使状态不只依赖颜色传达。"
      }
    ]
  },
  "name": "Avatar",
  "description": "显示用户头像，支持图片、首字母回退和可选的状态指示器。",
  "propDescriptions": {
    "src": "主图片源 URL。",
    "fallbackSrc": "主图片加载失败时使用的备用图片。",
    "name": "用于生成首字母和替代文本的用户姓名。",
    "alt": "替代文本（回退到 name）。",
    "size": "头像尺寸：命名尺寸包括 'xsm'（20px）、'sm'（24px）、'md'（36px）、'lg'（48px）和 'xl'（128px）；数字尺寸必须是类型中列出的像素值之一。在 AvatarGroup 内，组的尺寸始终覆盖此属性，即使组使用默认尺寸也是如此。",
    "shape": "头像的形状变体。'circle'（默认）保持完全圆形。'rounded' 使用元素圆角令牌，以便与 UI 的圆角保持一致，并可通过主题全局设置。'square' 没有圆角。状态圆点的定位会自动适配：圆形在 4 点钟方向，rounded 和 square 在右下角。",
    "status": "状态指示器的角落内容。AvatarStatusDot 会向头像上报其 `label`，头像将其组合进无障碍名称（例如 “Jane Doe, Online”），以便屏幕阅读器朗读状态。上报通过 context 进行，因此即使圆点位于你自己封装的组件内也能生效。",
    "tooltip": "悬停和键盘聚焦时显示的提示。省略或为 true 时显示头像的姓名；传入字符串则显示该文本；为 false 时不显示提示。用自定义 Tooltip 或 HoverCard 包裹时不会自动禁用。如果你自行提供浮层，请设置 tooltip={false}。当 tooltip 为 true 或省略且没有 name 时不显示提示。",
    "href": "设置后，头像会渲染为指向此处的可交互链接（`<a>` 或自定义链接组件）。这遵循与 Button 相同的元素替换规则。需要通过 `alt` 或 `name` 提供有意义的无障碍名称：缺少名称的可交互头像在开发环境会给出警告。在 AvatarGroup 内，可交互头像共享一个 Tab 停靠点，并用方向键访问。",
    "as": "设置 `href` 时使用的自定义链接组件（例如 `next/link`）。覆盖 provider 级别的 LinkProvider 默认值。仅在设置 `href` 时适用。",
    "target": "链接的 target 属性。仅在设置 `href` 时适用。",
    "rel": "链接的 rel 属性。仅在设置 `href` 时适用。",
    "onClick": "点击处理函数。在未设置 `href` 时设置，头像会渲染为可聚焦的 `<button type=\"button\">`。需要通过 `alt` 或 `name` 提供有意义的无障碍名称：缺少名称的可交互头像在开发环境会给出警告。"
  },
  "components": [
    {
      "name": "AvatarStatusDot",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'person/team avatar w/ photo → initials → icon fallback chain',
  usage: {
    description:
      'Avatar represents a person or team with a profile photo, initials, or a default icon. Falls back automatically. Use in comment headers, contact lists, chat, user cards.',
    bestPractices: [
      {guidance: true, description: 'Always pass a name for initials fallback and screen reader alt text.'},
      {guidance: true, description: 'Match size to context: xsm/sm inline, md/lg in lists, xl for profiles.'},
      {guidance: true, description: 'Add a status dot in chat or team views where availability matters.'},
      {guidance: true, description: 'When wrapping Avatar in your own Tooltip or HoverCard, set tooltip={false} so the built-in name tooltip does not overlap yours.'},
      {guidance: true, description: 'Interactive avatars (href/onClick) need name or alt; without one they warn in development.'},
      {guidance: false, description: 'Rely on a status label to name an interactive avatar. "Online" says nothing about where the link goes.'},
      {guidance: false, description: 'Use for logos or product images. Use an image or icon instead.'},
      {guidance: false, description: 'Force a square or custom shape. Avatars are always circular.'},
    ],
  },
  propDescriptions: {
    src: 'primary image source URL',
    fallbackSrc: 'fallback image when primary fails',
    name: 'user name for initials and alt text',
    alt: 'alt text; falls back to name',
    size: "named sizes: 'xsm' 20px, 'sm' 24px, 'md' 36px, 'lg' 48px, 'xl' 128px; numeric px restricted to values listed in the type. AvatarGroup's size always wins, default included.",
    status:
      'corner content for status indicators; AvatarStatusDot reports its `label`, composed into the avatar accessible name ("Jane Doe, Online"), at any nesting depth',
    tooltip:
      "hover/focus tooltip. true/omitted → name; string → that text; false → none. Owns its tooltip; set false when wrapping in your own Tooltip/HoverCard. Default true.",
    href: 'renders avatar as a link (<a>/custom). Needs alt/name for an accessible name; warns in development without one. Button-style element swap.',
    as: 'custom link component for href (e.g. Next Link). Only with href.',
    target: 'link target. Only with href.',
    rel: 'link rel. Only with href.',
    onClick: 'click handler → renders <button> when no href. Needs alt/name; warns in development without one.',
  },
  components: [
    {name: 'AvatarStatusDot', description: 'size-aware status indicator rendered in the Avatar corner'},
  ],
};
