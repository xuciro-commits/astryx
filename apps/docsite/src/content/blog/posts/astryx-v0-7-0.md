---
title: 'Astryx v0.7.0：更好的移动体验、更清晰的输入控件，以及更坚实的基础'
description: 'v0.6.0 之后发布的内容：更易用的表单、更强的移动端行为、可组合的 Markdown、更好的数据展示、更清晰的 CLI 集成，以及有引导的迁移。'
date: '2026-10-12'
type: 'update'
draft: false
authors:
  - 'team'
tags:
  - '发布'
  - '主题'
  - '组件'
  - '无障碍'
---

Astryx v0.7.0 汇集了从 v0.6.1 到 v0.6.8 的全部已发布内容，以及本次发布的最后一批更新。此次发布改进了人们最常接触的体验——表单、移动端布局、菜单、Markdown 和表格——同时让主题与 CLI 的行为更加可预期。

## 表单与输入控件

现在，你传入的样式、ID 和事件处理器会落在人们实际使用的控件上，可搜索的选择器也能创建缺失的选项。

```diff
 <TextInput
   label="Project name"
   value={name}
   onChange={setName}
-  xstyle={styles.projectName}
+  controlXstyle={styles.projectName}
 />

 <Typeahead
   label="Assignee"
   searchSource={peopleSource}
   value={assignee}
   onChange={setAssignee}
-  xstyle={styles.assigneeField}
-  emptySearchResultsText="No people found"
+  containerXstyle={styles.assigneeField}
+  emptySearchText="No people found"
 />
```

### 搜索时创建缺失的选项

![一个 Reviewers 多选控件，带有一个 Platform 徽章。它打开后会显示一个搜索字段和三个复选框选项；输入 Access 后只剩一行：Create "Access"。选中它后，字段中会增加一个 Access 徽章，列表末尾会新增一个已勾选的 Access 选项。](/blog/astryx-v0-7-0/multiselector-create.webp)

_在启用 `hasSearch` 和 `hasCreate` 时，如果某个查询没有匹配任何选项，就会出现一个 Create 行。`onChange` 会收到新值以及一个 `{type: 'create', query}` 描述符，以便你的应用添加该选项。_

```tsx
const [reviewerOptions, setReviewerOptions] = useState(initialReviewerOptions);
const [reviewers, setReviewers] = useState(['platform']);

<MultiSelector
  label="Reviewers"
  options={reviewerOptions}
  value={reviewers}
  onChange={(next, change) => {
    if (change?.type === 'create') {
      setReviewerOptions(current => [
        ...current,
        {value: change.query, label: change.query},
      ]);
    }
    setReviewers(next);
  }}
  hasSearch
  hasCreate
  triggerDisplay="badges"
/>;
```

## 菜单与浮层

菜单可以在各行旁放置真实的控件，并在触摸设备上钻入子菜单；sheet、对话框和 toast 会按人们期望的方式堆叠、关闭，并为内容留出内边距。

### 在菜单行旁放置控件

![一个打开的 Assign reviewer 下拉菜单。一个 Filter reviewers 文本字段位于四个姓名行上方，它们下方是一个带加号图标、标有 Create team 的按钮，全部位于同一个弹出层内。](/blog/astryx-v0-7-0/menu-header-footer@2x.png)

_头部和底部控件保持在菜单本身之外，因此屏幕阅读器读到的仍是普通菜单，Tab 键也会按顺序到达各个区域。_

```tsx
import {PlusIcon} from '@heroicons/react/24/outline';

<DropdownMenu
  button={{label: 'Assign reviewer'}}
  header={
    <TextInput
      label="Filter reviewers"
      isLabelHidden
      placeholder="Filter reviewers"
      value={query}
      onChange={setQuery}
    />
  }
  footer={
    <Button
      label="Create team"
      variant="secondary"
      icon={<Icon icon={PlusIcon} />}
      onClick={createTeam}
    />
  }
  items={reviewerActions}
/>;
```

### 在手机上钻入子菜单

![一个手机屏幕，Actions 菜单在对应按钮下打开。一根手指点按带有 chevron 箭头的 Move to 行，菜单的行就地替换为 Back to Actions 行，随后是 Backlog 和 Next release。点按 Back 会返回第一组行。](/blog/astryx-v0-7-0/mobile-submenu-drill-in@2x.webp)

_通过触摸打开时，子菜单会在当前行内钻入，并带有一个以返回菜单命名的 Back 行。使用鼠标时，它仍以浮出菜单的形式打开；可在 `DropdownMenuSubMenu` 上设置 `presentation` 强制使用任一模式。_

