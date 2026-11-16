// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for migration-verification.doc.mjs.
export const docsZh = {
  "title": "验证",
  "description": "迁移后的验证清单，以及一段可粘贴到你的编程工具中的 AI 迁移提示词。",
  "sections": [
    {
      "section": "Verification Checklist",
      "title": "验证清单",
      "content": [
        {
          "type": "list",
          "items": [
            "在浅色和深色模式下运行应用，检查表面、边框、文本、图标、悬停状态、焦点环和状态颜色是否协调统一。",
            "从应用外壳中打开命令面板，在其中输入内容，用键盘选择条目，并确认焦点返回触发按钮。",
            "检查 SideNav 在折叠、展开、激活、悬停、嵌套和移动端状态下的表现。",
            "在 jsdom 和真实浏览器中验证设置弹出框和对话框，因为原生 dialog 和 [`Popover`](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) API 可能需要测试兼容层。",
            "每迁移一个路由后，搜索是否残留硬编码的 Tailwind 颜色、任意十六进制值以及一次性的悬停颜色。",
            "对每个迁移的路由运行组件测试、构建，并至少完成一次浏览器截图检查。"
          ]
        }
      ]
    },
    {
      "section": "AI Migration Prompt",
      "title": "AI 迁移提示词",
      "content": [
        {
          "type": "prose",
          "text": "使用 AI 编程代理时，要给它一个明确的迁移循环，而不是要求它重写整个应用。"
        },
        {
          "type": "code",
          "label": "把这段内容粘贴到你的 AI 中"
        }
      ]
    }
  ]
};
