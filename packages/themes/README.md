# 主题

Astryx 的现成主题包。主题是一个 CSS 自定义属性覆盖层：安装一个主题，将其构建产物对象传给 `Theme`，并导入其 `theme.css`。完整设置见 [core 快速开始](../core/README.md#快速开始)。要创建自己的主题，请安装 `@astryxdesign/cli` 并运行 `astryx docs theme`。

| 主题                             | 包                              | 风格                                                                                         |
| -------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| [Butter](butter/README.md)       | `@astryxdesign/theme-butter`    | 金色黄油质感表面搭配蓝色点缀；展示字体用 Sarina，标题和正文用 Outfit。                       |
| [Chocolate](chocolate/README.md) | `@astryxdesign/theme-chocolate` | 温暖的巧克力色与舒适米色；标题用 Fraunces，正文用 Albert Sans。                              |
| [Gothic](gothic/README.md)       | `@astryxdesign/theme-gothic`    | 仅暗色的氛围主题，深蓝灰色表面搭配柔和分类色点缀；字体为 Manufacturing Consent 和 Fustat。   |
| [Matcha](matcha/README.md)       | `@astryxdesign/theme-matcha`    | 大地绿色调色板；标题用 Playwrite US Trad，正文用 DM Sans。                                   |
| [Neutral](neutral/README.md)     | `@astryxdesign/theme-neutral`   | 柔和极简的美学，采用 Figtree 字体。                                                          |
| [Stone](stone/README.md)         | `@astryxdesign/theme-stone`     | 温暖的石头色与石板色调；标题用 Montserrat，正文用 Figtree。                                  |
| [Y2K](y2k/README.md)             | `@astryxdesign/theme-y2k`       | 俏皮的 Y2K 流行风格，柔和的长春花蓝主体、炭灰色点缀、全息分类色彩、Poppins 和 Crimson Text。 |

`@astryxdesign/theme-probe` 是一个私有的自动生成测试夹具，为视觉门禁中的每个已声明主题目标提供样式。它从不发布，也不是供应用使用的主题。

主题的规范记录位于其包旁边，路径为 `<theme>/<theme>.spec.md`；[`docs/themes/`](../../docs/themes/README.md) 是指南和索引。
