// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for replace-a-core-component.doc.mjs.
export const docsZh = {
  "title": "替换 Core 组件",
  "description": "仅当集成必须有意拥有某个 Core 组件身份时，才使用组件替换。",
  "sections": [
    {
      "section": "Decide whether to replace",
      "title": "决定是否替换",
      "content": [
        {
          "type": "prose",
          "text": "大多数组件不应使用 `replaces`。给新组件起一个自己的名称，让应用显式选择它。仅当你的组件必须在集成生效的所有位置成为某个 Core 身份的默认实现时，才替换 Core。"
        },
        {
          "type": "heading",
          "text": "适用情况"
        },
        {
          "type": "list",
          "items": [
            "你的组件有意承担与某个特定 Core 组件相同的角色。",
            "每个加载该集成的应用都应从无限定的组件详情、`component --list`、搜索、`swizzle <Name>` 和问题路由中获得你的组件。",
            "你已经测试过替换后的组件，也测试过显式访问原始 Core 组件。"
          ]
        },
        {
          "type": "heading",
          "text": "不适用情况"
        },
        {
          "type": "list",
          "items": [
            "你的组件是替代实现、变体、包装器或产品特定的扩展。请给它起一个独有的名称。",
            "你只需要解决偶然的名称冲突。",
            "你只想在一个屏幕或工作流中替换。替换会在集成生效的整个应用中起作用。"
          ]
        }
      ]
    },
    {
      "section": "Set the replacement",
      "title": "设置替换",
      "content": [
        {
          "type": "code",
          "label": "components/AcmeSideNav.doc.mjs"
        },
        {
          "type": "prose",
          "text": "所有字段见 {@link schema:component-doc}。"
        },
        {
          "type": "prose",
          "text": "只有当你的包声明了首个支持该替换的 CLI 版本时，替换才会启用。请将其添加到包的 `package.json`："
        },
        {
          "type": "code",
          "label": "package.json"
        },
        {
          "type": "list",
          "items": [
            "任何起点为该版本或更高版本的 `@astryxdesign/cli` 范围都会启用它，包括已发布的 0.6.4 和 0.6.5 中 `integration add doc --parent` 写入的 `>=0.7.0`，以及已发布的 0.6.5 中的 `integration add theme`。",
            "如果没有这样的范围，组件会保留自己的名称，Core 组件仍被选中（与目标同名的组件在仅使用该裸名称时仍像以前一样有歧义），并且 `doctor integration components` 会发出警告并给出应添加的范围。加载此类包的应用看不到任何变化。",
            "`replaces` 指定的是 Core 的 `ComponentDoc` 身份，而不是其显示标签、导入路径或独立 Hook。",
            "你的组件可以保留独有的名称，也可以使用与目标相同的名称。在忽略 `replaces` 的旧版 CLI 上，独有名称仍可直接访问。",
            "`--package @astryxdesign/core` 始终选择原始 Core 组件；使用 `--package` 指定你的包时，可以通过任一名称选择你的组件。",
            "替换 `SideNav` 只会替换该名称。`SideNavItem` 和其他 SideNav 部件仍是 Core 组件；你的包提供的任何部件都应以其自己的名称记录。",
            "`swizzle --list` 会列出 Core 组件，包括你所替换的那个。`swizzle SideNav` 复制你的组件，`swizzle SideNav --package @astryxdesign/core` 复制原始组件。"
          ]
        }
      ]
    },
    {
      "section": "Check replacement resolution",
      "title": "检查替换解析",
      "content": [
        null,
        {
          "type": "list",
          "items": [
            "一旦包声明了该范围，缺少目标、值无效、同一包中为同一目标设置第二个替换，或替换的名称对应另一个 Core 组件，都会成为错误。未声明该范围时，`doctor integration components` 会将以上每种情况报告为警告。",
            "当多个集成替换同一个目标时，显式配置优先于自动选择。在显式配置的集成之间，后声明的包获胜，Doctor 会发出警告。仅存在自动链接的集成时，`package.json` 中后列出的依赖获胜，Doctor 会发出警告。"
          ]
        }
      ]
    },
    {
      "section": "In global mode",
      "title": "在全局模式下",
      "content": [
        {
          "type": "prose",
          "text": "在全局模式下：为电脑安装的包提供的替换会在任何项目之外的文件夹中生效；在项目内部，只有项目安装的包提供的替换才会生效。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        }
      ]
    }
  ]
};
