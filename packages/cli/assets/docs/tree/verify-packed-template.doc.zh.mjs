// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for verify-packed-template.doc.mjs.
export const docsZh = {
  "title": "验证打包后的包",
  "description": "在发布之前发现缺失的文件、导出和 CLI 要求，并了解哪些内容仍需要应用测试。",
  "sections": [
    {
      "section": "Run the package check",
      "title": "运行包检查",
      "content": [
        null,
        {
          "type": "prose",
          "text": "`integration verify` 会运行 `{@pm-only npm \"the tarball the registry receives\" pack}`（包括生命周期脚本），把 `.tgz` 文件解包到一个未安装依赖的临时应用中，并检查解包后的集成。它不会发布任何内容，并会删除 `.tgz` 文件和临时应用。"
        },
        {
          "type": "list",
          "items": [
            "它会校验清单、每个模板文档及其源文件，以及模板目录。",
            "它会检查清单和每个模板文件是否都在 `.tgz` 文件中。",
            "它会检查每个打包后的模板是否与工作副本保持相同的 id、类型、`name` 和 `replaces`。它不比较模板源代码或其他文档字段。",
            "它会通过每个模板在解包后包中的公共包路径来解析该模板。",
            "它会检查解析出的模板模块是否具有默认导出。",
            "它会检查模板替换等功能所需的 CLI 对等依赖。"
          ]
        },
        {
          "type": "prose",
          "text": "每次失败都会打印一行带消息的 `[fail]`；添加 `--json` 可以查看每个问题代码。{@link generic:troubleshooting} 列出了常见消息及其修复方法。发布前请修复所有错误，并审查所有警告。"
        }
      ]
    },
    {
      "section": "Know what it does not prove",
      "title": "了解它不能证明什么",
      "content": [
        {
          "type": "prose",
          "text": "`integration verify` 检查打包后的模板及其公共入口。它不会把模板复制到应用中，也不会运行浏览器构建，因此无法证明以下内容。"
        },
        {
          "type": "list",
          "items": [
            "相对辅助文件或样式表能否在复制后保留。",
            "复制后的文件能否在每种受支持的应用工具链中通过类型检查。",
            "包自带的 CSS、字体、图标、图片或媒体能否在浏览器中加载。",
            "布局、颜色模式、键盘和指针输入以及真实内容能否正常工作。",
            "模板 id 是否与 Core 冲突，或者是否存在 `replaces` 目标。请运行 `{@command doctor integration templates}` 检查这些内容。",
            "模板在质量方面的评分如何。"
          ]
        }
      ]
    }
  ]
};
