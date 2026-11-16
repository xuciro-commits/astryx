// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for fonts-and-assets.doc.mjs.
export const docsZh = {
  "title": "字体与资源",
  "description": "在主题中指定字体，然后导出一个可选的字体样式表，让 `theme add` 在导入构建后的主题时一并导入。",
  "sections": [
    {
      "section": "Name the font",
      "title": "指定字体",
      "content": [
        {
          "type": "prose",
          "text": "主题在 `typography` 中指定字体：`body`、`heading` 和 `code`，每个都包含 `family` 和 `fallbacks`。它们设置每个组件都会读取的 `--font-family-*` 令牌。务必提供真实的 `fallbacks`，以便在字体加载完成之前或永远无法加载时文本仍然可读。省略时，`heading` 会继承 `body` 的 `family` 和 `fallbacks`。"
        },
        null,
        {
          "type": "prose",
          "text": "完整的字体层级和字体角色见 {@link generic:author-a-theme}。"
        }
      ]
    },
    {
      "section": "Ship the font loader",
      "title": "发布字体加载器",
      "content": [
        {
          "type": "prose",
          "text": "指定字体族并不会加载它。当主题使用非系统字体时，在构建后的模块和生产 CSS 旁添加 `<slug>.fonts.css`，然后将其导出为 `./themes/<slug>.fonts.css`。`theme add` 会在导入构建后的主题时一并导入该样式表。"
        },
        null,
        {
          "type": "prose",
          "text": "样式表可以包含自托管的 `@font-face` 规则，也可以导入托管样式表。托管 `@import` 很简单，但相比预连接的 `<link>` 会延迟加载；请有意识地权衡这一取舍。当 Doctor 无法证明加载器有效时——例如使用托管 `@import`，或应用自行加载字体族却没有字体样式表——它会发出警告，但该警告不会使应用失败。"
        },
        null,
        {
          "type": "list",
          "items": [
            "加载主题使用的每个字重和样式。不要让浏览器合成粗体或斜体。",
            "在打包的包中包含自托管字体文件及其许可证。",
            "保持 CSS 和字体资源具有副作用，以免打包器移除加载器。",
            "运行 `integration verify`；当导出的字体样式表无法解析时它会失败，但它不检查样式表中指定的字体文件。"
          ]
        }
      ]
    },
    {
      "section": "Verify in an app",
      "title": "在应用中验证",
      "content": [
        {
          "type": "prose",
          "text": "发布前，运行 `integration verify`。然后在干净的应用中安装该包，运行 `theme add`，应用生成的主题，并在浏览器中打开。源代码、打包导出和应用结果构成一条链路；最后一步也要检查。"
        },
        {
          "type": "list",
          "items": [
            "文本以指定的字体族、每个字重和样式渲染——斜体字面能正确解析，而不是合成的倾斜。",
            "每个字体请求都成功；没有任何内容静默回退到系统字体。",
            "颜色组合在浅色和深色模式下仍满足对比度。"
          ]
        }
      ]
    }
  ]
};
