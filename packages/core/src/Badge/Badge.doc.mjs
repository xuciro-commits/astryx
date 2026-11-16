// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Badge',
  displayName: 'Badge',
  category: 'Feedback & Status',
  keywords: ["badge","tag","chip","label","status","indicator","count","counter","pill","notification","marker"],
  props: [
    {
      name: 'variant',
      type: "'neutral' | 'info' | 'success' | 'warning' | 'error' | 'blue' | 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'",
      description:
        'Visual style variant. Semantic variants (neutral, info, success, warning, error) use solid backgrounds. Non-semantic color variants use tinted backgrounds with colored text for categorization and tagging.',
      default: "'neutral'",
    },
    {
      name: 'label',
      type: 'ReactNode',
      required: true,
      description:
        'Badge text content. A badge is one line and at least as tall as that line of its label, so it grows with its text (a larger text size); a label wider than the space available is cut with an ellipsis rather than escaping its container; a string or number label is also set as the badge\'s title so the full text stays reachable on hover.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Optional leading icon.',
      slotElements: [{__element: 'Icon', props: {icon: 'check', size: 'sm'}}],
    },
  ],
  playground: {
    defaults: {
      label: 'Badge',
      variant: 'neutral',
    },
  },
  theming: {
    targets: [
      {className: 'astryx-badge', visualProps: ['variant']},
    ],
  },
  usage: {
    description:
      'Badge highlights a status or category at a glance. Use it sparingly: only when a value represents a distinct state (Active, Failed) or a grouping tag (Engineering, Design). Most metadata (dates, durations, counts, descriptions) should be plain description text, not badges.',
    bestPractices: [
      {guidance: true, description: 'Every status badge steals attention. Only badge states where the user needs to notice or act: errors, warnings, items requiring follow-up. If no action is needed, plain text is fine.'},
      {guidance: true, description: 'Use success, warning, and error variants only for system status that demands attention: "Failed", "Degraded", "Action Required". These have bold solid backgrounds designed to stand out.'},
      {guidance: true, description: 'Use color variants (blue, purple, teal, etc.) for category tags that group or classify items: team names, content types, priority levels.'},
      {guidance: true, description: 'Keep labels to one or two words. If you need more detail, put it in surrounding text instead of the badge.'},
      {guidance: true, description: 'Add an icon when it helps identify the badge type quickly, but always include a text label alongside it.'},
      {guidance: true, description: 'A string or number label keeps its character order under right-to-left, so `+3` and `@alice` read as written. When a rich label mixes directions, mark the direction on your own content, for example with `dir` or `<bdi>`.'},
      {guidance: false, description: 'Apply a "success" badge to every healthy/active/normal item. If all rows show green "Active" badges, none stand out; the badge adds noise, not information. Show only the states that need user attention (errors, warnings, pending actions).'},
      {guidance: false, description: 'Use badges for metadata. Durations ("6h window"), counts ("12 trigger types"), dates, and descriptions are not statuses or categories; use description text (Text with type="supporting") instead.'},
      {guidance: false, description: 'Use semantic status variants (success, warning, error, info) for categories or informational content. These are visually loud and should only indicate system state.'},
      {guidance: false, description: 'Repeat the same badge in every row of a table or list. If the same value appears in most rows, it\'s not adding information; use plain text for common states and reserve badges for the exceptional ones.'},
      {guidance: false, description: 'Make badges clickable; they are read-only indicators. Use a button or link if the user needs to take action.'},
    ],
    anatomy: [
      {name: 'Icon', required: false, description: 'An optional leading icon that helps identify the badge type at a glance.'},
      {name: 'Label', required: true, description: 'The text or number shown inside the badge.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Badge",
  "displayName": "Badge",
  "usage": {
    "description": "Badge 让用户一眼看清状态或类别。请谨慎使用：仅当某个值代表明确的状态（如“活跃”“失败”）或分组标签（如“工程”“设计”）时才使用。大多数元数据（日期、时长、计数、描述）应使用普通描述文本，而不是徽标。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "每个状态徽标都会抢占注意力。只在用户需要察觉或采取行动的状态上使用徽标：错误、警告、需要跟进的事项。若无需操作，普通文本即可。"
      },
      {
        "guidance": true,
        "description": "仅在需要关注系统状态时使用 success、warning 和 error 变体，例如“Failed”“Degraded”“Action Required”。这些变体具有醒目的实色背景，专为突出显示而设计。"
      },
      {
        "guidance": true,
        "description": "用颜色变体（蓝、紫、青等）表示对项目进行分组或分类的类别标签：团队名称、内容类型、优先级。"
      },
      {
        "guidance": true,
        "description": "标签保持在一到两个词。若需要更多细节，请放在周围文本中，而不是徽标里。"
      },
      {
        "guidance": true,
        "description": "当图标有助于快速识别徽标类型时可添加图标，但始终要同时提供文本标签。"
      },
      {
        "guidance": true,
        "description": "字符串或数字标签在从右到左书写时保持字符顺序，因此 `+3` 和 `@alice` 会按原样显示。当富文本标签混合不同书写方向时，请在自己的内容上标记方向，例如使用 `dir` 或 `<bdi>`。"
      },
      {
        "guidance": false,
        "description": "给每个健康/活跃/正常的项目都加上“success”徽标。如果所有行都显示绿色“Active”徽标，就没有任何一行会突出；徽标只增加噪音，不增加信息。只显示需要用户注意的状态（错误、警告、待处理操作）。"
      },
      {
        "guidance": false,
        "description": "用徽标展示元数据。时长（“6h window”）、计数（“12 trigger types”）、日期和描述既不是状态也不是类别；请改用描述文本（`type=\"supporting\"` 的 Text）。"
      },
      {
        "guidance": false,
        "description": "将语义状态变体（success、warning、error、info）用于类别或信息性内容。这些变体视觉上很醒目，只应表示系统状态。"
      },
      {
        "guidance": false,
        "description": "在表格或列表的每一行重复同一个徽标。若同一个值出现在大多数行中，它就不提供信息；常见状态请用普通文本，把徽标留给异常状态。"
      },
      {
        "guidance": false,
        "description": "让徽标可点击；它们是只读指示器。若用户需要执行操作，请使用按钮或链接。"
      }
    ],
    "anatomy": [
      {
        "name": "图标",
        "required": false,
        "description": "可选的前置图标，帮助用户一眼识别徽标类型。"
      },
      {
        "name": "标签",
        "required": true,
        "description": "徽标内显示的文本或数字。"
      }
    ]
  },
  "props": [
    {
      "name": "variant",
      "type": "'neutral' | 'info' | 'success' | 'warning' | 'error' | 'blue' | 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'",
      "description": "视觉样式变体。语义变体（neutral、info、success、warning、error）使用实色背景。非语义颜色变体使用带色背景和彩色文字，用于分类和打标签。",
      "default": "'neutral'"
    },
    {
      "name": "label",
      "type": "ReactNode",
      "required": true,
      "description": "徽标文本内容。徽标只有一行，且高度至少等于该行标签的高度，因此会随文字增大（更大的字号）；标签宽度超出可用空间时会被省略号截断，而不会溢出容器；字符串或数字标签还会被设为徽标的 title，以便悬停时仍能获取完整文本。"
    },
    {
      "name": "icon",
      "type": "ReactNode",
      "description": "可选的前置图标。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-badge",
        "visualProps": [
          "variant"
        ]
      }
    ]
  },
  "propDescriptions": {
    "variant": "视觉样式变体。语义变体（neutral、info、success、warning、error）使用实色背景。非语义颜色变体使用带色背景和彩色文字，用于分类和打标签。",
    "label": "徽标文本内容。徽标只有一行，且高度至少等于该行标签的高度，因此会随文字增大（更大的字号）；标签宽度超出可用空间时会被省略号截断，而不会溢出容器；字符串或数字标签还会被设为徽标的 title，以便悬停时仍能获取完整文本。",
    "icon": "可选的前置图标。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'highlights a status or category tag, NOT for general metadata',
  usage: {
    description:
      'Badge is for status (Active, Failed) and category tags (Engineering, Design). It is NOT for metadata like dates, durations, counts, or descriptions; use description text (Text type="supporting") for those.',
    bestPractices: [
      {guidance: true, description: 'Every badge steals attention. Only badge states where the user needs to act. If no follow-up is needed, use plain text.'},
      {guidance: true, description: 'Use success/warning/error ONLY for system status requiring attention (Failed, Degraded, Action Required). These are visually loud: solid colored backgrounds.'},
      {guidance: true, description: 'Use color variants (blue, purple, teal) for category tags that classify items: team names, content types, priority levels.'},
      {guidance: true, description: 'Keep labels to one or two words. If more detail is needed, put it in surrounding text instead of the badge.'},
      {guidance: true, description: 'Add an icon when it helps identify the badge type quickly, but always include a text label alongside it.'},
      {guidance: true, description: 'A string or number label keeps its character order under right-to-left, so `+3` and `@alice` read as written. When a rich label mixes directions, mark the direction on your own content, for example with `dir` or `<bdi>`.'},
      {guidance: false, description: 'Apply "success" badges to every healthy/normal item. If most rows are green "Active", none stand out. Skip the badge for the default state; only highlight exceptions that need attention.'},
      {guidance: false, description: 'Use badges for metadata. Durations, counts, dates, descriptions → use Text with type="supporting" instead.'},
      {guidance: false, description: 'Use status variants for non-status info. "6h window", "12 types", category names are NOT statuses.'},
      {guidance: false, description: 'Repeat loud badges in every row. Common/default states should be plain text; reserve badges for the exceptional.'},
      {guidance: false, description: 'Make badges clickable; they are read-only. Use a button or link for actions.'},
    ],
    anatomy: [
      {name: 'Icon', required: false, description: 'Optional leading icon.'},
      {name: 'Label', required: true, description: 'Text or number shown inside the badge.'},
    ],
  },
  propDescriptions: {
    variant: 'visual style variant',
    label: 'badge text content; over-wide labels clip with an ellipsis, full text in title',
    icon: 'optional leading icon',
  },
};
