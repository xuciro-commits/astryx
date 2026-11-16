// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for define-the-theme.doc.mjs.
export const docsZh = {
  "title": "定义主题",
  "description": "让主题令牌指向调色板，只将 light-dark() 用于颜色，并避免使用 Core 内部实现。",
  "sections": [
    {
      "section": "Map the palette to tokens",
      "title": "将调色板映射到令牌",
      "content": [
        {
          "type": "prose",
          "text": "主题令牌是一个具名槽位，Astryx 组件会从中读取值——例如强调色用 `--color-accent`，等等。组件从不直接读取你的调色板，而是读取令牌。定义主题就是让每个令牌指向调色板中的某个色阶，让组件用上你的颜色。"
        },
        {
          "type": "prose",
          "text": "在 `oceanTheme.ts` 中导入调色板，并让令牌指向它的色阶。每个令牌接受一个 `[light, dark]` 对——浅色模式用哪个色阶、深色模式用哪个色阶。"
        },
        null,
        {
          "type": "prose",
          "text": "本地导入必须留在主题文件夹内。任何离开该文件夹的导入（例如 `../../shared/colors`）都会以 `invalid_theme` 失败，并且包中的每个主题都会从 `theme list` 中消失。`{@command theme template}` 会写入一个解释每个 `defineTheme` 字段的文件。完整令牌集和组件主题化请阅读 {@link generic:author-a-theme}。"
        }
      ]
    },
    {
      "section": "Build on another theme",
      "title": "基于其他主题构建",
      "content": [
        {
          "type": "prose",
          "text": "要基于现有主题创建主题，可用 `extends` 继承它：导入基础主题，只覆盖你要更改的令牌。用 `integration add theme ocean-contrast` 添加派生主题，并从基础主题的构建包导出中导入它，因为本地导入不能离开主题文件夹。派生主题会与基础主题保持实时链接，并在重新构建时吸收其后续更改——这与 `--from` 不同，后者会复制一份分叉（{@link generic:add-a-theme}）。"
        },
        null
      ]
    },
    {
      "section": "Keep light-dark() to colors",
      "title": "light-dark() 仅用于颜色",
      "content": [
        {
          "type": "prose",
          "text": "每个 `[light, dark]` 对都会编译成一个 `light-dark()` 值，它只切换颜色。请给它颜色值。对于不是纯色的值——例如渐变——请把 `light-dark()` 放在每个色标上，而不是包住整个值：`light-dark()` 接受两种颜色，包住整个渐变会使该值在令牌被使用的地方变得无效，而 `theme build` 不会给出警告。"
        }
      ]
    },
    {
      "section": "Do not set Core private variables",
      "title": "不要设置 Core 私有变量",
      "content": [
        {
          "type": "prose",
          "text": "Core 私有变量以 `--_` 开头，例如 `--_field-radius`。它们属于内部实现，可能在任何 Core 版本中变化，因此 `theme build` 会拒绝设置了这类变量的主题（`ERR_THEME_INVALID`，并列出每一个），且不会写入任何内容。请改为设置标准 CSS 属性——如 `borderRadius`、`padding`——让构建在 Core 需要的地方生成内部变量。"
        }
      ]
    },
    {
      "section": "Declare the peer dependencies",
      "title": "声明对等依赖",
      "content": [
        {
          "type": "prose",
          "text": "主题会导入 `@astryxdesign/core/theme`，因此请将 Core 声明为 peer 依赖，并写上你的主题所测试的 Core 版本范围——用范围而非精确版本，这样 Core 的补丁版本就不会迫使你重新发布。`integration add theme` 已经声明了用于读取主题的可选 peer 依赖 `@astryxdesign/cli`："
        },
        null
      ]
    }
  ]
};
