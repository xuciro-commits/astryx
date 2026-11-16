// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for layout-spacing.doc.mjs.
export const docsZh = {
  "title": "布局间距",
  "description": "每个区域保持一条内容线，再调整间隙和密度。",
  "sections": [
    {
      "section": "Spacing",
      "title": "间距",
      "content": [
        {
          "type": "prose",
          "text": "每个区域保持一条内容线，再调整间隙和密度。对齐、节奏以及密度和尺寸都建立在这些规则之上。"
        },
        {
          "type": "list",
          "items": [
            "让容器负责内边距；子元素把自己的外边距归零",
            "每个区域保持一条内容线：文本落在线上，悬停背景延伸到边缘",
            "区域的页眉、主体和页脚使用同一个内边距令牌",
            "让紧凑和宽松的间隙形成对比，无需边框也能看出分组",
            "每行只用一种控件尺寸；密度要匹配使用频率"
          ]
        },
        {
          "type": "list",
          "items": [
            "双重内边距：组件相对其 Section 标题缩进（只保留一个内缩负责方）",
            "内部间距使用原始 px；只应使用令牌，px 用于结构性宽度",
            "所有地方重复同一个间隙，导致分组感被抹平",
            "同一行混用控件尺寸"
          ]
        }
      ]
    },
    {
      "section": "Alignment",
      "title": "对齐",
      "content": [
        {
          "type": "prose",
          "text": "容器负责内边距和子元素间隙；子元素把自己的外边距归零，内部间距始终使用令牌。每个区域选定一条内容线并保持其固定，而不是固定内边距：`container_inset = content_line - component_intrinsic_inset`。"
        },
        {
          "type": "list",
          "items": [
            "Text 和 Heading 不带内缩，因此容器承担完整的内边距",
            "List、Tab、Menu 和导航项带有较小的内缩，因此容器让出内边距，由组件拥有这条线",
            "表格单元格带有较大的内缩，因此容器让出内边距，由单元格拥有这条线"
          ]
        },
        {
          "type": "code",
          "label": "一条内容线，两个内缩负责方"
        },
        {
          "type": "prose",
          "text": "验证：在区域左侧画一条垂直线。每个标签都触碰这条线；只有悬停和选中背景会越过它。"
        }
      ]
    },
    {
      "section": "Rhythm",
      "title": "节奏",
      "content": [
        {
          "type": "prose",
          "text": "分组感来自紧凑间隙与宽松间隙之间的对比，而不是反复使用同一个值。如果所有间隙都采用同一档，邻近关系就不起作用。"
        },
        {
          "type": "list",
          "items": [
            "紧凑间隙用于绑定：最小的几档，用在条目或字段内部",
            "宽松间隙用于分隔：向上跨越几档，用在各个区域之间",
            "用中间的档位来调节节奏，而不是把所有值都归到同样两档"
          ]
        },
        {
          "type": "code",
          "label": "内部紧凑，之间宽松"
        },
        {
          "type": "prose",
          "text": "验证：移除所有边框后，仅凭间距仍能说出各个分组。如果做不到，说明间隔太均匀。表单字段是例外：它们的间距由 FormLayout 负责。"
        }
      ]
    },
    {
      "section": "Density and size",
      "title": "密度与尺寸",
      "content": [
        {
          "type": "prose",
          "text": "让密度匹配区域的使用频率，并让一行中的每个控件尺寸一致，使高度共享同一基线。"
        },
        {
          "type": "list",
          "items": [
            "紧凑：需要快速浏览的高密度区域，例如日志、监控和大数据集",
            "平衡：大多数 Table 和 List 界面",
            "宽敞：低频或高风险的列表行，例如设置或简短的选择列表"
          ]
        },
        {
          "type": "code",
          "label": "密度与控件尺寸搭配"
        },
        {
          "type": "prose",
          "text": "验证：一行中的每个交互元素尺寸一致，并且该尺寸与其所在区域的密度相匹配。"
        }
      ]
    }
  ]
};
