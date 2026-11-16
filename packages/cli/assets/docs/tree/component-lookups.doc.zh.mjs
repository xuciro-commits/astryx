// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for component-lookups.doc.mjs.
export const docsZh = {
  "title": "组件查找",
  "description": "查找一个或多个精确的组件标识，选择聚焦的投影模式，并处理完整的批量回执。",
  "sections": [
    {
      "section": "Look up several components",
      "title": "查找多个组件",
      "content": [
        {
          "type": "prose",
          "text": "`{@command component}` 接受精确选择器作为可变数量的位置参数。不带选择器时，它会浏览目录。只有一个选择器时，它保持常规的单组件响应。有两个或更多选择器时，它会打印一份完整且有序的批量回执。"
        },
        {
          "type": "code",
          "label": "多个组件文档"
        },
        {
          "type": "prose",
          "text": "每个选择器按输入顺序获得一行。重复的选择器仍保留为重复行。缺失或有歧义的组件不会隐藏成功的相邻行，也不会阻止后续选择器解析。"
        },
        {
          "type": "prose",
          "text": "在任何投影模式下，一个批次最多接受 100 个选择器（包括重复项）。更大的请求会在任何组件解析之前返回顶层 `ERR_INVALID_ARGUMENT`，不会发出 `component.batch` 回执，也不会有部分结果。"
        },
        {
          "type": "prose",
          "text": "聚焦组件控制项会应用于每个找到的行。使用与单个组件相同的控制项："
        },
        {
          "type": "code",
          "label": "聚焦批量查找"
        }
      ]
    },
    {
      "section": "Selector forms",
      "title": "选择器形式",
      "content": [
        {
          "type": "prose",
          "text": "选择器是精确的组件标识，而不是自由文本搜索。请使用以下形式之一："
        },
        {
          "type": "list",
          "items": [
            "`Button` 表示未限定包名的组件名称。",
            "`widgets/Button` 表示未使用作用域的包中的组件。",
            "`@acme/widgets/Button` 表示作用域包中的组件。",
            "`@acme/widgets@1.2.3/Button` 表示要求使用该精确的已安装包版本。"
          ]
        },
        {
          "type": "prose",
          "text": "版本限定的是包，而不是组件。查找不会回退到另一个已安装版本。未限定名称如果由多个已安装包拥有，则会标记为 `ambiguous` 并列出所有候选项。请使用带包名的选择器或 `--package` 来选择其中一个。"
        },
        {
          "type": "prose",
          "text": "`{@command discover}` 仍然是自由文本的包发现功能。它的词组成一个查询，而不是组件批量选择器。"
        }
      ]
    },
    {
      "section": "Batch output and exit status",
      "title": "批量输出与退出状态",
      "content": [
        {
          "type": "prose",
          "text": "JSON 使用 `component.batch`，包含 `{count, results}`。每一行都会回显 `selector`，并有一个状态：`found`、`not_found`、`ambiguous` 或 `error`。找到的行在 `result` 下携带常规的单组件 `{type, data}`。失败的行携带 `code` 和 `error`，以及可用时的 `suggestions` 或 `candidates`。"
        },
        {
          "type": "code",
          "label": "结果与重复项示例"
        },
        {
          "type": "code",
          "label": "完整的失败 JSON 回执"
        },
        null,
        {
          "type": "code",
          "label": "文本模式下的同一回执"
        },
        {
          "type": "prose",
          "text": "CLI 会先输出每一行，然后在任何一行不是 `found` 时以退出码 1 结束。这包括混合回执以及所有行都失败的回执。JSON 和文本使用相同的退出状态。所有行都是 `found` 的批次以退出码 0 结束。"
        }
      ]
    },
    {
      "section": "Programmatic API",
      "title": "编程式 API",
      "content": [
        {
          "type": "prose",
          "text": "参数形状决定响应形状。省略参数可获取目录，传入字符串则得到现有的单组件响应，传入数组则得到 `component.batch`。数组始终表示批量，包括空数组和单元素数组，因此筛选选择器列表不会悄悄改变响应类型。已发布的 `ComponentBatchResponse` 细化了共享的 `BatchResponse` 和 `BatchRow` 类型。"
        },
        null,
        {
          "type": "code",
          "label": "精确的空数组响应"
        },
        {
          "type": "code",
          "label": "处理每一行且不丢失部分结果"
        }
      ]
    }
  ]
};
