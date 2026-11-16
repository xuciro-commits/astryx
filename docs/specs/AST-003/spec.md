---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-003
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-30
phase: accepted
owners: [cixzhang, imdreamrunner]
affects_architecture:
  [
    architecture:layer-runtime,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
affects_families: [family:overlay-dismissal]
affects_contributing: []
affects_consumer_docs: []
---

# Layer coordination and global hosting system spec

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "layering": ["FR4", "FR10", "DEC-1", "DEC-2", "DEC-3", "DEC-5", "DEC-6"]
  }
}
```

## Intent

让每一处分层交互都关闭预期的所有者或交互分支，不会有瞬态表面挡住它，也不会有一次指针手势先关闭又立刻重新打开它。选定的应用级全局系统必须通过浏览器合法的原生托管，在原生模态对话框之上保持可见且可操作。

完整的锚定层契约还必须如实说明其平台依赖：原生 Popover API 加 CSS Anchor Positioning 提供完整行为；不受支持的浏览器获得可用的降级回退，而不是等价行为。

## Non-goals

- 让每一层都能通过每一个通道关闭。
- 取代组件自有的焦点、模态性、外部关闭策略、背景遮罩、滑动阈值、悬停时序、打开状态 API、动画或视觉处理。
- 为每个浮层提供全局或模态之上的模式。
- 用传统的定位与关闭 polyfill 取代原生 Popover 和 CSS Anchor Positioning。
- 仅仅为了暴露内部的 owner、branch 或 gesture 记录而改动公共 API。

## Requirements

### Interaction ownership and association

- **FR1 — 协调机制为交互角色建模。** 已注册的表面是主动关闭所有者、阻塞所有者或被动依赖者。纯视觉表面不会注册为交互所有者。
- **FR2 — 主动所有者可以关闭。** 主动所有者拥有任务或交互状态，并在所选通道参与时调用其组件自有的关闭行为。
- **FR3 — 阻塞所有者只消费而不关闭。** 阻塞所有者阻止通道到达其后面的所有者。必需的 Dialog 是代表性的 Escape/平台情形。
- **FR4 — 被动依赖者绝不遮挡所有者。** 未固定的 Tooltip 是被动的。它既不会赢得也不会阻止关闭；当与之关联的所有者或触发交互关闭时，它作为结果一并消失。被按下操作通过 `useTooltip` 的 `show()` 固定打开的 Tooltip（`component:Tooltip` FR9、FR12），如同按下 `component:InfoTip` 那样，是主动所有者：它先接收 Escape 并关闭，而它下方的所有者在该次按下期间保持打开（DEC-6）。
- **FR5 — 关联关系是显式的。** 每个主动或阻塞所有者都记录一个可选的父所有者和一个交互分支根。被动依赖者记录其关联的所有者或触发器，而不创建所有者节点或分支边界。

### Channel-specific arbitration

- **FR6 — Escape 和平台关闭只选择一个符合条件的所有者。** 一次性通道选择组件策略参与其中的、关联层级最高的主动或阻塞所有者。主动者关闭，阻塞者消费，被动和纯视觉表面被跳过。
- **FR7 — 外部交互解析分支。** 外部交互针对所有者表面、关联的触发器或调用者以及分支关系进行评估。它不复用视觉或注册上的最顶层顺序。
- **FR8 — 菜单级联作为一个分支关闭。** DropdownMenu 及其打开的 flyout 子菜单共享同一个分支根。该根之外的外部交互会关闭根以及每个已打开的子菜单。
- **FR9 — 嵌套的子分支可以独立关闭。** 一个独立的嵌套 Popover 会创建子分支。在父分支之内、子分支之外的交互只关闭该子分支；同时位于两者之外的交互则根据组件策略解析两个受影响的分支。
- **FR10 — 组件策略留在组件内。** 共享协调机制确定符合条件的所有者或受影响的分支。由所属组件或 family 决定该通道是关闭、阻塞还是放行。

### Same-interaction protection

- **FR11 — 指针关闭在关闭之前先认领该交互。** 每一个可能与关联触发器冲突的、由指针驱动的外部、轻度关闭、背景、触摸或滑动路径，都在可见性改变之前记录分支认领。
- **FR12 — 每条重新打开路径都遵守该认领。** 关联触发器、原生调用者、`show()` 以及切换路径都会拒绝同一次物理手势。后续的手势可以重新打开。
- **FR13 — 浏览器事件顺序无关紧要。** 无论原生关闭在 click 之前还是之后被观察到，认领都有效。时间戳窗口不能替代手势身份。
- **FR14 — 菜单悬停抑制曝光引发的悬停。** 当正在关闭的面板暴露出一个静止的触发器时，由此产生的合成 `mouseenter` 不会重新打开该分支。一次真正的离开以及之后的悬停可以再次打开它。

### Native hosting for selected global systems

- **FR15 — 全局准入是显式的。** 系统只有通过所有者批准的 `architecture:layer-runtime` 更新，才能获得模态之上的全局托管。普通的、与触发器或任务关联的浮层保持本地。
- **FR16 — Toast 采用全局托管。** ToastViewport 在当前原生模态之上保持可见且可操作。Toast 在层关闭中仍是被动的：Escape/平台仲裁会跳过它，而自动隐藏、显式控件或直接的 toast 滑动只会关闭该 toast。
- **FR17 — 在启动器模式下，CommandPalette 是全局主动所有者。** 常规 CommandPalette 使用更晚的原生模态宿主，并在先前的模态之上形成主动交互分支。`isInline` 预览既不是全局的也不是模态的。
- **FR18 — 原生模态的祖先关系提供被动全局托管。** 应用有一个根全局出口，每个活动原生模态在其 DOM 中提供一个出口。被动全局宿主渲染到最新的活动模态出口中，当没有活动模态时回落到根出口。普通的 body portal 或 `z-index` 并不足够。
- **FR19 — 全局状态在重新托管后仍然保留。** Toast 分发、可见条目、定时器、焦点交接和碰撞状态都位于所选出口之上，因此模态的打开或关闭不会重置它们。
- **FR20 — 当前不符合条件的项保持本地。** Banner 和 FieldStatus 保持在流内；`useAnnounce` 保持非视觉；AlertDialog、命令式 Dialog、Lightbox 以及普通的 Popover-family 表面保持与任务或触发器关联。

### Anchored-layer support requirements

- **FR21 — 原生特性定义完整的锚定行为。** 受支持的原生 Popover API 加 CSS Anchor Positioning 提供顶层提升、原生轻度关闭、自动 popover 关联、逻辑锚点几何以及碰撞回退。
- **FR22 — 不受支持的浏览器获得可用的降级回退。** 显式控件仍然可以显示和隐藏已挂载内容，回调与 React 状态会更新，固定坐标仍然生效。该回退不要求复现原生顶层、外部关闭、关闭请求、自动堆叠、调用者焦点顺序、锚点几何或碰撞行为。
- **FR23 — 公共文档说明该边界。** `useLayer`、Popover 以及相关组件文档区分完整的原生行为与降级回退行为，而不把回退称为等价。

### Implementation requirements

- **IR1 — 协调机制暴露两个操作。** 共享基础设施为一次性通道提供符合条件所有者解析器，为外部交互提供关联分支解析器。一个通用的 `isTopmost` 操作无法实现这两个契约。
- **IR2 — 分支身份可复用。** Dropdown 子菜单上下文将其现有的根关闭链投射为共享的分支身份。独立的嵌套 Popover 创建子分支，而不是偶然加入菜单级联。
- **IR3 — 手势认领扩展现有所有者。** 分支认领构建在 `gestureCounter` 之上，而不是引入基于每个组件的时间戳启发式。
- **IR4 — 原生全局出口是窄范围基础设施。** 全局出口选择不会变成 Layer 或 Popover 上的公共 `global` prop。
- **IR5 — 运行时行为变更保持原子性。** 资格判定、分支协调、手势认领、全局托管以及支持文档可以作为独立的变更发布，同时保持这一个已接受的契约。

### Platform support

- 受支持的特性/引擎下限：完整的契约适用于 Astryx 已发布浏览器矩阵支持原生 Popover API 与 CSS Anchor Positioning 的环境。
- 不受支持的行为：低于该特性下限的浏览器只获得 FR22。原生模态 Dialog 行为仍受受支持的 dialog 下限约束。
- 浏览器证据：原生轻度关闭、调用者行为、顶层顺序、焦点/不可交互状态、模态出口以及锚点几何需要真实的 Chromium 和 WebKit。Playwright WebKit 不是 Safari 特有行为的证据。

## Current-state impact

当前的 `main` 并不完全满足本规格：

- 栈中有 `close` 和 `block` 但没有被动角色；Tooltip 目前在关联所有者之前消费 Escape；
- 不存在共享的 owner/branch 关联图或外部分支解析器；
- DropdownMenuSubMenu 有一条本地的父级关闭链，但外部通道不消费共享的分支身份；
- 原生轻度关闭具有手势记忆，菜单悬停具有再次悬停抑制，但本地背景、触摸、滑动和手动外部路径不共享分支认领；
- body/root Toast 宿主仍位于活动原生模态对话框之后；
- Toast 状态位于 ToastViewport 内部，而不是位于可移动的出口之上；
- CommandPalette 使用原生 Dialog 但在本地处理 Escape；以及
- 降级回退行为在代码中存在，但公共文档未完整描述。

### Migration and adoption plan

1. **所有者与分支模型。** 扩展层注册，加入主动、阻塞和被动角色，以及父所有者与分支根关联。添加纯函数式的符合条件所有者解析器与外部分支解析器。在迁移期间，为现有的主动/阻塞成员保留当前的 Escape/平台契约。
2. **资格判定迁移。** 让未固定的 Tooltip 变被动、固定的 Tooltip 变主动，并更新 Tooltip-over-owner 测试。保持 HoverCard 为主动，因为它可以拥有交互式内容。将 CommandPalette 以及由 `family:overlay-dismissal` 跟踪的本地 Escape 实现迁移到符合条件所有者投递。
3. **分支迁移。** 将 DropdownMenuContext 的根/子菜单链投射为共享分支。为嵌套 Popover 添加独立的子分支。迁移原生自动轻度关闭、ContextMenu 外部按下、dialog 背景、触摸以及 sheet 滑动/scrim 通道，而不改变它们的组件策略。
4. **手势认领。** 将当前的 Layer 关闭记忆泛化为在指针驱动关闭之前记录的分支认领。要求每条关联的重新打开路径都查询它。保留菜单悬停的曝光抑制。
5. **全局原生宿主。** 添加带激活顺序的根出口和模态出口。将 Toast 状态提升到渲染出口之上，在所选出口内渲染其手动 popover 视口，并在重新托管过程中保留状态。让 CommandPalette 继续使用原生 Dialog，并将其验证为更晚的主动模态所有者。
6. **支持投射。** 用完整的原生契约和降级回退更新公共 Layer/Popover/组件文档。添加下方所需的浏览器矩阵。
7. **架构提升。** 随着每个需求交付，将 `architecture:layer-runtime` 从已观察到的缺口更新为已交付的不变式。只有当所有完成标准都满足后，才将本规格移到 `shipped`。

任何迁移步骤默认都不会添加宽泛的公共 API。新的公共 prop 或 hook 仍需遵循 `architecture:public-component-api` 和 `spec:AST-002`。交互模态继续遵循 `architecture:interaction-modality`。

## Verification

| Contract  | Verification                                       | Representative states                                                                  | Mutation or failure expectation                                                  |
| --------- | -------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| FR1–FR6   | 纯注册表/解析器测试加上 family 交互测试            | 主动、阻塞、被动 Tooltip、Dialog 之上的固定 Tooltip、纯视觉、受控所有者                | 被动表面获胜、固定表面让 Escape 到达下方所有者、阻塞者泄漏，或关闭了错误的所有者 |
| FR7–FR10  | 分支解析器测试与真实浏览器外部交互                 | 带两级子菜单的根菜单；父 + 子 Popover；关联触发器                                      | 根之外关闭后子菜单仍打开，或仅子级之外的关闭却关闭了父级                         |
| FR11–FR14 | 手势计数器与浏览器事件顺序测试                     | click 之前/之后的原生轻度关闭；菜单按钮；悬停打开；触摸；背景；滑动                    | 同一次手势重新打开任何关联触发器，或暴露的悬停重新打开面板                       |
| FR11–FR13 | 手势计数器测试；真实 Chromium 的 context-menu 按下 | 由 `contextmenu` 打开的 layer 和 DropdownMenu；在区域内和区域外释放                    | 打开该层的那次按下的释放会关闭它，或之后的按下不会关闭它                         |
| FR15–FR20 | Chromium/WebKit 原生宿主测试                       | 根处的 Toast；经过一个/两个模态的 Toast；模态上方的 CommandPalette；普通的本地 Popover | 全局表面位于后面/不可交互、丢失状态，或普通浮层变成全局                          |
| FR21–FR23 | 受支持/不受支持浏览器矩阵与公共文档检查            | anchor/fixed/custom；auto/manual；显式控件；缺失的特性 API                             | 文档承诺等价，或降级回退不可用                                                   |
| IR1–IR3   | 针对解析器/认领的 API/类型测试与变异测试           | 一次性通道与分支通道                                                                   | 一个最顶层查询被复用于外部分支，或时间戳替代了身份                               |
| IR4, IR5  | 公共表面快照与原子变更审查                         | 本地 Popover、全局 Toast、全局 CommandPalette                                          | 出现通用 global prop，或无关行为被耦合在同一次变更中                             |

### Completion criteria

本规格只有在以下条件全部满足时才完成：

- 未固定的 Tooltip 在 Escape/平台以及外部分支协调中是被动的，而固定的 Tooltip 最先接收 Escape；
- 符合条件所有者与关联分支操作是共享的，并被 `family:overlay-dismissal` 指定的所有成员按各自相关通道采用；
- 在 dropdown/menu 根之外会关闭其整个已打开子菜单级联，而子分支的外部行为在适当时保留其父级；
- 每个指针驱动的分支关闭都使用分支手势认领，并且每条关联的重新打开路径都遵守它；
- Toast 在零个、一个和两个活动原生模态之上都保持可见且可操作，不丢失条目、定时器、主题或焦点交接；
- 常规 CommandPalette 在已有模态之上打开，并作为所选主动所有者参与；
- 普通浮层保持本地，未经批准的记录变更无法选择加入全局托管；
- 公共文档准确描述完整的原生支持与降级回退；
- 所需的 Chromium 和 WebKit 浏览器矩阵通过；以及
- `architecture:layer-runtime` 与 `family:overlay-dismissal` 反映已交付的实现，而不把这些项列为缺口。

## Decision log

### DEC-1 — Dismissal follows eligible interaction ownership

**Reference:** `spec:AST-003/DEC-1`

**Decider:** `cixzhang`, `2026-08-30`

Escape 和平台关闭选择最顶层的符合条件主动或阻塞所有者，而不是最顶层可见或已注册的表面。未固定的 Tooltip 是被动的，不能遮挡其下方的 Popover、菜单、Dialog 或关联交互元素；固定的则是该人自己的交互（DEC-6）。

已否决：让每个可见的瞬态层都消费一次 Escape。那会使补充信息阻塞用户正试图关闭的交互。

### DEC-2 — Outside interaction resolves associated branches

**Reference:** `spec:AST-003/DEC-2`

**Decider:** `cixzhang`, `2026-08-30`

外部交互与 Escape 的范围不同。在 dropdown 或 menu 级联之外关闭整个关联根分支，包括每个已打开的子菜单。仅在某个独立嵌套子分支之外的交互关闭该子分支，而当事件仍位于父分支内时保留父级。

已否决：为每个通道复用一个视觉最顶层闸门。一次性交互与分支作用域交互具有不同的用户意图。

### DEC-3 — Dismissing gestures are claimed across the branch

**Reference:** `spec:AST-003/DEC-3`

**Decider:** `cixzhang`, `2026-08-30`

关闭某个分支的指针手势在关闭之前被认领。它不能继续进入关联触发器并立即重新打开该分支中的任何表面。菜单悬停还会抑制正在关闭的面板暴露其触发器时产生的合成悬停。

已否决：仅基于时间戳的去抖。手势身份必须能在任意浏览器事件顺序下存续，同时不延迟下一次有意的交互。

### DEC-4 — Selected global systems use native above-modal hosting

**Reference:** `spec:AST-003/DEC-4`

**Decider:** `cixzhang`, `2026-08-30`

Toast 和常规 CommandPalette 是当前选定的全局系统。它们可以且必须通过浏览器合法的原生托管，出现在活动原生模态对话框之上。这不会让普通浮层变成全局。

已否决：依赖 body portal 或高 `z-index`。两者都无法跨越原生模态顶层边界。

### DEC-5 — Full anchored behavior depends on native platform features

**Reference:** `spec:AST-003/DEC-5`

**Decider:** `cixzhang`, `2026-08-30`

原生 Popover API 加 CSS Anchor Positioning 定义了完整的锚定层契约。不受支持的浏览器获得有文档说明的可用降级回退，而不是等价的定位、堆叠、关联或关闭行为。

已否决：将当前的 `display` 回退描述为 polyfill。它并未实现缺失的浏览器系统。

### DEC-6 — A pinned layer is the person's own interaction

**Reference:** `spec:AST-003/DEC-6`

**Decider:** `cixzhang`, `2026-10-31`

被该人的按下通过 `useTooltip` 的 `show()` 固定打开的 Tooltip，如同按下 InfoTip 那样，是该人要求保留的东西，因此它是主动所有者，Escape 会在其下方的所有者之前关闭它。仅在悬停或聚焦时预览的 Tooltip 保持被动。

已否决：让所有 Tooltip 都保持被动，那会让 Escape 关闭该人已固定提示之后的 Dialog。

## Open questions

无。