```tsx
<DropdownMenu button={{label: 'Actions'}}>
  <DropdownMenuItem label="Assign to me" onClick={assign} />
  <DropdownMenuItem label="Snooze" onClick={snooze} />
  <DropdownMenuSubMenu label="Move to">
    <DropdownMenuItem label="Backlog" onClick={moveToBacklog} />
    <DropdownMenuItem label="Next release" onClick={moveToNext} />
  </DropdownMenuSubMenu>
</DropdownMenu>
```

### 保持嵌套层级顺序

- **层级与对话框：** 对于 sheet 中的菜单、浮层和对话框，Escape 会先关闭最上层。嵌套层级会保持在其最近的对话框内。
- **Toast：** 它们会在打开的对话框之上保持可见且可点击。

### 为 BottomSheet 内容留出空间

![同一个手机上的底部 sheet，前后对比。之前，sheet 的文本和按钮紧贴面板边缘，并直接从抓取手柄下方开始，标题被手柄遮住。之后，同样的内容在四周都处于舒适的内边距中，标题在手柄下方可见，按钮也不再贴近底部边缘。](/blog/astryx-v0-7-0/theme-bottomsheet-padding.png)

_BottomSheet 现在默认添加舒适的内容内边距；`padding={0}` 可保留旧的贴边盒子。_

```diff
 <BottomSheet
   isOpen={isOpen}
   onOpenChange={setIsOpen}
   label="Filters"
+  padding={0}
 >
   <CustomEdgeToEdgeFilters />
 </BottomSheet>
```

## 移动端与触摸

手机上的正文文字为 16px，行支持滑动操作，并且可以选择日期和时间选择器。

### 通过滑动显示行操作

![一个手机列表，卡片中有三行清单项。一根手指将第一行向左拖动，两个操作面板从后面滑出：中性的 Archive 和红色的 Delete。点按 Archive 会移除该行，列表随即合拢。](/blog/astryx-v0-7-0/item-swipe-actions@2x.webp)

_横向拖动会显示触摸操作，同时不会对键盘和辅助技术用户隐藏这些操作。没有操作的行不会加载手势代码，首次加载可节省约 2.7 KB（gzip）。_

```tsx
<ListItem
  label={row.label}
  onClick={openRow}
  swipeActions={{
    trailing: [
      {
        label: 'Archive',
        onActivate: () => archive(row.id),
        variant: 'neutral',
        hasRemoval: true,
      },
      {
        label: 'Delete',
        onActivate: () => remove(row.id),
        variant: 'destructive',
        hasRemoval: true,
      },
    ],
  }}
/>
```

### 选择日期和时间选择器

日期和时间字段可以显式地在触摸设备上保留 Astryx 的选择器、使用浮层，或交给操作系统处理。

```tsx
<DateInput
  label="Release date"
  value={date}
  onChange={setDate}
  presentation="adaptive-bottom-sheet"
/>
<TimeInput
  label="Release time"
  value={time}
  onChange={setTime}
  presentation="adaptive-bottom-sheet"
/>
```

### 在手机上舒适阅读

![同一个手机屏幕的前后对比。之前，正文段落、辅助说明行、字段标签和按钮标签都很小，段落只占两行。之后，正文文字和标签更大，段落换行为三行；标题略微增大，输入框文字保持同样大小。](/blog/astryx-v0-7-0/theme-phone-type-scale.png)

_在宽度低于 `lg` 断点的触摸设备上，Neutral、Chocolate、Butter 和 Stone 会将字号基准下限设为 16px，并重新推导比例，使 Display 1 保持桌面端尺寸。桌面端尺寸不变。_

要保持 Neutral 之前 14px 的手机端比例，可为同一条件追加一条更晚的规则：

```tsx
import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

const appTheme = defineTheme({
  name: 'app',
  extends: neutralTheme,
  adaptations: {
    rules: [
      {
        when: {pointer: 'coarse', width: {below: 'lg'}},
        value: {typography: {scale: {base: 14, ratio: 1.2}}},
      },
    ],
  },
});
```

如果你的主题继承上述某个主题并设置了自己的字号比例，手机端规则会在触摸屏上替换它；请为同一条件追加一条你自己的规则，填入你想要的数值。对于 Butter 和 Stone，请使用 `ratio: 1.25`，并在规则的 `value` 中同时恢复 `tokens: {'--text-supporting-size': '12px'}`。

## 数据展示

表格会让展开的行保持对齐，并让列宽调整更容易被发现。

### 展开行而不打乱表格

![一个带条纹行的订单表格。指针点击一个客户名称，该行展开：其订单项出现在一个从 Customer 列下方开始的面板中，chevron 图标转向，下方各行的条纹仍像之前一样交替。指针接着点击另一行上的 Refund 按钮，该行的展开状态不受影响；点击该行文本则可以展开。](/blog/astryx-v0-7-0/table-row-expansion.webp)

