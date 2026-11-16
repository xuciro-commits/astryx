// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ListInput',
  displayName: 'List Input',
  group: 'ListInput',
  category: 'Form Controls',
  keywords: [
    'listinput',
    'list input',
    'editable list',
    'repeatable fields',
    'field array',
    'collection input',
    'reorder',
    'guest list',
    'traveler details',
  ],
  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Visible label that names the collection. It also provides the accessible name for the complete input.',
      required: true,
    },
    {
      name: 'value',
      type: 'T[]',
      description:
        'Current ordered records. ListInput is controlled and never mutates this array or its records.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(next: T[], change: ListInputChange<T>) => void',
      description:
        'Called with the next array after an add, update, or remove action. The change argument identifies the action and affected record. Moves go to the reorderable object instead.',
      required: true,
    },
    {
      name: 'getItemKey',
      type: '(item: T) => React.Key',
      description:
        'Returns a stable, unique key for each record. Stable identity preserves focus and announcements when records move.',
      required: true,
    },
    {
      name: 'createItem',
      type: '() => T',
      description:
        'Creates the initial record inserted by the built-in add action. Return a new record with its stable key already assigned.',
      required: true,
    },
    {
      name: 'columns',
      type: 'ListInputColumn<T>[]',
      description:
        'Consistent simple fields shown for every record. Use each column width with proportional() or pixel() from @astryxdesign/core/Table to tune the width spread. ListInput owns the visible primary-tone column labels while renderer labels remain semantically available to assistive technology. At 640px or narrower, fields stack, every record shows its field labels, record groups use 32px vertical separation, and row actions align beside the first field. Renderers receive isLabelHidden, complete scoped validation status, statusVariant, and updateItem.',
      required: true,
    },
    {
      name: 'itemName',
      type: 'string',
      description:
        'Singular noun used in built-in action labels and live announcements, such as "guest" in "Add guest".',
    },
    {
      name: 'description',
      type: 'string',
      description:
        'Supporting text displayed between the collection label and its records.',
    },
    {
      name: 'status',
      type: 'InputStatus',
      description:
        'List-level validation status displayed for the complete collection. An error marks the collection invalid and associates its message with the input.',
    },
    {
      name: 'getItemStatus',
      type: '(item: T, index: number) => InputStatus | undefined',
      description:
        'Returns validation status for a complete record, such as an invalid combination of otherwise valid fields.',
    },
    {
      name: 'getFieldStatus',
      type: '(item: T, columnKey: string, index: number) => InputStatus | undefined',
      description:
        'Returns validation status for one field. The renderer receives the complete status plus statusVariant="tooltip" and should forward both to its Astryx input so the native status affordance owns styling, description, keyboard access, and tooltip behavior without changing row height.',
    },
    {
      name: 'reorderable',
      type: 'Reorderable',
      description:
        "Makes the records reorderable: pass the object createReorderable makes, keyed by getItemKey. Each record ends with core List's reorder handle, after Remove, as UIKit's reorder control ends an editing row. The handle appears while the record is hovered or holds keyboard focus and stays visible on touch screens. On a touch screen, hold the handle for a moment, then drag: the record stays in its place, dimmed, while a copy of it follows the finger and an accent line marks where it would land; the other records stay still, the list autoscrolls near its edges, and on release the records rearrange. A flick on the handle scrolls and a pinch zooms the page. A mouse drags at once the same way, and the records take their places without motion. Activating the handle (a tap, a click, Space or Enter) turns on reorder mode for its record: the line marks the record's place, each Arrow Up or Arrow Down moves it a place, a hint shows the moves and Done as buttons, and Escape or Done ends the mode, keeping the moves. The object's isReorderable(key) says which records move: one it rejects has no handle. Each move goes to the object's onReorder({key, to}), to being the record's index in value after the move. In a disabled or loading list the handles stay focusable but move nothing. Without it, the records keep their order.",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disables the collection and all built-in actions. The disabled state is also passed to each column renderer.',
      default: 'false',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Marks the collection busy and prevents changes while work is pending. The loading state is also passed to each column renderer.',
      default: 'false',
    },
    {
      name: 'maxItems',
      type: 'number',
      description:
        'Maximum number of records that can be added. Once the value reaches this limit, the built-in add action is unavailable.',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Visually hides the collection label while keeping it available to assistive technology.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Displays an optional indicator beside the collection label. Mutually exclusive with isRequired.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        'Displays a required indicator beside the collection label and exposes the requirement to assistive technology. Mutually exclusive with isOptional.',
      default: 'false',
    },
  ],
  usage: {
    description:
      'ListInput edits a compact, ordered collection of records with consistent fields, built-in add and remove actions, and optional reordering. Standard Astryx controls rendered in its columns inherit the medium control size so inputs align with the Add, remove, reorder, and validation affordances; an explicit field size still takes precedence. Pointer activation measures Add before pointer-down blur or validation can change layout, then keeps it at that viewport position by adjusting available vertical scroll containers from nearest to outermost. The correction is interaction-scoped and rechecked for one animation frame without persistent scroll or resize observation. Added rows enter with tokenized translate motion; after removal, surviving rows animate into their new positions when their geometry stays stable. Motion never delays onChange, focus handoff, or the announcement, while reduced-motion preferences and unsupported browsers use an instant change. Use it for lists with fewer than seven records and up to three simple fields per record, such as guests, travelers, or tag options. Use a Table for larger collections and a card or step-based form when records need many, complex, or inconsistent fields.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use stable record keys and consistent columns so focus, validation, and reorder announcements remain attached to the correct record.',
      },
      {
        guidance: true,
        description:
          'Keep validation timing application-owned. Track touched fields by stable item and column keys when errors should appear after blur, while allowing submit or server errors to display immediately.',
      },
      {
        guidance: true,
        description:
          'Place validation at the narrowest useful level: field status for one value, item status for a record-wide problem, and list status for collection-wide requirements.',
      },
      {
        guidance: true,
        description:
          "Forward both status and statusVariant from every column renderer to the rendered Astryx input so field messages use the control's native accessible tooltip pattern.",
      },
      {
        guidance: true,
        description:
          'Let records reorder through the handle: a drag reports one move on release, each key move in reorder mode reports one at once, and focus stays on the handle.',
      },
      {
        guidance: true,
        description:
          'Keep collection motion informational and non-blocking. Added live rows translate into place; removed rows disappear immediately while stable-size survivors close the gap. onChange, focus, and announcements run without waiting, and reduced-motion preferences remain instant.',
      },
      {
        guidance: true,
        description:
          'Keep repeated pointer adding spatially stable by measuring Add before pointer-down blur or validation changes layout, then preserving that viewport position from the nearest vertical scroll container outward. Slight field clipping should not move Add away from the pointer; a meaningfully hidden focused field still takes priority. Keyboard activation follows the normal focus flow.',
      },
      {
        guidance: false,
        description:
          'Use for seven or more records or more than three simple fields per record; use a Table or a dedicated editing flow instead.',
      },
      {
        guidance: false,
        description:
          'Prevent removal solely to enforce a minimum count; allow the action and explain the resulting requirement with list-level validation.',
      },
    ],
    anatomy: [
      {
        name: 'Label and description',
        required: true,
        description:
          'Names the complete collection and optionally explains what records to add.',
      },
      {
        name: 'First-record field labels',
        required: true,
        description:
          "ListInput renders primary-tone column labels without separate table chrome and keeps each rendered control's own label visually hidden but semantically associated. At wider widths, repeated labels are visually hidden; when fields stack at 640px or narrower, every record shows its field labels.",
      },
      {
        name: 'Record fields',
        required: true,
        description:
          'Consumer-rendered inputs that receive scoped record state, complete validation status, the native tooltip status variant, and update behavior. When stacked responsively, label-to-input spacing is smallest, field spacing is larger, and record groups use 32px separation so each object remains visually distinct.',
      },
      {
        name: 'Remove action',
        required: true,
        description:
          'Removes its record immediately, moves focus to a predictable neighboring control, and animates surviving rows into their new positions when supported. It is revealed while the record is hovered or contains keyboard focus and stays visible on touch screens; at rest it is transparent but keeps its column and its place in the tab order, so the fields never shift. In the stacked layout, it aligns beside the first field at the top of the record.',
      },
      {
        name: 'Reorder handle',
        required: false,
        description:
          "Core List's reorder handle, three lines at the end of the record after Remove, in Remove's cell, with an accessible label naming the record and its position and no hover tooltip. Where the primary pointer is coarse, its target grows to at least 44 by 44 px. It is revealed while the record is hovered or contains keyboard focus and stays visible on touch screens; at rest it is transparent but stays in the tab order. In the stacked layout it sits at the top of the record beside Remove. A finger holds it a moment, then drags; a mouse drags at once; activating it (Space or Enter) turns on reorder mode, where Arrow Up and Arrow Down move the record a place and Escape ends the mode.",
      },
      {
        name: 'Reorder-mode hint',
        required: false,
        description:
          "While a record is in reorder mode, core List's hint anchored to its handle shows the moves and Done as buttons, so taps alone can reorder. Each does what its key does and leaves the focus on the handle.",
      },
      {
        name: 'Empty state',
        required: false,
        description:
          'When no records exist, a centered compact EmptyState names the empty collection and directs users to the Add action.',
      },
      {
        name: 'Add action',
        required: true,
        description:
          'Fills the record-fields width, uses the inherited medium control size shared by ListInput fields and actions, and immediately appends a new record created by createItem unless maxItems has been reached. On pointer activation, available vertical scroll containers offset the inserted height from nearest to outermost so the action remains under the pointer; keyboard activation keeps the normal focus behavior, and newly focused field visibility always wins. The live row uses tokenized translate entrance motion when supported, and focus moves to its first field without waiting for the animation.',
      },
      {
        name: 'Validation messages',
        required: false,
        description:
          "Explain field-, item-, or list-level errors, warnings, and success states. Field messages use each input's native tooltip status affordance and do not change row height. Item messages align to the record fields without extending under the remove control.",
      },
    ],
  },
  theming: {
    targets: [
      {
        className: 'astryx-list-input',
        visualProps: ['state', 'reorderable'],
      },
    ],
  },
  examples: [
    {
      label: 'Tag options',
      code: `import {createReorderable} from '@astryxdesign/core';
import {Selector} from '@astryxdesign/core/Selector';
import {proportional} from '@astryxdesign/core/Table';
import {TextInput} from '@astryxdesign/core/TextInput';

type TagOption = {id: string; color: string; label: string};

const columns = [
  {
    key: 'color',
    header: 'Color',
    width: proportional(1, {minWidth: 120}),
    renderInput: ({item, label, isLabelHidden, status, statusVariant, isDisabled, updateItem}) => (
      <Selector
        label={label}
        isLabelHidden={isLabelHidden}
        options={colorOptions}
        value={item.color}
        onChange={color => updateItem({...item, color}, 'color')}
        status={status}
        statusVariant={statusVariant}
        isDisabled={isDisabled}
      />
    ),
  },
  {
    key: 'label',
    header: 'Label',
    width: proportional(2, {minWidth: 200}),
    renderInput: ({item, label, isLabelHidden, status, statusVariant, isDisabled, updateItem}) => (
      <TextInput
        label={label}
        isLabelHidden={isLabelHidden}
        value={item.label}
        onChange={nextLabel => updateItem({...item, label: nextLabel}, 'label')}
        status={status}
        statusVariant={statusVariant}
        isDisabled={isDisabled}
      />
    ),
  },
] satisfies ListInputColumn<TagOption>[];

// Each move lands where ListInput reports it: the record's key and index.
const reorderable = useMemo(
  () =>
    createReorderable({
      onReorder: ({key, to}) =>
        setTags(tags => {
          const rest = tags.filter(tag => tag.id !== key);
          return [...rest.slice(0, to), ...tags.filter(tag => tag.id === key), ...rest.slice(to)];
        }),
    }),
  [],
);

<ListInput
  label="Tag options"
  itemName="tag"
  value={tags}
  onChange={setTags}
  getItemKey={tag => tag.id}
  createItem={() => ({id: crypto.randomUUID(), color: 'blue', label: ''})}
  columns={columns}
  reorderable={reorderable}
  status={
    tags.length < 5
      ? {type: 'error', message: 'Add at least five tag options.'}
      : undefined
  }
  getItemStatus={tag =>
    tag.color === 'green' && tag.label === 'Blocked'
      ? {type: 'error', message: '"Blocked" cannot use green.'}
      : undefined
  }
/>`,
    },
    {
      label: 'Controlled guest list',
      code: `import {createReorderable} from '@astryxdesign/core';
import {proportional} from '@astryxdesign/core/Table';

type Guest = {id: string; name: string; email: string};

const columns = [
  {
    key: 'name',
    header: 'Name',
    width: proportional(1),
    renderInput: ({item, label, isLabelHidden, status, statusVariant, isDisabled, isLoading, updateItem}) => (
      <TextInput
        label={label}
        isLabelHidden={isLabelHidden}
        value={item.name}
        onChange={name => updateItem({...item, name}, 'name')}
        status={status}
        statusVariant={statusVariant}
        isDisabled={isDisabled}
        isLoading={isLoading}
      />
    ),
  },
  {
    key: 'email',
    header: 'Email',
    width: proportional(2),
    renderInput: ({item, label, isLabelHidden, status, statusVariant, isDisabled, isLoading, updateItem}) => (
      <TextInput
        type="email"
        label={label}
        isLabelHidden={isLabelHidden}
        value={item.email}
        onChange={email => updateItem({...item, email}, 'email')}
        status={status}
        statusVariant={statusVariant}
        isDisabled={isDisabled}
        isLoading={isLoading}
      />
    ),
  },
] satisfies ListInputColumn<Guest>[];

// Each move lands where ListInput reports it: the record's key and index.
const reorderable = useMemo(
  () =>
    createReorderable({
      onReorder: ({key, to}) =>
        setGuests(guests => {
          const rest = guests.filter(guest => guest.id !== key);
          return [...rest.slice(0, to), ...guests.filter(guest => guest.id === key), ...rest.slice(to)];
        }),
    }),
  [],
);

<ListInput
  label="Guests"
  itemName="guest"
  value={guests}
  onChange={setGuests}
  getItemKey={guest => guest.id}
  createItem={() => ({id: crypto.randomUUID(), name: '', email: ''})}
  columns={columns}
  reorderable={reorderable}
  maxItems={6}
  getFieldStatus={(guest, key) =>
    key === 'email' && guest.email === ''
      ? {type: 'error', message: 'Enter an email address'}
      : undefined
  }
  status={
    guests.length === 0
      ? {type: 'error', message: 'Add at least one guest'}
      : undefined
  }
/>`,
    },
    {
      label: 'Mailing list',
      code: `import {TextInput} from '@astryxdesign/core/TextInput';

type Subscriber = {id: string; email: string};

<ListInput
  label="Mailing list"
  itemName="subscriber"
  value={subscribers}
  onChange={setSubscribers}
  getItemKey={subscriber => subscriber.id}
  createItem={() => ({id: crypto.randomUUID(), email: ''})}
  columns={[
    {
      key: 'email',
      header: 'Email address',
      renderInput: ({item, label, isLabelHidden, status, statusVariant, isDisabled, updateItem}) => (
        <TextInput
          type="email"
          label={label}
          isLabelHidden={isLabelHidden}
          value={item.email}
          onChange={email => updateItem({...item, email}, 'email')}
          status={status}
          statusVariant={statusVariant}
          isDisabled={isDisabled}
        />
      ),
    },
  ] satisfies ListInputColumn<Subscriber>[]}
  isRequired
  maxItems={6}
  getItemStatus={subscriber =>
    isDuplicateAddress(subscriber)
      ? {type: 'error', message: 'This address is already in the list.'}
      : undefined
  }
/>`,
    },
    {
      label: 'Budget allocation',
      code: `import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Selector} from '@astryxdesign/core/Selector';
import {pixel, proportional} from '@astryxdesign/core/Table';

type Allocation = {id: string; team: string; percent: number | null};

const columns = [
  {
    key: 'team',
    header: 'Team',
    width: proportional(2, {minWidth: 180}),
    renderInput: ({item, label, isLabelHidden, status, statusVariant, isDisabled, updateItem}) => (
      <Selector
        label={label}
        isLabelHidden={isLabelHidden}
        options={teamOptions}
        value={item.team}
        placeholder="Choose a team"
        onChange={team => updateItem({...item, team}, 'team')}
        status={status}
        statusVariant={statusVariant}
        isDisabled={isDisabled}
      />
    ),
  },
  {
    key: 'percent',
    header: 'Allocation',
    width: pixel(132),
    renderInput: ({item, label, isLabelHidden, status, statusVariant, isDisabled, updateItem}) => (
      <NumberInput
        label={label}
        isLabelHidden={isLabelHidden}
        value={item.percent}
        onChange={percent => updateItem({...item, percent}, 'percent')}
        status={status}
        statusVariant={statusVariant}
        isDisabled={isDisabled}
        min={0}
        max={100}
        units="%"
        isIntegerOnly
      />
    ),
  },
] satisfies ListInputColumn<Allocation>[];

<ListInput
  label="Quarterly budget allocation"
  itemName="allocation"
  value={allocations}
  onChange={setAllocations}
  getItemKey={allocation => allocation.id}
  createItem={() => ({id: crypto.randomUUID(), team: '', percent: null})}
  columns={columns}
  maxItems={4}
  status={
    total === 100
      ? undefined
      : {type: 'error', message: 'Allocations must total 100%.'}
  }
/>`,
    },
    {
      label: 'Family member declaration',
      code: `import {DateInput} from '@astryxdesign/core/DateInput';
import {Selector} from '@astryxdesign/core/Selector';
import {pixel, proportional} from '@astryxdesign/core/Table';
import {TextInput} from '@astryxdesign/core/TextInput';

const columns = [
  {
    key: 'fullName',
    header: 'Full legal name',
    width: proportional(2, {minWidth: 200}),
    renderInput: ({item, label, isLabelHidden, status, statusVariant, isDisabled, updateItem}) => (
      <TextInput
        label={label}
        isLabelHidden={isLabelHidden}
        value={item.fullName}
        onChange={fullName => updateItem({...item, fullName}, 'fullName')}
        status={status}
        statusVariant={statusVariant}
        isDisabled={isDisabled}
      />
    ),
  },
  {
    key: 'relationship',
    header: 'Relationship',
    width: proportional(1.25, {minWidth: 160}),
    renderInput: ({item, label, isLabelHidden, status, statusVariant, isDisabled, updateItem}) => (
      <Selector
        label={label}
        isLabelHidden={isLabelHidden}
        options={relationshipOptions}
        value={item.relationship}
        onChange={relationship => updateItem({...item, relationship}, 'relationship')}
        status={status}
        statusVariant={statusVariant}
        isDisabled={isDisabled}
      />
    ),
  },
  {
    key: 'dateOfBirth',
    header: 'Date of birth',
    width: pixel(176),
    renderInput: ({item, label, isLabelHidden, status, statusVariant, isDisabled, updateItem}) => (
      <DateInput
        label={label}
        isLabelHidden={isLabelHidden}
        value={item.dateOfBirth}
        onChange={dateOfBirth => updateItem({...item, dateOfBirth}, 'dateOfBirth')}
        status={status}
        statusVariant={statusVariant}
        isDisabled={isDisabled}
      />
    ),
  },
] satisfies ListInputColumn<FamilyMember>[];

<ListInput
  label="Family member declaration"
  itemName="family member"
  value={members}
  onChange={setMembers}
  getItemKey={member => member.id}
  createItem={() => ({
    id: crypto.randomUUID(),
    fullName: '',
    relationship: '',
    dateOfBirth: undefined,
  })}
  columns={columns}
  isRequired
/>`,
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Controlled compact-record input with typed columns, tokenized non-blocking add/remove motion, optional reorder, and field/item/list validation.',
  propDescriptions: {
    label: 'Collection label and accessible name.',
    value: 'Controlled ordered records.',
    onChange: 'Emits next records plus add/update/remove metadata.',
    getItemKey: 'Required stable unique record identity.',
    createItem: 'Creates a new keyed record for Add.',
    columns:
      'Typed simple fields: key, header, optional proportional/pixel width, and renderInput. ListInput owns visible column labels; narrow records stack with repeated labels, stronger separation, and top-aligned row actions. Renderers forward status and statusVariant.',
    itemName: 'Singular noun for actions and announcements.',
    description: 'Supporting text below the label.',
    status: 'List-level InputStatus.',
    getItemStatus: 'Per-record InputStatus resolver.',
    getFieldStatus:
      'Per-field resolver; complete status plus tooltip variant are forwarded to the rendered input.',
    reorderable:
      "createReorderable object keyed by getItemKey: core List's reorder handle at each record's end (after Remove), revealed on hover/focus, shown on touch: hold then drag (touch), drag (mouse), activate for reorder mode then arrows (keys), with a hint showing the moves and Done; the record dims while a copy follows and a line marks the drop, the other records stay still; each move goes to the object's onReorder({key, to}); its isReorderable keeps a record in place; handles stay focusable but inert while disabled or loading.",
    isDisabled: 'Disables collection, actions, and rendered inputs.',
    isLoading: 'Marks busy and prevents changes.',
    maxItems: 'Makes Add unavailable at the limit.',
    isLabelHidden: 'Visually hides label only.',
    isOptional: 'Shows Optional; exclusive with isRequired.',
    isRequired:
      'Shows Required + accessible requirement; exclusive with isOptional.',
  },
  usage: {
    description:
      'Use for compact ordered records: fewer than 7 items and up to 3 simple consistent fields. Add/remove motion does not delay onChange or focus and becomes instant under reduced motion. Use Table or a dedicated flow for larger or complex data.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use stable keys and consistent columns.',
      },
      {
        guidance: true,
        description: 'Validate at field, item, or list scope as appropriate.',
      },
      {
        guidance: true,
        description:
          'Reorder through the handle; one onReorder call per drop or key move, and no onChange; focus stays on the handle.',
      },
      {
        guidance: true,
        description:
          'Keep add/remove motion non-blocking and instant under reduced motion.',
      },
      {
        guidance: false,
        description: 'Use for long datasets or complex/inconsistent records.',
      },
      {
        guidance: false,
        description:
          'Block removal to enforce a minimum; report a list error instead.',
      },
    ],
  },
};

