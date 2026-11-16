# 面向贡献者的 API 约定

在评审前使用本指南来塑造公开组件 API。本页面是实用的投射。它不创建策略。如果它与当前所有者记录冲突，请遵循所有者记录并修正本指南。

本仓库指南是维护中的贡献者参考。公开 wiki 可以提供概述和理由，但它应链接到这里，而不是保留这些约定的第二份副本。

## 从所有者开始

仅使用 front matter 中声明 `authority: current` 的记录。当有链接或容易找到时，先阅读最窄的所有者。人类贡献者无需理解或编辑规范系统即可贡献；评审者和维护者负责路由新决策并记录最终裁决。

1. 组件的 `<Name>.spec.md`（当其存在于 [`docs/specs/components/`](../specs/components/) 下的文件夹中时）拥有组件行为。
2. [`docs/families/`](../families/) 下的当前契约拥有同级组件共享的行为。
3. 当前架构和已接受的系统决策拥有跨组件规则。从[公开组件 API 架构](../architecture/public-component-api.md)、[知识契约](../architecture/knowledge-contracts.md)和 [AST-002：公共 API 准入与操作形状](../specs/AST-002/spec.md)开始。

`owners` 字段命名谁可以解决缺失的决策。组件源码及其公开 `index.ts` 拥有已发布的 API。组件的 `.doc.mjs` 拥有确切的消费方语法和参考资料。组件规范拥有本地语义 API 含义和保证，包括它明确共同拥有的公开 hook 或工具。

