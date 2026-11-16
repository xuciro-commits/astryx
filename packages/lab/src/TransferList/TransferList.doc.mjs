// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file TransferList.doc.mjs
 * @input TransferListSelector and TransferList public APIs, commit behavior, and usage guidance
 * @output Documents the default-immediate selector, optional staged commits, and advanced TransferList composition
 * @position Lab documentation consumed by component tooling
 *
 * SYNC: When modified, update TransferListSelector.tsx, TransferList.tsx, commit-behavior tests, and package exports.
 */

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TransferListSelector',
  displayName: 'Transfer List Selector',
  group: 'Selector',
  category: 'Form Controls',
  keywords: [
    'transfer list',
    'dual list',
    'pick list',
    'selector',
    'popover',
    'selection',
    'reorder',
    'columns',
    'available',
    'selected',
    'immediate',
    'draft',
    'apply',
  ],
  description:
    'A selector field for moving options between selected and available lists and optionally ordering the selected values. Changes commit immediately by default; staged commit behavior adds an internal draft and Apply/Cancel footer. TransferList remains the lower-level content primitive for custom ComplexSelector surfaces.',
  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible field label shown outside the popover unless isLabelHidden is true.',
      required: true,
    },
    {
      name: 'options',
      type: 'readonly TransferListOption<T>[]',
      description:
        "Complete option pool. Each option has value and label, with optional searchable description metadata, group, an isTransferDisabled constraint, and disabledMessage. Which options keep their place is the reorderable object's isReorderable.",
      required: true,
    },
    {
      name: 'value',
      type: 'readonly T[]',
      description:
        'Committed selected values in display order. In staged behavior this is the applied value copied into a local draft when the selector opens.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(nextValue: readonly T[]) => void',
      description:
        'Called after every permitted list edit in immediate behavior, or once when Apply commits a changed draft in staged behavior.',
      required: true,
    },
    {
      name: 'commitBehavior',
      type: 'TransferListSelectorCommitBehavior',
      description:
        'Controls when changes commit. Immediate updates on each list edit without a footer; staged waits for Apply and supports Cancel or dismiss.',
      default: "'immediate'",
    },
    {
      name: 'triggerLabel',
      type: 'ReactNode',
      description: 'Content shown in the closed selector trigger.',
      default: '`${value.length} selected`',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Supporting field guidance shown with the external label.',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Visually hides the field label while preserving its accessible name.',
      default: 'false',
    },
    {
      name: 'selectedLabel',
      type: 'string',
      description: 'Heading and accessible name for the selected list.',
      default: "'Selected'",
    },
    {
      name: 'availableLabel',
      type: 'string',
      description: 'Heading and accessible name for the available list.',
      default: "'Available'",
    },
    {
      name: 'hasSearch',
      type: 'boolean',
      description:
        'Shows a shared search field that filters both lists by label and description.',
      default: 'false',
    },
    {
      name: 'searchLabel',
      type: 'string',
      description: 'Accessible label for the shared search field.',
      default: "'Search ' followed by label",
    },
    {
      name: 'searchPlaceholder',
      type: 'string',
      description: 'Placeholder shown in the shared search field.',
      default: "'Search...'",
    },
    {
      name: 'reorderable',
      type: 'Reorderable<T>',
      description:
        "Makes the selected options reorderable: pass the object createReorderable makes. Each selected row ends with a reorder handle: on a touch screen hold the handle for a moment, then drag; a mouse drags at once; a tap, a click, Space or Enter on a handle turns on reorder mode for its row, in which each arrow key (or each move in the hint below the handle) moves it a place, and Escape, Done or another activation ends the mode, keeping the moves. The object's isReorderable(value) says which values move: one it rejects has no handle, and at either end of the selected list it also keeps the others from moving past it. In immediate behavior each move goes to the object's onReorder({key, to}); in staged behavior the selector moves its draft instead, so Cancel drops the move with the draft and Apply commits it through onChange. Reordering pauses while a search filters the panel. Without it, the selected options keep their order.",
    },
    {
      name: 'hasSelectAll',
      type: 'boolean',
      description:
        'Shows Add all and adds every transfer-enabled available option to the current selection.',
      default: 'false',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description:
        'Shows Clear and removes every transfer-enabled selected option from the current selection.',
      default: 'false',
    },
    {
      name: 'renderOption',
      type: '(option: TransferListOption<T>) => ReactNode',
      description:
        'Customizes row content while retaining built-in labels, actions, constraints, and reorder interaction.',
    },
    {
      name: 'selectedEmptyText',
      type: 'string',
      description: 'Message shown when the selected list is empty.',
      default: "'No selected options'",
    },
    {
      name: 'availableEmptyText',
      type: 'string',
      description: 'Message shown when every option has been selected.',
      default: "'No available options'",
    },
    {
      name: 'noResultsText',
      type: 'string',
      description: 'Message shown when search has no matches in a list.',
      default: "'No results'",
    },
    {
      name: 'applyLabel',
      type: 'string',
      description:
        'Label for the staged Apply action. Only valid with commitBehavior="staged".',
      default: "'Apply'",
    },
    {
      name: 'cancelLabel',
      type: 'string',
      description:
        'Label for the staged Cancel action. Only valid with commitBehavior="staged".',
      default: "'Cancel'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Trigger and field size.',
      default: "'md'",
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field and its popup; both track this one value.',
      default: "'min(41rem, calc(100vw - 32px))'",
    },
    {
      name: 'placement',
      type: "'above' | 'below' | 'start' | 'end'",
      description: 'Popover placement relative to the trigger.',
      default: "'below'",
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Marks the field optional.',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Marks the field required.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the selector trigger and transfer interaction.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Shows loading state on the trigger and disables transfer interaction while busy.',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description: 'Validation status for the field.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description: 'Placement treatment for the status message.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: 'Tooltip text displayed next to the field label.',
    },
    {
      name: 'changeAction',
      type: '(value: readonly T[]) => void | Promise<void>',
      description:
        'Optional async action run after each immediate commit or a changed staged Apply; drives optimistic and busy state.',
    },
    {
      name: 'controlXstyle',
      type: 'StyleXStyles',
      description:
        "StyleX styles for the external selector's bordered control box.",
    },
    {
      name: 'controlClassName',
      type: 'string',
      description: "Class name applied to the external selector's control box.",
    },
    {
      name: 'controlStyle',
      type: 'CSSProperties',
      description:
        "Inline styles applied to the external selector's control box.",
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test ID for the selector trigger button.',
    },
  ],
  components: [
    {
      name: 'TransferList',
      displayName: 'Transfer List',
      description:
        'Lower-level controlled content primitive for advanced selector compositions that add custom headers, saved views, presets, or actions. Changes are immediate to its controlled value.',
      props: [
        {
          name: 'label',
          type: 'string',
          description: 'Accessible name for the complete transfer control.',
          required: true,
        },
        {
          name: 'isLabelHidden',
          type: 'boolean',
          description:
            'Visually hides the control label while retaining its accessible name.',
          default: 'false',
        },
        {
          name: 'description',
          type: 'string',
          description: 'Supporting guidance shown below the control label.',
        },
        {
          name: 'options',
          type: 'readonly TransferListOption<T>[]',
          description:
            'Complete option pool with optional metadata, grouping, transfer constraints, and reorder constraints.',
          required: true,
        },
        {
          name: 'value',
          type: 'readonly T[]',
          description: 'Selected option values in display order.',
          required: true,
        },
        {
          name: 'onChange',
          type: '(nextValue: readonly T[]) => void',
          description:
            "Called immediately after a permitted option is added, removed, or bulk changed. Moves go to the reorderable object's onReorder instead.",
          required: true,
        },
        {
          name: 'selectedLabel',
          type: 'string',
          description: 'Heading and accessible name for the selected list.',
          default: "'Selected'",
        },
        {
          name: 'availableLabel',
          type: 'string',
          description: 'Heading and accessible name for the available list.',
          default: "'Available'",
        },
        {
          name: 'hasSearch',
          type: 'boolean',
          description:
            'Shows a shared search field that filters both lists by label and description.',
          default: 'false',
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description:
            'Disables every transfer, reorder, Clear, Add all and search control. The row controls and the search field stay focusable.',
          default: 'false',
        },
        {
          name: 'searchLabel',
          type: 'string',
          description: 'Accessible label for the shared search field.',
        },
        {
          name: 'searchPlaceholder',
          type: 'string',
          description: 'Placeholder shown in the shared search field.',
          default: "'Search...'",
        },
        {
          name: 'reorderable',
          type: 'Reorderable<T>',
          description:
            'Makes the selected options reorderable through a handle at the end of each row: pass the object createReorderable makes. Its isReorderable(value) decides which options move (one it rejects at either end of the list also keeps the others from moving past it), and each move goes to its onReorder({key, to}), to being the index of the value in value after the move. Without it, the selected options keep their order.',
        },
        {
          name: 'hasSelectAll',
          type: 'boolean',
          description: 'Shows Add all for transfer-enabled available options.',
          default: 'false',
        },
        {
          name: 'hasClear',
          type: 'boolean',
          description:
            'Shows Clear for transfer-enabled selected options; transfer-disabled values remain selected.',
          default: 'false',
        },
        {
          name: 'renderOption',
          type: '(option: TransferListOption<T>) => ReactNode',
          description:
            'Customizes row content without replacing built-in actions and constraints.',
        },
        {
          name: 'selectedEmptyText',
          type: 'string',
          description: 'Message shown when the selected list is empty.',
          default: "'No selected options'",
        },
        {
          name: 'availableEmptyText',
          type: 'string',
          description: 'Message shown when every option has been selected.',
          default: "'No available options'",
        },
        {
          name: 'noResultsText',
          type: 'string',
          description: 'Message shown when search has no matches in a list.',
          default: "'No results'",
        },
        {
          name: 'xstyle',
          type: 'StyleXStyles',
          description: 'StyleX styles for the TransferList root.',
        },
      ],
    },
  ],
  usage: {
    description:
      'Use TransferListSelector by default for medium-to-large, inspectable sets where membership and selected order need explicit control. Immediate behavior commits each edit and renders no footer. Choose staged behavior when users must review a set of changes before Apply. Use TransferList directly only in a deliberately custom ComplexSelector surface, such as table column settings with saved views and a custom footer.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Start with immediate behavior. Add, remove, and bulk changes call onChange as they occur and moves call the reorderable object's onReorder, and closing or dismissing the popover keeps those committed changes.",
      },
      {
        guidance: true,
        description:
          'Set commitBehavior="staged" when the complete selection should be reviewed or persisted as one transaction. Apply commits a changed draft; Cancel, Escape, and light dismiss discard it.',
      },
      {
        guidance: true,
        description:
          'Use TransferList directly inside ComplexSelector only when the surface needs custom structure such as saved views, presets, headers, or footer actions. Keep applied and draft state separate and reset the draft whenever the surface opens.',
      },
      {
        guidance: true,
        description:
          "Use isTransferDisabled and the reorderable object's isReorderable independently: isTransferDisabled pins an option to its panel, and isReorderable keeps an option in its place. Provide disabledMessage when a transfer is unavailable so the constraint is discoverable; a row that keeps its place shows no reorder handle, so say why in its content when it matters.",
      },
      {
        guidance: true,
        description:
          "With no `reorderable`, TransferList no longer reorders; pass `reorderable={createReorderable(…)}`. Migrating from isReorderable: pass reorderable={createReorderable({onReorder, isReorderable})} instead. The isReorderable prop and each option's isReorderDisabled are gone; return false from the object's isReorderable(value) for an option that stays put.",
      },
      {
        guidance: true,
        description:
          'Keep rows concise and single-line. Use option description as searchable metadata, or renderOption when richer visible content is necessary.',
      },
      {
        guidance: true,
        description:
          "Commit add, remove, and bulk changes immediately. A drag leaves the rows still: the row dims in place, a copy of it follows the finger or pointer, and an insertion line marks where it would land; the reorderable object's onReorder runs once on release.",
      },
      {
        guidance: false,
        description:
          'Use commitBehavior as a presentation or container choice. Both values render the same selector popover; use explicit composition for a different shell.',
      },
      {
        guidance: false,
        description:
          'Use a transfer list for a handful of simple choices; CheckboxInput or MultiSelector is more compact.',
      },
    ],
    anatomy: [
      {
        name: 'Field label and description',
        required: true,
        description:
          'Names and explains the selector outside the popover so placement does not change with supporting text.',
      },
      {
        name: 'Selector trigger',
        required: true,
        description:
          'Summarizes the committed value and opens the transfer-list popover.',
      },
      {
        name: 'Search',
        required: false,
        description:
          'Filters the selected and available lists without changing their values and uses a uniform 12px inset.',
      },
      {
        name: 'Selected and available sections',
        required: true,
        description:
          'Places two unframed semantic lists beside one divider. Narrow containers stack the sections, use the body background behind each column header, expand both sections to their rows, and delegate overflow to one scrollable containing surface.',
      },
      {
        name: 'Row actions',
        required: true,
        description:
          'Uses a direction-neutral X to remove and plus to add. Selected rows end with a reorder handle when reordering is enabled; a row that keeps its place has none, and transfer constraints disable the remove action.',
      },
      {
        name: 'Reorder hint',
        required: false,
        description:
          'While a selected row is in reorder mode: the hint below its handle, whose Move up, Move down and Done are buttons.',
      },
      {
        name: 'Bulk actions',
        required: false,
        description:
          'Optional Clear and Add all text actions that honor transfer-disabled options.',
      },
      {
        name: 'Apply and Cancel footer',
        required: false,
        description:
          'Rendered only for staged behavior. Apply commits a changed draft; Cancel closes without changing the committed value.',
      },
      {
        name: 'Live announcements',
        required: true,
        description:
          'Reports add, remove, bulk, and reorder results without relying on visual position alone.',
      },
    ],
  },
  // Mirrors the themeProps() calls in TransferList.tsx. `astryx theme build`
  // reads this inventory to learn which visual props a target can vary on, so
  // a target missing here cannot be themed even though it carries the class.
  theming: {
    targets: [
      {
        className: 'astryx-transfer-list',
        visualProps: [],
      },
      {
        className: 'astryx-transfer-list-collection',
        visualProps: [],
      },
      {
        className: 'astryx-transfer-list-panel',
        visualProps: ['side'],
      },
      {
        className: 'astryx-transfer-list-item',
        visualProps: ['side', 'state', 'reorder'],
      },
    ],
  },
  examples: [
    {
      label: 'Default immediate selector',
      code: `const [fields, setFields] = useState(['name', 'status']);

<TransferListSelector
  label="Visible fields"
  description="Choose which fields appear. Changes take effect immediately."
  triggerLabel={fields.length + ' visible fields'}
  options={[
    {value: 'name', label: 'Name'},
    {value: 'status', label: 'Status'},
    {value: 'owner', label: 'Owner'},
  ]}
  value={fields}
  onChange={setFields}
  selectedLabel="Visible fields"
  availableLabel="Available fields"
  hasSelectAll
  hasClear
/>`,
    },
    {
      label: 'Staged commit',
      code: `const [fields, setFields] = useState(['name', 'status']);

<TransferListSelector
  label="Visible fields"
  description="Review the complete selection before applying it."
  options={fieldOptions}
  value={fields}
  onChange={setFields}
  commitBehavior="staged"
  selectedLabel="Visible fields"
  availableLabel="Available fields"
  hasSelectAll
  hasClear
/>`,
    },
    {
      label: 'Independent transfer and reorder constraints',
      code: `const reorderable = useMemo(
  () =>
    createReorderable<string>({
      onReorder: ({key, to}) => setFields(fields => moveTo(fields, key, to)),
      // Status keeps its place, but can be removed.
      isReorderable: value => value !== 'status',
    }),
  [],
);

<TransferListSelector
  label="Visible fields"
  options={[
    {
      value: 'name',
      label: 'Name',
      isTransferDisabled: true,
      disabledMessage: 'Name must remain visible.',
    },
    {value: 'status', label: 'Status'},
    {value: 'owner', label: 'Owner'},
  ]}
  reorderable={reorderable}
  value={fields}
  onChange={setFields}
/>`,
    },
    {
      label: 'Migrating from isReorderable to reorderable',
      code: `// BEFORE: isReorderable turned reordering on, and an option opted out.
<TransferList
  options={[{value: 'name', label: 'Name', isReorderDisabled: true}, ...rest]}
  isReorderable
  value={fields}
  onChange={setFields}
/>;

// AFTER: reordering is opt-in through the object createReorderable makes.
const reorderable = useMemo(
  () =>
    createReorderable<string>({
      onReorder: ({key, to}) => setFields(fields => moveTo(fields, key, to)),
      isReorderable: value => value !== 'name',
    }),
  [],
);

<TransferList
  options={[{value: 'name', label: 'Name'}, ...rest]}
  reorderable={reorderable}
  value={fields}
  onChange={setFields}
/>;`,
    },
    {
      label: 'Saved views in a custom ComplexSelector',
      code: `const savedViews = {
  standard: ['name', 'status', 'owner'],
  ownership: ['name', 'owner', 'team'],
};
const [applied, setApplied] = useState(savedViews.standard);
const [draft, setDraft] = useState(applied);
const activeSavedView =
  Object.entries(savedViews).find(
    ([, columns]) =>
      columns.length === draft.length &&
      columns.every((column, index) => column === draft[index]),
  )?.[0] ?? 'custom';

function ResetDraftOnOpen({isOpen, value, onReset}) {
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      onReset([...value]);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, onReset, value]);

  return null;
}

<ComplexSelector
  label="View options"
  isLabelHidden
  triggerLabel="View options"
  value={applied}
  onChange={setApplied}>
  {(_appliedValue, commit, close, state) => (
    <>
      <ResetDraftOnOpen
        isOpen={state.isOpen}
        value={applied}
        onReset={setDraft}
      />
      <Selector
        label="Saved view"
        options={savedViewOptions}
        value={activeSavedView}
        onChange={nextSavedView => {
          setDraft(savedViews[nextSavedView]);
        }}
      />
      <TransferList
        label="Visible fields"
        isLabelHidden
        options={fieldOptions}
        value={draft}
        onChange={setDraft}
        selectedLabel="Visible fields"
        availableLabel="Available fields"
        hasSelectAll
        hasClear
      />
      <Button label="Cancel" variant="ghost" onClick={close} />
      <Button
        label="Apply"
        variant="primary"
        onClick={() => {
          commit(draft);
          close();
        }}
      />
    </>
  )}
</ComplexSelector>`,
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'default-immediate transfer-list selector with optional staged commit behavior; TransferList is the advanced custom-composition primitive',
  usage: {
    description:
      'Use TransferListSelector with immediate behavior by default: each list edit commits and no footer renders. Use staged behavior to review a draft and commit from Apply. Use TransferList directly only inside a custom ComplexSelector surface with saved views, presets, or custom actions.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Default to immediate behavior; each edit calls onChange and dismiss keeps committed changes.',
      },
      {
        guidance: true,
        description:
          'Use commitBehavior="staged" for review or transactional persistence; Apply commits and Cancel/Escape/light dismiss discard.',
      },
      {
        guidance: true,
        description:
          'Use direct TransferList plus ComplexSelector only for custom saved views, presets, headers, or actions; reset draft from applied value on open.',
      },
      {
        guidance: true,
        description:
          'Set transfer and reorder constraints independently and explain a locked transfer with disabledMessage.',
      },
      {
        guidance: true,
        description:
          'Keep rows single-line; descriptions remain searchable metadata.',
      },
      {
        guidance: false,
        description:
          'Use commitBehavior for presentation/container choice; both values use the selector popover.',
      },
      {
        guidance: false,
        description: 'Use for a few simple choices; prefer CheckboxInput.',
      },
    ],
  },
  propDescriptions: {
    label: 'External field label and accessible name.',
    options:
      'Full pool: value, label, description?, group?, isTransferDisabled?, disabledMessage?.',
    value: 'Committed selected values in display order.',
    onChange:
      'Called per edit in immediate behavior or from changed Apply in staged behavior.',
    commitBehavior:
      'TransferListSelectorCommitBehavior: immediate (default, no footer) or staged (draft plus Apply/Cancel).',
    triggerLabel: 'Closed-trigger content; defaults to selected count.',
    description: 'Supporting field guidance outside the popover.',
    isLabelHidden: 'Hide field label visually, preserving its name.',
    selectedLabel: 'Selected-list heading and name.',
    availableLabel: 'Available-list heading and name.',
    hasSearch: 'Shared list filter; default false.',
    searchLabel: 'Accessible search label.',
    searchPlaceholder: 'Search placeholder.',
    reorderable:
      'createReorderable object for a trailing reorder handle (touch hold, mouse drag, keys); its isReorderable says which values move; staged moves change the draft; paused while searching.',
    hasSelectAll: 'Add all transfer-enabled available options.',
    hasClear: 'Remove all transfer-enabled selected options.',
    renderOption: 'Custom row content.',
    selectedEmptyText: 'Selected-list empty message.',
    availableEmptyText: 'Available-list empty message.',
    noResultsText: 'No search matches message.',
    applyLabel: 'Staged Apply label; default Apply.',
    cancelLabel: 'Staged Cancel label; default Cancel.',
    size: 'Field and trigger size.',
    width:
      'External field width; its default matches the responsive 41rem popup.',
    placement: 'Popover placement relative to trigger.',
    isOptional: 'Mark field optional.',
    isRequired: 'Mark field required.',
    isDisabled: 'Disable selector trigger and transfer interaction.',
    isLoading: 'Show loading state and disable transfer interaction.',
    status: 'Field validation status.',
    statusVariant: 'Status placement treatment.',
    labelTooltip: 'Field-label tooltip.',
    changeAction:
      'Async action after each immediate commit or changed staged Apply.',
    xstyle: 'External field StyleX override.',
    className: 'External field class name.',
    style: 'External field inline styles.',
    'data-testid': 'Selector trigger test ID.',
  },
  components: [
    {
      name: 'TransferList',
      displayName: 'Transfer List',
      description:
        'Lower-level controlled content for custom ComplexSelector surfaces; changes its controlled value immediately.',
      propDescriptions: {
        label: 'Accessible control label.',
        isLabelHidden: 'Hide control label visually, preserving its name.',
        description: 'Supporting control guidance.',
        options: 'Full pool with metadata, groups, and transfer constraints.',
        value: 'Selected values in display order.',
        onChange:
          'Called after each add/remove/bulk change; moves go to onReorder.',
        selectedLabel: 'Selected-list heading and name.',
        availableLabel: 'Available-list heading and name.',
        hasSearch: 'Shared list filter; default false.',
        isDisabled:
          'Disable every control; rows and search stay focusable; default false.',
        searchLabel: 'Accessible search label.',
        searchPlaceholder: 'Search placeholder.',
        reorderable:
          'createReorderable object (its isReorderable says which values move; its onReorder gets {key, to} in value terms); paused while searching.',
        hasSelectAll: 'Add all transfer-enabled options.',
        hasClear: 'Remove all transfer-enabled selected options.',
        renderOption: 'Custom row content.',
        selectedEmptyText: 'Selected-list empty message.',
        availableEmptyText: 'Available-list empty message.',
        noResultsText: 'No search matches message.',
        xstyle: 'TransferList-root StyleX override.',
      },
    },
  ],
};

