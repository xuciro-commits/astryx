---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:icon-resolution-and-component-slots
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-30
owners: [cixzhang, imdreamrunner]
applies_to:
  [
    packages/core/src/Icon/,
    packages/core/src/theme/defineTheme.ts,
    packages/core/src/Selector/,
    packages/cli/,
  ]
verified_by:
  [
    packages/core/src/Icon/globalIconRegistry.test.tsx,
    packages/core/src/theme/defineTheme.test.ts,
    packages/core/src/Selector/Selector.test.tsx,
    packages/cli/api/theme/build/build.test.mjs,
  ]
deciding_specs:
  [
    spec:AST-087/DEC-2,
    spec:AST-087/DEC-4,
    spec:AST-087/DEC-5,
    spec:AST-087/DEC-6,
    spec:AST-087/DEC-10,
  ]
---

# Icon resolution and component slots

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "component-slots": [
      "INV1",
      "INV2",
      "INV3",
      "INV6",
      "INV7",
      "INV10",
      "INV11",
      "INV12"
    ]
  }
}
```

本记录定义了共享图标与组件拥有的图标角色如何配合。它是已批准的目标架构。现有扩展键继续有效，直到单独的兼容性决定更改它们。

## Purpose

主题作者应当能够更改某个组件角色使用的图标，而不改变同一共享图标的每一处使用。

系统需要两个独立的选择：

1. 某个组件角色使用哪个共享图标名称；以及
2. 当前主题为该共享图标名称使用哪种图稿。

将这些选择保持分离，可避免把每个组件细节都变成新的全局图标名称。

## Current baseline

当前的 `main` 有一个共享的 `IconName` 注册表，也支持带命名空间的扩展键。某些组件拥有的图稿直接使用这些扩展键。本记录不会使该已发布行为失效，也不要求迁移它。

目标模型为未来的组件角色增加一条规则：新的语义组件槽位使用 `componentIcons`。每个 Core 槽位记录在拥有它的组件契约中，或记录在添加它的系统规范中（`spec:AST-032` FR2 针对 `chat-send-button-send`）。Selector 的选中选项标记由 `check` 指示器绘制，因此它不是组件图标槽位。已发布的扩展键保持受支持，直到单独的兼容性决定更改它们。本记录不决定任何现有组件的结果。

## System model

### Shared icon resolution

`IconName` 是共享语义图标名称的封闭集合，例如 `check`、`close` 和 `chevronDown`。现有扩展键与该集合共存。

通用解析器按以下顺序选择图稿：

1. 当前主题的 `icons[name]` 条目；
2. 进程范围的 `registerIcons()` 条目；以及
3. `defaultIcons` 中的匹配条目。

条目是 React 节点或 `{size, variant}` 的纯同步函数。空值静态条目会落到下一个来源。一旦选择了函数条目，其结果对该次解析就是最终的：空值结果不渲染任何字形，也绝不会落到下一个来源，因此图稿绝不会混合两个来源。`component:Icon` 提供解析后的尺寸，以及当前主题列出的变体或 `undefined`；主题提供的条目（包括继承的条目）仅当定义它的主题也列出该变体时才会收到变体。

本记录不改变通用解析器接受哪些共享键或扩展键。主题应用拥有如何选择当前主题。主题编写拥有 `icons` 如何规范化和继承。Icon 组件契约拥有其公共来源模式、渲染、尺寸、颜色和无障碍。

### Typed component-owned slots

组件图标槽位命名一个组件内部的稳定用途。它不命名图稿。

公共 `@astryxdesign/core/Icon` 子路径拥有一个可扩充的映射：

```ts
// Public @astryxdesign/core/Icon module
export interface ComponentIconSlotMap {}

export type ComponentIconSlotName = keyof ComponentIconSlotMap & string;

export type ComponentIconRequest = Readonly<{
  icon?: IconName | null;
  variant?: IconVariant;
  size?: 'xsm' | 'sm' | 'md' | 'lg';
}>;

export type ComponentIconValue<State> =
  | IconName
  | null
  | ComponentIconRequest
  | ((state: Readonly<State>) => ComponentIconRequest | null | undefined);

