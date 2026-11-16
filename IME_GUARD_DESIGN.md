# IME 输入法组合守卫——共享基础设计

> 供审核者使用的临时设计文档。不随包发布。分支：
> `nynexman4464/refactor/ime-guard-shared-base`。

## TL;DR 建议

1. **保留 `isImeKeyEvent` 作为唯一的底层谓词。** 它是正确的原语。**不要**添加 `useImeSafeKeyDown` 包装 hook——原因见 §3：它会过度设计，而且在 7 个位置中的 2 个位置上完全错误。
2. **将其从 `hooks/useFocusTrap.ts` 迁移到 `utils/ime.ts`**（一个可发现的位置，符合 `utils/` 中的纯谓词约定），把权威的“为什么”文档注释只放在那里，不放在其他地方。
3. **从 `useFocusTrap.ts` 重新导出（已弃用）以保持向后兼容**，并将 3 个现有导入方 + 3 个内联重复实现迁移到共享谓词。
4. 给 lint 规则（另一条工作流）一个指定的符号可供指向：
   `@astryxdesign/core/src/utils/ime#isImeKeyEvent`。

## 1. 清单（core 中 7 处，lab 中另有 1 处不同模式）

| #   | 位置                                     | 守卫对象                                     | 处理程序                                   | 检测方式                                                                | 事件来源                 | 备注                                                   |
| --- | ---------------------------------------- | -------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------ |
| 1   | `hooks/useFocusTrap.ts`                  | Escape（关闭焦点陷阱）                       | 原生 `keydown`                             | `isImeKeyEvent`（权威定义曾在此）                                       | 原生 DOM `KeyboardEvent` | 也是导出辅助函数所在之处——对一个通用工具来说位置奇怪。 |
| 2   | `Typeahead/BaseTypeahead.tsx`            | Enter/Esc/方向键/Home/End（候选导航 + 提交） | React `onKeyDown`                          | `isImeKeyEvent(e.nativeEvent)`                                          | `e.nativeEvent`          | 在所有按键逻辑之前提前返回。由 PR #4860 添加。         |
| 3   | `PowerSearch/PowerSearchEditPopover.tsx` | Enter（保存）、Escape（取消）                | React `onKeyDown`                          | `isImeKeyEvent(e.nativeEvent)`                                          | `e.nativeEvent`          | 在 Enter/Escape 分支之前提前返回。                     |
| 4   | `Dialog/Dialog.tsx`                      | Escape（关闭）                               | 原生 `keydown`                             | `isImeKeyEvent(event)` **+** `hasActiveFocusTrapEscape()`               | 原生 DOM `KeyboardEvent` | 组合守卫；还会让位于分层的 popover。                   |
| 5   | `ContextMenu/ContextMenu.tsx`            | Escape（关闭）                               | 原生 `keydown`（document 监听器）          | **内联** `e.isComposing \|\| e.keyCode === 229`                         | 原生 DOM `KeyboardEvent` | 重复的谓词。                                           |
| 6   | `Tooltip/useTooltip.tsx`                 | Escape（关闭，WCAG 1.4.13）                  | 原生 `keydown`（document 监听器）          | **内联** `e.isComposing \|\| e.keyCode === 229`                         | 原生 DOM `KeyboardEvent` | 重复的谓词。                                           |
| 7   | `Chat/ChatComposerInput.tsx`             | Enter（提交）                                | React `onKeyDown`                          | **内联** `e.nativeEvent.isComposing \|\| e.nativeEvent.keyCode === 229` | `e.nativeEvent`          | 重复的谓词；只守卫 Enter。                             |
| —   | `lab/CodeEditor/CodeEditor.tsx`          | **onInput**（不是 keydown）                  | React `onInput` + `onCompositionStart/End` | **ref 跟踪**（`isComposingRef`）                                        | 不适用                   | 模式不同、关注点也不同——见 §4。未改动。                |

### 观察到的检测方式

- **共享谓词**（位置 1–4）：调用 `isImeKeyEvent(...)`。
- **内联重复**（位置 5–7）：展开书写 `isComposing || keyCode === 229`。
- **ref 跟踪**（CodeEditor）：跟踪 `compositionstart`/`compositionend` 来门控*输入/变更*路径，而不是 keydown 命令。

