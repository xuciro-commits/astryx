// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for responsive.doc.mjs.
export const docsZh = {
  "title": "响应式",
  "description": "决定每个区域在宽度变化时的行为：划分、显示、调整大小或切换。",
  "sections": [
    {
      "section": "Breakpoints",
      "title": "断点",
      "content": [
        {
          "type": "prose",
          "text": "决定每个区域在宽度变化时的行为。在认为布局完成之前，为每个区域写下响应式契约。"
        },
        {
          "type": "list",
          "items": [
            "在认为布局完成之前，为每个区域写下契约",
            "按区域决定在每个宽度下是显示、调整大小还是切换",
            "宁可舍弃一个区域，也不要让它争夺并不存在的宽度"
          ]
        },
        {
          "type": "list",
          "items": [
            "在三个区域都没有可用空间的宽度下仍保留它们",
            "统一缩小每个区域，而不是切换或舍弃其中一个",
            "在 CSS 中接入契约注释从未提到的断点"
          ]
        }
      ]
    },
    {
      "section": "Responsive contract",
      "title": "响应式契约",
      "content": [
        {
          "type": "prose",
          "text": "确定每个区域在宽度变化时的行为，并为契约的每一行配上负责落实它的属性或 Hook。"
        },
        {
          "type": "list",
          "items": [
            "划分：在每个宽度下保留多少个区域",
            "显示：哪些区域只在有空间时才获得宽度，低于该宽度时按需打开",
            "调整大小：内容弹性伸缩，固定区域保持其预算，文本始终受 contentWidth 限制，以保持行宽",
            "切换：导航在 AppShell 的 mobileNav 断点处变为 MobileNav；侧面板变为 Dialog 或 BottomSheet，由 useMediaQuery 驱动"
          ]
        },
        {
          "type": "code",
          "label": "与属性关联的契约"
        },
        {
          "type": "prose",
          "text": "验证：契约的每一行都指明一种机制，因此注释不会偏离实际行为。"
        }
      ]
    },
    {
      "section": "Columns that reflow",
      "title": "可重排的列",
      "content": [
        {
          "type": "prose",
          "text": "对于在小屏幕上需要重排的列，请使用 `Grid columns={{minWidth, max}}`。数字形式的 `columns` 在任何宽度下都恰好是 N 列，且永不重排：在 390px 的手机上 `columns={4}` 会渲染出四个宽度不足 100px 的轨道，一旦内容无法收缩适应，该行就会溢出页面。`{minWidth: 240, max: 4}` 最多渲染四列，每列至少 240px，并在容器变窄时降为单列全宽；`max` 使最后一列可以收缩到容器宽度，而 `gap` 会计入列所需的可用空间。"
        },
        {
          "type": "code",
          "label": "可重排的统计行与固定的周行对比"
        },
        {
          "type": "list",
          "items": [
            "仅 `{minWidth}`：按最小宽度能放多少列就放多少列，没有上限；容器窄于 `minWidth` 时会溢出，因此凡是会出现在手机上的布局都应添加 `max`",
            "`{minWidth, repeat: 'fit'}`：空轨道会折叠，让现有项目拉伸",
            "比网格当前列数更宽的数字 `GridSpan` 会给整个网格添加隐式列；放在该跨度前后两侧的项目会流入这些列，而 `columns='full'` 此时只覆盖显式列。在可重排的网格中，请将跨度限制在它可能达到的最小列数之内，或使用 `'full'`，它不会添加任何列",
            "改变列可用空间的样式会改变可重排布局能达到的列数：`columnGap` 或 `gap` 的档位、网格上的内联 padding，或通过 `xstyle` 设置的 `grid-auto-flow: column`（会把项目放入额外的隐式列）。`className` 规则只有在级联中胜过生成的样式时才会替换计算出的轨道列表；覆盖样式时优先使用 `xstyle`"
          ]
        }
      ]
    }
  ]
};
