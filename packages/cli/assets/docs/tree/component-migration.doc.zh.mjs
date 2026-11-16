// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for component-migration.doc.mjs.
export const docsZh = {
  "title": "组件迁移",
  "description": "先迁移应用框架，将 shadcn 和 Radix 基础组件映射为组件，再接入命令面板、设置和主题控件。",
  "sections": [
    {
      "section": "Move the App Frame First",
      "title": "先迁移应用框架",
      "content": [
        {
          "type": "prose",
          "text": "从 AppShell 开始，让页面迁移在最终的导航、间距、表面和响应式框架内进行。这也能尽早暴露主题和颜色问题，因为所有路由都共享同一个外壳。"
        },
        {
          "type": "table",
          "headers": [
            "旧版界面区域",
            "组件",
            "说明"
          ],
          "rows": [
            [
              "页头",
              "TopNav",
              "用于产品标识、全局操作、账户入口以及命令/搜索触发器。"
            ],
            [
              "侧边栏",
              "SideNav",
              "用分区和嵌套导航项表示路由组。让选择状态由路由器驱动。"
            ],
            [
              "主页面包装器",
              "AppShell + Layout",
              "让外壳负责持久结构；让路由组件负责页面内容。"
            ],
            [
              "移动端抽屉导航",
              "MobileNav 或 AppShell 的移动端行为",
              "在窄视口中验证焦点、关闭行为和路由变化。"
            ],
            [
              "设置菜单",
              "Popover + Layout + Switch",
              "用作主题模式和应用偏好的入口。"
            ]
          ]
        }
      ]
    },
    {
      "section": "Map shadcn and Radix Primitives",
      "title": "映射 shadcn 和 Radix 基础组件",
      "content": [
        {
          "type": "prose",
          "text": "不要用设计系统的样式包裹旧的 shadcn 组件。用负责行为、可访问性、状态类和令牌使用的组件替换基础组件。"
        },
        {
          "type": "table",
          "headers": [
            "现有基础组件",
            "组件",
            "迁移说明"
          ],
          "rows": [
            [
              "按钮 / shadcn Button",
              "Button 或 IconButton",
              "带标签的命令使用 Button，仅图标的工具栏操作使用 IconButton。"
            ],
            [
              "输入框",
              "TextInput",
              "将校验状态放在状态属性中，而不是临时添加边框类。"
            ],
            [
              "文本域",
              "TextArea",
              "当多行编辑是主要操作时使用。"
            ],
            [
              "开关",
              "Switch",
              "用于持久化的布尔设置，包括以二元选择表示的主题模式。"
            ],
            [
              "复选框",
              "CheckboxInput 或 CheckboxList",
              "分组选择使用列表变体。"
            ],
            [
              "单选组",
              "RadioList",
              "当必须从可见选项集中选择一个选项时使用。"
            ],
            [
              "下拉选择 / 组合框",
              "Selector 或 Typeahead",
              "有限选项使用 Selector，可搜索的异步选项使用 Typeahead。"
            ],
            [
              "用作页面导航的标签页",
              "TabList",
              "以路由状态或当前页面状态作为唯一事实来源。"
            ],
            [
              "命令对话框",
              "CommandPalette",
              "将应用特定的搜索来源放在外壳之外，并提供可搜索项。"
            ],
            [
              "下拉操作菜单",
              "DropdownMenu 或 MoreMenu",
              "紧凑的溢出操作使用 MoreMenu。"
            ],
            [
              "警告 / 提示框",
              "Banner 或 Toast",
              "页面或分区消息使用 Banner，临时反馈使用 Toast。"
            ],
            [
              "对话框",
              "Dialog 或 AlertDialog",
              "破坏性确认使用 AlertDialog，任务流程使用 Dialog。"
            ],
            [
              "卡片式列表行",
              "ListItem",
              "可选行优先使用 ListItem，而不是把 Button 样式化成行。"
            ]
          ]
        }
      ]
    },
    {
      "section": "Command Palette, Settings, and Theme",
      "title": "命令面板、设置与主题",
      "content": [
        {
          "type": "prose",
          "text": "外壳就绪后，将全局搜索迁移到 CommandPalette。把命令面板视为应用命令的视图：路由、上下文操作、创建操作、筛选器、最近项目和实体结果。将数据规范化保留在应用代码中，使搜索来源始终返回可搜索项的数组。"
        },
        {
          "type": "prose",
          "text": "将浅色和深色模式控件放在设置弹出层或账户菜单中。开关或选择器应更新传递给 Theme 的模式，而不是切换孤立的 body 类。"
        },
        {
          "type": "code",
          "label": "设置弹出层中的主题控件"
        }
      ]
    }
  ]
};