_展开的详情与第一个数据列对齐，chevron 在其列中保持居中，行条纹保持稳定，行内的按钮或链接绝不会触发展开。_

```tsx
const expansion = useTableRowExpansion<Order>({
  expandedKeys,
  onToggle: key => setExpandedKeys(previous => toggle(previous, key)),
  getRowKey: order => order.id,
  renderExpanded: order => <OrderItems order={order} />,
  hasRowClickExpansion: true,
});

<Table
  data={orders}
  columns={columns}
  idKey="id"
  isStriped
  hasHover
  plugins={{expansion}}
/>;
```

### 调整列宽而不会丢失上下文

![一个宽大的订单表格。当指针向上移入表头行时，每个列边界都会出现一条细线。指针将 Status 后的边界向右拖动，列随之变宽；释放后新宽度保持不变。](/blog/astryx-v0-7-0/table-column-resize.webp)

_列边界在表头悬停时显现，调整后的宽度在拖动结束后保持不变。_

```tsx
const columnResize = useTableColumnResize<Order>({
  columnWidths,
  columns,
  onColumnResizeEnd: updates =>
    setColumnWidths(previous => ({...previous, ...updates})),
});

<Table data={orders} columns={columns} idKey="id" plugins={{columnResize}} />;
```

## Markdown 与内容

Markdown 现在可以将你自己的语法转换为真正的组件，而不只停留在格式化文本。下面的示例在前后使用相同的源内容，因此每项功能的效果都能单独看出来。

### 保留作者书写的换行

![同一个四行 Markdown 清单渲染两次。启用插件前，各行连成一个段落。启用插件后，每行各自另起一行。](/blog/astryx-v0-7-0/markdown-soft-breaks.png)

_单个换行会变为换行符；代码块和行内代码保持不变。_

```tsx
import {Markdown} from '@astryxdesign/core/Markdown';
import {markdownSoftBreaksPlugin} from '@astryxdesign/core/Markdown/plugins';

<Markdown plugins={[markdownSoftBreaksPlugin]}>{source}</Markdown>;
```

### 将 frontmatter 作为数据读取

![一个以 YAML frontmatter 块开头的文档，渲染两次。启用插件前，frontmatter 显示为一条水平线、一行原始的 key: value 文本，以及标题上方的另一条水平线。启用插件后，frontmatter 从文档中消失，你的应用将其解析后的值显示为草稿徽章和标题，位于同一标题上方。](/blog/astryx-v0-7-0/markdown-frontmatter.png)

_你的应用会以带类型的数据形式获得 frontmatter，而它不会出现在渲染后的文档中。_

```tsx
import {Markdown} from '@astryxdesign/core/Markdown';
import {createMarkdownFrontmatter} from '@astryxdesign/core/Markdown/plugins';

const frontmatter = createMarkdownFrontmatter({
  name: 'release-notes',
  parse: fields => ({
    title: typeof fields.title === 'string' ? fields.title : 'Untitled',
    status: typeof fields.status === 'string' ? fields.status : 'draft',
  }),
});

const result = frontmatter.parse(source);
<Markdown plugins={[frontmatter.plugin]}>{source}</Markdown>;
```

### 将产品语法转换为链接

![一句话中命名了两个 spec ID，渲染两次。启用插件前，AST-064 和 AST-069 是纯文本。启用插件后，两者都成为带下划线的链接，而行内代码中的相同 ID 仍保持原样。](/blog/astryx-v0-7-0/markdown-text-transform.png)

_文本转换可以在正文中为产品标识符添加链接，而不会触及代码段、现有链接、图片或数学公式。_

```tsx
import {Markdown} from '@astryxdesign/core/Markdown';
import {
  createMarkdownPlugin,
  createMarkdownTextTransform,
} from '@astryxdesign/core/Markdown/plugins';

const specLinks = createMarkdownPlugin({
  name: 'spec-links',
  apiVersion: 1,
  transform: createMarkdownTextTransform({
    pattern: /\bAST-(\d{3})\b/g,
    requiredSubstrings: ['AST-'],
    replace: match => ({
      type: 'link',
      url: `/specs/${match[0]}`,
      children: [{type: 'text', value: match[0]}],
    }),
  }),
});

<Markdown plugins={[specLinks]}>{source}</Markdown>;
```

### 将自定义围栏转换为组件

![一个段落后面跟着一个标记为 callout 的围栏代码块，渲染两次。启用插件前，该围栏显示为带 callout 标签的代码块，包含两行文本。启用插件后，同一个围栏渲染为警告横幅，第一行作为标题，第二行作为描述。](/blog/astryx-v0-7-0/markdown-fence.png)

_声明过的围栏语言可以渲染为产品组件，而其他所有围栏仍保持正常的代码处理方式。_

