// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for getting-started.doc.mjs.
export const docsZh = {
  "title": "快速开始",
  "description": "将设计系统添加到你的项目并开始构建。",
  "sections": [
    {
      "section": "Quick Start with AI",
      "title": "使用 AI 快速开始",
      "content": [
        {
          "type": "prose",
          "text": "将以下内容粘贴到你的 AI 编码工具中，让它来完成设置："
        },
        {
          "type": "code",
          "label": "设置设计系统"
        },
        {
          "type": "prose",
          "text": "然后看一眼效果。无论是否有人选择主题，每个应用都会获得一个主题，因此值得在设置时问一个问题，而不是之后回头修改那些围绕错误外观构建的界面："
        },
        {
          "type": "code",
          "label": "看一眼效果"
        }
      ]
    },
    {
      "section": "Install",
      "title": "安装",
      "content": [
        {
          "type": "prose",
          "text": "Astryx 需要 React 19 或更高版本：`react` 和 `react-dom` >= 19.0.0 是 `@astryxdesign/core` 的 peer 依赖。"
        },
        {
          "type": "prose",
          "text": "添加核心包及其 `@stylexjs/stylex` peer 依赖，再加上一个主题和 CLI。"
        },
        {
          "type": "code",
          "label": "终端"
        },
        {
          "type": "prose",
          "text": "然后运行 `{@command init}` 安装 AI Agent 速查表（AGENTS.md/CLAUDE.md）。它是非交互式的，没有提示，因此对 AI Agent、CI 和脚本都很安全。加上 `--all` 可获得指向主题和页面构建工作流的指引。"
        },
        {
          "type": "code",
          "label": "终端"
        }
      ]
    },
    {
      "section": "Upgrade",
      "title": "升级",
      "content": [
        {
          "type": "prose",
          "text": "用一条命令把应用列出的所有 Astryx 包升级到同一发布版本。每个主题都声明了它所兼容的确切 Core 版本，因此停留在旧版本的主题将不再匹配新的 Core。"
        },
        {
          "type": "code",
          "label": "终端"
        },
        {
          "type": "prose",
          "text": "将应用列出的其他所有 Astryx 包也加入同一条命令，并把之前使用的 Core 版本传给 `--from`。如果你的包管理器会延迟新版本发布，请将整个 `@astryxdesign/*` 范围加入豁免；在 pnpm 中为 `minimumReleaseAgeExclude: ['@astryxdesign/*']`。只豁免其中部分包会导致不同发布版本的包被并排安装。"
        }
      ]
    },
    {
      "section": "Install once, use everywhere",
      "title": "一次安装，随处使用",
      "content": [
        {
          "type": "prose",
          "text": "也为你的电脑全局安装一次 CLI，这样无论对你自己还是任何编码 Agent，astryx 命令都能在任何文件夹中使用，甚至还没有项目时也可以。在项目内部，仍然由项目自己的版本应答，因此全局安装永远不会改变团队和 CI 得到的结果。也请把它保留在项目中；这是推荐的设置方式。"
        },
        {
          "type": "code",
          "label": "终端"
        },
        {
          "type": "prose",
          "text": "项目、全局还是两者都要：{@link generic:project-global-or-both}。关于全局模式的其他内容：{@link namespace:global}。"
        }
      ]
    },
    {
      "section": "Add base CSS and a theme",
      "title": "添加基础 CSS 和主题",
      "content": [
        {
          "type": "prose",
          "text": "在你的全局 CSS 中导入 reset 和基础样式。然后运行 `{@command theme add neutral}`；生成的应用模块会导入该主题的生产 CSS 和字体 CSS。"
        },
        {
          "type": "code",
          "label": "globals.css"
        },
        {
          "type": "prose",
          "text": "运行 `{@command theme list}` 查看所有主题。"
        },
        {
          "type": "code",
          "label": "应用根节点"
        },
        {
          "type": "list",
          "items": [
            "`@astryxdesign/theme-neutral`：柔和极简，是不错的起点",
            "`@astryxdesign/theme-butter`：温暖的黄金色调，点缀蓝色",
            "`@astryxdesign/theme-chocolate`：浓郁的巧克力色与焦糖色调",
            "`@astryxdesign/theme-gothic`：仅深色主题，融合墨水与黑色电影风格",
            "`@astryxdesign/theme-matcha`：大地绿意与植物色调",
            "`@astryxdesign/theme-stone`：受砂岩启发的温暖中性色",
            "`@astryxdesign/theme-y2k`：俏皮的 2000 年代初流行美学"
          ]
        },
        {
          "type": "prose",
          "text": "这些样式表采用级联分层：reset 加载于 @layer reset，组件样式加载于 @layer astryx-base。如果你的项目已有全局 CSS、旧版 reset 或 Tailwind，请显式声明层级顺序，并有意识地把每个样式表分配到某个层级：未分层的样式和更晚的层级都会覆盖 astryx-base，无论特异性如何。在构建界面之前，请阅读 {@link generic:migration-setup} 中关于级联层级的两节内容。"
        },
        {
          "type": "prose",
          "text": "完整主题指南请见 {@link generic:use-a-theme}。"
        }
      ]
    },
    {
      "section": "Add your first component",
      "title": "添加第一个组件",
      "content": [
        {
          "type": "prose",
          "text": "从每个组件自己的入口导入它，即 `{@command component <Name>}` 打印的路径。这样可以保持打包体积小巧，并让意图清晰。"
        },
        {
          "type": "code",
          "label": "app/page.tsx"
        }
      ]
    },
    {
      "section": "Customize with StyleX",
      "title": "使用 StyleX 自定义",
      "content": [
        {
          "type": "prose",
          "text": "Astryx 组件支持多种样式方案，从纯 CSS 和 `className` 到 Tailwind 和 CSS-in-JS 均可。完整指南见 {@link namespace:styling}。Astryx 还与 [StyleX](https://stylexjs.com/)（一个原子化 CSS-in-JS 库）深度集成：用 `stylex.create()` 创建样式，并通过 `xstyle` 属性传给组件。"
        },
        {
          "type": "code",
          "label": "样式覆盖"
        }
      ]
    },
    {
      "section": "Example Apps",
      "title": "示例应用",
      "content": [
        {
          "type": "prose",
          "text": "如需完整可运行的项目，请从仓库克隆一个示例应用。这些都是完整设置，已把路由、主题和组件连接在一起。"
        },
        {
          "type": "table",
          "headers": [
            "示例",
            "技术栈",
            "路径"
          ],
          "rows": [
            [
              "Next.js",
              "Next.js + 主题 CSS",
              "[apps/example-nextjs](https://github.com/meta/astryx/tree/main/apps/example-nextjs)"
            ],
            [
              "Next.js + StyleX",
              "Next.js + StyleX（用于自定义样式）",
              "[apps/example-nextjs-stylex](https://github.com/meta/astryx/tree/main/apps/example-nextjs-stylex)"
            ],
            [
              "Next.js + Tailwind",
              "Next.js + Tailwind 桥接",
              "[apps/example-nextjs-tailwind](https://github.com/meta/astryx/tree/main/apps/example-nextjs-tailwind)"
            ],
            [
              "Vite + Tailwind",
              "Vite + Tailwind 桥接",
              "[apps/example-vite-tailwind](https://github.com/meta/astryx/tree/main/apps/example-vite-tailwind)"
            ]
          ]
        },
        {
          "type": "code",
          "label": "克隆并运行示例"
        }
      ]
    },
    {
      "section": "Explore the CLI",
      "title": "探索 CLI",
      "content": [
        {
          "type": "prose",
          "text": "CLI 是你查阅组件、令牌、模板和文档的参考。为了可靠调用（尤其是在使用 AI 助手时），请把这段脚本加入 package.json："
        },
        {
          "type": "code",
          "label": "package.json"
        },
        {
          "type": "prose",
          "text": "然后探索有哪些可用内容："
        },
        {
          "type": "code",
          "label": "终端"
        }
      ]
    }
  ]
};
