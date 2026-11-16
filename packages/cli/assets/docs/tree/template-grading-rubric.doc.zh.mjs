// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for template-grading-rubric.doc.mjs.
export const docsZh = {
  "title": "完整评分细则",
  "description": "使用一套共享的启发式规则，在 Astryx 使用情况、图标、CSS、布局、元数据、图像和代码质量方面一致地评估模板质量。",
  "sections": [
    {
      "section": "Understand the score",
      "title": "理解评分",
      "content": [
        {
          "type": "prose",
          "text": "请先阅读 {@link generic:is-my-code-good}：它定义了共享的 Astryx 质量标准。本细则补充模板权重、计数规则和仅适用于模板的检查项，并且每个评分项都会注明其所对应的共享标准。"
        },
        {
          "type": "prose",
          "text": "模板细则 1.4 对七个类别评分，总分为 100 分。请以 100 分为目标；B（75 分）是发布下限，而不是目标。下文每个类别都列出了其权重。切勿为任何你未检查的内容给分。"
        },
        {
          "type": "table",
          "headers": [
            "等级",
            "分数",
            "含义"
          ],
          "rows": [
            [
              "A",
              "90-100",
              "优秀。可直接复制使用，没有已知质量问题。"
            ],
            [
              "B",
              "75-89",
              "良好。可能仍存在小问题，但模板可用。"
            ],
            [
              "C",
              "60-74",
              "发布前尚需改进。"
            ],
            [
              "D",
              "40-59",
              "较差。需要进行大幅改写。"
            ],
            [
              "F",
              "0-39",
              "不合格。该模板会示范或产生不良模式。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "只要扣分项还有合理的修复方式，就应继续改进。只有当剩余的取舍是有意为之且有记录时，低于 100 分才可以接受。如果复制后的文件无法构建或缺少必需的资源，那么无论得分多少，该模板都未就绪。"
        },
        {
          "type": "prose",
          "text": "版本 1.4 将公开集成组件视为 Astryx 组件，并在复制后对资源和导入进行评分。请为每次评分记录版本，以便结果保持可比性。"
        }
      ]
    },
    {
      "section": "Astryx component purity: 30 points",
      "title": "Astryx 组件纯度：30 分",
      "content": [
        {
          "type": "prose",
          "text": "此类别评分 {@link generic:is-my-code-good} 中的 Astryx 组件标准。请统计复制后的 `.tsx` 源码中每个 JSX 开始标签。Astryx 元素是指从 `@astryxdesign/core` 或集成包的公开组件导出中导入的组件。原生 HTML 元素是指任何小写的内建 JSX 标签。请按出现次数统计，而不仅仅是唯一标签名。"
        },
        {
          "type": "prose",
          "text": "不要统计片段（fragment）或同一文件中定义的 PascalCase 辅助函数。请检查该辅助函数，并统计其中的原生 HTML。对于每个原生元素，请依据该指南判断：是因为 Astryx 没有等价组件而必须使用，还是因为可以用 Astryx 组件替代而不必要。"
        },
        {
          "type": "table",
          "headers": [
            "原生 HTML 元素",
            "分数"
          ],
          "rows": [
            [
              "0",
              "30"
            ],
            [
              "1-2，全部必要",
              "25"
            ],
            [
              "1-2，存在不必要",
              "20"
            ],
            [
              "3-5",
              "15"
            ],
            [
              "6-10",
              "8"
            ],
            [
              "11-20",
              "4"
            ],
            [
              "21 个或更多",
              "0"
            ]
          ]
        },
        {
          "type": "list",
          "items": [
            "当没有合适的通用 Astryx 图像组件，且其来源通过「图像处理」类别检查时，不要因 `img` 扣分。",
            "不要因 `form` 包裹 `FormLayout` 以提供原生提交语义而扣分。",
            "当 `input type=\"hidden\"` 承载原生表单状态时，不要扣分。"
          ]
        }
      ]
    },
    {
      "section": "Icon purity: 15 points",
      "title": "图标纯度：15 分",
      "content": [
        {
          "type": "prose",
          "text": "此类别评分 {@link generic:is-my-code-good} 中的图标标准。请统计复制文件中的原生图标标记。{@link generic:template-icons} 展示了如何改为通过 Astryx 渲染图标。"
        },
        {
          "type": "list",
          "items": [
            "统计每个用作图标的原生 `svg`、`path`、`circle`、`rect`、`line`、`polyline`、`polygon`、`ellipse` 或 `g`。",
            "统计模板中定义的内联 SVG 组件。",
            "统计直接渲染而非通过 `Icon` 或 Astryx 图标属性渲染的图标组件。"
          ]
        },
        {
          "type": "table",
          "headers": [
            "原生 SVG 图标实例",
            "分数"
          ],
          "rows": [
            [
              "0",
              "15"
            ],
            [
              "1-2",
              "10"
            ],
            [
              "3-5",
              "5"
            ],
            [
              "6 个或更多",
              "0"
            ]
          ]
        }
      ]
    },
    {
      "section": "Custom CSS: 15 points",
      "title": "自定义 CSS：15 分",
      "content": [
        {
          "type": "prose",
          "text": "此类别评分 {@link generic:is-my-code-good} 中的样式标准。请统计 `stylex.create` 和行内 `style` 对象中的各个 CSS 属性。每次使用 `className` 和 `stylex.props` 各计一次。不要统计 Astryx 属性，例如 `gap`、`padding`、`variant`、`size`、`color`、`level`、`columns`、`contentPadding` 或 `height`。"
        },
        {
          "type": "table",
          "headers": [
            "自定义样式声明",
            "分数"
          ],
          "rows": [
            [
              "0",
              "15"
            ],
            [
              "1-3，全部有正当理由，因为不存在 Astryx 替代方案",
              "12"
            ],
            [
              "1-3，存在无正当理由的情况，因为已有 Astryx 属性可用",
              "8"
            ],
            [
              "4-10",
              "5"
            ],
            [
              "11-20",
              "2"
            ],
            [
              "21 个或更多",
              "0"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "此类别评分复制源码中编写的样式。包样式表应通过其对可移植性和渲染后应用的影响来评分，而不是将其视为隐藏自定义声明、逃避此计数的方式。"
        }
      ]
    },
    {
      "section": "Layout and structure: 15 points",
      "title": "布局与结构：15 分",
      "content": [
        {
          "type": "heading",
          "text": "页面模板"
        },
        {
          "type": "list",
          "items": [
            "使用 {@link generic:is-my-code-good} 中的布局标准选择页面根节点。在模板中，只有以 `Shell -` 开头的类别拥有全局外壳，因此它使用 `AppShell`；其他所有页面模板使用 `Layout` 或 `Center`。",
            "在 `Shell -` 模板之外，将全局导航留给宿主应用。将页内导航放在 `LayoutPanel` 中，将页面标题放在 `LayoutHeader` 中。",
            "对于响应式集合，使用带 `columns={{minWidth: 280}}` 的 `Grid`。不要固定列数，也不要用原生 CSS 重建网格。",
            "对于居中内容，使用 `Center`，而不是自定义 flexbox 变通方案。",
            "从一个源文件渲染一个页面。链接可以是无效的示例，但模板不会创建嵌套路由或路由集成。"
          ]
        },
        {
          "type": "table",
          "headers": [
            "页面条件",
            "分数"
          ],
          "rows": [
            [
              "正确的根节点、响应式网格、正确的居中以及单页面",
              "15"
            ],
            [
              "根节点有效，但存在较小问题，例如固定列或多页面行为",
              "8"
            ],
            [
              "类别对应的根节点错误、使用原生布局根节点，或没有 Astryx 根节点",
              "0"
            ]
          ]
        },
        {
          "type": "heading",
          "text": "区块模板"
        },
        {
          "type": "list",
          "items": [
            "不要在区块外层包裹 `AppShell`。区块是在预览或页面容器内渲染的。",
            "让区块专注于一种模式或组件用法。",
            "组合要足够丰富以示范该模式，又要足够精简以便改编。通常约为 20-100 行。"
          ]
        },
        {
          "type": "table",
          "headers": [
            "区块条件",
            "分数"
          ],
          "rows": [
            [
              "没有 `AppShell`、专注于一种模式且长度合理",
              "15"
            ],
            [
              "聚焦或长度方面存在较小问题",
              "10"
            ],
            [
              "被 `AppShell` 包裹或严重缺乏聚焦",
              "0"
            ]
          ]
        }
      ]
    },
    {
      "section": "Doc metadata: 10 points",
      "title": "文档元数据：10 分",
      "content": [
        {
          "type": "prose",
          "text": "字段准确性占 6 分，描述占 3 分，命名占 1 分。请将源码与文档一起阅读。字段存在但与源码不一致，视为不完整。"
        },
        {
          "type": "heading",
          "text": "字段：6 分"
        },
        {
          "type": "list",
          "items": [
            "页面：`type`、`name`、`displayName`、`description`、显式的 `isReady`，以及（当页面用于浏览时）具体的 `category`。",
            "区块：`type`、`name`、`displayName`、`description`、显式的 `isReady`、正数的 `aspectRatio`，以及完整的 `componentsUsed`。",
            "关系字段和预览字段遵循 {@link generic:block-template}。与该指南相矛盾的取值属于不准确。"
          ]
        },
        {
          "type": "table",
          "headers": [
            "字段条件",
            "分数"
          ],
          "rows": [
            [
              "所有适用字段均存在且准确",
              "6"
            ],
            [
              "所有字段均存在，但有一处不准确",
              "4"
            ],
            [
              "缺少一个必需字段",
              "2"
            ],
            [
              "缺少两个或更多必需字段，或不存在文档",
              "0"
            ]
          ]
        },
        {
          "type": "heading",
          "text": "描述：3 分"
        },
        {
          "type": "prose",
          "text": "一条出色的描述涵盖四个方面：原型（archetype）、用户完成的任务、结构或行为上的差异点，以及用户可能搜索的替代词。在去除 page、screen、app、view 等泛化词和组件名称后，至少应使用六个不同的实词。描述可复用的形态，而不仅仅是示例数据。"
        },
        {
          "type": "table",
          "headers": [
            "描述条件",
            "分数"
          ],
          "rows": [
            [
              "四个要素齐全、包含 6 个或更多不同实词，且与同类模板有清晰区分",
              "3"
            ],
            [
              "指出并区分了该模式，但缺少一个要素或某个同义词仍未明确",
              "2"
            ],
            [
              "过于笼统、重复组件名称，或只描述示例数据",
              "1"
            ],
            [
              "缺失或只是重复名称",
              "0"
            ]
          ]
        },
        {
          "type": "heading",
          "text": "命名：1 分"
        },
        {
          "type": "prose",
          "text": "id 遵循 {@link generic:start-a-template}，`displayName` 可读，且可浏览页面具有具体的 category（{@link generic:page-template}）。Slug 长度是指导性建议，不是评分条件。"
        },
        {
          "type": "table",
          "headers": [
            "命名条件",
            "分数"
          ],
          "rows": [
            [
              "id、显示名称和适用类别均遵循约定",
              "1"
            ],
            [
              "任何命名或类别要求未满足",
              "0"
            ]
          ]
        }
      ]
    },
    {
      "section": "Image handling: 5 points",
      "title": "图像处理：5 分",
      "content": [
        {
          "type": "prose",
          "text": "此类别评分 {@link generic:is-my-code-good} 中的图像与资源标准。请依据 {@link generic:template-images-media} 检查复制文件中的每个图像引用。"
        },
        {
          "type": "table",
          "headers": [
            "图像条件",
            "分数"
          ],
          "rows": [
            [
              "无需图像，或每张图像在复制后仍可用且演示占位符行为是有意为之",
              "5"
            ],
            [
              "一张可选的演示图像在预览中缺失，或仍残留占位符服务",
              "2"
            ],
            [
              "关键图像在复制后失效、使用包相对路径，或依赖无法访问的 URL",
              "0"
            ]
          ]
        }
      ]
    },
    {
      "section": "Code quality: 10 points",
      "title": "代码质量：10 分",
      "content": [
        {
          "type": "prose",
          "text": "此类别评分 {@link generic:is-my-code-good} 中的代码健康标准，以及仅适用于模板的条件。每个条件给 2 分。请评分复制后的文件，而不仅仅是包的源码。"
        },
        {
          "type": "table",
          "headers": [
            "条件",
            "分数",
            "验证方式"
          ],
          "rows": [
            [
              "正确的客户端边界",
              "2",
              "当 Hooks、事件处理程序或浏览器 API 需要时，`use client` 是第一条可执行语句。静态模板不会在不需要时添加它。"
            ],
            [
              "默认导出",
              "2",
              "复制后的文件有一个默认导出的 React 组件。"
            ],
            [
              "自包含导入",
              "2",
              "每个导入都能从复制位置解析：通过 React、公开的 Astryx 路径、公开的集成包导出，或模板明确要求的应用依赖。"
            ],
            [
              "真实的示例数据",
              "2",
              "内容使用真实的名字、金额、日期、长度和状态，而不是 lorem ipsum 或编号占位符。"
            ],
            [
              "无死代码",
              "2",
              "没有未使用的导入或变量、被注释掉的代码块，或从未被调用的辅助函数。"
            ]
          ]
        }
      ]
    }
  ]
};