```tsx
import {Markdown} from '@astryxdesign/core/Markdown';
import {Banner} from '@astryxdesign/core/Banner';
import {
  createMarkdownFenceTransform,
  createMarkdownPlugin,
  type MarkdownExtensionNode,
} from '@astryxdesign/core/Markdown/plugins';

type CalloutNode = MarkdownExtensionNode<
  'callouts',
  'callout',
  {readonly title: string; readonly body: string},
  'block'
>;

const callouts = createMarkdownPlugin<'callouts', CalloutNode>({
  name: 'callouts',
  apiVersion: 1,
  transform: createMarkdownFenceTransform({
    languages: ['callout'],
    createNode: ({code}) => {
      const [title, ...body] = code.split('\n');
      return {
        type: 'extension',
        plugin: 'callouts',
        name: 'callout',
        display: 'block',
        data: {title, body: body.join(' ')},
      };
    },
  }),
  renderers: {
    callout: {
      render: ({node}) => (
        <Banner
          status="warning"
          title={node.data.title}
          description={node.data.body}
        />
      ),
      toText: node => `${node.data.title}\n${node.data.body}`,
    },
  },
});

<Markdown plugins={[callouts]}>{source}</Markdown>;
```

### 复制指向标题的链接

![两个标题渲染两次。启用插件前，标题是纯文本。启用插件后，当指针移到第一个标题上时，旁边会出现一个小型 hash 按钮；点击它会将 hash 短暂替换为对勾，指针离开后按钮再次淡出。](/blog/astryx-v0-7-0/markdown-heading-links.webp)

_标题链接会在悬停或键盘聚焦时显示，复制时不会跳转，并会短暂确认成功。_

```tsx
import {Markdown} from '@astryxdesign/core/Markdown';
import {createMarkdownHeadingLinks} from '@astryxdesign/core/Markdown/plugins';

const headingLinks = createMarkdownHeadingLinks({
  permalinkBaseUrl: 'https://astryx.atmeta.com/blog/astryx-v0-7-0',
});

<Markdown plugins={[headingLinks]}>{source}</Markdown>;
```

### 将渲染块关联到源行

![一个段落、一个两项列表和一个引用，渲染两次。启用插件前，这些块没有注释。启用插件后，每个块旁的小边栏会标出其源行：段落为 L1，列表项为 L3 和 L4，引用为 L6。](/blog/astryx-v0-7-0/markdown-source-lines.png)

_示意性边栏：页面读取每个块的 `data-source-line` 和 `data-source-line-end` 属性，以附加评论、选区与搜索结果。_

```tsx
import {Markdown} from '@astryxdesign/core/Markdown';
import {markdownSourceLinesPlugin} from '@astryxdesign/core/Markdown/plugins';

<Markdown plugins={[markdownSourceLinesPlugin]}>{source}</Markdown>;
```

### 使用你的产品渲染器渲染数学公式

![一句包含行内分数和独立公式的话，渲染两次。之前，美元符号分隔的数学内容显示为字面文本。之后，行内分数按排版嵌入句子中，公式在单独一行居中排版。](/blog/astryx-v0-7-0/markdown-math.png)

_提供数学渲染器会开启美元符号分隔的解析；图中排版为示例渲染器，你的应用负责最终的无障碍输出。_

```tsx
import {Markdown} from '@astryxdesign/core/Markdown';

function MathExpression({
  value,
  display,
}: {
  value: string;
  display: 'inline' | 'block';
}) {
  return <ProductMath source={value} display={display} />;
}

<Markdown components={{math: MathExpression}}>{source}</Markdown>;
```

## 主题与视觉基础

组件在每个稳定主题中都更加清晰易读，数据颜色也有了单一的 StyleX 来源。

### 从单一 StyleX 来源使用数据颜色

_应用可以读取与 Astryx 图表和主题相同的数据颜色值。_

```tsx
import * as stylex from '@stylexjs/stylex';
import {dataVars} from '@astryxdesign/core/theme/dataTokens.stylex';

const styles = stylex.create({
  series: {
    backgroundColor: dataVars['--color-data-categorical-blue'],
  },
});
```

下面的三组对比在 v0.6.0 和当前版本中使用同一场景。

### 键盘快捷键更清晰易读

![三个键盘快捷键及其对应操作，前后对比。之前，键帽字母是浅灰键帽上的中灰色，Escape 键显示为大写 ESC。之后，同样的键帽使用主文本色，该键显示为 Esc。](/blog/astryx-v0-7-0/theme-kbd-contrast.png)

_键帽文字现在在所有稳定主题中都满足 WCAG AA，常见按键别名也能一致地渲染。_

```tsx
<Kbd keys="mod+k" />
<Kbd keys="mod+shift+s" />
<Kbd keys="esc" />
```

### 让 Slider 刻度跟随填充

