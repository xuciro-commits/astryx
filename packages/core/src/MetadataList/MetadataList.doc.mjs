// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'MetadataList',
  displayName: 'Metadata List',
  group: 'MetadataList',
  category: 'Table & List',
  keywords: ["metadata","description","definition","keyvalue","properties","details","attributes","summary","descriptionlist","descriptions"],
  theming: {
    targets: [
      {
        className: 'astryx-metadata-list',
        visualProps: ['columns', 'orientation'],
      },
      {className: 'astryx-metadata-list-item'},
    ],
  },
  description: 'Container for metadata items with column layout, orientation, and collapse support.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Metadata items (MetadataListItem components).',
      slotElements: [
        {
          __element: 'MetadataListItem',
          props: {
            label: 'Key',
          },
          children: 'Value',
        },
      ],
      required: true,
    },
    {
      name: 'columns',
      type: "'multi' | 'single' | number",
      description: 'Column layout mode.',
      default: "'single'",
    },
    {
      name: 'label',
      type: "{ position?: 'start' | 'top', width?: number | string }",
      description: "Label display configuration. position controls label placement, width sets a custom label column width. Defaults to { position: 'top' } for multi-column layouts. Position is ignored in horizontal mode, which always uses { position: 'top' }.",
      default: "{ position: 'start' } (vertical single-column) / { position: 'top' } (multi-column or horizontal)",
    },
    {
      name: 'maxNumOfItems',
      type: 'number',
      description: 'Maximum items to show before collapsing with a show more/less toggle.',
    },
    {
      name: 'orientation',
      type: "'vertical' | 'horizontal'",
      description: 'Layout orientation. Horizontal mode flows items in a row with flex-wrap.',
      default: "'vertical'",
    },
    {
      name: 'title',
      type: 'ReactNode',
      description: 'Optional title or heading above the list.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization. Must be a stylex.create() value.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'CSS class name for the root element. Prefer xstyle for styling; className is provided for integration with non-StyleX systems.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description: 'Inline styles for the root element. Prefer xstyle for styling; inline styles bypass StyleX optimization.',
    },
  ],
  components: [
    {name: 'MetadataListItem'},
  ],
  usage: {
    description:
      'MetadataList displays key-value pairs for object attributes like quality, condition, and status, in a structured layout. Use it for detail panels, settings summaries, and record information.',
    bestPractices: [
      { guidance: true, description: 'Choose label position based on content: "start" for short values, "top" for long or complex values.' },
      { guidance: true, description: 'Collapse long lists with `maxNumOfItems` to keep the page scannable.' },
      { guidance: true, description: 'Give each MetadataListItem a short label that names its value. Assistive technology reads each label with its value as a term and its definition.' },
      { guidance: true, description: 'The title does not name the list or add a heading. Pass a heading element as the title when the list needs a place in the page outline.' },
      { guidance: false, description: 'Use for extensive form input; use a form layout instead.' },
      { guidance: false, description: "Use for data that doesn't have a clear key-value structure." },
    ],
    anatomy: [
      {name: 'Title', required: false, description: 'Optional title for the metadata list.'},
      {name: 'Label', required: true, description: 'The key label for each metadata entry.'},
      {name: 'Metadata', required: true, description: 'The value displayed in various formats.'},
      {name: 'Disclosure', required: false, description: 'Collapse/expand control for the list.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "MetadataList 以结构化布局显示对象属性（如质量、状况和状态）的键值对。用于详情面板、设置摘要和记录信息。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "根据内容选择标签位置：短值用 \"start\"，长值或复杂值用 \"top\"。"
      },
      {
        "guidance": true,
        "description": "使用 `maxNumOfItems` 折叠长列表，保持页面易于浏览。"
      },
      {
        "guidance": true,
        "description": "为每个 MetadataListItem 提供一个命名其值的简短标签。辅助技术会将每个标签及其值分别作为术语和定义朗读。"
      },
      {
        "guidance": true,
        "description": "标题不会命名列表，也不会添加标题层级。当列表需要在页面大纲中占位时，请将标题元素作为 title 传入。"
      },
      {
        "guidance": false,
        "description": "用于大量表单输入；应改用表单布局。"
      },
      {
        "guidance": false,
        "description": "用于没有清晰键值结构的数据。"
      }
    ],
    "anatomy": [
      {
        "name": "标题",
        "required": false,
        "description": "元数据列表的可选标题。"
      },
      {
        "name": "标签",
        "required": true,
        "description": "每个元数据条目的键标签。"
      },
      {
        "name": "元数据",
        "required": true,
        "description": "以各种格式显示的值。"
      },
      {
        "name": "展开控件",
        "required": false,
        "description": "列表的折叠/展开控件。"
      }
    ]
  },
  "name": "MetadataList",
  "displayName": "Metadata List",
  "description": "包含列布局、方向与折叠支持的元数据项容器。",
  "propDescriptions": {
    "children": "元数据项（MetadataListItem 组件）。",
    "columns": "列布局模式。",
    "label": "标签显示配置。position 控制标签位置，width 设置自定义标签列宽。多列布局默认 { position: 'top' }。水平模式下忽略 position，始终使用 { position: 'top' }。",
    "maxNumOfItems": "在通过“显示更多/更少”切换折叠之前显示的最大项数。",
    "orientation": "布局方向。水平模式使用 flex-wrap 将各项排列成一行。",
    "title": "列表上方的可选标题或标题元素。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 的值。",
    "className": "根元素的 CSS 类名。样式设置优先使用 xstyle；className 用于与非 StyleX 系统集成。",
    "style": "根元素的内联样式。样式设置优先使用 xstyle；内联样式会绕过 StyleX 优化。"
  },
  "components": [
    {
      "name": "MetadataListItem",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'label/value metadata display; column layout, collapse, orientation variants',
  usage: {
    description:
      'MetadataList displays key-value pairs for object attributes like quality, condition, and status, in a structured layout. Use it for detail panels, settings summaries, and record information.',
    bestPractices: [
      { guidance: true, description: 'Choose label position based on content: "start" for short values, "top" for long or complex values.' },
      { guidance: true, description: 'Collapse long lists with `maxNumOfItems` to keep the page scannable.' },
      { guidance: true, description: 'Give each MetadataListItem a short label that names its value. Assistive technology reads each label with its value as a term and its definition.' },
      { guidance: true, description: 'The title does not name the list or add a heading. Pass a heading element as the title when the list needs a place in the page outline.' },
      { guidance: false, description: 'Use for extensive form input; use a form layout instead.' },
      { guidance: false, description: "Use for data that doesn't have a clear key-value structure." },
    ],
    anatomy: [
      {name: 'Title', required: false, description: 'Optional title for the metadata list.'},
      {name: 'Label', required: true, description: 'The key label for each metadata entry.'},
      {name: 'Metadata', required: true, description: 'The value displayed in various formats.'},
      {name: 'Disclosure', required: false, description: 'Collapse/expand control for the list.'},
    ],
  },
};
