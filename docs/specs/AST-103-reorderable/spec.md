---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-103
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
phase: accepted
owners: [cixzhang]
affects_architecture: [architecture:public-component-api]
affects_families: []
affects_contributing: []
affects_consumer_docs: []
---

# Reorderable collections system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": ["packages/core/src/**", "packages/lab/src/**"]
}
```

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

`createReorderable` 适用于整个集合：它的对象作为集合的 `reorderable` prop 传入，或挂接到由普通元素组成的容器上（FR4b）。逐项控制来自每一项的键（`itemKey`，或集合既有的标识），以及 `isReorderable(key)`。

一个人可以通过拖动某一行的手柄、通过键盘，或借助屏幕阅读器改变集合中各项的顺序，并且每个允许这样做的集合都以相同的方式运行。调用方通过把一个由 `createReorderable` 创建一次的行为对象传给集合的 `reorderable` prop，或把它挂接到普通元素上，并应用它所报告的变化，来开启重排序。不进行重排序的集合不会加载它的任何部分。

## Non-goals

- 在一次拖动中移动多个项、目标谓词、集合实例之间的移动；每一项都可以稍后添加，而无需改变此契约。
- 在集合之间移动项、自由画布式放置，以及文件拖放。
- 重排序的运动值、阈值和时序：这些保持为内部实现（`spec:AST-002` FR3），来自主题的运动角色与 `spec:AST-094` 的测量值。
- 移动行与插入提示的视觉处理，由 `design:ordered-collection-reordering` 拥有。

## Public contract

```tsx
import {createReorderable} from '@astryxdesign/core';

const moveTo = (items, key, to) => {
  const moved = items.find(item => item.id === key);
  const rest = items.filter(item => item.id !== key);
  return [...rest.slice(0, to), moved, ...rest.slice(to)];
};

const reorderable = useMemo(
  () =>
    createReorderable({
      onReorder: ({key, to}) => setItems(items => moveTo(items, key, to)),
    }),
  [],
);

<Button label="Move" onClick={() => reorderable.start(selectedId)} />
<List reorderable={reorderable}>
  {items.map(item => (
    <ListItem key={item.id} itemKey={item.id} label={item.name} />
  ))}
</List>;
```

第二个集合使用同一个对象和选项，接线到它自己的内部实现。树把位置报告为一个父项和一个索引：

```tsx
const reorderable = createReorderable({
  onReorder: ({key, to}) => setTree(tree => moveNode(tree, key, to)),
});

