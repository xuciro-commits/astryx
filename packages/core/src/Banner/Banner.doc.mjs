// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Banner',
  displayName: 'Banner',
  category: 'Feedback & Status',
  keywords: ["banner","alert","notification","callout","notice","status","message","info","warning","error","success","toast"],
  usage: {
    description:
      'Banner shows a persistent message at the top of a page or section. Use it for form errors, system updates, maintenance notices, or success confirmations that the user needs to see until they act on it.',
    bestPractices: [
      {guidance: true, description: 'Pick a status that matches the message: info for updates, warning for caution, error for problems, success for confirmations.'},
      {guidance: true, description: 'Use the card container inside page content and the section container for full-width messages that span the entire page.'},
      {guidance: true, description: 'Make info and success banners dismissable. Keep error banners visible until the user fixes the issue.'},
      {guidance: true, description: 'Keep titles short and scannable: "Payment failed" not "There was a problem processing your most recent payment."'},
      {guidance: false, description: 'Use Banner for short-lived messages that disappear on their own; use Toast instead.'},
      {guidance: false, description: 'Stack multiple banners with the same status; combine related messages into one banner.'},
      {guidance: true, description: 'Set collapsible={false} when the user needs the content to act on the message, like the list of fields that failed validation. Keep the default toggle when the detail is long enough to bury the banner\'s own message.'},
      {guidance: true, description: 'Banner status controls color and icon only; it does not create a live region. Announce async outcomes from the transition handler with useAnnounce. Pass role="alert" only for an urgent message the person must act on now: Banner puts it on the title and description, so controls, endContent and supporting content are not read as part of the alert. Do not also announce that message with useAnnounce.'},
      {guidance: false, description: 'Rely on the status color or icon alone to carry meaning; say which status it is in the title text, because the icon is decorative to a screen reader.'},
    ],
    anatomy: [
      {name: 'Banner frame', required: true, description: 'Outer frame that groups the status surface and optional content surface. It carries whole-banner elevation and, for elevated card banners, the radius that shapes that silhouette.'},
      {name: 'Status surface', required: true, description: 'The primary painted surface. It communicates status and contains the icon, title, description, actions, and controls.'},
      {name: 'Icon', required: true, description: 'Automatically set based on the status (info, warning, error, success).'},
      {name: 'Title', required: true, description: 'The main message. Always required.'},
      {name: 'Description', required: false, description: 'Additional detail below the title.'},
      {name: 'Action button', required: false, description: 'A button for the user to act on the message, like "Review" or "Retry".'},
      {name: 'Dismiss button', required: false, description: 'Lets the user close the banner. Enabled by setting isDismissable.'},
      {name: 'Content surface', required: false, description: 'Secondary surface for extra detail below the status surface, like a list of errors. Sits behind an expand/collapse toggle by default; set collapsible={false} to keep it visible.'},
    ],
  },

  examples: [
    {
      label: 'Announce an async outcome from its transition handler',
      code: `import {useState} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {useAnnounce} from '@astryxdesign/core/hooks';

function SaveSettings() {
  const announce = useAnnounce();
  const [result, setResult] = useState<'success' | 'error' | null>(null);

  async function handleSave() {
    try {
      await saveSettings();
      setResult('success');
      announce('Settings saved');
    } catch {
      setResult('error');
      announce('Settings could not be saved');
    }
  }

  return (
    <>
      <Button label="Save settings" onClick={handleSave} />
      {result != null ? (
        <Banner
          status={result}
          title={result === 'success' ? 'Settings saved' : 'Save failed'}
        />
      ) : null}
    </>
  );
}`,
    },
  ],

  props: [
    {
      name: 'status',
      type: "'info' | 'warning' | 'error' | 'success'",
      description: 'Status type controlling icon and color.',
      required: true,
    },
    {
      name: 'title',
      type: 'ReactNode',
      description: 'Title text or ReactNode displayed in the header.',
      required: true,
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Description text rendered below the title in the header.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Override the default status icon.',
      slotElements: [{__element: 'Icon', props: {icon: 'check', size: 'sm'}}],
    },
    {
      name: 'isDismissable',
      type: 'boolean',
      description: 'Whether the banner can be dismissed by the user.',
      default: 'false',
    },
    {
      name: 'onDismiss',
      type: '() => void',
      description:
        'Called when the dismiss button is clicked; banner hides itself regardless of whether this is provided.',
    },
    {
      name: 'dismissLabel',
      type: 'string',
      description:
        'Accessible name and visible tooltip for the dismiss button (pass it already translated). Defaults to "Dismiss <title>" for a string title, so stacked banners are distinguishable; set it when the title is a ReactNode.',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Action content rendered in the header area, end-aligned. Wraps to its own row below the text when the header is too narrow to hold both.',
      slotElements: [
        {__element: 'Icon', props: {icon: 'chevronDown', size: 'sm'}},
        {__element: 'Badge', props: {label: '3'}},
      ],
    },
    {
      name: 'container',
      type: "'card' | 'section'",
      description:
        'Container type: card has border-radius; section is full-width with no border-radius for page-level use.',
      default: "'card'",
    },
    {
      name: 'elevation',
      type: "'none' | 'low' | 'med' | 'high'",
      description:
        'Resting shadow depth. Use for a floating banner that hovers above content; `none` is the default inline banner. A `card`-container banner rounds its shadow to match.',
      default: "'none'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Content rendered in the card-background area below the colored header. Sits behind an expand/collapse toggle unless `collapsible={false}`.',
    },
    {
      name: 'collapsible',
      type: 'boolean | {defaultIsOpen?: boolean; isOpen?: boolean; onOpenChange?: (isOpen: boolean) => void}',
      description:
        'Whether the content area (children) sits behind an expand/collapse toggle in the header. On by default, starting collapsed. `false` opts out: children are always visible with no toggle. `{defaultIsOpen: true}` starts open; `{isOpen, onOpenChange}` is controlled. Takes the same CollapsibleConfig as Collapsible.',
      default: 'true',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],

  playground: {
    defaults: {
      title: 'System maintenance scheduled',
      description: 'The platform will be briefly unavailable on Sunday from 2–4 AM PST.',
      status: 'info',
    },
  },
  theming: {
    targets: [
      {className: 'astryx-banner-frame', visualProps: ['container', 'elevation']},
      {className: 'astryx-banner', visualProps: ['container', 'status']},
      {className: 'astryx-banner-icon', visualProps: ['status']},
      {className: 'astryx-banner-description'},
      {className: 'astryx-banner-content', visualProps: ['container', 'status']},
    ],
    vars: [
      {name: '--_banner-radius', description: 'Border radius of the card container (header, content area and the elevated root silhouette)', default: 'var(--radius-container)', private: true},
    ],
    derived: [
      {property: 'borderRadius', vars: ['--_banner-radius']},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Banner",
  "displayName": "Banner",
  "usage": {
    "description": "Banner 在页面或区块顶部显示一条常驻消息。用于表单错误、系统更新、维护通知或用户需要看到并处理后才消失的成功确认。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "选择与消息匹配的状态：更新用 info，警告用 warning，问题用 error，确认用 success。"
      },
      {
        "guidance": true,
        "description": "页面内容内部使用 card 容器，需要横跨整个页面的全宽消息使用 section 容器。"
      },
      {
        "guidance": true,
        "description": "让 info 和 success 横幅可关闭。错误横幅应保持可见，直到用户解决问题。"
      },
      {
        "guidance": true,
        "description": "保持标题简短易扫读：用“付款失败”，而不是“处理您最近一笔付款时出现问题”。"
      },
      {
        "guidance": false,
        "description": "将 Banner 用于会自动消失的短暂消息；请改用 Toast。"
      },
      {
        "guidance": false,
        "description": "堆叠多个相同状态的横幅；将相关消息合并到一个横幅中。"
      },
      {
        "guidance": true,
        "description": "当用户需要内容来处理消息（例如验证失败的字段列表）时，设置 collapsible={false}。当详情长到会淹没横幅自身消息时，保留默认切换。"
      },
      {
        "guidance": true,
        "description": "Banner 的状态仅控制颜色和图标；它不会创建实时区域。在过渡处理函数中使用 useAnnounce 宣布异步结果。仅对用户必须立即处理的紧急消息传入 role=\"alert\"：Banner 会将其放在标题和描述上，因此控件、endContent 和辅助内容不会被作为警报的一部分朗读。也不要再用 useAnnounce 宣布该消息。"
      },
      {
        "guidance": false,
        "description": "仅依赖状态颜色或图标来传达含义；请在标题文本中说明状态，因为图标对屏幕阅读器是装饰性的。"
      }
    ],
    "anatomy": [
      {
        "name": "Banner 框架",
        "required": true,
        "description": "外层框架，用于组合状态表面和可选的内容表面。它承载整个横幅的阴影，对于带高度的卡片横幅，还承载塑造该轮廓的圆角。"
      },
      {
        "name": "状态表面",
        "required": true,
        "description": "主要绘制表面。它传达状态，并包含图标、标题、描述、操作和控件。"
      },
      {
        "name": "图标",
        "required": true,
        "description": "根据状态（info、warning、error、success）自动设置。"
      },
      {
        "name": "标题",
        "required": true,
        "description": "主要消息。始终必需。"
      },
      {
        "name": "描述",
        "required": false,
        "description": "标题下方的附加详情。"
      },
      {
        "name": "操作按钮",
        "required": false,
        "description": "供用户针对消息执行操作的按钮，例如“查看”或“重试”。"
      },
      {
        "name": "关闭按钮",
        "required": false,
        "description": "让用户关闭横幅。通过设置 isDismissable 启用。"
      },
      {
        "name": "内容表面",
        "required": false,
        "description": "状态表面下方的次要表面，用于显示额外详情，例如错误列表。默认位于展开/折叠切换之后；设置 collapsible={false} 使其保持可见。"
      }
    ]
  },
  "props": [
    {
      "name": "status",
      "type": "'info' | 'warning' | 'error' | 'success'",
      "description": "控制图标和颜色的状态类型。",
      "required": true
    },
    {
      "name": "title",
      "type": "ReactNode",
      "description": "在标题栏中显示的标题文本或 ReactNode。",
      "required": true
    },
    {
      "name": "description",
      "type": "ReactNode",
      "description": "在标题栏中标题下方渲染的描述文本。"
    },
    {
      "name": "icon",
      "type": "ReactNode",
      "description": "覆盖默认状态图标。"
    },
    {
      "name": "isDismissable",
      "type": "boolean",
      "description": "用户是否可以关闭横幅。",
      "default": "false"
    },
    {
      "name": "onDismiss",
      "type": "() => void",
      "description": "点击关闭按钮时调用；无论是否提供此回调，横幅都会自行隐藏。"
    },
    {
      "name": "dismissLabel",
      "type": "string",
      "description": "关闭按钮的无障碍名称和可见工具提示（请传入已翻译的文本）。默认对字符串标题使用“关闭 <title>”，以便区分堆叠的横幅；当标题是 ReactNode 时请设置此项。"
    },
    {
      "name": "endContent",
      "type": "ReactNode",
      "description": "在标题栏区域中渲染、末端对齐的操作内容。当标题栏太窄无法同时容纳两者时，会换行到文本下方的独立行。"
    },
    {
      "name": "container",
      "type": "'card' | 'section'",
      "description": "容器类型：card 带圆角；section 为全宽且无圆角，适用于页面级用途。",
      "default": "'card'"
    },
    {
      "name": "elevation",
      "type": "'none' | 'low' | 'med' | 'high'",
      "description": "静止阴影深度。用于悬浮在内容上方的浮动横幅；`none` 是默认的内联横幅。`card` 容器的横幅会相应调整阴影圆角。",
      "default": "'none'"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "在彩色标题下方卡片背景区域中渲染的内容。除非 `collapsible={false}`，否则位于展开/折叠切换之后。"
    },
    {
      "name": "collapsible",
      "type": "boolean | {defaultIsOpen?: boolean; isOpen?: boolean; onOpenChange?: (isOpen: boolean) => void}",
      "description": "内容区域（children）是否位于标题栏中的展开/折叠切换之后。默认开启，初始为折叠。`false` 表示退出：children 始终可见且无切换。`{defaultIsOpen: true}` 初始为展开；`{isOpen, onOpenChange}` 为受控模式。接受与 Collapsible 相同的 CollapsibleConfig。",
      "default": "true"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，不能是 style={{}} 这样的内联样式对象。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-banner-frame",
        "visualProps": [
          "container",
          "elevation"
        ]
      },
      {
        "className": "astryx-banner",
        "visualProps": [
          "container",
          "status"
        ]
      },
      {
        "className": "astryx-banner-icon",
        "visualProps": [
          "status"
        ]
      },
      {
        "className": "astryx-banner-description"
      },
      {
        "className": "astryx-banner-content",
        "visualProps": [
          "container",
          "status"
        ]
      }
    ],
    "vars": [
      {
        "name": "--_banner-radius",
        "description": "Border radius of the card container (header, content area and the elevated root silhouette)",
        "default": "var(--radius-container)",
        "private": true
      }
    ],
    "derived": [
      {
        "property": "borderRadius",
        "vars": [
          "--_banner-radius"
        ]
      }
    ]
  },
  "propDescriptions": {
    "status": "控制图标和颜色的状态类型。",
    "title": "在标题栏中显示的标题文本或 ReactNode。",
    "description": "在标题栏中标题下方渲染的描述文本。",
    "icon": "覆盖默认状态图标。",
    "isDismissable": "用户是否可以关闭横幅。",
    "onDismiss": "点击关闭按钮时调用；无论是否提供此回调，横幅都会自行隐藏。",
    "dismissLabel": "关闭按钮的无障碍名称和可见工具提示（请传入已翻译的文本）。默认对字符串标题使用“关闭 <title>”，以便区分堆叠的横幅；当标题是 ReactNode 时请设置此项。",
    "endContent": "在标题栏区域中渲染、末端对齐的操作内容。当标题栏太窄无法同时容纳两者时，会换行到文本下方的独立行。",
    "container": "容器类型：card 带圆角；section 为全宽且无圆角，适用于页面级用途。",
    "elevation": "静止阴影深度。用于悬浮在内容上方的浮动横幅；`none` 是默认的内联横幅。`card` 容器的横幅会相应调整阴影圆角。",
    "children": "在彩色标题下方卡片背景区域中渲染的内容。除非 `collapsible={false}`，否则位于展开/折叠切换之后。",
    "collapsible": "内容区域（children）是否位于标题栏中的展开/折叠切换之后。默认开启，初始为折叠。`false` 表示退出：children 始终可见且无切换。`{defaultIsOpen: true}` 初始为展开；`{isOpen, onOpenChange}` 为受控模式。接受与 Collapsible 相同的 CollapsibleConfig。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，不能是 style={{}} 这样的内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'persistent message for errors, updates, warnings, or confirmations',
  usage: {
    description:
      'Banner shows a persistent message at the top of a page or section. Use for form errors, system updates, maintenance notices, or success confirmations.',
    bestPractices: [
      {guidance: true, description: 'Match status to message: info for updates, warning for caution, error for problems, success for confirmations.'},
      {guidance: true, description: 'Card container for inline content, section container for full-width page-level messages.'},
      {guidance: true, description: 'Make info/success dismissable. Keep error banners until the issue is fixed.'},
      {guidance: true, description: 'Keep titles short: "Payment failed" not "There was a problem processing your payment."'},
      {guidance: false, description: 'Use for auto-dismissing messages; use Toast instead.'},
      {guidance: false, description: 'Stack multiple banners of the same status; combine into one.'},
      {guidance: true, description: 'Status controls color + icon only; Banner is non-live by default. Announce async outcomes from the transition handler with useAnnounce. role="alert" only for urgent messages; it lands on title + description, not controls or content. Never both.'},
      {guidance: false, description: 'Rely on status color or icon alone; state the status in the title text, since the icon is decorative to a screen reader.'},
    ],
    anatomy: [
      {name: 'Banner frame', required: true, description: 'Outer frame grouping the status and optional content surfaces; owns whole-banner elevation and its elevated-card silhouette.'},
      {name: 'Status surface', required: true, description: 'Primary painted surface communicating status and containing the message and controls.'},
      {name: 'Icon', required: true, description: 'Set automatically from status.'},
      {name: 'Title', required: true, description: 'Main message text.'},
      {name: 'Description', required: false, description: 'Detail below title.'},
      {name: 'Action button', required: false, description: 'CTA like Review or Retry.'},
      {name: 'Dismiss button', required: false, description: 'Close button via isDismissable.'},
      {name: 'Content surface', required: false, description: 'Secondary detail surface; behind a toggle unless collapsible={false}.'},
    ],
  },
  propDescriptions: {
    status: 'controls icon+color',
    title: 'title text/ReactNode in header',
    description: 'text below title in header',
    icon: 'override default status icon',
    isDismissable: 'user can dismiss banner',
    onDismiss: 'dismiss callback; banner self-hides regardless',
    dismissLabel:
      'a11y name + visible tooltip for dismiss; defaults to "Dismiss <title>"',
    endContent: 'end-aligned action in header, typically button/link; wraps to its own row when the header is too narrow',
    container: 'card=border-radius; section=full-width no radius for page-level',
    elevation: 'resting shadow depth: none|low|med|high; raise for a floating banner',
    children: 'content in card-bg area below colored header; behind a toggle unless collapsible={false}',
    collapsible: 'children behind a header toggle; default true=collapsed. false=always visible, no toggle. {defaultIsOpen:true}=starts open, {isOpen,onOpenChange}=controlled',
    xstyle: 'StyleX layout customization via stylex.create()',
  },
};
