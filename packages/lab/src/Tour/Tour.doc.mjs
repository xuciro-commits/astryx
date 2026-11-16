// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Tour',
  displayName: 'Tour',
  category: 'Feedback & Status',
  keywords: ["tour","nux","onboarding","walkthrough","product tour","coachmark","spotlight","guide","feature step","step"],
  description:
    'A guided product tour (NUX / onboarding). Tour is a controller that steps a user through a sequence of spotlight callouts anchored to elements on the page. It renders no chrome itself; it owns the active-step state and shares it with declaratively-nested TourStep children (step order follows the children). Experimental: lands in lab first (meta/astryx#4239).',
  components: [
    {
      name: 'Tour',
      displayName: 'Tour',
      description:
        'Controller for a guided tour. Coordinates the active step among its TourStep children, exposes advance / retreat / complete / dismiss, and optionally dims the page around the active step (spotlight cutout). Controlled via isActive: the consumer owns "has this user seen the tour?".',
      props: [
        {
          name: 'isActive',
          type: 'boolean',
          description:
            'Whether the tour is running. When false nothing renders and the tour resets to the first step, so it restarts cleanly next time it becomes active.',
          required: true,
        },
        {
          name: 'children',
          type: 'ReactNode',
          description:
            'The tour steps: TourStep elements. Step order follows their order here; only the active step renders its callout.',
          slotElements: [{__element: 'TourStep', props: {heading: 'Step'}, children: 'Step body'}],
        },
        {
          name: 'onDismiss',
          type: '(source: TourDismissSource) => void',
          description:
            "Called on every exit, with the reason ('backdrop' | 'escape' | 'close' | 'skip' | 'complete'). The consumer flips isActive to false in response, and can branch on the source to distinguish a successful finish from an early exit.",
          required: true,
        },
        {
          name: 'hasBackdrop',
          type: 'boolean',
          description:
            'Dim the page around the active step as a spotlight cutout: the target stays lit while everything else darkens. While the page is dimmed, a press anywhere outside the callout, the target included, ends the tour with "backdrop". Use for modal-style steps that demand focus; leave off for a lightweight coachmark that only rings the target, or for a step whose target the user should press.',
          default: 'false',
        },
        {
          name: 'isStepCountShown',
          type: 'boolean',
          description: 'Show the step count ("2 of 5") in each step.',
          default: 'false',
        },
      ],
    },
    {
      name: 'TourStep',
      displayName: 'Tour Step',
      description:
        'A single spotlight step. Highlights a target element with a ring drawn as a separate overlay (the target is never restyled) and renders a non-modal callout anchored to it, with a heading, body, optional step progress, and back / next / close controls. The callout is a region named by its heading. Focus moves to it when the step starts, and Tab can leave it for the page, so a step can introduce a control the user then operates. Without a backdrop, pressing the target or the page leaves the tour running; Escape ends it. Registers with the parent Tour on mount and renders its callout only while active.',
      props: [
        {
          name: 'targetRef',
          type: 'RefObject<HTMLElement>',
          description:
            'Ref to the element this step points at: any element, such as a button, a card, a table cell or a chart region. The callout sits beside it. The target keeps its own behavior: without a backdrop, pressing it does not end the tour, and keyboard focus can reach it while the step shows. Under the backdrop of the Tour, a press on the target ends the tour with "backdrop".',
          required: true,
        },
        {
          name: 'heading',
          type: 'ReactNode',
          description: 'Step heading.',
          required: true,
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Step body content.',
        },
        {
          name: 'placement',
          type: "'above' | 'below' | 'start' | 'end'",
          description: 'Which side of the target the callout sits on.',
          default: "'below'",
        },
        {
          name: 'alignment',
          type: "'start' | 'center' | 'end'",
          description:
            'How the callout aligns along the placement side (e.g. with placement="below": start left-aligns under the target, center centers, end right-aligns).',
          default: "'start'",
        },
      ],
    },
  ],
  usage: {
    description:
      'Use a Tour to introduce a feature or onboard a user through a few key parts of the UI. Compose it from TourStep children, each pointing at an element via targetRef; the Tour advances through them with Next/Back and ends on Done. It is controlled: keep isActive in your own state and persist "has seen this tour" yourself (the component only reports dismissal via onDismiss). Built on the existing layer anchoring and overlay tokens rather than a bespoke positioning engine.',
    bestPractices: [
      { guidance: true, description: 'Keep tours short: a few high-value steps. Long tours get skipped.' },
      { guidance: true, description: 'Persist completion yourself (from onDismiss) so a user does not see the same tour on every visit.' },
      { guidance: true, description: 'Point each step at a stable, visible element; ensure the target is on-screen before its step becomes active.' },
      { guidance: false, description: 'Gate essential, must-see information behind a tour step; users can dismiss it; put critical info inline.' },
      { guidance: false, description: 'Use a tour as a substitute for clear UI; fix confusing interfaces rather than narrating them.' },
    ],
  },
};

