// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for styling-advanced.doc.mjs.
export const docsZh = {
  "title": "高级",
  "description": "复合组件样式、数据属性选择器、迁移已移除的主题兼容性选择器，以及常见反模式。",
  "sections": [
    {
      "section": "Compound Components",
      "title": "复合组件",
      "content": [
        {
          "type": "prose",
          "text": "复杂组件由更小的组件组合而成。每个子组件接受自己的 xstyle、className 和其余属性。你需要分别设置各个部分的样式；不存在单一的“深入子部分”属性。"
        },
        {
          "type": "code",
          "label": "各部分分别设置样式的 Dialog"
        },
        {
          "type": "prose",
          "text": "模式：父组件（Dialog）控制结构和行为，子组件（Layout、Header、Button）控制自身外观。在每个部分所在的位置为其设置样式。"
        }
      ]
    },
    {
      "section": "Data attribute selectors",
      "title": "数据属性选择器",
      "content": [
        {
          "type": "prose",
          "text": "当外部 CSS 需要按属性或状态定位 Astryx 组件时，请将稳定的组件类与反射的 data-* 属性结合使用。组件类标识组件（`.astryx-button`、`.astryx-card`）；数据属性标识维度和值（`data-variant`、`data-size`、`data-level` 等）。这是新 CSS 首选的选择器接口，因为它明确且不易冲突。"
        },
        null,
        {
          "type": "code",
          "label": "组件会反射的内容"
        },
        {
          "type": "prose",
          "text": "对于系统化主题设置，请使用 defineTheme 的组件覆盖，而不是原始 CSS 选择器。defineTheme 保留更高层的 `prop:value` API（`variant:primary`、`size:sm`），并为你处理选择器生成。组件主题设置请参阅 {@link generic:author-a-theme}。"
        }
      ]
    },
    {
      "section": "Migrating Removed Theme Compatibility Selectors",
      "title": "迁移已移除的主题兼容性选择器",
      "content": [
        {
          "type": "prose",
          "text": "Astryx 0.7 只输出规范的 `astryx-*` 目标类和反射的 `data-*` 属性。运行 `{@command upgrade --from <your 0.6 version> --apply --path .}` 可重命名主题 `components` 映射中已移除的目标键，并迁移 CSS 选择器。CSS 迁移会重命名已移除的目标类，并将带目标限定的裸属性/值/状态类（如 `.primary`、`.sm`、`.level-2` 和 `.checked`）替换为对应的反射 `data-*` 选择器。"
        },
        null,
        {
          "type": "prose",
          "text": "已移除的目标映射：`base-table` → `table`；`checkbox` → `checkbox-indicator`；`codeblock` → `code-block`；`codeblock-copy-button` → `code-block-copy-button`；`codeblock-header` → `code-block-header`；`codeblock-title` → `code-block-title`；`date-input-clear-icon`、`date-range-input-clear-icon`、`multi-selector-clear-icon` 和 `selector-clear-icon` → `input-clear-icon`；`hovercard` → `hover-card`；`navicon` → `nav-icon`；`popover-surface` → `popover`；`progressbar`、`progressbar-fill`、`progressbar-mark` 和 `progressbar-track` → 对应的连字符形式 `progress-bar*`；`radio` → `radio-indicator`；`radio-dot` → `radio-indicator-dot`；`statusdot` → `status-dot`；`textarea` → `text-area`。"
        },
        {
          "type": "prose",
          "text": "`input-clear-icon` 为每个输入框的清除图标设置样式。在 CSS 中，升级会通过 `:where(.astryx-<component> *)` 将每条旧的清除图标规则保留在其组件上。主题键无法携带该作用域，因此升级会重命名该键，并添加一个 `TODO(astryx upgrade)`，其中指明应改用哪个 CSS 选择器。"
        },
        {
          "type": "prose",
          "text": "当 `components` 映射属于从 Astryx 导入的 `defineTheme()` 调用、类型为 Astryx 主题的对象，或同名主题描述文件（`<stem>.doc.mjs`）声明的主题对象时，升级会将其视为主题：该对象是以 `<stem>` 导出的顶层绑定，具有静态 `name` 和作为样式对象的组件条目。其他位置出现的形似对象（例如同一文件中来自另一个库的主题对象）不是 Astryx 主题。它会保持计算生成的主题键、未限定类、未知的消费者类、声明、注释以及 JavaScript 或 TypeScript 字符串中的 CSS 不变。当映射同时具有旧键和规范键，以及 Astryx 曾经输出的裸类在其限定的目标上没有已知含义时，它会添加 `TODO(astryx upgrade)`。请逐一人工审查每个 TODO。"
        }
      ]
    },
    {
      "section": "What NOT to Do",
      "title": "避免的做法",
      "content": [
        {
          "type": "list",
          "items": [
            "不要在原始 <div> 包装器上使用 style={{}}。请直接在组件上使用 xstyle。",
            "不要硬编码颜色（#fff、rgb(...)）。请使用 var(--color-*) 令牌或 Tailwind 语义类（text-primary、bg-surface）。",
            "不要硬编码间距（16px、1rem）。请使用 var(--spacing-*) 令牌或 Tailwind 间距工具类（p-4、gap-3）。",
            "不要为了添加外边距而将组件包在 <div> 中。请在组件上使用结合 stylex.create 的 xstyle。",
            "不要使用 !important。如果样式未生效，请检查特异性；xstyle 最后合并。"
          ]
        }
      ]
    }
  ]
};
