// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for template-icons.doc.mjs.
export const docsZh = {
  "title": "图标",
  "description": "通过 Astryx 渲染图标以保持一致性和可访问性，并从你的包中提供自定义产品图标。",
  "sections": [
    {
      "section": "Use Astryx Icon",
      "title": "使用 Astryx 图标",
      "content": [
        {
          "type": "prose",
          "text": "独立图标请使用 `Icon`。对于组件的图标属性，请传入该属性接受的内容：大多数组件（如 `Button` 和 `IconButton`）接受 `<Icon icon={BellIcon} />` 这样的元素，某些菜单和导航项还接受图标定义本身。这样可使尺寸、颜色和可访问性与系统保持一致。"
        },
        null,
        {
          "type": "list",
          "items": [
            "在模板中一致地使用一个受支持的图标集。",
            "通过 Astryx 控件 API 为纯图标控件提供其必需的可见标签或辅助标签。",
            "当现有图标定义适用时，不要粘贴原始 `svg` 和 `path` 标记。",
            "当 `Icon` 或接收的 Astryx 组件可以渲染图标时，不要直接渲染库图标。",
            "将 Astryx 以外的图标库声明为依赖（{@link generic:export-template-assets}）。"
          ]
        }
      ]
    },
    {
      "section": "Ship a custom icon deliberately",
      "title": "谨慎发布自定义图标",
      "content": [
        {
          "type": "prose",
          "text": "产品标识或缺失的领域符号可以由包自行维护。从公开的包路径导出一个兼容的图标定义，然后从模板中导入该路径。"
        },
        {
          "type": "code",
          "label": "templates/acme-dashboard.tsx"
        },
        {
          "type": "prose",
          "text": "导出图标路径，并将其文件包含在包中（{@link generic:export-template-assets}）。"
        }
      ]
    },
    {
      "section": "Check icons in the app",
      "title": "在应用中检查图标",
      "content": [
        {
          "type": "prose",
          "text": "在应用中测试模板时（{@link generic:test-template-in-app}），还要确认以下事项。"
        },
        {
          "type": "list",
          "items": [
            "每个图标状态都能正常渲染，包括选中、禁用、加载中和窄布局。",
            "有意义的图标具有可访问名称，装饰性图标不会添加重复的朗读文本。",
            "图标缺失时不会留下空白控件。"
          ]
        }
      ]
    }
  ]
};
