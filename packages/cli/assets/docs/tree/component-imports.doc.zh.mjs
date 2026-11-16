// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for component-imports.doc.mjs.
export const docsZh = {
  "title": "解析组件导入",
  "description": "保持组件文档的导入与包导出映射一致，然后验证打包后的包。",
  "sections": [
    {
      "section": "Export the component",
      "title": "导出组件",
      "content": [
        {
          "type": "prose",
          "text": "应用会将组件文档的 `import` 字段复制到它们的代码中，因此该确切说明符必须能从你打包后的包中解析。`integration add` 会将其与 package.json 中的 `exports` 条目一起写入。"
        },
        {
          "type": "code",
          "label": "package.json"
        },
        {
          "type": "prose",
          "text": "仅当 package.json 已有 `exports` 映射时，integration add 才会写入该条目，因此每个包都应以 `\"exports\": {}` 开头。"
        },
        {
          "type": "prose",
          "text": "文件不必以其组件命名。当 `Slides.tsx` 导出 `AcmeCarousel` 且没有任何名为 `Slides` 的导出时，请将文档放在其旁边并命名为 `Slides.doc.mjs`，并将其 `name` 设为 `AcmeCarousel`：应用会以该名称列出、搜索和打开组件，`integration verify` 会检查其导入是否导出 `AcmeCarousel`。导出自身名称的文件则保留该名称。以 kebab case 命名文件的包也以同样方式工作：`acme-gallery.doc.mjs` 与 `acme-gallery.tsx` 并列，并设置 `name: 'AcmeGallery'`。"
        },
        {
          "type": "prose",
          "text": "文件名仍用于打开文档。Core 或其他文档文件已使用的名称仍归它们所有，你的包所替换的 Core 名称也是如此：若 `Badge.doc.mjs` 命名为 `AcmeBadge`，`{@command component Badge}` 会打开 Core 的 `Badge`，而使用你的包名配合 `--package` 则可访问你的文档。"
        }
      ]
    },
    {
      "section": "Verify the packed import",
      "title": "验证打包后的导入",
      "content": [
        {
          "type": "prose",
          "text": "`integration verify` 会将打包后的包解压到临时应用中，解析每个已记录的导入，并检查模块是否导出已记录的组件名称。其 `--json` 输出会按代码列出每个失败项。"
        },
        null,
        {
          "type": "list",
          "items": [
            "`component_import_unresolvable` 表示导出映射中没有已记录导入的条目。",
            "`component_export_missing` 表示模块未导出已记录的名称，或 package.json 没有导出映射。",
            "`typescript_extension_in_specifier` 表示公开导入以 `.ts` 或 `.tsx` 结尾。"
          ]
        },
        {
          "type": "prose",
          "text": "若要从包根导入，请设置 `import: '@acme/astryx-widgets'`，并从 `exports[\".\"]` 指向的文件重新导出组件。参见 {@link command:integration verify}。"
        }
      ]
    },
    {
      "section": "In global mode",
      "title": "全局模式",
      "content": [
        {
          "type": "prose",
          "text": "全局模式下：在项目之外，CLI 打印的导入会指明计算机上安装的包，新应用必须先安装这些包才能构建它们；在项目内部，只打印项目安装的包。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        }
      ]
    }
  ]
};
