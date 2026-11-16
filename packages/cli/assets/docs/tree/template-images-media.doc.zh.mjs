// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for template-images-media.doc.mjs.
export const docsZh = {
  "title": "图片和媒体",
  "description": "确保每个图片和视频在复制后仍然可用，或者成为应用会替换的明确占位符。",
  "sections": [
    {
      "section": "Do not rely on sibling media",
      "title": "不要依赖同级媒体",
      "content": [
        {
          "type": "prose",
          "text": "像 `./hero.png` 或 `../assets/demo.mp4` 这样的引用在复制的文件中保持不变，通常会失效。"
        },
        {
          "type": "list",
          "items": [
            "当集成所有者会继续托管媒体时，使用稳定的公开 URL。",
            "当每个应用都必须提供产品特定媒体时，使用由应用明确拥有的占位符。",
            "仅当所有受支持的应用工具链都能解析并输出底层资源时，才使用包自有的 JS 或 CSS 入口。",
            "不要假设 `node_modules` 中的文件会自动通过浏览器 URL 提供。"
          ]
        }
      ]
    },
    {
      "section": "Understand `/template-assets`",
      "title": "了解 `/template-assets`",
      "content": [
        {
          "type": "prose",
          "text": "`/template-assets/<path>` 是仅用于预览的固定路径。复制期间，Astryx 会把完整的静态图片引用替换为内联的中性 SVG 占位符。对于完整的静态视频引用，它会替换为空字符串，因为无法创建有效的内联视频。"
        },
        {
          "type": "table",
          "headers": [
            "源引用",
            "复制结果"
          ],
          "rows": [
            [
              "`/template-assets/hero.png`",
              "内联 SVG data URL 占位符"
            ],
            [
              "`/template-assets/demo.mp4`",
              "空字符串"
            ],
            [
              "`./hero.png` 或 `/product/hero.png`",
              "保持不变"
            ],
            [
              "`https://example.com/template-assets/hero.png`",
              "保持不变"
            ]
          ]
        },
        {
          "type": "list",
          "items": [
            "支持的预览图片后缀有 SVG、PNG、JPG、JPEG、GIF、WebP、AVIF 和 ICO。",
            "支持的预览视频后缀有 MP4、WebM、MOV、OGV 和 M4V。",
            "让预览路径保持为一个完整的静态字符串。当 Astryx 无法安全替换时，拼接、插值、方法调用、模块导入和未知文件格式都会被拒绝。",
            "仅当占位符就是预期的复制结果时才使用此路径。它不是交付必需产品媒体的方式。",
            "Astryx 仅在自己的文档中提供 `/template-assets`。你自己托管的预览必须自行提供该路径。"
          ]
        }
      ]
    },
    {
      "section": "Design a useful placeholder",
      "title": "设计实用的占位符",
      "content": [
        {
          "type": "prose",
          "text": "当最终资源必须由应用提供时，要让复制后的源代码中的替换点一目了然。保留足够的周边布局和示例数据，使模板仍能演示该模式，同时不假装已包含最终内容。"
        },
        null,
        {
          "type": "list",
          "items": [
            "为信息性图片使用准确的替代文本，装饰性图片使用 `alt=\"\"`。",
            "提供尺寸或宽高比容器，使加载时不会导致页面位移。",
            "对于视频，提供控件、有用的封面图，并在内容需要时提供字幕。",
            "不要在复制后的源代码中留下无法访问、会过期、需要认证或特定于环境的 URL。"
          ]
        }
      ]
    },
    {
      "section": "Check media in the app",
      "title": "在应用中检查媒体",
      "content": [
        {
          "type": "prose",
          "text": "在应用中测试模板时（{@link generic:test-template-in-app}），还要确认以下事项。"
        },
        {
          "type": "list",
          "items": [
            "复制后的源代码显示了预期的占位符替换。",
            "网络日志中没有缺失、重定向、被阻止或未授权的媒体请求。",
            "每个占位符都保持布局，并说明应用必须替换什么。"
          ]
        }
      ]
    }
  ]
};