<TreeList reorderable={reorderable} items={tree} />;
```

这里 `to` 是 `{ parent, index }`，键是节点既有的 `id`；手柄、键、操作与播报都是 FR3 与 FR4 的，树没有增加任何选项。

在没有 React 的情况下，同一个对象挂接到普通元素上：

```ts
const {detach} = reorderable.attach(listElement, {
  items: () =>
    cards.map(card => ({key: card.id, element: card.el, handle: card.grip})),
});
```

## Requirements

- **FR1 — 一个工厂创建该行为。** `createReorderable(options)` 返回一个可重排序对象。`options` 携带变更回调 `onReorder({ key, to })`、可选的 `isReorderable(key)` 谓词，以及可选的 `positions()`，它为诸如扇形手牌或自定义网格之类的布局提供放置位置；已被测量布局放置好的集合不需要它。`positions()` 按项的顺序为每一项返回一个 `{x, y}`：该项槽位的中心，以像素为单位，从集合容器框的左上角算起。拖动把放置范围内、其中心最接近被拖动项中心的槽位报告为 `to`，而放下的项会落到该槽位的中心。长度与项数不同的数组会被忽略，树中的 `positions` 同样被忽略；放置位置于是来自测量布局。实现缺口：尚未构建；`positions` 尚不存在，因此放置位置始终来自测量布局。没有 `positions` 时，放置位置来自测量布局；在回调中，`key` 以其键命名被移动的项，`to` 是该项移动后所具有的索引，按集合的完整项顺序计数（它被给定的每一项，无论是否已挂载）。在树中，`to` 是 `{ parent, index }`：`parent` 是新父项的键（根处为 `null`），`index` 是移动后该项在其父项的子项中的位置（DEC-3）。它不携带任何手势、动画或时序设置。可选的 `isReorderable(key)` 谓词使某一行保持原位：它拒绝的行不显示手柄，也无法被拾起（DEC-2）。它在集合任一端拒绝的行还界定放置范围：没有任何东西会落到它之外，而键盘或辅助技术越过它的移动会被拒绝并播报（FR4）。每一项的键来自数据，从不来自 React 的 `key`：List 读取每个 `ListItem` 的 `itemKey`，一个字符串或一个数字，即 Table 的 `idKey` 返回的形状，而 `onReorder` 按给定原样报告该键；其项已携带标识的集合，例如 TreeList 的 `id` 或 Table 的 `idKey`，使用该标识；而没有标识的数据集合采用 Table 形状的 `idKey`，即一个字段名或一个作用于项的函数（DEC-4）。没有键的行不显示手柄，也无法被拾起。该对象应在每个集合中只创建一次，例如用 `useMemo` 创建；在每次渲染时重新创建的对象仍然可用，因为集合在移动提交时使用最新的回调，而拖动期间的新对象不会取消该拖动。把一个对象传给两个集合，或把它挂接到两个容器上，它们各自独立重排序，且不会在两者之间移动任何东西；它的 `start` 以最后挂载或挂接的那个为目标，并给出开发环境警告。该对象在一个已注册的键下携带其机制，因此包与 swizzle 后的副本对它的理解一致（`spec:AST-110` FR3）：swizzle 后的 `List`、`TransferList` 或 `ListInput` 会读取包所创建的对象，而包会读取副本所适配的对象。`options` 还接受 `labels?: ReorderableLabels`，它持有该对象播报或显示的每一个字符串（`architecture:internationalization` INV3a）：
  - 播报：`pickedUp` 与 `dropped`（拖动的拾起与放下，带位置与计数）、`cancelled`（被取消的拖动，回到其位置）、`place`、`placeAtTop`、`placeAtEnd`、`placeInGrid` 与 `placeInTree`（FR4 的移动播报，`placeInTree` 会加上父项）、`refused`（越过被拒绝行的移动）、`notMoved`（FR4b 中应用未应用的移动）、`modeDone`（离开重排序模式），以及 `unnamedItem`（播报对没有文本的项的称呼，例如“Item 2”）；
  - 显示的标签：`handle`（手柄的名称，“Reorder”加上项的标签）、`handleVerb`（单独的“Reorder”，当该标签命名手柄时，在行自身的标签之前朗读）、`unnamedHandle`（没有文本的项的手柄，例如“Reorder item 3”）、`handleHint`（手柄对拖动与重排序模式的描述）、`moveUp`、`moveDown`、`moveLeft` 与 `moveRight`（提示中的移动按钮），以及 `done`（提示中的 Done）。

  每个键都是可选的。缺少的键回退到目录消息：在 provider 下渲染集合时是翻译后的，没有 provider 时是英文；给定的字符串替换该消息，包括覆盖 provider 的翻译。模板化消息的键采用目录中具有相同参数的 ICU 模板，例如 `place` 的标签、位置、计数与邻居，或 `dropped` 的位置与计数。实现缺口：尚未构建；`labels` 尚不存在，因此每个字符串都来自目录。

- **FR2 — 出现即启用。** 接受重排序的集合通过一个 `reorderable` prop 接收该对象；没有单独的布尔值。该 prop 缺失时，集合不渲染手柄、不注册重排序监听器，也不加载重排序代码：在传入该对象之前，集合不导入它的任何部分。
- **FR3 — 每个集合以相同方式拖动。** 每个采用它的集合把该对象接线到自己的内部拖动、键盘与辅助技术路径，且行为在每个集合中都相同：
  - 拖动从某一行的手柄开始（`design:ordered-collection-reordering` DR1）；用鼠标，或主指针为精细的笔，从手柄开始的拖动无需按住即可开始；手指，或主指针为粗糙的笔，则保留按住，按住会在 `spec:AST-094` 的取值下拾起该行，而轻扫仍然滚动；
  - 按住拖动靠近滚动容器边缘时，会向该边缘滚动，越近越快，并在末端停止；
  - 拖动在放下时提交一次（DR4），并为其调用一次 `onReorder`；被取消的拖动不调用任何东西；
  - 在减少运动偏好下，移动预览仍然跟随手指或指针，而其他行与放置点不经过位移即就位（`design:reduced-motion` DR1–DR3；鼠标放置在粗糙主指针上遵循 DR2，否则遵循 DR3）。
- **FR4 — 重排序模式是唯一无需拖动的路径。** 每个可重排序行的手柄是一个切换按钮，其名称为“Reorder”加上该行的标签，并带有 `aria-pressed`。通过点击、Enter 或 Space 激活它，会为该项进入重排序模式，鼠标、键盘与辅助技术都使用它（`spec:AST-094` FR39）。在重排序模式中：
  - 方向键沿布局轴移动该项：垂直集合中用 Up 与 Down，水平集合中用 Left 与 Right，而在网格或换行板之类二维布局中四个方向都可用，其中 Left 与 Right 按阅读顺序移动到上一个和下一个位置，在从右到左时镜像，Up 与 Down 移动到上一行或下一行的同一列，当该行较短时移动到该行的最后一个位置；行与列来自测量布局，`to` 仍是完整顺序中的最终索引；在树中，Up 与 Down 在可见位置之间移动，Left 与 Right 在 `isReorderable` 允许的情况下把该项移出或移入某个父项；
  - 每次移动通过 `onReorder({ key, to })` 立即提交，因此数据、屏幕与播报始终一致；
  - 每次移动在其渲染之后通过共享的礼貌播报通道播报一次，在 modal 中则按 `spec:AST-086` FR14 的要求播报，说明该项、其位置与计数，以及它的邻居，例如“Milk, position 3 of 5, after Eggs, before Bread”；第一个和最后一个位置说“at the top”与“at the end”，二维布局会加上行与列，例如“Milk, row 2, column 3, position 8 of 12”，树则加上父项；
  - 越过集合任一端被 `isReorderable` 拒绝的行的移动会被拒绝并播报，例如“Can't move past Pinned”；中间被拒绝的行会被越过，正如拖动会越过它（FR1）；
  - 焦点停留在手柄上，该行滚动进入视图；
  - Escape，或再次激活手柄，离开重排序模式并保留每一次移动，播报“Done”加上该项的位置，例如“Done, Milk at position 3 of 5”；
  - 当该项处于重排序模式时，拖动所显示的相同强调色插入线标记该项的位置，并随每次移动而移动（`design:ordered-collection-reordering` DR7）；
  - 当该项处于重排序模式时，锚定到它的提示显示其轴向上的移动操作与一个 Done 控件，其层、锚定与主题角色与 Core 的键盘提示相同，并保持到模式结束；提示中的每次移动都是一个按钮，其行为与其按键完全一致，播报相同且焦点留在手柄上，而 Done 像 Escape 一样离开模式，因此指针或手指可以通过依次点击手柄、移动按钮与 Done 来重排序；
  - 该提示是每个采用它的集合的解剖结构中命名的部件；它是一个遵循 `family:overlay-dismissal` 的层；它使用 Core 的键盘提示的层、锚定与主题角色，而 Core 的键盘提示的公共 API 保持不变，并且与该提示不同，它的按钮接受点按，并对辅助技术开放。
- **FR4a — 应用可以启动重排序模式。** 该对象暴露 `start(key)`，它从应用自己的 UI（例如工具栏按钮或菜单中的 Move item）为该项进入 FR4 的重排序模式。焦点移动到该项的手柄，该手柄滚动进入视图，提示出现，而播报与退出都是 FR4 的。不可重排序、未挂载或找不到的键不执行任何操作，并在开发环境中警告。模式通过 Escape、Done、手柄或项卸载结束，因此没有 `stop`。除 FR4b 的 `attach` 之外，该对象上没有其他公开内容；`start` 与手柄进入的是同一个模式。
- **FR4b — 普通元素可在没有 React 的情况下挂接。** 该对象暴露 `attach(container, {items})`，其中 `items()` 按顺序为每一项返回一个 `{key, element, handle}`，并返回 `{detach}`。实现缺口：尚未构建；该对象还没有 `attach`。被挂接的容器获得 FR3 的拖动、每个手柄上的 FR4 重排序模式，以及它们的播报，而无需集合组件；`positions` 与 `isReorderable` 的作用与对集合相同。`attach` 为每个 `handle` 赋予 FR4 的角色与切换状态，并用“Reorder”加上项的文本命名它：优先用项元素的可访问名称，否则用它的文本内容，当两者都为空时给出开发环境警告；它把每个手柄放入 Tab 顺序；被拒绝项的或无键项的手柄不获得这些中的任何一项，也不会开始拖动；`start(key)` 像到达集合的项一样到达已挂接的项；并且它把 FR4 的提示渲染为它自己拥有的元素。当 `items()` 在 `onReorder` 之后报告新的顺序时，移动即提交：`attach` 随即播报它并播放放下；当 modal 对话框包围该容器时，`attach` 通过该对话框内部一个持久的礼貌容器播报，正如 `spec:AST-086` FR14 为 Astryx modal 所塑造的那样；而到运行 `onReorder` 的任务结束时顺序仍未改变的移动会被拒绝并播报，例如“Can't move King of hearts”。一旦移动提交，`attach` 按 `items()` 返回的结果聚焦被移动项的手柄并使其滚动进入视图，因此无论应用如何移动或重渲染该项，焦点都停留在手柄上。`attach` 从对象的 `labels`（FR1）取每个字符串，缺少的键回退到随附的英文目录，并按组件在 provider 之外的方式格式化数字（`architecture:internationalization` INV3、INV3a）。实现缺口：尚未构建；`attach` 对每个字符串都使用随附的英文目录。`detach` 结束任何进行中的拖动或重排序模式且不调用任何东西，并移除 `attach` 添加的每个监听器、观察器、计时器、元素（包括那个容器）与属性，恢复每个手柄自己的角色、名称与 tab 顺序；创建或导入该对象不做任何 DOM 工作，因此它在服务端是安全的。
- **FR5 — 重排序至多为一行添加一个元素。** 所添加的一个元素是手柄，即交互式拖动目标，带有其角色。它的握把是装饰，由伪元素或主题角色字形绘制，而不是由元素绘制。当某一行被拖动时，源行保持在原位并变暗，一个移动预览跟随指针（`design:ordered-collection-reordering`）：该预览是 `architecture:component-style-authoring` INV7 允许的唯一临时副本，惰性、对辅助技术隐藏，并在放下时移除。重排序监听器是按集合的、或在 document 上，从不是按行的（`spec:AST-094` FR24）。
- **FR6 — 从一开始就稳定。** `createReorderable`、它的选项，以及集合的 `reorderable` prop 是稳定的公共 Core API：没有 `_experimental` 名称，也没有实验性子路径（DEC-1）。`spec:AST-017` FR21 与 DEC-28 只适用于被选为实验性的 API。
- **FR7 — 作为公共 API 准入并记录。** `reorderable` 是调用方意图，任何集合都无法推导（`spec:AST-002` FR1、DEC-1），而它的阈值保持为内部实现（`spec:AST-002` FR3）。`createReorderable` 有它自己的规范描述符，每个采用它的集合的描述符都记录 `reorderable`（`spec:AST-039` FR1、FR3）。
- **FR8 — 该职责只有一种公开形状。** 进行重排序的集合使用此对象，而不用其他任何公开的重排序 API。

## Current-state impact

- `component:List` 获得 `reorderable`，作为第一个采用方。
- 目前 Core 中没有集合通过拖动重排序。Tokenizer 报告一个 `reorder` 变更（`spec:AST-056`）；把它迁移到此对象上是后续工作。进行重排序的 Lab 集合采用此对象。

## Verification

| 契约         | 验证                                                                                         | 代表性状态                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 变异或失败预期                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1、FR6–FR8 | 公共 API 审查、类型测试与描述符检查                                                          | 该工厂的选项，包括 `ReorderableLabels` 的键；集合的 `reorderable` 类型；该工厂与 List 的描述符                                                                                                                                                                                                                                                                                                                                                                                                   | 额外的手势、时序或动画选项、实验性名称或子路径、缺失的描述符、第二个公开的重排序 API、该对象播报或显示但没有 `labels` 键可替换的字符串，或翻译器选项，均失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| FR1 副本     | 加载 List 的重排序上下文与内部重排序入口的第二份副本的单元测试                               | 读取包所创建对象的副本 List；读取副本入口所适配对象的包 List                                                                                                                                                                                                                                                                                                                                                                                                                                     | 任一方向上，在包放置机制的位置读到 `undefined` 的副本，失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| FR2          | 对带该 prop 与不带该 prop 的集合进行打包产物与运行时检查                                     | 不带该 prop；带该 prop                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 不带该 prop 时打包产物中出现重排序代码、手柄或重排序监听器，失败；实测成本记录在 pull request 中                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| FR3          | 使用真实触摸输入与鼠标的浏览器测试（`spec:AST-013` FR10）                                    | 按住并拖动；轻扫；放下；被取消的拖动；减少运动；带自定义 `positions` 的扇形手牌；不带它们的列表；长度错误的 `positions` 数组；带 `positions` 的树；在被拒绝的端行旁使用自定义 `positions`；在精细与粗糙主指针上的笔拖动                                                                                                                                                                                                                                                                          | 从手柄之外开始的拖动、放下之前的提交、一次拖动两次回调、取消时的回调、减少运动下的位移、忽略长度正确的 `positions` 的放下、长度错误的数组或放置不来自测量布局的树、放置范围之外的放下、一次鼠标拖动，或在精细主指针上等待按住的笔拖动，或在粗糙主指针上无需按住即开始的笔拖动，或未传 `positions` 的调用行为发生变化，失败                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| FR3 自动滚动 | 在滚动边缘附近按住拖动的鼠标浏览器测试，以及自动滚动步骤及其计时器的单元测试                 | 在页面底边附近按住的一行，并保持在那里直到列表末端进入视图；在列表所滚动的盒子底部附近按住的一行；越过边缘的每个深度上的步骤；边缘处的计时器                                                                                                                                                                                                                                                                                                                                                     | 在边缘附近按住拖动却不滚动、在盒子承载列表时滚动页面、向远离边缘的方向滚动、越靠近边缘仍保持同一速度，或滚过末端，失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| FR4          | 重排序模式的键盘、鼠标与播报路由测试（`spec:AST-009` FR17）                                  | 通过点击、Enter 与 Space 进入；垂直、水平与网格集合中的方向键；树中的 Up、Down、Left 与 Right；每次移动在开头、中间与末尾的播报；越过被拒绝行的移动；Escape 与第二次激活；每次移动之后的焦点与滚动                                                                                                                                                                                                                                                                                               | 不立即提交的移动、缺失、重复或在渲染之前发生的播报、在任一端越过被拒绝行的移动，或阻止移动的列表中段被拒绝行、焦点离开手柄，或退出时撤销移动，失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| FR4 提示     | 使用鼠标、手指与键盘的浏览器测试                                                             | 垂直、水平与网格集合中提示的轴向；每个移动按钮与 Done；仅点按的重排序；提示的主题角色                                                                                                                                                                                                                                                                                                                                                                                                            | 偏离键盘提示的层、锚定或主题角色的提示，忽略点按或对辅助技术隐藏的按钮，行为或其播报与其按键不同的按钮，焦点离开手柄，或在模式结束后仍存在的提示，失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| FR4 二维     | 在从左到右与从右到左的换行卡片网格上的键盘与播报路由测试                                     | Left 与 Right 跨过行末；Up 与 Down 在完整的行之间以及进入较短的末行；带行与列的播报；提示的四个按钮；改变列数的尺寸调整                                                                                                                                                                                                                                                                                                                                                                          | 偏离阅读顺序的移动、从右到左时镜像方向错误、未被限制到其最后位置的短行移动、缺失的行或列，或列数读取自布局之外的任何东西，失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| FR4a         | `start(key)` 的键盘、鼠标与播报路由测试                                                      | 从上下文菜单项与工具栏按钮调用 `start`；不可重排序、未挂载或未知的键；每次渲染都重新创建的对象；两个集合上的一个对象                                                                                                                                                                                                                                                                                                                                                                             | `start` 未聚焦并滚动到手柄、与手柄模式不同的提示或播报、缺少键的调用抛出异常或产生动作，或双集合调用没有开发环境警告，失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| FR4b         | 对普通元素上的 `attach` 使用鼠标、手指、笔与键盘的浏览器测试，以及 `detach` 之后的监听器计数 | 一次拖动、被取消的拖动、重排序模式、带 `positions` 的扇形布局、应用实际应用的移动与应用未应用的移动、拖动中途的 `detach`、服务端导入、给出每个 `labels` 键与不给出任何键的另一种语言页面、provider 下给定的键、没有可访问名称的项元素、`isReorderable` 拒绝的项、无键项、对已挂接项调用 `start(key)`、自身带有 `tabindex="-1"` 的手柄、页面打开的 modal 对话框内的容器、挂接到两个容器的一个对象、在精细与粗糙主指针上的笔拖动、应用通过移动项元素来应用的一处移动与通过重新渲染来应用的一处移动 | 普通元素上缺失拖动、模式或播报；没有 FR4 的角色、按下状态或名称的手柄，当项有文本时仅命名为“Reorder”的手柄，或不在 Tab 顺序中的手柄；被拒绝项或无键项的手柄是 Reorder 切换按钮或可被拖动；未到达已挂接项的 `start(key)`；在 `items()` 报告之前播报的移动，或应用未应用的移动未被拒绝；`detach` 之后仍在运行的拖动或模式，或遗留的监听器、观察器、提示元素、手柄属性或已改变的 tab 顺序，除其给定 `labels` 键之外的字符串，或在没有该键时除随附英文目录之外的字符串，在页面打开的 modal 内仅到达页面主体通道的播报，两个容器之间的移动或那里的 `start` 没有开发环境警告，在精细主指针上等待按住的笔拖动，或在粗糙主指针上无需按住即开始的笔拖动，移动之后焦点不在被移动项的手柄上，或导入时的 DOM 工作，失败。证据缺口：`labels` 尚未构建，因此还没有测试覆盖给定的键。 |
| FR5          | 带该 prop 与不带该 prop 的列表的元素与监听器计数                                             | 静止的一行；被拾起的一行；被放下的一行                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 每行多于一个新增元素、用元素绘制的握把、按行的监听器、第二个预览、离开其位置的源行、放下之后遗留的预览，或辅助技术可到达的预览，失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

## Decision log

### DEC-1 — Reorderable is stable public API

**Reference:** `spec:AST-103/DEC-1`

**Decider:** `cixzhang`, `2026-10-25`

重排序是调用方在其上构建的一项能力，因此 `createReorderable` 与集合的 `reorderable` prop 从一开始就是稳定的公共 API，没有实验性名称或子路径。

已否决：先将其作为实验性功能发布。

### DEC-2 — A predicate keeps a row in place

**Reference:** `spec:AST-103/DEC-2`

**Decider:** `cixzhang`, `2026-10-25`

有些行不能移动，例如固定的首行，而一个人应当在尝试之前就看到这一点。可选的 `isReorderable(key)` 谓词标记它们：该行不显示手柄，也无法被拾起，正如 UIKit 表格的 `canMoveRow` 所做的那样。该名称遵循 Astryx 的 `is…` 谓词约定。

已否决：没有逐行控制，放下之后忽略不希望的移动。

### DEC-3 — A move names the item by its key

**Reference:** `spec:AST-103/DEC-3`

**Decider:** `cixzhang`, `2026-10-25`

`onReorder` 接收被移动项的键及其新位置，`isReorderable` 接收一个键，因此契约在所有地方都以键命名项。当列表被虚拟化时，以及当树在父项之间移动项时，键仍然正确，而一对索引则不会。过滤它所传入项的调用方会把 `to` 映射回其完整列表。

已否决：带一对位置的 `onReorder(from, to)`。

### DEC-4 — The reorder key comes from the data

**Reference:** `spec:AST-103/DEC-4`

**Decider:** `cixzhang`, `2026-10-25`

React 不会把 `key` 传给组件，因此集合不能依赖它。`ListItem` 用一个 `itemKey` prop 命名它的项，而没有自身标识的数据集合采用 Table 形状的 `idKey`，即一个字段名或一个作用于项的函数，因此同一职责保持一个名称。`itemKey` 是一个新名称，因为如今没有行 prop 携带项标识：类选项行上的 `value` 是表单读取的选中值，那是另一项职责。其项已携带标识的集合，例如 TreeList 的 `id` 或 Table 的 `idKey`，使用它而不是第二个标识，因为新 API 不会与既有 API 共享同一职责。

已否决：读取每个直接子项的 React `key`。

### DEC-5 — Reorder mode, not a move menu, is the path without a drag

**Reference:** `spec:AST-103/DEC-5`

**Decider:** `cixzhang`, `2026-10-25`

移动菜单会让键盘用户疲劳。手柄反而切换一种重排序模式，其中方向键移动该项，每次移动都会连同位置与邻居一起播报。每次移动立即提交，因此离开模式会保留移动，应用从不撤销多次提交；焦点停留在手柄上，直到 Escape 或第二次激活。

模式开启时，锚定到该项的提示显示移动操作与 Done，其字形是按钮，因此不想拖动的视力正常者可以点按完成同样的移动；它复用键盘提示的层，而不是第二种提示模式。

已否决：包含 Move before 与 Move after 的菜单。

### DEC-6 — One `labels` object holds every string

**Reference:** `spec:AST-103/DEC-6`

**Decider:** `cixzhang`, `2026-11-01`

一个没有 provider 的页面，例如挂载普通元素的页面，仍然需要自己的语言，而该对象会声明并显示许多字符串。一个可选的 `labels` 对象保存它们，每个键都回退到消息目录中的消息，因为 `architecture:internationalization` INV3a 给出的是一个带有不止一个字符串的工厂；翻译本身仍由 provider 负责。

已否决：一个 translator 函数选项，以及每个字符串各一个扁平选项。

## Open questions

无。
