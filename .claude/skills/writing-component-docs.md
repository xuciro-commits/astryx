# 组件文档指南

## 概览

每个组件目录都有一个 `{Name}.doc.mjs` 文件，其中包含结构化文档。Astryx CLI 会读取这些文件，生成便于 agent 使用的文档、skill 文件和参考资料。

这些文档面向**使用** Astryx 构建应用的人，而不是构建 Astryx 本身的人。在添加流程性材料——评分标准、就绪门禁、审计清单、lab→core 标准——之前，请先阅读 [`packages/cli/assets/docs/README.md`](../../packages/cli/assets/docs/README.md)，其中说明了每类材料对应的测试和应归属的 wiki 页面。

## 导出

| 导出        | 类型                      | 用途                 | 是否必需？             |
| ----------- | ------------------------- | -------------------- | ---------------------- |
| `docs`      | `ComponentDoc`            | 英文文档（事实来源） | 是                     |
| `docsZh`    | `ComponentTranslationDoc` | 简体中文叙述覆盖层   | 可选，缺失时回退到英文 |
| `docsDense` | `ComponentTranslationDoc` | 压缩叙述覆盖层       | 可选，缺失时回退到英文 |

**英文优先。** 添加新组件时，编写 `docs` 导出即可。如果 `docsZh` 和 `docsDense` 导出不存在，`--lang zh` 和 `--lang dense` 都会回退到英文。翻译由 AI 从英文生成，可以稍后添加。

## 架构

`docs` 包含一切：属性、示例、类型、默认值和英文叙述。翻译只覆盖叙述部分。CLI 在读取时合并它们。

```
docs (English, full)     <- source of truth
  + docsZh (prose only)  <- merged onto docs when --lang zh
  + docsDense (prose only) <- merged onto docs when --lang dense
```

这意味着：

- 示例只在 `docs` 中定义一次，供所有语言共享
- 属性名、类型、默认值只在 `docs` 中定义一次
- 新增示例只需编辑 `docs`
- 只有叙述发生变化时才需要更新翻译

## 编写 `docs`（英文）

完整类型定义见 `@astryxdesign/cli/authoring`。

```js
/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'Button',
  description:
    'Button component with multiple variants, sizes, and isLoading state.',
  features: [
    'Variants: primary, secondary, ghost, destructive',
    'Sizes: sm (28px), md (32px), lg (36px)',
  ],
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label.',
      required: true,
    },
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'ghost' | 'destructive'",
      description: 'Visual style.',
      default: "'secondary'",
    },
  ],
  examples: [
    {label: 'Basic', code: '<Button label="Save" variant="primary" />'},
  ],
  accessibility: ['Uses native <button> with proper ARIA attributes.'],
  keyboard: 'Enter/Space activates; Tab moves focus.',
  notes: ['Prefer Button over <div onClick> for accessibility.'],
};
```

## 编写翻译（docsZh / docsDense）

翻译使用 `ComponentTranslationDoc` 类型。只包含叙述字段，不包含结构。

```js
// -------------------------------------------------------
// Auto-generated translations below. Do not edit manually.
// Regenerate with the dense compression protocol.
// See .context/decisions/dense-compression-protocol.md
// -------------------------------------------------------

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'multi-variant btn w/ loading state',
  features: [
    '4 variants: primary secondary ghost destructive',
    'sizes: sm 28px, md 32px, lg 36px',
  ],
  propDescriptions: {
    label: 'a11y label; aria-label for icon-only',
    variant: 'visual style',
  },
  accessibility: ['native <button> w/ proper ARIA attrs'],
  keyboard: 'Enter/Space=activate; Tab=move focus',
  notes: ['prefer over div onClick for a11y'],
};
```

CLI 会将其合并到 `docs` 上：压缩后的描述替换英文描述，但属性、示例、类型和默认值都来自 `docs`。

## 添加新组件的文档

1. 创建 `packages/core/src/MyComponent/MyComponent.doc.mjs`
2. 编写 `docs` 导出（英文，必需）
3. 可选地添加 `docsZh` 和 `docsDense`（缺失时都会回退到英文）
4. CLI 会自动发现文档文件，无需注册

## CLI 标志

```bash
astryx component Button                       # Full docs (default)
astryx --detail compact component Button       # Token-optimized format
astryx --detail brief component Button         # Minimal one-line summary
astryx --lang zh component Button              # Chinese prose, same structure
astryx --lang dense component Button           # Compressed prose, same structure
astryx --detail compact --lang dense component Button  # Compact + compressed
```

`--lang` 控制使用哪一份叙述翻译。`--detail` 控制详略程度（full、compact、brief）。两者可以独立组合。

## 参考文档（非组件）

参考文档（tokens、principles、theme）使用另一种类型：来自 `@astryxdesign/cli/authoring` 的 `ReferenceDoc`。

它们位于 `packages/cli/assets/docs/`，以 `.doc.mjs` 文件形式存在，翻译位于 `*.doc.dense.mjs` 和 `*.doc.zh.mjs`。

内容按 section 组织，每个 section 包含有序的内容块：

- `prose`——可翻译的文本
- `code`——代码示例（不翻译）
- `table`——数据表格（不翻译）
- `list`——规则、反模式、提示（可翻译）

要添加新的参考文档：创建 `packages/cli/assets/docs/mytopic.doc.mjs` 并导出 `docs` 常量。它会被自动发现。

```bash
astryx docs                          # list topics
astryx docs tokens                   # full output
astryx docs tokens --index           # section index, one key per section
astryx docs tokens spacing           # single section, by key or title
astryx --detail compact docs tokens  # agent-friendly
astryx --lang dense docs tokens      # compressed prose
```
