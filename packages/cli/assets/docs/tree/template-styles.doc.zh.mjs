// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for template-styles.doc.mjs.
export const docsZh = {
  "title": "样式",
  "description": "让复制的界面保持与应用主题一致：优先使用 Astryx 属性和令牌，把可编辑样式留在文件中，并从你的包发布共享 CSS。",
  "sections": [
    {
      "section": "Start with Astryx",
      "title": "从 Astryx 开始",
      "content": [
        {
          "type": "prose",
          "text": "在编写自定义 CSS 之前，先使用 Astryx 组件属性、布局原语和设计令牌。这样能让复制结果与宿主主题保持一致，并减少应用继承的样式约定。"
        },
        {
          "type": "list",
          "items": [
            "使用 Stack 和 Grid 的间距属性，而不是在子元素之间设置外边距。",
            "在重新设置内部样式之前，先使用组件变体、尺寸、内边距和对齐属性。",
            "对于 Astryx 未作为属性公开的值，使用公开的主题令牌导出。",
            "不要复制私有的生成类名，也不要用选择器定位组件内部结构。"
          ]
        }
      ]
    },
    {
      "section": "Keep editable styles with the source",
      "title": "让可编辑样式随源码保留",
      "content": [
        {
          "type": "prose",
          "text": "当某个样式属于可编辑的起始代码时，请在模板文件中定义它。"
        },
        null,
        {
          "type": "prose",
          "text": "仅当没有合适的 Astryx 属性或令牌时才使用自定义声明。每一条都会计入 {@link generic:template-grading-rubric} 的 Custom CSS 类别。"
        }
      ]
    },
    {
      "section": "Publish shared CSS deliberately",
      "title": "谨慎发布共享 CSS",
      "content": [
        {
          "type": "prose",
          "text": "当样式表必须由包维护时，请在模板中通过其公开包路径导入。"
        },
        {
          "type": "code",
          "label": "templates/acme-dashboard.tsx"
        },
        {
          "type": "prose",
          "text": "然后导出该路径，并把文件包含在包中（{@link generic:export-template-assets}）。TypeScript 6 及更高版本默认检查副作用导入，因此只有当应用或其框架声明了 `*.css` 模块时，这个导入才能通过类型检查。"
        }
      ]
    }
  ]
};
