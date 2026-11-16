// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Indicator',
  displayName: 'Indicator',
  group: 'Indicator',
  category: 'Form Controls',
  isHiddenFromOverview: true,
  keywords: [
    'indicator',
    'checkbox',
    'radio',
    'control',
    'selection',
    'mark',
    'tick',
    'themeable',
    'swap',
  ],
  description:
    'Decorative control visuals: the mark on a chosen option, the box a checkbox draws, the circle a radio draws. Rendered by Selector, CheckboxInput, RadioList, and menu selection rows. Replace one by name through defineTheme({indicators}) and every component drawing it follows.',
  components: [
    {
      name: 'CheckboxIndicator',
      displayName: 'Checkbox Indicator',
      description:
        'The checkbox visual: a square box with a checkmark or an indeterminate bar. Decorative (aria-hidden); the owning control keeps the input, role, accessible name, focus, and keyboard behavior.',
      props: [
        {
          name: 'state',
          type: "'unchecked' | 'checked' | 'indeterminate'",
          description:
            'Which state to draw. An indicator draws in EVERY state: the unchecked box is an empty box, not nothing.',
          required: true,
        },
        {
          name: 'size',
          type: "'sm' | 'md'",
          description: 'Control size: 20px or 24px.',
          default: "'md'",
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description:
            'Whether the owning control is disabled. Purely visual; the owner keeps the real disabled semantics.',
          default: 'false',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description:
            'Rendered inside the chrome INSTEAD of the state mark when the shallow `isRenderable(children)` check accepts the value. The helper excludes `null`, `undefined`, booleans, and the empty string; React elements and containers take the replacement path even when their descendants render nothing. CheckboxInput passes its loading Spinner through as `children={isBusy && <Spinner/>}`, so replacements should use the same helper rather than a nullish check.',
        },
      ],
    },
    {
      name: 'CheckIndicator',
      displayName: 'Check Indicator',
      description:
        'The mark on a chosen option: a checkmark by default, and nothing at all when unchosen, so a listbox shows no empty box beside every row. This is the indicator to replace to change what "chosen" looks like: mapping it to RadioIndicator gives every single-selection mark radio visuals, including an empty circle on unchosen rows. Unlike the checkbox and radio visuals it renders no chrome of its own (it IS the glyph), so a host\'s theme target lands on the same element as astryx-icon.',
      props: [
        {
          name: 'state',
          type: "'unchecked' | 'checked'",
          description:
            'Which state to draw. The default renders nothing when unchecked; a replacement may draw in both states.',
          required: true,
        },
        {
          name: 'size',
          type: "'sm' | 'md'",
          description: 'Control size, matching the other indicators.',
          default: "'md'",
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description:
            'Whether the owning row is disabled. Purely visual; the owner keeps the real disabled semantics.',
          default: 'false',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description:
            'Rendered INSTEAD of the mark, in every state: a host showing a pending Spinner passes it through whether or not the row is chosen.',
        },
      ],
      playground: {
        defaults: {state: 'checked'},
      },
    },
    {
      name: 'RadioIndicator',
      displayName: 'Radio Indicator',
      description:
        'The radio visual: a circle with a filled inner dot when selected. Draws in both states; an unselected radio is an empty circle, which is what lets it stand in for a checkmark in a selection slot.',
      props: [
        {
          name: 'state',
          type: "'unchecked' | 'checked'",
          description:
            'Which state to draw. Radio belongs to the singleSelection family, which has no partial state.',
          required: true,
        },
        {
          name: 'size',
          type: "'sm' | 'md'",
          description: 'Control size: 20px or 24px.',
          default: "'md'",
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description:
            'Whether the owning control is disabled. Purely visual; the owner keeps the real disabled semantics.',
          default: 'false',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Rendered inside the chrome INSTEAD of the state mark.',
        },
      ],
    },
  ],
  theming: {
    targets: [
      {
        className: 'astryx-checkbox-indicator',
        visualProps: ['size'],
        states: ['checked', 'disabled'],
      },
      {className: 'astryx-checkbox-indicator-check', visualProps: ['size']},
      {className: 'astryx-checkbox-indicator-dash', visualProps: ['size']},
      {
        className: 'astryx-radio-indicator',
        visualProps: ['size'],
        states: ['checked', 'disabled'],
      },
      {className: 'astryx-radio-indicator-dot', visualProps: ['size']},
    ],
  },
  examples: [
    {
      label: 'Restyle an indicator (the common path)',
      code: `// Indicators render the same stable class targets wherever they appear, so
// one component override reaches the form control, the menu row, and any
// selection slot themed to use it. No indicator-specific API needed.
defineTheme({
  name: 'brand',
  components: {
    'checkbox-indicator': {
      base: {borderRadius: 'var(--radius-full)', borderWidth: '2px'},
      checked: {
        backgroundColor: 'var(--color-accent)',
        borderColor: 'var(--color-accent)',
      },
      'checked+disabled': {backgroundColor: 'var(--color-background-muted)'},
    },
    'radio-indicator': {base: {borderWidth: '2px'}},
    'radio-indicator-dot': {base: {borderRadius: '2px'}},
  },
});`,
    },
    {
      label: 'Replace an indicator with your own component',
      code: `// When the shape itself is wrong, hand the theme a component. It receives
// {state, size, isDisabled, children} and nothing else.
//
// Use theme tokens, never raw values — run \`astryx docs tokens\` for the
// full set. Color: --color-accent, --color-on-accent, --color-border,
// --color-border-emphasized, --color-background-surface,
// --color-background-muted. Radius: --radius-inner, --radius-full.
// Border width: --border-width.
import {isRenderable} from '@astryxdesign/core/utils';

function BrandCheckbox({state, size = 'md', isDisabled, children}) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size === 'sm' ? 20 : 24,
        height: size === 'sm' ? 20 : 24,
        borderRadius: 'var(--radius-inner)',
        border: 'var(--border-width) solid var(--color-border-emphasized)',
        color: 'var(--color-accent)',
        opacity: isDisabled ? 0.5 : 1,
      }}>
      {/* children first: the owner passes a loading Spinner through it.
          isRenderable, NOT \`children ??\` — a host writes
          children={isBusy && <Spinner/>}, and \`false\` is neither null nor
          caught by ??, so a nullish check takes the children branch, renders
          nothing in it, and deletes your mark on every chosen row. */}
      {isRenderable(children)
        ? children
        : state === 'checked' && <StarGlyph />}
    </span>
  );
}

defineTheme({name: 'brand', indicators: {checkbox: BrandCheckbox}});`,
    },
    {
      label: 'Use radio visuals for single selection',
      code: `// Replacement is by NAME, so one entry reaches every component that draws
// that indicator. Here every option in a Selector listbox draws a radio —
// including the unselected ones, which a check mark cannot do.
import {RadioIndicator} from '@astryxdesign/core/Indicator';

defineTheme({name: 'brand', indicators: {check: RadioIndicator}});`,
    },
  ],
  usage: {
    description:
      'Indicators are the componentized selection visuals shared by CheckboxInput, RadioList, and menu selection rows. They are decorative: the owning component keeps the input, role, accessible name, focus, and keyboard behavior, while the indicator turns state into a picture. That split is what makes them themeable: restyle one through its class targets, or replace the component outright.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Reach for the canonical `components['checkbox-indicator']` override first. Replacing the component is the heavier path, for when the shape itself is wrong.",
      },
      {
        guidance: true,
        description:
          'Match the shipped replacement-content branch with `isRenderable(children)`, not `children != null` or `children ?? mark`. The helper is deliberately shallow: it excludes nullish values, booleans, and the empty string, while React elements and containers take the replacement path even when their descendants render nothing. The owning control passes `children={isBusy && <Spinner/>}`, so a nullish check deletes the state mark whenever that value is `false` (#4893).',
      },
      {
        guidance: true,
        description:
          'A replacement must set aria-hidden. The owning control provides the role and accessible name; a visible indicator would be announced twice.',
      },
      {
        guidance: true,
        description:
          'Use theme tokens for every color, radius, and border width in a replacement. Run `astryx docs tokens` for the set.',
      },
      {
        guidance: true,
        description:
          "Render a single root ELEMENT, and let it keep the border-radius you want the focus ring to follow. A control whose real input is visually hidden cannot show focus on that input, so the owner paints the standard ring onto the indicator element itself at focus time (useIndicatorFocusRing), and `outline` then picks up that element's radius. A replacement needs no cooperation and can forget nothing: the ring is never missing (WCAG 2.4.7), it is only the wrong shape if the root has no radius of its own. Do not draw a focus ring yourself; the owner already did.",
      },
      {
        guidance: false,
        description:
          "Thread hover or pressed state in as props. Interaction state reaches an indicator through the owner's CSS ancestor marker, so hovering the row tints the control with no props involved.",
      },
      {
        guidance: false,
        description:
          "Assume you are only mounted when selected. The host renders its indicator unconditionally and passes `state`, in every state; that is what lets a replacement draw where the default draws nothing (a radio's empty circle on an unchosen row). Drawing nothing in a state is a decision the indicator makes, not one the host makes for it.",
      },
    ],
    anatomy: [
      {
        name: 'Chrome (checkbox, radio)',
        required: true,
        description:
          'The persistent box or circle rendered by CheckboxIndicator and RadioIndicator in every state. CheckIndicator is the state mark itself and intentionally owns no chrome.',
      },
      {
        name: 'State mark',
        required: false,
        description:
          'The checkmark, indeterminate bar, or radio dot shown inside the chrome for the current state.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Decorative selection visuals: the mark on a chosen option, the checkbox box, the radio circle. Rendered by Selector/CheckboxInput/RadioList/menu rows. Replace one by name via defineTheme({indicators}) and every component drawing it follows.',
  usage: {
    description:
      'Componentized selection visuals shared by CheckboxInput, RadioList, and menu rows. Decorative: the owner keeps input/role/name/focus/keyboard; the indicator turns state into a picture. That split makes them themeable: restyle via class targets or replace the component.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Prefer the canonical `components['checkbox-indicator']` override first. Replacing the component is the heavier path, for when the shape itself is wrong.",
      },
      {
        guidance: true,
        description:
          'Match the shipped replacement-content branch with `isRenderable(children)`, not `children != null` or `children ?? mark`. The helper is shallow: it excludes nullish values, booleans, and the empty string, while React elements and containers take the replacement path even when their descendants render nothing. The owner passes `children={isBusy && <Spinner/>}`, so a nullish check deletes the state mark whenever the value is `false` (#4893).',
      },
      {
        guidance: true,
        description:
          'A replacement must set aria-hidden. The owner supplies role and accessible name; a visible indicator would be announced twice.',
      },
      {
        guidance: true,
        description:
          'Use theme tokens for every color, radius, and border width in a replacement. Run `astryx docs tokens` for the set.',
      },
      {
        guidance: true,
        description:
          'Render a single root ELEMENT with the border-radius the focus ring should follow. The owner paints the standard ring onto the indicator at focus time (useIndicatorFocusRing) and outline picks up its radius; the ring is never missing (WCAG 2.4.7), only mis-shaped if the root lacks a radius. Do not draw a focus ring yourself.',
      },
      {
        guidance: false,
        description:
          "Thread hover or pressed state in as props. Interaction state reaches an indicator through the owner's CSS ancestor marker.",
      },
      {
        guidance: false,
        description:
          "Assume you are only mounted when selected. The host renders the indicator unconditionally and passes `state` in every state; that is what lets a replacement draw where the default draws nothing (a radio's empty circle on an unchosen row).",
      },
    ],
  },
  components: [
    {
      name: 'CheckboxIndicator',
      displayName: 'Checkbox Indicator',
      description:
        'Checkbox visual: a square box with a checkmark or indeterminate bar. Decorative (aria-hidden); the owner keeps input/role/name/focus/keyboard.',
      propDescriptions: {
        state:
          'which state to draw. An indicator draws in EVERY state: unchecked is an empty box, not nothing.',
        size: 'control size: 20px or 24px.',
        isDisabled:
          'whether the owner is disabled. Purely visual; the owner keeps the real disabled semantics.',
        children:
          'rendered inside the chrome INSTEAD of the state mark. CheckboxInput passes its loading Spinner through while a change action is pending, so a replacement must render children when present or the busy visual is lost.',
      },
    },
    {
      name: 'CheckIndicator',
      displayName: 'Check Indicator',
      description:
        'The mark on a chosen option: a checkmark by default, nothing when unchosen. Map to RadioIndicator for radio visuals on single-selection marks. Renders no chrome of its own (it IS the glyph), so a theme target lands on the same element as astryx-icon.',
      propDescriptions: {
        state:
          'which state to draw. The default renders nothing when unchecked; a replacement may draw in both states.',
        size: 'control size, matching the other indicators.',
        isDisabled:
          'whether the owning row is disabled. Purely visual; the owner keeps the real disabled semantics.',
        children:
          'rendered INSTEAD of the mark, in every state; a host showing a pending Spinner passes it through whether or not the row is chosen.',
      },
    },
    {
      name: 'RadioIndicator',
      displayName: 'Radio Indicator',
      description:
        'Radio visual: a circle with a filled inner dot when selected. Draws in both states; an unselected radio is an empty circle, which is what lets it stand in for a checkmark in a selection slot.',
      propDescriptions: {
        state:
          'which state to draw. Radio belongs to the singleSelection family, which has no partial state.',
        size: 'control size: 20px or 24px.',
        isDisabled:
          'whether the owner is disabled. Purely visual; the owner keeps the real disabled semantics.',
        children: 'rendered inside the chrome INSTEAD of the state mark.',
      },
    },
  ],
};

