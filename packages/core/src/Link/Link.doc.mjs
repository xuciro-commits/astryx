// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Link',
  displayName: 'Link',
  category: 'Action',
  keywords: ["link","anchor","href","hyperlink","navigation","url","external","textlink"],
  playground: {
    defaults: {
      href: '#',
      children: 'Learn more',
    },
  },
  theming: {
    targets: [
      {className: 'astryx-link', visualProps: ['color']},
    ],
  },
  components: [
    {
      name: 'Link',
      displayName: 'Link',
      description:
        'Styled anchor link with variants, external link support, and polymorphic rendering.',
      props: [
        {
          name: 'as',
          type: 'LinkComponentType',
          description: 'Custom component to render instead of <a>',
        },
        {
          name: 'label',
          type: 'string',
          description: 'Accessible label (aria-label). Only use when children are not self-descriptive (e.g. icon-only links). Omit for text links; the link text is the accessible name.',
        },
        {
          name: 'href',
          type: 'string',
          description:
            'Link destination URL. Astryx-owned links and clickable surfaces block javascript:, vbscript:, and data:text/html after control-character removal, outer-whitespace trimming, and case-insensitive scheme inspection. The same rule covers native anchors, custom routers, Markdown links, and every activation method. Relative paths, fragments, protocol-relative URLs, HTTP(S), mailto, tel, safe custom schemes, and accepted downloads keep their existing behavior. A rejected destination renders inertly without invoking a custom router. There is no bypass prop; exceptional behavior requires caller-owned custom rendering outside this guarantee. Images and other resource URLs have separate policies.',
        },
        {
          name: 'hasUnderline',
          type: 'boolean',
          description: 'Always show underline',
          default: 'false',
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description: 'Disables the link. It cannot navigate or run `onClick`, keeps its Tab stop, and is announced as disabled.',
          default: 'false',
        },
        {
          name: 'isExternalLink',
          type: 'boolean',
          description:
            'Opens in new tab with external icon and safe rel tokens',
          default: 'false',
        },
        {
          name: 'newTabLabel',
          type: 'string',
          description:
            'Screen-reader text announcing that an external link opens in a new tab. Override for localization.',
          default: "'(opens in new tab)'",
        },
        {
          name: 'target',
          type: 'string',
          description:
            'Where to open linked document. target="_blank" automatically adds noopener noreferrer.',
        },
        {
          name: 'rel',
          type: 'string',
          description:
            'Link relationship tokens. noopener noreferrer are merged automatically for target="_blank".',
        },
        {
          name: 'download',
          type: 'string | boolean',
          description:
            'Causes the browser to download the linked URL. A string specifies the suggested filename.',
        },
        {
          name: 'referrerPolicy',
          type: 'HTMLAttributeReferrerPolicy',
          description: 'Referrer policy for the link.',
        },
        {
          name: 'onClick',
          type: 'MouseEventHandler',
          description: 'Click event handler',
        },
        {
          name: 'tooltip',
          type: 'string',
          description: 'Tooltip text displayed on hover',
        },
        {
          name: 'isStandalone',
          type: 'boolean',
          description: 'Applies base font sizing',
          default: 'false',
        },
        {
          name: 'type',
          type: "'body' | 'large' | 'label' | 'supporting' | 'code' | 'display-1' | 'display-2' | 'display-3' | 'inherit'",
          description: 'Text type forwarded to Text, or a custom text type the theme defines. Use `inherit` for a link inside a Text, so the link takes the size and line height of the text around it.',
          default: "'body'",
        },
        {
          name: 'size',
          type: "'4xs' | '3xs' | '2xs' | 'xsm' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'",
          description: 'Explicit font size override forwarded to Text.',
        },
        {
          name: 'weight',
          type: "'normal' | 'medium' | 'semibold' | 'bold'",
          description: 'Font weight override forwarded to Text.',
        },
        {
          name: 'color',
          type: "'primary' | 'secondary' | 'disabled' | 'placeholder' | 'accent' | 'inherit'",
          description: 'Text color forwarded to Text.',
          default: "'accent'",
        },
        {
          name: 'display',
          type: "'inline' | 'block'",
          description: 'Display type for Text.',
          default: "'inline'",
        },
        {
          name: 'maxLines',
          type: 'number',
          description: 'Maximum lines before truncation.',
          default: '0',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Link content',
          required: true,
        },
        {
          name: 'ref',
          type: 'Ref<HTMLAnchorElement | HTMLButtonElement>',
          description: 'Ref to the root element: the anchor, or the button when the link renders as a button.',
        },
      ],    },
    {
      name: 'LinkProvider',
      isHiddenFromOverview: true,
      displayName: 'Link Provider',
      description:
        'Provider that sets the default link component for all Astryx link-rendering components in the subtree. ' +
        'Wrap your app root to replace native <a> elements with your framework router (Next.js Link, React Router Link, etc.).',
      props: [
        {
          name: 'component',
          type: 'LinkComponentType',
          description:
            'Component to use for all link elements. It receives accepted `href` and `to` values under the shared navigation rule described on the Link `href` prop. Supported structured destinations, including their `protocol`, are checked without changing object identity. If either supplied destination is rejected, Astryx renders inert content without invoking this component; it does not pass undefined or fall back to the other destination.',
          required: true,
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Subtree',
          required: true,
        },
      ],
    },
  ],
  usage: {
    accessibility: [
      {
        name: 'Link text',
        category: 'Color contrast',
        criterion: '1.4.3 Contrast (Minimum)',
        requirement: '4.5:1',
        states: ['Rest', 'Hover', 'Pointer down'],
        description:
          'Link text must have at least 4.5:1 contrast with the background behind it. For Pointer down, measure against the pressed overlay the link paints behind its text.',
      },
    ],
    description:
      'A styled anchor for inline and standalone text navigation. Supports external links, underline variants, tooltips, and custom link components for router integration. Use it for navigating between pages or to external URLs.',
    bestPractices: [
      { guidance: true, description: 'Write descriptive, concise link text that clearly communicates the destination.' },
      { guidance: true, description: 'Set `isStandalone` when the link appears outside of inline text, so it receives proper base font sizing.' },
      { guidance: true, description: 'Put a Link inside a <Text maxLines> to truncate it with the surrounding text; inside a clamped Text the link flows in the text\'s lines.' },
      { guidance: true, description: 'Only set `label` when the link content is not descriptive text (e.g. an icon-only link). For text links, the visible text is already the accessible name; adding `label` overrides it for screen readers, which is harmful.' },
      { guidance: false, description: 'Use Link for actions that do not navigate; use a Button instead.' },
      { guidance: false, description: 'Use generic text like "click here" or "read more"; describe the destination.' },
      { guidance: false, description: 'Set `label` on text links; `aria-label` prevents assistive technology from reading the actual link content.' },
      { guidance: false, description: 'Give a Link inside a clamped Text its own `display` or `maxLines`, or render it as a button (`onClick` with no `href`), and expect the outer clamp to cut it; that Link keeps its own box.' },
      { guidance: false, description: 'Put a Link with block-level content, such as an HStack with an icon, inside a clamped Text; block content breaks the clamp. Clamp a text-only Link, or place the composed Link outside the clamp.' },
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'The visible text of the link.'},
      {name: 'External icon', required: false, description: 'Extra-small icon after the label when `isExternalLink` is set. It takes the link color. Screen readers hear the new-tab text instead of the icon.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Link",
  "displayName": "Link",
  "theming": {
    "targets": [
      {
        "className": "astryx-link",
        "visualProps": [
          "color"
        ]
      }
    ]
  },
  "components": [
    {
      "name": "Link",
      "displayName": "Link",
      "description": "带样式、支持变体、外部链接和多态渲染的锚点链接。",
      "props": [
        {
          "name": "as",
          "type": "LinkComponentType",
          "description": "用于替代 <a> 渲染的自定义组件"
        },
        {
          "name": "label",
          "type": "string",
          "description": "无障碍标签（aria-label）。仅在子内容不是描述性文本时使用（如纯图标链接）。文本链接请省略此项。"
        },
        {
          "name": "href",
          "type": "string",
          "description": "链接目标 URL"
        },
        {
          "name": "hasUnderline",
          "type": "boolean",
          "description": "始终显示下划线",
          "default": "false"
        },
        {
          "name": "isDisabled",
          "type": "boolean",
          "description": "禁用链接。链接不能导航，也不会运行 `onClick`；它保留 Tab 焦点位置，并被读作已禁用。",
          "default": "false"
        },
        {
          "name": "isExternalLink",
          "type": "boolean",
          "description": "在新标签页中打开，带外部图标和安全 rel 标记",
          "default": "false"
        },
        {
          "name": "newTabLabel",
          "type": "string",
          "description": "向屏幕阅读器announce外部链接将在新标签页打开的文本。可覆盖以本地化。",
          "default": "'(opens in new tab)'"
        },
        {
          "name": "target",
          "type": "string",
          "description": "链接文档的打开位置。target=\"_blank\" 会自动添加 noopener noreferrer。"
        },
        {
          "name": "rel",
          "type": "string",
          "description": "链接关系标记。target=\"_blank\" 会自动合并 noopener noreferrer。"
        },
        {
          "name": "onClick",
          "type": "MouseEventHandler",
          "description": "点击事件处理器"
        },
        {
          "name": "tooltip",
          "type": "string",
          "description": "悬停时显示的工具提示文本"
        },
        {
          "name": "isStandalone",
          "type": "boolean",
          "description": "应用基础字体大小",
          "default": "false"
        },
        {
          "name": "children",
          "type": "ReactNode",
          "description": "链接内容",
          "required": true
        }
      ],
      "propDescriptions": {
        "as": "用于替代 <a> 渲染的自定义组件",
        "label": "无障碍标签（aria-label）。仅当子元素不能自我描述（例如纯图标链接）时使用。文本链接请省略；链接文本就是无障碍名称。",
        "href": "链接目标 URL。Astryx 拥有的链接和可点击表面会在移除控制字符、裁剪外部空白并进行不区分大小写的协议检查后，阻止 `javascript:`、`vbscript:` 和 `data:text/html`。同一规则适用于原生锚点、自定义路由器、Markdown 链接以及每种激活方式。相对路径、片段、协议相对 URL、HTTP(S)、mailto、tel、安全的自定义协议以及被接受的下载会保持现有行为。被拒绝的目标会以惰性方式渲染，且不会调用自定义路由器。没有绕过属性；例外行为需要调用方在此保证之外自行实现自定义渲染。图片和其他资源 URL 有单独的策略。",
        "hasUnderline": "始终显示下划线",
        "isDisabled": "禁用链接。它无法导航或运行 `onClick`，保留其 Tab 停靠点，并被播报为禁用。",
        "isExternalLink": "在新标签页中打开，并显示外部链接图标和安全 rel 令牌",
        "newTabLabel": "向屏幕阅读器播报外部链接在新标签页打开的文本。可覆盖以进行本地化。",
        "target": "打开链接文档的位置。target=\"_blank\" 会自动添加 noopener noreferrer。",
        "rel": "链接关系令牌。对于 target=\"_blank\"，会自动合并 noopener noreferrer。",
        "download": "使浏览器下载链接的 URL。字符串指定建议的文件名。",
        "referrerPolicy": "链接的 referrer 策略。",
        "onClick": "点击事件处理函数",
        "tooltip": "悬停时显示的 Tooltip 文本",
        "isStandalone": "应用基础字号",
        "type": "转发给 Text 的文本类型，或主题定义的自定义文本类型。对于 Text 内的链接使用 `inherit`，使链接采用周围文本的字号和行高。",
        "size": "转发给 Text 的显式字号覆盖。",
        "weight": "转发给 Text 的字重覆盖。",
        "color": "转发给 Text 的文本颜色。",
        "display": "Text 的显示类型。",
        "maxLines": "截断前的最大行数。",
        "children": "链接内容",
        "ref": "指向根元素的 ref：锚点，或当链接渲染为按钮时的按钮。"
      }
    },
    {
      "name": "LinkProvider",
      "isHiddenFromOverview": true,
      "displayName": "Link Provider",
      "description": "设置子树中所有 Astryx 链接渲染组件默认链接组件的提供者。包裹应用根节点，以用框架路由器（Next.js Link、React Router Link 等）替换原生 <a> 元素。",
      "props": [
        {
          "name": "component",
          "type": "LinkComponentType",
          "description": "用于所有链接元素的组件",
          "required": true
        },
        {
          "name": "children",
          "type": "ReactNode",
          "description": "子树",
          "required": true
        }
      ],
      "propDescriptions": {
        "component": "用于所有链接元素的组件。它按照 Link `href` 属性所述共享导航规则接收被接受的 `href` 和 `to` 值。受支持的结构化目标（包括其 `protocol`）会在不改变对象身份的情况下检查。如果提供的任一目标被拒绝，Astryx 会渲染惰性内容而不调用此组件；它不会传递 undefined，也不会回退到另一个目标。",
        "children": "子树"
      }
    }
  ],
  "usage": {
    "description": "用于内联和独立文本导航的带样式锚点。支持外部链接、下划线变体、Tooltip 以及用于路由集成的自定义链接组件。用于在页面之间导航或跳转到外部 URL。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "编写描述性强、简洁的链接文本，清晰传达目标位置。"
      },
      {
        "guidance": true,
        "description": "当链接出现在内联文本之外时，设置 `isStandalone`，以便获得正确的基础字号。"
      },
      {
        "guidance": true,
        "description": "将 Link 放入 `<Text maxLines>` 中，以便随周围文本一起截断；在被截断的 Text 内，链接会随文本行流动。"
      },
      {
        "guidance": true,
        "description": "仅当链接内容不是描述性文本（例如纯图标链接）时才设置 `label`。对于文本链接，可见文本已经是无障碍名称；添加 `label` 会为屏幕阅读器覆盖它，反而有害。"
      },
      {
        "guidance": false,
        "description": "不要将 Link 用于不会导航的操作；请改用 Button。"
      },
      {
        "guidance": false,
        "description": "不要使用“click here”或“read more”这类泛泛的文本；应描述目标位置。"
      },
      {
        "guidance": false,
        "description": "不要在文本链接上设置 `label`；`aria-label` 会阻止辅助技术读取实际的链接内容。"
      },
      {
        "guidance": false,
        "description": "不要为被截断 Text 内的 Link 单独设置 `display` 或 `maxLines`，或将其渲染为按钮（带 `onClick` 且无 `href`），并指望外层截断会裁剪它；该 Link 会保留自己的盒子。"
      },
      {
        "guidance": false,
        "description": "不要将带有块级内容（例如含图标的 HStack）的 Link 放入被截断的 Text 中；块级内容会破坏截断。请截断仅含文本的 Link，或将组合后的 Link 放在截断区域之外。"
      }
    ],
    "anatomy": [
      {
        "name": "标签",
        "required": true,
        "description": "链接的可见文本。"
      },
      {
        "name": "外部链接图标",
        "required": false,
        "description": "设置 `isExternalLink` 时，标签后的超小图标。它采用链接颜色。屏幕阅读器会听到新标签页文本，而不是图标。"
      }
    ],
    "accessibility": [
      {
        "name": "链接文本",
        "category": "Color contrast",
        "criterion": "1.4.3 Contrast (Minimum)",
        "requirement": "4.5:1",
        "states": [
          "静止",
          "悬停",
          "指针按下"
        ],
        "description": "链接文本与其背后背景的对比度必须至少为 4.5:1。对于指针按下，请测量链接在其文本后面绘制的按压叠加层。"
      }
    ]
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Styled anchor links w/ multiple variants + polymorphic link infra for custom link components (Next.js Link, React Router Link, etc.).',
  usage: {
    description:
      'A styled anchor for inline and standalone text navigation. Supports external links, underline variants, tooltips, and custom link components for router integration. Use it for navigating between pages or to external URLs.',
    bestPractices: [
      { guidance: true, description: 'Write descriptive, concise link text that clearly communicates the destination.' },
      { guidance: true, description: 'Set `isStandalone` when the link appears outside of inline text, so it receives proper base font sizing.' },
      { guidance: true, description: 'Put a Link inside a <Text maxLines> to truncate it with the surrounding text; inside a clamped Text the link flows in the text\'s lines.' },
      { guidance: true, description: 'Only set `label` when the link content is not descriptive text (e.g. an icon-only link). For text links, the visible text is already the accessible name; adding `label` overrides it for screen readers, which is harmful.' },
      { guidance: false, description: 'Use Link for actions that do not navigate; use a Button instead.' },
      { guidance: false, description: 'Use generic text like "click here" or "read more"; describe the destination.' },
      { guidance: false, description: 'Set `label` on text links; `aria-label` prevents assistive technology from reading the actual link content.' },
      { guidance: false, description: 'Give a Link inside a clamped Text its own `display` or `maxLines`, or render it as a button (`onClick` with no `href`), and expect the outer clamp to cut it; that Link keeps its own box.' },
      { guidance: false, description: 'Put a Link with block-level content, such as an HStack with an icon, inside a clamped Text; block content breaks the clamp. Clamp a text-only Link, or place the composed Link outside the clamp.' },
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'The visible text of the link.'},
      {name: 'External icon', required: false, description: 'Extra-small icon after the label when `isExternalLink` is set. It takes the link color. Screen readers hear the new-tab text instead of the icon.'},
    ],
  },
  components: [
    {
      name: 'Link',
      displayName: 'Link',
      description:
        'Styled anchor link w/ variants, external link support, polymorphic rendering.',
      propDescriptions: {
        as: 'Custom component to render instead of <a>',
        label: 'Accessible label (aria-label). Only for non-text content like icon-only links.',
        href: 'Link destination URL. Shared rule blocks javascript:, vbscript:, data:text/html after scheme normalization on every Astryx-owned navigation path. Ordinary URLs, fragments, safe custom schemes, and accepted downloads are preserved. Rejected => inert, no custom router. No bypass prop; exceptional caller-owned rendering is outside the guarantee. Image/resource policy is separate.',
        hasUnderline: 'Always show underline',
        isDisabled: 'Disables link: no navigation or onClick; keeps Tab stop; announced as disabled',
        isExternalLink: 'Opens new tab w/ external icon and safe rel tokens',
        newTabLabel: 'SR text announcing an external link opens in a new tab',
        target:
          'Where to open linked document. target="_blank" auto-adds noopener noreferrer.',
        rel: 'Link relationship tokens. noopener noreferrer are merged for target="_blank".',
        onClick: 'Click event handler',
        tooltip: 'Tooltip text on hover',
        isStandalone: 'Applies base font sizing',
        type: 'Text type forwarded to Text; `inherit` takes the surrounding text size',
        children: 'Link content',
        ref: 'Ref to the root anchor or button',
      },
    },
    {
      name: 'LinkProvider',
      isHiddenFromOverview: true,
      displayName: 'Link Provider',
      description:
        'Provider setting default link component for all Astryx links in subtree.',
      propDescriptions: {
        component: 'Component for all link elements. Accepted href/to follow the Link href rule; structured fields including protocol are checked, preserving identity. Either rejected => inert content, no router invocation or fallback.',
        children: 'Subtree',
      },
    },
  ],
};
