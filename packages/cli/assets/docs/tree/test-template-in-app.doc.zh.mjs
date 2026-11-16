// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for test-template-in-app.doc.mjs.
export const docsZh = {
  "title": "在应用中测试",
  "description": "证明模板能按应用实际使用的方式工作：从打包好的包安装、复制、构建并渲染。",
  "sections": [
    {
      "section": "Install the packed package",
      "title": "安装打包好的包",
      "content": [
        {
          "type": "prose",
          "text": "按照 {@link generic:test-in-an-app} 中的说明，在一个干净的应用中安装打包好的包。同时安装复制出的源码所导入的每个库，例如它的图标库。每次修改后都重新打包并重新安装。"
        }
      ]
    },
    {
      "section": "Copy the template",
      "title": "复制模板",
      "content": [
        null,
        {
          "type": "list",
          "items": [
            "确认复制出的文件：`src/app/acme-dashboard/page.tsx` 和 `src/components/acme-stat-card.tsx`。",
            "检查复制出的源码中的占位符替换和相对引用。",
            "将复制出的区块导入真实页面。从未被导入的文件就不算经过测试。"
          ]
        }
      ]
    },
    {
      "section": "Build every supported app",
      "title": "构建每个受支持的应用",
      "content": [
        {
          "type": "prose",
          "text": "在集成支持的每个框架或打包器中运行类型检查（`{@pm exec tsc --noEmit}`，或应用自己的脚本）和生产构建。一个工具链通过并不能证明另一个也能通过。"
        },
        null,
        {
          "type": "list",
          "items": [
            "每个导入都能从复制后的位置解析。",
            "生产构建保留必需的副作用 CSS。",
            "没有导入绕过 `exports`，也没有依赖只能通过工作区提升（hoisting）解析。"
          ]
        }
      ]
    },
    {
      "section": "Render the behavior matrix",
      "title": "渲染行为矩阵",
      "content": [
        {
          "type": "table",
          "headers": [
            "维度",
            "必需检查"
          ],
          "rows": [
            [
              "宽度",
              "宽屏和窄屏；包含最小受支持视口"
            ],
            [
              "颜色",
              "所有受支持的颜色模式和主题"
            ],
            [
              "输入",
              "主要任务的键盘和指针操作"
            ],
            [
              "内容",
              "该模式支持的逼真、空、长文本、加载和错误状态"
            ],
            [
              "资源",
              "CSS、字体、图标、图片、海报和视频请求均成功"
            ],
            [
              "运行时",
              "没有控制台错误、hydration 不匹配或缺少 Provider 的失败"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "检查渲染后的层级、阅读顺序、焦点顺序、裁剪、溢出和回退状态。仅一个默认状态的截图并不构成完整测试。"
        }
      ]
    },
    {
      "section": "Grade the result",
      "title": "评估结果",
      "content": [
        {
          "type": "prose",
          "text": "使用本次测试的证据评估确切的打包版本（{@link namespace:write-good-templates}）。"
        }
      ]
    }
  ]
};