export const docsZh = {
  "name": "TransferListSelector",
  "displayName": "Transfer List Selector",
  "description": "一个选择器字段，用于在已选和可用列表之间移动选项，并可选地对已选值排序。更改默认立即提交；暂存提交行为会增加内部草稿和 Apply/Cancel 页脚。TransferList 仍是自定义 ComplexSelector 表面的底层内容原语。",
  "usage": {
    "description": "默认使用 TransferListSelector 处理中到大型、可检查的集合，其中成员关系和已选顺序需要显式控制。立即行为会提交每次编辑并且不渲染页脚。当用户必须在应用前审查一组更改时，选择暂存行为。仅在特意自定义的 ComplexSelector 表面中直接使用 TransferList，例如带已保存视图和自定义页脚的表格列设置。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "从立即行为开始。添加、移除和批量更改在发生时调用 onChange，移动会调用可排序对象的 onReorder，关闭或取消浮层会保留这些已提交的更改。"
      },
      {
        "guidance": true,
        "description": "当完整选择应作为一次事务审查或持久化时，设置 commitBehavior=\"staged\"。Apply 提交更改后的草稿；Cancel、Escape 和轻触关闭会丢弃它。"
      },
      {
        "guidance": true,
        "description": "仅当表面需要自定义结构（如保存视图、预设、头部或页脚操作）时，才在 ComplexSelector 内直接使用 TransferList。保持已应用状态和草稿状态分离，并在表面每次打开时重置草稿。"
      },
      {
        "guidance": true,
        "description": "独立使用 isTransferDisabled 和可排序对象的 isReorderable：isTransferDisabled 将选项固定在其面板，isReorderable 将选项保持在原位。当转移不可用时提供 disabledMessage，使约束可被发现；保持原位的行不显示排序手柄，因此必要时在其内容中说明原因。"
      },
      {
        "guidance": true,
        "description": "没有 `reorderable` 时，TransferList 不再排序；请传入 `reorderable={createReorderable(…)}`。从 isReorderable 迁移：改为传入 reorderable={createReorderable({onReorder, isReorderable})}。isReorderable 属性和每个选项的 isReorderDisabled 已移除；对保持原位的选项，从对象的 isReorderable(value) 返回 false。"
      },
      {
        "guidance": true,
        "description": "保持行简洁且单行。将选项 description 用作可搜索元数据，或当需要更丰富的可见内容时使用 renderOption。"
      },
      {
        "guidance": true,
        "description": "立即提交添加、移除和批量更改。拖动时行保持静止：该行在原地变暗，其副本跟随手指或指针，插入线标记其将落到的位置；可排序对象的 onReorder 在释放时运行一次。"
      },
      {
        "guidance": false,
        "description": "将 commitBehavior 用作呈现或容器选择。两个值渲染相同的选择器浮层；需要不同外壳时使用显式组合。"
      },
      {
        "guidance": false,
        "description": "不要对少量简单选择使用转移列表；CheckboxInput 或 MultiSelector 更紧凑。"
      }
    ],
    "anatomy": [
      {
        "name": "字段标签和描述",
        "required": true,
        "description": "在浮层外命名并解释选择器，使位置不会随支持文本变化。"
      },
      {
        "name": "选择器触发器",
        "required": true,
        "description": "汇总已提交的值并打开转移列表浮层。"
      },
      {
        "name": "搜索",
        "required": false,
        "description": "过滤已选和可用列表而不更改其值，并使用统一的 12px 内边距。"
      },
      {
        "name": "已选和可用区块",
        "required": true,
        "description": "在一个分隔线旁放置两个无边框的语义列表。窄容器会堆叠区块，在每个列头后使用正文背景，将两个区块扩展到其行，并将溢出委托给一个可滚动的包含表面。"
      },
      {
        "name": "行操作",
        "required": true,
        "description": "使用方向中立的 X 移除，加号添加。启用排序时，已选行以排序手柄结尾；保持原位的行没有手柄，转移约束会禁用移除操作。"
      },
      {
        "name": "排序提示",
        "required": false,
        "description": "当已选行处于排序模式时：手柄下方的提示，其 Move up、Move down 和 Done 是按钮。"
      },
      {
        "name": "批量操作",
        "required": false,
        "description": "可选的 Clear 和 Add all 文本操作，会尊重转移禁用的选项。"
      },
      {
        "name": "Apply 和 Cancel 页脚",
        "required": false,
        "description": "仅用于暂存行为。Apply 提交更改后的草稿；Cancel 关闭而不更改已提交的值。"
      },
      {
        "name": "实时公告",
        "required": true,
        "description": "报告添加、移除、批量及排序结果，而不只依赖视觉位置。"
      }
    ]
  },
  "propDescriptions": {
    "label": "在浮层外显示的可访问字段标签，除非 isLabelHidden 为 true。",
    "options": "完整选项池。每个选项有 value 和 label，可选可搜索的 description 元数据、group、isTransferDisabled 约束和 disabledMessage。哪些选项保持原位由可排序对象的 isReorderable 决定。",
    "value": "按显示顺序排列的已提交已选值。在暂存行为中，这是选择器打开时复制到本地草稿的已应用值。",
    "onChange": "在立即行为中每次允许的列表编辑后调用，或在暂存行为中 Apply 提交更改后的草稿时调用一次。",
    "commitBehavior": "控制更改何时提交。Immediate 在每次列表编辑时更新且无页脚；staged 等待 Apply 并支持 Cancel 或关闭。",
    "triggerLabel": "显示在关闭的选择器触发器中的内容。",
    "description": "与外部标签一起显示的支持性字段指导。",
    "isLabelHidden": "视觉隐藏字段标签，同时保留其可访问名称。",
    "selectedLabel": "已选列表的标题和可访问名称。",
    "availableLabel": "可用列表的标题和可访问名称。",
    "hasSearch": "显示共享搜索字段，按标签和描述过滤两个列表。",
    "searchLabel": "共享搜索字段的可访问标签。",
    "searchPlaceholder": "共享搜索字段中显示的占位符。",
    "reorderable": "使已选选项可排序：传入 createReorderable 生成的对象。每个已选行以排序手柄结尾：在触摸屏上按住手柄片刻，然后拖动；鼠标可直接拖动；在手柄上点击、单击、Space 或 Enter 会为其行开启排序模式，在其中每个方向键（或手柄下方提示中的每次移动）将其移动一个位置，Escape、Done 或再次激活会结束模式并保留移动。对象的 isReorderable(value) 说明哪些值可移动：它拒绝的值没有手柄，并且在已选列表的任一端，它还会阻止其他值越过它。在立即行为中，每次移动都会传给对象的 onReorder({key, to})；在暂存行为中，选择器改为移动其草稿，因此 Cancel 会随草稿丢弃移动，Apply 通过 onChange 提交它。搜索过滤面板时排序暂停。没有它时，已选选项保持其顺序。",
    "hasSelectAll": "显示 Add all，并将每个可转移的可用选项添加到当前选择。",
    "hasClear": "显示 Clear，并从当前选择移除每个可转移的已选选项。",
    "renderOption": "自定义行内容，同时保留内置标签、操作、约束和排序交互。",
    "selectedEmptyText": "已选列表为空时显示的消息。",
    "availableEmptyText": "所有选项都已选中时显示的消息。",
    "noResultsText": "搜索在列表中无匹配时显示的消息。",
    "applyLabel": "暂存 Apply 操作的标签。仅在与 commitBehavior=\"staged\" 搭配时有效。",
    "cancelLabel": "暂存 Cancel 操作的标签。仅在与 commitBehavior=\"staged\" 搭配时有效。",
    "size": "触发器和字段尺寸。",
    "width": "字段及其弹出层的宽度；两者都跟随这一个值。",
    "placement": "浮层相对于触发器的位置。",
    "isOptional": "将字段标记为可选。",
    "isRequired": "将字段标记为必填。",
    "isDisabled": "禁用选择器触发器和转移交互。",
    "isLoading": "在触发器上显示加载状态，并在忙碌时禁用转移交互。",
    "status": "字段的验证状态。",
    "statusVariant": "状态消息的放置处理。",
    "labelTooltip": "显示在字段标签旁边的工具提示文本。",
    "changeAction": "在每次立即提交或更改后的暂存 Apply 之后运行的可选异步操作；驱动乐观和忙碌状态。",
    "controlXstyle": "外部选择器带边框控件盒的 StyleX 样式。",
    "controlClassName": "应用于外部选择器控件盒的类名。",
    "controlStyle": "应用于外部选择器控件盒的内联样式。",
    "data-testid": "选择器触发器按钮的测试 ID。"
  },
  "components": [
    {
      "name": "TransferList",
      "description": "用于高级选择器组合的底层受控内容原语，这些组合添加自定义头部、保存视图、预设或操作。其受控值的更改是立即的。",
      "propDescriptions": {
        "label": "完整转移控件的可访问名称。",
        "isLabelHidden": "视觉隐藏控件标签，同时保留其可访问名称。",
        "description": "显示在控件标签下方的支持性指导。",
        "options": "完整选项池，带可选元数据、分组、转移约束和排序约束。",
        "value": "按显示顺序排列的已选选项值。",
        "onChange": "在允许的选项被添加、移除或批量更改后立即调用。移动会改为传给可排序对象的 onReorder。",
        "selectedLabel": "已选列表的标题和可访问名称。",
        "availableLabel": "可用列表的标题和可访问名称。",
        "hasSearch": "显示共享搜索字段，按标签和描述过滤两个列表。",
        "isDisabled": "禁用每个转移、排序、Clear、Add all 和搜索控件。行控件和搜索字段仍可聚焦。",
        "searchLabel": "共享搜索字段的可访问标签。",
        "searchPlaceholder": "共享搜索字段中显示的占位符。",
        "reorderable": "通过每行末尾的手柄使已选选项可排序：传入 createReorderable 生成的对象。其 isReorderable(value) 决定哪些选项可移动（它在列表任一端拒绝的项还会阻止其他项越过它），每次移动都会传给其 onReorder({key, to})，其中 to 是移动后该值在 value 中的索引。没有它时，已选选项保持其顺序。",
        "hasSelectAll": "为可转移的可用选项显示 Add all。",
        "hasClear": "为可转移的已选选项显示 Clear；转移禁用的值保持选中。",
        "renderOption": "自定义行内容，而不替换内置操作和约束。",
        "selectedEmptyText": "已选列表为空时显示的消息。",
        "availableEmptyText": "所有选项都已选中时显示的消息。",
        "noResultsText": "搜索在列表中无匹配时显示的消息。",
        "xstyle": "TransferList 根元素的 StyleX 样式。"
      }
    }
  ]
};
