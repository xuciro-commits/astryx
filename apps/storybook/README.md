# /apps/storybook

用于组件开发和可视文档的 Storybook 应用。

<!-- SYNC: 当本目录中的文件发生变化时，请更新本文档。 -->

## story 的组织方式

只有一种结构，读者可以猜到任何内容的位置，视觉门禁也能找到它：

```
<Package>/<Component>/(Default | Theme Sheet | …)
<Package>/Hooks/<hook>
<Package>/Themes/<theme feature>
<Package>/Internationalization/<page>
A11y/<pattern or component>
```

- **`<Package>`** 是 `Core`、`Lab`、`Charts`、`Vega` 或 `RichText` —— 即该内容所属的发布包，绝不是“Components”这样的分类。
- **`Default` 排在最前。** 最简单、最真实的用法，也是构建者最先看到的内容。
- **`Theme Sheet` 排在第二** —— 该组件的每一个可主题化目标，以其 `.doc.mjs` 声明的所有变体和状态呈现在一个页面上。它是主题作者的参考，也是视觉门禁在 probe 主题下拍摄的界面，以此证明某个主题化目标仍然作用于像素。如果组件的 sheet 缺少某个目标，该目标就无从验证。
- **Hooks 和主题级特性不是组件**，不放在组件旁边。图标和指示器注册表、`MediaTheme`、`CodeTheme` 等位于 `Themes/` 下。
- **国际化页面**跨多个组件检查某一语言区域行为，例如 Calendar、DateInput 和 Timestamp 中的日期，因此它位于所属包的 `Internationalization/` 分组中，而不是某个组件旁边。
- **无障碍契约夹具位于 `A11y/` 下。** 它们是 a11y 审计及其浏览器规格按 story id 打开的测试夹具，不是组件文档。Storybook id 会将标题转为小写，因此 `A11y/` 和 `a11y/` 共享 id，检查同时接受两者。
- `.storybook/story-tree.test.ts` 针对构建后的索引检查这一结构，CI 在构建完成后立即在 `build-storybook` 中运行它。

### Theme Sheet 不得固定自己的主题

以朴素方式渲染组件，让工具栏驱动主题。用 `<Theme theme={…}>` 包裹自身的 story 会覆盖全局设置，工具栏无法切换它，视觉门禁也永远无法探测它——这个 story 恰恰对它看起来在协助的测试变得不可见。

```tsx
// Good — the toolbar (and the gate) control the theme
export const ThemeSheet: Story = {
  name: 'Theme Sheet',
  render: () => (
    <>
      {VARIANTS.map(v => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </>
  ),
};
```

| 文件                             | 角色 | 用途                                                    |
| -------------------------------- | ---- | ------------------------------------------------------- |
| `.storybook/main.ts`             | 配置 | Storybook Vite 集成、preview 构建目标和共享工作区别名表 |
| `.storybook/main.test.ts`        | 测试 | 源码别名覆盖率和冷克隆配置加载                          |
| `LOCAL_STARTUP_INVESTIGATION.md` | 调查 | 为什么本地 Storybook preview 会在就绪前出现             |
| `package.json`                   | 配置 | 包依赖和脚本                                            |
| `tsconfig.json`                  | 配置 | TypeScript 编译器配置                                   |
| `vite.config.ts`                 | 配置 | 带路径别名的 Vite 打包器配置                            |
