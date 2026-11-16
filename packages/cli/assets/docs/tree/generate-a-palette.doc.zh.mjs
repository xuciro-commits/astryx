// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for generate-a-palette.doc.mjs.
export const docsZh = {
  "title": "生成调色板",
  "description": "把几个种子颜色变成完整的浅色和深色色阶，保存在主题文件夹中。",
  "sections": [
    {
      "section": "Generate a palette",
      "title": "生成调色板",
      "content": [
        {
          "type": "prose",
          "text": "一个主题需要几十种相关的颜色——每种品牌色在浅色和深色模式下用于背景、边框、文本和状态的各个色阶。调色板就是这一整套色阶。与其逐个手动挑选，不如指定几个种子颜色并生成其余部分，这样色阶能保持一致。"
        },
        {
          "type": "prose",
          "text": "你写一个简短配置，为每个颜色家族命名并指定其种子，然后运行 `theme palette generate`。它会把每个种子扩展成完整的浅色和深色色阶——也就是一组色阶——并把结果写入主题文件夹，供主题令牌引用（参见 {@link generic:define-the-theme}）。请把配置和生成的调色板一起保存在该文件夹中。"
        },
        {
          "type": "prose",
          "text": "最小的配置只有一个颜色家族：一个用来命名的 `id` 和一个用来生长的 `seed` 颜色。把它保存为 `themes/ocean/palette.config.json`："
        },
        null,
        null,
        null,
        {
          "type": "prose",
          "text": "该命令会写入两个文件。`ocean.palette.ts` 是主题令牌将要读取的调色板：它导出 `black`、`white` 和 `palette`——分别用于 `light` 和 `dark` 的 21 级色阶（色标 `0` 到 `100`）。旁边的 `.receipt.json` 记录精确的种子和设置，方便你以后重新生成同一个调色板。除非传入 `--overwrite`，否则再次运行不会改动这两个文件。"
        },
        {
          "type": "prose",
          "text": "加上 `--preview <file>.html` 还能得到一个展示所有色阶的网页，方便你在浏览器里直观查看调色板。把它写到 `themes/` 之外，以免随包发布。所有选项见 {@link command:theme palette generate}，它读取的配置见 {@link function:generateTonalPalette}。"
        }
      ]
    }
  ]
};