export type ComponentIconMap = {
  [Slot in ComponentIconSlotName]?: ComponentIconSlotMap[Slot] extends true
    ? IconName | null | ComponentIconRequest
    : ComponentIconValue<ComponentIconSlotMap[Slot]>;
};
```

对于无状态槽位，槽位的映射值是 `true`，或者是一个列出该槽位只读状态字段的对象类型。上面的类型形状是概念性的；公共名称和精确的映射类型属于实现。

接口必须声明在消费者扩充的公共模块中。仅在实现文件中声明并从公共子路径重新导出的接口不会拓宽消费者使用的类型。运行时解析器代码从公共所有者导入该映射。

外部组件包通过扩充同一个公共 `@astryxdesign/core/Icon` 模块来添加其槽位：

```ts
declare module '@astryxdesign/core/Icon' {
  interface ComponentIconSlotMap {
    'example-panel-dismiss': true;
    'example-nav-item-leading': {selected: boolean; disabled: boolean};
  }
}
```

Core 槽位以相同方式在公共模块中声明。槽位使用 `<component-kebab>-<semantic-role>`。角色描述图标存在的原因，而不是其当前形状或方向。

`defineTheme({componentIcons})` 将组件槽位映射到共享的 `IconName`、`null`、静态部分请求，或者对于有状态槽位，映射到该槽位状态的纯同步函数，该函数返回部分请求。它与 `defineTheme({icons})` 分开：

```tsx
defineTheme({
  name: 'brand',
  iconVariants: ['outline', 'filled'],
  componentIcons: {
    'example-panel-dismiss': 'close',
    'example-nav-item-leading': ({selected}) => ({
      variant: selected ? 'filled' : 'outline',
    }),
  },
  icons: {
    close: <BrandCloseIcon />,
  },
});
```

槽位映射说明某个组件角色使用哪种共享含义、变体和尺寸。图标映射说明用哪种图稿绘制该共享含义。

### Component slot precedence

组件按以下顺序解析承载图标的角色：

1. 消费者提供的实例 prop，当组件暴露该 prop 时；
2. 最近的当前主题的 `componentIcons[slot]` 条目；以及
3. 组件声明的回退 `IconName | null`。

`undefined` 表示“使用下一个回退”。`null` 表示“不渲染图标”。映射得到的 `IconName` 继续经过共享图标解析。

请求逐字段应用。请求的 `icon` 替换回退名称，而 `icon: null` 或 `null` 结果不渲染图标。缺少 `icon` 则保留回退名称，缺少 `variant` 则保留组件原本会请求的变体（或不变体），缺少 `size` 则保留组件自身的尺寸。`undefined` 结果不改变任何内容。请求的 `variant` 和 `size` 应用于最终渲染的名称。未知的 `icon`、主题未列出的变体或不受支持的 `size` 被视为缺失，并给出一次仅开发环境的警告。

共享解析器模块一致地应用此顺序：

- 一个函数将槽位、其状态和其回退解析为共享 `IconName | null`、变体和尺寸的请求；
- 一个函数通过共享图标解析将该请求解析为图稿；以及
- 客户端 hook 从当前主题解析相同的槽位、状态和回退。

组件（包括扩充 `ComponentIconSlotMap` 的包）将其槽位状态传递给这些解析器，而不是直接读取 `componentIcons`。解析器是主题槽位函数的唯一调用者。解析器不拥有组件的槽位名称、状态含义、回退或渲染规则。

### Indicators stay separate

组件通过指示器绘制的有状态控件标记（例如选择勾选、单选按钮或复选框方框）不是组件图标槽位。指示器接收其 family 的状态，主题通过 `defineTheme({indicators})` 按名称替换它。同一个视觉永远不能既是指示器又是 `componentIcons` 槽位。

本记录定义当前主题 `componentIcons` 映射的含义。主题编写架构拥有 `DefineThemeInput`、规范化和 `extends`。主题编译拥有在构建输出中保留规范化映射。

## Known deviations

- **NumberInput 步进器图标。** 当前的 `NumberInput` 通过通用扩展键而不是 `componentIcons` 解析其步进器。该已发布行为保持受支持，并且不构成新组件槽位的先例。
- **所有者：** 一旦该组件契约存在，即由 `component:NumberInput` 拥有。
- **退出条件：** 单独审查的迁移在保留已发布调用方和主题覆盖的前提下使用组件槽位模型，或遵循明确批准的破坏性变更路径。

本记录不选择迁移设计或时间线。

## Boundaries and invariants

- **INV1 — 共享名称和组件角色是分离的。** `IconName` 拥有共享语义含义。`ComponentIconSlotName` 拥有组件特定的用途。
- **INV2 — 槽位是类型化且由所有者声明的。** 每个 Core 槽位都列在 `ComponentIconSlotMap` 中。外部包扩充该映射，而不是添加无主的 Core 字符串。
- **INV3 — 槽位映射到共享含义。** `componentIcons` 值是 `IconName`、`null`、`icon`、`variant` 和 `size` 的静态部分请求，或者对于有状态槽位，是该槽位声明状态的纯同步函数，该函数返回此类请求。它绝不是具体图稿。
- **INV4 — Null 抑制槽位。** `componentIcons[slot] = null` 有意不渲染图标。缺失的映射使用组件回退。
- **INV5 — 每个槽位都声明回退。** 拥有它的组件声明一个 `IconName | null`；主题无需重复默认值。
- **INV6 — 解析顺序是稳定的。** 实例内容优先于主题槽位映射。槽位映射在共享注册表选择图稿之前选择共享名称。
- **INV7 — 组件槽位不扩大共享名称集合。** 添加槽位不会拓宽 `IconName`。
- **INV8 — 组件行为留在组件中。** 状态含义、变换、放置、颜色、无障碍和控件几何仍由渲染该槽位的组件拥有。主题槽位请求可以选择该槽位的 Icon 尺寸和变体；组件自身的尺寸和变体是回退。槽位尺寸绝不改变控件的高度、触摸目标或外部尺寸。
- **INV9 — 主题生命周期保持单一所有权。** 本记录定义 `componentIcons` 条目的含义。主题编写拥有其规范化和继承；主题应用拥有当前主题的选择。
- **INV10 — 现有键共存。** 已发布的槽位和扩展键保持受支持，直到单独的兼容性决定更改它们。新的 Core 槽位使用 `ComponentIconSlotMap` 和 `componentIcons`。
- **INV11 — 选定的函数负责应答。** 一旦选择了函数条目或槽位函数，其结果对该次解析就是最终的。公共主题读取永远不会调用或返回槽位函数。
- **INV12 — 指示器和槽位不重叠。** 由指示器绘制的视觉通过 `indicators` 替换；它不会同时是 `componentIcons` 槽位。

本记录不拥有：

- `DefineThemeInput`、主题规范化或 `extends`；这些属于主题编写架构；
- 当前主题的选择；这属于主题应用架构；
- Icon 的公共来源模式、渲染、视觉解剖、尺寸、颜色或可访问名称 API；这些属于 Icon 组件契约；
- 通过公共组件 prop 传递的消费者编写的图标内容；
- 图标绘制或状态的 CSS 主题化目标；
- 有状态指示器渲染器的替换；或
- 组件所选字形的视觉设计。

## Component-local documentation

架构记录拥有共享规则。组件所有者记录每个槽位的局部文档。

组件的 `.doc.mjs` 主题化条目记录：

- 槽位名称；
- 其回退 `IconName | null`；
- 对于有状态槽位，其状态字段；以及
- 对角色以及 `null` 是否可以隐藏它的简短描述。

组件规范记录主题作者必须理解的行为，例如依赖状态的渲染、放置、无障碍所有权和兼容性要求。它不复制通用解析算法。

消费者图标 prop 仍作为组件 API 记录。除非组件还承诺一个独立的稳定主题级角色，否则它们不会列为 `componentIcons` 槽位。

## Change coupling

- 添加 Core 槽位会更新公共 `@astryxdesign/core/Icon` 模块中的 `ComponentIconSlotMap`、其拥有的组件源代码、局部文档、解析器测试和组件测试。
- 添加包拥有的槽位会从该包扩充公共 `@astryxdesign/core/Icon` 模块，并添加相同的所有者局部文档和测试。
- 更改槽位回退或优先级是兼容性变更，因为主题可能省略该槽位并依赖旧结果。
- 添加、重命名、移除或重新解释已发布的槽位状态字段是兼容性变更，因为主题解析器会读取它。
- 重命名、移除或重新解释已发布的槽位或扩展键时，需要明确的兼容性计划；当无法保留现有行为时，还需要允许的破坏性变更路径。
- 更改 `componentIcons` 编写形状、规范化或继承会更新主题编写记录及其测试。更改构建输出会更新主题编译记录及其一致性测试。
- 更改当前主题选择会更新主题应用记录及其测试。
- 更改 Icon 的公共来源模式或渲染会更新 Icon 组件契约及其测试。
- 直接向通用 Icon API 添加组件特定键需要架构审查；这不是添加组件槽位的默认方式。

## Owning code

- 公共 `@astryxdesign/core/Icon` 子路径拥有 `ComponentIconSlotMap` 以及消费者扩充的公共槽位类型。
- `packages/core/src/Icon/globalIconRegistry.tsx` 拥有共享图标解析和组件槽位解析，包括对主题槽位函数的唯一调用。
- `packages/core/src/Icon/useIcon.ts` 拥有共享名称和组件槽位的当前主题客户端解析。
- Icon 组件及其组件契约拥有公共来源模式、渲染、尺寸、颜色和无障碍。组件在将结果传递给 Icon 之前解析其语义槽位。
- `architecture:theme-authoring-contract` 拥有 `DefineThemeInput`、规范化主题数据和 `extends`，包括独立 `componentIcons` 映射的集成。
- `architecture:theme-application` 拥有当前主题的选择和查找。
- `architecture:theme-compilation` 拥有在构建输出中保留规范化主题数据。
- 每个组件拥有其槽位含义、回退、依赖状态的渲染、无障碍和消费者覆盖行为。
- CLI 和 docsite 工具公开所有者声明的槽位元数据，而不发明新的槽位语义。

## Deciding specs

本记录整合了现有的共享注册表行为和已批准的类型化组件槽位模型。`spec:AST-087` 的决定 2、4、5、6 和 10 添加了函数条目、静态和状态解析器槽位请求、指示器边界、最终函数结果，以及仅由槽位解析调用的槽位函数。

## Verification

| 不变量           | 证据                                                  | 失败信号                                               |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| INV1, INV3, INV6 | 注册表解析器测试和一个已渲染组件夹具                  | 组件槽位直接解析到具体图稿或跳过共享图标解析           |
| INV2, INV5       | 类型测试加上组件 `.doc.mjs` 元数据检查                | Core 槽位是无类型字符串或没有所有者/回退               |
| INV4             | 使用 `componentIcons[slot] = null` 的解析器和组件测试 | Null 映射落空并仍然渲染图标                            |
| INV7             | 共享名称类型和注册表快照测试                          | 添加组件槽位会拓宽 `IconName`                          |
| INV8             | 具有状态和槽位尺寸的代表性组件所有者测试              | 主题必须了解组件渲染细节，或槽位尺寸移动了控件几何     |
| INV9             | 主题编写、应用和编译所有者测试                        | 本记录发明了第二条规范化或当前主题路径                 |
| INV10            | 已发布键兼容性夹具和新槽位负向测试                    | 已发布的键在未有单独兼容性决定的情况下停止工作         |
| INV11            | 针对函数条目、槽位函数和读取的解析器测试              | 空值函数结果落到另一个来源，或读取返回函数             |
| INV12            | 槽位和指示器清单检查                                  | 同一个视觉既可作为指示器又可作为 `componentIcons` 槽位 |
| 文档             | 组件元数据和生成的 CLI/docsite 夹具                   | 可主题化的槽位无法连同其所有者、回退和用途被发现       |