wiki 提供更广泛的背景：[API Conventions](https://github.com/meta/astryx/wiki/API-Conventions) 和 [API Arbitration](https://github.com/meta/astryx/wiki/API-Arbitration)。不要将这些页面的详细决策复制到提案中。链接当前所有者。

## 将语义契约与语法参考分开

每个面向公开的 API 新增或语义变更都更新其规范所属的组件、家族、架构或系统记录。仅当组件规范拥有变更的组件本地语义或明确共同拥有公开 hook 或工具时，才更新组件规范。所有者记录描述调用者的含义、可观察内容和可依赖内容；`.doc.mjs` 仍是签名、prop/参考表和消费方用法的权威。不要将语义契约变成第二个语法目录。

组件规范继承其当前家族契约中的每条适用规则。只记录组件本地概念、新增内容和显式例外。将例外链接到其批准决策，而不是复制或重写家族规则。

当所有权明确时，组件规范可以共同拥有同址的公开 hook 或工具。其本地语义契约涵盖：

- 输入和选项，包括含义、默认值、无效值和不支持的组合；
- 输出和操作，包括可观察结果和保证；以及
- 相关时的副作用、身份、生命周期、资源所有权和清理。

对于组件规范不拥有的任何公开表面，链接到不同的规范所有者。

## 一次命名一个概念

| 表面             | 约定                                    | 示例                          |
| ---------------- | --------------------------------------- | ----------------------------- |
| 组件             | 无前缀 PascalCase                       | `Button`、`TextInput`         |
| Props 类型       | `<Component>Props`                      | `ButtonProps`                 |
| 公开 hook        | `use<Name>`                             | `usePopover`                  |
| 布尔状态         | `is<Name>`                              | `isDisabled`                  |
| 布尔能力         | `has<Name>`                             | `hasClear`                    |
| 非受控布尔默认值 | `defaultIs<Name>` 或 `defaultHas<Name>` | `defaultIsOpen`               |
| 同步回调         | `on<Verb>`                              | `onChange`                    |
| 消歧回调         | `on<Verb><Scope>`                       | `onSidebarCollapsedChange`    |
| 转换 Action      | `<verb>Action`                          | `changeAction`、`clickAction` |
| 逻辑方向         | `start` 或 `end`                        | `startIcon`、`paddingEnd`     |

仅当动词可能指代多个部分时才使用回调作用域。仅对原样传递的原生属性使用 `html` 前缀，例如 `htmlName`。当组件拥有该概念时，保留更清晰的语义名称。

字符串值使用 `camelCase`。公开输入在其完整值域和每种接受的输入形状中都有一个稳定的语义职责。其名称和类型披露调用方拥有的含义。

当多个视觉细节构成一个连贯的命名结果时，一个语义输入可以派生多个视觉细节。例如，语义 `status` 或 `variant` 可以同时拥有色调和标志物。这不是重载输入。

当属性的值或输入形状改变其控制的轴，或当消费方需要实现知识才能预测其控制哪些轴时，拒绝该属性。如果两个轴独立归调用方所有，用单独的输入表示它们并防止冲突组合。如果系统拥有它们的协调，暴露语义概念并派生细节，而不是按像 `color` 这样的单一机制命名输入。

并行输入不得创建隐藏的条件优先级。只有当覆盖项的名称、类型和在每种组合下的行为形成显式连贯契约，并在 [FR15](../specs/AST-002/spec.md#requirements) 下防止无效或冲突状态时，覆盖才有效。

## 按结果命名公开模块和工具函数

从函数的主要调用方可观察结果和副作用中选择动词。区分构造、检查、查找、转换、注册和保证状态。不要按一个内部步骤命名公开函数。每个公开能力保持一个可调用角色。

本节涵盖形成模块或工具 API 的导出独立函数。它不重新解释组件名称、回调 `on<Verb>` 名称或转换 Action 名称。CLI 命令动词及其编程命令对应物在 [CLI 表面架构](../architecture/cli-surface.md) 和 CLI 约定中拥有单独的所有权。

全仓库导出审计支持这些角色：

| 动词                  | 公开模块或工具角色                                              | 边界                                                  |
| --------------------- | --------------------------------------------------------------- | ----------------------------------------------------- |
| `define*`             | 构造或规范化并返回受支持消费方使用的持久类型化值。              | 校验可以是前置条件；仅检查或不变身份不是定义。        |
| `validate*`、`check*` | 检查输入并返回结构化结果。                                      | 说明哪些失败被返回、哪些条件抛出。                    |
| `create*`             | 构造或初始化调用方使用的运行时值、状态对象、源、配置或视图。    | 结果可以规范化；仅检查不是创建。                      |
| `build*`              | 从部件组装复合配置或产物。                                      | 此行涵盖模块工具，不是 CLI 命令命名。                 |
| `generate*`           | 从提供的输入派生新的聚合或序列化输出。                          | 命名生成的结果；不要隐藏无关的变异。                  |
| `resolve*`            | 从输入、选项、上下文或注册表中选择并返回具体值。                | 记录回退和缺失值行为。                                |
| `parse*`              | 将外部或字符串表示转换为类型化或结构化表示。                    | 公开契约说明无效输入是返回 `null`、返回结果还是抛出。 |
| `format*`             | 序列化值或生成显示文本，不改变源值。                            | 当区域、模式或回退行为影响输出时，将其包含在内。      |
| `get*`                | 读取或投射请求的值，不改变其源。                                | 当前 API 包括注册表查找和确定性投射；不要暗示持久化。 |
| `is*`、`has*`         | 返回布尔谓词或类型守卫。                                        | 当调用方需要原因、警告或多个发现时，使用结构化检查。  |
| `register*`           | 添加或替换共享注册表状态。                                      | 注册是显式副作用。                                    |
| `ensure*`             | 在所需状态缺失时幂等地建立它。                                  | 名称必须披露函数可能创建或变异的状态或资源。          |
| `use*`                | 暴露可读取上下文/状态并拥有 React 生命周期或效果的 React hook。 | 遵循 Hooks 规则；非 hook 工具不得使用 `use*`。        |
| `reset*`              | 清除或将共享状态恢复到其文档化基线。                            | 受影响的状态和预期消费方范围必须明确。                |
| `expand*`             | 将紧凑配置或表示转换为其更完整的派生形式。                      | 扩展不暗示持久化。                                    |
| `merge*`              | 将兼容输入组合为一个返回值或组合行为。                          | 说明优先级和冲突行为。                                |

如果构造、校验、注册或其他能力是公开的，通过各自的可调用函数暴露每个能力。构造函数可以复用同一个内部校验原语，但它仍返回构造的值，且不吸收单独公开的角色。

这些是当前仓库证据支持的角色，不是先选一个熟悉的动词再让实现后来适应的许可。检查导出的签名、实现、测试、消费方文档、受支持的调用点和发布历史。将文档化的例外限制在所属模块，而不是在全仓库范围弱化某个动词。

不要静默重命名已发布的名称不匹配。通过显式弃用和迁移保持兼容性，然后仅在批准的兼容性边界移除或更改旧契约。

## 回调与 Action

回调同步报告事件。Action 启动感知转换的工作。Action 名称绝不以 `on` 开头。

`changeAction` 不替换 `onChange`。组件可以支持其中之一或两者。当两者都存在时，先运行回调。除非组件的公开事件契约允许消费方取消，随后运行 Action。

```tsx
interface SearchInputProps {
  value: string;
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  changeAction?: (
    value: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void | Promise<void>;
}

const [, startTransition] = React.useTransition();

function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  const nextValue = event.currentTarget.value;
  onChange?.(nextValue, event);

  if (changeAction && !event.defaultPrevented) {
    startTransition(() => changeAction(nextValue, event));
  }
}
```

不要将 Action 命名为 `onChangeAction`。不要按类别要求每个输入回调。必填性遵循组件的可用状态、控制和无障碍契约。

当组件和消费方都处理同一个 React 事件时，有意组合处理程序。仅当公开契约承诺 `preventDefault()` 取消内置行为时，才将消费方放在前面。

```tsx
const handleClick = composeEventHandlers(onClickProp, selectItem);
```

如果未承诺取消，保留组件的必需行为，并在其契约和测试中说明该顺序。

## DOM props、样式和 ref

仅当组件拥有稳定的 DOM 元素时，才扩展 [`BaseProps`](../../packages/core/src/BaseProps.ts)。仅协调子元素或返回多个无关根的组件应暴露它实际拥有的较小契约。

对于拥有 DOM 的组件：

- 用契约元素为 `BaseProps` 类型化，并接受 `ref` 作为 React 19 prop；
- 使用 `Omit` 移除与组件概念冲突的原生名称；
- 将中性 `data-*`、ARIA、DOM 和事件 props 转发到契约元素；
- 防止组件拥有的 role、无障碍和行为 props 被覆盖；以及
- 合并 `xstyle`、`className` 和 `style`，而不是只选一个。

```tsx
export interface PanelProps extends BaseProps<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}

export function Panel({
  children,
  ref,
  xstyle,
  className,
  style,
  ...rest
}: PanelProps) {
  return (
    <div
      ref={ref}
      {...mergeProps(
        themeProps('panel'),
        stylex.props(styles.root, xstyle),
        className,
        style,
      )}
      {...rest}>
      {children}
    </div>
  );
}
```

在展开 `rest` 之前解构样式和自有处理程序。当双方需要同一事件时使用 `composeEventHandlers`。在 `rest` 之后设置组件拥有的契约 props，以便展开顺序无法改变语义。

## 开放视觉词汇表与封闭轴

[组件主题表面](../architecture/component-theming-surface.md#boundaries-and-invariants)仅当 prop 轴是视觉的，且不可用自定义值有一个安全、确定、独立于活动主题的基线时，才允许主题可扩展的 prop 轴。`Heading.type` 符合条件，因为必需的 `Heading.level` 提供了该基线。`Icon.size` 不符合：选择回退尺寸会静默改变几何、对齐或组合。

行为、结构、放置、方向性和状态机轴保持封闭。主题可以在封闭轴上重新定义现有值，但不能添加值。

被允许的主题可扩展词汇表在组件子路径 barrel 中使用公开的 `*Map` 接口。从其键派生 prop 类型。

```ts
// packages/core/src/Button/index.ts
export interface ButtonVariantMap {
  primary: true;
  secondary: true;
  ghost: true;
  destructive: true;
}

// packages/core/src/Button/Button.tsx
export type ButtonVariant = keyof ButtonVariantMap;
```

主题可以通过 `@astryxdesign/core/Button` 的模块扩充添加被允许的视觉值。组件契约或治理系统规范和聚焦测试必须展示没有匹配主题规则活动时的回退；共享结构守卫只检查公开 map、`themeProps()` 反射和主题元数据。

不要假设嵌套的 `theme.components.button.variants` 形状。对于组件目标和样式键覆盖，请遵循当前的[主题编写契约](../architecture/theme-authoring-contract.md)。

## 插槽与组合

当内容或子行为有自己的契约时，优先使用组合。命名插槽接受完整的子元素并直接渲染它。

```tsx
<AppShell
  topNav={<TopNav items={items} />}
  sideNav={<SideNav sections={sections} />}
/>
```

不要将 `SideNav` 状态或回调提升到 `AppShell`。将它们保留在拥有它们的子元素上。仅当父级必须提供条目数据或上下文时，才使用渲染函数。对有限独立轴使用 prop，而不是一次性产品配方。

高级组合对新 prop 的要求高于工具组件。在添加 prop 之前，检查子元素、插槽、主题目标、样式逃生舱、父布局或现有上下文是否已经拥有该区分。

## API 提案门槛

在识别当前权威后分类变更。[知识契约](../architecture/knowledge-contracts.md#change-coupling)拥有五个结果及其处置：`preserves`、`settled`、`violates`、`novel-human` 和 `out-of-scope`。本指南应用这些结果；它不重新定义它们。

缺陷修复只有在恢复当前契约或标准，且不添加超出该权威的公开 API 或公开行为时，才是 `preserves`。为损坏状态和代表性未变状态提供聚焦回归证据。任何额外的公开增量都通过知识契约独立分类：现有当前权威可以裁定它，只有缺失权威时才使用未决所有者路径。缺陷修复标签绝不绕过 API 设计。

对于声称的 API 新增或语义行为变更，评审有四个阶段：

1. **盘点公开增量。** 说明确切的语义前 → 后，按范围识别规范所有者，并包含从受支持包路径可达的支持声明、类型、上下文字段、hook 返回值、默认值和可观察行为。
2. **应用 API 准入。** 拒绝组件可以派生的公开选择、其受控轴随值或输入形状变化的公开输入、并行输入之间的隐藏条件优先级，或同一语义操作的并行公开/包内部操作。当连贯的语义 status 或 variant 的公开含义保持稳定并披露时，它可以派生多个视觉细节。在一个模块内，保持一个规范操作名称；另一个需要真正不同的调用方拥有意图和契约。
3. **应用当前权威。** 遵循知识契约拥有的结果和处置。草稿是有用的评审上下文，但不是策略，不能通过门槛。确切的头部所有者讨论或批准是决策证据；已接受的决策必须在实现接受前作为 `current` 提交到规范记录。
4. **评审实现正确性。** 一旦当前权威裁定公开契约，验证确切的实现头部、回归证据、兼容性、迁移、文档和代表性未变状态。

机械清单和回执可以盘点增量并证明读取了哪个当前记录。它们只是证据；它们不选择语义或分配拉取请求处置。

## API 提案检查清单

每个面向公开的 API 拉取请求都有此最低可读摘要：

- **所有者：** 链接规范拥有记录并说明其权威。仅对组件本地语义使用组件规范；当家族、架构或系统记录拥有变更的语义时，使用该记录。如果所有者在本拉取请求之前是草稿或缺失，请命名预期所有者。
- **语义前 → 后：** 用一句话说明调用方可见的含义和保证。
- **分类：** 命名知识契约定义的 `preserves`、`settled`、`violates`、`novel-human` 或 `out-of-scope`。
- **代表性语法：** 仅当公开语法变化时包含它；组件 `.doc.mjs` 仍是完整的语法/参考权威。

在请求评审之前：

- **证明调用方所有权。** 展示两个其他方面相同但需要不同结果的用例，说明调用方为何知道区别，以及组件为何无法派生它。这是 [AST-002](../specs/AST-002/spec.md#dec-1--public-props-require-a-non-derivable-caller-distinction) 中的准入规则。
- **保持每个输入的职责稳定。** 遍历完整值域、每种接受的输入形状以及与并行输入的每种组合。名称和类型必须披露一个调用方拥有的含义。语义 status 或 variant 可以派生一组连贯的视觉细节；拒绝切换受控轴的值或形状，并拒绝隐藏的条件优先级。分别表示独立归调用方所有的轴，并在 FR15 下防止无效或冲突组合。
- **更新语义所有者。** 更新或添加规范拥有记录。组件本地概念属于组件规范；共享家族、架构或系统概念属于该所有者。记录输入、选项、默认值、无效值和不支持的组合、输出、操作、保证以及相关的生命周期或资源义务，不复制继承的规则。
- **防止损坏状态。** 在实践中使静态可知的无效组合不可表示。否则记录校验或警告，或安全回退；不要静默渲染损坏状态或阻止合法组合。
- **检查操作唯一性。** 在一个模块内，对同一语义操作的公开和包内部形式使用同一规范名称。内部形式可以接受更宽的选项；另一个操作需要不同的调用方拥有意图。
- **检查共享语法。** 覆盖名称、可选性、回调/Action 顺序、取消、ref 目标、DOM 传递以及每个字符串轴是开放还是封闭。开放轴必须在其没有匹配主题规则活动时命名并测试其安全、主题无关的回退。
- **保护兼容性。** 说明默认值和可观察行为。为已发布的破坏性变更包含迁移。
- **一起交付 API 证据。** 当消费方用法或有文档的承诺变化时，在同一个拉取请求中更新消费方文档、公开导出、聚焦的运行时和类型测试以及代表性集成覆盖。

如果应用当前约定后仍有两三种可行形状，使用 [API Arbitration](https://github.com/meta/astryx/wiki/API-Arbitration) 流程。在相关用例中比较现实的消费方代码，并将证据放入拉取请求。请所有者决定。维护者或评审代理将最终裁决记录在所属规范中。将研究过程排除在架构记录之外。

## 常见评审异味

- 公开 API 变更在其规范拥有记录中没有语义增量，因此评审者必须从实现或语法推断含义。
- 一个模块为同一语义操作提供单独的公开和包内部操作名称，因为内部调用方需要更宽的选项。
- 公开输入对某些值或形状控制一个轴，对其他值控制额外轴，因此消费方必须了解实现分支才能预测输出。
- 并行输入创建条件覆盖，但没有针对每种组合的显式契约或冲突状态的防止。
- prop 暴露了组件可以从状态、内容、布局、上下文或平台派生的值。
- 高级组件累积调优 props 或重复子元素的状态。
- 等效概念使用不同名称，例如用 `onChangeAction` 而不是 `changeAction`。
- Action 抑制其回调，或处理程序顺序意外移除了承诺的消费方取消路径。
- 回调是必需的，仅仅因为假设所有输入都需要它。
- 符合条件的主题可扩展视觉值是封闭联合；轴在没有安全、主题无关回退的情况下开放；或行为、结构、放置、方向性或状态机轴被开放给扩充。
- `BaseProps` 应用于没有单一稳定契约元素的组件，或接受的 DOM props 从未到达该元素。
- `xstyle`、`className`、`style`、ref 或事件处理程序被展开顺序丢弃或覆盖。
- 父级包装插槽内容或镜像属于被插槽子元素的 props。
- prop 深入子组件的解剖结构，组合渲染了解剖结构未描述的插槽，或渲染的内容插槽不是解剖结构中命名的部件（[INV18](../architecture/public-component-api.md#boundaries-and-invariants)）。
- 具有大量资源成本的功能为每个调用方加载，没有插件路径或命名功能 prop（INV19）。
- 布尔 prop 只交换视觉，而 variant 更合适（INV20）。
- 新 API 与现有 API 共享工作，而现有 API 未在其 favor 中弃用（INV21）。
- 提案发明嵌套的 `theme.components.button.variants` 层，而不是使用当前组件目标和样式键契约。
- 绿色文档解析器被视为完整的 API 证明。解析和选定的漂移检查不能证明导出可达性、运行时行为、ref 目标、传递、处理程序组合、兼容性或完整文档覆盖。

当一条当前记录与另一条当前记录冲突时，停止。不要按新旧或具体程度选择。将冲突路由到[知识契约](../architecture/knowledge-contracts.md#when-current-records-disagree)中描述的规范所有者。
