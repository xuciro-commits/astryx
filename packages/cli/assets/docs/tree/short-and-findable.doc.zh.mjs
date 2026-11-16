// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for short-and-findable.doc.mjs.
export const docsZh = {
  "title": "简短且易于查找",
  "description": "编写简短的小节，让人和智能体都能通过搜索找到。",
  "sections": [
    {
      "section": "Keep each read short",
      "title": "保持每次阅读简短",
      "content": [
        {
          "type": "prose",
          "text": "读者一次只打开一个小节，所以每个小节只讲一个观点，并控制在 30 行左右。`{@command doctor}` 会在任何读取内容超过 32 KB 时发出警告。"
        },
        {
          "type": "list",
          "items": [
            "当一个小节需要包含第二个观点时，把它拆成两个小节。",
            "一个主题保留少量小节。当小节超过五个时，把它拆分为文档部分中的更多指南。",
            "包含多个小节的主题会按其小节列表读取。读者可以通过小节键打开单个小节，或用 `--full` 打开整个主题。"
          ]
        },
        null
      ]
    },
    {
      "section": "Lead with the summary",
      "title": "以摘要开头",
      "content": [
        {
          "type": "prose",
          "text": "一个小节的第一个正文块或其第一个列表项，就是它在小节列表和搜索结果中的摘要。用一两句话让它回答该小节的问题。"
        },
        {
          "type": "list",
          "items": [
            "摘要会在约 240 个字符处截断。",
            "以代码块开头不算数：摘要来自下一个正文块。",
            "以答案开头，而不是背景。"
          ]
        },
        null
      ]
    },
    {
      "section": "Make docs findable",
      "title": "让文档易于查找",
      "content": [
        {
          "type": "prose",
          "text": "在包含多个小节的主题中，搜索会把标题匹配查询、或用反引号点出该查询的小节排在正文词语之前。为每个小节起一个读者会搜索的任务型标题。"
        },
        {
          "type": "list",
          "items": [
            "用读者会输入的词来命名任务，例如「Deploy to production」。避免使用「概览」或「详情」这类标题。",
            "把字段名、文件名和错误码写在反引号中，例如 `deployTarget`：在包含多个小节的主题中，搜索会把每一个都当作关键词。",
            "摘要和正文中的其他词也会匹配，但排名低于标题和标识符。每个搜索命中下方都会显示摘要，所以要让它回答查询。"
          ]
        }
      ]
    },
    {
      "section": "Test with search",
      "title": "用搜索测试",
      "content": [
        {
          "type": "prose",
          "text": "像新读者那样测试文档：搜索问题，并检查第一个命中是否回答了它。包含多个词的查询要加引号。"
        },
        null,
        {
          "type": "list",
          "items": [
            "这个查询会返回这些指南中展示如何放置文档的小节。",
            "在安装了你的包的应用中运行同样的搜索；见 {@link generic:test-in-an-app}。"
          ]
        }
      ]
    }
  ]
};
