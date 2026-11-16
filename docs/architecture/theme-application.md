---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:theme-application
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-30
owners: [cixzhang, imdreamrunner]
applies_to:
  [
    packages/core/src/theme/Theme.tsx,
    packages/core/src/theme/MediaTheme.tsx,
    packages/core/src/theme/useTheme.ts,
    packages/core/src/theme/themeRegistry.ts,
    packages/core/src/AppShell/AppShell.tsx,
  ]
verified_by:
  [
    packages/core/src/theme/Theme.test.tsx,
    packages/core/src/theme/MediaTheme.dom.test.tsx,
    packages/core/src/theme/useTheme.test.tsx,
    packages/core/src/theme/themeRegistry.test.ts,
    packages/core/src/AppShell/AppShell.test.tsx,
  ]
deciding_specs: [spec:AST-012/DEC-1, spec:AST-087/DEC-2, spec:AST-108/DEC-1]
---

# Theme application

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "theming": ["INV1", "INV2", "INV3", "INV7", "INV8", "INV9", "INV11"]
  }
}
```

本记录定义已编译主题如何为 React 树和浏览器文档激活。

## Purpose

用户应在普通内容、嵌套主题区域、portal 和非 CSS 消费者中看到相同的主题。挂载多个提供者不得产生重复样式，也不得让一个提供者移除另一个提供者仍在使用的样式。

## System model

`Theme` 接收一个 `DefinedTheme`、一种颜色模式和子节点。包含函数图标条目或 slot 函数的主题由客户端代码传给 `Theme`。服务器代码可以用这样的主题解析图标；但不支持将其作为 prop 从 Server Component 传给 Client Component。

- 它按名称注册主题。
- 对于未预先构建的主题，它向 Web 编译器请求 CSS，并将该 CSS 挂载到文档中。
- 对于已构建的主题，它假定消费者已加载样式表，不会再次编译或注入。
- 它用主题名称和颜色模式包裹子节点。
- 根提供者还会将活动主题名称和显式浅色/深色模式写入 `<html>`。嵌套提供者不更改 `<html>`。

`useTheme` 通常通过 React context 读取最近的提供者。

当没有提供者上下文时——例如渲染到独立 React root 或回退视口的内容——它只能通过一条共享回退路径跟随根主题：

1. 根 `Theme` 将其主题名称和显式浅色/深色模式写入 `<html>`。
2. `useTheme` 读取这些属性，并为每个文档共享一个观察器。
3. 它在共享注册表中按名称查找主题对象。
4. 每个无提供者消费者都复用该路径，而不是创建自己的观察器。

普通 React portal 保留提供者上下文，不需要此回退。回退无法为独立 React root 恢复嵌套提供者。需要嵌套主题的内容必须在同一个 React 树中保持该提供者上下文。

`MediaTheme` 将本地表面标记为深色、浅色、自动检测或关闭。编译后的主题 CSS 使用该标记切换表面 token，同时保留父主题的组件规则。

`AppShell` 使用相同的提供者/根回退身份路径来解析具名移动导航宽度点。最近的 Theme 优先；没有提供者上下文时，它跟随已注册的根主题；没有活动主题时，它使用标准宽度映射。

## Boundaries and invariants

- **INV1 — 最近的提供者优先。** 子节点读取最近的 Theme 上下文和 CSS 作用域。一个例外：主题的 `reducedMotion: 'always'` 也会影响每个嵌套提供者（`spec:AST-108` FR6）。
- **INV2 — 只有根提供者更改 `<html>`。** 嵌套提供者保持本地，不能更改浏览器外壳或 portal 范围的主题身份。
- **INV3 — 分离的消费者共享一个根主题存储。** 独立的 React root 或回退视口通过一个内部存储读取根属性和主题注册表，每个文档一个观察器。普通 React portal 保留提供者上下文。回退无法恢复嵌套提供者。
- **INV4 — 已构建的主题不会再次编译。** 标记为已构建的主题使用其已加载的样式表，并跳过运行时样式生成和注入。
- **INV5 — 运行时样式被安全共享。** 使用同一未构建主题的多个提供者共享一个文档级样式集。只有当没有已挂载提供者仍需要这些样式时，才会移除它们。
- **INV6 — 提供者消费者避免文档观察。** 提供者下的 `useTheme` 直接读取上下文。共享文档观察器仅存在于无提供者消费者，并在未使用时断开。
- **INV7 — 系统模式跟随平台，任何未知模式也是如此。** `Theme` 的模式值和默认值由 `component:Theme` 拥有。`system` 解析为活动的浅色/深色偏好，不会向 `<html>` 写入强制模式。任何其他运行时值（例如过期的存储偏好或无类型调用方的字符串）都被视为 `system`：根提供者不向 `<html>` 写入强制模式，消费者通过平台偏好解析它。`useTheme().mode` 始终是解析后的 `'light'` 或 `'dark'`，绝不是 `system`，也绝不是原始值。
- **INV8 — 媒体表面不会替换主题。** `MediaTheme` 更改本地表面 token 和可选的特定表面组件规则。它保留活动主题，并且在关闭时不会重新挂载子节点。
- **INV9 — 应用不会更改已编译规则。** 提供者可以挂载、共享和移除编译器输出。它不得产生与构建路径不同的主题到 CSS 行为。
- **INV10 — 具名响应式消费者共享 Theme 元数据。** AppShell 从最近的活动主题通过与其他无提供者消费者相同的根回退解析 `sm`/`md`/`lg`/`xl`/`2xl`。其移动端严格低于该点；相等属于更宽的布局。
- **INV11 — 图标解析在服务器和客户端之间一致。** 服务器渲染和水合将每个图标和 slot 请求解析为活动主题的同一节点。

本记录不拥有主题创作、token 定义、编译器输出，或哪些组件部件是公开主题目标。

## Change coupling

- 提供者嵌套变更会测试根、嵌套、portal 和清理行为。
- 样式生命周期变更会测试两个使用同一主题的提供者，并确认卸载其中一个不会破坏另一个。
- 根属性变更会一起测试浏览器模式、portal 可达性和无提供者 hook。
- `useTheme` 回退变更会测试提供者和无提供者路径，并确认提供者消费者不会创建文档观察器。
- MediaTheme 变更会测试深色、浅色、自动、关闭、回退以及子节点身份不变。
- 运行时编译的变更首先属于共享编译器，并针对静态构建路径进行检查。

## Owning code

- `Theme.tsx` 拥有提供者作用域、运行时样式生命周期和根文档同步。
- `themeRegistry.ts` 拥有按主题名称进行的服务器安全查找。
- `useTheme.ts` 拥有提供者访问以及分离消费者使用的共享根回退。其观察和订阅逻辑保持单一所有权；提取另一个模块不属于本契约的一部分。
- `MediaTheme.tsx` 拥有本地浅色/深色表面上下文。
- `AppShell.tsx` 为移动导航消费最近的有效宽度映射。
- `architecture:theme-compilation` 拥有 Theme 挂载的 CSS。

## Deciding specs

- `spec:AST-012/DEC-1` 拥有 AppShell 消费的固定宽度点词汇。
- `spec:AST-087/DEC-2` 将主题图标条目设为函数，因此持有它们的主题会从客户端代码到达 `Theme`。
- `spec:AST-108/DEC-1` 允许主题的 `reducedMotion: 'always'` 到达嵌套提供者（INV1）。

## Verification

| 不变量           | 证据                                                                                                                                                                                                                                                                                                                                  | 失败信号                                                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV1、INV2、INV3 | `Theme.test.tsx` 以及 portal/根 fixtures                                                                                                                                                                                                                                                                                              | 嵌套提供者更改 `<html>`，或 portal 内容找不到根主题                                                                                                           |
| INV4、INV5       | 运行时注入和清理测试                                                                                                                                                                                                                                                                                                                  | 已构建主题注入 CSS、重复提供者重复 CSS，或一次卸载移除共享样式                                                                                                |
| INV6             | `useTheme.test.tsx`                                                                                                                                                                                                                                                                                                                   | 提供者消费者观察 DOM，或回退观察器泄漏                                                                                                                        |
| INV7             | `useTheme.test.tsx` 的 "modes outside light\|dark\|system"：`"banana"` 在浅色和深色平台偏好下，`"DARK"` 和 `""` 仅在浅色偏好下；`Theme.test.tsx` 的 "removes data-theme from `<html>` for root provider in system mode"。证据缺口：没有测试覆盖通过 `useTheme` 处于 `system` 模式的提供者，或未知值对 `<html>` 的影响（从源码读取）。 | 系统模式解析不正确、`useTheme().mode` 返回 `'light'` 或 `'dark'` 以外的任何值（例如原始未知值），或处于 `system` 或未知模式的根提供者向 `<html>` 写入强制模式 |
| INV8             | `MediaTheme.dom.test.tsx`                                                                                                                                                                                                                                                                                                             | 表面模式替换主题、丢失父组件规则或重新挂载子节点                                                                                                              |
| INV9             | 运行时/构建编译器比较                                                                                                                                                                                                                                                                                                                 | 对于同一主题，提供者挂载的 CSS 与构建的 CSS 不同                                                                                                              |
| INV10            | `AppShell.test.tsx`                                                                                                                                                                                                                                                                                                                   | 具名点忽略最近的主题，或将相等视为移动端                                                                                                                      |
| INV11            | SSR 和水合图标 fixtures                                                                                                                                                                                                                                                                                                               | 同一主题下，服务器渲染的图标与水合后的图标不同                                                                                                                |