export const docsZh = {
  "name": "ListInput",
  "displayName": "List Input",
  "usage": {
    "description": "ListInput 用于编辑一组紧凑、有序、字段一致的记录，内置添加和移除操作，并可选支持重新排序。在其列中渲染的标准 Astryx 控件会继承中等控件尺寸，以便输入与 Add、移除、重新排序和校验提示对齐；显式字段尺寸仍优先。指针激活会在指针按下导致失焦或校验改变布局之前测量 Add，然后通过从最近到最外层调整可用的垂直滚动容器，使其保持在那个视口位置。此修正作用于交互范围，并仅在单个动画帧内重新检查，不进行持续的滚动或尺寸观察。新增行以令牌化的 translate 动态效果进入；移除后，如果几何尺寸保持稳定，幸存行会动画到新位置。动态效果从不延迟 onChange、焦点交接或播报，而减少动态效果偏好和不支持的浏览器会使用即时变化。用于少于七条记录、每条记录最多三个简单字段的列表，例如宾客、旅客或标签选项。更大的集合请使用 Table；记录需要许多复杂或不一致字段时，请使用卡片或基于步骤的表单。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "使用稳定的记录键和一致的列，使焦点、校验和重新排序播报始终附着到正确的记录。"
      },
      {
        "guidance": true,
        "description": "将校验时机交由应用负责。当错误应在失焦后出现时，按稳定的条目和列键跟踪已触碰字段，同时允许提交或服务器错误立即显示。"
      },
      {
        "guidance": true,
        "description": "将校验放在最窄的有用层级：单个值用字段状态，记录级问题用条目状态，集合级要求用列表状态。"
      },
      {
        "guidance": true,
        "description": "从每个列渲染器转发 status 和 statusVariant 到所渲染的 Astryx 输入，使字段消息使用控件原生的无障碍工具提示模式。"
      },
      {
        "guidance": true,
        "description": "让记录通过手柄重新排序：拖动在释放时报告一次移动，重新排序模式下的每次按键移动立即报告一次，焦点保持在手柄上。"
      },
      {
        "guidance": true,
        "description": "让集合动态效果仅提供信息且不阻塞。新增的实时行平移到位；移除的行立即消失，而尺寸稳定的幸存行合拢间隙。onChange、焦点和播报无需等待，减少动态效果偏好保持即时。"
      },
      {
        "guidance": true,
        "description": "通过指针按下导致失焦或校验改变布局之前测量 Add，然后从最近的垂直滚动容器向外保持该视口位置，使重复的指针添加在空间上保持稳定。轻微的字段裁剪不应让 Add 离开指针；明显隐藏的聚焦字段仍优先。键盘激活遵循正常焦点流程。"
      },
      {
        "guidance": false,
        "description": "用于七条或更多记录，或每条记录超过三个简单字段；请改用 Table 或专用编辑流程。"
      },
      {
        "guidance": false,
        "description": "仅为了强制最小数量而阻止移除；允许该操作，并通过列表级校验说明由此产生的要求。"
      }
    ],
    "anatomy": [
      {
        "name": "标签和描述",
        "required": true,
        "description": "命名整个集合，并可选说明要添加什么记录。"
      },
      {
        "name": "首条记录的字段标签",
        "required": true,
        "description": "ListInput 渲染主色调的列标签，不带单独的表格装饰，并保持每个所渲染控件自身的标签在视觉上隐藏但语义上关联。在较宽宽度下，重复标签在视觉上隐藏；当字段在 640px 或更窄时堆叠，每条记录都会显示其字段标签。"
      },
      {
        "name": "记录字段",
        "required": true,
        "description": "由使用方渲染的输入，接收作用域记录状态、完整校验状态、原生工具提示状态变体和更新行为。响应式堆叠时，标签到输入的间距最小，字段间距更大，记录组使用 32px 间隔，使每个对象在视觉上保持区分。"
      },
      {
        "name": "移除操作",
        "required": true,
        "description": "立即移除其记录，将焦点移动到可预测的相邻控件，并在支持时将幸存行动画到新位置。记录被悬停或包含键盘焦点时显示，在触摸屏上保持可见；静止时透明，但保留其列和 Tab 顺序中的位置，因此字段永不移动。在堆叠布局中，它与记录顶部的第一个字段旁边对齐。"
      },
      {
        "name": "重新排序手柄",
        "required": false,
        "description": "核心 List 的重新排序手柄，位于记录末尾 Remove 之后、Remove 的单元格中，带有命名记录及其位置的无障碍标签，且没有悬停工具提示。当主指针为粗指针时，其目标至少增大到 44 x 44 px。记录被悬停或包含键盘焦点时显示，在触摸屏上保持可见；静止时透明但保留在 Tab 顺序中。在堆叠布局中，它位于记录顶部、Remove 旁边。手指按住片刻后拖动；鼠标立即拖动；激活它（Space 或 Enter）会开启重新排序模式，其中 Arrow Up 和 Arrow Down 将记录移动一个位置，Escape 结束模式。"
      },
      {
        "name": "重新排序模式提示",
        "required": false,
        "description": "当记录处于重新排序模式时，核心 List 锚定到其手柄的提示会将移动操作和 Done 显示为按钮，因此仅靠点击即可重新排序。每个按钮执行其按键的功能，并将焦点留在手柄上。"
      },
      {
        "name": "空状态",
        "required": false,
        "description": "当没有记录时，居中的紧凑 EmptyState 会命名空集合，并引导用户使用 Add 操作。"
      },
      {
        "name": "添加操作",
        "required": true,
        "description": "填满记录字段宽度，使用 ListInput 字段和操作共享的继承中等控件尺寸，并立即追加由 createItem 创建的新记录，除非已达到 maxItems。指针激活时，可用的垂直滚动容器从最近到最外层偏移插入高度，使操作保持在指针下方；键盘激活保留正常焦点行为，新聚焦字段的可见性始终优先。支持的实时行使用令牌化 translate 入场动态效果，焦点移动到其第一个字段，而不等待动画。"
      },
      {
        "name": "校验消息",
        "required": false,
        "description": "说明字段级、条目级或列表级的错误、警告和成功状态。字段消息使用每个输入的原生工具提示状态提示，且不改变行高。条目消息与记录字段对齐，而不会延伸到移除控件下方。"
      }
    ]
  },
  "propDescriptions": {
    "label": "命名集合的可见标签。它也为完整输入提供无障碍名称。",
    "value": "当前有序记录。ListInput 是受控的，永远不会修改此数组或其记录。",
    "onChange": "添加、更新或移除操作后以下一个数组调用。change 参数标识操作和受影响的记录。移动操作改为发送到 reorderable 对象。",
    "getItemKey": "为每条记录返回稳定、唯一的键。稳定标识在记录移动时保留焦点和播报。",
    "createItem": "创建由内置添加操作插入的初始记录。返回一个已分配稳定键的新记录。",
    "columns": "为每条记录显示的一致简单字段。使用 @astryxdesign/core/Table 中的 proportional() 或 pixel() 配合每列宽度来调整宽度分布。ListInput 拥有可见的主色调列标签，而渲染器标签仍对辅助技术语义可用。在 640px 或更窄时，字段堆叠，每条记录显示其字段标签，记录组使用 32px 垂直间隔，行操作与第一个字段旁边对齐。渲染器接收 isLabelHidden、完整的限定校验状态、statusVariant 和 updateItem。",
    "itemName": "用于内置操作标签和实时播报的单数名词，例如 \"Add guest\" 中的 \"guest\"。",
    "description": "显示在集合标签与其记录之间的支持文本。",
    "status": "为整个集合显示的列表级校验状态。错误会将集合标记为无效，并将其消息与输入关联。",
    "getItemStatus": "返回完整记录的校验状态，例如原本有效的字段之间的无效组合。",
    "getFieldStatus": "返回单个字段的校验状态。渲染器接收完整状态以及 statusVariant=\"tooltip\"，并应同时转发到其 Astryx 输入，使原生状态提示负责样式、描述、键盘访问和工具提示行为，且不改变行高。",
    "reorderable": "使记录可重新排序：传入 createReorderable 创建的对象，以 getItemKey 为键。每条记录末尾都有核心 List 的重新排序手柄，位于 Remove 之后，就像 UIKit 的重新排序控件位于编辑行末尾一样。记录被悬停或持有键盘焦点时手柄出现，并在触摸屏上保持可见。在触摸屏上，按住手柄片刻，然后拖动：记录留在原位并变暗，其副本跟随手指，一条强调线标记它将落到的位置；其他记录保持不动，列表在接近边缘时自动滚动，释放后记录重新排列。在手柄上轻扫会滚动，双指捏合会缩放页面。鼠标会以相同方式立即拖动，记录无动态效果地就位。激活手柄（轻点、点击、Space 或 Enter）会为其记录开启重新排序模式：线条标记记录的位置，每次 Arrow Up 或 Arrow Down 将其移动一个位置，提示将移动操作和 Done 显示为按钮，Escape 或 Done 结束模式并保留移动结果。对象的 isReorderable(key) 说明哪些记录可移动：被其拒绝的记录没有手柄。每次移动都会发送到对象的 onReorder({key, to})，其中 to 是移动后记录在 value 中的索引。在禁用或加载中的列表里，手柄仍可聚焦但不移动任何内容。不传入时，记录保持其顺序。",
    "isDisabled": "禁用集合及所有内置操作。禁用状态也会传给每个列渲染器。",
    "isLoading": "将集合标记为忙碌，并在工作待处理时阻止更改。加载状态也会传给每个列渲染器。",
    "maxItems": "可添加的最大记录数。值达到此限制后，内置添加操作不可用。",
    "isLabelHidden": "在视觉上隐藏集合标签，同时保持辅助技术可用。",
    "isOptional": "在集合标签旁显示可选指示器。与 isRequired 互斥。",
    "isRequired": "在集合标签旁显示必填指示器，并向辅助技术暴露该要求。与 isOptional 互斥。"
  }
};
