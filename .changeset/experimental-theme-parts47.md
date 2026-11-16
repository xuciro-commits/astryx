---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：单模式渐变与 token 保留另一模式、每个 AppShell 中的页面背景，以及标题颜色与类型。

- 为某个模式设置的渐变会写为背景图片（也可输入为 `background`），因此另一模式保留自己的背景颜色；每个模式的图层按模式保留写入时的状态，因此淡入到 `transparent` 的效果绝不会丢失。包含 `light-dark()` 色标的渐变不接受 `--mode`。
- 为某个模式在部件上设置的 token（包括标题颜色，以及单模式主题中的任何颜色）会在另一模式下保留 token 自身的值。
- 单模式 `background` 不再移除另一模式的单模式 `background-color`。
- 在 `app-shell` 上设置的背景会显示在每个 AppShell 变体中：外壳的页眉与侧边导航采用相同的背景（当内容在其下滚动时它们保持不透明），其主内容区域是透明的，结果中会说明这一点。
- 指定文本颜色 token 的标题颜色（`var(--color-text-secondary)`）会被接受；标题的 `--when type:` 接受 Heading 自身的类型（display-1 到 display-3）。
- `how` 会以 `background-image … --mode` 的形式为某个模式提供渐变，而部件自身渐变之下的单模式颜色会说明它不会显示。

@josephfarina