![两个带刻度线的 Slider，一个是 65 的单值，一个是 20 到 70 的范围，前后对比。之前，每个刻度线都是同样的浅灰色，包括轨道填充部分内的刻度。之后，填充区域内的刻度使用填充色，区域外的刻度保持轨道色。](/blog/astryx-v0-7-0/theme-slider-marks.png)

_位于滑块手柄处或其后的刻度使用填充色，而未填充的刻度在所有主题中都使用轨道色。_

```tsx
<Slider
  label="Quality"
  value={quality}
  onChange={setQuality}
  min={0}
  max={100}
  step={5}
  marks={[
    {value: 0, label: '0'},
    {value: 25},
    {value: 50, label: '50'},
    {value: 75},
    {value: 100, label: '100'},
  ]}
/>
```

### 让图标随 Button 调整大小

![四个带前置图标的按钮，分别为 small、medium 和 large 尺寸，前后对比。之前，所有按钮上的图标都是同样的大尺寸，挤占了 small 按钮。之后，每个图标与其按钮匹配：sm 和 md 按钮上为 small，lg 按钮上为 medium。](/blog/astryx-v0-7-0/theme-button-icon-size.png)

_未指定尺寸的 Icon 现在会跟随其 Button，因此小按钮不再显得拥挤。_

```tsx
<Button
  label="Upload"
  variant="primary"
  icon={<Icon icon={ArrowUpTrayIcon} />}
/>
<Button label="Upload" size="lg" icon={<Icon icon={ArrowUpTrayIcon} />} />
```

## 无障碍与本地化

布局会随读者的文字大小而扩展，焦点环会跟随人们实际使用的输入方式，横幅则会播报异步结果，而不是根据颜色猜测。

### 让布局跟随读者的文字大小

提高浏览器字体大小的读者，现在会得到随文字一起增长的内边距和间隙，而不是把更大的文字塞进同样的固定间距中。

![同一个小组件表单卡片，在 24px 浏览器字体大小下前后对比，下方还有默认 16px 的一行。之前，在 24px 下文字很大，但卡片的内边距以及字段与按钮之间的间隙仍和 16px 时一样紧。之后，内边距和间隙随文字增长。在 16px 下两个版本看起来完全相同。](/blog/astryx-v0-7-0/theme-rem-spacing.png)

_间距 token 使用 rem（`--spacing-N` = N × 0.25rem），包括 Matcha 和 Y2K 自己的档位；在默认 16px 根字号下，渲染出的像素尺寸不变。_

### 让焦点提示与最后一次输入方式匹配

![一个 Edit profile 按钮通过鼠标点击打开对话框；没有任何焦点环显示。按 Tab 后，Close 按钮上出现焦点环，再次按下焦点环移动到 Display name 字段。Escape 关闭对话框，Edit profile 按钮显示焦点环。再次用鼠标打开并点击 Cancel 关闭后，按钮上没有焦点环。](/blog/astryx-v0-7-0/dialog-focus-indicator.webp)

_指针图标是为了展示鼠标输入而添加的。Dialog 的初始焦点及其关闭时返回的焦点都会跟随最后一次输入方式：键盘使用后显示指示器，鼠标点击或触摸后保持隐藏。_

### 播报异步结果

以前，Banner 的视觉 `status` 会自动选择 live region 角色，因此决定屏幕阅读器何时听到播报的是横幅的外观，而不是异步操作。现在 Banner 默认保持安静；请从已完成的动作中播报一次，或者在 Banner 本身就是持久消息时设置 role。

```tsx
import {Banner} from '@astryxdesign/core/Banner';
import {useAnnounce} from '@astryxdesign/core/hooks';

const announce = useAnnounce();

async function saveSettings() {
  await save();
  announce('Settings saved');
}

<Banner status="success" title="Settings saved" />;
```

## CLI 与集成

其他库现在可以通过应用已经在用的同一个 Astryx CLI 贡献组件、文档、模板、升级脚本、编码指南和源主题。CLI 可以添加并验证这些组件。

### 添加并验证集成组件

![一个终端。输入并运行 npx @astryxdesign/cli integration add component AcmeChart 命令，输出报告 component contribution added、[ok] AcmeChart 以及创建的四个文件。然后运行 npx @astryxdesign/cli integration verify，输出报告 Integration package ready、[ok] @acme/charts@1.2.0，以及 5 packed files with 3 of 3 required files present。](/blog/astryx-v0-7-0/cli-integration.webp)

_这是已发布 CLI 在一个 `package.json` 中已声明 `exports` 映射的包中的真实输出；终端边框是用 Astryx token 设计的示意图。_

```bash
npx @astryxdesign/cli integration add component AcmeChart
npx @astryxdesign/cli integration verify
```

## 升级到 0.7.0

从这里开始：

