// Copyright (c) Meta Platforms, Inc. and affiliates.

// @ts-check

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'EmojiPicker',
  displayName: 'Emoji Picker',
  category: 'Form Controls',
  keywords: ['emoji', 'emoji picker', 'emoji selector', 'emoticon', 'smiley'],
  description:
    'A standalone emoji panel: a search field over every emoji by group, with your frequent emoji first. Place it inline or inside a Popover; picking an emoji calls onSelect.',
  usage: {
    description:
      'An emoji picker inserts an emoji into what the viewer is writing, such as a comment or a message. Put it in a Popover opened from an emoji button, or inline where emoji are the content. For a reaction from a short fixed set, offer the set directly.',
    anatomy: [
      {
        name: 'Search',
        required: true,
        description:
          'Matches every word of the search against the start of an emoji’s name or keywords. Enter picks the first match; Down moves into the emoji.',
      },
      {
        name: 'Groups',
        required: true,
        description:
          'Frequently used first, then every emoji by CLDR group under a heading that stays at the top while its emoji scroll.',
      },
      {
        name: 'Emoji',
        required: true,
        description:
          'Eight to a row, each group a grid, with one tab stop across them all. Arrow keys move through the rows and across groups, Home and End move within a row, Ctrl+Home and Ctrl+End jump to the first and last emoji, and Enter picks.',
      },
      {
        name: 'Preview',
        required: true,
        description: 'Names the emoji under the pointer or focus.',
      },
    ],
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass the viewer’s recent emoji as `frequentEmojis`, so the ones they use most are first.',
      },
      {
        guidance: true,
        description:
          'Open it from a button in a Popover and leave the Popover’s autofocus on, so typing searches right away. Inline or in a Dialog, set `hasAutoFocus` instead.',
      },
      {
        guidance: false,
        description:
          'Use it for reactions with a small fixed vocabulary; offer those options directly instead.',
      },
      {
        guidance: false,
        description:
          'Squeeze it below about 280 pixels wide. The rows keep eight emoji, so narrow pickers shrink every target.',
      },
    ],
    accessibility: [
      {
        name: 'Emoji grids',
        category: 'Keyboard',
        criterion: '2.1.1 Keyboard',
        description:
          'Each group is a WAI-ARIA grid named by its heading, with rows of eight cells. One roving tab stop crosses every group: Tab from the search field lands on it, and the next Tab leaves the picker. Arrow keys follow the layout and mirror in right-to-left text.',
      },
      {
        name: 'Search field',
        category: 'Keyboard',
        description:
          'Down moves into the first emoji, and Up from the first row comes back. Enter picks the first match. While an input method is composing, Enter and the arrows stay with it.',
      },
      {
        name: 'Emoji names',
        category: 'Content',
        description:
          'Each emoji button is named by its CLDR name, such as "Party popper"; the glyph itself is hidden from assistive technology. The bundled names are English: pass `categories` and `frequentEmojis` with localized names for other languages.',
      },
      {
        name: 'Focus ring',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        description:
          'The focused emoji draws the system focus ring inset, so it never overlaps a neighbor; the ring must keep 3:1 against the popover surface.',
      },
    ],
  },
  theming: {
    targets: [
      {
        className: 'astryx-emoji-picker',
      },
    ],
  },
  props: [
    {
      name: 'onSelect',
      type: '(emoji: string, option: EmojiOption) => void',
      required: true,
      description: 'Called with the picked emoji and its option.',
    },
    {
      name: 'frequentEmojis',
      type: 'readonly EmojiOption[]',
      default: 'DEFAULT_FREQUENT_EMOJIS',
      description:
        'Emoji listed first, under Frequently used. An empty array leaves the row out.',
    },
    {
      name: 'categories',
      type: 'readonly EmojiCategory[]',
      description:
        'The emoji to offer, by group. Omit it to load the bundled set (every emoji through Emoji 15, with English CLDR names) the first time a picker mounts; pass your own for a localized or custom set.',
    },
    {
      name: 'height',
      type: 'SizeValue',
      default: "'calc(var(--spacing-8) * 10)'",
      description: 'Height of the scrolling emoji list.',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      default: 'false',
      description:
        'Focuses the search field when the picker mounts, inline or in a Dialog. Inside a Popover, rely on the Popover’s own autofocus instead.',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible name of the emoji list. Defaults to the localized "Emoji".',
    },
    {
      name: 'searchLabel',
      type: 'string',
      description:
        'Placeholder and hidden label of the search field. Defaults to the localized "Search emoji".',
    },
  ],
  examples: [
    {
      label: 'Inline picker',
      code: `import {Card} from '@astryxdesign/core/Card';
import {EmojiPicker} from '@astryxdesign/lab';

<Card padding={0} width={352}>
  <EmojiPicker onSelect={(emoji, option) => insert(emoji)} />
</Card>`,
    },
    {
      label: 'In a popover',
      code: `import {useState} from 'react';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Popover} from '@astryxdesign/core/Popover';
import {EmojiPicker} from '@astryxdesign/lab';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      label="Add emoji"
      padding={0}
      width={352}
      content={
        <EmojiPicker
          onSelect={emoji => {
            insert(emoji);
            setIsOpen(false);
          }}
        />
      }>
      <IconButton label="Add emoji" icon={<span aria-hidden>🙂</span>} />
    </Popover>
  );
}`,
    },
  ],
};

