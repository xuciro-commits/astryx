# Astryx 翻译协议

将本协议应用于为 Astryx 组件 `.doc.mjs` 文件创建密集翻译。密集翻译作为 `docsDense` 导出存在于同一文件中，是 CLI 在调用 `--lang dense` 时读取的源。

## 目的

生成一个 `docsDense` `ComponentTranslationDoc`，它压缩组件 `docs` 导出的散文，同时保留智能体正确调用 API 所需的每一条指导。Dense 是一种翻译，不是不同的文档——信息相同，token 更少。

## ComponentTranslationDoc 形状

```js
/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'compressed component description',
  features: ['compressed feature 1', 'compressed feature 2'],
  notes: ['compressed note 1', 'compressed note 2'],
  accessibility: ['compressed a11y item 1'],
  keyboard: 'compressed keyboard string',
  // 1:1 with docs.usage.bestPractices — same length, same order
  usage: {
    bestPractices: [
      {guidance: true, description: 'compressed Do bullet 1'},
      {guidance: true, description: 'compressed Do bullet 2'},
      {guidance: false, description: "compressed Don't bullet 1"},
    ],
  },
  propDescriptions: {
    label: 'compressed desc',
    variant: 'compressed desc',
  },
  components: [
    {
      name: 'DialogHeader',
      description: 'compressed sub-component desc',
      propDescriptions: {title: 'compressed desc'},
    },
  ],
};
```

## 压缩规则

删除：

- 冠词（`a`、`the`、`an`）
- 填充动词（`is used for`、`provides`、`supports`、`displays`、`whether`）
- 上下文明确时的主语

使用片段，而不是完整句子。简写：`w/`、`w/o`、`+` 表示“和”、`;` 表示分句中断、`/` 表示紧凑列表。

## 硬性规则——必须保留的内容

### 1. 数量必须匹配

- `bestPractices` 长度 = `docs.usage.bestPractices` 长度（1:1，绝不将两条 bullet 合并为一条）
- `features` 长度 = `docs.features` 长度
- `notes` 长度 = `docs.notes` 长度
- `accessibility` 长度 = `docs.accessibility` 长度
- `components` 长度 = `docs.components` 长度
- `propDescriptions` 为 `docs.props` 中每个有描述的 prop 提供一个条目（通用 prop 除外：`children`、`ref`、`key`、`style`、`className`、`xstyle`）

### 2. 信号词——即使压缩也要保留

这些词会改变*行为*。它们必须在压缩后保留。

| 类别         | 词语                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| 条件词       | `if`、`when`、`unless`、`only`                                                |
| 约束         | `must`、`cannot`、`never`、`always`、`required`                               |
| 交叉引用     | `instead`、`instead of`，以及完整的组件+prop 引用如 `ChatMessage's name prop` |
| 默认值与继承 | `defaults to`、`override`、`inherit`、`context`、`automatically`              |
| 无障碍       | `keyboard`、`accessibility`、`aria-*`、`role=`                                |

❌ 差："use on first bubble in message"  
✅ 好："use on first bubble; **if** first child is raw, use ChatMessage's `name` **instead**"

### 3. 跨组件引用保留

如果完整散文说“use Foo's `bar` prop instead”，dense 必须保留组件名（`Foo`）、prop 名（`bar`）和关系词（`instead`）。

### 4. 保留（required）标记

必需 prop 必须在 dense propDescriptions 中说明，例如 `'<desc> **(required)*'` 或在 prop 条目中包含 `required: true`。必需指导是承重的。

### 5. 子组件不是可选的

如果 `docs.components` 包含 `useImperativeDialog` 或 `useTableSelectionState` 之类的 hooks，`docsDense.components` 也必须包含它们。Hooks 是 API 的一部分。

## 永不改变的内容

- Prop 名称、类型、默认值——这些保留在 `docs` 中，不在翻译中
- 示例代码——保留在 `docs` 中
- 子组件名称——从 `docs.components[n].name` 精确复制

## 覆盖规则

**`packages/core/src/` 中的每个组件都必须有 `docsDense` 导出。** 缺失时 CLI 会静默回退到英语——用户无法知道 dense 模式实际上并未压缩。没有“可选”层级。

## 常见错误

这些模式在针对该协议的 vibe 测试中会被评为保真度损失。不要这样做。

### ❌ 丢失含义的同义词替换

| 错误（丢失含义）                            | 正确（保留信号）                                       |
| ------------------------------------------- | ------------------------------------------------------ |
| `instead of X` → `not X`                    | `instead of X` → 保留 `instead`                        |
| `when X` → 隐含（删除它）                   | `when X` → `if X` 或保留 `when`                        |
| `must` → 完全删除该词                       | 保留 `must` 或使用 `req'd`                             |
| `always provide X` → `provide X`            | 保留 `always`                                          |
| `never` → `don't`（当散文已以 Don't: 开头） | 两者都保留："Don't: never X" 读起来没问题；或使用 `no` |

信号词列表不是建议——其中的每个词都会改变行为。`instead` 表示“使用这个替代方案”。用 `not` 或 `,` 替换它会移除推荐指针。

### ❌ 截断组件名称

| 错误                                              | 正确         |
| ------------------------------------------------- | ------------ |
| `ChatSystemMessage` → `SystemMessage`             | 保留完整名称 |
| `ChatMessageBubble` → `MessageBubble` 或 `bubble` | 保留完整名称 |
| `ChatMessage's name prop` → `bubble's name`       | 保留完整引用 |

对其他组件的交叉引用必须保留完整的 PascalCase 组件名。名称是智能体访问其文档的方式。`MessageBubble` 不可搜索；`ChatMessageBubble` 可以。

唯一可接受的缩写：在同一 bullet 内的第二次提及中，可以省略 family 前缀。第一次提及始终完整。

❌ 差："Don't use SystemMessage for sender content. Use ChatMessage instead."  
✅ 好："Don't use ChatSystemMessage for sender content. Use ChatMessage instead."  
✅ 也可以："Don't use ChatSystemMessage for sender content. Use ChatMessage instead — SystemMessage is for status only."

### ✅ 可接受的压缩

这些不丢失含义：

- "tightens the corner radius" → "tightens corner radius"（删除冠词）
- "the sender's name" → "sender name"
- "and provides X" → "+ X"
- "with X and Y" → "w/ X + Y"
- "or" → "/"（在 "first/middle/last" 这样的紧凑列表中）
