# Next 版本 codemod

在常规功能 PR 进行期间，把新的核心 codemod 放在这里。

发布某个 codemod 的文件夹是包含该更改的目标包版本。功能 PR 不选择那个版本：main 的固定组声明就是版本归属计划，标记的发布分支在版本切割时将其冻结。贡献者在这里暂存工作；发布分支会将其提升到确切的已声明版本文件夹中。

## 编写规则

- 直接在此目录下添加新的转换模块。
- 添加或更新 `index.mjs`，使其按运行顺序导出转换。
- 遵循现有版本文件夹的模式，将测试放在每个转换旁边。
- **不要**在功能 PR 中猜测未来的 `v0.x.y` 文件夹。
- **不要**在此 README 中放置发布专属内容；它留在 `next` 中。

## 发布提升

在标记的发布分支上，`pnpm version-packages` 在将 changelog 写入版本切割所声明的版本下之后，会运行 `scripts/promote-codemod-next.mjs`。它会把除本 README 之外的每个条目复制到 `packages/cli/assets/codemods/transforms/v<declared-core-version>/`，注册该文件夹，并从 `next` 中移除已提升的文件。

Version Packages PR 会结合 changelog 审查生成的文件夹。发布之后，受信任的回合并流程会将这些已提升的文件原样带到当前的 main；它不会重新生成它们。