export const docsZh = {
  "name": "Tour",
  "description": "引导式产品导览（NUX / 新手引导）。Tour 是一个控制器，带领用户依次浏览一系列聚光灯标注，这些标注锚定到页面上的元素。它本身不渲染任何界面框架；它拥有活动步骤状态，并与以声明方式嵌套的 TourStep 子元素共享该状态（步骤顺序遵循子元素顺序）。实验性：先进入 lab（meta/astryx#4239）。",
  "usage": {
    "description": "使用 Tour 介绍功能，或通过 UI 的几个关键部分引导用户完成新手引导。由 TourStep 子元素组成，每个子元素通过 targetRef 指向一个元素；Tour 通过 Next/Back 在它们之间前进，并在 Done 结束。它是受控的：将 isActive 保存在你自己的状态中，并自行持久化 \"has seen this tour\"（组件仅通过 onDismiss 报告关闭）。基于现有的层锚定和覆盖层令牌构建，而不是定制的定位引擎。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持导览简短：几个高价值步骤。长导览会被跳过。"
      },
      {
        "guidance": true,
        "description": "自行持久化完成状态（来自 onDismiss），以免用户每次访问都看到同一导览。"
      },
      {
        "guidance": true,
        "description": "将每个步骤指向一个稳定、可见的元素；确保目标在其步骤变为活动之前位于屏幕上。"
      },
      {
        "guidance": false,
        "description": "不要将关键、必看的信息设为只有完成导览步骤才能看到；用户可以关闭导览；请将关键信息内联放置。"
      },
      {
        "guidance": false,
        "description": "不要用导览来替代清晰的 UI；修复令人困惑的界面，而不是对其进行叙述。"
      }
    ]
  },
  "components": [
    {
      "name": "Tour",
      "description": "引导式导览的控制器。在其 TourStep 子元素之间协调活动步骤，暴露 advance / retreat / complete / dismiss，并可选地在活动步骤周围调暗页面（聚光灯挖空）。通过 isActive 受控：消费者拥有 \"has this user seen the tour?\"。",
      "propDescriptions": {
        "isActive": "导览是否正在运行。为 false 时不渲染任何内容，并将导览重置到第一步，因此下次激活时可以干净地重新开始。",
        "children": "导览步骤：TourStep 元素。步骤顺序遵循它们在此处的顺序；仅活动步骤渲染其标注。",
        "onDismiss": "每次退出时调用，并带有原因（'backdrop' | 'escape' | 'close' | 'skip' | 'complete'）。消费者据此将 isActive 设为 false，并可根据来源分支以区分成功完成与提前退出。",
        "hasBackdrop": "将活动步骤周围的页面调暗为聚光灯挖空：目标保持点亮，其他一切变暗。页面变暗时，在标注之外的任何位置按下（包括目标）都会以 \"backdrop\" 结束导览。用于要求专注的模态式步骤；对于仅围绕目标画圈的轻量教练标记，或用户应按下目标的步骤，请不要启用。",
        "isStepCountShown": "在每个步骤中显示步骤计数（“第 2 步，共 5 步”）。"
      }
    },
    {
      "name": "TourStep",
      "description": "单个聚光灯步骤。用作为独立覆盖层绘制的圆环突出目标元素（目标本身从不重新设置样式），并渲染锚定到它的非模态标注，包含标题、正文、可选的步骤进度以及返回/下一步/关闭控件。标注是一个以其标题命名的区域。步骤开始时焦点移动到它，Tab 可以离开它进入页面，因此步骤可以介绍用户随后操作的控件。没有背景遮罩时，按下目标或页面会保持导览运行；Escape 结束它。挂载时向父 Tour 注册，并且仅在活动时渲染其标注。",
      "propDescriptions": {
        "targetRef": "指向此步骤目标的元素 ref：任何元素，例如按钮、卡片、表格单元格或图表区域。标注位于其旁边。目标保留自己的行为：没有背景遮罩时，按下它不会结束导览，键盘焦点可以在步骤显示时到达它。在 Tour 的背景遮罩下，按下目标会以 \"backdrop\" 结束导览。",
        "heading": "步骤标题。",
        "children": "步骤正文内容。",
        "placement": "标注位于目标的哪一侧。",
        "alignment": "标注沿放置侧的对齐方式（例如 placement=\"below\" 时：start 在目标下方左对齐，center 居中，end 右对齐）。"
      }
    }
  ]
};
