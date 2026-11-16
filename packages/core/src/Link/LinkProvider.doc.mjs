// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'LinkProvider',
  displayName: 'Link Provider',
  group: 'Utilities',
  category: 'Utility',
  isHiddenFromOverview: true,
  keywords: ['link', 'provider', 'router', 'nextjs', 'client-side-routing'],
  usage: {
    description: 'Wraps your app to replace the default <a> tag with a framework-specific link component (e.g. Next.js Link) for client-side routing across all Astryx components.',
  },
  props: [
    {name: 'component', type: 'LinkComponentType', required: true, description: 'Link component to use for all link elements in the subtree (e.g. Next.js Link). It receives accepted `href` and `to` values under the shared navigation rule described on the Link `href` prop. Supported structured destinations, including their `protocol`, are checked without changing object identity. If either supplied destination is rejected, Astryx renders inert content without invoking this component; it does not pass undefined or fall back to the other destination.'},
    {name: 'children', type: 'ReactNode', required: true, description: 'The subtree. Astryx links in it that render through `useLinkComponent`, such as Link and Button with `href`, use `component`, unless a link sets its own `as` or a nearer LinkProvider sets another component. A disabled Link does not use it.'},
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Wraps app to replace default <a> tag w/ framework-specific link component (e.g. Next.js Link) for client-side routing across all Astryx components.',
  usage: {
    description: 'Wraps app to replace default <a> tag w/ framework-specific link component (e.g. Next.js Link) for client-side routing across all Astryx components.',
  },
  propDescriptions: {
    component: 'link component for all link elements in subtree (e.g. Next.js Link). Accepted href/to follow the Link href rule; structured fields including protocol are checked, preserving identity. Either rejected => inert content, no router invocation or fallback.',
    children: 'Subtree; links rendered through useLinkComponent (Link, Button w/ href) use component unless they set `as` or a nearer provider applies; a disabled Link does not.',
  },
};

export const docsZh = {
  "name": "LinkProvider",
  "displayName": "Link Provider",
  "usage": {
    "description": "包裹应用，将默认的 <a> 标签替换为框架专用的链接组件（例如 Next.js Link），以便所有 Astryx 组件都使用客户端路由。"
  },
  "propDescriptions": {
    "component": "用于子树中所有链接元素的链接组件（例如 Next.js Link）。它按照 Link 的 href 属性所述的共享导航规则接收可接受的 `href` 和 `to` 值。受支持的结构化目标（包括其 `protocol`）会在不改变对象身份的情况下接受检查。如果提供的任一目标被拒绝，Astryx 会渲染惰性内容而不调用此组件；它不会传入 undefined，也不会回退到另一个目标。",
    "children": "子树。其中通过 `useLinkComponent` 渲染的 Astryx 链接（例如 Link 以及带 `href` 的 Button）使用 `component`，除非某个链接设置了自己的 `as`，或者更近的 LinkProvider 设置了其他组件。禁用的 Link 不使用它。"
  }
};
