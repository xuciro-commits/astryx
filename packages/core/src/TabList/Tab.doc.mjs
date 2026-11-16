// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Tab',
  subComponentOf: 'TabList',
  displayName: 'Tab',
  isHiddenFromOverview: true,
  description:
    'Individual tab item that renders as a button or an anchor link, with selected-state styling and optional icons.',
  // Tab requires TabList context; wrap it so the preview doesn't throw.
  playground: {
    defaults: {value: 'tab-1', label: 'Tab'},
    wrapper: {component: 'TabList', props: {value: 'tab-1'}},
  },
  examples: [
    {
      label: 'Underline the whole tab in one strip',
      code: `import {Tab, TabList} from '@astryxdesign/core/TabList';
import {Theme, defineTheme, useTheme} from '@astryxdesign/core/theme';
import {appTheme} from './theme';

// Without a nested Theme, the selected indicator spans the tab's content and
// stops at its inline padding. An editor-style strip can run it edge to edge by restyling
// the tab-indicator target in a nested Theme. Only this strip changes: every
// other TabList keeps the app theme's indicator. insetInline is not a
// guaranteed property of the tab-indicator target, so treat this override as
// best effort across releases.
const fullWidthIndicatorTheme = defineTheme({
  name: 'full-width-tab-indicator',
  extends: appTheme,
  components: {
    'tab-indicator': {
      base: {insetInline: '0'},
    },
  },
});

// An open-files bar switches views, so it uses TabList's navigation pattern
// (no role="tablist"). The nested Theme takes the app's color mode.
function EditorTabs() {
  const {mode} = useTheme();
  return (
    <Theme theme={fullWidthIndicatorTheme} mode={mode}>
      <TabList value="app" onChange={() => {}} aria-label="Open files" size="sm" hasDivider>
        <Tab value="app" label="App.tsx" />
        <Tab value="styles" label="styles.css" />
      </TabList>
    </Theme>
  );
}`,
    },
    {
      label: 'Describe a tab with help text',
      code: `import {useRef, useState} from 'react';
import {Icon} from '@astryxdesign/core/Icon';
import {Tab, TabList} from '@astryxdesign/core/TabList';
import {Tooltip} from '@astryxdesign/core/Tooltip';

// The tab is one button, so its help text is a Tooltip anchored on the Tab
// through its ref, not a second button inside it. The tooltip describes the
// tab itself. Render it after the TabList: the strip holds only tabs. The
// info glyph in endContent is decorative.
function SettingsTabs() {
  const [value, setValue] = useState('general');
  const generalRef = useRef(null);
  return (
    <>
      <TabList value={value} onChange={setValue} role="tablist" aria-label="Settings">
        <Tab
          ref={generalRef}
          value="general"
          label="General"
          panelId="panel-general"
          endContent={<Icon icon="info" size="sm" />}
        />
        <Tab value="advanced" label="Advanced" panelId="panel-advanced" />
      </TabList>
      <Tooltip
        content="Name, language, and time zone for this workspace."
        anchorRef={generalRef}
      />
      <div id="panel-general" role="tabpanel" hidden={value !== 'general'}>
        …
      </div>
      <div id="panel-advanced" role="tabpanel" hidden={value !== 'advanced'}>
        …
      </div>
    </>
  );
}`,
    },
  ],
  props: [
    {
      name: 'value',
      type: 'string',
      description:
        'Unique value for this tab, matched against TabListContext.value.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label for this tab. Used as visible text by default, or as aria-label when isLabelHidden is true.',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Whether the label is visually hidden. When true, only the icon and endContent are displayed, and label is used as aria-label for accessibility.',
      default: 'false',
    },
    {
      name: 'href',
      type: 'string',
      description:
        'URL to navigate to; when provided, the tab renders as an anchor element. Ignored in a TabList given an explicit role="tablist".',
    },
    {
      name: 'panelId',
      type: 'string',
      description:
        'Id of the panel this tab controls, wired up as aria-controls where the TabList speaks the tabs pattern. Put the same id on the panel element. No effect under the navigation pattern, and a development warning says so.',
    },
    {
      name: 'as',
      type: 'LinkComponentType',
      description:
        'Custom component to render instead of <a> for link tabs. Overrides the LinkProvider default. Only applies when href is provided.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Icon element shown when the tab is not selected.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'selectedIcon',
      type: 'ReactNode',
      description:
        'Icon element shown when the tab is selected; falls back to icon if not provided.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'checkCircle',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content rendered after the label, such as a badge count or status dot. The tab is one button, so endContent holds only non-interactive content: no button, link, InfoTip, or other focusable control. To explain a tab, anchor a Tooltip on the Tab through its ref, render it after the TabList, and put a decorative info Icon here.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'chevronDown',
            size: 'sm',
          },
        },
        {
          __element: 'Badge',
          props: {
            label: '3',
          },
        },
      ],
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
};

