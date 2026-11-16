// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for principles.doc.mjs.
export const docsZh = {
  "title": "原则",
  "description": "使用该设计系统构建应用的核心设计原则与规则。",
  "sections": [
    {
      "section": "Design Philosophy",
      "title": "设计理念",
      "content": [
        {
          "type": "prose",
          "text": "一个优先考虑一致性、适应性和开发者体验的设计系统。每项决策都源自几个核心理念："
        },
        {
          "type": "list",
          "items": [
            "组件优先于基础元素：凡是组件已覆盖的场景都使用组件，再考虑原生 HTML",
            "语义令牌优先于硬编码值：颜色、间距和圆角按用途命名，而非按外观命名",
            "与主题无关的代码：应用代码从不引用具体的颜色或尺寸，因此主题和深色模式可自动生效",
            "开放内部实现：每个基础元素都会导出且可组合，你可以在此基础上构建，而无需与之对抗"
          ]
        }
      ]
    },
    {
      "section": "Rules",
      "title": "规则",
      "content": [
        {
          "type": "prose",
          "text": "以下八条规则让应用代码保持在系统之内。"
        },
        {
          "type": "list",
          "items": [
            "凡是组件覆盖的场景都使用组件",
            "页面布局以框架为先：先选定外壳并规划各区域的空间预算，再编写内容（参见 {@link namespace:layout}）",
            "密集数据以行形式呈现（Table、List/Item），通栏排列并以分隔线区分；Card 用于小部件、画廊和设置组",
            "自定义样式使用 StyleX 或 Tailwind；两者都是一等公民（参见 {@link namespace:styling}）",
            "使用语义令牌，而非硬编码值（参见 {@link namespace:tokens}）",
            "颜色使用 CSS 自定义属性，而非十六进制值",
            "表单输入受控（value + onChange）",
            "导航使用 useLinkComponent()，以便使用方通过 LinkProvider 接入其框架路由器"
          ]
        }
      ]
    },
    {
      "section": "Styling Approach",
      "title": "样式方案",
      "content": [
        {
          "type": "prose",
          "text": "该设计系统支持多种样式方案。每个组件都接受 `xstyle` 属性，可通过 `stylex.create()` 覆盖 StyleX 样式。组件之外的布局和包装样式请使用 StyleX 或 Tailwind 工具类；两者最终解析为同一套设计令牌。"
        },
        {
          "type": "prose",
          "text": "完整指南及示例见 {@link namespace:styling}。"
        }
      ]
    },
    {
      "section": "Anti-Patterns",
      "title": "反模式",
      "content": [
        {
          "type": "prose",
          "text": "以下模式会破坏主题、路由或布局，以及应采用的替代做法。"
        },
        {
          "type": "list",
          "items": [
            "在原生元素上使用内联样式。应使用组件上的 xstyle",
            "硬编码颜色（#fff）。应使用 var(--color-*) 或 Tailwind 语义类（text-primary、bg-surface）",
            "硬编码间距（16px）。应使用间距令牌或 Tailwind 间距工具类",
            "硬编码的 <a> 元素。应使用 useLinkComponent()，以便使用方通过 LinkProvider 换成其框架路由器",
            "用 Card 包裹每个列表项或页面区块。应先确定框架；密集数据以行形式呈现（参见 {@link namespace:layout}）",
            "将 Badge 用作装饰。Badge 应保留给计数和枚举状态；状态请使用 StatusDot 或 Token",
            "臆造属性。请先阅读组件文档"
          ]
        }
      ]
    },
    {
      "section": "Design Tokens",
      "title": "设计令牌",
      "content": [
        {
          "type": "prose",
          "text": "该设计系统为间距、颜色、圆角、阴影、排版和尺寸提供语义设计令牌。令牌会随当前主题和颜色模式自适应。运行 {@link namespace:tokens} 可查看包含全部值的完整参考。"
        }
      ]
    }
  ]
};
