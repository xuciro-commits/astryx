# 系统规格

本目录存放针对影响广泛的共享系统变更的记录。每个规格位于 `docs/specs/<id>-<slug>/spec.md` 之下；可选的同级 `plan.md` 仅用于多步骤实现。

组件与模块的契约位于 `docs/specs/components/` 之下，每个组件一个文件夹，其中核心记录与各平台的记录并排放置（`components/Avatar/Avatar.spec.md` 与 `components/Avatar/Avatar.swift.spec.md`）。[`docs/README.md`](../README.md) 给出了目录布局。

模板单独放在 `docs/templates/knowledge/` 之下。现有记录会依据 `docs/schemas/knowledge/` 进行校验；修改模板不会悄然改变已接受的历史。

当一项工作涉及不止一个组件、共享基础构件、架构、公共 API 策略、主题化、无障碍策略、分发或生命周期时，才适合编写系统规格。用于恢复既有契约的聚焦修复不需要新的规格。

只有带 `authority: current` 的记录才具有权威性。草稿记录可能带有尚未解决的证据或负责人决策；它们不约束评审。归档记录会说明其为何不再具有约束力，并在存在替代记录时给出链接。首次提升为 `current` 需要负责人明确批准。
