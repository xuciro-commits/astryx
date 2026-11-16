// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for icons.doc.mjs.
export const docsZh = {
  "title": "图标",
  "description": "设计系统中可用的语义图标名称。它们会适配当前主题的图标注册表。",
  "sections": [
    {
      "section": "Available Names",
      "title": "可用名称",
      "content": [
        {
          "type": "prose",
          "text": "接受 icon 属性的组件使用 IconType：可以是语义名称字符串，也可以直接传入 SVG 组件。下面的语义名称通过全局图标注册表解析。"
        },
        {
          "type": "table",
          "headers": [
            "名称",
            "用途"
          ],
          "rows": [
            [
              "close",
              "关闭，用于关闭对话框/面板"
            ],
            [
              "chevronDown",
              "下拉菜单触发器，展开/折叠"
            ],
            [
              "chevronLeft",
              "返回，上一项"
            ],
            [
              "chevronRight",
              "前进，下一项"
            ],
            [
              "chevronsLeft",
              "跳到第一项，跳到开头"
            ],
            [
              "chevronsRight",
              "跳到最后一项，跳到末尾"
            ],
            [
              "check",
              "复选框已选中，确认"
            ],
            [
              "success",
              "成功状态指示"
            ],
            [
              "error",
              "错误状态指示"
            ],
            [
              "warning",
              "警告状态指示"
            ],
            [
              "info",
              "信息状态指示，工具提示"
            ],
            [
              "calendar",
              "日期选择器，日程安排"
            ],
            [
              "clock",
              "时间选择器，时间戳"
            ],
            [
              "externalLink",
              "在新标签页打开的链接"
            ],
            [
              "menu",
              "汉堡菜单，导航切换"
            ],
            [
              "moreHorizontal",
              "溢出菜单，更多操作"
            ],
            [
              "search",
              "搜索输入框，查找"
            ],
            [
              "upload",
              "上传文件或内容"
            ],
            [
              "arrowUp",
              "按升序排序，向上移动"
            ],
            [
              "arrowDown",
              "按降序排序，向下移动"
            ],
            [
              "arrowsUpDown",
              "可排序列指示"
            ],
            [
              "funnel",
              "筛选控件"
            ],
            [
              "eyeSlash",
              "隐藏/可见性切换"
            ],
            [
              "viewColumns",
              "列可见性设置"
            ],
            [
              "copy",
              "复制到剪贴板"
            ],
            [
              "checkDouble",
              "已复制确认"
            ],
            [
              "wrench",
              "设置，配置"
            ],
            [
              "stop",
              "停止/取消操作"
            ],
            [
              "microphone",
              "语音输入，音频录制"
            ]
          ]
        }
      ]
    },
    {
      "section": "Custom Icons",
      "title": "自定义图标",
      "content": [
        {
          "type": "prose",
          "text": "对于不在语义列表中的图标，直接传入 SVG 组件。任何 ComponentType<SVGProps<SVGSVGElement>> 都可以；Icon 会自动应用尺寸和颜色样式。"
        },
        {
          "type": "code",
          "label": "使用自定义 SVG 组件"
        }
      ]
    },
    {
      "section": "Theme Overrides",
      "title": "主题覆盖",
      "content": [
        {
          "type": "prose",
          "text": "主题可以通过 `defineTheme()` 中的 `icons` 字段替换任意语义名称的默认 SVG。这样无需改动组件代码即可替换图标集（例如 heroicons → lucide），并且查找范围限定在当前主题内，而不会修改全局默认值。"
        },
        {
          "type": "code",
          "label": "主题作用域内的图标"
        },
        {
          "type": "prose",
          "text": "条目也可以是基于请求的函数，这样主题就能把 Icon 的尺寸映射到其图标库自己的属性或图形。`Icon` 以 `{size, variant}` 调用它，其中 `size` 是它渲染时使用的尺寸（`xsm`、`sm`、`md` 或 `lg`：显式的 `size`，否则使用所属组件的默认值，再否则为 `md`）。单节点读取操作——`getIcon()`、`useIcon()`、`getIconRegistry()` 以及主题的 `icons` 字段——会以 `{size: 'md'}` 调用它。相同的条目形状在 `registerIcons()` 中同样适用。"
        },
        {
          "type": "code",
          "label": "可感知尺寸的图标条目"
        },
        {
          "type": "prose",
          "text": "请保持函数纯净且同步：它只根据请求计算结果，不使用 Hook、不测量 DOM 或 SVG、不访问浏览器全局对象、不进行网络访问、不依赖可变的模块状态，也没有副作用。其结果就是最终结果。返回 `null` 将不绘制任何字形，而不是回退到已注册或内置图标；而节点条目为 `null` 或 `undefined` 时仍会回退。子主题为某个键设置条目时，会替换该键继承来的条目。"
        }
      ]
    },
    {
      "section": "Icon Variants",
      "title": "图标变体",
      "content": [
        {
          "type": "prose",
          "text": "主题通过 `defineTheme()` 中的 `iconVariants` 一次性列出它支持的图标变体名称。该列表属于整个主题，而不是某个图标，Astryx 不定义自己的名称。在 `defineTheme` 内，条目函数接收的 `variant` 类型为所列名称之一或 `undefined`，因此拼错名称会触发类型错误。收到 `undefined` 的条目会绘制其正常图形。"
        },
        {
          "type": "code",
          "label": "列出变体并将其映射到图形"
        },
        {
          "type": "prose",
          "text": "通过 `extends` 继承另一个主题的主题会继承其列表，除非它设置自己的列表；它设置的列表会替换继承的列表，而不是与之合并。"
        },
        {
          "type": "prose",
          "text": "使用 `Icon` 的 `variant` 属性请求变体。只有当当前主题列出该变体时，条目才会收到它；主题继承的条目还需要定义它的主题列出该变体。否则条目会收到 `undefined` 并绘制其正常图形，因此未列出的变体绝不会破坏渲染。`registerIcons()` 条目会收到当前主题列出的变体，而节点条目对每个变体都绘制同一节点。直接传给 `Icon` 的图标组件永远不会收到 `variant`，`variant` 也不会写入 DOM：它只用于选择图形，因此没有针对它的主题选择器。"
        },
        {
          "type": "code",
          "label": "请求变体"
        },
        {
          "type": "prose",
          "text": "应用通过扩展 `@astryxdesign/core/Icon` 中的 `IconVariantMap` 来声明它使用的变体名称。`IconVariant` 就是这些名称，传给 `registerIcons()` 的条目接收的 `variant` 类型为 `IconVariant`。`astryx theme build` 会为构建后主题的列表写入这一扩展。"
        },
        {
          "type": "code",
          "label": "声明应用使用的变体名称"
        }
      ]
    },
    {
      "section": "Component and Library Icons",
      "title": "组件与库图标",
      "content": [
        {
          "type": "prose",
          "text": "属于某个组件或库的字形会获得带命名空间的键（`numberInput:stepperDown`、`richtext:bold`），而不是新的语义名称。它通过同一注册表解析，主题也以相同方式覆盖它，但共享的 IconName 列表仍然保留给整个系统使用的字形，因此新增一个字形不会让每个下游图标注册表都增加一个键。"
        },
        {
          "type": "code",
          "label": "拥有并为带命名空间的图标设置主题"
        },
        {
          "type": "prose",
          "text": "在 Core 之外，向 `getExtendedIcon(key, fallback)` 传入回退值，以便在没有主题时也能渲染该字形。"
        }
      ]
    },
    {
      "section": "Component Icon Slots",
      "title": "组件图标槽位",
      "content": [
        {
          "type": "prose",
          "text": "组件图标槽位命名了图标出现在某个组件中的原因，例如 CodeBlock 复制按钮的 `code-block-copy`。`defineTheme({componentIcons})` 把槽位映射到某个共享图标名称。这样主题就能更改某个组件使用的图标，而不会在所有地方更改该名称的图形；`icons` 仍然为每个名称选择图形。每个组件的文档都会列出其槽位、状态和回退项（`astryx component CodeBlock`）。"
        },
        {
          "type": "code",
          "label": "映射槽位及其状态"
        },
        {
          "type": "prose",
          "text": "槽位值可以是共享图标名称、用于隐藏图标的 `null`，或由 `icon`、`variant` 和 `size` 组成的部分请求。请求中省略的字段会保留组件自身的值。带状态的槽位还接受一个基于该状态的纯同步函数，该函数返回请求：返回 `null` 会隐藏图标，返回 `undefined` 则不做任何更改。请求中的 `size` 只会更改图标，绝不会更改其周围的控件。组件调用方传入的图标内容优先于槽位。"
        },
        {
          "type": "prose",
          "text": "未知的图标名称、主题未列出的变体，或 `xsm`、`sm`、`md`、`lg` 之外的尺寸，都会在该字段中被忽略，并产生一条开发警告。扩展另一个主题的主题会按槽位合并 `componentIcons`（{@link generic:author-a-theme}）。`theme.componentIcons` 会读回名称、`null` 值和静态请求，并省略由函数解析的槽位。"
        }
      ]
    }
  ]
};
