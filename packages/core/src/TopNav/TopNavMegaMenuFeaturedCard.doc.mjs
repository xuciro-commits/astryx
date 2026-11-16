// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TopNavMegaMenuFeaturedCard',
  subComponentOf: 'TopNav',
  displayName: 'Top Nav Mega Menu Featured Card',
  description: 'Standard featured card for the TopNavMegaMenu featured slot. Provides a consistent card with optional image, title, description, and CTA link.',
  props: [
    {
      name: 'title',
      type: 'string',
      description: 'Card title.',
      required: true,
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text below the title.',
    },
    {
      name: 'image',
      type: 'string',
      description: 'Optional image URL displayed above the body.',
    },
    {
      name: 'imageAlt',
      type: 'string',
      description: 'Alt text for the image. When omitted, the image is explicitly decorative (alt="", role="presentation", aria-hidden), usually correct since the card already has a visible title. Provide it only when the image conveys information beyond the title and description.',
    },
    {
      name: 'linkLabel',
      type: 'string',
      description: 'CTA link text.',
    },
    {
      name: 'linkHref',
      type: 'string',
      description: 'CTA link URL.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Custom content rendered below the standard body.',
    },
  ],
};

export const docsZh = {
  "name": "TopNavMegaMenuFeaturedCard",
  "displayName": "Top Nav Mega Menu Featured Card",
  "description": "用于 TopNavMegaMenu 精选插槽的标准精选卡片。提供一致的卡片，包含可选图片、标题、描述和 CTA 链接。",
  "props": [
    {
      "name": "title",
      "type": "string",
      "description": "卡片标题。",
      "required": true
    },
    {
      "name": "description",
      "type": "string",
      "description": "标题下方的描述文本。"
    },
    {
      "name": "image",
      "type": "string",
      "description": "显示在主体上方的可选图片 URL。"
    },
    {
      "name": "imageAlt",
      "type": "string",
      "description": "图片的替代文本。省略时，图片被明确视为装饰性内容（alt=\"\"、role=\"presentation\"、aria-hidden），这通常是正确的，因为卡片已经有可见的标题。仅当图片传达标题和描述之外的信息时才提供。"
    },
    {
      "name": "linkLabel",
      "type": "string",
      "description": "CTA 链接文本。"
    },
    {
      "name": "linkHref",
      "type": "string",
      "description": "CTA 链接 URL。"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "渲染在标准主体下方的自定义内容。"
    }
  ],
  "propDescriptions": {
    "title": "卡片标题。",
    "description": "标题下方的描述文本。",
    "image": "显示在主体上方的可选图片 URL。",
    "imageAlt": "图片的替代文本。省略时，图片被明确视为装饰性内容（alt=\"\"、role=\"presentation\"、aria-hidden），这通常是正确的，因为卡片已经有可见的标题。仅当图片传达标题和描述之外的信息时才提供。",
    "linkLabel": "CTA 链接文本。",
    "linkHref": "CTA 链接 URL。",
    "children": "渲染在标准主体下方的自定义内容。"
  }
};

export const docsDense = {
  name: 'TopNavMegaMenuFeaturedCard',
  displayName: 'Top Nav Mega Menu Featured Card',
  description: 'Standard featured card for mega menu featured slot. Optional image, title, description, CTA link.',
  propDescriptions: {
    title: 'Card title.',
    description: 'Description below title.',
    image: 'Image URL above body.',
    imageAlt: 'Image alt text. Omitted → explicitly decorative (hidden from screen readers); usually correct since card has visible title.',
    linkLabel: 'CTA link text.',
    linkHref: 'CTA link URL.',
    children: 'Custom content below standard body.',
  },
};
