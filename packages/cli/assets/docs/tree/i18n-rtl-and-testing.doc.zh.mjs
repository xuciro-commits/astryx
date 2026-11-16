// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for i18n-rtl-and-testing.doc.mjs.
export const docsZh = {
  "title": "RTL 与测试",
  "description": "文字方向（RTL）、伪语言环境测试，以及面向开发者和译者的贡献指南。",
  "sections": [
    {
      "section": "Text direction (RTL)",
      "title": "文字方向（RTL）",
      "content": [
        {
          "type": "prose",
          "text": "Astryx 会在语言环境之外同时跟踪文字方向（`'ltr'` 或 `'rtl'`）。默认情况下，方向根据传给 `<InternationalizationProvider>` 的 `locale`，通过 [`Intl.Locale.getTextInfo()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getTextInfo) 推导，因此阿拉伯语（`ar`）、希伯来语（`he`）、波斯语（`fa`）和乌尔都语（`ur`）等 RTL 语言环境会自动解析为 `'rtl'`。"
        },
        {
          "type": "prose",
          "text": "无需为每个组件单独接入。方向设置好后，Astryx 组件会自动镜像：布局和间距通过 CSS 逻辑属性翻转，方向性图标（尖角、插入符）原地翻转，键盘方向键的左右映射互换，浮层会定位到正确的一侧。只需设置一次方向，整个组件树都会跟随。"
        },
        {
          "type": "code",
          "label": "从语言环境推导方向"
        },
        {
          "type": "prose",
          "text": "传入可选的 `dir` 属性可强制指定方向。它会覆盖从语言环境推导出的默认值；适用于在英文文案下测试 RTL 布局，或在你已经知道方向时跳过推导。"
        },
        {
          "type": "code",
          "label": "显式覆盖方向"
        },
        {
          "type": "prose",
          "text": "还有一步：也要告诉浏览器方向。为页面添加 `dir` 属性，通常加在 `<html>` 标签上。这样才能让文本对齐到正确的一侧、标点和混合语言文本正确流动，并让布局镜像。Provider 负责 Astryx 组件；`dir` 属性负责页面上的其他所有内容。"
        },
        {
          "type": "prose",
          "text": "Astryx 不会替你设置 `dir`；你需要自己设置，并与传给 Provider 的方向保持一致。如果你的应用是服务端渲染的（例如 Next.js），`getLocaleDirection()` 辅助函数会根据语言环境计算方向，让你可以在页面渲染时设置："
        },
        {
          "type": "code",
          "label": "在 Next.js 根布局中设置 <html dir>"
        },
        {
          "type": "prose",
          "text": "在普通的客户端应用中，每当语言环境变化时，在 `<html>` 上设置相同的属性。（`getLocaleDirection()` 对无法识别的值会安全地返回 `'ltr'`，因此可以用任何语言环境字符串调用它。）"
        },
        {
          "type": "prose",
          "text": "如果只想让从左到右页面中的某一部分变为从右到左，例如一段阿拉伯语引文或一个评论线程，请将该部分包在它自己的 `<InternationalizationProvider dir=\"rtl\">` 中，并为其外层元素添加 `dir=\"rtl\"`。从该区域内打开的弹出浮层（菜单、对话框、弹出框、工具提示）也会镜像：它们使用逻辑 CSS 锚点定位，因此会落在正确的一侧，并自动继承该区域的方向。"
        }
      ]
    },
    {
      "section": "Testing your translations",
      "title": "测试你的翻译",
      "content": [
        {
          "type": "prose",
          "text": "Astryx 会生成一个 `pseudo` 语言环境，将每个字符串包裹在 `⟦…⟧` 中，并把字母替换为带重音的形似字符。在开发环境中启用它，可以发现硬编码的 Astryx 字符串以及较长文本引起的布局问题。"
        },
        {
          "type": "code",
          "label": "启用伪本地化"
        }
      ]
    },
    {
      "section": "For contributors",
      "title": "面向贡献者",
      "content": [
        {
          "type": "heading",
          "text": "开发者"
        },
        {
          "type": "prose",
          "text": "Astryx 组件作者通过 `useTranslator()` 读取字符串，而不是硬编码面向用户的文本。"
        },
        {
          "type": "code",
          "label": "读取 Astryx 字符串"
        },
        {
          "type": "prose",
          "text": "Astryx 自身的字符串位于 `packages/core/locales/en.json`。新的面向用户字符串必须通过 `useTranslator`；`@astryx/no-hardcoded-i18n-string` ESLint 规则会强制执行这一点。添加新键时使用的别名与解析模式，请参阅 AI 贡献指南。"
        },
        {
          "type": "prose",
          "text": "编写需要响应方向的组件时，应从 DOM 解析方向，而不是在渲染时用 JavaScript 读取，并优先选择能满足需求的最轻量工具。按优先级顺序："
        },
        {
          "type": "heading",
          "text": "1. 优先使用 CSS 逻辑属性"
        },
        {
          "type": "prose",
          "text": "使用 `insetInlineStart`、`paddingInlineEnd`、`marginInline` 等逻辑属性，而不是物理的 `left`/`right`。大多数镜像需求无需其他处理；浏览器会根据环境 `dir` 自动翻转。`@astryx/no-physical-properties` ESLint 规则会强制执行这一点。"
        },
        {
          "type": "heading",
          "text": "2. 方向性图标：用 CSS 镜像，而不是替换名称"
        },
        {
          "type": "prose",
          "text": "渲染一个固定的字形，并用共享的 `rtlStyles.mirror` 包裹它（一个仅在 `[dir=\"rtl\"]` 下生效的 `scaleX(-1)`）。它会通过级联从祖先 `dir` 翻转，因此在服务端也能工作，不会出现 hydration 闪烁。不要在 JavaScript 中选择 `chevronLeft` 还是 `chevronRight`。Pagination、Calendar 和 Carousel 就是这样处理尖角的。"
        },
        {
          "type": "code",
          "label": "用 CSS 镜像方向性图标"
        },
        {
          "type": "heading",
          "text": "3. 行为逻辑：在事件发生时惰性读取 DOM"
        },
        {
          "type": "prose",
          "text": "对于 CSS 无法表达的内容（键盘方向键映射、拖拽/滚动计算），在交互发生时用 `isRtlElement(el)`（检查 `getComputedStyle().direction`）读取方向，切勿在渲染期间读取。焦点原语（`useListFocus`、`useGridFocus`、`useTreeFocus`）已经会从容器自动检测方向，因此方向键会自动翻转；不要给它们传递方向标志。"
        },
        {
          "type": "heading",
          "text": "4. useDirection() 上下文：最后手段"
        },
        {
          "type": "prose",
          "text": "只有在渲染期间确实需要方向值且上述方案都不适用时才使用它。它支持 SSR，在 Provider 外返回 `'ltr'`（与 `useTranslator` 的静默回退一致），但如果 Provider 的 `direction` 与 `<html dir>` 不一致，它是唯一可能在 hydration 时产生不匹配的路径；因此优先使用上述完全从 DOM 解析的方案。自 CSS 镜像迁移以来，没有任何 Astryx 组件在渲染时从上下文读取方向。"
        },
        {
          "type": "heading",
          "text": "译者"
        },
        {
          "type": "prose",
          "text": "Crowdin 是首选的贡献方式；[加入一种语言](https://crowdin.com/project/astryx)，在 Web UI 中翻译字符串，你的工作会同步回仓库，无需提交 PR。如果你更喜欢直接提交 PR，也可以直接修改 `packages/core/locales/*.json`。"
        }
      ]
    }
  ]
};