1. **将 Core 和 CLI 固定到 0.7.0**，以及项目使用的其他所有稳定 Astryx 包。

   ```bash
   OLD_VERSION=0.6.8 # replace with the Core version your project uses today
   npm i @astryxdesign/core@0.7.0 @astryxdesign/cli@0.7.0 @astryxdesign/build@0.7.0 @astryxdesign/theme-neutral@0.7.0
   ```

   示例包含 Neutral；请在同一次安装中更新项目中其他所有稳定 Astryx 主题。

2. **运行 0.7.0 升级。** 它会重写受支持的调用点、验证数据颜色的归属，并在无法安全选择的地方留下 TODO。

   ```bash
   npx @astryxdesign/cli upgrade --from "$OLD_VERSION" --apply --path .
   ```

3. **检查下面的项目。** 四项需要手动修改代码，十项影响 CLI 命令或脚本，四项是需要在应用中检查的视觉或 token 变更，八项由升级处理或检查。

> **最大风险：以前被忽略的 props 现在会到达 DOM。** Layout、MetadataList、NavHeadingMenuItem 和 TopNavMegaMenuItem 已经接受 BaseProps，因此不会出现类型错误或 codemod。只有当调用点依赖这些 props 不产生任何效果时，才需要审计传入 ID、ARIA 或 data 属性、事件处理器或样式 props 的调用点。

### 手动修改代码——无 codemod（4）

- **Banner 播报不再从 status 推断** → 在异步 transition 中调用 `useAnnounce()`，或添加显式的持久 role。
- **以前被忽略的 BaseProps 现在会生效** → 仅当传入的 prop 本应保持无效时，才审计风险提示中的这四个组件。
- **完整的图标注册表需要 `upload`** → 为每个自定义的完整 `IconRegistry` 添加一个 `upload` 条目和图形。
- **独立的空操作符过滤器不再在打开时保存** → 当打开就应提交过滤器时，在调用点保存，或跳过打开。

### CLI 命令与脚本——无 codemod（10）

- **`theme add` 现在导入构建好的主题** → 将复制源码的脚本改为 `theme eject`；现有的 `theme add --import` 调用无需更改。

  ```diff
  - npx @astryxdesign/cli theme add neutral ./src/theme --overwrite
  + npx @astryxdesign/cli theme eject neutral ./src/theme --overwrite
  ```

- **`init --remove-agents` 会报告 `removed: false`** → 将 `data.removed` 视为布尔值，而不是字面量 `true`。
- **冲突的 CLI 选项会被拒绝** → 从受影响命令对中移除以前被忽略的选项。
- **无效的 CLI 输入现在会失败** → 传入有效的类型、包、限制和参数，并处理 `ERR_AMBIGUOUS_COMPONENT`。
- **空的位置参数会被拒绝** → 当预期操作是列出条目时，省略 `""`。
- **集成验证需要包** → 在存在 `package.json` 的地方运行它，或处理退出码 1。
- **Astryx 前缀的 agent 变量被移除** → 使用 `AGENT` 和 `AGENT_SESSION_ID`；agent 元数据没有替代项。
- **`layout` 命令组被移除** → 使用 `astryx build`、`astryx template` 或 `astryx docs layout`。
- **私有主题变量会导致构建失败** → 修复每个报告的私有 `--_*` 输入，而不是依赖退出码 0。
- **Doctor 在无法加载的已配置项目上失败** → 安装或修复所命名的集成、从配置中移除它，或修复报告的字段。

### 视觉与 token 变更——检查你的应用；通常无需改代码（4）

- **`reset.css` 现在会作用于伪元素和搜索字段** → 除非你需要旧的浏览器结果，否则无需操作；如有需要，添加一条更晚层的覆盖。
- **四个主题的手机排版从 16px 开始** → 采用新的 Neutral、Chocolate、Butter 和 Stone 比例，或添加触摸且窄屏的覆盖以保留 14px。
- **Core 间距使用 rem** → CSS 变量用户无需操作；解析 px 的代码必须按根字号转换，或读取计算后的长度。
- **Matcha 和 Y2K 间距使用 rem** → 在 16px 根字号下采用像素相等的默认值，或以 px 覆盖间距 token 以实现固定尺寸。

### 由 `astryx upgrade` 处理或检查（8）

