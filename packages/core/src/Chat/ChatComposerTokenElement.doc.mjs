// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatComposerTokenElement',
  subComponentOf: 'Chat',
  displayName: 'Chat Composer Token Element',
  isHiddenFromOverview: true,
  description: 'Renders a single token chip outside the contentEditable input. Wraps a badge config or custom render function in the correct data-astryx-token span so the token serializes properly and stays visually consistent with tokens inside the composer.',
  playground: {
    defaults: {
      token: {value: '@astryx', label: '@astryx', variant: 'blue'},
    },
  },
  props: [
    {
      name: 'token',
      type: 'ChatComposerToken',
      description: 'The token to render. Pass a badge config ({ value, label, variant?, icon? }) for the common case, or a custom render ({ value, render }) for full control.',
      required: true,
    },
  ],
};

export const docsZh = {
  "name": "ChatComposerTokenElement",
  "isHiddenFromOverview": true,
  "displayName": "Chat Composer Token Element",
  "description": "在 contentEditable 输入框之外渲染单个令牌芯片。将徽章配置或自定义渲染函数包裹在正确的 `data-astryx-token` span 中，使令牌正确序列化，并与编辑器内的令牌保持视觉一致。",
  "propDescriptions": {
    "token": "要渲染的令牌。常见情况传入徽章配置（`{ value, label, variant?, icon? }`），或传入自定义渲染（`{ value, render }`）以获得完全控制。"
  }
};

export const docsDense = {
  name: 'ChatComposerTokenElement',
  isHiddenFromOverview: true,
  displayName: 'Chat Composer Token Element',
  description: 'token chip outside contentEditable; badge config or custom render in data-astryx-token span',
  propDescriptions: {
    token: 'badge config or custom render',
  },
};