export const docsZh = {
  "name": "EmojiPicker",
  "displayName": "Emoji Picker",
  "description": "独立的 emoji 面板：一个按分组搜索所有 emoji 的搜索框，常用的 emoji 排在前面。可以内联放置或放在 Popover 内；选择 emoji 会调用 onSelect。",
  "usage": {
    "description": "emoji 选择器将 emoji 插入查看者正在编写的内容中，例如评论或消息。将其放在由 emoji 按钮打开的 Popover 中，或在 emoji 本身就是内容时内联放置。若要从固定的短集合中添加回应，请直接提供该集合。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将查看者最近使用的 emoji 作为 `frequentEmojis` 传入，使他们最常用的排在前面。"
      },
      {
        "guidance": true,
        "description": "在 Popover 中通过按钮打开它，并保持 Popover 的自动聚焦开启，以便直接输入搜索。内联或在 Dialog 中时，改为设置 `hasAutoFocus`。"
      },
      {
        "guidance": false,
        "description": "不要将其用于固定小词库的回应；请直接提供这些选项。"
      },
      {
        "guidance": false,
        "description": "不要将其压缩到约 280 像素宽以下。每行保持八个 emoji，因此窄选择器会缩小每个目标。"
      }
    ],
    "accessibility": [
      {
        "name": "Emoji 网格",
        "category": "Keyboard",
        "criterion": "2.1.1 Keyboard",
        "description": "每个分组都是一个以其标题命名的 WAI-ARIA 网格，每行八个单元格。一个漫游制表位跨越所有分组：从搜索框按 Tab 会落到它上面，再按 Tab 离开选择器。方向键遵循布局，并在从右到左的文本中镜像。"
      },
      {
        "name": "搜索框",
        "category": "Keyboard",
        "criterion": "",
        "description": "向下键移动到第一个 emoji，从第一行按向上键返回。Enter 选择第一个匹配项。输入法正在组合时，Enter 和方向键留在输入法中。"
      },
      {
        "name": "Emoji 名称",
        "category": "Content",
        "criterion": "",
        "description": "每个 emoji 按钮以其 CLDR 名称命名，例如 \"Party popper\"；字形本身对辅助技术隐藏。内置名称是英文：其他语言请传入带本地化名称的 `categories` 和 `frequentEmojis`。"
      },
      {
        "name": "焦点环",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "description": "聚焦的 emoji 以内嵌方式绘制系统焦点环，因此绝不会与相邻项重叠；焦点环与 Popover 表面的对比度必须保持 3:1。"
      }
    ],
    "anatomy": [
      {
        "name": "搜索",
        "required": true,
        "description": "将搜索中的每个词与 emoji 名称或关键词的开头进行匹配。Enter 选择第一个匹配项；向下键进入 emoji 网格。"
      },
      {
        "name": "分组",
        "required": true,
        "description": "先显示常用项，然后按 CLDR 分组显示所有 emoji，分组标题在其 emoji 滚动时保持在顶部。"
      },
      {
        "name": "表情符号",
        "required": true,
        "description": "每行八个，每个分组是一个网格，所有分组共用一个制表位。方向键在行内和跨分组移动，Home 和 End 在行内移动，Ctrl+Home 和 Ctrl+End 跳到第一个和最后一个 emoji，Enter 选择。"
      },
      {
        "name": "预览",
        "required": true,
        "description": "显示指针下或焦点处 emoji 的名称。"
      }
    ]
  },
  "propDescriptions": {
    "onSelect": "以所选 emoji 及其选项调用。",
    "frequentEmojis": "先列出的 emoji，位于“常用”下。空数组会省略该行。",
    "categories": "按分组提供的 emoji。省略时，选择器首次挂载会加载内置集合（截至 Emoji 15 的所有 emoji，带有英文 CLDR 名称）；要获得本地化或自定义集合，请传入自己的数据。",
    "height": "滚动 emoji 列表的高度。",
    "hasAutoFocus": "选择器挂载时聚焦搜索框，无论内联还是在 Dialog 中。在 Popover 内，请依赖 Popover 自身的自动聚焦。",
    "label": "emoji 列表的无障碍名称。默认为本地化的 \"Emoji\"。",
    "searchLabel": "搜索框的占位符和隐藏标签。默认为本地化的 \"Search emoji\"。"
  }
};