### SyntheticEvent 与 nativeEvent

- React 的 `KeyboardEvent` SyntheticEvent **确实**暴露 `isComposing`。但使用 React 处理程序的位置（BaseTypeahead、PowerSearch、Chat）有意读取
  `e.nativeEvent`，以避免任何 React 规范化差异，并获取 `keyCode`。
- 使用原生监听器的位置（focus-trap、Dialog、ContextMenu、Tooltip）直接传入 DOM
  `KeyboardEvent`。
- 该谓词是**结构化类型**（`{isComposing?; keyCode?}`），因此两种形态都可接受，无需类型转换。

### `keyCode === 229` 是否仍然不可或缺？——是。

`229` 是浏览器在 IME 处理按键事件期间报告的哨兵 keyCode。某些 IME 和较旧的 Safari 在触发组合中的 `keydown` 时，`isComposing` **尚未**为 `true`，但**确实**会报告 `229`。舍弃这个回退会使其退化。在浏览器矩阵审计给出其他结论之前，请保留两个信号。（只记录一次，在 `utils/ime.ts` 中。）

## 2. 它应该放在哪里

`utils/` 已经容纳了纯粹的、处理事件/数据的辅助函数（`getKey`、`mergeProps`、
`composeEventHandlers`、`inputAria`），每个都是 `<name>.ts` + `<name>.test.ts`，并有一个桶文件 `index.ts`。`isImeKeyEvent` 是纯谓词——它应放在那里，而不是埋在 focus-trap hook 里。新文件：`packages/core/src/utils/ime.ts`，
从 `utils/index.ts` 重新导出。`useFocusTrap.ts` 保留一个已弃用的重新导出，以免现有相对导入失效。

## 3. 包装 hook（`useImeSafeKeyDown`）——已否决，理由如下

一个在组合输入期间空操作（no-op）的 `useImeSafeKeyDown(handler)` 听起来很整洁，但是：

- **调用点并不统一。** 4 处在 `useEffect` 内使用原生 DOM 监听器（不是该 hook 能包装的 React `onKeyDown` prop）；3 处使用 React 处理程序。
- **在 2 处包装是错误的。** `useFocusTrap` 和 `Dialog` 将 IME 检查与*其他*条件（`isTopEscapeHandler`、`defaultPrevented`、
  `hasActiveFocusTrapEscape()`）组合在一起，并且必须仍然执行那部分外围逻辑——一刀切地“在组合期间让整个处理程序空操作”会改变行为。
- **该谓词已经是最小且正确的原语。** 提前 `if (isImeKeyEvent(e)) return;` 是显式的、可 grep 的，并且可被 lint 定位。
- 包装会引入一个 hook、一个渲染身份方面的关注点，以及 lint 规则必须特殊处理的第二个对象——净收益为负。**建议：谓词 + lint 规则。**

## 4. CodeEditor 有意不在范围内

`lab/CodeEditor` 通过 `compositionstart/end` 的 ref 跟踪来守卫 `onInput`（否则会把不完整的 CJK 音节写入 `value`）——这与“不要把组合中的 keydown 当作命令”是不同的关注点，因此共享的 keydown 谓词不能替代它。**标记：** 它的 `handleKeyDown` 处理 Escape（启用 Tab 移动焦点）和 Tab 时*没有* IME 守卫，因此组合中的 Escape/Tab 可能误触发。这是潜在的、位于 `lab` 的行为问题——留待单独修复。

## 5. 本分支实现的内容（仅低风险）

- 新增 `utils/ime.ts`（权威谓词 + 唯一权威的文档注释）
  和 `utils/ime.test.ts`（双信号覆盖）。
- `utils/index.ts` 重新导出 `isImeKeyEvent`。
- `useFocusTrap.ts`：移除本地定义；从 `utils/ime` 导入；保留已弃用的重新导出以保持向后兼容。
- 将导入方迁移到该工具路径：`Dialog`、`BaseTypeahead`、`PowerSearch`。
- 去重 3 个内联位置（`ContextMenu`、`Tooltip`、`ChatComposerInput`），改为调用 `isImeKeyEvent`，将理由留给 `utils/ime.ts`。
- **无行为变化**——各处布尔逻辑相同；纯属整合。
