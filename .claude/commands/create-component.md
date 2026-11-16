# 创建 Astryx 组件

按照既定协议创建新的 Astryx 组件。

## 组件名称

$ARGUMENTS

## 说明

遵循 Astryx wiki 上记录的完整组件生命周期：

- **生命周期概览**：https://github.com/meta/astryx/wiki/Component-Lifecycle
- **规范协议**：https://github.com/meta/astryx/wiki/Component-Specification-Protocol
- **构建协议**：https://github.com/meta/astryx/wiki/Component-Build-Protocol

### 快速参考

- 彻底阅读规范——它就是约定
- 研究同一家族中的同级组件以了解模式
- 在 `packages/core/src/{ComponentName}/` 中创建文件：
  - `{ComponentName}.tsx` —— 主组件
  - `{ComponentName}.test.tsx` —— 单元测试
  - `{ComponentName}.doc.mjs` —— 类型化文档（ComponentDoc）
  - `index.ts` —— 公开导出
- 创建 `apps/storybook/stories/{ComponentName}.stories.tsx`
- 在 `packages/cli/templates/blocks/components/{ComponentName}/` 中创建展示块：
  - `{ComponentName}Showcase.tsx` —— 视觉预览（以代表性状态渲染该组件）
  - `{ComponentName}Showcase.doc.mjs` —— 必须设置 `isShowcase: true` 和 `componentsUsed: ['{ComponentName}']`
- 接入：添加到 `packages/core/src/index.ts`
- 运行 `node scripts/sync-exports.js` 更新 package.json 导出
- 运行 `pnpm build && pnpm test && pnpm lint`

### 关键约定

- **API 约定**：https://github.com/meta/astryx/wiki/API-Conventions
- **主题**：为主题目标使用 `stableClassName()`（或 `themeProps()` 辅助函数）——见 https://github.com/meta/astryx/wiki/Theming-Infrastructure
- **组合，不要重建**——使用现有的 Astryx 组件（Field、Icon 等）
- **displayName**——始终设置它
- **:hover 防护**——所有 `:hover` 都放在 `@media (hover: hover)` 中
- **间距/高程令牌**——绝不使用裸 px 或 boxShadow 字符串
