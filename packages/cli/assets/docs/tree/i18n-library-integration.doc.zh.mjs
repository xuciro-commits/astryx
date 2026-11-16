// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for i18n-library-integration.doc.mjs.
export const docsZh = {
  "title": "库集成",
  "description": "覆盖 astryx 的默认文本，与 react-intl / i18next / next-intl / LinguiJS 共存，或将 astryx 用作你的 i18n 库。",
  "sections": [
    {
      "section": "Overriding astryx's default text",
      "title": "覆盖 astryx 的默认文本",
      "content": [
        {
          "type": "prose",
          "text": "使用 `overrides` 可以修改单个字符串，而无需提供完整目录。覆盖按语言环境键控，并合并到内置目录和用户提供的目录之上。"
        },
        {
          "type": "code",
          "label": "修改一个英文字符串"
        },
        {
          "type": "prose",
          "text": "对于相同的键，覆盖会优先于内置英文和任何 `messages` 目录。可用于调整品牌语气或一次性修改措辞。"
        }
      ]
    },
    {
      "section": "Using astryx with your own i18n library",
      "title": "将 astryx 与你自己的 i18n 库一起使用",
      "content": [
        {
          "type": "prose",
          "text": "Astryx 组件通过 astryx 的 provider 渲染 astryx 字符串。使用方组件通过你现有的任意 i18n 库渲染使用方字符串：react-intl、i18next、next-intl、LinguiJS 等等。两个系统共存，并从同一事实来源读取当前语言环境。"
        },
        {
          "type": "code",
          "label": "Astryx 与 react-intl 并排使用"
        },
        {
          "type": "prose",
          "text": "让两个 provider 的语言环境保持同步，每个库拥有自己的目录。Astryx 从不会看到你应用的字符串，你的 i18n 库也永远不会看到 astryx 内部内容。运行时切换语言环境的方式相同：用新的 `locale` 属性重新渲染两个 provider，整棵树就会实时更新。"
        },
        {
          "type": "prose",
          "text": "单目录用法（由 react-intl 或 i18next 等外部 i18n 运行时通过一个 provider 同时解析你的应用字符串和 astryx 字符串）已列入路线图，将通过 `Translator` 适配器实现。请关注 [meta/astryx#4029](https://github.com/meta/astryx/issues/4029)。目前请按上文所示并排运行两个 provider。"
        }
      ]
    },
    {
      "section": "Using astryx as your i18n library",
      "title": "将 astryx 用作你的 i18n 库",
      "content": [
        {
          "type": "prose",
          "text": "对于有大量本地化需求的生产应用，我们建议使用专门的 i18n 库，例如 react-intl、i18next、next-intl 或 LinguiJS。如果你的应用较小，或者不想引入另一个运行时，也可以通过 astryx 解析你自己的字符串。请将应用键与 `@astryx.*` 放在不同的命名空间中，并包含你自己的 `en` 目录，因为 astryx 内置的英文回退只包含 astryx 组件字符串。"
        },
        {
          "type": "code",
          "label": "使用 astryx 翻译应用字符串"
        },
        {
          "type": "prose",
          "text": "`Catalog` 为丰富的 `{defaultMessage, description?}` 编写形式提供类型。`RuntimeCatalog` 为生成的键到消息字符串映射提供类型。`ProviderMessagesByLocale` 接受 provider 的任一形式，而 `MessagesByLocale` 保留原本仅支持丰富形式的上下文形式。"
        }
      ]
    }
  ]
};
