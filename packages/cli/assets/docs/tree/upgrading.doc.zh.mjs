// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for upgrading.doc.mjs.
export const docsZh = {
  "title": "升级",
  "description": "针对每个 Astryx 版本更新你的包，并帮助应用随之升级。",
  "sections": [
    {
      "section": "Update for a new Astryx release",
      "title": "为新版 Astryx 更新",
      "content": [
        {
          "type": "prose",
          "text": "当 Astryx 发布新版本时，升级你的 devDependencies、重新运行各项检查、放宽 peer 依赖范围，并为每项会破坏应用的变更发布一个 codemod。"
        },
        null,
        {
          "type": "list",
          "items": [
            "运行 {@link generic:checks} 中的每一项检查，而不只是示例中展示的那些。",
            "Codemod 文件夹按 Core 版本命名：{@link generic:codemods}。",
            "将结果作为你的包的新版本发布；参见 {@link generic:publishing}。"
          ]
        }
      ]
    },
    {
      "section": "Upgrade an app",
      "title": "升级应用",
      "content": [
        {
          "type": "prose",
          "text": "应用安装新的 Core 后，`{@command upgrade}` 会运行它所跨越版本的 codemod。默认是试运行；`--apply` 才会写入更改。"
        },
        null,
        null,
        {
          "type": "list",
          "items": [
            "`--from` 是应用之前使用的 `@astryxdesign/core` 版本，目标是已安装的 Core。",
            "`--integration` 指定你的包名。没有它，或者 `astryx.config` 中没有 `integrations` 条目时，升级会跳过你的 codemod，即使应用已安装你的包也是如此。",
            "`<n>` 包含 Core 针对相同版本的 codemod，它们会先运行。",
            "将此命令写入你的发布说明。"
          ]
        }
      ]
    },
    {
      "section": "Know which files upgrades skip",
      "title": "了解升级会跳过哪些文件",
      "content": [
        {
          "type": "prose",
          "text": "升级永远不会写入应用标记为生成、vendored 或忽略的文件。当这样的文件仍需要 codemod 变更时，升级会以 `ERR_CODEMOD_PROTECTED` 停止，退出码为 1。"
        },
        {
          "type": "list",
          "items": [
            "生成：文件顶部的 `@generated` 注释，或 `.gitattributes` 中的 `linguist-generated`。",
            "Vendored：`.gitattributes` 中的 `linguist-vendored`。",
            "忽略：`.gitignore` 或 `.hgignore` 中的匹配项。"
          ]
        },
        null,
        {
          "type": "prose",
          "text": "升级仍会写入其他所有文件。其选项和退出码见 {@link command:upgrade}。"
        }
      ]
    }
  ]
};
