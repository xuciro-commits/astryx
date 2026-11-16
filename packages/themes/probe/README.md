# @astryxdesign/theme-probe

**这是一个测试夹具，不是任何人应该使用的主题。** 私有；永不发布。

真实主题只为其设计师所关心的内容设置样式，因此大部分可主题化的表面从未被任何真实主题覆盖；一个新加入的主题化目标从诞生起就处于未验证状态——当它失效时无人察觉，因为没有任何东西在给它设置样式。

此主题**由目标枚举生成**，因此它会为每个已声明的目标、变体和状态设置样式。明天新增的目标会在其文档落地的瞬间被覆盖，无需任何人记住。正因如此，视觉门禁才能回答“每个有文档记录的主题化目标是否仍然作用到像素上？”

每个选择器都会获得一个由名称哈希派生出的独特且刻意刺眼的颜色——两个本应属于不同元素、却实际解析为同一个元素的子目标会显示为同一种颜色，而这种问题会被统一的亮粉色主题掩盖。

```bash
pnpm visual:probe-theme          # regenerate
pnpm visual:probe-theme:check    # CI guard — fails when a target is uncovered
```

`src/probeTheme.ts` 是生成文件。请勿编辑；请改为修改 `.github/scripts/visual-gate/lib/probe-theme.mjs`。
