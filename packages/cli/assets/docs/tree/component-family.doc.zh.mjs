// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for component-family.doc.mjs.
export const docsZh = {
  "title": "组件家族",
  "description": "当一个模块暴露多个属于同一家族的公开组件或 Hook 时，适配单组件文档。",
  "sections": [
    {
      "section": "Choose the family shape",
      "title": "选择家族结构",
      "content": [
        {
          "type": "prose",
          "text": "从一个完整的单组件文档开始。仅当一个源模块或组件目录以同一个家族的形式暴露多个公开组件或 Hook 时，才将其顶层的 `props` 转换为 `components` 数组。家族文档保留共享的使用指南；每个数组条目负责一个公开导出。"
        },
        {
          "type": "list",
          "items": [
            "将主要或最常用的导出放在首位。",
            "当该文件负责该导出的描述和签名时，使用完整条目。",
            "组件条目使用 `props`。Hook 条目使用 `params` 和 `returns`。",
            "不要添加私有实现辅助函数或不应由用户直接使用的导出。"
          ]
        },
        {
          "type": "prose",
          "text": "所有字段见 {@link schema:component-doc}。"
        }
      ]
    },
    {
      "section": "Document the family inline",
      "title": "在文档中内联记录家族",
      "content": [
        {
          "type": "code",
          "label": "components/AcmeTabs.doc.mjs"
        },
        {
          "type": "prose",
          "text": "`import` 指定的公开模块必须导出每个完整条目所命名的组件或 Hook。应用随后会按各自的名称列出、搜索并打开家族中的每个组件。模块未导出的完整条目不会被列出，`integration verify` 也不会报告它：使用 `{@command component --list}` 检查家族。当 `import` 指定的是你的打包生命周期生成的输出（例如 `dist`）时，成员会在该输出存在后被列出，`integration verify` 会按打包构建后列出的成员进行比较。"
        },
        {
          "type": "prose",
          "text": "成员的源文件是家族文档所在文件夹中（或其子文件夹中）声明它的 `.tsx` 文件：优先取家族自身的文件或 `import` 指定的模块所能到达的那个；否则取该文件夹中声明该名称的那个，例如 `import` 指定的是构建输出时。仅由打包产物或该文件夹之外的文件声明的成员仍会被列出，但没有可供 `--source` 或 `swizzle` 使用的源文件。如果某个文档文件或你的包所替换的 Core 名称已经占用了该成员的名称，则该成员不会被列出。与 Core 同名的成员需要使用 `--package` 打开。"
        }
      ]
    },
    {
      "section": "Give a member its own file",
      "title": "为成员提供独立文件",
      "content": [
        {
          "type": "prose",
          "text": "当某个家族成员需要独立文档时，将其完整条目替换为 `{name: 'MemberName'}`，并把详细信息移到同级文档中。父文档保留家族关系，但不复制子文档的内容。继续阅读 {@link generic:subcomponent}。"
        }
      ]
    }
  ]
};
