// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for migration-setup.doc.mjs.
export const docsZh = {
  "title": "设置",
  "description": "在迁移任何界面之前，安装主题、接入 CSS 层、审查重置样式，并运行基础冒烟测试。",
  "sections": [
    {
      "section": "Overview",
      "title": "概览",
      "content": [
        {
          "type": "prose",
          "text": "把迁移当作产品外壳和工作流的迁移，而不是全局类名替换。首先把应用放进 Theme 和 AppShell 中，然后一次一个路由或界面地迁移到设计系统原语，同时保持现有数据、路由和业务逻辑不变。"
        },
        {
          "type": "prose",
          "text": "迁移期间 Tailwind 可以共存。用它在旧式包装器和局部布局上，同时把交互控件、导航、命令界面、表单、警告、对话框和设置界面替换为组件。"
        }
      ]
    },
    {
      "section": "Recommended Order",
      "title": "推荐顺序",
      "content": [
        {
          "type": "list",
          "items": [
            "安装这些包，并运行 `{@command init}` 获取智能体文档，然后添加重置样式、`astryx.css` 和主题 CSS 导入（见下文“主题和 CSS 设置”）。",
            "用 Theme 包裹应用根节点，并选择初始的浅色、深色或系统模式行为。",
            "在替换组件之前，明确 Tailwind 和设计系统 CSS 的层顺序。",
            "渲染基础冒烟测试页面，确认原语保留了内边距，然后再迁移任何界面。",
            "先迁移持久框架：AppShell、TopNav、SideNav、页面内容和移动端导航。见 {@link generic:component-migration}。",
            "替换共享原语：Button、IconButton、TextInput、NumberInput、Switch、CheckboxInput、RadioList、Selector、TabList、Dialog、AlertDialog、Banner、Toast、Badge、Card、Table 和 ListItem。见 {@link generic:component-migration}。",
            "替换全局工作流：命令面板、设置弹出层、主题切换、搜索、筛选、创建流程和破坏性确认对话框。",
            "从每个已完成的界面中移除旧式 Tailwind 类，只保留由令牌支持的布局工具类或仍需迁移的局部包装器。",
            "在进入下一个路由之前，验证浅色和深色模式、键盘导航、响应式布局以及空/错误/加载状态。见 {@link generic:migration-verification}。"
          ]
        }
      ]
    },
    {
      "section": "CLI Workflow",
      "title": "CLI 工作流",
      "content": [
        {
          "type": "prose",
          "text": "把 CLI 当作迁移清单。阅读你即将触碰的模式文档，查看匹配的模板骨架，然后在编辑之前阅读确切的组件文档。"
        },
        {
          "type": "code",
          "label": "面向迁移的 CLI 流程"
        },
        {
          "type": "prose",
          "text": "要获得可粘贴到 AI 编码工具中的简短版本，见 {@link generic:working-with-ai}。构建自动化迁移报告时使用 `--json`。"
        },
        {
          "type": "code",
          "label": "简短和 JSON 模式"
        }
      ]
    },
    {
      "section": "Theme and CSS Setup",
      "title": "主题与 CSS 设置",
      "content": [
        {
          "type": "prose",
          "text": "在应用根节点挂载 Theme，使每个已迁移的组件读取同一套令牌。如果用户可以在浅色和深色主题之间切换，请把模式保存在应用状态中。"
        },
        {
          "type": "code",
          "label": "带显式模式的根提供程序"
        },
        {
          "type": "prose",
          "text": "当应用中仍保留 Tailwind 时，在全局 CSS 文件中声明一次层顺序。在 Tailwind 工具类之前加载 Astryx 重置样式和主题 CSS，使已迁移的组件保留设计系统默认值，同时旧式工具类仍然有效。在 Tailwind v4 上，使用 {@link generic:tailwind} 中的导入和层顺序。"
        },
        {
          "type": "prose",
          "text": "在根布局或应用入口中首先导入全局 CSS 文件，先于任何导入 Astryx 或主题 CSS 的内容，包括 `astryx-themes` 模块和像上面 `AppRoot` 这样的根组件。为什么顺序重要，以及无法放在最前面时该怎么办，见 {@link generic:tailwind}。"
        },
        {
          "type": "code",
          "label": "根布局或应用入口"
        },
        {
          "type": "prose",
          "text": "在 Tailwind v3 上没有可导入的 preflight.css，所以改为把 @tailwind base 指令包在具名层中。让工具类保持无层，以便现有的应用工具类在所有地方仍然胜出。把 `@layer` 顺序行放在单独的 `layers.css` 中，并最先导入它，先于 `globals.css`：Next.js（webpack 或 Turbopack）以及其他会提升 CSS 导入的打包器会把导入的文件移到内联 `@layer` 行之前，导致顺序来得太晚。"
        },
        {
          "type": "code",
          "label": "layers.css（最先导入）"
        },
        {
          "type": "code",
          "label": "globals.css（Tailwind v3 共存）"
        },
        {
          "type": "code",
          "label": "根布局或应用入口（Tailwind v3）"
        }
      ]
    },
    {
      "section": "Why resets break cascade layers",
      "title": "重置样式为何会破坏级联层",
      "content": [
        {
          "type": "prose",
          "text": "在完全没有层的样式表中，像 `* { padding: 0 }` 这样的零特异性重置会输给任何类选择器，所以大多数开发者认为重置样式无害。层会两次改变规则：无层样式胜过每个具名层，而后面的层胜过前面的层，两者都与特异性无关。因此，同一个重置样式只要保持无层，或落入在 astryx-base 之后声明的层，就能胜过所有组件样式。同样的 CSS，相反的结果，而且发生时没有错误或警告。"
        },
        {
          "type": "prose",
          "text": "这是采用设计系统时最常见的破坏方式，通过两种 @import 机制之一发生。没有 layer() 关键字的顶层 @import 会让旧式重置保持无层，从而覆盖每个设计系统层。而嵌套在本身被导入某个层的文件中的 @import 会继承外围的层，因此重置样式可能悄悄落入 astryx-base 之上的使用方层。无论哪种情况，修复方法都一样：把旧式重置显式导入最低层。"
        },
        {
          "type": "code",
          "label": "旧式重置，显式分层"
        },
        {
          "type": "prose",
          "text": "在构建界面前，对照下面的层叠层审查检查每个样式表。"
        }
      ]
    },
    {
      "section": "Cascade layer audit",
      "title": "级联层审查",
      "content": [
        {
          "type": "prose",
          "text": "在构建界面前，用这份清单审查设计系统周围的层。"
        },
        {
          "type": "list",
          "items": [
            "在任何 @import 之前，声明一次规范的 @layer 顺序。对于 Next.js（webpack 或 Turbopack）和其他会提升 CSS 导入的打包器，顺序声明必须放在单独且最先导入的 CSS 文件中，例如 layers.css，因为打包器会把 @import 内容提升到其后的内联 CSS 之上。",
            "审查每个已有的全局或重置样式表，并有意地把每一个分配到某个层。没有 layer() 的顶层导入保持无层，会胜过每个层；嵌套在已分层文件中的导入会继承该层。",
            "移除或降级应用旧式重置。设计系统在最低层自带 `:where()` 重置，因此任何应用重置都应放在同一个重置层中，绝不能放在 astryx-base 之上的层。",
            "为 Tailwind preflight 分层。在 Tailwind v4 上，用 layer(base) 导入 preflight.css。在 Tailwind v3 上，把 @tailwind base 指令包在具名层中（见“主题和 CSS 设置”中的代码片段）。无层的 preflight 会悄悄覆盖主题 CSS。",
            "将 moduleResolution 设置为 bundler 或 node16 及更高版本，以便像 @astryxdesign/core/reset.css 这样的子路径导入能够解析。",
            "使用 defineTheme 和 accent 系列 API 来设定主题，而不是手写单个颜色令牌。像 --color-on-accent 这样的派生令牌会自动从 accent 色阶生成；只手写 --color-accent 会让 --color-on-accent 保持过时的白色默认值，无法保证与新 accent 的对比度。",
            "运行下面的基础冒烟测试，并在迁移任何路由之前以浅色和深色模式查看几个组件。"
          ]
        },
        {
          "type": "prose",
          "text": "还有一个思维模型转变：你在组件上写的 className 或工具类无论如何都会到达 DOM，但它是否覆盖组件是一个层的问题，而不是源代码顺序的问题。把应用工具类保留在 utilities 层中，让它们继续胜出。"
        }
      ]
    },
    {
      "section": "Foundation Smoke Test",
      "title": "基础冒烟测试",
      "content": [
        {
          "type": "prose",
          "text": "错误的层顺序会在每个页面上以相同方式静默失败，所以要在功能开发之前发现它，而不是在迁移了 N 个界面之后。作为迁移的第一步，渲染一个包含几个原语的临时页面。"
        },
        {
          "type": "code",
          "label": "基础检查页面"
        },
        {
          "type": "prose",
          "text": "如果按钮渲染出可见的内边距、实心的主色背景，并且输入框和卡片有边框和内部间距，说明基础是可靠的。若要在任意测试运行器或仅开发环境的效果中运行断言，请检查原语是否保留非零内边距："
        },
        {
          "type": "code",
          "label": "基础断言"
        },
        {
          "type": "prose",
          "text": "当这失败时，修复几乎总是与层顺序有关：找到把内边距归零的样式表，把它移入重置层或删除。"
        }
      ]
    }
  ]
};