export const docsZh = {
  "name": "Tab",
  "isHiddenFromOverview": true,
  "displayName": "Tab",
  "description": "单个选项卡项，渲染为按钮或锚点链接，带选中态样式和可选图标。",
  "props": [
    {
      "name": "value",
      "type": "string",
      "description": "此选项卡的唯一值，与 TabListContext.value 匹配。",
      "required": true
    },
    {
      "name": "label",
      "type": "string",
      "description": "此选项卡的无障碍标签。默认用作可见文本，当 isLabelHidden 为 true 时用作 aria-label。",
      "required": true
    },
    {
      "name": "isLabelHidden",
      "type": "boolean",
      "description": "标签是否在视觉上隐藏。为 true 时仅显示图标和 endContent，label 用作无障碍的 aria-label。",
      "default": "false"
    },
    {
      "name": "href",
      "type": "string",
      "description": "要导航到的 URL；提供后选项卡渲染为锚点元素。在显式指定 role=\"tablist\" 的 TabList 中忽略。"
    },
    {
      "name": "panelId",
      "type": "string",
      "description": "此选项卡控制的 panel 的 id，在 TabList 使用 tabs 模式时作为 aria-controls 接线。将相同的 id 放在 panel 元素上。在导航模式下无效，并会给出开发警告。"
    },
    {
      "name": "as",
      "type": "LinkComponentType",
      "description": "链接选项卡中替代 <a> 渲染的自定义组件。覆盖 LinkProvider 的默认值。仅在提供 href 时适用。"
    },
    {
      "name": "icon",
      "type": "ReactNode",
      "description": "选项卡未选中时显示的图标元素。"
    },
    {
      "name": "selectedIcon",
      "type": "ReactNode",
      "description": "选项卡选中时显示的图标元素；未提供时回退到 icon。"
    },
    {
      "name": "endContent",
      "type": "ReactNode",
      "description": "标签之后渲染的内容，例如徽标计数或状态点。选项卡是一个按钮，因此 endContent 只能包含非交互内容：不能有按钮、链接、InfoTip 或其他可聚焦控件。若要解释某个选项卡，请通过其 ref 在 Tab 上锚定 Tooltip，在 TabList 之后渲染它，并在此处放置一个装饰性 info Icon。"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的返回值：不能是 style={{}} 这样的内联样式对象。"
    }
  ],
  "propDescriptions": {
    "value": "此选项卡的唯一值，与 TabListContext.value 匹配。",
    "label": "此选项卡的无障碍标签。默认用作可见文本，当 isLabelHidden 为 true 时用作 aria-label。",
    "isLabelHidden": "标签是否在视觉上隐藏。为 true 时仅显示图标和 endContent，label 用作无障碍的 aria-label。",
    "href": "要导航到的 URL；提供后选项卡渲染为锚点元素。在显式指定 role=\"tablist\" 的 TabList 中忽略。",
    "panelId": "此选项卡控制的 panel 的 id，在 TabList 使用 tabs 模式时作为 aria-controls 接线。将相同的 id 放在 panel 元素上。在导航模式下无效，并会给出开发警告。",
    "as": "链接选项卡中替代 <a> 渲染的自定义组件。覆盖 LinkProvider 的默认值。仅在提供 href 时适用。",
    "icon": "选项卡未选中时显示的图标元素。",
    "selectedIcon": "选项卡选中时显示的图标元素；未提供时回退到 icon。",
    "endContent": "标签之后渲染的内容，例如徽标计数或状态点。选项卡是一个按钮，因此 endContent 只能包含非交互内容：不能有按钮、链接、InfoTip 或其他可聚焦控件。若要解释某个选项卡，请通过其 ref 在 Tab 上锚定 Tooltip，在 TabList 之后渲染它，并在此处放置一个装饰性 info Icon。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的返回值：不能是 style={{}} 这样的内联样式对象。"
  }
};

export const docsDense = {
  name: 'Tab',
  isHiddenFromOverview: true,
  displayName: 'Tab',
  description:
    'Individual tab; renders as button or anchor w/ selected-state styling + optional icons.',
  propDescriptions: {
    value: 'Unique value matched against TabListContext.value.',
    label:
      'Accessible label; visible by default, aria-label when isLabelHidden.',
    isLabelHidden:
      'Visually hide label for icon-only tabs; label becomes aria-label.',
    href: 'URL; renders as <a> when provided.',
    as: 'Custom link component overriding LinkProvider; only w/ href.',
    icon: 'Icon shown when not selected.',
    selectedIcon: 'Icon shown when selected; falls back to icon.',
    endContent:
      'Non-interactive content after the label (badge, status dot). No focusable control: explain a tab with a Tooltip anchored on the Tab (anchorRef, rendered after TabList) + a decorative info Icon here.',
    xstyle:
      'StyleX styles for layout customization. Must be stylex.create() value, not inline style.',
  },
};
