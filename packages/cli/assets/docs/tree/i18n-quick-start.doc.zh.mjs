// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for i18n-quick-start.doc.mjs.
export const docsZh = {
  "title": "快速开始",
  "description": "使用 InternationalizationProvider 包裹你的应用，加载语言环境目录，并在运行时切换语言。",
  "sections": [
    {
      "section": "Quick Start",
      "title": "快速开始",
      "content": [
        {
          "type": "prose",
          "text": "国际化功能内置于 `@astryxdesign/core`。无需安装任何内容。用 `<InternationalizationProvider>` 包裹你的应用并设置活动的 `locale`；astryx 组件会从该 provider 获取本地化字符串。"
        },
        {
          "type": "code",
          "label": "包裹你的应用"
        },
        {
          "type": "prose",
          "text": "该 provider 始终包含内置英文目录。启用其他语言环境时，通过 `messages` 传入额外的目录。"
        },
        {
          "type": "code",
          "label": "加载 astryx 语言环境目录"
        },
        {
          "type": "prose",
          "text": "Astryx 为受支持的语言环境附带英文和第一方翻译。来自 `@astryxdesign/core/locales/*.generated.js` 的紧凑运行时模块只包含应用需要的消息；现有的 `@astryxdesign/core/locales/*.json` 文件保留译者上下文。在某个语言环境可用之前，应用可以传入任一形式的本地目录。缺失的键会沿语言环境链回退到英文（例如 `pt-BR` 会依次回退到 `pt`，再到内置的 `en`）。"
        },
        {
          "type": "prose",
          "text": "语言环境目录只影响 astryx 字符串。你的应用可以继续使用自己的 i18n 系统处理产品文案。"
        }
      ]
    },
    {
      "section": "Runtime language swap",
      "title": "运行时切换语言",
      "content": [
        {
          "type": "prose",
          "text": "用新的 `locale` 属性重新渲染 `<InternationalizationProvider>`，每个 astryx 字符串都会实时更新。无需刷新，也无需单独的 API 调用。"
        },
        {
          "type": "code",
          "label": "在语言环境之间切换"
        },
        {
          "type": "prose",
          "text": "持久化用户的选择（localStorage、cookie、URL 片段、账户设置）由使用方负责。Astryx 会读取你传入的任何 `locale`。"
        }
      ]
    }
  ]
};
