---
schema_version: 3
template_version: 7
kind: component
id: component:Tour
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-11
owners: [cixzhang]
review_triggers: [behavior, accessibility]
verified_by:
  [
    packages/lab/src/Tour/Tour.test.tsx,
    packages/lab/src/Tour/__tests__/TourCardTarget.interaction.browser.spec.ts,
  ]
modules: []
families: [family:overlay-dismissal]
design_specs: []
architecture: []
contributing: []
system_specs: []
---

# Tour component contract

## Contract at a glance

| Area                    | Contract                                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 本记录未作改动。                                                                                                                    |
| Behavior                | 没有背景遮罩时，在页面上或目标上按下会让 tour 继续运行。有背景遮罩时，在标注框之外按下（包括目标本身）会以 `'backdrop'` 结束 tour。 |
| End-user impact         | 在普通 tour 保持打开时，用户可以使用某一步骤引入的控件，也可以使用页面其余部分；变暗的 tour 会因其外部的一次按下而结束。            |
| Builder impact          | 若应用希望按下页面或目标即可结束 tour，则传入 `hasBackdrop`，它还会使页面变暗并报告 `'backdrop'`（DEC-1）。                         |
| Compatibility/readiness | Lab。                                                                                                                               |
| Review checks           | 拒绝以下情形：没有背景遮罩时一次按下页面或目标的操作结束了 tour；有背景遮罩时在标注框之外的一次按下却让 tour 继续运行。             |
| Governing rules         | 未记录。                                                                                                                            |

本表是审查用的投影；以下正文具有权威性。

## Intent

Tour 是 lab 的引导式漫游：由一系列步骤组成，每一步都是标注框紧邻一个被高亮的目标。本记录说明在步骤的标注框之外按下会如何影响 tour，以及键盘焦点能否离开标注框。使用方的用法见 `Tour.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：无背景遮罩的 tour 为 `no`，即在页面上或目标上按下会使其继续运行（FR1、DEC-1）。
- 兼容性类别：行为性，Lab。
- 受控/非受控行为：未变；`isActive` 与 `onDismiss` 归应用所有。
- 迁移决策：DEC-1。若应用需要外部按下以结束 tour，则传入 `hasBackdrop`，它还会使页面变暗，并报告 `'backdrop'` 而不是 `'close'`。

## Ownership boundary

**拥有**

- 步骤标注框之外的一次按下是否会结束 tour。
- 在没有背景遮罩时，键盘焦点能否离开步骤的标注框（AR1）。

**不拥有 / 非目标**

- 标注框的放置位置、步骤开始或 tour 结束时焦点去哪里，以及步骤控件。未在此记录。
- Escape，它通过共享的层关闭栈（`family:overlay-dismissal`）结束 tour。

## Public concepts

| Concept  | Closed values or states | Meaning                                             | Availability by variant/orientation/state | Default | Owner            | Stability    | Invalid-value behavior |
| -------- | ----------------------- | --------------------------------------------------- | ----------------------------------------- | ------- | ---------------- | ------------ | ---------------------- |
| 背景遮罩 | on、off                 | 该步骤是否使页面变暗，并在标注框之外按下时结束 tour | 每个步骤                                  | off     | `component:Tour` | experimental | 不适用                 |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                            | Basis |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| FR1 | 没有背景遮罩时，在页面上或该步骤的目标上按下不得结束 tour。有背景遮罩时，在标注框之外的任何位置按下（包括目标）都必须以 `'backdrop'` 结束 tour。这适用于每一种指针。 | DEC-1 |

## Accessibility contract

- **AR1 — 页面保持可用。** 没有背景遮罩时，键盘焦点可以离开标注框进入页面与目标，并且在那里按下不会结束 tour（FR1）。

## Design relationships

| Anatomy or state | Design requirement | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------ | ------------------------ | -------------- | ------------------ |
| 背景遮罩         | 未记录             | 不适用                   | supporting     | FR1                |

组件实现设计要求，但不复制其理由。

## Family and system relationships

- `family:overlay-dismissal` 通过共享的关闭栈拥有 Escape。该步骤采用它，而本记录只拥有该步骤的外部关闭（FR1）以及焦点能否离开标注框（AR1）。

## Verification map

| Contract | Verification                                                                                                                                                                                    | Representative states            | Mutation or failure expectation                                    | Audit section |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------ | ------------- |
| FR1      | "在目标被按下时保持 tour 运行"；"在页面被按下时保持 tour 运行"；"点击背景遮罩时以 \"backdrop\" 结束"；"按下引入的控件会保持 tour，Escape 会结束它"；"在变暗的页面上按下会结束带背景遮罩的 tour" | 无背景遮罩与有背景遮罩；卡片目标 | 一次使普通 tour 结束、或使变暗的 tour 继续运行的按下，会判定为失败 | 无            |
| AR1      | "让 Tab 越过该步骤进入页面"；"Tab 离开标注框进入页面"                                                                                                                                           | 无背景遮罩                       | 把焦点留在标注框内会判定为失败                                     | 无            |

## Decision log

### DEC-1 — A press does not end a tour without a backdrop

**决策者：** `cixzhang`，2026-11-04

**依据：** 仅限 lab 的行为，依据拥有者的长期 lab 授权：“仅限 lab 的任何内容都可以通过”。依据该长期 lab 授权提升为 current。

**决策：** 步骤是一个非模态层，没有轻触关闭。没有背景遮罩时，在页面上或目标上按下都会让 tour 继续运行，适用于每一种指针。有背景遮罩时，变暗的遮罩会捕获每一次按下（包括目标上的），并以 `'backdrop'` 结束 tour。

**已否决：** 在没有背景遮罩时，任何按下都结束 tour，这会在用户使用该步骤引入的控件时结束 tour。

## Open questions

无。

## Content boundary

本文件不复制使用方的 prop 表/示例、当前审查结果、实现步骤或 family/system 规则。它链接到它们的所有者。
