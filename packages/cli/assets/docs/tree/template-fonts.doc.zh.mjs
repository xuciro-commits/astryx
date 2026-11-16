// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for template-fonts.doc.mjs.
export const docsZh = {
  "title": "字体",
  "description": "除非模板确实需要自己的字体，否则请保持应用字体；需要时，请随包发布它使用的每个字体文件。",
  "sections": [
    {
      "section": "Prefer host typography",
      "title": "优先使用应用字体",
      "content": [
        {
          "type": "prose",
          "text": "除非模板必须展示特定的授权字体，否则请使用 Astryx 排版组件和主题值。复制后的模板通常应继承应用排版，而不是安装新的全局字体。"
        },
        {
          "type": "list",
          "items": [
            "不要仅仅为了让示例内容看起来更精致而添加字体。",
            "不要从模板覆盖应用的正文字体。",
            "仅当集成包拥有的真实产品或内容需求需要时，才使用自定义字体。"
          ]
        }
      ]
    },
    {
      "section": "Package a required font",
      "title": "打包必需的字体",
      "content": [
        {
          "type": "prose",
          "text": "将字体文件放在包拥有的样式表旁边。样式表可以使用相对的 `url()` 路径，因为它留在包中，而模板通过其公开路径导入该样式表（{@link generic:template-styles}）。"
        },
        {
          "type": "code",
          "label": "styles/acme-dashboard.css"
        },
        {
          "type": "list",
          "items": [
            "当 WOFF2 能满足受支持的浏览器时，请发布 WOFF2。仅当这些浏览器需要时，才添加其他格式。",
            "声明模板使用的每个字重和样式。不要因为缺少文件而让浏览器合成粗体或斜体。",
            "使用 `font-display: swap`，除非产品需求和性能测试证明其他值合理。",
            "确认字体许可证允许在集成包中再分发。"
          ]
        },
        {
          "type": "prose",
          "text": "导出样式表并不会发布它指向的字体文件。还要将字体目录包含在包中（{@link generic:export-template-assets}）。"
        }
      ]
    },
    {
      "section": "Check fonts in the app",
      "title": "在应用中检查字体",
      "content": [
        {
          "type": "prose",
          "text": "当你在应用中测试模板（{@link generic:test-template-in-app}）时，还要确认以下内容。"
        },
        {
          "type": "list",
          "items": [
            "每个字体请求都能从构建后的资源路径成功获取。",
            "计算样式显示所请求的字体族、字重和样式。",
            "当字体加载缓慢或失败时，文本在回退字体栈下仍然可读。"
          ]
        }
      ]
    }
  ]
};
