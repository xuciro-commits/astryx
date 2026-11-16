// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file CommentPin.doc.mjs
 * @input CommentPin API, anatomy, ownership boundaries, and examples
 * @output Consumer documentation for the Lab comment pin
 * @position CLI and docsite metadata; the runnable showcase lives in packages/lab/blocks
 */

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Marker surface',
    required: true,
    description:
      'The compact speech-bubble button surface, with a fixed 2px logical bottom-start corner, 28, 32, or 36px tall by size and padded equally on every side. It owns selected, resolved, disabled, hover, press, focus-visible, and grouped presentation, but no coordinates.',
  },
  {
    name: 'Representative avatars',
    required: true,
    description:
      'One Avatar for a single thread. A group shows its distinct participants as an AvatarGroup capped at three circles: up to three Avatars, or two Avatars plus the overflow indicator when more than three people participate. Avatars are decorative inside the marker; the button label owns accessibility.',
  },
  {
    name: 'Overflow indicator',
    required: false,
    description:
      'An ellipsis AvatarGroupOverflow circle that takes the third position when a group has more than three distinct participants. It shows no number, so the group count stays the pin’s only number. Decorative and non-interactive inside the pin.',
  },
  {
    name: 'Group count',
    required: false,
    description:
      'Exact total number of represented threads. Appears when threadCount is greater than one, before the unread dot when there is one; it is a quantity, not ordinal identity. Extra end padding keeps it clear of the pin’s edge.',
  },
  {
    name: 'Unread dot',
    required: false,
    description:
      'An accent StatusDot at the end of the pin that marks unread activity whenever unreadCount is above zero: after the group count, or after the participant on a single-thread pin. It adds no second number; decorative inside the pin.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'CommentPin',
  displayName: 'Comment Pin',
  group: 'Comments',
  category: 'Chat',
  keywords: [
    'annotation',
    'marker',
    'pin',
    'comment',
    'thread',
    'anchor',
    'avatar',
    'grouped comments',
    'image annotation',
    'margin comment',
  ],
  description:
    'Avatar-first button for opening one anchored annotation thread or a caller-defined group. A single marker shows its lead participant; a grouped marker shows up to three participant circles (two plus an ellipsis beyond three) and the total thread count. Whenever any represented thread is unread, an accent status dot appears after the count. Three sizes follow the element-size scale. The host owns anchors, coordinates, grouping, collision handling, and the comments surface.',
  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Required accessible action name and hover/focus tooltip. Include grouped, unread, or resolved context when it changes the action meaning, for example “Open 4 grouped annotations from Ada and Lin, 2 unread”.',
      required: true,
    },
    {
      name: 'participants',
      type: 'readonly [CommentPinParticipant, ...CommentPinParticipant[]]',
      description:
        'Non-empty ordered participants, lead first. A single pin renders the first. A grouped pin renders distinct IDs as an AvatarGroup of at most three circles: every participant when three or fewer are distinct, otherwise the first two plus an ellipsis overflow circle. Pass every distinct participant so the overflow appears exactly when more than three people participate. Each record has id, name, and optional avatarSrc.',
      required: true,
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description:
        'Pin height on the element-size scale: sm 28px, md 32px, lg 36px, with 22px, 24px, and 28px participant circles. Padding is equal on every side, so the avatars and overflow sit the same distance from each edge; the trailing count or unread dot adds a little end padding so it never crowds the edge.',
      default: "'sm'",
    },
    {
      name: 'threadCount',
      type: 'number',
      description:
        'Total represented threads. A finite positive integer above one switches to grouped presentation and displays the exact count. The host still owns the clustering policy.',
      default: '1',
    },
    {
      name: 'unreadCount',
      type: 'number',
      description:
        'Represented threads with unread activity. When above zero, an accent status dot appears at the end of the pin, after the thread total or the single participant; the number itself is not shown. Invalid values are ignored and values above threadCount are capped. Repeat the unread context in label.',
      default: '0',
    },
    {
      name: 'isSelected',
      type: 'boolean',
      description:
        'Whether the pin is the active annotation target. Draws a solid 2px accent outline outside the pin, keeping its elevation, plus aria-pressed; the shared offset focus outline remains farther outside for keyboard focus. Follow aria-pressed toggle semantics: activating the selected pin again should clear the host selection.',
      default: 'false',
    },
    {
      name: 'isDimmed',
      type: 'boolean',
      description:
        'Whether another pin is selected. Lowers this pin’s opacity without disabling it, so it remains available to switch selection. Leave it false on every pin when nothing is selected. Selected presentation wins if both are true.',
      default: 'false',
    },
    {
      name: 'isResolved',
      type: 'boolean',
      description:
        'Whether every represented thread is resolved. A resolved pin renders nothing unless it is selected: resolved discussion leaves the content, while a thread the reader opened (or resolved from its popover) keeps its anchor, with the selected treatment, until the host clears the selection.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disables activation: the pin exposes aria-disabled, keeps its tab stop, and blocks every activation path. Useful for a pending anchor before its thread exists.',
      default: 'false',
    },
    {
      name: 'onClick',
      type: 'MouseEventHandler<HTMLButtonElement>',
      description:
        'Product-owned activation handler. Open or select the represented thread/group here; CommentPin owns no comments or popover state.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX layout customization for the button root. Hosts may position it over content or in a margin; absolute anchors map to the logical bottom-start corner by placing the inline-start edge at the anchor and translating the pin upward by its full height.',
    },
  ],
  theming: {
    targets: [
      {
        className: 'astryx-comment-pin',
        visualProps: [
          'size',
          'grouped',
          'unread',
          'selected',
          'dimmed',
          'resolved',
          'disabled',
        ],
      },
    ],
  },
  usage: {
    anatomy,
    description:
      'Use CommentPin as the interactive anchor for comments attached to images, documents, canvases, table regions, or content margins. Pass the distinct participants (lead first), the total number of threads the host grouped at that anchor, and how many of them are unread. The component intentionally has no coordinates, anchor IDs, thread IDs, clustering algorithm, popover, or Comments dependency: those stay with the product so the same marker can sit over transformed media or in normal document layout. Participant Avatars and the overflow circle suppress their own tooltips and interaction; the pin is the only button and its label is the complete action name.',
    accessibility: [
      {
        name: 'Native button activation',
        category: 'Keyboard',
        criterion: '2.1.1 Keyboard',
        description:
          'CommentPin is one native button. Tab reaches an enabled pin; Enter and Space activate it. A disabled pin stays in the tab order and is announced as disabled through aria-disabled, and every activation path is blocked.',
      },
      {
        name: 'Selected state and name',
        category: 'Semantics',
        criterion: '4.1.2 Name, Role, Value',
        description:
          'The required label is the button name and tooltip. aria-pressed communicates controlled selection; participant Avatars, the overflow circle, the visible thread total, and the unread dot remain decorative, so repeat grouped and unread context in label.',
      },
      {
        name: 'Selection and focus',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        description:
          'The solid 2px accent outline hugs the pin while the shared focus-visible outline sits farther outside it, so selection and keyboard focus remain distinguishable; forced colors uses the platform Highlight treatment. Verify both selected and selected-plus-focused states against the host surface.',
      },
    ],
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass the lead commenter first. For a group, pass every distinct participant ordered by how well they help users recognize the cluster; the pin shows up to three circles and summarizes the rest with an ellipsis.',
      },
      {
        guidance: true,
        description:
          'Write a complete label that names the action and relevant context, such as “Open 4 grouped annotations from Ada and Lin”.',
      },
      {
        guidance: true,
        description:
          'Keep coordinates, zoom/rotation transforms, collision handling, group membership, and thread selection in the host; position the pin with layout composition or xstyle.',
      },
      {
        guidance: true,
        description:
          'Map an absolute anchor coordinate to the pin’s logical bottom-start corner, not its center. Place the pin’s inline-start edge at the anchor and translate it upward by its full height.',
      },
      {
        guidance: true,
        description:
          'When one pin is selected, pass isDimmed to the other pins instead of disabling them. They stay available to switch selection while the active pin holds visual focus. When nothing is selected, no pin dims.',
      },
      {
        guidance: true,
        description:
          'Treat selection as an aria-pressed toggle: when the selected pin is activated again, clear the host selection.',
      },
      {
        guidance: true,
        description:
          'Treat threadCount as quantity only. The Avatar identities stay primary even when the total is large.',
      },
      {
        guidance: true,
        description:
          'Pass unreadCount whenever represented threads have unread activity. Its accent dot keeps unread work visible beside the total; repeat the unread count in label.',
      },
      {
        guidance: false,
        description:
          'Use an ordinal number as the marker identity. Numbering becomes unstable and hard to scan as annotations are inserted, removed, filtered, or grouped.',
      },
      {
        guidance: false,
        description:
          'Put interactive Avatar links or buttons inside the marker. The marker root owns the one action and accessible name.',
      },
      {
        guidance: false,
        description:
          'Slice participants yourself to control the overflow. Pass every distinct participant so the ellipsis appears exactly when more than three people participate, and name the hidden people in label.',
      },
    ],
  },
  examples: [
    {
      label: 'Single thread',
      code: `<CommentPin
  label="Open annotation from Ada"
  participants={[{id: 'ada', name: 'Ada Lovelace', avatarSrc: '/ada.jpg'}]}
  onClick={() => openThread('thread-1')}
/>`,
    },
    {
      label: 'Grouped threads',
      code: `<CommentPin
  label="Open 4 grouped annotations from Ada and Lin"
  participants={[
    {id: 'ada', name: 'Ada Lovelace', avatarSrc: '/ada.jpg'},
    {id: 'lin', name: 'Lin Chen', avatarSrc: '/lin.jpg'},
  ]}
  threadCount={4}
  isSelected={selectedCluster === 'cluster-1'}
  onClick={() => setSelectedCluster('cluster-1')}
/>`,
    },
    {
      label: 'Unread threads with participant overflow',
      code: `// Five distinct people: two Avatars plus an ellipsis circle.
// Two unread threads: an accent dot after the total.
<CommentPin
  label="Open 6 grouped annotations from Ada, Lin, and 3 others, 2 unread"
  participants={[ada, lin, mira, noah, sam]}
  threadCount={6}
  unreadCount={2}
  onClick={() => setSelectedCluster('cluster-2')}
/>`,
    },
    {
      label: 'Sizes',
      code: `<HStack gap={3}>
  <CommentPin size="sm" label="Open annotation from Ada" participants={[ada]} />
  <CommentPin size="md" label="Open annotation from Ada" participants={[ada]} />
  <CommentPin size="lg" label="Open annotation from Ada" participants={[ada]} />
</HStack>`,
    },
    {
      label: 'Host-owned placement',
      code: `const positions = stylex.create({
  marker: {
    position: 'absolute',
    insetInlineStart: '42%',
    insetBlockStart: '28%',
    transform: 'translateY(-100%)',
  },
});

<div className="annotated-content">
  <img src="/diagram.png" alt="System diagram" />
  <CommentPin
    label="Open annotation from Mira"
    participants={[{id: 'mira', name: 'Mira Patel'}]}
    xstyle={positions.marker}
    onClick={openAnnotation}
  />
</div>`,
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "name": "CommentPin",
  "displayName": "Comment Pin",
  "description": "以头像为主的按钮，用于打开一个锚定的批注线程或调用方定义的组。单个标记显示其首要参与者；分组标记最多显示三个参与者圆形（超过三个时显示两个加一个省略号）以及线程总数。只要任何所代表的线程未读，计数之后就会出现一个强调状态点。三种尺寸遵循元素尺寸比例。宿主负责锚点、坐标、分组、碰撞处理和批注表面。",
  "usage": {
    "description": "将 CommentPin 用作附加到图片、文档、画布、表格区域或内容边距的批注的交互式锚点。传入不同的参与者（首要者在前）、宿主在该锚点分组的线程总数，以及其中有多少未读。该组件有意不包含坐标、锚点 ID、线程 ID、聚类算法、弹出框或 Comments 依赖：这些保留在产品中，以便同一个标记可以放置在经过变换的媒体上或普通文档布局中。参与者 Avatar 和溢出圆形会抑制自己的工具提示和交互；该 pin 是唯一的按钮，其标签就是完整的操作名称。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "首先传入首要评论者。对于组，传入每个不同的参与者，按他们帮助用户识别该簇的程度排序；pin 最多显示三个圆形，并用省略号汇总其余部分。"
      },
      {
        "guidance": true,
        "description": "编写完整的标签，名称要包含操作和相关上下文，例如“打开来自 Ada 和 Lin 的 4 条分组批注”。"
      },
      {
        "guidance": true,
        "description": "将坐标、缩放/旋转变换、碰撞处理、组成员关系和线程选择保留在宿主中；使用布局组合或 xstyle 定位 pin。"
      },
      {
        "guidance": true,
        "description": "将绝对锚点坐标映射到 pin 的逻辑 bottom-start 角，而不是其中心。将 pin 的行内起始边缘放在锚点处，并将其向上平移其完整高度。"
      },
      {
        "guidance": true,
        "description": "当一个 pin 被选中时，向其他 pin 传入 isDimmed，而不是禁用它们。它们仍然可用于切换选择，同时活动 pin 保持视觉焦点。没有选中任何内容时，没有 pin 变暗。"
      },
      {
        "guidance": true,
        "description": "将选择视为 aria-pressed 切换：当再次激活已选中的 pin 时，清除宿主选择。"
      },
      {
        "guidance": true,
        "description": "将 threadCount 仅视为数量。即使总数很大，Avatar 身份仍是主要的。"
      },
      {
        "guidance": true,
        "description": "只要所代表的线程有未读活动，就传入 unreadCount。其强调点使未读工作保持在总数旁边可见；在 label 中重复未读计数。"
      },
      {
        "guidance": false,
        "description": "不要使用序数作为标记身份。当批注被插入、删除、筛选或分组时，编号会变得不稳定且难以扫读。"
      },
      {
        "guidance": false,
        "description": "不要在标记内放置交互式 Avatar 链接或按钮。标记根拥有唯一的操作和可访问名称。"
      },
      {
        "guidance": false,
        "description": "不要自行截取参与者列表来控制溢出。传入每个不同的参与者，使省略号恰好在超过三人参与时出现，并在 label 中命名隐藏的人员。"
      }
    ],
    "accessibility": [
      {
        "name": "原生按钮激活",
        "category": "Keyboard",
        "criterion": "2.1.1 Keyboard",
        "description": "CommentPin 是一个原生按钮。Tab 可到达启用的 pin；Enter 和 Space 可激活它。禁用的 pin 保持在 Tab 顺序中，并通过 aria-disabled 宣布为已禁用，且所有激活路径都被阻止。"
      },
      {
        "name": "选中状态与名称",
        "category": "Semantics",
        "criterion": "4.1.2 Name, Role, Value",
        "description": "必需的 label 是按钮名称和工具提示。aria-pressed 传达受控选择；参与者 Avatar、溢出圆形、可见的线程总数和未读点保持装饰性，因此在 label 中重复分组和未读上下文。"
      },
      {
        "name": "选择与焦点",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "description": "实心的 2px 强调轮廓紧贴 pin，而共享的 focus-visible 轮廓位于其外侧更远处，因此选择和键盘焦点保持可区分；强制颜色模式使用平台 Highlight 处理。请针对宿主表面验证选中和选中加聚焦两种状态。"
      }
    ],
    "anatomy": [
      {
        "name": "标记表面",
        "required": true,
        "description": "紧凑的对话气泡按钮表面，具有固定的 2px 逻辑 bottom-start 角，按尺寸为 28、32 或 36px 高，四周内边距相等。它拥有选中、已解决、禁用、悬停、按压、focus-visible 和分组呈现，但不包含坐标。"
      },
      {
        "name": "代表性头像",
        "required": true,
        "description": "单个线程显示一个 Avatar。组将其不同参与者显示为最多三个圆形的 AvatarGroup：最多三个 Avatar，或者当超过三人参与时显示两个 Avatar 加溢出指示器。Avatar 在标记内是装饰性的；按钮标签拥有可访问性。"
      },
      {
        "name": "溢出指示器",
        "required": false,
        "description": "一个省略号 AvatarGroupOverflow 圆形，当组有超过三个不同参与者时占据第三个位置。它不显示数字，因此组计数仍是 pin 上唯一的数字。在 pin 内是装饰性的且不可交互。"
      },
      {
        "name": "分组计数",
        "required": false,
        "description": "所代表线程的准确总数。当 threadCount 大于一时出现，在存在未读点时位于其之前；它是数量，而不是序数身份。额外的末端内边距使其远离 pin 的边缘。"
      },
      {
        "name": "未读圆点",
        "required": false,
        "description": "pin 末端的强调 StatusDot，在 unreadCount 大于零时标记未读活动：位于组计数之后，或单线程 pin 的参与者之后。它不添加第二个数字；在 pin 内是装饰性的。"
      }
    ]
  },
  "propDescriptions": {
    "label": "必需的可访问操作名称和悬停/焦点工具提示。当分组、未读或已解决上下文会改变操作含义时将其包含在内，例如“打开来自 Ada 和 Lin 的 4 条分组批注，2 条未读”。",
    "participants": "非空的有序参与者，首要者在前。单个 pin 渲染第一个。分组 pin 将不同 ID 渲染为最多三个圆形的 AvatarGroup：当不同参与者为三个或更少时显示全部，否则显示前两个加一个省略号溢出圆形。传入每个不同的参与者，使溢出恰好在超过三人参与时出现。每条记录包含 id、name 和可选的 avatarSrc。",
    "size": "元素尺寸比例上的 pin 高度：sm 28px、md 32px、lg 36px，参与者圆形分别为 22px、24px 和 28px。四周内边距相等，因此头像和溢出与每条边缘的距离相同；尾随计数或未读点会增加少量末端内边距，使其永远不会挤到边缘。",
    "threadCount": "所代表线程的总数。大于一的有限正整数会切换为分组呈现并显示准确计数。宿主仍拥有聚类策略。",
    "unreadCount": "有未读活动的所代表线程。大于零时，pin 末端会出现一个强调状态点，位于线程总数或单个参与者之后；数字本身不显示。无效值会被忽略，大于 threadCount 的值会被限制。在 label 中重复未读上下文。",
    "isSelected": "pin 是否为活动批注目标。在 pin 外部绘制实心 2px 强调轮廓，保持其高度，并加上 aria-pressed；共享的偏移焦点轮廓仍在更外侧用于键盘焦点。遵循 aria-pressed 切换语义：再次激活已选中的 pin 应清除宿主选择。",
    "isDimmed": "是否有另一个 pin 被选中。降低此 pin 的不透明度但不禁用，因此它仍可用于切换选择。没有选中任何内容时，所有 pin 都应设为 false。两者都为 true 时，选中呈现优先。",
    "isResolved": "所代表的每个线程是否都已解决。已解决的 pin 除非被选中，否则不渲染：已解决的讨论会离开内容，而读者打开（或从其弹出框解决）的线程会保留其锚点，并带有选中处理，直到宿主清除选择。",
    "isDisabled": "禁用激活：pin 暴露 aria-disabled，保留其 Tab 停靠点，并阻止所有激活路径。适用于线程尚未存在之前的待处理锚点。",
    "onClick": "产品拥有的激活处理程序。在此打开或选择所代表的线程/组；CommentPin 不拥有任何评论或弹出框状态。",
    "xstyle": "按钮根的 StyleX 布局自定义。宿主可以将其定位在内容之上或边距中；绝对锚点通过将行内起始边缘放在锚点处并将 pin 向上平移其完整高度来映射到逻辑 bottom-start 角。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'avatar-first annotation anchor; 1 lead Avatar for one thread; groups show max 3 circles (2 Avatars + ellipsis beyond 3) + exact total; accent StatusDot after the total (or the avatar on a single pin) when unreadCount > 0; sm/md/lg = 28/32/36px; host owns placement/grouping',
  usage: {
    description:
      'Interactive anchor for comments over content or in margins. Pass every distinct participant, the total thread count, and the unread thread count; keep coordinates, clustering, collisions, thread state, and opened UI in the host. Absolute coordinates map to the logical bottom-start corner, while another pin is selected its siblings use isDimmed and remain interactive, and activating the selected pin again clears the host selection.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass the lead commenter first and write a complete action label, including unread context.',
      },
      {
        guidance: true,
        description:
          'Use threadCount as quantity, never ordinal identity; pass unreadCount so an accent dot marks unread work.',
      },
      {
        guidance: false,
        description:
          'Nest interactive Avatars, slice participants to fake the overflow, or pass coordinates/grouping logic into the marker.',
      },
    ],
  },
  propDescriptions: {
    label:
      'required action name + hover/focus tooltip; include grouped/unread context',
    participants:
      'non-empty ordered tuple of {id,name,avatarSrc?}; single renders 1; groups render ≤3 circles (2 + ellipsis overflow beyond 3 distinct)',
    size: "'sm' | 'md' | 'lg' = 28/32/36px height, 22/24/28px avatars, equal padding; default 'sm'",
    threadCount:
      'positive integer total; >1 selects grouped presentation; default 1',
    unreadCount:
      'unread represented threads; >0 shows an accent dot after the total (or the avatar on a single pin); capped at threadCount; default 0',
    isSelected:
      'controlled active pin; solid 2px accent outline outside the pin + aria-pressed; host clears it when the selected pin is activated again',
    isDimmed:
      'controlled de-emphasis for non-selected siblings only while another pin is selected; remains interactive',
    isResolved: 'resolved pins render nothing unless selected',
    isDisabled:
      'disabled marker: aria-disabled, keeps its tab stop, blocks every activation path',
    onClick: 'host activation handler',
    xstyle: 'root layout/positioning styles; marker owns no coordinates',
  },
};
