# 使用可信发布发布到 npm

公开的[发布流程](https://github.com/meta/astryx/wiki/Release-Process)是运营权威。本页解释仓库和 npm 机制。

Astryx 通过 npm 可信发布（OIDC）从 GitHub Actions 发布其公共 `@astryxdesign/*` 包。CI 不携带长期有效的 npm 发布令牌。每个稳定包都从不可变的发布标签构建，并附来源信息发布。

## 发布顺序

1. 在当前 `main` 的确切提交上运行规范的全范围 `release-check`。该提交还需要 Main 工作流的一次通过的全量单元运行：每当对 main 顶端运行 release-check（包括个人发起的检查）时，main 的调度器都会在该提交仍处于顶端的大约 15 分钟内派发一次。发布所有者也可以在自己的检查旁边派发 Main 工作流，并将 `sha` 设为受检查的提交，这会精确测试该提交；不带 `sha` 的派发测试启动时 main 的顶端，不构成凭据。只能从同时具备二者的 SHA 切分，且该 SHA 仍在当前 `main` 历史中；稳定发布拒绝缺少二者的切分提交。次要版本切分还要求发布所有者 Cindy 在创建分支前立即明确签署确切的 `vX.Y.0`；计划性或常设授权永远不能替代该签署。
2. 创建唯一的带标记的 `release/vX.Y.Z` 分支。其版本是切分提交声明的固定组版本。标记和计划冻结切分 SHA、Changeset 路径和哈希、分支身份以及计划摘要。
3. 在该分支上运行 `pnpm version-packages`。它按声明的层级接纳冻结的 Changesets，在已声明的版本下写入变更日志，提升暂存的 codemods，刷新精确的内部版本固定，并仅删除冻结的 Changesets。它从不选择或提升版本。在 Version Packages PR 合并前刷新并验证锁文件。
4. 在生成的 PR 合并前通过其公共编辑门禁，这样失败的标准会在该 PR 上修复，而不是事后移动发布头。对于补丁，使用 `update` 配置对完整生成的变更日志和 GitHub Release 说明草稿按公开的[博客审查评分准则](https://github.com/meta/astryx/wiki/Blog-Review-Rubric#three-required-scored-criteria)自评分，在 PR 上记录结果，并修复和重新评分每个失败的标准。次要版本要求 Cindy 对变更日志、发布说明和必需的公共博客进行明确的人工编辑批准，并以同样方式记录。然后合并生成的 PR 到发布分支，运行精确头的分支 CI，并标记和发布该精确分支头。拒绝从 `main` 稳定发布。

   在该生成的 PR 之后，分支仅在其确切门禁暴露出测试或测试框架缺陷时接纳一个额外类别：一个提交，其稳定补丁 ID 和确切的变更行摘要等于仍存在于 `main` 中的非合并提交，且其变更文件仅限非 docsite 测试或 `internal/interaction-harness/`。它不得更改产品代码、包、Changesets、断言、测试控制、超时、重试或快照。接纳它的规则必须先通过正常审查和 CI 落在 `main` 上。如果活动分支早于该规则，发布所有者在 `validate-policy-carry` 证明仅策略文件集及结果内容与已在 `main` 上合并的验证器提交中审查的分支专用捆绑完全相等后，追加一次正常的快进策略同步。该捆绑从活动发布头开始。它携带此验证器和范围变更，以及现有的未决定范围契约回退——当 GitHub 截断文件列表时将所有文件视为已变更；它不携带其他后续 `main` 工作流或产品工作。该同步不是拉取请求，不使用强制或管理员操作，不标记检查，也不授予任何发布状态。仅对于 `v0.7.12`，如果该同步上的正常 CI 证明携带的验证器不完整，或发现携带的回退缺少其匹配的工作流契约测试，则可以随后进行第二次也是最终一次经审查的快进。其确切捆绑仅更改 `active-release.mjs`、其测试和 `.github/scripts/touched-components.test.mjs`；每一行都是从已在 `main` 上合并的正常拉取请求的精确移植；CodeBunny 在快进前批准纠正提交的确切头。完整发布门禁在该头重新运行。不允许第三次同步。修复分支随后变基到最终发布头，其必需检查在该可信基础上运行。修复本身需要确切头的 CodeBunny 批准以及每个正常产品和测试通道；合并后，完整的精确头发布门禁再次运行并且必须通过。任何重试、跳过检查、管理员合并或手动覆盖都不能替代这些证明。

5. 通过 `chore/merge-vX.Y.Z-to-main` 将已发布分支输出压缩合并回当前 `main`。可信验证器要求不可变标签、活动分支头和计划摘要；确切的生成字节和冻结删除；以及保留每个切分后的 Changeset、提交、无关字段和 main 的当前版本声明。分支生命周期文件永远不会落到 `main` 上。
6. 在单独的所有者 PR 中，声明跨固定组版本、精确内部版本固定和锁文件的下一个计划。已发布版本的补丁后继是默认值。仅当所有者明确命名时，才使用次要版本后继。

切分之后，main 的声明仍是其未来计划，并可以独立于冻结的发布分支变化。必需的拉取请求 lint 不会将其与切分或最新稳定标签比较。Canary 发布拥有该排序边界：它只从一个高于稳定的普通声明发布，跳过相等情况，并在低于稳定或拆分声明时失败。可信合并回保留 main 的声明；单独的下一计划 PR 在发布后推进它。

## Changesets 与 codemods

功能 PR 使用 `pnpm changeset:new` 添加普通 Changesets。待处理的 Changesets 不选择发布版本。当包为 `0.x` 时，仅当 main 已声明下一个次要版本时，`[breaking]` 工作才可被接纳；补丁声明会拒绝它。当有 `[breaking]` Changeset 待处理时，将次要计划降为补丁的 PR 本身会被拒绝。

未发布变更的核心 codemods 暂存在 `packages/cli/assets/codemods/transforms/next/` 中。在 Version Packages PR 期间，`pnpm version-packages` 在写入变更日志后运行 `scripts/promote-codemod-next.mjs`。它将除 `README.md` 外的每个暂存条目复制到 `transforms/v<declared-version>/`，从 `next` 清除已提升的文件，并更新注册表。随变更日志一起审查这些生成文件。

## 稳定与 Canary 发布

两条发布路径都位于 `.github/workflows/release.yml` 中，因为 npm 每个包只允许一个可信 GitHub 工作流。

- **稳定：** 从不可变 `vX.Y.Z` 标签显式派发，带有确切的发布分支、版本、头、标签和计划摘要。它发布 `latest`。
- **Canary：** 最多每小时从 main 的顶端发布，或按需从 `main` 发布（使用 `channel: canary` 派发）。仅当声明严格高于最新稳定标签时，它才将 `<declared-version>-canary.g<short-sha>` 发布到 `canary`。它从不授权或改变稳定发布状态。

发布步骤使用 pnpm 原生发布：

```sh
pnpm publish ./packages/<package> \
  --tag latest --provenance --access public --no-git-checks
```

## 可信发布者设置

信任按包配置。它必须指定 `release.yml` 并允许直接 `npm publish`。新的公共包必须先存在于 npm 上才能注册信任，因此每个新包需要由 npm 组织所有者在其自己的终端中运行一次（npm 会在浏览器中打开只有所有者才能完成的双因素提示）：

```sh
npm i -g npm@latest
npm --version   # 11.15 or later
npm login --registry https://registry.npmjs.org
node scripts/npm/setup-trusted-publishing.mjs
node scripts/npm/setup-trusted-publishing.mjs \
  --bootstrap --setup-trust --workflow release.yml
```

- 默认调用仅执行审计。
- `--bootstrap` 使用已废弃的 `0.0.0-bootstrap.0` 占位符在 `bootstrap` dist-tag 下认领缺失的包名。npm 会将包的第一个版本设为 `latest`，因此对该包的普通安装会解析到空占位符，直到该包首次稳定发布。
- `--setup-trust` 为 `meta/astryx` 注册 `release.yml`，并允许直接发布。脚本拒绝低于 11.15 的 npm：较旧的 npm 会忽略发布权限，创建只能暂存发布的发布者，并将每个现有发布者列为冲突。
- 仅在有意替换现有信任记录时使用 `--replace`，绝不要用它清除低于 11.15 的 npm 报告的冲突。

然后在 npmjs.com 上打开包的可信发布者设置（`https://www.npmjs.com/package/<name>/access`），确认 `meta/astryx` 的 `release.yml` 条目允许 `npm publish`，而不仅仅是 `npm stage publish`。同一页面也是脚本无法完成时的手动路径：添加一个 GitHub Actions 发布者，所有者 `meta`、仓库 `astryx`、工作流 `release.yml`、无环境，并允许 `npm publish`。

npm 会使 48 小时内没有发布验证过的新可信发布者过期。下一次 canary（每小时运行，或从 `main` 的 canary 派发）会发布包的 canary 并验证它。如果该窗口内没有 canary 发布，请重新创建发布者。

注册表读取可能在几分钟内持续将刚创建的包报告为缺失。在该窗口内重新运行 `--bootstrap` 会为占位符版本得到 `409`；名称已被认领，脚本会继续进入信任设置。

仓库固定 pnpm 11。CI 的 Node 系列必须捆绑 npm 11.5.1 或更高版本以进行 OIDC 发布；本地信任设置命令要求 npm 11.15 或更高版本。