- **数据颜色默认值迁移到 StyleX** → 修复 `validate-data-token-ownership` 报告的任何问题，然后重新构建已提交的主题 CSS。
- **日期和时间输入样式作用于控件** → 检查 `migrate-field-input-styling` 的重写或 TODO。
- **Typeahead、Tokenizer、CheckboxList、RadioList 和 Slider 的样式作用于字段** → 检查生成的 `container*` 或 `control*` prop。
- **Selector 样式作用于控件** → 检查重写后的控件样式和转发的 trigger props。
- **文本输入样式作用于控件** → 检查重写后的控件样式和原生输入 ID。
- **主题样式使用当前名称和 data 属性** → 检查重写后的键与选择器，尤其是自定义 CSS 的任何 TODO。
- **BottomSheet 添加默认内容内边距** → 检查生成的 `padding={0}` 或 TODO；当你的主题已经提供内边距时，移除该 prop。
- **`emptySearchResultsText` 被移除** → 检查重命名为 `emptySearchText` 的情况，以及 spread 或 trigger 对象上的任何 TODO。

### 全部 26 项破坏性迁移

1. **`theme add` 现在导入构建好的主题**（[#7138](https://github.com/meta/astryx/pull/7138)）——复制脚本从 `theme add <slug> <path>` 改为 `theme eject <slug> <path>`；无 codemod。
2. **Banner 播报改为显式**（[#6630](https://github.com/meta/astryx/pull/6630)）——从依赖 status 的 live region 改为在异步操作中使用 `useAnnounce()` 或显式的持久 role；无 codemod。
3. **以前被忽略的 DOM props 现在生效**（[#7331](https://github.com/meta/astryx/pull/7331)）——仅当你的代码依赖 Layout、MetadataList、NavHeadingMenuItem 或 TopNavMegaMenuItem 上的 props 不产生效果时，才移除它们；无 codemod。
4. **完整的图标注册表包含 Upload**（[#7329](https://github.com/meta/astryx/pull/7329)）——为每个自定义 `IconRegistry` 添加 `upload` 条目；定制图形没有 codemod。
5. **`init --remove-agents` 报告 `removed: false`**（[#6623](https://github.com/meta/astryx/pull/6623)）——将 `data.removed` 作为布尔值读取，而不是收窄为字面量 `true`；无 codemod。
6. **冲突的 CLI 选项会被拒绝**（[#7132](https://github.com/meta/astryx/pull/7132)）——从 `gap-report --list-categories`、`init --remove-agents`、`upgrade --list` 以及 `template --cdn`、`--list` 或 `--skeleton` 中移除被忽略的输入；无 codemod。
7. **无效的 CLI 输入不再静默成功**（[#7149](https://github.com/meta/astryx/pull/7149)）——传入有效的类型、包、限制和参数，并处理 `ERR_AMBIGUOUS_COMPONENT`；无 codemod。
8. **空的位置参数会被拒绝**（[#6620](https://github.com/meta/astryx/pull/6620)）——当预期操作是列出条目时，省略 `""`；无 codemod。
9. **集成验证需要包**（[#7150](https://github.com/meta/astryx/pull/7150)）——在存在 `package.json` 的地方运行 `doctor integration validate`，或处理退出码 1；无 codemod。
10. **数据颜色默认值迁移到 StyleX**（[#6834](https://github.com/meta/astryx/pull/6834)）——为 CSS 导入 `dataVars` 并重新构建已提交的主题 CSS；`validate-data-token-ownership` 会报告不安全的变量和过期输出，但不会重写它们。
11. **日期和时间输入样式作用于控件**（[#7337](https://github.com/meta/astryx/pull/7337)）——根样式变为 `controlXstyle`/`controlClassName`/`controlStyle`；`migrate-field-input-styling` 会重写直接的 Astryx JSX。
12. **Typeahead、Tokenizer、CheckboxList、RadioList 和 Slider 的样式作用于字段**（[#7339](https://github.com/meta/astryx/pull/7339)）——根样式变为 `container*`，但 InputGroup 内的 Typeahead 使用 `control*`；`migrate-field-input-styling` 处理直接 JSX。
13. **Selector 样式作用于控件**（[#7341](https://github.com/meta/astryx/pull/7341)）——根样式变为 `control*`，而 DOM props 和 refs 会到达 trigger；`migrate-field-input-styling` 处理直接 JSX。
14. **文本输入样式作用于控件**（[#7336](https://github.com/meta/astryx/pull/7336)）——根样式变为 `control*`，你传入的 ID 会到达原生 input；`migrate-field-input-styling` 处理直接 JSX。
15. **独立过滤器编辑器在打开时不保存**（[#7347](https://github.com/meta/astryx/pull/7347)）——在打开已经完整的空操作符过滤器的调用点保存，或跳过打开；无 codemod。
16. **Astryx 前缀的 agent 变量被移除**（[#7127](https://github.com/meta/astryx/pull/7127)）——将 `ASTRYX_AGENT_ID` 和 `ASTRYX_AGENT_SESSION_ID` 替换为 `AGENT` 和 `AGENT_SESSION_ID`；元数据没有替代项，也没有 codemod。
17. **主题样式使用当前名称和 data 属性**（[#7302](https://github.com/meta/astryx/pull/7302)）——替换 21 个旧样式名称和裸状态类；`migrate-deprecated-theme-surface` 会重写已知的键和选择器，并标记有歧义的情况。
18. **`layout` 命令组被移除**（[#7137](https://github.com/meta/astryx/pull/7137)）——使用 `astryx build`、`astryx template` 和 `astryx docs layout`；无 codemod。
19. **`reset.css` 作用于伪元素和搜索字段**（[#7355](https://github.com/meta/astryx/pull/7355)）——仅当你需要旧的浏览器结果时，添加你自己的更晚层 `box-sizing`、边框、占位符颜色或搜索外观；无 codemod。
20. **私有主题变量会导致构建失败**（[#6872](https://github.com/meta/astryx/pull/6872)）——修复每个报告的私有 `--_*` 输入，而不是依赖退出码 0；无 codemod。
21. **BottomSheet 添加默认内容内边距**（[#6884](https://github.com/meta/astryx/pull/6884)）——移除重复的调用方内边距，或传入 `padding={0}` 以保留旧盒子；`preserve-bottom-sheet-content-padding` 会跳过唯一的 Section 或 Layout，对嵌套 Layout 标记 TODO，否则添加 `padding={0}`。当你的主题已经设置 BottomSheet 内边距时，移除添加的该 prop，以保留主题的内边距。
22. **手机排版从 16px 开始**（[#6699](https://github.com/meta/astryx/pull/6699)）——直接采用新的 Neutral、Chocolate、Butter 和 Stone 比例，或添加一条更晚的触摸且窄屏规则以保留 14px 或你自己的比例；无 codemod。
23. **`emptySearchResultsText` 被移除**（[#7289](https://github.com/meta/astryx/pull/7289)）——将其重命名为 `emptySearchText`；`rename-empty-search-results-text` 处理受支持的组件，并用 TODO 标记有歧义的 spread 或 trigger 对象。
24. **Core 间距跟随根字号**（[#7359](https://github.com/meta/astryx/pull/7359)）——CSS 变量用户无需更改；解析 px 的代码按根字号转换 rem，或读取计算后的长度；无 codemod。
25. **Matcha 和 Y2K 间距跟随根字号**（[#7374](https://github.com/meta/astryx/pull/7374)）——采用新的默认值（在 16px 根字号下像素相等），或以 px 覆盖间距 token 以保持固定尺寸；无 codemod。
26. **Doctor 在无法加载的已配置项目上失败**（[#7130](https://github.com/meta/astryx/pull/7130)）——安装或修复所命名的集成、从配置中移除它，或修复错误中的配置字段；无 codemod。

## 致谢

感谢 v0.6.1 到 v0.7.0 背后的贡献者：[@AKnassa](https://github.com/AKnassa)、[@aldentan](https://github.com/aldentan)、[@andrskr](https://github.com/andrskr)、[@athz](https://github.com/athz)、[@bhamodi](https://github.com/bhamodi)、[@cixzhang](https://github.com/cixzhang)、[@Cypher-Aura-19](https://github.com/Cypher-Aura-19)、[@ejhammond](https://github.com/ejhammond)、[@ernestt](https://github.com/ernestt)、[@freddymeta](https://github.com/freddymeta)、[@fullstackhacker](https://github.com/fullstackhacker)、[@Geervan](https://github.com/Geervan)、[@Han5991](https://github.com/Han5991)、[@harjothkhara](https://github.com/harjothkhara)、[@HelloOjasMutreja](https://github.com/HelloOjasMutreja)、[@humbertovirtudes](https://github.com/humbertovirtudes)、[@imdreamrunner](https://github.com/imdreamrunner)、[@jiunshinn](https://github.com/jiunshinn)、[@josephfarina](https://github.com/josephfarina)、[@kentonquatman](https://github.com/kentonquatman)、[@korkt-kim](https://github.com/korkt-kim)、[@ksying](https://github.com/ksying)、[@kyu-rong](https://github.com/kyu-rong)、[@Kyujenius](https://github.com/Kyujenius)、[@Lee-Dongwook](https://github.com/Lee-Dongwook)、[@light-merlin-dark](https://github.com/light-merlin-dark)、[@ManoharPaturi](https://github.com/ManoharPaturi)、[@markselby9](https://github.com/markselby9)、[@nynexman4464](https://github.com/nynexman4464)、[@oliprovscode](https://github.com/oliprovscode)、[@rubyycheung](https://github.com/rubyycheung)、[@rupesh-kumar-sah](https://github.com/rupesh-kumar-sah)、[@thedjpetersen](https://github.com/thedjpetersen) 和 [@vjeux](https://github.com/vjeux)。

在各包的完整发布说明中了解详情：[Astryx v0.7.0 发布页面](https://github.com/meta/astryx/releases/tag/v0.7.0)。
