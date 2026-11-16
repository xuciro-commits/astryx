# 调色板生成器实验室

这个沙箱页面是 AST-008 的实验性决策工具。它不定义公共生成器 API，不将生成的配色采纳到主题中，也不声称某个调色板符合无障碍要求。

## 参考数据

- **Neutral — PR #5628** 是 `neutralThemePaletteReference.ts` 中提交 `b19fc7a740ee43fa52db5555ccd0ac63bd0305d4` 的 `neutralPalettes` 精确快照。将快照保留在本地，使得在 #5668 仍未合并期间比较可复现。
- **Neutral — 旧版预览** 使用 `apps/sandbox/src/app/(fullscreen)/pages/neutral-palette/page.tsx` 中的种子值以及基于 HCT 的明暗行为。
- **Stone**、**Gothic**、**Y2K** 和 **Butter** 使用各自对应的沙箱调色板页面所用的导出调色板对象。页面级模式行为以及 Butter 专属覆盖都体现在 `themeCorpus.ts` 中。

这些沙箱页面部署在 GitHub Pages 上的版本是视觉验证的参考。实验室不会在运行时获取它们，因为网络状态不能成为确定性生成的一部分。

使用 `pnpm --filter
@astryxdesign/sandbox test` 运行沙箱自有的生成器测试。

## 解读

现有主题比较会从视觉差异摘要中排除共享的黑白端点。建议的 vibrancy 值会在所选算法下最小化 5–95 色阶之间的平均 OKLab 距离。它们只是起点，并非批准或不可变的主题设置。