export const docsZh = {
  "name": "Indicator",
  "description": "装饰性控件视觉元素：选中选项上的标记、复选框绘制的方框、单选按钮绘制的圆圈。由 Selector、CheckboxInput、RadioList 和菜单选择行渲染。通过 defineTheme({indicators}) 按名称替换其中一个，所有绘制它的组件都会随之变化。",
  "usage": {
    "description": "指示器是 CheckboxInput、RadioList 和菜单选择行共享的组件化选择视觉元素。它们是装饰性的：所属组件负责 input、角色、无障碍名称、焦点和键盘行为，而指示器负责将状态转换为图形。这种拆分使它们可主题化：通过其 class 目标重新设置样式，或直接替换组件。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "优先使用规范的 `components['checkbox-indicator']` 覆盖。替换组件是更重的方式，适用于形状本身不合适的情况。"
      },
      {
        "guidance": true,
        "description": "用 `isRenderable(children)` 匹配内置的替换内容分支，而不是 `children != null` 或 `children ?? mark`。该辅助函数有意做浅层判断：它排除 nullish 值、布尔值和空字符串，而 React 元素和容器即使其后代不渲染任何内容也会走替换路径。所属控件会传入 `children={isBusy && <Spinner/>}`，因此用 nullish 检查会在该值为 `false` 时删除状态标记（#4893）。"
      },
      {
        "guidance": true,
        "description": "替换组件必须设置 aria-hidden。所属控件提供角色和无障碍名称；可见的指示器会被重复朗读。"
      },
      {
        "guidance": true,
        "description": "替换组件的每个颜色、圆角和边框宽度都使用主题令牌。运行 `astryx docs tokens` 查看完整集合。"
      },
      {
        "guidance": true,
        "description": "渲染单个根元素，并让它保留你希望焦点环跟随的 border-radius。真实 input 在视觉上隐藏的控件无法在该 input 上显示焦点，因此所属组件聚焦时会把标准焦点环绘制到指示器元素本身上（useIndicatorFocusRing），随后 `outline` 会采用该元素的圆角。替换组件无需配合，也不会遗漏任何东西：焦点环永远不会缺失（WCAG 2.4.7），只有当根元素自身没有圆角时形状才会不对。不要自己绘制焦点环；所属组件已经绘制了。"
      },
      {
        "guidance": false,
        "description": "不要通过 props 传入悬停或按下状态。交互状态通过所属组件的 CSS 祖先标记到达指示器，因此悬停行时控件会着色，无需任何 props。"
      },
      {
        "guidance": false,
        "description": "不要假设只在选中时才挂载。宿主会无条件渲染其指示器，并在每种状态下传入 `state`；这正是替换组件能在默认组件不绘制任何内容的状态下进行绘制的原因（例如未选中行上的单选空圆圈）。在某个状态下不绘制内容是指示器的决定，而不是宿主的决定。"
      }
    ],
    "anatomy": [
      {
        "name": "外框（复选框、单选按钮）",
        "required": true,
        "description": "CheckboxIndicator 和 RadioIndicator 在每种状态下都会渲染的持久方框或圆圈。CheckIndicator 本身就是状态标记，故意不拥有外框。"
      },
      {
        "name": "状态标记",
        "required": false,
        "description": "当前状态下显示在外框内的对勾、不确定横条或单选圆点。"
      }
    ]
  },
  "components": [
    {
      "name": "CheckboxIndicator",
      "description": "复选框视觉元素：带对勾或不确定横条的方形方框。装饰性（aria-hidden）；所属控件保留 input、角色、无障碍名称、焦点和键盘行为。",
      "propDescriptions": {
        "state": "要绘制的状态。指示器在每种状态下都会绘制：未选中的方框是空方框，而不是什么都没有。",
        "size": "控件尺寸：20px 或 24px。",
        "isDisabled": "所属控件是否禁用。纯视觉；所属组件保留真正的禁用语义。",
        "children": "当浅层的 `isRenderable(children)` 检查接受该值时，在方框内渲染的内容会替代状态标记。该辅助函数排除 `null`、`undefined`、布尔值和空字符串；React 元素和容器即使后代不渲染任何内容也会走替换路径。CheckboxInput 会以 `children={isBusy && <Spinner/>}` 传入其加载 Spinner，因此替换组件应使用相同的辅助函数，而不是 nullish 检查。"
      }
    },
    {
      "name": "CheckIndicator",
      "description": "选中选项上的标记：默认是对勾，未选中时完全不显示，因此列表框不会在每行旁显示空方框。要改变“选中”的外观，就替换这个指示器：将其映射为 RadioIndicator 可让每个单选标记获得单选按钮视觉，包括未选中行上的空圆圈。与复选框和单选视觉不同，它自身不渲染外框（它本身就是字形），因此宿主的主题目标会落在与 astryx-icon 相同的元素上。",
      "propDescriptions": {
        "state": "要绘制的状态。默认在未选中时不渲染任何内容；替换组件可以在两种状态下都绘制。",
        "size": "控件尺寸，与其他指示器一致。",
        "isDisabled": "所属行是否禁用。纯视觉；所属组件保留真正的禁用语义。",
        "children": "在每种状态下渲染以替代标记的内容：显示待处理 Spinner 的宿主会无论行是否被选中都传入它。"
      }
    },
    {
      "name": "RadioIndicator",
      "description": "单选按钮视觉：选中时为带实心内点的圆圈。两种状态都会绘制；未选中的单选按钮是空圆圈，这使它能够在选择槽中代替对勾。",
      "propDescriptions": {
        "state": "要绘制的状态。Radio 属于 singleSelection 组，没有部分选中状态。",
        "size": "控件尺寸：20px 或 24px。",
        "isDisabled": "所属控件是否禁用。纯视觉；所属组件保留真正的禁用语义。",
        "children": "在方框内渲染以替代状态标记的内容。"
      }
    }
  ]
};
