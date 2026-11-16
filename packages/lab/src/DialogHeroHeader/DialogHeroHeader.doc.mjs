// Copyright (c) Meta Platforms, Inc. and affiliates.
/**
 * @file DialogHeroHeader.doc.mjs
 * @input DialogHeroHeader props and Dialog composition
 * @output Consumer documentation for the canary-only hero header
 * @position Lab component documentation consumed by the CLI and docsite
 */

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'DialogHeroHeader',
  displayName: 'Dialog Hero Header',
  import: '@astryxdesign/lab',
  group: 'DialogHeroHeader',
  category: 'Overlay',
  keywords: [
    'dialog',
    'modal',
    'header',
    'hero',
    'media',
    'image',
    'illustration',
    'onboarding',
    'marketing',
    'featured',
    'close button',
    'title',
  ],
  description:
    'Experimental hero-style header for Dialog, available from @astryxdesign/lab@canary: a full-bleed media slot above the title with the close button overlaid on the media. The high-emphasis sibling of DialogHeader for featured, marketing, or onboarding dialogs.',
  props: [
    {
      name: 'title',
      type: 'string | ReactElement',
      description:
        'Dialog title. A string is wrapped in a level 2 Heading (matching DialogHeader); pass a pre-styled Heading element to customize the treatment. Provides the accessible label for the parent Dialog via aria-labelledby unless the Dialog has an explicit label. The visible title is the default initial focus target; another eligible descendant autofocus request takes priority. A custom Heading receives the label and focus on its own element; if it sets its own id, name the Dialog with aria-labelledby.',
      required: true,
    },
    {
      name: 'media',
      type: 'ReactNode',
      description:
        "Full-bleed visual rendered above the title (image, illustration, or icon). Stretches to the dialog's padded edges; the close button overlays its top-trailing corner. Size the media itself (e.g. width 100%) to fill the slot.",
      required: true,
    },
    {
      name: 'mediaMode',
      type: "'light' | 'dark'",
      description:
        "Luminance of the media surface. Composes MediaTheme under the hood so content overlaid on the media (the close button) picks up contrast-safe inverted tokens: 'dark' media gets light overlay content, 'light' media gets dark. Omit to keep ambient theme tokens.",
    },
    {
      name: 'isTitleHidden',
      type: 'boolean',
      description:
        'Visually hides the title row while keeping it available to screen readers, so the dialog stays named by the title.',
      default: 'false',
    },
    {
      name: 'startContent',
      type: 'ReactNode',
      description:
        'Content placed before the title (e.g. an icon), inline with the heading.',
    },
    {
      name: 'maxLines',
      type: 'number',
      description:
        'Max lines before the title truncates with an ellipsis. Only applies when title is a string (auto-wrapped in a Heading).',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => unknown',
      description:
        'Close button callback, called with false when the close button is clicked. If not provided, no close button is rendered. Same contract as DialogHeader.',
    },
    {
      name: 'hasDivider',
      type: 'boolean',
      description:
        "Adds a themed border at the bottom edge. Defaults to the parent Layout's defaultHasDividers context value.",
    },
  ],
  usage: {
    description:
      "Drop into Layout's header slot inside a Dialog, exactly like DialogHeader. Use when the dialog opens onto a featured, marketing, or onboarding moment where the compact DialogHeader is too understated. The media bleeds to the dialog's edges automatically and the close button floats over its top-trailing corner. The visible title is the default initial focus target; inline previews do not move focus. Install @astryxdesign/lab@canary with @astryxdesign/core@canary and import both packages’ CSS. Lab APIs can change between canary versions.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Set mediaMode to match the media\'s luminance so the overlaid close button stays legible: dark imagery needs mediaMode="dark".',
      },
      {
        guidance: true,
        description:
          'Size the media content to fill the slot (width 100% for images); the slot itself only positions and bleeds.',
      },
      {
        guidance: true,
        description:
          'Keep actions (CTAs) in LayoutFooter; the hero header takes no actions slot.',
      },
      {
        guidance: true,
        description:
          'Use isTitleHidden when the media already communicates the message visually; the title still names the dialog for screen readers.',
      },
      {
        guidance: false,
        description:
          'Use for routine confirmations or forms; use the compact DialogHeader instead.',
      },
      {
        guidance: false,
        description:
          'Pass decorative media without an empty alt: use alt="" on purely decorative images so screen readers skip them.',
      },
    ],
  },
  examples: [
    {
      label: 'Onboarding dialog',
      code: `import {DialogHeroHeader} from '@astryxdesign/lab';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/lab/lab.css';

const [isOpen, setIsOpen] = useState(true);
<Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
  <Layout
    header={
      <DialogHeroHeader
        title="Welcome aboard"
        media={<img src={heroImage} alt="" width="100%" />}
        mediaMode="dark"
        onOpenChange={setIsOpen}
      />
    }
    content={<LayoutContent>Get started in three steps.</LayoutContent>}
    footer={
      <LayoutFooter hasDivider>
        <Button label="Get started" variant="primary" />
      </LayoutFooter>
    }
  />
</Dialog>`,
    },
    {
      label: 'Hidden title (media carries the message)',
      code: `<DialogHeroHeader
  title="Product tour"
  media={<AnnouncementIllustration />}
  isTitleHidden
  onOpenChange={setIsOpen}
/>`,
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "name": "DialogHeroHeader",
  "displayName": "Dialog Hero Header",
  "description": "实验性的 Dialog 英雄式标题栏，可从 @astryxdesign/lab@canary 获取：标题上方有一个通栏媒体槽，关闭按钮叠加在媒体上。它是 DialogHeader 的高强调度兄弟组件，用于特色、营销或引导式对话框。",
  "usage": {
    "description": "像 DialogHeader 一样放进 Dialog 内 Layout 的 header 槽位。当对话框打开的是特色、营销或引导时刻，而紧凑的 DialogHeader 显得过于低调时使用。媒体会自动延伸到对话框边缘，关闭按钮浮动在其右上角。可见标题是默认的初始焦点目标；内联预览不会移动焦点。请安装 @astryxdesign/lab@canary 与 @astryxdesign/core@canary，并导入两个包的 CSS。Lab API 可能在 canary 版本之间变化。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "设置 `mediaMode` 使其匹配媒体的亮度，以便叠加的关闭按钮保持可读：深色图像需要 `mediaMode=\"dark\"`。"
      },
      {
        "guidance": true,
        "description": "将媒体内容调整为填满槽位（图片设置 width 100%）；槽位本身只负责定位和通栏延伸。"
      },
      {
        "guidance": true,
        "description": "将操作（CTA）放在 LayoutFooter 中；英雄式标题栏不接受 actions 槽位。"
      },
      {
        "guidance": true,
        "description": "当媒体已经在视觉上传达信息时使用 `isTitleHidden`；标题仍会为屏幕阅读器命名对话框。"
      },
      {
        "guidance": false,
        "description": "不要用于常规确认或表单；请改用紧凑的 DialogHeader。"
      },
      {
        "guidance": false,
        "description": "不要传入没有空 alt 的装饰性媒体：对纯装饰图片使用 `alt=\"\"`，以便屏幕阅读器跳过它们。"
      }
    ]
  },
  "propDescriptions": {
    "title": "对话框标题。字符串会被包装在二级 Heading 中（与 DialogHeader 一致）；传入预先设置样式的 Heading 元素以自定义处理。除非 Dialog 有显式标签，否则通过 `aria-labelledby` 为父级 Dialog 提供无障碍标签。可见标题是默认的初始焦点目标；另一个符合条件后代的自动聚焦请求优先。自定义 Heading 会在自身元素上接收标签和焦点；如果它设置了自己的 id，请用 `aria-labelledby` 命名 Dialog。",
    "media": "渲染在标题上方的通栏视觉内容（图片、插图或图标）。会拉伸到对话框的内边距边缘；关闭按钮叠加在其右上角。请设置媒体本身尺寸（例如 width 100%）以填满槽位。",
    "mediaMode": "媒体表面的亮度。底层会组合 MediaTheme，使叠加在媒体上的内容（关闭按钮）采用对比度安全的反转令牌：'dark' 媒体获得浅色叠加内容，'light' 媒体获得深色内容。省略则保持环境主题令牌。",
    "isTitleHidden": "在视觉上隐藏标题行，同时保持其对屏幕阅读器可用，使对话框仍由标题命名。",
    "startContent": "放在标题之前的内容（例如图标），与标题行内联。",
    "maxLines": "标题以省略号截断前的最大行数。仅当 title 为字符串（自动包装在 Heading 中）时适用。",
    "onOpenChange": "关闭按钮回调，点击关闭按钮时以 false 调用。未提供则不渲染关闭按钮。契约与 DialogHeader 相同。",
    "hasDivider": "在底部边缘添加主题化边框。默认使用父级 Layout 的 `defaultHasDividers` 上下文值。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'canary-only lab hero Dialog header: full-bleed media slot + title, close button overlaid on media (MediaTheme via mediaMode)',
  usage: {
    description:
      'High-emphasis sibling of DialogHeader for featured/marketing/onboarding dialogs. Drops into Layout header slot; media bleeds to dialog edges; title names the dialog; visible title is the default initial focus target. Import from @astryxdesign/lab and load core + lab CSS; install both packages at @canary.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Match mediaMode to the media luminance for close-button contrast.',
      },
      {
        guidance: true,
        description: 'Size media to fill the slot (width 100%).',
      },
      {guidance: true, description: 'Keep CTAs in LayoutFooter.'},
      {
        guidance: true,
        description:
          'Use isTitleHidden when the media carries the message; SR name is kept.',
      },
      {
        guidance: false,
        description: 'Use for routine confirmations/forms; use DialogHeader.',
      },
    ],
  },
};
