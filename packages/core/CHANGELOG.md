# @xds/core

# 0.7.16

#### 实验性 API

- 添加 Lab 媒体播放器（`@astryx.mediaPlayer.*`）的英文字符串：控件名称、朗读时间、章节和标记上下文，以及上一首和下一首曲目。它们是随 Core 语言文件一起发布的 Lab 字符串，就像 Lab ListInput 的字符串一样；它们不会为 `@astryxdesign/core` 增加任何公共 API。([#11438](https://github.com/meta/astryx/pull/11438))

#### 新功能

- NumberInput 接受 `entryErrorBehavior`，因此表单可以给它的所有日期、时间和数字字段传递同一个值。键入的数字只有在按 Enter 或失焦时才视为完整，因此两个值都保持 NumberInput 当前的时间点：它的拒绝、`aria-invalid`、播报和 `onEntryErrorChange` 报告都在 Enter 或失焦时出现，绝不会在用户输入过程中出现。设置该 prop 或 FormLayout 的 `defaultEntryErrorBehavior` 不会改变用户在 NumberInput 中看到的任何东西。Pagination 的页码框传入 `'complete'`，因此围绕它的 FormLayout 永远不会改变它。([#11492](https://github.com/meta/astryx/pull/11492))
- DateInput、DateTimeInput 和 TimeInput 接受 `entryErrorBehavior`，FormLayout 接受 `defaultEntryErrorBehavior`。该 prop 设置字段何时显示自己的条目错误，例如日历中不存在的日期或超出 `min` 和 `max` 的时间。它不设置验证何时运行，也不是 React Aria 的 `validationBehavior`。默认值 `'complete'` 保持每个字段当前的时间点。`'blur-or-enter'` 会保留消息、`aria-invalid`、无效样式、播报和 `onEntryErrorChange` 报告，直到用户按下 Enter 或离开该字段；使条目有效或为空的编辑仍会立即清除错误。字段自己的 prop 优先于表单默认值，嵌套的 FormLayout 会替换它，从该表单打开的 Dialog 启动时不带该设置。PowerSearch 值编辑器和 Table 过滤器编辑器保持 `'complete'`。新的 `EntryErrorBehavior` 类型命名这两个值。([#11485](https://github.com/meta/astryx/pull/11485))
- Lightbox 画廊的说明文字位于每张照片下方两行高的条带中，因此每张照片在项目之间保持相同的大小和位置。没有说明文字的照片保留条带空间但不显示其背景。较长的说明文字显示两行，第二行以行内的“more”链接结尾，点击后会在照片上方显示完整说明。完整说明始终是查看器的无障碍描述。([#9810](https://github.com/meta/astryx/pull/9810))
  查看器是一个媒体表面：其控件、说明文字和计数器通过 `MediaTheme` 使用主题的深色表面 token。说明文字是正文 `Text`，其各行从同一侧开始，“more”和“less”是 `Link` 的按钮形式，使用说明文字自身的字体，条带避开屏幕底边及其安全区域。画廊的说明文字位于背板上，使其在任何照片上都保持 4.5:1。打开查看器的点按不会在其第一个控件上绘制焦点环，从获得焦点的“more”或“less”翻页时，焦点保持在查看器内。

- NumberInput：`onEntryErrorChange` 报告字段拒绝键入文本的原因，因此应用可以自行组织消息。它接收一个 `NumberInputEntryError`，其中 `kind` 不依赖区域设置（`unreadable`；当 `isIntegerOnly` 时为分数则 `fractional`；当 `min` 高于 `max` 时为任何数字则 `outOfRange`）、键入的 `text`，对于 `fractional` 和 `outOfRange`，还有作为 `value` 的数字。它在每次拒绝状态变化时运行：在 Enter 或失焦时，当编辑使文本有效或为空时，当新的 `value`、`min`、`max` 或 `isIntegerOnly` 改变或结束它时，以及禁用字段丢弃文本时。当拒绝结束时，或字段在拒绝存在期间卸载时，它报告 `null`，并且同一拒绝绝不会报告两次。传入带消息的 `error` `status` 来组织拒绝消息；该消息就是被播报的那条。([#11415](https://github.com/meta/astryx/pull/11415))
- 新消息 `@astryx.richTextEditor.link.urlPlaceholder`（“example.com”），即 RichText 工具栏链接字段的占位符。其他 `@astryx.richTextEditor.link.*` 消息以及 `@astryx.richTextEditor.toolbar.link` 的描述现在描述取代链接对话框的链接弹出层；它们的消息内容不变。([#8717](https://github.com/meta/astryx/pull/8717))
- 列窗口化保持焦点和位置：使用 `useTableColumnsVirtualization` 时，如果获得焦点的单元格所在列滚出窗口，该单元格会以原元素保持挂载，直到焦点离开表格、移到另一个单元格或该列被移除——此时焦点返回到 Table 的滚动区域。单元格打开的菜单中的焦点也会保持该单元格的列。更改列顺序、宽度、可见性或固定状态会保留第一个可见列及其滚动距离。未选择启用的表格保持不变。([#11018](https://github.com/meta/astryx/pull/11018))
- 表格可以对列进行窗口化：将 `useTableColumnsVirtualization({initialViewportWidth})` 传给 `Table.virtualization`。Table 保留每个列定义和宽度，只挂载内联视口附近未固定的列，每侧外加两个 overscan 列，保持固定列挂载，并为挂载的单元格提供全表格的 `aria-colindex` 值，并在表格上提供 `aria-colcount`。当滚动区域至少与表格最小宽度一样宽时，所有列都会挂载。`Table.virtualization` 也接受一个列表，其中最多包含一个 rows 和一个 columns 能力。不支持的内容或结构会渲染所有列并给出开发警告。添加或移除 columns 能力会重新挂载表格。未选择启用的表格照旧渲染；它们的 Table 导入包含约 0.5 KB gzip 的列窗口化接线，列规划器仅在加载该 hook 时加载。([#11014](https://github.com/meta/astryx/pull/11014))
- 使用 `useTableInfiniteScroll({hasMore, isLoading, onLoadMore})` 为 Table 添加无限加载。一个 Promise 请求锁存器协调自动和手动加载，失败会暂停自动重试，常驻的忙碌 Button 负责进度播报和焦点连续性。([#10570](https://github.com/meta/astryx/pull/10570))
- 表格可以同时对行和列进行窗口化：将 `useTableRowsVirtualization` 和 `useTableColumnsVirtualization` 作为列表一起传给 `Table.virtualization`。Table 只挂载两个轴上视口附近的单元格，保留全表格的 `aria-rowindex` 和 `aria-colindex` 值，并在获得焦点的单元格的行或列滚出时保持两者挂载。未选择启用的表格保持不变。([#11019](https://github.com/meta/astryx/pull/11019))
- TextArea 的 `htmlMaxLength` 设置原生 `maxlength` 属性，因此表单可以按 UTF-16 代码单元限制键入，包括在 hydration 之前的 SSR 表单。它与 `maxLength` 无关——软计数器仍按用户感知字符计数，且从不阻止键入。TextArea 自身不添加截断或验证，当未设置 `htmlMaxLength` 时不渲染原生 `maxlength`。([#11295](https://github.com/meta/astryx/pull/11295))
- TimeInput：`onEntryErrorChange` 报告字段拒绝键入文本的原因，因此应用可以自行组织消息。它接收一个 `TimeInputEntryError`，其中 `kind` 不依赖区域设置（`unreadable`，或时间早于 `min` 或晚于 `max` 时为 `outOfRange`）、键入的 `text`，对于 `outOfRange`，还有 ISO 时间 `value`。它在每次显示的拒绝状态变化时运行，包括当新的 `min`、`max` 或 `value` 或禁用字段改变它时，同一拒绝绝不会报告两次，并在拒绝结束或字段在拒绝存在期间卸载时报告 `null`。原生界面和底部工作表界面不接受键入文本，因此它们从不报告。([#11413](https://github.com/meta/astryx/pull/11413))
- `useTruncation` 接受 `isExpanded`：在文本完整显示时传入 true；当文本被截断时，该 hook 仍会持续报告它是否被截断。Lightbox 说明文字使用它，因此当说明文字展开时“less”会保留。([#9810](https://github.com/meta/astryx/pull/9810))

#### 问题修复

- 当屏幕窄于服务器假设的宽度时，AppShell 现在会保留服务器渲染的内容。在手机上，外壳在 hydration 后立即通过紧急更新得知其移动布局。当外壳内的内容尚未 hydration（因为其代码是流式传入或稍后加载）时，React 会重新渲染该内容以取代其服务器 HTML：访问者失去滚动位置和焦点，其中的图像加载两次。外壳现在在 transition 中获取客户端的断点答案，该 transition 会等待该内容 hydration。客户端渲染的应用和正确的 `mobileNav.defaultIsMobile` 提示行为与之前相同。无 API 变更。([#11441](https://github.com/meta/astryx/pull/11441))
- BottomSheet 在 commit 时同步其焦点返回目标，并且不再在渲染期间复制其堆栈视图。在 React 丢弃的渲染（例如挂起的 transition）之后被移除的 sheet，会将焦点返回到其已提交的 `finalFocusRef`。([#10918](https://github.com/meta/astryx/pull/10918))
- BottomSheet：当触摸轻扫关闭 sheet 时，其后面的暗色遮罩现在会与 sheet 同步清除。此前，sheet 在大约十分之一秒内消失，而暗色遮罩仍基本存在，并继续淡出超过半秒。现在淡出遵循关闭弹簧自身的进度。减少动态效果和所有其他关闭方式不变。([#11400](https://github.com/meta/astryx/pull/11400))
- BottomSheet 将其吸附点和重新激活的入场效果保存在 state 中，并在 commit 时同步其拖拽的停止解析器。React 丢弃的、更改了 `snapPoints` 的渲染（例如挂起的 transition）不再改变释放后的拖拽停靠的停止点。([#10873](https://github.com/meta/astryx/pull/10873))
- ChatComposerInput：空输入框在页面重新设置样式后（例如打开一个包含 SegmentedControl 的 Dialog 卸载后）保持其单行高度并能接受键入。此前，其可编辑区域可能塌缩为 0px，因此点击落在旁边，键入无效，直到重新加载。([#11428](https://github.com/meta/astryx/pull/11428))
- useContainerReveal 仅在主指针为粗略指针（手机或平板）时保持已显示内容始终可见。使用鼠标或触控板的触屏笔记本电脑现在像其他鼠标设备一样在悬停和键盘焦点时显示内容。此前任何触屏设备都会在静止时保持内容可见，导致 Thumbnail 的悬停删除按钮、Markdown 标题链接以及每个应用的悬停显示行操作从不隐藏。([#11218](https://github.com/meta/astryx/pull/11218))
- 主题中以 `clamp()`、`calc()`、`min()`、`max()` 或带 fallback 的 `var()` 写成的 padding 现在会按写法构建。主题编译器只按值之间的空格拆分 `padding`、`paddingBlock` 和 `paddingInline`，绝不在括号或引号内的空格处拆分，因此 `padding: clamp(8px, 2vw, 16px)` 会保持为一个值，而不会变成损坏的 CSS。无 API 变更。([#11347](https://github.com/meta/astryx/pull/11347))
- DateInput、DateTimeInput：应用在按下 Enter 或失焦（该操作保留了被拒绝的日期）时传入的 `value` 不再将其擦除，因此该条目符合 WCAG 2.2 3.3.1（错误识别）。此前，当应用在与保留不可读、不完整、不存在或超出范围的日期文本的 Enter 或失焦相同的更新中设置 `value`（例如应用恢复编辑前的日期时），字段会丢弃文本、其消息和 `aria-invalid`，并通过 `onEntryErrorChange` 报告 `null`；原生日期控件也以同样方式丢失其拒绝消息。现在，在每次这样的 Enter 或失焦（包括 Enter 之后的失焦）时，文本、其拒绝和消息都会保留，使人们可以更正条目，并且不报告任何内容。后续的新 `value` 会像以前一样替换文本。无需应用代码更改。([#11470](https://github.com/meta/astryx/pull/11470))
- DateInput、DateTimeInput：在独立字段中，被拒绝的日期现在符合 WCAG 2.2 1.4.1（颜色的使用）和 3.3.1（错误识别）；在 InputGroup 内，它们设置 `aria-invalid` 并被播报。此前，不是日期的文本会被标记为无效，并在每次击键时播报，且没有可见消息，按 Enter 或失焦会将其还原。原生日期控件在键入年份时会对每个部分年份进行标记，不显示消息，并在失焦恢复已提交日期时丢弃拒绝。现在，不是日期的文本在你键入时不显示任何内容；按 Enter 或失焦会将其保留在字段中，并显示“Invalid date”作为字段的错误状态，同时设置 `aria-invalid` 并进行一次播报。其消息会替换调用者的 `status`，正如字段的其他拒绝已做的那样；使用 `onEntryErrorChange` 时，带有消息的调用者 `error` status 仍然优先。原生日期控件的拒绝会等待 Enter 或失焦，显示键入日期时显示的超出范围消息，遵循相同的 `status` 规则，并在控件于失焦时恢复已提交日期后仍保持显示。已显示的拒绝会在使日期仍然错误或未完成的编辑过程中保持，并在日期有效或为空后清除。表单提交的内容不变：当保留的文本不是日期时，一个隐藏输入会以字段的 `name` 提交已提交日期，而下一次 Enter 会提交表单。([#11407](https://github.com/meta/astryx/pull/11407))
- SideNav、TopNav、Breadcrumbs：在移动导航抽屉中的链接上按 Ctrl、Cmd、Shift 或 Alt 点击会按浏览器决定的方式打开它（例如新建标签页），并保持抽屉打开。普通点击仍会关闭它，而该行自身 `onClick` 取消的修饰键点击也会关闭它，因为别处没有打开任何内容。(#8979) ([#9390](https://github.com/meta/astryx/pull/9390))
- DropdownMenu 在 commit 时同步其 show 和 hide 调用所用的 ref。在 React 丢弃的渲染（例如挂起的 transition）之后，手指下的入场效果会按照已提交菜单的指示保持输入。([#10905](https://github.com/meta/astryx/pull/10905))
- 在强制颜色模式（Windows 对比度主题）下，`primary` 和 `secondary` Button 获得 `ButtonText` 边框，`destructive` 保留其 `CanvasText` 边框；在连接的 `ButtonGroup` 中，实心按钮保留组的间隔线并封闭组的外边缘，不会出现双重接缝。仅靠盒阴影与页面分离的浮动表面获得 `CanvasText` 边框：`Popover` 和 `usePopover` 绘制的每个表面（包括 `DropdownMenu`）、`DropdownMenuSubMenu` 飞出层、`ContextMenu`，以及 `isInline` 的 `Dialog`。强制颜色会移除填充和盒阴影，这使这些控件和表面没有边缘。这些边框仅存在于强制颜色模式中，因此其他情况下不会有任何变化。设置实心变体自身边框宽度的主题会保留它，因此 Gothic 的 `secondary` Button 保持无边框。([#7677](https://github.com/meta/astryx/pull/7677))
- 带有多个触发器的层现在可以在鼠标或手指按下某个触发器且该按下正是关闭它的操作时，从另一个触发器打开。按下已打开的触发器仍会关闭它。([#11337](https://github.com/meta/astryx/pull/11337))
- 紧贴触发器或越过其边缘的锚定层不再滑过触发器：其入场效果会原地缩放，就像层位于触发器中心上方时一样。位于指针处的菜单仍从它所落的一侧滑入。([#11417](https://github.com/meta/astryx/pull/11417))
- 与触发器之间有空间的锚定层不再从触发器上方开始其入场效果：它朝触发器方向的第一步会停在那个空间处。因此，位于触发器旁 4px 的高工具提示在 Safari 中第一帧不再遮住它。([#11396](https://github.com/meta/astryx/pull/11396))
- 层运行时在 commit 时而不是渲染期间同步其 close-start 和重放的 show ref，其保持打开按压读取已提交的打开状态或已显示的层。React 丢弃的渲染不再将其值留给后续回调。([#10912](https://github.com/meta/astryx/pull/10912))
- 在按压释放期间打开的轻触关闭层不再在释放时关闭。使用鼠标选择 DropdownMenu 或 ContextMenu 中打开 Popover 的行时，现在会像用手指一样让它保持打开；下一次外部按压或 Escape 会像以前一样关闭它。([#11258](https://github.com/meta/astryx/pull/11258))
- 在 Lightbox 照片旁深色区域进行的鼠标点击现在会关闭查看器。此前，在照片自然宽度内或较宽说明文字宽度内点击该区域后，查看器会保持打开。([#11354](https://github.com/meta/astryx/pull/11354))
- `Lightbox` 中单张照片的说明文字现在像画廊中一样显示。它位于查看器底部的条带中，在说明文字的背板上，使其在任何背后页面上都保持 4.5:1。照片在其上方居中。超过两行的说明文字以“more”结尾，点击会在照片上方完整打开。没有说明文字的单张照片不显示条带。([#10284](https://github.com/meta/astryx/pull/10284))
- 当可重新排序的 `List` 行不再重新渲染时，其手柄的名称仍会跟随它。以位置命名的柄（“Reorder item N”）会在其上方行被删除或行重新排序时跟随该位置。获得或失去文本的标签会重命名该手柄。([#10815](https://github.com/meta/astryx/pull/10815))
- DropdownMenu、ContextMenu、Selector、TabList、TopNav、SideNav、Breadcrumbs：当手指选择菜单行时，点击防护会在菜单命名该触摸后仅取消该手指的 `touchend`，因此另一根手指的 `touchend` 会通过。菜单从跟随其 `pointerdown` 的 `touchstart` 命名该触摸。没有 `changedTouches` 的 `touchend`，或菜单无法命名的触摸抬起，保持旧规则：取消下一个 `touchend`。([#11164](https://github.com/meta/astryx/pull/11164))
- MoreMenu、InfoTip、PowerSearch（及其 PowerSearchToken 和 PowerSearchFilterEditor 默认值）、Toast 和 InputClearButton 现在像其他组件一样将宿主 `data-*` 属性传递到它们自己的元素：MoreMenu 和 InfoTip 的触发按钮，PowerSearch 的主控件，PowerSearch 默认值的 token 和编辑器根，Toast 的 toast 元素，以及 InputClearButton 的按钮。组件拥有的属性仍留在组件上。一个新的测试会渲染每个导出的、渲染自身元素的组件，并带有 `data-*` 属性，当属性未到达 DOM 时失败。([#11406](https://github.com/meta/astryx/pull/11406))
- NumberInput：被拒绝的条目现在会显示消息并保留在字段中，因此该字段符合 WCAG 2.2 1.4.1（颜色的使用）和 3.3.1（错误识别）。此前，每个不是被接受数字的草稿（包括 `-` 等未完成的草稿）都会设置 `aria-invalid` 并在每次击键时被播报，而文本只会变为次级色；失焦后，无法解析的草稿会被还原且没有消息。现在，用户键入时不会标记或播报任何内容，因为键入的数字只有在 Enter 或失焦时才完整。在 Enter 或失焦时，不是数字的文本、`isIntegerOnly` 时的分数，或 `min` 高于 `max` 时的任何数字都会保留在字段中：字段显示“Invalid number”作为其错误状态，通过 `aria-describedby` 与输入关联，设置 `aria-invalid`，并播报一次。在 InputGroup 内，拒绝会设置 `aria-invalid` 并被播报。使草稿有效或为空的编辑会立即清除它。超出普通范围的数字仍会通过 `onChange` 钳制并提交。带有消息的调用者 `error` status 仍会显示以取代字段消息；`warning` 或 `success` status 不再隐藏拒绝。表单提交的内容不变：当失焦保留被拒绝的草稿时，隐藏输入会按字段之前显示的那样提交已提交数字。Pagination 的 `input` 变体在页码框的状态图标上显示消息，并在被拒绝的条目保留期间加宽键入文本旁的框，因此栏保持其高度。无需应用代码更改。([#11415](https://github.com/meta/astryx/pull/11415))
- 在手指下，与触发器重叠的 Popover 现在从它与触发器相接的地方生长，就像指针入场一样。位于触发器侧边几像素处的 popover 从该侧生长，而不是从下方生长。位于触发器中心上方的 popover 仅通过缩放从该中心生长。其他所有落点照旧生长。([#10949](https://github.com/meta/astryx/pull/10949))
- 当正文文本仅来自组件和自定义布局时，Toast 会播报渲染后的消息 (#7853) ([#11175](https://github.com/meta/astryx/pull/11175))
- SegmentedControl：在控件没有布局的地方（例如单元测试的 DOM 中），点击较后的分段会保持该分段被选中，而不是片刻后切换到第一个分段。浏览器不受影响。([#11487](https://github.com/meta/astryx/pull/11487))
- Selector 的展示层在 commit 时同步其 show、hide 和 popover-content ref。在 React 丢弃的渲染（例如挂起的 transition）之后，打开 popover 会运行已提交的 show。([#10917](https://github.com/meta/astryx/pull/10917))
- Slider 在 commit 时同步其值、change-end 回调和触摸更新 ref。在 React 丢弃的渲染（例如挂起的 transition）之后，按下轨道会向已提交的 `onChangeEnd` 报告已提交的值，手指拖动滑块会向已提交的 `onChange` 报告。([#10913](https://github.com/meta/astryx/pull/10913))
- Table：`useTableSortableState` 调用最后一次已提交渲染的 `onSortChange`。此前，在尚未提交的 transition 期间点击排序会调用该待定渲染中的回调。([#11433](https://github.com/meta/astryx/pull/11433))
- TimeInput、DateTimeInput：被拒绝的键入时间现在符合 WCAG 2.2 1.4.1（颜色的使用）和 3.3.1（错误识别）。此前，每个不是被接受时间的草稿（包括 `1` 等未完成的草稿）都会被标记为无效并在每次击键时播报，仅以次级色文本显示，失焦会将其还原且没有消息；`min` 或 `max` 之外的原生时间编辑不显示消息，其拒绝在失焦时清除。现在，未完成的时间绝不会被标记：`min` 或 `max` 之外的时间在完整时显示（其小时、两位分钟数字、字段显示秒时的两位秒数字，以及在 12 小时制文本中，小时读作 0 或 13–23 之外的日时段），不是时间的文本在 Enter 或失焦时显示。被拒绝的文本保留在字段中，独立字段显示“Invalid time”消息作为其错误状态，并设置 `aria-invalid` 并进行一次播报；在 InputGroup 内，拒绝会设置 `aria-invalid` 并被播报。在 TimeInput 和 DateTimeInput 的时间字段中按 Enter 会提交键入的时间，并且仍会提交周围表单；在 DateTimeInput 打开的预设时间列表中，按 Enter 仍像以前一样选择时间。原生时间控件在失焦时恢复已提交时间，并保持其拒绝显示。带有消息的调用者 `error` status 仍会显示在字段消息之上，并且拒绝会播报一次；`warning` 或 `success` status 不再隐藏拒绝。在 DateTimeInput 中，日期拒绝的消息在前，其下方的时间拒绝会被播报。表单提交的内容不变：当失焦保留被拒绝的 TimeInput 草稿时，隐藏输入会携带字段的 `name` 及已提交时间。([#11413](https://github.com/meta/astryx/pull/11413))
- `TimeInput` 和 `DateTimeInput`：范围内没有整分钟的边界会保留自己的秒数，因此钳制结果仍在该范围内。此前，`clampTime('12:00','23:59:30')` 返回 `23:59`——低于调用者设置的最小值。在 `TimeInput` 工作表中，滚轮到这样的边界之外不会提交任何内容；在 `DateTimeInput` 工作表中，将日期更改到这样的边界上会提交超出范围的 `23:59`。(#10159) ([#10159](https://github.com/meta/astryx/pull/10159))
- Tooltip 和 HoverCard 的触摸触发器，以及 Tooltip 的处理器及其携带的受控和启用标志，在 commit 时同步。在 React 丢弃的渲染（例如挂起的 transition）之后，点击会使用已提交的 props 响应，外部按压仍会关闭已显示的工具提示。([#10892](https://github.com/meta/astryx/pull/10892))

#### 性能

- 声明 `requiredSubstrings` 的 Markdown 文本转换会在一趟源文本扫描中查找这些子字符串。此前，每个段落都会再次搜索文档的其余部分，因此长 Markdown（例如长的流式聊天答案）会随着每个段落而变慢。输出不变。([#11403](https://github.com/meta/astryx/pull/11403))

#### 文档

- TextInput、TextArea、NumberInput、CheckboxInput、Switch、ProgressBar 和 StatusDot 的文档演练场现在以真实值打开，而不是以 prop 名占位符打开；Heading 演练场以一级标题打开，而不是继承 Text 的 `type: 'body'` 示例；ButtonGroup、TabList、SegmentedControl 和 TopNav 演练场以命名的示例项打开，而不是编号项。([#11351](https://github.com/meta/astryx/pull/11351))
- `useOutlineFromDOM` 的 Hook 文档，因此 `astryx hook useOutlineFromDOM` 和 `astryx search` 会返回它，以及一个 `useOutlineFromDOM — Article` 示例块：一篇文章和一个通过该 hook 由其标题构建的 Outline，并带有一个添加 section 及其关联条目的按钮。([#11234](https://github.com/meta/astryx/pull/11234))
- ListItem 的 `startContent` 和 `endContent` 文档现在说明该内容位于行内，在标签之前或标签和描述之后，而不是在项目之前或之后。([#11336](https://github.com/meta/astryx/pull/11336))
- MetadataList 的指南现在说明辅助技术会在读取每个标签时连同其值一起读取，并且标题不会命名该列表或添加标题。其 prop 文档现在列出 `className` 和 `style`，`label` 的文档说明 `position: 'start'` 会将标签放在其值的内联起始处，而不是左侧。([#11391](https://github.com/meta/astryx/pull/11391))

#### 贡献者

感谢为本版本做出贡献的所有人：

- @aashish254
- @cixzhang
- @ejc3
- @emilyhorsman
- @ernestt
- @HelloOjasMutreja
- @humbertovirtudes
- @josephfarina
- @kentonquatman
- @LekhNayak
- @lzcmian
- @nynexman4464
- @popsiclelmlm
- @shashank03-dev
- @vjeux

---

# 0.7.15

#### 新功能

- DateInput、DateTimeInput：`onEntryErrorChange` 报告字段拒绝键入文本的原因，因此应用可以自行组织消息。它接收一个 `DateInputEntryError`（从两个组件导出），其中 `kind` 不依赖区域设置（`unreadable`、`incomplete`、`nonexistent`、日期早于 `min` 或晚于 `max` 时为 `outOfRange`，或 `dateConstraints` 排除的日期为 `unavailable`）、键入的 `text`，对于 `outOfRange` 和 `unavailable`，还有公历 ISO `date`。它在每次拒绝变化时运行，包括当新的 `min`、`max`、`dateConstraints` 或 `value`、日历选择、禁用字段或 Enter 或失焦改变它时，并在拒绝结束或键入字段在拒绝存在期间离开（例如呈现方式或指针变化显示原生或触摸选择器）时返回 `null`。使用该回调时，带有消息的 `error` `status` 是字段显示和播报的消息，字段自己的消息仅在没有该消息时适用；`warning` 或 `success` status 绝不替换拒绝。当拒绝开始而该错误消息保持不变时，字段会为此再次播报该消息。不使用该回调时，其他一切不变。对于每个 DateTimeInput，当原生日期控件替换键入日期字段时，保留的键入文本及其拒绝会等待该键入字段，因此字段在此期间显示调用者的 `status`。原生和触摸选择器不接受键入文本，因此回调绝不会报告那里的拒绝。修复 #10366。(#11311)
- SegmentedControl：在手指下，按下已选分段会像 UIKit 那样抬起其表面，手指松开时回落。触控设备上的笔也会以同样方式抬起。桌面上的鼠标或“减少动态效果”下，不会抬起。(#9724)
- 在主指针为精细指针的地方，鼠标按下 CheckboxInput 或 RadioList 选项会在 `pointerdown` 时立即绘制，并在释放时淡出，就像手指按压一样，而不是使用浏览器的 `:active`。右键点击，或按下 RadioList 选项内的链接或按钮，不会绘制该选项。其他控件对鼠标保留 `:active`。(#8696)

#### 问题修复

- Calendar、DateRangeInput：一个两个月的日历，如果其 `max` 落在它将要打开的月份内，现在会将该月份显示在第二个窗格中。此前，当 `max` 设为今天，或选中的值从 `max` 所在月份开始时，它会从该月和下一月打开，下一月的每一天都被禁用，而上一个月保持隐藏。第一个窗格仍绝不会早于 `min` 所在月份，显式的 `focusDate` 按给定显示，单月日历不变。(#11202)
- Calendar：使用 `hasWeekNumbers` 时，每一行显示其星期四的 ISO 8601 周数，即包含其大部分日期的 ISO 周。此前，大多数从星期日或星期六开始的行会显示前一个 ISO 周，因此一个月的头两行可能显示相同的数字。从星期一开始的行不变。(#11271)
- DateInput、DateTimeInput：日历中不存在的键入日期（例如 2 月 30 日）会显示“Enter a real date”。仅当字段的日历与 `InternationalizationProvider` 日历不同时，消息才会命名日历，例如“Enter a real date (Persian Calendar)”。`dateConstraints` 排除的日期显示“Enter an available date”。(#11309)
- DateInput 将其键入字段和原生字段的记录保存在 state 中。React 丢弃的渲染（例如挂起的 transition）不再丢弃键入文本、清除被拒绝的日期或重复报告同一日期。(#10877)
- DateTimeInput 将其原生选择器的最后值和提交纪元保存在 state 中。React 丢弃的渲染（例如挂起的 transition）不再丢弃在日期之前选择的时间、清除被拒绝的日期或时间，或让同一次原生编辑提交两次。(#10861)
- Drawer 将其退出的侧边保存在 state 中。React 丢弃的渲染（例如挂起的 transition）不再改变关闭的抽屉滑出到的边缘。(#10859)
- useLinkify 和 RichTextEditorAutoLinkPlugin：电子邮件检测现在采用线性时间。一个不包含电子邮件的长单词（例如粘贴的哈希或 base64 字符串）不再使页面冻结数秒。有效的电子邮件地址仍像以前一样链接，但有三个例外。在富文本编辑器中，紧跟句号后的地址不再链接，带引号的本地部分在下一个引号处结束。在 useLinkify 中，粘在较早地址末尾的片段不再自行链接。(#11306)
- Dialog、CommandPalette、BottomSheet、Lightbox、Drawer、MobileNav、Popover：在模态框的第一个或最后一个控件上按 Ctrl 或 Meta 的 Tab 不再将焦点移到另一端，模态框也不再取消该按压。自行处理 Ctrl+Tab 或 Meta+Tab 的页面或宿主应用（例如切换自己的标签页）现在会在每个控件上收到该按压，就像它在第一个和最后一个控件之间已经做的那样。Alt+Tab 仍会循环，因为 Safari 在 Option+Tab 时会将焦点移到每个项目。(#11247)
- 同源 iframe 或画中画窗口中的手势现在使用该窗口自己的时钟来计算触摸时间。此前，那里的一次短按可能会开始长按，因为页面的时钟比窗口的时钟快。(#11155)
- `Item` 的滑动操作：在 `reveal` 下，轻扫会在其操作处打开行；在任一模式下，轻扫绝不会触发条目。在一侧有两个或更多条目时，只有从已打开行开始的拖拽才会触发最外侧的条目。面板不会在另一个条目后面显示某个条目的颜色。条目填满面板，触发后该条目会覆盖面板，直到行恢复或保持打开。无 API 变更。(#11054)
- 保持禁用的 Item 操作可聚焦 (#11169)
- 当窗口在手指按压期间失去焦点后，抬起该手指不再对任何菜单生效（DropdownMenu、MoreMenu、ContextMenu、Selector 以及基于公共 `useMenuPress` 构建的菜单），点击菜单的触发器仍会打开它。在手指下，因按压被取消（滚动、第二根手指、窗口失去焦点）而点亮的行现在会清除，就像在 iOS 上一样。它在 DropdownMenu 及其任意 `presentation` 下的子菜单、MoreMenu、ContextMenu、Selector 的列表和底部工作表的操作列表中都会清除，也会在基于公共 `useMenuPress` 构建且其根可以获取焦点的菜单中清除。鼠标保持其高亮。(#8508)
- DropdownMenu、ContextMenu 及其子菜单背后的菜单按压模型在 commit 时同步其选项、步骤和触发器上下文 ref。在 React 丢弃的渲染（例如挂起的 transition）之后进行的按压现在使用已提交的选项。(#10901)
- 移动键盘 hook 在 commit 时同步其 enabled、expanded 和 open 标志。在 React 丢弃的渲染（例如挂起的 transition）之后，关闭操作和键盘的监听器遵循已提交的选项。(#10914)
- Outline 的滚动监听将条目性、其 `onActiveIdChange` 和活动条目读取为已提交状态。React 丢弃的渲染（例如挂起的 transition）不再改变滚动标记的条目或落定的导航调用的回调。(#10802)
- Carousel 分页：在稳定过程中调整大小的行不再立即停止或跑回较早的页面。稳定过程以其速度继续播放，如果它正朝最后一页前进，则到最后一页，否则到离它原目标最近的页面。当它返回到原生滚动时，会在该页结束，没有步骤。调整大小使行超出其新的最后一页，或给行首次宽度时，仍会立即将其落在目标页面上。(#10592)
- ResizeHandle 将其区域、方向和禁用状态读取为已提交状态。React 丢弃的渲染（例如挂起的 transition）不再使按键调整另一个区域的大小或拒绝已启用的手柄。(#10803)
- 在 swizzled AppShell 中，第一个 Tab 进入主区域时现在会停在区域上，与包中的 AppShell 一样——当其第一个链接或按钮位于不会溢出的包滚动区域（ScrollableArea、Table、CodeBlock、Tokenizer、BottomSheet）内时，反之亦然。方向键和 Page 键不变。无 API 变更。(#11225)
- 禁用的 `Step` 现在会在 `step-indicator` 主题目标上反映 `disabled`，与 `step-label` 并列，因此主题可以重新设置禁用步骤指示器的样式。在带有轨道指示器的紧凑水平 `Stepper` 中，禁用步骤的标签不显示，指示器是主题唯一可以触及的目标。`step` 和 `step-description` 目标不会获得该选择器。(#8997) (#9192)
- `useStreamingText` 将其显示重新开始的位置保存在 state 中。React 丢弃的渲染（例如挂起的 transition）不再从头重新开始流式显示或跳到末尾。(#10862)
- Table 为每个列列表和每个插件列表保留一个数组，并按身份比较。React 丢弃的渲染（例如挂起的 transition）不再能替换表格最后显示的数组。下一次已提交渲染会重用该数组，因此当列和插件与已提交的匹配时，行会跳过渲染。当基础插件以相同插件的新数组传入时，`useBaseTablePlugins` 也会保留其数组。具有自身渲染时缓存的列插件（例如树插件）仍会重新渲染每一行。(#10940)
- `useTableSortableState` 仅在其数据、排序或区域设置变化时排序。它此前会在其拥有者的每次渲染时重新排序每一行。(#10942)
- 使用 `useTableSortableState` 的 Table 排序会调用最新的 `onSortChange`。此前，排序表头保留上次排序变化时的处理器，因此当父级传入新的处理器而没有排序变化时，会调用其旧处理器，而该处理器看到的是过时的 state。(#11349)
- Text 和 Heading：在 Android 上，第一次点击截断文本内的按钮或链接会像在 iOS 上一样打开截断工具提示。该点击会先使元素获得焦点，而该焦点占用了点击；现在只有键盘焦点才算数。Tooltip：点击工具提示触发器内的文本字段会使该字段获得焦点，不再打开或关闭工具提示。这包括截断文本内的文本字段。(#11213)
- Timestamp 悬停卡片的复制按钮现在会在剪贴板写入失败时显示，就像 CodeBlock 的复制按钮一样：图标变为叉号 1.5 秒，按钮会被命名、显示工具提示并播报“Failed to copy value to clipboard.”。以前它什么也不做。映射 `timestamp-copy` 槽位的主题在失败期间保持其静止字形（`copied` 为 false）。错误本身不显示。(#10434)
- ToastViewport 在 commit 时同步其已提交列表。React 丢弃的渲染（例如挂起的 transition）显示的 toast 在重复项替换它且同一处理器随后将其关闭时不会报告 `onHide`。(#10902)
- Tokenizer 的工作表在 state 中为其搜索和打开操作编号。React 丢弃的渲染（例如挂起的 transition）不再使重新打开播报从未运行过的搜索。(#10886)
- 在触摸屏（平板，或手机上的 `presentation="popover"`）上的 Tokenizer 内联字段中，用手指移除 token 不再弹出触摸键盘。点击 token 自己的删除按钮（Token 的 ×）以前会在点击内部将焦点移到字段的输入框，这会使 iOS 和 Android 显示键盘；当输入框在点击前未获得焦点（键盘已收起）时，焦点现在保持在原处，除非被点击的 × 或其 token 中的另一个控件持有焦点，此时焦点像以前一样移到输入框。键入时进行的点击、笔的点击、鼠标点击、删除按钮上的按键，以及自定义 `renderToken` 绘制的删除控件，仍会将焦点放入输入框。渲染 Token 的 PowerSearch 过滤器 token 也获得同样的修复。(#8160)

#### 文档

- `useThemeName` 的 Hook 文档，因此 `astryx hook useThemeName` 和 `astryx search` 会返回它，以及一个 `useThemeName — Active theme` 示例块：包裹调用者的主题名称。(#11235)
- List 的剖析现在命名其可选页眉，并删除了 List 不渲染的描述部分。`ref` 文档现在说明 ref 会到达列表元素，无论是否有页眉。(#11277)
- `DefinedTheme.__componentIcons` 现在被记录为公共 API；其存在性和形状遵循兼容性政策。(#11192)

#### 其他变更

- 内部：Core 的内部触摸入口重新导出 UIKit 的计时表以及运动引擎的 AnimateOptions 和 MotionHandle 类型，供 Lab 的 SearchField 使用。应用不会导入任何新内容。(#10956)
- 内部：Lab 的 SearchField 的关闭按钮名称加入 Core 的消息目录。应用不会导入任何新内容。(#10956)
- 内部：Core 新增两个内部 hook，用于在事件和手势回调中将 ref 保持为最新的已提交 prop 或回调，并新增一个供 Lab 访问它们的内部入口。Outline 的滚动监听、ResizeHandle 和调整大小逻辑、菜单按压处理、移动键盘 hook 以及 ToastViewport 使用它们。应用不会导入任何新内容。(#11352)
- 内部：一个共享的上下文请求，来自长按、右键点击，或 Shift+F10 和上下文菜单键，报告是哪种输入发出的，每个手势一次。被按住手指的按住会输给另一个手势已对该手指提出的声明，而保持按压以进行按住重复的控件只拥有其按住，因此其右键点击和 Shift+F10 仍会到达该请求。被按住的笔自身的上下文菜单事件会像被按住的手指一样被拒绝。按住是 UIKit 的长按，并在开始时发出请求。不从包入口点导出。(#8670)
- 内部：Core 的内部层 hook 删除了一个没有组件读取的关闭检查字段。该层仍拒绝在关闭它的按压期间重新打开。应用看不到任何变化。(#11332)
- 内部：Markdown 将其流式淡入 ref 记录为运行时 ref 规则的例外，并附带测试锁定其无害的原因。(#10939)
- 内部：结束容器按压（针对嵌套控件上的按压）的规则以其涵盖的每种指针命名，其注释和记录说明了它的作用。任何组件的行为或 API 均无变化。(#11304)

#### 贡献者

感谢为本版本做出贡献的所有人：

- @aashish254
- @ChenyangLi4288
- @cixzhang
- @duytbp
- @Geervan
- @nynexman4464
- @popsiclelmlm
- @Varshavia
- @vjeux

---

# 0.7.14

#### 新功能

- ComplexSelector：`disabledMessage` 用于说明选择器为何被禁用。配合 `isDisabled` 使用时，悬停和键盘聚焦会通过工具提示显示原因，并通过 `aria-describedby` 描述触发器。被禁用的触发器仍保留其 Tab 停留点，指针、键盘和命令式句柄仍无法打开弹层。使用 `renderTrigger` 时，控件由调用方负责，`disabledMessage` 同样适用：工具提示和描述会落到该控件上。选择器禁用期间，请去掉控件自身的工具提示，例如 `tooltip={isDisabled ? undefined : 'Filter'}`，以免同时显示两个。另外，调用方自己的 `aria-disabled` 现在会传递到启用的内置触发器上。(#5984)
- 锚定层的入场动画现在从层最终落位的一侧滑入，并以该侧为缩放基准。此前，如果层因请求的一侧空间不足而翻转，入场仍从请求的那一侧滑向触发器。入场动画的缩放中心也改为层与触发器相接的位置，而不是层盒的中心。当 Selector 列表在所选项目上方打开时，以触发器中心为缩放基准，且不滑动。这适用于 Popover、DropdownMenu 及其子菜单、ContextMenu、Selector、ComplexSelector、Tooltip、HoverCard、Breadcrumbs 和 PowerSearch 菜单，以及任何使用共享入场效果的层。内置层没有保留旧入场效果的选项。公开的 `layerAnimations` 样式现在也会设置 `transform-origin`；调用方在后面列出的自己的 `transformOrigin` 仍然优先。(#10771)
- 未传入 `longPressDelayMs` 的 `useMenuPress` 现在在所有设备上都遵循 DropdownMenu 的手指规则：手指或笔按下时即打开菜单（在滚动视图内，需等待 150 ms 的内容触摸延迟过去），而打开菜单的那根手指只有移动 10 px 后才会选中一行。若要保留旧行为（按住 500 ms，抬起开启手指时选中），请传入 `longPressDelayMs: 500`。(#8078)
- 在所有设备上，用手指或笔操作时，锚定式 DropdownMenu 或 MoreMenu 的触发器现在一按下就打开菜单，而不是按住 500 ms 后才打开。在滚动视图内，只有在 150 ms 内容触摸延迟期间没有发生滚动时才会打开，因此从触发器上开始的滚动仍然可以滚动。若要保留旧行为（抬起时打开，以及按住 500 ms），请传入 `presentation="popover"`。以底部面板形式显示的菜单以及鼠标操作保持不变。(#8078)
- SegmentedControl：拖动时即使偏离控件，也会按水平位置继续选择，并钳制到两端的分段，抬起时提交该分段。鼠标或笔的拖动方式相同。按 Escape 或浏览器取消会收回按压，高亮立即恢复。(#10978)
- Tokenizer 现在是兼容 InputGroup 的控件 (#3520)。在 `InputGroup` 内，它使用 `InputGroupContext`，而不是渲染自己的 `Field`，因此由该组统一负责标签、描述和状态外观，不再出现重复标签或嵌套的字段包装器。typeahead 输入框的名称由组标签加上 Tokenizer 自身的标签组成（通过 `getInputARIA` 组合，因此 `aria-describedby` 会将组的描述/状态与输入框本地的禁用原因合并，而不是替换），并且该控件采用共享的 `groupStyles.inGroup` 边框/圆角处理，使其融入组的接缝。组还负责尺寸、禁用状态和校验：禁用组会禁用其 Tokenizer；组内的 Tokenizer 采用组的 `size`（显式传入更大的 `size` 不再能突破该行）；其本地 `description`/`status` 既不会被 `aria-describedby` 引用，也不会绘制在组状态旁边。由于组是固定高度的单行表面，组内的 Tokenizer 会将 token 保持在一条可横向滚动的行内，而不是换行溢出共享边框——可用 `maxEntries` 限制选择数量，或用 `tokenOverflowBehavior` 对其汇总。其末尾控件（清除按钮、`endContent` 和忙碌指示器）占据该行的末端：token 在它们旁边滚动，绝不会滚到它们下面。该行会隐藏原生滚动条，改为在隐藏 token 的那一侧边缘做渐隐效果；强制颜色模式下会恢复细原生滚动条。键盘用户可通过 token 的移除按钮（从输入框按 Shift+Tab）访问被隐藏的 token；被禁用的 Tokenizer 在溢出时，其行本身会成为 Tab 停留点，名称取自 Tokenizer 的标签，因此可用方向键滚动。(#4405)
- TimeInput、DateTimeInput：用手指操作时，底部面板的分钟滚轮会像 UIDatePicker 那样循环：超过 59 后回到 00，小时保持不变，与 iOS 一致。拖动、快滑、点按或方向键都会越过接缝。Home、End 以及点击某一分钟绝不会越过接缝。小时滚轮目前尚不循环。对辅助技术而言，每一分钟仍只列出一次。(#10953)

#### 问题修复

- 当页面同时将包内的 AppShell 和经 swizzle 的 AppShell 作为最外层壳挂载时，现在只有第一个保留固定的主区域 id；另一个会获得生成的 id，这与两个包内壳的情况一致。此前，每个副本各自维护一份占用列表，因此两个壳都使用 `astryx-app-shell-main`，导致页面出现重复 id。无 API 变更。(#11208)
- BottomSheet：手指在面板内容上的下拉只由面板的触摸监听器处理，并以整个拉动过程的速度释放。此前，内容的 pointer 处理器（用于鼠标或笔）会先开始同样的拖动并取得 pointer capture，而捕获变更会在下一次移动时取消该拖动。随后触摸监听器会再次开始拖动，或者在 Chromium 中，内容自身的平移可能在其下方启动。释放速度只计算拖动开始之后的移动，因此一次很快的轻扫如果页面只收到两三次移动，就会被判定为没有速度并弹回，而在抓取条上同样的轻扫却能关闭面板。现在在内容上的轻扫会像在抓取条上的轻扫一样关闭面板。这同样适用于 Tokenizer 和 PowerSearch 打开的面板。从内容上进行的鼠标或笔拉动也会以整个拉动过程的速度释放。释放阈值没有变化。(#11145)
- BottomSheet：触摸拖动过程中的一次移动不再导致面板内容重新计算样式。此前每次移动都会将遮罩的不透明度作为自定义属性写到对话框上，而该属性会继承进面板，因此浏览器在每次移动时都会重新计算面板内每个元素的样式：在有短列表的 Tall 面板中每次移动 51 个元素，在带三个筛选条件的 PowerSearch Filters 面板中为 84 个，内容越多则越多。现在面板会终止该继承，一次移动只会重新计算对话框、其背景、面板和边缘着色的样式。遮罩仍像以前一样跟随拖动。这适用于拥有该遮罩的面板：单个 BottomSheet，或堆叠中的第一个面板，例如 PowerSearch 的 Filters 面板和 Tokenizer 的面板。(#11154)
- BottomSheet：在 Safari 以及 iPhone 和 iPad 上的所有浏览器中，在面板内容上缓慢开始的轻扫现在会移动面板，因此缓慢下滑可以将其关闭。此前，在内容能够完整显示时，如果手指的第一次移动在任意方向上不超过 8 px，面板就会停止响应这次轻扫：它要么保持打开，要么移动几个像素后回弹。快速轻扫和在抓取条上的轻扫此前已正常工作，Chromium 浏览器不受影响。此修复适用于所触摸内容无可滚动区域的场景：内容可完整显示的面板，以及列表周围的固定页眉或页脚。这包括 PowerSearch 和 Tokenizer 的面板。在可滚动列表的顶部，如果手指先向上抖动不超过 5 px，下拉现在也会移动面板；向上移动 5 px 或更多仍会滚动列表。在所有浏览器中，面板现在会在第一次超过 8 px 的移动时一次性决定内容上的触摸归谁所有。在滚动边缘以垂直方向为主的下拉归面板处理。以水平方向为主的移动（例如沿一排 chip 的轻扫）在该次触摸的剩余过程中不再归面板处理。此前，在列表顶部，向下漂移超过 8 px 的横向轻扫，或起始时横向分量大于纵向的下拉，也会移动面板。(#11140)
- Button：被禁用或处于加载状态的 submit 或 reset Button（包括位于被禁用的 ButtonGroup 或 InputGroup 中的 Button），在服务器渲染的 HTML 中、页面尚未 hydrate 或 JavaScript 加载失败时被点击，不再提交或重置其表单。它在 hydrate 之前会渲染为普通按钮，之后恢复自身的 type，用户看到和听到的内容没有任何变化。(#11107)
- Carousel 的滚动按钮不再遮挡滚动区域的键盘焦点环。每个按钮现在紧贴焦点环内侧，而不是跨在轮播边缘上，因此当滚动区域获得焦点时，整个焦点环都保持可见 (#10722)。(#10726)
- 携带的动画仍在等待第一帧的临时副本，现在会与原始组件同步运行。在繁忙的页面上，SideNav 侧栏离场中的副本可能会比开关自身的副本晚一帧或更多才开始开关的按压淡出。(#10983)
- `CommandPalette`：当其 `searchSource` 在打开状态下发生变化时，刷新结果。(#9679)
- `createISOTimeString` 现在除非去除空白后的字符串是 H:M 或 H:M:S 且每个字段为一到两位数字（秒的小数部分仍会被接受并丢弃），否则返回 null；不再把 "2:30 PM" 读成 02:30（相差 12 小时），也不再把 "14:30abc" 读成 14:30 (#11023)
- FileInput 的拖放区默认将其状态消息显示在拖放区域下方，因此不再遮住拖放区域；显式传入 `statusVariant="attached"` 时仍按原样渲染。(#11195)
- 浏览器不当作滚动处理的页面平移，不再关闭已打开的 popover 或选择器列表，也不再点按手指下方的页面元素。(#11038)
- 经 swizzle 的覆盖层和包内组件现在共享同一组焦点区域和同一套移动端键盘模型：包内嵌套的焦点区域与副本不再同时响应同一个 Tab，包内字段与复制出的字段在键盘高度、其布局引导以及哪些元素随之移动上保持一致。无 API 变更。(#10831)
- 在手机上，按下静止状态的控件不再测量页面，因此从该处开始的滚动不需要等待。当页面滚动或父级动画移动控件（例如滑入的屏幕）时，命中区域不再进行测量。按下由父级移动的控件仍会测量页面。如果父级在最后一次测量之后才开始移动，则由浏览器自身的命中测试决定点按结果。无 API 变更。(#11083)
- Toolbar、TabList 和 SegmentedControl 在首次键盘聚焦时显示的方向键提示，现在会一直保留，直到按下方向键或 Escape，或者焦点移出该组（WCAG 2.2 SC 1.4.13 悬停或聚焦时显示的内容）。它过去会在 3 秒后消失，有时还没来得及阅读就消失了，而且 Escape 无法关闭它。现在 Escape 仅通过共享的层关闭栈关闭该提示，并保持焦点原位。`useKeyboardHint` 的 `dismissAfterMs` 不再默认为 3000；请保持不设置。(#10564)
- 关闭 Lightbox 会停止正在播放的视频。查看器会保持挂载，否则画面和声音会在点击关闭、按 Escape 或在外部点按之后继续播放。已经关闭的查看器也不会开始播放。再次打开时，如果设置了 `hasAutoPlay`，会播放当前视频。字幕中的视频保持停止状态。(#10692)
- 包内 List 中的经 swizzle 的 ListItem（或经 swizzle 的 List 中的包内 ListItem）现在会像包内行一样离场：它会保留屏幕上显示的内容（例如滑动产生的位移）用于退场。此前，List 和 ListItem 分别记录 List 报告的行以及离场行保留的呈现，导致该行的退场丢失这些呈现。无 API 变更。(#11214)
- 使仅带 onClick 的 TopNav 项目可键盘访问 (#9334)
  此前，仅带 onClick 的 TopNav 操作可能会被 Tab 跳过，或无法通过键盘激活。TopNavItem 现在提供按钮语义以及 Enter/Space 激活，同时保留其 anchor 的 ref/事件类型和自定义链接渲染。桌面端 TopNavMegaMenuItem 操作和抽屉中的 TopNavMenu 操作现在使用不会提交表单的原生按钮。

  这恢复了 WCAG 2.2 A 级标准 2.1.1 和 4.1.2 的键盘操作和操作语义。被禁用的 TopNavItem 操作仍可聚焦但无法激活；href 导航和现有的桌面菜单键盘模型保持不变。

- 使用包内 `createMarkdownFenceTransform` 创建的围栏插件现在能在经 swizzle 的 Markdown 中渲染其节点，反之亦然。此前，副本会以自己的键向转换器描述该插件，导致包内的围栏转换拒绝运行，围栏退化为普通代码块。无新增 props、导出或默认值。(#11167)
- 在从右到左的页面中，`InputGroupText` 中的纯文本、`Badge` 标签和 `Token` 标签保持其书写时的字符顺序。不含从右到左字母的文本，例如 URL scheme（`https://`）、域名后缀（`.com`）、计数（`+3`）、`C++`、句柄（`@alice`）或标签（`#design`），过去会显示为乱序（`//:https`、`com.`、`3+`）；现在会按从左到右布局。包含从右到左字母的文本会保持页面方向，并与其相邻内容隔离，因此 `iPhone جديد` 仍从右到左阅读。富文本（非字符串）标签或子元素会被隔离，但保持页面方向：请在自有内容中自行标记混合方向。不含从右到左字母的纯 `InputGroupText` 文本会置于内部 `span` 中。从左到右的页面保持不变。(#10114)
- 携带 Core 布局动效、spinner 转子或手势同步自身副本的经 swizzle 组件，现在会与包内实现共享：一个副本中的布局变化会与另一个副本的变化从同一帧开始，因此它们的滑动同时落位；两个副本的 spinner 会在同一批次中对齐时间线，因此一起挂载的环只产生一次样式重算，而不是每个副本一次；在一个副本中运行的手势同步也会接管另一个副本的手势回调。无 API 变更。(#11027)
- Popover：初始焦点在所有环境中都按文档顺序取第一个内容控件。只有在 `querySelectorAll` 不按文档顺序返回的环境中（例如 jsdom），聚焦的控件才会改变；浏览器仍像以前一样聚焦同一个控件。(#11177)
- 通过 `registerIcons()` 注册的图标现在能到达同一 React 上的经 swizzle 的 `Icon`、`CodeBlock`、`Table` 和 `Timestamp` 副本。按名称注册的主题现在由同一个 React 上加载的每个 Core bundle 共享。每个注册表在每个 React 上只有一份，因此页面上的第二个 React 绝不会渲染第一个 React 的元素。无 API 变更。(#11096)
- 经 swizzle 的 ResizeHandle 或 LayoutPanel 现在能找到它旁边的包内面板或手柄，反之亦然。当区域折叠时，面板内的焦点会移到手柄上，面板进入 inert 状态。此前，每个副本各自记录借出的面板和手柄，因此面板虽然会调整大小，但在折叠时焦点可能会掉到页面上。无 API 变更。(#11131)
- 包根入口和组件 barrel 不再携带 `'use client'`。在 React Server Component 中，`import {Card, Stack, Badge, Code} from '@astryxdesign/core'` 现在会在服务器上渲染那些无需客户端代码的组件，正如其各自模块的意图；需要客户端的组件仍保持为客户端引用。从包根入口导入的 Server Component 现在可用 Next.js webpack 构建。客户端代码的渲染与以前相同。无 API 变更。若要将这些组件本身作为 prop 传给 Client Component（例如在 `Markdown` 上使用 `components={{inlineCode: Code}}`），请从 `'use client'` 模块中传入。(#11106)
- 在 iOS Safari 中，在滚动边缘平移时，若在内容上的点按抖动不超过 5 px，则保留其点击。现在只有当手指沿轴移动 5 px 后，平移才会按住手指。在 Lab 中，iOS Safari 下，在推入的 NavigationStack 屏幕上，若点按朝返回滑动方向漂移不超过 5 px，则仍会执行；漂移 5 px 或更多则仍会失去点击。(#10829)
- 基于 useScrollableArea 构建的组件（例如 ScrollableArea 或 BottomSheet）在组件自身更新后，当焦点在恰好适配的视口的两个后代之间移动时，不再重新渲染。(#11135)
- Toast id 现在是跨越包内实现和经 swizzle 的 `useToast` 副本的单一序列。此前，每个副本都从 1 开始计数，因此来自经 swizzle 的 Toast 和包内 Toast 的 toast 可能在同一个队列中共享 id，关闭一个会移除另一个。无 API 变更。(#11092)
- 当文本大小、缩放或主题变化使每一行都高于 `rowHeight` 时，窗口化 Table 仍保持窗口化。它会按行测得的高度进行窗口化，而不是渲染每一行，并在开发环境中发出警告。高度不等的行仍会渲染每一行。(#11000)
- 在没有 `LayerProvider` 的情况下，来自经 swizzle 的 `useToast` 和包内的 toast 现在会显示在同一个回退堆栈中。此前，每个副本会挂载自己的回退容器，导致页面显示两个相互重叠的 toast 堆栈。无 API 变更。(#11161)
- Tokenizer：启用 `hasEntriesOnFocus` 时，从聚焦时显示的列表中选择一项会保持输入框聚焦且列表打开，并将下一项设为活动项，因此可以连续选择多项。当没有剩余选项、达到 `maxEntries`、在别处按下、按 Tab 离开或按 Escape 时，列表关闭。从键入的搜索结果中选择仍会关闭列表。(#11031)
- 当仍在运行的搜索或焦点引导稍后返回结果时，Typeahead 和 Tokenizer 会保持已关闭的菜单处于关闭状态。用 Escape、外部点击、Tab 或移开焦点关闭菜单时，还会清除忙碌指示器，并丢弃仍在等待 debounce 的搜索。同一文本的迟到结果会保留，并在下次打开菜单时显示，而无需重新搜索（如果该搜索仍在运行，重新打开会等待其结果）；对于人物此后已更改的文本，其结果会被丢弃。此前，迟到的结果会在菜单关闭后重新打开它。(#8778)

#### 文档

- AppShell 关于命名其导航地标的指南现在说明：向 TopNav 传入 `label`，向 SideNav 传入 `aria-label`。SideNav 没有 `label` prop；它有一个已翻译的默认名称，`aria-label` 可以为其重命名。(#11151)
- 为 `useTruncation` 添加 hook 文档和交互式表格单元格截断示例块，演示响应式字符串截断和无障碍工具提示。(#10555)
- InternationalizationProvider 按阅读顺序展示其示例：加载随包提供的 locale、为从右到左文本镜像布局（一个新的代码示例）、覆盖一个字符串，然后是日历示例。每个实时示例都以其代码示例命名，因此两个列表保持一致。(#11094)
- `LinkProvider` 文档说明了 `component` 接收的内容，包括路由组件读取的 `to` prop、链接自身的 `as` 或更近的 provider 会优先于它，以及被禁用的 Link 不会使用它。(#11065)

#### 其他变更

- 内部：Core 的内部手指滚动读取器接受一个命名文档的 ref，因此 Lab 的 ChatVirtualizer 在挂接到 `document.scrollingElement` 时可以监听页面自身的滚动。应用无需导入任何新内容。(#10883)
- 内部：MobileNav 会从其打开起保持对话框渲染，直到其延迟关闭经过层运行时的呈现保持（Layer/presentationHold.ts）执行完毕。无行为变化。(#8590)
- 内部：`useChatStreamScroll` 的页面滚动规则移到一个所有者模块：容器是否滚动页面、其可见区域从哪里开始，以及其滚动事件在哪里触发。该 hook 的行为与以前相同，未文档化的 `@astryxdesign/core/internal/page-scroller` 入口将同样的规则提供给 Lab 的 ChatVirtualizer。内部入口不属于公共 API 及其兼容性承诺。(#11160)
- 内部：Core 的重排控制器通过内部行读取器查找集合的行，以便后续变更可以重排普通元素。List 的行为与以前相同，应用无需导入任何新内容。(#11199)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @bstcoc
- @cixzhang
- @fullstackhacker
- @humbertovirtudes
- @hurrymaplelad
- @imdreamrunner
- @korkt-kim
- @nynexman4464
- @SebTardif
- @utkarshpatwa393-sys
- @vjeux
- @whispering3

---

# 0.7.13

#### 新功能

- Tokenizer 在其内联呈现中转发 BaseTypeahead 的 `menu` 和 `onOpenChange`，其句柄新增 `open()` 和 `close()`。如果某个 token 自身的按钮以 dialog 角色调用 `open()` 来打开菜单，则会打开对话框，Escape 会将焦点返回该 token：按压放在 token 控件上的焦点以及菜单的焦点返回都会留在那里，而不会移到输入框。面板呈现保留自己的面板。(#10624)
- Typeahead：当清除按钮显示时，在选中的 Token 上按 Backspace 或 Delete 会像清除按钮一样清除值：调用 `onChange(null)`，宣布已清除的值，并将焦点移到空输入框。没有 `hasClear` 时，这些键会像点击一样开始编辑。(#10847)

#### 问题修复

- 经 swizzle 的组件和包内组件现在通过同一对实时区域进行宣布：来自两者的消息会汇入同一帧，副本不再挂载第二对屏幕阅读器会重复朗读或跳过的区域。模态宣布路径也以同样方式共享。无 API 变更。(#10996)
- BottomSheet：在滚动边缘，手指在面板内容上的拉动会在拉动达到点按的抖动幅度（5 px）时立即取消内容的原生平移，早于面板自身在 8 px 时开始的拖动。在 iOS Safari 中，页面保留的第一个 `touchmove` 会将触摸提交给内容的滚动，因此缓慢开始的向下轻扫会在手指下方让内容橡皮筋回弹，而面板同时在旁边移动。抖动不超过 5 px 的点按会保留其点击，而向边缘抖动 5 至 8 px 的点按现在会失去点击。真正的滚动绝不会被取消。在水平行上以横向为主的轻扫在面板拖动开始之前不会被取消；超过 8 px 的第一次移动会像以前一样在任意方向启动拖动。(#10033)
- 携带层运行时自身副本的经 swizzle 覆盖层现在与包内实现共享：每页一个层堆栈、一个模态出口顺序、一个手势计数器，以及一份外部关闭、popover 显示与隐藏操作、层表面和按压声明的记录。此前，此类副本保留自己的记录，因此包内 Dialog 中的经 swizzle HoverCard 上按 Escape 可能连 Dialog 也一起关闭，两个副本还可能竞争彼此的 popover 操作或漏掉彼此的外部按压。无 API 变更。(#10998)
- 当调用方同时传入 `aria-disabled` 或 `role` 时，被禁用的 Link 仍会以自身角色宣布为禁用。此前，这些调用方 props 会替换 Link 自身的值，导致 `aria-disabled={false}` 将被禁用的链接宣布为启用，`role="button"` 将不会执行任何操作的按钮宣布为按钮。(#11030)
- Markdown 的公开解析器会丢弃所有 data: 链接和图片 URL，`<Markdown>` 会将 data: 链接和图片渲染为源文本。(#11020)
- Carousel 的吸附分页：在 Safari 中，当稳定过程在读取项目矩形和读取其 translate 之间发生时，按住状态下那一行的停靠点和跨度会保持在每个项目的起始边缘。(#10992)

#### 文档

- 为 `useDirection` 添加 hook 文档和交互式迷你折线图示例块，详述渲染时的方向处理和 CSS 逻辑属性最佳实践。(#10547)
- InternationalizationProvider 新增日历示例：provider 的 `calendar` prop 会以日本历或佛历显示 `Calendar` 和 `DateInput`，值仍保持为公历 ISO 日期。两种日历都无需 `Temporal` 即可工作。(#10135)

#### 其他变更

- 内部：Table 的行虚拟化现在运行在 Core 内部的一个共享列表窗口化模块上，后续的长列表将复用它。未文档化的 `@astryxdesign/core/internal/virtualization` 入口将同一模块提供给 Lab。Table 的行为和公共 API 不变。内部入口不属于公共 API 及其兼容性承诺。(#10810)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @humbertovirtudes
- @imdreamrunner
- @nynexman4464
- @utkarshpatwa393-sys
- @vjeux

---

# 0.7.12

#### 实验性 API

- 新增 Lab ChatVirtualizer 自身滚动容器的英文默认名称（`@astryx.chatVirtualizer.label`，即 "Messages"）。这是随 Core 的 locale 文件一起提供的 Lab 字符串；不会为 `@astryxdesign/core` 增加任何公共 API。(#5461)

#### 新功能

- BottomSheet：静止状态下，无论 `padding` 为何，面板内容都从抓取条下方开始，因此第一行不再穿过抓取条的渐隐区域。块起始内边距绝不小于抓取条的高度（`--spacing-6`）：抓取条下方的条带不是子元素可以逃脱的内边距，因此单独的 `Section` 也从抓取条下方开始；滚动的内容仍会从它下方经过。默认内边距的面板其内容起始位置会下移 8 px；`padding={0}` 的面板内容从抓取条下方开始；唯一子元素是 `Section` 的面板，该 Section 会下移 24 px，面板也相应增高同样数值。Core 自有的 `padding={0}` 面板（触摸日期和时间选择器、DropdownMenu 和 ContextMenu 面板，以及 PowerSearch 和 Tokenizer 面板）不再自行预留该条带，因此选择器、PowerSearch 和 Tokenizer 的外观保持一致，菜单的第一行则下移 8 px。CLI 的 `table-filter` 和 `table-inbox` 页面模板也去掉了自带条带，以免重复。(#8558)
- ChatLayout 在视觉视口因软件键盘而缩小时，会让其输入区保持在软件键盘上方，而不是任其留在键盘下方直到浏览器滚动整个页面。在 Android 的 Chrome 中，输入停靠区会跟随 Gboard 测得的滑动上下移动，与键盘同步。在 iOS 的 Safari（浏览器内和主屏幕应用）以及 Android 的 Firefox 中，一旦浏览器报告键盘出现，它就会移到键盘上方。当页面设置 `interactive-widget=resizes-content` 时，Chrome 会自行因键盘缩小页面，输入区无需移动就保持在键盘上方。停在最新消息处的会话会保持在该位置，对话记录的其余部分仍可在输入区上方滚动。在触摸屏上的顶层页面中，进入输入区文本的每一种方式（点按、键盘的上一个/下一个按钮、Tab、输入框的 `focus()`）都能到达输入区而不会让页面滚动；在鼠标操作或 iframe 内，则应用浏览器自身的焦点行为。在触摸屏上的顶层页面中，输入区的包装器（不含滚动到底部按钮）是一个无名称的组。当键盘上的 Done 结束输入时，焦点会停留在此处（它不是 Tab 停留点），因此下一次点按或 Tab 会从输入区开始；它仅在键盘输入后显示焦点环。聚焦输入区的点按仍只会触发一次 click。在鼠标操作或 iframe 内，包装器是普通容器。在“减弱动态效果”下，输入区绝不会随 Gboard 移动：它会交叉淡入到键盘上方的位置。在鼠标操作且没有软件键盘时，没有任何变化。浏览器支持指南中关于屏幕键盘的一节涵盖了 ChatLayout 的输入区。(#8176)
- `Kbd` 在 Apple 平台上将 `meta` 显示为 ⌘，此前显示为 "META"。(#10528)
- `Kbd` 在非 Apple 平台以及 hydration 之前，将 `ctrl`、`alt` 和 `shift` 显示为文本（"Ctrl"、"Alt"、"Shift"），将 `meta` 显示为 "Win"，而不再使用 Apple 的 ⌃ ⌥ ⇧ 符号和 "META"。Apple 平台保留这些符号，朗读名称不变。文本来自消息目录，因此其他语言可以翻译。(#10524)
- 在 `resizable` prop 中接收 `useResizable` 区域的 `LayoutPanel`，当该区域折叠或展开时，会从面向其 `ResizeHandle` 的一侧滑入或滑出，适用于所有指针类型，旁边的内容也随同一动效移动：可通过 `collapse()`、`expand()`、Enter、双击、增长箭头、受控的 `isCollapsed`，或抬升超过折叠阈值触发。重新打开面板的拖动会跟随指针，并遵循“减弱动态效果”。手工构建的 `ResizableProps` 对象不会滑动。未新增任何 prop 或选项。(#9989)
- 在手机或平板上，向下拖动 Lightbox 照片即可关闭查看器，与 iOS 照片查看器类似。照片会跟随手指移动，并在拉动时略微缩小，同时背景淡出，控件淡出得更快。背景淡出时不带模糊，静止后模糊会恢复。向下移动时松手，无论拉动幅度多小，照片都会继续向下，查看器随之关闭。向上轻扫，或将其带回起始位置，它会弹回原位。已缩放的照片在拖动时仍会平移；用于关闭的拖动从适配尺寸开始。视频保持不变。(#8215)
  查看器的控件现在位于各自的层中，在拖动过程中一起淡出。

- Lightbox 画廊现在的翻页方式与 iOS 照片查看器一致。在手机或平板上，在项目之间拖动或轻扫：整行会跟随手指，松手后最多落到下一个或上一个项目。移动时项目之间相隔 40 px。已缩放的照片会随手指平移，直到到达边缘；从该边缘再次拖动会移到下一个项目。保持缩放状态的照片会在画廊静止后恢复到适配尺寸。用手指操作时，上一个和下一个按钮以及方向键会让项目滑动过去，而不是原地切换。(#8197)
  每个项目的说明会随其项目移动，紧贴在照片下方。`onIndexChange` 也会报告轻扫。

  Lightbox 现在会随自身加载触摸代码，与 Toast 和 Slider 的做法相同。其导入体积（gzip）从 51.4 KB 增长到 99.6 KB，其中包含缩放和分页，主要是页面只会加载一次的共享触摸模块；Lightbox 自身的代码压缩后增加 14.1 KB。

- `List` 接收 `animatedLayout`，即 `useAnimatedLayout({containerRef})` 返回的句柄；`ListItem` 接收 `itemKey`，即行的标识。使用该句柄后，当行被插入、移除或重排时：插入的行会入场，移除的行（例如滑动后显示操作的行）会原地折叠，而穿越其他行的行会从它们上方经过，并带有其背后的表面色，就像 iOS 表格中的不透明单元格一样。变化后的行以及列表之后的内容（直到句柄的容器）都会滑动到新位置。所有这一切都在同一个共享动效上运行并同时开始，适用于所有指针类型；在“减弱动态效果”下不会有任何位移。没有 `itemKey` 的行会立即变化；没有句柄时，整个列表都会立即变化。(#8106)
- 当可重排 `List` 的行处于重排模式时，会有一个锚定到其手柄的提示（使用键盘提示的层和主题角色）显示移动操作和 Done。每个都是一个按钮，执行对应按键的功能，并将焦点留在手柄上，因此仅靠点按即可重排行：手柄、移动操作，然后是 Done。(#8139)
- `createReorderable({onReorder, isReorderable})` 生成集合的重排行为，`List` 将其作为 `reorderable` 接收：每个带 `itemKey` 的 `ListItem` 会在末尾获得一个重排手柄，每次提交的移动会调用一次 `onReorder({key, to})`，传入该行的 key 及移动后的索引。在触摸屏上，手指在手柄上保持不动会像 iOS 表格的重排控件那样捡起其行（在其上轻扫仍会滚动）：该行留在原位并变暗，其副本跟随手指，一条强调线标示它将落到的位置；其他行保持不动，页面在靠近边缘时滚动，松开后各行重新排列并滑动到新位置。主指针为粗指针时，笔在手柄上保持不动也会以相同方式捡起其行。鼠标或主指针为细指针时的笔会立即拖动手柄，并显示相同的副本和线条，各行会无动效地就位；取消拖动会立即将所有内容还原。没有拖动时，在手柄上点击、按 Space 或 Enter 会为该行开启重排模式：插入线标示该行的位置，每个方向键立即将其移动一个位置，并宣布其位置和相邻项，按 Escape 或其他激活方式会结束模式并保留移动结果。该对象的 `start(key)` 可从应用自有 UI（例如行的上下文菜单）进入相同模式。没有 `reorderable` 的 List 不会加载任何重排代码。(#8139)
- 任何指针将 `ResizeHandle` 拉过区域的最大值（或低于最小值）时，如果该区域的面板由 `LayoutPanel` 渲染，手柄现在会带阻力移动，最多超出限制约 8 px 并覆盖到旁边的内容上，而各窗格保持原尺寸，抬起后手柄会弹回限制位置。仅由区域 `size` 决定尺寸的面板会停在限制处。可折叠区域不再在拖动中途折叠：只有抬起时才会折叠——当指针越过 `collapsedSize`，或释放速度足够快以致越过它才静止时；`LayoutPanel` 的窗格会以释放速度产生的弹簧效果滑合。低于最小值的任何其他抬起都会回到最小值。再次抓住手柄的指针会在其显示位置接住它。方向键仍会停在限制处。“减弱动态效果”下两者会立即落位。(#10292)
- Table 可以对固定高度的平面数据进行窗口化：将 `useTableRowsVirtualization({rowHeight, initialViewportHeight})` 传给 `Table.virtualization`。Table 保留完整数据和行标识，只挂载视口内及少量 overscan 行，保留原生表格语义与全表行位置，保持聚焦行挂载，并对无法窗口化的内容或几何结构回退为渲染每一行。未选择启用的表格保持不变。(#8280)
- `useTableRowsVirtualization` 的 `viewportHeight` 在该 hook 首次稳定发布前重命名为 `initialViewportHeight`。它只在服务器端、视口测量之前确定第一个窗口的大小；不再设置 Table 的高度。窗口化的 Table 会在父级给它的高度内滚动，因此请为父级设置高度。`rowHeight` 不变。(#10894)
- Table 插件现在可以读取行的位置。Table 会向每个表体行和单元格转换传入一个不可变的 `TableRowContext`（行的 key、其在完整数据中从零开始的 `logicalIndex`、行数和表头数，以及行模型）。它向滚动包装器转换传入一个带有稳定 `viewport` 引用的 `TableRenderContext`。当插件的表体转换保持每个数据项对应一行时，插件需声明 `rowModel: 'flat'`。`useTableSelection` 和 `useTableStickyColumns` 已声明。无选项的 `useTableRowIndex()` 现在根据上下文为行编号（传入 `data` 仍按该数组编号），并且行移动时只会为读取索引的插件重新渲染。请在转换期间读取上下文值；之后从回调中读取会在开发环境中发出警告。CLI 的编号行块不再传入 `data`。(#10171)
- 窗口化的表格在启用行选择和行号时仍保持窗口化。窗口化的行号列会在该行挂载之前按表格的字体和密度加宽以容纳其最后一个编号，其后的固定列会随之移动。(#10658)
- 在触摸呈现下，ToggleButtonGroup 会像菜单一样跨其各个开关跟踪手指或笔的按压。按住一个开关并滑过其他开关：高亮会跟随，只有抬起时所在的开关会改变。在组外抬起不会改变任何内容。鼠标按压保持不变：与原生开关一样，只在其起始的开关上生效。用手指时，组所跟踪的开关会保持其 44 px 目标，现在由组绘制。没有值的开关保留其自身的按压行为，键盘操作不变。此前，每个开关只跟踪自己的按压，滑出它不会产生任何变化。在粗指针下，已启用的 ToggleButtonGroup 根元素为 position: relative，因此绝对定位的子元素会锚定到该组。主指针为细指针时，组保持不变。(#8660)
- 在主指针为粗指针时，展开 `TreeList` 的行会让其下方各行通过共享布局滑动效果滑到新位置，同时其子项以相同时间淡入，因此整棵树作为一个整体移动。折叠时子项淡出，下方各行向上滑动，chevron 也按该时间旋转。此前这些行会在单帧内出现和离开。没有 `animatedLayout` 句柄时，动效只在树内部进行，因此树之后的内容会立即就位，树在移动时会裁切其下边缘，以免任何行绘制到该内容上；若要让它也滑动，请传入句柄。组旁的引导线现在会随其行显示和隐藏。在“减弱动态效果”开启且用手指时，子项会在落点淡入。用鼠标时各行仍会立即变化。在所有指针类型下，引导线现在会终止于其连接的最后一行，而不是在展开的最后一行子项旁继续延伸。(#8088)
- BaseTypeahead 接收 `menu`，用于选择其锚定菜单显示的内容，同时由 Astryx 管理该层：其位置、顶层、外部按压、Escape、焦点返回和 ARIA。`{role: 'listbox', render}` 会在结果列表周围放置信息，例如表头或键位提示，人物可操作的内容仍保持为结果，因此方向键可以到达（列表外的控件会在开发环境中发出警告）。`{role: 'dialog', label, render}` 会在由 `label` 命名的对话框中显示可聚焦内容；关闭后焦点会返回打开时聚焦的元素，或返回输入框。新增的 `handleRef` 暴露 `open()` 和 `close()`，`onOpenChange` 报告每次变化；没有受控的打开状态。从 `onChange` 调用 `open()` 会保持菜单打开，因此一次选择可以在同一层上把列表切换为对话框。Typeahead 转发 `menu` 和 `handleRef`。(#10544)

#### 问题修复

- 对于与公历对齐的日历，月份位置超出当年末尾时，`calendarMonthFromYearMonth` 和 `useCalendarDays` 现在会钳制到该年的最后一个月，而不是返回 NaN 的 CalendarMonth 并排布下一年的 1 月 (#10461)
- 声明由渲染器拥有的 DOM 边界，使装饰器覆盖层挂载到受管理内容之外，同时不改变安全的内联宿主。RichTextEditor 还会将其 `dir` prop 镜像到可编辑表面周围的包装器上，因此编辑表面及其内容块、占位符、通过 `plugins` 渲染的 UI 以及重新定位的覆盖层都会遵循 `dir`；此前编辑表面会保留周围的方向。(#7633)
- 在 Android 上，在报告 `env(preferred-text-scale)` 的浏览器中（已在 Chromium 和 Chrome 稳定版上验证），每个主题的文本都无需配置即可遵循读者的系统字体缩放。根 `Theme` 读取 `env(preferred-text-scale)` 并按此缩放所有字号，就像它已在 iPhone 上遵循动态字体一样。此前，只有当页面添加 `<meta name="text-scale" content="scale">` 时，系统字体缩放才会影响 Astryx 文本。带有 `content="scale"` 的页面保持原有工作方式：其根字号承载缩放，根 `Theme` 不再额外添加。两者都不支持的浏览器看不到变化。`astryx docs typography/type-scale` 对此有说明。(#10727)
- 动效：在 Linux 上的 WebKit 中，`animatedLayout` 变化的最后一帧会在某一帧把动效绘制到接近结束时，显示每个动效结束的位置。在负载下，该帧以及长任务超过其结束点的每一帧，都可能显示滑动、退场淡出或指示器旋转进行到一半的状态：折叠中的 `TreeList` 会把下方行画回 44 px，其离场行半透明，chevron 旋转到一半。在该帧之前开始的长任务，或仅在最后一个关键帧才接近结束的动效，仍可能出现这种情况。正常速度下动效不变。(#10663)
- 动效：Switch 在移动途中改变值时，会保持滑块的当前速度。向新静止位置的重定基准会整体平移曲线。(#10369)
- Avatar：首字母现在作为生成内容绘制，并带有空的替代文本，而不是作为文本，因此 axe 的 Label in Name 检查（`label-content-name-mismatch`）不再标记显示首字母的链接或按钮头像。可访问名称、名称工具提示和首字母外观保持不变。(#10816)
- 在“减弱动态效果”下，由手指轻扫关闭的 `BottomSheet` 会在手指离开的位置淡出。此前，它会在一帧内跳回打开位置并从那里淡出。在有动效时，此类轻扫后的下一次打开会再次从屏幕下方升起，而不是从手指离开面板的位置开始。(#10925)
- BottomSheet：拖动会根据 Core 的速度跟踪器、按每个事件自身的时间戳读取释放速度，触摸拖动从面板内容上开始时也是如此。释放取决于最后两次移动，因此一次轻扫中较早到达页面的移动不再拖慢该轻扫。停顿会影响其后的第一次移动，与 iOS 的滤波器一致。有两条规则与 iOS 不同：手指在抬起前静止超过 40 ms 时不会以运动状态释放，且释放需要两次移动。(#10463)
- 一个堆叠的 `BottomSheet`，如果其关闭操作在挂起的过渡中等待，会在其下方的面板关闭时接管变暗效果，因此其背后的页面保持变暗。(#10776)
- BottomSheet：重新渲染的已打开面板不再读取视口高度。它会保留其 `resize` 监听器读取的视口高度，因此重新渲染面板的点按在 React 的 commit 阶段不会强制进行样式重算或布局。面板的高度、预留和 detents 保持不变。(#10363)
- Button：被禁用的按钮不再渲染原生 `disabled` 属性。它们仍可在键盘 Tab 顺序中聚焦，在聚焦时变为禁用会保持焦点（链接 Button 在禁用时变为 `<button>`，仍会移动焦点），并暴露 `aria-disabled="true"`。所有激活路径（鼠标点击、Enter、Space）以及 clickAction/onClick 回调仍被阻止，且不会将焦点丢到文档 body。被禁用且带名称的 submit Button 会保留其名称，以便 `new FormData(form, submitter)` 省略其值。成员全部被禁用的 ButtonGroup（无论是在组上还是单独设置）会保留其唯一的 Tab 停留点，而不是退出 Tab 顺序或让每个成员各占一个停留点，Carousel 隐藏的滚动按钮绝不会成为 Tab 停留点。断言 `toBeDisabled()` 或 `:disabled` 的测试应改为查询 `[aria-disabled="true"]`。(#7906)
- 带标签的 `Button` 在文本大小增大时会随标签增大：其高度为其尺寸，或标签一行的高度（取较大者），因此标签保持在按钮内。默认文本大小下 Button 的渲染与以前完全相同，调用方的 `height` 仍然生效，仅图标按钮保持固定正方形。(#10588)
- 当人物文本大小增大（例如更大的浏览器默认字号）时，`Calendar` 的日期按钮会随数字增大。其尺寸现在是最小值，因此日期数字会留在自己的点按目标内，点按不再落到下方的日期上。默认文本大小下没有任何变化。(#10596)
- 在吸附分页（`hasSnap={useSnapPaging()}`）下，Carousel 的边缘按钮以及 `handleRef` 的 `scrollNext`、`scrollPrev` 和 `scrollTo` 会通过分页移动整行，从静止状态也是如此。接住此类移动的触摸现在会让行停在某一页上，与轻扫的稳定过程一致。在 iOS 上，静止的触摸过去会停止浏览器在项目之间的平滑滚动。(#10384)
- 在吸附分页（`hasSnap={useSnapPaging()}`）下，Carousel 的边缘滚动按钮和边缘渐隐会随行移动。它们会在行离开边缘的同一帧发生变化。此前轻扫会让它们保持原状，直到稳定过程结束、行回到原生滚动，导致起始按钮在行明显离开起点约半秒后才恢复。(#10359)
- ChatComposerInput：在选择提及、插入 token 或插入 token 之后的文本后立即使用输入法（例如日文或中文）输入时，现在只会提交组合出的文本。输入区会将光标放在末尾文本内部，而不是元素边界上，因此组合的第一个原始字母不再被提交。选择提及后立即按一次 Backspace 现在会连同其后的空格一起删除该提及，且不会留下多余换行。(#6423)
- 当 `scrollRef` 指向文档的滚动器且读者向上滚动页面时，ChatLayout 的滚动到底部按钮现在会出现。流式滚动也会在那里停止跟随，因此流式回复不再将该读者拉回最新消息。(#10779)
- 带 `scrollRef` 的 ChatLayout 现在会在滚动末尾将最新消息停在固定输入停靠区上方。消息区域的末尾内边距会保留停靠区的高度，并随输入区增长而跟随。(#10676)
- `useChatStreamScroll` 的 `scrollToMessage` 现在在滚动器就是页面本身时，会将消息置于视口顶部。此前它会因页面自身的滚动而偏移。(#10781)
- 当搜索或引导请求被拒绝时，CommandPalette 会保持打开并显示无结果 (#10675)
- 作为不含更深层其他 Table 或 bleed List 的圆角 Card 或 Dialog 的第一个或最后一个子元素时，Table 或带 `edge="bleed"` 的 List 现在会与其到达的圆角一起圆角，因此表格的焦点环在容器角落保持完整，而不是被裁掉。带页眉的 bleed List 只让最后一行圆角。其他每个角落保持直角：独立时、位于直角容器或包装元素内时、位于其他内容之间时、位于 BottomSheet 顶部（其抓取条下方）时，或同一容器更深处还有另一个 Table 或 bleed List 时。(#10586)
- CodeBlock 的“Failed to copy value to clipboard.”宣布现在使用 assertive 实时区域而不是 polite 区域，正如状态宣布对错误的要求，因此屏幕阅读器会立即报告复制失败。成功的复制仍以 polite 方式宣布。(#10448)
- 经 swizzle 的 `Outline`（或其他携带 Core Markdown 插件协议的副本）现在能对包内的 Markdown 插件进行类型检查：`MarkdownPluginEntry` 和 `MarkdownTransform` 将节点类型放在共享的带版本 key 上，而不是模块本地 symbol，因此包内和副本的类型匹配。该成员仅存在于类型中；运行时信任和占用检查不变。无 API 变更。(#10641)
- 经 swizzle 的副本和包内实现现在在动画布局句柄、代码语言值和吸附分页上保持一致。将 `useAnimatedLayout` 的句柄传给经 swizzle 的 `AppShell`、`List`、`Table`、`TreeList`、`Collapsible` 或 `SideNav` 时，布局变化不再抛出错误，且这些副本能通过类型检查：每个 brand 在运行时通过已注册的带版本 key 读取，类型带有一个永远不会出现的可选 brand 成员。无 API 变更。(#10576)
- Core 将每个 React context 以及其组件注册的英文都放在带版本的 key 下，因此同一页面上两份 Core 模块副本可以共享它们：一个副本的 provider 能到达另一个副本的消费者，任一副本的层边界都会重置两个副本的层作用域 context，任一副本的组件都会显示其英文。针对另一版本 context 构建的副本保留自己的 context。无 API 变更。(#10233)
- 携带 Core 触摸代码的经 swizzle 组件（例如经 swizzle 的 `Switch` 或 `Slider`）现在会加入包内的页面手势宿主、窗口输入监听器、点击防护、层输入保持和移动元素命中测试，而不是保留第二套，因此副本和包内组件不会同时占用相同的触摸。无 API 变更。(#10599)
- 经 swizzle 的 `List`、`TransferList` 或 `ListInput` 和包内实现在 `createReorderable` 对象上保持一致：其重排机制通过已注册的带版本 key 读取。此前，经 swizzle 的 `List` 无法在包内对象上找到机制，因此不显示重排手柄。无 API 变更。(#10741)
- 带 `presentation="bottom-sheet"` 的 `DateInput` 或 `DateTimeInput` 在服务器和浏览器处于不同日期时，不再导致 hydration 不匹配。已关闭面板的日历现在会在 hydration 之后、已知浏览器今日日期时立即渲染。(#10400)
- Dialog：在 React StrictMode 下，一个带 `DialogHeader` 的 `Dialog` 如果先以打开状态挂载，随后在打开状态下被移除（仅在打开时渲染），现在会将焦点返回打开它的元素，而不是将焦点留在页面 body 上。opener 只在从关闭到打开的边沿被捕获。(#5642)
- `Dialog`：`DialogHeader` 标题现在只会在对话框成为模态之后才获取焦点，表头在打开对话框的渲染中挂载时也是如此。当没有其他控件请求焦点时，初始焦点现在在所有浏览器中都从标题开始。此前，带起始控件的表头以及 Firefox 中的所有表头都会从第一个控件开始。(#10408)
- `Drawer`：非模态抽屉（`hasScrim={false}`）在打开状态下卸载时（例如仅在打开时渲染的 `{isEditing && <Drawer isOpen …>}`，或随视图其余部分一起移除），现在会将焦点返回打开它的控件，而不是将焦点丢到页面。模态抽屉此前已经如此。(#9672)
- DropdownMenu：手指的按住-滑动-抬起不再使菜单按钮闪现焦点轮廓。当按住的按压打开菜单时，按钮会先获取焦点，以便菜单关闭时焦点可以返回；该焦点现在只在键盘输入后显示轮廓。键盘打开和关闭仍会在按钮上显示轮廓。(#10079)
- Dialog、CommandPalette、BottomSheet、Lightbox、Drawer、MobileNav、Popover：Tab 不再通过单选组逃出模态。浏览器会给同名的一组原生单选框一个 Tab 停留点：其选中的单选框，或者在没有选中项时，向前为第一个、向后为最后一个。焦点区域现在也以相同方式查找其第一个和最后一个停留点。此前，当该组位于模态末尾且选中的单选框不是其中最后一个时，从选中单选框按 Tab 会离开模态并进入浏览器工具栏；当该组位于模态开头时，Shift+Tab 也会发生同样情况。由 @duytbp 报告。(#10304)
- 手势：手指的抬起现在按其移动所用的时钟读取。在 Linux 上的 WebKit 中，运行时间较长的页面 pointerup 监听器不再使快速轻扫被读成静止手指，也不再使及时抬起的点按被读成长按。(#10583)
- `HoverCard` 和 `useHoverCard` 在传入 `isOpen={false}` 时，不再因触发器获得键盘焦点而打开。受控的 `false` 已拒绝悬停，但用 Tab 移到触发器上会打开卡片并针对所有者状态报告 `onOpenChange(true)`；现在焦点会像悬停一样被拒绝。(#10181)
- HoverCard：带标签的卡片不再在无角色的触发器（例如文本或 `<time>`）上放置 `aria-haspopup="dialog"`。此类触发器仅通过 `aria-controls` 命名打开的卡片；按钮或链接触发器仍会获得 `aria-haspopup` 和 `aria-expanded`。(#10733)
- 渲染到另一文档（例如 iframe 或画中画窗口）的 `HoverCard` 现在会在该文档中按 Escape 时关闭，从卡片内部按 Escape 会将焦点返回其触发器。将焦点从触发器移入此类卡片也会保持其打开。此前，卡片只读取页面的 document，因此在另一文档中按 Escape 永远不会关闭它。卡片现在还会按触发器的位置在共享关闭栈中排序，因此触发器位于焦点陷阱容器内的卡片会作为最顶层，先于该容器接收 Escape。(#9592)
- `HoverCard` 和 `Tooltip`：受控的 `isOpen={true}`（或 `isDefaultOpen`）在触发器挂载时尚无布局盒（例如位于尚未调用 `showModal()` 的 `Dialog` 内）时，不再使层滞留在视口角落。(#5398)
  `Dialog` 会在打开之前挂载其子项（`isOpen` 控制 `showModal()`，而不是渲染），因此位于其中且受控 `isOpen={true}` 的 `HoverCard` 或 `Tooltip` 会在触发器仍位于非模态 `<dialog>` 内且没有盒子时执行其显示效果。没有盒子的触发器不是有效的 CSS 锚点：popover 会解析到视口角落的回退位置，而且与实时布局变化不同，触发器之后获得盒子时不会重新解析。

  `Layer` 的 `show()` 现在会在触发器已有布局盒时立即打开（空盒子也算，例如 ContextMenu 的光标锚点），因此菜单或 popover 仍会在请求它的按压所在的同一任务中打开。只有没有布局盒的触发器（`display: none`，或位于未显示的 `<dialog>` 内）才会等待：先等待它获得布局盒且其对话框显示，再等待文档时间线上任何会自行结束的运行中动画（在触发器或祖先上）完成，以便层锚定到触发器的稳定位置，而不是过渡中的位置。暂停的、无限的以及由滚动或视图驱动的动画不会被等待。

  盒子等待由信号驱动，不进行轮询：用 `ResizeObserver` 等待触发器获得布局盒，用 `IntersectionObserver` 等待纯 `display: inline` 的触发器（例如纯文本触发器的包装 `<span>`），后者 `ResizeObserver` 永远不会收到条目；同时监听所在对话框的 `open` 属性和 `toggle` 事件。对话框在打开或以 popover 显示时都算作显示中，因此非模态 `Drawer` 内的触发器仍能打开其层。等待没有时间限制，会在触发器在显示中的对话框内获得盒子时结束，或在打开被取消时结束（后续的 `show()` 或 `hide()`，或卸载）。如果等待期间触发器元素被替换，等待会在新元素上重新开始；永久卸载的触发器会停止观察。没有可供等待的布局引擎时（没有 `ResizeObserver` 或 Web Animations API，例如 jsdom），层会立即打开。

  触发器 ref 上短暂的 `null` 然后同元素调用（组合 ref 工具在处理器身份变化时会产生）不再移除并重新添加元素的 `anchor-name`，这也可能使已打开的层滞留在角落。

- 带入场输入保持的层：在轻关闭层打开时已经按下、并在其入场期间抬起的手指或笔，现在会在 WebKit 中穿过保持盾牌落到其下方的内容上，因此层会像在 Chromium 中一样关闭。盾牌会在每次此类按压处留出一个小开口，直到抬起。入场期间的新按压仍会被保持。(#10398)
- Layer：从右键 `contextmenu` 事件打开的轻关闭层，在同一次按压释放时保持打开。此前，该释放会被计为外部按压，因此通过右键从 `isMenuOpen` 打开的 DropdownMenu 会立即关闭。之后的外部按压仍会关闭该层。(#10128)
- 当键盘缩短视口时，两侧空间都不足的高 popover 会保持其顶部。正在输入的字段留在光标下方。它过去会随键盘出现跳到触发器下方，并在键盘消失时跳回。(#10497)
- 一旦键盘限制了 popover 等层，人物之后在其中开始的滚动不再被撤销。在繁忙的页面上，层可能会在之后立即滚回聚焦字段。后续键盘变化仍会将正在输入的字段带回视野。(#10457)
- Tooltip（包括 Slider 的值气泡）在滚动过程中不再跳到触发器的另一侧。此前，当滚动将触发器带向边缘时，层运行时会在一帧强制布局中将 Tooltip 移出渲染，以便浏览器重新选择位置，并在滚动的后续帧中再次这样做。现在 Tooltip 从一开始就有一个回退列表，其中没有覆盖触发器的选项：它会先尝试对侧，然后尝试触发器旁边，最后尝试按空间调整的一侧。滚动期间 Tooltip 保持其所在侧：直到滚动停止才重新检查或放置。滚动停止后的第一个绘制帧（在 `scrollend` 时，或在浏览器不支持 `scrollend` 时最后一次 `scroll` 事件后 150 ms），会检查一次，并在需要时移到有空间的一侧。显示、重新挂载或尺寸变化时仍会像以前一样检查。(#10439)
- Tooltip 的内容仅靠 CSS 滚动，没有监听其触发器移动。Tooltip 现在从第一帧起就有 `overflow-y: auto`，且没有 overscroll 包含。它只在内容溢出时滚动，因此内容恰好适配的 Tooltip 上滚动滚轮仍会滚动页面。高 Tooltip 滚动到末尾后，下一次滚轮会继续滚动页面，而此前页面会停住。Tooltip 现在始终是滚动容器，因此其内容中的 `position: sticky` 和 `scroll(nearest)` 时间线会相对 Tooltip 解析。层运行时不再在触发器移动后读取 Tooltip 的滚动尺寸，也不再观察只移动而不改变尺寸的触发器。(#10472)
- 经 swizzle 的 `LayerProvider` 现在会显示包内的 toast：包内 `Toast` 注册的视口会渲染在副本 provider 的出口中，包内 provider 也会渲染副本的视口。此前，每个副本保留自己的注册表，因此在经 swizzle 的 provider 下添加的 toast 从不显示。注册表位于已注册的带版本 key 下。无 API 变更。(#10800)
- `Layout`：`false`、`true` 或空字符串插槽（例如 `isOpen && <LayoutPanel />` 产生的 `false`）现在算作空。相邻区域会像省略插槽时一样移到布局边缘；使用 `contentWidth` 时，关闭的侧面板不再让内容区域停在 content-width 框架处。文档现在列出 `children` 和 `ref`，说明如何隐藏区域，并说明地标角色放在区域组件上。(#10500)
- `LayoutContent`：远离单个起始面板的一侧现在采用 Layout 边缘内边距，因此 Layout 上的 `padding={0}` 会使其全出血；使用 `contentWidth` 时，其子项会像没有面板时一样，在 content-width 框架内缩进一个 Layout 边缘内边距。每个边缘现在会发布其应用的 padding，因此像 Table 这样的全出血子项能与末端面板对齐，并位于无分隔线的页眉下方。嵌套在无分隔线页眉或页脚下的 Layout 会保留自己的内容间距，而不是采用外层的折叠。(#10516)
- 没有 `contentWidth` 的 `Layout` 不再将其 `LayoutHeader` 和 `LayoutFooter` 限制在视口宽度。在比视口更宽的框架中（例如滚动画布或宽嵌入），它们的内容现在会像 Layout 其余部分一样跨满框架。(#10715)
- `LayoutFooter`：调用方传入的 `data-divider` 属性不再替换页脚反映的分隔线状态，因此无分隔线页脚上方的内容保持其折叠间距，有分隔线的页脚保持分隔线上方的间距。文档现在列出 `padding` 和 `ref`，并说明未设置的 `hasDivider` 遵循 Layout 的 `defaultHasDividers`。(#10674)
- `LayoutHeader`：调用方传入的 `data-divider` 属性不再替换表头反映的分隔线状态，因此无分隔线表头下方的内容保持其折叠间距，有分隔线的表头保持分隔线下方的间距。文档现在列出 `padding` 和 `ref`，并说明未设置的 `hasDivider` 遵循 Layout 的 `defaultHasDividers`。(#10686)
- `LayoutPanel`：在采用 Layout 自身内边距的边缘上，面板现在会告知其子项它在那一侧应用的 padding。读取容器 padding 的子项（例如全出血的 `Divider`、`Table`、`TabList`，或嵌套的 `Layout`）现在会在 Layout 的 `padding` 与内部内边距不同时遵循面板的外边缘。此前它们使用内部内边距：`padding={6}` 时全出血 `Divider` 距边缘差 8px，`padding={0}` 时会超出边缘 16px。文档现在说明 `hasDivider` 在哪条边缘绘制、Layout 的 `defaultHasDividers` 不适用，以及 `padding={0}` 为全出血，并列出 `ref`。(#10774)
- `Lightbox`：屏幕阅读器现在会在查看器打开时听到其自身的消息。切换到另一个项目（“Mountain lake, 2 of 4”）以及放大或缩小都会在打开的查看器内宣布；此前它们会送往模态查看器背后的页面，屏幕阅读器在那里不会朗读。`0` 键现在会将缩放照片恢复到适配尺寸。文档列出 `0` 键，并且不再说明灯箱仅用于图片。(#10775)
- Lightbox 的拖动关闭现在按主题的节拍播放，与查看器的其他动效一致。默认节拍下播放效果与以前完全相同。(#10630)
- 当 `index` 或 `defaultIndex` 为 NaN 或第一项与最后一项之间的小数时，已打开的 Lightbox 会显示最近的项目。小数会舍入到最近的项目，NaN 显示第一项。此前，查看器对这些值不渲染任何内容。(#10632)
- 位于自身滚动框中的可重排 `List`，在鼠标或笔拖动期间滚轮滚动页面时，会让被拖动的行保持在指针下方，与在滚动框末端滚动滚轮时一样。滚轮按以前的方式滚动。(#10789)
- Markdown：每个段落、标题、引用和列表项都按自身文本的方向布局。从左到右页面中的希伯来文或阿拉伯文段落现在从右侧开始，从右到左页面中的英文段落从左侧开始。没有字母的块（例如数字、标点或图片）会从 `InternationalizationProvider` 获取页面方向，即使位于方向相反的引用或列表项内也是如此。列表、代码块和表格也保持其周围的方向，每个表格单元格中的文本按自身方向阅读。方向与列表相反的编号项会在自身文本旁显示编号，方向与表格相反的表格单元格会保留表格的列线和任何显式的列对齐。任务列表现在与其他列表保持相同的正文宽度。(#10293)
- 菜单：方向键、Home、End 和 type-ahead 现在可以到达 `DropdownMenu`、其子菜单、`MoreMenu`、`ContextMenu` 和 `NavHeadingMenu` 中被禁用的行，因此键盘或屏幕阅读器用户可以找到该行及其描述。该行会获得焦点，宣布为禁用，按 Enter、Space 或点击它仍不会执行任何操作，并保持菜单打开。从键盘打开菜单仍会落在已启用的行上。(#10160)
- DropdownMenu：在加载繁忙的页面上，鼠标从触发器按住拖到某一行时，该行会保持高亮。此前菜单的打开焦点可能在拖动到达该行之后才落位，并将高亮带回菜单容器，直到指针再次移动。(#10590)
- DropdownMenu：由鼠标按压打开的菜单，在该按压于远离触发器处快速释放，或触发器在指针下移开之后，仍保持打开。此前，浏览器的轻关闭会将该释放读作外部按压并立即关闭菜单。在菜单外超过稳定时间后释放仍会关闭菜单，之后的外部按压会关闭它。(#10689)
- 在手指操作下，DateInput 和 DateTimeInput 底部面板中日历标题后面的月份和年份滚轮现在像 iOS 日期选择器一样：(#8209)
  - 转动滚轮会将已选日期移到新的月份并保留其日号，因此 10 月 15 日会变为 5 月 15 日。该月没有的日期会变为其最后一天，结果保持在 `min` 和 `max` 内，DateTimeInput 保留时间。`dateConstraints` 拒绝的日期不会被选中；日历仍会移动。
  - 未选择日期时，滚轮只会移动日历。

  用鼠标时，滚轮仍只会移动日历。

- 动效：在同一帧中从静止开始移动的元素现在会同时开始。此前，每个元素会在该帧中各自读取时钟，因此一起开始的项目（例如 carousel 的页面在稳定过程中）可能会因它们之间帧回调的执行时长而错开开始。(#10584)
- 动效：浏览器在繁忙主线程之后才提交的弹簧重定目标，现在会从该帧开始，并从元素在屏幕上的当前位置开始。此前，它会保留调用时的时钟，导致元素跳到新曲线已到达的位置：在 200 ms 阻塞之后的重定目标会在一帧内后退 42 px。同一次回调中发出的动效调用现在共享一个时钟，因此 pager 的子项在重定目标后能对齐。在页面自身的帧或 ResizeObserver 回调内进行的重定目标现在会晚一帧显示其新曲线。(#10607)
- MultiSelector：打开已关闭的列表绝不会高亮被禁用的选项。ArrowDown、Enter、Space 和按压会按列表打开的顺序高亮第一个已启用选项，ArrowUp 高亮最后一个，因此 Enter 不再落到无法切换的选项上。带搜索的列表在按压或 Enter 打开时仍不会高亮任何内容。(#10820)
- Carousel 分页：手指或笔落在轻扫后仍在稳定的行上时，不再触及其下方的项目：没有按压高亮，也没有点击，与 iOS 一致。鼠标点击不变。(#10370)
- Carousel 分页：手指或笔在边缘按钮移动期间落在行上时，现在会在触摸处将其停下，与 iOS 一致，而不是让它继续运行约 85 ms。手指下方的项目仍会接受点按。鼠标不变。(#10545)
- 轻扫释放后的页面现在会按主题的 `tempo` 稳定，与其他动效一致：在设置 `hasSnap={useSnapPaging()}` 的 `Carousel` 中，以及 `Lightbox` 画廊中。默认节拍下稳定过程不变。(#8197)
- `Pagination` 的省略号会随文本大小增大，就像其页码按钮现在通过 `Button` 所做的那样。其尺寸现在是最小高度，因此 "…" 保持在自己的框内。默认文本大小下没有任何变化。(#10567)
- 当控件放不下时（例如手机上文本大小较大时），`Pagination` 会换行，而不是让页面向横滚动并将 Next 挤出屏幕。Previous 仍排在最前，Next 仍排在最后。与其他内容同处 flex 行时，Pagination 现在可以收缩到其最宽控件并在默认文本大小下也换行（此前会保持一行）；在此处可通过 `xstyle` 给它 `flexShrink: 0` 以保持一行。(#10552)
- `parseColor` 对 `constructor` 和 `__proto__`（任意大小写）返回 `null`，与任何未知名称一样，而不是返回 truthy 的空 RGBA，以免像图表 `colors.alpha` 这样的组合调用方返回 `rgba(NaN, NaN, NaN, …)`（或全不透明时的 `#NANNANNAN`）而不是原始字符串 (#10468)
- 已关闭的 `Popover`（以及任何 `usePopover` 组合）不再在 DOM 中留下带标签的隐藏 `role="dialog"`。表面保持挂载，但仅在打开时携带 dialog 角色、名称和 `aria-modal`，因此 `[role="dialog"]` 选择器和包含隐藏元素的测试不会找到不在屏幕上的对话框。可访问性树此前已省略隐藏表面。重新打开会恢复它们。(#10487)
- 对话框型 Popover 会在其第一个已启用的 Tab 停留点开始聚焦。它会跳过被禁用的控件，让持有 `tabindex="-1"` 的元素让位给后面的 Tab 停留点，并在所有控件都被禁用时从其带标签的表面开始。此前，范围从所示月份开始的 DateInput 或 DateTimeInput 日历会从被禁用的 Previous month 按钮开始。现在它会从 Next month 开始，或在单月范围中从选中的日期开始，否则从今天开始，否则从第一个已启用的日期开始。被禁用的控件仍可通过 Tab 到达。(#10503)
- 在手指操作下，Popover 的展开会在第一帧就显示其内容。展开从 opacity 0.001 而不是 0 开始：Chromium 会跳过对恰好为 0 的层绘制，因此从 0 开始的展开前几帧会显示没有内容的 popover。0.001 与透明的 8 位像素没有任何差异。(#10757)
- 在 PowerSearch 的手机面板中，日期范围现在在面板内的日历上选择，而不是在其上方打开日历 popover。桌面编辑器 popover 不变。(#10618)
- PowerSearch 的手机面板现在使用标准 RadioList 和 CheckboxList 及其常规间距编辑单选和多选，而不是其自有的 48 px 行；其 Operator 单选按钮将单选按钮放在行首，与所有 RadioList 一样。选项使用共享触摸带，因此其触摸目标比之前更小。End、Home 和 Enter 不再选择选项；方向键和 Space 与任何 RadioList 或 CheckboxList 一样工作。新增“Sheet presentation · realistic config”故事，覆盖每种值类型。桌面编辑器 popover 不变。(#10608)
- `PowerSearch`：筛选 token 的字段和运算符现在来自一条目录消息（`@astryx.powersearch.token.fieldOperator`，英文为 "{field}: {operator}"），其完整文本（还包括其移除按钮和编辑器）通过另一条消息（`@astryx.powersearch.token.labelValue`，"{label} {value}"）将标签和值连接起来。语言区域可以重排各部分并更改标点。`PowerSearchToken` 使用相同的消息。英文 token 的阅读方式与以前相同，只是没有运算符文本的筛选器不再显示尾随冒号。(#10437)
- 按压反馈：不带 `pointerId` 的 `pointerup`（例如测试辅助工具或拖动脚本派发的裸事件）在没有按住按压时不再抛出 `Cannot read properties of null (reading 'live')`。它会像 `pointercancel` 一样被忽略。(#10695)
- 在滚动视图内，可按压元素的高亮现在会在触摸后 150 ms 出现，即使繁忙的页面较晚处理触摸也是如此。此前，等待从页面处理触摸时才开始，因此高亮会因该延迟而迟到。这涵盖滚动视图中的每个可按压元素，以及 SegmentedControl、Switch、Slider 和 `usePressTracker` 控件。(#10260)
- 用 `calc()` 书写的主题时长 token 现在会按浏览器解析的值来计时按压释放。此前，淡出播放 token 值时，释放时钟会回退到 175 ms。(#10069)
- 同一页面上两次加载 Core 的滚动锁定模块现在会共享一个页面滚动锁：关闭先打开的覆盖层不再在另一个覆盖层仍打开时解锁页面。经 swizzle 副本携带的文本选择锁也以同样方式共享，因此副本的释放不再恢复包内仍持有的选择锁。无 API 变更。(#10822)
- useScrollableArea：祖先的内联 `style` 变化只有在其改变轴映射或盒子存在性（`direction`、`writing-mode`、`display`、`visibility`、`content-visibility`）时才会重新测量滚动区域；尺寸变化仍会通过 resize 观察器到达。BottomSheet 会在拖动的每个输入采样上写入其 transform 及其遮罩的自定义属性，每次写入都会在下一帧强制完整测量（其计算样式读取和滚动几何），导致拖动每一帧都发生样式重算和布局。(#10034)
- `useScrollableArea` 的 `getContentProps` 现在会应用调用方的 `xstyle`，而不是将其泄漏到 DOM。(#6314)
  获得焦点期间失去溢出的视口会在失焦后立即移除残留的 `tabindex`，而位于另一文档中的聚焦视口在失去溢出时保持焦点。`ScrollableArea` 的视口还会去掉过时的 `-webkit-overflow-scrolling` 和初始值滚动条声明。

- Selector：当选项在列表打开期间移动或重新加载时，高亮会留在其选项上，而不是指向现在位于其旧位置的任何选项。如果其选项离开，高亮会移到其后下一个仍启用的选项；若其后无剩余项，则移到前一个；若都没有，则不显示高亮。(#10818)
- `Selector` 和 `useCombobox`：打开已关闭的列表时会从选中的选项开始，正如 WAI-ARIA listbox 模式要求，且绝不会从被禁用的选项开始。此前，ArrowDown 和 ArrowUp 即使首个或最后一个选项被禁用也会从其打开，随后按 Enter 会把 "Hard" 改为第一个选项。现在打开时会高亮选中的选项（如果其已启用）。否则 ArrowUp 从最后一个已启用选项打开，ArrowDown、按压、Enter 或 Space 从第一个已启用选项打开；没有已启用选项时不显示高亮。通过按压、Enter 或键入打开的搜索列表仍不显示高亮。`MultiSelector` 不变。(#8868)
- 触发器靠近屏幕底部的 Selector 现在会在屏幕上打开其列表。所选项目覆盖层的钳制未计入层的视口边距，因此在靠近底部边缘时浏览器会把列表翻到视口下方，导致最后的选项无法到达。(#10697)
- 在可搜索的 `Selector` 或 `MultiSelector` 中，键入现在会清除高亮，因此 Enter 绝不会选中你没有高亮的选项。此前，高亮会保持其旧位置，可能指向筛选后列表中的另一个选项或指向空。ArrowDown 随后从第一行开始：`Selector` 中为第一个已启用匹配项，`MultiSelector` 中显示全选或创建行时为该行。(#8871)
- 带 `hasSearch` 的 Selector：必填字段不再将 `aria-required` 放在其触发器（一个不允许该属性的按钮）上。列表打开时由搜索字段携带该属性，关闭的触发器仍通过字段标签宣布“Required”，或者当标签不显示标记时通过其描述宣布。(#10878)
- 当 `SideNav` 没有 `footerIcons` 也没有内置折叠按钮时，不再在 `footer` 下方添加空间。侧边栏此前会在此处渲染一个空页脚行，而粘性底部区域的间隙会在页脚后增加空间。现在只有该行包含折叠按钮或 `footerIcons` 时才会渲染，与抽屉的做法一致。(#10721)
- 导航行会随文本大小增大。共享的导航项样式（`navItemStyles`，供 `SideNavItem` 以及移动抽屉中的 `TopNavItem` 和 mega menu 使用）现在将尺寸作为最小高度而不是固定高度，因此在 200% 以上文本时，行的标签不再与下一行重叠，其末尾内容（例如计数 `Badge`）也保持在行内。折叠的侧栏行保持固定正方形。在默认文本大小下，带描述的 TopNav 抽屉菜单和 mega menu 行现在会适应其文本，而不是与下一行重叠；其他行不变。在这些样式上设置的调用方 `height` 不再使行低于其尺寸；请改为覆盖 `minHeight`。(#10550)
- Carousel 吸附分页：位于行末端半步以内的停靠点属于最后一页，因此轻扫、滚轮或按键绝不会停在距末端一像素处，而从末端后退一步会移动一整步。(#10591)
- Carousel 分页：手指按住期间变窄的行现在会停在行结束的位置，而不是比行末端差出变窄的幅度。(#10425)
- Carousel 分页：当分页按住一行时，分页器会像静止时一样根据行的布局测量其页面和行程。(#10860)
- `Step` 会保留自己的 `aria-current`，优先于调用方传入的值。此前，传给 `Step` 的 `aria-current` 会替换其反映的值，因此不在进行中的步骤可能被标记为 current，而进行中的步骤可能失去 `aria-current="step"`。现在无论调用方传入什么，只有进行中的步骤携带 `aria-current="step"`。无 API 变更。(#10640)
- 用鼠标时，无法滚动 DateInput、TimeInput 或 DateTimeInput 滚轮的按键（如 Tab）不再结束滚轮的按键步进。在繁忙页面中，按方向键后立即按 Tab 可能提交滚轮正要离开的那一行。(#10924)
- Table 的列设置插件会将其活动列保存在 state 中。当表格在 React 丢弃一次渲染之后（例如挂起的过渡）自行重新渲染时，它会显示已提交的列。(#10911)
- `Table`：其三个键盘 Tab 停留点现在绘制主题的焦点环，而不是浏览器默认样式：表格横向滚动后的滚动包装器，以及树插件的行展开器和全部展开切换。主题的 `--focus-outline-*` token 现在能作用到它们。滚动包装器的焦点环位于其盒内，避开带边框 Card 的边框，因此 Card 不再切掉其边缘（Card 的圆角仍会修剪焦点环的直角）；在 `density="compact"` 时，树切换的焦点环位于切换内部，因此行不会裁切它。行展开、分组行和筛选按钮不变。(#8873)
- Table：`panelVariant="muted"` 的行展开面板现在会在其单元格上绘制底纹，因此使用 `animatedLayout` 句柄时，底纹会随面板内容一起滑入。在 iOS Safari 上，面板边缘曾有几帧落后于下方滑动的行；现在它们保持同步。静止时面板外观相同。(#10403)
- Table 的列宽调整手柄现在会从布局后的第一次渲染起宣布该列的渲染宽度，其宣布范围始终包含该宽度，即使布局渲染的列超出其最大或最小宽度。此前，在列首次调整大小之前，其手柄会宣布列的最小宽度，导致屏幕阅读器读错宽度。(#10593)
- 没有最大宽度的列上，Table 的列宽调整手柄现在会宣布一个不低于其值的最大值，因此屏幕阅读器不再读取超过 ARIA 默认最大值 100 的宽度。它使用窗口宽度作为替身最大值，就像无界的 Resizable 区域那样，并以文字宣布其值，例如 "133 pixels"。有 `maxWidth` 的列不变。(#10577)
- Table 插件的 `transformScrollWrapper` className 现在会与包装器自身的类一起到达表格的滚动容器；此前包装器会替换它。(#10702)
- TableTree 的行不再携带 `aria-expanded`，因为该属性只在 treegrid 中对行有效。每行的展开和折叠按钮仍会暴露其展开状态，行仍保留其深度的 `aria-level`。(#10538)
- 经 swizzle 的 `Table` 现在会遵循包内 `useTableRowsVirtualization` 的 `virtualization`，包内 `Table` 也会遵循经 swizzle 副本提供的能力。此前，每个副本只识别自己的能力，因此经 swizzle 的 Table 会渲染每一行，其代码也无法通过类型检查。该能力通过已注册的带版本 key 读取，其类型带有一个运行时永远不会出现的必填 brand 成员，因此只有该 hook 能生成能力。不是该 hook 生成的 `virtualization` 值现在会得到自己的开发警告。无 API 变更。(#10798)
- `TabList` 的标签页（包括 `TabMenu` 标签页）会随文本大小增大。它们的尺寸现在设置最小高度而不是固定高度，因此在 200% 及以上文本时，标签页标签不再被裁切。默认文本大小下没有任何变化。(#10534)
- TextInput、TextArea、NumberInput、DateInput、DateRangeInput、DateTimeInput、TimeInput、Tokenizer、Typeahead、PowerSearch、ChatComposer 和 RichTextEditor：当主指针为粗指针（手机或平板）时，焦点外观会立即显示，没有淡入，因此被点按的字段在键盘升起时只重绘一次。主指针为细指针（例如鼠标）时，点击和 Tab 键仍保留淡入。在“减弱动态效果”下，ChatComposer 的焦点深度也会立即显示，与其他字段的焦点外观一样。(#10611)
- TextInput：清除按钮现在会以空值运行 `changeAction`，并显示乐观的空值和忙碌状态，与键入时一样。清除会经过输入框自身的变更处理器，因此 `onChange` 和 `changeAction` 会收到真正的 change 事件（此前 `onChange` 收到的 event 为 `null`，且 `changeAction` 不运行），`onChange` 先运行，其 `preventDefault()` 会取消该 Action。(#6425)
- 被截断的 Text 或 Heading 会在第一次悬停、点按或聚焦时挂载其工具提示，而不是一渲染就挂载，因此长表格或截断单元格列表在加载时不会挂载已关闭的工具提示层。悬停延迟、点按和聚焦规则都是工具提示自身的：变成滚动的触摸不会打开任何内容，外部点按会将其关闭。无视觉变化。(#10290)
- 主题：主题的 `:active` 覆盖现在遵循触摸按压模型。用鼠标时仍会在 `:active` 上绘制。用手指时只在 Astryx 认为按压有效时绘制，因此主题化控件不再在触摸本身或页面滚动时闪现主题的按压色。(#10420)
- 在 iPhone 的 Safari 中，每个主题（包括品牌主题）的文本都会遵循读者的文本大小（动态字体）。当浏览器通过 `font: -apple-system-body` 暴露该大小时（iPhone 的 Safari 就是如此），主题的字号会随读者在“设置”（显示与文字大小，然后更大字体）中选择的大小缩放，每个字号按其对应的 iOS 文本样式曲线缩放：正文文本像 Body，`heading-1` 像 Title 1，展示文本像 Large Title，并保持每个角色顺序。主题以长度固定的语义尺寸（例如 Butter、Stone 和 Y2K 的 0.75rem 辅助文本）会按其默认读取步骤的曲线缩放。默认大小时每个字号都是主题自身的值；字体族、间距、行高比例和根字号从不改变，文本输入框在 iOS 上保持 16px 下限，不支持该关键字的浏览器看不到变化。没有选项、prop 或文档属性：根 `Theme` 从隐藏元素读取读者的大小。`astryx docs typography/type-scale` 对此有说明。(#10416)
- `Theme` 会将运行时注入的 CSS 保留在文档中，直到最后一个使用该主题的已挂载 `Theme` 卸载。此前，最先注入 CSS 的 `Theme` 拥有共享的 `<style>` 标签，因此卸载它（例如围绕最先挂载对话框的嵌套 `Theme`）会从所有其他仍使用该主题的 `Theme` 中移除组件覆盖和 prose 默认值。以文件形式导入 CSS 的构建主题不受影响。(#10178)
- `TimeInput` 会在有已键入草稿待处理时，于方向键调整后显示步进后的时间，离开字段会保留该步进。此前，按 ArrowUp 或 ArrowDown 之前键入的文本会留在框内，而提交值和屏幕阅读器宣布已前进，失焦会重新解析该过时文本并提交，从而静默撤销步进。(#10179)
- Timestamp 在可聚焦的时间元素上暴露其详细信息弹出层。(#6298)
- Toast：视口是每个 toast 唯一的宣布所有者。当打开的模态承载顶层视口（默认情况）时，它会通过该模态自身的实时区域宣布每个 toast，因此在 Dialog 上方显示的 toast 只宣布一次。在其他情况下则通过共享通道宣布。就地渲染的视口通过 `useAnnounce` 宣布，并在外层 Astryx 模态内投递。toast 卡片不再是视口内的实时区域，包括由模态承载时。(#7871)
- Tokenizer 将 `cancel` 转发给其 `searchSource`，因此较新的搜索、关闭菜单或面板、焦点离开字段或卸载都会取消消费者正在进行的搜索（例如中止其请求）。此前内联字段包装了 source 以筛选选中项并丢弃了 `cancel`，而底部面板呈现从未调用它。(#8777)
- 带 `centerContent` 的 `Toolbar` 在其各条带放不下时会换行（例如手机上文本大小较大时），而不是让中央标题溢出到旁边按钮之上并超出屏幕边缘。末端条带，以及无法在起始条带旁放下的中央条带，会移到下一行。只要两侧条带各自能放入剩余宽度的一半，中央仍像以前一样位于工具栏中部。在窄容器中，中央的 `TabList` 现在会显示所有标签页，行会换行，其标签页只有在宽于工具栏时才会滚动。(#10563)
- 受控 `Tooltip` 保持关闭（`isOpen={false}`）时，不再因键盘聚焦或点击文本字段触发器而打开。它会将该聚焦报告为 `onOpenChange(true)` 但不显示任何内容，因此由调用方决定；这类似于对保持打开的 Tooltip 按 Escape 会报告 `onOpenChange(false)` 而不隐藏。此前焦点仍会打开保持关闭的 Tooltip，且 Escape 无法关闭它。`useTooltip` 在 `isOpen={false}` 下通过 `onShow` 报告同样的聚焦。(#10490)
- 在触摸屏上，在文本字段中键入的按键不再让关闭对话框返回焦点的 Tooltip 或 HoverCard 触发器打开其层；Tab、Escape 和方向键仍算作键盘输入。来自 `@astryxdesign/core/Layer` 的 `useTouchTrigger` 的 `isTouchInteraction()` 在这种情况下也保持为 true。iframe 或画中画窗口中的字段不会被当作文本输入字段，因此其中的键入仍会像以前一样打开工具提示。(#10639)
- 被禁用的 `TopNavItem` 现在在栏和抽屉中都保留其 Tab 停留点。此前它渲染为 `tabIndex={-1}`，因此 Tab 会跳过它，键盘和屏幕阅读器用户无法到达。现在它是一个可聚焦的 `link`，暴露 `aria-disabled="true"`，而点击、Enter 或 Space 仍不会运行 `onClick` 或 `onKeyDown`，不会导航，也不会关闭移动抽屉。无 API 变更。(#9208)
- TopNav 的标题现在可以收缩，因此比整个栏更宽的标题会以省略号结尾，而不是跑出栏并导致页面横向滚动。`TopNavHeading` 会完整保留其 logo，独立链接的行会换行并保留其最长单词；旁边的纯文本行仍保持完整宽度。(#9551)
- `TopNav` 在其区域放不下一行时会换行（例如文本大小较大时），而不是让末尾内容（例如按钮）覆盖导航项。末尾内容会移到第二行。各区域放得下时，栏及其居中内容的外观与以前相同。(#10571)
- 当月份通过方向键或轻扫到达范围末尾，而某个月份箭头持有焦点时，DateInput 的触摸面板会保持键盘焦点。该箭头在那里会隐藏，因此焦点现在会先移到另一个月份箭头，或在两个箭头都隐藏时移到月份和年份按钮。此前焦点会掉到页面上。(#10231)
- Toast：`useToast` 的回退警告及其服务器渲染错误不再提示你将应用包裹在 `<AppShell>` 中。AppShell 不提供层上下文，因此该建议只会让警告继续存在。它们现在只点名 `<LayerProvider>`，可消除该警告。(#10875)
- 使用鼠标或触控板时，日期或时间面板的滚轮不再回转到按键步进正要离开的那一行。按键步进会立即提交其行，然后滚动到那里。在繁忙页面或慢速设备上，滚动可能超过滚轮的静默期都不绘制一帧，或浏览器可能让它中途结束，于是滚轮把这段停顿当作静止：它提交了条带下方的行并回转到那里。现在，在到达步进行之前的静止会完成滚动。人物主动进行的滚动仍会停在停止处。(#10610)

#### 性能

- 用 Escape 关闭 Popover 或 DropdownMenu，或通过选择或按压其触发器关闭 DropdownMenu，现在只重新布局一次，而不是两次。关闭的触发器不再是 CSS 锚点，这些关闭操作过去会在隐藏自身的布局之后移除触发器的锚点名称，导致浏览器再布局一次。我们的隐藏现在会在其布局之前移除名称，除非层的关闭状态需要保持显示以淡出。浏览器自行执行的关闭（例如轻关闭）仍会在其 toggle 事件时移除名称。淡出的层会保留名称直到淡出结束。(#10346)
- Popover、DropdownMenu 及其子菜单、Selector、ComplexSelector、PowerSearch 和 Breadcrumbs 的菜单会在层内部的表面上播放入场，而不是在锚定层上。每当页面有其他帧工作要处理时，Chromium 会在其 150 ms 入场的每一帧重新布局锚定层，每帧两到四次。入场外观相同。`layerAnimations` 不变；其文档现在说明应将其应用到表面。应用到层上时，它仍像以前一样播放。(#10561)
- 当 Tooltip 或其他锚定层播放入场时，对层盒的大多数读取不会写入样式。此前，入场期间的每次读取都会覆盖层的 transform、读取盒子并恢复 transform，导致浏览器在该帧重新计算样式和布局两次（在 Chromium 中测得：每次读取 8 次样式写入、2 次样式重算和 2 次布局）。现在，在入场的中间帧上读取时会通过计算从一次盒读取中取出入场 transform，并得到相同的盒子。显示层的读取和入场待处理期间的任何读取（其盒子尚未携带入场的读取，在 Chromium 中为回退位置的层）、入场的最后几帧、处于非 1 的 CSS `zoom` 下的层，以及以百分比给出的 `translate` 仍会像以前一样使用覆盖。放置、入场动画和键盘限制不变。(#10240)
- 动效：粗指针下静止的 Switch 不保留合成层。其颜色淡入和抬升阴影只在移动时占用层。(#10542)
- 动效：一个回调在同一任务中对元素启动的多个动效会在回调之后的一次样式处理中读取其样式表的 `will-change`。此前，每个元素都会强制进行自己的样式处理：八个行一起滑动的列表会有八次。(#10728)
- 在手指操作下，Popover 会在层内部的表面上播放其展开，而不是在锚定层上。Chromium 会在展开动画开始时重算两次、结束时重算一次，每次重算都会重新布局锚定层两次（包括其背景）。在负载下，这些布局会落在展开过程中。popover 外观相同。(#10717)
- 在吸附分页下，Carousel 的释放会一次性生成稳定过程的关键帧，而不是每个项目一次，并且只在可显示的项目上播放稳定过程。9 个项目时释放的主线程耗时减少约三分之一，30 个项目时减少约三分之二。(#10568)
- useTableRowIndex 每个插件只构建一次其编号列，因此父级重新渲染不再导致显示行号的表格每一行都重新渲染。(#10654)
- 截断的 Text 和 Heading 会从共享 resize 观察器的第一次通知中获取新挂载元素的首次测量，在浏览器自身布局之后，而不是在每次 commit 后强制进行布局。挂载大量截断文本的页面和窗口化表格提交更快；工具提示行为与以前相同。(#10668)

#### 文档

- `Layout/containerCorners.stylex.ts`（随包提供）的源码头现在说明 Card 和 Dialog 设置的 `--container-corner-*` 变量位于 `astryx.css` 中，未文档化，且只由 Table 和 List 读取；此前它说这些变量不属于公共 API。(#10701)
- `useCalendarConstraints` 的 hook 文档，使 `astryx hook useCalendarConstraints` 和 `astryx search` 能返回它，并新增 `useCalendarConstraints — Hotel Booking Range` 示例块：一个预订范围选择器，强制最小/最大日期，禁用周一闭馆，并在选择入住后将会话限制为 7 晚。用 `astryx template useCalendarConstraintsHookUsage <path>` 复制。(#10151)
- `useCalendarNavigation` 的 hook 文档，使 `astryx hook useCalendarNavigation` 和 `astryx search` 能返回它，并新增 `useCalendarNavigation — Month Pager` 示例块：一个逐月日历，带 Previous/Next 控件、本地化的月-年标题，以及使用 `pendingFocus` 的跨月方向键导航。用 `astryx template useCalendarNavigationHookUsage <path>` 复制。(#10154)
- `useLinkify` 的 hook 文档，使 `astryx hook useLinkify` 和 `astryx search` 能返回它，并新增 `useLinkify — Links in a Comment Thread` 示例块：纯文本评论中 URL 和电子邮件成为 Links，自定义 `#123` 问题引用模式展示 patterns 选项，而不含匹配项的评论保持纯文本。(#9969)
- 添加 usePowerSearchConfig 的 hook 文档和一个筛选目录表示例块 (#10660)
- 添加 useTableColumnSettingsState 的 hook 文档和一个列可见性选择器示例块 (#10652)
- HoverCard：SVG `<foreignObject>` 内的触发器在 Chromium 中不能作为 CSS 锚点，因此其卡片会在视口角落打开。文档现在说明这一点并展示修复方法：将触发器渲染在覆盖于 SVG 节点之上的 HTML 层中。(#10908)
- `LayoutPanel` 的 JSDoc 示例将其 Layout 包裹在 `Card` 中，而不是 Astryx 不存在的 `LayoutContainer`。(#10716)
- ChatLayout 的指南说明了回复如何获得单一右边缘：Markdown 正文保持其 680px 度量，而代码块和表格跨满消息列，因此请为回复的 Markdown 传入 `contentWidth="100%"`。Markdown 的默认度量不变。(#6608)
- useClickableContainer 记录了无 Card 外观的可按压表面：在表面上使用该 hook，使用 `usePressFeedback` 配合 `interactionOverlayStyles.backgroundColor` 实现悬停色调和触摸按压，使用视觉隐藏的 `<button>` 或 `<a>` 作为有名称的控件，并使用 `focusOutlineStyles.focusWithin` 实现 ClickableCard 绘制的共享焦点环。ClickableCard 的文档将无外观用法指向它。(#10880)
- Resizable 和 `useResizable` 文档中的 `collapsible`、`collapsedSize`、`isCollapsed` 和 `onCollapseChange` 描述现在说明是什么导致区域折叠——在折叠尺寸以下抬起或按键步进，而不仅仅是拖动——以及什么会报告折叠变化。(#10635)
- Section 的文档展示了如何居中：在 `xstyle` 中将 `marginInlineStart` 和 `marginInlineEnd` 设为 `'auto'`。(#10207)
- SegmentedControl：标签对比度指南说明轨道是半透明的，因此标签对比度取决于控件背后的背景，并要求在控件所处的每个背景（包括自定义页面颜色）上检查标签。(#10882)
- SideNavCollapseButton 的文档现在列出其 `collapsible` prop 接受的每个键：SideNav 获得的完整受控配置，而不仅仅是 `isCollapsed` 和 `onCollapsedChange`。(#10282)
- `Skeleton` 的 `radius` prop 描述不再说 `4` 是 16px。`4` 映射到与 `3` 相同的容器圆角（12px），因此两个值绘制相同的圆角。无行为变化。(#10750)
- Tab 的文档展示了如何给标签页添加帮助文本：通过 ref 在 `Tab` 上锚定 `Tooltip`，使描述落在标签页上，并在 `endContent` 中放置装饰性信息 `Icon`。`endContent` 被记录为非交互：其中的按钮、链接或 `InfoTip` 会把控件嵌套进标签页的按钮中。(#10734)
- Tab 的文档展示了如何让选中指示器在一个条带中延伸到边缘：使用嵌套 `Theme`，它采用应用的颜色模式、扩展应用的主题，并在 `tab-indicator` 目标上设置 `insetInline: '0'`，从而其他 TabList 保留默认指示器。该覆盖在不同版本间尽力而为。(#10814)
- `TableSelectionToolbar` 记录了如何用当前 API 跨服务器分页选择匹配查询的每一行：应用保留“每个匹配行减去排除项”，并将自己的计数和标签传给工具栏。在此模式下，工具栏的 `selectedKeys` 只包含已加载的行。(#10271)
- Tailwind 指南（`astryx docs styling-libraries/tailwind`）新增了一个面向已使用 Tailwind 的应用的配方：保留应用自己的 `@import "tailwindcss"`，将 `@layer` 行放在其上方，并在其后添加 Astryx 样式表。它解释了为什么 `@layer` 行必须在 Tailwind 导入之前：放在其下时，Astryx 的重置样式会优先于每个工具类，而且没有任何提示。Core README 的 Next.js + Tailwind 一节指向它。(#10532)

#### 其他变更

- 内部：删除了 ChatComposerInput 中一条重复代码的源码注释。行为或输出无变化。(#10811)
- 内部：Core 的内部触摸入口重新导出 action-group 跟踪 hook，该 hook 新增了无绘制选项和面向 Lab TabBar 的按压回调。一个 tab-bar 字符串加入 Core 的消息目录。应用无需导入任何新内容。(#9699)
- 内部：未文档化的 `@astryxdesign/core/internal/reorder` 入口还为 Lab 的 `ListInput` 提供 List 的重排会话，用于不是 ListItem 的行：`useListReorderScope` 和 `ListReorderScope`。`List` 通过相同的会话 hook 运行自己行的会话，因此其调用方看不到变化。一个 ListInput 字符串加入 Core 的消息目录。内部入口不属于公共 API 及其兼容性承诺。(#8163)
- 内部：未文档化的 `@astryxdesign/core/internal/reorder` 入口让 Lab 的 `TransferList` 和 `TransferListSelector` 通过 `createReorderable` 对象重排：`adaptReorderable` 使用集合自身的移动运行所有者引擎，所有者的 `start(key)` 仍能定位该集合的列表。现有 `List` 调用方不变。内部入口不属于公共 API 及其兼容性承诺。(#8143)
- 内部：Core 的内部触摸入口重新导出其滚动测试，供 Lab 的 TabBar 使用。应用无需导入任何新内容。(#10791)
- 内部：按实例的警告去重和临时焦点目标在 Core 中各有一个共享所有者。Resizable、Dialog 和 TabList 通过它去重其开发警告，Chat 的 Done 按钮通过它暂存焦点。警告文本和焦点行为不变；应用无需导入任何新内容。(#10655)
- 内部：More 标签页的标签（一个 tab-bar 字符串）加入 Core 的消息目录，供 Lab 的 TabBar 使用。应用无需导入任何新内容。(#10791)
- 内部：Core 的内部手指滚动读取器可以按页面时钟回答过去的时间，供 Lab 的 NavigationStack 滚动边缘使用。应用无需导入任何新内容。(#10540)
- 内部：未文档化的 `@astryxdesign/core/internal/line-clamp` 入口为 Lab 的 `LineClamp` 提供 Core 的可聚焦选择器、共享 mutation observer 及其 flush，以及共享截断工具提示。共享 mutation observer 现在会把到达它的记录传给每个注册，现有调用方会忽略它们，因此行为不变。内部入口不属于公共 API 及其兼容性承诺。(#4259)
- 内部：层的外部按压监视现在可以跟随选定的指针类型，在外部开始的按压开始平移时关闭（任一轴，达到 core 的平移阈值）或浏览器接管时关闭，并判断关闭的 shadow root 内的按压（document 将其视为其宿主）。目前没有组件传入这些选项，因此所有监视都保持今天的行为。不从包入口导出。(#9814)
- 内部：Popover 会从打开到关闭经过层运行时的呈现保持（Layer/presentationHold.ts）完成期间，保持其选定的呈现方式（面板或锚定层、触摸展开或指针入场）。无行为变化。(#8587)
- 内部：一个所有者模块现在会在组件拥有其位置的容器上关闭浏览器的滚动锚定。`useChatStreamScroll` 在跟随末尾时使用它，行为与以前相同，未文档化的 `@astryxdesign/core/internal/scroll-anchoring` 入口将其写入器提供给 Lab。内部入口不属于公共 API 及其兼容性承诺。(#10173)
- 内部：Selector 和 MultiSelector 会通过层运行时的呈现保持（Layer/presentationHold.ts）保持打开时所选的呈现，并让关闭的面板保持挂载直到其焦点交接完成。无行为变化。(#8591)
- 内部：Core 的共享 realm 模块新增了用于包内和经 swizzle 副本共享状态的辅助函数（state、maps、stores、brands 和 sequences）。无 API 或行为变化。(#10817)
- Timer 的 tick 管道、格式阶梯、节拍切换和资源清理经过审计，未发现行为缺陷。两个此前未测试的防护现在已被固定：对遥远的未来 `startTime` 的等待被限制在 32 位 `setTimeout` 上限，未知的 `format` 值会强制转换为 `elapsed`。Default 故事现在会在真实浏览器中断言显示会自行前进。(#6609)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @aashish254
- @AKnassa
- @cixzhang
- @duytbp
- @freddymeta
- @Geervan
- @harjothkhara
- @HelloOjasMutreja
- @humbertovirtudes
- @hurrymaplelad
- @imdreamrunner
- @jiunshinn
- @LetMeSleep8h
- @ManoharPaturi
- @parinith-web
- @potatowagon
- @thecodebasedot
- @utkarshpatwa393-sys
- @Varshavia
- @vittoriobusatta
- @vjeux
- @WeAreResilience

---

# 0.7.11

#### 新功能

- 在手指操作下（粗指针，即任意触摸设备），Popover 从其触发器展开，先宽后高，边缘保持在触发器上，关闭时缩回触发器之中。展开播放主题的 `--duration-medium-min`（在 Storybook 主题中，是接近 iOS 206 ms 展开的那一档）及入场缓动，收缩播放其退出时长与缓动，均在合成器上运行。展开过程中关闭，或收缩过程中打开，会从 popover 当前位置反向。减少动态效果时，它以仅 opacity 的交叉淡入淡出方式进出，时长不超过 200 ms。精细指针（鼠标）保持其入场效果。展开期间落下的点按会被忽略，此时开始的平移不会滚动任何内容。收缩在 layer runtime 的退出副本上播放，Popover 是其第一个使用者。展开在下一个动画帧开始，且在该帧绘制之前，因此打开时的点按不会产生额外布局。(#8187)
- `DropdownMenuSubMenu` 接受 `delay` 和 `hideDelay`（毫秒），与 `Tooltip`、`HoverCard` 和 `TopNavMenu` 具有相同的选项。`delay` 是悬停指针等待弹出层打开的时长（默认 150），`hideDelay` 是指针离开后弹出层保持打开的时长（默认 200）。默认值与当前时序一致，因此不传就无变化。键盘焦点和触摸从不等待。(#10298)
- `Timestamp` 接受 `timezoneID` prop，用于指定其绝对时间格式渲染所在的 IANA 时区，例如 `'UTC'` 或 `'America/Los_Angeles'`。显式指定的时区在服务端和客户端渲染结果一致，因此服务端渲染的绝对时间不再依赖服务器时区，水合时也不会出现不匹配。省略它（或传入 `'local'`）则保留查看者自己的时区；相对格式的可见文本会忽略它（配置的 `tooltipEntries` 行仍遵循它）；未知标识符会在开发环境中警告一次，并回退到查看者的时区。(#9789)

#### 问题修复

- 动画布局的滑动现在使用主题的 `--duration-medium` 而不是 `--duration-medium-min`：在 Neutral 主题中为 300 ms 而不是 225 ms，无主题时为 410 ms 而不是 310 ms。其移动曲线、减少动态效果行为以及对 `linear()` 和 `steps()` 缓动的支持保持不变。(#10261)
- 在减少动态效果下，当采样器暂停淡入淡出时，交叉淡入淡出的移动和其调用的稳定都会等待，因此元素绝不会移动，退出的元素也绝不会消失，而暂停的淡入淡出仍然显示。(#10378)
- `Avatar` 的首字母和默认人物图标在中性底色上以主文本色绘制，在浅色和深色模式下对比度均达到 4.5:1 或更高；此前次级文本色在深色模式下低于 4.5:1。现在首字母在浅色模式下更深、在深色模式下更浅。(#10205)
- Banner：`role="alert"` 现在只位于标题和描述上，而不是整个 banner 上，因此紧急警报只承载其消息（`component:Banner` FR8；WCAG 2.2 4.1.3 Status Messages）。关闭和展开控件、它们的 tooltip、调用方的操作以及支撑内容都在警报之外。随 `role="alert"` 一起传入的 ARIA 属性（例如 `aria-label`）会随之移动。其他角色仍落在 banner 框架上。仅对紧急消息使用 `role="alert"`，其他所有消息请用 `useAnnounce` 播报。无视觉变化：banner 渲染的像素与之前相同。(#6779)
- BottomSheet：触摸释放采用 iOS sheet 的实测值，且朝拖动起点方向回退的释放会被取消。速度超过约 1,000 px/s 的释放视为轻扫：它至少会沿其方向前进到下一个停靠点，因此在最低停靠点处快速短促的一扫会关闭 sheet，而不是弹回。从更高的停靠点开始，若轻扫会越过下一个停靠点则继续前进，因此用力一扫会关闭 sheet，较柔和的一扫则停在下一个停靠点。慢速或中速的触摸抛掷现在移动距离比之前更短，慢速触摸拖动只有超过到关闭位置的一半时才会关闭 sheet。鼠标或画笔拖动不变。(#10234)
- 带标签的 `Button` 在 macOS 14 的 VoiceOver 中（Safari 17 和 WKWebView）重新获得了可访问名称。此前标签位于 `display: contents` 包装器内，该 WebKit 会丢掉其中的名称，因此它被读作无名的“button”。该包装器现在是接管 Button 自身布局的 flex 盒，Button 外观保持不变。(#10256)
- 在手指操作下，`Button` 或 `IconButton` 更容易点中。其触摸目标通过一条不可见的带向 44 px 扩展，扩展到邻居留出的空间为止，而其盒子不变。禁用的按钮，或无法中断的忙碌按钮，没有此带；`ButtonGroup` 中的按钮使用该组的带。输入框的清除按钮现在使用相同的带，替代其固定的 24 px 覆盖层，在 Safari 中点击该带即可清除字段。鼠标操作下无任何变化。对 ListItem、CheckboxInput、RadioListItem、InfoTip 或 SegmentedControl 进行 swizzle 后，不再留下无法解析的触摸带样式导入。(#10216)
- 当服务端与浏览器处于不同日期时（例如 UTC 服务器和已经进入明天的访客），`Calendar` 和 `DateRangeInput` 不再引起水合不匹配。现在仅在完成水合后读取“今天”：服务端渲染的 Calendar 在此之前不显示今天标记，没有 `focusDate` 或值的 Calendar 在此之前保持月网格空白，直到浏览器端确定月份。DateRangeInput 在此之前会在其范围文本中显示年份。(#10226)
- 现在按 Shift 加一格鼠标滚轮只会将 `Carousel` 行滚动一格。此前 Firefox 还会自行滚动该行，因此每格滚轮会移动两次：React 的 wheel 监听器是被动的，Carousel 无法阻止浏览器滚动。带水平增量的滚轮（例如触控板滑动）以及没有可滚动内容的行仍保留浏览器自身的滚动。(#10246)
- 主题中针对 `chat-composer` 目标的 `borderRadius` 和 `padding` 现在也会设置该 composer 的 `--_chat-composer-radius` 和 `--_chat-composer-padding`，因此 composer 主体、其状态条以及同心圆发送和附件按钮的圆角都会遵循主题。使用 `density="compact"` 时，主体保持其紧凑内边距，圆角仍会跟随。此前，派生变量注册表将这两个映射归在 `chat` 下，而没有任何元素渲染该键，因此 `defineTheme({components: {'chat-composer': {base: {borderRadius: '16px', padding: '8px'}}}})` 只在 composer 根节点上输出 `border-radius` 和 `padding`，所有读取这两个变量的内容都保持默认几何尺寸。(#10249)
- `CodeBlock` 的复制按钮现在会提示复制失败。此前被拒绝的剪贴板写入看起来像什么都没发生。现在按钮会在 2 秒内以叉号替代复制图标，就像复制成功会显示对勾一样（将 `code-block-copy` 图标槽映射到其他地方的主题在失败期间仍保留自己的静止字形），并被命名为、提示为及播报为“Failed to copy value to clipboard.”（一个新的本地化键，`@astryx.codeBlock.copyFailed`）。新增的 `onCopyError(error)` prop 会在每次复制失败时接收一次拒绝原因；错误本身绝不显示。(#10272)
- 那些为开发警告读取 `process.env.NODE_ENV` 的 Core 模块现在自行声明该变量，因此这些文件在未安装 `@types/node` 的项目中也能通过类型检查，例如 swizzle 后的 `Breadcrumbs`、`Stepper` 或 `TabList`。打包器仍会在构建时替换该值，因此生产构建照旧移除警告。无 API 变更。(#10252)
- 块边缘的显示或隐藏（例如在 Collapsible、TreeList 以及 Table 通过 `animatedLayout` 句柄进行的行展开中）现在会让被显示元素的子项与旁边的内容在同一帧滑动，并置于元素盒上的静止裁剪层下。绘制自身盒子的元素（例如 Table 的 `panelVariant="muted"` 面板）保留移动裁剪。在 iOS Safari 上，移动裁剪按自己的时钟运行，会与内容分离几帧；现在两者保持同步。滑动的时序和曲线不变。Collapsible 的区域现在将其子项包裹在一个内部元素中；形如 `region > *` 或针对该区域子项的 `:first-child` 选择器需要更新。(#10296)
- `Kbd`：按键徽章会随更大的文本尺寸增长，而不是保持固定高度，因此更大的字形也能留在徽章内。默认文本尺寸下无变化。文档现在列出 `ref`，说明屏幕阅读器如何朗读快捷键，并说明 Kbd 只显示按键而不监听按键。(#10267)
- 在带 `hasDividers` 的 List 中，悬停或按下的行会在其着色层中保持两条分隔线可见，鼠标和手指操作均如此。此前行上方的分隔线会融入着色层，手指操作时两条分隔线都会融入。分隔线保持 `--color-border`；没有任何内容被隐藏。(#10280)
- Overlay、AppShell 和 MobileNav 现在可在没有 `matchMedia` 的 DOM 中工作，例如应用的 jsdom 测试环境。此前 Overlay 在首次渲染时抛出，AppShell 在挂载时抛出（React 19.2 或更高版本），MobileNav 在关闭时抛出。存在 `matchMedia` 的地方无变化。(#10327)
- Carousel 分页：在繁忙页面上，手指按住正在稳定的行现在会将其停下，与空闲页面一致。此前，当页面同时接收到触摸和抬起时，短暂按住会被读作点按，行会继续运行到目标位置。(#10330)
- Carousel 分页：在回退到所离开页面的过程中调整大小的行，现在会交还原生滚动，而不是一直由分页保持。(#10419)
- `presentation="adaptive"` 不再在没有 `matchMedia` 的环境（jsdom 测试）中崩溃。(#10275)
- 当软件键盘弹出时，Selector 在靠近屏幕底部的触发器上方打开的列表现在会向上滑动，最终位于键盘上方且选项可见。此前它会缩成一条细缝或打开在键盘下方。没有键盘时，打开位置不变。(#10169)
- 可搜索的 `Selector` 的关闭触发器现在会在其标签之后说出所选选项，因此屏幕阅读器能播报当前选择（例如“Team, Banana, button, collapsed”）。(#10170)
- BottomSheet：在 iOS Safari 中，焦点从 Tall sheet 的字段移到 web component 内的普通按钮时，现在会随内容一起从失焦位置向下移动，就像焦点移到任何其他不弹出键盘的控件一样。框架，或可容纳页面不可见字段的自定义元素，仍会让内容保持原位。(#10388)
- `StatusDot` 的 `success`、`warning` 和 `error` 点现在绘制其状态图标角色颜色（`--color-icon-<status>`），而不是强烈的状态填充色，因此圆点在页面和卡片表面上保持 3:1 或更高对比度；警告点此前在弱化卡片上的对比度接近 1.8:1。成功和错误点的颜色也会改变：它们采用其状态图标颜色，在默认主题的浅色模式下更深。状态点内的 `icon` 现在以表面颜色绘制。(#10204)
- 在带有鼠标的触摸屏上，手指打开菜单、对话框、抽屉、移动导航或 popover 后，自那以后未移动过的鼠标点击会在层入场期间到达其下方的内容。此前该点击会落在入场的输入保持层上而什么都不做。入场期间手指或画笔的点按仍会被忽略。自页面加载以来未发送任何指针事件的鼠标仍会遇到该保持层。(#10303)
- BottomSheet：在 iOS Safari 中（它不发布键盘滑动），当屏幕键盘关闭时，Tall sheet 的内容会随 UIKit 的键盘弹簧一起下降，而不是在键盘消失后跳回之前的滚动位置。在键盘落下前再次获得焦点的字段会向上回移，而焦点移到 select（其选择器取代键盘）不会触发回移。在 Android 的 Chrome 中，延迟读取键盘隐藏的繁忙页面不再在稳定前将内容移回上方。(#9776)
- 在 `Dialog` 上方显示的 toast 现在当 Dialog 在点击之外关闭时（例如在等待的保存完成后关闭），不再闪烁消失一帧或更久。Dialog 关闭期间 toast 保持显示。通过点击、Escape 键或背景关闭的情况此前已经保持显示。(#10251)
- DateInput：在手指操作下，底部面板滚轮转向被点按的行、某个键所在的行，或由外部设置的值时，现在会从静止播放共享的稳定弹簧，而不是固定的 300 ms ease-in-ease-out。滚轮的主要交互是手势，因此其所有动效都使用弹簧；轻扫的滑行和慢速释放的吸附保持原样。(#9924)

#### 性能

- 关闭 Popover、菜单或其他锚定层不再对页面进行额外布局。层运行时仅在层的关闭状态声明了离散的 `display` 过渡或关键帧动画时，才读取正在关闭层的动画。它在层仍处于关闭状态时读取该样式。这样的层（例如 TopNavMegaMenu 的面板）仍会保持其触发器的锚点名，直到淡出结束。脚本启动的动画不会被跟踪。(#10368)

#### 文档

- FormLayout 说明应将其包裹在原生 `<form>` 中，并且该 `<form>` 没有 Astryx 替代品。(#10349)
- `LayerProvider`：编辑器生成的文档现在显示其描述和示例；此前它们被附加到一个内部常量上。文档不再说嵌套 provider 会被忽略：嵌套 provider 保留外层 toast 配置，并且不挂载第二个 toast 视口；声明了 `inset` 的嵌套 provider 会将其声明的边缘应用到其子树中的锚定层。(#10283)
- Layout 的 `height` prop 说明 `fill` 需要具有固定高度的容器，例如 AppShell 的内容区域。(#10348)

#### 其他变更

- 内部：`Carousel` 中的一条源码注释现在说明，除非轻扫保持住行，否则 wheel 监听器不读取样式或布局。应用无变化。(#10281)
- 内部：输入保持中用于鼠标打开操作的常量现在按其保持的半侧命名，其注释已删除。应用无变化。(#10317)
- 内部：Core 的键盘模块现在使用按压反馈为其点按路径所用的按压容差，而不是自己复制的一份相同的 10 px，并删除了三条仅复述名称的源码注释。应用无变化。(#10389)
- 内部：Core 的键盘模块会将被聚焦字段保持在屏幕键盘上方，由距离最近的滚动容器将其带入视野：滚动内容中的字段由其最近的滚动容器（包括文档）滚动到视野中；位于固定在视口底部容器中的字段会将该容器向上移动键盘仍覆盖的部分，除非该容器设置了自己的 `translate`、应用正在自行移动它，或它高于键盘上方的空间（此时其滚动容器会显示该字段；若没有滚动容器，则只移动字段所需距离），并且焦点移动和首次点击进入这些字段时不会触发浏览器的显示。位于应用自行定位的固定容器中的字段（填满视口的对话框或 sheet、悬浮在底部边缘上方的栏，或自身带 `translate` 的栏）由该处周围的滚动容器显示；若没有，则保留浏览器自身的显示。Core 的字段接下来会采用它；应用无需导入任何新内容。(#9776)
- 内部：layer runtime 为会对 popover 做退出动画的触摸呈现新增一个退出副本：关闭中 popover 的静态惰性副本，仅在 popover 原来绘制的顶层中显示，供关闭动画播放。Core 的其他惰性副本现在不参与表单、不携带锚点名并保持其配色方案，正如其文档所述。(#8186)
- 内部：`Dialog`、`Drawer` 和 `BottomSheet` 在关闭或卸载时通过回调 ref 将 toast 视口归还给页面，替代了布局清理。模态框关闭期间 toast 仍保持显示。应用无变化。(#10351)
- 内部：Popover 触摸呈现和瞬态副本中的源码注释现在与代码行为一致：在输入保持之前开始的触摸可以关闭 popover，`measure` 在帧写入之前读取。应用无变化。(#10300)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @josephfarina
- @nbozidarevic
- @utsavo-afk
- @vjeux

---

# 0.7.10

#### 新功能

- Carousel 的 `hasSnap` 也接受来自 `@astryxdesign/core/SnapPaging` 的 `useSnapPaging()`：在原生吸附的停靠点上实现 iOS 分页，支持手指和触控板滑动。轻扫会移动一个视图，使用 `useSnapPaging({pages: 'item'})` 时移动一个项目。鼠标滚轮保持原生吸附。只有传入该 hook 返回值的 carousel 才会加载分页器，仅使用 `hasSnap` 的情况不变。(#8153)
- Lightbox：现在可以通过 ctrl+滚轮或触控板捏合缩放照片，触控板滚动可平移已缩放的照片。(#8148)
- Lightbox 的缩放在手指操作下的行为现在与 iOS 照片查看器一致，适用于手机、平板或触摸屏笔记本电脑。捏合照片可围绕手指缩放，移动手指可在缩放时平移。超过缩放限制时照片会让位，然后在你松手时以手指的速度弹回。双击会缩放直到照片填满屏幕（至少 2×），并让点按位置保持在手指下方；再次双击返回。在手机或平板上，已缩放的照片会带惯性平移，越过边缘拉伸后再稳定回来。键盘保持其原有缩放（围绕中心 2×），键盘平移现在会停在照片边缘，而不是将其移出视野。每次缩放，包括双击和按键的缩放，都会落在同一个弹簧上。(#8148)
  照片的舞台填满查看器。在照片上捏合不再缩放页面，而在控件或标题上捏合仍会缩放页面。启用 `hasZoom` 时，在照片旁边深色区域点按会在双击等待之后关闭查看器，而不是立即关闭；单击仍会立即关闭。缩放动画在合成器上运行，因此页面繁忙时仍保持流畅。关闭 `hasZoom` 时无任何变化。启用 `hasZoom` 时，Close、Previous、Next 和计数器位于深色半透明衬底上，因此在放大照片上仍可读。

- `createDragToSnapPoints` 及其 hook `useDragToSnapPoints` 允许拖动使元素沿一个轴移动，并在释放时将其稳定到吸附点（相对其静止位置的 px 偏移）：最近的吸附点、速度超过 `flickThreshold`（默认 1008 px/s）的轻扫后其方向上接下来的吸附点，或释放时回退到其起始吸附点。稳定过程延续释放速度，`settleTo(index)` 可在不拖动的情况下稳定，`onSettle(index)` 会报告其落点。`createDragToSnapPoints` 从包根导出，`useDragToSnapPoints` 从 `@astryxdesign/core/hooks` 导出；CLI 模板为两者各新增一个扑克牌示例。(#8658)

#### 问题修复

- 动画布局：滑动、原地交换和边缘显示现在在 `--duration-medium-min` 上播放主题的移动曲线（`--ease-move`），而不是弹簧，因此会遵循主题的 `character` 和 `tempo`，并与周围的动效一起落定。减少动态效果不变：粗指针下交叉淡入淡出，其他情况立即变化。AppShell 内容区域、Collapsible、Table 行展开和 TreeList 的滑动手感会变化：在 Neutral 主题中为 225 ms，无主题为 310 ms，而不是约 735 ms。移动缓动为 `linear()` 或 `steps()` 函数的主题会按浏览器播放的方式滑动。分段控件的选择以同样方式读取时序，现在也会播放此类缓动，而不是立即移动。(#10236)
- 同一页面上的两个 `AppShell` 不再共享主区域的 id。第一个挂载的 shell 保留 `id="astryx-app-shell-main"`，因此单 shell 页面、跳转链接和引用该 id 的选择器继续有效。其他每个 shell 的主区域会获得自己生成的 id，其跳转链接指向该 id。(#10199)
- BottomSheet：被触摸拖动关闭的 sheet 会在其关闭弹簧上离开，起始速度为拖动速度，其遮罩与它同步淡出，按主题的节拍。BottomSheetSwitcher 流程的遮罩也是如此。鼠标或画笔拖动不变。(#8105)
- 无论是自行打开还是叠在另一个 sheet 上打开，`BottomSheet` 现在在所有浏览器中都会聚焦其 `data-autofocus` 字段（带有 `hasAutoFocus` 的 `TextInput`）。例如，被推入的“编辑配送备注”sheet 会在其备注字段上打开。带有此类字段的 `BottomSheetSwitcher` 步骤也会在其上打开。此前 Chromium 会将焦点留在 sheet 面板上，因此在 Android 上用户必须先点击字段才能输入。没有此类字段的 sheet 仍按浏览器自身的对话框聚焦逻辑放置焦点。(#10156)
- 在手指或画笔操作下，按住 CheckboxInput 的方框、CheckboxList 行、RadioList 选项或 Switch 不再选中旁边的文本，抬起时会像点按一样激活控件。在 iOS 上，这样的按住会选中标签文本，且除 Switch 外不会切换任何内容。打开 ContextMenu 或执行行自身长按的长按不再同时切换其下方的复选框，而从 contextmenu 打开自身菜单的行会保持复选框不变。按住标签仍会选中其文本，鼠标操作不变。(#10091)
- 在仅提供 `onFocusDateChange` 而没有 `focusDate` 时，`Calendar` 和 `useCalendarNavigation` 继续移动可见月份。只有两个 prop 同时存在时焦点日期才是受控的，正如命令式 `navigateTo` 句柄一直处理的那样；但 Previous/Next 按钮和键盘跨月仅凭回调就切换，因此仅有监听器的日历会报告新月份然后仍停留在旧月份，无法移动。回调在所有模式下仍会触发。(#10180)
- 通过 `ChatComposerInput` 的句柄插入 token（`insertToken`）现在会像输入一样通过 `onChange` 报告一次新值，并隐藏占位符。此前，受控宿主的 Send 按钮会保持禁用或发送过期的提示。`ai-chat-landing` 页面模板删除了它过去用于在插入后同步 composer 的 input 事件变通方案。(#10167)
- Code：`code` 主题目标现在将 `size` 反映为 `data-size`，因此主题可以针对继承周围文本尺寸的代码（`size="inherit"`）与默认代码尺寸的代码进行不同样式设置。省略 `size` 时不渲染 `data-size` 属性。(#10186)
- `CodeBlock` 和 `Carousel`：代码视口（代码溢出时）和 carousel 滚动器现在绘制主题的焦点环，而不是浏览器默认样式，主题的 `--focus-outline-*` token 也能作用到它们。两个焦点环都位于各自组件的裁剪盒内，因此完整显示。Carousel 的焦点环由 carousel 自身而不是滚动器绘制，因此滚动器的边缘渐隐遮罩不再使其淡出，无论静止还是滚动中。Carousel 的焦点环由一个内部共享覆盖层绘制。(#8875)
- DateInput、TimeInput、DateTimeInput：`value` 现在接受显式的 `undefined`。在启用 `exactOptionalPropertyTypes` 的项目中，当 `state` 保存 `onChange` 给出的值时，`value={state}` 无法通过编译，因为 `onChange` 会为清空的字段发送 `undefined`，而可选属性不再接受该值。受控字段在那里不再需要类型断言。(#10129，属于 #8961)
- Dialog：当第一个 `data-autofocus` 请求被隐藏、惰性、`aria-hidden` 或无法获得焦点时，下一个符合条件的请求会获得初始焦点。这也适用于渲染在页面惰性区域内、iframe 中或画中画窗口中的 Dialog（#10105，属于 #4182）
- `FieldLabel` 的 `labelTooltip` 现在是标签后的信息按钮，名称为“About {label}”，因此键盘和屏幕阅读器用户也能访问帮助（WCAG 2.2 2.1.1、4.1.2），点击或按键打开帮助时不会聚焦或切换字段。(#6414)
- 手势：在自身滚动器上的平移会像接收手指滚动一样，在 touch-action 所保留的轴上接收触控板滚动；其中的滚动器仍会先接收滚轮。以 `manageStyle: false` 附加的识别器仅在该识别器中把元素的样式留给调用方。(#10212)
- 触摸手势可在渲染到另一个窗口文档中的组件上工作，例如同源 iframe 或 Document Picture-in-Picture 窗口。此前手势宿主用本窗口的类检查节点和触摸，因此忽略了那个窗口自己的类。手指滚动、层的输入保持、滚动视图内的按压延迟和 iOS 选择锁现在也会读取那个窗口的节点。(#10224)
- 动画布局：在 iOS Safari 上，对滑动中内容的 Astryx 手势会作用于手指下方绘制的内容。这里的手势包括手势识别器、长按，以及 Switch、Slider 和 SegmentedControl 的按压。此前此类触摸会作用于滑动开始时手指下方的元素。没有 Astryx 手势处理的普通点按仍会作用于该元素，直到滑动结束，最多为主题移动时长。(#10239)
- Lightbox：双击现在会围绕点击点缩放 2×，而不是围绕中心，下一次双击返回；键盘保持围绕中心的 2× 缩放。(#8148)
- Link：在 `<Text maxLines>` 内，链接现在会随文本一起截断。在那里其根元素以内联方式布局在文本行中，因此截断可以穿过链接，其键盘焦点环会内缩到每一行中，使截断保留焦点环的上下边缘可见。在其他位置，以及自行设置 `display` 或 `maxLines` 或渲染为按钮的 Link，根元素保持其 `inline-flex` 盒。带块级内容的 Link（例如带图标的 `HStack`）不支持放在截断的 Text 内，因为这会破坏截断；请将该组合放在截断之外。(#6021，在 #6038 中修复)
- MobileNav：抽屉的内容区域现在是一个导航地标（`<nav>`），名称与抽屉的对话框名称相同，因此在手机上按地标导航的人能找到抽屉中的链接，就像在宽屏上找到 SideNav 的链接一样。SideNav 条目和 TopNav 的抽屉内容都位于这一个地标内。(#10130)
- 在粗主指针（触摸屏作为主要输入）下，按钮的触摸按压释放现在在合成器上运行。页面脚本繁忙时它仍会继续淡出，而不是在全强度下冻结并突然消失，并且每帧不绘制任何内容。释放保持主题的退出动效时序。使用其他指针时（包括鼠标旁边触摸屏上的手指），无任何变化。在粗主指针下，按压进行中或淡出期间，Button 会在其自己的 `::before` 上绘制按压并设置 `isolation: isolate`。静止时两者都不添加，因此你通过 `xstyle` 或 `className` 规则设置的 `::before` 只会在按压期间合并到该层中。请改为给子元素设置样式以保持不变。(#9783)
- 在粗指针下，`SegmentedControl` 某一段的触摸目标会通过不可见的点击区域向 44 px 扩展，停在到相邻段的一半处。任何段都不会改变尺寸，鼠标操作下无变化。(#10137)
- SideNav：折叠期间，展开中的轨道副本现在绘制在轨道自身层级（紧邻轨道下方），而不是以 `z-index: 1` 绘制并把轨道提升到 `2`。页面内容与正在离开的轨道堆叠的方式与对导航一致：没有 `z-index` 的定位同级元素不再位于副本下方，而位于导航上方的定位内容也会覆盖副本。动效的时序和曲线不变，减少动态效果下仍为即时。(#10145)
- `Slider` 的值 tooltip 在拖动的每一帧以及手指抬起后的滑行中都会停留在其滑块上。此前它会落后滑块最多 14 px，因为它锚定在一个仅在属主渲染新值时才移动的盒上。现在 tooltip 以相同的 translate 随滑块移动，其锚定盒在拖动结束前保持原位。(#10228)
- `DropdownMenu`、`ContextMenu` 和 `BreadcrumbItem` 的菜单在没有 `header` 或 `footer` 时：在打开的子菜单弹出层中的某一行上按 Tab 或 Shift+Tab 现在会关闭所有打开的层级和该菜单，只调用一次 `onOpenChange(false)`，并让焦点从触发器中移出，与顶层行上的 Tab 行为一致（WAI-ARIA Menu Button）。此前菜单会保持打开。带 `header` 或 `footer` 的菜单或子菜单保持其 Tab 循环。(#8870)
- `useTableSelectionState`、`useTableTreeState`、`useTableColumnSettingsState` 和 `useTableColumnResize` 会按最后提交的值读取其最新值。React 丢弃的渲染（例如挂起的过渡）不再到达其处理程序。“选择所有行”现在会选择屏幕上的行，而不是仍在加载的页面的行。行的展开切换、列切换和键盘调整大小也都从屏幕上的状态开始。(#10176)
- Timestamp：悬停卡片中的每个值现在都有供屏幕阅读器读取的名称（WCAG 2.2 1.3.1）。复制按钮位于其所在行的值内，因此卡片通过描述列表检查，而没有标签的行会由其时区的长名称命名（视觉上隐藏）。(#9041)
- 底部 toast 现在会在底部安全区域 inset 上方保持其 16 px 间隙，而不是贴在 inset 边缘。在粗指针下，它至少留出 34 px 加上该间隙，即使页面报告没有 inset（Safari 仅在 `viewport-fit=cover` 时报告）。(#8047)
- 空的 toast 视口现在没有盒子，因此最后一个 toast 离开后，iOS Safari 的底部工具栏会恢复页面颜色。此前，通过底部边缘滑出的 toast 会在工具栏上留下其颜色，直到页面重新加载。(#8047)
- 对 toast 的触摸现在由首次移动决定。首次移动朝向 toast 边缘时属于轻扫，绝不会滚动页面；任何其他首次移动都会把滚动留给页面。共享手势宿主会做出该声明，因此导入 Toast 现在会引入该宿主：单独约 24 KB gzip（Toast 从约 74 KB 增至 99 KB），在已经加载其他触摸组件的页面上没有额外增加。未导入 Toast 的 LayerProvider 不变。(#8047)
- 朝 toast 边缘的快速轻扫现在无论其高度如何都会将其关闭。此前，轻扫还必须移动 48 px（已足以关闭单行 toast 的距离），因此对于任何高度不超过 120 px 的 toast，轻扫只能弹回；而且其速度按浏览器处理触摸的时间计算，而不是触摸实际发生的时间，在下一帧才传递移动事件的浏览器中，快速轻扫看起来会慢一倍。(#8047)
- `useImageMode` 对以内联方式写的 `region` 只采样一次图像。该 effect 依赖 region 对象的标识，因此文档化的调用形式（每次渲染都使用新的对象字面量）会在每次渲染时重新获取并重新解码图像，而且每个结果又会重新渲染，无休无止。该 effect 现在依赖 region 的四个数字。(#10183)

#### 性能

- 在触摸屏上，将触摸目标向 44 px 扩展的控件（CheckboxInput、RadioList、Switch、List 行、InfoTip、操作组）会在一次共享过程中测量其邻居。此前每次过程都会将页面上的每个元素与交互选择器列表进行匹配。现在该过程会保留该列表，直到元素被添加、删除或移动、列表读取的某个属性发生变化，或控件开始或停止其监视。每次过程仍会读取每个邻居的盒子，因此触摸目标相同。在 Chromium 中以 4× CPU 降速在包含 240 个交互元素的页面上测量，滚动期间的一次过程耗时减少了约 70%。(#10242)
- Tooltip 打开时，跟随其触发器滚动的观察器不再读取布局来重新准备。此前它会在滚动的每一帧读取触发器的盒子一到两次以及视口尺寸。现在它从自身的报告中获取这些值。Tooltip 仍会在每次移动时检查一次放置位置，帧与之前相同。(#10235)

#### 文档

- `ButtonGroup` 的文档不再承诺箭头键会跳过被禁用的成员。箭头键仍会在成员之间移动，Home 和 End 仍会跳到两端，该组仍是一个 Tab 停留点。(#10203)
- FieldStatus：指南现在说明字段的状态会在其消息或类型变化时播报，而在重复提交因相同错误失败时不会再次播报，并展示表单如何通过 `useAnnounce` 在错误未变的情况下播报一次此类重复提交（错误数量和第一个错误），并将焦点移到第一个无效字段。(#10122)

#### 其他变更

- 内部：Carousel 的 Shift+wheel 处理程序携带一条 lint 抑制注释，以应对新的被动处理程序规则，直到它迁移到原生监听器。应用无变化。(#10248)
- 内部：Core 的内部触摸入口还为 Lab 的 NavigationStack 命名手势宿主和粗指针检查。其滚动边缘效果读取内部手指滚动 hook 及其结束调用。应用无需导入任何新内容。(#8396)
- 内部：`@astryxdesign/core/internal/touch` 还重新导出了元素的共享动画器、减少动态效果的交叉淡入淡出，以及粗指针触摸点击区域的 hook 和层，供 Lab 的 PageControl 使用。这是 Astryx 自有包专用的内部入口，位于公共 API 之外。(#9669)
- 内部：`useFingerScroll(scroller, {onEnd})` 会在手指在滚动器上的滚动每次结束时调用 `onEnd`，该 hook 从内部 touch 子路径重新导出，供监视手指滚动的 Lab 组件使用。内部入口位于公共 API 及其兼容性承诺之外；该 hook 不从包入口点或手势 barrel 导出。(#10172)
- 内部：一个供 Astryx 自有包使用的内部入口暴露了 Dialog 的标题 id、内联状态和 `syncDefaultName()`（在对话框挂载后才渲染标题的 header 会请求对话框再次查找其名称），以便 Lab 即将推出的 DialogHeroHeader 能像 DialogHeader 那样命名对话框并请求标题焦点。`data-autofocus="dialog-title"` 请求会在每个显式请求之后尝试，为此 header 做准备；使用方看到的任何内容都不会改变（#10105，属于 #4182）
- 两条源码注释（LayerProvider 的 inset 注释和 ToastViewport 的文件头）被拆分为更短的句子。运行中的任何内容都不会改变。(#10244)
- 内部：动效基础的 `resolveSettleMs` 会以主题的节拍给出弹簧角色的稳定时间，因此随弹簧播放的 CSS 部分可以与其一起开始和落定。不从包入口点导出。(#8105)
- 当 Dialog、模态 Drawer 或带遮罩的 sheet 在 toast 上方打开或关闭时，toast 的卡片不再运行隐藏的 `transform` 过渡及其 `transitionrun` 和 `transitionend` 事件。toast 本来就会保持原位。(#10223)
- 内部：UIKit 常量表新增用于照片查看器的 UIScrollView 缩放数据，基于 iOS 26.2 测量。它包含超过缩放限制的让位以及照片的宽高比填充双击和最大缩放。Lightbox 触摸缩放所基于的缩放舞台几何也随之加入。两者都不从包入口点导出，而 Lightbox 的触摸缩放会读取它们。(#8147)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @GuillaumeMMM
- @HelloOjasMutreja
- @jiunshinn
- @ManoharPaturi
- @thecodebasedot
- @vjeux

---

# 0.7.9

#### 新功能

- 在触摸呈现下，ButtonGroup 会像菜单一样跨其按钮跟踪手指或画笔的按压。按住一个按钮并滑过其他按钮：高亮会跟随，抬起时所在的按钮会执行。在组外抬起不会执行任何内容。鼠标按压不变：其行为与原生按钮一致，作用于开始时所在的按钮。使用手指时，每个按钮的目标会向 44 px 扩展，最多到与相邻按钮间隙的一半，而按钮本身不增大。组中的菜单触发器保持自己的打开行为，键盘不变。此前，每个按钮只跟踪自己的按压，滑出后不会执行任何内容。在粗指针下，启用的 ButtonGroup 根元素为 position: relative，因此绝对定位的子元素会锚定到该组。使用精细主指针时，该组不变。
- DateInput、DateTimeInput：底部 sheet 显示日历。使用 `calendar`（例如 `'persian'`、`'hebrew'` 或 `'japanese'`）时，底部 sheet 会以固定高度的窗格显示该日历的月份，包括其月份名称和区域设置的数字，且其关闭的字段会以该日历写入日期。其月份滚轮会列出所选日历年中的月份，包括 Adar I 和 Adar II 等闰月，年份变化时保留月份或移到其对应的普通月份（Adar I 变为 Adar）。年份标签带有纪元，例如 `令和8`，而纪元发生变化的年份会按所示月份的纪元标注，与 iOS 一致：2019 年在 1 月读作 `平成31`，在 7 月读作 `令和元`，月份标题也遵循同一日期，因此 1989 年 1 月 3 日读作 `昭和64年1月`。带 `-u-ca-` 关键字的 provider 区域设置保持公历 sheet；请设置 `calendar` 来选择日历。值仍为公历 ISO 日期。(#9842)
- Core 新增一个用于解析以日历体系输入的日期的内部解析器。它可以读取以任意 `CalendarSystem` 输入、使用任意十进制数字、包含月份和纪元名称、Adar I 等闰月以及 `令和元年` 等日本纪元的日期，并返回公历日期。日历中不存在的日期会被拒绝，绝不做调整。它还会写入已提交的文本和格式提示，并在每种日历各自的区域设置中将其读回为同一日期，覆盖英语和瑞典语，以及星期名称同时也是月份或纪元名称的区域设置。目前还没有组件用它读取输入的文本，也没有公共 API 变更。`Calendar` 的输出不变。
- `useCalendarDays` 和 `useCalendarNavigation` 接受可选的 `calendar`（默认 `gregory`），用于其他日历体系中的自定义月份视图；它们从不读取 provider 的日历。
- DateInput、DateTimeInput：绝不在其无法显示的日历中显示原生日期控件。当 `calendar` 不是 `gregory` 或 `iso8601`（例如 `'persian'` 或 `'hebrew'`）时，`adaptive-native`（默认值）、已弃用的 `nativePicker` 取值以及 `presentation="native"` 会在鼠标下使用日历 popover、在触摸屏上使用底部 sheet，因为原生日期控件只显示公历日期。显式指定 `presentation="native"` 还会在开发环境中发出警告。带 `-u-ca-` 关键字的 provider 区域设置保持公历日期和原生控件；请设置 `calendar` 来选择日历。值仍为公历 ISO 日期。没有 `Temporal` 时，`gregory`、`iso8601`、`buddhist`、`roc` 和 `japanese` 之外的日历会像以前一样显示公历日期和原生控件。(#9842)
- DateRangeInput：在日历中显示范围。DateRangeInput 接受 `calendar` prop（例如 `'persian'` 或 `'hebrew'`），默认使用 `InternationalizationProvider` 的日历（带 `-u-ca-` 关键字的 provider 区域设置保持公历日期；请设置 `calendar` 来选择），并以其写入触发器文本和显示 popover 日历。值仍为公历 ISO 日期。没有 `Temporal` 时，`gregory`、`iso8601`、`buddhist`、`roc` 和 `japanese` 之外的日历会显示公历日期。(#9842)
- InternationalizationProvider 接受 `calendar` prop（`CalendarSystem`，从 `@astryxdesign/core/i18n` 导出），例如 `'persian'`、`'hebrew'`、`'islamic-umalqura'` 或 `'buddhist'`，并在 `InternationalizationContext` 上以 `calendar` 暴露解析后的日历。区域设置绝不会选择日历：`fa-IR` 会解析为公历，直到你设置 `calendar="persian"`；带 `-u-ca-` 关键字的 provider 区域设置（例如 `th-TH-u-ca-buddhist`）保持公历日期；请设置 `calendar` 来选择。未知标识符会解析为公历，并在开发环境中警告一次。与公历对齐的日历（`gregory`、`iso8601`、`buddhist`、`roc`、`japanese`）在任何地方都可用；其他日历需要 `Temporal`。上下文保留请求的日历；缺少 `Temporal` 时，解析它的日期组件会显示公历日期，并在开发环境中警告一次。Astryx 日期组件继续显示公历日期，日期值仍为公历 ISO 字符串。
- Calendar 以其他日历体系显示日期。`Calendar` 接受 `calendar` prop（`CalendarSystem`），例如 `'persian'`、`'hebrew'`、`'islamic-umalqura'` 或 `'buddhist'`，否则显示 `InternationalizationProvider` 的日历。带 `-u-ca-` 关键字的 provider 区域设置（例如 `en-u-ca-buddhist`）保持公历日期；请设置 `calendar` 来选择。值不变：`value`、`min`、`max`、`focusDate` 及每个回调仍为公历 ISO 日期。`DateInput`、`DateTimeInput` 和 `DateRangeInput` 以同一日历显示日期。在所选日历中，网格显示该日历的月份，包括 Adar I 和 Adar II 等闰月，以及埃塞俄比亚和科普特日历中第五或第六个月的十三月。其标题、日期名称和播报使用该日历；Previous、Next、PageUp 和 PageDown 移动一个日历月；Shift+PageUp 和 Shift+PageDown 移动一个日历年并保持相同月份。日期数字使用区域设置的数字，周数保持 ISO 8601。与公历对齐的日历（`gregory`、`iso8601`、`buddhist`、`roc`、`japanese`）在任何地方都可用。其他日历需要 `Temporal`；运行时缺少它时（例如 Safari 或 Node.js 24），请在服务端和浏览器中加载类似 `temporal-polyfill/full/global` 的 polyfill，否则这些日历会显示公历日期并在开发环境中警告一次。服务端渲染的应用也需在服务端加载 `Temporal`，因为缺少它的服务器会渲染公历标记。
- 内置日期格式遵循 `InternationalizationProvider` 的日历。使用 `calendar="persian"` 时，Timestamp 的 `date`、`date_long`、`date_weekday` 和 `date_time` 格式、其悬停卡片中的完整日期和可访问名称，以及 PowerSearch 的日期值都会以该日历写入，与 `Calendar` 显示的日历相同。带 `-u-ca-` 关键字的 provider 区域设置保持公历日期；请设置 `calendar` 来选择。`date_time` 保留其时间部分。`time`、相对格式、`system_*` 和 `unix_seconds` 不变；没有 provider 日历时，每个输出都保持不变。来自 `@astryxdesign/core/utils` 的 `formatSharedDate` 和来自 `@astryxdesign/core/PowerSearch/utils` 的 `formatFilterValue` 接受一个可选的末尾 `calendar` 参数，默认值为 `'gregory'`。这些日期中的每一个都会写出 `Calendar` 为同一天显示的月份和日期，带 `'gregory'` 以外 `calendar` 选项的 `plainDateFormat` 也是如此。需要 `Temporal` 的日历在运行时缺少它时会显示公历日期，与日期组件一致。
- DateInput、DateTimeInput：输入其他日历体系中的日期。两者都接受 `calendar` prop，例如 `'persian'`、`'hebrew'`、`'japanese'` 或 `'buddhist'`，否则使用 `InternationalizationProvider` 的日历。带 `-u-ca-` 关键字的 provider 区域设置保持公历日期；请设置 `calendar` 来选择。`value`、`onChange`、`min` 和 `max` 仍为公历 ISO 日期。人们按区域设置在该日历中的书写方式输入日期，可使用任意十进制数字，例如 `۱۴۰۵/۸/۱۱`、`1 Adar 5784` 或 `令和元年5月1日`；已提交文本、popover 日历以及 `date`、`date_long` 和 `date_weekday` 格式使用该日历，`system_date` 保持 ISO 日期。年份是该日历的年份，因此佛历字段会把 `2026` 读作佛历 2026 年：请在佛历和民国历字段上设置 `min` 和 `max`，以捕获误输入的公历年份。日历中不存在的日期（例如平年波斯历中的 30 Esfand）会被指明且绝不调整。没有 `placeholder` 的空聚焦字段会显示一个该字段接受的示例日期，当其日历与 `InternationalizationProvider` 日历不同时，其描述会说明该日历。`gregory`、`iso8601`、`buddhist`、`roc` 和 `japanese` 之外的日历需要 `Temporal`，可以是原生实现或你加载的 polyfill；缺少它时字段会显示公历日期。(#9842)
  公历字段的输入方式也会变化：

- ClickableCard 和 SelectableCard 在手指按压从其中的控件（例如信息按钮、按钮或链接）上开始时，不再显示按下外观。鼠标按压不变。`useClickableContainer` 返回 `onPointerDown`；对于用 `usePressFeedback` 绘制按压外观的容器，展开它会丢弃从嵌套控件开始的触摸按压。鼠标的 `:active` 按压绘制不变。不展开它的容器行为与之前相同。
- Table：行展开切换器通过 `table-row-expand` 组件图标槽解析其字形，状态为 `{expanded}`。没有主题条目时会像以前一样绘制 `chevronRight`。无论该槽解析为什么，切换器在展开时仍会将字形旋转四分之一圈，并在从右到左布局中镜像。主题通过 `defineTheme({componentIcons: {'table-row-expand': …}})` 映射它；`null` 只隐藏字形，切换器仍保留其名称、`aria-expanded` 和切换功能。
- Table：可排序列的排序指示器通过 `table-sort-indicator` 组件图标槽解析其字形，状态为 `{direction}`（`'ascending' | 'descending' | 'none'`）。没有主题条目时会像以前一样绘制 `arrowUp`、`arrowDown` 或 `arrowsUpDown`。主题通过 `defineTheme({componentIcons: {'table-sort-indicator': …}})` 映射它；`null` 只隐藏字形，排序控件仍保留其标签、排序功能和表头的 `aria-sort`。
- Timestamp：悬停卡片的复制按钮通过 `timestamp-copy` 组件图标槽解析其字形，状态为 `{copied}`。没有主题条目时会像以前一样绘制 `copy`，复制时绘制 `check`。主题通过 `defineTheme({componentIcons: {'timestamp-copy': …}})` 映射它；`null` 只隐藏字形，按钮仍保留其名称、tooltip 和复制操作。
- 主题通过槽选择组件自身图标角色使用哪个共享图标，使用 `defineTheme({componentIcons})`。第一个槽是 `code-block-copy`：CodeBlock 的复制按钮传入 `{copied}`，没有主题条目时像以前一样绘制 `copy`，复制时绘制 `check`。槽值可以是共享图标名称、用于隐藏图标的 `null`、部分 `{icon, variant, size}` 请求，或接收该槽状态并返回其中之一的纯函数；请求中省略的字段保留组件自身的值。对于复制按钮，`null` 只隐藏字形。`theme.componentIcons` 会读回静态值。`ComponentIconSlotMap` 和槽值类型从 `@astryxdesign/core/Icon` 导出。`astryx theme build` 会将静态槽值带入构建的主题，并在遇到槽函数时失败，`astryx component` 会列出组件的槽。
- 在手指操作下（粗主指针），可交互 `List` 行的点击目标会在邻居留出空间的地方向 44px 扩展：共享触摸点击区域会测量每一行，并停在到最近相邻行或控件间隙的一半处。行的外观和布局与之前完全相同，鼠标操作不变。在手指下，列表行的 `::after` 就是该不可见层，因此请用子元素装饰行。不再向嵌套控件委托的 `Item` 现在会去掉其可按压容器标记，因此围绕它的可点击卡片又能接收到行内边距区域的鼠标点击。`InfoTip` 的按钮通过同一层接收点按：它仍会在邻居留出空间的地方向 44px 扩展，并等待周围动效结束后再扩展；停止接收点按时会清除。带标签的 `CheckboxInput` 和 `RadioListItem` 选项通过同一 hook 保持其带的 inset，因此控件停止接收点按时 inset 会清除。
- 在所有设备上，手指操作下，打开 DropdownMenu 或 MoreMenu 的手指现在只有在移动 10 px 后才选择行（`spec:AST-094` FR29、FR43），因此出现在静止手指下方的菜单绝不会选中其下方的行，无论手指停留多久。要保留之前的行为（按下持续 300 ms 后该手指抬起即选择），请传入 `presentation="popover"`。鼠标和公共 `useMenuPress` hook 不变。
- 使用鼠标或画笔按住 NumberInput 步进器会重复步进：第一次重复在 0.5 s 后发生，后续更快。字段会将每个重复值显示为其草稿，并在按住通过释放或指针取消结束时调用一次 `onChange`。点击仍会立即步进并提交。
- `createPanGesture(element, {axis?, onPan})` 和 `usePanGesture(ref, {axis?, onPan})` 以值的形式报告元素上的拖动：`onPan` 在拖动开始、变化、释放结束或被取消时接收 `{state, translation, velocity}`，手指、鼠标和画笔都可驱动它。从可选文本上开始的鼠标或画笔拖动会改为选中文本；请为应被拖动的文本设置 `user-select: none`。`axis` 将拖动限制为 `'x'` 或 `'y'`；沿另一轴的拖动不会被报告。`translation` 从拖动开始处计算，因此跟随它的元素不会跳动，`ended` 时的 `velocity` 是释放速度，单位为像素每秒。拖动会在 UIKit 的 10 pt 处声明其触摸，且不影响按压和长按。`destroy()` 会移除所有监听器；该 hook 会为 `ref` 后的元素创建一个平移手势，并在卸载时销毁它。
- `LayoutPanel`、`ResizeHandle` 和 `SideNav` 在其 `resizable` prop 中直接接受 `useResizable` 的输出：`const resizable = useResizable({…}); <LayoutPanel resizable={resizable}>…</LayoutPanel> <ResizeHandle resizable={resizable} />`。该输出的 `props` 仍然有效，`SideNav` 的 `true` 和配置对象不变。给定该输出时，`SideNav` 的轨道会跟随区域：其宽度和折叠状态来自区域，其切换调用区域的 `collapse` 和 `expand`，区域的 `autoSaveId` 会保存宽度。当 `collapsible` 同时设置折叠状态时，区域优先，`SideNav` 会在开发环境中警告。任何其他元素都可以使用该 hook 的 `size`；Resizable 文档展示了一个使用 StyleX 动态样式设置尺寸的示例。
- 在手指操作下，带标签的 CheckboxInput 和每个 RadioList 选项会获得不可见的点击区域。它会向 44 px 扩展，绝不让目标小于控件自身的盒子，并停在到更近邻居间隙的一半处，因此相邻目标绝不重叠。任何尺寸都不会改变。在手指下，RadioListItem 行的 `::after` 就是该点击区域，因此请用子元素装饰行。位于另一个组件行内、标签隐藏的复选框保持该行的目标。使用鼠标或触控板时无任何变化。
- 动效：主题的 `tempo` 现在也会为触摸动效的弹簧计时，而不仅是 CSS 时长。每个弹簧保持其形状，耗时乘以 `tempo`，动画布局的滑动也是如此。手指跟踪和忙碌循环保持实测值。仅有持续时间比例的主题会将其弹簧保持在 tempo 1，即使在带 tempo 的主题内也是如此。弹簧尚不遵循 `character`。动效文档已说明这一点。

#### 问题修复

- 在 `Dialog`（`purpose="info"`）、带遮罩的 `Drawer` 或 `CommandPalette` 内打开菜单或 popover 时，关闭该菜单或 popover 的背景按压现在只会关闭该菜单或 popover。下一次背景按压会关闭对话框，就像第二次按 Escape 一样。修复 #9920。
- BottomSheet：手指向上拉过顶部时，每次拉动都会按 iOS 的橡皮筋效果拉伸 sheet，没有 48 px 上限，除非调用方设置了 sheet 的尺寸或样式（内联块尺寸、任何 `xstyle` 或类名），此时保持原样。sheet 会在屏幕下方保留足够的表面，使页面绝不露出。内容没有剩余可滚动空间时，拉动内容也会拉伸它：适合内容的内容立即拉伸，长列表到达末尾后拉伸。鼠标或画笔保持其当前的拉伸。
- BottomSheet、Tokenizer、PowerSearch：请求关闭某个 sheet 但其属主保持它打开时（Tokenizer 和 PowerSearch 的 sheet 会在丢弃已更改的草稿前询问），滑动不再让 sheet 后面的页面保持未变暗。拖动变薄的遮罩会随 sheet 回到其静止停靠点，因此确认框打开期间和选择 Keep editing 之后页面保持变暗；Discard 仍会以退出动画关闭 sheet。
- BottomSheet：独立 sheet（不是 `BottomSheetSwitcher` 的步骤）在打开时被移除（仅在打开时渲染，或随视图其余部分移除）时，会在关闭本应发送焦点的位置仍位于页面上时把焦点返回该位置：`finalFocusRef`，否则是打开它的控件，或 sheets 下方。一次性移除整叠独立 sheet 时，焦点会返回到第一个 sheet 的 `finalFocusRef` 或打开者。当这些都不在页面上时（例如打开者随 sheet 一起被移除），焦点停留在浏览器放置的位置。用户已经从 sheet 移到页面主体的焦点保持不动。在同一次更新中打开的 sheet 保持焦点，移除仍在的顶层 sheet 下方的被覆盖 sheet 不会移动焦点。
- 内部日历日期解析器能在更多区域设置中读回它写入的文本。它可以读取以数字开头的月份名称，例如拉脱维亚语中 Adar I 的 `1. adars` 和 Rabi' I 的 `1. rabī`，并在没有其他数字可能是日期时仍将 `1. adars` 读作 Adar 的 1 日。它可以读取使用两个分隔符的数字模式，例如印地语佛历格式提示。在日本历和民国历中（纪元在 1900 到 2100 年间变化），没有纪元的年份可能读成错误日期。在这些日历中，原本会省略纪元的格式提示会在保持区域设置字段顺序时显示缩写纪元，例如阿姆哈拉语 `1/1/8 R`。当每种纪元宽度都会移动字段时，较早纪元的日期会添加纪元，例如科隆语 `BROC 1. Jan. 12`，它不再被读作 1923 年的日期。在该范围内只有一个纪元的日历（例如佛历、埃塞俄比亚历或回历）写入的文本与之前相同。无公共 API 变更。
- `useChatNewMessages`（`ChatLayout` 使用）、`useSpeechRecognition` 和 `useChatDictation` 会按最后提交的值读取其回调和其他最新值。React 丢弃的渲染（例如挂起的过渡）不再在下一次 resize 或识别事件时调用其回调，其音频上下文也不再被使用。此类渲染之后，`useChatNewMessages` 也不再在列表跟随底部时标记新消息。
- 已选中、已启用且可编辑的 `CheckboxListItem` 行现在会在其行（承载其 `item` 和 `list-item` 目标的元素）上反映 `data-selected="selected"`，因此主题针对这些目标的 `selected` 规则会为已选中行及其填充上的文本设置样式。
- 在触摸屏上，CheckboxList 行现在无论手指落在哪里都以相同方式响应。在手指下，按行标签会绘制整行，而按方框只绘制方框；在粗主指针下，行现在是唯一的触摸按压表面，因此无论手指落在标签、描述还是方框上，行及其复选框会一起显示按压状态。当主指针为精细指针时（鼠标、触控板或桌面页面上的画笔），方框保持自己的按压和悬停，与之前相同。
- 禁用的 `CheckboxInput` 不再运行调用方的 `onKeyDown`、`onKeyUp`、`onPointerDown`、`onMouseDown` 或任何其他 `on*` prop，但 `onFocus` 和 `onBlur` 除外。此前，禁用的复选框仍可聚焦和点击，因此按键或指针按压仍会到达它们；只有 `onClick` 被阻止。现在禁用的 `CheckboxInput` 除 `onFocus` 和 `onBlur` 外不运行任何调用方处理程序，与禁用的 `Slider`、`TextInput` 和 `TextArea` 一致（`spec:AST-085` FR2）。启用的 `CheckboxInput` 不变。无 API 变更。
- 当 `ResizeHandle` 旁的 `LayoutPanel` 在焦点位于其中时折叠，焦点会移到该手柄，折叠的面板在打开前处于惰性且对辅助技术隐藏，而不是在零宽度面板中保持焦点和 Tab 停留点。这适用于接受 `useResizable` 区域 `resizable` props 的面板（无论是该 hook 自身的还是手工构建的对象），也适用于位于区域尺寸、旁边给出了这些 props 的手柄的面板。从手柄或面板外部开始的折叠会让焦点保持在原位。
- 带状态且使用默认 `attached` 放置方式的 `ComplexSelector` 现在会在其触发器上显示状态图标而不是折叠箭头，与 `Selector` 和 `MultiSelector` 一致，因此字段上的错误不再仅靠颜色表示。
- 布局动效为旧内容保留的瞬态副本（原地交换的旧内容、折叠或展开期间 SideNav 轨道和 AppShell 内容的旧状态）会从中断处继续其内部运行的 CSS 动画和过渡。它不再重新开始每个 CSS 动画（已点亮的按压高亮重新点亮、已播放过的入场再次播放，无论其填充如何），也不会立即显示过渡的结束状态。
- DateInput 和 DateTimeInput 在禁用或忙碌时会保留尚未报告日期的输入文本，不显示错误，并在可编辑后的下一次 Enter 或失焦时提交。新值仍会替换它。`onChange` 已报告日期的输入文本会在字段再次可编辑后让位于字段值，如果字段有焦点则在下一个 Enter 或失焦时。
- DateTimeInput：从未变成点击的按压在字段卸载时不再留下文档点击监听器（#10155）
- 在手机或平板上（粗主指针），当 `Dialog` 或 `Drawer` 仍在入场时落下的点按或拖动不再关闭它、执行其操作、移动焦点或滚动页面：在入场播放完毕前它不会到达任何内容，对话框或抽屉会完成入场并保持打开。对于没有遮罩的 `Drawer`，只有面板上的点按或拖动会被保持，页面保持可交互。入场期间按键和辅助技术保持可用，内容留在可访问性树中，捏合仍会缩放页面，鼠标或触控板仍可点击：如果它是最后使用的指针则立即点击，否则移动后点击。
- 在手机或平板上，DropdownMenu 仍在打开时手指的点按或拖动现在会被忽略，与 iOS 一致：菜单会完成打开、保持打开并保持焦点，点按下方的内容不会响应。打开菜单的手指仍可选择行。按键和辅助技术保持可用。鼠标、触摸屏笔记本电脑上的手指以及 `presentation="popover"` 不变。
- DropdownMenu 的触发器 tooltip 在指针选择后保持关闭，并在键盘焦点返回时重新出现。
- FileInput：忙碌或禁用的放置区域现在会为拖动的文件显示禁止放置光标而不是复制光标，浏览器也不再投递该区域会忽略的放置。
- 聚焦 ghost 或 secondary `Selector` 的清除或状态按钮不再同时给整个触发器绘制焦点环：每个 Tab 停留点只显示一个焦点环。
- 在手指下，祖先元素被缩放时测量的 Switch 或 InfoTip 会保持其未缩放布局的触摸 inset。此前该测量会保留缩放框架的 inset，直到下一次 resize。
- InputGroup：聚焦的输入框现在会保持在旁边未聚焦输入框的上方，因此邻居的边框不再覆盖其焦点环的一部分。
- 已选中的可交互 `Item` 或 `ListItem` 行现在会在其填充上方显示悬停和鼠标按压绘制，高亮的 `Item` 行会显示鼠标按压绘制。此前填充会隐藏两者。高亮行不显示额外的悬停，因为其填充已经是悬停色调。
- Item：`item` 主题目标现在会以 `data-highlighted`、`data-selected` 和 `data-disabled` 反映行的状态，因此主题可以为高亮、选中或禁用的行设置样式。组合 Item 的行会反映其传给 Item 的状态：例如 ListItem 反映 selected 和 disabled，DropdownMenuItem 反映 disabled。文档列出了 `className` 和 `style`，为 `ref` 给出根元素类型，并为 `xstyle` 给出其标准描述。
- 防止 TabMenu 的箭头键导航将焦点移到外层 Tab 条。
- 层的触发器（Tooltip、Popover、HoverCard、DropdownMenu、ContextMenu 以及所有其他 `useLayer` 调用方）现在仅在层显示或其退出动画运行期间携带其 CSS `anchor-name`。关闭的触发器不是锚点，因此在 WebKit 的 Linux 移植版中，包含关闭触发器的元素上的 transform 动画在主线程繁忙时仍会继续运行。淡出的层会保持其触发器的锚点名直到淡出结束。如果你自己将层的 `anchorId` 写为锚点名，请仅在层显示或其退出动画运行期间写入。
- 在 iOS 的 Safari 中，会在软件键盘下运行的锚定层（Popover、菜单、Selector 或 MultiSelector 的面板、Typeahead 的列表）现在保持其顶部并收缩到在键盘上方 10 px 处结束，其内容可滚动，并在键盘落下时恢复；此前键盘会覆盖其下部，那里按钮无法触及。避开键盘的层，或放在其触发器上方的层，不变。
- 宽度为数字 0 的 `LayoutPanel`（例如给定折叠 `useResizable` 区域的 `resizable` props 或 `width={0}`）现在不占空间，也不显示其任何子项。此前其内边距会使它保持约 32px 宽，子项被挤在那条窄带中，每行一个字母。这只是视觉效果：折叠面板的键盘和辅助技术隐藏是另一回事。
- Link：标签现在在静止和悬停时采用链接自身的颜色，因此在悬停时 `primary`、`secondary` 或 `accent` Link 的文本会与其下划线和外部链接图标一起着色。此前只有下划线和图标采用悬停色调。针对 `text` 目标（例如 `text[data-color="accent"]`）的主题覆盖不再到达 Link 标签：请通过 `link` 目标为 Link 标签设置样式。为 `text` 目标颜色设置样式的主题现在也会让任何 `color="inherit"` 的 Text 保持其父级颜色。
- 列表行的触摸按压释放一旦开始，就会在页面运行脚本时继续淡出。`ListItem`、`Item` 和 `TreeList` 行此前会冻结在淡出中，直到主线程空闲，而且淡出的每一帧都会重新绘制该行；现在释放会在合成器上运行，颜色与之前相同。在下一帧之前、于点按自身处理程序中运行的脚本仍会保持该行按压，直到结束。在手指下，行被按压期间及其整个释放期间，按压绘制在行的 `::before` 上，行成为自己的堆叠上下文；静止时这些都不生效，因此行自身的 `::before` 装饰及其子项的堆叠与之前相同。按压期间该层就是行的 `::before`，调用方通过 `xstyle`（Item 在层之后组合）或样式表设置的任何 `::before` 属性都会优先于该层：具有自身尺寸和背景的装饰会跳到行的角落，行在释放结束前不会显示按压填充。应在 `::after` 或子元素上放置需要在按压期间保持的装饰。使用鼠标或触控板时行不变：没有层，也没有新的堆叠上下文。
- `ChatMessageList`、`Tooltip` 和 `HoverCard`：聊天日志以及 `Tooltip` 和 `HoverCard` 包裹纯文本子项所用的 span 会绘制主题的焦点环，而不是浏览器默认样式。主题的 `--focus-outline-*` token 现在能作用到它们。聊天日志的焦点环位于其盒内，因此滚动它的区域不再将其切掉。
- Markdown 的 GFM 自动链接选项（`autolink: 'gfm'`）不再在长文本上慢到数秒。裸邮箱扫描会在长串的每个字符处重新开始，因此其时间随串长的平方增长：一个 100,000 字符的单词耗时超过 10 秒。现在它会从每个 `@` 开始，并在一次遍历中剥去链接末尾的 `)`，因此长串的耗时约与普通解析相同。已链接的邮箱和 URL 不变。
- 当手指或画笔按在 DropdownMenu、MoreMenu 或 ContextMenu 中时，其下方的行现在会采用按压覆盖，其他行不会保持该覆盖，因此可以看到高亮跟随手指（`spec:AST-094` FR27、FR43）。按住的鼠标、键盘和悬停保持悬停覆盖。
- 在手机或平板上（粗主指针），MobileNav 滑入期间的点按或拖动不会到达任何内容；按键和辅助技术保持可用，鼠标或触控板仍可点击：如果它是最后使用的指针则立即点击，否则移动后点击。
- MobileNav：Tab 现在会在打开的导航抽屉内循环。从最后一个控件按 Tab 会移到第一个，从第一个按 Shift+Tab 会移到最后一个，因此键盘用户不再从抽屉内移到浏览器工具栏。该抽屉使用与 Dialog、BottomSheet 和 Lightbox 相同的焦点区域模块。
- Dialog、AlertDialog、CommandPalette、BottomSheet、Lightbox：Tab 现在会在打开的模态 Dialog、AlertDialog、CommandPalette、模态 BottomSheet 或 Lightbox 内循环。从最后一个控件按 Tab 会移到第一个，从第一个按 Shift+Tab 会移到最后一个，因此键盘和屏幕阅读器用户不再从这些模态框内进入浏览器工具栏。它们现在使用与 Drawer 和 Popover 相同的焦点区域模块。模态框嵌套时，最内层处理 Tab。非模态 sheet 和内联对话框不捕获焦点。修复 #8841。
- MultiSelector：在打开的列表中，重复字母现在会移到下一个以该字母开头的选项，因此依次在 Tea、Toast 和 Tofu 上按 `t`、`t`、`t` 会依次走到 Toast、Tofu、Tea，而不是停在 Tea。暂停后输入的单个字母会从高亮选项之后开始搜索，而不是从列表顶部开始，与 Selector 一致。Space 仍会切换高亮选项，因此输入的 Space 不会像在 Selector 中那样扩展前缀。`useMultiCombobox` 也获得相同行为。(#9921)
- 使用手指时，从带 `onClick` 或 `href` 的列表行中的控件、带 `onClick` 或有子项的 TreeList 行，或带 `onRemove` 的可点击或链接 Token 上开始的按压不再让该行或 token 看起来被按下，因为它不会执行该行或 token 的操作。按在行或 token 本身仍会看起来被按下。鼠标按压不变。
- 当 `OverflowList`（或 `useOverflow` 宿主）调整大小时，现在会在同一帧显示新的可见集合。此前 resize 在帧绘制之后渲染，因此会有一帧以新宽度显示旧集合：盒子缩小时项目溢出边缘，或盒子增大时仍保持折叠。现在 resize 会在绘制前的微任务中重新测量，一次 resize 报告的所有列表会一起渲染，而未发生变化的 resize 不渲染任何内容。若新的集合可能改变列表自身高度（出现更高的指示器、多行列表填充不同的行数或测量新的行高，或在 `behavior="observeParent"` 下指示器出现或消失从而改变列表填充父级的方式，或根据项目设置尺寸的列表，例如菜单旁可收缩的 flex 项目），该 resize 仍会像以前一样晚一帧渲染，因为在绘制前渲染会让浏览器报告 ResizeObserver 循环错误。在绘制前折叠列表的 resize 在另一个观察器观察外层元素（Storybook 的预览观察 `<body>`）时，可能让 Chromium 在该帧报告一次“ResizeObserver loop completed with undelivered notifications”；不会丢失通知，错误监视器应忽略此消息。
  测试：观察器报告的 resize 现在会在微任务中应用，仍在绘制之前。调用模拟的 `ResizeObserver` 回调并在之后同步断言的测试应先将调用包裹在 `await act(async () => { … })` 中以等待更新。

- BottomSheet 和 Dialog：在 Safari 和 iOS 上，sheet 或对话框关闭后页面不再跳动。将焦点返回给打开覆盖层的控件会请求浏览器不要滚动。WebKit 会聚焦被点按按钮最近的 focusable 祖先（例如应用的 `tabindex="-1"` 主区域），并将其记录为打开者；焦点返回随后会将页面滚动到该区域的顶部边缘。焦点环仍跟随最后一次输入。
- Pagination：dots 变体现在暴露其本就具备的 APG 单选组语义。此前，dots 是名为“Go to page N”的 `button` `group`，当前页带有 `aria-current="page"`。现在容器是由页码指示器标签命名的 `radiogroup`，每个 dot 是名为“Page N”的 `radio`，当前页带有 `aria-checked`，没有 `aria-current`。键盘行为不变。现在按 dot 会在释放时选择其页面，因此在释放前滑出会撤回按压。
- PowerSearch：在 sheet 呈现中，长于触发器的占位符会保持在一行并以省略号结尾。此前它会延伸到结果计数下方，在窄字段上还会越过字段边框。
- 按压的释放现在按主题的退出动效 token `--duration-exit` 和 `--ease-exit` 淡出，而不是固定的 200 ms，并会按主题的 `tempo` 缩放，使用其自身的曲线。这涵盖所有会淡出的释放：手机或平板上的手指、鼠标、画笔或按键按压，以及桌面上的画笔按压，作用于按钮、卡片、开关、复选框、列表和树行、标签页、菜单项和操作组。使用默认 token 时释放为 175 ms，并在消失前稍长时间保持颜色。更改 `--duration-exit` 或 `--ease-exit` 的主题现在也会改变释放；主题的 `tempo` 仍会通过 `--duration-exit` 影响它。在减少动态效果下，手指的释放仍最多淡出 200 ms。桌面上的鼠标按压不变。
- 在手指下，滚动视图之外的可按压元素（按钮、卡片、链接、列表行或任何其他表面）现在会在手指落下的那一帧高亮，与 UIKit 控件一致，而不是在 150 ms 延迟之后。在滚动视图内它仍会等待该延迟，因此轻扫不会绘制任何内容，而接管按住按压的滚动会取消按压且不淡出。可滚动的页面算作滚动视图，因此在高于屏幕的页面上按压仍会等待；固定栏中的控件或适合屏幕的页面会立即高亮。桌面上的鼠标保持 `:active`。
- 在减少动态效果下，按下的 Button 不再缩小，ClickableCard、SelectableCard 和 Thumbnail 会在所有指针下立即改变其悬停、边框和选择颜色，无论主题的持续时间如何。手指的按压高亮仍会在释放时淡出，200 ms 内结束。
- LayoutContent、LayoutPanel 以及可滚动的 `div` 或 `span` StackItem 会在其滚动时为区域命名。此前滚动区域是无名元素，Chromium 可能让它成为 Tab 停留点，因此屏幕阅读器不会播报任何相关信息。现在它是由调用方标签命名的组，或由翻译后的“Content”命名（可访问性目标：LayoutContent AR3、LayoutPanel AR3 和 Stack AR2）。调用方的角色仅与调用方名称一起保留，Tab 行为保持浏览器默认。
- Selector：键盘输入后，活动选项会在其边缘内绘制标准焦点环，因此用键盘在列表中移动的人可以看到自己的位置。仅靠覆盖填充在浅色模式下与列表框的对比度约为 1.09:1，深色模式下为 1.15:1，低于状态指示器所需的 3:1；使用内置主题时焦点环的对比度为 5.39:1（浅色）和 3.10:1（深色）。焦点环从 `--focus-outline-*` token 获取其宽度、样式和颜色，与其他所有焦点环一样。指针输入后活动选项仅保留填充，与聚焦的 DropdownMenu 行一致。这包括键盘输入后鼠标移到另一个选项上而不点击的情况。
- 禁用的 `SideNavItem` 不再运行调用方的 `onKeyDown`、`onKeyUp`、`onPointerDown`、`onMouseDown` 或任何其他 `on*` prop，但 `onFocus` 和 `onBlur` 除外。此前，在禁用项上按 Enter 或 Space 以外的键仍会到达 `onKeyDown`，每个键都会到达 `onKeyUp`，而绕过 `pointer-events: none` 的指针或鼠标输入（程序化或辅助技术输入）会到达 `onPointerDown` 和 `onMouseDown`。这涵盖普通、链接、折叠叶项和拆分行的形式；折叠父项的弹出触发器不涵盖。现在禁用的 `SideNavItem` 除 `onFocus` 和 `onBlur` 外不运行任何调用方处理程序，与禁用的 `Slider`、`TextInput` 和 `TextArea` 一致（`spec:AST-085` FR2）。启用的 `SideNavItem` 不变。无 API 变更。
- Spinner：旋转圆环现在每 100 圈才唤醒主线程一次，而不是每圈。在 React 应用中，Chromium 会在每圈结束时重新计算样式，单个圆环以 525 ms 一圈计算约每秒七次。圆环的外观和转速不变，减少动态效果下仍会减慢到 3 秒一圈。
- 独立 Spinner 过去会挂载已带有其名称的 `role="status"`，因此屏幕阅读器在它出现时常常什么都不说。现在它是不确定进度指示器（`role="progressbar"`，无 `aria-valuenow`，由其可见字符串标签、`aria-label` 或翻译后的“Loading”命名），在页面加载后出现时通过共享的礼貌通道播报一次，按顺序读取其渲染文本（堆叠行保持分隔），或读取其可访问名称（AST-020 FR15；AST-086 FR2、FR7、FR11–FR12；WCAG 2.2 4.1.3）。BaseTypeahead、Typeahead 和 Tokenizer 保持其搜索 Spinner 有名称，且自身播报搜索时绝不 live，应用代码可用 `aria-hidden` 让组合的 Spinner 静音。应用无需更改（AST-017 FR53）：给定 `progressbar` 以外 `role` 的 Spinner 保持静音，与之前相同。lab 的 EmojiPicker 和 Schedule 现在会隐藏其加载圆环并自行播报一次忙碌开始，Comments 历史对话框会在对话框内播报（AST-086 FR6、FR8、FR14）；它们的加载文字仍可读。每个 Spinner 的指示器都会从 `status` 变为 `progressbar`，因此按角色查询它的测试会变化，包括 Button、CheckboxInput、CheckboxList、CheckIndicator、ChatMessageList、ChatToolCalls、CommandPaletteInput、ComplexSelector、DateInput、DateRangeInput、DateTimeInput、DropdownMenu 的子菜单、FileInput、MultiSelector、Selector、Switch、TextArea、TextInput、Thumbnail 和 TimeInput，以及 lab 的 EmojiPicker、Comments 和 Schedule 中的隐藏圆环。
- 内置主题深色模式的强调色（`--color-accent`）现在是 `#0171E3` 而不是 `#2694FE`，因此在强调填充上的白色文本（例如静止时主 Button 的标签）达到 4.5:1（4.70:1，原为 3.11:1）。悬停和按下的主 Button 也有所改善（约 4.36:1 和 4.03:1，原低于 3:1），但仍低于 4.5:1。浅色模式保持 `#0064E0`。深色模式下使用 `--color-accent` 绘制的其他所有内容也会变暗：强调填充、焦点环和强调图标。MetadataList 的“Show more”、Table 的排序等级和 DateRangeInput 的应用预设现在使用 `--color-text-accent`，因此其文本在深色表面上保持可读。`astryx theme template` 写出的主题模板使用相同的深色强调色，生成的色彩 token 文档也会列出它。要保留之前的外观，主题可以设置 `'--color-accent': ['#0064E0', '#2694FE']`。
- 禁用的 `Tab` 不再运行调用方的 `onPointerDown`、`onMouseDown`、`onKeyDown` 或任何其他 `on*` prop，但 `onFocus` 和 `onBlur` 除外。此前，对禁用标签页的按压或按键仍会到达它们（按钮和链接两种形式均如此）；只有 `onClick` 被阻止。现在禁用的 `Tab` 除 `onFocus` 和 `onBlur` 外不运行任何调用方处理程序，与禁用的 `Slider`、`TextInput` 和 `TextArea` 一致（`spec:AST-085` FR2）。启用的 `Tab` 不变。无 API 变更。
- toast 只播放入场一次。当 `Dialog`、模态 `Drawer` 或带遮罩的底部 sheet 在 toast 显示期间打开或关闭时，视口会移入或移出，而已在屏幕上的 toast 现在会留在原处，不会再次滑入。
- Toast：没有 LayerProvider 时，在回退视口挂载前被关闭的 toast 不再显示，其 `onHide` 会以 `'manual'` 运行一次。
- Tokenizer：在 sheet 呈现中，`endContent` 渲染在字段的行内末端，`renderToken` 渲染字段的 token，与内联字段一致，因此相同的 props 在手机上的 `'adaptive'` 默认值下也有效。它们自己的控件无需打开 sheet 即可操作：end-content 按钮运行其处理程序，自定义 token 的移除控件会立即提交 `onChange` 并将焦点移到触发器。点按 token、占位符或字段的空白区域仍会打开 sheet。此前 sheet 会丢弃这两个 props 并给出开发警告。`renderItem`、`hasClear`（sheet 有自己的 Clear all）、`hasEntriesOnFocus`、`menuWidth`、`tokenOverflowBehavior` 和 `hasAutoFocus` 仍仅适用于内联字段。
- 禁用的 `TopNavItem` 不再运行调用方的 `onPointerDown`、`onMouseDown`、`onKeyDown` 或任何其他 `on*` prop，但 `onFocus` 和 `onBlur` 除外。此前，脚本已将焦点移到禁用项时按下的键，或派发给它的事件，仍会到达它们，默认和抽屉形式均如此；只有 `onClick` 被阻止。现在禁用的 `TopNavItem` 除 `onFocus` 和 `onBlur` 外不运行任何调用方处理程序，与禁用的 `Slider`、`TextInput` 和 `TextArea` 一致（`spec:AST-085` FR2）。启用的 `TopNavItem` 不变。无 API 变更。
- DateInput：在手指下，底部 sheet 选择器各列中视野内的每一行都符合 WCAG AA 对比度；其边缘渐隐更浅。
- Typeahead、Tokenizer：选择结果现在会调用 `onChangeQuery('')`。选择会清空输入但从未报告，因此镜像查询的应用会保留选择前输入的文本。查询已为空时进行的选择不报告任何内容，因为没有变化。(#8929)
- `useMediaQuery` 现在会在所有调用方之间为每个查询共享一个监听器，因此一长串询问同一查询的组件只添加一个监听器，而不是每个组件一个。每个调用方仍读取相同的答案。它还会在 Safari 14 之前监听（该版本只有较旧的监听器对），此前会抛出错误。
- 手势：使滑行继续下降的延迟或合并的触控板滚轮仍会留在轻扫中。当接下来的滚轮增大时，新手势会保留延迟滚轮的行程。鼠标滚轮的格数保持其规则。

#### 性能

- 在手指下，Switch 或 InfoTip 的触摸 inset 过程仅在 transform 缩放控件时才解析其样式。
- LayerProvider 不再承载 toast 视口。从 `@astryxdesign/core/Layer` 导入 `LayerProvider` 且从不导入 Toast 的应用会少加载约 45 KB（46,161 字节）JavaScript（gzip）。Toast 在导入时注册其视口，LayerProvider 随后在应用之后渲染它。不导入 Toast 时，LayerProvider 不渲染空视口。在视口挂载前显示的 toast 会等待，然后显示。在服务端，LayerProvider 不渲染视口；它在水合后挂载。
- 单行 `OverflowList` 在挂载后不再仅为记录它从不显示的项目高度而再次渲染：它不跟踪仅其多行形式（`maxRows` 大于 1）用于渲染的行数和项目高度。所有项目都适合的单行列表现在挂载时只渲染一次；折叠项目的列表仍会为新的可见数量再次渲染。公共 `useOverflow` hook 不变，仍会在每条路径上报告两者。

#### 文档

- 一条 BottomSheet 源码注释在完全打开后受阻力拉伸的说明中，在鼠标旁边加入了画笔。使用方导入或渲染的任何内容都不会改变。
- `astryx hook --list` 将动效 hook 归入一个类别“Motion & gestures”：`useAnimatedLayout`、`useAnimator`、`useEntryAnimation`、`usePanGesture` 和 `usePressFeedback`；`createAnimator` 和 `createPanGesture` 的文档带有相同类别。“Animation”组消失。`useLongPress`、`useMenuPress` 和其他交互 hook 仍归入“Interaction”。
- `useCalendarDays` 的 hook 文档，使 `astryx hook useCalendarDays` 和 `astryx search` 能返回它，并新增一个 `useCalendarDays — Month Grid` 示例块：用该 hook 的 `weeks` 和 `dayNames` 构建的紧凑月份表，前一月和后一月的日期变暗，并带有 Week starts on 控件（星期日或星期一），会重新排列表头和网格。使用 `astryx template useCalendarDaysHookUsage <path>` 复制它。
- `useIcon` 的 hook 文档，使 `astryx hook useIcon` 和 `astryx search` 能返回它，并新增一个 `useIcon — Status Row` 示例块：自定义状态行用 `useIcon` 绘制成功、警告和错误图标，在覆盖这些图标的 Theme 下，同一行会绘制主题的图标。使用 `astryx template useIconHookUsage <path>` 复制它。
- `useLinkComponent` 的 hook 文档，使 `astryx hook useLinkComponent` 和 `astryx search` 能返回它，并新增一个 `useLinkComponent — Article Cards` 示例块：自定义 Article 卡片用该 hook 解析出的组件渲染其标题链接。在连接到客户端路由器的 LinkProvider 内，标题无需页面加载即可导航，`as="a"` 即使在 provider 内也会给出原生锚点，而在 provider 外，标题会回退到上一级 provider 或原生锚点。使用 `astryx template useLinkComponentHookUsage <path>` 复制它。
- `useOverlay` 的 hook 文档，使 `astryx hook useOverlay` 和 `astryx search` 能返回它，并新增一个 `useOverlay — Product Quick View` 示例块：产品 Card 展开该 hook 的 `containerRef` 和 `containerProps`，并在其图像上渲染一次返回的遮罩。悬停卡片或将键盘焦点移入卡片会显示 Quick view 按钮，其前面的图像链接让 Tab 能到达该按钮。使用 `astryx template useOverlayHookUsage <path>` 复制它。
- `useTableSortableState` 的 hook 文档，使 `astryx hook useTableSortableState` 和 `astryx search` 能返回它，并新增一个 `useTableSortableState — Multi-Sort Orders` 示例块：一个没有自有排序代码的订单 Table，点击 Customer 再按住 Shift 点击 Total 会先按客户再按总额排序。使用 `astryx template useTableSortableStateHookUsage <path>` 复制它。
- Internationalization 新增一份简短的“其他日历”指南：在 `InternationalizationProvider` 或 `Calendar` 上选择日历，值仍为公历 ISO 日期，大多数日历需要 `Temporal`（在缺少它的地方加载 `temporal-polyfill/full/global`）。新的 `astryx docs calendars` 命名空间包含细节：支持的日历、在服务端和浏览器中加载 `Temporal`、为什么阴阳历（`chinese`、`dangi`）在不同运行时之间可能相差一天，以及 ISO 8601 周数。该指南和 `Calendar` 的 `calendar` prop 文档说明如何为这些日历获得相同的服务端和浏览器标记：在两端使用来自 `temporal-polyfill/full/shim` 的 `installImplementation()`，因为 `full/global` 导入会保留原生 `Temporal`。
- InfoTip：组件页面、`astryx component InfoTip --showcase` 和 `astryx component InfoTip --blocks` 现在都有可运行的示例——展示指标标签、一行指标定义，以及带权限说明的只读设置。InfoTip 的文档列出了其解剖结构（触发按钮、信息图标、帮助表面），并说明它遵循 toggletip 模式：帮助固定时按钮报告 `aria-expanded="true"`，屏幕阅读器在帮助固定时朗读一次。
- InputGroup：文档不再说 `status` 会绘制组边框，或该组共享一个焦点环。`status` 在其下方显示消息，并以 `data-status` 反映其类型；聚焦的成员保持在相邻成员上方。`isOptional` 命名其显示的“Optional”指示器。
- InputGroupText：文档现在说明何时使用文本附加内容以及它不是什么：短固定文本或装饰性图标，按纯文本读取，不属于输入框可访问名称的一部分。它们记录了 `ref`，为 `xstyle` 给出标准描述，代码示例不再为组及其输入框使用相同标签，此前这会让屏幕阅读器朗读两次名称。
- 一些菜单按压源码和测试中的长注释句子被拆分为更短的句子，DropdownMenu 的 `presentation` 描述不再说“as before”。使用方导入或渲染的任何内容都不会改变。
- `usePanGesture` 页面以两种形式并排打开一个可拖动盒子：该 hook 和 `createPanGesture`，后者接受任意元素，使用相同的 StyleX 样式和 Astryx token。扑克牌作为高级示例随后出现。`createPanGesture` 页面指向该示例，`usePanGesture` 指南警告不要将拖动偏移保存在大型组件的 state 中。

#### 其他变更

- 内部：未文档化的 `@astryxdesign/core/internal/calendar-system` 入口为 Lab 的 Schedule 提供 Core 日期组件所解析的日历，以及像 `Calendar` 那样命名其月份、日期和日期范围的辅助函数。内部入口不属于公共 API 及其兼容性承诺。
  Lab 的 Schedule 遵循该日历。没有 provider 日历时，跨天定时事件的可访问标签现在以公历写入其日期；此前日期遵循区域设置的默认日历，例如 `fa-IR` 下的波斯历。区域设置绝不会选择日历。

- `onChange` 只在日期完整后才会在输入时触发，且每个日期只触发一次，因此像 `12/0` 或 `12/01/202` 这样的部分输入不再报告错误的日期。两位数的年份（例如 `12/01/90`）或没有年份的日期会在 Enter 或失焦时提交，并按区域设置的字段顺序读取。一位或三位数的年份（例如 `1/5/2` 或 `12/01/202`）不是日期：Enter 或失焦会保留它并显示为无效。`parseDateInput` 仍会在 Enter 或失焦时读取字段其他情况下无法读取的文本，以及区域设置字段顺序中没有的日期，例如 `en-US` 中的 `13/5/2026`。
- 输入到 `min`、`max` 或 `dateConstraints` 之外的日期会留在字段中，并显示一个错误，指出允许的范围；如果只有 `dateConstraints` 规则拒绝该日期，则说明该日期不可用，而不是在失焦时还原；即使你设置了 `status`，该错误也会显示。无法读取的文本、不存在的日期和超出范围的日期各自只播报一次自己的消息。

  修复 #8958。

- 内部：Core 的内部 touch 入口还为 Lab 命名屏幕边缘的平移识别器、弹簧求解器、动效解析器、UIKit 的导航表和四个导航弹簧，以及跟随最后输入的焦点辅助函数。Core 的英文目录新增 `@astryx.navigationStack.back`。应用无需导入任何新内容。
- 内部：Core 的内部动效引擎工厂已重命名为 `createMotionEngine`（原为 `createMotionAnimator`），其类型为 `MotionEngine` 和 `MotionEngineOptions`，改动涉及其源码和所有内部调用方。Core 的内部 touch 入口还按名称重新导出 UIKit 手势值、从右到左检查，以及 Lab 组件读取的 touch 呈现 hook 和查询。Lab 的 `useMotionEngine` hook 封装该引擎，Lab 的下拉刷新控件使用它。应用无需导入任何新内容。
- 内部：Core 的内部 touch 入口重新导出 Lab 的 useRefreshControl 所读取的内容。即平移识别器、其 hook 和手势类型，以及动效动画器。还有动效数学、伴随曲线的映射、其拉动的 UIKit 滚动表，以及动效角色解析器。这些都不在公共入口中。应用无需导入任何新内容。
- 内部：每个层共用一次输入保持（`Layer/inputHold`）。当层呈现时，手指或画笔的触摸、按压或点击不会到达任何内容：在模态层周围任何地方如此，在非模态层周围则仅在层自身如此，其页面保持存活。鼠标移动后会通过，若页面最后听到的是鼠标则立即通过（按键和辅助技术仍然有效，捏合仍可缩放页面）。当层关闭时，每次按压和点击都不会到达任何内容，层的内容处于惰性状态。手势宿主通过 `holdsTouch` 询问保持状态如何处理每次触摸，`isInputShield` 让命中测试能越过保持的屏蔽。不从包入口点导出；Dialog 和 Drawer 的入场保持以及 MobileNav 的抽屉使用它。
- 内部：每个弹簧角色，以及导航、分页和选择器动效表，都在其模块加载时自行注册，因此弹簧角色无论在何处播放都按主题的 `tempo` 播放，无需注册调用。不播放任何弹簧的页面不会打包弹簧注册表。只导入单个弹簧行的模块只携带那些行，除非它同时读取整个 `springs` 表或调用 `registerSpringsTable()`。不从包入口点导出。
- 内部：`usePanGesture` 在提交时将 `onPan` 复制到其 ref，而不是在渲染期间、该 hook 首次释放之前。React 丢弃的渲染（如挂起的过渡）不再将下一次拖动交给其 `onPan`。
- 内部：平移手势的起始阈值可以从每次按压的第一个触摸读取，因此鼠标或画笔可以比手指更早开始平移。不从包入口点导出，现有调用方无任何变化。
- SideNav 以及调整大小手柄查找其面板方式的内部清理：一条仅重述下一行的源码注释被删除，一个查找函数取代了两个。无行为变更。
- 内部：Spinner 的转子（旋转弧的关键帧、时序和 timeline-origin 固定）移入一个内部模块，Lab 的不确定 CircularProgress 也使用它。Spinner 不变。
- 内部：一个共享读取器按主题的持续时间和缓动计算动效时序，与计算过渡的解析方式一致。SegmentedControl 的选择滑动现在用它读取时序；其时序不变，包括 `calc()` token。
- 内部：DateInput 和 DateTimeInput 将其键入状态、拒绝状态和提交保存在一个共享 hook 中，而不是两份副本。输入、提交和拒绝消息不变。不从包入口点导出。(#9842)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @aashish254
- @cixzhang
- @duytbp
- @harjothkhara
- @HelloOjasMutreja
- @imdreamrunner
- @korkt-kim
- @MannXo
- @nynexman4464
- @parinith-web
- @vjeux

---

# 0.7.8

#### 实验性 API

- `experimental.presentation` 已从 Tokenizer 移除，连同其 `experimental` prop；请使用稳定的 `presentation` prop，它接受相同的值。`astryx upgrade` 会重写静态用法，并在无法证明可以重写的地方留下 TODO，例如在展开 props 的 Tokenizer 上。

#### 新功能

- 在 Android 上的 Chrome 中，在触摸屏上，当 Chrome 报告时，Tall BottomSheet 会将聚焦的字段放在屏幕键盘正上方，然后跟随 Gboard 滑动的其余部分；在隐藏过程中，sheet 的滚动空间保持，而其内容向下移动，因此在键盘仍在屏幕上时不会有任何跳动。在减少动态效果下，它改为交叉淡化而不是移动。浏览器支持指南已说明这一点。
- Calendar：当七个缩写名称都能放入四个字符时，星期表头显示区域设置的缩写名称，否则保留短名称。英语现在读作 `Sun Mon Tue` 而不是 `Su Mo Tu`；法语读作 `dim. lun. mar.`，西班牙语、瑞典语、挪威语、罗马尼亚语、希腊语、塞尔维亚语、土耳其语、德语和繁体中文也以相同方式切换。葡萄牙语（葡萄牙）、阿拉伯语、希伯来语、波兰语、丹麦语和越南语的缩写名称更长，保留其短名称。Astryx 未提供翻译的区域设置会显示其自己的名称而不是英语：能同样放入时使用缩写名称（印度尼西亚语 `Min Sen Sel`），否则使用窄名称（斯瓦希里语 `S M T`）。DateInput、DateRangeInput 和 DateTimeInput 的 popover 因渲染 Calendar 而随之变化。DateInput 和 DateTimeInput 的触摸底部 sheet 现在在所有区域设置中显示与 Calendar 相同的名称：葡萄牙语（葡萄牙）不再将 `domingo` 等完整单词连在一起，波兰语、丹麦语、越南语、阿拉伯语和希伯来语在那里切换到短名称。
- `CheckboxList` 接受 `isOptional`，与 `RadioList` 和 `CheckboxInput` 一致。它会在组标签后显示可选指示器，因此可选复选框组可以如此表明，包括作为 `defaultOptionality="required"` 的 `FormLayout` 中的例外。在 `defaultOptionality="optional"` 下，指示器保持隐藏，与所有字段一样。复选框组不会从表单默认值取得必填状态：无论是否设置 `isOptional`，其复选框都不会从表单默认值获得 `aria-required`，也不会添加原生 `required`。
- `CheckboxList` 接受 `isRequired`。组标签按与所有输入字段相同的规则显示必填指示器。当没有勾选任何框时，第一个既未禁用也未只读的框会携带原生 `required`，因此浏览器会阻止提交并用其自己的消息将焦点移到该框。一旦勾选任何框，表单即可提交。禁用或只读的组不要求任何内容。请通过 `status` 显示你自己的错误文本。
- CodeBlock 新增 startLineNumber，使代码摘录显示真实的文件行号
- 组件文档可以通过 `deprecated: {replacement, description}` 将组件标记为已弃用：要改用组件的 `name` 以及现代化路线。该组件的 `astryx search` 结果和 `astryx build` kit 条目会以 `deprecated` 携带该字段（其文本输出中为 `deprecated:` 行），docsite 会在组件页头显示 Deprecated 徽章（在任何稳定性徽章旁边），并在页面顶部显示一条通知，指明并链接替代组件，还会在组件索引卡片和站点搜索中将其标记为 Deprecated。`BottomSheetSwitcher` 设置了它，指明 `BottomSheet`；该组件继续正常工作，保持不变。
- CheckboxInput 可以在绘制自己按压效果的第一方替代指示器上关闭其圆角方形按压层。本版本中的指示器不变。
- PowerSearch 通过新的 `presentation` prop 获得触摸表面，取值为 `'popover' | 'bottom-sheet' | 'adaptive'`，由新导出的 `PowerSearchPresentation` 类型化，默认值为 `'adaptive'`。`bottom-sheet` 使整个字段成为一个触发器，显示仅展示用的筛选 token，并将筛选编辑移入一系列堆叠的高模态 sheet：每一步在引导它进入的那一步之上打开，关闭一步会露出其下方的那一步，因此任何 sheet 都没有 Back 操作。Filters sheet 将活动筛选列为可编辑筛选的行，每行带有末尾的移除按钮，位于带有 Add filter 的固定表头下方，以及带有 Clear all 和 Done 的固定页脚上方；没有筛选时，它显示一个居中的 Add filter。该流程编辑筛选列表的草稿：添加、编辑和移除筛选，以及 Clear all 都会更改草稿，Done 通过按顺序对每次编辑调用一次 `onChange` 来应用它，每次传入该编辑后的列表；对已更改草稿的轻扫、遮罩或 Escape 关闭会在丢弃前询问，未更改的草稿直接关闭，而流程打开期间字段变为只读时，Done 会丢弃草稿。Clear all 会请求确认，移除可编辑的筛选，保留只读筛选，并让 Filters 保持打开。Add filter sheet 会列出分组的字段（可从八个字段中搜索），或列出内容搜索，并在行内列出字段 typeahead 的建议，其搜索在点按前保持未聚焦；只有一个不带值运算符的字段会立即添加。值步骤暂存操作符 → 值，并从其页脚、sheet 表面上的编辑器，或在操作符选择旁边的弱化区域中确认。封闭词汇表为全宽行，数字按输入暂存，`string_list` / `entity_list` 值通过 Tokenizer 自己的 sheet 呈现编辑，标题为字段标签。`adaptive` 在紧凑的粗指针屏幕上使用 sheet，否则使用 popover，解析方式与 Selector 相同。sheet 流程按需加载，仅在字段呈现它时加载。新增用于 sheet 字符串的 `@astryx.powersearch.sheet.*` 目录键；无新主题化目标。
  API 变更是增量的：该 prop 是新的且可选，没有移除或收窄任何现有 prop、类型或导出。行为仅在紧凑的粗指针屏幕（手机）上变化，这正是 `'adaptive'` 的用途：在那里，没有 `presentation` 的 PowerSearch 显示触发器和 sheet 流程，筛选在 Done 应用 sheet 的草稿时到达 `onChange`，而 `menuWidth` 和 `tokenOverflowBehavior` 没有呈现表面，并会以点名它们的开发警告提示。使用鼠标或触控板、在非紧凑屏幕上、在服务端渲染和水合期间，无任何变化。传入 `presentation="popover"` 可在所有设备上保持之前的行为。在 patch 版本中发布此默认值是工程负责人的产品决定，并已与兼容性策略负责人达成一致。

- `createAnimator(element)` 及其 hook `useAnimator(ref)` 使用 Astryx 组件所用的动效为一个元素制作动画；该 hook 接收元素的 ref，因此手势 hook 可以共享该元素。`animate` 在状态变化动效上将 `x`、`y`、`scale`、`rotate` 和 `opacity` 弹簧到目标值，`decay` 从释放速度滑行这些值中的任意一个，`set` 跳变，`get` 和 `getVelocity` 读取，`stop` 停止；`animate` 和 `decay` 返回 promise。每次调用都会规划减少动态效果。`createAnimator` 从包根导出，`useAnimator` 从 `@astryxdesign/core/hooks` 导出；CLI 的模板各自新增一个播放卡片的示例。
- Table：让行展开和树插件在本地化的展开和折叠标签中包含行标识。
- Tokenizer 的 `presentation` prop 已稳定，其默认值为 `'adaptive'`。`presentation` 接受 `'popover' | 'bottom-sheet' | 'adaptive'`，由新导出的 `TokenizerPresentation` 类型化。API 变更是增量的：该 prop 是新的且可选，没有移除或收窄任何现有稳定 prop、类型或导出（`TokenizerProps['ref']` 保持其输入类型，组件也接受类型为 `Ref<HTMLInputElement | HTMLButtonElement>` 的 ref）。行为仅在紧凑的粗指针屏幕（手机）上变化，这正是 `'adaptive'` 的用途：在那里，没有 `presentation` 的 Tokenizer 显示一个打开底部 sheet 的触发器，sheet 编辑草稿，因此 `onChange` 只在 Save 时报告一次，`ref` 接收触发器按钮，且 `renderItem`、`renderToken`、`endContent`、`hasClear`、`hasEntriesOnFocus`、`menuWidth`、`tokenOverflowBehavior` 和 `hasAutoFocus` 不渲染，并有一项点名它们的开发警告。使用鼠标或触控板、在非紧凑屏幕上、在服务端渲染和水合期间，无任何变化。传入 `presentation="popover"` 可在所有设备上保持之前的行为。在 patch 版本中发布此默认值是工程负责人的产品决定，并已与兼容性策略负责人达成一致。
- `useTooltip` 返回 `show()` 和 `hide()`。`show()` 打开 tooltip 并保持打开，直到 `hide()`、Escape、外部按压或焦点离开其触发器，其文本只播报一次。`hide()` 关闭它。两者都会触发 `onShow` 和 `onHide`。在受控的 `isOpen` 下，它们只调用这些回调。用它们构建切换式触发器：你自己的按钮在每次按压时调用它们，设置 `aria-expanded` 和 `aria-controls={describedBy}`，并保留自己的可访问名称。
- 在带有触控板或鼠标的触摸设备上（例如带键盘的平板），TimeInput、DateTimeInput 和 DateInput 底部 sheet 中的选择器滚轮现在将触控板的双指滚动视为手指：行跟随手指，抬起后继续滑行，并停在某一行上。鼠标滚轮的一格使滚轮转动一行，与方向键一样，无滑行。此前两者都按各自滚动的距离移动行，因此触控板的动量按浏览器的速率运行，一格会移动多行。Ctrl+滚动仍会缩放页面。
- 在粗主指针下（如手机或平板），TimeInput、DateTimeInput 和 DateInput 底部 sheet 中的选择器滚轮现在像 UIPickerView 一样移动。它们的行保持 28 px 间距并平放，在所有浏览器中都向列边缘渐隐；鼠标下的滚动列仅在浏览器支持滚动驱动动画时倾斜并渐隐其行，其他地方显示普通列表。滚轮静止时和手指拖动时，带区下方的行在基板上以半粗强调色文本显示；滚轮滑行、吸附或转动时不标记任何行。轻扫会按 UIKit 的减速率滑行到 UIKit 投影选择的行上。手指落在移动中的滚轮上会使其停止。点按一行会将它转到带上，而 sheet 打开期间从外部更改的值（例如绑定值限制了时间）会使滚轮转到其行上。越过第一行或最后一行时，拖动会橡皮筋并弹回。与 iOS 一样，值在滚轮停下时提交，且滑行在页面主线程繁忙时继续运行。方向键和点击行仍会立即提交。在减少动态效果下，轻扫仍会滑行，与滚动一样；点按、按键或缓慢释放会交叉淡化到其行。`presentation="popover"` 保留之前的表面；不传值则手指下保留原生滚动列。每个到达带区的行会在浏览器支持的地方以短振动提示，与 Android 一样；iOS Safari 没有振动。在精细主指针下（如桌面上的鼠标），滚轮保持滚动列。

#### 问题修复

- AlertDialog：在触摸呈现下，警报保持打开时抬起某个操作，现在会按主题 tempo 缩放的时钟结束其释放淡化，与样式表的淡化一致，而不是固定 200 ms。
- AlertDialog：在触摸呈现下，其两个操作会像 iOS 跟踪警报操作那样，作为一组为手指和画笔跟踪。落在某个操作上并滑到另一个操作的按压会执行抬起时所处的操作，从两者之外抬起则不执行任何内容。被按压的操作立即高亮，高亮在操作之间跟随手指。第二根手指或窗口失去焦点会结束按压且不执行任何内容。按在标题或消息上的按压不会被跟踪。鼠标按压保持原生按钮的行为，键盘和辅助技术保持每个按钮自身的激活。
- 动效：在动画稳定期间发出的调用，若元素已静止在屏幕上，会像从静止发出的调用一样等待浏览器的第一帧。繁忙的页面不再跳过新动效的开头，即 Switch 返回时最多约 14 px 的跳动。
- BottomSheet：开始关闭时高度发生不到一个像素变化的 sheet 现在会滑出而不是消失。这发生在 Chromium 中，例如通过拖动关闭适合内容的 sheet 时。当退出过渡的最终值在运行中变化时，浏览器会替换该过渡。退出会把被取消的过渡视为其结束，并在 sheet 移动之前关闭对话框。现在它会等待替换后的过渡完成。
- BottomSheet：在 iOS Safari 上，抓取条在 sheet 于停靠点之间移动时保持绘制，而不是消失直到 sheet 静止。
- Calendar：日期数字和周数字现在使用区域设置的数字，与月份标题一致。在 `InternationalizationProvider locale="fa-IR"` 下，日期读作 `۱ ۲ ۳…`，在 `"ar-EG"` 下读作 `١ ٢ ٣…`；英语不变。DateInput 触摸日历的月份窗格遵循相同规则。日期本身不变：每个数字仍是公历日。
- Calendar：Shift+Page Up 和 Shift+Page Down 现在将聚焦的日期移到一年前或一年后的同一天，与 WAI-ARIA 日期选择器模式一致，而不是移动一个月。2 月 29 日会在没有该日的年份落到 2 月 28 日。年份步进遵循与 Page Up 和 Page Down 相同的规则：越过 `min` 或 `max` 时不变，在 `dateConstraints` 禁用的日期上会聚焦该月第一个启用的日期。
  `useGridFocus` 现在将按键事件传给 `onPageUp` 和 `onPageDown`，因此网格可以读取 `event.shiftKey`；不接受参数的回调继续有效。

  修复 #8947。

- `CheckboxInput`、`Switch` 和 `CheckboxList`：在 `defaultOptionality="required"` 的 `FormLayout` 中，未勾选的框、关闭的开关或空复选框组不再携带 `aria-required`。屏幕阅读器过去会说“required”，而在复选框上这意味着“必须勾选”，但表单仍会提交。未勾选或关闭也是一种回答，因此这些控件不从表单默认值取得必填状态。`CheckboxInput` 或 `Switch` 仅通过其自身的 `isRequired` 变为必填，这仍会设置 `aria-required` 和原生 `required`。“Optional”和“Required”标签遵循与其他所有字段相同的规则。无需代码更改（WCAG 4.1.2）。
- 不带秒的 `clampTime` 现在在落在分钟之间的边界内给出最接近的整分钟。此前，`clampTime('08:00', '09:00:30')` 会给出 `09:00`，一个超出范围的时间。
- 通过点击另一个控件关闭 `ComplexSelector` 现在会将焦点留在该控件中，而不是拉回选择器，与 `Selector` 和 `MultiSelector` 已有的行为一致。Escape、从内容关闭或点击无可聚焦元素仍会将焦点返回触发器。调用方渲染的触发器（`renderTrigger`）在每次关闭时仍会重新获得焦点。
- 在 `DateInput` 或 `DateTimeInput` 中输入数字日期时，在日先的区域设置中不会再在输入过程中报告月先的日期。
- 主题 token `--duration-exit`（标准关闭持续时间）现在存在。它默认为 `var(--duration-fast)`，因此通过该 token 遵循主题的 `tempo`，主题可以像任何持续时间 token 一样设置它。此前，读取 `var(--duration-exit)` 的主题或组件找不到值。动效和 token 文档以及主题模板的 token 列表都列出了它。
- 当被认领的鼠标或画笔按压在其上抬起时，操作自身处理程序产生的文本选择现在会保留。此前，拖动的选择保持会将按压的选择恢复覆盖在它上面。当处理程序未更改任何内容时，按压的选择仍会像以前一样回来。
- 在 `focusTrigger="auto"` 下，`HoverCard` 现在会在焦点到达时决定焦点是否打开它，与 `Tooltip` 一致。卡片挂载时 `tabindex="-1"` 的 roving-tabindex 触发器（例如工具栏成员）会在方向键聚焦时打开，而可聚焦的触发器（如 `<summary>` 或 SVG 链接）会在聚焦时打开。
- 触发器是围绕表达式书写的文本（例如 `Edited {when}`）的 `HoverCard` 现在会将那段文本包裹在其可聚焦触发器中，因此悬停和键盘焦点会打开卡片，触发器携带其弹出层属性或描述，并显示与纯文本触发器相同的悬停提示。此前，此类文本根本没有触发器。
- 当 `HoverCard` 的触发器元素在挂载后被替换（由新的子元素或交换自身根元素的子组件替换）时，新元素现在会获得卡片的弹出层属性或描述，并在悬停和聚焦时打开卡片。此前，它会保持未连接，直到卡片下次打开或关闭或其 `label` 变化。
- Icon：一个带标签的图标组件，除非某个 prop 替换它否则隐藏自身（例如 Heroicons 图标），现在会作为带有其 `label` 的图像暴露给辅助技术。此前，组件自身的 `aria-hidden="true"` 留在 SVG 上并隐藏了标签。如果父控件已经为图标命名，请移除 `label`，以免名称被朗读两次。
- `Icon` 的 `ref` 现在会在语义或命名空间名称下到达渲染的 `<svg>`，与其类型承诺一致。此前，只有当 `icon` 是组件时它才到达 `<svg>`；对于名称，ref 保持为空。对于字形没有 `<svg>` 的名称，ref 为 `null`。
- InfoTip 只渲染其按钮及其帮助：按钮周围的 `display: contents` 包装已移除，按钮直接是 tooltip 的触发器，基于 `useTooltip` 的 `show()` 和 `hide()` 构建。悬停和键盘焦点仍会预览帮助，点击、点按、Enter 或 Space 仍会固定它，直到 Escape、再次按压、外部按压或焦点离开。鼠标在预览的帮助上按压时，会在固定期间将其保持在视野中，而结束在按钮之外的按压不会固定它。现在右键点击预览的帮助会立即关闭它，与任何 tooltip 触发器一样。以前通过包装选择器到达按钮的样式现在直接选择按钮。
- BottomSheet 从 core 的共享键盘模块读取屏幕键盘。现在，只要顶层文档有视觉视口且主指针为粗指针（包括 Android 上的 Chrome 和 Firefox），它就会接管焦点移入完全展开的 Tall sheet 的过程，而不仅是在 iOS 用户代理下。捏合缩放不再被读取为键盘，捏合缩放后的页面仍会读取键盘的完整高度。sheet 通过其自身样式布置键盘空间，而不是 CSS 自定义属性。浏览器支持指南记录了 Android 上 Chrome 的 `interactive-widget` 视口设置。
- 在长时间主线程任务后期产生的布局动效（例如慢速设备上的点按）现在会播放而不是被跳过：在减少动态效果下，侧导航轨道在此类阻塞之后根本不显示交叉淡化。布局变更的动画仅当页面最后读取的帧时间距今至多 34 ms 时才从该帧时间开始；否则它们会在变更产生第一个动画的时刻开始，因此阻塞会延迟动效。此类变更重定向的滑行会从合成器所在的位置继续。乘载此类滑行的边缘（如侧导航轨道的边缘）会随之移动。在 Safari 中，在动效中途反转此类边缘的变更会按动效自身时钟读取滑行显示的位置，因此边缘不再落后于内容。这种反转还会从该时刻开始轨道和内容区域的淡化，因此轨道的图标不再闪回。一次变更从其第一个动画到其滑行的冲刷保持一个起点，承载这些滑行的部分也是如此，无论提交其余部分运行多久。在上一次布局动效之后因阻塞而开始的变更会采用新的起点，除非它加入同一区域中滑行尚未开始的较早变更。侧导航在轨道首次绘制之前发生的折叠或展开（其自身切换除外）会立即落位，因此恢复的状态绝不会在加载时播放动画。
- `Lightbox`：在打开时卸载的查看器（仅在打开时渲染，或随其视图移除）现在会在打开它的元素仍在页面上时将焦点返回该元素，而不是丢到页面上。用户按压以移除查看器的控件保持其焦点。
- `useLongPress` 按触摸事件自身的时间戳计时（`spec:AST-094` FR16）。当繁忙页面延迟处理抬起时，按住完整延迟的手指仍会在抬起生效之前报告其长按，而不是丢失它，因此 ContextMenu 的长按在加载繁重的页面上也会打开。页面延迟处理的触摸不再延长按住时间，而时间戳早于截止时间的抬起仍会在其计时器运行较晚时取消按压。`onTouchEnd` 和 `onTouchCancel` 可选地接收触摸事件；展开处理程序会传递它。
- Tooltip 和 HoverCard：在抬起前按住触发器的画笔不再关闭它刚打开的 tooltip 或卡片。
- PowerSearch：仅日期的 `date_absolute` 值（`isDateOnly` 未设置或为 `true`）在一个时区内按一天读取——在 token 上、在可访问标签和播报中，以及在编辑 popover 的日期编辑器中——并且编辑器写入所选的日期。此前，token 显示设备的日期，标签以 `timezoneID` 显示日期和时间，而编辑器读取和写入 UTC 日期却没有接收 `timezoneID`，因此在 UTC 以西，筛选打开时显示的日期比其 token 显示的日期晚一天，重新选择该日期会使值提前一天。现在，仅日期值（`isDateOnly` 未设置或为 true）是 `timezoneID` 中的日历日，否则是 UTC 日：token 显示该日期；可访问标签和 `formatFilterValue` 显示该日期且无时间（洛杉矶 3 月 9 日 UTC 午夜读作“Mar 8, 2024, 4:00 PM”，现在读作“Mar 9, 2024”）；编辑器在其上打开；所选日期存储为该时区的午夜——设置 `timezoneID` 时，这与以前存储的 UTC 午夜是不同时刻，因此从时刻的 UTC 日期推导日期的调用方应改为在 `timezoneID` 中读取它；旧编辑器在 UTC 以西的 `timezoneID` 下存储为 UTC 午夜的值，现在在所有设备的编辑器中读作前一天，而在 UTC 或 UTC 以东的查看者看到的 token 上（`America/Los_Angeles` 下的 UTC 午夜 3 月 9 日在任何地方都读作 3 月 8 日；洛杉矶查看者的 token 和标签此前已如此），读作它本应存储的那一天——请重新保存此类值，或将其作为 UTC 日读取；未设置 `timezoneID` 时，没有存储值改变。每个绝对 `date_range` 部分在范围编辑器中都以相同方式按日历日读取和写入。`isDateOnly: false` 的运算符保留其标签；其 token 和编辑器按其自身条目所述变化。在 sheet 呈现中，行和值步骤读取和写入同一天。导出的 `PowerSearchToken` 和 `components` Token 覆盖会接收 `timezoneID`（`PowerSearchTokenProps` 上新增的可选 prop），并且 `PowerSearchToken` 也显示该日期，而此前显示标签的日期和时间。这是一个 `[fix]`，不是破坏性变更：已发布的 popover 在三个时区中读取同一个值，因此没有任何有效用法依赖日期的存储方式，且 `timezoneID` 已有文档说明用于日期格式化。`components` Editor 覆盖和 `PowerSearchFilterEditor` 会接收 `timezoneID`。
- PowerSearch：`isDateOnly: false` 的 `date_absolute` 运算符会获得选项所指定的一天中的时间。编辑 popover 在日期选择器旁显示时间字段，token 显示日期和时间，并且在设置了 `timezoneID` 时都按 `timezoneID` 读取和写入该时刻，否则按查看者的时区，因此输入的时间就是显示的时间。此前，`isDateOnly` 在任何地方都未被读取：每个 `date_absolute` 都在日期选择器中编辑并存储所选日期的 UTC 午夜。只有设置 `isDateOnly: false` 的运算符会变化：从其编辑器保存的值现在携带输入的时间，而以前携带午夜，其 token 显示该时间；`isDateOnly` 未设置或为 `true` 时不变，存储的值按其本身的时刻读取。
- 在手指下，按压的释放现在会持续到其淡化播放完毕。触摸按压控制器在抬起时启动的时钟上结束释放，因此当页面脚本延迟淡化的第一帧时，释放会在淡化中途被截断。现在它会在按压的释放动画结束时结束（该动画在表面上或组件绘制释放的内部部分上运行），或者在没有释放动画运行时按其时钟结束（即时释放、没有释放动画的表面，或没有 Web Animations 的引擎）。这适用于触摸按压控制器驱动的所有表面：按钮、开关、复选框、卡片、菜单行和列表行。
- 服务端渲染的 `useResizable` 区域，其 `defaultSize` 为百分比且没有 `containerRef` 时，会先使用服务端标记进行水合，然后针对窗口解析该百分比，而不是保留服务端解析的尺寸。
- 带 `autoSaveId` 的服务端渲染 `useResizable` 区域会使用服务端标记进行水合，并在下一次提交时采用其保存的尺寸，因此水合不再报告不匹配，手柄会播报保存的尺寸。
- 禁用的 `ResizeHandle` 保留其 Tab 停留点。此前它会离开 Tab 顺序，因此键盘用户无法到达它以听到其已禁用。现在它保留在 Tab 顺序中，与禁用控件保留其 Tab 停留点一致，并且仍忽略指针和键盘输入，并通过 `aria-disabled` 说明这一点。
- 无论 `pillPlacement` 如何设置，`ResizeHandle` 的抓取区域都保持居中于分隔线，`pillPlacement` 现在只移动药丸。内联区域最多占用比它短的面板的一半，覆盖式 Handle 最多占用其所处面板的一半。较短的项（例如从其边缘调整大小的 30 分钟日历事件）保持自己的拖动，而在药丸上的拖动仍会在药丸绘制的任何位置调整大小。
- `useScrollLock`（以及 Dialog、BottomSheet、Drawer、Lightbox 和 MobileNav）在覆盖层打开时保持页面在原位。该锁过去通过 `position: fixed` 以负滚动偏移固定 `<body>`，并在释放时滚动回来：页面偏移在整个锁定期间读为 0，而在 iOS Safari 上，跳回顶部会使工具栏重新出现，并在覆盖层关闭后仍留在那里。现在页面获得 `overflow: hidden`（在根元素上，或在 `<body>` 自身 overflow 被视口使用时在 `<body>` 上），并且在主指针为粗指针（手机和平板）的地方，会取消本应滚动页面的一指平移，这是 iOS Safari 所需的，因为它会在手指下滚动 `overflow: hidden` 的页面。覆盖层内滚动器可以接受的平移、原生 range 输入上的拖动、捏合缩放，以及捏合缩放页面上的一指拖动（它们平移缩放视图）仍然有效。该锁不再固定 `<body>`，`window.scrollY` 在锁定期间保持其值。该锁自行取消那些平移，将手势识别器拥有的触摸留给它，并在少量 slop 之后判断每次平移，以免轻扫的第一次晃动固定错误的轴。它遵循浏览器的滚动链，因此渲染在滚动容器内的覆盖层仍能保持页面：模态对话框的平移会传到页面，而不是该容器。它还会在根元素和 `<body>` 上设置 `overscroll-behavior-y: none`，这会在覆盖层打开时停止页面的过度滚动回弹。MobileNav 现在采用相同的锁：打开时，页面的回弹停止，一指平移如同在其他任何模态框之后一样被保持，而在另一个模态框保持页面时关闭它，会保留该模态框的滚动条槽。
- `Selector` 打开的选项列表现在在每种呈现中都由字段的标签命名。在无搜索的 popover 中，列表由触发器命名，因此屏幕阅读器会播报选中的值，或在未选中任何值时播报占位符（例如“Banana”而不是“Fruit”），这违反了 WCAG 2.2 SC 4.1.2。`getByLabelText(<label>)` 现在会同时匹配列表和触发器。
- 禁用的 `Slider` 不再运行调用方的 `onPointerDown`、`onPointerMove`、`onPointerUp`、`onPointerCancel`、`onKeyDown`、`onClick` 或任何其他 `on*` prop。此前，在禁用滑块上的按压、拖动或按键仍会到达它们，单值和范围形式均如此。现在，禁用的 `Slider` 除 `onFocus` 和 `onBlur` 外不运行任何调用方处理程序，与禁用的 `TextInput` 和 `TextArea` 一致（`spec:AST-085` FR2）。启用的 `Slider` 不变。无 API 变更。
- Spinner 在脚本运行时保持转动。圆环过去在主线程上每帧重绘其弧线来移动，因此只要页面运行 JavaScript 它就会停止，而这正是加载指示器出现在屏幕上的时候。弧线现在位于浏览器在合成器上转动的自己的层中：在 700 ms 的主线程阻塞期间，它仍以全速转动，且每帧不绘制任何内容。圆环静止时外观相同，转速也相同；尺寸、色调、可主题化的变量和减少动态效果均不变。
- 在具有可调整大小列的 `Table` 中，调整大小手柄的名称和宽度值不再加入列头的名称。此前，屏幕阅读器在列中的每个单元格都会读作“Name 60”。
- 在手指下，TimeInput 和 DateTimeInput 底部 sheet 中的时间滚轮现在遵循 iOS 的日期选择器：

  - AM/PM 列跟随小时。将小时从 11 转到 12 现在给出 12 PM，而不是 12 AM，AM/PM 列会转到 PM。从 12 PM 到 1 保持 PM。
  - 落在整分钟之间的边界（例如没有秒列的 `min="09:00:30"`）现在会提交其内最接近的整分钟，手指与鼠标均如此。

  使用鼠标时，每列仍各自转动。

- `Toast`：通过 `uniqueID`（`collisionBehavior: 'overwrite'`）更新的 toast 现在会原地更新，因此其控件上的焦点保持不动，而不是掉到页面上。如果更新移除了聚焦的控件，焦点会移到 toast 中的某个控件（例如关闭按钮），如果没有，则回到进入 toast 之前的位置。当只剩下没有控件的 toast 时关闭聚焦的 toast 也会将焦点返回那里。使 toast 自动隐藏的更新会在焦点位于其内部时保持其计时器暂停。在模态框之外，`ToastViewport` 中的 toast 不再携带自己的 live region，因此每个 toast 和每次更新由视口播报一次；当模态框托管视口时，每个 toast 会自行播报，因为模态框隐藏了视口的通道。
- Tokenizer 的底部 sheet 呈现（`presentation="bottom-sheet"`，以及紧凑触摸屏上的默认 `adaptive`）：确认的 Clear all 会将焦点保留在 Clear all 操作上（现在已禁用并附原因），而不是将其移到搜索字段，因为那会在人们刚清除的行上方升起屏幕键盘。内联呈现不变。
- `Typeahead`、`Tokenizer`、`PowerSearch`：当 React 渲染新的搜索源然后丢弃该渲染时（例如挂起并被更新的更新在提交前替换的过渡），搜索不再永远保持忙碌。保留的源现在会完成其搜索：结果显示，加载指示器和 `aria-busy` 清除。
- 在 DateInput、TimeInput 和 DateTimeInput 底部 sheet 中，滚轮的 Arrow、Page、Home 和 End 键按时间顺序在其启用值中移动，跳过禁用值，并停在第一个或最后一个启用值上，鼠标与手指均如此。在 12 小时的小时滚轮上，12 PM 在 1 PM 之前，因此从 12 PM 按 ArrowDown 会移到 1 PM，而越过最后一个允许小时的按键不提交任何内容。
- DateInput：使用鼠标时，底部 sheet 选择器各列的行在每个滚动位置都符合 WCAG AA 对比度；启用的行按主题的文本颜色淡化，而不是透明度。

#### 性能

- BottomSheet：打开 sheet 不再在挂载时强制布局以测量其高度；sheet 从浏览器自身的布局读取其高度。在 4 倍减速 CPU 的手机尺寸页面上，Selector 的 sheet 显示第一帧约快一帧（点按后约 110 ms 到 94 ms），打开过程少约 7 ms 的强制布局。打开动效和 sheet 尺寸不变。
- Popover、DropdownMenu、Carousel、ContextMenu、DateRangeInput、Markdown、MoreMenu 和 Table 不再预先加载 BottomSheet 的容器内边距样式。Popover 为其手机呈现按需加载 BottomSheet，而拆分代码的打包器会将两者使用的内边距模块放入随组件一起加载的同一个 chunk，保留双方使用的每个导出。`paddingStyles` 和 `overlayPaddingReset` 现在有自己的模块，仍从 `@astryxdesign/core/Layout/padding.stylex` 导出，`isFocusDetached` 有自己的模块，仍从 `@astryxdesign/core/utils` 导出。自己使用 BottomSheet 内边距的组件仍会加载它。渲染不变。

#### 文档

- Core 中保留的 88 个以上 Effects 的源码注释现在会命名每个 Effects 同步的外部系统。消费者导入或渲染的任何内容都不会改变。
- `useLightbox` 的 hook 文档，使 `astryx hook useLightbox` 和 `astryx search` 能返回它，并新增一个 `useLightbox — Gallery Grid` 示例块：一个照片缩略图网格，在被点击的项上打开全屏画廊。
- Icon：列出十个 palette `color` 值和命名空间化 `icon` 键，并在每种文档语言中记录 `className`、`style` 和 `ref`。
- IconButton：记录 `isInterruptible`、`width`、表单 props（`type`、`name`、`value`、`form`）以及链接 props（`href`、`as`、`target`、`rel`），并说明带 tooltip 的禁用 IconButton 通过 `aria-disabled` 保持可聚焦。
- `Icon` 文档化的 `color` 类型现在列出组件接受的每个值：十个语义颜色和十个 palette 颜色（`blue`、`red`、`green`、`gray`、`cyan`、`teal`、`yellow`、`orange`、`pink`、`purple`）。此前，该类型只列出语义颜色，尽管描述中提到了 palette。原生平台仍只绘制语义颜色。
- 将 `Overlay` 第一个子元素的圆角复制到其包装器上的 Effect 上方的源码注释现在说明了它为何仍是 Effect。新的测试固定了读取圆角的时间。消费者导入或渲染的任何内容都不会改变。
- TypeaheadItem：文档说明 `group` prop 没有效果，结果通过搜索源项上的 `item.auxiliaryData.group` 分组。

#### 其他变更

- 内部：未文档化的 `@astryxdesign/core/internal/touch-sheet` 入口已移除。它为 Tokenizer 和 PowerSearch sheet 呈现的 Lab 原型重新导出了触摸 sheet 的确认、搜索拖动关闭和草稿规则，而这些原型已不存在；Core 的 sheet 通过相对路径导入相同的模块。内部入口不属于公共 API 及其兼容性承诺。
- `useResizable` 构建的配置对象基于一个内部 resize 区域，通过与之前相同的尺寸模型，因此该区域的状态只有一个实现。
- 内部 resize 工厂可以驱动一个普通手柄元素：它为元素提供分隔符的角色、名称、值和 Tab 停留点，并响应其指针拖动、按键、Enter 和双击。ResizeHandle 和该工厂从一个辅助函数推导分隔符的属性，无行为变更。
- 内部：`useLongPress` 通过一个没有 React 的内部检测器运行其长按检测，因此可以在没有 React 的情况下运行的按压模型可以共享它。该 hook 及其处理程序的行为与之前相同；`onLongPress` 现在也来自已提交的渲染。不从包入口点导出。
- 内部：动效基础的一个进度模块。`progressCurve` 以闭式曲线给出弹簧从 0 到 1 的进度，`mapProgress` 将任意曲线从另一个曲线映射（伴随对象的变暗跟随 sheet、钳制范围），`mapRange` 是它们共享的钳制线性映射，`presentedProgressVelocity` 读取中断动效继续时的速度。全篇使用一个速度单位：每秒进度。没有公共变更；尚无组件导入它。
- 内部：触摸按压控制器将由其组的自身跟踪器绘制的操作按压（`data-astryx-press-group-item`）留给该跟踪器，因此每个按压只有一个写入者绘制。按键对操作的按压仍像以前一样绘制。
- 内部：按压跟踪只导入 UIKit 时序表的按压时钟，因此 Switch、Slider、SegmentedControl 和 DateTimeInput 这些基于按压跟踪构建的控件不再打包整个表。按压行为没有任何变化。
- 内部：滚动锁的触摸防护向手势系统的原生滚动测试询问手指下的元素是否可以滚动，而不是保留自己的副本。该副本遗漏了 `overflow: overlay`，而当前 Chromium 和 WebKit 将其计算为 `auto`，因此那里的页面行为相同。
- 内部：SelectableCard 读取一个内部输入上下文，Lab 的 SelectableCardGroup 用它将其卡片渲染为原生单选组。SelectableCard 的公共 props 和行为不变。
- 内部：水平 Stepper 从列表 ref 回调返回的清理中停止测量其列表，而不是从 Effect 中。它仍在首次绘制前测量，并且仍会在列表分离或 Stepper 转为垂直时停止。消费者导入或渲染的任何内容都不会改变。
- 内部：主题的减少动态效果标记及其读取器已为 `reducedMotion: 'always'` 就位。尚无主题可以设置它，因此对任何人都没有变化。
- 内部：Tokenizer 底部 sheet 在渲染时检查其结果行的 `action`，而不是在提交后的 Effect 中。开发警告、其文本和行均不变。不从包入口点导出。
- 内部：UIDatePicker 添加到其滚轮的规则（在 iOS 26.2 上测量）加入 UIKit 常量表：月/年滚轮更改日期、AM/PM 列跟随小时、转回边界上，以及日期钳制到月份。每条规则都附有其来源。它们都不从包入口点导出。
- 内部：Chromium 和 WebKit 中触摸选择器滚轮的浏览器证明，手指在每个引擎上都会得到它。轻扫按 UIKit 的曲线滑行到其投影的行上，并在到达时提交。手指落在滑行中的滚轮上会使其停止，然后缓动到最近的行。一个 storyboard 拍摄轻扫及其滑行。在 Chromium 中，滑行还会在主线程被阻塞时每帧继续前进，并且每帧不进行 Layout 或 Paint。在减少动态效果下，轻扫仍作为动量滑行且其行平放，点按会交叉淡化到其行上，仅动画 opacity，持续 200 ms 或更短。打开月份和年份滚轮不会每年写入一个元素，每年只绘制一次。使用鼠标时，拖动仍会将列滚动到行上。
- 内部：Wheel 的两种呈现（鼠标下的滚动列和手指下的选择器滚轮）共享一个 listbox hook，用于其 id、ARIA 属性、Arrow、Page、Home 和 End 键以及行点击。每种都保留其移动的起点：滚动列从带区下方的行步进，选择器滚轮从其正前往的行步进。
- 内部：选择器滚轮可从脚本转动，用于使用它的时间列。在手指下，滚轮 ref 上的 `spinTo` 会在点按旋转时将滚轮转到某一行，然后像静止一样提交；在精细指针下它会立即提交该行。无论哪种方式，它都会报告该行是否已提交：它拒绝禁用的行和超出行的索引，而滚轮卸载中断的旋转会报告它未到达。没有公共变更：滚轮不从包入口点导出。
- 内部：UIPickerView 在 iOS 26.2 上测量的值作为内部常量加入触摸动效表：行间距、选择器的高度及其橡皮筋、滑行的停止速度和速度下限、静止时的吸附、点按旋转和选择振动。滚轮移动所用的纯数学随它们一起加入。它像 UIScrollView 累加其减速一样投影释放后停靠的行，以重新求解的速率滑行以停在该行上、吸附、在末端弹跳、橡皮筋，并旋转到点按的行。它根据 UIKit 记录的帧进行校验。没有公共变更：它们都不从包入口点导出，主题也不设置这些值。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @duytbp
- @Geervan
- @humbertovirtudes
- @imdreamrunner
- @korkt-kim
- @ksying
- @nbozidarevic
- @nynexman4464
- @parinith-web
- @vjeux

---

# 0.7.7

#### 实验性 API

- Tokenizer 通过 `experimental={{presentation: 'bottom-sheet' | 'adaptive'}}` 获得触摸表面。`bottom-sheet` 用一个触发器取代内联 combobox，该触发器显示已选 token，并打开一个高大的模态 sheet：顶部是带边框的搜索字段，全宽复选框行在 sheet 打开期间保持原位，并在下一次打开时按已选优先重新分组，长列表采用 50 行渐进渲染，`hasCreate` 下有一个带尾部 Add 操作的 `Create "…"` 行，以及一个在任何状态下都固定的页脚，包含需确认的 Clear all 和 Save。sheet 编辑一个草稿：行、创建行和 Clear all 会更改 sheet 显示的选区，而 `value` 只在 Save 通过 `onChange` 报告草稿时更改一次，并把仍然成立的最后一次编辑作为其 `change`；已更改的草稿通过滑动、遮罩或 Escape 关闭时会先询问再丢弃，干净的草稿则直接关闭。在触摸屏上直接拖动结果会收起键盘而不会清除查询。`adaptive` 在紧凑的粗略指针屏幕上使用 sheet，否则使用 popover，其解析方式与 Selector 相同。sheet 表面按需加载，因此未选择启用的 Tokenizer 不会携带它。触发器向辅助技术描述其已选 token，sheet 打开期间所做的播报通过 sheet 内的 live region 到达辅助技术；传入 `experimental` 后组件还接受 `Ref<HTMLInputElement | HTMLButtonElement>`，因为在 sheet 呈现中 `ref` 到达触发器（`TokenizerProps` 保留其已发布的 `ref` 类型，只新增可选的 `experimental`）；在开发环境中，字段会对在 sheet 呈现中没有对应表面的 props 警告一次（`renderItem`、`renderToken`、`endContent`、`hasClear`、`hasEntriesOnFocus`、`menuWidth`、`tokenOverflowBehavior`、`hasAutoFocus`）。sheet 的字符串来自 `@astryx.tokenizer.*` 目录；在该选项处于实验阶段时，sheet 的各个部分不暴露主题化目标。Tokenizer 的 `experimental` prop 中的任何内容都可能在补丁版本中更改或移除；省略它则保持稳定行为。

#### 新组件

- 将 `InfoTip` 从 Lab 提升到 Core，可从 `@astryxdesign/core/InfoTip` 或包根导入：这是一个信息图标按钮，按下会固定其帮助。悬停和键盘焦点会预览帮助，而点击、轻点、Enter 或 Space 会将其固定打开，直到 Escape、再次按下、在外部按下或焦点离开。其默认名称是已翻译的 “More information”，在粗略指针下它会将轻点目标扩展到约 44 px，而不会占用相邻元素的目标。`@astryxdesign/lab` 的 `InfoTip` 导出现在是 Core 组件的已弃用再导出，并将在下一版本中移除：请改为从 `@astryxdesign/core` 导入。

#### 新功能

- AppShell 在启用全屏（`viewport-fit=cover`）的手机页面上，将其 header 项和内容末端保持在设备的安全区域内。header 区域或手机顶部栏会延伸到状态栏下方并到达屏幕两侧，同时其项保持避开状态栏、灵动岛和横向刘海。在 `height="auto"` 下，banner 下方的手机顶部栏会贴住顶部内边距而不是页面顶边，因此页面滚动时其项仍保持避让。主内容末端避开 home indicator（其块末端内边距为 `contentPadding` 加底部内边距，因此填满它的子元素会在指示条上方结束），无论是在页面中还是在主区域自己的滚动容器中。没有 header 区域或手机顶部栏的外壳不采用顶部内边距，因此其内容在那里保留自己的顶部内边距。在横屏下只有 header 采用内边距，内联 SideNav 或内容两侧不采用。没有 `viewport-fit=cover` 时，内边距为零，不会有任何移动。AppShell 文档说明了页面和已安装 Web 应用如何选择启用。
- ChatComposerInput 的 Return 键在触摸键盘上显示 Send。Enter 已经会发送消息；编辑器现在设置 `enterkeyhint="send"`，因此 iOS 显示其 Send 键而不是普通的 Return。新的 `enterKeyHint` prop 由导出的封闭联合类型 `EnterKeyHint` 类型化，接受另一个标签，例如对于 `onKeyDown` 会让 Enter 在触摸键盘上插入换行符的 composer，可传入 `enter`。
- Dialog（以及 AlertDialog 和 CommandPalette）、Drawer 和 MobileNav 在任何指针下都不再模糊模态后面的页面：2px 全视口背景模糊的重绘成本很高。暗化保留主题的 `--color-overlay`，在强制颜色模式下模态保留边缘，因此仍能与页面区分。BottomSheet 从不模糊。主题可以通过在组件的模态背景上设置 `backdropFilter: 'blur(2px)'` 来保留模糊：`components.dialog.base['::backdrop']`、`components['mobile-nav'].base['::backdrop']`，以及 Drawer 的 `components.drawer.base[':modal::backdrop']`，这会让非模态 drawer（`hasScrim={false}`）保持不模糊。
- 在减少动态效果下，不确定进度条不再滑动：在任何指针下，其填充都横跨整个轨道，并在原地轻柔地脉冲其不透明度，从完全不透明到 84% 再返回，每程两秒。主题的节奏不会改变脉冲，在默认的浅色和深色主题中，每个与轨道形成 3:1 对比的填充色调在脉冲最低点仍然保持该对比度。
- 在手指下（粗略主指针，所有触摸设备），确定进度条像 iOS 的进度视图那样移动到新值：线性移动，在主题默认节奏下每整条轨道的变化耗时一秒（从 10% 到 90% 为 0.8 秒），并且当值在途中再次变化时从填充当前绘制的位置继续。主题的节奏会缩放该时间。大于零时填充绘制高度绝不短于两个轨道高度，为零时不绘制。该动态效果在合成器上运行，因此脚本运行时仍会继续；在减少动态效果下或启用强制颜色时，新值立即落定。鼠标或触控板保留主题的时长和缓动。
- 搜索字段向触摸键盘请求其 Search 键并关闭自动更正。Typeahead、Tokenizer（以及因此 PowerSearch）、CommandPaletteInput 以及 Selector 和 MultiSelector 搜索行的搜索输入现在带有 `enterkeyhint="search"` 和 `autocorrect="off"`。手机键盘因此显示 Search 键而不是 Return，并保持名称和标识符按键入原样。该键只是一个标签：Enter 在每个字段中仍执行其原有操作。
- SegmentedControl：在触摸设备（粗略主指针）上用手指操作时，控件会跟随触摸。拖动已选分段会让选择随手指移动，松开时选择手指下的分段（`onChange` 在抬起时触发一次）；在控件外松开则不选择任何内容。拖动选择时，已选标签的颜色会跟随它，每个边界周围都有余量，因此停在其上的手指不会闪烁；标签字重只在抬起时改变，因此手指下不会发生重排。轻点通过浏览器自身的 click 进行选择，按下的分段显示共享的按下覆盖层；没有任何抬起或变暗。从控件上开始的垂直拖动仍会滚动页面。被条目 `onClick` 否决的提交会立即将选择送回；受控父级稍后采纳的提交落地时不会弹跳。启用 Reduce Motion 时，选择仍会跟随手指，没有追赶效果，只有抬起时交叉淡入淡出。键盘和辅助技术保留 click；不添加任何元素。
- SegmentedControl：鼠标或笔可以像手指一样拖动选择。从已选分段开始的拖动会使其随指针移动，释放时提交指针下的分段（`onChange` 在释放时触发一次）。在控件外释放不会选择任何内容，从另一个分段开始的拖动会在其抬起处提交。在鼠标或笔下，每次更改都按主题的时长和缓动滑动选择，而不是 UIKit 的弹簧，点击也会滑动。启用 Reduce Motion 时，鼠标或笔的拖动仍会带动选择，其释放立即落定。键盘和辅助技术保留 click。
- SegmentedControl：在手指下，选择会以 UIKit 的弹簧滑动到新分段，无论轻点、方向键还是新的 `value` 移动了它。选择指示器是控件自身的伪元素，因此不添加任何元素。该动态效果在合成器上运行，并在主线程繁忙时继续移动。启用 Reduce Motion 时，没有任何移动或缩放：旧选择在原位淡出，同时新选择淡入。该弹簧是 UIKit 的实测弹簧，是内部动态效果角色，任何主题都不会重新调整它，也没有主题值会延长 Reduce Motion 的淡出。在鼠标或笔下，它改为按主题的时长和缓动滑动。
- Switch 的按压和拖动在鼠标和笔下也能像手指一样工作：拖过翻转点后，在释放时切换开关，除非指针返回越过其按下的位置。鼠标或笔的按压在开关外释放时，无论是否翻转都不影响它，就像复选框一样。使用鼠标时，开关保持其桌面外观，值会移动滑块。在触摸屏笔记本电脑上，手指按相同规则翻转它，并保持桌面外观。
- 在触摸屏上用手指操作时，Switch 像 iOS 开关一样移动。按压会稍微抬起滑块，并带有柔和阴影；水平拖动会让它随手指移动，一旦手指移动了轨道的大部分距离就翻转开关；抬起手指即提交。轻点通过浏览器自身的 click 切换，按住或短距离拖动会在抬起时切换。无论手指向任一端拖出多远，无论书写方向如何，滑块都保持在轨道内。按压滑出开关并在外部抬起仍会切换它，如同 iOS。垂直拖动会滚动页面，开关会松开。该动态效果在合成器上运行，因此脚本运行时保持流畅。滑块在所有设备上都保持其圆形和尺寸，在粗略指针下开关的不可见命中区域增至约 44 × 44 px，不添加任何可见内容，并在到任何相邻控件的中间停下，因此轻点会落到更近的那个。轨道保持其主题填充，颜色变化在其上交叉淡入淡出。启用减少动态效果时，变化在触摸屏上交叉淡入淡出，而不是移动；在鼠标下则立即发生。按压会显示按下覆盖层，拖动过程中也如此，静止按住不会选择任何文本。键盘和辅助技术的行为与之前相同。在 Chromium 中，轻点后立即重定向的 Switch（例如在移动途中再次轻点）会从当前位置掉头，不会跳回其行程起点。Switch 加入 Slider 的共享按压跟踪和触摸协商。

#### 问题修复

- `purpose="info"` 的 `Dialog`、`Drawer` 的遮罩和 `CommandPalette` 现在只有在按压既在背景上开始又在背景上结束时，才会在背景按压时关闭。在字段中选择文本并在越过边缘处释放不再关闭它并丢失输入。仅在背景上的按压仍会关闭它，无论使用鼠标、笔还是手指。
- BottomSheet：在 WebKit（包括 iOS Safari）中，内容直接位于其中的固定高度 sheet 会在其滚动的末尾保留底部内边距（0 → 16 px），而不是与最后一行齐平结束。
- BottomSheet：打开 sheet 的 dialog 使用 flex 行而不是 grid 来放置其面板。在 Playwright 中测量的桌面 WebKit 里，打开 sheet 内的一次更新布局更快；iOS 模拟器没有显示差异。百分比 `height`（例如 `'50%'`）现在会在底边取屏幕的该比例；此前，短的 sheet 会被截短，长的 sheet 会从屏幕顶部垂下。
- BottomSheet：从 sheet 内的控件（例如 Done 按钮、Selector 的搜索字段或菜单行）关闭的 sheet，会在该控件仍持有焦点时将自己标记为 `inert` 和 `aria-hidden`。浏览器随后将焦点丢到页面，或屏幕阅读器在退出期间被留在隐藏的子树中。现在，焦点在其内部时关闭的独立 sheet 在该焦点保持期间不会进入 `inert` 和 `aria-hidden`，并在退出期间忽略指针和键盘激活；当退出结束时，它关闭并将焦点返回其打开者。退出仍然播放。焦点在别处时关闭的 sheet，或焦点在退出期间离开的 sheet，会像以前一样立即变为 inert。
- BottomSheet：被 Suspense 边界在关闭过程中隐藏、然后又再次显示的 sheet 从未完成关闭。其 dialog 保持打开、模态且 inert，因此其下的整个页面会忽略轻点、点击和焦点，直到重新加载。例如，当 sheet 的操作导航到会挂起的路由时会发生这种情况。现在，sheet 在再次显示时会完成关闭，页面可以使用。
- AppShell 移动抽屉内 `BreadcrumbItem` 的链接或按钮现在会在运行 `onClick` 后关闭抽屉，就像旁边的 `TopNavItem` 和 `SideNavItem` 行一样。此前，面包屑会导航并让抽屉保持打开，覆盖新页面。标记为 `isCurrent`、不导航到任何位置的面包屑会让抽屉保持打开。（#9465）
- Button、IconButton：重复按钮无障碍名称的 tooltip 也会被添加为其描述，因此屏幕阅读器会将相同的话读两遍（“Close, button, Close”）。Astryx 自己的关闭、分页、复制和折叠按钮默认会这样。现在，如果修剪后的文本等于无障碍名称，tooltip 仍会显示，但不会添加描述，前提是 Button 能读取该名称：其 `aria-label`，或当任何图标或尾部内容是装饰性 Icon 时的其标签。内容更多的 tooltip，或以其他方式命名的 Button（`aria-labelledby`，或其图标或尾部内容中的文本）保留描述。
- 带有错误 `status` 的 `CheckboxList` 现在会让每个复选框都带有 `aria-invalid`，因此屏幕阅读器会在每个复选框获得焦点时将该列表播报为无效，如同 `Switch` 和文本输入已做的那样。消息仍从列表渲染一次。
- 手势接管触摸后，页面不再看到该触摸迟到的 `mousedown` 和 `mouseup`。WebKit 会在按住轻点被取消的 `touchend` 之后几毫秒发送它们，指向当时手指下的任何内容；它们现在会随 click 一起被处理。
- Avatar、BreadcrumbItem、Button、Lightbox、SegmentedControlItem、Tab、Tokenizer：值为 `0` 的插槽会在其插槽旁显示一个多余的 “0”，或者在 SegmentedControlItem 和 Tab 的图标以及 Tab 的尾部内容中被丢弃。这涵盖 `startIcon`、`icon`、`endContent`、Lightbox 的 `caption` 和 `selectedIcon`。现在每个插槽都遵循共享的存在性检查。空值（`null`、`false`、`''`）不渲染插槽，就像省略时一样，而 `0` 会作为内容渲染在插槽内。`selectedIcon` 为 `0` 的 Tab 会在选中时显示它，而不是回退到 `icon`。`status` 为 `0` 的 Avatar 不再显示多余的 “0”；其状态插槽仍只在真值时渲染。
- 在 `DateInput` 或 `DateTimeInput` 的可键入日期字段（指针表面）中按 Enter，在未键入任何内容时现在会提交所属表单，如同任何文本字段。已键入的文本仍会先提交，而那次 Enter 不会提交。禁用或忙碌的字段在 Enter 时仍不执行任何操作。
- DateRangeInput：使用 `presets` 时，popover 会溢出手机宽度的屏幕。日历右侧被截断，因此星期六列和已选范围的末端被隐藏，在约 364 px 以下的屏幕上 Next month 也无法触及。现在，当预设和单月日历无法并排容纳时，预设会堆叠在日历上方，日历及其导航保持在 popover 内。在短屏幕上，popover 的内容会滚动。在预设能容纳在单月日历旁边的地方，布局不变。
- `Dialog`（以及 `AlertDialog`、`CommandPalette`）：在打开时卸载的 dialog，例如仅在打开时渲染的 dialog（`{isEditing && <Dialog isOpen …>}`）或随视图其余部分移除的 dialog，现在会将焦点返回打开它的控件，而不是丢到页面。
- 在没有遮罩的情况下从键盘打开 `Drawer` 时，如果其第一个控件带有 tooltip，例如 `DrawerHeader` 关闭按钮，不再抛出 `InvalidStateError`。tooltip 现在会在 drawer 显示后打开。
- 在模态 `Drawer` 打开时显示的 toast 现在会出现在抽屉内、其上方，并且可以用 Tab 按下和到达，如同它在 `Dialog` 或 `BottomSheet` 上已做的那样。此前，toast 留在抽屉的模态 dialog 之外：它在那里是 inert 的（按下 Undo 无效，Tab 永远到不了它），宽抽屉会完全遮住它。当抽屉开始关闭时，toast 会回到页面。没有遮罩的抽屉不变。
- 在没有遮罩的 `Drawer`（`hasScrim={false}`）打开之前显示的 toast 现在会保持在抽屉上方，如同它在无遮罩的 `BottomSheet` 上已做的那样。此前，抽屉会绘制在它上面，因此当抽屉遮住 toast 的角落时，其操作无法看到或按下。
- 从 `renderTrigger` 作为底部 sheet 打开的数据模式 `DropdownMenu` 现在会按菜单的 `aria-label`（否则按触发器自己的名称）为 sheet 设置标题并命名其 dialog，如同其 popover 一样。它不再对每个这样的 sheet 都读作 “Menu”。（#9525）
- 笔按压期间或从指针事件读取的手指按压期间发生的窗口失焦现在会结束该按压，在之后的抬起时不执行任何操作，适用于所有表面：`Switch` 不再在笔的那次 click 时切换。在手指来自指针事件的地方，第二根手指会将两者都留给页面的缩放手势，即使第一根手指停在普通页面上。禁用的识别器不会带来阻塞性监听器。
- 启用 Reduce Motion 时，在手指下打开的层会在 200 ms 内以 easeInOut 淡入，这是动态效果基础的 Reduce Motion 值，而不是主题的快速时长和曲线。在鼠标下它仍会立即出现。
- 渲染为按钮（带 `onClick` 且无 `href`）的 `Link` 会像 `href` Link 一样将其换行文本与周围文本对齐，而不是将其第二行及后续行居中。
- 禁用的 `CheckboxList` 或 `RadioList` 现在会在其组上设置 `aria-disabled="true"`，因此屏幕阅读器会将组本身播报为不可用，而不仅仅是每个选项，并且变暗的组标签会被视为非活动控件的标签。
- DropdownMenu（或任何使用按压模型的菜单）跟踪的手指轻点现在会在所有设备上取消该触摸的 `touchend`，因此浏览器不会为其发送 click 和兼容鼠标事件。此前，繁忙的主线程可能会让该 click 超过 400 ms 的 click 保护窗口。在钻入子菜单的轻点之后，迟到的 click 会选中已经来到手指下的子菜单行并关闭菜单。鼠标或笔的释放保留 400 ms 窗口。
- 启用 Reduce Motion（`design:reduced-motion`）时，DateInput 和 DateTimeInput 底部 sheet 日历中的月份箭头、Reset 以及用键盘移动到另一个月不再滚动月份：在带鼠标或触控板的计算机上，月份立即改变，在触摸屏上则通过短暂的不透明度下沉来改变。下沉期间的第二次操作会替换第一次，在下沉期间卸载日历不会滚动任何内容。
- 每个 `Outline` 链接现在都处于正常的 Tab 顺序中，Tab 会从一个链接移动到下一个，正如 Outline 记录所述。此前，大纲在当前标题上是一个 Tab 停靠点，用方向键、Home 和 End 键在链接之间移动，因此不知道这些键的键盘用户只能到达一个链接。方向键、Home 和 End 键不再在链接之间移动焦点。（#9001）
- `Popover` 和 `usePopover`：在锚定呈现中，初始焦点现在会落在打开 popover 的轻点或 click 内，因此在 iOS 上，其中的文本或数字字段会立即唤起屏幕键盘。`onShow` 移入 popover 内部的焦点不再被拉回第一个控件。
- `PowerSearch`：Clear all 会保留只读筛选器。它只移除用户可以编辑的筛选器，清除按钮仅在存在可编辑筛选器时显示，空输入上的 Backspace 不再移除只读筛选器，并且当仍有只读筛选器时，Clear all 会播报 “Editable filters removed”。对于调用者，Clear all 现在会以只读筛选器和 `remove`（第一个被移除的索引，当没有只读筛选器时为 `0`）调用 `onChange`，而不是以 `[]` 和最后一个筛选器的索引调用。
- `PowerSearch`：在只读字段（`isReadOnly`）中，空输入上的 Backspace 不再移除最后一个筛选器。只读字段现在不移除任何筛选器，正如其 `isReadOnly` 文档所承诺的那样。
- PowerSearch：在 popover 呈现中，内置筛选器 token 的按钮仅以字段和运算符命名（“Status: is”），没有表明它会打开编辑器的迹象。同一字段上的两个筛选器听起来相同，可见值也从名称中缺失。现在，token 以其所有可见文本命名（“Status: is Open”），具有 `aria-haspopup="dialog"` 和 `aria-expanded`，并打开一个同名 dialog 的编辑器。其移除按钮为 “Remove Status: is Open”。Token：`aria-haspopup` 和 `aria-expanded` 现在会到达可点击 token 的内部按钮，与 `aria-labelledby` 和 `aria-describedby` 并列。
- 在触摸屏上启用 Reduce Motion 时，即使在繁忙的页面上，DateInput、TimeInput 或 DateTimeInput 滚轮上的一步以及触摸日历中的一个月步进也会在其交叉淡入淡出下改变。此前，变化会在淡出中间的一个计时器上落定，繁忙的页面可能会在淡出结束后才触发它，因此行或月份会完全可见地移动。现在，变化会在淡出结束时按淡出自己的时间线落定，淡入仅在之后开始，因此它绝不会以完全不透明的状态显现。月份的下沉现在像滚轮一样对每一半进行缓动。
- 在拖动中途其 `resizable` prop 消失的 `ResizeHandle` 现在会像卸载时一样结束拖动：它释放页面的调整大小光标和文本选择，区域会得知其手势已结束。
- 启用 Reduce Motion 且使用鼠标或触控板时，Selector 的选项列表不再淡入；它会立即出现。在触摸屏上它使用共享的 Reduce Motion 交叉淡入淡出。
- 在打开的 Selector、MultiSelector、CommandPalette、DateTimeInput 时间列表或 Chat 触发菜单中，滚动列表的按键（End、Home、PageDown、按类型选择）会将高亮保持在按键放置的位置，即使鼠标正停在列表上。此前，在静止指针下滚过的行会获得高亮。移动或按压的鼠标仍会获得高亮。
- Slider：每个指针都按滑块行程拖动滑块，如同 UISlider。按压滑块不再将值跳到指针：一旦指针移动 10 px，值就沿轨道跟随其后续行程。手指或笔只沿轨道方向认领拖动，因此横跨滑块滑动会滚动页面；鼠标可沿任何方向认领。在触摸屏上，每个滑块通过 48 px 的目标接受手指或笔，目标上限为与范围中另一个滑块间距的一半，被按住的滑块会抬起。手指快速滑动后，滑块会按 UISlider 的实测弹簧滑行约 0.6 秒，`onChange` 在滑行过程中持续触发，`onChangeEnd` 在稳定后报告值；缓慢拖动、鼠标拖动和笔拖动在释放时结束。轻点轨道会在手指抬起时设置值，鼠标点击会在其落点设置值；右键点击和 macOS ctrl-click 不改变任何内容。在减少动态效果下，滑块不会抬起，轻点的值立即生效。
- `Toast`：在窗口处于后台时触发的 toast 现在会以暂停的自动隐藏计时器开始，因此它不再可能在用户返回标签页之前消失。
- 可移除的 `Token` 即使其宽度被截断，现在也会保留其 16 × 16 的移除按钮。该按钮过去会缩小到 12 px 宽，因此其焦点环绘制成椭圆形，其按压目标收窄到 20 × 24 px。现在只有标签会被截断。（#9599）
- Tooltip、HoverCard：在另一个文档（例如 iframe）中渲染触发器的轻点打开 tooltip 或 hover card，现在会在该文档中从外部开始的滚动时关闭，以及当触发器不接受焦点时在该文档外部轻点也会关闭。
- `Typeahead`：启用焦点条目时，打开的列表如果焦点条目返回空或加载失败（例如在清除查询之后），现在会关闭，而不是保持打开且为空。没有结果的键入搜索仍会显示其消息。
- `Typeahead`：在编辑已选值时按 Escape 现在会恢复该值并将焦点移到其 token，而不是将焦点丢到页面。列表显示时，第一次 Escape 只会隐藏列表。
- `useMediaQuery` 在窗口没有 `matchMedia` 的地方（例如测试 DOM 中）返回其服务器默认值，而不是抛出异常。读取它的组件（例如 Slider）现在可以在这样的 DOM 中渲染；从本版本开始读取它的 SegmentedControl 也会继续在那里渲染。
- 停在边界外某个值上的选择器滚轮现在会停在边界内最近的值上。此前，它会弹回起始的值。这适用于 TimeInput、DateTimeInput 和 DateInput 底部 sheet 中的滚轮。例如，在 `min="09:00"` 时，将小时滚轮从 10 拖到 7 会停在 9，如同 iOS 时间选择器。停在边界内的值不变。在边界外的值上打开 sheet 不会提交任何内容。当边界在 sheet 打开时改变滚轮的值（例如上午/下午滚轮越过最大值），该滚轮会转到新值而不是跳到那里。在减少动态效果下，滚轮自身的滚动不再滑行。在触摸屏上，这段行程、方向键的一步以及点击一行会交叉淡入淡出，行在淡出时落定；在鼠标或触控板下它们立即落定，除了触摸拖动后的行程，它在任何屏幕上都会交叉淡入淡出。

#### 性能

- 打开 Selector 的列表或移动其高亮现在只重新渲染高亮或选择发生变化的选项，而不是每个选项，因此长列表打开更快，方向键响应更快。
- 打开带长选项列表的 Selector 更快：列表不再在首次打开时第二次重设每个选项的样式以切换到其滚动触摸行为。

#### 文档

- 为 `useOutlineFromMarkdown` 添加 Hook 文档，因此 `astryx hook useOutlineFromMarkdown` 和 `astryx search` 会返回它，并添加一个 `useOutlineFromMarkdown — Docs Article` 示例块：一个 Markdown 文章和通过该 hook 从同一字符串构建的 Outline，带有一个添加章节及其链接条目的按钮。

#### 其他变更

- 内部：触摸呈现的动画器会在屏幕上进行中的重定基、设置或重定向在调用第一帧迟到并使其起点未被读取后重建它时，携带一个通道。该通道会带着自己的起点离开该调用，起点从那一帧算起，而不是重新开始其曲线；该调用的其他通道继续等待浏览器的起点。不从包入口点导出。
- 内部：触摸呈现的动画器会将第一帧迟到且起点未被读取的调用视为在该帧开始。在浏览器报告起点之前的重定向或读取（无论是当前时间还是更晚时间），会从屏幕所处的位置附近继续，而不是从调用的第一个值开始。在该窗口内重建某个通道动画的重定基或设置会在提交它的帧之前读取该通道的第一个值，而调用的其他通道继续从第一帧读取。浏览器的起点一旦读取，仍具有决定权。不从包入口点导出。
- 内部：ChatMessage 的头像偏移变量现在使用私有字面名称 `--_chat-avatar-offset`，而不是哈希名称，因此发布的样式表不再声明一个看起来像公共变量的内部变量。头像的偏移不变。不从包入口点导出。（#9602）
- 内部：手势认领的鼠标或笔拖动不会产生新的文本选择，并保留页面已有的选择，无论由哪个识别器认领（包括滑动或等待另一个识别器失败的识别器），而从可选文本上开始的拖动会留给浏览器，由浏览器选择该文本。不从包入口点导出。
- 内部：平移在其所有者允许的地方（`allowedScrollTypes: ['continuous']`，即 UIKit 的 `allowedScrollTypesMask`；默认没有）跟随触控板双指滚动，沿其自身轴且位于指针下的滚动器之后，并且绝不跟随鼠标滚轮的刻度，鼠标滚轮滚动指针下的内容；屏幕边缘平移不采用任何滚动；捏合会接受来自触控板或鼠标的 ctrl-wheel（AST-094 FR43，DEC-24）。监视器平移从不接受滚轮，另一个处理器已阻止的滚轮仍属于页面。增量无法放置的输入（包括 Shift+wheel）会作为鼠标滚轮读取；平移跟随的触控板滚动会以手指速度继续移动，直到读取到它们的抬起，在那里结束但仍处于移动状态，动量永远不会移动它。不从包入口点导出。
- `ResizeHandle` 的指针拖动、按键和双击移入一个内部模块，行为不变。
- 内部：当主线程停顿导致迟到的触控板滚轮及其后成束的滚轮时，跟随的平移会在迟到滚轮的间隔内读取手指速度，因此快速滑动不再过早滑行结束。读取永远不会超过停顿前的速度。不从包入口点导出。
- 内部：跟随的触控板平移不会从距前一个滚轮 1.5 ms 以内的滚轮获取速度，因此主线程停顿后成束的滚轮不再使其超过手指的行程，在 60 到 500 Hz 下都是如此。不从包入口点导出。
- 内部：触控板分流器会将成束的滚轮（主线程停顿时送达的、距前一个 1.5 ms 以内的滚轮）读取为它合并的步数。在动量期间，成束的滚轮不是跳跃，因此动量不再重新启动跟随的平移，其后的步数也不再被读取为抬起。不从包入口点导出。
- 内部：用于触摸呈现的分页器，像 UIKit 分页滚动视图一样分页。水平平移会逐页移动页面，并在两端产生橡皮筋效果。释放时按 UIKit 的规则选择页面，并在合成器上按 UIKit 的分页曲线稳定，手指可以在途中接住它。它接受所有指针：鼠标像手指一样拖动它，其平移跟随触控板的水平滚动，每次滑动最多一页。鼠标滚轮的滚动仍属于页面。其动态效果值是内部常量。不从包入口点导出。
- 内部：触摸呈现的 UIKit 分页值和数学，在 iOS 26.2 上测量：选择释放后稳定到哪一页的阈值、将其带到那里的稳定过程以及 `setContentOffset(animated:)`。稳定过程和 `setContentOffset(animated:)` 以不到半个像素的误差重放记录的帧。未使用的投影规则（`selectPage` 和 `scroll.paging`）已移除，因此实测阈值是唯一的分页规则。不从包入口点导出。
- 内部：UISwitch 在 iOS 26.2 上测量的值（其几何形状、滑块抬起、稳定、移动和拖动的弹簧、轨道颜色、其最短抬起时间和其翻转距离）作为内部常量加入 UIKit 常量表，并附带开关拖动所遵循的纯函数规则：手指从落点移动轨道宽度减去滑块宽度后翻转开关，返回越过该点则翻回，抬起手指提交所显示的一侧，若没有翻转则切换。不从包入口点导出，也没有主题设置它们。Switch 的触摸呈现会播放它们。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @duytbp
- @HelloOjasMutreja
- @hskl18
- @imdreamrunner
- @vjeux

---

# 0.7.6

#### 新功能

- useAnnounce 接受可选的 `{hasReplace: true}`。用它创建的实例声明一个当前状态，例如搜索的结果数量：它写入的每条消息都会在该实例的上一条消息尚未播报之前撤回那条消息，无论两者的礼貌级别如何，并以自身的礼貌级别播报，因此比一帧更快的输入（条码扫描器、听写、自动化）只会说出最新的内容。来自其他实例以及未使用该选项的实例的消息仍然会合并。MultiSelector 通过这样一个实例发送其结果数量、其创建行和其空搜索消息，因此快速键入不再说出 `1 result Create "Urg" Create "Urge" …`；其选择变化保留自己的实例，并且仍然合并。这遵循 spec:AST-086 FR9 和 FR13（#9070）。（#8640）
- 为 `en` 目录添加三个 `@astryx.diffViewer.*` 键，用于 lab `DiffViewer` 的大改动折叠：其 “Large change: N lines” 标签及其 Show full diff / Hide full diff 按钮。现有字符串没有变化；没有翻译的区域设置会回退到英文。（#9462）
- FieldLabel：轻点标签的信息图标（`labelTooltip`）会打开其帮助，而不会同时切换或聚焦控件（`component:FieldLabel` FR9）。此前，打开帮助的轻点也会激活标签的控件，就像原生标签上任意位置的轻点一样：在触摸屏上它会聚焦字段、唤起键盘，或切换标签所指的开关或复选框，造成意外的第二个操作。现在，手指或触控笔的轻点只打开帮助；鼠标点击图标仍会像标签其余部分一样激活控件，悬停仍会显示帮助。（#9089）
- FieldStatus：`tooltip` 变体已弃用，并将在下一个次版本中移除。FieldStatus 没有 tooltip 呈现：直接使用 `<FieldStatus variant="tooltip">` 会绘制一个普通消息框，不显示 tooltip，你的编辑器现在会将此标记为已弃用。要从字段的场上图标显示状态消息，请在字段控件上设置 `statusVariant="tooltip"`；该用法仍然受支持。（#9196）
  之前：

  ```tsx
  <FieldStatus type="error" message="Required" variant="tooltip" />
  ```

  之后：

  ```tsx
  <TextInput
    label="Name"
    value={name}
    onChange={setName}
    status={{type: 'error', message: 'Required'}}
    statusVariant="tooltip"
  />
  ```

- 让 NumberInput 的紧凑步进器适配主指针的精度：在粗略指针上隐藏它们，并恢复字段的主题化末端内边距。精细指针的步进器保持不变。（#8015）
  兼容性：这是一项非破坏性的呈现适配。公共 props 和导出、数值与回调契约、验证、直接输入以及键盘步进均保持不变；现有的 NumberInput 调用无需任何源代码或配置迁移。粗略指针用户直接输入值，而不是使用紧凑的视觉步进辅助工具。

- TextInput 和 TextArea 告诉触摸键盘字段所包含的内容。新增 props：`enterKeyHint`（Return 键显示什么：Search、Send、Next、Go、Done）、`inputMode`（使用哪种键盘：数字键盘、小数键盘、电话键盘、Web 搜索、电子邮件、URL）、`autoCapitalize` 和 `hasAutoCorrect`，以及 TextInput 上的 `hasSpellCheck`（TextArea 已有该 prop）。TextInput 的 `type` 还接受 `search`、`tel` 和 `url`。这些值的类型是新的导出封闭联合类型 `EnterKeyHint`、`InputMode` 和 `AutoCapitalize`，因此 TypeScript 会拒绝任何其他值。每个 prop 渲染同名的原生属性，未设置时不渲染任何内容，因此现有字段保留浏览器的默认值。（#8166）
- 主题的 `motion` 在时长比例之外接受两个调节项：`tempo`（0.75–1.5）缩放每个动态效果的时长，`character`（`'crisp'`、`'standard'` 或 `'expressive'`）设置新的 `--ease-entrance` 和 `--ease-move` token；`--ease-exit` 在每种 character 下保持不变。它们的类型 `ThemeMotionConfig`、`ThemeMotionKnobs` 和 `MotionCharacter` 均已导出。没有这些配置的主题渲染结果与之前完全相同；时长比例和显式 token 优先于这些调节项，Spinner 和 Skeleton 的循环在任何 tempo 下都保持其时间节奏，按压释放的淡出遵循 tempo，但在用户的减少动态效果设置下以 200 ms 为上限。弹簧暂时不读取这些调节项。动态效果、token 和主题编写文档以及主题模板描述了这些调节项。（#8661）
- TimeInput、DateTimeInput：`hourFormat` 的默认值跟随区域设置。这是一项默认值变更。旧的默认值始终是 `'12h'`；新的默认值在未设置 `hourFormat` 时采用 `InternationalizationProvider` 区域设置的小时周期，因此 `de-DE`、`en-GB` 或 `vi-VN` 应用会像旁边的 `Timestamp` 一样显示 “14:30”，而 `en-US` 和没有 provider 的应用保持 “2:30 PM”。要保留旧的默认值，请传入 `hourFormat="12h"`。要在所有地方遵循个人自己的 12/24 小时偏好，请将其设置在 provider 的区域设置上（`en-US-u-hc-h23`）。十二小时制文本现在使用区域设置自己的日间时段（“오후 2:30”、“午後2:30”、“2:30 p. m.”），而不是固定的英文 AM/PM，其数字和分隔符也一同使用，键入字段会读回该文本。修复 #8992。（#9022）
- `SearchSource` 可以在其搜索完成之前显示结果。`search(query, context)` 可以调用 `context.update(items)`（新的导出类型 `SearchContext`）来显示它已经拥有的匹配项，例如页面先前加载的人员，然后返回服务器的答案。`BaseTypeahead`、`Typeahead` 和 `Tokenizer` 为当前查询显示每个列表，每次击键最多更改一次列表，并且只在已显示的行之后添加后续行，因此高亮行永远不会移动；字段保持忙碌状态，结果计数在搜索完成时播报一次。后续列表如果移动或移除已显示的行，则按给定内容显示，并给出开发警告。从不调用 `update` 的来源像以前一样每个查询显示一个列表，但每个字段都会看到两项变化：选项元素 id 现在跟随条目的 `id` 而不是其行索引（按基于索引的 id 选择选项的测试需要更新），以及带 `hasCreate` 的分组 `Tokenizer` 将其 Create 行显示在各组之后而不是最前面。要立即显示本地匹配项，请传入 `debounceMs={0}`，并在来源内部延迟服务器请求（`spec:AST-092`）。（#7962）

#### 问题修复

- 作为底部 sheet 的 DropdownMenu 如果其 sheet 预加载失败（连接中断），不再报告未处理的 promise 拒绝，也不再保留失败的加载，因此会重试加载的模块加载器会在下一次打开时加载该 sheet 的操作。（#8478）
- `DropdownMenu` 不再在每次渲染时重写其触发器的样式。当 popover 的 `onShow` 或 `onHide` 变化时，其触发器 refs 以及 `usePopover` 返回的触发器 ref 现在保持为同一个函数，因此 React 不再分离并重新附加触发器，锚定到同一触发器的 tooltip 也会保持原位。直接使用 `usePopover` ref 的触发器（ComplexSelector 的内置触发器、DateTimeInput 的日期字段和 Breadcrumbs）也会获得稳定的 ref。（#9130）
- Document Picture-in-Picture 窗口中的 `Popover` 在该窗口变得太矮或内容增长超出时现在会滚动，而不是被截断：它从自己渲染所在的窗口测量溢出，而不是从页面测量。（#9098）
- Safari 中，已完成布局变化后正在滑行的内容，在第二次变化重定向它时不再向前跳，例如一行在仍在移动时再次移动，或卡片内的一行随卡片本身一起滑行：新的滑行会从该行绘制位置前方最多约 3 px 处开始，变化在其帧中发生得越晚就越多。滑行元素在变化前的位置现在会按承载它的每次滑行（它自己的及其滑行容器的）时钟读取，因此新的滑行从旧滑行绘制的位置开始。（#9327）
- `AppShell` 是布局根：其祖先传下的布局值在其根处停止，因此它在带内边距的 `Card`、`Section` 或 `Layout` 内布局的结果与在页面根处相同。此前，其内部 Layout 会在四边逃离带内边距宿主的 padding，因此在裁剪溢出的带内边距 `Card` 中，外壳的 logo 在行内起点被裁掉，其导航和内容在其他边缘被裁掉。调用者在 `AppShell` 上的自有 props 和样式仍然生效；主题、颜色模式、方向和翻译继续继承。（#9418）
- 使用 `height="fill"` 时，如果 AppShell 的主区域内容溢出且没有可聚焦元素，主区域现在可以用键盘滚动（WCAG 2.1.1 Keyboard）。此前，main 只是跳过链接的目标（`tabIndex={-1}`）：Tab 会越过它，因此长文本、报告或只读页面无法用指针以外的方式滚动。现在，当 main 滚动溢出的内容时，它是 Tab 顺序中的一个停靠点，其上的键盘焦点会绘制标准焦点环（内嵌）；在带顶部导航和内联侧边导航的高架外壳中，main 随后会采用表面的圆角顶部起点，使焦点环随之弯曲。当 main 内第一个可聚焦元素是普通链接或按钮时，Tab 进入会继续前进；否则 main 是它之前的一个停靠点。内容刚好容纳的主区域以及 `height="auto"`（页面滚动）保持不变。（#8111）
- DateInput 忽略来自已经打开的禁用选择器的选择，并在禁用时阻止 Reset 的值更改和月份导航，而不会关闭选择器或移动焦点。（#8813）
- DateRangeInput 在打开的选择器变为禁用后忽略日历和预设提交，而不会关闭选择器或移动焦点。预设会反映字段的禁用状态和原因。启用的选择、清除行为和仅加载时的关闭保持不变。（#9155）
- MultiSelector 在面板打开时变为禁用后，会阻止选择和创建回调以及 Actions，而不会移除获得焦点的控件。（#9152）
- Selector 在变为禁用后忽略选项选择，包括来自已经打开的弹出层的选择以及在启用时开始的指针手势。其触发器仍可聚焦，禁用值仍会从表单中排除。（#9137）
- 在强制颜色（Windows 高对比度）下，单独 `Avatar` 的姓名首字母和默认人物图标现在采用其周围的颜色，由浏览器强制，而不是始终显示 CanvasText：在将自身绘制为禁用状态的控件内，它们显示 GrayText。`AvatarGroup` 内的头像在组的环上保持 CanvasText。强制颜色之外没有变化。（#8819）
- Badge：带标签的徽章现在绝不会短于该标签的一行。使用更大文本尺寸时，徽章标签变大而徽章保持固定高度，因此标签溢出胶囊，彩色徽章上的白字变得不可读。徽章现在会随标签增长。默认尺寸下没有变化，设置徽章高度的主题在那里保持该高度，同时其徽章仍随更大文本增长；仅颜色的徽章在任何文本尺寸下保持其大小；徽章在过窄的容器中仍会收缩并截断。（#8236）
- 从较短的 detent 向上拖动带吸附点的 `BottomSheet`，或向下拖回越过它时，不再使 sheet 在那一帧偏离手指。此前，sheet 会跳动其滚动区域在该 detent 放弃的高度（半高停靠点约为屏幕的一半），然后弹回。现在高度和位置在同一帧中变化。（#9193）
- 从另一个 sheet 内容内部打开的 BottomSheet 会独立向下拖动以关闭。下方被覆盖的 sheet 不再接受该手势，因此拖动顶部 sheet 的抓手不再移动或关闭其下方的 sheet。（#8820）
- Calendar、DateInput、DateTimeInput：独立存在的月份标签在区域设置将其首字母大写的地方以大写开头。在西班牙语、法语、意大利语、荷兰语、波兰语、俄语和乌克兰语中，Calendar 的标题读作 “octubre de 2026”；现在读作 “Octubre de 2026”，遵循 CLDR 的独立大写规则，就像星期标题已使用 CLDR 的独立名称一样。双月视图会将两个月份都大写，每个月份网格的名称、触摸日期字段的月份标题以及 `useCalendarNavigation` 的 `monthYearLabel` 也如此。运行文本中的日期（例如字段的值）不变，CLDR 不大写的每种区域设置也不变，包括越南语。（#9371）
- Carousel 的滚动区域是一个以轮播命名的组，因此屏幕阅读器用户 Tab 到它时会听到自己所在的位置。它仅在其内容溢出时才是 Tab 停靠点；内容刚好容纳的轮播不再添加空的停靠点。（#8155）
- ChatComposerInput：轻点粘贴文本的 token 会打开其预览而不会唤起键盘。此前，打开预览的轻点还会聚焦 token 周围的 composer 并将光标放入其中，这在手机上会于预览上方唤起屏幕键盘。现在，手指或笔的轻点会停在 token 上，因此触摸可以到达预览及其 Expand 操作，而不会被键盘遮住，这是 `architecture:interaction-modality` INV4 要求每种模态都具备的可操作路径；鼠标点击 token 仍会将光标放入 composer，悬停仍会打开预览。（#9189）
- 在 ChatComposer 正文中打开的 Tooltip 或 HoverCard 内点击，不再将焦点移到 composer 的输入框。点击正文空白处仍会聚焦它。（#9375）
- 在 ChatComposerInput 自己的编辑器内按压不再关闭其打开的触发菜单（`@` 提及或 `/` 命令列表）。在查询内部点击会保持菜单显示；将光标移出查询的点击、页面其他位置的按压以及 Escape 仍会关闭它。（#9503）
- Safari 不再因为 ChatMessage 的头像间距规则而在页面用许多子元素填充容器时变慢。具名气泡旁的头像顶部间距现在从消息本身判断，而不是从其兄弟节点判断。外观与之前完全相同。（#9438）
- CheckboxList：用 `disabledMessage` 禁用的组会将原因作为每个复选框的描述（`aria-describedby`）提供给它们，也会提供给组，因此屏幕阅读器会在聚焦的复选框上播报它。行自己的描述排在前面。（#9168）
- ClickableCard：禁用的链接卡片不再将未定义的 `href` 传给路由链接组件，获得焦点的链接卡片在其禁用状态变化时保持焦点。（#8659）
- CodeBlock：在从右到左布局中，折叠的展开箭头现在指向行内末端（左侧），与其他展开箭头一样。展开时它仍指向下方。（#9294）
- 当 `Collapsible` 在键盘焦点位于其内容中时关闭，例如由所有者设置的 `isOpen` 或组的 value 触发，焦点会移到其触发器。此前焦点会落到页面，因此键盘或屏幕阅读器用户会失去位置（WCAG 2.2 SC 2.4.3）。其他位置的焦点不会被移动。（#9250）
- `Typeahead` 和 `Tokenizer` 在 combobox 上暴露其状态（WCAG 2.2 SC 4.1.2；`component:FormLayout` FR5 和 AR2）。此前，combobox 没有 `aria-required`，因此在 `FormLayout defaultOptionality="required"` 下，可见的 “Required” 标记被隐藏时，屏幕阅读器会将必需字段播报为可选；错误状态显示其消息但没有 `aria-invalid`。现在，combobox 会为解析后的必需状态设置 `aria-required`，为错误状态设置 `aria-invalid`。当字段自身状态关闭时，调用者自己的 `aria-required` 或 `aria-invalid` 仍然生效。（#9034）
- CommandPalette 在你已经键入后不再显示其 “Type to search” 文本。第一次搜索仍在加载时，列表保持为空并显示字段的加载 spinner；无结果文本会在该搜索完成且没有结果后出现。清除字段会让 “Type to search” 回来。（#9420）
- Comments：为 Comments 错误横幅播报的失败播报现在来自 `@astryx.comments.errorAnnouncement` 区域设置条目，因此可以像组件其余消息一样翻译。（#7902）
- ComplexSelector 的弹出内容会使其最后几行避开应用通过 `LayerProvider` 的 `inset` 声明的底部栏，而不是滚动到其下方，并且当用户偏好减少动态效果时，其 chevron 会立即转向而不是对旋转进行动画。（#8551）
- ComplexSelector：使用 `statusVariant="tooltip"` 时，状态消息不再丢失。触发器行现在将状态图标显示为可聚焦的信息提示按钮，在悬停、键盘焦点或轻点时显示消息，触发器由该消息描述，而不是指向不存在的元素。按下信息提示不会打开弹出层。（#9026）
- 从未打开过的上下文菜单不再挂载其菜单表面；它在第一次打开时挂载，并在附加时显示。在 Safari 中，2,000 行时单元格带上下文菜单的 Table（行展开会给每个正文单元格一个）此前需要一分钟或更久才显示其前几行；现在几秒内就会显示。（#9278）
- 打包成单个 esbuild 文件的应用（无代码分割，如无构建页面）不再在首次渲染时因 TypeError 崩溃，例如 “Cannot read properties of undefined (reading 'useId')” 或 “(reading 'useEffect')”，例如当它使用 `List` 或 `Button` 时。代码分割的应用不变，仍按需加载 Core 的惰性模块。（#9055）
- DateInput、DateRangeInput 和 DateTimeInput 在 popover 关闭时不再构建其日历。每个关闭的字段过去会在页面加载时挂载完整的月份网格并保持更新，因此带有许多日期字段的表单要为每个字段付出该成本。日历现在在 popover 打开时挂载，并打开到字段的当前值。打开、焦点和关闭不变。（#8902）
- 在 DateInput 自己的文本输入框、清除按钮或标签上按压不再关闭其打开的日历。点击日期文本以修正数字会保持日历显示；页面其他位置的按压和 Escape 仍会关闭它，将焦点从字段的任何位置（其文本、清除按钮或日历按钮）移到另一个字段现在也会关闭它。（#9433）
- 在 DateTimeInput 自己的时间输入框中按压不再关闭其打开的预设时间列表。点击时间文本以修正数字会保持列表显示；页面其他位置的按压、焦点移开和 Escape 仍会关闭它。（#9459）
- 通过 portal 渲染到同源 iframe 中的 `Dialog` 现在在关闭时会将焦点返回 iframe 中打开它的控件，如同在页面中一样。（#8381）
- 保持其 Tab 停靠点的禁用字段（TextInput、TextArea、NumberInput、Typeahead、Tokenizer、Selector、MultiSelector，以及 DateInput、TimeInput、DateRangeInput 和 DateTimeInput 的所有表面：popover、原生和底部 sheet）现在在强制颜色（例如 Windows 高对比度）下显示键盘焦点。其焦点边框在那里采用系统 Highlight 颜色，如同启用字段一样。强制颜色之外没有变化。（#9410）
- 带有 `href` 的禁用 `Item`、`ListItem` 或 `TreeList` 行不再从屏幕阅读器、Enter 或链接菜单导航。其链接现在没有 `href`、`target` 或 `rel`，就像禁用的 `Link` 一样，并保留链接角色。（#9056）
- 在 Chrome 中用手指操作时，打开的非模态 `Drawer`（`hasScrim={false}`）旁边的页面可以再次滚动。面板用 `overflow: hidden` 裁剪其内容，这使其成为滚动容器，Chrome 会将旁边页面上的拖动保持在该容器的过度滚动遏制中，因此页面不会移动。它现在用 `overflow: clip` 裁剪，裁剪方式相同但不是滚动容器。面板的内容区域仍会自行滚动，模态 drawer 不变。（#8636）
- 同时向 `DropdownMenu` 传递 `button` 和 `renderTrigger` 的开发警告现在会指出 `renderTrigger`；它之前指出了一个不存在的 `trigger` prop。文档也与组件一致：`button` 与 `renderTrigger` 互斥，私有菜单圆角默认为 `--radius-container`，禁用的 `DropdownMenuCheckboxItem` 或 `DropdownMenuRadioItem` 不接受焦点——方向键、按类型选择和指针高亮都会跳过它——同时它作为禁用项留在无障碍树中。（#7517）
- 键盘聚焦的 `DropdownMenu` 行现在在每种颜色模式下都会显示标准焦点环，绘制在行内部。此前行只在半透明背景下显示焦点，而强制颜色（Windows 高对比度及类似模式）会将其替换为页面颜色，因此那里的键盘用户无法分辨 Enter 会激活哪一行。焦点环跟随最后一次输入：按键后它会标记获得焦点的行，包括鼠标随后将焦点移到的行；鼠标或触摸按压后它不会显示。操作、破坏性、复选框、单选和子菜单行都会显示它，包括在 `ContextMenu` 和面包屑菜单中。右键或长按打开的 `ContextMenu` 会聚焦其第一行而不显示环；从键盘打开的会显示它。（#7517）
- 锚定的 `DropdownMenu` 现在会在其 `dropdown-menu` 目标上反映 `data-presentation="popover"`，如同底部 sheet 已反映 `bottom-sheet` 一样。为 `presentation:popover` 编写的主题规则（文档将其列为该目标的视觉 prop）现在会生效。（#7517）
- `DropdownMenu` 和 `MoreMenu` 现在会在底部 sheet 呈现中将调用者的 ref 转发到触发器按钮（`architecture:public-component-api` INV8）。此前，`presentation="bottom-sheet"` 或紧凑触摸屏上的 `presentation="adaptive"` 会用内部 ref 替换 `button.ref`（以及 `MoreMenu` 传递的 `ref`），因此调用者的 ref 保持为空。popover 呈现已经转发它。应用无需更改代码。（#8898）
- `DropdownMenu`、`MoreMenu` 和 `ContextMenu` 会为 `{type: 'section'}` 中带嵌套 `items` 的数据项渲染子菜单，如同在顶层一样。此前，这样的项会渲染为没有飞出层也没有 `aria-haspopup` 的普通行，尽管其类型允许在那里嵌套 `items`；手机上的底部 sheet 已经将其显示为子菜单。（#8858）
- 使用 `animatedLayout` 句柄时，在打开时关闭或在关闭时再次打开的 Collapsible 或 TreeList 行会从其显示的位置继续：内容的边缘在每一帧都保持与它之后的内容相接，而不是跳回完全显示或隐藏。在带触摸指针的 Reduce Motion 下，内容改为交叉淡入淡出，反转仍会重新开始其淡入。（#8721）
- Field：`FieldStatusPlacement`，即每个字段控件 `statusVariant` 的类型（`'attached' | 'detached' | 'tooltip'`），现在从 `@astryxdesign/core` 和 `@astryxdesign/core/Field` 导出，因此包装组件可以为其转发的 `statusVariant` prop 标注类型。（#9368）
- 启用的 Field 输入（TextInput、TextArea、NumberInput、Selector、MultiSelector、Typeahead、Tokenizer 以及日期和时间输入）现在在强制颜色（例如 Windows 高对比度）下显示键盘焦点。强制颜色会丢弃内嵌焦点阴影并用一种系统颜色重绘每个边框，因此聚焦的字段看起来与静止时相同。聚焦字段的边框现在在那里采用系统 Highlight 颜色，无论有无状态。保持可聚焦的禁用字段还没有该效果。强制颜色之外没有变化。（#9392）
- FieldStatus 会将验证消息中的长不可断词（例如从字段回显的电子邮件地址或 URL）换行到消息框内，而不是绘制到字段边缘之外导致其末尾无法阅读。（#9126）
- TextArea、Typeahead 和 Tokenizer：调用者的 `aria-labelledby` 不再替换字段自己的标签。此前，它是控件唯一的名称，因此 `label="Notes" aria-labelledby="billing-heading"` 会将文本区域命名为 “Billing”。现在，调用者的 id 跟随字段自己的标签（“Notes Billing”），如同 TextInput、NumberInput、Selector 和 MultiSelector 已做的那样。InputGroup 内的 Typeahead（此前完全忽略调用者的 id）现在依次由组、其标签和调用者的 id 命名。可见标签保留在无障碍名称中（WCAG 2.2 SC 2.5.3 Label in Name；`family:input-fields` FR10.1）。没有调用者 `aria-labelledby` 的字段不变。无 API 变更。（#8862）
- 带 `statusVariant="tooltip"` 的 FileInput 在 dropzone 模式和字段忙碌（加载或上传）时保留其状态按钮及其显示的消息，而不是丢弃它并让字段的描述指向空处。（#9134）
- FileInput：调用者的 `aria-describedby` 和其他 `aria-*` props 现在会到达触发器按钮，即字段的可聚焦控件。此前它们只设置在隐藏的原生输入上，该输入是 `aria-hidden` 且从不获得焦点，因此 `aria-describedby="hint"` 从未被读取（“Report” 被播报时没有 “PDF only, up to 10 MB”）。调用者的 id 现在会首先连接到触发器自己的描述 id。触发器自身组合的 props（`aria-label`、`aria-labelledby`、`aria-invalid`、`aria-busy`、`aria-disabled`、`aria-hidden`）不会被复制。参见 `family:input-fields` FR10.1。无 API 变更。（#9031）
- 当多个选择或拖放的文件违反 `accept` 或 `maxSize` 时，`FileInput` 会在其状态消息中命名每个被拒绝的文件及原因，而不只是第一个（WCAG 2.2 SC 3.3.1）。消息以活动区域设置列出。超过 `maxFiles` 仍会报告限制 “Maximum N files allowed”。（#9043）
- 在 `<FormLayout defaultOptionality="required">` 内，FileInput 和 Slider 现在会像其他字段一样告诉屏幕阅读器它们是必需的，即使没有自己的 `isRequired`。`isOptional` 仍可选择退出。（#9053）
- ButtonGroup 和 InputGroup：为组中最后一个成员设置圆角的规则不再拖慢 WebKit 中填充容器的速度（经测量），在任何页面上都是如此，无论是否有组。在 WebKit 中，向一个元素插入 10,000 个子元素，旧规则在页面上耗时约 1.15 秒，新规则约 10 ms。圆角看起来与之前完全相同：只有最后一个成员（跳过尾部的 popover、模板和 dialog）会为其尾部圆角设置圆角。（#9394）
- 在 SideNavHeading 和 TopNavHeading 菜单按钮名称中包含可见标题，无论是否有标题链接。当 TopNavHeading 没有标题时，保留已翻译的通用名称。（#9329）
- Tooltip 和 HoverCard：轻点禁用的 `Button`、`IconButton` 或 `ToggleButton`，或禁用的菜单项，现在会打开解释其为何禁用的 tooltip，且不会激活任何内容。此前，使用 `touchTrigger="auto"`（默认值）时，轻点会被计为控件自身的操作，因此在触摸屏上无法获知禁用原因（`spec:AST-085` FR5，`architecture:interaction-modality` INV4）。`aria-disabled` 控件现在不执行任何操作，轻点为禁用控件设置的标签也会打开其原因。轻点另一个可操作触发器内的禁用控件（例如选项行或链接角色卡片）现在会打开该触发器的 tooltip 或 hover card。启用控件上的轻点、`touchTrigger="tap"` 和 `"none"` 以及鼠标悬停不变。（#8207）
- 触摸按压反馈现在在窗口的捕获阶段监听滚动和页面隐藏，其指针监听器原本就在那里。在应用窗口捕获的 `stopPropagation` 或 Core 之前注册的文档捕获 `stopImmediatePropagation` 下，手指的按下外观现在会在其下方内容滚动时结束，每个按下外观都会在页面隐藏时结束。（#8360）
- 通过 Astryx 组件的 `xstyle` 应用 `interactionOverlayStyles` 的 TypeScript 用户不再遇到类型错误。每个变体的触摸按压属性（`animationName`、`animationDuration`、`animationTimingFunction`、`animationFillMode` 以及颜色变体的 `backgroundImage`）现在携带其 CSS 值类型而不是 `unknown`。生成的 CSS 不变。（#9440）
- `Item` 行上禁用的滑动操作现在会在行滑开时保持可聚焦。此前，它渲染带有原生 `disabled` 属性的 `<button>`，因此 Tab 会跳过它，键盘或屏幕阅读器用户无法到达它来了解其存在。现在它会暴露 `aria-disabled="true"` 并保留其 Tab 停靠点，而点击、Enter 或 Space 仍不会运行 `onActivate`，会让行保持打开，且不会到达行自身的 `onClick`（`spec:AST-085` FR1、FR2）。无 API 变更。（#9211）
- 当焦点落在 tab 或工具栏按钮通过 portal 打开的内容（例如 sheet、dialog 或 popover）中时，TabList、Toolbar 和 SegmentedControl 的方向键提示不再出现或被消耗。它仍会在键盘焦点首次进入行本身时显示。（#9362）
- 高 tooltip 或任何与触发器保持距离的层，在繁忙设备上页面滚动时不再多覆盖触发器一帧。层会在滚动后的那一帧、该帧绘制之前重新检查其位置，因此从第二帧起触发器保持可见。（#9123）
- useLayer：浏览器运行的原生 popover 隐藏拒绝的 show（Chromium 156 抛出 `InvalidStateError`）会在该隐藏结束后重放一次，因此层最终显示。例如，当浏览器自己的 Escape 关闭可轻触关闭的层时，打开它的按钮上的 tooltip 现在会显示而不是失败。（#8543）
- 在打开的层（popover、tooltip、hover card、菜单、dialog、drawer、lightbox、移动导航、底部 sheet 或 toast）内按压不再在层写入位置周围的元素上运行 click、pointer、mouse 或 touch 处理器。此前，在可点击卡片或行内写入的菜单中点击也可能激活该卡片或行。层内的处理器、捕获阶段处理器以及文档和窗口监听器仍会收到该按压。需要接收层内按压的处理器应放在层的内容上。（#9497）
  `SelectableCard`：在卡片内打开的层（例如 popover 的内容）中点击不再切换它。在下一个次版本之前，调用者的 `onClick` 仍会收到该点击，现在是在捕获阶段，即在层自己的处理器之前。

- Link：当链接位于比其文本更窄的行中时，`maxLines` 现在会截断。链接（作为锚点或按钮）会在其容器处停止，其标签绘制省略号，而不是增长到完整文本并被裁剪且没有省略号。（#9059）
- 调用者的 `data-color` 不再替换 `Link` 为主题定位而反映的那个（`architecture:public-component-api` INV5，`Link` FR11）。此前，调用者 props 在主题属性之后展开，因此传递 `data-color` 会改变主题规则在根上看到的内容，即使真正的 `color` prop 未变。这适用于锚点、按钮和禁用形式。其他调用者 `data-*` 属性仍会到达根。（#9157）
- 手指按在 DropdownMenu 触发器上时，可以在每个轴上漂移最多 13px，仍会在每种主指针下打开菜单，无论是手机、平板还是触摸屏笔记本电脑，正如 AST-094 FR29 允许的；超过 10px 时它会取消。没有菜单、行或触发器读取指针查询。（#8360）
- `MobileNav` 的 header 行会随其内容增长。它过去是固定的一条栏高，因此高于一行的 header（带搜索字段的标题，或在更大文本尺寸下换行的标题）会溢出该行：底部边框穿过它，内容撞进第一个导航项。该行现在至少一条栏高，因此单行 header 看起来与之前一样。抽屉模式下的 `SideNav`（将其 `header` 传给 `MobileNav`）也获得相同修复。（#8865）
- 渲染到同源 iframe 或 Document Picture-in-Picture 窗口中的组件现在会为其键盘焦点环和键盘高亮读取自己文档中的最后一次输入（Slider、MultiSelector、DropdownMenu、ChatComposer、CommandPalette、面板搜索字段、菜单），以及它们自己移动的焦点环。在页面上行为不变。覆盖层在关闭时返回焦点的位置不变。vjeux 为 Dialog 编写了最初的按文档修复（#8381）；此更改将其扩展到每个读取者。（#9148）
- 在 DateInput 和 DateTimeInput 底部 sheet 日历中，在 Safari 中于前一个箭头的滚动即将结束时点击或轻点的月份箭头，现在会将日历带到其标题所命名的月份，而不是回到前一个箭头的月份。（#8513）
- 在 DateInput 和 DateTimeInput 底部 sheet 日历中，当页面在轻点后立即卡顿一下时，月份箭头在 Safari 中不再自行开启日历分页；日历会移动一个月并停在那里。（#8513）
- MultiSelector：触发器上的默认计数文本（`triggerDisplay="count"`，例如 “2 selected”）现在来自消息目录（`@astryx.multiSelector.selectedCount`），因此可以翻译，并可在任何区域设置下使用复数形式。`formatValue` 仍会替换它。（#9020）
- 在使用 NavHeadingMenu 构建的 SideNavHeading 或 TopNavHeading 菜单中，一次 ArrowDown 或 ArrowUp 现在只移动一个条目。它过去会移动两个，跳过每隔一个条目，而在两个条目的菜单中 ArrowDown 从不移动焦点。（#9019）
- 修复 FileInput，防止忙碌时激活文件选择器和选择文件。在禁用或忙碌时清除拖动悬停高亮，并向辅助技术暴露忙碌触发器为禁用。（#9167）
- NumberInput：使用 `formatValue` 时，Tab 进入字段会保持其文本被选中，因此键入会替换该值。此前，可编辑文本在焦点后替换格式化文本，并将 Tab 的选择折叠到末尾，因此显示 `1,500,000` 时，Tab 然后按 `7` 会得到 `15000007` 并在失焦时提交。现在 `1,500,000` 变成完全选中的 `1500000`，`7` 会替换它。点击仍会将光标放在其落点。没有 `formatValue` 的字段不变。无 API 变更。（#9033）
- 跟随 `Outline` 链接会将焦点移到所选章节，如同原生页内链接移动焦点起点，因此下一次 Tab 会从该章节继续，而不是跳回页面顶部。章节会在不滚动的情况下获得焦点，因此 Outline 自身的滚动不变（WCAG 2.2 SC 2.4.3 Focus Order）。（#9045）
- 在 `Drawer`、`MobileNav` 或 `Lightbox` 内关闭文件选择器（Escape 或选择器中的 Cancel）不再关闭它并丢失其中的内容。只有向表面本身触发的关闭请求才会关闭它，如同 `Dialog` 和 `BottomSheet` 已做的那样。（#8855）
- 在服务器上打开的 `Dialog`、`Drawer` 或 `BottomSheet` 现在会在 hydration 之前渲染为关闭，并在 hydration 后立即在原地打开，没有入场动态效果，如同页面加载时存在的任何内容一样；其后续打开和关闭仍像之前一样有动画。此前，它会在活动页面上以 `aria-modal="true"` 绘制为打开但没有模态状态：其下的页面保持可交互，sheet 的不可见宿主可能吞掉点击，辅助技术被告知一个并不存在的模态（WCAG 2.2 SC 4.1.2）。在服务器上设置活动 sheet 的 `BottomSheetSwitcher` 也被涵盖。客户端渲染的覆盖层不变。（#9360）
- 确定进度条在脚本运行时继续移动到其新值。填充动画化其 `width`，这会在主线程上每帧布局和重绘，因此值变化会在页面运行 JavaScript 的整个期间停顿然后跳跃。填充现在横跨轨道，并用浏览器在合成器上动画化的 transform 滑入到位，在 Chromium 和 Safari 中都是如此，每帧不进行布局和绘制。在减少动态效果下，新值现在会在任何指针下立即落定。否则时长、缓动、颜色、标记和从右到左绘制不变（填充随条自身的方向镜像，因此从右到左页面中位于从左到右区域的条仍从左侧填充）；轨道现在在两种模式下都将填充裁剪到圆角轨道，因此在约一个轨道高度以下的填充时，前端会跟随轨道的曲线，而不是绘制更窄的全高胶囊，运行时改变条的方向会让填充滑到另一侧而不是跳到那里。（#8196）
- 禁用的 `RadioListItem` 不再运行调用者的 `onClick`（`spec:AST-085` FR2）。此前，用 `disabledMessage` 禁用的组中的单选按钮通过 `aria-disabled` 而不是原生 `disabled` 保持可聚焦，因此浏览器不会使其静默，处理器仍会在点击单选按钮、按 Space 以及方向键移到它时运行。它仍拒绝选择。启用的单选按钮不变：其 `onClick` 仍会运行。（#9120）
- RadioList：用 `disabledMessage` 禁用的组会将原因作为每个单选按钮的描述（`aria-describedby`）提供给它们，也会提供给单选按钮组，因此屏幕阅读器会在聚焦的单选按钮上播报它。单选按钮自己的描述排在前面。（#9169）
- RadioList 和 Switch：必需字段在用户回答之前不再被屏幕阅读器读作 “invalid entry”。每个必需单选按钮和必需开关从 `status` 获取其无效状态。（#9042）
- `useResizable`（以及使用它的每个组件，例如 `SideNav`）不再在每次提交渲染后再次读取窗口大小。该读取会在每次提交中强制整个页面布局，因此在带有 `SideNav` 的 `AppShell` 下切换标签会在慢设备上付出代价。窗口仍在渲染期间读取，每个大小、边界和报告的最大值都不变。（#8857）
- 当 header 是节点（例如 `<span>Amount (EUR)</span>`）时，`Table` 列调整大小手柄现在按列的可见文本命名，而不是按列键命名。列键仅在没有文本的 header 中作为后备。（#9057）
- `useScrollOverflow` 在容器内容变化而容器保持大小时会重新测量：添加、移除或调整子元素大小，或新的 gap 或 padding。Carousel 的滚动区域（仅在其内容溢出时才是 Tab 停靠点）及其边缘按钮和淡化会跟随添加或移除的幻灯片以及变大的幻灯片；TabList 的淡化以同样方式跟随其标签页。（#8155）
- SegmentedControl：用 `disabledMessage` 禁用的控件会将原因作为每个分段的描述（`aria-describedby`）提供给它们，也会提供给组，因此屏幕阅读器会在获得焦点的分段上播报它。控件还始终保留一个 Tab 停靠点：选中的分段，即使它本身被禁用，否则是第一个自身未禁用的分段，再否则是第一个。（#9176）
- SegmentedControl：禁用的控件或禁用的选中分段会保留控件的 Tab 停靠点。此前，没有 `disabledMessage` 的禁用控件没有 Tab 停靠点并忽略指针。本身被禁用的选中分段会将停靠点丢给另一个分段，一旦停靠点移到那里，选择第三个分段会将它留在后面，因此 Tab 会重新进入一个未选中的分段。现在选中的分段始终持有唯一的 Tab 停靠点，在禁用时播报为禁用（`aria-disabled`），禁用时无法选择任何内容。（#9314）
- 禁用的 `SegmentedControlItem` 不再运行调用者的 `onClick`（`spec:AST-085` FR2）。此前，该分段拒绝选择，但仍会在点击时调用处理器，并在用原因禁用的组中选中分段按 Enter 或 Space 时调用，该分段保持可聚焦。这涵盖自身 `isDisabled` 禁用的分段和其组禁用的分段。启用的分段不变：其 `onClick` 仍会先运行，仍可通过 `preventDefault()` 取消选择。（#8989）
- Selector、MultiSelector：列表打开时按压另一个字段现在会将焦点留在该字段。此前，列表的关闭处理器会将焦点移回 Selector 的触发器，因此下一个键会发给已关闭的 Selector（一个字母可能通过按类型选择改变其值）。Escape、选择选项或按压不可聚焦的内容仍会将焦点返回触发器，带 `renderTrigger` 的 MultiSelector 仍会在每次关闭时将焦点返回调用者的控件。（#9018）
- 禁用的 `SideNavItem` 保持可聚焦。此前，它渲染带有原生 `disabled` 属性的 `<button>`，因此 Tab 会跳过它，键盘和屏幕阅读器用户无法到达它，而在获得焦点时变为禁用的条目会将焦点丢到页面。现在它暴露 `aria-disabled="true"` 并保留其 Tab 停靠点，而点击、Enter 或 Space 仍不会运行 `onClick`，不会导航，也不会关闭移动抽屉。在折叠轨道中，禁用条目的标签 tooltip 现在会在 Tab 聚焦它时打开，并描述可聚焦控件而不是其行。这满足 spec:AST-085（FR1、FR2、FR4、FR5）中的可聚焦禁用要求。无 API 变更。（#9102）
- 当可折叠的 `SideNav` 折叠并带走键盘焦点时，焦点现在会移动而不是落到页面，键盘或屏幕阅读器用户不会在那里失去位置（WCAG 2.2 SC 2.4.3）。从折叠轨道不渲染的行（例如没有图标的条目），焦点会移到折叠开关，或者当 SideNav 中没有开关时，移到仍在轨道中的最近行。在轨道保留的行上，焦点留在该行；折叠保留或重新渲染为同名控件的 header 或 footer 控件会保留它。从折叠移除或替换为其他名称的 header 或 footer 控件，或 `resizable` SideNav 的调整大小手柄，焦点会移到折叠开关，或者没有开关时移到第一行。折叠未接管的焦点不会被移动。（#9249）
- `resizable` 的 `SideNav` 在折叠或展开时保持其导航和条目挂载，如同普通 SideNav 一样。此前，每次折叠都会重新挂载它们，因此打开的嵌套组会关闭，条目状态会重置。（#9290）
- SideNav（`footerIcons`、`topContent`）、SideNavHeading（`icon`、`headerEndContent`）、SideNavItem（`endContent`）和 SideNavSection（`endContent`）：值为 `0` 的插槽会在其插槽旁显示多余的 “0”，或者完全不显示。现在每个插槽都遵循共享的存在性检查。空值（`null`、`false`、`''`）不渲染插槽，就像省略时一样。`0` 会作为内容渲染在插槽内，包括折叠轨道仅图标的标题及其周围的页脚和顶部区域。（#9498）
- Slider：按压两个重合滑块共享值的标记标签现在会落到上面的滑块，如同按压滑块本身一样，因此从未移动的按压无论落在哪里都会将焦点留在同一个滑块上。此前，按压该标签会落到下面的滑块，而它被上面的滑块覆盖。（#9184）
- Slider：两个滑块位于同一值的范围滑块可以再次被拖开。两个滑块中只有一个能朝指针方向移动：在它们旁边的轨道上按压会选择其所在侧的滑块，在滑块本身上按压会等待指针移动，因此第一次移动的方向会选中滑块，该滑块获得拖动的焦点、按下绘制和值 tooltip。这样的拖动始终跟随指针：一旦指针越过另一个滑块，被拖动的滑块会停靠在它上面，另一个滑块接管拖动，因此第一次朝错误方向漂移的步骤绝不会卡住它。此前，位于最大值的两个滑块无法向下拖动，在两个重合滑块上方的轨道上按压两个都不会移动。（#8151）
- Slider：范围滑块的滑块名称（“Minimum value” 和 “Maximum value”，向屏幕阅读器播报）现在来自消息目录（`@astryx.slider.minimumThumb`、`@astryx.slider.maximumThumb`），因此遵循应用的区域设置。（#9023）
- 已发布的包不再包含仓库测试和基准文件，在不改变导出的情况下减小安装大小。（#9153）
- 更多插槽将 `''`、`false` 和 `true` 视为空，就像 React 渲染它们一样，而不是绘制空包装器：ChatSystemMessage 的 `icon`、Item 的 `startContent`、`endContent` 和 `description`（因此 ListItem 或菜单行不会获得空白泳道），以及 MetadataList 的 `title` 和 MetadataListItem 的 `icon`。`0` 仍计为内容并显示 “0”。（#9204）
- `DropdownMenuGroup` 的 `title` 和 `Badge` 的 `label` 现在使用共享的 `isRenderable` 检查，因此 `null`、`undefined`、`true`、`false` 和 `''` 计为不渲染任何内容，`0` 仍计为内容。`title={true}` 的 `DropdownMenuGroup` 不再渲染为组命名的空标题。`Badge` 不变（感谢 @vjeux，#8236）。其他插槽不变。（#9160）
- 更多插槽将 `''`、`false` 和 `true` 视为空，就像 React 渲染它们一样，而不是绘制空包装器：TreeList 的 `header`（不渲染任何内容的 header 不再命名树，因此保留其 `aria-label`）、TreeList 条目的 `startContent` 和 `endContent`、TopNavMegaMenu 的 `items` 和 `featured`、Table header 的 `after` 内容以及 OverflowList 的测量溢出指示器。`0` 仍计为内容并显示 “0”。（#9206）
- 许多显示内置文本的组件变得更小。每个组件现在只携带自己字符串的英文，而不是每个 Core 字符串，因此像 Button 这样的组件加载约少 7 KB（gzip），Core 中其他地方的新字符串不再使其变大。Table（以及渲染它的 Markdown）、Chat、PowerSearch、CommandPalette 和日期时间输入暂时仍携带每个 Core 字符串。你看到的内容没有变化：每个内置字符串仍显示相同的英文，翻译和覆盖像以前一样解析，`useTranslator`、`InternationalizationContext` 和 `@astryxdesign/core/locales/en.generated.js` 仍可到达每个 Astryx 字符串。（#9429）
- Table、Markdown、Chat、CommandPalette 以及日期和时间输入也变小了。每个现在只携带自己字符串的英文，而不是每个 Core 字符串，每个约少 7 KB（gzip）。PowerSearch 仍携带每个 Core 字符串，因为自定义运算符的 `i18nKey` 可以命名任何 Astryx 键。你看到的内容没有变化：每个内置字符串显示相同的英文，翻译和覆盖像以前一样解析。（#9452）
- TextArea：`0` 的 `startIcon` 会在起始图标插槽旁显示多余的 “0”，且没有为其保留 padding。插槽及其 padding 现在遵循一个存在性检查：空值（`null`、`false`、`''`）不渲染插槽，`0` 像任何其他内容一样渲染在插槽内。TextInput 使用相同检查，没有可见变化。（#9443）
- 在可点击的 `Stepper` 中，禁用的 `Step` 现在保留其按钮：它留在 Tab 顺序中，被播报为不可用（`aria-disabled`），如果在聚焦时变为禁用则保持焦点，但仍不会激活。其描述（不可用的原因）描述该按钮（`spec:AST-085` FR1、FR4、FR5）。此前，它渲染为纯文本，因此键盘和屏幕阅读器用户无法找到它或知道它不可用。（#8867）
- 禁用的 `Switch` 不再运行调用者的 `onKeyDown` 或 `onKeyUp`（`spec:AST-085` FR2）。此前，开关通过 `aria-disabled` 而不是原生 `disabled` 保持可聚焦，因此在它上面按下的键仍会到达这些处理器，而其 `onClick` 已被拒绝。它仍拒绝切换。启用的开关不变：其按键处理器仍会运行。（#9122）
- `Table` 名称说明它们所属的内容（WCAG 2.2 SC 4.1.2 和 2.4.6；`spec:AST-020` FR15 下的 APG 可排序表格模式；`spec:AST-025` FR12）。（#9047）
  - 排序按钮过去命名为 “Sort by Name”，或在多排序中为 “Sort by Name, sorted ascending” 并带 “priority 2 of 3”，而该短语替换了列标题的名称。现在它按列的文本命名，因此标题保留该名称；方向来自标题的 `aria-sort`，当多列排序时，每个按钮由优先级描述（“Priority 2 of 3”）。
  - 滚动区域在每个表格上都是名为 “Table” 的组。现在它采用表格自己的名称（其 `aria-labelledby`，否则其 `aria-label`），只有未命名表格才使用 “Table”。
- TabList：在可滚动条带中按压或通过方向键移到标签页时，不再在按压过程中测量条带。聚焦标签页已经会将其滚动到视图中，因此保持选中标签页完整的检查现在在下一帧运行，而不是在按压绘制之前强制新选择的样式和布局。（#8856）
- Text 和 Heading：未截断文本中的长不可断词、URL 或 ID 现在会换行而不是越过其容器，因此在普通流中，手机宽度页面（320 px）不再横向滚动。普通文本的布局与之前完全相同，截断（`maxLines`）不变。在 flex 行内，flex 子元素仍需要 `min-width: 0`。Text 和 Heading 现在自行设置 `overflow-wrap`，因此你用 `overflow-wrap: anywhere` 样式化的容器不再影响其文本；Astryx 自己的容器（CommandPaletteEmpty、Toast、FieldStatus、Banner）会传递其 `anywhere` 换行。（#9351）
- TextArea：`maxLength` 字符计数器现在来自一条目录消息（`@astryx.textArea.counter`），因此其数字使用区域设置的数字格式，翻译者可以更改顺序或分隔符。在英文中，1,000 或以上的限制现在显示分组数字（`62/2,000` 而不是 `62/2000`）。（#9025）
- TextInput：字段变忙碌时清除按钮不再向内移动。忙碌 Spinner 现在位于清除按钮内侧，如同 Typeahead 和 Tokenizer，因此搜索运行时伸手去按按钮的用户不会按空。无 API 变更。（#9027）
- ProgressBar 目标标记在 tooltip 加载之前将其标签暴露为无障碍名称，同时保留键盘焦点和悬停/焦点 tooltip。（#9276）
- Timestamp 在相对输出上保留调用者的 `aria-label`，并在其 hover card 附加时保留调用者的 `tabIndex`。此前，完整日期名称和卡片的 Tab 停靠点会覆盖它们，因此为上下文命名的 timestamp（例如 “Posted 5 minutes ago”）丢失了该名称，被移出 Tab 顺序的 timestamp 又回到其中。没有调用者值时没有变化。（#8726）
- Toast：由回退视口（没有 `LayerProvider`）显示的 toast 内容中的 `Theme` 现在只为其自己的子树设置主题。它不再像应用的根 `Theme` 那样重写页面的 `<html>` 主题。首次修复于 #5617。（#9253）
- 在 `maxVisible` 下新 toast 占据其可见位置时正在关闭的 toast，或同一处理器推出然后关闭的 toast，会立即离开堆栈。此前，它稍后会作为不可见的空行回来，保留通知地标，占据一个可见位置，并让 F6 将焦点移到其隐藏的关闭按钮。在同一处理器中与第一个 toast 一起触发的具有相同 `uniqueID` 的第二个 `collisionBehavior: 'ignore'` toast 现在会被无声丢弃，就像第一个渲染后它已经如此一样。当 toast 内的控件触发 toast 然后关闭自己的 toast 时，焦点会移到显示的 toast（包括新的 toast），而不是通知区域。（#8051）
- Toast：当任何暂停条件仍成立时，toast 的自动隐藏计时器保持暂停。此前，指针离开卡片、焦点离开它或窗口重新获得焦点会恢复计时器，即使另一个条件仍处于活动状态，因此 toast 可能在焦点位于其操作上或指针悬停其上时隐藏。焦点在 toast 自己的控件之间移动也会使其保持暂停。（#9016）
- Toast：通过 Tab 或点击到达最后一个 toast 后关闭它，会将焦点返回到之前的位置，而不是丢到页面。（#9039）
- 调用者的 `aria-pressed` 或 `data-is-pressed` 不再替换 `ToggleButton` 所反映的按下状态（`architecture:public-component-api` INV5，`ToggleButton` FR12）。此前，调用者 props 最后展开，因此传递任一属性会让辅助技术和主题规则看到与 `isPressed` 不匹配的状态。`ToggleButton` 现在拥有 `aria-pressed` 以及反映的 `data-is-pressed` 和 `data-elevation`。其他调用者 `data-*` 属性仍会到达根。（#9159）
- `ToggleButtonGroup` 接受 `className`、`style`、`id`、`aria-*`、`data-*` 和事件处理器，并将它们传给其组元素。组保留自己的 `role`、`aria-label` 和主题目标。（#9040）
- 禁用的 `Token` 在每种结构中都会在 `token` 主题目标上反映其状态（`data-disabled`），因此主题可以为其设置样式。禁用的链接 token 保持可聚焦的链接并播报为禁用（`aria-disabled="true"`，无 `href`），而不是变成没有 Tab 停靠点的纯文本。（#9037）
- 带 `href` 的 `Token` 现在会调用调用者的 `onClick`（`architecture:public-component-api` INV5，`Token` FR3）。此前，只要 `href` 使 token 成为链接，`onClick` 就会被丢弃，因此处理器从不在点击时运行。这涵盖链接 token 和带移除按钮的链接 token：在 token 表面上普通点击会运行处理器一次，在表面上 Cmd/Ctrl-click 或中键点击会在新标签页打开链接而不运行它，点击 Remove 按钮不会运行它。导航不变，在处理器中调用 `preventDefault` 仍会停止导航。（#9205）
- 内联 `Tokenizer` 的 Clear all 按钮会像触摸 sheet 一样播报一次 “All items removed”，因此屏幕阅读器用户会得知选择已清空。`PowerSearch` 的 Clear all 播报其自己的措辞 “All filters removed”。（#9038）
- Tokenizer：内联创建行现在从 `@astryx.tokenizer.create` 消息获取其 `Create "…"` 标签，与底部 sheet 使用的消息相同，因此遵循 provider 的区域设置而不是始终用英文读取。修复 #8931。（#9029）
- Toolbar 中的链接（例如带 `href` 的 Button）现在共享工具栏的单一 Tab 停靠点。方向键会像任何其他控件一样到达它，它不再为该行添加第二个 Tab 停靠点。（#8921）
- Tooltip：在默认 `focusTrigger="auto"` 下，键盘焦点会打开 tooltip 附加时不在 Tab 顺序中的触发器的 tooltip。Toolbar 或 ButtonGroup 中在挂载后才设置 `tooltip` 的 Button 或 IconButton，或以 `tabindex="-1"` 渲染的任何 roving-tabindex 成员，现在会在方向键到达它时显示其 tooltip。焦点是否计入在到达时决定，因此旧检查错过的可聚焦触发器（例如 `<summary>`）也会打开。不可聚焦触发器内部的焦点仍不会打开它。（#9366）
- 在打开的 Tooltip 或 HoverCard 内点击不再激活其触发器周围的卡片、行或字段：FileInput 不再打开其文件选择器，ClickableCard、SelectableCard、Token 或 Item、TreeList 或 Table 行不再激活。HoverCard 内的链接和按钮仍可工作。（#9252）
- `TopNavMenu` 和 `TopNavMegaMenu` 现在在抽屉模式下将其 `ref` 转发到触发器按钮（`architecture:public-component-api` INV8）。此前，只有桌面 popover 触发器收到 ref，因此当菜单在移动抽屉内渲染时，调用者的 ref 保持为空。应用无需更改代码；桌面触发器和每个其他 prop 不变。（#8897）
- TopNavMegaMenuFeaturedCard：在从右到左布局中，链接箭头现在指向行内末端（左侧）而不是向后。链接的文本和无障碍名称不变。（#9317）
- TopNav（`heading`、`startContent`、`endContent`）、TopNavHeading（`logo`、`headerEndContent`）、TopNavMegaMenuItem（`icon`）、TopNavMenu 抽屉条目的 `icon` 和 NavHeadingMenuItem 的 `description`：值为 `0` 的插槽会在其插槽旁显示多余的 “0”。现在每个插槽都遵循共享的存在性检查。空值（`null`、`false`、`''`）不渲染插槽，就像省略时一样：空的 `centerContent` 或 `startContent` 不再将栏切换到其居中布局、显示移动栏菜单开关或打开空的抽屉区域。`0` 会作为内容渲染在插槽内。（#9500）
- 在主指针为精细指针（鼠标、触控板、触摸屏笔记本电脑、桌面数位板）的地方，按压反馈控制器不再注册触摸监听器：它在第一次手指或笔按压时读取主指针，并且仅在该指针为粗略指针时保留其 `touchcancel` 监听器。（#8360）
- 当 `TreeList` 行在其子项内有键盘焦点时折叠，例如由 `items` 变化触发，焦点会移到该行（嵌套行一起折叠时移到最外层行），该行随后持有树的 Tab 停靠点，除非它被禁用（禁用行会获得焦点，如果折叠移除了持有停靠点的行，停靠点会移到树的第一个启用行）。此前，获得焦点的行消失，没有任何元素持有焦点，因此键盘或屏幕阅读器用户会失去位置（WCAG 2.2 SC 2.4.3）。其他位置的焦点不会被移动。（#9251）
- ChatComposerInput 的触发菜单通过 Core 的共享忙碌播报来播报其 “Searching…” 行，像其他忙碌控件一样：每次搜索一次，键入继续时不重复，结果先到时完全不播报。在应用不使用 Astryx 渲染的原生模态 dialog 内，现在会在该 dialog 内听到它。（#9154）
- `Typeahead` 和 `Tokenizer`：搜索来源被替换后，在关闭的字段上按 ArrowDown 会加载新来源（其焦点条目，或针对它的键入查询），而不是打开旧来源的列表。（#9166）
- 因原因禁用（带 `disabledMessage` 的 `isDisabled`）的 `Typeahead` 或 `Tokenizer` 不再从 ArrowDown 或点击打开其结果。以这种方式禁用的 `Typeahead` 也不再接受 Enter 或按压的选择，即使来自它变为禁用之前已打开的列表（`Tokenizer` 已经拒绝这些）。Escape 或 Tab 仍会关闭这样的列表。（#9036）
- Typeahead、Tokenizer、PowerSearch：禁用字段保留其 Tab 停靠点。此前，没有 `disabledMessage` 的禁用字段渲染原生禁用的输入，因此 Tab 会跳过它，通过焦点移动的屏幕阅读器用户永远到不了它。现在输入被播报为禁用（`aria-disabled`），保持只读，不打开也不选择任何内容，并在键盘焦点下显示焦点环。字段变为禁用时仍在进行的搜索会被丢弃：它不打开、不播报也不旋转。带 `tokenOverflowBehavior="unfocusedLayer"` 且没有 `disabledMessage` 的 Tokenizer 或 PowerSearch 暂时保留其原生禁用的输入。（#9275）
- 按类型选择在所有区域设置中忽略重音。按 `d` 现在可到达 “Đào”，`a` 可到达 “Ánh” 和 “Åsa”，`n` 可到达 “Ñandú”，`l` 可到达 “Łódź”，`ı` 现在可到达 “Isparta” 和 “İzmir”。这适用于关闭的 Selector 以及打开的 DropdownMenu、ContextMenu、MultiSelector 和 TreeList 列表，还适用于公共 `useTypeahead` 和 `useTreeFocus` hooks。此前，不带重音符号键入的键会跳过每个以带符号字母开头的条目。匹配忽略大小写、组合重音 U+0300–U+036F、带笔画字母 đ ł ø ħ ŧ ƀ 以及土耳其语带点和不带点 i。它在每种区域设置中的工作方式相同，因为按类型选择是导航，不是排序。当你键入带重音的字母本身时，精确匹配排在前面。对于土耳其语，ı 与 I 配对，İ 与 i 配对。先键入的组合标记会被忽略；在字母后键入时，它是该字母的一部分。排序和搜索筛选不变。这满足 `architecture:internationalization` INV17。无 API 变更。（#8864）
- 在 Typeahead 或 Tokenizer 自己的文本输入框或其按钮上按压不再关闭其打开的列表。点击两个字母之间以修正拼写错误会移动光标并保持匹配显示；页面其他位置的按压仍会关闭列表，Escape 仍会关闭。（#9367）
- `Tokenizer`：打开的列表会在 token 变化时重新加载，因此显示当前选择而不是旧的——用其按钮移除的 token 会再次提供，从外部设置的值不再列出。（#9416）
- 有值时，`Typeahead` 的 Tab 停靠点是值的 token 按钮（WCAG 2.2 SC 2.4.6 和 4.1.2）。它过去仅由值命名（“Apple”），因此屏幕阅读器用户无法分辨它属于哪个字段。现在它由字段标签和值命名（“Fruit Apple”），并由字段的描述和状态描述。（#9049）
  可点击的 `Token` 过去将 `aria-labelledby` 和 `aria-describedby` 传给其根，而根是通用元素，它们在那里不命名任何内容。现在它将其传给内部按钮，即拥有其操作的元素。其他每种结构都将它们保留在根上。

- useTheme：`mode` 始终是 `'light'` 或 `'dark'`。`light | dark | system` 之外的模式（例如过时的持久化偏好）现在会像 `'system'` 一样通过操作系统偏好解析，而不是按原样返回。首次修复于 #5617。（#9254）
- 用鼠标拖动选择器滚轮现在会在按钮释放时提交值，如同手指拖动一样。此前，滚轮在按钮仍按下时提交它经过的每一行，因此在 DateInput 中月份和年份滚轮后面的日历会在手下改变。这适用于 TimeInput、DateTimeInput 和 DateInput 底部 sheet 中的滚轮。触摸、按键和点击一行不变。（#8483）

#### 性能

- Calendar、DateInput 以及其他日期组件现在按 locale 和格式共用一个日期格式化器，而不是为它们显示的每个标签都构建一个，因此渲染一个月（42 个日期标签）不再构建 42 个格式化器。（#8335）
- 带 `autoSaveId` 的 `useResizable`（以及带 `resizable={{autoSaveId}}` 的 `SideNav`）现在只在拖动结束时把拖动后的尺寸保存到 `localStorage` 一次，而不是在每次指针移动时保存。此前每次写入都会以 `storage` 事件的形式到达站点的每个其他打开的标签页，因此一次拖动会发出几十次写入。存储键、存储格式以及最终保存的尺寸均未改变，键盘步进、`resize()`、`collapse()` 和 `expand()` 仍会立即保存。（#7782）
- Table：当表中没有任何内容依赖行的位置时，重新排序不再重新渲染每一行，行只是移动位置。在 1,000 行的表上，这大约是一次排序点击工作量的十分之一。这适用于设置了 `idKey`、既未设置 `rowCount` 也未设置 `rowIndexStart`、并且既不使用 `useTableRowIndex` 也不使用会转换正文行的插件（选择、行展开、分组行、树形数据）的表。那些表在排序时仍会重新渲染其行。（#9234）
- 同时挂载许多被截断的 `Text` 和 `Heading` 元素的页面现在挂载得更快。此前每个元素都要在 React 仍在提交页面时测量其文本是否溢出，因此每次测量都会强制进行一次自己的样式和布局计算；现在它们在提交之后一起测量，页面只需读取一次布局。省略号、行钳制和全文 tooltip 均未改变。（#9013）

#### 文档

- BottomSheet 手势和移动端键盘代码中的源码注释更简短，只解释不明显的原因。使用者导入或渲染的内容没有任何变化。（#9524）
- BottomSheet 和 BottomSheetSwitcher 中的源码注释更简短，只解释不明显的原因。使用者导入或渲染的内容没有任何变化。（#9523）
- 组件规范不再随 npm 包一起发布；它们存放在仓库的 `docs/specs/components/` 中，每个组件一个文件夹，与各平台的规范放在一起。`astryx swizzle` 不再把组件的规范文件复制到你的项目中。使用者导入或渲染的内容没有任何变化。（#9007）
- FileInput 的 `statusVariant` 文档说明 dropzone 模式不支持 `attached`；在那里应使用 `detached` 或 `tooltip`。本版本的渲染没有变化。从下一个次要版本开始，dropzone 会把 `attached` 解析为 `detached` 并默认使用它。（#9258）
- gesture arena 和 gesture host 的内部文档注释现在位于它们所描述的声明上。（#9114）
- Grid 的 `align` 和 `justify` 文档不再声称默认值为 `'stretch'`。未设置时，它们保留浏览器默认值 `normal`，该值会拉伸没有自然尺寸或宽高比的项。渲染没有变化。（#9347）
- GridSpan：补充记录 `xstyle`、`className`、`style` 和 `ref` 属性，包括设置的 `columns` 或 `rows` 会替换 `style` 中相同的网格放置。（#9312）
- Heading：补充记录 `xstyle`、`className`、`style` 和 `ref` 属性，包括大于 1 的 `maxLines` 会替换 `style` 中传入的任何 `WebkitLineClamp`。（#9328）
- core hooks 中更多的源码注释更简短，只解释不明显的原因。使用者导入或渲染的内容没有任何变化。（#9520）
- core hooks 中的源码注释更简短，只解释不明显的原因。少量 hook 文档注释做了改写。使用者导入或渲染的内容没有任何变化。（#9514）
- HoverCard：在每种文档语言中补充记录 `xstyle`、`className`、`style` 和 `isOpen` 属性，说明文本触发器会被自动包裹、元素触发器不需要 ref，并说明 `hasHoverIndication` 仅适用于文本触发器。（#9536）
- HStack：说明项遵循书写方向（RTL 中从右到左），显式的 `hAlign` 或 `vAlign` 优先于其 `justify` 或 `align` 别名，并补充记录 `className`、`style` 和 `ref` 属性。（#9540）
- 记录了本版本完成的组件契约更新。
  涵盖的记录：#8783、#8822、#8878、#9050、#9058、#9062、#9081、#9083、#9090、#9096、#9100、#9101、#9103、#9105、#9108、#9111、#9112、#9113、#9117、#9118、#9124、#9125、#9127、#9128、#9129、#9131、#9132、#9133、#9135、#9158、#9175。

- Stack、VStack 和 StackItem：说明水平堆栈遵循书写方向（RTL 中从右到左），并补充记录 `className`、`style` 和 `ref` 属性，以及 VStack 和 StackItem 上的 `xstyle`。（#9583）
- core 工具中更多的源码注释更简短，只解释不明显的原因。使用者导入或渲染的内容没有任何变化。（#9527）
- core 工具文件中的十处源码注释更简短，只解释不明显的原因。使用者导入或渲染的内容没有任何变化。（#9522）

#### 其他变更

- 内部：触摸呈现（touch presentations）的动画器会在帧回调中重新检查已完成动画的结束状态，从结束前一帧开始，并在还剩最多两帧时再次检查，而不是只依赖定时器（已加载的页面可能会让定时器晚一帧或两帧运行），因此到达曲线终点的帧会在绘制前丢弃动画，除非启动这些重新检查的定时器本身晚于一个帧以上运行。对于不绘制任何帧的页面，定时器仍会保留。不从包入口点导出。（#9285）
- 内部：触摸呈现的动画器让每个动画对曲线终点的帧回调重新检查各自独立，因此仍在等待被替换动画的重新检查不再代替下一个动画的检查，后者此前会退回到其定时器。不从包入口点导出。（#9325）
- 内部：触摸呈现的动画器在浏览器尚未告知页面启动时（Chromium 会晚一帧或更多才报告合成器启动），在静止状态下于任务中发起的调用会在其后的第一个帧开始，因此在那个窗口内的重定向或重定基会从屏幕上的值继续，而不是从曲线起点重放曲线。在帧回调中发起的调用，或其第一帧出现在阻塞之后的调用，会保留浏览器的启动时间。不从包入口点导出。（#9255）
- AppShell 删除了一个卸载 Effect，它重复了 main 的 ref 已经执行的释放操作；main 的溢出观察和键盘委托仍会在卸载时释放。行为没有变化。（#9262）
- 内部：手势识别器和菜单按压模型共用一个保护机制，用于处理手势已经生效后浏览器产生的点击，在 400ms 内或直到下一次按压之前将其吞掉。键盘和辅助技术的点击（`detail` 为 0）始终放行。（#8360）
- 内部：触摸运动表把 `spec:AST-094` FR4 指定的三个上下文菜单弹簧（`springs.contextMenuLift`、`springs.contextMenuDismiss` 和 `springs.contextMenuMorph`，新增一行，响应时间 0.3 s、阻尼比 0.8）注册为内部运动角色，因此注册的角色重新符合 FR4 的要求。公开内容没有任何变化：主题不会设置运动角色，目前也没有已发布的组件读取这些弹簧。（#9432）
- FileInput 的源码已按仓库的 Prettier 设置格式化。行为没有变化。（#9263）
- 内部：在手指移动时取消自身的手势（长按被拖出容差范围）会保持对该手指的占用，直到手指抬起，因此页面不会在中途接管拖动；静止的手指在其手势被取消时仍会归还。不从包入口点导出。（#8076）
- 内部：手势系统的 touch-action 推导、原生滚动探测和触觉反馈。不从包入口点导出；目前没有组件使用它们。（#8071）
- 内部：手势 hooks 在卸载后不再回调任何内容；`usePressTracker` 默认随宿主一起制动，并只保留一个跟踪器，因此选项变化或新的 ref 永远不会丢掉进行中的按压；识别器的 arena 管道为 `protected`。不从包入口点导出。（#8360）
- 内部：评审后的 gesture host 修复。被占用的笔只持有自己的触控笔触摸，手指会沿着扁平树（穿过 slot 和 shadow root）匹配到它的滚动容器、目标和移动中的元素。不从包入口点导出。（#8360）
- 内部：gesture host 成为唯一的文档级触摸所有者：手指计数、触摸门控，以及为持续跟踪控件保留的按压，其元素会获得 `touch-action: manipulation`。滚动锁的页面保持和手指滚动监视保留自己的监听器，只向宿主询问它拥有的触摸。第二根手指会让尚未占用的单指平移失败，以便页面可以捏合缩放。滚动边缘平移会从第一次离开边缘的移动开始占用一根孤立手指（该边缘是所有其下滚动器所在的边缘），因此这些移动会在开始前被取消；屏幕任何位置出现第二根手指时，页面仍保留其捏合。其保持动作会生效的按压跟踪器（步进器的保持重复）可以像识别器一样为其按压带来选择锁。内部使用，供采用它们的触摸组件使用；不从包入口点导出。（#8360）
- 内部：手势系统的 DOM 宿主（占用、点击抑制、浏览器接管、联系人背后的指针），以同样的方式服务鼠标、笔和手指，在主指针正常时空闲状态下没有页面监听器。不从包入口点导出；目前没有组件使用它。（#8071）
- 内部：UIControl 按压跟踪，带有 control 和 cell 配置文件以及手势 hooks。不从包入口点导出。（#8076）
- 内部：供组件作者阅读的手势系统 README，附有在 Chromium 和 WebKit 中的浏览器验证。（#8076）
- 内部：评审后的手势识别器和 arena 修复；平移在 10 pt 开始之前不占用任何东西；每个手势使用一个速度跟踪器（`spec:AST-100`：UIKit 的实测混合、滚动表面通过平移的 `scrollVelocity()` 释放，以及 FR2 的释放规则）。不从包入口点导出。（#8360）
- 内部：滑动、捏合和屏幕边缘平移手势识别器。不从包入口点导出；目前没有组件使用它们。（#8061）
- 内部：以 `claimsTouches: false` 创建的识别器是一个观察者：仅使用被动监听器，与每个识别器同时存在，并跟随浏览器为滚动接管的触摸直到抬起。不从包入口点导出。（#8360）
- 内部：当 gesture host 服务每一个指针时，按压跟踪器会把鼠标按压当作一次按压，立即绘制且没有滚动制动（AST-094 FR11）；手指或笔的保持操作会在任何主指针下保持文本不被选中，包括触摸屏笔记本电脑，而鼠标保持其原有行为（FR41）；当浏览器发送 Touch Events 但不暴露 `ontouchstart` 时，手指只被读取一次；来自 FR43 之前的 `perEventPointer` 会被接受且不执行任何操作。不从包入口点导出。（#8360）
- 内部：手势识别器通过同一个共享流在 window 的捕获阶段监听页面范围内的输入，因此应用在 window 捕获阶段的 `stopPropagation`，或在 Core 之前注册的 document 捕获阶段 `stopImmediatePropagation`，不再能向它们隐藏触摸；必须在手势中途占用触摸的识别器仍需要该触摸到达其元素。每种事件类型的监听器都是被动的，除非订阅者取消它（gesture host 的 `touchend` 和 `contextmenu` 在附加了占用型识别器或按压跟踪器时，页面保持的 `touchmove` 在保持期间，以及点击防护的 `click` 在其武装期间，以及从菜单按压模型第一次武装开始），因此充满可按压元素的页面不会注册任何可能阻止滚动的监听器。（#8360）
- 内部：ChatLayout 删除了一条没有任何条件会触发的滚动条样式规则，Popover、Table 和按压反馈控制器各自通过一个共享名称读取内部标记，而不是第二份手写的副本。没有可见或行为上的变化。（#9256）
- Item、Token 和 ChatComposer 不再自行检查打开中的 Tooltip 或 HoverCard 内部的按压；图层根已经阻止这些按压到达它们。行为没有变化。（#9531）
- 内部：`useLongPress` 的默认持续时间和容差（500ms，每个轴 10px）与长按手势识别器来自同一来源，因此 ContextMenu 的长按行为与之前相同。在 DropdownMenu 触发器上按住的手指则改为传入自己的 13px 允许量（参见触发器漂移修复）。（#8360）
- 底部面板 DropdownMenu 的内部 sheet 预加载会在其结果中报告加载失败，并带上加载器的错误，而不是用空处理函数捕获它。调用方没有任何变化：失败的预加载仍不会引发未处理的拒绝，下次打开时会加载 sheet 的操作。（#9069）
- 在键盘关闭后恢复 Tall BottomSheet 的内部位置。（#8742）
- 内部：打开中的模态框内的播报路由通过 Core 的共享 MutationObserver 监视每个对话框的 `open`、`inert` 和 `aria-hidden`，因此任意数量的打开模态框共用一个观察器，而不是每个各用一个。路由没有变化。（#9151）
- 日期选择器的月份滚动器直接附加和移除它的四个输入监听器，每个监听器共用一个 options 对象，而不是循环遍历事件名数组并在每次附加时创建 options 对象。行为没有变化。该滚动器及其监听器来自 @vjeux 的月份滚动器修复。（#9146）
- 内部：运动角色测试的标题和 motion README 的文件表列出了内部运动角色，正好是 `spec:AST-094` FR4 所列的那些。仅文档；没有行为变化。（#8502）
- MultiSelector 的源码已按仓库的 Prettier 设置格式化。行为没有变化。（#9247）
- 内部：当 Tab 将焦点移入带有 `formatValue` 的 NumberInput 时，焦点处理器本身会把可编辑文本放入输入框并选中它，而不是等待下一次渲染的 layout effect。行为没有变化：输入仍会替换整个数字。（#9150）
- 一个内部的 `usePresentation` / `readPresentation` 会把组件的 `presentation` 属性解析为要渲染的表面以及其触摸输入模式是否适用，使省略的值与显式的 `'popover'` 保持不同，以便调用方的选择始终优先于触摸默认值。不从包入口点导出。（#8298）
- 在 iOS 上，对合成器动画器正在移动的元素的触摸会到达绘制出来的位置：动画器报告每个移动元素相对于其布局盒的偏移量，gesture host 会把触摸、按压边界和点击的 click 发送到那里，而不是发送到 iOS WebKit 命中测试的布局位置。（#8360）
- 内部：在减弱动态效果（Reduce Motion）下，一个指定等待中的下沉（dip）返回的不透明度且没有位移的调用，会加入该下沉，而不是再次让元素淡出；`reducedMotionFade()` 会在其播放处以注册的运动角色解析交叉淡入淡出的曲线。不从包入口点导出。（#8076）
- `useResizable` 的尺寸解析、边界解析、钳制和吸附、已保存尺寸的存储以及内容盒测量都原样移动到一个内部模块中，因此后续的工厂会像该 hook 一样精确地解析、钳制、吸附和保存。行为没有变化。（#9197）
- `Tokenizer` 通过回调 ref 和 Clear all 确认的关闭处理器在其控件之间传递焦点，而不是通过 effect，符合 `architecture:react-component-runtime` INV2 和 INV6 的要求。焦点的落点没有变化。呈现切换和 sheet 是内部的（尚未公开）。感谢 @imdreamrunner（#7977）。（#9162）
- 内部：gesture host 会把识别器自己的 `selectionLock` 应用到该识别器的联系人上，本身不导入任何锁；长按只有在有保持动作时（`minimumPressDuration` 大于 0）才会带来一个，`selectionLock: null` 则选择退出。不从包入口点导出。（#8360）
- 内部：core 的触摸样式键保持字面量，并且有一项测试把每一个都固定到触摸呈现解析器的常量（`touchKeys`，core 内部）。导入的 `defineConsts` 键编译后的 StyleX 优先级与相同的字面量不同。没有公开导出，也没有样式变化。（#8331）
- 内部：触摸呈现的动画器驱动伪元素，例如对话框的 ::backdrop：静态填充动画在曲线结束和 `set` 之后保持其值，其宿主上的自定义属性会提升它，而 Reduce Motion 下沉会借用并归还伪元素自身的不透明度。不从包入口点导出。（#8522）
- 内部：手势 hooks 的附加与释放生命周期 `useAttachment` 移到 `hooks/`（不导出），其他 hooks 可以在那里使用它，`useFingerScroll` 通过它保留其手指滚动监视，而不是自己复制一份该生命周期。手势同步辅助函数仍留在 `gestures/gestureSync.ts`。行为没有变化。（#9414）
- 内部：`useFingerScroll(scroller)` 区分手指的滚动和程序的滚动，gestures README 新增了一份将原生触摸拖动迁移到识别器的指南。触摸组件内部：不从包入口点或 gestures barrel 导出。（#8360）

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @cixzhang
- @czarandy
- @divyanshudhruv
- @duytbp
- @harjothkhara
- @HelloOjasMutreja
- @humbertovirtudes
- @imdreamrunner
- @korkt-kim
- @kyu-rong
- @nynexman4464
- @parinith-web
- @rubyycheung
- @vjeux

---

# 0.7.5

#### 新功能

- 状态颜色在其出现的所有地方都清晰可读，Info 也成为了独立的状态。每种状态（info、success、warning、error）现在都有一个带内容的强填充色（`--color-<status>`，内容使用 `--color-on-<status>`，对比度至少 4.5:1）、一个带内容的浅填充色（`--color-<status>-muted`，内容使用 `--color-on-<status>-muted`），以及用于页面和卡片的可读文本色（`--color-text-<status>`）。状态图标（`--color-icon-<status>`）和边框（`--color-border-<status>`）默认使用可读文本色。Info 角色（`--color-info`、`--color-on-info`、`--color-info-muted` 等）是新增的，不再借用你的强调色。

  `--color-success`、`--color-warning` 和 `--color-error` 以及 `bg-<status>` 保持作为强填充色的含义。在 Tailwind 中，`bg-info`、`bg-info-muted`、`text-on-<status>`、`text-on-<status>-muted` 和 `text-status-<status>` 是新增的；`text-`、`decoration-`、`placeholder-` 和 `caret-<status>` 现在使用可读文本色调，`border-`、`divide-`、`outline-` 和 `ring-<status>` 使用边框色调，而 `bg-`、`accent-`、`fill-`、`stroke-<status>`、阴影和渐变保持强填充色。例如，Core 浅色主题的 `text-warning` 现在是 `#753F07`，而不是 `#E9AF08`。若要保留文本上的填充色，请写 `text-[var(--color-warning)]`。

  屏幕上会发生的变化：

  - Core 深色 Error 内容（`--color-on-error`）现在是 `#0A1317` 而不是白色，因此深色模式错误填充上的文本达到 4.5:1。Core 的 Info Badge 使用 `#0064E0` 而不是强调色（深色模式下为 `#2694FE`）。
  - 状态图标（Icon `color="info|success|warning|error"`）、Stepper 状态字形和 Chat 工具调用状态图标使用可读音调。Core 浅色 success 图标现在是 `#09441F`，而不是 `#0D8626`。
  - Input 和 FileInput 的状态边框使用边框色调。Core 浅色 warning 边框现在是 `#753F07`，而不是 `#E9AF08`，Butter 的浅色 success 和 warning 输入边框达到 3:1。
  - Banner 用 on-muted 颜色绘制其标题、描述、图标和控件，并用 `--color-info-muted` 填充 Info。
  - 状态填充在强制颜色模式下保持可见的边缘。
  - Chocolate 和 Matcha 的 success 和 error 填充上的内容，以及 Stone 的 success、warning 和 error 填充上的内容，现在达到 4.5:1。
  - 每个第一方主题都设置了蓝色 Info。Chocolate 和 Matcha 的 Info Badge 从强调色改为该蓝色；Butter 保留自己的 Info Badge 颜色。
  - Neutral 的 `--color-success`、`--color-warning` 和 `--color-error` 现在就是其 Badge 已经显示的填充色，其 `--color-info` 是 `#0074E2`（深色模式下为 `#6D9CFE`）。其 Badge、StatusDot、进度填充和 Stepper 徽章看起来相同；其强调色 ProgressBar、StatusDot 和 Stepper 现在使用 Neutral 的强调色，而不是蓝色。
  - Neutral 不再定义其未记录的本地状态令牌。请改用标准角色：`--astryx-theme-neutral-color-status-fill-success`、`-status-fill-warning` 和 `-status-fill-error` → `--color-success`、`--color-warning`、`--color-error`；`-status-muted-accent` → `--color-info-muted`；`-on-tint-neutral` → `--color-neutral`；`-on-tint-overlay-*` 和 `-destructive-overlay-*` 令牌 → `--color-overlay-hover` 和 `--color-overlay-pressed`。`--astryx-theme-neutral-color-status-fill-accent` 保留其值，但已弃用。

  自定义主题会获得它们未设置的内容和文本角色：这些角色由主题的状态填充派生。若要保留组件之前的颜色，请设置匹配的角色，例如把 `--color-icon-success` 设为旧的 `--color-success`。

- BottomSheet 按打开顺序堆叠。在一个 sheet 之上打开的模态 sheet 现在位于其上方：下面的 sheet 保持其状态，稍微后退，并在重新回到顶部之前无法使用；只有一个背景遮罩使页面变暗；Escape、点击背景、滑动或系统关闭手势只关闭最顶层的 sheet。关闭最顶层 sheet 会把焦点返回给下面的 sheet，关闭整个堆栈则会把焦点返回一次，回到流程开始的地方。另一个 sheet 内容中的 sheet 现在会随它一起关闭。非模态 sheet（`hasScrim={false}`）永远不会堆叠。属性没有变化，单个 sheet 的行为与之前相同。
- 多步骤 sheet 流程不再需要包装器。当最顶层的 BottomSheet 关闭且另一个在同一次更新中打开时，例如来自一个指定打开步骤的 state 值，新的 sheet 会替换旧的 sheet：它升起到位，背景保持稳定，焦点移入新的 sheet，之后关闭流程时焦点返回到打开它的任何东西。当步骤变化来自正在关闭的 sheet 内部时（例如它自己的 Continue 或 Back 按钮），就会发生这种情况。非模态 sheet（`hasScrim={false}`）以相同方式互相替换，并且现在会打开在浏览器顶层中所有页面内容之上，而不是依赖 `z-index`。
- `BottomSheetSwitcher` 和 BottomSheet 的 `sheetId` 属性已弃用，并会继续工作到未来的某个次要版本。请把每个步骤写成自己的 `BottomSheet`：
  1. 用单个 `step` state 值替换 `activeSheet` / `onActiveSheetChange`。
  2. 在每个步骤上，把 `sheetId="id"` 替换为 `isOpen={step === 'id'}` 和 `onOpenChange={isOpen => !isOpen && setStep(current => (current === 'id' ? null : current))}`。
  3. 移除 `BottomSheetSwitcher` 包装器，并把它的 `hasScrim` 移到每个步骤上。
  4. 保留步骤按钮不变，例如 `setStep('next')`。

  若要保持某个步骤打开，请在其 `onOpenChange` 中忽略 `false`（这替代 `onCancel`）；若要保留 Escape 但阻止点击背景和滑动，请使用 `purpose="form"`。使用者的 `aria-label` 会成为每个步骤的 `label`。对话框级别的 `ref`、`id`、`className` 和样式属性没有直接替代品：独立 sheet 的 `ref` 和属性会到达其面板。保留 switcher 的流程与之前一样工作，现在 toast 会显示在流程上方，并支持减弱动态效果。

- Popover 像 DropdownMenu 和 Selector 一样接受 `presentation`：`'popover'`（默认）将其锚定到触发器，`'bottom-sheet'` 在一个由 `label` 命名的模态 BottomSheet 中显示其内容，`'adaptive'` 在手机上使用 sheet，在其他地方使用锚定的 popover。在 sheet 中，`placement` 和 `width` 等定位属性不适用，`xstyle`、`className` 和 `style` 会为 sheet 的面板设置样式。sheet 代码只在其可用时加载。
- 带 `presentation="adaptive"` 的菜单和选择器（DropdownMenu、ContextMenu、MoreMenu、Selector、MultiSelector）以及手机上向下钻取的子菜单现在会根据共享的手机尺寸规则在触摸屏上切换到底部 sheet。恰好 768px 宽的触摸屏现在保留锚定的 popover，横屏手机（宽度大于 768px 但高度小于 500px）现在会得到 sheet。移动了 `md` 断点的主题也会移动这个边界。若要保留固定的呈现方式，请传入 `presentation="popover"` 或 `"bottom-sheet"`，或在 `DropdownMenuSubMenu` 上传入 `presentation="flyout"`。桌面鼠标和键盘用户看不到变化。
- `@astryxdesign/core/theme` 导出 `compactDefinition(widthBreakpoints?)` 和 `DEFAULT_COMPACT_DEFINITION`：一个用于手机尺寸屏幕的共享规则，比主题的 `md` 断点（默认 768px）更窄或高度小于 500px，并带有现成的媒体查询。
- `CodeBlock` 无需配置即可高亮 C、C++、SQL、Rust、Kotlin、Swift 和 Go，因此你只需打包用到的语言。

  其他每一种语言都需要逐个选择启用：

  - 单独导入该语言并作为 `language` 传入，例如从 `@astryxdesign/core/CodeBlock/languages/graphql` 导入 `graphql`。
  - 提供的模块有 `graphql`、`java`、`thrift`、`objectiveC`（路径 `languages/objective-c`）、`toml`、`powershell`、`ruby`、`lua` 和 `dockerfile`。
  - 像 `language="graphql"` 这样的字符串仍然只选择内置语言。

  你自己的语言也以相同方式工作。`createCodeLanguage({name, identifiers, fileExtensions, fileNames, tokenize})` 会从你自己的 tokenize 函数创建一种语言。

  内置 tokenizer 的 gzip 后大小保持在 4,608 字节以内。每个模块最多增加 512 字节，而且只有在你导入它时才会增加。

- `CodeBlock` 接受 `endContent`，用于放置你自己的控件，例如"Run in terminal"按钮。它们位于 Copy 之前，在有标题栏时放在标题栏中，否则放在代码旁边，绝不会覆盖代码。对于单行命令，可以省略标题并传入 `hasLanguageLabel={false}`，得到一行控件在旁边的单行布局。
- CodeBlock 的 `tokenizer` 属性已弃用，改为使用自定义语言：用同一个函数传入 `language={createCodeLanguage({name, identifiers, tokenize})}`。该属性仍然有效。当代码块有固定的 `language` 时，`astryx upgrade` 会重写它，并在无法安全重写的地方留下 TODO 注释。
- `Markdown` 接受 `codeLanguages`，即 CodeBlock 语言列表，因此 Markdown 中的围栏代码也可以使用额外或自定义语言。列出的语言优先于同名的内置语言，`diff-<name>` 围栏会在其之上获得 diff 着色。
- 展开和折叠可以平滑滑动而不是跳变。用 `useAnimatedLayout({containerRef})` 创建一个句柄，并作为 `animatedLayout` 传给 Collapsible 或 TreeList：当其中一个打开或关闭时，该容器内周围的内容会平滑移动到新位置，露出的内容淡入，箭头旋转，全部作为一个动作。固定和粘性元素保持不动，容器永远不会滚动。在减弱动态效果下，触摸时变化会交叉淡入淡出，鼠标下则立即变化。不传该属性时，没有任何变化。
- Table：`useTableRowExpansion` 接受同一个 `animatedLayout` 句柄，因此打开或关闭某行的面板时，其后的行（包括分隔线）会平滑滑动而不是跳变。在减弱动态效果下，触摸时行会淡入，鼠标下立即改变；有列线的表会立即改变。
- TreeList 的箭头和引导线向行首靠近了 4px，箭头与标签之间的间距从 4px 加宽到 8px。标签保持在原来的位置。
- `Icon` 接受可选的 `variant`，用于向当前主题请求备用图形，例如 `<Icon icon="info" variant="filled" />`。只有当主题在 `iconVariants` 中列出该变体时，主题图标才会收到该变体；否则它会绘制普通图形。作为组件传入的图标永远不会收到 `variant`，它也永远不会写入页面。没有 `variant` 的图标与之前一样渲染。
- 主题图标现在可以按尺寸选择其图形：`defineTheme({icons})` 或 `registerIcons()` 中的条目可以是 `{size, variant}` 的函数，`Icon` 会用其渲染时使用的尺寸调用它。返回 `null` 则不绘制图标。`getIcon`、`getExtendedIcon`、`getIconRegistry`、`useIcon` 以及主题的 `icons` 字段仍返回节点，读取函数时会使用 `{size: 'md'}`。现有的图标条目没有变化。
- 主题可以用 `defineTheme({iconVariants})` 列出它支持的图标变体，例如 `filled`，并通过 `theme.iconVariants` 读回它们。子主题会继承该列表，除非它们设置自己的列表。`@astryxdesign/core/Icon` 导出 `IconVariantMap` 和 `IconVariant` 用于为变体提供类型。没有 `iconVariants` 的主题没有变化。
- `astryx theme build` 会保留函数图标和图标变体列表，因此构建出的主题会以与实时主题相同的尺寸和变体绘制每个图标，包括从另一个主题继承的图标。列出 `iconVariants` 的主题会在 `<theme>.variants.d.ts` 中获得匹配的类型。没有这些功能的主题构建结果与之前完全相同。
- 主题可以为每个 Icon 尺寸设置实际大小：在 `components.icon['size:sm']`（或 `xsm`、`md`、`lg`）上以 `px` 或 `rem` 设置 `width` 和 `height`，现在会调整字形本身的大小，适用于命名图标和 SVG 组件，无论实时主题还是构建后的主题。以前，它们只会调整图标周围盒子的大小。主题未设置样式的大小在 16px 根字号下仍按 12、16、20 或 24px 渲染。`astryx docs theme` 新增了 Icon sizes 一节。
- `useCombobox`（来自 `@astryxdesign/core/Selector`）现在可以在你自己的文本字段上构建可访问的搜索结果，例如一个用结果替换部分页面的搜索框，或对话框中的"add people"字段。把 `getFieldProps` 展开到你的 input 上，把 `getListboxProps` 展开到你的列表上，把 `getOptionProps` 展开到每个选项上。焦点留在字段中，方向键在结果间移动，Enter 选择，Escape 隐藏列表而不关闭周围的对话框。用 `useAnnounce` 自行播报结果数量。现有用法与之前一样。
- 导航菜单支持按下并滑动，与 DropdownMenu 一样：在 NavHeadingMenu、TopNavMenu、SideNavHeading 的菜单、TopNavHeading 的产品菜单、BreadcrumbItem 的菜单和 TabMenu 中，在项之间滑动的按压会选择松开时指向的项，高亮会跟随指针。链接项不再可拖动。键盘和屏幕阅读器行为不变。
- 在触摸屏上，`ScrollableArea` 会显示手机自带的滚动指示器，比它以前绘制的微弱滚动条更容易看见。鼠标和触控板滚动条保持中性色。若要在触摸屏上也保持中性色，请通过 `xstyle` 设置 `scrollbarColor`。
- 新增 `--ease-exit` 运动令牌，用于离开屏幕的元素，与用于进入元素的 `--ease-standard` 并列。BottomSheet 已经使用它关闭，因此外观没有不同，但主题现在可以调整退出效果。`astryx docs motion` 和主题模板都会列出它。

#### 问题修复

- 使用 `animatedLayout` 句柄时，Collapsible 或 TreeList 变化之前的内容现在在布局移动它们时也会平滑滑动，例如居中对齐或末端对齐行中的项。
- 使用 `animatedLayout` 句柄时，变化之后的内容现在即使带有静止变换（例如静止状态下的 Button 或可滑动行）也会平滑滑动，而不是跳变。
- 在从右到左的容器中使用 `animatedLayout` 句柄时，Collapsible 或 TreeList 变化之后的内容现在会平滑滑动，而不是跳变。
- 屏幕阅读器现在能听到在打开的 Dialog、模态 BottomSheet、模态 Drawer、Lightbox、MobileNav 或 CommandPalette 内部发出的播报。以前，`useAnnounce` 消息会发送到打开对话框所隐藏的页面区域。在对话框关闭时发送的消息会在其关闭后朗读。你的代码无需更改。尚未覆盖：CommandPalette 的结果数量、Lightbox 的位置和缩放消息，以及 Selector 和 MultiSelector 的 sheet 消息。
- `useAnnounce`：同一时刻播报的消息现在会按顺序一起朗读，而不是最后一条替换其他消息，完全相同的重复只朗读一次。屏幕阅读器不再错过与确认消息一起播报的结果数量。
- 禁用的 ChatComposerInput 保持焦点及其在 Tab 顺序中的位置，而不是把焦点送到页面上，并在保留草稿的同时阻止编辑和发送。
- 禁用的 ComplexSelector 忽略已经打开的弹出窗口中的选择。
- 禁用 InputGroup 现在会禁用其中的输入框和 Button 插件，除非子项设置自己的状态。
- 禁用的 Tokenizer 会阻止添加、创建和移除令牌，并将其值排除在表单提交之外。
- Banner 的状态文本颜色不再泄漏到你的 `endContent` 中，包括从它打开的对话框。
- BottomSheet 渲染的页面元素更少，没有视觉变化。
- 开启减弱动态效果时，BottomSheet（包括 `BottomSheetSwitcher` 步骤）不再滑动或缩放：在触摸屏上它们会在 200 ms 内原地淡入，在鼠标或键盘下则立即变化。滑动关闭会原地淡出。
- 当较矮的 BottomSheet 替换较高的 BottomSheet 时，较高的 sheet 会先下移与矮的相接再淡出，因此切换看起来像一个 sheet 在改变高度。
- 从 `BottomSheetSwitcher` 步骤显示的 Toast 会出现在流程上方并且可以按下。以前，该步骤会遮住它们。
- Toast 会出现在打开的 BottomSheet 上方并且可以按下。以前，sheet 会遮住它们，按下 toast 的操作可能会关闭 sheet。
- Typeahead 和 CommandPalette 不再在结果已经到达后播报"Loading"。
- ClickableCard、SelectableCard 和交互式 Thumbnail 在从源码编译 Astryx 的应用中（Vite 和 PostCSS 集成，以及 Storybook）会在手指下显示按下状态。鼠标悬停和按压，以及预编译样式表，均未改变。
- `ChatComposer` 的状态栏会为每个错误和警告播报一次，不带装饰性图标，并且不再在页面加载时播报已经显示的状态。
- 点击未聚焦的 TextInput 或 NumberInput 的清除按钮现在会调出 iPhone 键盘，而不会滚动页面。
- 在没有标题或语言标签的 CodeBlock 中，Copy 按钮不再覆盖代码。它位于第一行旁边的独立列中，因此长行会在它之前结束，无论滚动、换行还是从右到左。带标题栏的代码块没有变化。
- CommandPalette 空消息中的长而不间断单词（例如 URL 或文件路径）现在会换行，而不是溢出两侧边缘。
- ComplexSelector 的触发器现在是一个 combobox，因此屏幕阅读器能听到该字段何时为必填。自定义 `renderTrigger` 控件会获得相同的角色和状态，禁用的控件保留其 Tab 停靠点但不会打开。使用 `getByRole('button')` 查找触发器的测试应改用 `getByRole('combobox')`。
- ComplexSelector：你的 `aria-label` 或 `aria-labelledby` 现在会为内置触发器命名，而不是被忽略。
- 由长按打开的 ContextMenu 在手指抬起时保持打开。
- 在触摸屏上开启减弱动态效果时，Dialog 会在 200 ms 内淡入，而不是突然出现。在鼠标下仍会立即出现。
- `DropdownMenuRadioItem` 现在会在选择其值之后运行你的 `onClick` 和 `onPointerMove` 处理器。禁用的行仍然不会选择任何值，也不会调用 `onClick`。其文档现在把 `value` 和 `label` 标记为必填。
- EmptyState 会可靠地播报：它不再使用 `role="status"`，因为屏幕阅读器对该角色的读取不一致。在页面加载后出现或变化的 EmptyState 会播报其标题和描述一次；加载时就存在的则不会播报。你传入的 `role` 现在会到达它。你的代码无需更改。
- 清除 FileInput 会把焦点返回其可见按钮，因此屏幕阅读器会再次播报该字段。
- 在触摸屏上，Tooltip 和 HoverCard 只在真实点击时打开。在信息图标上开始滚动不再弹出它们。
- 带有 `swipeActions` 的行不再阻止捏合缩放，第二根手指会把手势交给浏览器。
- 开启减弱动态效果时，由手指打开的 tooltip、popover、菜单和其他图层会在 200 ms 内淡入，而不是突然出现。在鼠标下仍会立即出现。
- `Layout` 不再使用可能让浏览器在每次变化时重新设置整个布局样式的选择器，该选择器曾拖慢长文档。它的外观相同。
- Lightbox 会填满可见屏幕，因此 iPhone 上的 Safari 工具栏不再遮住说明文字。
- 在第一个项到达之前打开的 Lightbox 现在会在该项到达时打开。
- 在从右到左的页面中，Lightbox 的箭头键现在与其 Next 和 Previous 按钮一致。
- List 和 Markdown 中的多位数字会保持在共享数字列的一行内，因此文本和嵌套列表保持对齐。项目符号列表保持其间距。
- 编号 List 和 Markdown 标记在相同边缘结束，数字宽度一致，因此每个句点都能对齐。
- 粘贴文本计数、朗读的快捷键名称、Ctrl 和 Esc 键帽以及文件大小限制现在已翻译并使用本地数字格式。
- DropdownMenu 和 ContextMenu 中鼠标下的行在点击后不再显示键盘焦点环。
- 以底部 sheet 显示的 DropdownMenu、MoreMenu 和 ContextMenu 在关闭后不再在页面上保留 sheet 和每个项。
- `MobileNav` 永远不会比屏幕的 85% 更宽，如文档所述，因此即使是 320px 的手机也会保留一条可点击关闭它的页面边缘。
- MultiSelector 会保留你的 `aria-labelledby`，在字段标签之后读取。
- 带 `href` 的禁用 `NavHeadingMenuItem` 在点击或激活时不再导航。
- 在 NavHeadingMenu 或 TabMenu 的项上滑动鼠标不再选中它们的文本。
- NumberInput 会保留你的 `aria-labelledby`，在字段标签之后读取。
- 禁用的 NumberInput 会保留在 Tab 顺序中，因此键盘和屏幕阅读器用户能够到达它并听到它不可用。它是只读的，并标记为 `aria-disabled="true"`，而不是使用原生 `disabled` 属性。属于 #7814 的一部分。
- `Overlay`、`DropdownMenuGroup` 和 `MobileNavToggle` 会把 `id`、`data-*`、`aria-*` 和事件处理器透传到页面，因此测试 id 和分析属性可以在它们上面工作。
- 在打开 Popover 或折叠的 SideNav 子菜单后立即按 Escape，焦点会留在触发器上，而不是移入隐藏内容。
- 打开的 Popover 不再捕获页面其他地方发出的 Tab 按压。popover 内部的 Tab 仍会循环，Escape 仍会关闭它。
- 渲染到 iframe 或画中画窗口中的 Popover 现在可以聚焦、将 Tab 保持在内部、在 Escape 时关闭，并像在页面上一样返回焦点。
- PowerSearch 在 React StrictMode 中挂载时不再播报其起始结果数量。
- 在手机和平板上，使用鼠标、触控板或空格键进行的按压现在会显示按下状态。
- 类型声明可在使用 `moduleResolution: NodeNext` 的项目中解析。
- `RadioList` 不再让大型页面在每次变化时重新设置每一行内容的样式。它的外观和行为相同。
- 可滚动区域（`ScrollableArea`，以及 Table、CodeBlock、BottomSheet 和 Schedule 视口）会在其内容溢出时立即加入 Tab 顺序，包括加载时就已经溢出的内容。
- SegmentedControl 会保留你的 `aria-describedby`，在禁用原因之前读取。
- Selector 会保留你的 `aria-labelledby`，在字段标签之后读取。
- Selector 的手机 sheet 不再把屏幕阅读器指向尚未出现的选项。
- 折叠的 SideNav 项的 tooltip 现在属于链接或按钮本身，因此键盘焦点会显示标签，屏幕阅读器也会读取它。
- SideNavHeading：`headerEndContent` 现在位于标题链接旁边而不是内部，因此在其中按下按钮不再同时跟随链接。
- SideNav 的导轨会平滑折叠和展开，而不是突然跳动，AppShell 内的页面内容也会随之移动。在减弱动态效果下，触摸时交叉淡入淡出，其他情况立即变化。
- Skeleton 在页面运行 JavaScript 时会在 Safari 中继续脉动。它的外观和时序相同。
- Slider 会保留你的 `aria-labelledby`，在其标签之后读取。
- 空闲的 Slider 不再保持页面级监听器运行。
- Slider 的拖动属于发起它的手指：第二根手指不能接管或结束它，而两根手指仍可以同时拖动两个滑块。
- 可点击的 Step 会读作"1 Account"而不是"1Account"。屏幕上的内容没有变化。修复 #7966。
- 行中包含长内容的 Switch 不再让该行在每次变化时重新设置样式。其焦点环看起来相同；标签或描述中的链接保留自己的焦点环。
- Tabs 和 TabMenu 触发器在重置了 `min-width` 的页面上不再缩小到低于其标签；标签条会改为滚动。
- 固定的 Table 列在表格横向滚动时保持其行分隔线，包括主题和自定义边框颜色。
- 禁用的 TextInput 或 TextArea 会保留在 Tab 顺序中，因此键盘和屏幕阅读器用户能够到达它并听到它不可用。它是只读的，并标记为 `aria-disabled="true"`，而不是使用原生 `disabled` 属性。属于 #7814 的一部分。
- TextInput 会保留你的 `aria-labelledby`，在字段标签之后读取。
- Thumbnail 的 Open 和 Remove 按钮在无法执行操作时保持原位、可聚焦并被播报为禁用，因此键盘焦点不再掉到页面上。
- 在隐藏期间或被首次显示之前关闭的 toast 现在会真正离开堆栈，而不是以后占用一个空位。
- Tokenizer 和 PowerSearch 会把文本光标放在最后一个令牌之后、最后一行上。
- Tokenizer 和 PowerSearch 的令牌会在 clear-all 按钮和加载指示器之前换行，而不是跑到它们下面，并且行在搜索开始或结束时不会移动。
- 已经移开其触发器的 Tooltip 在触发器移动或页面滚动时保持避开。
- 比触发器上方和下方空间更高的 Tooltip 不再覆盖触发器：它会打开在触发器旁边，或打开在空间更大的一侧并滚动。
- 开启减弱动态效果时，TopNav 的 mega menu 在触摸屏上淡入，在鼠标下立即打开，而不是升起。
- 在 TopNavMenu 操作项上滑动鼠标不再选中它们的文本。
- Typeahead 和 Tokenizer 在下一次搜索运行时隐藏旧的"no results"行。
- 点击 Typeahead 的已选值进行编辑，或点击 Selector 或 MultiSelector 搜索行中的清除按钮，现在会在第一次点击时调出手机键盘。
- 在 Typeahead、Tokenizer 和 PowerSearch 菜单中，只有当指针移到某个选项上时才会高亮该选项，而不是它滑到静止鼠标下方时，因此 Enter 不再选择你没有指向的选项。
- `VisuallyHidden` 内容不再可能被意外设为可见：`xstyle`、`className` 和 `style` 不再到达该元素。

  针对 `main` 的实现，逐属性测量了此更改前后的情况：

  - `xstyle` 仅作为属性到达——`style` 属性不受影响——因此传入它会在页面上留下一个多余属性，并不会改变任何可见内容。
  - `className` 无论前后都从未到达该元素。
  - `style` 确实到达了该元素，内联样式可能取消隐藏内容。它不再如此；这是唯一可见的变化。

  这三者都不是 `VisuallyHiddenProps` 上的样式表面：`className` 和 `style` 只通过类型转换或无类型展开到达元素，而 `xstyle` 文档中说明会被忽略，因此类型化代码不会失去任何东西。

  `xstyle` 仍声明在 `VisuallyHiddenProps` 上，并记录为被忽略，因此现有代码保持可编译。

- 捏合缩放再次可在 TimeInput、DateTimeInput 和 DateInput 的选择器滚轮上使用。

#### 性能

- 使用 `animatedLayout` 句柄时，长 Collapsible 或 TreeList 中的变化只测量页面一次，而不是每行一次。
- 包含许多关闭的 popover、tooltip 和菜单的页面加载得更快。
- 关闭的 Tooltip、Selector 和 ComplexSelector 在挂载时只渲染一次，Popover 和 DropdownMenu 渲染得更少。
- 滚动 `ScrollableArea`、Table、CodeBlock 或 BottomSheet 主体时每帧做的工作更少，因此在繁忙页面上滚动保持流畅。

#### 文档

- EmptyState 现在通过页面的共享播报区域进行播报。在测试中，`getByRole('status')` 或 `getByRole('alert')` 可能会匹配这些区域；请用 `within(container)` 限定查询范围。
- Badge 的文档把 `label` 标记为必填，与其类型一致。
- `DropdownMenuSubMenu` 的文档把 `label` 和 `children` 标记为必填，记录 `menuDataTestId`，并说明 `presentation` 默认为 `'adaptive'`。
- `ListItem` 的文档现在说明 `isSelected` 会用 `aria-current="true"` 把该行标记为当前项。
- 包的链接现在指向项目的 GitHub 主页 `meta/astryx`。
- SelectableCard 的指南不再推荐它用于单选组，因为每张卡片都是一个复选框。
- TabList 的描述不再承诺内置的"more"菜单（狭窄的标签条会滚动），库页面模板把 `MobileNav` 描述为它实际上的滑出式抽屉。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @aashish254
- @cixzhang
- @ejhammond
- @ernestt
- @harjothkhara
- @HelloOjasMutreja
- @imdreamrunner
- @kentonquatman
- @korkt-kim
- @kyu-rong
- @light-merlin-dark
- @nynexman4464
- @parinith-web
- @rubyycheung
- @thewebartisan7
- @vjeux

---

# 0.7.4

#### 新功能

- `BottomSheetSwitcher` 会在各自的原生 `<dialog>` 中呈现每个步骤。每个子 `BottomSheet` 都像独立 sheet 一样拥有一个对话框；switcher 会呈现所选 sheet 的对话框（带遮罩时用 `showModal()`，不带遮罩时用 `show()`），在交接过程中保持前一个 sheet 的对话框打开并以 inert 状态位于进入的对话框之下，并在其面板淡出后关闭它。同一时间只绘制一个背景：保留的对话框保持遮罩直到关闭，然后新对话框无需淡入就接管遮罩，因此页面永远不会被变暗两次，前一个面板也永远不会被变暗。焦点约束由浏览器自己的模态对话框约束（与 `Dialog` 相同）完成，而不是脚本陷阱；页面滚动锁（共享的 body 锁，由 switcher 为整个模态流程保持一次，贯穿交接并直到退出之后）、Escape 和平台关闭路由、`purpose` 关闭规则以及焦点返回打开者均未改变。返回到对话框仍在淡出的 sheet 时，会关闭并重新呈现该对话框，使可交互的 sheet 再次成为最顶层。 (#7720)
  公开属性、默认值和导出均未改变。两个可观察的细节随结构变化：switcher 的 `ref` 解析为承载流程的对话框——活动 sheet 的对话框，它在交接时变化；退出 sheet 的对话框在其退出期间；流程关闭时，则是最后承载它的对话框（或第一个挂载 sheet 的对话框）——而不是一个持久的元素；从第一次提交开始，只要有 sheet 挂载，它就永远不会是 `null`，回调 ref 返回的清理函数会在每次分离时运行。`onCancel` 和转发的对话框属性会应用到每个 sheet 的对话框（包括给 switcher 的 `role`，但 `required` 步骤除外，它仍像之前一样是 `alertdialog`），`id` 和 `data-testid` 除外，它们只渲染一次，从第一次提交的同步重新渲染开始，渲染在 `ref` 解析到的对话框上；一个以关闭状态挂载的流程的服务端标记不会在任何元素上携带它们（共享对话框曾携带它们）。非模态流程会将其 sheet 对话框排列在 switcher 拥有的隔离包装器中，该包装器携带共享对话框之前携带的那一个 overlay 值。

#### 问题修复

- `TextInput`、`TextArea`、`Selector` 和 `MultiSelector` 在进入忙碌状态时会通过共享播报通道礼貌地播报一次"Loading"，并且它们忙碌时显示的 Spinner 会对辅助技术隐藏。以前，Spinner 会作为自己的 `role="status"` 区域挂载并已带有其名称，屏幕阅读器通常会跳过它，而且它作为同一反馈的第二个所有者与控制自身的 `aria-busy` 竞争。重新渲染或 StrictMode 重放不会重复播报；结束并再次进入忙碌状态会再次播报。使用 `getByRole('status', {name: 'Loading'})` 找到忙碌 Spinner 的测试应改为检查控件的 `aria-busy`。 (#7920)
- Carousel：当获得焦点的边缘滚动按钮用尽（轮播已到达该边缘）时，焦点现在会移到滚动区域而不滚动它，而不是移到相反的滚动按钮。没有 API 变化。 (#7926)
- `CheckboxInput` 会通过共享播报通道礼貌地播报其忙碌开始（"Loading"）一次。它忙碌时替代对勾显示的 Spinner 位于装饰性的隐藏指示器内，因此在此次更改之前，除了 `aria-busy` 之外，没有任何信息告诉屏幕阅读器用户复选框已进入忙碌状态。在打开的模态对话框中，播报会发送到对话框内的状态区域。 (#7948)
- `CommandPaletteItem` 现在会在 `command-palette-item` 主题目标上以 `data-highlighted="highlighted"`、`data-selected="selected"` 和 `data-disabled="disabled"` 反映其高亮、选中和禁用状态。主题现在可以为活动的键盘结果、已选择的值或不可用的命令设置样式，例如 `.astryx-command-palette-item[data-selected]`。从 CommandPalette 派生的状态也会反映出来。渲染、语义和属性均未改变。 (#7967)
- `CommandPalette` 会从其对话框内的状态区域播报每次忙碌开始（"Loading"），包括打开时或清除查询时的加载，并且其搜索 Spinner 会对辅助技术隐藏。以前，Spinner 会作为自己的 `role="status"` 区域挂载并已命名为"Loading"，而调色板自己的"Loading"会发送到页面级播报通道，打开的浏览器原生模态框会对辅助技术隐藏该通道。结果数量播报未改变。使用 `getByRole('status')` 找到 Spinner 的测试应改为查询 Spinner 元素。 (#7956)
- 忙碌的 `DateInput`（`isLoading`，或待处理的 `changeAction`）不再看起来像禁用。在 popover、原生和底部 sheet 表面上，该字段保持普通绘制并显示其 Spinner，同时新的提交被阻止；只有 `isDisabled` 会使字段变暗。忙碌字段仍不接收悬停环，并保留其键盘焦点环。属性、语义和播报均未改变。 (#7968)
- `DateInput`（popover、原生和底部 sheet 呈现）和 `DateRangeInput` 会通过共享播报通道礼貌地播报其忙碌开始（"Loading"）一次，并且它们忙碌时显示的 Spinner 会对辅助技术隐藏。以前，该 Spinner 会作为自己的 `role="status"` 区域挂载并已命名为"Loading"，屏幕阅读器通常会跳过它，而且它作为第二个所有者与字段的 `aria-busy` 并列。在打开的模态对话框中，播报会发送到对话框内的状态区域。使用 `getByRole('status', {name: 'Loading'})` 找到忙碌 Spinner 的测试应改为检查字段的 `aria-busy`。 (#7939)
- `DateTimeInput` 和 `TimeInput`（popover、原生和底部 sheet 呈现）会通过共享播报通道礼貌地播报其忙碌开始（"Loading"）一次，并且它们忙碌时显示的 Spinner 会对辅助技术隐藏。以前，该 Spinner 会作为自己的 `role="status"` 区域挂载并已命名为"Loading"，屏幕阅读器通常会跳过它，而且它作为第二个所有者与字段的 `aria-busy` 并列。在待处理的 `changeAction` 下，在打开的底部 sheet 内所做的更改会从 sheet 内部播报。使用 `getByRole('status', {name: 'Loading'})` 找到忙碌 Spinner 的测试应改为检查字段的 `aria-busy`。 (#7942)
- `FileInput` 会通过共享播报通道礼貌地播报其忙碌开始（"Loading"）一次，并且它忙碌时显示的 Spinner 会对辅助技术隐藏。以前，该 Spinner 会作为自己的 `role="status"` 区域挂载并已命名为"Loading"，屏幕阅读器通常会跳过它。文件选择会保留其单次"file selected"播报，因为它是一个用户操作，即使它开始一段忙碌期（`changeAction`，或从 `onChange` 设置 `isLoading`）。其他忙碌开始，例如单独的 `isLoading` 或 `changeAction` 下的清除，会播报"Loading"。在打开的模态对话框中，播报会发送到对话框内的状态区域。使用 `getByRole('status', {name: 'Loading'})` 找到忙碌 Spinner 的测试应改为检查字段的 `aria-busy`。 (#7954)
- Selector、DropdownMenu 和 ContextMenu：点击 shadow root（open、closed 或嵌套）内的选项会选择它。这些菜单以前会读取文档对点击的视图，该视图指向 shadow host，因此点击会关闭菜单而不选择任何内容。 (#7914)
- `DropdownMenuSubMenu`（带 `hasSpinner`）、正在上传的 `Thumbnail`，以及 `ChatMessageList` 在加载更早消息时，会通过共享播报通道礼貌地播报其忙碌开始（"Loading"）一次。它们各自显示的 Spinner 会对辅助技术隐藏。以前，该 Spinner 会作为自己的 `role="status"` 区域挂载并已命名为"Loading"，屏幕阅读器通常会跳过它；在 `ChatMessageList` 中，它还是日志内的第二个 live 角色。使用 `getByRole('status', {name: 'Loading'})` 找到这些 Spinner 的测试应改为查询 Spinner 元素或所有者的忙碌状态。 (#7950)
- ChatComposerInput：触发器菜单的加载行不再作为已带有其文本的 `role="status"` 区域挂载，屏幕阅读器可能会跳过它。加载文本现在会在每次待处理搜索时通过共享的礼貌通道播报一次，而在加载行绘制之前就返回结果的搜索（例如 `createStaticSource` 或缓存结果）不会播报任何内容；可见行及其 `loadingText` 未改变。 (#7900)
  修复 #7859。

- useTypeahead 会在其组件卸载或 `<Activity>` 边界隐藏它时清除待处理的缓冲区重置，因此在输入字符后 750 ms 内移除的菜单、列表或选择器不会在背后留下运行中的定时器，隐藏后重新出现时缓冲区为空 (#7938)
- `ComplexSelector`、`Typeahead`、`Tokenizer` 和直接使用的 `BaseTypeahead` 会通过共享播报通道礼貌地播报其忙碌开始（"Loading"）一次，并且它们在忙碌或搜索进行中显示的 Spinner 不再是 live 区域：ComplexSelector 的 Spinner 会对辅助技术隐藏，Typeahead、Tokenizer 和 BaseTypeahead 的搜索 Spinner 仍作为图像命名（"Loading"），以便搜索的忙碌反馈保留其名称。以前，该 Spinner 会作为自己的 `role="status"` 区域挂载并已命名为"Loading"，屏幕阅读器通常会跳过它，而且它作为第二个所有者与控件的 `aria-busy` 并列。在打开的模态对话框中，播报会发送到对话框内的状态区域。使用 `getByRole('status', {name: 'Loading'})` 找到忙碌 Spinner 的测试应改为检查控件的 `aria-busy`，或用 `getByRole('img', {name: 'Loading'})` 查找搜索 Spinner。 (#7930)

#### 文档

- `BottomSheetSwitcher` 的解剖结构将其宿主部分命名为 `Sheet dialogs`——每个子 sheet 一个原生对话框，承载活动 sheet 的对话框携带流程的 ref、id、模态性和关闭方式——而不是 `Shared dialog`。 (#7720)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @HelloOjasMutreja
- @imdreamrunner
- @vjeux

---

# 0.7.3

#### 新功能

- `DropdownMenuSubMenu` 像根 `DropdownMenu` 一样接受 `header` 和 `footer`，因此子菜单可以在其行上方有一个筛选字段，或在行下方有一个操作（例如"New folder"），位于子菜单菜单本身之外。使用其中任一项时，子菜单的表面（飞出层，或手机上的钻取视图）是一个由其行命名的模态对话框：该行会显示 `aria-haspopup="dialog"`，Tab 和 Shift+Tab 会遍历 header、行和 footer 并循环，Escape 返回该行，指针离开飞出层时只有在焦点也离开后才会关闭它。`ContextMenu` 不会显示子菜单的 `header` 或 `footer`。不提供它们时没有任何变化。

  ```diff
   <DropdownMenuSubMenu
     label="Move to"
  +  header={<TextInput label="Filter folders" isLabelHidden value={query} onChange={setQuery} />}
  +  footer={<Button label="New folder" onClick={createFolder} />}
   >
     <DropdownMenuItem label="Folder A" onClick={() => move('a')} />
   </DropdownMenuSubMenu>
  ```

#### 问题修复

- `TimeInput` 的方向键会忽略小数增量，而不是写出格式错误的时间（例如"14:30.5"）：对于小数分钟增量，`adjustTime` 会原样返回时间（[#7823](https://github.com/meta/astryx/pull/7823)）。
- 屏幕阅读器现在会播报首次以 `isLoading` 渲染的 `Button`（例如重新挂载之后）。其视觉隐藏的加载 live 区域会以空内容挂载，并在下一帧获得"Loading"，因为屏幕阅读器会跳过出现时已经带有文本的 live 区域。挂载后才进入加载状态的 Button 没有变化，空闲挂载的 Button 不会额外渲染。
- `ChatComposer`：屏幕阅读器现在会为每种情况播报一次状态消息，错误使用 assertive，警告使用 polite：重新渲染不会重复播报，清除后又返回的状态会再次播报。以前，状态栏会作为 `role="alert"` 或 `role="status"` 区域挂载并已带有其文本，屏幕阅读器通常会跳过它。消息现在通过共享播报通道发送，可见栏不再携带 live 角色。没有 API 变化。
- `ChatSystemMessage`：`ChatMessageList` 中的新聊天通知现在只有一个 live 区域播报它，即列表的礼貌日志，而不再同时是嵌套其中的第二个 live 区域（WCAG 2.2 SC 4.1.3）。其根元素在两种变体中都不再强制 `role="status"`，因此日期和分隔行不再被呈现为状态消息，传给组件的 `role` 会到达其根元素。通过 `status` 角色找到系统消息的测试应改为按其文本查询。
- 键盘和屏幕阅读器用户现在可以到达禁用的 `CheckboxInput`、`CheckboxList` 项、`Switch`、`Slider` 和 `FileInput`，并听到它们已禁用。以前，除非设置了 `disabledMessage`，否则它们会渲染原生 `disabled` 属性，因此 Tab 会跳过它们。现在每个禁用控件都会暴露 `aria-disabled="true"`，并保留其启用时的 Tab 停靠点，同时切换、选择、拖动、打开文件选择器以及任何 `onClick` 仍被阻止，其值仍会被排除在表单提交之外。获得焦点的禁用复选框、开关、滑块拇指或文件输入会显示其键盘焦点指示器。没有 API 变化。
- 全局模式写入主文件夹的 agent 指南现在告诉 agent 交付一个用 Astryx 构建的页面，而不仅仅是说明如何查找内容。以前，找到正确模板的 agent 仍可能用无法安装包的工具构建页面，并交付一个不含 Astryx 的页面。该指南现在告诉 agent 在项目文件夹中工作（若没有则创建一个）；向新项目或没有 Core 的项目添加 `@astryxdesign/core` 和 `@astryxdesign/cli`，或在已有 `@astryxdesign/core` 的项目中添加相同版本的 CLI；在那里运行 `astryx init`；遵循相同的模板优先工作流，并按照项目 agent 文档给出的自检方法自检；最后构建项目并交付该构建。该指南保持不绑定版本，只列出每个版本都会保留的命令。项目 agent 文档未改变，`@astryxdesign/core` 安装脚本打印的内容也未改变：其共享 agent 文档文件的副本只会增加相同的工作流行。
- 键盘和屏幕阅读器用户现在可以到达禁用的 `ComplexSelector` 并听到它不可用（WCAG 2.2 SC 2.1.1 和 4.1.2）。以前，其触发器会渲染原生 `disabled` 属性，因此 Tab 会跳过它，获得焦点的触发器在禁用时会失去焦点；现在它会暴露 `aria-disabled="true"`，保持焦点，显示其键盘焦点轮廓，并且仍然不打开任何内容。对其进行的按压或按键不会到达任何处理器：不会到达切换逻辑，不会到达调用方的 `onClick` 或 `onKeyDown`，也不会到达祖先的点击处理器。
- 键盘和屏幕阅读器用户现在可以到达禁用的 `Calendar` 日期或 `Pagination` 圆点，并听到它们已被禁用。禁用的 `TreeList` 行的展开切换和操作按钮、禁用的 `Pagination` 圆点和禁用的 `Calendar` 日期会暴露 `aria-disabled="true"`，而不是原生 `disabled` 属性，同时点击、Enter 和空格仍然不执行任何操作，方向键仍像之前一样跳过禁用日期。没有 API 变化。
- `DateInput`：键盘和屏幕阅读器用户现在可以到达禁用的日期字段并听到它已禁用。禁用或忙碌的字段不再渲染原生 `disabled`：其输入框和日历按钮保留在焦点顺序中的位置并暴露 `aria-disabled`，同时输入和打开仍被阻止，获得焦点的禁用字段会显示其焦点环。使用 `toBeDisabled()` 或 `:disabled` 查询禁用 DateInput 的测试应改为检查 `aria-disabled="true"`。
- `DateRangeInput`：键盘和屏幕阅读器用户现在可以到达禁用的字段或预设并听到它已禁用。禁用或忙碌的字段以及禁用的预设不再渲染原生 `disabled`：触发器、日历按钮和预设保留在焦点顺序中的位置并暴露 `aria-disabled`，同时打开和选择仍被阻止，获得焦点的禁用字段会显示其焦点环。使用 `toBeDisabled()` 或 `:disabled` 查询它们的测试应改为检查 `aria-disabled="true"`（[#7866](https://github.com/meta/astryx/pull/7866)）。
- `DateTimeInput`：键盘和屏幕阅读器用户现在可以到达禁用或忙碌的字段并听到它已禁用。它不再在其文本、原生选择器或触摸字段上，或在其日历和时钟按钮上渲染原生 `disabled`：它们保留在焦点顺序中的位置并暴露 `aria-disabled`，同时输入、选择、打开以及调用方的 `onClick` 仍被阻止，获得焦点的禁用字段会显示其焦点环。`TimeInput` 的原生选择器按钮共享时间段并位于 Tab 顺序之外，它也从 `disabled` 改为 `aria-disabled` 并保持 inert。使用 `toBeDisabled()` 或 `:disabled` 查询禁用 DateTimeInput 的测试应改为检查 `aria-disabled="true"`。
- 在没有 StyleX 构建步骤的情况下使用 Core 预构建 CSS 的应用现在会获得默认数据颜色：预构建 CSS 定义了规范的 `dataVars` 默认值，因此编译后的导入和原始 CSS 引用都能正确绘制。
- 当其中的文件选择器被关闭时，`Dialog`、`BottomSheet` 和 `BottomSheetSwitcher` 会保持打开。文件输入在其选择器关闭且未选择任何内容时会触发冒泡的 `cancel` 事件，三者都把这个事件当成自己的关闭请求并关闭（switcher 会关闭整个流程）。它们现在只对指向自己 `<dialog>` 的 `cancel` 作出反应，因此 Escape 和平台关闭请求（Android 返回手势）的行为与之前相同。没有 API 变化。
- `DropdownMenuRadioGroup` 现在会转发 `ref`，其文档解释了受控选择、如何为组命名、菜单何时关闭，以及它如何在 `DropdownMenu` 内组合。
- `astryx init` 会把 agent 文档写到项目根目录，写在项目会提交的文件中，因此 Codex、Gemini CLI、Copilot CLI 和 Claude Code 都能从项目根目录或其下任何文件夹读取该块（[#7497](https://github.com/meta/astryx/pull/7497)）。它不再把 agent 文档写入项目的子文件夹、主文件夹，或其中的设置文件夹（例如 `~/.gemini`）。
  - `AGENTS.md` 保存该块，在缺失时创建。以前，只有 `CLAUDE.md` 的项目只会在那里获得该块，因此 Codex 和 Gemini CLI 永远看不到它。
  - Claude Code 会跳过同时有 `CLAUDE.md` 或 `.claude/CLAUDE.md` 的文件夹中的 `AGENTS.md`，因此项目已有的 Claude Code 文件会保留一份完整副本：根目录 `CLAUDE.md`，否则 `.claude/CLAUDE.md`。即使它导入了 `AGENTS.md`，也会保留该副本，因为 Claude Code 在从子文件夹启动的会话中不会遵循该导入；从根目录启动时，Claude Code 会读取两份。当两者都存在时，副本放在根目录 `CLAUDE.md` 中，项目即使忽略 `.claude/` 也会提交它，而 `.claude/CLAUDE.md` 中的块会被移除。Init 不会创建 Claude 文件。`astryx upgrade` 会刷新每个副本，但位于主设置文件夹顶层的项目除外（见下一条）。
  - Gemini CLI 只读取 `GEMINI.md`：init 会添加一行导入 `@./AGENTS.md`，在缺失时创建 `GEMINI.md`。当 `GEMINI.md` 已经导入 `AGENTS.md`（无论内联还是单独一行）时，它不会添加任何内容。即使项目的 `.gemini/settings.json` 让 Gemini 通过 `context.fileName` 读取 `AGENTS.md`，它也会添加该导入：Gemini 只在从项目根目录启动时加载这些设置，因此从子文件夹启动的会话否则将得不到任何副本。从根目录启动时，Gemini 会读取两份。
  - 项目根目录是 init 运行位置或其上方的最近文件夹，其 `package.json` 声明了 `@astryxdesign` 包；否则是最近的任何含 `package.json` 的文件夹。搜索会停在仓库根目录，且永远不把主文件夹计算在内。若找不到 `package.json`，init 会像之前一样写入其运行位置。`docsWritten` 仍会列出每个文件相对于 init 运行位置的路径，例如 `../../AGENTS.md`。
  - 解析到项目之外的 `GEMINI.md`（例如指向共享文件的链接）会被跳过，并在 `docsError` 中带一条注释（不是错误行）报告，无论默认布局还是项目自己的布局；其余内容会写入，init 以 0 退出。
  - 托管块属于 Astryx：无论忽略规则或生成标记怎么说，init 和 `astryx upgrade` 只写入、刷新和移除该块，与 0.7.1 一样，并且永远不会更改其周围的文本。每次写入都保持在项目内：在 0.7.1 写入的文件夹中运行时，0.7.1 在那里写入的 agent 文件若其路径离开项目，仍会拒绝运行并以 1 退出。项目的 Claude Code 文件（根目录 `CLAUDE.md`，或在没有根目录文件时的 `.claude/CLAUDE.md`）若解析到项目之外，并且是对现有 `AGENTS.md` 的无块导入（0.7.1 会保持原样），则会被跳过并在 `docsError` 中带一条注释报告，init 以 0 退出。从项目根目录以下的文件夹运行时（0.7.1 会在该文件夹中写入），项目根目录文件若其路径离开项目则会被跳过并在 `docsError` 中带一条注释报告，其余内容写入，init 以 0 退出。
  - 当根目录 `CLAUDE.md` 未被跟踪且被仓库的忽略规则忽略时（从仓库根目录向下的任何忽略文件，例如 monorepo 的根 `.gitignore`、本地排除文件或配置的排除项；init 会询问 git、Sapling 或 Mercurial），项目提交的 `.claude/CLAUDE.md` 也会获得副本，因此全新克隆仍会给 Claude Code 一份副本；`--agent claude` 和 `--agent all` 也会把它写到那里。仓库跟踪的文件无论忽略规则如何都算作已提交，因为 git 和 Mercurial 只忽略未跟踪的文件；当仓库无法回答时，副本会保留，首次运行和后续运行都是如此。若这样的副本解析到项目之外，则在其所在处（0.7.1 也一样）拒绝运行并以 1 退出；0.7.1 未写入的副本（`--agent claude` 添加的副本，或对现有 `AGENTS.md` 的无块导入）会被跳过并在 `docsError` 中带一条注释报告，init 以 0 退出。在存在 `CLAUDE.md` 时，`--agent claude` 将要移除其块的 `.claude/CLAUDE.md` 也是如此，因为 0.7.1 的 `claude` 预设在那里只写 `CLAUDE.md`。在存在已提交的根 `CLAUDE.md` 且 `.claude` 链接到项目之外时，0.7.1 拒绝的三种情况现在以 0 退出且不写入任何内容：默认情况下存在纯文本的 `.claude/CLAUDE.md`，以及 `--agent all` 下存在纯文本或对 `AGENTS.md` 的无块导入的情况；根 `CLAUDE.md` 持有副本，因此没有写入离开项目。在保留自己布局的项目中，不导入任何 agent 文件的 `GEMINI.md` 现在会获得副本，与其他 agent 文件一样。
  - `.claude/CLAUDE.md` 中的副本只有在根 `CLAUDE.md` 持有相同块后才会被移除，且只移除其标记之间的托管块：文件其余部分保留，只有当只剩下空白时才会删除文件。`astryx init --remove-agents` 只有在只剩下空白或 init 自己的标题时才会删除其创建的文件；0.7.0 还会删除剩余文本包含标题和任何含有"guidance"一词的行的文件。
  - `astryx init --remove-agents` 会移除项目根目录（init 写入它的位置）以及其运行文件夹中的块。从子文件夹运行时，它会移除 init 在根目录写入的内容，以及早期版本留在该子文件夹中的块；根目录 agent 文件若其块解析到项目之外，则保持原样并附一条注释，运行以 0 退出，与 0.7.1 仅触及子文件夹时一样。退出码和 JSON 形状未改变。
  - `--agent claude` 和 `--agent all` 永远不会同时在 `CLAUDE.md` 和 `.claude/CLAUDE.md` 中留下块，除非项目忽略 `CLAUDE.md`：当 `CLAUDE.md` 获得该块时，`.claude/CLAUDE.md` 中的块会被移除。`--agent all` 保留 `GEMINI.md` 导入。`--agent` 帮助和 working-with-AI 指南会说明这一点。`--agent-docs-path` 会像之前一样写入 init 运行的位置。
  - 当 `GEMINI.md` 的导入指向没有块的 `AGENTS.md` 时，`astryx doctor` 会失败。CLI 和 `@astryxdesign/core` 中的设置检查不再把该导入视为已设置，并会查看 `GEMINI.md`。命令打印的"运行 init 完成设置"提醒也会查看项目根目录，因此一旦 init 在嵌套包中运行过，它就会停止。
- `astryx init` 和 `astryx upgrade` 不再把 agent 文档写入你的主文件夹，或其中项目之外的设置文件夹（例如 `~/.gemini` 或 `~/.claude`）。agent 会在每个项目中读取这些文件夹中的文件，因此那里的块会影响到无关的工作。这遵循 CLI 的现有规则：任何命令都不会把 agent 文档写入这些文件夹，且在命令自身文件夹之外的写入会在写入任何内容之前被拒绝。
  - **被 `init` 拒绝：** 主文件夹本身，以及其中任何名称以点开头的文件夹的顶层（每个这样的文件夹都是设置文件夹），即使它含有 `package.json`。其下带有自己 `package.json` 的文件夹是一个项目，会被正常设置，例如 `~/.codex/worktrees/` 或 `~/.cursor/worktrees/` 中的 agent worktree，`astryx upgrade` 会刷新它。使用 `--agent-docs-path` 时，会检查每个文件自己的文件夹：从主文件夹中，`notes/AI.md` 会像之前一样写入，而 `AI.md` 或 `.claude/CLAUDE.md` 会被拒绝。
  - **`init` 改为做什么：** 它不写入任何 agent 文档，把 `docsError` 报告为 `install-failed` 并附带原因，并以 0 退出，与之前一样。
  - **被 `upgrade` 拒绝：** 刷新根目录为主文件夹或设置文件夹顶层的项目中的块，例如带 `package.json` 的 `~/.dotfiles`，无论是否使用 `--apply`。它会保持块原样，把 `agentDocs.action` 设为 `error`（绝不会是 `would-refresh`），并警告该文件夹及原因；其他步骤和退出状态与之前相同。若那里没有块，它会给出相同原因，而不是建议运行 `astryx init`。`astryx doctor` 的 agent 文档修复也这样做，且每条命令后的设置提醒保持安静。
  - **迁移：** 从项目自己的文件夹运行 `astryx init`，或手动把块添加到文件中。把根目录为主文件夹或设置文件夹的项目移到自己的文件夹中，或手动更新或移除其块。要移除早期版本写入 `~/.claude/CLAUDE.md` 的块，请在主文件夹中运行 `astryx init --remove-agents`。
- 键盘和屏幕阅读器用户现在可以到达禁用的 `MultiSelector` 并听到它不可用（WCAG 2.2 SC 2.1.1 和 4.1.2）。以前，其触发器会渲染原生 `disabled` 属性和 `tabIndex={-1}`，因此 Tab 会跳过它，获得焦点的触发器在禁用时会失去焦点；现在它会暴露 `aria-disabled="true"`，保持焦点，仍然不打开任何内容，也不提交表单值。与原生禁用的按钮一样，除了 focus 和 blur 之外，它不会运行任何调用方事件处理器，对其按压也不会到达任何处理器。获得焦点的禁用触发器会显示键盘焦点环，并随控件其余部分一起变暗（WCAG 2.2 SC 2.4.7）。
- 键盘和屏幕阅读器用户现在可以到达禁用的 `Link` 或 `ClickableCard`，以及禁用 `Token` 的按钮。以前，它们会渲染原生 `disabled` 属性或 `tabIndex={-1}`，因此 Tab 会跳过它们。现在每个禁用控件都会暴露 `aria-disabled="true"` 并保留启用时的 Tab 停靠点，同时通过点击、Enter 或空格激活、`onClick`、移除和导航仍被阻止；禁用的 Link 不保留活动目标，并以链接角色暴露。`Popover` 不再从标记为 `aria-disabled="true"` 的包裹触发器或 `anchorRef` 触发器打开（例如带 `tooltip` 的禁用 `Button`），包括直接在触发器上派发的点击；以前，这样的点击会打开它。没有 API 变化。
- 键盘和屏幕阅读器用户现在可以到达禁用的 `Selector` 并听到它不可用（WCAG 2.2 SC 2.1.1 和 4.1.2）。以前，其触发器会渲染原生 `disabled` 属性和 `tabIndex={-1}`，因此 Tab 会跳过它，获得焦点的触发器在禁用时会失去焦点；现在它会暴露 `aria-disabled="true"`，保持焦点，仍然不打开任何内容，也不提交表单值。与原生禁用的按钮一样，除了 focus 和 blur 之外，它不会运行任何调用方事件处理器，对其按压也不会到达任何处理器。获得焦点的禁用触发器会显示键盘焦点环，并随控件其余部分一起变暗（WCAG 2.2 SC 2.4.7）。
- 窄列表中的 `Selector` 选项现在会将长标签缩小并用省略号截断，而不是被列表边缘裁掉。
- `Switch`：忙碌的开关会在每次忙碌开始时播报一次"Loading"。在 React StrictMode 下，以前会播报两次。
- `TimeInput`：键盘和屏幕阅读器用户现在可以到达禁用的字段或忙碌的底部 sheet 字段，并听到它已禁用。它不再在其键入、原生选择器或触摸输入上，或其选择器按钮上渲染原生 `disabled`：它们保留在焦点顺序中的位置并暴露 `aria-disabled`，同时键入、方向键调整、打开、用 Enter 提交周围的表单以及调用方的 `onClick` 仍被阻止，字段变为禁用之前键入的草稿会被丢弃，获得焦点的禁用字段会显示其焦点环。使用 `toBeDisabled()` 或 `:disabled` 查询禁用或忙碌 TimeInput 的测试应改为检查 `aria-disabled="true"`。
- 使用 `Timestamp` 绝对格式（`date`、`time`、`date_time` 及其他固定格式）的页面现在可以在开启 `cacheComponents` 的 Next.js 中预渲染，而以前会导致构建失败：`Timestamp` 不再在服务器渲染时读取当前时间，绝对格式也从不读取时钟。`relative`、`relative_short` 和 `auto` 只在客户端读取时钟：服务器渲染或静态预渲染会显示带标签的 UTC 完整日期和时间，客户端在 hydration 后立即切换到该格式的正常输出，因此服务器和客户端标记现在始终匹配。仅客户端渲染未改变。没有 API 变化（[#7883](https://github.com/meta/astryx/pull/7883)）。
- `Tooltip`：将指针从触发器一步直接移到 tooltip 上不再隐藏它，因此悬停时它会保持打开（WCAG 2.2 SC 1.4.13）。
- 折叠的 `SideNav` 中的 `SideNavItem` 现在会在悬停时显示其 tooltip 并获得 `aria-describedby`，即使该项首次出现在已经折叠的 `SideNav` 中（这是保存折叠状态的常见情况）。以前，只有出现后才折叠的项才会获得 tooltip。修复 [#7692](https://github.com/meta/astryx/issues/7692)。

  带有 `anchorRef` 且渲染在 ref 指向的元素内部的 `Tooltip`（如 `SideNavItem` 所做的那样）现在无论以何种方式挂载都能附加。effect 现在会在提交完成 ref 附加后重新检查锚点；事件监听器和 `aria-describedby` 的合并与恢复未改变。

- 窄屏幕上的 `TopNav`：较长的 `TopNavHeading` 现在会让路（用省略号截断，或在标题是链接时换行），而不是把末端内容和菜单切换按钮挤出栏的边缘，并且移动端抽屉的关闭按钮回到了屏幕内。
- `Typeahead`：在编辑值时清除值现在会清空输入框并报告 `onChangeQuery('')`，而不是在没有值的字段中留下旧标签。修复 [#7038](https://github.com/meta/astryx/issues/7038)。

#### 性能

- 包含许多代码块的页面（例如长 Markdown 文档）首次加载时绘制得更快：`CodeBlock` 会在第一次读取布局之前而非之后插入其语法高亮规则，这在 100–500 KB 的测试文档中把首次绘制缩短了 16–19%（[#7875](https://github.com/meta/astryx/pull/7875)）。规则和高亮输出未改变。
- 围绕长 `Markdown` 文档进行更新的页面保持响应：当父级重新渲染而未更改文本或任何渲染属性时，Markdown 会跳过重新渲染其文档，并且每次渲染都作为新函数传入的链接处理器不再强制进行该工作。渲染输出未改变。

#### 文档

- `DropdownMenuItem` 的文档现在解释了何时一个项是操作或目标、禁用的项，以及支持性内容。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @aashish254
- @cixzhang
- @ejhammond
- @HelloOjasMutreja
- @josephfarina
- @kyu-rong
- @Pushpak731
- @vjeux

---

# 0.7.2

#### 实验性 API

- Drawer 的全视口移动端覆盖范围作为实验性功能发布：`experimental={{isFullWidthOnMobile: true}}` 会在小于 640px 时填满视口，而不是保留 56px 的页面显露。Drawer 的 `experimental` 属性中的任何内容都可能在任何补丁版本中更改或移除；省略它会保持稳定行为。

#### 新组件

- 将 `Drawer` 和 `DrawerHeader` 从仅限 canary 的 Lab 包提升到 Core，可从 `@astryxdesign/core/Drawer` 或包根导入。稳定包现在提供具有模态和非模态呈现的全高侧面板、共享的关闭堆栈、Dialog 的 `purpose` 关闭策略、在传入 `onOpenChange` 时显示关闭按钮的 `DrawerHeader`，以及 Dialog 风格的容器内边距（默认 `--spacing-4`、`padding` 属性，或主题的 `drawer` 内边距），并附带 Core 文档和可运行示例。从 `@astryxdesign/lab` 导入的 Canary 用户应切换到 `@astryxdesign/core/Drawer`。

#### 新功能

- 集成可以设置其用户运行 CLI 的命令：`astryx.integration.*` 中新增 `cliCommand` 字段，例如 `cliCommand: 'acme astryx'`。在加载该集成的项目中，CLI 打印的每条命令都会以它开头，而不是包管理器前缀（`npx astryx`、`pnpm exec astryx`）：下一步提示、错误、建议、Doctor 修复、`--help`、设置提醒、agent 文档块和文档文本。如果两个已加载的集成设置了不同的命令，则两者都不使用，`astryx doctor` 中新增的 `cli-command` 检查会发出警告。无效的 `cliCommand` 会被忽略并给出 `invalid_cli_command` 警告；清单的其余部分仍会加载。
  文档（包括集成的文档）现在以裸 `astryx ...` 命令编写，`astryx docs` 在打印时会为项目添加前缀。JSON 输出保持每条命令为裸形式，与之前一样。来自 `@astryxdesign/core` 和 `@astryxdesign/cli` 的安装时设置提醒会列出项目包管理器运行的命令，而不是始终使用 `npx @astryxdesign/cli`。

- 向 `en` 目录添加 `@astryx.diffViewer.*` 键，使 lab 的 `DiffViewer` 从翻译运行时读取其文件状态徽章、行数、行号按钮标签、每行的"Added"/"Removed"标签以及空状态消息。现有字符串没有变化；没有翻译的语言区域会回退到英语。
- `Item` 接受 `align="first-line"`，它会把每个起始和结束插槽居中到标签的第一行。换行标签旁边的小状态点、单选按钮、复选框或时间戳现在会与第一行保持齐平，而 `center` 会把它降到行的中间，`start` 会把它留在线之上。比第一行更高的插槽会把文本下移，而不是离开该行；没有描述的单行行看起来与 `center` 相同。`ListItem`、`RadioListItem` 和 `CheckboxListItem` 接受相同的 `align` 并将其传给它们的行。主题可以通过 `item` 目标的 `align` 轴为这些行设置样式。默认值仍为 `center`，因此现有行不会改变。
- i18n 目录：添加 Lab CommentComposer 用于其输入、图片上传、内联引用、表情操作、取消操作和重试功能所需的英文消息。
- i18n 目录：添加 Lab CommentThread 用于回复、回应、编辑历史、解决、错误、评论操作以及当关闭操作会丢弃回复或编辑时播报的未保存草稿警告所需的英文消息。
- i18n 目录：添加 Lab Comments 面板用于其区域、空/加载状态、分页和发布错误所需的英文消息。
- i18n 目录：添加 Lab EmojiPicker 的英文消息，使语言目录和提供者覆盖可以替换其标签、搜索状态、加载状态和组名。
- `List`：添加 `edge`，用于选择每行文本、分隔线以及悬停和选中背景的位置。`padded`（默认）保持当前外观。`flush` 去掉行的侧内边距，因此文本和分隔线与列表标题及其上方标题从同一条线开始，无需容器。`outset` 在文本周围保留背景空间，同时伸入 Card、Section 或 Dialog 的内边距，使文本落在标题的线上。`bleed` 让行以直角延伸到容器的边缘，就像 Card 中的 Table 行。`edgeCompensation="inline"` 已弃用，改为 `edge="outset"` 并继续工作；其行的外部空间不再被列表的滑动裁剪切断。运行 `astryx upgrade` 把它重命名。
- `Pagination`：当 `hasFirstLast` 为 `true` 且页数已知时，`variant="compact"` 会显示围绕上一页/下一页的第一页/最后一页按钮。compact 仍默认省略它们，而 `input` 变体仍会显示它们，除非 `hasFirstLast` 为 `false`。
- `reset.css`：在 Chromium 中，带 `list` 的 `<input>` 的下拉标记位于字段中间。Chromium 把标记设置在字段的 line-height 上，因此当 line-height 大于 1 时它会偏低，而 reset 让每个字段继承页面的 1.5：标记在 40px 字段中位于中间下方 3.5px，在更高的行上还会更低。日期和时间字段（其日历图标使用相同部分）保持其图标位置不变。若要保持旧位置，请在 reset 之后添加 `input[list]::-webkit-calendar-picker-indicator { line-height: inherit; }`。
- `SideNavItem`：嵌套项现在像顶层项一样横跨导航列表的整个宽度，因此它们的悬停和选中填充与上面的行对齐。以前，嵌套项从列表边缘向内 24px 开始。缩进现在位于行内部，每层嵌套一个 `--spacing-6` 步进，因此图标和标签仍保持在原来的位置。缩进区域现在是嵌套行的一部分，因此会显示悬停反馈，点击它会激活该项。直接放在 `SideNavItem` 内且自身不是 `SideNavItem` 的内容不再被子组缩进。没有支持的方法可以保留旧的缩进外观。
- `TabMenu` 会把宿主属性和 DOM 事件处理器传递给其触发按钮。触发器保留其按钮语义、Tab 停靠点和菜单展开属性；调用方的 `onClick` 会在菜单切换之后运行。
- 表格在 `Markdown` 和 RichText 两个表面上都会在每条单元格边缘绘制线条，而不仅是在行之间，并且网格会在表格边缘闭合。沿着某一行横向阅读的读者从来不需要垂直线，但编辑表格的人必须瞄准单元格并判断选择在哪里结束，而工具栏插入产生的空白 3×3 表格只是三条水平线，没有任何迹象表明它有三列。该线条与行之间已经使用的 `--color-border` 相同，边缘会与其合并为一条规则而不是在边缘加倍，两个表面一起变化——阅读和编辑渲染逐块匹配，比之前更接近。
- `TreeList`：嵌套行现在像根行一样横跨列表的整个宽度，因此它们的悬停和选中填充与上面的行对齐。以前，嵌套行从它的缩进处开始。缩进现在位于行内部，因此箭头、图标和标签保持在原来的位置。缩进区域现在是行的一部分，因此会显示悬停反馈，点击它会激活该行：点击文件夹的缩进会切换该文件夹，而点击某行（其唯一操作是链接）的标签之外的任何位置会跟随链接，正如 Enter 已经做的那样：修饰键会保留，因此 Cmd/Ctrl 点击会打开新标签页，中键点击也会打开一个。行的起始或结束内容中的控件保留自己的点击，包括基于角色的控件，例如 `role="switch"` 元素，它不再同时切换该行或运行其 `onClick`。引导线绘制在行上方，因此悬停或选中填充不会打断它们，并且它们会让点击穿透到下面的行。唯一的例外是带有键盘焦点的行：它会绘制在引导线上方，因此引导线永远不会切断其焦点环，这意味着如果它同时被填充（选中或悬停），它的填充会在该行覆盖引导线。通过 `tree-list-item` 主题目标或项的 `className`、`style` 或 `xstyle` 设置的内边距仍会与缩进组合。`--tree-list-indent` 仍会重新调整缩进步长。没有支持的方法可以保留旧的缩进行。

#### 问题修复

- 允许 MetadataList 标签宽度在没有显式位置的情况下使用，同时保留单列和多列标签默认值 (#6310)
- AppShell：将移动端导航 Activity 边界的隐藏推迟到其关闭动画结束 (#5701)
  `AppShell` 把移动端导航抽屉挂载在一个 `React.Activity` 边界内，该边界在与抽屉关闭相同的提交中切换为 `mode="hidden"`。React 的 `Activity` 会同步用 `display: none !important` 隐藏其子树，并重新运行其中每个 effect 的清理，这会在 `MobileNav` 自己的滑出 CSS 过渡以及延迟的 `dialog.close()` 有机会运行之前将它们切断。抽屉仍能正确关闭（一个安全网 effect 会在同一次清理中强制关闭原生对话框），只是完全跳过了关闭动画。

  `AppShell` 现在会在抽屉关闭后让 `Activity` 边界保持可见一小段时间，严格长于 `MobileNav` 自己最坏情况下的关闭延迟，因此 `MobileNav` 的正常关闭 effect 有机会运行其过渡和自己的定时 `dialog.close()`，之后 `Activity` 才隐藏子树。

  `MobileNav` 还会在关闭它的提交中保持其对话框渲染，直到其延迟的 `close()` 运行，而不是依赖对话框的离散 `display` 过渡来完成。不支持该过渡的浏览器（WebKit）会在它仍是打开的模态框时立即把对话框降为 `display: none`，因此大约 200ms 内什么都看不到，页面保持 inert。滑出本身未改变。

- `AspectRatio` 的 `fit="cover"` 和 `fit="contain"` 现在会在文档所述的 Tailwind 设置中填满盒子。fit 规则位于 `reset.css` 的 `reset` 层中，而设置指南把 Tailwind 的 preflight 放在其上一层，因此 preflight 的 `img, video { height: auto }` 胜出，适配后的图片保持自己的宽高比。fit 尺寸现在随组件自己的样式一起发布在 `astryx-base` 中：位于 preflight 之上、Tailwind 工具类之下，因此子元素上的工具类仍然胜出。`reset.css` 不再包含 AspectRatio 规则。
  使用 `fit="cover"` 或 `fit="contain"` 时，直接子元素自己的 Astryx 样式（Astryx 组件自己的尺寸或 `object-fit`）不再覆盖填充。若要保留子元素自己的尺寸，请用内联样式、无层 CSS 或更后层中的规则设置它，或者不设置 `fit`。

- 静态的 `AvatarGroupOverflow` 小片（无 `onClick`）会作为图像暴露给辅助技术，由其计数标签命名（"5 more"）。以前，它是一个带 `aria-label` 但没有角色的 span，而通用角色不允许名称，因此屏幕阅读器可能会跳过计数。这符合 WCAG 2.2 SC 4.1.2 Name, Role, Value。视觉上没有变化；可点击的小片仍是按钮，调用方传入的 `role` 仍然胜出。
- `Button`（以及 `IconButton`）在忙碌状态（`isLoading`，或正在进行的不可中断 `clickAction`）是按钮无法点击的唯一原因时，不再使用原生 `disabled` 属性。原生禁用的元素无法保持焦点，因此浏览器会在操作开始的瞬间把焦点移到 `<body>`，并且永远不会恢复——这是忙碌状态应仅作视觉反馈的经典原因。忙碌现在使用 `aria-disabled`（按钮保持可聚焦）以及 `aria-busy` 和 spinner，符合文档中的"Disabled vs Busy"API 约定以及输入组件已经遵循的行为。`isDisabled`（以及 `isDisabled` 与忙碌状态一起）未改变——它仍使用原生 `disabled`。`isInterruptible` 也未改变。
  `aria-disabled` 与原生 `disabled` 不同，仍会让按钮派发点击——忙碌保护已经调用 `preventDefault()` 来阻止按钮自己的操作，但对忙碌按钮的点击仍可能冒泡到包裹祖先自己的点击处理器（可点击行、卡片或背景），而以前的 native-`disabled` 行为从不允许这样。`handleClick` 现在还会在该保护中调用 `stopPropagation()`，像原生禁用控件一直做的那样，在 Button 边界内收住不可用的点击。

  渲染为 `href` 的锚点路径在键盘激活方面有相同的缺口：它只把 `onClick` 接到忙碌保护，而没有接 `onKeyDown`，因此调用方自己的 `onKeyDown` 仍会在仅忙碌的锚点 Button 上收到 Enter/空格，尽管它被播报为 `aria-disabled`。锚点路径现在接入了按钮路径已有的相同 `handleKeyDown` 抑制，因此 Enter/空格会被吞掉，其他每个键仍会到达调用方，两条渲染路径都是如此。

- `ChatLayoutScrollButton`：滚动到底部的胶囊在开始隐藏时就放弃键盘焦点，并拒绝新的焦点。以前焦点会在淡出的胶囊上停留约半秒，直到 `visibility: hidden` 生效，因此它可能停留在一个正在淡出或已经透明的控件上（WCAG 2.2 SC 2.4.7 Focus Visible）。(#7738)
- 在 CheckboxInput 上保留调用方提供的 ID，并保持标签与原生输入框关联。
- CheckboxList 会保留调用方的 `aria-labelledby`。该组总是用它自己的标签 id 替换它，因此调用方的 id 从未到达可访问名称。现在该组先由其标签命名，然后由调用方的 id 命名，与 RadioList 和 TimeInput 使用的顺序相同。
- 设置提醒、swizzle StyleX 说明和一行 doctor 输出只陈述真实的内容
- `CommandPaletteInput`：查询字段现在会绘制共享的键盘焦点环。以前它会抑制浏览器轮廓而不替换它，因此键盘用户无法看到哪个字段持有焦点。
- 通过 Next.js 的 Babel 进行的源码构建不再在应用未设置 browserslist 或目标浏览器不支持 Unicode 属性转义时失败，报 `Unknown property: L`（或 `Zs`、`Letter`）。`Avatar` 的首字母缩写以及 Markdown 解析器的强调和标题链接规则现在会在运行时构建其 `\p{…}` 正则表达式，正如 `NumberInput` 已经做的那样，因此没有可供 Babel 重写的字面量。匹配未改变。
- `DrawerHeader` 现在会在其起始插槽中渲染数字零 `startContent`，并在没有关闭按钮时保留数字零 `endContent`。
- 当直接在 drawer 上设置 `dir="rtl"` 时，`Drawer` 现在会从正确的逻辑边缘滑入，与继承的从右到左区域一致。
- `DropdownMenuDivider` 现在会像其他拥有 DOM 的组件一样，把宿主属性和 DOM 处理器（`id`、`data-*`、`aria-*`、事件处理器）转发到其分隔符。以前，它只接受 `xstyle`、`className`、`style` 和 `ref`，丢弃其他所有内容，因此分隔符无法携带测试 id 或可访问标签。它的 `role="separator"` 和方向仍由组件拥有。
- DropdownMenu：仅在菜单显示时才加载触摸底部 sheet
  `DropdownMenu` 会预先导入其触摸 sheet（BottomSheet、其手势以及触摸操作列表），因此每个带下拉菜单的页面都会打包它，即使菜单只会作为锚定 popover 打开。sheet 现在按需加载，就像 `ContextMenu` 已经做的那样。仅 popover 的下拉菜单自身代码减少约三分之一（约 23 KB gzip 后）。底部 sheet 和 adaptive 菜单的行为与之前相同。sheet 会在触发器挂载时开始加载，而在它到达之前从键盘打开的菜单仍会在加载后聚焦其第一个操作。

- 当这些可选插槽收到布尔值或空字符串时，`EmptyState` 不再留下空白的图标或操作间距。空的描述也会省略其主题目标。文档现在描述了可配置的标题层级，并把容器解剖映射到公开主题目标。
- 当调用方传入冲突的 data 属性时，保持 `Field` 的水平标签布局标记具有权威性，并在该布局中保持隐藏描述视觉隐藏。修正其自定义标签图标类型、全部三种状态放置、完整解剖结构，以及无法安全使用附加状态的控件的指南。
- `FieldStatus`（以及任何使用 `useEntryAnimation` 的元素）不再在服务器渲染的页面上导致 hydration 不匹配。在服务器 HTML 中到达的元素现在会在没有入场样式的情况下 hydration，并且永远不会播放入场动画，即使 hydration 在页面绘制之后运行；hydration 之后挂载的元素仍会播放动画。`useEntryAnimation` 不再把服务器渲染记录为不支持。
- 当调用方传入冲突的 data 属性时，保持 `FormLayout` 的方向元数据具有权威性。
- `GridSpan` 会将其内容保持在 span 内。最小内容宽度大于 span 的子元素（例如带有长 token 的 `Tokenizer`）以前会把 span 的列拉伸超过网格单元格；现在它会获得 span 的宽度，并像在 Grid 外一样截断 (#7438)
- 当调用方传入冲突的 data 属性时，保持 `Grid` 的主题元数据具有权威性。
- `useHoverCard`：在指针停留在卡片上时用 `hide()` 或 Escape 关闭悬停卡片，不再让下一次打开卡住。该 hook 一直认为指针仍在卡片上，因为以这种方式关闭的卡片会在没有 `mouseleave` 的情况下卸载，因此触发器下一次悬停打开后永远不会在离开时或 `hideDelay` 之后关闭。两条路径现在都会清除该状态，正如触摸关闭已经做的那样。
- 在 UTC 锚点上计算 ISO 周数（`Calendar hasWeekNumbers`、`getWeekNumber`），而不是使用本地时间的 `Date` 算术。在夏令时在新年之后结束的时区（Sydney、Auckland、Santiago），该周星期四与 1 月 1 日之间的本地毫秒差会携带夏令时偏移，而在 1 月 1 日是星期五的年份，那个额外的小时会把整整一周向上舍入：2021 年 4 月的整个 ISO 第 14 周显示为第 15 周。现在周数在每个时区都一致。
- 锚定图层（`Popover`、`DropdownMenu` 以及建立在其上的每个组件）现在会在发布的样式表中保留其安全区域间隙和动态视口尺寸上限。编译后的 CSS 为优先值引用了一个未定义的变量，因此每个浏览器都使用回退值：在带动态工具栏或刘海屏的手机上，高图层可能超出可见屏幕或跑到声明的底栏下方。桌面尺寸未改变。
- `createMarkdownFrontmatter` 现在会向其 `parse` 函数传入普通对象，因此原样返回解码字段的解析器（`parse: fields => fields`）会被接受为元数据。以前，记录没有原型，无法通过类 JSON 元数据检查，文档会回退为可读文本并仍显示其 frontmatter。
- `MultiSelector`：键盘用 inline-end 箭头到达的行操作单元格现在会绘制标准焦点环。以前，其轮廓读取四个没有任何声明的 CSS 变量，因此活动操作单元格上不显示焦点环。
- PowerSearch：一次按下 clear-all 按钮清除所有筛选条件，而不是只移除最后一个筛选条件。
- 防止用鼠标按下内置 PowerSearch 筛选 token 时在筛选编辑器之前打开搜索建议。Token 编辑、移除和键盘导航保留其现有行为。
- 让内置 PowerSearch 值控件在只读筛选编辑器中保持禁用，与自定义编辑器一致。
- RadioList 会保留调用方的 `aria-labelledby`。radiogroup 总是用它自己的标签 id 替换它，因此调用方的 id 从未到达可访问名称。现在该组先由其标签命名，然后由调用方的 id 命名，与 TimeInput 使用的顺序相同。
- 当 Dialog 的内容在打开提交中挂载时，把焦点恢复到打开它的元素。打开者在 Dialog 的 passive effect 中被捕获，而该 effect 在刚挂载的 DialogHeader 的 autofocus effect 已经把焦点移到对话框自己的标题之后才运行——关闭时会把焦点恢复到那个已分离的标题，用户的焦点落在 `<body>` 上。捕获现在在 layout effect 中运行，早于任何后代的 passive effect。(#5637)
- `astryx search` 在词语与目录不同时，能更多地找到读者想要的内容。
- `astryx search` 会把匹配你更多词语的结果排在较短的命名条目之前。
- `SideNavItem` 会把调用方的 `className` 保留在其行元素（链接或按钮，以及折叠导轨项）上，与自己的类并列。以前，行生成的类会替换它，因此为行设置样式而传入的类（例如拖动行时的光标）从未到达 DOM，尽管 `style`、ARIA、data 属性和处理器都到达了。
- 将 Token 不可见的移除按钮点击目标从 44px 缩小到 24px，而不改变可见图标。现在点击 PowerSearch 中相邻的文本或值会编辑筛选条件，而不是意外移除它。
- DropdownMenu 子菜单飞出层会在菜单被轻触关闭时随之关闭：以前，通过点击或快速点击打开的子菜单在菜单关闭并重新打开后仍保持打开（并重新锚定到视口角落）。在菜单从其他地方关闭之前调度在子菜单触发器上的悬停打开也会被取消，因此它不再能在已关闭菜单后面重新打开飞出层
- `Switch` 现在会把调用方的 `aria-describedby` 添加到开关控件，位于其自己的描述、状态和禁用原因 id 之前。以前，该值落在字段包装器上，因此页面其他地方渲染的提示无法向辅助技术描述该开关。
- `Switch` 现在会把调用方的 `aria-labelledby` 放到开关控件上。以前，该值落在字段包装器上，因此行中其他地方可见的标题无法为辅助技术命名该开关。
- 被截断的 `Text` 或 `Heading`（`maxLines`）现在会在其内容变化时重新测量，而不仅是其盒子尺寸变化时。固定宽度的单行状态在消息改变后，其截断 tooltip 仍显示第一条消息，而新的短消息可能会保留 tooltip，而新的长消息却缺少 tooltip。`useTruncation` 现在还会观察元素的文本，因此 tooltip 文本和截断状态会跟随当前内容。
- 当 `ToggleButton` 同时收到 `onClick` 时（例如来自将它渲染为触发器的包装器），它仍会切换。该 `onClick` 以前会替换切换自己的点击处理，因此 `onPressedChange` 从未运行，`ToggleButtonGroup` 成员也从未请求其组切换（`pressedChangeAction` 仍会运行）。调用方的 `onClick` 现在先运行，然后才是切换请求。在独立的 `ToggleButton` 上，在该 `onClick` 中调用 `preventDefault()` 会取消请求：`onPressedChange` 和 `pressedChangeAction` 都不会运行。
- `useTooltip`（以及建立在其上的每个组件，例如 `Button` 的 `tooltip` 属性）现在会在 `isEnabled` 变为 `false` 时丢弃仍在等待延迟的显示。以前，在延迟内悬停触发器然后禁用其 tooltip，定时器仍会触发：tooltip 在其触发器被关闭后打开，没有留下指针离开监听器来关闭它。待处理的隐藏仍会运行，启用的 tooltip 未改变。
- Tooltip：仅图标的触发器现在会打开而不是抛出异常。图层会把其触发器作为调用方 `source` 传给 `showPopover`，而 Popover API 将其声明为 `HTMLElement`；调用方渲染的图标是 `SVGElement`，其字典转换会在 popover 打开前抛出异常，因此提示从未出现。图标触发器现在会在没有 source 的情况下到达 `showPopover`——定位未改变，因为图层由其 anchor-name 对锚定，只是放弃了调用方的焦点顺序。
- 移动端抽屉中折叠的 `TopNavMenu` 或 `TopNavMegaMenu` 区段现在是 `inert` 并对辅助技术隐藏，因此 Tab 不再把焦点移到未显示的链接上，屏幕阅读器也不再在播报为折叠的区段下列出它们。
- 移动端抽屉中展开的 `TopNavMenu` 或 `TopNavMegaMenu` 区段不再裁剪其项的焦点环。该区段在折叠时以及打开或关闭动画期间仍会裁剪。
- `Typeahead`、`Tokenizer` 和 `PowerSearch`：当搜索源被替换时清除加载状态并停止忙碌指示器 (#7457)

#### 性能

- 带 `maxLines` 和 `hasTruncateTooltip={false}` 的 `Text` 和 `Heading` 不再测量其文本或观察其尺寸和内容变化。只有 tooltip 使用该测量，因此在关闭 tooltip 时，文本仅由 CSS 截断，长表格中的截断单元格不再为每个单元格付出一次布局读取。渲染未改变；启用 tooltip（默认）时没有任何变化。

#### 文档

- `Avatar` 和 `AvatarGroup` 的文档列出了 `size` 接受的数字尺寸（16、20、24、32、36、40、48、60、64、72、96、128、144、180），而不是暗示任意像素值，并说明 `AvatarGroup` 的尺寸始终覆盖子 `Avatar` 的尺寸，包括组的默认值。
- 文档和 CLI 示例从 `astryx component <Name>` 打印的路径导入每个 Core 导出。
- `ContextMenu` 的文档现在说明数据驱动的 `items` 和复合的 `menuContent` 是互斥的选择，而不是把 `items` 标记为无条件必填。
- 记录 DropdownMenuGroup 的完整包装器属性、组语义和非交互式标题指南。
- 记录 FieldLabel 的完整公开属性表面、组标签语义和支持性描述。
- 使 `FormLayout` 文档与逻辑分数网格轨道和视口折叠一致，并使公开布局目标可以从组件解剖中发现。
- 使 `Grid` 和 `GridSpan` 文档与分数轨道尺寸、响应式 repeat 行为、隐式行和显式列跨度一致。
- `useCombobox`，从 `@astryxdesign/core/Selector` 导出的单选择 combobox hook，为 `Selector` 和 `CommandPalette` 提供支持，现在有了 hook 文档，因此 `astryx hook useCombobox` 和 `astryx search combobox` 会返回它及其选项、返回字段，以及如何在焦点保持在控件上时连接 `aria-activedescendant`。
- `useMultiCombobox` 的 hook 文档现在说明，即使有 `hasSearch` 或禁用的末端选项，用 ArrowDown 或 ArrowUp 打开列表也会落在第一个或最后一个选项上，并且该 hook 在 `hasSearch` 时仍会处理 Home 和 End，因此为光标保留这些键的搜索输入会先阻止它们并依赖 PageUp 和 PageDown。
- `useMultiCombobox`，从 `@astryxdesign/core/MultiSelector` 导出的多选择 combobox hook，为 `MultiSelector` 提供支持，现在有了 hook 文档，因此 `astryx hook useMultiCombobox` 和 `astryx search combobox` 会返回它及其选项（包括带操作单元格的网格行）、返回字段，以及如何在焦点保持在控件上时连接 `aria-activedescendant`。
- InternationalizationProvider 文档现在命名了其非视觉提供者边界，以便新的组件契约可以在不暗示渲染 DOM 的情况下映射其解剖结构。(#6048)
- `ListItem` 的文档现在把 `label` 列为 `ReactNode`，与其属性类型一致：字符串会被截断为一行，任何其他节点会按给定内容渲染。它们以前写的是 `string`，这会告诉读者富标签必须被重构掉。

#### 其他变更

- `VStack` 和 `HStack` 来自 `@astryxdesign/core/VStack` 和 `@astryxdesign/core/HStack`，`Heading` 来自 `@astryxdesign/core/Heading`，`Text` 来自 `@astryxdesign/core/Text`，`Theme` 和 `defineTheme` 来自 `@astryxdesign/core/theme`。
- 这涵盖指南、`Card` 文档、`astryx init` 打印的后续步骤、`astryx theme build` 打印的安装示例、`theme add` 打印的接线示例、构建规则、`astryx doctor` 打印的主题模块修复，以及带注释的主题模板。
- 每条路径都已经导出。其他没有任何变化。
- "运行 init 完成设置"的提醒不再在 agent 已经拥有 Astryx 提示的地方打印。在 git 仓库中，它会从项目到仓库根目录查找 agent 文档中的 init 块，因为编码 agent 会读取其间的每个 agent 文档，因此 monorepo 中在其根目录运行过 `init` 的包会保持安静。这适用于每条命令，以及安装 `@astryxdesign/core` 或 `@astryxdesign/cli` 时打印的提醒。从 CLI 自己的源码检出中、在该检出内运行 CLI 时，不会打印提醒。在触及范围内没有块的项目仍会得到它，而 `--json` 永远不会打印它。
- `astryx swizzle` 不再在没有 StyleX 编译器时说 StyleX 组件"render unstyled (no error)"。导入它们会抛出 StyleX 的"Unexpected 'stylex.create' call at runtime"错误，页面不会渲染，说明现在会这样写。
- 在集成包中（包自己的清单会加载），`astryx doctor` 的隐式集成行不再说"every loaded integration is named in astryx.config"。它会命名包自己的清单：作为唯一加载的集成，或与 astryx.config 命名的集成并列。

  分类：恢复契约。只有消息文本变化：JSON 键、检查 id、状态和退出码未改变。doctor 行的新文本也会出现在其 `--json` 的 `message` 中。

- 子菜单 header 和 footer 的内部基础工作：`DropdownMenu` 遍历其 header、菜单和 footer 的 Tab 步进原样移动到一个自己的模块中，以便另一个带区域的菜单层级可以共享它。`DropdownMenu` 的行为没有变化。
- 相邻的查询词如果组合成组件、hook 或模板名称，或组合成一个单词关键词，就会匹配它：`table header cell with sort arrow` 找到 `TableHeaderCell`，`tree view folders` 找到 `treeview` 关键词，而 hook 可以用其词语回应，无需 `use`。名称的大部分、名称的前导词，或名称词语的连续片段也会为组件和 hooks 计入，比完整名称低一档。
- 如果查询是一个 camelCase 标识符且按输入内容不匹配任何东西，则按它拼出的词语读取，因此像 `useTablePaginationState` 这样的未知 API 名称会到达 `useTablePagination`。在多词查询中，每个标识符保持为一个词项。
- 当整个查询就是一个条目的名称时，这些读取不会在它旁边添加近亲条目。对组合关键词的匹配永远不会排在一个被查询命名的条目之上，而对另一个名称一部分的匹配，只有在其跨越的查询词多于该条目名称时才会如此。
- 动名词会匹配其动词（`spacing` 和 `space`，`dragging` 和 `drag`），复数可以通过其单数形式开始一个更长的词（`tokens` 和 `Tokenizer`）。
- Core 组件文档声明了更多关键词：其他库的名称（`scrollarea`、`togglegroup`、`pageheader`、`splitpane`、`circularprogress`、`linearprogress`、`commandmenu`、`relativetime`、`sidesheet`、`descriptionlist`、`inlinecode`）以及 `Icon` 上的常见字形名称，因为任何图标库的字形都通过它渲染。
- JSON 形状未改变。
- 对更长名称一部分的匹配，如果读取的查询内容多于查询命名的条目，就不再被压在其下方：`dropdown menu radio options` 会以 `DropdownMenuRadioItem` 开头，而不是 `DropdownMenu`。
- `useResizable` 删除了 `splitview` 关键词，该关键词曾让它排在侧面板指南之前。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @azure-553
- @cixzhang
- @ernestt
- @Geervan
- @harjothkhara
- @HelloOjasMutreja
- @imdreamrunner
- @josephfarina
- @kentonquatman
- @korkt-kim
- @kyu-rong
- @latxh
- @ManoharPaturi
- @nynexman4464
- @potatowagon
- @Pushpak731
- @rapsealk
- @vjeux
- @WeAreResilience

---

# 0.7.1

#### 新功能

- Chat：通过 `ChatComposerTrigger` 上的可选启用 `hasMultiWordQuery`，可按多词名称提及人员和主题（#6128）
  在建议项包含空格的触发器上设置 `hasMultiWordQuery: true`，输入 `@Jordan Le` 会持续缩小菜单范围，而不是在第一个空格处关闭菜单。查询会一直持续到换行符或约 64 个字符处，除非选中某一行，否则已键入的文本绝不会改变；未匹配的多词短语会隐藏菜单，除非触发器设置了 `emptySearchText`。未选择启用的触发器仍会在空格处结束查询。

  对于每个触发器：当当前查询的结果仍在加载时，按 Enter 会按所键入的内容发送消息，绝不会从较早的查询中选中某一行。发送之后或编辑器清空之后到达的结果会被丢弃，因此菜单绝不会在空的编辑器上方重新打开。菜单隐藏时，Escape 和方向键会正常穿透，IME 击键绝不会选中任何行。

- `CodeBlock` 新增 `isDiff`，它是覆盖在任意 `language` 之上的 diff 层，Markdown 会将 ```diff 围栏渲染为着色的 diff 行，而不是纯文本。（#7389）
  启用 `isDiff` 后，以 `+` 开头的行位于成功色调的行上，`-` 开头的行位于错误色调的行上，`@@` 块头（以及紧接在其前面的 `--- `/`+++ ` 文件头对）位于低调的弱化色行上，其余每一行保留该语言的语法高亮。符号渲染在自己的列中，因此代码的缩进在每一行都对齐，并保留在复制的文本中。变更行的边距也体现变更：色调延伸到行号装订线下方，并跨越长行的整个滚动宽度，行号和符号采用该行的标记颜色，而代码保持语法主题的颜色。这些是五个新的语法主题槽位——`--color-syntax-added`、`--color-syntax-removed`、`--color-syntax-diff-header`（行绘制色，默认在 25% 强度下使用 `--color-success-muted` 和 `--color-error-muted`，并使用 `--color-background-muted`；定义了语法主题但未设置块头绘制色的，则没有块头绘制色，其块头行以自身的标点颜色坐在自身背景上）以及 `--color-syntax-added-marker`、`--color-syntax-removed-marker`（在默认语法主题中默认使用 `--color-text-green` 和 `--color-text-red`；定义了语法主题但未设置它们的，保留自己的行号颜色）——因此现有和自定义语法主题无需更改，也可以覆盖它们。

  Markdown 将 ``diff-<lang> 围栏映射到 `<lang>` 之上的层（标记为 `<lang> diff`），并将 ``diff 围栏映射到纯文本之上的层（标记为 `diff`），因此 diff 会保留其块头、复制按钮、展开控件，以及仍写着 `diff` 的视口名称。

  应当保持纯文本的 `diff 围栏可以使用 `text。自定义 `components.code` 渲染器保持不变：它仍会在 `language` 中收到围栏的前导单词字符（对于 `diff 和 `diff-tsx 都是 `diff`，与现在一样），因此现有的 `language === 'diff'` 检查仍会匹配，并且不会收到任何新内容。

- 可清除的输入框：清除按钮的提示现在只显示“Clear”（已本地化），不再重复字段的标签，因此长标签不再变成诸如“Clear Assigned engineering partner”这样别扭的提示文案。按钮的无障碍名称不变，仍会指明字段，例如“Clear Search”。适用于所有渲染共享清除按钮的输入框，包括 `TextInput`、`NumberInput`、日期和时间输入框、`FileInput`、`Selector`、`MultiSelector`、`Typeahead` 和 `Tokenizer`。覆盖新的 `@astryx.inputClearButton.tooltip` 目录键即可更改措辞。（#7476）
- `Markdown` 的围栏代码块会折弯长行，而不是让它们横向滚动。窄屏幕上的读者无需横向滚动就能看到整行，在 `Markdown` 和 RichText 为代码块设置相同宽度的地方，长行在两者中占用的行数相同。只有外观发生变化：代码文本、行号、语法颜色以及 Copy 返回的内容都不变，行不再溢出的代码块也不再占用滚动区域的 Tab 停靠点，正如始终能完整显示的代码块那样。要保留旧的横向滚动外观，可通过 `components.code` 属性自行渲染代码，并使用未开启 `isWrapped` 的 `CodeBlock`。（#7564）
- Selector、MultiSelector 和 ComplexSelector 新增 `secondary` 变体：一种无边框、中性填充的触发器，与导航和工具栏组合中的次级按钮相匹配。在 `InputGroup` 内，secondary 的 Selector 或 MultiSelector 保留其填充，并采用该组的行高和相连的边缘。现有的 `input`（默认）和 `ghost` 行为不变。（#7252）

#### 问题修复

- `Typeahead`、`Tokenizer` 和 `PowerSearch`：当搜索源改变后，在空字段上聚焦并使用 `hasEntriesOnFocus` 时，现在会从新的搜索源引导条目。此前，从旧搜索源缓存的结果虽已失效，但仍会阻止引导，因此聚焦或点击进入该字段时不会打开任何内容，直到用户开始键入。仍然有效的缓存结果会像以前一样重新显示，无需重新引导。（#7157）
- `BottomSheet` 在指针关闭后返回焦点时不显示焦点环（WebKit 中的点按，或从键盘打开的置层被指针关闭），而在键盘关闭后保留焦点环，包括调用方渲染的 `DropdownMenu` 底部工作表触发器（`renderTrigger`）。该置层现在会让浏览器不把该焦点视为键盘焦点，就像 Dialog 的焦点移动那样。（#7388）
- 在清除字段后保持 DateInput 的日历选择为空。（#6935）
- `Calendar`：PageUp 和 PageDown 将聚焦的日期按月移动——移动到网格显示的月份中同一天（如果该日存在）——而不是按周移动；从借用的相邻月份日期翻页后，会落在当前显示月份的同一天，而不是该月的第一天。在两个月的视图中，从第一个月跨月边缘翻页或用方向键跨越时，现在会落在正确的日期（第二个网格不再覆盖第一个网格的目标）。越过 `min`/`max` 的方向键或翻页不会做任何更改，翻页到没有可用日期的月份时，焦点仍留在网格内。（#7467）
- `Calendar`：方向键、Home 和 End 不再落在借用的相邻月份日期上（这些日期显示为暗色、暴露为禁用，且对 Enter、Space 和点击无响应）。方向键会跨入该月份并聚焦其中真实的日期，包括在两个月视图的两个网格之间；Home 和 End 会停在当前显示月份中该周第一个或最后一个可用日期。没有可用日期的月份不包含 Tab 停靠点。（#7511）
- 带 `hasWeekNumbers` 的 `Calendar`：周数列上方的空白单元格现在是一个 `columnheader`，以区域设置中表示周字段的词语命名（来自 CLDR，视觉上隐藏），因此表头行中的每个单元格都具有网格角色，辅助技术读取星期表头行时不会遇到意外的未命名单元格。（#7509）
- `ChatMessage` 不再为不渲染任何内容的头像、名称或元数据留出空白。布尔值和空字符串不会创建槽位，任何其他不渲染内容的槽位内容（例如空 Fragment 或返回 `null` 的组件）会折叠其包装元素。不渲染文本的名称会回退到已翻译的发送者标签，而 `0` 这样的数值仍会渲染。（#6597）
- `CodeBlock` 的代码视口只有在内容实际溢出时才成为键盘 Tab 停靠点，这通过共享的滚动能力实现：短代码片段不再向页面的 Tab 顺序添加无法解释的停靠点，宽或受高度限制的代码块仍然会有，而停止溢出的视口会让焦点留在原处。角色和无障碍名称不变。（#7424）
- `CommandPaletteInput` 现在暴露其可见状态所承诺的语义和名称。（#7321）
  - 没有弹出层属性的独立字段原本是 `role="combobox"`，带有 `aria-expanded="true"` 和 `aria-autocomplete="list"`；现在它是 `role="searchbox"`，没有弹出层状态。传入 `role="combobox"`，或你弹出层自己的 ARIA 属性，以保留旧语义。已经传入弹出层属性（`aria-expanded`、`aria-controls`、`aria-owns`、`aria-haspopup` 等）的字段仍为 `combobox` 并保留这些属性，`CommandPalette` 内部的字段不变。

  - 字段的默认无障碍名称原本是其占位符（`Search…`，或调用方的 `placeholder`）；现在它是 `Search commands`（已翻译）。传入 `label` 以保留特定的名称，例如 `label="Search…"` 可恢复旧的默认名称。自定义 `placeholder` 曾用作名称的调用方，代码仍可运行，但会听到通用名称，直到传入 `label`。

  - CLI 的异步搜索 CommandPalette 块将其字段命名为 `Search files`。

  - `endContent={true}` 不再渲染空的尾部槽位，`endContent={0}` 会渲染在尾部槽位内部，而不是其后。
- 独立的 `CommandPaletteItem` 现在会在其渲染的选项上保留调用方提供的 id，并在禁用时忽略点击回调，因此标签和测试钩子仍指向该选项，禁用的命令也无法运行。（#7324）
- `CommandPalette` 现在使关闭、文本输入、结果聚焦和空状态播报与读者看到的内容保持一致。（#6950）
  - 当不存在可选结果时，结果容器不再暴露空的 `listbox`，查询字段报告 `aria-expanded="false"`，且没有 `aria-controls` 或 `aria-activedescendant`。此前它是一个展开的 combobox，控制着一个空的 listbox。

  - Home 和 End 会像在任何文本字段中一样移动查询字段中的光标；此前它们会跳到第一个和最后一个结果。Page Up 和 Page Down 仍会跳到第一个和最后一个结果。

  - 没有结果的搜索会在搜索稳定后播报面板渲染的空消息（默认 `No results`，或调用方的 `emptySearchText`）。此前无论面板显示什么，都会播报 `No results for <query>`。覆盖 `@astryx.commandPalette.noResultsFor` 目录项不再有任何效果；请使用 `emptySearchText` 自定义消息。
- 当触发器位于滚动容器内时，`ContextMenu` 现在可以在 Safari 中绘制。菜单锚定在指针处的一个盒子上，而该盒子是空的：WebKit 会将滚动容器内的空锚定盒视为被裁剪，因此默认的 `position-visibility: anchors-visible` 隐藏了打开的菜单。现在锚点尺寸为 1px，并保持在触发器内部，因此当滚动容器裁剪指针位置时菜单仍会隐藏，并在滚动回来后再次绘制。指针打开的菜单现在起点低 1px，位于指针下方像素之下。（#7369）
- `ContextMenu` 现在允许 Escape 先关闭最顶层的嵌套覆盖层，再关闭菜单本身，并在添加自身处理器的同时保留调用方触发器的处理器，因此从菜单打开的覆盖层仍可使用，产品事件逻辑仍会运行。（#7167）
- `DateInput` 和 `DateTimeInput` 共用的触摸月份滚动器：在 RTL 下，水平箭头遵循阅读方向（ArrowLeft 移动到次日，ArrowRight 移动到前一日），并且每次键盘移动——方向键和 Home/End——现在都会落在各自月份窗格中真实的日期上，而不是相邻窗格在其边缘显示的暗色禁用副本。触摸滚动不变。（#7466）
- `DateRangeInput`：使用键盘激活清除按钮后，焦点现在会返回到范围触发器。此前一旦范围被清除，按钮就会卸载，焦点落到 `<body>`，因此键盘用户必须从页面顶部重新 Tab 进来。指针清除不变。（#7507）
- `Dialog` 现在在保留受控背景关闭行为的同时，保留调用方的 `onClick` 处理器。（#7452）
- `DialogHeader` 现在会在其 `startContent` 和 `endContent` 包装元素及主题目标内保留有效的数值 0 内容。（#7454）
- `Divider` 现在会将有标签的分隔线内的数值 0 标签保留下来，并省略布尔值或空字符串标签，且不会留下空的标签间距。（#7572）
- `DropdownMenuCheckboxItem` 现在在保留其选中状态、禁用、悬停聚焦和关闭菜单行为的同时，保留调用方的点击和指针移动处理器。（#7573）
- 带 `header` 或 `footer` 的 `DropdownMenu` 现在会作为围绕其菜单的模态对话框暴露，符合 APG Dialog 模式的要求。弹出层是一个具名的 `role="dialog"`，带有 `aria-modal`，其中包含 `role="menu"`；触发器显示 `aria-haspopup="dialog"`，其 `aria-controls` 指向承载该对话框的弹出层。Tab 和 Shift+Tab 会在表头、菜单和页脚之间循环，而不是在任一端关闭菜单。Escape 仍会关闭并将焦点返回到触发器。没有这两个属性的菜单不变。（#7515）
- 调用方渲染触发器的 `DropdownMenu`（`renderTrigger`）在指针选择后（Chromium 中的鼠标点击，WebKit 中的点击或点按）会向触发器返回焦点且不显示焦点环，正如内置触发器已经做的那样：菜单现在会让浏览器不把该焦点视为键盘焦点，就像 Dialog 的焦点移动那样。（#7382）
- `DropdownMenu` 和 `MoreMenu`：禁用的触发器不再打开菜单。带提示的禁用触发器仍可聚焦（`aria-disabled`），而 Button 只吞掉了 Enter 和 Space，因此 ArrowDown、ArrowUp、按下或点击仍可能打开锚定菜单；锚定打开路径和底部工作表触发器的点击现在会先检查触发器的可用性，适用于默认 Button 以及原生或 `aria-disabled` 的自定义触发器。（#7475）
- `FormLayout`：在低于 480px 的折叠视图中，`direction="horizontal-labels"` 的控件现在会像垂直 `FormLayout` 中那样填满列。此前每个控件会收缩到内容宽度，因此 `Selector` 只有其当前值那么宽。480px 以上的两列布局不变。（#7501）
- 用作 InputGroup 附加项的按钮现在会共享该组的外形，在相邻输入框相接处使用方形内角。（#7233）
  独立按钮和输入框内渲染的按钮保留其现有形状和行为。

- 保持 `useHoverCard()` 触发器 ref 在未更改的重渲染之间稳定。该 hook 在每次渲染时都会返回新的 `ref`/`interactionRef`，因为其回调依赖于整个 `layer` 和 `touch` 对象，而这些对象每次渲染都会重建——React 会在每次重渲染时分离并重新附加每个触发器监听器，并重写触发器的内联 `anchor-name`。现在这些 hook 改为依赖稳定的 layer 和 touch 成员，与 #5951 中的 Tooltip 修复一致。（#6472）（#6606）
- MobileNav：抽屉关闭时，将焦点返回到打开它的元素。该抽屉完全依赖浏览器隐式的 `<dialog>` 焦点恢复，而据报告这在 Safari 26.5.2 中失败：关闭后 `document.activeElement` 变成 `<body>`，使键盘和屏幕阅读器用户滞留在文档顶部。MobileNav 现在会在 `showModal()` 将焦点移入顶层之前捕获打开者，并在原生对话框关闭后立即归还焦点，与 `Dialog` 已有的行为一致。关闭会延迟到滑出动画播放完毕，因此焦点恢复也会等待它；在此之前文档其余部分处于 inert 状态，过早的 `focus()` 会被静默丢弃。该恢复也覆盖 AppShell 路径，其中抽屉是由 `<Activity>` 切换到 `mode="hidden"` 拆除的，而不是由关闭分支重新运行。无 API 变更。当没有真正的打开者（`activeElement` 为 `<body>`）、打开者此后已离开 DOM，或抽屉在其待处理关闭运行前重新打开时，焦点保持不变。（#3343）（#4410）
- `MultiSelector`：使用键盘激活清除按钮后，焦点现在会返回到触发器，正如 `hasClear` 文档所述。此前一旦选择为空，按钮就会卸载，焦点落到 `<body>`，因此键盘用户必须从页面顶部重新 Tab 进来。指针清除不变。（#7506）
- `NumberInput`：屏幕阅读器的“Invalid number”警报现在会通过 i18n 翻译器，因此 `InternationalizationProvider` 的区域设置或覆盖可以替换它。向 `en` 目录添加 `@astryx.numberInput.invalidNumber`。尚无翻译的区域设置仍会回退到英语。（#7482）
- `astryx.css`、`reset.css` 以及所有其他包样式表（`richtext.css`、`lab.css`、`charts.css`）现在都以 `@layer reset, astryx-base, astryx-theme;` 开头，与主题样式表携带的行相同。无论哪个 Astryx 样式表先加载，Astryx 层顺序都成立：在 `astryx.css` 之后加载 `reset.css` 不再让重置覆盖组件样式，主题覆盖仍会胜出。已经在自己第一行声明该顺序的设置不变。（#7585）
- `plainDateToInstant` 现在会按 Temporal 默认的 `"compatible"` 消歧方式解析被跳过和重复的墙上时间。（#7081）
  - 被跳过的墙上时间会向前移动时间间隔的长度。在本地午夜从负偏移夏令时跳进的时区，例如 2026 年 9 月 6 日的 America/Santiago 或 2026 年 3 月 8 日的 America/Havana，当天开始时间原本会作为前一天的晚上 11:00 返回，因此周或日范围会落在错误的日期；现在它是当天的第一个时刻（凌晨 1:00）。

  - 重复的墙上时间在所有时区都会解析为较早的那次出现。在正偏移时区，例如 2026 年 10 月 25 日的 Europe/Berlin，此前会解析为较晚的那次。
- `Calendar`：1-99 年的日期现在显示自己的年份，而不是 1900-1999 年。值为 `0001-01-15` 时，以前标题为“January 1901”，并带有 1901 年的星期布局和日期标签，而 `onChange` 仍会发出第 1 年的 ISO 日期。标题、日期网格、周数、天数计数和时区时刻背后的共享日期辅助函数现在会按给定值保留 1-99 年。仍有一个限制：在 UTC 以西的时区，第 1 年 1 月 1 日的时刻仍会早一年，因为其时区偏移是从没有纪元的公元前 1 年墙上时钟读取的。（#7465）
- `PowerSearch`：在筛选编辑器中的聚焦按钮上按 Enter 现在会激活该按钮。在 Cancel 上按 Enter 会关闭编辑器而不应用草稿，在 Delete 上按 Enter 会移除筛选器；此前两者都会应用草稿。在文本或数字值字段中按 Enter 仍会应用筛选器；在日期选择器的日历按钮上按 Enter 现在会打开日历。（#7500）
- `CommandPaletteList` 在独立使用时现在会保留调用方提供的 id，而受管理的 `CommandPalette` 仍会分配其搜索字段所控制的 ARIA id。外部标签和测试钩子保持附着，同时不会破坏面板的 combobox 关系。（#6988）
- `reset.css` 不再用 `display: none` 隐藏 `hidden="until-found"` 内容。浏览器自身的渲染 `content-visibility: hidden` 现在会生效，因此页面内查找和文本片段链接可以找到并显示该内容，符合 HTML 标准的规定。普通 `hidden` 元素仍为 `display: none`，不支持 until-found 的浏览器仍会用自己的 `[hidden]` 规则隐藏内容。（#7520）
- `ResizeHandle`：在折叠的窗格上，用于放大的箭头现在会将其打开到最小尺寸之上一档，或者当 `collapsedSize` 更大时打开到该尺寸（此前比折叠阈值低一档，仍会保持折叠）；用于缩小的箭头仍是空操作。Enter 和双击仍会恢复之前的大小。（#7512）
- `ResizeHandle`：在折叠窗格上按 Enter 或双击会将其恢复到折叠前的大小，而不是最小尺寸，并且即使 `minSize` 低于 `collapsedSize` 也会重新打开。该手柄使用 `useResizable` 自己的折叠和展开过渡；`ResizableProps` 不变，手工构建的 props 对象会保留之前的调整到最小尺寸行为。（#7479）
- `ResizeHandle`：设置吸附点后，方向键会将窗格按方向移动到相邻吸附点（Shift 移动两个），超出边界的点按该边界计算——此前 10px 的步进会直接弹回起始点。有吸附点时，处于最低点的缩小箭头不再折叠可折叠窗格；Enter、双击和拖动仍会折叠。（#7514）
- `ResizeHandle`：区域未设置 `maxSize` 的分隔条现在会报告 `aria-valuemax`——用测得的范围代替缺失的最大值（区域轴向上的窗口范围，或在百分比边界观察时容器的内容盒），且绝不会低于当前大小，或在折叠时低于最小值。容器内仅以像素定义的区域仍不报告最大值（测量会增加一个观察器）。`ResizableProps` 不变；End 仍只移动到配置的最大值。（#7481）
- `useScrollOverflow`（`TabList` 的条带、`Carousel` 的滚动器）只在容器渲染时测量尺寸变化及其注册时的容器。在 `display: none` 祖先或 `content-visibility: hidden` 子树内，该 hook 会保持最后的状态，而不是读取布局，因为在那里读取布局会让浏览器为了得到答案而渲染整个隐藏子树；随显示而来的 resize 观察会在显示绘制后一帧再次测量。滚动无论是否隐藏都会被测量，因此容器脚本在隐藏时滚动（选中标签的显示）在不会引起 resize 的显示时也是正确的。此前，隐藏的容器报告没有溢出。（#7518）
- `secondary` 的 Selector、MultiSelector 或 ComplexSelector 现在会匹配主题的次级 Button：在 butter、chocolate、gothic、stone 和 y2k 下，它会采用该 Button 的边框、填充、文字颜色和悬停效果，而不是默认的无边框中性填充，因此混合了次级按钮和选择器的工具栏读起来像一组控件。禁用和只读触发器在悬停时保持静止填充，就像禁用的 Button 那样，而 InputGroup 内的 Selector 或 MultiSelector 会保留该组的中性填充和边缘。默认主题不变，选择器文档现在说明 `secondary` 遵循主题的次级 Button，通过 CLI 添加的主题也会获得相同的对齐。（#7548）
- `Selector`：使用键盘激活清除按钮后，焦点现在会返回到触发器，正如 `hasClear` 文档所述。此前一旦值被清除，按钮就会卸载，焦点落到 `<body>`，因此键盘用户必须从页面顶部重新 Tab 进来。指针清除不变。（#7455）
- `SideNav`：调整大小手柄现在通过 `aria-controls` 指明它所调整的导航窗格（当调用方未提供 id 时，导航会获得生成的 id），符合 APG 窗口分隔条模式的要求，因此辅助技术可以将分隔条与该窗格关联起来。（#7473）
- `Slider`：End 现在会到达 `max`，即使步进网格没有落在其上（对于 `max={100}` 和 `step={3}`，End 原本停在 99）。方向键和 Page 键的结果仍会吸附到最近的步进，然后进行钳制。（#7484）
- `Slider`：在 RTL 下的水平轨道上，方向键现在会遵循镜像轨道——ArrowLeft 增加值，ArrowRight 减小值，与滑块在屏幕上的移动方向一致。ArrowUp/ArrowDown、PageUp/PageDown、Home/End 和垂直滑块不变。（#7461）
- 阻止 Tokenizer 的 `hasCreate` “Create X”条目提供已以不同 id 创建为令牌的标签。重复检查将键入的文本与已选 id 进行比较，但真实选择通常带有不透明的 id（标签“Alice”下的 `u1`），而搜索结果无法捕捉到匹配，因为它们已被预先筛选以移除已选项目——因此键入现有令牌的标签会提供“Create”，从而用新的 id 提交第二个重复令牌。现在该检查还会在 Create 条目和过期条目提交守卫中比较已选标签（不区分大小写）。（#6367）
- 将 Toolbar 的键盘导航和漫游 Tab 停靠点保持在嵌套弹出菜单之外，同时不禁用外部弹出层内的工具栏导航。（#7446）
- `TreeList`：每一行现在仅由其标签命名，并由其描述进行描述（在 `treeitem` 上使用 `aria-labelledby`/`aria-describedby`），因此屏幕阅读器不再将折叠箭头切换按钮的标签或描述作为行名称的一部分读取，链接行和操作行也作为行来命名，而不仅仅通过其内部控件。Typeahead 会匹配标签，而不是行的全部文本。（#7472）

#### 文档

- `AlertDialog` 的解剖结构列出了对话框表面——承载标题、描述和按钮的模态面板——`Calendar` 的解剖结构列出了日历根和日期按钮，因此每个带有主题目标的部分（`alert-dialog`、`calendar`、`calendar-day`）都在组件文档中命名。（#7464）
- 在 `DateInput` 的 API 参考中列出 `containerClassName`、`containerStyle`、`controlClassName` 和 `controlStyle` 属性，与 `containerXstyle` 和 `controlXstyle` 并列。（#7372）
- Grid 的 `columns` 文档现在以会重排的形式开头：数值 `columns` 在任何宽度下都恰好是 N 列且从不重排，而 `columns={{minWidth, max}}` 是必须能在手机上存活的列所采用的形式。`astryx docs layout/responsive` 主题新增了“Columns that reflow”一节，其中有一个会重排的统计行与一个固定周行并列。无行为变更。（#7340）

#### 其他变更

- 当 StyleX 拒绝 `border`、`background` 或 `all` 简写这样的声明时，核心构建现在会失败，而不是将其从发布的 CSS 中静默丢弃。生成的 `dist/` 不变。无 API 变更。（#6830）

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @athz
- @barm
- @cixzhang
- @ernestt
- @Geervan
- @harjothkhara
- @imdreamrunner
- @korkt-kim
- @kyu-rong
- @ManoharPaturi
- @rubyycheung
- @vjeux

---

# 0.7.0

#### 破坏性变更

- 停止从 `Banner.status` 推导实时区域角色。Banner 默认不是实时区域；请在实际的异步过渡处理器中调用 `useAnnounce`，或为持久的语义镜像提供显式的 `role="status"`。（#6630）
  对于警告和错误 Banner，`role="alert"` 现在是可选启用，而不是自动设置。

  旧用法：`Banner` 从其 `status` 变体推导 `role="status"` 或 `role="alert"`。

  替代方案：调用方显式设置角色，或使用 `useAnnounce` 进行播报。

  迁移：在实际的异步过渡处理器中调用 `useAnnounce`，或为持久的语义镜像提供显式的 `role="status"`。

  Codemod：无——正确的播报方式取决于调用点。

- Layout、MetadataList、NavHeadingMenuItem 和 TopNavMegaMenuItem 现在会应用它们接受的 BaseProps（id、role、aria-\*、data-\*、hidden、inert、dir、事件处理器；TopNavMegaMenuItem 还包括 xstyle/className/style），而不是静默丢弃；当项目处理器取消时，NavHeadingMenu 会保留方向键导航。（#7331）
  迁移：移除你传入并依赖其被忽略的那些属性；通过 xstyle/className/style 设置样式的 TopNavMegaMenuItem 现在会显示该样式。

  来自 @harjothkhara 的 #5656。

- BottomSheet 默认会为其内容添加内边距，与 Dialog 一样。在没有 `padding` 属性且没有主题内边距时，内容盒现在会按 `--spacing-4` 添加内边距（此前没有内边距），并发布该内边距。
  唯一子元素是带内边距的 `Section` 或 `Layout` 的置层渲染结果与之前相同，因为两者都会避开该内边距。自行提供内边距的内容现在会被填充两次：去掉该内边距，或传入 `padding={0}` 以保持无内边距的内容盒。`astryx upgrade` 提供 `preserve-bottom-sheet-content-padding`，会在需要的地方添加 `padding={0}`。

  迁移：传入 `padding={0}` 以保持无内边距的内容盒，或去掉你自己的内边距以采用默认值；`astryx upgrade` 会为每个未设置内边距的 BottomSheet 添加 `padding={0}`，除非其唯一子元素是带内边距的 Section 或 Layout。主题已在每个边缘设置 `bottom-sheet` 内边距的应用不受新默认值影响；Codemod 无法看到主题，因此请移除它在那里添加的 `padding={0}`，以保留主题内边距。内容包裹 `Layout` 的置层会得到一个 TODO：`padding={0}` 还会移除该 Layout 各区域之间的内边距，而 Layout 自身的 `padding` 无法恢复它。

- 完整的 `IconRegistry` 类型要求提供 `upload`（#7329）
  旧用法：类型为 `IconRegistry` 的自定义完整图标注册表省略了 `upload` 键。

  替代方案：`IconRegistry` 现在要求所有语义 `IconName` 键，包括 `upload`。

  迁移：为类型为 `IconRegistry` 的完整图标注册表添加一个按该注册表图标风格绘制的 `upload` 条目。

  Codemod：没有适用的 `astryx upgrade` Codemod，因为图标图形是为每个主题量身定制的专属设计图形，无法自动合成。

- 将规范的数据颜色默认值从生成的 CSS 主题移动到公开的 StyleX `dataVars` 组。（#6834）
  对支持 CSS 的代码，从 `@astryxdesign/core/theme/dataTokens.stylex` 导入 `dataVars`。Canvas 和其他非 CSS API 继续使用 `resolveThemeToken()` 或 `useTheme().token()`。使用 `astryx theme build` 重新构建已提交的主题 CSS；具体主题现在只发出显式编写的数据颜色覆盖。

  旧用法：生成的 CSS 主题拥有规范的 `--color-data-*` 根默认值。

  替代方案：公开的 StyleX `dataVars` 组（位于 `@astryxdesign/core/theme/dataTokens.stylex`）拥有默认值；具体主题只发出显式编写的数据颜色覆盖。

  迁移：对支持 CSS 的代码，从 `@astryxdesign/core/theme/dataTokens.stylex` 导入 `dataVars`。Canvas 和其他非 CSS API 继续使用 `resolveThemeToken()` 或 `useTheme().token()`。使用 `astryx theme build` 重新构建已提交的主题 CSS。

  Codemod：`astryx upgrade` 运行 `validate-data-token-ownership`，它不会重写任何内容，只会报告缺少回退的 `var(--color-data-*)` 用法（完整的或嵌入的源字符串，以及样式表）和过时的生成主题 CSS，供手动迁移。

- DateInput、DateRangeInput、DateTimeInput 和 TimeInput 不再接受根级 `xstyle`、`className` 或 `style`。请使用 `containerXstyle`/`containerClassName`/`containerStyle` 为字段（Field 盒子；在 InputGroup 或 `horizontal-labels` FormLayout 内无效）设置样式，并使用 `controlXstyle`/`controlClassName`/`controlStyle` 为视觉控件盒设置样式。`ref`、`id`、`data-*`、`aria-*` 和 DOM 处理器等基础属性会在每个表面上到达字段的语义控件（日期、时间或日期时间输入；DateRangeInput 的范围触发器），而不是包装元素，TimeInput 不再丢弃它们，调用方的 `id` 现在也会在那里生效。调用方的 `aria-describedby` 会添加到组件自身的描述 id 中，调用方的 `aria-labelledby` 会在字段自身标签之后读取（在 DateRangeInput 上，在其标签和所选范围之后）；DateRangeInput 上调用方的 `aria-label` 会替换触发器的名称。（#7337）
  迁移：将这些组件上的根级 `xstyle`/`className`/`style` 重命名为 `controlXstyle`/`controlClassName`/`controlStyle`，它们为与之前相同的元素设置样式（对于 DateTimeInput，是包含日期和时间段的行）。手动重命名，或运行 `astryx upgrade`；它会运行 `migrate-field-input-styling`，前者会重写 JSX 用法；通过包装元素自身的 props 或展开传入的样式永远不会被重写，并且现在会在该调用点类型检查失败，因此请在那里重命名。未类型化的调用方会收到开发警告，且该值会被忽略。依赖落在包装元素上的 DOM 处理器或 `data-*` 属性现在会落在控件上；处理器仍在组件自身处理器之后运行，并且仍会收到组件已处理的事件。

  来自 @harjothkhara 的 #5656。

- Typeahead、Tokenizer、CheckboxList、RadioList 和 Slider 不再接受根级 `xstyle`、`className` 或 `style`。请使用 `containerXstyle`/`containerClassName`/`containerStyle` 为字段（Field 盒子；在 InputGroup 或 `horizontal-labels` FormLayout 内无效）设置样式，并使用 `controlXstyle`/`controlClassName`/`controlStyle` 为视觉控件盒设置样式。基础属性现在会到达主要的语义控件：Typeahead 和 Tokenizer 的 combobox 输入，CheckboxList 和 RadioList 的 `role="group"`/`role="radiogroup"` 元素，以及 Slider 的 `role="slider"` 滑块（范围模式下为 `role="group"` 控件）。调用方的 `aria-describedby` 会与字段自身的描述和状态一起保留，在这些组件以及 TextInput、TextArea 和 NumberInput 上都是如此，后者此前会丢弃它。CLI 模板使用新的 props。（#7339）
  迁移：将根级 `xstyle`/`className`/`style` 重命名为它们之前所设置的部分：所有五个组件上的 `containerXstyle`/`containerClassName`/`containerStyle`，但 InputGroup 内的 Typeahead 除外——它的根级样式绘制的是控件表面，应移至 `controlXstyle`/`controlClassName`/`controlStyle`。本版本的 `astryx upgrade` Codemod `migrate-field-input-styling` 会在 JSX 用法上执行这些重命名。

  Codemod 不会重写，因此请手动更新：

  - `ref` 和 `id`，以及 `data-*`（Typeahead 和 Tokenizer 的 `data-testid` 除外，它标记的是控件表面）、`aria-*` 和 `onClick` 等 DOM 事件处理器，此前落在外部 Field 上（或被 RadioList 和 Slider 丢弃）。它们现在落在主要的语义控件上。请更新那些在外部字段上测量、查询或监听的代码，并在需要外部边界时将组件包裹在你自己的元素中。
  - Typeahead 和 Tokenizer 的 ref 现在是 `HTMLInputElement`。
  - Typeahead 或 Tokenizer 上调用方的 `onKeyDown` 仍在内置按键处理之后运行，无法取消它，并且仍会在清除按钮和令牌上的按键时触发；对于输入框上的按键，它现在在 combobox 输入框自身上运行。
  - RadioList 和 Slider 过去会丢弃 DOM 事件处理器；它们现在在组件自身处理之后运行，因此此前从未触发的 Slider `onPointerDown`、`onKeyDown`、`onFocus` 或 `onBlur` 现在会触发（在滑块上，或在范围模式下的组上）。
  - Tokenizer 的 `onFocus`/`onBlur` 保持其含义：焦点进入或离开字段。
  - 通过包装元素自身的 props 或展开传入的样式不会被重写，并且现在会在该调用点类型检查失败。

  未类型化的调用方会收到开发警告，且该值会被忽略。

  来自 @harjothkhara 的 #5656。

- Selector、MultiSelector 和 ComplexSelector 不再接受根级 `xstyle`、`className` 或 `style`。请使用 `containerXstyle`/`containerClassName`/`containerStyle` 为字段（Field 盒子；在 InputGroup、`horizontal-labels` FormLayout 内或使用 `renderTrigger` 时无效）设置样式，并使用 `controlXstyle`/`controlClassName`/`controlStyle` 为视觉控件盒设置样式。`ref`、`id`、`data-*`（包括 `data-testid`）、`aria-*` 和 DOM 处理器等基础属性会到达携带 combobox 角色的触发器按钮（或使用 `renderTrigger` 时调用方的控件），调用方的 `aria-describedby` 会与字段自身的描述和状态一起保留，而不是被替换。处理器保持现有顺序：ComplexSelector 自身触发器上的 `onClick` 仍可取消打开，新转发的处理器（包括到达 `renderTrigger` 控件的那些）在内置切换和键盘处理之后运行。CLI 模板使用新的 props。（#7341）
  迁移：将这些组件上的根级 `xstyle`/`className`/`style` 重命名为 `controlXstyle`/`controlClassName`/`controlStyle`，它们为与之前相同的元素设置样式。以下不是重命名：`data-testid` 或其他基础属性现在落在触发器按钮上，而不是其周围的有边框盒子上（如果测试测量过该盒子，请用 `.closest()` 查询它），并且使用 `renderTrigger` 时，基础属性和 `ref` 现在会到达调用方的控件。手动重命名 JSX 用法，或运行 `astryx upgrade`；它会运行 `migrate-field-input-styling`，后者不会跟随通过包装元素自身的 props 或展开传入的样式，这些样式现在会在该调用点类型检查失败，因此请在那里重命名。未类型化的调用方会收到开发警告，且该值会被忽略。

  来自 @harjothkhara 的 #5656。

- TextInput、TextArea、NumberInput 和 FileInput 不再接受根级 `xstyle`、`className` 或 `style`。请使用 `containerXstyle`/`containerClassName`/`containerStyle` 为字段（Field 盒子；在 InputGroup 或 `horizontal-labels` FormLayout 内无效）设置样式，并使用 `controlXstyle`/`controlClassName`/`controlStyle` 为视觉控件盒设置样式。`ref`、`id`、`data-*`、`aria-*` 和 DOM 处理器等基础属性会到达原生控件，调用方的 `id` 现在也会在那里生效。CLI 模板使用新的 props。（#7336）
  迁移：将这些组件上的根级 `xstyle`/`className`/`style` 重命名为 `controlXstyle`/`controlClassName`/`controlStyle`，它们为与之前相同的元素设置样式。`astryx upgrade` 会重写 JSX 用法；通过包装元素自身的 props 或展开传入的样式不会被重写，并且现在会在该调用点类型检查失败，因此请在那里重命名。未类型化的调用方会收到开发警告，且该值会被忽略。Codemod 不会重写：调用方的 `id` 过去会被生成的 id 替换，现在会到达原生控件（标签仍保持关联），因此请移除你传入但依赖其被忽略的 `id`。其他基础属性此前已到达原生控件，保持不变。

  来自 @harjothkhara 的 #5656。

- 当 `PowerSearchFilterEditor` 在已经完整的空操作符筛选器（例如“is empty”）上打开时，不再调用 `onSave`。（#7347）
  旧用法：在完整的空操作符筛选器上打开独立的 `PowerSearchFilterEditor` 会立即保存该筛选器，不为其渲染 Apply，并且每当编辑器重新挂载时都会再次保存。

  替代方案：编辑器只根据用户在其中的选择进行保存。打开它不会保存任何内容。

  迁移：如果你依赖了这种打开即保存的行为，请在打开编辑器的位置自行用该筛选器调用你的 `onSave` 处理器（或者像 PowerSearch 现在这样，对空操作符筛选器跳过打开编辑器）。这无法由 Codemod 重写，因为正确的提交位置取决于你的代码。

- 移除原定于 0.7.0 的已弃用组件主题兼容层。组件现在只发出规范的目标类以及反映的 `data-*` prop/状态选择器。主题发现和构建输出不再暴露已弃用的目标，`ThemePropsOptions` 以及 `ComponentThemingTarget.deprecatedFor` 已被移除。`theme targets --json` 响应去掉了 `ThemeTargetEntry.deprecatedFor` 字段，因为它列出的目标都没有弃用。（#7302）
  迁移：升级后，请使用 `astryx upgrade --from <你的 0.6 版本> --apply --path .` 运行必需的 Codemod `migrate-deprecated-theme-surface`。

  该 Codemod 会重命名主题 `components` 映射中被移除的目标键（导入的 `defineTheme()` 调用、类型为 Astryx 主题的对象，或带静态 `name` 的主题对象），重命名 CSS 中的目标类，并使用 0.6 最终版本发出的每一个裸类，将带目标限定的裸 prop/值/状态类替换为反映的 `data-*` 选择器。它会将动态/计算的主题键、未限定或未知的类，以及嵌入 JavaScript/TypeScript 字符串中的 CSS 保留下来供手动审查。当旧键与规范键共存时，以及当 Astryx 曾发出的某个裸类在其限定的目标上没有已知含义时，它会添加 `TODO(astryx upgrade)`。

  四个按组件区分的清除图标别名都会变成共享的 `input-clear-icon`，它为每个输入框的清除图标设置样式。在 CSS 中，Codemod 用 `:where(.astryx-<component> *)` 将每条规则保留在其组件上，这不会增加特异性。主题键无法携带该作用域，因此 Codemod 会添加一个 TODO，指明要使用的 CSS 选择器。

  向 `themeProps()` 传入 `{legacyNames}` 或在组件文档中设置 `deprecatedFor` 的代码，应删除该参数或字段；规范目标不变。

  使用以下完整映射重命名主题键和 CSS 目标类：

  - `base-table` → `table`
  - `checkbox` → `checkbox-indicator`
  - `codeblock` → `code-block`
  - `codeblock-copy-button` → `code-block-copy-button`
  - `codeblock-header` → `code-block-header`
  - `codeblock-title` → `code-block-title`
  - `date-input-clear-icon` → `input-clear-icon`
  - `date-range-input-clear-icon` → `input-clear-icon`
  - `hovercard` → `hover-card`
  - `multi-selector-clear-icon` → `input-clear-icon`
  - `navicon` → `nav-icon`
  - `popover-surface` → `popover`
  - `progressbar` → `progress-bar`
  - `progressbar-fill` → `progress-bar-fill`
  - `progressbar-mark` → `progress-bar-mark`
  - `progressbar-track` → `progress-bar-track`
  - `radio` → `radio-indicator`
  - `radio-dot` → `radio-indicator-dot`
  - `selector-clear-icon` → `input-clear-icon`
  - `statusdot` → `status-dot`
  - `textarea` → `text-area`

  对于自定义 CSS，请将已移除的裸选择器替换为规范目标上对应的反映属性——例如 `.astryx-button.primary.sm` 变成 `.astryx-button[data-variant="primary"][data-size="sm"]`，`.astryx-switch.checked` 变成 `.astryx-switch[data-checked="checked"]`。请手动审查 `.primary` 这样的未限定类，因为它们可能属于应用程序。

- 移除已弃用的 `emptySearchResultsText` 属性。请使用 `emptySearchText`。（#7289）
  旧用法：`Tokenizer`、`Typeahead` 和 `BaseTypeahead` 上的 `emptySearchResultsText`，以及 `ChatComposerInput` 触发器上的 `emptySearchResultsText` 键。

  替代方案：`emptySearchText`，在 0.6.6 中发布。它接受 `ReactNode`，因此所有旧的字符串值仍然有效。旧名称已不在类型中，也不再被读取；仍传入它的 JavaScript 调用方会看到默认的空消息。

  迁移：将 `emptySearchResultsText` 重命名为 `emptySearchText`。在两者都设置的地方，保留 `emptySearchText` 并删除旧值——除非 `emptySearchText` 可能为 `null` 或 `undefined`：0.6.x 当时会回退到旧值，因此请将该值移入 `emptySearchText`（例如 `emptySearchText={value ?? 'Old copy'}`）。

  Codemod：`astryx upgrade` 运行 `rename-empty-search-results-text`，在 JSX 边界进行直接重命名：导入的 `Tokenizer`、`Typeahead` 和 `BaseTypeahead` 元素上的属性，以及 `ChatComposerInput` 的 `triggers` 中内联编写的触发器对象上的键，均按原样重命名。与所有 Astryx Codemod 一样，它不会跟随变量、辅助函数、展开、包装器或类型；在无法确定值归属时——`emptySearchText` 已设置、展开到这些元素之一（无论该元素是否写入旧名称）、`triggers` 值非内联编写、触发器对象带有展开或计算键（无论是否写入旧名称）——它会留下 TODO，而不是选择胜出者。类型检查器会报告它未触及的任何字面量 `emptySearchResultsText`；TODO 则涵盖通过展开到达元素的值，这是类型检查器无法覆盖的。

- `reset.css` 现在会作用到 `::before`、`::after`、`::placeholder` 以及搜索字段的取消按钮，正如其注释所记录的那样。它的三条规则将伪元素写在 `:where()` 内，而伪元素在其中是无效的，因此浏览器丢弃了选择器的这些部分，规则从未应用到它们。现在每个伪元素都跟在 `:where()` 之后，如 `:where(*)::before`，并且规则仍保留在 `@layer reset` 中，因此任何后续层或未分层样式仍会覆盖它们。（#7355）
  加载该重置的页面上会发生什么变化：带内边距或边框的 `::before` 或 `::after` 过去按 `content-box` 计算尺寸，现在按 `border-box` 计算；只在其上设置 `border-width` 过去不会绘制任何内容，现在会绘制实心的 `currentColor` 边框；没有自身颜色的占位符过去显示浏览器的灰色，现在显示 `--color-text-secondary`（或在没有 Astryx CSS 定义它时显示该 token 自身的默认值 `light-dark(#4E606F, #AAAFB5)`）；并且 `type="search"` 字段不再显示浏览器的取消按钮。

  要为你自己的某个元素保留旧结果，请在你自己的 CSS 中设置：在伪元素上设置 `box-sizing: content-box` 或 `border-style: none`，在 `::placeholder` 上设置 `color`，或在字段的 `::-webkit-search-cancel-button` 上设置 `appearance: auto`。没有 Codemod：样式表是否依赖旧结果无法从源代码中读出。

- 间距 token 现在使用 rem（`--spacing-2: 0.5rem`），因此间隙和内边距会像字号阶梯一样跟随读者的根字体大小。在默认 16px 根字号下，每个 token 值都不变。（#7359）
  在默认根字号下会显示出一处变化：`useTableRowExpansion` 的 chevron 现在居中于其固定的 40px 列中，而不是超出其边缘（其按钮从该列的 24–48px 移动到 8–32px）。在具有更大间距阶梯的主题（例如 matcha）下，chevron 再次可见，详情面板与第一列对齐，而不是从该列之后 20px 处开始。

  旧用法：`--spacing-*` 默认值是固定的 px（`--spacing-2: 8px`），因此 `useTheme().token()`、`resolveThemeToken()`、`tokenDefaults` 和 `spacingDefaults` 返回 px 字符串，当读者调大浏览器字体大小时，间距保持相同大小。

  替代方案：默认值是 rem，在 16px 根字号下具有相同的值（`--spacing-2: 0.5rem`、`--spacing-4: 1rem`），这些读取器会返回 rem 字符串。

  迁移：读取 `var(--spacing-*)` 的 CSS 无需更改。将间距 token 解析为 px 数字的代码，请使用根字体大小转换 rem 值，或读取元素的计算长度。希望使用固定 px 间距的主题可以重新设置这些 token，例如 `defineTheme({tokens: {'--spacing-2': '8px'}})`。

  Codemod：无。在运行时读取和解析的 token 无法被静态找到并重写，而 CSS 用法无需重写。

#### 新功能

- `DropdownMenu` 接受 `header` 和 `footer`：位于行之上和之下的内容，坐在弹出层中菜单的旁边，而绝不位于菜单内部。这里是放置筛选字段或“Create”按钮的地方。菜单仍然只包含其行，因此对屏幕阅读器来说仍是有效的菜单。控件保留自己的按键和按下行为，Tab 会遍历表头、菜单和页脚。底部工作表会将它们显示在操作的上方和下方。（#7344）
- `DropdownMenuSubMenu` 会像 `DropdownMenuItem` 那样，将宿主属性、DOM 事件处理器和 `ref` 传递到其触发器行：子菜单行可以携带 `aria-keyshortcuts`、`data-*` 标记或 `id`，调用方也可以访问该行元素。该行保留自己的角色、Tab 停靠点和弹出层状态；调用方的 `onClick`、`onKeyDown`、`onPointerMove`、`onMouseEnter` 和 `onMouseLeave` 会在该行自身处理之后运行，但该行消耗的事件除外：打开飞出层的按键（打开箭头、Enter 和 Space）以及对禁用行的点击。调用方的 `id` 会命名飞出层所标记的行。（#7318）

#### 问题修复

- 独立的 `BottomSheet` 现在会加入共享的层关闭栈，因此一次 Escape 只会关闭最顶层的层。在置层内打开的 Popover、Dialog 或菜单会先关闭，下一次按键才会关闭置层。`purpose="required"` 仍会在不让按键关闭其后方层的情况下阻止 Escape，正在动画退出的置层会保留该按键，原生关闭请求也会以相同的最顶层和 IME 组合规则应答。（#7225）
- `ContextMenu` 只在其触发器元素上放置四个触摸处理器。它过去会展开 `useLongPress` 返回的所有内容，而自按下模型以来，这包括该 hook 的命令式 `start`、`moveTo` 和 `cancel`，因此 React 会在页面的第一个 ContextMenu 上警告“does not recognize the `moveTo` prop”和“Invalid values for props `start`, `cancel`”。长按打开不变。（#7322）
- DateInput：在原生选择器表面上运行 changeAction，并提供乐观的忙碌反馈（#7243）
- Dialog 的初始焦点及其关闭时返回的焦点现在跟随最后一次输入：共享的焦点指示器在鼠标点击或点按后隐藏，在键盘输入后显示，包括键盘打开、鼠标关闭后返回的焦点（#7306）。文本字段保留自己的焦点处理。（#7313）
- 通过 `renderTrigger` 挂在自己控件上的 DropdownMenu，其钻入式子菜单的 Back 行会以菜单命名：“Back to <菜单的 aria-label>”，或以其所挂控件的名称命名，而不是“Back to Menu”。（#7304）
- Lightbox 从第一帧起就会以未缩放状态显示下一张或上一张图片。图片变化时缩放和平移的重置现在发生在同一次更新中，而不是先用上一张图片的缩放绘制新图片一帧。（#7351）
- 安装 `markdownSourceLinesPlugin` 后，转换插件在包含列表或引用的文档上不再回退到其可读回退内容。嵌套在列表项或引用中的块携带没有偏移量的行，转换检查现在会接受这些由 Core 分配的行，同时仍拒绝添加、移动或伪造这些行的转换。（#7345）
- 在打开的 DropdownMenu、子菜单飞出层、ContextMenu 或 Selector 列表上双指捏合现在会缩放页面。这些菜单在行能放下时声明 `touch-action: none`，在滚动后声明 `pan-y`，两者都不允许捏合，因此手机在菜单打开时无法缩放页面。它们现在声明 `pinch-zoom` 和 `pan-y pinch-zoom`；在行上单指滑动和按下模型的行为与之前相同。（#7201）
- DropdownMenu、ContextMenu 和子菜单不再对放在其行之间的文本字段和按钮做特殊处理。这会撤销一项未发布的更改。菜单只包含菜单项；不是行的控件应放在菜单之外。（#7338）
- PowerSearch 筛选编辑器会恰好保存一次“空”操作符筛选器（例如“is empty”），由完成它的选择触发。选择这样的操作符，或切换到默认操作符为该操作符的字段，现在会从该选择而不是从效果中保存。当父组件以新的 `onSave` 重渲染时，或 React StrictMode 中，筛选器不再被再次保存，也不会保存两次。重新选择当前操作符或字段不会保存任何内容，编辑器关闭后焦点仍会返回搜索输入框。点击 PowerSearch 中已有的空操作符令牌会提交一次而不打开内置编辑器；`components.empty.Editor` 覆盖仍会打开。（#7347）
- 当选择会保存的值（枚举选项、相对日期预设、建议）被选中时，PowerSearch 筛选编辑器会保存一次。保存不再在 React 状态更新器内运行——React 可能多次调用它——因此不再在 StrictMode 中触发两次。（#7350）
- 当 Dialog 打开时，Toast 保持可见且可点击。来自 `LayerProvider` 的 `ToastViewport`（或 `useToast` 自行挂载的那个）现在会移入打开的 Dialog，并在关闭时移回。此前，在视口挂载后打开的 Dialog 会绘制在其上方，点击 toast 的关闭按钮会命中背景并关闭 Dialog。移动视口不会重置可见的 toast 或其计时器。使用 `isTopLayer={false}` 渲染的视口会保持原位渲染。（#7238）
- DateTimeInput 的触摸选择器不再绘制过时的帧。从外部清除值时，时间显示会在同一次更新中清除，而不是先显示之前的时间一帧；当工作表打开时缩小 `max`（或提高 `min`），可见月份会在同一次更新中保持在范围内，而不是先显示超出范围的月份然后再跳转。（#7349）

#### 性能

- 没有 `swipeActions` 的 `Item` 不再打包滑动手势。面板和揭开它们的拖动现在位于一个模块中，`Item` 在首次有行需要滑动操作时按需加载该模块，因此行从不滑动的应用在首次加载时少打包约 2.7 KB（gzip），而确实滑动的行保留其 DOM、props 和行为；其手势会在该模块到达后生效，在首次加载时这是行绘制后片刻。（#7296）

#### 文档

- 将 `CommandPaletteList` 描述为 `CommandPalette` 自身渲染的列表，以及仅用于独立结果列表时直接渲染的组件。（#7370）

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @Geervan
- @harjothkhara
- @imdreamrunner
- @ksying
- @rubyycheung
- @vjeux

---

# 0.6.8

#### 新功能

- `useTableColumnResize` 现在会在指针进入表头时显示其手柄。此前只有指针已经位于手柄 8px 命中区域内时才会绘制边界，因此可调整大小的列没有任何迹象表明它可以调整。现在悬停表头时，每条边界都会以边框粗细显示，指针下方的手柄仍会采用强调色。当表格横向滚动时该显示仍保持，因此到达静止指针下方的边界不会被误认为是有意操作，聚焦手柄会强调那一条边界而不绘制其相邻边界。仅限指针：在无法悬停的地方不会显示任何内容。（#6194）
- `DropdownMenuItem` 会将宿主属性和 DOM 事件处理器传递到其行，正如 `DropdownMenuCheckboxItem`、`DropdownMenuRadioItem` 和 `Item` 已经做的那样（#7196）：行可以携带 `aria-current`、`aria-busy`、`data-*` 标记、`id` 或拖放处理器。该行保留自己的角色和 Tab 停靠点；调用方的 `onPointerMove` 和 `onAuxClick` 在该行的悬停聚焦和中键关闭之后运行。
- 向 `@astryxdesign/core/Markdown/plugins` 添加 `markdownSourceLinesPlugin`（#7286）。安装后，`Markdown` 渲染的每个块（包括嵌套块）都会携带 `data-source-line` 和 `data-source-line-end`：它来自的从 1 开始、包含首尾的行号。这让宿主可以将选择、搜索命中或评论映射回确切的 Markdown 行。`components` 块渲染器会收到匹配的 `sourceLines` 属性，插件渲染器从 `node.position` 读取行。这些行来自 `Markdown` 已经运行过的解析，不安装插件时没有任何变化。

#### 问题修复

- 当提升布局跨越移动导航断点时，保留 AppShell 页面内容、局部状态和输入焦点（#7236）。
- Calendar 现在接受 null 作为显式的受控空值（#7297）。DateRangeInput 通过有效的按钮描述播报必填状态，在其无障碍名称中保留待处理值，并在清除 Calendar 选择时不恢复之前的范围。
- 在清除字段后保持 DateTimeInput 的日历选择为空（#7298）。
- 手指在 DropdownMenu 触发器上按住后打开的菜单（经过长按延迟后），在该手指于触发器上抬起时保持打开（#7241）。浏览器认为菜单外的抬起是外部按压，立即关闭了菜单；现在该触发器在整个按压期间都被作为菜单的调用者持有，就像鼠标按压时已经做的那样。
- 在 `DropdownMenuItem` 链接行（`href`）上的鼠标按压移动几个像素后不再启动浏览器的链接拖动（#7197）。拖动会取消按压，因此高亮停止跟随鼠标，释放位置下的行也从不执行操作；从一个链接行拖动到另一个链接行的按压现在会作用于第二个，就像没有地址的行已经做的那样。链接行渲染 `draggable="false"`。
- Kbd：使用主文本颜色 token，以满足中性键帽上的 WCAG AA 对比度（#7100）
  默认的 `<kbd>` 文本颜色已更新为 `--color-text-primary`，确保可见的键字符在所有浅色和深色主题下都超过 `--color-neutral` 键帽背景的 4.5:1 WCAG AA 对比度。

- Stepper：从某一步骤打开的层内的 Stepper 不再拾取外部 Stepper 的 `--step-connector-gap`（#7287）。层内容根（Popover 和其他 `useLayer` 表面、Dialog、BottomSheet、MobileNav、Lightbox 以及 toast 视口）现在会阻止该值，因此内部轨道从其 `0px` 默认值开始。在内部 Stepper 上或通过 `stepper` 主题目标设置间隙仍然有效，并且间隙在层外仍会正常继承。
- 即使提供了 `components.code`，`Markdown` 也会通过 `createMarkdownFenceTransform` 插件渲染该插件认领的围栏（#7284）。绘制自己代码块的宿主会丢失每个语义围栏，因此图表或图形围栏会显示为代码。`components.code` 现在会渲染没有任何插件认领的每个围栏，并在被认领围栏的渲染器拒绝、抛出或挂起时继续作为回退。只提供两者之一的宿主渲染结果与之前相同。
- 保持 Table 列调整大小手柄可访问、被包含且与粘性列兼容（#6194）。
  调整大小手柄在触摸优先设备上仍可键盘访问，而不会从无障碍树中消失。它们不再延伸到表格下方并产生多余的垂直滚动，粘性表头无论插件顺序如何都会保持其固定定位。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @cixzhang
- @ernestt
- @Geervan
- @korkt-kim
- @vjeux

---

# 0.6.7

#### 新功能

- `Item` 按照 `spec:AST-057` 新增面向触摸的滑动操作。`swipeActions` 按边声明横向拖动会揭开的动作，形式为 `ItemSwipeAction[]`（`{id?, label, icon?, onActivate, isDisabled?, variant?: 'neutral' | 'accent' | 'destructive', hasRemoval?}`，最外层在最后）；`swipeBehavior` 为 `reveal`（行保持打开，每个条目都是真正的按钮；长拖动或快速滑动会触发最外层条目）或 `commit`（行滑出并触发最外层条目；不会有任何内容停留）。条目触发后，行会弹回，或者当条目具有 `hasRemoval` 时保持伸出。鼠标永远不会启动拖动，主要是垂直的拖动仍归滚动器处理，静止的行会在其外部有指针时关闭。适用于角色允许交互后代的行使（`listitem`、无角色行）；`ListItem` 会传递这两个属性。不会向行添加任何元素：其根元素平移，其面板反向平移。`List` 会在内联轴上裁剪其行（`overflow-inline: clip`）。导出了 `ItemSwipeAction`、`ItemSwipeActions`、`ItemSwipeActionVariant` 和 `ItemSwipeBehavior` 类型。
- Drawer 像 Dialog 一样是一个容器。新的 `padding` 属性接受一个间距档位，主题在 `drawer` 上的 `padding` 会通过容器 token 为抽屉的滚动内容区域添加内边距，而不是为面板添加内边距。带内边距的内容区域会发布其内边距，因此作为抽屉唯一子元素的 Section 以及 Table、Divider 等出血子元素会与之对齐，内部的 Layout 会为其表头、内容和页脚区域采用该值。两者都未设置时，内边距为 `--spacing-4`，与 Dialog 一样；传入 `padding={0}` 可获得全出血内容区域。块结束方向的安全区域内边距在所有模式下都会保留。
- 选项可以携带次级操作；`MultiSelector` 会在网格中渲染它。
  `SelectorOptionData` 和 `SearchableItem` 新增 `action?: ReactNode`：调用方渲染并命名的单个节点——`IconButton`、`Button`、菜单触发器。在 `MultiSelector` 中，一旦任何选项携带该属性，弹出层就是 `role="grid"`，其行将选项与其操作配对：Up/Down 移动行，内联末尾箭头到达操作（遵循 RTL），Enter 触发它，指针和触摸直接按下它，按下它绝不会改变选择。触发器宣告 `aria-haspopup="grid"`。没有操作的选项没有任何变化。`Selector` 和 typeahead 面板尚不渲染该键，并且在开发中当条目携带它时会发出警告。

- `useTableRowExpansion` 接受 `panelVariant`，详情面板现在默认坐在表格后面的表面上，而不是坐在自己的底色上。（#5995）
  面板行此前无条件绘制 `--color-background-muted`，而且由于它是插件自己构建的 `<tr>`，调用方渲染的任何内容都无法到达它。

  面板是行的延续，而不是自身的表面，因此它现在采用表格所在的任何表面——与行相同。这让插件对表格背景保持无意见：位于 `Card` 上的表格不再堆叠第三个表面，斑马纹表格不再绘制与其自身条纹相同 token 的色带（那读起来像数据行而不是详情）。

  `panelVariant: 'muted'` 为需要它的场景保留该底色——没有卡片、没有分隔线、没有条纹的裸表格，那里没有其他东西将面板与周围数据分开。

  **这会改变默认外观。** 依赖该底色的表格可通过 `panelVariant: 'muted'` 恢复它；在深色主题中没有什么可恢复的，因为 `--color-background-muted` 是一种低透明度的近黑色，在深色卡片上几乎不可见——深色主题实际上一直在渲染 `transparent`。

- `useTableRowExpansion` 接受 `hasRowClickExpansion`，因此点击行的任意位置即可打开行，而不仅限于其 chevron。（#5995）
  `useTableTreeData` 自发布以来就以相同的名称和相同的行为拥有此功能。详情面板插件是同一对中的另一半——一个展开为子行，一个展开为面板——在它们之间切换的调用方会丢失整行点击，且没有任何说明。也没有办法重新添加：行上的点击处理器必须知道不要在复选框、链接或文本拖动结束时触发，而这些都无法从外部触及。

  默认关闭，开启时仅限指针。chevron 按钮仍是可访问控件，因此键盘和辅助技术用户不受影响——这为鼠标添加了快捷方式，而不是操作表格的第二种方式。落在交互式单元格内容上的点击、结束文本选择的点击，以及 `getIsItemExpandable` 已排除的行上的点击都会原样通过。chevron 已经停止传播，因此不会切换两次。

  折叠的行也会像展开的行一样接好，这正是大部分意义所在：你想要点击的行正是尚未打开的行。

#### 问题修复

- BottomSheet 拖拽会在每个输入样本时直接将 transform 写入置层，中间不进行任何渲染（React 状态在拖动开始和结束时、以及布局拆分变化时改变）。在 Chromium 中测量：24 个样本的拖动有 4 次提交，低于之前的 49 次。版本仍会从手指离开置层的位置开始动画。
- BottomSheet 会在手指下方盒子的滚动边缘将触摸交给置层，而不仅是 body 的边缘。在 body 内滚动的内容（滚动中间部分周围的固定表头和页脚、网格）从未移动 body 的 `scrollTop`，因此在该滚动盒上每次下拉都会拖动置层，而盒子无法手动滚回。从盒子顶部下拉仍会拖动置层。
- BottomSheet 不再阻止捏合缩放。在打开的置层上开始的捏合（其手柄、内容或两者之上）原本不会做任何事，因为置层认领了所有触摸手势：置层和手柄上 `touch-action: none`，内容上 `pan-y`。置层现在将捏合留给浏览器（`pinch-zoom`，内容上 `pan-y pinch-zoom`），第二根手指（在手柄上、内容上或置层外，先落下的那根）会结束任何进行中或即将开始的置层拖动，因此页面会缩放，置层保持在其档位。单指拖动和滚动不变。
- BottomSheet 的释放判断依据置于层在手指速度下会滑行到的位置，而不是手指离开的位置：中等力度的甩动可以从不到关闭线的位置关闭，轻柔的甩动会落在下一个档位而不是弹回，释放速度按手指最后 100ms 而不是最后两个样本读取，抬起前静止的手指不会释放任何甩动。低于 48px 的轻推仍不会预测任何内容。
- 由鼠标按压打开的 DropdownMenu 在关闭时会将焦点返回到其触发器，而不是返回到按压前聚焦的控件。
  鼠标在按下时打开菜单，早于浏览器自身的 mousedown 聚焦触发器，因此弹出层记住了之前聚焦的控件，并在 Escape 或选择后把焦点交还到那里。现在触发器会在按压打开菜单时获得焦点，即点击打开已经具有的状态；键盘打开、点按和菜单自身行为不变。

- 使用 `statusVariant="tooltip"` 显示的字段状态现在会在出现或变化时播报给屏幕阅读器，与附加和分离的消息框一样：错误采用断言式，警告和成功采用礼貌式。
  此前，提示位置只描述了控件，因此屏幕阅读器用户不会被告知验证消息已出现，直到他们离开并重新进入字段。这影响所有提供提示位置的输入框。附加和分离位置不变，仍只播报一次。

- FileInput：在清除和文件选择时调用 changeAction 并更新乐观状态
- swizzle：将每个 .stylex 导入重写为深层路径
  `astryx swizzle Button`（以及任何从自身目录外导入 `.stylex` 模块的组件）发出的导入会折叠为目录桶——例如 `@astryxdesign/core/utils` 而不是 `@astryxdesign/core/utils/interactionOverlay.stylex`。该桶不会重新导出那些 StyleX 符号，因此 swizzle 后的文件无法编译。

  `rewriteImports` 现在会为每个 `*.stylex` 模块提供深层子路径。导出生成器（`scripts/sync-exports.js`）为跨目录 swizzle 组件实际引用的 `.stylex` 模块添加了 16 个特定子路径导出：

  `DateInput/tokens.stylex`、`Icon/IconSize.stylex`、`Indicator/indicator.markers.stylex`、`Layer/layerAnimations.stylex`、`Layer/layerTextReset.stylex`、`Layer/layerViewportInset.stylex`、`Layout/container.stylex`、`Layout/edgeCompensation.stylex`、`Layout/padding.stylex`、`NavItem/navItemStyles.stylex`、`Selector/selectorPresentation.stylex`、`Stack/stack.stylex`、`Stack/stackItem.stylex`、`Text/text.stylex`、`utils/focusOutline.stylex`、`utils/interactionOverlay.stylex`

  这些是公开 API 的新增内容。每个模块已经随 npm tarball 发布（在 `dist/` 中）；只有 exports map 条目是新的。没有通配符——未来跨目录的 `.stylex` 导入需要在 `STATIC_EXPORTS` 中特意添加条目。先例：`./theme/dataTokens.stylex`（AST-066 FR2）。

- 在固定其 16px 展开按钮的同时，保持分组行的自定义表头为全宽，并在按钮上暴露展开状态。（#6251）
- 保持分组行折叠 chevron 固定，而不缩小自定义表头，并将它们从 12px 增加到 16px（#6222）
- 将层 portals 保留在其最近的 dialog 内
- Markdown：按缩进的表格自身的列读取
  `Markdown` 不再为行有缩进的表格（例如 `  | a | b |`）添加空的第一列。此前行首管道前的缩进会被读取为单独的单元格。

- Markdown：保留标签超过 999 个字符的定义形状行
  `Markdown` 不再丢弃形如链接引用定义、标签超过 999 个字符的行。CommonMark 不允许这样的定义，因此该行现在显示为文本，正如标签相同的引用已经做的那样。

- Markdown：在消息末尾未闭合的代码块结束于其最后一行代码
  当消息在从未闭合的代码块内结束时，`Markdown` 过去会把消息最后的行结尾读作多一行空代码行，这与已闭合的代码块以及同一消息的流式渲染不同。结尾前真正的空行仍是代码，并且当消息流式传输时，未闭合的代码块现在会显示已经写入的空行，而不是稍后添加它们。

- Markdown：在未闭合代码块末尾保留引用的空行
  在块引用内未闭合的代码块会将其末尾的引用空行保留为代码，正如 CommonMark 读取的那样。只有文档自身的最后行结尾会被排除在未闭合代码块之外。

- Markdown：流式传输时，当项目符号或缩进不同时保持两个列表分开
  当消息流式传输时，只要两个列表都是项目符号或都使用相同分隔符编号，`Markdown` 就会将空行相隔的两个列表合并——即使它们的项目符号（先是 `-` 后是 `*`）或缩进不同，而完成后的文档会显示两个列表。流式渲染现在会像完成后的文档一样将它们分开。

- MobileNav 在打开时不再阻止捏合缩放。打开的导航覆盖整个视口并声明了 `touch-action: none`（其内容上为 `pan-y`），因此屏幕上任何位置的捏合都不会做任何事。它现在声明 `pinch-zoom`（内容上为 `pan-y pinch-zoom`）：平移仍会被阻止到达后面的页面，而捏合会缩放页面。
- MultiSelector：在没有搜索的底部工作表中，用组件的标签命名 listbox，以便屏幕阅读器播报
- 向共享消息目录添加了 `@astryx.richTextEditor.*` 目录命名空间，因此 RichText 编辑器的工具栏标签、块格式选项、链接对话框和 Tab 转义提示可以通过 `InternationalizationProvider` 翻译和覆盖。编辑器的字符计数器现在通过现有的 `@astryx.textArea.characters*` 消息播报，因此它在 TextArea 已发布的每个区域设置中都已翻译。
- 在折叠的 SideNav 中，悬停后立即按下 SideNavHeading 菜单触发器现在会保持悬停打开的菜单打开，正如点击守卫所意图的那样。浏览器此前会在按压时关闭菜单，因为触发器位于面板之外；折叠的触发器现在是面板的原生调用者，与 TopNavMenu 使用的接线相同。
- 防止可编辑内容切换树行和展开行
  行展开和树数据用来判断行点击是否应切换的共享点击守卫遗漏了 `[contenteditable]` 元素。在行内可编辑内容中点击或键入会切换该行。已恢复排除规则，并在两条路径上都有测试。

- 整行点击展开复用共享的可点击容器守卫，而不是自己的选择器列表。（#5995）
  `useTableRowExpansion` 和 `useTableTreeData` 各自携带了一份手工编写的“这次点击是否属于其他东西”的副本——相同的九个选择器，写了两遍。`useClickableContainer` 已经为系统中的每个可点击表面拥有该规则，其 `INTERACTIVE_SELECTORS` 列表更完整：它还涵盖 `role="link"`、`radio`、`switch`、`tab`、`menuitem`、`option`、`combobox`、`listbox`、`slider`、`spinbutton` 和 `[data-pressable-container]`，并排除 `[aria-readonly="true"]`。

  两个插件现在都调用该 hook 的 `hasInteractiveAncestor` 和 `hasTextSelection`，这两个函数新导出给无法使用该 hook 本身的容器——在 `transformBodyRow` 内组装的 `<tr>` 没有可交给它的 ref。

  共享带来了两处行为变化，都是修复：

- 只旋转 `useTableRowExpansion` 中的 chevron 字形，而不是其下方的按钮。（#5995）
  旋转此前在 `<button>` 上，它是命中目标并携带悬停芯片，因此打开行会让该圆角矩形及其高亮随箭头一起旋转四分之一圈——在动画中间最明显，此时芯片会变成菱形。24px 圆角方块完成 90° 旋转后会回到自身，这就是为什么这仅在运动中显现。

  transform 现在位于字形上，按钮保持不动。两个过渡在同一遍中移到 `--duration-fast` 和 `--ease-standard`，与 `TableRow` 已用于自身悬停过渡的一致。

- 在 `useTableRowExpansion` 详情面板下方绘制行分隔线，而不是在其上方。（#5995）
  展开的行及其面板是一个单元，但分隔线落在它们之间：行绘制自己的底边框，在行与其刚打开的详情之间画了一条线，而面板不绘制任何线，因此它与下一行齐平相接。这两半都反了——这对被从中间分开，然后与下面的行融合。

  展开的行现在放弃其边框，面板则采用一个。在没有行分隔线的表格上，抑制会移除一条从未存在的边框，而面板的边框从不应用，因此双方都不必查询分隔线模式；只有面板需要查询，以知道是否绘制。面板行携带 `tableRowMarker`，`TableCell` 正是通过它来限定“最后一行下方无尾线”规则，因此展开的最后一行仍能干净地结束表格。

- 从第一列而不是行边缘开始 `useTableRowExpansion` 详情面板。（#5995）
  面板是一个跨越整行的单元格，带有扁平的 `20px` 内联内边距，因此其内容从 chevron 下方开始——比它所描述的每个标签都靠左一列。

  它现在按 chevron 列的固定宽度加上该密度单元格给自身内容的内联内边距缩进，从表格上下文读取以跟随 `density`，并写成逻辑属性以便 RTL 镜像。它不可配置：从其他任何位置开始的面板读起来像未对齐，而不是一种选择。

  chevron 列的宽度不能是 token 引用——布局要对其进行算术运算——但它是 `--spacing-10` 的像素值，缩进正是这样写出的。一项测试将两者固定在一起，因此字号阶梯的变化无法悄悄使它们不对齐。

- `Table` 斑马纹只统计数据行，因此展开一行不再反转其下方每一行的条纹。（#5995）
  行展开详情面板作为同级 `<tr>` 追加到同一个 `<tbody>` 中，而条纹是 `:nth-child(even)`——因此面板自己占用了一次条纹轮换，并把其后的每一行推到相反的条纹上。打开一行会重绘半张表格。

  条纹现在按 `:nth-child(even of :not([data-expansion-panel]))` 计数。面板不是行，也不被计为行，因此无论打开什么，数据行都保持其奇偶性。

  `of S` 自 2023 年起就是 Baseline，在 Astryx 的支持下限（AST-013）之内。低于该基线时，条纹规则会被丢弃而不是误用：没有条纹的表格，而不是条纹错误的表格。

  没有行展开插件的表格不受影响——系统中没有其他内容发出 `data-expansion-panel`。

- 没有显式宽度的 Table 列现在会保持紧凑的可读性下限，并在其组合最小值放不下时使用现有的水平滚动区域。

#### 文档

- README 的 CDN 模板命令以及 DropdownMenu 条目和 Indicator 文档中的图标和 token 提示，都指明了限定的 `npx @astryxdesign/cli`，无论是否安装了 CLI 都会运行此 CLI。裸 `npx astryx` 会获取一个无关的 npm 包，直到 CLI 成为依赖项。
- 统一 ComplexSelector、Tokenizer 和 Typeahead 的 statusVariant 文档与测试覆盖

#### 其他变更

- 点击短列表遗漏的组合控件——`role="tab"`、分段 `role="radio"`、单元格中的 `Slider`——不再切换其下方的行。
- 文本选择守卫的作用域限定在该行，而不是向文档询问任何选择。页面上其他地方选中的文本不再使表格中的每一行都变为惰性。

  遍历也会在该行停止，而不是攀升到 `document.body`，因此整个表格的交互式祖先无法抑制行点击。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @cixzhang
- @ernestt
- @humbertovirtudes
- @imdreamrunner
- @josephfarina
- @Lee-Dongwook
- @ManoharPaturi
- @vjeux

---

# 0.6.6

#### 新功能

- 添加共享的 `upload` 图标，并将其用于 FileInput 的上传提示，而不是方向性的 `arrowUp`
  主题通过 `icons.upload` 绘制 `upload`，与 `arrowUp` 分开，因此排序箭头和所有其他 `arrowUp` 用法都保持不变。每个捆绑主题和主题模板都以自己的图标风格绘制 `upload`。FileInput 在两种模式下都保持其图标大小、位置、颜色和无障碍性；没有 `upload` 图形的主题会在那里显示默认的“上传到托盘”字形。

  完整的 `IconRegistry` 在此版本中仍可省略 `upload`。下一个次要版本会要求它，因此请为任何类型为 `IconRegistry` 的注册表添加 `upload` 条目。

- BottomSheet 像 Dialog 一样是一个容器。新的 `padding` 属性接受一个间距档位，主题在 `bottom-sheet` 上的 `padding` 现在会通过容器 token 为置层的内容盒添加内边距，而不是为面板添加内边距。带内边距的内容盒会发布其内边距，因此作为置层唯一子元素的 Section 以及 Table、Divider 等出血子元素会与之对齐。两者都未设置时，内容盒像之前一样保持无内边距。
- `ComplexSelector` 可以挂到调用方渲染的控件上。
  新的 `renderTrigger` 渲染属性会渲染弹出层所挂靠的控件——列表行中的字形、芯片、图标按钮——替代选择器自身的字段和按钮。将给定的 props 展开到它上面；弹出层锚定到它，保留来自 `label` 的对话框标签，在点击或 ArrowDown 时打开，并在关闭时将焦点返回到该控件。现有的 `handleRef` 和 `onOpenChange` 在其旁边照常工作。默认关闭；现有选择器不变。

- ContextMenu 接受 `triggerAs`（`div` | `span`），因此正文中的引用可以拥有上下文菜单而不破坏文本流。
- 为支持 CSS 的数据可视化使用者导出规范的 56-token StyleX `dataVars` 组。
- 从 `@astryxdesign/core/Markdown/parser` 和 `@astryxdesign/core/Markdown` 导出 `decodeMarkdownCharacterReferences`
  它按照 `Markdown` 渲染它们的方式解码字符引用——`&copy;`、`&#169;` 和 `&#xA9;` 变成 `©`；未知名称和没有分号的引用保持原样——使用与 `Markdown` 相同的表。它作用于纯文本，因此请将代码和反斜杠转义的引用排除在外。解析器子路径没有 use-client 边界，因此服务器代码可以调用它。

- 添加 `DropdownMenuGroup`，一个带标题的 `role="group"` 行分组，用于复合模式菜单。
  `items` 数据 API 可以为分组添加标题（`{type: 'section', title, items}`）；用子元素编写的菜单——复选框行、单选组、仅在打开时挂载的行——则不能。`DropdownMenuGroup`（以及 `ContextMenuGroup` 和 `BreadcrumbMenuGroup`）渲染一个 `role="group"`，通过 `aria-labelledby` 由其标题命名；标题共享数据模式的排版和 `astryx-dropdown-menu-section-heading` 主题目标，不是菜单项，并且会被方向键和 typeahead 跳过。现有菜单不变。

- 组件在查询未匹配任何内容时显示的消息现在统一为 `emptySearchText`，并且接受 `ReactNode`。
  `Selector`、`MultiSelector` 和 `CommandPalette` 已经将其称为 `emptySearchText`，并且已经接受节点。`Tokenizer`、`Typeahead`、`BaseTypeahead` 和每个 `ChatComposerInput` 触发器将其称为 `emptySearchResultsText`，并且只接受字符串——因此同一个产品可以在一个组件中提供“无结果，创建一个”行，而在其相邻组件中无法提供，学习过其中一个的构建者不得不去发现另一个。

  不会有任何破坏。类型只是变宽，因此每个现有值仍然有效，`emptySearchResultsText` 仍会按已发布的方式工作。两者都设置时，`emptySearchText` 胜出，并给出开发警告。迁移只是名称。

  弃用生命周期（`spec:AST-017` FR28、FR31）——仅在较晚的次要版本中移除，该版本的冻结清单同时携带一对的两个 id：

- 层运行时拥有视口内边距：一个间隔、一个上限、一个回退顺序，以及应用声明浮动条的单一位置。
  每个锚定层——Popover、DropdownMenu 及其子菜单、Typeahead、Tooltip、HoverCard、选择器——现在都保持与每个视口边缘相同的间隔（spacing-4 档位或设备安全区域内边距，取较大者），并被限制在视口内。此前有四个组件各自携带该间隔的副本，而且它们已经产生了偏差。

- 添加第一方 Markdown 标题链接模块。
  `createMarkdownHeadingLinks()` 从 `@astryxdesign/core/Markdown/plugins` 导出，为每个内置 h1–h6 提供防冲突的生成片段，以及一个无障碍的内联尾随 `#` 复制按钮，包括嵌套在块引用和列表中的标题。其冻结的、带版本的条目在兼容的 Core 包副本之间携带命名空间和安全 URL 基础，而无需模块局部状态。标题行使用 `useContainerReveal`：按钮在精细指针静止时隐藏，在行悬停或键盘聚焦时显示，并遵循规范的粗指针/触摸行为。未经修改的点按、点击、Enter 或 Space 会复制规范 URL，而不导航、滚动或改变哈希，并短暂显示对勾确认；失败则保持静默。同一个不透明的插件条目保持 Markdown 派生的 Outline 对齐，支持 Unicode NFKC slug、可选的调用方自有命名空间和安全永久链接 URL 基础，并保持默认 Markdown 和自定义标题渲染器不变。

- Markdown：嵌套列表在每个深度绘制不同的标记
  项目符号列表循环使用 disc、circle 和 square，编号列表循环使用 decimal、lower-alpha 和 lower-roman，循环依据包围它们的任一类型列表的数量，因此每个层级都能与相邻层级区分开来。编号会保留每个列表的起始值和项目。`List` 和 `ListItem` 保持其公开的标记样式。

- Markdown 插件：读取插件声明的内容，并像 Markdown 那样渲染一个插件节点
  来自 `@astryxdesign/core/Markdown/plugins` 的 `getMarkdownPluginCapabilities(plugin)` 报告插件是否声明语法以及是否声明转换，除此之外不报告任何内容；插件条目保持不透明。来自仅客户端新子路径 `@astryxdesign/core/Markdown/plugin-renderer` 的 `MarkdownPluginNodeRenderer` 使用给定插件渲染一个已解析的扩展节点，完全按照 `Markdown` 呈现它的方式——插件渲染器位于相同的错误边界和 suspense 回退内，具有相同的可读回退文本和相同的失败报告——自身不包含任何元素。`Markdown` 自身的输出不变。

- DropdownMenu 接受 `trigger` 渲染属性：将菜单挂到任何控件上。
  `trigger` 渲染菜单从中打开的控件——IconButton、芯片、头像、列表行——并向其提供可展开的 `DropdownMenuTriggerProps`：按下模型、键盘打开、切换点击和 ARIA 接线。菜单通过 `aria-labelledby` 由该控件命名。`button` 和 `trigger` 互斥（会给出发开发警告）。

- 菜单箭头会循环，PageUp/PageDown 会翻页。
  在 `DropdownMenu`、`ContextMenu` 和 `DropdownMenuSubMenu` 中，最后一行的 ArrowDown 会循环到第一行，第一行的 ArrowUp 会循环到最后一行，如同 macOS 菜单（`Selector` 仍像原生 select 一样钳制）。PageDown 和 PageUp 会移动到可滚动菜单中最后一个和第一个完全可见的行，再次按下则再移动一个视口，永不循环。触发器上的 ArrowUp 会打开菜单并高亮最后一行。打开菜单的按键不再通过其自动重复激活第一行，typeahead 会忽略属于输入法组合的按键。`useListFocus` 新增 `hasPaging`。

- DropdownMenuItem 接受 `href`：导航的菜单行是真正的链接。
  `DropdownMenuItem`（以及数据模式条目）接受 `href`、`target` 和 `rel`。该行自身渲染为锚点，带有 `role="menuitem"`，通过 `LinkProvider` 路由，因此 ⌘-点击、Ctrl-点击或中键点击会保留浏览器的含义并跳过 `onClick`；普通点击会运行 `onClick`、关闭菜单并导航。触摸工作表将同一条目渲染为链接行。`onClick` 现在会收到点击事件。每个菜单中的 Enter 和 Space 会合成一次携带按键修饰符的点击。

- DropdownMenu 接受 `menuMaxHeight`，为必须容纳其行的菜单解除 300px 上限；视口仍会限制它。
- 菜单和选择器会在释放时作用于指针下方的行，高亮会跟随按住的手指或鼠标。
  `DropdownMenu`、`ContextMenu`、`DropdownMenuSubMenu`、`Selector` 和菜单底部工作表共享同一个按下模型，即 macOS 和 iOS 菜单使用的模型：释放时指针下方的行就是执行操作的行，高亮会跟随按住的指针跨行移动。手指落在某一行并在另一行抬起时，会作用于第二行——只作用一次；浏览器瞄准第一行的点击会被吞掉。鼠标在菜单外释放会关闭菜单；手指在外部释放则保持打开。行能放下的菜单声明 `touch-action: none`，因此滑动仍是滑动；可滚动的菜单让浏览器平移它并结束手势。菜单行不再在不存在悬停的地方绘制按下外观。新的公开 hook：`useMenuPress`。

- 鼠标在按下时打开 DropdownMenu，并且可以直接拖入其中；手指按住触发器会以手指按下的状态打开它。
  `DropdownMenu` 触发器现在会在鼠标按下时打开其菜单，从触发器拖入菜单并在某一行上松开时会选择该行，如同 macOS 菜单。打开按压的释放只有在指针已进入菜单或按压持续约三分之一秒后才会起作用，因此在指针下方打开的菜单绝不会选中无人选择的行。按下已打开菜单的触发器会在同一手势中关闭它而不会重新打开。点按仍通过其点击打开；手指在触发器上按住半秒会以手指按下状态打开菜单，随后滑动即可选择。`useMenuPress` 新增 `onTriggerPress`、`triggerProps`、`isTriggerClickFromPress` 和 `longPressDelayMs`。

- DropdownMenuSubMenu 在手机上钻入，而不是打开飞出层。
  当粗指针打开菜单时，子菜单行会在同一个盒子中用自己的行和“Back to <parent>”行替换菜单的行；Back、Escape 或 ArrowLeft 会返回到该行。在复合和数据模式下、`DropdownMenu` 和 `ContextMenu` 内均可工作；`presentation`（`flyout` | `drill-in` | `adaptive`）会覆盖该策略。

- `MultiSelector` 可以为没有匹配项的搜索提供 `Create "<query>"` 行。
  使用 `hasSearch` 时，新的 `hasCreate` 开关会在修剪后的查询在搜索自身的不区分大小写匹配下不等于任何选项标签且选项已加载时，将 `Create "<query>"` 行放在列表首位。选择它，或在没有高亮项时按 Enter，会调用 `onChange`，将查询追加到值，并传入第二个参数 `{type: 'create', query}`（导出为 `MultiSelectorChange`），然后清除搜索；调用方在同一次更新中为新值添加选项。其他所有更改都不传递描述符，因此现有单参数处理器不变。没有 `hasSearch` 的 `hasCreate` 会在开发中发出警告，且不提供任何内容。默认关闭。

- `MultiSelector` 可以挂到调用方渲染的控件上。
  新的 `renderTrigger` 渲染属性会渲染面板所挂靠的控件——列表行中的字形、芯片、图标按钮——替代选择器自身的字段和按钮。将给定的 props 展开到它上面；listbox 锚定到它，由 `label` 命名，打开时获得焦点，关闭时焦点返回到该控件。`handleRef`（`open`/`close`/`toggle`/`isOpen`，即 `ComplexSelectorHandle` 形状）和 `onOpenChange` 让调用方可以从其他地方按键打开面板，并观察每次打开和关闭。三者默认关闭；现有选择器不变。

- 子菜单飞出层在指针朝其移动时保持打开，按下子菜单行会打开它而绝不会关闭菜单。
  在 `DropdownMenuSubMenu` 中，当鼠标从该行朝向飞出层、在通向其近边缘的三角形内移动时，飞出层现在会保持打开，并在指针离开该行和该三角形后经过现有延迟关闭，因此通往飞出层的对角线路径不再将其折叠。在子菜单行上点击或释放会打开其飞出层；在已打开的飞出层上，它会确认飞出层并将焦点移入其中，而不是将其切换关闭，如同 macOS 子菜单行。`useMenuHover` 新增 `flyoutRef`，并将离开事件传递给 `onMouseLeave`。

- 触摸按下模型：在粗指针下，裸 `:active` 分支被移除，由委托的文档级控制器像原生列表那样绘制按压——150ms 内不显示任何内容，然后在下一帧显示完整的按下覆盖层；在 10px 行程或滚动认领手势时无淡出地取消，并在新的触摸到来前保持失效；短于延迟的点按在抬起时绘制；释放在 200ms 内淡出，在每个表面上都是真正的淡出：按下覆盖层是以 `--astryx-press-alpha` 的按下 token，这是一个注册的自定义属性（`@property`，语法 `<number>`），释放分支将其从 1 动画到 0，由共享覆盖样式一次性声明为 `--_press-paint`，并由任何绘制它的东西读取。控制器会在最近的标记为 `data-astryx-pressable` 的元素上写入 `data-astryx-press="on"|"fading"`，每个绘制按压的 Astryx 表面现在都携带该标记；鼠标保留 `:active`。本地可按压元素的公开 API：来自 `@astryxdesign/core/hooks` 的 `usePressFeedback()`（返回要展开的标记；在首次挂载时安装控制器）和来自 `@astryxdesign/core/utils` 的 `interactionOverlayStyles`（在标记元素上组合其变体之一）。按压通过 `--color-overlay-pressed` 进行主题化，保持、闪烁和淡出都会读取它。

#### 问题修复

- Selector 和 MultiSelector 会播报它们实际显示的空状态消息，并在到达空状态的每条路径上播报。
  两个缺陷，一个原因——实时区域的数据来自 props，而不是来自实际渲染的内容：

- `Typeahead`、`Tokenizer` 和 `PowerSearch`（它组合了 `Tokenizer`）：在下拉列表关闭但没有失焦后，点击搜索/combobox 输入框现在会重新打开它。
  `BaseTypeahead` 过去只响应真正的 `focus` 事件来打开其下拉列表。任何在输入框保持聚焦时关闭下拉列表的流程——选择结果（它会在清除后内部重新聚焦输入框）、按 Escape，或组合组件（例如 `PowerSearch` 的令牌添加/移除）在完成后命令式地重新聚焦同一个输入框——都不会派发新的 `focus` 事件，因为 `focus()` 对已经是活动元素的元素是空操作。输入框看起来已聚焦且可点击，但点击它没有任何作用，直到用户先点击别处再回来。

  `BaseTypeahead` 现在也会在点击时打开，特别是当输入框在点击开始前已经聚焦时（在 `pointerdown` 时检查，早于浏览器自身默认操作移动焦点——本身刚使输入框获得焦点的点击会留给现有焦点路径，因此两者不会在单次首次点击中重复触发引导请求）。

  只有 `Typeahead` 和 `Tokenizer` 直接组合 `BaseTypeahead`——`Selector`、`MultiSelector`、`CommandPalette` 和 `DateTimeInput` 使用各自独立的 combobox 实现（它们只遵循 `BaseTypeahead` 的约定，而不是其代码），不受此更改影响。

  修复 #6845。

- Card：让位给 flex 行或网格轨道，而不是将其加宽到卡片内容。
  卡片不再将其行或 `1fr` 网格轨道保持在最小内容宽度，因此卡片内长而不间断的值（ID、哈希）不再能把并排的卡片推出手机屏幕。能放下的卡片不变。无法换行的内容会在卡片边缘被裁剪，正如具有显式 `width` 的卡片已经做的那样；用 `Text maxLines={1}` 截断此类值，并为宽内容提供自己的滚动区域。显式 `width` 现在是卡片在行中的首选宽度，而不是下限。要固定它，请将卡片包裹在 flex 行的 `StackItem` 中，或在 Grid 中为 Card 设置调用方 `minWidth`。

- Chat：使用 1lh 和 vertical-align top 将行内令牌居中于行盒，修复与相邻文本和 CJK 字符的垂直错位。
- 防止禁用的 `ClickableCard` 链接保留可激活的目标。
- 让 Code 的完整公开 API 和主题目标在组件文档中可被发现。
- 在表头控件消失时保持可折叠代码块有名称且可恢复，遵循零像素高度限制，并记录公开的根 ref。
- 向主题暴露 Collapsible 的打开、禁用、位置和分隔状态，并记录分组状态归属和根自定义。
- 当受控字符串值未变化时保留 `CollapsibleGroup` 上下文身份，避免不必要的分组项重渲染。
- 让 CommandPaletteFooter 在窄屏幕上折行显示已翻译的指引，修正其组合示例，并添加自有审计覆盖。
- 基于字段的输入框（TextInput、Selector、DateInput 以及输入框家族的其他成员）现在可以被其行收缩：Field 根会重置其自动最小尺寸，因此搜索框和选择器组成的筛选栏在手机上不再被推出容器
- 延迟在另一个弹出层正处于显示/隐藏中途时到达的层 `show()`，因此从正在关闭的弹出层重新获得焦点的工具提示触发器不再抛出 `InvalidStateError`。
- Markdown：将尖括号链接目标读取到其闭合括号
  `Markdown` 现在按 CommonMark 规定读取尖括号目标：括号内的圆括号是地址的一部分，因此 `[a](<b(c>)` 链接到 `b(c)`；内部转义的括号也是它的一部分，因此 `<b\>c>` 是 `b>c`；括号内的行结尾会使文本不成为链接。不安全的 scheme 仍像之前一样被拒绝。

- Markdown 会保留反斜杠，除非它转义标点，并且行末的反斜杠是换行
  `C:\Users\Ada` 渲染为 `C:UsersAda`：反斜杠后的任何字符都会被吞掉。按照 CommonMark 规定，反斜杠现在只转义 ASCII 标点（`\*`、`\#`、`\\` 等）；在字母、数字、空格或其他字符之前，它保持原样。行末的反斜杠是硬换行。图片替代文本遵循相同规则。

- Markdown：限制列表和块引用的嵌套，使深层输入无法使渲染崩溃
  `Markdown` 现在将列表和块引用嵌套限制在最多 100 层，正如它已经限制强调那样；更深嵌套的内容会作为文本读取。数千层深的列表或块引用（精心构造的消息可能如此）过去会溢出栈并在解析时抛出。

- Markdown：按 CommonMark 读取块引用标记
  `Markdown` 现在会将最多三个空格开头并带有 `>` 的行读取为块引用，无论 `>` 后是否有空格：`>quote`、`   > quote` 和 `>>> nested` 都是引用，符合 CommonMark 规定。这些行过去会显示为带有 `>` 标记的纯文本。

- Markdown：当项目符号变化时开始新列表
  `Markdown` 现在会在项目符号列表的标记变化时开始新列表——`- a` 然后 `* b` 是两个列表——符合 CommonMark 规定，正如有序列表在分隔符变化时已经做的那样。

- Markdown 将 `&amp;`、`&copy;` 和 `&#169;` 等字符引用显示为它们命名的字符
  `Fish &amp; chips &copy; 2026` 过去会连同引用文本原样渲染。现在，命名引用（HTML 标准中的每个名称）以及文本中的十进制或十六进制数字引用都会按其字符渲染，符合 CommonMark 规定；在内联代码和代码块中它们保持完全原样。未知名称或没有结束 `;` 的引用保持字面量，解码后的字符绝不会被读取为 Markdown 语法。

- Markdown：只在相同长度的反引号串处关闭代码片段
  `Markdown` 现在会在下一个与开启长度完全相同的反引号串处结束代码片段，绝不会在更长串的一部分处结束，并且会读取任意长度的串，符合 CommonMark 规定。`` `one`` two` `` 是一个包含 ` `` ` 的代码片段，四个或更多反引号也能打开和关闭代码片段。没有相同长度闭合串的串保持为文本。

- Markdown 会在 Windows（CRLF）行结尾前由两个空格或反斜杠构成硬换行
  以 CRLF 行结尾保存的文档丢失了其硬换行：回车符位于尾随空格或反斜杠与换行符之间，因此两者都无法被识别，行会连在一起。现在两者都会像在 LF 文档中一样断行，在段落、链接和块引用中以及流式传输时都是如此；代码片段、代码块和表格单元格不变。

- Markdown：在空格之后读取代码围栏的语言
  `Markdown` 现在会按 CommonMark 规定，将围栏代码块的语言读取为其 info 字符串中任意空格后的第一个单词，因此 `~~~ js` 和 ` ``` js ` 是 JavaScript 块，而不是没有语言的块。不写空格的围栏读取结果与之前相同。

- Markdown：为图片提供其描述的纯文本作为替代文本
  `Markdown` 现在会将图片描述读取为内联内容，并使用其纯文本作为替代文本，符合 CommonMark 规定，因此 ``![`a]b` *c*](u)`` 的替代文本是 `a]b c`，而不是带有反引号和星号的原始源文本。

- Markdown 图片替代文本会将字符引用和转义显示为它们命名的字符
  `![Fish &amp; chips](…)` 过去会为图片提供替代文本 `Fish &amp; chips`，因此屏幕阅读器会读出“amp”。替代文本现在会像正文一样解析字符引用和反斜杠转义，适用于内联、独立和引用式图片；转义的 `&` 和未知名称保持字面量。

- Markdown：将最多缩进三个空格的 ATX 标题读取为标题
  `Markdown` 现在会将最多缩进三个空格的标题行（例如 `   # Title`）读取为标题，符合 CommonMark 规定。此类行过去会显示为带有 `#` 标记的纯文本，流式消息的最开头除外。

- Markdown：按 CommonMark 读取最多缩进三个空格的代码围栏
  `Markdown` 现在会将最多缩进三个空格的代码围栏读取为代码块，闭合围栏也可以同样缩进，符合 CommonMark 规定。每行代码会失去与开启围栏相同数量的缩进。闭合围栏之后只能有空格或制表符，因此打开块内的 ` ```js ` 这样的行仍是代码的一部分。此类围栏过去会在段落中显示为原始反引号或波浪号，而缩进的闭合围栏会让块一直开到文档末尾。

- Markdown：将目标以 `<` 开头但不是尖括号目标的链接显示为文本
  `Markdown` 现在会将 `[a](<b>c>)`、`[a](<b)` 和 `[link](<foo\>)` 显示为文本，符合 CommonMark 规定：以 `<` 开头的目标必须是一个完整的尖括号目标，内部不能有行结尾，即使经过转义也不行。此类链接过去会回退为指向括号之间整个文本的链接。

- Markdown：在深层嵌套输入中保持惰性延续行快速
  `Markdown` 在深层嵌套的块引用或列表后跟惰性延续行时不再慢到数秒，精心构造的消息可能如此：现在检查该行是否延续段落会复用解析器已在每一层读取的内容，检查长行是否为专题分隔线时不再复制它。列表和块引用嵌套最多恰好 100 层深。

- Markdown：以线性时间查找链接目标
  `Markdown` 不再为每个从未闭合目标的链接或图片搜索剩余文本，这会让包含许多此类链接的消息渲染耗时数秒。现在每个括号在每个文本中只配对一次，因此此类输入可在毫秒内渲染；链接读取结果与之前相同。

- Markdown：解码链接目标中的字符引用和反斜杠转义，并在未转义的括号处关闭链接文本
  链接或图片目标现在按 CommonMark 规定读取：`[x](https://a.com/?a=1&amp;b=2)` 链接到 `https://a.com/?a=1&b=2`，`[x](a\)b)` 链接到 `a)b`，引用定义也以相同方式解码。URL 安全检查在解码后的目标上运行，因此编码的不安全 scheme（例如 `&#106;avascript:`）会像普通形式一样被拒绝。链接文本和图片替代文本会在第一个未转义的 `]` 处关闭，因此 `[a\]b](u)` 是文本为 `a]b` 的链接。

- Markdown：按 CommonMark 配对链接文本的括号
  `Markdown` 现在按 CommonMark 规定配对链接文本的括号：链接文本可以包含平衡的括号，因此 `[a [b] c](u)` 是一个链接；最内层的括号构成链接，因此 `[a [b](u)` 只链接 `b`；链接文本内的链接胜出，因此 `[a [b](u) c](v)` 会将外部括号显示为文本，而不是嵌套链接。

- Markdown：链接文本中的代码片段会隐藏其括号
  `Markdown` 不再在代码片段内的 `]` 处结束链接文本，因为代码片段的结合优先级高于链接（CommonMark）。``[`a]b`](/u)`` 链接代码 `a]b`，而 ``[`[x](javascript:y)`](/rel)`` 将代码 `[x](javascript:y)` 链接到 `/rel`，而不是读取代码内的链接。

- 当源文本同时为 Markdown 链接和图片提供标题时，它们会前往其目标
  `[notes](https://example.com/notes "Release notes")` 过去链接到 `https://example.com/notes "Release notes"`——一个不存在的地址——而带标题的图片会指向无法加载的源。目标之后的标题（双引号、单引号或圆括号形式）不再是链接或图片地址的一部分，尖括号中的目标可以包含空格。任何其他形状的内容保持其含义。

- Markdown：空行之后，保留缩进到列表项中的内容在该项内
  `Markdown` 现在会在空行之后将缩进到列表项内容位置的行保留在该项中，符合 CommonMark 规定：编号步骤下的嵌套列表、围栏代码块或另一段落会留在该步骤中，编号会在其后继续。此类内容过去会结束列表，因此子项会显示为单独的列表，而步骤的代码块会显示为原始文本。

- Markdown：混合任务项和普通项的列表会显示每个任务项的复选框
  在 `- [x] Done`、`- Plain`、`- [ ] Open` 这样的列表中，每个任务项现在会在其标记位置显示自己的只读复选框（已选中或未选中，并由其文本命名），每个普通项保留其标记；列表仍是一个列表。此前任务项会丢失选中状态并显示项目符号。仅包含任务项的列表不变。

- Markdown：按 CommonMark 规则配对强调和加粗标记，因此强调内的加粗会保持加粗
  `*` 和 `_` 的串现在按 CommonMark 规定配对：依据它们接触单词的哪一侧、最近兼容的开启符以及三规则。`*see **bold** more*` 和 `*see **bold***` 会在强调内渲染加粗，`**bold *both***` 会在加粗内渲染强调，`__foo, __bar__, baz__` 会嵌套，而强调内转义的 `\*` 保持字面量。此前第一个匹配的标记会提前关闭强调，并在文本中留下多余的 `*` 或 `_`。`***text***` 仍渲染为强调外层的加粗。流式传输会在尾随空格前关闭未完成的 `**bold`，因此部分文本会保持其格式。

- Markdown：保留消息第一行的缩进
  `Markdown` 现在会像处理后续每一行那样保留消息第一行的缩进：两个缩进量相同的项目符号会并排显示，缩进的编号列表会保留每个项，缩进的表格会保留其列。以缩进内容开头的消息过去会与第一行之后的相同文本渲染得不同。

- Markdown：在专题分隔线处结束列表
  `Markdown` 现在会将列表项之后的 `* * *` 或 `- - -` 等行读取为结束列表的专题分隔线，符合 CommonMark 规定，而不是读取为另一个包含嵌套列表的项。

- Markdown：以线性时间检查行的尾随空格
  `Markdown` 在带有长串空格且位于最后一个单词之前的行上不再慢到数秒，精心构造的消息可能如此：判断尾随空格是否构成硬换行时，现在会从行尾计数，而不是匹配一个从每个空格重试的模式。换行读取结果与之前相同。

- DropdownMenu 在指针关闭后会将焦点返回到其触发器，而不绘制焦点环。
  `DropdownMenu` 过去在指针选择或外部按压后会使触发器失焦，焦点落到页面，因此下一个方向键不会去任何地方。现在指针输入后焦点会返回到触发器并抑制焦点环，正如底部工作表呈现已经做的那样，键盘选择后焦点仍保持可见。落在可聚焦控件上的外部按压会将焦点保留在那里。

- 在悬停进行中被禁用的导航或菜单触发器不再打开其表面。
  悬停意图会在短暂延迟后安排打开。在该窗口内禁用触发器会让已安排的打开仍然发生，作用在处理器已经惰性的表面上——因此它打开了，而且无法关闭。现在当集成被禁用时，待处理的意图会被放弃。

- 嵌套在 AppShell 内容或任何其他 Layout 中的 Layout 不再继承外部 Layout 的 `padding`。其表头、面板、内容和页脚会保持默认内边距（或包围它的 Card、Section 或 Dialog 内边距），而不是紧贴内容边缘渲染。嵌套 Layout 上显式的 `padding` 仍然优先。
- 恢复 Outline 可见的键盘焦点指示器。
- 当 `PowerSearch` 在搜索源变化后重新打开已聚焦的输入框时，刷新过时的缓存字段条目（#6845）。
- 在 ToggleButton 上保留调用方的 className，同时保留其主题类。
- 导航 URL 安全：拒绝媒体类型前带空格的 data URL
  共享的 URL 安全检查现在会在比较 scheme 时忽略 URL scheme 之后的空格，正如 data URL 的媒体类型那样，因此 `data: text/html,…` 会像 `data:text/html,…` 一样被拒绝。在 Markdown 中，这也会拒绝目标解码后为该形式的链接、图片和尖括号自动链接，例如 `data:&#32;text/html,…`。接受的 URL 仍像之前一样返回。

- 让聊天跟随在浏览器对滚动偏移进行舍入时到达底部。
- Toolbar 的中间槽位不再裁剪其内容，因此 `centerContent` 中 TabList 的焦点环、盒阴影和选中标签指示器会完整绘制。无法收缩且宽于起始和结束槽位之间空间的中间内容现在会溢出，而不是被截断。
- 将接受的 DOM 属性（例如 `id`、`data-*` 和 `onClick`）转发到 Typeahead 和 Tokenizer 的根元素。保留现有 ref、样式和 `data-testid` 目标，以及 Typeahead 在 InputGroup 内的内置聚焦和编辑行为。

#### 其他变更

- `emptyText` 和 `emptySearchText` 接受 `ReactNode`，但该区域只有在值是字符串时才朗读该值，否则会播报内置默认值。在产品于死胡同中放置链接或“创建一个”行时，会显示一条消息而播报另一条，因此屏幕阅读器用户被告知的内容与视力正常用户阅读的内容不同。
- 在击键 _之后_ 到达的空结果——异步加载完成但没有任何内容匹配活动查询——根本不会被播报。消息留在屏幕上，而该区域保持沉默。

  两个组件现在都从 DOM 读取已渲染的消息并播报它，由一个监视面板状态而不是击键的位置执行。元素会按编写内容播报，子组件生成的文本会正确播报，任何标记为 `aria-hidden` 的内容都会像从屏幕上排除一样从播报中排除。加载中的面板仍不播报任何内容。

- 弃用 `DEP-0001` / 清理 `CLN-0001` — `Tokenizer.emptySearchResultsText`
- 弃用 `DEP-0002` / 清理 `CLN-0002` — `Typeahead.emptySearchResultsText`
- 弃用 `DEP-0003` / 清理 `CLN-0003` — `BaseTypeahead.emptySearchResultsText`
- 弃用 `DEP-0004` / 清理 `CLN-0004` — `ChatComposerTrigger.emptySearchResultsText`
- `Popover` 上的显式 `width` 以及 `DropdownMenu` 或 `Typeahead` 上的 `menuWidth` 会按它们的尺寸渲染，直到视口为止。它们过去会被限制在触发器旁边的空间内，因此从面板边缘附近的控件打开的 352px 菜单会渲染为 274px 宽。
- 无法在触发器旁边放下的层会翻转；两侧都放不下的层会保持其尺寸，并在触发器仍在屏幕上时滑入视野。一旦触发器离开视口，层会保持其位置和尺寸，而不是追逐边缘。
- 在视口边缘浮动持久条（例如手机导航栏）的应用，在其已挂载的 `LayerProvider` 上以 `inset` 声明一次：`<LayerProvider inset={{blockEnd: 56}}>`。然后每个锚定层都会在条上方结束，toast 视口也会升高相同幅度，因此一条 bar 只需为两者声明一次。每个边缘默认值为零，因此默认情况下没有任何移动；现有的 `toast.inset` 保持其作为仅 toast 覆盖的含义。

  一个附加属性（`LayerProvider.inset`，类型 `LayerInset`）；没有其他属性、类型或默认值变化。`spec:AST-059` 记录了这些决定；`Core/Layer` stories 展示了每种行为。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @Geervan
- @HelloOjasMutreja
- @imdreamrunner
- @kentonquatman
- @korkt-kim
- @markselby9
- @rubyycheung
- @thedjpetersen
- @vjeux

---

# 0.6.5

#### 新功能

- 停止将仅供翻译器使用的描述与内置英语回退
  一起打包，并为每个已发布的区域设置添加紧凑的生成字符串映射模块。现有的丰富 JSON 目录导出保持不变。

- Popover 和 usePopover 接受一个处于间距阶梯上的 `padding` 属性（与 Card 和 Stack 一致）。`padding={0}` 会为拥有自己边缘的内容（例如行列表或带分隔线的表头）绘制齐平表面；默认档位（3）不变。

#### 问题修复

- Button 不再溢出窄行：带标签的按钮可以收缩到小于其标签宽度，并用省略号截断标签，而仅图标按钮保持正方形
- 防止空的 Tokenizer 输入框创建空白的尾随行。
- SegmentedControl 的默认 `hug` 布局现在被限制在其容器宽度内，其分段会收缩并截断标签，而不是溢出窄卡片和手机行
- SelectableCard：通过 aria-disabled 和受控的交互处理器，让禁用卡片保留在顺序焦点导航中。
- 当主题的 `--spacing-5` 高于尺寸 token 可容纳的高度时，Selector 的单行触发器会匹配其尺寸 token，而不是超出它。
- Switch：通过持久的 `useAnnounce` 实时区域播报忙碌/加载状态，并通过 `@astryx.switch.loading` 本地化播报。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @Geervan
- @imdreamrunner
- @nynexman4464
- @thedjpetersen
- @vjeux

---

# 0.6.4

#### 新功能

- 新增 `Timer`，用于标准化已用时长，无需 React tick 渲染。(#6438)
  使用 `Timer` 展示进行中操作的已用时间。它默认从挂载时开始计时，接受更早的 Unix 毫秒 `startTime`，提供带自适应节奏的 `elapsed` 和 `clock` 两种格式，并与 Timestamp 的排版 props 保持一致。

- DialogHeader：将起始内容和结束内容包装器暴露为主题目标 (#6415)
  新增 `dialog-header-start-content` 和 `dialog-header-end-content`，使主题可以直接为现有的内容槽包装器设置样式，而无需依赖它们的 DOM 位置。结束内容槽还包含可选的关闭按钮。默认布局与行为不变。

- `DialogHeader` 的 `title` 和 `subtitle` 现在接受任意 `ReactNode`，不再局限于字符串。
  标题可以携带行内标记，且仍渲染在打开时接收焦点、并为 Dialog 命名的可聚焦 `h2` 内；可访问名称是标题的文本内容。副标题可以携带行内内容，例如 `Link`。传入字符串的调用方不受影响。空字符串、布尔值或 nullish 副标题不渲染任何内容，而数字 `0` 副标题现在会渲染在副标题文本内。

- `DropdownMenuItem`、`DropdownMenuCheckboxItem` 和 `DropdownMenuRadioItem` 将 `ref` 转发到行根元素 (#6687)。
  该 ref 会到达携带 `role="menuitem"`（或 `menuitemcheckbox` / `menuitemradio`）的元素，与 `Item` 和 `DropdownMenuDivider` 已有的转发方式相同，因此菜单行可以注册到以元素为键的 observer 或 overlay —— 例如用于曝光、测量、调试轮廓的 IntersectionObserver —— 而无需在 `role="menu"` 与该行之间加一层包装器。

- 为 DateInput、DateTimeInput 和 TimeInput 新增 `presentation`（`spec:AST-043`）(#6628)。
  `presentation` 命名每一种选择器表面，用于区分 Astryx 桌面表面、Astryx bottom sheet（包括新增的 TimeInput sheet）、浏览器/操作系统选择器，以及仅 TimeInput 支持的普通键入字段。DateInput 和 DateTimeInput 接受五个值：`'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'`（默认）。TimeInput 接受这五个值外加 `'text-input'`，即在任何指针下都可用的键入字段，因为其已发布的 `nativePicker="never"` 对应的就是该表面。`presentation="native"` 始终显示原生选择器；`adaptive-native` 保留已发布的原生回退。

  `nativePicker` 已弃用，但仍完全按发布行为工作（`touch`→`adaptive-native`、`always`→`native`、`never`→`adaptive-bottom-sheet`，TimeInput 则为 `text-input`）；同时设置时 `presentation` 优先。`astryx upgrade` 附带 `migrate-native-picker-to-presentation` 用于静态调用点。

- `List`：新增 `edgeCompensation="inline"`，用于补偿容器内边距中项目内容的缩进 (#2626)
  `ListItem` 会按密度相关的水平内边距缩进其内容，因此在分区标题下的列表看起来未对齐，使用者不得不使用负外边距的自定义 CSS。`List` 上的 `edgeCompensation="inline"` 会按每个行内边缘，抵消该缩进与容器在该边缘公布的 padding 中较小者；因此零内边距和全出血表面保持原位，非对称容器内边距绝不会在某一侧过度抵消，标题、悬停背景和选中背景也保持原有几何形状。

  `Item` 现在将其行内缩进公布为 `--_item-inset-inline`，并据此推导自身的 `paddingInline`，被钳制的抵消外边距读取同一个变量 —— 因此抵消会跟随密度和主题覆盖，而不是镜像硬编码值。在 `item` 上设置 `paddingInline` 的主题会通过派生变量注册表自动填充该变量。

- Markdown：新增第一方软换行插件 (#6459)
  使用 `@astryxdesign/core/Markdown/plugins` 中的 `markdownSoftBreaksPlugin` 将软换行渲染为硬换行，无需预处理源文本。该插件通过 Astryx 支持的适配器路径匹配真实的 `remark-breaks` 包，同时保持代码及其他不透明内容不变。

- Table：新增一个感知选择的批量操作包装器，它消费 `useTableSelectionState` 的输出，同时让选择插件保持仅行为性质。(#6474)

#### 问题修复

- 当主题适配改变字号体系时，保留作者编写的标题和文本组件样式 (#6710)
- 当头像被包裹在 HoverCard 或 Tooltip 中时，AvatarGroup 保持其重叠效果。每个头像和溢出指示器现在都接受重叠外边距，组也会在起始边缘留出相应内边距，因此重叠不再依赖每个头像都是组的直接子元素 (#6736)。
- 头像首字母会跳过标点：每个单词的首字母取其第一个字母、数字或 emoji，因此 `Northwind Workbench (automation)` 渲染为 `NA` 而不是 `N(`，`“Ada” Lovelace` 渲染为 `AL` 而不是 `“L`。不含这些字符的单词（例如单独的 `-`）会被忽略，完全由标点组成的名称显示默认图标，而不是一个多余的符号 (#6698)。
- 未显式设置尺寸的 Astryx Icon 会匹配其 Button 或 IconButton 的尺寸：small 和 medium 控件为 16px，large 控件为 20px。(#5762)
- `ChatComposerInput`：当 `isDisabled` 变为 `true` 时，空输入框不再收缩 8px，此前这会使与其底部对齐的任何内容发生位移（例如网格行中的发送按钮）(#6654)。
  根元素的 `minHeight` 只设置为共享行高，没有计入 `editable` 和 `placeholder` 各自额外添加的内边距 —— 这通常无关紧要，因为即使为空，可编辑区域也会保留自己的带内边距盒子。在 Chromium 中，禁用且为空的 `contentEditable` 区域会完全停止保留该空行，而代替它的绝对定位占位符不会贡献布局高度，因此根元素退回到仅行高并丢失了内边距。现在 `minHeight` 会显式计入两者。

- 当 `maxRows={1}` 时，ChatComposerInput 不再为较短的单行草稿出现滚动。移除垂直内边距还能在禁用时保持空输入框与占位符对齐。(#6733)
- 保持 ChatMessageBubble 名称和元数据槽中的数字零对齐。(#6600)
  对于不渲染的标量值（`null`、`undefined`、布尔值和空字符串），对齐包装器会被省略，而数字 `0` 仍会显示在其他槽内容相同的缩进内。

- 当数字零作为 ChatMessageList 空状态传入时渲染它。有效的 ReactNode 不应在对话记录为空时消失。(#6636)
- 省略空的 ChatMessageMetadata 槽及其分隔符 (#6637)。
  布尔值和空字符串的时间戳或页脚值不再留下空行或多余的点。数字零仍会显示，所有投递状态保留现有的标签和图标。

- 将接受的 `onClick` 处理器与 ChatSendButton 的发送和停止操作组合，而不是替换它们 (#6653)。此前使用 `onClick` 替换发送逻辑的调用方应将该逻辑移到 `onSend`，因为现在两个处理器都会运行。
- 允许较长的 ChatSystemMessage 内容在狭窄聊天布局中换行，而不是越过容器边缘 (#6655)。
- ChatTokenizedText 现在会忽略空的 token 值，因此 token 化消息始终能完成渲染 (#6679)。
- ChatToolCalls 现在会显示自定义组标签，将折叠的详情排除在键盘导航之外，添加可见的焦点处理，并为中性元数据使用可读的次要文本 (#6680)。
- 防止 ChatLayout 的滚动到底部按钮在不可见时成为 Tab 停留点。静止时布局默认的 `scrollButton` 渲染为隐藏，但 `opacity: 0` 和 `pointer-events: none` 会让它留在顺序焦点导航中 —— 因此键盘用户第一次按 Tab 进入任何聊天时，都会落在一个没有可见焦点指示器的控件上（WCAG 2.2 SC 2.4.7），按 Enter 还会滚动对话记录。隐藏状态现在还会设置 `visibility: hidden`，淡入淡出过渡会携带该属性，因此动画不变；可见按钮保持其键盘访问。胶囊的高度和折叠宽度现在跟随 `--size-element-md`，而不是硬编码的 `32px`，因此重新调整元素尺寸体系的主题不再能让胶囊裁切自己的 Button。ChatLayout 的消费者文档还新增了此前未记录的 `density` prop，并删除了密度会自动适应容器宽度的说法 —— 它从未如此。一个 Chromium 证据测试锁定了隐藏/可见/重新隐藏的键盘契约，以及胶囊在重新调整尺寸的主题下对其 Button 的包含关系，RTL 适用性台账记录了 ChatLayout 及其滚动按钮为何没有适用的 RTL 维度。(#6466)
- 让为 `chat-layout-scroll-button` 设置样式的主题真正重新设置聊天滚动到底部胶囊的样式。文档化目标位于使胶囊居中的不可见全宽行上，因此 `backgroundColor` 覆盖会在聊天停靠区上涂出一条色带，而胶囊仍保持主题要求替换的表面 —— 并且所有自动检查都通过了，因为该覆盖确实作用到了 _某个_ 元素。现在该目标附着在胶囊上，而胶囊才是绘制填充、高度和圆角的东西（`architecture:component-theming-surface` INV4）。该目标保留其名称、仍是单一目标，组件的 props、DOM 形状、ref 目标和消费者透传均不变。一个 Chromium 测试锁定了放置位置，并通过将目标移回原处、展示主题下胶囊失去样式来证明修复。(#6482)
- 修正 CheckboxIndicator 的主题化、替换内容和焦点指引 (#6745)。
- 将 CheckboxInput 的主题化和标签图标指引与已发布行为对齐 (#6747)。
- 通过 `changeAction` 保存中的 CheckboxList 选项，在它稳定之前切换另一个选项时，现在会保持其 spinner、忙碌状态和重复切换防护 (#6777)。
- 点击带有 `onClick` 的只读 CheckboxList 选项时，现在只会触发该处理器一次，而不是反复重新派发点击直到浏览器调用栈溢出 (#6777)。
- 为惰性 Citation 引用提供受支持的可访问名称，并记录其链接与惰性根契约。
- CodeBlock 不再因内置语法之外的自定义 tokenizer 类型而崩溃（诸如 `keyword.control.sql` 这样的带点类型会从 `insertRule` 抛出异常并拖垮整个代码块）。生成的 `::highlight()` 名称和 `--color-syntax-*` 自定义属性现在会在进入动态样式表之前经过 `CSS.escape`，因此 CSS 解析器接受的每种类型（带点、数字开头、`_private`、非 ASCII）都能保留颜色，且没有任何 token 类型能越出自己的 highlight 规则。引擎仍拒绝的规则只会让该类型失去颜色，绝不会影响整个代码块。(#5528)
- `Dialog` 及其他 30 个组件不再在发布的 CSS 中丢失其 `border` 和 `background` 重置。源码使用了 `border: 'none'` 和 `background: 'none' | 'transparent'` 简写，而 StyleX 默认的属性特异性模式会静默丢弃它们，因此这些声明从未进入 `astryx.css`；未加载 `reset.css` 的使用者会看到 UA 的 `<dialog>` 边框。它们现在是 `borderWidth` / `borderStyle` / `backgroundColor` 长属性。无 API 变更。
- 将同样狭窄的 blocked-scheme 规则应用于原生链接、自定义路由、可点击表面和 Markdown 链接。被拒绝的目标保持可见，但不会导航或调用路由，包括带独立协议的结构化 URL。普通 URL、安全自定义协议、下载和已接受的路由对象身份均保持不变；Markdown 图片/资源策略不变。(#5524)
- 使用主题桥接时保留 Tailwind 字体粗细。(#6479)
- 在 useHotkeys 中忽略 IME 按键事件（`isComposing` 或 `keyCode` 229），即使启用了 allowInInputs，也不阻止其默认行为 (#6773)。
- 在 flex 容器中保持 hug 布局的分段控件按内容尺寸显示 (#6643)
- 保持重新打开的最上层在 Escape 关闭顺序中处于最前。(#6073)
- 防止祖先文本格式和表面/组上下文泄漏到 Layer 内容中。(#6457)
  Layer 内容现在以主题正文排版和中性文本格式开始。核心 layer 内容不再继承意外的祖先表面/组成员关系，包括组拥有的禁用状态、选择、回调和标签关联。在 layer 内部创建的有意组和必需 provider 仍然生效。无关上下文、显式 props、主题和样式覆盖保持不变。

- 带 `hasDividers` 的 `List` 不再在最后一个 `ListItem` 之后绘制分隔线。最后一项的重置使用了 `borderBlockEnd` 简写，而 StyleX 默认的属性特异性模式会静默丢弃它，因此它从未进入发布 CSS；现在改为 `borderBlockEndWidth` 长属性。(#6420)
- 将 PowerSearch 的布尔运算符本地化为日语和韩语，并在中文中使用符合语言习惯的省略号。(#6783)
- Markdown：在引用块和列表项中保留惰性续行 (#6752)
  换行的段落行可以省略重复的引用标记或列表缩进，而不会脱离其所属容器。嵌套、有序、无序和任务列表的续行现在都会保持其渲染结构、文本投影和源范围。

- Markdown 表格现在在每个表头和正文单元格边缘使用 `spacing-2` token（8px）。更紧凑的行内间距在狭窄阅读栏中为内容留出更多空间，同时让行保持舒适可读。
- Markdown：在代码片段中按字面渲染转义的表格竖线 (#6642)
  过去用于在表格单元格内保留竖线的 `\|`，现在会在行内代码中显示为 `|`，与普通文本单元格一致，且不暴露结构性的反斜杠。完成的行内代码片段只在 `<code>` 内渲染其解析后的内容，不带源反引号；独立的行内代码在其他情况下保持不变。

- Markdown：表格列保持由内容推导的宽度下限，表头不再被截断 (#6708)。
  狭窄阅读栏中的 Markdown 表格不再把每一列挤压到只剩几个字符。每列都保持由自身内容推导的下限，按单元格文本框中的字符数测量，因此列永远不会窄于其最长的不可断词 token，单元格内边距也不会侵蚀该下限。标识符、URL 和行内代码保持完整，表头标签换行而不是省略，而真正宽于其容器的表格会在 Table 自己的滚动区域中滚动 —— 该区域现在是表格唯一的滚动视口、可访问名称和键盘停留点。

- 将 DropdownMenu 和 ContextMenu bottom sheet 中带标题的分区与其宽敞的操作行对齐 (#6694)。
- 在狭窄容器中，当 MetadataList 的侧边标签旁边是长徽章时，通过允许值列收缩（包括数字列和自定义标签宽度）来保持标签可读。(#6598)
- PowerSearch：`enum_list` 值菜单现在显示每个值，而不是 typeahead 默认的 10 个。(#6481)
- Selector 保持紧凑单行触发器与其尺寸 token 对齐，包括图标和清除控件。
- 从组件 `label` 为无搜索 bottom-sheet `Selector` 的 listbox 命名，使 Chromium 能以可访问名称暴露它；可搜索 sheet 和 popover 路径保持现有的触发器关系。(#6395)
- 保持 Tailwind 桥接 token 仅作引用，使工具类跟随活动主题，而不会发出相互竞争的运行时声明。
- 将作者编写的主题声明限制在其 CSS 边界内。只丢弃不安全的声明，保留有效的 CSS 值和旧版 token 生成，并继续编译主题的其余部分。运行时会在控制台报告被丢弃的声明；主题构建会将它们包含在现有的回执警告中。CSS 生成器接受一个可选的警告文本数组供构建收集器使用，不提供回调 API，也不新增导出的诊断类型。(#5529)

#### 文档

- 记录 CheckboxList 的 `isReadOnly` prop，并将全选块示例的行改用 `hasDividers` 分隔，而不是在选项列表内放置 Divider (#6777)。
- 澄清 CheckboxListItem 在没有 `value` 的 CheckboxList（例如全选项）中读取 `isChecked` 和 `onCheck`，仅当父 CheckboxList 具有 `value` 数组时才需要 `value` (#6778)。
- 澄清 CheckIndicator 本身就是选择标记，不渲染持久的控件外壳。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @bhamodi
- @cixzhang
- @fullstackhacker
- @harjothkhara
- @HelloOjasMutreja
- @humbertovirtudes
- @imdreamrunner
- @jiunshinn
- @korkt-kim
- @ksying
- @kyu-rong
- @light-merlin-dark
- @nynexman4464
- @rubyycheung
- @vjeux

---

# 0.6.3

#### 新功能

- 在 tooltip 中显示每个共享 InputClearButton 的上下文操作标签。可清除输入框现在为有视觉的用户提供与辅助技术已有的具体操作名称相同的名称。(#6354)
- ChatComposerDrawer：新增 `collapsedSummary` 组合槽，提供后会替换完整的 Collapsed 摘要 anatomy 部分。省略它则保留现有的中性 Badge 和标签。(#5399)
- DialogHeader：新增结束内容边缘补偿控制 (#6465)
  DialogHeader 现在接受 `endContentEdgeCompensation="inline" | "block" | "all"`，用于选择其现有结束内容包装器的哪些轴获得固定补偿。省略该 prop 时，只要渲染关闭操作，就保留当前的自动补偿。

- Markdown：新增原生类型化 frontmatter 元数据 (#6381)
  使用 `@astryxdesign/core/Markdown/plugins` 中的 `createMarkdownFrontmatter()` 将文档开头的键/值块解码为类型化元数据，保持未完成的流式元数据隐藏，并从渲染的 Markdown 中移除已完成的元数据语法。

- Markdown：新增核心插件协议 (#6340)
  使用 `createMarkdownPlugin()` 和 Markdown 的 `plugins` prop 组合有界的源语法、不可变的类型化 AST 变换和扩展渲染器。当服务端代码需要规范树时，从 `@astryxdesign/core/Markdown/parser` 导入 `parseMarkdownAst()` 或 `parseInlineAst()`。同一组有序插件可同时用于解析器入口点和 Markdown 派生的 Outline 项，而省略或空的插件列表保留现有行为。

- Markdown：新增受限的 Remark 兼容适配器 (#6345)
  从 `@astryxdesign/core/Markdown/remark` 导入 `createMarkdownRemarkTransform()`，在文档化的 MDAST 子集上运行一个同步、仅变换的 Remark 插件。每次调用都会获得一棵全新的可变树和一个隔离文件，每个插件的兼容性由 fixture 证明而非假设：异步工作、解析器或编译器插件、处理器状态、原始 HTML、不支持的节点、伪造的位置以及 Astryx 无法表示的元数据，都会保留最后一个有效的可读文档并报告一条诊断。该适配器是独立入口点，因此不会进入任何未导入它的 bundle。

- Markdown：新增语义代码围栏变换辅助函数 (#6343)
  使用 `createMarkdownFenceTransform()` 为声明的围栏代码语言标注类型化扩展数据，而标准插件的 `renderers` 负责呈现和文本投影。`components.code` 保持优先，被拒绝、缺失或失败的提案会保留 Markdown 可访问、可复制的 `CodeBlock` 回退。

- Markdown：新增不可变源装饰辅助函数 (#6344)
  使用 `createMarkdownSourceDecoration()` 为经过验证的 UTF-16 源范围触及的每个块附加非视觉元数据，并在后续插件中用 `getMarkdownSourceDecorations()` 读回。它通过 `<Markdown>` 和 Outline 工作，无需额外的解析器选项，独立于先前变换留下的块顺序解析，并出现在已定稿的文档上而非部分流式块上，因此装饰不会出现后又消失。元数据存放在一个 Astryx 拥有的版本化信封中，绝不合并外来节点数据。渲染输出、可复制文本、可访问名称、标题 id、焦点顺序、导航和源出处均不变。

  Markdown 变换也变快了，插件现在总是观察到完全不可变的树 —— 包括 Core 辅助函数未改动地携带过来的块。Core 编写的辅助函数现在会验证调用方回调产生的节点，并在一条可信路径上运行，跳过应用于插件编写输出的整树验证和冻结；冻结只遍历变换更改过的部分；不贡献任何行内语法的插件列表不再按每个源字符产生成本；辅助函数的每次匹配分配和重建也已消失。代表性的三辅助函数组合现在比空管线增加约 20%，处于其 25% 预算内，低于此前约 3.3 倍。

- Markdown：新增不可变文本变换辅助函数 (#6342)
  使用 `createMarkdownTextTransform()` 将匹配的正文替换为类型化 Markdown 节点，同时将链接、图片、代码、数学、引用和现有扩展语法保留为受保护上下文。

- 为 CheckboxInput、Collapsible、Link、Slider、Switch、TabList、RadioList 和未选中的 SegmentedControl 项新增按压反馈。启用的控件在指针按住或拖动期间会在其交互表面绘制 `--color-overlay-pressed`；禁用的控件和选中的 SegmentedControl 项保留现有表面。(#6380)
- 允许 TreeList 项携带行样式 (#6238)
  `TreeListItemData` 新增 `xstyle`、`className` 和 `style`，应用于项的行元素，符合 TreeList 契约中逐项样式接缝的要求。

  `TreeList` 以数据形式接收行，因此此前没有任何东西交回行的元素。这阻止了行级原语（例如 `useContainerReveal`）安装类名和内联自定义属性，而这些正是隔离每行悬停和焦点状态所必需的；将 reveal 应用于整棵树会同时暴露所有行操作。

  `Item` 已经接受相同的行样式 props，因此转换为树的列表可以保留其 reveal 接线，而不必标记整棵树。

#### 问题修复

- 通过具名滚动主体 Tab 停留点，让溢出的 BottomSheet 文本可键盘到达。为 `useScrollableArea` 增加共享的聚焦时键盘委托：前进 Tab 可直接进入第一个原生 link/button，而输入框、复合控件和嵌套滚动所有者保留视口停留点。反向遍历会跳过被委托的视口；指针/程序化焦点和内容变化绝不会触发委托。Sheet 滚动包含现在仅在内容溢出时应用，并使用共享的 `contain` 策略，允许原生边缘反馈。(#6301)
- 保持 ChatComposer 的公共组合契约一致：自定义输入现在提交它们提供的值，禁用的默认编辑器向辅助技术暴露其状态，显式显示的 Stop 操作在编辑禁用时仍可指针操作。(#6398)
- 将折叠的 `ChatComposerDrawer` 内容排除在键盘和辅助技术导航之外，并在其展开控制上显示共享焦点指示器。(#6416)
- 保持程序化 ChatComposerInput 编辑可观察，通过 `onFiles` 投递拖入的文件，并让 `onPaste` 在默认 token 转换之前拦截文本。(#6419)
- 导出 `ChatComposerTokenElementProps`，并从 `ChatComposerTokenElement` 转发支持的 span props 和 refs (#6443)。
- 当语音识别不可用时保持聊天听写控件禁用，并保留主题对其裁切反馈的控制 (#6444)。
- 将可调整大小的 SideNav 手柄裁切在侧边栏边界内 (#6196)
- 将 16px 文本控件字号下限限定在 iOS 上，在粗指针查询内使用 `@supports (-webkit-touch-callout: none)`，使 Android 和触摸屏笔记本电脑保留主题的字号体系，而不是被夸大到 16px（#6085；修复 #6015）
- Kbd：以与 `escape` 和 `enter` 相同的字形和可访问名称渲染 `esc` 和 `return` 别名 (#5657)
  这是对 #5403 的部分修复，统一了 `useHotkeys` 已接受的两个无歧义别名。Kbd 现在将 `esc` 渲染为 `Esc`，可访问名称为 `Escape`；将 `return` 渲染为 `↵`，可访问名称为 `Enter`。其查找表现在在渲染任意键名时也会避免原型链冲突。`meta` 的平台特定渲染契约和 `space` 的显示选择仍留在 #5403 中未解决，等待单独的 API 和设计决策。

- LayoutFooter：为 docsite 预览新增 playground 包装器和默认子元素 (#6341)
  通过将 LayoutFooter 包在带代表性 footer 内容的 Layout 脚手架中，防止 docsite 的属性标签页预览渲染空舞台。

- PowerSearch：在值菜单打开时切换字段或运算符，现在会显示新字段的选项，而不是旧字段的。(#6357)
- 将可聚焦的 ProgressBar 目标标记移到 `progressbar` 子树之外 (#6248)
- Selector：当选项解析出的选择指示器不渲染任何内容时，折叠该选项的标记列。(#5619)
  使用默认勾选指示器的未选中行不再因空包装器而损失标签宽度。已选中的标记和渲染未选中状态的主题化指示器，在配置的逻辑边缘保留其空间。

- 填充区域内 Slider 标记使用填充色：单模式下位于滑块处或之后的标记，以及范围模式下位于两个滑块之间的标记，现在使用强调填充色绘制，而不是默认标记色。未填充侧的标记不变。(#6455)
- Slider 对未填充刻度使用轨道 token，使标记与轨道在各主题下保持对齐 (#6461)
- Spinner：改为对弧线的 dash offset 做动画，而不是旋转圆环，修复 iOS Safari 上的残余晃动（#6311；修复 #6253）
  早先针对 #3617 的修复为旋转的 `<svg>` 添加了 `willChange: 'transform'`，这平滑了旋转运动，但对 WebKit 如何逐帧光栅化旋转描边形状的圆端没有任何作用。旋转整个圆环在 iOS Safari 上仍可见地晃动。

  改为对静止弧线 `<circle>` 的 `stroke-dashoffset` 做动画，而不是旋转 `<svg>`，因此形状永不旋转，WebKit 也永远不会在中间角度重新光栅化端点。问题报告者在真实 iOS Safari 设备上确认了这一点。

- Table：仅在其内部视口可以滚动时才包含过度滚动，因此能放下的表格不再在父级中制造死滚动区。(#6410)
- 将主题的正文字体应用于主题作用域根。生成的主题 CSS 在标题、段落和代码元素上设置了 `font-family`，但从未在页面上建立基础字体，因此使用 `font-family: inherit` 的组件（SideNav 项、Button）会回退到浏览器默认的衬线字体。生成器现在在 `:scope` 上发出 `font-family: var(--font-family-body)`，通过树继承。(#6450)
- 保持 ToggleButton 回调同步，并让按压的 Action 通过 Button 的 clickAction 路径运行，保留回调取消和乐观待处理反馈。仅回调的切换和由值标识的 ToggleButtonGroup 成员省略 Action 路径，它们的选择仍归组所有。(#6463)
- 当 ToggleButtonGroup 不禁用任何内容时，ToggleButton 保持自身的 `isDisabled`。组总是提供 `isDisabled` 布尔值，因此先前的 `??` 回退从未运行，一个启用的组会重新启用一个自行禁用的成员 —— 该成员会在点击时被选中，而携带 `tooltip` 的成员在看起来不可用时仍可操作。禁用的组仍会禁用每个成员，只是不能重新启用某个成员。(#6356)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @aldentan
- @athz
- @cixzhang
- @ernestt
- @harjothkhara
- @HelloOjasMutreja
- @jiunshinn
- @kentonquatman
- @korkt-kim
- @ManoharPaturi
- @nynexman4464
- @rupesh-kumar-sah
- @vjeux

---

# 0.6.2

#### 新功能

- Markdown：新增可选数学渲染器 (#6312)
  提供 `components.math` 以解析 `$…$` 行内数学和 `$$…$$` 显示数学。渲染器接收不带定界符的表达式作为 `value`，以及其放置方式作为 `display: 'inline' | 'block'`，因此应用可以接入偏好的数学排版器，而无需预处理 Markdown 或接受原始 HTML。

  除非存在渲染器，否则数学关闭。直接调用解析器的人可以通过 `MathParseOptions`（`{math: true}`）选择启用，增量调用者可通过 `createIncrementalState<true>()` 创建 `IncrementalParseState<true>`。这些重载返回 `InlineNodeWithMath` 或 `BlockNodeWithMath`；默认、遗留集合、`math: false` 和标注 `ParseOptions` 的调用保留现有的 `InlineNode` 和 `BlockNode` 联合，因此穷举使用者除非选择启用，否则不会新增分支。现有 Markdown 解析和渲染默认保持不变；代码保持不透明，转义和不匹配的定界符保持字面，行内插件跳过数学。增量解析在显示数学嵌套于普通列表或任务列表以及引用块中时保留完整解析结果，包括引用深度转换，支持 LF 或 CRLF，并启用源范围。

- DialogHeader 为其头部间距、标题/副标题间距和关闭图标尺寸暴露主题目标。(#6240)
- 暴露 DateRangeInput 预设主题目标 (#6223)
- 将 Slider 交互控件暴露为主题目标 (#6225)
- 将 FileInput 的上传图标暴露为模式感知的主题目标 (#5417)
- 为 Spinner 新增公开变量 `--spinner-arc-fraction`，使主题可以改变移动弧线覆盖圆环的比例（默认 0.375，即 135deg 扫掠），就像它已经可以重新设置直径、描边宽度和颜色一样。(#5845)

#### 问题修复

- 新增 `@astryx.chatTypingIndicator.*` 目录键，使 lab 中的 ChatTypingIndicator 可以从翻译运行时构建其输入状态，而不是使用英文字面量，并使用 `Intl.ListFormat` 按活动语言区域连接名称。英文输出不变。(#6220)
- Spinner：默认辅助标签现在来自翻译目录（`@astryx.spinner.loading`），而不是组件源码中的字面量 `"Loading"`，因此本地化应用可以翻译该状态。显式 `aria-label` 和可见字符串标签仍按此顺序优先。(#6217)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @athz
- @cixzhang
- @freddymeta
- @HelloOjasMutreja
- @ksying
- @Kyujenius

---

# 0.6.1

#### 新功能

- 移除主题局部 token 的前缀要求 (#6285)
- 新增 ScrollableArea 和 useScrollableArea，用于可访问、逻辑轴的原生滚动，并带有显式的过度滚动策略。(#6262)
  可滚动视口现在仅在内容有效溢出时才可通过键盘到达，跨书写模式保留逻辑边缘状态，仅在活动轴上应用包含的过度滚动，除非显式请求，否则在适配时避免捕获 Sticky，暴露标准容器尺寸 props，并将可选内容内边距和可选全出血与共享容器几何系统集成。

#### 问题修复

- BaseTypeahead：保留输入 props，并在狭窄布局中保持结果可访问 (#6179)
  BaseTypeahead 现在将其继承的 DOM 和样式 props 转发到 combobox 输入框，保留原生输入属性，除非已定义的遗留别名覆盖它们；保持空结果列表对辅助技术有效；为 `minQueryLength` 计算可见字符数；并使弹窗和长结果内容都保持在视口边距内。

- BottomSheetSwitcher：让最顶层的嵌套层在非模态流程之前处理 Escape。(#6184)
- BreadcrumbItem 在菜单轻量关闭时保留有效的外部焦点，并从富触发器内容为菜单加标签 (#6206)
- Center：保留组件拥有的轴反射，并修正水平居中示例。(#6207)
- 本地化 Chart 可访问性文本并完善其消费者指引。(#6247)
- 将指针/触摸点按的清除焦点恢复推迟，以防止页面滚动跳动，同时保留键盘激活时的同步焦点恢复，并正确组合 `InputClearButton` 中的 `onPointerDown` (#5440)
- 在维护主题和新示例中优先使用规范组件目标名称，同时保留已弃用的运行时别名和已发布的裸 prop/state 选择器类，直至 0.7.0 移除窗口。主题发现会标记已弃用的目标，主题构建会警告每个确切的规范替换，`astryx upgrade --apply` 提供向前兼容的裸选择器迁移。(#6126)
- 字段输入框在滚动时不再绘制到粘性 AppShell 头部之上 (#5689)。Field 现在通过 field 表面上的 `isolation: isolate` 边界包含其本地堆叠层（输入表面的 z-index 和附加的状态层），使它们无法与页面级堆叠竞争；AppShell 头部保持其正常堆叠层级。
- TextInput 的 `onEnter` 不再为提交 IME 转换的 Enter（日语/中文/韩语输入）触发；`onKeyDown` 仍接收原始事件。(#6082)

#### 文档

- AspectRatio：以其 JSX 形式展示 `ratio` prop (#6093)
  最佳实践行告诉读者将比率表示为 `16/9` 这样的分数，却没有在 JSX 中展示它，CLI 输出中也没有其他地方为 `ratio` 提供示例。将其改写为 `ratio={16 / 9}`，并说明字符串形式是类型错误。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @Cypher-Aura-19
- @Geervan
- @Kyujenius
- @ManoharPaturi

---

# 0.6.0

#### 破坏性变更

- 移除已弃用的 focus-direction 覆盖、hooks 路径的 `isImeKeyEvent` 再导出以及 Resizable 的像素边界别名。
  **Codemod：** 在更新到 0.6.0 之前运行 `npx astryx upgrade --apply`。它会移除 focus-hook 的 `isRtl`，将 `isImeKeyEvent` 导入移到 `@astryxdesign/core/utils`，并将 `minSizePx`/`maxSizePx` 重命名为 `minSize`/`maxSize`。

- 停止发出已弃用的裸 prop 和 state 类，例如 `.primary`、`.sm` 和 `.checked`。组件保留其稳定的 `astryx-*` 目标类，并通过显式 `data-*` 属性反映视觉 props 和运行时状态；生成的运行时和构建后的主题 CSS 现在使用相同的选择器契约。
  当已知 Astryx 目标和 v0.5.4 值具有一个或多个已知含义时，运行 `astryx upgrade --apply` 以迁移 `.css` 文件中可安全识别的选择器。例如：

  - `.astryx-button.primary` → `.astryx-button:is(.primary, [data-variant="primary"])`
  - `.astryx-button.sm` → `.astryx-button:is(.sm, [data-size="sm"])`
  - `.astryx-switch.checked` → `.astryx-switch:is(.checked, [data-checked="checked"])`

  Codemod 会解析 CSS 选择器语法，绝不重写声明、注释、JavaScript/TypeScript 字符串、未限定的类或自定义/未知的限定类。每个已知值都会变成一个保持特异性的 `:is(...)` 联合，包含原始类分支以及每个 v0.5.4 反射的 data 属性分支。类分支保持消费者提供的 `className` 匹配继续工作；属性分支匹配 v0.6 props 和状态。当类来源或 prop 轴意图已知时，你可以稍后收窄该联合。搜索诸如 `.primary` 或 `.sm` 这样的未限定旧值选择器，仅在确认 Astryx 用法的地方手动迁移。嵌入 JavaScript 或 TypeScript 的选择器也按相同规则手动迁移。

  语义化的 `defineTheme({components})` 键（例如 `variant:primary` 和 `checked`）不变。如果你预构建自定义主题，升级后重新运行 `astryx theme build <theme-file>`，并一起部署重新生成的 `.css`、`.js`、`.d.ts` 和可选的 `.variants.d.ts` 产物。构建后的主题会标记为 `__built: true`，因此运行时有意不会重新生成过时的 CSS。

  导出的主题辅助函数保留其返回/容器形状，但会有意返回不同的选择器字节：

  - `themeProps` 返回稳定的目标类（以及目标名称兼容别名），不带裸 prop/state 类；其反射的 `data-*` 属性不变。
  - `parseStyleKey` 返回 data 属性选择器后缀，而不是 `.value`、`.prop-N` 或 `.state` 后缀。
  - `generateThemeRules` 保留其数组契约和顺序；非基础组件选择器使用反射属性。
  - `generateThemeRulesSplit` 保留 `{component, prose}`；`component` 选择器字节变化，`prose` 不变。
  - `generateOnMediaCSS` 保留其作用域字符串契约；组件选择器字节变化。
  - `generateThemeCSS` 保留 `{prose, component}` 以及相同的层/作用域；`component` 继承新的选择器，`prose` 不变。

- 将 `Stepper` 的 `horizontalOptions.minimumStepWidth` 限制为像素数字，并从 `useStepperContext` 移除紧凑布局实现字段。
  将诸如 `'7rem'` 的 CSS 长度阈值替换为预期的像素数字。调用 `registerStep(index, {getIsDisabled})`，而不是传入禁用布尔值；选项对象是可选的。`StepperContextValue` 保留转换历史和步骤注册，而步骤数、紧凑状态、摘要 portal 协调和阈值测量仍为包内部。

- 为 `defineTheme` 添加有序环境适配
  主题现在可以针对命名视口宽度、主指针精度、对比度偏好和运动偏好，选择启用 CSS 优先的 token、主题局部 token 和组件更改：

  ```ts
  defineTheme({
    name: 'acme',
    adaptations: {
      widthBreakpoints: {sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536},
      rules: [
        {
          when: {width: {from: 'lg', below: 'xl'}, pointer: 'coarse'},
          value: {tokens: {'--size-element-md': '44px'}},
        },
      ],
    },
  });
  ```

  条件字段之间为 AND 关系。`width.from` 为包含，`width.below` 为排除，规则按声明顺序层叠，因此后匹配的写入获胜。主题扩展保留有效的断点映射和继承规则顺序；静态构建保留源代码等价扩展所需的元数据。

  `AppShell` 现在为 `mobileNav.breakpoint` 接受 `xl` 和 `2xl`，并通过最近的 Theme 解析全部五个名称。移动模式现在使用文档化的排他边界（`width < breakpoint`），因此正好位于命名点的 AppShell 会渲染更宽的布局，而不是移动布局。

  `defineTheme` 现在会验证适配规则内编写的 token 值，拒绝非字符串标量和长度不等于 2 的数组，而不是将它们发出。根和 on-media token 输入保持现有接受行为不变，因此通过 casts 或 spreads 传递值的主题仍可构建。它还会为每个可到达的匹配适配规则集合验证组合的可移植和主题局部 token 图，在发出 CSS 之前拒绝循环。规则中的组件写入使用与根 `components` 相同的目标、轴、值域和扩展验证；规则不能是自定义值注册的唯一位置，因为生成的类型增强是无条件的。

  `astryx theme build` 将适配生成器视为核心能力而非基线要求，因此没有适配意图的主题仍可针对较旧安装的 `@astryxdesign/core` 构建，并发出与之前相同的 CSS。确实携带适配意图的主题 —— 有效规则、自定义 `widthBreakpoints` 映射或存在但格式错误的适配元数据 —— 会在写入任何输出之前针对此类核心失败，并以 `ERR_CORE_INCOMPATIBLE` 指明缺少 `generateAdaptationCSS` 导出。没有规则的完整默认宽度映射不要求任何东西，仍可构建。当较旧核心的 `defineTheme` 在解析时丢弃适配，构建会记录每个原始 `defineTheme()` 输入并将其与产生的主题关联，因此只有所选主题的血统决定结果。不可观察的所选祖先（包括其 ESM 核心命名空间无法被包装的 CommonJS 源包）会安全失败；导入图中其他地方未使用的自适应主题不会影响普通构建。同样的捕获会在旧核心构建的产物中保留原始排版、颜色、圆角和运动轴元数据，使后来的当前核心子主题能够精确解析部分适配轴，如同扩展源主题一样。

#### 新功能

- Banner 在可见框架上暴露 `banner-frame` 主题目标，该框架拥有整个 banner 的高度和抬升卡片轮廓。该目标反映 `container` 和 `elevation`；现有 Banner 目标和默认渲染不变。
- `Collapsible` 和 `CollapsibleGroup` 接受 `chevronPosition="start" | "end"`。默认仍为 `end`，保留已发布的尾随箭头。`start` 将展开箭头移到标签之前，适用于树/文件浏览器式行：折叠时它指向内容，在 RTL 下镜像，展开时向下翻转。
  当直接项应共享该位置时，在 `CollapsibleGroup` 上设置。单个 `Collapsible` 可以覆盖组，而嵌套在项内容内的 Collapsible 会启动新的呈现作用域并保持自己的默认值。

- 为 Heading 新增具名 font-weight 覆盖，优先级高于其视觉类型和语义级别默认值。
- 为 TextInput 和 TextArea 新增 `autoComplete` prop，原样转发到原生控件。

#### 问题修复

- ChatComposerInput：当触发器使可编辑区域成为 combobox 后，移除 `aria-multiline`
  `aria-multiline` 曾硬编码在 contenteditable 元素上，而 `useTriggerMenu` 拥有其角色，因此配置 `triggers` 会将角色切换为 `combobox` —— ARIA 1.2 未在该角色下列出 `aria-multiline` —— 于是 axe 在 8 个 ChatComposerInput 触发器故事和 2 个渲染它的 ChatLayout 故事上标记 `aria-allowed-attr`（严重）。将该属性移入 hook 的 `ariaProps`，在那里一并决定角色及其有效性依赖的属性。

- CheckboxListItem：可见的 `description` 现在是复选框的可访问描述，因此浏览器会计算出一个不同的描述，而不是没有描述。Item 将其已经渲染的描述元素设为 id，并将该 id 发布到它在槽中渲染的内容，这保留了纯字符串描述的自动单行截断。CheckboxInput 现在会将消费者提供的 `aria-describedby` 与其自己的描述、状态和禁用原因 id 合并，而不是替换它。无公共 API 变更。
- CheckboxListItem：ReactNode `label` 现在通过 `aria-labelledby` 从其可见文本为复选框命名，就像 RadioListItem 已经做的那样，而不是回退到通用名称 "Checkbox"。`aria-label` 仍会替换该名称；没有任何文本的富标签需要它，就像 RadioListItem 一样。要求每个富标签都提供 `aria-label` 的开发时警告已移除。
- 防止被移除的 Resizable 边界被静默忽略，并保持有歧义的 spread 迁移行为不变 (#6124)
- 防止悬停自动滚动已打开的选项列表 (#6077)
  在突出显示跟随指针的可滚动列表框中，将突出显示的选项滚动到视图中会使下一个选项移动到静止指针下方，其 mouseenter 会重新突出显示并再次滚动 —— 形成没有用户输入的无限循环。DropdownMenu 和 Chat 已修复此问题；现在通过共享的突出显示所有者覆盖其余 combobox 式路径：Selector、MultiSelector、Typeahead、DateTimeInput 和 CommandPalette 的悬停突出显示只移动突出显示，而键盘导航仍会将突出显示的选项滚动到视图中。

- Slider 在指针拖动后对仅按修饰键的按键保持焦点环隐藏，同时保留键盘导航 (#5469)
- Layout：当设置 `contentWidth` 时，将内容滚动条保持在内容区域的外边缘。
  没有面板时，`LayoutContent` 跨越可用的 Layout 宽度，并在内部将子元素对齐到 `contentWidth`。只有一个面板时，面板保持对齐到 `contentWidth` 框架，而内容延伸到对面的开放区域。双面板布局保持完整组合受约束。

- Popover：通过每条打开路径应用同手势重新打开保护，无论激活方式如何都聚焦真正的调用方内容，并保持生成的 fallback 关闭控件在键盘用户到达之前隐藏。
- SideNavItem：消费者提供的 `aria-label` 不再被折叠轨道回退覆盖，在图标-only 和 popover 触发器路径中均如此。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @ernestt
- @faga295
- @freddymeta
- @HelloOjasMutreja
- @imdreamrunner
- @jiunshinn
- @kentonquatman
- @Kyujenius
- @rubyycheung

---

# 0.5.4

#### 问题修复

- DropdownMenu：当受控菜单在挂载时已打开时，保持焦点在原处 (#5976)
  以 `isMenuOpen` 为 true 挂载时不再将焦点移入第一项；只有挂载后发生的打开才会，遵循输入模态规则。页面在加载时渲染打开的菜单不再让键盘用户陷入其中，而在聚焦触发器上按 ArrowDown 会走进已打开的菜单，而不需要先关闭再重新打开。

- DropdownMenuRadioGroup：在 docsite 属性预览中渲染可用的菜单 (#5976)
  添加一个首次加载即打开的 `DropdownMenu` playground 包装器和两个 `DropdownMenuRadioItem` 子元素，使属性标签页预览立即显示可选择的单选选项，而不是空容器。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @Kyujenius

---

# 0.5.3

#### 新组件

- 为 DropdownMenu、MoreMenu 和 ContextMenu 添加内置的 `popover`、`bottom-sheet` 和紧凑触摸 `adaptive` 呈现策略。(#5395)
- 为 Selector 和 MultiSelector 添加 popover、bottom-sheet 和 adaptive 呈现选项，并为两种 bottom-sheet 变体提供 docsite 示例。(#5395)
- 为 Selector 和 MultiSelector 添加 `isReadOnly`，使选中的值保持可聚焦且可提交表单，而不暴露选择菜单或编辑功能。(#5805)
- 为维护主题系列添加可选的 theme-local token 契约。(#5844)
- 为 ToggleButton 添加 `elevation` prop，用于浮动（FAB 风格）切换按钮，与 Button 一致；在 ToggleButtonGroup 内保留。(#6012)

#### 新功能

- 为组件文档添加结构化可访问性要求和主题覆盖支持。(#5713)
- Banner：头部的辅助行现在带有稳定的主题目标 `astryx-banner-description`。(#5483) 此前只有头部、状态图标和内容面板可主题化，因此重新设置描述样式（颜色、字体，或它与标题之间的间距）的主题必须使用 `.astryx-banner > div:nth-child(2) > div:nth-child(2)` 之类的结构选择器。纯新增：现有类、data 属性或样式均不变。
  头部中没有其他部分成为目标。末端区域是一个布局行 —— flex、wrap，以及让按钮可以越过头部内边距的边缘补偿 —— 而不是绘制表面；希望头部围绕按钮扩展而不是让按钮越界的主题，可在现有 `banner` 目标上设置 `padding-block`，这样能达到相同高度而无需暴露私有外边距。标题、两个控件和文本列同样保持不变：文本列不绘制任何内容（`display: flex; flex-direction: column; gap: 0`），其拥有的空间可在 `banner-description` 上表达，而标题和控件已经按消费主题期望的方式渲染。

- 为 DateTimeInput 添加 `nativePicker`，支持浏览器和操作系统日期/时间选择器，并为秒、自定义增量和预设选项提供 Astryx 时间回退。原生字段在 fit-content 布局中遵循 DateInput 的紧凑最小尺寸。(#5620)
- 让主题添加类型化 Heading 视觉角色，并在所属主题样式不可用时安全回退到语义级别。(#6026)
- RadioListItem 和 CheckboxListItem 接受富 `label` 和 `description` (#5257)
  `RadioListItem` 将 `label` 和 `description` 类型化为 `string`，而同级 `CheckboxListItem` 已将 `label` 类型化为 `ReactNode` —— 因此同一个槽有两个契约，描述中带链接的应用无法在任一组件上类型化它们。现在两者都接受 `ReactNode`；运行时本来就已经渲染它。

  `RadioListItem` 获得 `CheckboxListItem` 已确立的 `aria-label` 逃生舱，含义相同：为控件提供纯文本可访问名称。单选按钮有一处不同值得了解 —— 它指向可见标签作为可访问名称，因此富标签仍从自身文本命名，而 `aria-label` 用于收窄读起来糟糕的名称，而不是提供缺失的名称。`aria-label` 现在落在单选按钮上，而不是行 `<div>` 上（ARIA 在那里会忽略它）。

- Stepper：`--step-connector-gap`，让主题可以让轨道上的连接线在指示器之前提前结束
  轨道上的布局将连接线绘制为节点两侧的段。希望轨道在指示器周围留出空隙的主题必须分别处理两个段，而它们只能通过兄弟位置区分 —— 当 `indicator="none"` 时还会变化。

  现在用一个公开变量即可：它声明在 Stepper 根上，因为组件变量由根拥有：主题写入 `stepper: {base: {'--step-connector-gap': '4px'}}`，每个连接线都会继承它。Astryx 会将其花费在每个段面向节点的侧边，因此这一对会留下对称的空隙，调用方无需命名这些部件。默认 `0px`：已发布的轨道仍读作一条不间断的线。

  在 Chromium 中针对构建后的主题覆盖进行测量，沿 12px 段读取绘制像素：

  | 值 | 裁切量 | Stepper 高度 | | ------- | ------------- | -------------- | | `6px` | 6px | 不变 | | `-4px` | 0 | 不变 | | `1rem` | 上限为 8px | 不变 | | `999px` | 上限为 8px | 不变 | | `10%` | 1px（共 12px） | 不变 | | `50%` | 上限为 6px | 不变 |

  四件必须成立且确实成立的事：

  **主题覆盖能到达它。** 默认值只在根上声明一次，而不是在每个连接线上声明。若逐连接线声明，每个连接线都会在自身重新声明 `0px`，而元素上声明的值会优先于继承值 —— 因此生成的 `stepper` 覆盖能干净编译却不起任何作用。

  **值是有界的**，两部分各有理由 —— 都不是 padding 的理由。`max(0px, …)` 是因为 `inset()` _接受_负长度：Chromium 会按写法计算 `inset(0 0 -4px 0)`，而不是像对负 padding 那样钳制，因此必须声明下限。`min(…, --spacing-2)` —— 灵活段自身的 `min-height` —— 因此过大的间隙会让轨道变短，而不是无界。两者都不会让 Stepper 变大；裁切不会改变布局。（早先基于 padding 的修订在 `1rem` 时让三步 Stepper 从 108px 增长到 144px。）

  **水平裁切在 `dir="rtl"` 下镜像。** `clip-path: inset()` 是物理的 —— top/right/bottom/left，没有逻辑形式 —— 而行本身会反转。若不翻转，RTL 中前导段位于节点的_右侧_且仍裁切其右边缘，因此空隙会在步骤之间的接缝处打开，而不是在指示器处。修复前测量：`con0 x=622, indicator x=606, clips RIGHT edge`。修复后：`clips LEFT edge`，LTR 不变。块轴无需处理 —— `dir` 不会反转它。

  **一个声明覆盖两层。** 间隙必须到达轨道（段自身的背景）和强调填充（绝对定位的 `::before`）。分别花费意味着两个盒子上的两个声明，因此百分比会针对不同的包含块解析，使它们相距约 1.2px。在段上使用单个 `clip-path: inset(…)` 会针对一个参考盒子同时裁切元素及其伪元素，因此每个接受的值在两层上表现一致 —— 这正是 [#5824](https://github.com/meta/astryx/pull/5824) 对公共输入在其完整值域上的要求。裁切也不会改变布局，因此段定位的节点无法移动。

  **没有指示器，就没有间隙。** `indicator="none"` 不渲染节点，因此那里的间隙会是本应连续的轨道上的一个洞。

  接受任何 CSS 长度或百分比，并在两层上表现相同。百分比针对每个段自身的盒子解析，因此固定段和灵活段会因一个声明值而裁切略有不同的量 —— 属于外观问题，受上限约束，记录为已接受而非修复。

  **为什么用自定义属性而不是有保证的 CSS 属性。** 主题目标到达元素，永远不会到达其 `::before`。在 `step-connector` 上针对构建后的主题覆盖测量：`paddingBlock: 6px` 完全不产生空隙 —— 背景绘制到其边框盒，填充无法到达 —— 其唯一效果是 Stepper 从 108px 增长到 120px；`paddingBlockEnd: 6px` 也不产生空隙，且只处理两个边缘中的一个。只有组件能同时裁切两层、按轴和方向镜像，并先行钳制。

  添加 `Stepper.spec.md`，这是该公共属性的规范所属记录，包含该采纳论证、值契约和 anatomy 到目标的映射。`Stepper.doc.mjs` 获得其现有 `stepper`、`step` 和 `step-connector` 目标从未有过的 anatomy 条目，因此每个当前目标都锚定到已描述的部分。

  取代本 PR 早先提出的 `segment` 变体。那将 `lead` / `rail` / `content` 暴露为公共主题词汇，这站不住脚：这些词从未出现在生成的文档中，它们会发出裸 `lead` / `content` 类，消费者自己的样式表可能与之冲突，而且 `lead` 在不同方向上意味着不同的几何形状。这些部件只是该布局当前恰好绘制的方式，不是契约。

- Stepper 的 `horizontalOptions.collapsedVariant` 让流程为其紧凑呈现选择 `withLabelAndControls`、`withLabel` 或 `hiddenLabel`。当周围流程拥有 Back/Continue 时使用 `withLabel`，当周围 UI 同时拥有当前步骤标题和导航、只需要一条裸进度轨道时使用 `hiddenLabel`。默认保留标签和控件，其控件需要 `onStepClick`，每个步骤在任何宽度下都在可访问序列中保留其名称。(#5659)
- Stepper 的 `horizontalOptions.minimumStepWidth` 配置水平 Stepper 折叠时的逐步宽度。数字按像素解释，字符串接受 CSS 长度，例如 `7rem`、`calc(6rem + 8px)` 和自定义属性。浏览器通过一个不可见的测量元素解析字符串单位，解析值的变化会更新紧凑布局。省略该选项保留现有的 112px 阈值。(#5659)
- Stepper：添加 `astryx-step-label` 和 `astryx-step-description` 主题目标。(#5728)
  两个文本部分声明自己的排版和颜色，因此主题无法通过 `step` 目标的继承到达它们。新目标在两种指示器位置都适用，并反映 `progress` 和 `status`。

  `step-label` 还反映 `disabled`，因为标签拥有 Stepper 的禁用文本绘制。`step-description` 不反映。新目标不改变任何默认样式。

- Stepper 会在狭窄容器中自行折叠，而不是让每个消费者手写回退：水平 stepper 测量自身宽度，一旦某一步骤低于 `horizontalOptions.minimumStepWidth`（默认 112px），就将标签降为裸轨道，并在其下使用配置的 `collapsedVariant`。断点跟随步骤数而不是视口。`separated` 和 `on-track` 都让紧凑轨道保持呈现性质；配置了导航且设置了 `onStepClick` 时，导航移到具名的 prev/next 控件。轨道上的指示器保持在轨道上，不会在紧凑标签旁重复活动指示器。整个序列在屏幕阅读器中始终保持完整。(#5659)
  [fix] 步骤标签保持单行并省略，而不是换行并在单词中间断开，因此一行水平步骤保持一个高度，其下的轨道保持笔直。完整标签仍包含在步骤的可访问名称中。

  [fix] 连接线段之间的间隙现在为 `--spacing-1`，与连接线自身的粗细一致，因此轨道在任何主题缩放下都读作一条虚线。

- 添加语义化 Table 行状态，同时恢复自定义标记兼容性。命名的自定义图标保留其已发布的 Icon 颜色映射；原始 CSS 自定义图标现在按当前契约要求使用调用方的绘制。依赖隐式字形的 Canary 用户应从 `color` 切换到 `status`。(#5832)
- TabList：新增 `isFullBleed` prop，使标签栏可以延伸到其容器的行内内容边缘，而无需手写负外边距 CSS (#2622)。与 Divider 的 `isFullBleed` 一样，它用负外边距抵消最近带内边距 Layout 容器的 `--container-padding-inline-*` 自定义属性；内部条带会按出血超出标签停留点自身内边距的量补回内边距，使边缘标签仍与内容缩进对齐。它仅限行内：TabList 拥有行内全出血，容器拥有块末停靠。为此，LayoutHeader 获得按边缘覆盖的 `paddingBlockEnd`，沿用 Section 现有的拼写 —— `paddingBlockEnd={0}` 会将头部的最后一个子元素停靠在其底边，使标签条的下划线在任何头部内边距下都与 `hasDivider` 相接。`detail-page` 模板现在使用这两个 props，将其 ghost 面板切换与容器缩进对齐，并且不再携带任何手写的标签行 CSS。
- 为 TimeInput 添加 `nativePicker`，使粗指针默认使用浏览器/操作系统时间选择器，并提供 `always` 和 `never` 覆盖。秒和自定义增量保留 Astryx 的键入字段。(#5811)

#### 问题修复

- 在自动高度模式下，当内容在其下滚动时，保持 AppShell 分区顶部栏为实心。(#5873)
- 将附加的字段状态背景延伸到其控件的下半部分之后，使圆角和胶囊形输入框无可见间隙地连接，同时控件在视觉上仍位于上方，并在重叠范围内接收指针输入。(#5769)
- BottomSheet 现在在模态和非模态呈现中都保持 iOS Safari 浏览器栏边缘与 sheet 表面一致。(#5373)
- 在交互被阻止时保持加载按钮的 spinner 全对比度，并抑制禁用和加载按钮的按压反馈。(#5627)
- Carousel：在 RTL 下镜像单边渐隐渐变，使遮罩淡化实际隐藏内容的物理边缘（overflowStart/overflowEnd 是逻辑边缘，渐变始终是物理左/右）(#5586)
- ChatComposerInput 不再在点击 composer 内边距并按 ArrowUp 时丢弃待处理草稿。聚焦 contentEditable 会将光标折叠到草稿开头，而这是 ArrowUp 表示 "recall history" 的唯一位置，因此该点击后的第一次 ArrowUp 会替换已键入的内容。Composer 现在在自身聚焦时将光标放在草稿之后 —— 点击文本后的空白意味着 "put me there" —— 因此在存在草稿时 ArrowUp 会移动光标，而在 composer 为空时仍会回忆历史。多行光标导航不变。(#6051)
- ChatComposer：当编辑器获得焦点时，在 composer 主体周围添加仅键盘的焦点环 (#5648)
  该焦点环使用共享主题焦点 token，指针聚焦或内部操作按钮拥有焦点时不会出现。

- Chat/useChatStreamScroll：向上滚动会在两种运动模式下解除自动跟随，且只有读者能解除它。跟随期间，hook 拥有容器的位置：它在滚动元素上禁用 CSS 滚动锚定，因此浏览器自身唯一的移动是调整大小后钳制到底部，任何其他向上移动都被解读为读者操作。嵌套滚动器消耗的滚轮或拖动，或者视口上方块折叠，都不再以任何方式触碰锁；解除锁定时恢复锚定。滚轮和触摸监听器已移除。`jumpToBottom` 还会取消弹簧的待处理帧，因此动画循环不会叠加。(#5662, #5663)
- ChatToolCalls 现在会向辅助技术宣布待处理、运行中、完成和失败状态，包括可展开行和折叠的 tool-call 组。(#5666)
- ChatComposerInput：ArrowUp/Down 只在文本边界处回忆消息历史，因此光标可以在多行草稿的各行之间移动 (#4284)
- CheckIndicator：让 docsite 属性预览以选中状态开始 (#5972)
  为 `checked` playground 默认值播种，使属性标签页预览首次加载时显示可见指示器，而不是空舞台。

- `Collapsible` 的触发器标签现在填满行，而不是紧贴自身内容，因此组合触发器可以在箭头旁的最边缘放置内容。触发器是 `space-between` flex 行，但其标签 span 没有 `flex-grow` —— 因此空闲空间收集在标签和箭头之间，以 `<HStack>` 构建且右侧有元素（日期、计数、状态）的触发器会让该元素停在标签旁并在其后留下间隙，无法到达 `space-between` 所暗示的边缘。标签上的 `flexGrow: 1` 就是全部改动。对于纯文本触发器，什么都不会移动：标签已经贴齐起始边缘，箭头贴齐结束边缘，而增长的盒子是文本未填满的盒子。flex 下限有意保持 `auto`，因此任何标签都不会被挤压得比自身内容更窄并开始与箭头重叠。(#5933)
- DropdownMenuRadioItem：添加 playground 包装器，并为 docsite 预览接通包装器选择状态 (#5917)
  将 DropdownMenuRadioItem 包在 DropdownMenuRadioGroup 包装器中，并保持包装器的选择与项的 value 旋钮独立，因此 aria-checked 在项被激活前保持 false，并在点击时更新。

- 将 DropdownMenu 和子菜单浮出层保持在视口内，并具有安全的行内边距和视口感知的高度限制。只有溢出的菜单才会成为内部滚动容器，而 `menuWidth` 在可用空间内保持其现有的最小宽度行为。(#5395)
  [feat] 为数据驱动的 DropdownMenu 实例添加可选的 `presentation` prop，使产品可以根据自己的响应式输入策略将相同操作呈现为锚定 popover 或模态 bottom sheet。

- FieldLabel：字段描述现在紧贴在标签下方，而不破坏现有的标签布局覆盖。(#5673)
  标签及其描述是一块文本，但 `FieldLabel` 中没有任何东西说明这一点。它返回一个 fragment，使 `<label>` 和描述 `<span>` 成为恰好容纳它们的任意列的裸兄弟节点 —— 因此它们之间的间距由该父级的 `gap` 设置，而这个声明同样分隔标签组和下方控件。没有调用方能在不把控件也拉向描述的情况下闭合这对元素，而每个调用方都选择了自己的值。

  在 Chromium 中测量 `description.top - label.bottom`：

  | | 标签 → 描述 | 描述 → 控件 | | ------------------------- | ------------------- | ----------------------------------- | | `Field`, `TextInput` | 4px → **0px** | 4px → 4px | | `CheckboxInput`, `Switch` | 2px → **0px** | n/a —— 控件位于标签旁 |

  标签和描述现在共享自己的包装器，因此它们之间的间距由它们自己设置，而不是调用方列的副作用。只有这对元素闭合：描述 → 控件的间隙不变，因此字段保持现有节奏。`CheckboxInput` 和 `Switch` 各自携带一个 2px 的标签包装器来在本地完成此工作，共享包装器使其变得多余，因此三个调用方现在一致，而不是各自选择值。

  隐藏的标签组采用 `display: contents`，因此包装器盒子完全离开调用方的布局，sr-only 标签和描述完全像以前一样不在流中 —— 隐藏标签仍不占用空间，也不绘制间隙。

  这是 `FieldLabel` 中的一处更改，而不是约 20 个输入组件中的更改，因为每个输入都通过 `Field` 到达其标签。

- useFocusTrap 只有在焦点确实在其活动期间进入 trap 时才恢复焦点。(#5651)
  `useFocusTrap` 在激活时捕获 `document.activeElement`，并在失活时若焦点否则会丢失到 `<body>` 时恢复焦点。对于有意将 DOM 焦点保留在触发器上的弹窗 —— 以 `role: "none"` 和 `hasAutoFocus: false` 打开的 Typeahead 或 PowerSearch listbox —— trap 从未接收焦点，因此恢复会在外部点击关闭时触发，并重新聚焦锚点输入框。由于输入框当时已经聚焦，再次点击它不会触发 `focus` 事件，`hasEntriesOnFocus` 也无法重新打开菜单 —— 控件一直卡住，直到第二次外部点击。

  恢复 effect 现在通过 `focusin` 监听器跟踪焦点是否在其活动期间进入过 trap 容器。如果焦点从未进入，则完全跳过恢复。确实接收焦点的弹窗 —— Dialog、DropdownMenu、Typeahead 选项点击 —— 不受影响。

- Core：每个文档只跟踪键盘和指针模态一次，而不是从每个消费组件初始化全局监听器。(#5881)
- LayoutHeader：为 docsite 预览添加 playground 包装器和默认子元素 (#5918)
  通过将 LayoutHeader 包在带代表性头部文本的 Layout 脚手架中，防止 docsite 的属性标签页预览渲染空舞台。

- LayoutPanel：为 docsite 预览添加 playground 包装器和默认子元素 (#5919)
  通过将 LayoutPanel 包在带有起始槽代表性面板内容的 Layout 脚手架中，防止 docsite 的属性标签页预览渲染空舞台。

- 当仍在到达的行包含转义竖线时，流式 Markdown 不再变空白。`\|` 是字面文本，不是表格单元格分隔符，因此仅携带转义竖线的行是普通正文，会随流渲染，而不是被当作未完成的表头扣住。真正的部分表格语法仍会被抑制，增量解析仍限制在流尾部。(#6051)
- Popover 层现在将显式宽度和匹配触发器尺寸限制到可用视口，并具有对齐感知的 token 安全区边距，在保持触发器对齐的同时使绘制表面距两个视口边缘至少一个间距 token。长内容在层内滚动，而不是在狭窄视口上强制页面溢出。重复的调整大小和内容变化信号会将溢出测量合并为每动画帧一次。指针激活的 dialog popover 聚焦带标签的 dialog 容器，使第一个操作不会显得预先选中，而键盘激活仍聚焦第一个内容控件。只读内容使用相同的容器目标，而不显示 fallback 关闭按钮，同时保留对 fallback 逃生控件的 Tab 访问。(#5373)
- PowerSearch 日期范围值复用 `DateRangeInput`，使端点选择始终发出有序范围。(#6004)
- useResizable：带显式基准的百分比配置 (AST-010)
  实现已接受的 [AST-010](../docs/specs/AST-010/spec.md) 契约。百分比**配置**像素尺寸；它们永远不会创建第二种响应式尺寸模式。

- ResizeHandle：当光标穿过嵌入式框架时拖动仍能继续。(#5297) 该手柄在 `window` 上监听 `pointermove`/`pointerup`，但没有捕获指针，因此浏览器会对之后每个事件进行命中测试 —— 光标一进入可调整区域内的 `<iframe>`，事件就发往来宾文档。在 Chromium 中测量，光标位于框架上后宿主收到 25 次 pointermove 中的 0 次，面板停止跟踪，`pointerup` 从未被听到：手柄保持待命且设置了 `data-resizing`，body 光标/`user-select` 覆盖持续存在。拖动现在会在 `pointerdown` 时在抓取区域捕获指针，因此整个手势无论下方是什么都会在那里投递，move/up/cancel 处理器也位于该元素而非 `window`（与 Slider 和 BottomSheet 相同）。
- Breadcrumbs 在从右到左布局中镜像其内置斜杠分隔符 (#5365)
  修复 #5364。

- sharedResizeObserver：每个元素独立订阅 (#5817)
  该模块每个元素只保存**一个回调** —— `callbacks.set(element, callback)` 会覆盖。第二个观察同一节点的 hook 会静默替换第一个，任一个调用 `unobserveResize(element)` 都会让另一个失明。

  在一个元素上挂两个 hook 很平常，并不罕见：`TabList` 根、`useOverflow` 容器和 `useTruncation` 目标都是另一个 hook 可能合理观察的节点。

  `observeResize` 现在返回一个只移除自己注册的取消订阅函数，包内每个调用方都使用它。`unobserveResize(element, callback)` 手动完成相同工作；无回调的 `unobserveResize(element)` 仍会丢弃元素上的每个回调，保留给完全拥有其元素的调用方。

  派发会快照回调键，因此回调可以在批次运行期间取消订阅而不会跳过其邻居。

  AST-010 §Implementation-requirements 9 的先决条件，单独保留以便独立审查。无组件行为变化：8534 个 core 测试通过，五个观察器回归测试在旧模块上失败。

- Spinner：狭窄的 flex 宿主不再压缩盒子并裁切圆环 (#5484)
  spinner 的盒子从其不再绘制的 canvas 圆环继承了 `overflow: hidden`。它没有裁切任何东西 —— 绘制的圆内切于盒子，因此无论尺寸和色调如何，隐藏或显示溢出渲染的像素相同 —— 但溢出不为 `visible` 的 flex 项的自动最小尺寸为零。这让盒子没有下限：比 spinner 更窄的 flex 宿主会压缩它，而圆环仍按自身属性要求的尺寸绘制，裁切随后在盒子边缘切掉圆环，悄无声息，因为被切的圆环仍在旋转。

  普通布局就会遇到它。140px 行中标签旁的 `md` spinner 在 20px 圆环周围渲染出 16px 盒子；旁边是 `flex: 1 0 100px` 兄弟节点的 `lg` spinner 失去一半圆环。裁切已移除，盒子为 `flex-shrink: 0`，因此盒子和圆环保持同一测量，放不下的 spinner 会可见地溢出其宿主。宿主原本已适配的 spinner 不会有任何移动。

- Spinner：绘制的框架跟随主题化的 `--spinner-diameter`，因此主题化圆环不再被裁切或偏心。(#5214)

  `--spinner-diameter` 和 `--spinner-stroke-width` 在 CSS 中设置圆环，圆环所在的盒子由同样两个变量组合 —— 但 `<svg>` 在 JS 中按尺寸自身的常量设置大小和 `viewBox`。因此主题化直径会留下框架：svg 保持默认值，而盒子围绕它缩小，溢出的网格项对齐到起点而非中心。在 Chromium 中跨四个尺寸测量，主题化圆环渲染为偏心 1.5-3.3px，其远端边缘被裁掉。

  svg 现在在 CSS 中按 `--_spinner-box-size` 设置尺寸 —— 与 span 尺寸来源相同的组合变量 —— 且没有 `viewBox`，因此一个用户单位就是一个像素，框架随盒子移动。（不是百分比：span 是一个网格，其区域在两个轴上并不总是确定的，而 SVG 上未解析的百分比高度会回退到替换元素的默认值 150px。）px 的 `width`/`height` 属性仍作为无样式表时的回退，正如 `r` 和 `stroke-width` 一样。两个圆都以 `cx`/`cy="50%"` 居中，弧线的十二点偏移是关于形状自身盒子的 CSS 旋转，而不是关于用户单位中心的 SVG 变换。

  任何尺寸下的默认渲染都不变 —— 相同的盒子、圆环、描边和扫掠，已针对 `main` 的构建验证。变化的是文档化声明 "the rendered box … follows automatically" 现在为真。

- Table 的可排序表头按钮现在跟随其列的 `align`，因此 `align: 'end'` 或 `align: 'center'` 的列不再出现紧贴起始的表头标签位于右对齐数字上方。排序将表头包裹在全宽 flex 按钮中，`align` 在单元格上设置的 `textAlign` 无法定位该按钮；对齐现在通过流相对的 `justify-content` 传递到按钮的主轴，因此在 RTL 下仍会镜像。(#5928)
- 将表格行结果以及完成或失败的 tool call 通过主题的语义图标注册表路由。(#5671)
- `themingTargets.test.ts` 现在会发现 `src` 下任意深度的组件源码，而不仅是顶层目录。(#5784) 嵌套一层的源码 —— `Table/plugins/<name>/` —— 此前被静默豁免于该守卫，而这正是 #3741 提交要防止的漂移。此前没有失败（本版本前没有嵌套源码渲染 `themeProps()` 类），因此这填补了漏洞而非修复线上故障：守卫从 294 个断言增加到 302 个。
- Timestamp 的相对和紧凑相对标签现在跟随活动 provider 的语言区域，包括语言区域特定的复数和词序。(#5859)
- Toast：卡片的阴影不再被裁切掉。(#5547)
  每个 toast 的网格行在其整个生命周期内都使用 `overflow: hidden`。该裁切在行打开和关闭时是承重的 —— 它让 toast 看起来折叠进堆栈 —— 但静止时它紧贴卡片的边框盒，四周零余量，并切掉卡片投射的每个阴影。Astryx 自己的 `--shadow-med` 被声明却不可见：在白色页面上，标准 toast 下方每个采样像素都是纯白。

  该行现在在进入和退出期间保持其跨引擎的 `overflow: hidden` 边界，仅在打开过渡稳定后释放为 `overflow: visible`。关闭会同步恢复裁切。包装器保持其常规指针边界，因此在 toast 仍可见时第二次点击会被 toast 吸收，而不是穿透到下方被遮挡的控件。

  这避免了 `overflow-clip-margin`（WebKit 26.5 不支持），同时保留退出时与修复前完全相同的绘制边界。

  稳定状态保存在挂载的行上，而不是视口上的 toast id 集合中，因此它不会比所描述的行存活更久。行离开 DOM 的路径不止关闭 —— `maxVisible` 会在新 toast 到达时驱逐最旧的，`uniqueID` 覆盖会将新条目换入被替换 toast 的位置 —— 这两条路径都不会运行关闭路径上的任何内容。因此，被驱逐的 toast 在堆栈排空后重新出现时，会以裁切状态挂载并运行自己的进入过渡，而不是在一行仍在打开时释放裁切。

  再一个生命周期防护：只读取行自身的过渡，因为 `grid-template-rows` 并非包装器私有，`transitionend` 会从任何动画化自身网格的后代冒泡。将后代的 event 读作行自身的事件会在行完成打开之前释放裁切，并在退出期间使 toast 在折叠中途卸载。

  在白色页面上已稳定的标准 toast 下方，从卡片底部边框盒垂直采样：此前每个偏移都是 `255,255,255`；之后，阴影在 +0px 绘制 `223` 并渐变为 `237 → 243 → 247 → 250 → 253 → 254`，在 +12px 处再次达到白色。退出期间行会再次裁切，因此缩小行之外的任何内容既不绘制也不可命中测试 —— 而包装器本身保持其一直拥有的常规指针边界，并仍会吸收瞄准仍在屏幕上的 toast 的点击。

- 当第二次触摸开始时重置 Toast 滑动状态，以保持原生捏合和双指手势可用，并在成功滑动关闭前清除临时拖动样式。(#5676)
- `ToastViewport` 重置 UA popover 的 `width`，使位于末端的 toast 再次落在末端边缘。(#5822) 视口通过 `popover="manual"` 到达顶层，UA 样式表为每个 popover 提供 `width: fit-content`。自放置重构以来，视口通过跨越行内轴并在自身内对齐来定位，而收缩包裹的盒子无法跨越 —— 两个 inset 边缘无法同时满足，因此盒子针对起始边缘解析，`align-items: flex-end` 会将 toast 对齐到位于左侧的盒子的右侧。在 Chromium 中以 1200px 测量：438px 视口位于 x=0，默认 `bottomEnd` toast 位于 x=19 而不是 x=781。重置块已经中和了 `inset`、`margin`、`border` 和 `background`；`width` 应与它们归在一起。
- Tokenizer：在 docsite 属性预览中渲染并交互 (#5982)
  为必需的 `value` 数组播种 playground 默认值，使属性标签页预览首次加载时显示带 token 的带标签字段，而不是缺少必需 props 的占位符，并将预览的 `onChange` 桥接回受控 `value`，使移除 token 时更新字段。

- TreeList：尊重消费者 `onKeyDown` 的 `preventDefault` 取消，用于 APG 树键盘导航 (#5606)
  `TreeList` 此前在内部 `<ul role="tree">` 上处理内置 APG 键盘导航，早于根 `<div>` 上的消费者 `onKeyDown` 运行，阻止消费者 `event.preventDefault()` 抑制内置方向键导航。

  根 `onKeyDown` 现在先在根容器上调用消费者 `onKeyDown`，并在处理源自 `<ul role="tree">` 内的事件之前检查 `event.defaultPrevented`。在 `onKeyDown` 中调用 `event.preventDefault()` 现在能成功取消内置导航，保持焦点和 roving tabindex 不变，同时保留根处理器目标契约。

- Typeahead：选中值后字段保持宽度，且值不进入末端控件 (#5560)
  这是输入字段系列契约（`docs/families/input-fields.md`）中同一承诺的两半：**FR1**，字段的可用宽度不会因其值改变而改变；**FR2**，可见的末端功能不会让字段内容绘制在其下方。

  **FR1 —— 输入框保持其位置。** 系列中的其他每个字段都免费获得稳定宽度：`<input>` 保持在流中，字段宽度等于 input 自身的固有宽度。Typeahead 在显示 token 时将 input 移出流并归零其宽度，因此字段在测量 token。在任何 shrink-to-fit 父级中，它会突然变为值的长度。块级父级掩盖了它，因为无论内容如何它们都会填满容器，这就是没有故事捕获它的原因。Input 现在在行中保持其位置和自身宽度 —— 只是被设为不可见且惰性 —— token 绘制在该空间之上而不是旁边。若在流中，token 会添加自身宽度，这是从另一个方向的相同值依赖尺寸：长值会让字段增长。

  **FR2 —— 值受内容通道约束。** Input 和 token 共享一个内容通道：一个普通 flex 项，`flex: 1` 且 `min-width: 0`，正好结束在末端通道开始处。这是 TextInput 自己的安排 —— 通道占据空闲空间，使末端控件位于角落，并在字段狭窄时让出全部空间，因此狭窄字段不会溢出。Token 锚定在通道的两个行内边缘，因此长值在通道边缘省略，而不是到达控件。若像本更改的第一版那样针对整个字段定位，它根本不知道控件从哪里开始。

  在 Chromium 中测量。宽度是字段的边框盒，字段位于 `max-content` 父级中，`Field.width` 其他情况未设置：

  | | 空 | 短值 | 长值 | | --------------------------------- | ----- | ----------- | ------------ | | TextInput（系列基线） | 199px | 227px | 227px | | Typeahead 之前 | 199px | **54.7px** | **224.09px** | | Typeahead 之后 | 199px | 223px | 223px | | `InputGroup` 中的 Typeahead，之前 | 397px | **252.7px** | **422.09px** | | `InputGroup` 中的 Typeahead，之后 | 397px | 421px | 421px |

  空列和有值列之间的 24px 是清除按钮进入行 —— 对任何清除按钮有条件的字段都很普通，它不随值变化，而 TextInput 的是 28px。

  重叠是值尾边缘越过清除按钮前边缘的部分；escape 是值越过字段边框的距离。中间列是本更改自己的第一版，它修复了宽度但让重叠更糟：

  | 字段，长值 | 主轴重叠 | 第一版 | 现在 | | ----------------- | --------------- | -------------- | --------------- | | shrink-to-fit | 12px | 28.09px | 无，7px 清除 | | 在 `InputGroup` 中 | 12px | 33px | 无，7px 清除 | | 220px | 12px | 31.09px | 无，7px 清除 | | 180px | 12px | 33px | 无，7px 清除 | | 140px | 12px | 33px | 无，7px 清除 | | escape, 140–220px | 无 | 最多 4px | 无 |

  没有新 API，也没有常量。早先的修订用 `--typeahead-min-width` 公开变量为字段设下限，默认 200px，审查正确地拒绝了它：它是文档化 `Field.width` prop 之外的第二个尺寸契约，是手推的（空字段测量为 199，因此下限超出 1），`InputGroup` 会取消它，而且它无法帮助 `Tokenizer`。这里没有声明任何宽度；通道的 `min-width: 0` 与下限相反。

  `Tokenizer` **不**在此修复。它共享系列承诺并打破了它 —— 在同一探测中从 199px 空变为一个 token 的 114.7px —— 但机制不同：它的 token 在流中并换行，其 input 有意在它们之后成为 40px 的延续通道，因此换行多值字段的宽度应该是多少是一个设计问题，而不是这个 bug。其数字在本更改前后完全相同。

- Typeahead、Tokenizer：忙碌指示器是字段末端通道中的 Spinner，且 input 的文本不会位于其下方 (#5555)
  一个块中有三个缺陷。搜索绘制的指示器是 `<Icon icon="clock">` —— 一个静态字形，而该系列中其他每个输入都用 `Spinner` 绘制忙碌状态，且 `clock` 在其他地方表示_时间_。它是行内末端的流内项，而每个字段都独立在那里放置清除按钮，因此两者叠在一起：Typeahead 中重叠 17×20px，Tokenizer 中 19×20px。重叠是视觉上的，不是功能性的 —— 清除按钮是定位的，因此绘制在流内指示器之上，并在整个覆盖带内保持可点击。而且 combobox 从未携带 `aria-busy`，不像每个同级输入。

  基础引擎现在向字段报告忙碌状态，字段在其已拥有的清除按钮和末端内容旁的唯一行内末端通道中绘制它，并在 input 上设置 `aria-busy`。直接使用 `BaseTypeahead` 的调用方不受影响：它仍渲染自己可见、具名的 "Loading" 状态，现在用 Spinner 而不是时钟。

  Typeahead 将两个控件**放入流中**，作为 input 的普通 flex 兄弟节点，就像 TextInput 对其自己的 spinner 和清除按钮所做的那样 —— 流内盒子占用空间，因此 input 无法跑到其下方，也无需测量。为此需要从其包装器中去掉 `flex-wrap: wrap`，共享字段基类不设置它，TextInput 也不使用：该字段最多持有一个 token，因此没有第二行可换，而换行正是让流内通道不可能的原因，因为 flex 会将项移到新行而不是收缩它。在 Chromium 中测量：恢复 `flex-wrap` 且 token 太宽无法共享行时，末端控件掉到第二行，280px 字段的高度从 32px 增长到 46px。不换行时，长值在 token 中省略。

  Tokenizer 自身既有的重叠情况也随之关闭：在 280px 且有一个 token、没有搜索运行时，其清除按钮覆盖了 input 内容盒的 20px，现在不覆盖任何部分。

  Tokenizer 保留测量通道，因为它无法使用流内形状：其通道固定在字段第一行，而 token 在其下换行，因此必须脱离流，而脱离流的盒子不保留任何空间。其宽度用 `offsetWidth` 而不是 `getBoundingClientRect()` 测量。rect 位于视口空间 —— 它携带元素上方的每个 CSS transform —— 而它提供的 padding 在局部空间，混合两者在任何 transform 下都会失效：在 Chromium 中测量，`scale(.5)` 保留所需空间的一半，使查询回到控件下方 22.83px，`scale(2)` 让光标处于 202.69px 的间隙中。`offsetWidth` 是未变换的边框盒宽度，在每个缩放下报告相同数字。

  测量以写入字段包装器的自定义属性到达 CSS，从不是 React state，因此增长或收缩的通道无需重新渲染字段即可重绘。放在 state 中每次通道尺寸变化都会付出第二次提交 —— spinner 到达时一次，离开时一次 —— 这会让字段在一次搜索期间的提交翻倍，而该值没有 JavaScript 读取。观察也是共享的，通过 `useTruncation` 使用的同一个 `observeResize` 单例，因此一页字段每帧只需一个回调而不是每个字段一个观察器。该属性是 `--_tokenizer-end-lane-width`：私有且以组件命名，像包内其他每个运行时布局变量一样，绝不是主题会写入的东西。

  忙碌指示器现在出现在每个字段的文档化 anatomy 中，将其主题化委托给 `component:Spinner`，而不是获得自己的目标 —— 这是 `TextArea`、`CheckboxList` 和 `CommandPalette` 已对同一部分采用的处置方式。

#### 性能

- 保持 Tooltip refs 在重渲染之间稳定 (#5951)
- Markdown 流式处理将四个增量解析操作限制在可变尾部：拆分、围栏/边界检测、链接定义收集和块重新解析不再随已定稿文档增长。解析器契约不变：每次调用返回新的、永不改变的快照，替换已定稿文本仍会重新解析文档。两个成本有意在每次调用中仍与整个输入成比例，因为契约要求它们 —— 检测文档被替换的已定稿前缀比较，以及每个返回快照背后的逐块指针复制。(#5515)
- Typeahead：同步 bootstrap 源跳过加载周期 (#5955)
  `BaseTypeahead` 现在立即应用 `SearchSource.bootstrap()` 返回的数组，而不是进入和离开异步加载状态。空的同步 bootstrap 变成渲染无操作，而同步条目仍正常打开。从进行中的搜索切换到同步 bootstrap 还会清除被取代搜索的加载状态。Promise 支持的 bootstrap 源保留现有加载行为。

#### 文档

- Grid、Stack、HStack、VStack、GridSpan 和 StackItem：通过 playground 默认值（对于两个子组件，还有真实父包装器）播种示例内容，使 docsite 属性标签页预览渲染可工作的组件而不是空舞台。(#5892, #5893, #5894, #5898, #5899, #5900)
- 图标指南中的命名空间图标理由和添加语义图标简介，以及 `SideNavItem` 的 `actions` prop 描述，现在使用逗号和冒号代替正文破折号。含义不变。(#5647)
- Popover 呈现最佳实践和 Banner 可折叠最佳实践现在使用直撇号而不是弯撇号，使字符串与其余文档文案一致。含义不变。(#5772)
- Spinner 的 CSS 变量和尺寸描述，以及 `useTableGroupedRows` 的描述，现在使用冒号和分号代替正文破折号。含义不变。(#5597)
- Stepper 进度条 anatomy 描述现在将其嵌套旁白放在圆括号中而不是成对破折号，使关于多段 span 的句子在 CLI 和文档站点中读起来清晰。含义不变。(#5691)

#### 其他变更

- Core 的 postinstall 不再手工镜像设置契约。`packages/core/scripts/agent-doc-state.mjs` 现在逐字节生成自 CLI 的无依赖叶子文件 `packages/cli/foundation/agent-docs/agent-doc-state.mjs`，而 `pnpm check:setup-contract` —— 接入 `check:repo` —— 在两者不同时使构建失败。(#4162)
  先前的守卫比较两个手工编辑的常量列表。这能捕获新的 agent-doc 路径或新标记，仅此而已：谓词本身以及两个 postinstall 脚本中重复的 `shouldNudge` 决策矩阵仍可能漂移，使 layer 1 和 layer 2 对 "这个项目设置好了吗？" 产生分歧，而测试仍然通过。`shouldNudge` 和提示字符串也移入契约，因此全部四件事 —— 路径、标记、谓词、决策 —— 现在有一个定义和一个编辑位置。

  行为不变，且经过验证而非假设：提示文本逐字节相同，旧的 `<!-- XDS:START -->` 块仍算作已设置，所有六个 agent-doc 位置仍被检测到，两个脚本在包括失败在内的每条路径上仍以 0 退出。Core 通过动态导入加载其副本，因此打包错误会退化为 "no nudge"，而不是从模块求值中抛出并使消费者的安装失败。`check:setup-contract` 还会在 core 停止在 `files` 中列出生成文件时失败，因此它从一开始就不会丢失。

- **`minSize` / `maxSize`** 与 `defaultSize` 归入同一词汇：非负有限数字、精确的 `Npx`、0–100 的精确 `N%`、Table 现有的 `pixel(value)`，或 `percent(value, {min: pixel(value)})` / `percent(value, {max: pixel(value)})` 表示带正好一个像素下限或上限的百分比。`percent()` 需要其选项；`'40%'` 仍是唯一无界百分比拼写。`minSizePx`/`maxSizePx` 保留为弃用别名，各自与替换项构成精确的互斥 TypeScript 联合；如果未类型化代码同时提供两者，统一 prop 获胜，开发环境会指出被忽略的别名。
- **`containerRef`**（调用方拥有）只改变百分比所依据的份额：该元素在活动轴上的**内容盒**尺寸，`direction` 选择行内或块。省略时，百分比保留已发布的一次性 `window.innerWidth` 解析及其 1200px 服务端回退。
- **百分比默认值解析一次**为像素选择，其可选结构化下限或上限正好应用一次。百分比**边界**随其基准重新解析，应用那一个像素边界，并钳制选择 —— 它们从不重新缩放它。基准变化不是用户交互：它不触发 `onSizeChange`，只持久化解析后的像素。
- **其他一切都保持像素**，与发布版完全一致：指针、键盘、吸附、折叠/展开、持久化、回调和 `resize(number)`。`resize('50%')` 仍是类型错误，而 `resize(NaN)`、`resize(Infinity)` 或负值现在会警告并保留最后一个合法尺寸，而不是污染状态。
- **无效配置**以确定性方式修复 —— 默认值 250px、最小值 50px、最大值无界 —— 在开发和生产中完全相同，只在开发环境警告。显式 `maxSize: Infinity` 和 `maxSizePx: Infinity` 保留已发布的无界行为。弃用别名对未类型化调用方保留其已发布的精确原子字符串行为。反转的一对会警告，最大值获胜，保留已发布的钳制顺序。

  结构化 API 沿用 Table 的现有形状而不是解析 CSS 表达式：`Resizable/utils` 是服务器安全的子路径，重新导出与 `Table/utils` 完全相同的 `pixel()` 绑定和 `PixelWidth` 类型，以及 Resizable 的 `percent()` 和类型。`pixel(value)` 是规范的、结构化的静态尺寸；原始数字和精确 `Npx` 仍兼容。`proportional()` 仍仅限 Table，因为它描述兄弟权重，而不是一个测量基准的字面百分比。CSS `min()` / `max()` 字符串有意不支持。

  这修复的缺陷：百分比上限此前只能用 CSS 书写，而 CSS 会停止绘制但不会停止状态。`ResizeHandle` 将 hook 的尺寸发布为 `aria-valuenow`，因此分隔符宣布的面板宽度与实际不符 —— 测量为 **899.5 对 434px 面板**。边界现在钳制状态，因此绘制、持久化和 ARIA 描述同一几何。

  `ResizeHandle` 还会在其 `direction` 与区域不一致时在开发环境警告，此前会静默失败。现有垂直面板必须同时向 `useResizable` 传递 `direction: 'vertical'`，并向手柄传递 `direction="vertical"`。

  容器基准跟随 ref，而不是它最初指向的元素：替换同一 `containerRef` 背后的元素会针对替换元素重新解析，而留下的元素不再被观察。尚未布局的容器 —— 未挂载、`display:none`、已分离 —— 测量为 0，这不是测量：百分比保持文档化的临时 1200px 基准直到真实值出现，且不会向其写入 `autoSaveId` 存储。一旦第一个真实基准解析，默认值会作为像素选择提交并包含初始钳制；因此 321px 的默认值被钳制到 200px 后，容器后来增长时仍保持 200px，而不是恢复原始默认值。

  被取消而非完成的手势 —— `pointercancel`、丢失指针捕获、拖动中途卸载手柄 —— 通过 `ResizableProps` 上新增的可选 `_onResizeCancel` 释放它冻结的基准。它不是调整大小结束（根据 #5297，取消的拖动有意不发出信号），但它是手势的结束。`_onResizeCancel` 和 `_direction` 都是可选的：`ResizableProps` 已导出，因此满足已发布类型的对象字面量仍可编译。

  根据规范，不在范围内：SideNav 简化的 `defaultWidth`/`minWidth`/`maxWidth` 仍仅限像素。

  即使提供了 `containerRef`，仅像素配置仍保持其单次渲染过程。任何地方都没有百分比时，没有基准可观察，也没有 ref 身份可跟随，因此像素选择在挂载时完成；只有依赖基准且提供容器的配置才会推迟到该测量存在。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @ernestt
- @freddymeta
- @Geervan
- @HelloOjasMutreja
- @imdreamrunner
- @jiunshinn
- @josephfarina
- @Kyujenius
- @Lee-Dongwook
- @ManoharPaturi
- @mattandryc
- @nynexman4464
- @rubyycheung
- @trakshan-mishra
- @yyq1025

---

# 0.5.2

#### 问题修复

- 将 Data Input 组件类别重命名为 Form Controls (#5686)

#### 性能

- 通过预构建语言区域映射改进频繁的翻译查找 (#4696)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @ngolin
- @rubyycheung

---

# 0.5.1

#### 新功能

- 为 Avatar 添加 shape prop（'circle' | 'rounded' | 'square'），用于非圆形形态 (#4205) (#4327)
- Card：通过 `CardVariantMap` 接口使 `variant` 轴可被主题扩展 (#5551)
  `CardVariant` 原本是手写联合，背后是封闭的样式记录，因此主题无法添加卡片变体：未知值既不能通过类型检查也不会渲染。现在它是 `keyof CardVariantMap`，一个从 `@astryxdesign/core/Card` 导出的接口，主题构建可以增强它 —— 与 Button、Badge、Section 和其他可扩展轴已经发布的形状相同。

  `keyof CardVariantMap` 正好解析为 `CardVariant` 原有的十三个值，因此现有调用点不变。主题添加的变体会落入基础样式，并由主题自己的 `card['variant:<name>']` 规则绘制。

  在 SelectableCard 上，该变体的选择环使用 `--selectable-card-ring-color` 绘制，默认使用强调色。组件无法选择的 token 无法保证与组件无法知道的填充形成对比，因此添加变体的主题规则会在其 `backgroundColor` 的同一条规则中设置环颜色。

- CheckboxInput 和 Switch 现在将自己的标签命名为主题目标：`astryx-checkbox-label` 和 `astryx-switch-label`，与每个标签已经携带的 `astryx-field-label` 并列。此前主题只能到达一个 `astryx-field-label` 目标，因此为复选框标签（与其控件同行）设置样式也意味着为每个表单字段输入框上方的标签设置样式。控件向下传递目标，因此名称说明事物是什么，而不是编码其如何排列，且任何东西都无法不真实地设置它。(#5183)
- Checkbox 指示器现在为其两个标记暴露稳定的主题目标 —— `astryx-checkbox-indicator-check`（勾选标记）和 `astryx-checkbox-indicator-dash`（不确定条）—— 与现有的 `astryx-radio-indicator-dot` 相呼应。两者都反映 `size`。重新设置标记本身的主题（描边粗细、颜色、横条比例）此前必须通过 `.astryx-checkbox-indicator > svg` 和 `> span` 到达它，这些是元素和顺序选择器，任何重构都会静默失效。纯新增；无视觉变化。(#5426)
- ComplexSelector：`onOpenChange` 报告弹窗的每次打开和关闭 —— 触发器、键盘、轻量关闭、Escape、内容调用 `close()` 或命令式句柄。与现有的 `handleRef` 配合，消费者可以驱动和观察该表面，而无需读取 shell 的 DOM。(#5211)
- DateInput 在触摸时使用平台日期选择器，`nativePicker` 用于选择原生或 Astryx 表面；聚焦的桌面式原生字段会显示其可编辑段，Astryx 触摸 sheet 在其头部保留 Reset、页脚仅保留 Save，两个关闭表面都匹配标准输入高度 (#5261, #5456, #5502, #5534)
  `nativePicker="touch"` 是默认值，`"always"` 在支持的任何地方使用 `<input type="date">`，`"never"` 保留 Astryx 的 sheet 或 popover。格式化在失焦时仍会恢复，`min`/`max` 继续验证原生选择。

- 为粗指针 DateTimeInput 添加 bottom-sheet 选择器，带有独立的关闭 Date/Time 段、直接打开分区以及两步 Save date → Save 流程。(#5582)
- Icon API 和主题接受命名空间扩展键，NumberInput 步进器使用 `numberInput:stepperDown` 而不扩大必需的 `IconRegistry` 键 (#5466)
  `<Icon icon>`、`useIcon` 和 `defineTheme({icons})` 接受诸如 `numberInput:stepperDown` 和 `richtext:bold` 的键；拼错的内置名称仍是类型错误。NumberInput 保留紧凑居中的 Core 回退，而主题可以独立于共享的 `chevronDown` 语义覆盖其步进器。

- `OverflowList` 现在可以通过 `onOverflowChange(overflowItems)` 将其折叠项交给你已渲染的菜单。`overflowRenderer` 只描述列表自己挂载的指示器，且仅在项溢出时 —— 因此已经带有常驻 "…" 菜单的行无法将折叠项收集到其中，添加指示器又会让用户看到并排两个菜单。从外部观察也不可行：放在 `overflowRenderer` 内的报告组件会挂载两次（隐藏的测量副本总是接收_每一项_，因此无法告诉你实际折叠了什么），而且行重新变宽且集合为空时不会触发任何东西。新回调在折叠集合的成员或顺序变化时报告，并将锚点完全留给调用方。它在测量折叠了某些内容后触发一次，在行重新变宽且所有内容都放下后再次以空数组触发，而在没有溢出时保持沉默 —— 包括挂载时，因此从一开始就放下的列表永远不会调用它。它从不报告测量前状态，因为无论行是否实际溢出，该状态都是空集；将折叠集合保存在初始化为 `[]` 的 state 中，它在任何时刻都正确。报告在测量后的 layout effect 中运行，因此菜单与折叠在同一帧更新。测量容器现在会观察尺寸变化，因此子元素尺寸变化会刷新每个 OverflowList 和直接 `useOverflow` 消费者，即使可用容器宽度不变。键控的成员和顺序变化会在 `onOverflowChange` 报告之前重新测量。稳定的 React key 区分相同数量的成员和顺序变化，而无关的重渲染和回调身份变化不会重新触发它。两个 API 可以一起使用；仅使用 `onOverflowChange` 不会给行增加任何东西。(#5199)
- Selector 和 MultiSelector：通过 `emptyText` 和 `emptySearchText` 配置面板空状态，既向屏幕阅读器宣布也显示；没有选项的面板现在会说明这一点，而不是渲染空白，并且在 `isLoading` 时保持沉默 (#5462)
- SideNavItem：新增 `actions` 槽，用于行级次要控件（图标按钮、菜单）。内容作为主 link/button 的兄弟节点渲染 —— 在展开/折叠切换之后，在 DOM 和焦点顺序中位于嵌套子项之前 —— 因此交互控件绝不会嵌套在主元素内，每个行控件都能在焦点进入子树之前到达。被动内容（徽章、计数）留在 `endContent` 中；`actions` 在轨道折叠时隐藏，并在禁用项上保持可交互，因为每个提供的控件拥有自己的禁用状态。actions 行将其焦点环绘制为主 link 或 button 的整行胶囊，而展开/折叠切换和每个提供的操作保留自己的焦点环 —— 为此添加 `focusOutlineProps.focusWithinFirstChild` 和 `focusOutlineProps.suppressed`。提供的控件通过 `SizeContext` 继承行的控件尺寸，就像 `SideNav` 已经将一个尺寸级联到其页脚图标一样，因此未设置尺寸的图标按钮输出与内置切换相同的盒子；显式 `size` 仍然优先。(#4988) (#5005)
- Spinner：圆环的几何形状及其两种颜色现在可主题化。`size` 和 `shade` props 保留其固定枚举；每个命名值_解析为_什么现在由主题通过 `spinner` 目标上的四个公开自定义属性设置 —— `--spinner-diameter` 和 `--spinner-stroke-width` 在尺寸变体下，`--spinner-color` 和 `--spinner-track-color` 在色调变体下（或全部同时在基础目标上）：(#5214)

  ```ts
  spinner: {
    'size:xl': {'--spinner-diameter': '2.5rem', '--spinner-stroke-width': '0.375rem'},
    'shade:subtle': {'--spinner-track-color': 'transparent'},
  }
  ```

  任何长度和任何颜色表示法都可用 —— `rem`、`em` 和 `calc()` 由级联解析为绘制圆环的半径和描边，颜色接受 `var()`、`color-mix()` 和 `currentColor`。描边宽度 `0` 会被尊重为零宽描边 —— 它不绘制任何东西，而不会被解读为 "未设置" 并静默绘制默认值。绘制的圆环及其周围的盒子来自相同的值，因此它们保持同步，包括媒体查询或根字号在挂载后改变它们时。

  圆环解析到的两个私有变量在模块导入时注册为 `<length>`，而不是在 spinner 首次挂载时。注册带 `initial-value` 的继承属性会使整个文档的样式失效，而 spinner 是加载指示器 —— 它到达一个已经渲染的页面，因此在那里付出代价就是在整棵树上付出：在 11k 元素的页面上，同一挂载耗时 29 ms，而 12 ms。从不导入 `Spinner` 的构建会丢弃该模块及其注册。

  除非主题覆盖某些内容，否则每个尺寸和色调的输出都不变，盒子周围的所有优先级也不变：它仍由写在调用方 `style` 之后的内联 `width`/`height` 设置尺寸，与一贯做法一致，只是用组合值代替数字。

- TextArea：包装器内的两个绘制元素现在携带稳定的主题目标 —— `astryx-text-area-control`（`<textarea>` 本身）和 `astryx-text-area-counter`（字符计数器）。此前只有包装器可主题化，因此重新设置控件自身排版、占位符或调整大小功能，或计数器辅助文本的主题，必须使用 `.astryx-text-area > textarea` 之类的结构选择器。纯新增：现有类、data 属性或样式不变。(#5418)
  两者都不携带 `size` 轴。`size` 只移动控件的块内边距（`sm` 和 `md` 为空；`lg` 设置 `paddingBlock`），而这是该组件的 `padding` 转换接管的轴 —— 因此这里的轴会是表达同一件事的第二种方式，而且是转换落地后就不再成立的那一种。

  起始图标和末端槽覆盖层有意不作为目标。它们不绘制任何东西 —— 每个都是 `position: absolute; pointer-events: none; display: flex` —— 并且它们基于包装器的 `--_textarea-inline-padding` 放置，因此移动控件缩进的主题需要它们随之移动，而不是逐个重新放置。该缩进属于组件的 `padding` 转换，另行跟踪。

- Toast：`showToast` 选项上的 `renderContent` 用你自己的布局替换该 toast 卡片的内容。(#5428)

  ```tsx
  showToast({
    body: 'Your changes have been saved.',
    renderContent: ({body, endContent, dismiss}) => (
      <MyRow>
        <MyTitle>{body}</MyTitle>
        {endContent}
        <Button label="Dismiss notification" onClick={dismiss} />
      </MyRow>
    ),
  });
  ```

  Astryx 保留卡片、其 `astryx-toast` 主题目标、live-region 角色和自动隐藏行为。渲染器接收消息、`endContent`、解析后的 toast 设置和 `dismiss` 回调。

  自定义内容拥有其完整布局和其中的每个控件。从应关闭 toast 的控件调用 `dismiss`；它可以传递给嵌套组件。Astryx 不会注册注入的组件，也不会在自定义布局后面添加 fallback 关闭。

  该 API 是逐 toast 的。应用可以通过包装 `useToast()` 并在每次调用时传递 `renderContent` 来共享一个布局，而其他 toast 继续使用普通 Astryx 布局及其已翻译、可主题化的关闭 `Button`。

  新的导出类型：`ToastContentRenderProps`、`ToastContentRenderFn`。

- Toast 现在支持朝其配置的视口边缘进行触摸和笔滑动关闭。垂直轴匹配每个 Toast 的顶部/底部放置和进入/退出运动，因此关闭遵循相同的空间模型，而不是引入单独的侧边退出。原生触摸滚动会保留，直到移动被解析为关闭方向；交互控件不会启动滑动；滑动继续报告现有的手动关闭原因。笔作为直接接触输入包含在内；鼠标拖动被排除，因为桌面用户已经有可见的关闭控件，且拖动可能与文本选择冲突。(#5375)
- Typeahead + Tokenizer：minQueryLength 在查询足够长之前保持搜索和菜单 (#5385)
  还修复了早于该 prop 的滞留加载状态：放弃进行中的搜索 —— 通过清空字段、通过低于阈值，或在下一个搜索仍在进行时选择项目 —— 会增加搜索代次，使该搜索自己的 `finally` 拒绝清除加载标志。字段此前一直向辅助技术报告 "Loading"，直到另一个搜索稳定。

  `hasCreate` 不受它限制。"Create ..." 条目由键入文本派生而不是为其获取，因此它现在通过单独的内部路径到达菜单，并且无论阈值如何都会提供 —— 阈值的存在是为了避免获取范围过宽而不值得，而创建不需要获取。使用 `minQueryLength={3}` 时，键入 `QA` 会提供 `Create "QA"`，Enter 提交它，而搜索源仍从未被调用。

  一个值得说明的后果：Create 条目在结果被裁剪到 `maxMenuItems` 之后追加，因此使用 `hasCreate` 时，满菜单现在显示比上限多一个选项 —— 11 个而不是以前的 10 个。上限限制菜单显示多少_结果_；创建是单独的能力，不会被它们挤掉。

#### 问题修复

- AlertDialog 让 Dialog 保留并钳制其首选宽度，在需要时允许整个操作移到另一行，并在 640px 及以下堆叠全宽破坏性操作和 Cancel 操作，同时无论指针类型如何都保留标准单行 Button 尺寸和标签。(#5343)
- Badge：长标签不再逃出容器。(#5558)
  `Badge` 设置了 `white-space: nowrap`，却没有任何东西来裁切它 —— 这是既不换行也不截断的唯一组合。比可用空间更宽的标签会渲染到徽章容器的_外部_，并覆盖旁边的任何东西。

  ```tsx
  <div style={{width: 100}}>
    <Badge variant="pink" label="Awaiting security review" />
  </div>
  ```

  在 Chromium 中测量：该徽章在 100px 列中宽 **163px**，溢出 63px；在固定布局表格单元格中，它绘制到下一个单元格文本上 64px。徽章现在钳制到给定宽度并用省略号截断标签。

  已经放得下的徽章不受影响 —— 相同宽度、相同高度、相同 DOM。测量前后，有足够空间的徽章两种情况都是 53px；只有已经溢出的情况会改变。`Badge` 不使用 hook，保持可服务端渲染。

  省略号位于内部标签 span 而不是徽章本身，因为 `text-overflow` 需要块容器，而将根从 `inline-flex` 移出以获得块容器会让图标失去居中。有图标时，图标保持其位置，标签让出空间。

  为了不让被裁切的尾部直接丢失，字符串或数字标签还会携带在徽章的 `title` 中 —— 与 `BaseTable` 已用于被截断表头单元格的形状相同。这不需要测量，也不需要 hook，因此 `Badge` 在服务端仍渲染相同，并可在服务端组件中使用。富 `label` 保持原样，而不是被压平成猜测值。

  仍有两个缺口，都需要运行时测量，且都跟踪在 #5585 中：无论标签是否实际放下都会设置 `title`，而原生 `title` 是指针功能 —— 它响应悬停，不响应键盘焦点，也完全不响应触摸。改进方案是仅在文本真被截断时显示 tooltip，可通过悬停和焦点到达，这会使 `Badge` 成为客户端组件，是其自身需要权衡的取舍。

- Banner 根据其字符串标题命名每个关闭控件，因此堆叠的 banner 不再向屏幕阅读器暴露相同的 "Dismiss" 按钮。富标题保留通用的已翻译名称，除非消费者提供已翻译的 `dismissLabel`；该覆盖也会为 tooltip 加标签。(#5113)
- 七个组件现在转发 `BaseProps` 承诺的透传 props (#5563)
  `MetadataListItem`、`NavHeadingMenu`、`Timestamp`、`Token`、`TopNavMegaMenu`、`TopNavMenu` 和 `TypeaheadItem` 现在会将中性的 `aria-*`、`id`、`tabIndex`、事件处理器和 `data-*` props 转发到其渲染的 DOM 元素。样式仍通过 `mergeProps` 合并，契约拥有的属性保持优先，拥有的处理器通过 `composeEventHandlers` 组合，调用方在前。

  `MetadataListItem` 在堆叠时以包装器 `<div>` 为目标，在内联时以 `<dt>` 为目标。由调用方提供的 `item.element` 支持的 `TypeaheadItem` 保持不变，不接收转发的 props，因为该值可能不是可克隆元素。

  这完成了 [#5254](https://github.com/meta/astryx/issues/5254)，此前 [#5288](https://github.com/meta/astryx/pull/5288)（由 @lexs）先落地了 `List` 和 `Markdown`，随后是 [#5493](https://github.com/meta/astryx/pull/5493)（由 @gonzoblasco）为 `TreeList`。

- `Button` 现在将 `elevation` 反映为主题目标。该 prop 在四个 StyleX 样式对象之间选择，但从同级 `themeProps('button')` 调用中缺失，因此 `data-elevation` 从未到达 DOM，也没有主题能为该轴设置样式 —— 与 #5491 中在 `Card` 上修复的缺陷相同，而 `ButtonGroup` 已经正确做到这一点。`ButtonGroup` 内的按钮报告 `none`，因为组拥有表面的高度，成员平铺绘制。每个将 `ButtonProps` 转发到 `Button` 的包装器 —— `IconButton` —— 会一并获得该反映。（`ToggleButton` 不会：其 props 扩展 `BaseProps` 而不是 `ButtonProps`，因此没有可转发的 `elevation`，并保持报告 `none`。）渲染的按钮没有任何变化：64 个捕获帧中有 60 个逐字节相同，而不同的四个仅在加载 spinner 自身盒子内不同。(#5552)
- Calendar：以 provider 语言区域宣布清除的范围，在狭窄视口下换行两个月布局而不是溢出，在强制颜色下保持选中日期可见 (#5453)
- Card：将 `elevation` 反映为主题目标以便主题到达它，并修正文档化的 `padding` 默认值 (#5491)
  `elevation` 选择了一个样式对象但从未到达 DOM，因此 `astryx-card` 暴露了 `data-variant`，但高度没有任何东西，主题无法为四个阴影层级设置样式。它现在与 `variant` 一起搭载在 `themeProps` 上。

  `padding` prop 将 `4` 记录为默认值。省略该 prop 时，卡片读取主题的卡片内边距，而大多数发布主题将其设置为不同的步骤，因此显式写入文档化的默认值会改变卡片尺寸。prop 文档、JSDoc 和 playground 默认值现在说明：省略该 prop 采用主题内边距，传入步骤则覆盖它。代码中编码相同错误默认值的四个 `effectivePadding !== 4` 样式分支已移除：`container()` 已设置它们设置的每个变量，并在所有十一个内边距步骤上对有边框和无边框卡片验证一致。

- 当到达滚动边缘禁用正在使用的导航按钮时，Carousel 不再将键盘焦点丢到 document body。焦点改为移动到相反的箭头，在禁用按钮的状态转换时而非根据按压预测，因此它在减少运动、scroll-snap 以及没有 `scrollend` 的浏览器下都成立。滚动容器现在也是文档化的主题目标 `astryx-carousel-scroller`，携带其设置的 gap、padding、snap 和边缘渐隐 props，因此主题可以到达它此前看不到的间距和渐隐。(#5601)
- 56 个 `--color-data-*` 默认值现在从同一源到达运行时 CSS 和构建的主题，同时 dashboard 模板回退匹配这些默认值 (#5562, #5566)
  默认值只存在于 `@layer astryx-base` 的 `:root` 一处，因此嵌套主题继承父级覆盖，`astryx theme build` 匹配 `<Theme>`，而 `generateThemeCSS` 保持其现有返回形状。

  **视觉变化。** 此前不绘制任何内容或使用不匹配十六进制回退的图表或模板现在绘制数据 token 的默认值。固定显式颜色以保留先前的回退。

- DateRangeInput：当 `minRangeSpan` 为 1 时允许同一天范围 (#5581)
  当配置的最小值允许时，重复点击范围起点现在会提交一天范围，包括同时设置了最大跨度时。更长最小跨度保留现有取消行为，以便用户可以移动起始日期。

- Dialog：全屏安全区内边距遵循书写方向，并让位于显式内边距 (#5367)
  对 0.5.0 中发布的全屏安全区内边距的两处更正。

  **在 RTL 中 insets 映射到了错误的边缘。** `env(safe-area-inset-left)` 和 `env(safe-area-inset-right)` 是物理的，但它们被直接赋给 `padding-inline-start` 和 `padding-inline-end`，这些是逻辑的。这在 LTR 中成立，在 RTL 中反转，其中 inline-start 是右边缘 —— 因此物理左侧的设备刘海会让该边缘的内边距远离它，使有刘海的边缘不受保护。现在每个物理 inset 供给实际面向它的逻辑边缘，在两种方向下都是如此。

  **安全区保护覆盖了显式内边距。** `max()` 被无条件应用于全屏表面，因此它胜过 `padding` prop 和主题的 `dialog: {padding: 0}`，无法表达有意全出血的全屏对话框。它现在位于 `container` 已解析的同一条 `--astryx-dialog-padding*` 链的最内层回退中，因此仅在没有任何地方设置内边距时应用。显式值（包括 `0`）按写法尊重。

- 日期格式现在在 core、charts 和 Schedule 中默认采用公历语义，同时仍跟随所选语言区域的语言、数字和字段顺序。(#5303)
  底层公共 `plainDateFormat` 辅助函数继续为兼容性尊重显式提供的 `calendar` 选项；Astryx 组件不暴露该仅显示例外，并保持公历。确定性英语回退还防止在没有 provider 语言区域时服务器和浏览器语言区域差异产生 hydration 不匹配。语言区域感知解析只为有歧义的 ASCII 数字日期选择日优先或月优先顺序；它不解析本地化月份名称、非 ASCII 数字或任意语言区域特定字符串。

  修复 #5074。

- 带标签的 HoverCard 触发器暴露 dialog-popup 关系，而不将富内容压平成描述，且只有支持 `aria-expanded` 的角色接收该状态 (#5419, #5501)
  触发器现在使用 `aria-haspopup="dialog"`、`aria-controls` 和按角色门控的 `aria-expanded`；`useHoverCard` 暴露层 `id` 和打开状态，而 `describedBy` 作为弃用别名保留以兼容。无标签组卡片保留其描述关系。

- 弹窗触发器不再与浏览器自己的轻量关闭对抗：按下已打开的 Selector、MultiSelector、ComplexSelector、DropdownMenu 或 Popover 的按钮会关闭它一次，而不是关闭后重新打开。MultiSelector 的清除和状态按钮在按下时也保持其弹窗打开。(#5018)
- Markdown 现在对其解析的每个图片路径应用相同的 URL 安全规则：引用式图片（`![alt][label]` 和快捷形式）和独立块图片通过内联图片和链接已使用的检查，渲染侧守卫在测试前规范化控制字符，使两层都以浏览器的方式看待 URL。(#5522)
- Markdown 和 List 转发 `BaseProps` 的其余部分 (#5288)
  两者都声明 `BaseProps`，而 `BaseProps` 文档说明 `data-*`、`aria-*` 和 `role` 会到达元素 —— 但各自解构固定的一组 props 并只转发 `data-testid`，因此消费者传入的 `aria-label` 静默消失。`<Markdown aria-label="Release notes">` 没有命名任何东西，而列表无法由它未自行渲染的标题加标签。

  消费者 props 先展开，因此组件为自己设置的内容仍然获胜：块根保持 `role="document"`，列表保持恢复 Safari/VoiceOver 宣布的显式 `role="list"`，渲染自己头部的列表保持该关联而不是指向其他位置。该头部的 `aria-labelledby` 只在头部存在时写入 —— 无条件写入 `undefined` 会抹掉消费者自己的标签。

- NumberInput 安全管理语言区域格式的粘贴并提交一个完整草稿：分组数字和机器小数点可用，任意重复标点被拒绝，超出范围的值钳制到最近边界，小数步进不能越过四舍五入的边界 (#5152, #5450, #5459, #5510, #5546)
  无效键入或粘贴输入保留先前值，而不是提交有效前缀。Pagination 继承完整草稿和边界行为，而内联 Table 筛选和 PowerSearch 保留现有实时和 Enter 保存行为。

- Popover：主题化 `popover.borderRadius` 现在会改变渲染的圆角。`astryx-popover` 目标移到弹窗表面 —— 绘制背景、圆角和高度的盒子 —— 并且 `usePopover` 在那里读取注册的 `--_popover-radius` 而不是硬编码 `--radius-container`。内容内边距随之移动，因此主题化的 `padding` 仍替换默认值而不是嵌套在其中。(#5162)
- 确保按压覆盖层在交互表面上覆盖悬停 (#5451) (#5516)
- 当容器窄于 400px 时堆叠 DateTimeInput 的日期和时间字段。(#5609)
- Selector：调用方提供的 `id` 现在驱动触发器的整个身份，而不仅是其 `id` 属性 (#5561)
  `Selector` 用 `useId()` 生成触发器 id，并在展开 `...rest` 之前设置到触发器按钮上，因此调用方的 `id`（通过 `BaseProps` 接受）会在按钮上替换它，而生成值仍作为 listbox 的 `aria-labelledby` 和 `Field` 标签的 `htmlFor` 目标留下。因此传入 `id` 会让 listbox 没有可访问名称，字段标签指向不存在的元素，静默发生且类型检查、lint 和构建都干净。

  内部身份现在在有调用方 `id` 时从它派生，因此按钮、listbox 的 `aria-labelledby`（普通和 `hasSearch` 面板）以及 `Field` 的 `inputID` 都指向同一元素。触发器自身的 `id` 属性在任何情况下都不变；变化的是过去悬空的引用现在可解析 —— 包括字段标签，因此恢复了其原生点击聚焦行为。未提供 `id` 时，渲染输出与之前相同。

- 当消费者 Babel 预设将箭头函数降级在 StyleX 提取之前时，Selector 原始源码现在可以编译 (#5508)
- 平台检测将 client-hints 的 `Unknown` 哨兵值读作无答案，并集中在一处 (#5394)
  这是 #5325 的后续，该 PR 让 `useHotkeys` 和 `Kbd` 在 `userAgentData.platform` 为空时回退到 `navigator.platform`。`Unknown` 是 User-Agent Client Hints 规范自己表示 "无法说明" 的值，它并不比 `''` 更能命名平台，但它仍承诺 client-hints 分支并回答 "不是 Apple"。它现在以同样方式回退。

  两处检测是独立副本，靠 docstring 保持对齐。它们现在是一个内部 util，两者都导入它，因此该逻辑的下一次更改不会只落在一个表面上而遗漏另一个。该 util 有意不在 `utils/index.ts` 中命名，那会将其发布为 API。

- SideNavItem：在带 `href` 或 `onClick` 的 `collapsible` 项上，独立的展开/折叠切换现在带有 `size="sm"` 图标按钮的盒子。它此前没有自己的盒子，因此缩小到其中的 24px 箭头，并绘制比同一行中旁边任何图标按钮更小的悬停胶囊。(#4988) (#5005)
- SideNav：`collapsible` 和 `resizable` 不再保留两个独立初始化的折叠状态副本。两个 props 都被归一化到一个内部折叠配置中，只有一个所有者 —— 当 `resizable` 参与时是 resize hook，否则是 SideNav 自己的 state —— 因此 hook 不再能在 SideNav 以宽度 0 渲染展开布局时将自己恢复为折叠，这正是使持久化折叠的导航回来时不可见且无法恢复的原因 (#4790) —— 第二个独立初始化的布尔值才是缺陷，而不是恢复钳制，这是 @HelloOjasMutreja 从 #4853 中的诊断。同时传递两个 props 仍受支持，今天每个可用的配置都解析为与现在相同的折叠状态；当两个 props 真正针对同一状态时（两者都有 `defaultIsCollapsed`，或受控 `collapsible` 与 `resizable` 上的折叠状态并存），`resizable` 获胜，开发警告会指出冲突的键。`useResizable` 获得标准的受控/非受控对 `defaultIsCollapsed` 和 `isCollapsed`，与现有的 `onCollapseChange` 并列：非受控时它像以前一样拥有折叠，受控时 prop 获胜，`collapse()`、`expand()` 以及拖过阈值的拖动通过回调报告而不是直接变更。持久化条目现在存储 `{size, isCollapsed}`，其中 `size` 是_展开_尺寸 —— 该编码是 @AKnassa 在 #4824 中的 —— 因此重新加载会恢复折叠轨道，展开会返回用户之前的宽度而不是 `defaultWidth`；遗留条目仍会加载，纯数字读作宽度且折叠状态未知，纯 `0`（由旧折叠路径写入）读作已折叠，因此已经卡在不可见导航中的人无需清除 localStorage 即可恢复。`resizable` 现在也可以自行携带折叠状态。两个通知变化随之而来：单一所有者时，`collapsible.onCollapsedChange` 在可调整大小的导航上每次切换触发一次而不是两次；并且 hook 的折叠回调现在读取实时折叠状态，而不是上次渲染时捕获的值，因此一次拖过阈值报告一次折叠而不是每个指针移动一次，拖回阈值以上会在手势中途重新展开，从折叠状态调用 `resize()` 会报告隐式展开。最后一个修复是 @AKnassa 的，来自 #5118。(#5075)
- Slider：用鼠标拖动滑块不再绘制键盘焦点环 (#5463)
  滑块是 `div[role="slider"]`，轨道的 `pointerdown` 处理器调用 `preventDefault()` 然后从脚本聚焦滑块。Chromium 将该脚本焦点视为 focus-visible，因此 `:focus-visible` 在鼠标按下时匹配，每次拖动都带有 2px 强调环 —— 在 Chromium 中测量，而非推断。

  `:focus-visible` 仍是 CSS 条件；它现在通过现有的 `interactionModality` util 收窄，与 PanelSearchInput 和 Selector 收窄的方式相同。键盘焦点环与之前完全相同，而鼠标抓住已经带环的滑块会将其丢弃。

  与文本输入情况的一个有意区别：鼠标拖动后的按键会带回焦点环。文本字段有光标来显示输入去向，而滑块没有其他东西。

- 保持 useResizable 回调在省略吸附点时稳定。(#5276)
- 保持 useLayer 触发 refs 和返回对象在其输入不变时稳定。(#5272)
- 保持 useTheme token 解析器和返回值在解析主题不变时稳定。(#5274)
- Table 粘性列：固定列阴影现在读取主题的 `--color-shadow` token，而不是硬编码的 `light-dark()` 色调，因此主题可以重新着色。(#5445)
  该色调是组件中写入的 `light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.32))`，之所以选择它是因为 `--color-shadow`（10%/30% alpha）读起来略显过淡。组件中的字面量是主题无法到达的唯一地方：每个主题都得到这个确切的黑色，无论其自身阴影颜色如何，而两点 alpha 差异没有带来任何好处 —— 渲染后，token 版本在浅色模式下任何通道最多相差 5/255，在深色模式下 1/255，而两条阴影条约占画面的 0.4%。

  改为读取 token 意味着七个捆绑主题各自用它们已为其他所有阴影声明的值为此阴影着色（`chocolate` `#4a35201A`、`stone` `#25252a1a` 等），自定义主题也获得相同的覆盖能力。

- 语法高亮的标点（括号、逗号、分号、运算符）现在在每个捆绑主题中相对代码表面满足 WCAG 2.1 AA 对比度（4.5:1）。(#5414)
  `--color-syntax-punctuation` 借用了 `--color-text-disabled`，这是一个 WCAG 有意豁免正常文本对比度要求的 token，因为它标记非活动控件。代码示例中的标点始终是活动的普通文本，在三个主题中测量远低于 4.5:1：neutral（浅色 2.42:1，深色 2.53:1）、chocolate（浅色 3.06:1，深色 2.56:1）和 matcha（浅色 3.83:1，深色 2.73:1）。其他四个主题（butter、gothic、stone、y2k）已经定义了自己通过的标点颜色，未受影响。

  共享默认值现在改为指向 `--color-text-secondary`（也用于 `--color-syntax-comment`，并且已验证达到 AA）。Neutral、chocolate 和 matcha 各自在自己的语法调色板中获得专用标点颜色，因为它们定义了调色板而不是继承共享默认值：neutral `#6e6e6e`/`#a0a0a0`（4.89:1/7.57:1），chocolate `#9e622e`/`#cb884d`（4.84:1/6.12:1），matcha `#566a39`/`#92af6a`（5.19:1/7.02:1）。

  添加 `scripts/check-syntax-punctuation-contrast.test.mjs`，通过 `light-dark()`/`var()` 间接解析每个主题的 `--color-syntax-punctuation`/`--color-syntax-background` 对（模式来自 #4446 的徽章对比度守卫），并将每个主题的两种配色方案都保持在 AA —— 因此这里的回归会使构建失败而不是发布。

- Table 在横向滚动时保持分组标题和选中行底纹跨冻结列可见 (#5454)
  `useTableGroupedRows` 将其默认标题和折叠控件固定到表格的起始边缘。`useTableSelection` 现在随行背景发布和撤回选中行覆盖层，因此底纹在粘性单元格下方继续。

- Text、Heading：被截断的标签只显示一个 tooltip，而不是两个。(#5559)
  当 `maxLines` 裁切文本时，两个组件都渲染 Astryx 的 `Tooltip` **并且**将原生 `title` 属性设置为相同字符串。悬停会绘制两者：先是样式化 tooltip，然后片刻后浏览器自己的无样式 tooltip 覆盖其上，说完全相同的话。

  `title` 被移除。`Tooltip` 已经将 `aria-describedby` 连接到锚点，完整文本无论如何都在 DOM 中 —— CSS 在视觉上裁切它，因此屏幕阅读器从未读取截断版本。除了重复之外没有任何损失。

  悬停测量，同样的情况，前后：向用户显示 `2` 个 tooltip，然后 `1` 个。

- 七个连写复合组件名称的主题目标根现在弃用为组件名称所暗示的 `<component-kebab>-<part>` 拼写：`codeblock` → `code-block`（带 `-copy-button`、`-header`、`-title`），`progressbar` → `progress-bar`（带 `-fill`、`-mark`、`-track`），`hovercard` → `hover-card`，`statusdot` → `status-dot`，`textarea` → `text-area`，`navicon` → `nav-icon`，以及 Table 的第二个根 `base-table` → `table`（两者都命名同一个 `<table>` 元素）。匹配不到任何目标的 `defineTheme` 键会静默失败 —— 没有错误、没有警告，规则永不发出 —— 因此读了 `ProgressBar` 并写了 `'progress-bar'` 的人什么也得不到，也没有解释。没有任何东西会坏：每个组件渲染两个类，两个键都解析，包括重命名键扩展出的派生变量。新主题应使用规范拼写；弃用别名仍受支持。(#5449)
- Toast 适应狭窄和安全区视口，对齐换行的操作和关闭，使用边缘定向的进入和退出运动，仅在填充时暴露 Notifications landmark，并在最后一个 toast 下方保持正好一个视口边距 (#5353, #5460)
  Toast 间距为 8px，而视觉底部不再在视口内边距之上添加尾随 toast 间隙。放置、可见堆栈限制、自动隐藏默认值、宣布语义和关闭原因不变。

- TreeList：将 `aria-label`/`aria-labelledby` 转发到 `role="tree"` 元素，使树可以命名 (#5493)
  `TreeList` 解构固定的一组 props 且没有 rest spread，因此每个 `BaseProps` 属性（`aria-*`、`role`、`tabIndex`、`id`、事件处理器）都被丢弃，从未到达 DOM。没有可见头部的树根本无法命名 —— 屏幕阅读器宣布一个未命名的树，无法知道它是什么。

  组件现在将其余 props 展开到根元素，并将 `aria-label`/`aria-labelledby` 路由到 `<ul role="tree">` 本身，因此 `<TreeList aria-label="File tree">` 为树命名。渲染可见 `header` 时，它继续为树命名（AT 听到与用户看到的相同名称）；消费者提供的 `aria-labelledby` 仅在无头部路径上应用。契约 `role="tree"` 写在 rest spread 之后，因此消费者无法替换它。

#### 文档

- `useAnnounce`、`useTypeahead`、`useInteractiveRole`、`useLongPress`、`useInputStatusIcon`、`useDevWarning` 和 `useIndicatorFocusRing` 现在可被发现。CLI 的 hook 索引由每个 hook 旁的 `.doc.mjs` 文件构建，而这七个发布时没有；因此 `astryx hook <name>` 回答 "No hook named"，`astryx hook` 省略它们，`astryx search` 从不返回它们，而包以完整 TSDoc 导出它们。遵循文档化发现工作流的 agent 得出结论这些原语不存在并手写替代品；对于 `useAnnounce`，这意味着手建 `aria-live` 区域，而它通常根本不会宣布。现在当 hook 从 barrel 导出而没有文档时测试会失败，因此索引不会再次静默过期。(#5109)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @Astro-Han
- @bhamodi
- @cixzhang
- @ernestt
- @freddymeta
- @gonzoblasco
- @HelloOjasMutreja
- @imdreamrunner
- @jiunshinn
- @josephfarina
- @lexs
- @nynexman4464
- @rubyycheung

---

# 0.5.0

#### 破坏性变更

- Banner：折叠轴迁移到单个 `collapsible` prop 上，内容可以选择不折叠 (#5255)
  Banner 此前根据其内容推断展开行为：任何 `children` 都会在头部获得一个 chevron，并且在按下之前保持隐藏。没有办法在禁用切换的情况下显示内容——而这正是 banner 最常需要的情况，例如列出三个未通过校验的字段——并且 `defaultIsExpanded` 是唯一的控制项，没有受控模式。

  整个轴现在是一个 `boolean | CollapsibleConfig` prop，遵循 `SideNav.collapsible` 确立的 boolean-or-config 约定，并由共享的 `useCollapsible` hook 而非 Banner 自己的 state 支撑：

  ```tsx
  <Banner status="error" title="3 fields need attention">…</Banner>  // unchanged: collapsible, starts closed
  <Banner collapsible={false}>…</Banner>                             // new: always visible, no toggle
  <Banner collapsible={{defaultIsOpen: true}}>…</Banner>             // replaces defaultIsExpanded
  <Banner collapsible={{isOpen, onOpenChange}}>…</Banner>            // new: controlled
  ```

  **默认行为不变**——从未提及 `defaultIsExpanded` 的 banner 行为与之前完全一致。破坏性变更在于 prop 本身：`defaultIsExpanded` 被移除，改用配置对象，因此每个显式命名它的 JSX 调用点都会出现类型错误。

  **Codemod：** `npx astryx upgrade --codemod banner-collapsible-content`

  它会把 `defaultIsExpanded` 改写为 `collapsible={{defaultIsOpen: true}}`，并删除 `defaultIsExpanded={false}`，因为后者现在是默认值。从未设置该 prop 的 Banner 保持不变。

  **有一种情况 codemod 和编译器都会漏掉：展开（spread）。** props 对象内部的 `defaultIsExpanded` 不在转换的作用域内。位于类型位置的 props 对象仍然无法通过编译——但一个被推断出来并被展开的 props 对象，例如 `<Banner {...args} />`，则不会报错，因为 TypeScript 不会对展开做多余属性检查。该 prop 随后会透传到 DOM，banner 会悄悄开始处于折叠状态。**运行 codemod 后请 grep `defaultIsExpanded`**，并手动迁移所有展开位置。

- Overlay 共享同一个关闭栈，因此单次 Escape 只关闭恰好一个层。以前每个 overlay 都拥有自己的 Escape 监听器，这意味着一次按键可能同时关闭一个 popover _和_ 承载它的 Dialog，或者一个 modal _和_ 打开它的 modal。`useLayerDismissal` 用一个统一的栈取代了这种做法：栈拥有一个监听器，将每次按键路由到最顶层的层，并抑制浏览器自己的 close-watcher，确保没有任何东西被关闭两次。层通过 `escapeBehavior` 声明它对按键的处理——`close`（默认）或 `block`，后者用于 `required` 的 Dialog，它必须吞掉按键而不关闭，这样它后面的一切也不会被关闭。修复了 Dialog 内的 Tooltip 关闭的是 Dialog 而不是提示本身，以及 HoverCard 触发器仅仅获得焦点就吞掉 Escape 的问题。浏览器自行发起的关闭——Android 返回手势、平台 close watcher——仍然会关闭 Dialog，并遵循同样的最顶层规则。取消进行中 IME 组合的 Escape 不会关闭任何东西：栈会接管该按键，使浏览器不自行发起关闭请求；即使在组合过程中仍收到关闭请求也会被拒绝，因此中日韩用户退出一个尚未成形的字符时，不再丢失该层以及在其中输入的所有内容。如果你自己监听 Escape，有一个值得注意的行为变化：栈用 `preventDefault()` 接管按键，但有意不干预传播，因此 `window` 上的 `keydown` 监听器现在会看到以前被焦点陷阱层拦截的 Escape——此时 `defaultPrevented` 已经为 `true`，可据此判断栈已经处理了它。最顶层的判定基于 React 树嵌套（可跨越 portal），而不仅仅是 DOM 包含关系。层在该顺序中的位置以层的身份而非每次注册为键，因此因 prop 变化而重新注册——例如 Dialog 打开时 `purpose` 发生翻转——绝不会把它提升到在其之上打开的层之上。受控层遵循其控制状态：受控的 `Tooltip` 或 `HoverCard` 仍留在栈上，像其他层一样接管按键，但通过调用 `onOpenChange(false)` 来响应，而不是自行隐藏——它是否真正关闭取决于调用方的更新，这与 `Dialog` 一贯的行为完全一致 (#4881)。

#### 新组件

- 允许自定义 MultiSelector 的计数标签 (#4032)
- MultiSelector：将未发布的 `formatTriggerCount` prop 重命名为 `formatValue`，并将其作用范围扩大到整个触发器行。现在它接收选中项（`{value, label}[]`，数量可通过 `.length` 获取），并为 `triggerDisplay="count"` 和 `"labels"` 格式化触发器；`"badges"` 渲染的是元素，因此不在那里使用。`formatValue` 与 NumberInput 和 Slider 保持一致，使同一概念在整个系统中只有一个名称。未提供该 prop 时默认行为不变 (#5377)。
- 将 `Stepper` 和 `Step` 从仅限 canary 的 Lab 包提升到 Core。稳定包现在提供它们现有的水平/垂直布局、分离式与轨道式指示器、语义状态、密度和非线性导航，以及 Core 文档和渲染示例。默认 `aria-label` 现已本地化。
  前进一个步骤现在会为连接线添加动画。四种布局绘制的每条连接线——无论是分离式条形还是轨道式分段——都会从该段的前缘生长出强调色填充，而不是直接切换背景色，因此向前推进读起来像是在轨道上行进。这个手势是唯一有动画的东西：后退、向前跳跃超过一个步骤，以及在流程中途挂载都是立即生效，`prefers-reduced-motion` 下的任何变化也是如此。后退被有意设为瞬时——如果反向运行，同样的过渡会结束在一小截正在收缩的强调色残段上，而留在轨道上的残余会被读作未完成，相比之下，同样曲线向前生长则读作已到达——多步跳跃也是瞬时的，因为跳跃是导航而不是进程，让一个前端扫过跨过的分段只会让用户干等一段他们本就要求跳过的旅程。当一段跨度由多个分段绘制时（轨道式布局将一段跨度分配在两个步骤之间，如果它们之间有内容槽则为三个步骤），各分段取该跨度时间的相邻切片并线性运行，因此填充读起来像一条以恒定速度生长的线，而不是一块块依次点亮。

  随此次提升还带来了五项视觉修复。水平步骤现在均匀分割轨道，而不是按各自标签的宽度分配尺寸，因此无论步骤名称多长，每个进度分段的宽度都相同。数字指示器从 20px 缩小到 16px，以匹配勾选、环形和自定义图标指示器，因此步骤在完成时将数字换成勾选标记时不再推动旁边的标签。步骤描述现在占据 16px 的盒子而不是 24px——它之前继承了页面的行盒，而没有应用自己的行高，导致标签下方多出 8px 的间隙。步骤的内容槽现在在每种密度下都与上方的标签齐平：该槽渲染在带密度内边距的标签区域之外，因此之前比它少了一个内边距的距离。而带有内容的垂直轨道式步骤保持其连接线不中断——内容渲染在绘制线条的那一行下方，因此轨道过去会围绕任何带有内容的步骤裂开 (#5201)。

#### 新功能

- AspectRatio：将 `ratio` 作为类级别声明输出，而不是硬编码的内联样式，因此可以响应式地覆盖比例：StyleX 消费者通过 `xstyle` 传入 `aspect-ratio` 规则（包括在 `@media`/`@container` 条件下），而纯 CSS/Tailwind 消费者可以从自己的无层级规则中覆盖 `aspect-ratio`，无论特异性如何都能胜过 `astryx-base` 级联层。mixed-gallery 模板的 hero 现在在网格堆叠时通过单个元素上的一行覆盖从 3:1 切换为 3:2，取代了此前固定内联比例所迫的重复 hero 标记 (#3883, closes #2798)
- ChatMessageList：为顶部对齐的消息列表添加 `align` prop
  (#3933, closes #2572)。

- DateTimeInput：新增 `timeOptionInterval` prop，为时间字段添加预设时间下拉列表，间隔为 `5 | 10 | 15 | 30 | 60` 分钟（`60` 会给出 12 AM - 11 PM 的列表）。该字段变成一个基于 `listbox` 的 APG combobox：点击或 Alt+ArrowDown 打开它，ArrowUp/ArrowDown 移动活动选项，Enter 选择，Escape 关闭，输入会把高亮移动到最接近的选项而不会过滤列表。`min`/`max` 会在边界日期裁剪选项。通过 `date-time-input-time-listbox` 和 `date-time-input-time-option` 主题目标来设置弹出层的样式。
  可选启用且纯增量：省略 `timeOptionInterval` 时，时间字段保持当前行为完全不变，也不会获得 combobox 语义，因此现有的 `getByRole('combobox')` 查询仍然解析到日期输入框。列表关闭时，方向键仍按 `timeIncrement` 步进 (#4837)。

- Markdown：在解析块上可选启用源范围
  `parseMarkdown(source, {sourceRanges: true})` 现在为每个顶层块提供一个 `range`——`{start, end}`，即它在传入源字符串中占据的字符偏移，`end` 为开区间——因此持有该源的消费者可以对某个块使用 `source.slice(range.start, range.end)`，而不必从节点（或从渲染后的 DOM）重建它。重建在很多方面是有损的，而切片不会：转义字符、确切的强调和围栏字符、超出钳制范围的标题深度以及对齐方式都能在切片中保持不变。

  默认关闭，只有显式请求时才会出现，因此现有的节点、快照或比较都不会改变。

  这些偏移有两件天真的实现做不对的事：链接引用定义会在块循环运行之前被剥离，而范围是针对调用方传入的字符串报告的，而不是剥离后的文本；并且 `parseMarkdownIncremental` 解析的是切片，因此块报告的是整个文档流式传输中的绝对偏移——包括两半分别到达不同块并被合并的列表。

  范围逐字覆盖一个块自身的行，因此对它切片并解析结果会得到相同的节点。

  嵌套在列表项或 blockquote 内部的块不携带范围：它们的子节点是从解析器重新组装、移除了标记和 `>` 前缀的文本中解析的，因此指向其中的偏移无法定位到文档 (#5290)。

- Table：让 `useTableSelection` 可以选择退出选中行的强调色覆盖
  选择插件通过行 ref 回调直接往每个 `<tr>` 上写入 `backgroundColor` 来绘制选中行。内联样式压过 StyleX 能叠加的任何东西，因此想要把行背景用于自己含义的产品，除了 fork 插件之外没有别的办法收回它。

  `hasRowHighlight` 可以关闭这层覆盖。它默认为 `true`，因此现有表格不受影响。只丢弃背景——`aria-selected` 仍会像以前一样设置和移除，因为那是屏幕阅读器读取的那一半状态。

  ````tsx
  useTableSelection({...config, hasRowHighlight: false});
  ``` (#5310)

  ````

- TabList：原地切换面板的条带现在可以通过 `role="tablist"` 声明这一点，并且它遵循 WAI-ARIA tabs 模式——条带上使用 `role="tablist"`，tabs 上使用 `role="tab"` 和 `aria-selected`，并通过 `Tab` 上新增的 `panelId` prop 用 `aria-controls` 指向每个 tab 打开的面板。切换本身没有新增 prop：`TabList` 声明 `role?: AriaRole` 并读取它，就像 `LayoutHeader`、`LayoutContent` 和 `LayoutPanel` 已经声明并记录各自角色那样。该模式要求的键盘行为早已存在：方向键在 tabs 之间移动，Tab 离开条带。在断言的角色下，条带只接收水平方向键，把 ArrowUp 和 ArrowDown 留给页面滚动。
  `role` 之前已经通过 `{...restProps}` 到达 DOM，因此调用方可以传入 `role="tablist"`，得到一个子元素仍然是带有 `aria-current` 的 `<button>` 的 tablist——无效标记、没有 `aria-selected`，也没有警告。读取角色把这种静默的破坏变成了正确的行为；声明它才能把它放入类型、prop 表和文档中。

  **不传 `role` 的调用方没有任何变化**：条带仍然是它一直以来的带 `aria-current` 的 `<nav>` 地标。任何其他角色仍然原样透传到元素上。

  断言角色会带来两个开发警告，而且仅在该角色下出现。带有 `href` 的 tab 在 tablist 中是一个错误陈述，因此 `href` 会被忽略，警告也会说明这一点。而一个不控制任何东西的 tab 会被要求提供 `panelId`——或者你自己编写的 `aria-controls` 也能满足它，手写的值永远不会被覆盖。只有提供 id 时才会输出 `aria-controls`：指向一个不存在的面板是无效的属性值，比什么都不说更糟。tablist 条带中的菜单或任何其他非 tab 元素都是无效标记，也会发出警告。镜像情况同样会警告：非 tablist 条带上的 `panelId` 没有可陈述的面板关系，会被丢弃 (#5349)。

- TabList：比其 tabs 更窄的条带现在会滚动，而不是溢出容器。每个 tab 仍然是 tab——没有东西藏在菜单后面——边缘会淡出以表示还有更多内容，可以悬停的指针会获得箭头提示；键盘和屏幕阅读器用户可以通过方向键到达每个 tab，这会把获得焦点的 tab 滚动到视野内。当选中的 tab 即将不可见时，它会被滚回视野内，包括挂载时以及宿主自行更改 `value` 时。新的 `overflow` prop 接受 `'auto'`（默认值，也就是当前始终滚动的行为）、`'scroll'` 或 `'visible'` 以保留旧的溢出布局。它基于现有的 `useScrollOverflow` hook 构建，因此没有新的测量机制，tab 条带中也没有 `Carousel`——文档中的 Carousel 配方会把每个 tab 宣布为 "slide N of M"，现在不再需要，故事已经改用内置行为。
  如果你遵循过那个配方，什么都不会坏：仍然包裹 tabs 的 `Carousel` 会像以前一样渲染和行为，因为它自己的滚动容器会吸收条带的滚动，从而永远不会溢出。不过移除它仍然值得——它会从无障碍树中移除 `region`/"slide N of M" 包装，而条带自身的滚动会在聚焦时把一个横跨边缘的 tab 完整带入视野，Carousel 则不会 (#5348)。

#### 问题修复

- useTablePagination：当 `position='both'` 时，两个分页 `<nav>` 地标现在会获得不同的可访问名称——表格上方为 "{label} (top)"，下方为 "{label} (bottom)"（axe landmark-unique）。消费者提供的 `label` 值会插入到两个名称中；单位置的标签保持不变 (#4692)。
- Table useTableRowExpansion：chevron 槽的列标题现在带有一个视觉隐藏的本地化名称（"Row expansion"，键 `@astryx.tableRowExpansion.columnHeader`），而不是空的 `<th>`（axe empty-table-header，WCAG 1.3.1 最佳实践）。该槽在视觉上仍为空白 (#5383)。
- Table useTableRowStatus：状态槽的列标题现在带有一个视觉隐藏的本地化名称（"Row status"，键 `@astryx.table.rowStatus.columnHeader`），而不是空的 `<th>`（axe empty-table-header，WCAG 1.3.1 最佳实践）。该槽在视觉上仍为空白 (#4693)。
- BottomSheet：当中日韩用户按下 Escape 以取消进行中的 IME 组合时，独立 sheet 不再关闭。浏览器会在 `compositionend` 之前触发该 keydown，因此只读取 `event.key` 的 Escape 处理器会把组合取消误读为关闭命令并关闭 sheet——丢失在其中 `purpose="form"` 字段里输入的内容。处理器现在会在 `isImeKeyEvent` 上提前返回，这与 `Dialog` 和 `BottomSheetSwitcher` 已经携带的防护相同，并且会先接管按键，使浏览器不自行发起关闭请求 (#5322)。
- `Breadcrumbs` 用半粗字重标记当前项，而不只是用颜色。当前面包屑之前只通过 `--color-text-primary` 与兄弟项的 `--color-text-secondary` 区分，这不符合 WCAG 1.4.1（颜色的使用），并且让无法区分这两种色调的人看不到当前位置 (#4605, closes #4421)。
- ButtonGroup：在成员打开的菜单内按下的方向键会留在该菜单中。DropdownMenu 会在组内内联渲染其菜单，因此 ArrowLeft 和 ArrowRight 过去会冒泡到组并移动焦点到兄弟按钮上，而菜单仍然打开。组的 `elevation` 现在也会反映为 `data-elevation`，以便主题可以针对它设置样式 (#5355)。
- ButtonGroup 是一个单一 Tab 停靠点。其成员现在共享一个 roving tab stop，而不是各自占用一个，因此三个按钮的组只需按一次 Tab 而不是三次。方向键沿方向在成员之间移动（RTL 下翻转），Home/End 跳到两端，焦点循环，禁用的成员会被跳过。有两个值得了解的后果：过去逐一 Tab 遍历组成员的键盘脚本或测试现在必须使用方向键，而一个渲染为链接（`href`）的成员首次加入方向键顺序。(#5389)
- Calendar（以及 DateInput、DateRangeInput、DateTimeInput）现在会在 min/max 窗口内的某个月打开，而不是在今天的月份
  在没有 `focusDate` 也没有选中值时，日历会在今天的月份打开，即使 `min`/`max` 排除了它——一个 2019 年的审计窗口或明年春天开放的预订窗口会渲染一个每天都被禁用的网格，唯一的进入方式是每个月点击一次上一个/下一个箭头。

  初始月份现在是把今天钳制到窗口内：今天在窗口内时就是今天，否则是最接近的边界。显式的 `focusDate` 或选中值仍然优先，因此已经说明要查看哪里的调用方没有任何变化。使用 `numberOfMonths={2}` 时，过去的窗口会把 `max` 落在右侧窗格，因此两个窗格都不会完全越界 (#5306)。

- DateInput：在触摸设备上清除不再把页面跳到顶部
  在触摸界面上，点击清除（✕）会把用户抛到页面顶部。清除会卸载清除按钮，而 `handleClear` 在同一个任务中聚焦了该字段——在 iOS Safari 上，当获得焦点的按钮被移除时聚焦元素会把整个文档滚动到 0。焦点交接现在被推迟到卸载之后，这会保持页面位置不变，并且仍然把焦点返回给字段。

  在 iOS 26 模拟器上针对线上 docsite 测量（DateInput — Clearable，页面位于 scrollY 2055）：同步聚焦 → 0，延迟聚焦 → 2055。单靠 `preventScroll` 不能解决；它保留用于普通的滚动到视野内的微调，而这出于同样的原因也是不需要的 (#5350)。

- 使用 token 间距把标准 Dialog 宽度钳制到动态视口空间，添加安全区域/全屏尺寸和仅淡入淡出的全屏动效更新，添加可选的 Dialog/BottomSheet 自适应配方，并添加明确的呈现方式对比故事 (#5352)。
- DropdownMenu：把 `dropdown-menu-indicator-icon` 主题目标移到 Icon 元素本身上，以便主题可以直接重新设置子菜单 chevron 的大小和颜色。
  加载分支不再携带该目标——它的 `Spinner` 有自己的 `astryx-spinner` 目标，与 Selector、MultiSelector 和 ComplexSelector 一致 (#4743)。
- Chat：消息气泡中的 token 现在像在编辑器中一样位于行上。`ChatTokenizedText` 用与 `ChatComposerInput` 相同的 `inline-flex` / `vertical-align: middle` 盒子包裹每个 token，因此 chip 在消息发送的那一刻不再从文本上浮起。跟随 #5324，该 PR 修复了编辑器那一半 (#5402)。
- Chat：编辑器 token 不再位于周围文本上方——`vertical-align` 从 `baseline` 改为 `middle`，并且 `ChatComposerTokenElement` 现在使用 StyleX 类而不是内联样式，因此消费者可以在没有 `!important` 的情况下覆盖对齐方式 (#5324)。
- useFocusTrap：只有当焦点确实位于陷阱容器内时才会取消 Tab。一个打开层的焦点合法地位于其外部——例如锚定到自身 input 的 listbox 弹出层，如 DateTimeInput、Typeahead、Selector 和 MultiSelector——不再为整个页面吞掉 Tab，因此键盘用户第一次按键就能移动到下一个控件。没有可 Tab 控件的陷阱表面且焦点位于 `tabIndex={-1}` 面板上时，仍会把 Tab 保持在内部 (#5397)。
- 当客户端提示报告平台为空时，`mod` 热键和 `Kbd` 在 macOS 上重新解析为 Cmd
  `useHotkeys` 和 `Kbd` 都优先使用 `navigator.userAgentData.platform` 并回退到 `navigator.platform`，但用 `'platform' in uaData` 来守卫这个偏好——无论该键是否存在，这个表达式都为真。因此一个报告 `platform: ''` 的构建会提交到客户端提示分支并得到 `false`，从未到达回退逻辑，所以在 macOS 上每个 `mod` 组合都监听 Ctrl，每个 `<Kbd>` 都绘制 Ctrl。Electron 和其他重写应用程序 user-agent 身份的嵌入器正是这样。空平台现在被视为未知并落入回退 (#5325)。
- Markdown 流式传输：`parseMarkdownIncremental` 不再在代码围栏打开期间或当某个块恰好以换行结束时丢弃其已稳定的块——这两种情况都会重新解析整个文档，因此长流式响应会随着增长而变慢。跨一个 500 段流式文档重建的块数：126,756 → 1,869 (#5407)。
- 将核心组件从内联 mergeRefs 调用迁移到稳定的 useMergedRefs 回调 (#5267)。
- PowerSearch 现在将 `menuWidth` 应用到初始字段和搜索菜单，而不会让它缩小到输入宽度以下。选择字段后显示的值菜单保持不变。(#5237)
- PowerSearch：`maxOperatorMenuItems` 现在会限制 string、string-list 和 entity-list 值 typeahead 中的建议数量，包括嵌套过滤器内的值 (#5242)。
- PowerSearch：编辑弹出层现在适应窄视口——其 400px 最小宽度会让位于屏幕宽度，当较长的本地化操作符标签放不下时，过滤行会换行而不是溢出。锚定在屏幕边缘附近的编辑器现在会以可用宽度停留在自己那一侧，在内部换行，而不是为了保持 400px 而翻转到锚点另一侧 (#4768)。
- PowerSearch 现在使用每个字段的 `group` 值在浏览菜单中对字段进行分组。未分组的字段会先出现，而输入的搜索结果保持扁平。(#5235)
- PowerSearch 现在在搜索框为空时最多显示 1,000 个已配置字段，而不是停在 10 个。输入的搜索默认仍显示 10 个排序结果；使用 `maxSearchResults` 只更改该限制。(#5233)
- `Selector` 和 `MultiSelector` 不再向辅助技术暴露它们的 `{type: 'divider'}` 分隔符。`role="listbox"` 只允许 `option`/`group` 子元素，但分隔符之前渲染为 listbox 的直接子元素 `role="separator"`（axe `aria-required-children`，影响级别 critical）。分隔符是装饰性的，不携带选项没有的信息，因此现在通过 `aria-hidden` 从无障碍树中隐藏，与分区标题已经使用的模式一致 (#5107)。
- 在 Avatar、Button、SideNav、TabList 和 TopNav 之间保持合并 ref 稳定 (#5429)。
- 添加 useMergedRefs，并在重新渲染之间保持 Text 和 Heading 的 ref 稳定 (#5266)。
- Table：插件可以抑制主体单元格的内容，分组行利用它把合成的组标题挡在你的单元格渲染器之外 (#5363)
  `useTableGroupedRows` 会把分区标题行注入扁平化数据，而 `BaseTable` 会针对每一行评估每一列的 `renderCell`。因此一个根据字段查表的渲染器——`STATUS_META[item.status].dot`——会拿到一个不属于你的行并抛出异常，在开启分组的那一刻让页面变空白。用 `''` 回答未知字段的标题 Proxy 只能拯救那些_打印_字段的渲染器；`''` 会让查表失败，和 `undefined` 完全一样。

  `BodyCellRenderProps` 新增 `isContentSuppressed?: boolean`。插件在 `transformBodyCell` 中为它即将在 `transformBodyRow` 中整体替换其单元格的行设置它，表格会在不调用该列渲染器或默认渲染器的情况下把该单元格渲染为空。它是在渲染时针对最终列列表逐单元格决定的，因此也覆盖了其他插件贡献的列——无论插件以什么顺序列出。

- TimeInput 能正确解析紧凑的 AM/PM 值 (#4026)
- Typeahead：从字段中 Tab 出去现在会把焦点移动到下一个控件。结果列表在 Tab keydown 时关闭，而不是在按键产生的 blur 中关闭——在 focusout 期间隐藏顶层 popover 会让 Chrome 放弃正在进行的焦点移动并把焦点丢到 `<body>`，因此按键看起来没有起作用。Selector 和 MultiSelector 已经在 keydown 时关闭 (#5400)。

#### 文档

- 记录 Button、Toast、ContextMenu、MoreMenu、Selector、Link 和 Dialog 中缺失的 API 契约 props (#4315, part of #4163)
- 记录复杂组件中缺失的 props（MultiSelector、Tokenizer、PowerSearch、Typeahead、Layout、DropdownMenu、HoverCard、Tooltip、Link、Lightbox）(#4316, part of #4163)
- 记录 Markdown 上缺失的 components prop (#4319, part of #4163)
- 记录 Field 中的 labelID 和 isGroupLabel props (#4320, part of #4163)
- 记录结构性组件中缺失的 props（CodeBlock、Toolbar）(#4317, part of #4163)
- Table：记录 section 组件的 children 模式要求
  children 模式在 #2098 中停止把 children 包裹在 `<tbody>` 中，但文档仍在描述此前的契约。`children` prop 写的是 "render TableRow/TableCell directly"；`TableRow` 自己的 `@example` 展示了一行直接放在 `<Table>` 中而没有围绕它的 section；而 `TableHeader`、`TableBody` 和 `TableFooter`——自那次更改以来就是公开导出——完全没有文档，也从 `Table` 的组件列表中缺失。遵循组件自身文档的读者会写出 `<table><tr>`，这是无效 HTML，并且在水合时会不匹配。

  三个 section 组件现在已有文档，列在 `Table` 上，并在 `children` prop 描述、最佳实践和 `TableRow` 的示例中被提及 (#5278)。

#### 其他变更

- `align?: 'top' | 'bottom'`（默认 `'bottom'`）。`'bottom'` 保留
  现有行为：flex spacer 填充可用空间，使较短的对话紧贴在编辑器上方。`'top'` 省略 spacer，因此消息从顶部开始向下增长——更适合日志式或文档式列表。
- 只改变非满列表的静止位置。一旦消息溢出
  容器，spacer 在两种模式下都会收缩为零，因此 ChatLayout 的自动滚动到底部行为不变。
- Spinner：圆环改用 SVG 绘制，而不是 `<canvas>`。弧线和轨道从级联中获取颜色（`shade="inherit"` 时为 `currentColor`），因此 JS 中不再解析任何颜色：挂载后的颜色变化现在会重新绘制圆环，而不是让它保持陈旧直到重新挂载，并且挂载 spinner 不再每次都要付出一个 `getComputedStyle` 的代价。圆环被固定到文档时间线的原点，因此在不同时间挂载的 spinner 会同步旋转。无 API、几何或主题目标变化 (#5408)。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @Astro-Han
- @athz
- @cixzhang
- @ernestt
- @freddymeta
- @gonzoblasco
- @HelloOjasMutreja
- @imdreamrunner
- @jiunshinn
- @Kevinjohn
- @lexs
- @nynexman4464
- @rubyycheung

---

# 0.4.7

#### 问题修复

- BottomSheet：非模态 sheet 现在用自己的表面为 iOS 26 Safari 工具栏条带着色，而不是让页面从地址栏后面透出 (#5342)。
- BottomSheet：sheet 内部的点击就是点击，并且 sheet 会沿退出曲线离开 (#5326)。
  两个缺陷都表现为 "sheet 关闭时没有动画"——是在触摸版 DateInput 选择器上报的，它就是一个 Bottom Sheet。

  **sheet 内部的点击会启动一像素的拖拽。** sheet 主体携带下拉关闭处理器，它们会在_任何_向下移动时提升为 sheet 拖拽。手指从来不会完全静止，所以点击漂移的一两个像素就开始了拖拽——而实时拖拽会抑制面板的过渡，这是正确的，因为被拖动的 sheet 必须跟随手指而不是滞后于它。点击触发的关闭落在这个窗口内，因此 sheet 在没有过渡的情况下跳到了关闭位置。点击选择器的 Save 按钮每次都会命中这一点；点击遮罩则从不会，因为遮罩就是对话框本身，不武装任何手势。现在两种指针和触摸路径中的提升都需要 8px 的移动——常规的点击容差，远低于一次有意的下拉在其最初几帧覆盖的距离。该手势的过渡抑制也被限定为只对打开的 sheet 生效，因此它不会跨越退出过程。

  **退出运行在进入的曲线上。** `--ease-standard` 是 `cubic-bezier(0.24, 1, 0.4, 1)`，一条减速曲线：它立即消耗速度然后滑行。对进入合适，对退出不合适。在设备上测量（iPhone，真实 Safari），点击遮罩让 sheet 在 410ms 过渡的 59ms 内移出屏幕一半，163ms 内移出 90%，而暗色在之前就已消失——因此关闭在眼睛跟上之前就结束了。关闭状态现在携带自己的加速曲线，`cubic-bezier(0.3, 0, 0.6, 0.6)`：离开静止、积聚速度、在离开屏幕时最快，并在约 50ms 内移动，因此它读起来是一次离开，而不是犹豫一下然后瞬间消失。只有曲线改变——退出保持 `--duration-medium`，即进入的区间，这使它在按比例缩小动效规模的主题下仍然清晰可读（neutral 的 medium 是 300ms，而基础是 410ms）。

  遮罩随 sheet 一起离开：关闭期间，暗色使用 `linear` 而不是减速 token。淡出不覆盖任何距离，因此把它的进度前置只会让它提前结束——触摸日期选择器的表面切换已经携带了这一推理。`BottomSheetSwitcher` 在其流程关闭时也得到同样的处理；两个 sheet 之间的交接不是关闭，保持不变。

- `useListFocus` 在没有提供 `onEscape` 时不再吞掉 Escape。该 hook 曾在每次 Escape 上调用 `preventDefault()`——这是从方向键继承来的习惯，方向键共享该处理器并且需要它来抑制页面滚动——因此一个没有任何东西可关闭的列表仍然把按键标记为已处理，而一个遵从 `defaultPrevented` 的外围层（焦点陷阱、原生 popover）永远轮不到它。现在只有在传入 `onEscape` 时才会消费 Escape。Arrow、Home 和 End 的处理不变 (#5346)。
  行为变化：`AvatarGroup`、`ButtonGroup`、`Outline`、`Pagination`、`SegmentedControl`、`TabList` 和 `Toolbar` 不传 `onEscape`，因此在它们内部按下的 Escape 现在会到达外围层并可以关闭它——这正是修复的目的，但依赖该按键就此停住的宿主会注意到。`NavHeadingMenu` 在没有菜单关闭处理器渲染时也是如此。确实传了 `onEscape` 的菜单和浮出控件不受影响。`patch`，不是 `[breaking]`：吞掉按键从未是契约——该 hook 只把 Escape 记录为 "custom callback"，也没有组件宣传会消费该键。
- TabList：选中的 tab 现在携带 `aria-current="true"`——ARIA 通用的 "current item within a set"——而不是 `aria-current="page"`。条带是一个 `<nav>` 并且保持如此，但它用于原地切换视图的频率至少和用于导航一样高，而在那些用途中 `page` 断言了一个从未发生的页面变化。辅助技术之前会把选中的 tab 宣布为_当前页面_，即使什么都没导航；现在它会宣布为_当前项_，这在两种情况下都成立。带有 `href` 的 tab 仍然渲染为锚点并且仍然读作链接——它的当前标记只是不如以前具体。没有角色变化，也没有新 prop。(#5347)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @imdreamrunner

---

# 0.4.6

#### 新功能

- DateInput 适配指针：手指上使用触摸选择器，鼠标上使用文本字段
  (#5243)

  `DateInput` 一直是为鼠标设计的控件——一个可以输入的字段，旁边弹出日历。在手机或平板上这是错误的形态：弹出层是供拇指操作的桌面日历，而聚焦字段会召唤出键盘，遮住它本该填写的那个东西。

  同一个组件现在会在主指针为手指（`pointer: coarse`）时渲染第二个表面：一个底部 sheet，每屏显示一个月，可以横向滑动，头部标题后面有月份和年份滚轮用于滑动不擅长的远距离跳转，头部角落有箭头用于单步移动，每个目标的最小尺寸都是 44px。点击某一天就会立即提交并保持 sheet 打开，因此错误可以原地纠正；Save 关闭选择器，Reset 将其恢复到打开时的状态——无日期、当前月份。网格会溢出显示相邻月份的日期，弱化且不可选择，星期标题是三个字母而不是两个，两者都与桌面日历一致。

  月份和年份滚轮是一个在日历上方淡入淡出的层。日历本身从不淡出——它是被覆盖和揭开，因此唯一移动的东西就是正在到达的东西。该层携带自己的不透明背景，这正是让淡入淡出保持均匀的原因：它渲染为一张完成的图像，淡入淡出作用于这张图像，而不是让滚轮的半透明选中带按照自己的方式与实时网格合成。

  调用点没有任何变化。它是一个组件有两个表面，而不是两个组件——相同的 props、相同的值，没有新的导入，也没有需要编写的媒体查询。现有用法不受影响：使用鼠标时，渲染输出就是一直存在的那个控件。

  切换只取决于指针，故意没有宽度限制。`pointer` 意味着主设备，因此触摸屏笔记本电脑报告 `fine` 并保留可输入字段（它的键盘就在那里），而缩窄的桌面窗口仍然是鼠标。添加宽度测试只会重新排除平板，而平板正是拇指选择器最明显的情况。

  公开表面几乎没有变化：选择器头部和页脚增加了六个 `@astryx.dateInput.*` 目录键，仅此而已。没有新 props，没有新导出——`DateInputProps` 在 25 个条目上逐字节相同。

  其他内容一概不发布，这是有意的。没有强制使用某个表面的导出：触摸选择器只能通过处于触摸设备上来访问，而这也是唯一值得查看它的地方。切换使用的媒体查询是一个内部常量，不是导出——其他六个核心组件内联编写 `@media (pointer: coarse)` 而不是共享一个，也没有什么要求问同样的问题。选择器的两个尺寸（44px 的日期单元格、28px 的滚轮行）是编译时常量而不是主题变量——日期尺寸是无障碍下限，而主题可以悄悄调低的变量不是下限。而且 sheet 的头部按钮通过 `data-` 属性而不是主题目标来定位，因为没有什么要求重新设置它的样式。这些都可以在以后添加，而一旦发布就难以撤回。

  滚轮现在也能响应鼠标了。滚轮是一个滚动容器，因此手指可以免费平移它；鼠标什么也得不到，因为浏览器不会对溢出容器进行拖拽滚动——按下并拉动这个形状像可以旋转的东西的控件完全不起作用。现在可以用鼠标拖拽，并顺带修复了一个相关 bug：BottomSheet 从其主体上的 `pointerdown` 开始自己的拖拽，并为此捕获指针，因此过去点击一行滚轮时如果晃动超过一两个像素就不会选中任何东西。

- 导出 `useLocale` 和 `useCollator`，用于由 provider 支持的格式化和比较 (#5194)
- RadioListItem：`radio-list-item` 行主题目标现在携带 `size`、`selected` 和 `disabled` 状态变体（与 `multi-selector-option` 匹配），因此主题可以设置选中或禁用行的样式 (#5143)。
- RadioListItem：`radio-list-item` 主题目标现在附着在绘制行的元素上（与 `list-item` 趋同），因此主题可以设置该行的悬停背景、内边距和边框半径——此前它位于一个只负责布局、不绘制任何内容的包装器上。默认（未主题化）的行外观不变：它仍然是一个裸表面，没有行内边距、圆角或悬停/选中背景（只有单选指示器在悬停时着色）(#5143)。
- `Section`、`Stack`（以及 `HStack` / `VStack`）和 `Center` 接受针对四个边各自的 padding prop——`paddingBlockStart`、`paddingBlockEnd`、`paddingInlineStart` 和 `paddingInlineEnd`——因此某个边可以采用自己的间距步长，而无需使用 `xstyle` 逃生舱。`Section` 还获得了它缺失的 `paddingInline` 轴 prop，因此三个组件现在都暴露相同的七个 prop 的集合 (#5224)。
  每个 prop 接受与 `padding` 相同的间距比例，并且解析遵循最高特异性优先，按边：

  > 边 prop → 轴 prop（`paddingInline` / `paddingBlock`）→ `padding`

  边 prop 只改变自己的边，其他三个边保持不变。

  ```tsx

  <Section padding={6} paddingBlockStart={2}>…</Section>   // tight top, 24px elsewhere

  <Stack padding={4} paddingInlineEnd={0}>…</Stack>         // flush trailing edge

  ```

  内联 props 是逻辑属性，因此 `paddingInlineStart` 在 LTR 中是左边缘，在 RTL 中是右边缘。

  在 `Section` 上，匹配的 `--container-padding-*` 自定义属性会随 prop 移动，因此 bleed 子元素（`Table`、`Divider`、嵌套的 `Section`）能持续根据实际应用的 padding 进行补偿。

  现有代码不受影响：`padding`、`paddingInline` 和 `paddingBlock` 的行为与以前完全一致，其生成的类输出也不变。

- Selector：在下拉选项行上添加 `selector-option-row` 主题目标，携带 `size` 以及 `selected`/`disabled` 状态——因此主题可以直接重新设置行内边距和密度（与 `multi-selector-option` 对应），而不必用结构性选择器去够到裸露的 `role="option"` 元素 (#5179)。
- MediaTheme：添加 `mode="auto"` 和 `mode="off"` (#5299)
  主题可以自由地把 `--color-background-inverted` 定义成并非反转的颜色——而一个硬编码 `mode="dark"` 的组件就会在浅灰色背景上绘制白色文本，对比度只有 1.25:1。表面颜色是运行时值，而模式是编译时的猜测，因此组件再怎么小心也无法捕捉到它。

  `mode="auto"` 会测量浏览器实际绘制的表面，并应用主题自己的 `--color-on-dark` / `--color-on-light` 中在该表面上读起来更好的那个。没有阈值，也没有对比度目标：它在主题的两个答案之间选择，因此想要柔和配色的主题仍然能得到一个。判定某个表面_不需要_媒体上下文仍然是作者的抉择——这就是新的 `mode="off"`，它渲染相同的元素但不带媒体属性，因此子元素永远不会重新挂载。

  当无法从 CSS 得知背景色时——SSR 期间、客户端第一帧，以及最常见的情况：`background-image` 背后，其像素需要采样（参见 `useImageMode`）而不是计算样式——`auto` 会使用新的 `fallback` prop 而不是猜测。

  Toast 现在使用 `mode="auto"`，其以前的规则仅保留为该 fallback。每个原厂 Astryx 表面的渲染都与以前完全一致。

- Tooltip 和 HoverCard：在没有悬停的地方通过点击打开 (#5248)
  悬停是触摸屏唯一无法表达的一种触发方式，而这两个组件对此的处理都很糟。`Tooltip` 在任何报告 `(hover: none)` 的设备上都会抑制自己，因此它的内容——往往是一个图标按钮唯一的标签——在手机上根本无法访问。`HoverCard` 则完全不起作用：点击合成的 `mouseenter` 会在每次点击触发器时打开卡片，压在用户瞄准的控件上，而且没有任何手势能再次关闭它。

  两者现在都接受 `touchTrigger` prop，而触发器_做什么_决定了默认值。执行操作的触发器——按钮、链接、表单控件——在 `auto` 下保留其点击：层保持关闭，因为点击已经有地方可去，而关于用户刚刚操作过的控件的提示只是噪音。不执行任何操作的触发器——信息图标、缩写、被截断的标签——没有什么可失去的，因此点击会打开层，没有显示延迟（点击是决定，不是延迟所要过滤的悬停意图），并且在外部点击时关闭它。`tap` 和 `none` 明确表达选择；一个渲染为按钮的信息图标想要的是 `tap`，因为它在 DOM 看来像操作，而揭示该层是它唯一做的事。

  支持悬停的设备不受影响，混合设备也是如此：决定是按交互根据指针类型做出的，而不是按设备根据媒体查询一次性做出的，因此同一个触发器在鼠标下悬停打开，在手指下点击打开。按照同样的规则，触控笔是悬停设备——探测范围内的笔会在没有接触的情况下触发悬停事件，因此它悬停时打开层，只有落下的笔才算作点击。这两个层也不再会因为点击留下的焦点而打开——这是点击可能埋没它所激活的控件的第二种方式，而在 `Tooltip` 上受到影响的是被点击的文本字段，因为它们按设计匹配 `:focus-visible`。

  [fix] InfoTip（lab）：选择启用 `touchTrigger="tap"`。它的触发器是真正的按钮，因此 `auto` 规则会把点击交给控件——但揭示工具提示是那个按钮唯一的目的，抑制它会让 InfoTip 的内容在手机上无法访问。

#### 问题修复

- Avatar：状态元素现在通过 context 向 avatar 报告自己的可访问标签，因此用你自己的组件包裹 `AvatarStatusDot` 时，状态仍会保留在 avatar 的可访问名称中（"Jane Doe, Online"），而不会悄悄丢失——`role="img"` 根会剪除后代语义，因此组合进去是到达辅助技术的唯一途径（WCAG 4.1.2）。直接从传入的元素读取 `label` 仍然有效，并且仍然在首次渲染时解析。没有 `name`/`alt` 的交互式 avatar（`href`/`onClick`）会在开发环境中发出警告，而状态标签不再算作控件的身份："Online" 读起来像合法的名称，却完全没有说明链接通往哪里。派生的 `role`/`aria-label`/`aria-hidden` 现在在透传 props 之前展开，遵循 Icon，因此消费者自己的值优先。无 API 变化 (#5034)
- AvatarGroup：组件审计发现的四个缺陷，其中三个在 `AvatarGroupOverflow` 中 (#5055)。
  指示器在 span 上使用了 `display: flex`，这是一个块级 flex 容器，因此导出的组件在 `AvatarGroup` 之外渲染为全宽条而不是圆形：在 1168px 的父容器中测得宽度为 1168px。现在改为 `inline-flex`；在组内没有任何变化，因为 flex 项无论如何都会被块化。

  它的标签字号是裸露的 `size * 0.35`，在 `xsm` 下计算为 7px，在 `sm` 下为 8.4px。这低于 12px 的可读性下限，而且实际效果比数字更糟：字形笔画最终比一个像素还细，因此永远达不到自己的文本颜色。从截图中解码，`xsm` 下最暗的像素是在 `#f0f0f0` 背景上的 `#bebebe`，对比度为 1.63:1，而要求是 4.5:1。尺寸现在以下限为 `--text-supporting-size` 角色 token，并在其上按比例缩放，因此 `md` 及更大尺寸不变。

  指示器在作为组的第一个子元素时仍然保留其负重叠边距，悬挂在组自身盒子外 12px。它现在带有 `Avatar` 已经具备的相同 `:not(:first-child)` 防护。而负的 `count` 会渲染字符串 `+-3` 并宣布 "-3 more"；由于该 prop 的文档形状是 `total - visibleCount`，当列表比切片短时就会变成负数，因此现在会在零处钳制。

  文档：指南告诉读者 "set max to limit visible avatars"，但并没有 `max` prop。API 有意采用组合式设计，因此由消费者进行切片；指南现在说明了这一点。键盘行为现在指明它实现的 APG roving tabindex 技术，而 `size` 现在说明组的值优先于每个子 avatar 自己的 `size`，包括组让其保持默认值的情况。

- Blockquote：`cite` 归属渲染为裸露的 `<cite>`，而不是被包裹在 `<footer>` 中——后者会成为 `contentinfo` 文档地标。还用 `isRenderable` 守卫该槽，因此 `cite={condition && author}` 不再输出空的 `<cite>`，并且会换行长的不间断单词而不是溢出 (#5144)。
- Bottom Sheet：让拖拽手柄浮动，使内容更靠近顶部 (#5222)
  sheet 内容上方的拖拽区域在 sheet 的 flex 列中是一个 48px 的行，把它下面的一切按其完整高度下推，并在第一行内容上方读作一条空带。

  现在该条为 24px 并浮在内容之上：滚动区域从 sheet 的顶部边缘开始，向上延伸到药丸下面，因此标题距离顶部近了 24px。药丸高 4px，在该带内居中，因此它只占据距边缘 10-14px——位于内容包装器已经提供的顶部内边距之内——而其背后的表面渐变让它在任何位于或滚动到其下方的内容上仍然可读。

- BottomSheet：让 sheet 对着遮罩呈现统一的边缘。深色模式下有两处问题。sheet 没有绘制自己的边缘——表面和遮罩只相差几个 RGB 级，而 `--shadow-high` 投影在近黑上是黑色，因此左右边缘不可见（深色下测得边界对比度 1.16:1，而浅色下为 2.89:1）；它现在在其三个朝向遮罩的边缘携带 `--border-width` / `--color-border` 细线，与 MobileNav 为其朝向遮罩的边缘使用的处理相同。而在一个把内嵌环塞进 `--shadow-high` 的主题下（每个内置主题都会在深色模式下添加一个），该环被诸如 `Section` 这样的不透明内容包装器覆盖，因此它只在内容结束处的下方间隙中显示，侧边看起来在中间某处改变了宽度；现在滚动主体在整个 sheet 内部盒子上绘制表面，均匀地隐藏该环 (#5305)。
- Breadcrumbs：按钮面包屑保留链接的垂直内边距，变体到达项主题目标，交互式面包屑绘制共享的焦点环 (#5332)
- DateInput 的触摸日历不再停在两个月之间 (#5319)
  在 iOS 上滑动月份日历可能会让它停在窗格内几列的位置：左边是三月、右边是四月，同时在屏幕上，位于一个 Sun 到 Sat 的方形表头下，而标题仍写着三月。网格从未倾斜——只是滚动端口停在没有任何月份开始的位置。

  `scroll-snap-type: mandatory` 本该让这种情况不可能发生，而在静态列表上它确实做到了。这个列表是虚拟化的：一千二百个窗格中只有七个存在，而窗格本身就是吸附区域，因此手指划过的每个月都会在快速滑动仍在进行时挂载一个并卸载另一个。iOS 在主线程之外滚动——它从当时已知的吸附点中选择落点，而之后到达的 React 重新渲染会移动它们。滚动器停在一个曾经的吸附点处，没有任何东西重新吸附它。Chrome 从不出现这个问题，因为它会在变更后重新吸附。

  现在会纠正静止位置而不是信任它：一旦手势真正结束——触摸释放、滚动器安静，且其偏移在一帧内确认不变——一个偏离窗格边界的滚动器会被移动到最近的边界。浏览器自行吸附的滚动器保持不动，因此在 Chrome 上不会发生额外的事情，而分数视口上的亚像素漂移会被忽略。

  最后一个条件是防止该修复变成比它所修复的 bug 更糟的 bug。安静期不是静止的证明：iOS 在手指抬起后会运行自己的吸附动画几百毫秒，并在此期间不规则地触发滚动事件，因此只信任安静的纠正可能落在动画中途，把仍在向下一月行进的偏移舍入回它来的月份，并逆转滑动。

- 禁用元素对指针以 `default` 响应，绝不是交互式光标。core 和 lab 中的每个 `cursor` 都携带 `':is(:disabled,[aria-disabled="true"])': 'default'`，而 reset 会给任何未声明光标的禁用元素同样的光标——包括 `[aria-disabled]`，它以前什么也得不到。一条 lint 规则和对每个故事进行的 Chromium 扫描会保持这一点。被 `pointer-events: none` 封住的禁用元素不变：指针永远到不了它们那里，因此它们的光标来自祖先——这就是为什么保证是 `default`，而不是库只能给其中一部分元素绘制的专用禁用光标 (#5323)。
- 禁用元素不再绘制悬停状态：core 和 lab 中每个自身的 `:hover`，以及主题编写的每个 `:hover`，现在都携带零特异性防护 `:hover:where(:not(:disabled,[aria-disabled="true"]))`，因此现有覆盖的权重与以前完全一致。一条 lint 规则和对每个故事进行的 Chromium 扫描会保持这一点 (#5247)。
- InputClearButton：清除（✕）控件现在在触摸设备上满足 WCAG 2.5.8 AA 的 24×24 最小值。共享按钮渲染 20px 字形和 20px 点击目标，因此通过它清除的每个输入——Typeahead、Tokenizer、FileInput 及该家族其余成员——在手机上都不达标。一个 `::after` 覆盖层现在把可点击区域扩大到 24×24，置于 `@media (pointer: coarse)` 之下：在精细指针上根本不生成覆盖层，因为鼠标足够精确，无条件的覆盖层可能在密集的桌面布局中与相邻控件重叠，而且覆盖按钮的覆盖层会夺走 `astryx-input-clear-icon` 主题目标的悬停。视觉字形在每个断点都不变，覆盖层止于 24px，因此与 8px 的装饰间隙和输入框自己的光标区域保持距离 (#4956)。
- MobileNav：抽屉现在在打开时滑入，而不是只在关闭时滑出。需要两件事，缺一不可。首先，对话框在关闭时是 `display: none`，因此抽屉第一帧渲染时已经持有屏幕上的 transform，过渡没有可用的 before-change 值——`@starting-style` 为抽屉的 transform 和 `::backdrop` 的 opacity 提供了它。其次，对话框用 `overflow: hidden` 裁剪屏幕外的抽屉，这使它成为滚动容器；顶层中的滚动容器如果其子树还持有另一个滚动器（抽屉的内容区域），在 Chromium 中不会为其后代绘制 `@starting-style` 进入过渡——过渡在 CSSOM 中推进，而每个绘制帧都显示结束值。`overflow: clip` 同样裁剪而不创建滚动容器。抽屉现在从自己的边缘滑入（RTL 下镜像），遮罩淡入，两者都使用 `--duration-medium`，并且都在 `prefers-reduced-motion` 下折叠，与关闭时的行为完全一致 (#5218)。
- NumberInput：数字步进器列现在跟踪主题化的 padding 和 radius，而不是假设默认值。主题化 `number-input` 的 padding 会让步进器与字段边缘之间出现间隙（上下各一段），而主题化的 `borderRadius` 会让字段变圆角，但步进器角落仍保持默认半径。包装器的 padding 现在经过共享容器扩展，因此主题以任何写法写出的值都能被拾取——`padding: 14px 20px`、`paddingBlock` 或单个 `paddingBlockStart`——包装器和列都读取生成的逐边 `--astryx-number-input-padding-*` token；不对称的 `paddingBlock: 4px 12px` 在每个边缘都能正确抵消。主题化的 `number-input` borderRadius 现在也会到达 `--_field-radius`，列的外角随之变化。默认逐字节相同，并且对无步进器情况和所有其他输入都不产生影响 (#5181)。
- 在每个 overlay 边界停止容器 padding 系统。是 #5209 的后续，该 PR 在四个 overlay 根上把 `--container-padding-*` 归零，并关闭了 #5208 中的可见溢出 (#5231)。
  还剩下两个缺口。后代_添加_的变量（`--layout-padding-*` 以及 Section 传播的 padding）仍然跨越边界，因此 overlay 内一个未设置 padding 的 `Section` 会采用页面的 padding 而不是主题默认值——本应是 16px 的地方变成了 40px。而且 `Lightbox`、`ContextMenu` 和 `HoverCard` 从未被覆盖。

  重置现在位于一个地方（`overlayPaddingReset`，从 `@astryxdesign/core/Layout` 导出），而不是每个 overlay 手工复制，并移到了 `useLayer` 根上，一次性覆盖每个层表面。后代_减去_的值归零；它们_添加_的值被清除为 `initial`，使读取者落到自己的默认值，而不是丢失 padding。

  Section 的 padding 传播从公开的 `--astryx-section-padding` token 移到私有的 `--_section-padding-propagated`。两者在同一个名称下承载不同的权威——主题的值与某个祖先的值——而 overlay 无法在不把主题值清空的情况下删除继承的值。传播值对嵌套 section 仍然胜过主题，因此行为不变。主题不受影响：`--astryx-section-padding` 仍然是公开 token，并且仍然能到达 overlay 内部。

- 主题化：物理的 `paddingTop`/`paddingBottom` 现在会到达容器 padding 扩展，因此 `card`、`dialog`、`section` 和 `number-input` 会像跟踪逻辑写法那样跟踪它们。物理块方向长写不匹配扩展识别的任何 padding 属性名，因此它原样落到元素上，而组件的内部仍读取默认值——NumberInput 的步进器列比字段边缘短了约 10px，容器 bleed 也按错误的量补偿。混合写法比任何一种单独情况更糟：`padding: '10px'` 加 `paddingTop: '14px'` 在 token 中公布 10px，而元素绘制 14px。`padding-top` 和 `padding-bottom` 在每个水平书写模式下_就是_块边缘，因此这种规范化不假设方向。`paddingLeft`/`paddingRight` 有意保持不变：它们是方向相对的——left 在 LTR 中是 inline-start，在 RTL 中是 inline-end——而 token 被逻辑属性消费，因此路由它们会在 RTL 下悄悄把 padding 移到相反的边缘。它们保持其物理含义，与以前完全一致 (#5244)。
- `DateInput`、`DateTimeInput`、`DateRangeInput` 和 `Calendar` 现在使用环境中的 `InternationalizationProvider` locale 来格式化和解析日期，而不是宿主/浏览器 locale。`plainDateFormat`（支撑 `formatSharedDate`）之前调用 `Intl.DateTimeFormat(undefined, ...)`，而 `dateParser` 对歧义数字输入（例如 `3/4/2026`）的日/月消歧启发式则完全不传 locale 调用 `Intl.DateTimeFormat()`，因此一个包裹在非英语 `locale` 中的树仍然使用宿主 locale 来格式化和解析日期 (#5120)。
- 使用 InternationalizationProvider 的 locale 来处理排序、格式化和语音默认值 (#5195)
- RadioListItem：整行现在都是点击目标。点击描述——或行悬停区域中的空白——都会选中单选按钮，与 CheckboxListItem 一致。此前只有单选按钮及其标签文本响应，因此描述和周围的整行都是死区。该行把表面点击委托给单选输入（每个选项保留一个 Tab 停靠点），单选按钮通过 `aria-label` 保持其可访问名称 (#5143)。
- 在 overlay 元素（`BottomSheet`、`Dialog`、`MobileNav`、`Popover`）上重置容器 padding 自定义属性，防止嵌套的 `Section` 组件继承祖先的 section padding (#5209)。
- ResizeHandle：拖动高柄的下半部分再次有效。不可见的抓取区域沿手柄拉伸，但把它偏置到药丸上的偏移量也带有药丸自己的 `-50%` 居中位移——因此该区域滑到了分隔线外半个手柄长度。在 1440x900 的满高面板上，16x900 的命中盒位于 y=-434，药丸中心以下的一切都是死区：在可见手柄的中心或任何更低位置按下指针完全不会开始拖拽。死区随面板增大，而且同样的位移让垂直手柄上的抓取区域横向偏出。现在偏置只沿药丸的轴移动该区域 (#5198)。
- 当浏览器有经典滚动条时，打开 Dialog、BottomSheet、Lightbox 或 MobileNav 不再让页面横向偏移 (#5219)
  锁定背景滚动会隐藏文档的滚动条。在滚动条占用布局空间的地方——Windows/Linux 桌面，以及设置为始终显示滚动条的 macOS——隐藏它会让布局视口按它的宽度（约 15px）变宽，因此整个页面在 overlay 后面横向重排，关闭时再回来。

  两个滚动锁现在都在锁定期间用 `scrollbar-gutter: stable` 保持该间隙，这既能让 `position: fixed` 的 chrome（粘性头部、toast 视口）保持不动，也让流内内容保持不动。没有占空间滚动条的页面，以及已经自行设置 `scrollbar-gutter` 的页面，保持不变。不支持 `scrollbar-gutter` 的引擎回退到按测量差异添加 padding。

- SegmentedControl：把项标签保持在一行，用省略号截断溢出而不是换行成多行 (#5035)
- Selector：`SelectorOptionData` 新增 `description`，关闭的触发器现在显示选中的选项而不仅仅是它的标签。`SelectorOption` 绘制的两行选项行无法从 `options` prop 到达——数据类型只携带 `value/label/disabled/icon`——因此消费者保留一个按值索引的描述侧表，并通过 `renderOption` 重新渲染该行。`description` 现在位于选项数据上，`DefaultOption` 会转发它。在触发器上，选中选项自己的 `icon` 会在关闭状态渲染（设置时 `startIcon` 仍然优先，因此固定的字段图标永远不会重复），这淘汰了应用侧用 `startIcon={value === 'x' ? … : …}` 镜像组件已经知道的状态。`renderValue` 是你自己绘制选择的接缝——包括描述 (#5202)。
  [feat] Item：新的 `layout` prop——`'stacked'`（默认，不变）或 `'inline'`，后者让描述留在标签行上，描述先省略。内联行让两行居中而不是共享基线：两种字号在同一基线上会让行盒比任何一行都高，这会把固定高度的宿主推离其尺寸 token。每个基于 `Item` 构建的行都获得该轴，包括 `SelectorOption`。

  [fix] Selector：触发器按 padding 而不是固定高度来确定尺寸，因此单行值使用 `--size-element-*` token（28/32/36），两行值则正好高一个文本行（48/52/56）。token 和文本行都是 4 的倍数，因此每个触发器都落在 4px 节奏上，并与旁边的 Button 和输入框对齐——没有 prop 选择高度，内容决定高度。它以前在传入 `renderValue` 时把固定高度换成最小高度，以 prop 是否存在为键，而不是内容是否需要空间：单行值在_每种_尺寸下测得 39px，两行值 58px，因此 `size` prop 完全不再影响触发器。在 `InputGroup` 内，组固定了该行，放松的高度不起作用，内容从自己的边框渗出 4px。现在组拥有该行，触发器把自己的值盒钳制到它，因此调用方绘制的任何内容都不会覆盖上下行：`SelectorOption` 折叠为一行并省略，任何其他节点在行的边缘处被截断。触发器也不再在那里断言自己的高度下限，因此一个尺寸大于其组的控件——`<InputGroup size="md">` 包裹 `size="lg"` 控件——会坐在组的行内而不是撑大它。触发器的行盒固定到同一个 token 而不是比例，因此粗指针字号提升——以及任何更改 `--font-size-base` 的主题——会增大字形而不让控件离开其尺寸 token。

- `Slider` 在 `orientation="vertical"` 时现在获得与水平方向相同的 24px 触摸命中区域：它的轨道在粗指针上仍然只有 20px 宽，低于 WCAG 2.5.8 AA 最小值。两个方向的整个轨道都是点击目标——把水平轨道块尺寸设下限的修复对垂直轨道毫无作用，因为它的短轴是内联轴——因此内联尺寸现在在触摸时以下限 24px，并使用相同的 `@media (pointer: coarse)` 门控。轨道、填充、标记和滑块都在内联 50% 处居中，因此没有任何可见内容移动，桌面也不受影响 (#5173)。
- `@astryxdesign/core/theme/syntax` 再次可以从服务端组件导入：预设是数据，不是客户端引用 (#5076)。
  该子路径的 barrel 携带 `'use client'`，而它是 syntax 模块唯一的入口点。因此 React 会把服务端导入方的每个导出都替换为客户端引用——包括 `dracula`、`oneLight`、`allSyntaxPresets`、`syntaxTokenDefaults` 和 `defineSyntaxTheme`，这些都不需要边界。在 Next.js 服务端模块中读取预设（推导代码块底色、在构建时生成主题 CSS）得到的是代理而不是数据，因此 `preset.tokens` 为 `undefined`，故障出现在离原因很远的地方——同样的导入在普通 Node 下完全正常。

  该指令现在只位于 `SyntaxTheme.tsx`，即真正需要它的 provider，因此 `SyntaxTheme` 和 `useSyntaxTheme` 保持其客户端边界，而数据导出作为数据解析。无 API 变化。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @ernestt
- @freddymeta
- @Geervan
- @HelloOjasMutreja
- @imdreamrunner
- @nynexman4464
- @rubyycheung

---

# 0.4.5

#### 新功能

- BottomSheet：`snapPoints` 让拖拽调整大小的停靠点由宿主选择。停靠点是 sheet 的可见高度，写作视口分数（`0.5`）、百分比（`'50%'`）或 px 长度（`'320px'`）——与 `height` 匹配，其中裸数字也是 px，字符串携带其单位。分数和百分比会在视口变化时重新解析，因此 sheet 在旋转后仍保持用户选择的停靠点，而在静止的 sheet 下更换这些点会以同样的方式重新锚定它。四分之一 sheet 或更小的停靠点是 peek：它会滑走而不是重排成一条细缝，并让遮罩变薄。更高的停靠点是工作表面，因此它们会布局内容并保持遮罩完整——此前最短的停靠点总是 peek，这会削弱半高 sheet 的背景 (#5203)。
  行为变化，有意为之且非破坏性：每个 sheet 以前都携带三个内置停靠点（视口的 14%、50% 和 92%），因此拖拽可能让它停在宿主从未要求的某个位置。现在除非 `snapPoints` 另有说明，sheet 只会打开和关闭；传入 `snapPoints={[0.14, 0.5, 0.92]}` 以保留旧停靠点。没有移除或重命名任何 prop、类型或 DOM 输出，滑动关闭、高度预算和移动键盘适配均不受影响。
- Astryx 提供了另外 28 个 locale 的翻译。`packages/core/locales/` 从 `en` 和 `fr-FR` 增加到 30 个文件——阿拉伯语、加泰罗尼亚语、中文（简体和繁体）、捷克语、丹麦语、荷兰语、芬兰语、德语、希腊语、希伯来语、匈牙利语、意大利语、日语、韩语、挪威语、波兰语、葡萄牙语（巴西和葡萄牙）、罗马尼亚语、俄语、塞尔维亚语、西班牙语、瑞典语、土耳其语、乌克兰语、越南语和南非荷兰语——覆盖组件宣布或显示的每条 `@astryx.*` 消息 (#5185)。
  除非你要求，否则没有任何变化：`InternationalizationProvider` 仍然默认英语，目录通过现有的 `./locales/*.json` 导出加载。已经传入 `locale` 的应用现在会得到翻译后的组件字符串，而以前会回退到英语。

  这些目录来自 Crowdin，每晚刷新 (#5186)，因此上游落地的翻译无需任何人手动打开 PR 就能进入发行版。

- DateRangeInput / Calendar：添加 `maxRangeSpan` 和 `minRangeSpan` 来约束所选范围的大小。一旦选择开始日期，允许窗口之外的日期就会被禁用——例如 `maxRangeSpan={7}` 使范围保持在开始日期起 7 天的窗口内 (#5145)。
- FormLayout：添加 `defaultOptionality`——设置表单范围的默认值（`'optional'` 或 `'required'`），以便只有例外项携带可见指示器。在 `'optional'` 下只有 `isRequired` 字段显示指示器；在 `'required'` 下只有 `isOptional` 字段显示；重申默认值的字段不显示任何内容。在 `'required'` 下，未标记的字段还会暴露 `aria-required`，使屏幕阅读器与视力正常用户看到的一致——仅解析为 `aria-required`，绝不是原生 `required` 属性。未设置时保持当前的逐字段行为 (#4791)。
- 在共享清除按钮包装器上添加 `astryx-input-clear-button` 主题目标。主题现在可以独立于其他 ghost button 控制清除按钮的高度和悬停——例如抑制悬停填充或匹配不同的元素尺寸比例 (#5093)。

#### 问题修复

- BottomSheet：在 iOS 上，从滚动区域向上拉动现在会展开 sheet。在最高档位以下，在内容内部向上拖拽在真机上毫无作用，而拖拽手柄却有效——sheet 接管了手势然后在剩余拉动中冻结。iOS Safari 为手指触发的 PointerEvents 使用与 `Touch.identifier` 相同的数字 id，因此触摸路径开始的拖拽被键控到一个活动指针：`beginDrag` 捕获了该指针，WebKit 直接把捕获交还，而一毫秒后的 `lostpointercapture` 取消了拖拽。触摸驱动的拖拽现在被标记为如此——它们不进行指针捕获，并且同一手指的 `lostpointercapture`、`pointercancel` 和 `pointermove` 不再取消、结束或双重驱动它们。保持两个 id 空间分离的浏览器从未受影响，这就是为什么这只在真机上出现 (#5178)。
- Calendar 星期标题现在使用所选 locale 的紧凑 CLDR stand-alone-short 名称，同时保留现有的 `Su` / `Mo` / `Tu` 英语标签。
- 在 Markdown 标题上渲染生成的 id 属性，使 Outline 哈希链接能滚动到其目标。标题 slug 现在来自与 parseOutlineFromMarkdown 共享的解析器辅助函数，而 components.heading 覆盖会接收生成的 id (#4765)。
- StatusDot：添加 `icon` prop 以与 `AvatarStatusDot` 保持 API 对等——一个可选的 ReactNode，居中渲染在 8px 圆点中，用圆点的 `currentColor` 墨色绘制；布尔值和空渲染会被忽略，因此 `cond && <Icon />` 保持安全。每个变体现在把其底板与专用墨色配对（`--color-on-*`，Badge 的先例），使传入的图标保持清晰可读——特别是黄色底板上的固定深色 on-warning 墨色，浅色表面墨色在那里只有接近 2:1 的对比度。按设计评审意见，圆点本身有意保持为纯彩色信号：在 8px 下，内置的逐变体字形在纸面上满足 WCAG 1.4.1，但并非真正可读，因此在上下文中让状态可访问（二元信号、可见标签、`icon` 或可访问的替代方案）是构建者的责任——参见 StatusDot 使用指南 (#4373)。
- `Table` 的行展开 chevron 现在在 RTL 下正确镜像。它以前在展开时旋转完全不做 RTL 处理，因此方向性字形无论文本方向如何都指向同一方向，现在与 `TreeListItem` 的 chevron 已经使用的模式一致 (#5153)。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @athz
- @bhamodi
- @cixzhang
- @freddymeta
- @HelloOjasMutreja
- @imdreamrunner
- @jiunshinn
- @nynexman4464

---

# 0.4.4

#### 新组件

- 将 `BottomSheet` 和 `BottomSheetSwitcher` 从仅限 canary 的 Lab 包提升到 Core。稳定包现在包含它们现有的原生对话框、拖拽档位、过渡和移动键盘行为，以及 Core 文档和示例 (#5080)。

#### 新功能

- `astryx template --cdn` 会写出一个可用的无构建步骤 CDN 起始页面 (#5068)。
  CDN 起始页是一个模板，因此它加入模板家族中的 `--skeleton` 旁边，而不是占据一个顶层命令。它是一个标志而不是位置参数 `astryx template cdn`，因为位置参数会针对 `discoverAll()` 找到的所有内容解析，而 `cdn` id 会遮蔽已发现的模板。`cdn.template.html` 从 jsDelivr 和 esm.sh 加载 Astryx，无需打包器、无需安装、无需构建步骤，每个 CDN URL 都固定到你已安装的 Astryx 版本——未固定的 CDN URL 会解析到最新版本并被强缓存，因此今天写好的页面明天就会坏掉而无需编辑。现有文件永远不会被覆盖；`--overwrite` 会替换它，`--json` 返回回执。

  这些注解是关键且缺失时会静默失败的东西：`?external=react,react-dom`（没有它 esm.sh 会打包第二个 React，每个 hook 都会抛出 `Cannot read properties of null (reading 'useState')`）、导入映射中的 `react/jsx-runtime`（发布的 bundle 会导入它；省略它会让页面失败并提示 `Failed to resolve module specifier`），以及 `body` 上的 `font-family`（样式表中没有任何东西设置文档字体，因此 `Button`——它是 `font: inherit`——否则会用浏览器的默认衬线字体渲染其标签）。

  在基于它构建真实应用的过程中还得到了另外三条教训。页面现在从 Google Fonts `<link>` 主题的 webfont，因为主题_命名_了 Figtree 但从未加载它，所以每个查看者都悄悄得到了回退字体栈（再次参见 #5015）。它导入主题对象并包裹在 `<Theme theme={neutralTheme} mode="system">` 中，因此浅色和深色跟随操作系统——单靠 `data-astryx-theme` 属性只能限定样式表的作用域，无法切换模式。而且 `#root:empty` 携带一个 "Loading…" 状态，因为从 CDN 加载 ESM 有真实的延迟，空白页面读起来像坏了。标记使用 `htm`，并附有注释说明它是可选的，`createElement` 是无依赖的替代方案。

  只被阅读的配方只是被假定可用的配方，因此 CI 会渲染它：`.github/scripts/cdn-template-smoke-test.mjs` 用真实 CLI 搭建页面并在无头 Chromium 中打开它，任何控制台错误、页面错误或失败请求都会失败，任何加载了但没有渲染的页面也会失败。

- DateTimeInput：暴露 `date-time-input-toggle-icon`（日历字形，带打开/关闭 `state`）和 `date-time-input-clock-icon`（前导时间字形）主题目标，使主题可以设置前导图标的大小和颜色——与 DateInput 已经提供的 `date-input-toggle-icon` 接缝匹配 (#5148)。
- `defineTheme`：`color.accent` 接受 `[light, dark]` 元组 (#2279)
  `ColorScaleConfig.accent` 现在接受单个十六进制值或 `[light, dark]` 元组，与 `TokenValue` 匹配。使用元组时，`expandColorScale` 从浅色种子的调色板推导每个生成的 `light-dark()` 对的浅色半部分，从深色种子推导深色半部分，因此每个方案都获得一致的派生调色板（muted、on-accent、中性色），而不是使用跳过比例生成的 `tokens['--color-accent']` 变通方案。单字符串配置保持不变，逐 token 相同。还记录了 accent 派生值在 `color` 和 `tokens` 之间的优先级：`tokens` 条目逐 token 获胜，`var(--color-accent)` 引用 token 在运行时跟随 `--color-accent` 覆盖，而烘焙的 `--color-on-accent` 保持从 `color.accent` 种子派生。

#### 问题修复

- Banner：`endContent` 在狭窄头部会换行到自己的一行，而不是把标题挤成每行一个词 (#5116)。
- BottomSheet：滚动到 sheet 内容末尾并继续拉动的滑动现在会展开 sheet，而不是在最后一行戛然而止。交接以前在手指落下时一次性决定：从内容中途开始的手势在整个生命周期内都保持为滚动，因此自然动作——向上滑过列表、到达底部、继续拉动——永远到不了 sheet。现在到达内容末尾就足够了。sheet 锚定在内容耗尽的位置，因此只有越过它的行程才会移动 sheet，而当手指回来或没有更高的档位可展开时，拉动留给内容 (#5172)。
- BottomSheet：当 sheet 已经完全展开时，在滚动内容底部向上拉动不再劫持手势。它以前会交接给没有可展开目标的 sheet 拖拽，产生橡皮筋效果，松手后立即弹回，而且——因为交接吞掉了剩余手势——让内容无法滚动直到手指抬起，因此往回下拉会折叠 sheet 而不是滚动。现在底部边缘只存在更高档位时才会交接 (#5161)。
- BottomSheet：停在档位上的 sheet 现在会跟随视口。它的档位在手势时解析为像素，之后从不重新审视，因此旋转设备或调整窗口大小会让 sheet 冻结在旧几何形状上——一个半高 sheet 覆盖了更矮窗口的四分之三，而一个 peek 档位下滑可能完全超出新视口，留下一个屏幕上没有 sheet 的模态对话框。吸附分数现在也从布局视口读取，因此移动键盘不再把它正在测量的 sheet 下方的档位移走 (#5159)。
- BottomSheet 在移动键盘显示浏览器自行聚焦的字段时保持页面不动 (#5158)
- 屏幕阅读器播报现在可本地化。MultiSelector、Selector、Typeahead、FileInput、Tokenizer 和 Lightbox 用硬编码英语播报了几条 live-region 消息——选择和结果计数、文件选择、token 添加/移除以及图库位置——因此在 `InternationalizationProvider` 下它们仍保持英语。它们现在像其余 UI 一样通过消息目录解析，计数使用 ICU 复数而不是追加英语 "s"，因此具有其他复数规则的 locale 也能正确读取 (#4920)。
- `Selector`、`MultiSelector`、`Typeahead`、`DateInput`、`DateTimeInput`、`TimeInput` 和 `NumberInput` 中的可编辑文本字段不再把提交或取消 IME 组合（韩语/日语/中文输入）的 keydown 误读为命令。此前组合中的 Enter 会选择/切换高亮的选项或提交输入的日期，组合中的 Escape 会退出 `Typeahead` 的编辑模式，组合中的方向键会步进时间或数字值——所有这些都发生在组合完成之前。每个字段现在都让 IME 先完成，与 `BaseTypeahead` 和 Chat 编辑器已经存在的防护一致 (#4908)。
- MobileNav：保持抽屉渲染直到原生对话框实际关闭 (#4290)
  `display` 由 `isOpen` prop 驱动，它在提交期间翻转，而 `dialog.close()` 只在之后从 effect 中运行——因此每次关闭都会在一个已经 `display: none` 但仍打开且仍在顶层中的对话框上调用 `close()`，而一个打开的模态对话框无论是否渲染都会阻塞整个文档。Safari 26.1 从未解除阻塞，使页面保持 inert 且没有 JavaScript 错误。`display` 现在通过 `transition-behavior: allow-discrete` 参与过渡，包括当 React 的 `<Activity mode="hidden">` 在 AppShell 中隐藏抽屉时，而卸载关闭移入自己的 effect，因此延迟关闭不再被自己的清理打断。关闭延迟派生自实际生效的 hold 而不是假设值，因为该 hold 是 `--duration-medium`——一个主题值，而随附的 y2k 主题恰好把它设为延迟过去硬编码的 250ms。
- 带有 `isLabelHidden` 的 `Switch` 不再保留标签间隙。隐藏的标签是 `sr-only`，但它的包装器仍然是 flex 项，因此该行仍然在旁边绘制 8px 间隙：字段盒比它包含的轨道宽 8px，而隐藏标签的开关在每条相邻控件对齐的边缘内缩进了 8px。现在间隙随标签一起折叠，因此字段的宽度正好与绘制的轨道相同——与已经这样做的 `CheckboxInput` 匹配 (#5112)。
- 输入框（`statusVariant="tooltip"`）：可聚焦的状态按钮现在在 `TextArea` 内部悬停时打开其工具提示，后者的绝对定位尾部槽是 `pointer-events: none`。键盘焦点已经有效；指针悬停之前无效 (#5147)。

#### 其他变更

- 清除 Bottom Sheet 提升中可机械修复的 ESLint 抑制：`BottomSheet` 和 `BottomSheetSwitcher` 现在使用 React 19 context API（`<Context>` 作为 provider、`use()`），面板去掉了重复的 body-element ref，改用 gesture hook 已经跟踪的那个，而 `useSheetGestures` 通过共享的 `useMediaQuery` 订阅读取 `prefers-reduced-motion`，因此打开的 sheet 会跟随偏好变化 (#5155)。
- 移除 UMD bundle——它无法与这个包支持的任何 React 一起工作 (#5068)。
  `dist/astryx.umd.js` 不再构建或发布，随之而去的是 `unpkg` 和 `jsdelivr` 包字段、`./astryx.umd.js` 导出以及 `build:umd` 步骤。

  没有人需要迁移，因为从来没有可工作的配置可供迁移。该 bundle 把 Astryx 绑定到 `window.React` 和 `window.ReactDOM`，而 React 19 不发布定义它们的构建："UMD builds removed: To load React 19 with a script tag, we recommend using an ESM-based CDN such as esm.sh." `https://unpkg.com/react@19.2.0/umd/react.production.min.js` 是 404，而 18.3.1 是 200。我们的 `peerDependencies` 是 `react >= 19.0.0`，因此每个受支持的 React 都没有供 bundle 绑定的全局变量——它记录了一条从来没有入口的路径。

  如果你一直用更旧的 React 加载它，请改为以模块方式加载相同的组件：为 `react`、`react/jsx-runtime`、`react-dom`、`react-dom/client` 和 `@astryxdesign/core` 准备导入映射（固定版本，带 `?external=react,react-dom`），然后一个 `<script type="module">`。`astryx template --cdn` 会为你写出该页面，固定到你安装的版本并带有注解；该配方也位于核心 README 的 "No build step (CDN)" 下。

- `isImeKeyEvent`——阻止把 IME 组合按键读作命令的防护——现在位于 `@astryxdesign/core/utils`，与其他纯辅助函数放在一起，其两个信号的推理写在一个地方。它在本版本中仍从 `@astryxdesign/core/hooks` 导出，但在那里已弃用：它是一个普通谓词，不是 hook，而那个 barrel 是 `'use client'` 边界，因此从 `hooks` 导入它会把一个服务端安全的函数拉到客户端路径上。请把导入移到 `@astryxdesign/core/utils`；`hooks` 的重新导出将在即将到来的 major 中移除 (#4907)。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @cixzhang
- @freddymeta
- @imdreamrunner
- @jiunshinn
- @nynexman4464

---

# 0.4.3

#### 新功能

- 新增字符串工具：`characterCount`、`firstCharacter` 和 `truncateCharacters` —— 它们是 `.length`、`.charAt(0)` 和基于切片的截断的替代品，按完整字符测量和裁剪用户可见字符串，因此一个 emoji、旗帜或带重音的字母都算作一个字符，并且永远不会被劈开。基于 `Intl.Segmenter` 构建，并带有码点回退。
- ComplexSelector：支持 ghost 工具栏触发器、前置图标、弹出层对齐，以及用于程序化控制的命令式 `handleRef`（open/close/toggle/isOpen）。
- `useContainerReveal`：两种无需深入 hook 的私有自定义属性即可控制 reveal 的方式。`getContainerProps({hoverDelay})` 把 reveal 的门控放在指针停留上——Tooltip 和 HoverCard 已经以 `delay` 形式拥有的 hover-intent 思路——因此光标扫过列表时不再点亮它擦过的每一行；当其他东西拥有交互（滚动、拖拽、打开的行菜单）时，`getContainerProps({forceState})` 会固定容器的触发状态。按元素来看，`getContentRevealProps({forceVisibility})` 固定某个子元素的外观，而不受其容器影响。仍然是纯 CSS：React 中没有悬停状态，没有重新渲染。键盘和触摸不受影响——焦点总是 reveal，`forceState: 'inactive'` 和 `forceVisibility: 'hidden'` 都让位于 `:focus-within`。

#### 问题修复

- Banner：被关闭的 banner 不再丢失焦点，自定义状态不再丢失其 ARIA role，信息 banner 在中性主题下再次绘制。
  关闭操作会卸载已聚焦的关闭按钮，因此焦点落在 `<body>` 上，键盘用户失去了页面中的位置。Banner 现在记录焦点从哪里进入，并把它返回那里，与 `ToastViewport` 为被关闭的 toast 所做的交接相同。在 Chromium 中测量：`document.activeElement` 曾经是 `BODY`，现在是用户 Tab 进入时的控件。

  `BannerStatusMap` 被文档描述为可增广，但四个状态查找都是封闭的 `Record<BannerStatus, ...>` 映射。添加文档所示增广会在 `Banner.tsx` 内部产生四个 TypeScript 错误，消费者无法修复，而在运行时未知状态解析为 `undefined` 的图标、背景和 ARIA role，因此 banner 完全停止作为 live region。现在的查找是 partial 的：未识别的状态渲染时没有状态填充、没有默认字形，并且 `role="status"`。

  主题无法到达 banner 的圆角。`--_banner-radius` 在文档文件和 `derivedVarRegistry.ts` 中声明，但没有任何规则读取它，因此主题在 `banner` 目标上的 `borderRadius` 展开成一个无人消费的变量。四个卡片轮廓圆角现在读取它，回退到 `--radius-container`。

  在 `@astryxdesign/theme-neutral` 下，信息 banner 完全没有背景，无论浅色还是深色：覆盖层直接设置 `background-color` 并强制 `--color-accent-muted` 为 `transparent`，而主题编写的普通 CSS 属性落在 `@layer astryx-theme` 中，StyleX 的 `@layer priority4` 优先于它。Info 现在像其他三个状态一样通过 `--color-accent-muted` 处理，也与 stone 主题已有的做法一致。

  此变更还包括：`children={false}`（常见的 `{cond && <ul/>}` 写法）不再产生打开空盒子的展开切换，`description=""` 不再留下空的 20px 行，两者都通过 `isRenderable` 实现；标题或描述中一个很长的不断词不再在 320px 视口下迫使页面横向滚动，此前测量到 `document.scrollWidth` 为 529px；内容区域的底部边框与其内联兄弟一起使用逻辑属性 `border-block-end`。

- 按人们阅读的方式来计数和裁剪文本：TextArea 字符计数器（及其超限状态和屏幕阅读器播报）计数用户感知的字符——一个 emoji 是 1，不是 2；PowerSearch 的 token 截断不再把 emoji 或带重音的字母切成两半；Table 自动生成的表头能正确大写星形平面字母；Avatar 的首字母现在使用共享的字符工具。
- ComplexSelector：精确遵循 `sm`、`md` 和 `lg` 元素高度 token。
- TreeList 的 `variant` 轴可主题化，而且一个新的守卫让每个可扩展轴保持诚实。`TreeListVariantMap` 邀请主题包添加变体——它自己的 JSDoc 展示了模块增广——但 `themeProps('tree-list', {density})` 从未传入 `variant`，因此自定义变体通过类型检查、渲染，却没有产生可设置样式的选择器。现在会传入它，并在目标的 `visualProps` 中记录，因此 `astryx theme build` 不再称它为未知 prop。
  `packages/core/src/theme/extensibleAxes.test.ts` 是第三个主题漂移守卫，旁边是覆盖 `targets` 和 `vars`/`derived` 的守卫。前两个检查组件渲染的内容与其文档是否一致；都没有查看开放的 prop 联合，这就是为什么这个问题未被发现。对于每个为组件 prop 提供类型的 `*Map`，它现在断言三个必须一致的地方：接口声明在消费者可增广的 index 中（re-export 对模块增广和 CLI 都不可见），prop 通过 `themeProps` 反映，并且被记录为视觉 prop。它读取 TypeScript AST 而不是类型检查器，并让 map 的 OWNER 负责——把 `actionVariant` 或 `statusVariant` 转发给拥有该 map 的组件的组件不单独对它负责。

  加宽一组名称而不是视觉 prop 的注册表映射（`IndicatorMap`、`IndicatorFamilyMap`）从构造上就超出范围，而不是通过 allowlist：守卫只考虑其别名类型是 `*Props` 接口上 prop 的映射。

- 安全：在 Markdown 解析器中拒绝 `javascript:`、`vbscript:` 和 `data:text/html` URL，因此不受信任的 markdown 不再能产生可执行的链接 href 或图像 src；并修复 `ChatTokenizedText` 中的 `escapeRegExp`，其字符类提前闭合，留下 `]` 和 `\` 未转义，因此包含它们的 token 值被原样注入到 `RegExp` 中
- `extends` 现在到达 CSS。一个扩展另一个主题的主题构建出的样式表只包含它自己声明的声明：基础主题的 tokens、组件覆盖和表面规则全部缺失，而且因为每个主题都 `@scope` 到自己的 `data-astryx-theme` 值，加载基础主题的样式表也无法填补空缺。继承链的每个消费者都悄悄得到了原厂几何、elevation 和字体，只是上面涂了新调色板 (#5067)。没有任何警告；损失只能通过逐 token 对比两个生成的样式表发现。
  原因是 `theme build` 遮蔽了自己的输入。它在 `<name>.ts` 旁边写 `<name>.js`，而加载器把普通的 `./<name>` 说明符解析到那个生成产物而不是源文件——因此一个家族的第二次构建读取了产物，它不携带 `components`，并且导出 `<name>Theme` 而不是源文件导出的任何东西。未命中的命名导入变成 `extends: undefined`，而 `defineTheme` 把缺失的基座当作完全没有基座。加载器现在优先解析源扩展名，这也是作者 TypeScript 看到的解析，因此构建发出的 CSS 与通过类型检查的主题一致。

  背后的三件事也被修复，因此故障不能从另一条路径回来。`defineTheme` 在 `extends` 存在但不是主题时**抛出**异常，并指出可能的原因，而不是不继承任何东西——这是这里唯一的行为变化，它把静默样式表变成构建错误。主题的 `onDark`/`onLight` 表面及其 `__inputTokens` 现在像 tokens 和 components 一样被继承，因此子主题不再把基座的反转表面自定义恢复为默认值，也不再丢失其 `[light, dark]` 元组。而且构建后的主题模块现在携带解析后的 `components` 和 surfaces 以及它的 tokens，因此扩展一个——每个已发布主题都暴露的 `./built` 子路径——不再有损。`theme build` 在重新解析普通对象主题文件时也不再手工挑选字段，那会在此过程中丢弃 `extends`、`color` 和 `syntax`。

  扩展的主题是扁平的：它继承的一切都解析到自己的输出中，其样式表独立存在。在一个 14 个主题的家族上测量（一个基座，13 个调色板扩展它）：每个调色板从 25 个自定义属性和零条组件规则变为基座的完整 175 和 70，同时自己的颜色仍然胜出。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @cixzhang
- @ernestt
- @Sunil56224972

---

# 0.4.2

#### 新功能

- AvatarGroup：在 `avatar-group-overflow` 主题目标上暴露 `size`，使主题可以按尺寸设置 "+N" 溢出 chip 的样式（与 `avatar-fallback` 匹配）；默认 chip 字体不变 (#5046)。
- Chat：ChatMessageBubble 接受 `width` prop（数字是像素，字符串原样传递，例如 `width="100%"`），遵循 Card 和其他容器的尺寸约定。设置时它替换气泡默认的 `max(80%, 280px)` 宽度上限；未设置时没有任何变化。结合 `variant="ghost"`，自定义的消息内内容（artifact 卡片、附件 chip、独立的 ChatMessageMetadata）现在可以在完整消息列宽度上与气泡的文本列对齐——此前唯一的变通方法是在每个调用点硬编码气泡的私有 padding token。(#2574)
- `astryx theme template` 会向你的项目写入一个带注解的主题模板 (#5048)。
  `theme add` 的新兄弟命令：`add` 从我们发布的一个主题开始，`template` 从一张空白的带注解模板开始。`astryx init --features theme` 调用同一个叶子命令，因此项目初始化也会写入它——它以前只打印一行提示，什么也不写，这是主题作者能得到的最弱形式的帮助，因为第一个问题不是不知道命令，而是不知道主题表面包含什么。文件是 `theme.template.ts`：每个 `defineTheme` 字段都附有何时使用它的说明、token 家族、组件覆盖语法以及消费步骤（提供主题、加载你命名的字体、为 SSR 构建），每一节都指明打印其权威参考的 CLI 命令。现有文件永远不会被覆盖。

  这源于一次 vibe 测试 (#5047)：拿到带注解模板的 agent 对主题表面的探索深度是只拿到文档的 agent 的两倍（17 个组件目标对 8 个，而且唯一使用交互状态、自定义变体和 `onDark` 的一支），并交付了三分之一的对比度缺陷。

  会撒谎的模板比没有模板更糟，因此它的声明是机器对照实时源检查的，而不是被信任：`scripts/check-theme-template.test.mjs` 在以下情况下失败：添加了 `defineTheme` 字段却未记录、token 家族从清单中缺失、它命名的 CSS 变量或组件键不存在、它引用了一个不存在的文档主题，或主题源文件丢弃了它的 SYNC 引用。`theme build` 在 CI 中无警告地编译它，CLI 类型检查现在也覆盖它。

#### 问题修复

- Avatar：把 avatar 盒子放到携带 `astryx-avatar` 主题目标的元素上，因此文档化的 `size` 轴上的主题规则会调整整个 avatar 的尺寸，而不是扩大固定尺寸圆形周围的包装器；把仅含空白的 `name` 或 `alt` 视为不存在，因此它会落到默认图标而不是在空白可访问名称后面渲染一个空板；通过共享的 `useDevWarning` hook 而不是渲染主体中裸的 `console.warn` 发出警告；并将 JSDoc 示例中虚构的 `<OnlineIndicator />` 替换为真实的 `AvatarStatusDot` (#5030)
- CommandPaletteFooter：把默认键盘提示字符串接入 useTranslator，使它们从 locale 目录解析，而不是硬编码英语 (#4506)
- `context-menu` 组件覆盖现在驱动菜单内部的圆角和 padding 变量。`ContextMenu.doc.mjs` 一直记录 `derived` 条目将 `borderRadius` → `--_dropdown-menu-radius`、`padding` → `--_dropdown-menu-padding` 映射，但 `derivedVarRegistry` 没有 `context-menu` 键，因此映射是死的：`components: {'context-menu': {base: {borderRadius: '12px'}}}` 只发出 `border-radius`，而菜单仍然读取自己的 `var(--_dropdown-menu-radius)`。注册表条目现在与文档匹配，就像它已经为 `dropdown-menu` 做的那样 (#4783)。
- `useFocusTrap`：没有可 Tab 控件的模态表面保留其程序化焦点目标，而不是让 Tab 逃逸到后面的页面。一个把初始焦点放在 `tabIndex={-1}` 标题或面板上的对话框没有地方可前进，因此 Tab 直接走出了陷阱。`@astryxdesign/core/hooks` 还导出 `hasActiveFocusTrapEscape` 和 `isImeKeyEvent`，它们协调嵌套陷阱并跳过 IME 组合键 (#5023)。
- Heading 的 `type` 是文档化的主题目标，文档也不再教授一个不存在的 CSS 变量 (#5016)。
  `Heading` 将 `type` 反映为主题选择器——`typography.scale` 为它生成 `heading: {'type:display-1' …}` 规则——但 `theming.targets` 只列出了 `level` 和 `color`，因此 `astryx theme build` 在每个设置字体比例的 theme 上都会警告 `Unknown prop "type" on component "heading"`，包括已发布的 `neutralTheme`。漂移守卫两次错过它：它把条件展开（`{level, color, ...(type && {type})}`）读作未知包，而且它只针对自己目录中的文档文件检查组件，因此 `Heading/`——文档来自 `Text/Text.doc.mjs`——从未被检查过。两者都已修复，这使另外三个以前未检查的目录进入守卫覆盖范围。

  另外，主题文档的组件覆盖示例设置了 `--button-press-scale`，而没有任何组件定义它：复制它会产生永远静默不生效的 CSS。它现在设置一个真实的公共变量，示例也不再声明两次相同的 `button` 键。

- DateTimeInput：聚焦且为空的时间占位提示（"e.g., 2:30 PM" / "e.g., 14:30"）现在通过 i18n 翻译器路由，因此能与组件其余部分一起本地化。向 `en` 目录添加 `@astryx.dateTimeInput.timeHint12h` 和 `@astryx.dateTimeInput.timeHint24h`。此 PR 同时覆盖的 live-region "Invalid date" / "Invalid time" 播报首先在 #4363 中落地，现在复用该 PR 的 `@astryx.dateInput.invalidDate` 和 `@astryx.timeInput.invalidTime` 键。(#4546)
- 浮动层现在声明自己的正文类型，而不是继承它。层容器已经设置 `font-family`；现在它还在旁边从 `--text-body-size` / `--text-body-leading` 设置 `font-size` 和 `line-height`。层托管在其触发器所在的任何地方，因此任何未设置自己尺寸的内容都会采用环境尺寸——同一个 Tooltip、Popover 或 HoverCard 从 caption 渲染为 13px，从 lede 渲染为 20px。经过 `Text` 或自己设置尺寸的内容（Tooltip 的标签、DropdownMenu 项、NavMenu 标题）不受影响：它们已经声明了自己的尺寸，仍然胜出。任何依赖继承非正文尺寸的内容现在会以正文尺寸渲染，应显式设置一个尺寸 (#5064)。
- 向 `packages/core/locales/en.json` 添加 `@astryx.listInput.*` 目录命名空间，使 lab 的 `ListInput` 组件的操作标签、空状态、重排说明和 live 播报可以被翻译。`ListInput` 以前硬编码了每个可见和面向辅助技术的字符串 (#4967)。
- Layer：使用惰性的 `<template>` 标记来定位每个上下文层实际的 JSX 位置。安全位置保持内联；段落、链接、按钮、行内格式或结构受限容器内的位置会 portal 到最近的安全祖先。纠正性 portal 保持 CSS 自定义属性从那个附近的宿主继承，同时保留方向和书写模式，并且 `show()` 把触发器作为弹出层的调用方 `source` 传入。新的 `lazyMount` 选项等到打开时才解析和挂载内容；HoverCard 使用它，因此丰富内容在初始渲染期间永远不会进入无效段落，并在隐藏时再次卸载。其他上下文层保持其现有的关闭内容行为 (#5039)。
- 两个守卫因各自的落地而留在 `main` 上失败，因此此后每个 PR 都无故变红。#4963 给 Thumbnail 的移除按钮添加了一个粗指针命中区域变量，却没有记录它，派生变量守卫把它读作未记录的私有变量；该变量是 `::after` 覆盖层上的 `inset`，因此被记录为私有，并与其他没有标准 CSS 属性映射的变量一起列出。#5026 把 `borderDefaults` 移入 `CoreTokenName`——主题模板守卫明确等待的落地（其注释说"当 #5017 落地时，这个守卫开始要求模板覆盖它"）——因此模板的 token 清单现在命名 `--border-width`。
- 悬停打开的菜单在你点击它们时不再关闭。悬停打开的菜单在指针到达时光标下已经打开，因此自然跟随的点击会关闭它——在 #4555 中为 TopNavMegaMenu 修复，现在是共享的：hover→click 守卫位于 `useMenuHover` 中，因此 TopNavMenu、TopNavHeading、SideNavHeading 和 DropdownMenuSubMenu 也获得了它，而 TopNavMegaMenu 运行在共享机器上而不是自己的副本上。整合还带来：打开菜单会同步把焦点移入其中，而不是一帧之后；关闭菜单会把焦点返回其触发器，而不是丢给文档；键盘激活总是打开，而不是把已打开的菜单切换为关闭 (#3121)
- SideNav：由组件审计驱动的一次家族加固。跨 `SideNavItem`、`SideNavHeading`、`SideNavSection`、`SideNavCollapseButton` 以及 TopNav 抽屉模式共享的 `navItemStyles` 模块的可访问性、主题化、透传和代码健康缺陷——运动守卫、未翻译的 flyout 名称、手工实现的 visually-hidden 块、被丢弃的 `...rest`、缺失的主题状态、未清理的定时器，以及手工实现的 hover intent，现在改为共享的 `useMenuHover`。导航行还采用了 #4654 的共享焦点轮廓，因此键盘聚焦的行在每个主题中都会以系统的 `2px --color-accent`、`3px` 偏移显示环，而不是落到浏览器自己的环上；在拆分操作行中，链接和 chevron 切换各自显示环，因为它们是独立的 Tab 停靠点。
  评审还带来了三个视觉修复。折叠的子菜单 flyout 在弹出层圆角表面内绘制了第二个方角表面，并把自身内容内缩 4px 而不是与轨道保持间距——两者都已解决，间隙移到定位层，`DropdownMenu` 就在那里保持它。选中行现在能在 `forced-colors: active` 下存活：它用 6% 背景色调标记当前页面，而强制颜色会完全抹平它，现在它像 `ToggleButton` 和 `SegmentedControlItem` 一样绘制 `Highlight`/`HighlightText`。页脚图标行现在高度一致，折叠 chevron 居中而不是因为一个游离的文本基线而偏高 2.42px。

  四项变更对消费者可见。**悬停折叠项的 flyout** 现在以 `(hover: hover)` 为门控，并且只有在悬停打开它时才在 `mouseleave` 时关闭，点击关闭不再在静止指针下弹回打开。**页脚图标行通过 `SizeContext` 级联 `sm` 尺寸**，因此传给 `footerIcons` 的未指定尺寸的 `Button` 现在与内置折叠按钮匹配，而不是大一号渲染——传入显式 `size` 可以选择退出。**`SideNavCollapseButton` 接受 `size`**，用于导航之外没有行可继承的放置场景。而且 **`SideNavCollapseButton` 接受受控的 `collapsible` 配置**——与交给 SideNav 的同一个 `{isCollapsed, onCollapsedChange}` 对象——这样在 sidenav 之外渲染的按钮现在能与之保持同步。两个组件上的 `handleRef` 因此被弃用：消费者已经拥有的状态通过 props 到达按钮，中间没有命令式句柄。

- Slider：滑块在 `min` 和 `max` 时不再悬挂到组件自身盒子之外。它以前在两端以容器边缘为中心，留下一半（10px）在控件之外，紧邻的容器会裁剪它，或者它与下一个元素重叠。滑块行程现在每端内缩半个滑块——原生 `input[type=range]` 使用的几何——填充、标记和指针到值的映射共享该内缩，因此滑块也保持在抓住它的指针下方，而不是最多跳动半个宽度。垂直滑块和范围滑块的两个滑块都以相同方式修复 (#5051)。
- 交互式控件在触摸设备上满足 WCAG 2.5.8 AA 的 24px 最小值。Slider 轨道（20px 高，且整个长度可点击）将其块尺寸下限设为 24px，Thumbnail 的移除按钮通过 `::after` 覆盖层扩大可点击区域，`sm` 的 CheckboxInput、RadioListItem 和 Switch 下限为以控件为中心的 24px 目标。所有这些都在 `@media (pointer: coarse)` 下门控，只有不可见的可点击区域变化——轨道、滑块和字形完全保持原位，精细指针渲染不受影响 (#4963, #4964)。

#### 文档

- 十个私有（`--_*`）组件主题变量现在在其所属组件的 `theming.vars[]` 中记录：`--_avatar-group-overlap`、`--_card-elevation`、`--_card-ring`、`--_codeblock-gutter-width`、`--_item-label-color`、`--_item-description-color`、`--_tab-indicator-bottom`、`--_tree-indent`（外加 `--_dropdown-menu-radius`/`--_dropdown-menu-padding`，Breadcrumbs 在子菜单上设置它们）。它们在源码中声明，却没有任何描述，因为漂移守卫直接跳过了 `--_` 前缀 (#4783)。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @freddymeta
- @HelloOjasMutreja
- @imdreamrunner
- @jiunshinn
- @rubyycheung

---

# 0.4.1

#### 新功能

- 键盘焦点环现在是一个主题 token。`--focus-outline-width`、`--focus-outline-style`、`--focus-outline-color` 和 `--focus-outline-offset` 驱动 core 和 lab 中的每个环，因此主题 `tokens` 中的一次覆盖就能在系统范围内重新设置焦点样式；颜色跟随 `--color-accent`，除非主题另行设置。`:focus-visible` 条件不可主题化，因此主题化的环仍然无法对指针用户显示 (#4973)。
  每个环现在都从共享的焦点轮廓工具绘制，而不是按组件逐一手写，并且一条 lint 规则保持这一点。随之而来的是两个修正：漂移到 2px 偏移的环（Slider、Switch、Lightbox、ProgressBar 以及 lab 的 InfoTip、Step 和 LogStream）现在位于文档化的 3px，而字段内部的按钮——Date、DateRange 和 DateTime 日历切换按钮、DateRange 预设以及 Selector 和 MultiSelector 状态按钮——绘制标准的 2px 环，而不是 1px。
- AspectRatio、Badge、Blockquote、Card、Center、Code、Grid、Section、Skeleton 和 VisuallyHidden 不再携带 `'use client'` (#823)。每个都针对其传递导入图验证为不使用 React 客户端 API、不依赖仅客户端依赖、也没有模块级可变状态，因此它们现在可以在 React Server Component 中渲染而无需强制客户端边界。一个新的 `serverSafeComponents.test.ts` 从导入图推导服务器安全集合，并在这些组件之一以后增加客户端依赖却没有恢复指令时失败——包括 `scripts/check-use-client.mjs` 看不到的传递情况。
  这不是破坏性变更：没有 prop、类型或导出发生变化，而且 `'use client'` 在 RSC 打包器之外是惰性的。客户端消费者继续以相同方式工作，不过由于这些模块不再是客户端入口点，打包器现在可能把它们放入不同的 chunk。
- Selector 和 MultiSelector：`indicatorPosition` 把选中指示器放在选项行的任一边缘——`start` 或 `end`，逻辑方向，因此跟随 RTL。默认值保持今天的渲染（Selector 的勾选为 `end`，MultiSelector 的复选框为 `start`）；位于 start 的勾选在每一行保留其列，使标签保持对齐 (#4993)。

#### 问题修复

- TimeInput：通过 polite live region 播报方向键时间步进（DateTimeInput 中也有），通过 i18n 目录本地化 "Invalid date"/"Invalid time" live-region 消息，并在 Timestamp 面向 AT 的 aria-label 中使用长时区名称，同时保持短形式可见 (#4363)
- Banner：`banner-icon` 主题目标现在附着在默认状态 Icon 本身上，而不是其布局包装器上，因此设置颜色的主题组件覆盖（`banner-icon` + `status:X`）真正到达字形。Icon 保留其现有的颜色变体（info 仍然渲染 accent），`@layer astryx-theme` 中同元素规则优先于它，因此默认渲染不变。契约说明：当默认图标渲染时，`.astryx-banner-icon` 现在匹配图标元素而不是包装器；使用该目标进行包装器布局（外边距、对齐）的主题现在会改为设置字形样式。使用自定义 `icon` 节点时，目标保留在仅布局的包装器上，因为 core 从不向消费者元素注入 props (#4166)
- CommandPalette：面板关闭时丢弃在途搜索响应 (#3896)
  在搜索仍在进行时关闭面板，会让迟到响应把已放弃的查询和结果重新提交到已关闭的面板中，在重新打开时表现为幽灵查询。关闭现在会使任何待处理请求失效。
- FileInput：验证消息、默认占位符、拖拽提示和文件已选择播报现在通过 i18n 翻译器，而不是硬编码英语。DropdownMenuRadioGroup：消费者的 `xstyle` prop 被组合进样式而不是被丢弃 (#4589)。
- #4991 中添加的弹出层主题目标放在了错误的元素上。`astryx-complex-selector-popup` 和 `astryx-multi-selector-popup` 被渲染在每个组件自己的内容盒上——带有 padding 和滚动的那个——而绘制弹出层背景、圆角和 elevation 的元素是 `usePopover` 在其上一级创建的表面。主题使用这些类来重新设置弹出层样式时，得到的规则无法绘制它。两者现在都落在表面上，因此它们能完成文档所述的工作。
  `Selector` 获得了匹配的 `astryx-selector-popup`，它的兄弟 `MultiSelector` 有而它没有。

  新增：每个弹出层表面都携带共享的 `astryx-popover-surface` 类，因此主题可以一次性设置所有弹出层样式，并且 `usePopover` 接受 `surfaceTarget` 为希望在那里拥有自己目标的组件命名表面。组件无法自己做到这一点——表面属于 `usePopover`，因此它自己渲染的任何类都落在里面。

- Selector 的菜单现在在未覆盖触发器时按标准 `--spacing-1` 间隙与它保持距离——每个显式 `placement` 和搜索模式都是如此。它以前是系统中唯一紧贴锚点的锚定菜单；DropdownMenu、MultiSelector、ComplexSelector、Popover 和 Tooltip 都使用这个间距。默认的选中项覆盖层不变：它拥有自己的块几何，并且有意坐在触发器上 (#5003)。
- Selector、MultiSelector：下拉面板的搜索字段现在是面板的一部分，而不是一个带边框的输入框被丢进去。面板本身已经是一个带边框、有 elevation 的表面，因此嵌套的 `TextInput` 在盒子里面画了一个盒子；现在该行渲染前置放大镜、无边框输入框和共享的清除（✕）按钮，并且它与选项之间有一条全宽分隔线——与命令面板已经使用的形状相同。焦点显示为行上的内嵌环，圆角与面板自己的圆角一致。区块标题从带标签的分隔线改为普通的次级标题，与 DropdownMenu 和 CommandPaletteGroup 匹配，MultiSelector 不再在全选下方绘制一条线。行为、键盘处理和可访问名称不变；MultiSelector 的搜索行还保持不动，而选项在其下方滚动。新主题目标：`astryx-selector-search`、`astryx-selector-section-heading`、`astryx-multi-selector-search`、`astryx-multi-selector-section-heading`；任何通过 `astryx-text-input` 设置下拉搜索样式的代码需要迁移到这些。
- TableRow：遵循 `<tr>` 上的 `className` 和 `style`。`TableRowProps` 扩展 `BaseProps`，但两者都在 `mergeProps()` 之前展开，然后被组件自己的 StyleX 类覆盖，因此消费者的值静默无效。它们现在与行的 StyleX 样式一起通过 `mergeProps()` 合并，与 `TableCell` 和 `TableHeaderCell` 已有的处理方式相同，在 `Table` 内和独立渲染路径中都是如此。Astryx 主题类和条纹/悬停样式不变 (#4391)。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @arham766
- @bhamodi
- @cixzhang
- @Eloitor
- @jiunshinn

---

# 0.4.0

#### 破坏性变更

- DropdownMenu 的两种条目模式再次成为对等模式。复合模式新增 `DropdownMenuDivider` 组件（别名为 `ContextMenuDivider` 和 `BreadcrumbMenuDivider`），数据路径也会渲染它，因此 `{type: 'divider'}` 和 `<DropdownMenuDivider />` 会产生完全相同的 DOM、间距和主题目标。数据模式新增 `endContent` 和 `description`，因此 `items` 行可以携带快捷键提示或辅助文本，而无需退回复合模式。其 `label` 从 `string` 放宽为 `ReactNode`，与复合模式一致：此前的窄化只是因为行以 label 作为键，现在不再如此（#4953）。
  现在裸名称归属于这些组件，因此数据模式的选项类型采用其同类 `DropdownMenuItemData` 已有的 `Data` 后缀：`DropdownMenuDivider` → `DropdownMenuDividerData`，`ContextMenuDivider` → `ContextMenuDividerData`，`BreadcrumbMenuDivider` → `BreadcrumbMenuDividerData`。TypeScript 无法从单个 barrel 中用同一个名称同时重新导出值和类型，因此正是这次重命名让这些组件得以导出。运行 `astryx upgrade --apply` 重写类型导入；漏掉的一处会在编译时失败，而不是静默通过。
- 移除 `dropdown-menu-radio-dot` 主题目标。菜单单选项行现在绘制共享的单选指示器，因此该圆点就是指示器的圆点：目标为 `radio-indicator-dot`（旧名称 `radio-dot` 仍然匹配它）。行的圆圈保留 `dropdown-menu-radio` 目标，所以只有圆点变了。（#4890）
  运行时主题不会经过校验——以已移除目标为键的主题仍会编译，但会静默停止匹配——因此 `astryx upgrade` 现在包含 `rename-dropdown-menu-radio-dot-target`，它会重写该键以及 `astryx-dropdown-menu-radio-dot` 类。新目标是全应用范围的，而非仅限菜单（因为已不存在仅限菜单的圆点元素可供定位），所以该 codemod 会在每个重写位置留下一个 TODO。
- useTableRowExpansion 现在是详情面板插件：它通过 renderExpanded(item) 在行下方展开全宽面板，并且 useTableRowExpansionState 已移除。对于分层/树形表格（子行复用父列），请迁移到 useTableTreeData + useTableTreeState。请参阅 useTableRowExpansion 文档上的迁移示例。（#4609）
  **Codemod：** `npx astryx upgrade --apply` 会运行 `migrate-table-rowexpansion-to-tree`，它会把树模式的 `useTableRowExpansion` 调用点重写为 `useTableTreeData` + `useTableTreeState`。

#### 新功能

- Avatar：回退表面（首字母和默认图标）现在通过稳定的 `astryx-avatar-fallback` 类成为直接的 theme target。可通过 `avatar-fallback` 组件键为其背景、文本颜色、字重以及按尺寸的字号设置主题（例如 `components: { 'avatar-fallback': { base: { backgroundColor: '...' }, 'size:sm': { fontSize: '...' } } }`），取代内部派生的 `--_avatar-fallback-*` 变量。（#4716）
- CodeBlock：内置复制按钮现在是一个可主题化的 ghost `IconButton`，带有默认的 "Copy code" tooltip，可通过稳定的 `astryx-codeblock-copy-button` 类访问（通过 `codeblock-copy-button` 组件键为其设置主题）。无需关闭复制控件再重新实现，即可重新设计样式或保留它。复制后 tooltip 仍为 "Copy code"——复制→勾选图标翻转即是确认。（#4867）
  [feat] 新增 `useClipboard` hook（`@astryxdesign/core/hooks`）：共享的复制到剪贴板行为——剪贴板写入、带重置计时器的临时 `isCopied` 标志，以及可选的礼貌屏幕阅读器播报。CodeBlock 和 Timestamp 现在基于它构建各自的复制按钮；对于并非简单图标按钮的复制功能，可直接使用它。
- CodeBlock：在标题行和标题/语言标签元素上新增 `codeblock-header` 和 `codeblock-title` 主题目标。主题现在可以直接重新设计标题行（例如 padding）和标题（例如字号），而无需通过结构化的 `> div:first-child > div > span` 选择器反向解析标题布局来访问它们。两者都像根元素一样反映 `size`/`language`（`/container`）视觉 props。（#4943）
- DateInput、DateRangeInput 和 DateTimeInput 现在接受 `weekStartsOn` prop，用于设置日历弹层中一周的第一天（0 = 星期日 … 6 = 星期六，或像 `"mon"` 这样的三字母星期名）。它会转发给底层的 Calendar，后者的默认值仍为星期日，因此现有用法保持不变。（#4745）
- Selector、MultiSelector 和 Typeahead 将其空状态（"No results found"）暴露为可主题化目标（#4756、#4862）——`astryx-selector-empty-state`、`astryx-multi-selector-empty-state` 和 `astryx-typeahead-empty-state`。主题可以重新设计空状态，而无需依赖消费者此前不得不使用的脆弱结构选择器。（Selector 搜索字段是一个 TextInput，因此其占位符目前可通过 `.astryx-text-input::placeholder` 访问；Selector 作用域的占位符接缝需要修改 TextInput，留作可能的后续工作。）
- EmptyState：在标题标题和描述上新增 `empty-state-title` 和 `empty-state-description` 主题目标。主题现在可以直接重新设计标题和描述（例如字号、颜色、按 `variant`），而无需通过结构化的 `> div:has(> :is(h1..h6))` 选择器反向解析哪个元素是哪个。（#4942）
- 每个可清除输入现在都通过共享的 `InputClearButton` 渲染其清除（✕）功能，因此字形可以通过 `astryx-input-clear-icon` 目标在一个地方设置主题，而不是按组件设置目标或使用脆弱的后代选择器。组件特定的 `astryx-{date-input,date-range-input,selector,multi-selector}-clear-icon` 目标仍作为已弃用的别名受支持；新主题应使用 `input-clear-icon`。现在整个输入系列中的清除字形都是一致的次要颜色图标，并带有 ghost 按钮悬停效果。（#4876）
- 输入系列（TextInput、NumberInput、DateInput、DateRangeInput、DateTimeInput、TimeInput、TextArea、Tokenizer）现在在根主题目标上以 `data-disabled="disabled"` 加 `.disabled` 变体（仅在禁用时）反映其禁用状态，因此主题可以在禁用状态上控制自身的悬停/边框处理——与现有的 `status`/`size` 反映方式一致——而无需依赖结构化的 `:has(input:disabled)` CSS。这为下游消费者填补了一个已记录的主题化缺口。（#4794）
- useLayer 接受一个 `offset` 用于与锚点保持间隙，其值派生自解析后的定位，且图层包装器不再手动实现它（#4803）
- DropdownMenu 行新增两个选项（#4953）。`DropdownMenuItem` 接受 `hasCloseOnSelect`，因此普通操作可以在条目上报告其结果，而不是关闭菜单。`DropdownMenuItemData` 和 `DropdownMenuSection` 接受可选的 `id`，即条目的稳定 React key，用于条目不重排或过滤的菜单（也适用于共享该类型的 MoreMenu、ContextMenu 和 Breadcrumbs）。
- DropdownMenuItem 现在接受 `variant` prop（`'default' | 'destructive'`）；`'destructive'` 会以错误颜色渲染标签、描述和图标，用于删除等危险操作。数据驱动的 `items` API 接受相同的 `variant` 字段，并且由于 ContextMenu 共享菜单项数据形状，context-menu 条目也获得了它。默认为 `'default'`，因此现有菜单保持不变。（#4753）
- MultiSelector：下拉选项行可通过单个（#4628）
  `multi-selector-option` 目标设置主题，携带行的 `size` 及其 `select-all`、`selected` 和 `disabled` 状态——因此主题可以表达"大型尺寸下的选中选项"，或仅重新设计全选行。行排版从 label span 移到行上，因此一次覆盖即可同时作用于回退标签和 `renderOption` 内容；自定义选项内容现在继承行的字体和禁用颜色。
- NumberInput：渲染一个文本支持的 spinbutton，支持格式化显示值、显式滚轮和键盘步进，以及可选的尾部增量/减量按钮。现有的滚轮步进仍默认启用，现在可通过 `isWheelEnabled={false}` 禁用（#4896）。
- ComplexSelector 和 MultiSelector：在弹层表面上新增 `astryx-complex-selector-popup` 和 `astryx-multi-selector-popup` 主题目标，因此主题可以通过 `defineTheme` 为弹层设置样式——背景、边框、圆角、阴影、内边距——而无需结构选择器或 fork。这两个组件此前都已定位其触发器，但弹层内没有任何目标，而弹层正是需要与应用其余菜单匹配的部分。该目标位于弹层的内容盒而非图层元素上：`useLayer` 会将图层的边框、内边距和背景归零，因此内容盒才是实际绘制的表面。纯增量——默认渲染保持不变。（#4991）
- TextInput、TextArea、NumberInput：新增 `isReadOnly`。值以完全不透明度显示，并且仍会随表单提交，但无法编辑——这是 `isDisabled` 刻意不覆盖的"可见、锁定、仍然发送"场景，因为禁用控件会被排除在提交之外。只读字段不会变暗，并保留在 Tab 顺序中，与其编译到的原生 `readonly` 语义一致；同时设置两者时 `isDisabled` 优先，只读时清除按钮隐藏。该状态在根主题目标上以 `data-readonly="readonly"` 反映，与现有的 `data-disabled` 并列，因此主题无需结构化的 `:has(input:read-only)` CSS 即可绘制它。`isReadOnly` 已在 CheckboxInput、CheckboxList 和 PowerSearch 上存在；其余类文本输入（DateInput、DateRangeInput、DateTimeInput、TimeInput、Tokenizer）尚未具备。（#4816）
- Selector/MultiSelector：两个增量主题化接缝（#4626、#4627）。选中行对勾上的 `selector-check` 主题目标让主题可以重新设计或隐藏它（例如通过 `renderOption` 组合自己的选中指示器），而无需依赖结构化兄弟选择器，并且 `data-disabled` 现在会反映在触发器上，用于主题驱动的禁用样式。旋转样式仍保留在 indicator-icon 目标上。默认外观不变。
- Table：`contextMenuActions` 现在接受 `variant: 'destructive'`，用于危险的行/列操作（例如 Delete），以错误颜色渲染以匹配 ContextMenu。（#4864）
- TextArea：通过在 `textarea` 组件键上写入 `paddingInline` 来为文本内边距设置主题——它现在驱动内部的 `--_textarea-inline-padding` 变量，而不是落在包装器上。包装器保持齐平（`padding: 0`），因此原生调整大小手柄保持其真实角落位置，起始图标、状态和字符计数器与文本保持对齐。为派生变量条目新增 `replaces` 选项，用于通用的"将属性映射到变量而不在类元素上发出它"的情况。（#4793）
- 新增可主题化指示器——组件化的对勾、复选框和单选视觉元素。`defineTheme({indicators: {check: RadioIndicator}})` 按名称替换一个，所有绘制它的组件都会跟随。（#4712）
  主题目标现在遵循组件名约定：`checkbox-indicator`、`radio-indicator`、`radio-indicator-dot`。旧名称（`checkbox`、`radio`、`radio-dot`）仍在同一元素上发出，因此现有主题继续有效。新主题应使用规范名称；弃用不会设定自动移除期限。

  迁移：菜单单选项现在使用这些共享目标。`dropdown-menu-radio-dot` 已移除——目标为 `radio-indicator-dot`；`astryx upgrade` 会为你重写。

- TreeList：两个增量变更。（1）完全扁平的树——完全没有可展开项的树——现在会齐平渲染其行，而不是保留一个没有任何内容对齐的空 chevron 对齐列；任何至少有一个可展开项的树都保持与之前相同的逐级对齐，因此只有完全扁平的树会改变形状。（2）新增可主题化的 `--tree-list-row-gap` 用于行间距，默认值为微妙的 `2px`（`var(--spacing-0-5)`）间隔——与 `List` 和 `DropdownMenu` 已提供的行间距一致——因此这会将每棵树的默认间距改变该数量；在 `tree-list` 目标上设置它以扩大或关闭间距。该间距搭载在行包装器上防折叠的 `padding-block`（不是可绘制的 `tree-list-item` 目标）上，连接导线会自动跨越它，而不会悬垂到最后一行之外。（#4540）

#### 问题修复

- AlertDialog：修正内联 role 并固定初始焦点（#4887）。
  `isInline` 预览路径不再渲染 `role="alertdialog"`。该 role 承诺的是模态中断——焦点陷阱、页面惰性、显式关闭——而内联路径是一个始终存在、非模态的预览，不具备这些。它现在渲染 `role="group"`，通过 `aria-labelledby`/`aria-describedby` 保持标题和描述关联。

  取消按钮现在带有 `data-autofocus`，因此文档所述的"初始焦点转到取消按钮"行为被固定下来，而不是依赖取消按钮恰好是页脚中第一个可聚焦节点。文档现在命名并链接了该组件实现的 WAI-ARIA APG Alert Dialog 模式，并新增了解剖结构章节。

- AppShell：对 shell chrome 的两项无障碍修复（#4944）。
  仅为侧边导航布局渲染的移动端顶栏现在是一个 `banner` 地标，与具有 `topNav` 的布局的 header 区域一致。此前页面的地标结构会根据填充哪些导航插槽而变化：小视口上的屏幕阅读器用户完全得不到 banner 区域。当存在 `banner` 插槽时，现有 header 保留该 role，因此仍然恰好只有一个。

  跳转链接现在绘制共享的 Astryx 焦点环，而不是浏览器默认轮廓，因此它遵循 `--color-accent`，并与自定义主题中的其他所有可聚焦表面相匹配。

- Avatar：回退首字母不再对包含 emoji 或其他多码点字符的名称出错。（#4750）
- ChatLayoutScrollButton：默认（无标签）状态现在渲染为仅图标，仅将翻译后的 "Scroll to bottom" 字符串作为可访问名称。此前其内部 `Button` 缺少 `isIconOnly`，因此 Button 的默认（可见文本）契约将翻译渲染为圆形按钮内被裁剪的可见文本。（#4854）
- Chat：听写和滚动按钮现在带有各自的 `chat-dictation-button` 和 `chat-layout-scroll-button` 主题目标，并且 ChatSendButton 不再覆盖消费者的 `className`（#4634）。
- ChatToolCalls：分组调用行（2+ 调用）上的悬停背景现在保持完整的 `--radius-element` 圆角，而不会在内联边缘被裁剪为平直。`groupContentInner`——展开/折叠高度动画所需的 `overflow: hidden` 裁剪边界——缺少吸收行级悬停背景外溢的内边距/负外边距对，因此外溢延伸到裁剪边界之外并被切掉。这与未分组的单调用行一致，后者没有这样的包装器来裁剪它。（#4858）
- `ComplexSelector` 的弹层现在在 `placement="above"` 时保持与触发器的 4px 间隙，与 `placement="below"` 和 `Popover` 一致。弹层的外边距此前仅设置在 `marginBlockStart` 上，这对于向下打开的弹层是正确的，但在向上打开时对真正重要的那条边留下了零间隙。（#4861）
- ComplexSelector：触发器的焦点环现在仅限键盘。此前它由 `:focus-within` 绘制，这也会匹配鼠标点击——用鼠标打开弹层，用鼠标关闭它，恢复的焦点会让指针用户盯着一个键盘功能提示。现在它使用共享的 `:has(:focus-visible)` 环，这也将轮廓带到文档所述的 3px 偏移。（#4935）
- DateInput 和 DateTimeInput 在通过点击其他控件关闭打开的日历时不再抢夺焦点。点击字段打开日历，然后点击时间输入（DateTimeInput）或任何其他元素，此前会一直将焦点拉回日期输入，因为弹层的关闭处理程序总是重新聚焦它。现在它仅当关闭导致焦点脱离时才恢复焦点（Escape，或点击空白处），因此落到其他位置的点击会被尊重。（#4974）
- TextInput、TextArea、NumberInput：当设置了 `disabledMessage` 时，禁用字段不再随表单提交。显示原因 tooltip 需要将原生 `disabled` 属性替换为 `aria-disabled` + `readOnly`，以便消息可通过指针和键盘发现——但只读字段仍会序列化到 `FormData`，而这三个组件保留了其 `name`，因此被锁定的字段会提交其值。它们现在在禁用时保留 `name`，与 CheckboxInput 和 Switch（仅在启用时转发 name）以及 Selector、MultiSelector、Slider 和 Tokenizer 中的隐藏输入载体（它们镜像 `disabled`）一致。为这三个组件新增了表单参与覆盖，以固定该保证。（#4811）
- DropdownMenu/MoreMenu：用指针打开时不再像选中一样高亮第一个条目（#4477）。初始焦点现在遵循输入方式：键盘打开（触发器上的 Enter/Space/ArrowDown）仍按 APG menu-button 模式聚焦第一个启用条目，而指针打开则聚焦菜单容器本身，因此第一次 ArrowDown 会移动到条目 1。合成点击（detail 0，例如屏幕阅读器激活）和程序化受控打开保持第一项焦点行为。涵盖数据驱动 items 模式、复合模式和共享打开路径的 MoreMenu。
- EmptyState：rest 展开位于契约 `role` 之前，因此消费者不再能覆盖组件保证的地标 role（#4826）。
- Indicator：falsy 的 `children` 不再删除状态标记。宿主实际编写的忙碌惯用法——`children={isBusy && <Spinner/>}`——在不忙碌时传递 `false`，而 `false` 既不是 `null` 也不会被 `??` 捕获，因此所有三个指示器都走了 children 路径，在其中渲染空内容，并在每个选中行上丢弃了对勾、复选框勾和单选圆点。它们现在使用 `isRenderable`，因此只有实际渲染的 children 才会替换标记。`0` 仍算作内容，因为它渲染字符 "0"。（#4913）
  CheckIndicator 的 children 插槽还预留了字形的盒子并携带其颜色，因此换入 Spinner 不再使行偏移或丢失禁用色调。

  修复 #4893。

- 将通用交互式焦点轮廓合并到一个定义——2px `--color-accent`、3px 偏移，与 Design Conventions 一致。（#4654）
  大多数通用控件已漂移到 2px 偏移；Button、Calendar、Dialog 和 Pagination 是仍在规范上的。它们的值获胜，因此漂移组件（Link、TabList、Token、TreeList、SegmentedControl、TopNav 条目）上的焦点环现在距离其控件远 1px。

  破坏性按钮保留其错误色环，`--button-focus-offset` 不变。表单和输入焦点处理不在范围内。

- `<Heading type="display-N">` 现在在每个主题下都能正确设置尺寸，与 `Text` 的行为一致。`generateTypeScaleComponents()` 只为 `heading` 发出以 `level:N` 为键的 CSS 规则，没有 `type:display-N` 的对应规则——因此一旦主题提供 `typography.scale`，生成的 theme-layer CSS 中就只有 `level:N` 规则存在，并且无论 `type` 如何都会静默获胜，丢弃该 prop。没有 typography 配置的主题不受影响，这使得该 bug 看起来是间歇性的。（#4859）
- theme：`color.contrast: 'high'` 现在也会增强边框 token——强调边框色调被拉向中间刻度（在浅色和深色表面上都更强），微妙细线的 alpha 加倍，因此结构边界在高对比度主题中保持可感知，而不仅仅是文本/图标改变。（#4529）
- 图标通过 `<Icon>` 渲染并携带其组件的主题目标（#4838）。
  围绕旋转图标的仅样式包装器已移除，现在每个旋转都位于已经携带组件主题目标的图标元素上——因此主题可以通过一个选择器访问字形及其打开/关闭变换。没有新的主题目标：Selector、MultiSelector 和 ComplexSelector 合并到它们现有的 `*-indicator-icon` 目标上，Table 插件和 TreeList 只是去掉了冗余的包装元素。

  当 RTL 镜像位于单独的父元素上时，它被折叠到每个状态的变换中（`scaleX(-1) rotate(...)`），因此一个元素同时承载两者。在 Table 插件中，该镜像是无效的——`transform` 不适用于非替换内联盒——因此 RTL 展开 chevron 现在会正确镜像，而此前是静默地不镜像。

  SideNav、TopNav、Collapsible、TreeList 和 Breadcrumbs 中的注册表字形现在通过 `<Icon>` 渲染，而不是在手写 `<span>` 内使用 `useIcon()`。那些 span 是对 `<Icon>` 的较弱重新实现，而 `<Icon>` 已经解析相同的字形并渲染一个 span，携带合并的 `className`/`style`/`xstyle` 以及 `astryx-icon` 主题目标。转换后的位置获得了该目标，节点数量不变。`useIcon()` 在那些解析字形而 _不渲染_ 它的场景中保留其位置：MoreMenu 和 ChatSendButton 将节点作为消费者可覆盖 prop 的默认值传递，这是 `<Icon>` 无法表达的。

  还为存在于转换其中图标的 `<div>`/`<span>` 包装器新增了 `@astryx/no-wrapper-transform` lint 规则（警告）。

- Indicator：调用者不再能取消隐藏或聚焦装饰性指示器（#4921、#4947）。
  `IndicatorProps` 现在省略 `aria-hidden`、`role`、`aria-label`、`aria-labelledby` 和 `tabIndex`——传递 `role` 或 `tabIndex` 是编译错误——并且每个指示器在 `{...rest}` 之后发出自己的 `aria-hidden`，因此转发的值无法获胜。取消隐藏指示器会让它在拥有可访问名称的控件旁边被播报，重复说同一件事；在其上设置制表位会在隐藏子树内产生可聚焦节点，这是 axe 的 `aria-hidden-focus` 违规。

  没有任何东西被剥离：所有其他 prop，包括转发的 `aria-label`，仍会到达 DOM，在那里它在 `aria-hidden` 子树内是惰性的。请注意，TypeScript 豁免连字符 JSX 属性的多余属性检查，因此仅凭类型无法拒绝 `aria-*`；属性顺序才是执行约束的东西。`tabIndex` 是普通标识符，因此其省略本身就成立。

  还更正了两处文档声明：替换项在实际绘制内容时必须渲染 `children`（`isRenderable`，而非 `children ?? mark`），并且"传递 `role` 是编译错误"仅对字面属性成立——展开会绕过多余属性检查。

  修复 #4918。

- DropdownMenu 条目在激活时关闭菜单，即使它没有 `onClick`，并且数据模式行在更改自身 label 时保持其身份，而不是重新挂载并丢失焦点（#4953）
- 修复 `mergeRefs` 清理，使对象 ref 被清除，且当合并 ref 返回清理函数时，没有清理函数的回调 ref
  仍会收到 `null`（#4901）。
- MoreMenu 将 `placement` 和 `alignment` 转发到其 DropdownMenu。两者都是底层菜单 API 的一部分，但被包装器丢弃了，因此溢出菜单——唯一一个职责就是尾部边缘功能的组件——无法请求末尾对齐；只有当图层恰好发生碰撞翻转时它才看起来正确。默认值不变：MoreMenu 直接透传这些 props，因此 DropdownMenu 的 `'below'` / `'start'` 仍然适用。（#4952）
- Pagination：将上一个/下一个插入符图标垂直居中。RTL 镜像将每个 chevron 包裹在一个 `display: contents` span 中，这使图标脱离了按钮的 flex 居中上下文，因此字形偏高几个像素。现在镜像变换通过 `xstyle` 直接搭载在 `Icon` 上，因此图标保持为居中的 flex 子元素，并且在 RTL 下仍然翻转——没有包装元素。（#4723）
- ProgressBar：主题现在无需 `!important` 即可设置目标标记的尺寸。标记的 `width`/`height` 是普通的 StyleX 声明，因此 `progressbar-mark` 覆盖仅在 `@layer astryx-theme` 胜过组件原子类的地方生效——在未使用 `useCSSLayers` 编译 StyleX 的源码构建应用中，原子类未分层并胜过每个主题规则，除了未分层的 `!important` 规则外无法调整刻度大小。尺寸现在作为派生变量传递，没有竞争的声明，因此相同的 `defineTheme` 条目在任一构建中都生效。主题编写不变；标记的颜色仍然是普通声明，仍然取决于图层顺序。（#4970）
- ProgressBar 标记从其所在位置取色：填充变体的 on-color 位于填充区域内，强调分隔线颜色位于轨道上（#4741）
- CommandPalette、ComplexSelector 和 ContextMenu：消费者的 `onClick`/`onMouseEnter` 与组件自身的处理程序组合，而不是被其覆盖，并且 `{...props}` 不再落在组件必须控制的 props 之后（#4725）。
- CheckboxInput、Switch：带 `disabledMessage` 禁用的 `required` 控件不再阻止整个表单提交。显示原因 tooltip 会将原生 `disabled` 属性替换为 `aria-disabled`，这使控件仍受约束验证约束——因此一个未勾选的必选复选框（或关闭的必选开关），用户被告知无法操作，会使表单永久无法提交，浏览器会针对一个用户无法满足的控件报告验证错误。两者现在在可聚焦禁用时通过 `form=""` 脱离表单，与原生禁用控件以及 RadioListItem 已应用的处理方式一致。启用的控件不受影响——未勾选的必选复选框仍会阻止提交，这是应有的行为。（#4815）
- `useScrollLock`：使用共享计数器协调并发锁，因此乱序关闭的覆盖层不再过早解锁 body 或使其卡在锁定状态。（#4788）
- Selector：通过在弹层进入动画期间测量未变换的布局几何，保持选中选项文本在每个菜单位置下与关闭触发器对齐。（#4802）
- 移除 Selector、MultiSelector 和 ComplexSelector 中的共享触发器图标包装器——每个触发器图标现在是携带自身盒子、颜色和主题目标的元素。（#4846）
  该包装器在一个没有自身主题目标的 span 上设置了 16px 盒子和 `--color-icon-secondary`，由两个不同的功能共享：状态字形和展开 chevron。`<Icon>` 已经提供两者（`size="sm"` 是相同的 16px 盒子，`color="secondary"` 是相同的 token），因此包装器只是挡在主题和图标之间——并让两个功能共享了一个它们本就不该共享的节点。
- Selector 通过键入进行选择，匹配原生 select（#3764）
  在聚焦且关闭的 Selector 上键入可打印字符现在会选择匹配选项——Tab 到州选择器，按 "C"，得到 "CA"——而不是在菜单打开前什么都不做。重复按键会在共享首字母的选项之间循环，空格也算作匹配字符（"new y" 到达 "New York"）。菜单打开时，键入会移动高亮，Enter 提交，与之前一样。使用 `hasSearch` 时，在关闭的触发器上键入会打开弹层并填充搜索输入。

  匹配复用共享的 `useTypeahead` hook，因此 Selector 的行为与其他集合（菜单、列表框）一致。由于从关闭触发器提交的匹配会更改值而不打开弹层或移动焦点，新选择通过 `useAnnounce` 播报。

  `useCombobox` 不再自行实现 typeahead；想要它的调用者可以组合 `useTypeahead` 并在组合框按键处理程序之前运行它。

  采用共享 hook 暴露了其中两个匹配 bug，在此修复——因此 `DropdownMenu`、`ContextMenu` 和 `NavHeadingMenu` 也得到改进。单字符搜索现在 _从当前条目之后_ 开始，如原生 `<select>` 和 APG 模式那样，而不是仅在重复按键时前进：按下一个聚焦条目已经以其开头的字母过去完全不会做任何事。并且在没有任何聚焦时，搜索现在真正从顶部开始，而不是先绕到最后一项。使用 Option/Alt 组合的字符（`Option+a` → "å"）再次计为 typeahead，因此带重音的标签保持可达。

- SideNav：导航折叠时 `footer` 内容现在居中，与 `children` 已有的居中方式一致。`stickyBottomCollapsed`（`footer` 的折叠轨道包装器）缺少 `alignItems: 'center'`，而它的同类 `scrollableCollapsed`（`children` 的折叠轨道包装器）已经具备——因此全宽页脚内容（例如仅图标按钮）会拉伸到折叠轨道的宽度，而不是居中。（#4852）
- SideNav：带 `menu` 的折叠仅图标 `SideNavHeading` 触发器不再省略其弹层的锚点。触发器的 ref 回调没有转发到 `usePopover` 的 `triggerRef`，因此菜单弹层没有 CSS 锚点可定位，会退回到视口角落，而不是在触发器旁边打开。（#4850）
- Stepper：通过新的 `@astryx.step.optional` 消息键本地化 "Optional" 步骤功能，使其像组件其余部分一样翻译。英文无视觉变化。（#4872）
- `useStreamingText` 不再在其固定代码单元显示节奏恰好落在代理对或多码点 emoji 内时渲染一帧损坏的字形（孤立代理或部分 ZWJ emoji 序列）。渲染的切片现在通过 `Intl.Segmenter` 对齐到最近的 grapheme cluster 边界（在不可用时有代理对安全的回退）；显示节奏本身不变。还更正了该 hook 的文档注释，它不准确地描述节奏按词/语法边界前进——它始终按固定代码单元前进。（#4866）
- TextArea：当 `statusVariant="detached"` 时不再为字段上的状态图标预留尾部空间。detached 变体在字段下方的消息框中显示其状态字形，不渲染字段上的图标，因此预留的内边距会为一个从未出现的图标将文本向内推。现在仅当 spinner 或字段上的状态图标实际渲染时才预留尾部空间。（#4940）
- TextArea：移除重复的包装器内边距，使文本和原生调整大小手柄齐平贴边。包装器的 `padding: 0` 简写被共享输入包装器的长属性覆盖，导致内边距应用两次；现在它用匹配的长属性归零。（#4813）
- TopNavMegaMenu：修复悬停后点击的闪烁问题，即悬停后点击导航项会关闭 mega menu。触发器注册为其 `popover="auto"` 面板的原生 invoker，并使用 Vercel 风格的悬停→点击防护，因此悬停后自然跟随的点击会确认并固定面板打开，而不是将其切换关闭。原生外部点击、Escape 关闭和同级弹层互斥得以保留。点击/键盘打开被固定（鼠标离开后仍保持）；悬停打开保持短暂。键盘激活（Enter/Space）始终打开并将焦点移入面板，而触摸/无前置悬停的点击则干净地切换（#3121）
- TreeList typeahead 现在会在同字母匹配之间循环，而不是停滞，并且在没有 treeitem 聚焦时从顶部搜索。（#4844）
- `BaseTypeahead`（以及构建在其上的一切——`Typeahead`、`Tokenizer`、`PowerSearch` 的内容搜索字段）不再将提交 IME 组合（韩语/日语/中文输入）的 Enter keydown 误解为"接受高亮建议"。此前该 keydown 既选择高亮结果又清空输入，因此仍在组合的音节落入刚清空的字段，并在下一次 Enter 时成为其自身的虚假第二选择。还防护了 `PowerSearchEditPopover` 中的 Enter 保存处理程序，它在键入 CJK 过滤值时存在同样的缺口。（#4860）
- useLongPress：当第二根手指在长按中途加入时取消挂起的长按。此前 `onTouchStart` 和 `onTouchMove` 只在各自事件上检查 `touches.length`，因此在单指按压已启动计时器后到达的第二根手指（例如捏合缩放手势）会穿过 `touches.length !== 1` 防护而从未清除它——`onLongPress` 仍可能在手势中途用陈旧的第一指位置触发。无 API 变更。（#4735）
- useContainerReveal 通过继承而非标记池来限定显示范围：超过六行的列表不再有开发警告，且 isEnabled 现在在挂载后生效（#4955）

#### 文档

- AppShell：`mobileNav` 逃生舱的两个示例将 `title` 传递给了 `MobileNav`，而它不接受该属性：`MobileNavProps` 省略了原生 `title` 属性，抽屉标题 prop 是 `header`。复制任一示例都会产生类型错误和一个没有标题的抽屉。两者现在都写 `header`。文档还新增了解剖结构列表和涵盖 AppShell 拥有的地标结构的无障碍指南。（#4944）
- AspectRatio：记录尺寸契约并添加缺失的解剖结构。盒子从容器获取宽度并从中推导高度，因此仅约束高度会将其夹离比例（同时传递 `width: 'auto'`），而收缩适应父容器会将其折叠为零宽度。两者现在都在组件 JSDoc 和 `bestPractices` 中，连同单子元素预期：设置 `fit` 后，每个直接子元素都会拉伸以填充盒子。图片画廊示例块现在使用 `var(--radius-element)` 而不是原始 `8`。（#4984）
- StatusDot：在用法应与不应中记录构建者的无障碍责任。仅颜色的圆点在孤立情况下并非完全无障碍，因此指南现在说明将其用作二元存在/缺失信号，将其与标签配对，通过图标以形状承载状态，并且——如果两者都不适合——通过可访问替代方案传达状态。（#4737）

#### 其他变更

- `DropdownMenuItemData`——`DropdownMenu` / `ContextMenu` / `MoreMenu` `items` 数组中一个条目的形状——现在从 `DropdownMenuItemProps`（`Pick`）获取，而不是手写重复 `icon`、`onClick`、`isDisabled` 和 `variant`，并且 `renderDropdownItems` 将整个条目转发给 `DropdownMenuItem`，而不是逐字段复制。数据 API 和复合 API 描述同一个条目，因此它们不再会漂移——向数据 API 暴露另一个条目 prop 现在只需在 `Pick` 中增加一个键。该类型在结构上与之前完全相同（`label` 仍窄化为 `string`，因为渲染器以它为行键）并且渲染不变。（#4809）
- 移除 15 个仅用于为其内部单个 Astryx 组件设置样式的 `<div>`/`<span>` 包装器（Carousel、Lightbox、MobileNav、Pagination、Switch、TopNav、TopNavMegaMenu、Table 行展开菜单图标）；样式现在通过 `xstyle` 位于该组件自己的根元素上——或者，对于 Pagination 的 page-size Selector，使用其文档化的 `width` prop。无 API 变更，但渲染的 DOM 在每个位置少一个节点，因此任何基于该结构的选择都会受影响：`patch`，而非 `[breaking]`，因为移除的节点是内部实现，没有文档化契约、没有主题目标、没有稳定类。作为副作用，包装器导致的两个渲染缺陷得以修复：Lightbox 上一个/下一个 chevron 和 Pagination 首/末 chevron 偏离按钮垂直中心 2.5-3px。（#4775）

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @alex-js-ltd
- @athz
- @cixzhang
- @czarandy
- @ernestt
- @freddymeta
- @HelloOjasMutreja
- @humbertovirtudes
- @imdreamrunner
- @jiunshinn
- @josephfarina

---

# 0.3.0

#### 破坏性变更

- DropdownMenuRadioGroup 现在接受必填的 `label` prop，为辅助技术命名该组（作为 aria-label 应用），取代之前可选的 `aria-label`/`aria-labelledby` 透传——将 `aria-label="..."` 重命名为 `label="..."`（如果已有可见标签，则改为通过基础 props 传递 `aria-labelledby`）。这也涵盖 ContextMenu/Breadcrumb 的重新导出（ContextMenuRadioGroup、BreadcrumbMenuRadioGroup）。还修复了 ContextMenu 以按 APG 菜单模式在 Tab 时关闭菜单。
- Core——创作面移至 `@astryxdesign/cli/authoring`。`@astryxdesign/core/authoring`（`createIntegration`/`createPageTemplate`/`createBlockTemplate`/`createComponentDoc`/`createFunctionDoc`/`createDoc` 及其类型）和 `@astryxdesign/core/config`（`createConfig` + `AstryxConfig`）已移除。从 `@astryxdesign/core` 重新导出的文档类型词汇（`ComponentDoc`、`ReferenceDoc`、`ComponentPropDoc`、`ComponentTranslationDoc`、……）现在是已弃用的别名，从 `@astryxdesign/cli/authoring` 重新导出，并将在下一版本移除。以普通对象编写文档/配置/集成，并从 `@astryxdesign/cli/authoring` 导入类型；`astryx upgrade` 会自动重定向现有导入。
- 从 core 和 CLI 中移除长期弃用的兼容 API。先运行 `astryx upgrade` 以迁移 authoring 导入、Dialog 逻辑位置、Switch 标签间距和 Table 根 props 的受支持替代方案。

#### 新功能

- Carousel：新增 `hasLoop` 用于循环滚动（末尾的 next 返回开头，开头的 prev 跳转到末尾；导航按钮在两端保持激活）以及 `handleRef` 命令式句柄（`CarouselHandle`），暴露 `scrollNext`、`scrollPrev`、`scrollTo(index)`、`canScrollNext()` 和 `canScrollPrev()` 用于程序化控制。
- Center：新增 `padding`、`paddingInline`、`paddingBlock`（间距刻度的内部内边距）props。这些与 `Stack`、`Card`、`LayoutContent` 和 `LayoutPanel` 上现有的 `padding` props 匹配，因此居中的页面内容不再需要为基本内边距使用内联 `style={{}}` 或 `xstyle` 包装器。
- ComplexSelector：新增丰富的自定义选择器外壳，具备无障碍按钮/弹层行为、异步更改操作和可选的网格键盘导航。
- `defineTheme`：使 `color.accent` 可选（#2279）
  主题现在可以在不采用强调色的情况下重新设计中性色阶（`neutralStyle`、`contrast`）。无强调色的配置会从默认强调色的色相播种中性调色板，但不生成 `--color-accent`、`--color-accent-muted` 和 `--color-on-accent`，因此它们会回退到 token 默认值——与 `expandColorScale` 已应用于状态、分类和 on-dark token 的回退方式相同。传递强调色的配置逐 token 保持不变。
- Dialog：在 `position` prop 中新增逻辑 `start`/`end` 偏移，并弃用物理 `left`/`right`。`start`/`end` 映射到 `inset-inline-start`/`inset-inline-end`，因此定位的对话框在 RTL 下正确镜像（start 贴合内联起始边缘——LTR 中为左，RTL 中为右）。物理 `left`/`right` 仍保持不变且从不镜像（非破坏性）；它们现在是 `@deprecated`，将在未来主版本中移除。当同时设置逻辑偏移及其物理对应项时，逻辑项获胜。Codemod（`migrate-dialog-position-to-logical`，v0.2.1）将 `position={{left, right}}` 重写为 `{{start, end}}`。
- DropdownMenuCheckboxItem 现在组合 CheckboxInput，使其对勾与 CheckboxListItem 匹配，并应用标准复选框主题化槽位。复选框保持装饰性——菜单行保留 role="menuitemcheckbox" 并拥有选中状态。
- DropdownMenu 现在接受 `alignment` prop，以匹配 Popover/HoverCard 的定位一致性。
- DropdownMenu：暴露分区标题、菜单分隔线、子菜单指示器图标和选中单选圆点的可主题化槽位（`astryx-dropdown-menu-section-heading`、`astryx-dropdown-menu-divider`、`astryx-dropdown-menu-indicator-icon`、`astryx-dropdown-menu-radio-dot`），使主题可以直接为它们设置样式，而无需依赖结构选择器。ContextMenu 通过共享条目渲染继承这些。
- 为 Selector 和 MultiSelector 新增 ghost 触发器变体，用于工具栏风格控件，其 ghost 状态消息默认分离。
- Field/FieldStatus：在字段状态字形上新增 `astryx-input-status-icon` 和 `astryx-field-status-icon` 主题目标，使消费者可以通过 `defineTheme` 重新着色、调整大小和重新设计它——按状态——而无需脆弱的后代选择器或原始 CSS。`astryx-input-status-icon` 位于所有带边框输入在 `attached` 和 `tooltip` 状态变体共享的字段上图标，并反映 `data-size`/`data-status`；`astryx-field-status-icon` 位于分离消息框的前导图标，并反映 `data-type`。纯增量——默认渲染不变。
- Markdown：向主题化暴露逐块间距。每种块类型现在都渲染稳定的主题目标——`astryx-markdown-heading`、`-paragraph`、`-list`、`-codeblock`、`-blockquote`、`-table`、`-hr` 和 `-image`——因此主题可以通过 `defineTheme` 调整任意块周围的间隙（`marginBlockStart`/`marginBlockEnd`），而无需覆盖全局间距 token 或使用脆弱的 `[role="paragraph"]` 风格后代选择器。每个目标反映 `data-density`（因此间距可按 `default`/`compact` 不同），标题目标还额外反映 `data-level`（1–6）以实现逐级间距。目标仅适用于默认渲染路径——自定义 `components.heading`/`code`/`blockquote`/`hr`/`image` 继续拥有自己的样式。纯增量——默认渲染不变。
- Pagination：新增 `input` 变体——一个可编辑的页码框（`NumberInput`，因此会以仅整数语义钳制到 `[1, totalPages]`），两侧是首页/末页（«/»）按钮，渲染为 `Page [ n ] / N`。导航通过现有 `onChange` 基于页码。前导名词由开放的 `pageLabel` prop 设置（默认为本地化的 "Page"；传递 `pageLabel="Row"` 可重新标记）。还新增 `step` prop，控制上一页/下一页按钮每次点击前进多少页（默认 1，钳制到范围）；当大于 1 时，按钮的可访问名称反映步幅。新增 `chevronsLeft`/`chevronsRight` 图标。首页/末页/上一页/下一页插入符现在也带有悬停 tooltip（与已用作其可访问名称的本地化、感知步幅的标签相同），因此视觉用户也能获得仅图标按钮此前只向辅助技术暴露的功能。（#4248）
- ProgressBar：新增可选的 `marks` prop，在轨道上以与 `value` 相同的 0..max 刻度绘制固定目标线（例如目标或阈值）。无论进度低于还是超过标记，标记都保持可见；每个标记需要一个 `label`（其可访问名称，通过悬停/聚焦时的 tooltip 显示），标记在不确定模式下被忽略。标记刻度可通过 `progressbar-mark` 目标直接主题化——主题在其上设置 `backgroundColor`、`width` 和 `height`（更大的高度会形成"旗帜"刻度，在条形上下对称悬垂）。标记 tooltip 惰性加载，因此没有标记的 ProgressBar 不会打包 tooltip 代码。命名为 `marks`（带有 `ProgressBarMark` 类型）以匹配 Slider 上的 `marks` prop。
- 图标注册表：`registerIcons()` 现在接受任意扩展键（不仅是内置 `IconName`），因此库可以用自己的键扩展图标映射。新增 `getExtendedIcon(name, fallback)`——解析扩展键，优先使用主题注册的图标而非调用者提供的默认值。这使得库提供的图标（例如 lab `RichTextEditorToolbar` 的 `richtext:*` 字形）可以按主题覆盖，而无需 fork。
- SelectableCard：卡片聚焦时，按 Enter 现在也会切换选中，此外还有 Space
- Selector 与 MultiSelector：下拉搜索字段现在是 `TextInput`，因此获得该组件的内置功能——字段内渲染的前导搜索放大镜（`startIcon`）和尾部清除（✕）按钮（`hasClear`），在键入查询后出现，点击时重置并重新聚焦。该字段现在共享 TextInput 的边框、焦点环和尺寸，因此与所有其他 Astryx 输入匹配，而不是自定义控件。没有新的 props 或主题目标。非破坏性，但请注意放大镜是新的默认字形，因此现有的 `hasSearch` 下拉框会获得一个前导图标。
- 新增 SSR 友好的主题和图标注册表解析，使语义图标可以从注册的主题名称解析，而无需依赖 React context。
- Table：`astryx-table-cell` 和 `astryx-table-header-cell` 现在以 `data-density`（`compact`/`balanced`/`spacious`）反映当前行密度，因此主题可以通过 `defineTheme` 按密度覆盖单元格内边距。此前密度拆分完全存在于内部 StyleX 类中，单元格目标上没有 `density:*` 钩子，因此 `components: { 'table-cell': {...} }` 条目只能为所有密度设置一种内边距——例如无法保持内联内边距恒定而仅按密度改变块内边距。目标现在携带该钩子（`{className: 'astryx-table-cell', visualProps: ['density']}`），从而支持 `components: { 'table-cell': { 'density:balanced': { paddingBlock: '12px' } } }`。纯增量——默认内边距不变。
- Table：`useTableTreeData` 新增可选的 `hasRowClickExpansion` prop。设置后，点击可展开行的任意位置即可切换展开，此外还有 chevron。对交互式单元格内容的点击或文本选择会被忽略，叶子行保持惰性，对扁平数据无操作。（#4142）
- Text 与 Heading：`color` 现在可主题扩展。`TextColor` 派生自新的 `TextColorMap` 接口（与 `ButtonVariantMap` 等技术相同），因此主题可以添加自定义文本颜色——`astryx theme build` 在 Text/Heading 覆盖上看到新的 `color:*` 值时会生成模块扩展，消费者也可以手动扩展 `TextColorMap` 以获得类型安全。自定义颜色渲染为稳定类（`astryx-text.<color>` / `astryx-heading.<color>`），由主题 CSS 绘制，并回退到 `primary` StyleX 基线，因此永远不会无样式渲染。内置颜色不变。
- Timestamp：悬停表面现在是单个可复制的悬停卡片，适用于所有显示悬停的 timestamp。相对时间戳和配置了 `tooltipEntries` 的时间戳共享一张卡片，取代旧的只读 tooltip；默认单行携带完整绝对时间，且本身可复制。
  每个 `tooltipEntries` 行通过 `isCopyable`（默认 `false`）选择加入复制按钮——因此卡片可以混合人类可读的只读行与可复制的机器值（例如显示本地和 UTC 供阅读，但只让读者获取 `system_date_time` 值）。可复制行在专用的尾部操作列中渲染其复制按钮，因此无论值宽度如何，按钮都沿一列对齐；该列仅在某个行可复制时预留，因此完全只读的卡片没有尾部空槽。卡片的标签使用 `supporting` 文本角色（Timestamp 自身默认的次要、更安静的语域），值使用 `body` 角色。
- Timestamp：新增 `relative_short` 格式——`relative` 的紧凑同类。它使用相同的层级边界和当前/时钟偏移处理，但为空间受限表面（聊天元数据、密集表格、chip）渲染缩写单位：`now`、`30s ago`、`5m ago`、`2h ago`、`1d ago`、`3mo ago`、`2y ago`，未来时间用 `in 5m`。月份渲染为 `mo`（不是 `m`），因此永远不会与分钟冲突；短格式始终为数字（没有 `yesterday` 习语）。与 `relative` 一样，它保留完整绝对日期作为可访问名称，并获得悬停 tooltip 和实时更新。增量——现有格式不变。
- Timestamp：将最近新增的 `system_unix` 格式重命名为 `unix_seconds`。该值是自纪元以来的整数秒的绝对 Unix 时间——不是壁钟 `system_*` 渲染——因此不属于 `system_*` 系列；明确的单位名称也为未来的 `unix_millis` 留出空间。行为不变（与区域无关的 epoch 秒）。这重命名了一个刚刚发布的格式值，在其有消费者之前。
- Timestamp：两项新增。（1）新的 `system_unix` 格式将值渲染为自纪元以来的整数秒的 Unix 时间（例如 `1771520400`）——一个绝对的、与区域无关的机器值，可作为可复制的 `tooltipEntries` 行与人类可读时区并列。它加入 `system_*` 机器可读系列，并且由于是绝对时间，忽略任何 tooltip 时区。（2）可复制悬停卡片的复制按钮现在在悬停/聚焦时显示可见的 `Copy` tooltip（复制后翻转为 `Copied`，与图标同步），因此视觉用户可以发现该功能；完整 `Copy <value>` 字符串仍是按钮的 aria-label 供辅助技术使用。两者均为增量——现有格式或默认渲染无变化。
- 新增 `useContainerReveal`——一个无头 hook，用于在其容器被悬停或聚焦时显示（或隐藏）内容。CSS 驱动（JS 中无悬停状态，悬停时不重新渲染）且天生无障碍：显示的内容保留在无障碍树和 Tab 顺序中，在键盘 focus-within 时显示，在触摸时保持可见。调用者在容器上展开 `getContainerProps()`，在每个子元素上展开 `getContentRevealProps()`；无需 StyleX 编写。`Thumbnail` 的 `showRemoveOn="hover"` 现在内部使用此 hook（无 API 变更）。

#### 问题修复

- AppShell：使跳转链接目标可聚焦（tabIndex={-1}），通过 i18n catalog 本地化跳转链接标签，并将 header 区域暴露为 banner 地标
- CheckboxList：每个选项是单个 Tab 停留点——复选框是选项唯一可聚焦的控件（WCAG 4.1.2）。行现在是一个扩大的点击/轻触目标，通过 Item/ListItem 上新的 `interactiveRef` prop 将表面点击委托给复选框（useClickableContainer 模式），取代内部不可见的行按钮。`interactiveRef` 与 `onClick`/`href` 互斥。
- Resizable、TabMenu：两个集合 ARIA 小修复（WCAG 4.1.2）——Resizable 的折叠手柄将 `aria-valuenow` 钳制到 `aria-valuemin`，并通过 `aria-valuetext` 播报本地化的 "Collapsed"，TabMenu 的溢出选项是带 `aria-checked` 的 `menuitemradio`（APG menu-button 单选），而不是 `menuitem` + `aria-current`。
- core：在强制颜色/Windows 高对比度下保留绘制控件（Switch、CheckboxInput、RadioList、SegmentedControl、ToggleButton、Skeleton）的状态指示（WCAG 1.4.11）
- i18n：本地化剩余的硬编码辅助技术字符串（AvatarGroup 溢出标签、CodeBlock 复制播报、Button 加载播报、MetadataList 显示更多/更少、Table 行展开上下文菜单操作、键盘提示）
- i18n：新增 `@astryx.step.*` catalog 键（`goToStep`、`goToStepWithStatus`、`status.completed`/`status.warning`/`status.error`），支持 lab Stepper 的本地化状态文本和可点击步骤的可访问名称。
- Lightbox：新增键盘缩放（图像上按 Enter/Space、`+`/`-`）和缩放时的方向键平移，带礼貌播报（WCAG 2.1.1）
- Selector：在 MultiSelector 全选部分状态的可访问名称中传达该状态，将 Selector/MultiSelector 空状态消息标记为列表框内的表现性元素，并在显示 token 时从 Tab 顺序中移除 Typeahead 的折叠输入
- Toast：通过持久的单例 live region 播报 toast，而不是随其内容一起挂载的逐 toast region
- theme：保证生成的色彩 token 对的 WCAG 对比度——文本对表面对在 >= 4.5:1 断言，非文本 UI 对在 >= 3:1（WCAG 1.4.3/1.4.11），并在生成过程中对 `--color-border-emphasized` 进行色调提升，直到其与生成的表面达到 3:1
- Token：当同时提供 `href` 和 `onRemove` 时，将移除按钮渲染为链接的兄弟元素，而不是嵌套在锚点内。token 表面现在通过 `useClickableContainer` 委托给链接，因此点击 token 上的任意位置（包括中键点击或 cmd/ctrl+点击在新标签页打开）都会激活链接，而移除按钮继续处理自己的点击。
- theme build：生成的自定义 Button 变体现在通过公共 `@astryxdesign/core/Button` 子路径进行类型检查。
- 为 ChatComposerDrawer 的 bar handle 尺寸使用间距 token。
- ChatLayout 在自我滚动模式下，当消息未填满视口时不再显示幻影滚动条。根现在是一个 flex 列：消息区域弹性填充 composer dock 不需要的空间，因此粘性 dock 的自然高度是 100% 的一部分，而不是恰好溢出 dock 高度。长对话仍然滚动，dock 仍然粘性；external-scrollRef 模式（固定 dock）不变。
- 弃用 `useListFocus` 和 `useGridFocus` 上的 `isRtl` 选项。从右到左的方向键方向现在从容器自动检测，因此显式覆盖是多余的，将在即将到来的主版本中移除——省略它，RTL 会自动处理。
- DropdownMenu 现在报告非受控的原生打开/关闭转换，并在原生弹层关闭后将焦点恢复到触发器。
- DropdownMenu：当另一个条目仍持有焦点时，子菜单触发器悬停时不再显示第二个高亮——悬停现在将单一焦点驱动的高亮移动到触发器上，与常规菜单项一致
- CheckboxInput 与 Switch：点击字段描述现在会转发到控件（整个标签区域是一个命中目标），而描述内的交互式内容（链接、按钮）的点击则不受影响。没有新的 prop 或无障碍树变更——描述仍是标签的兄弟元素，因此不会折叠进控件的可访问名称。
- FieldLabel：通过 i18n 运行时本地化 "Required"/"Optional" 指示器，而不是硬编码英文，使消费者可以通过 `InternationalizationProvider` 翻译它（#4508）。
- useContainerReveal：消除默认（非布局保留）显示时的退出闪烁。隐藏内容会离散地翻转 `position: static -> absolute`，此前会在淡出运行之前以完全不透明度将其突然移出布局流。现在翻转通过 `transition-behavior: allow-discrete` 和状态条件延迟参与过渡，因此它在退出时保持流动直到不透明度淡出完成，而在进入时保持即时。内容在整个过程中保留在无障碍树和 Tab 顺序中。
- Selector 和 MultiSelector：使用 `statusVariant="detached"` 时，字段上的状态图标不再显示在触发器内。分离消息框已经渲染自己的前导状态图标，因此字段保留其 chevron 指示器，而不是重复字形——与带边框输入一致。
- 动态 `import()` 说明符现在在发布的 ESM dist 中获得强制 `.js` 扩展名——`babel-plugin-add-extensions` 只重写静态 import/export 声明，因此 `Text`、`Heading` 和 `Timestamp` 中的惰性 Tooltip 说明符以无扩展名形式发布，严格 ESM 消费者（Rspack、webpack `fullySpecified`、Node ESM）无法解析任何导入它们的组件。新的构建后门禁（`scripts/check-fully-specified.mjs`）现在会使任何 dist 发布无扩展名相对说明符的构建失败。（#4569）
- TopNavMegaMenu：将桌面 mega-menu 面板保持在视口内——将其高度限制为导航下方的空间（内部滚动）并限制其宽度——因此高或宽的菜单不再溢出屏幕边缘并裁剪内容
- Lightbox：使背景点击关闭真正可达
  关闭检查仅匹配对话框元素本身的点击，但布局容器填满了整个透明对话框，因此点击媒体周围深色区域的点击总是落在容器上，从未关闭灯箱。现在对容器的点击也会关闭，并且在背景上结束的平移拖动会被忽略。
- Markdown 流式性能测试声明与自己预算匹配的显式超时，而不是依赖 vitest 的 5s 默认值
- MetadataList：数字 `columns` 值在堆叠标签时得到遵守。此前当标签堆叠时（多列列表的默认值），`columns={3}` 会回退到响应式 `repeat(auto-fill, minmax(280px, 1fr))` 网格，因此文档所述的固定列数仅在 `label={{position: 'start'}}` 下有效。网格模板现在涵盖两种标签位置——堆叠标签用 `repeat(n, 1fr)`，侧边标签用 `repeat(n, auto 1fr)`——并通过 StyleX 动态样式解析，而不是内联 `style` 对象。
- MultiSelector：移除触发器按钮自身的焦点轮廓，使其不再
  重复字段包装器的焦点环。包装器渲染单个 `:focus-within` 环，与 `Selector` 和其他带边框输入一致。
- NumberInput：隐藏浏览器原生数字微调器，使字段在各浏览器中与组件自身的视觉处理一致，并阻止聚焦时的滚轮手势（会步进值）同时滚动祖先容器。键盘步进和 `spinbutton` role 不变，因此没有无障碍影响。
- Pagination：使用 CSS（共享的 `scaleX(-1)` 镜像）在 RTL 下镜像上一页/下一页 chevron，而不是在 JS 中读取环境方向。控件现在纯粹根据祖先的 `dir` 翻转，与 Calendar 和库的其余部分一致——因此它们在服务器上正确渲染，没有水合闪烁。无 API 变更；`aria-label` 不变。
- Popover：暴露包装器 role 和模态选项，以便非对话框弹层内容可以拥有自己的语义。
- 新增共享的 `rtlStyles.centerInline(blockOffset)` 辅助函数，用于在内联轴上水平居中绝对定位、自动宽度的元素，并将可选的块轴偏移折叠到同一变换中。它有意使用物理 `left: 50%` + `translateX(-50%)`——两者引用相同的物理边缘，因此该对是方向对称的，在 LTR 和 RTL 中居中效果相同。逻辑 `insetInlineStart: 50%` 锚点在 RTL 中会翻转，而物理 translate 不会，会使元素偏离中心其自身宽度。这是物理 `left` 正确的唯一情况，因此唯一被认可的 `no-physical-properties` 抑制位于辅助函数中，而不是每个调用点。
  `@astryx/no-physical-properties` 规则现在识别这种 `left: '50%'` + 居中 `translate` 习语，并将违规者指向辅助函数，而不是错误地建议逻辑重命名。
- RTL 物理→逻辑迁移已完成，因此将 `@astryx/no-physical-properties` lint 规则在推荐和严格两个层级中从 `warn` 提升为 `error`。现在核心包已干净（唯一被认可的物理抑制位于 `rtlStyles.centerInline`），这可以防止未来的物理属性回归。
- RTL 第 4c 阶段——使三种动画/交互行为在 RTL 下方向感知：ProgressBar 不确定条现在沿阅读流（右 → 左）滑动，而不是始终物理左 → 右；Switch 滑块在切换时镜像（关闭滑块在阅读起始侧，开启滑块在阅读结束侧，按 Material/iOS 惯例）；水平 Layer 进入动画（Popover/DropdownMenu/HoverCard/Selector 的 placement start/end）现在从正确的物理侧轻推进入。垂直 Layer 进入不变（方向中性）。LTR 行为完全相同。
- 完成核心包中的 RTL 物理→逻辑 CSS 迁移：最后一批组件（Avatar、Banner、Calendar、Chat composer、Chat composer drawer、Markdown、Popover、Slider、Resizable）现在使用 CSS 逻辑属性（`insetInlineStart/End`、`borderStart*/End*` 圆角、`textAlign: 'end'`）而不是物理 `left`/`right`，因此它们在 RTL 下正确镜像。Avatar 状态点的外推 `transform` 现在方向感知，因此它贴合底部内联结束角（LTR 中右下，RTL 中左下），而不是在 RTL 下向内拉。
  Popover 关闭按钮、垂直 Slider 轨道/滑块和 ResizeHandle 居中的抓取区域/胶囊现在使用共享的 `rtlStyles.centerInline` 辅助函数——修复了一个 RTL 回归：逻辑 `insetInlineStart: 50%` 锚点结合物理居中 `translate` 会使元素偏离中心其自身宽度。
- TextArea：`<textarea>` 现在跨越整个输入容器，图标、状态/spinner 和字符计数器作为绝对定位覆盖层。原生调整大小手柄位于容器右下角，滚动条覆盖整个字段。`maxLength` 计数器移到容器内，锚定在文本下方的右下角（#4233）。
- Thumbnail：当图像加载失败时显示占位符
  文档承诺加载失败时显示占位符，但 img 没有错误处理，因此损坏的 src 会无限渲染损坏图像。组件现在跟踪出错的 src 并回退到占位符，在 src 变化时重试。
- TreeList 方向键导航现在在 RTL 下遵循视觉方向：在 `dir="rtl"` 下 ArrowLeft 展开，ArrowRight 折叠（从 LTR 镜像）。自动检测；LTR 不变。

#### 文档

- 软弃用 useTableRowExpansion 和 useTableRowExpansionState，转而使用树插件（useTableTreeData + useTableTreeState）。这些 hook 仍可用；JSDoc @deprecated 标签和文档指向迁移指南。移除将在稍后的版本中进行。
- 记录 `@astryxdesign/core` 的 StyleX peer 依赖——在两个 README 的 Getting Started / Quick Start 安装命令中添加 `@stylexjs/stylex`，并在 `astryx init` 下一步提醒中确保满足 `@stylexjs/stylex` peer 依赖，并指向 `astryx doctor`。StyleX 是每个组件调用的样式运行时，并非所有包管理器都会自动安装 peer。
- 在用户可能查看的每个位置（根 README、core README、docsite hero 和 CLI 入门指南）展示 React 19 peer 依赖要求，并添加一个同步测试，保持这些表面命名为与 core peer 范围相同的 React 主版本。
- 添加从 useTableRowExpansion 到 useTableTreeData + useTableTreeState 的迁移指南（前后示例加配置映射），因为两个树插件正在收敛。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @arham766
- @athz
- @bhamodi
- @cixzhang
- @freddymeta
- @HelloOjasMutreja
- @humbertovirtudes
- @imdreamrunner
- @jiunshinn
- @josephfarina
- @nynexman4464
- @potatowagon

---

# 0.2.0

#### 破坏性变更

- TabList：移除 orientation prop（误导性的无操作）。该 prop 不会渲染垂直标签页；它只切换键盘提示徽章箭头。方向键导航一直通过 useListFocus 中的 orientation: both 接受两个轴（水平和垂直）。运行 astryx upgrade 自动从代码中剥离该 prop。

#### 新功能

- `Avatar` 通过 `href`/`onClick` 获得可选交互性（带有 `as`/`target`/`rel`），遵循 Button 的元素交换三分法：`href` 通过 `useLinkComponent` 渲染链接，`onClick`（无 href）渲染 `<button type="button">`，两者都没有时头像保持为静态、不可聚焦的元素（非破坏性默认）。交互式头像获得 focus-visible 强调环和必需的可访问名称（来自 `alt`/`name`）。在 `AvatarGroup` 内，交互式头像——以及交互式 `AvatarGroupOverflow`——现在共享一个 Tab 停留点，并具有游走的 ArrowLeft/ArrowRight 焦点，组通过 `aria-describedby` 暴露屏幕阅读器键盘提示。纯静态头像堆不变。（#4170）
- Citation：`CitationSource.icon` 现在接受 `ReactNode`（例如 Astryx `<Icon>`、SVG 或自定义元素），此外还有图像 URL 字符串，并且新的 `CitationSource.src` 字段保存 favicon/logo 图像 URL（与 `Avatar`/`Thumbnail` 一致）。增量和非破坏性：字符串 `icon` 仍渲染为 favicon `<img>`，因此现有调用者不受影响。当节点 `icon` 和 `src` 同时设置时，节点获胜。图标保持装饰性——可访问名称仍仅来自引用的 `aria-label`。
- CodeBlock：将折叠 chevron 移到标题/语言标签左侧，遵循前导展开惯例（折叠时指向右 `>`，展开时指向下 `v`）。它通过宽度 + 内联外边距生长到位，因此平滑地将标题滑过，而不是突然弹出并移动标题。尊重 `prefers-reduced-motion`（#4513）
- Collapsible：将触发器按钮暴露为独立的主题化目标（`astryx-collapsible-trigger`），使主题可以独立于内容为触发器设置样式——例如触发器使用标题字体而内容保持正文字体。
- DateInput：在清除和日历切换字形上新增 `astryx-date-input-clear-icon` 和 `astryx-date-input-toggle-icon` 主题目标，使消费者可以通过 `defineTheme` 为每个图标重新着色、调整大小和悬停样式——以及设置切换的打开/关闭状态样式——而无需脆弱的后代选择器或原始 CSS。切换通过 `data-state` 属性反映其打开/关闭状态。`Icon` 现在完全处理其样式 props（`className`、`style`、`xstyle`），因此它们与其基础样式组合而不是被丢弃。默认渲染不变。
- DateRangeInput：在清除和日历切换字形上新增 `astryx-date-range-input-clear-icon` 和 `astryx-date-range-input-toggle-icon` 主题目标，使消费者可以通过 `defineTheme` 为它们重新着色、悬停变形和调整大小，而无需脆弱的后代选择器或原始 CSS。切换图标通过 `data-state` 属性反映其打开/关闭状态。`Icon` 现在完全处理其样式 props（`className`、`style`、`xstyle`），因此它们与其基础样式组合而不是被丢弃。默认渲染不变。
- DateTimeInput：在两个段包装器上新增 `astryx-date-time-input-date-segment` 和 `astryx-date-time-input-time-segment` 主题目标，使主题可以通过 `defineTheme` 重新设计其几何形状（内边距/高度/字体），而不是完全无法访问它们。两者都以数据属性反映 `size` 和 `status`，与根目标一致。默认渲染不变。
- DropdownMenu：通过单个 `DropdownMenuSubMenu` 组件（或数据模式下的嵌套 `items` 数组）添加子菜单。行采用 DropdownMenuItem 语义（label / icon / description / isDisabled），其 children——或 `items` 数组——成为飞出内容。飞出内容在内联结束方向打开，具有自动翻转、悬停意图和完整键盘支持（Right/Enter/Space 打开并聚焦第一个条目；Left/Escape 关闭并将焦点返回触发器）。
- 带边框输入新增 `statusVariant="tooltip"` 选项，隐藏状态消息框并将状态作为 info-tip 显示在字段上的状态图标上。该图标是真正可聚焦的按钮，因此每个人都能访问状态：键盘用户 Tab 到它（有可见焦点环）并在聚焦时看到消息，指针用户悬停时看到，触摸用户轻触切换。消息通过 `aria-describedby` 同时传入输入和按钮，tooltip 可用 Escape 关闭。已添加到 TextInput、TextArea、NumberInput、DateInput、DateRangeInput、TimeInput 和 FileInput。
- 带边框输入系列现在接受 `statusVariant` prop（`'attached' | 'detached'`，默认 `'attached'`），转发给底层 `Field`，让你以带间距的方式将状态消息浮动到输入下方，而不是重叠。已添加到 TextInput、TextArea、NumberInput、DateInput、DateRangeInput、TimeInput、Selector、MultiSelector、Typeahead、Tokenizer、FileInput 和 PowerSearch。非破坏性：默认值匹配当前行为。（#4187）
- 新增 RTL 方向 API：`useDirection()` hook、`getLocaleDirection(locale)` 服务器安全辅助函数，以及 `InternationalizationProvider` 上可选的 `dir` prop。
- RTL：通过共享的 `rtlStyles.mirror` CSS 变换在 RTL 下镜像方向性展开/导航 chevron，应用于 Lightbox 中的图标包装器以及 Table 树 / 分组行 / 行展开插件。镜像与 Table chevron 的状态旋转正确组合（展开的 chevron 在 RTL 下仍指向下）。语义 aria-label 不变。
- Selector 与 MultiSelector：在清除和 chevron 字形上新增 `astryx-selector-clear-icon`、`astryx-selector-indicator-icon`、`astryx-multi-selector-clear-icon` 和 `astryx-multi-selector-indicator-icon` 主题目标，使消费者可以通过 `defineTheme` 为每个图标重新着色、调整大小和悬停样式——以及设置 chevron 的打开/关闭状态样式——而无需脆弱的后代选择器或原始 CSS。每个 chevron 通过 `data-state` 属性反映其打开/关闭状态。`Icon` 现在完全处理其样式 props（`className`、`style`、`xstyle`），因此它们与其基础样式组合而不是被丢弃。默认渲染不变。
- 为 Switch 添加 size prop（sm / md），以匹配 CheckboxInput 和 RadioList 布尔控件刻度（#4230）
- Table：`rowIndexStart` 和 `rowCount` props 将行编号作为表格级 ARIA 关注点暴露，因此 `aria-rowindex`/`aria-rowcount` 反映行在整个数据集中的位置：跨分页正确，即使没有渲染可见索引列也正确。可选；两个 prop 都不设置的表格不变。关闭 #3939。
- Timestamp：新的 `tooltipEntries` prop 同时在多个时区和/或格式中渲染悬停 tooltip——每个条目一行，每个都有可选的 `timezoneID`（IANA id；省略或传递 `'local'` 表示查看者所在时区）、`format`（每个非相对 `TimestampFormat` 加上 `'full'`）和 `label`。默认不变：没有条目时 tooltip 保持查看者时区的单行完整绝对时间。配置条目还会将 tooltip 附加到绝对格式，而此前没有——请注意这会给这些 timestamp 一个 Tab 停留点和焦点环，正如相对 timestamp 已有的，因此一列这样的时间戳每行会增加一个 Tab 停留点。`hasTooltip={false}` 仍会抑制 tooltip，空数组视为未配置。还更正了 `isTimezoneShown` 的文档，该文档声称它适用于 `system_date_time` 和 `system_time` 格式；它从未适用，这些格式保持机器可读。（#4188）
- Token：通过模块扩展使 `color` prop 可扩展。`TokenColor` 现在派生自 `TokenColorMap` 接口，因此主题包可以添加自定义颜色（并且 `astryx theme build` 生成类型扩展），与 Badge 和 Button 一致。
- TreeList：逐级缩进步长现在是可主题化的 `--tree-list-indent` 变量（默认 `var(--spacing-4)`），因此主题可以通过 `defineTheme` 在 `tree-list` 目标上重新调整缩进度量，而不是之前硬编码、无法访问的步长（#4308）。
- TreeList：新增 `variant` prop（`'lineGuides' | 'noGuides'`，默认 `'lineGuides'`）以选择基础层级导线外观。`noGuides` 隐藏连接线，同时保持缩进不变。与 `density`（间距）正交；导线仍可通过 `astryx-tree-list-guide` 目标主题化。非破坏性——省略该 prop 渲染与之前完全相同。

#### 问题修复

- Avatar：将状态点的标签组合进头像的可访问名称，以便辅助技术访问 `role="img"` 根此前剪除的状态（WCAG 4.1.2）
- Calendar：在日期按钮的可访问名称中暴露选中状态，通过礼貌 live region 播报范围选择进度和完成，并在范围模式下在网格上设置 aria-multiselectable
- CommandPalette：通过共享的礼貌 live region 向屏幕阅读器播报结果计数、空和加载状态（WCAG 4.1.3）
- Divider：通过 aria-labelledby 将标签暴露为分隔符的可访问名称；Spinner：从可见标签命名状态元素，而不是将其重复为 aria-label
- FileInput：通过触发器上的视觉隐藏描述播报必填状态（role="button" 不支持 aria-required），并恰好播报一次验证错误
- hooks：通过 DOM 深度而非推送顺序解析焦点陷阱 Escape，从陷阱 Tab 循环中排除 aria-hidden 子树，并在播报后自动清除 live region，以免陈旧状态文本残留
- List：通过始终发出显式 role="list" 为所有 listStyle 变体保留列表语义，因为基础样式会为每个变体剥离 list-style-type，而 Safari/VoiceOver 会对此类列表丢弃隐式列表 role（WCAG 1.3.1）
- NumberInput：通过输入的可访问描述播报单位文本，并停止 TextInput/NumberInput 在 InputGroup 内引用未渲染的状态消息 id 到 aria-describedby
- reset：停止在粗指针设备上抑制 `:focus-visible` 轮廓，使键盘用户保留 WCAG 2.4.7 焦点指示器
- hooks：在 useListFocus 和 useGridFocus 中为方向键导航自动检测 RTL 方向（WCAG 1.3.2）
- Slider：通过兄弟滑块（包括 minStepsBetweenThumbs）约束范围滑块的 aria-valuemin/aria-valuemax，并将标签渲染为通过 aria-labelledby 连接的组标签，而不是惰性的 <label htmlFor>
- TopNav：禁用的 TopNavItems 现在渲染无 href 的锚点，因此不再导航或触发点击，Outline 的活动项使用 aria-current="location"
- Avatar：当名称 tooltip 切换时避免重新挂载头像子树——将 tooltip 渲染为条件兄弟元素，而不是 fork 返回，因此头像在 React 树中保持其位置（及其图像加载状态）跨 tooltip 变化。
- Card：带边框变体基于微妙的 `--color-border` 而不是 `--color-border-emphasized`，因此 Card 的外框与其自身的 LayoutHeader/LayoutFooter 分隔线和相邻的 ClickableCards 匹配，而不是渲染更重的边缘。
- CheckboxInput、RadioList、Switch：对齐控件尺寸。可见的复选框和单选控件现在正好填充其尺寸（`sm` 时 20px，`md` 时 24px），而不是内缩 2px。`sm` Switch 轨道现在宽 32px，内缩 2px。
- 通过 `@astryxdesign/core/BaseProps` 子路径导出 `BaseProps` 类型。此前只能通过包 barrel 访问，因此 `astryx swizzle` 生成的 `import type {BaseProps} from '@astryxdesign/core/BaseProps'` 说明符无法解析（#4091）。
- 使用 `@media (hover: hover)` 防护 DropdownMenu 条目悬停样式，以防止触摸设备上的粘滞高亮。将 BaseProps 透传转发到菜单元素。
- FieldStatus 在 `detached` 消息上渲染前导状态图标，因此状态不仅通过颜色/位置传达（WCAG 1.4.1）。该图标对辅助技术是装饰性的；消息文本和 live region 播报承载状态。`attached` 变体不变。
- FileInput 不再在 role="button" 触发器内嵌套交互式控件（清除和状态按钮）。触发器现在是一个视觉隐藏的按钮，与它们并排位于非交互容器中，解决了嵌套交互的无障碍违规（WCAG 4.1.2），同时保留点击、键盘和拖放行为。（#4522）
- 输入在禁用时不再显示悬停环。共享输入包装器的禁用状态现在同时抑制基础和状态悬停阴影，因此 TextInput、TextArea、NumberInput、DateInput、TimeInput、Selector、MultiSelector、Typeahead 和 Tokenizer 在禁用时悬停保持视觉惰性。
- HoverCard：将 themeProps className 移动到图层容器（背景/圆角/阴影所在处），以便主题可以定位视觉表面。将消费者的 xstyle/className/style 转发到同一图层容器，使表面定制与主题类相邻，而不是静默丢弃它们。
- 使用 `statusVariant="detached"` 时，带边框输入不再在控件内渲染状态图标（这也涵盖 DateTimeInput，它固定为 detached 呈现）——detached 消息框已经携带前导图标，因此字段上的字形是重复的。还使 detached 消息的图标在文本第一行居中。
- DropdownMenu/ContextMenu：鼠标悬停现在移动高亮，而不是添加第二个高亮，因此键盘焦点和指针悬停共享单个高亮条目（#4493）
- utils：将 plainDateAddMonths 钳制到目标月份的最后一天
  将一个月加到 1 月 31 日会落到 3 月 3 日（Date#setMonth 溢出），而不是 2 月 28 日，因此从月末日期进行月份算术会完全跳过二月。该辅助函数现在使用纯月份算术并钳制日期，与 Temporal.PlainDate.add 和 date-fns 一致。
- Calendar RTL：月份导航 chevron 现在在 RTL 下正确镜像（通过导航图标包装器上的共享 `rtlStyles.mirror` 变换），范围选择/悬停预览填充胶囊使用逻辑 CSS（`insetInline*`、`border*Start/EndRadius`），因此其圆角起始/结束端盖遵循阅读方向而不是物理左/右。LTR 渲染不变。
- Carousel 现在支持 RTL：方向滚动按钮 chevron 在 RTL 下镜像，滚动按钮尊重 RTL 滚动语义（此前按钮在 RTL 下无效），按钮胶囊位于正确的边缘。
- RTL：将物理 `left`/`right` CSS 属性迁移到其逻辑等价项，使组件在 `dir="rtl"` 下正确镜像。这是 RTL 方向 API 的第 2 阶段机械式一对一后续——在默认 LTR 方向下为无操作，无视觉变化。
- RTL 第 4 阶段（行为）：镜像仅靠逻辑 CSS 和图标名称交换无法修复的方向性行为。SideNavCollapseButton 和 TreeListItem 现在在状态旋转之外的图标包装器上组合 `rtlStyles.mirror`，因此 chevron 在每个 collapsed/expanded × LTR/RTL 组合中都指向正确的边缘。TreeList 连接/导线通过逻辑 `inset-inline-start`/`inset-inline-end` 定位，因此在 RTL 下与 chevron 和行缩进一起镜像到内联起始（右）边缘。Slider 通过逻辑 `inset-inline-start` 定位其滑块、填充和标记，并在 RTL 下翻转物理居中变换，其指针/点击数学在 RTL 下从内联起始（右）边缘测量值分数——因此点击轨道 25% 处映射为 75 而不是 25。
- RTL 第 4b 阶段行为修复：ChatMessageBubble 分组气泡尾部圆角现在使用逻辑圆角半径，因此尾部遵循阅读方向（在 RTL 下镜像，文本不受影响）；Table 粘性列阴影使其 `translateX` 和渐变方向感知，因此阴影从固定边缘向滚动内容淡出，在 LTR 和 RTL 中都正确，而不是内外翻转，并基于 `Math.abs(scrollLeft)` 门控阴影可见性，使起始/结束阴影在 RTL 下仍出现（在符合规范的浏览器中报告负 `scrollLeft`）；ResizeHandle 的命中区域偏置现在方向感知（在 RTL 下围绕中心镜像），指针拖动增量读取句柄的计算方向，因此在 RTL 中拖动调整大小符合直觉。
- Markdown 对独立（块）图像遵守 `components.image` 覆盖，与内联图像路径一致。独立的 `![alt](src)` 行解析为块图像，其渲染路径此前硬编码裸 `<img>` 并忽略提供的 `components.image`；现在它像内联图像一样使用覆盖。
- Selector 与 MultiSelector：搜索时保持组标题可见；隐藏没有匹配项的组。此前键入查询会将分组选项扁平化为单个未分组列表；现在每个组标题保持在其匹配项上方，仅当组内没有任何项匹配时才隐藏该组。
- SideNav：移除页脚区域上方的顶部边框，使 `footer` 插槽不再渲染分隔线。
- Slider：将吸附值舍入到 min/step 小数精度
  使用小数步长时，`min + steps * step` 会累积二进制浮点误差，因此 `step={0.1}` 滑块上的键盘微调会通过 `onChange`/`onChangeEnd` 发出 `0.30000000000000004`（并在消费者回显后进入 `aria-valuenow`/值 tooltip）。吸附值现在舍入到 `min` 和 `step` 的组合小数精度，仅消除误差——精确步长不受影响。
- Tooltip：当触发器被按下时关闭 tooltip。此前 tooltip 在点击期间保持打开（例如 "Copy link" 按钮的 tooltip 在激活后仍停留）；现在按下触发器会隐藏其自身 tooltip。仅适用于非受控 tooltip。
- Typeahead：当搜索结果为空或索引越界时省略 aria-activedescendant（#4059）

#### 文档

- 在 17 个输入组件文档文件中记录 `width` prop（#4163）

#### 其他变更

- 添加 `@astryx/no-physical-properties` ESLint 规则，标记 `stylex.create()` 内的物理 left/right CSS 属性并建议用于 RTL 支持的 CSS 逻辑等价项。
- KEY-BASED：`marginLeft`/`marginRight`、`paddingLeft`/`paddingRight`、`borderLeft`/`borderRight`（及其 `Width`/`Style`/`Color` 长属性）、`left`/`right` → `insetInlineStart`/`insetInlineEnd`，以及四个物理角半径 → 其对角线感知的逻辑名称（`borderTopLeftRadius` → `borderStartStartRadius` 等）。
- VALUE-BASED：`textAlign: 'left'|'right'`、`float: 'left'|'right'` 和 `clear: 'left'|'right'`（键保留，仅标记物理值）。
- 严格限定于 `stylex.create()`——其他地方使用的物理标识符被忽略。
- `useDirection()` 返回当前 provider 上下文的 `'ltr' | 'rtl'`（在 provider 外调用时回退到 `'ltr'`）。
- `getLocaleDirection(locale)` 通过 `Intl.Locale.getTextInfo()` 从 BCP 47 locale 计算方向——可安全地从 React Server Components 和 Next.js 布局调用以设置 `<html dir>`。
- `<InternationalizationProvider locale="ar">` 自动派生 `dir="rtl"`。传递显式 `dir` prop 以覆盖（对于在英文 catalog 下进行 RTL 测试或强制 LTR 很有用）。
- Pagination 是第一个使用该 hook 的组件：上一页/下一页 chevron 图标在 RTL 下翻转，而 aria-label 保持语义。
- Storybook 新增全局 `Direction` 工具栏，用于在 LTR 和 RTL 之间切换每个 story。
- 组件级 CSS 迁移（边框、chevron、滑块、日历范围胶囊等）在后续 PR 中落地。
- `textAlign: 'left' | 'right'` → `'start' | 'end'`（Selector、Typeahead、Chat 触发器菜单、DropdownMenu、CommandPalette、NavMenu 条目）。
- `borderLeft*`/`borderRight*` → `borderInlineStart*`/`borderInlineEnd*`，保留为单独的 start/end 声明（Banner、Table 单元格/表头分隔线、DateRangeInput 预设侧边栏）。
- 静态 `left`/`right` 定位 → `insetInlineStart`/`insetInlineEnd`，用于全出血覆盖层和单侧偏移（Button spinner 覆盖层、Chat dock/blur/placeholder、Field sr-only 标签、Lightbox 关闭/导航/计数器按钮、TabList 指示器、Thumbnail 移除槽、CodeBlock 复制按钮）。
- 内联 `marginLeft` 缩进 → `marginInlineStart`（TreeList 行）。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @arham766
- @bhamodi
- @cixzhang
- @ernestt
- @freddymeta
- @HelloOjasMutreja
- @humbertovirtudes
- @kentonquatman
- @lexs
- @nynexman4464

---

# 0.1.9

#### 新功能

- Avatar：新增 `tooltip?: string | boolean` prop，用于悬停显示名称的 tooltip。省略它（或传 `true`）会在悬停和键盘聚焦时显示头像的 `name`；字符串则显示该文本（无需包裹在 `Tooltip` 中）；`false` 禁用它。Avatar 通过现有的 Tooltip hook 拥有 tooltip，因此没有额外的包装 DOM。因为这会给每个现有的具名 Avatar 添加默认 tooltip，当你提供自己的 `Tooltip`/`HoverCard` 覆盖层时应设置 `tooltip={false}`。根 `aria-label`（`alt || name`）不变；默认名称 tooltip 仅视觉（没有 `aria-describedby` 重复播报），而自定义字符串 tooltip 会作为描述暴露。装饰性头像（无 `name`/`alt`）没有 tooltip。（#4164）
- BreadcrumbItem 新增 `menu` prop，将面包屑变为菜单触发器，用于在兄弟目标之间切换。它接受与 DropdownMenu/MoreMenu/ContextMenu 相同的条目 API（`DropdownMenuOption[]` 数组或组合的条目 children），因此现有菜单项定义无需重写即可放入面包屑。条目组件也以 `Breadcrumb*` 别名重新导出。
- Calendar：使今天/选中日期单元格的环精确可主题化。日期单元格现在反映复合 `marker` 状态（`today-only` / `today-in-range`），与实际绘制的处理 1:1 映射，因此 `defineTheme({components: {'calendar-day': {'marker:today-only': {...}}}})` 精确匹配这些状态，而不会过度匹配或需要 `:not()` 排除。默认渲染不变。
- Calendar：为上一页/下一页月份导航按钮新增专用的 `astryx-calendar-nav` 主题目标，使消费者可以通过 `defineTheme` 为主题导航控件（颜色、圆角、按方向、禁用边缘）设置主题，而无需通过全局 `astryx-button` 句柄触达每个 Button。以数据属性反映 `nav`（prev/next）和 `disabled` 状态。
- ChatComposer：使自定义输入成为一等公民。`useChatComposerContext()` 及其类型现在是公开的，因此 `input` 插槽中的任何输入都可以读取 `value`/`onChange`/`onSubmit`/`canSend`/`placeholder`/`isDisabled` 并驱动外壳的发送按钮。输入可以在 `inputControlRef` 上注册焦点控制，使点击聚焦适用于任何输入形状（不仅是 `contenteditable`/`textarea`）；外壳为未插桩的输入保留 DOM 查询回退。
- ChatComposerInput：新增 `onKeyDown` 接缝，使消费者可以托管平台或应用特定的按键处理——例如在触摸键盘上 `preventDefault()` Enter 以插入换行，或在 Cmd/Ctrl+Enter 时提交。Enter 也不再在 IME 组合中途提交。
- CommandPalette：在组标题上新增专用的 `astryx-command-palette-group-heading` 主题目标，使消费者可以通过 `defineTheme` 仅为主题标题设置主题（例如其内边距或排版），而无需脆弱的结构选择器。组根保留自己的 `astryx-command-palette-group` 目标。
- DateInput 新增 `format` prop 用于提交的日期值，复用 Timestamp 的 `format` 词汇，使相同字面量在两个组件中渲染相同的日期形状。命名值为 `date_long`（默认，"March 21, 2026"）、`date`（"Mar 21, 2026"）、`date_weekday`（"Wed, Mar 21, 2026"）和 `system_date`（"2026-03-21"）；也接受 `(value) => string` 函数用于自定义输出。`date_long` 默认值与 DateInput 之前的長月份渲染逐字节相同，因此现有用法不变。这也扩展了 Timestamp 的两个新的共享成员 `date_long` 和 `date_weekday`，使两个组件在仅日期格式上完全值对等。格式化仅适用于提交的值，从不适用于正在键入的文本。
- 为可配置表面添加 `elevation` prop——Card、ClickableCard、SelectableCard、Button、IconButton、ButtonGroup 和 Banner 接受完整的 `'none' | 'low' | 'med' | 'high'` 刻度；ChatComposer 接受 `'none' | 'low'`。默认值保留今天的外观（除 ChatComposer 的 `low` 外到处是 `none`），因此除非选择加入，否则没有变化。（#4146）
- OverflowList：新增 `maxVisibleItems` 以限制可见项数量（`minVisibleItems` 的上限搭档）和 `maxRows` 用于有界多行换行——项最多换行到 N 行，然后折叠到溢出指示器。两个 prop 都是可选的且默认关闭，因此单行行为不变。参见 #4176。
- 新增 `useTableRowStatus`，一个前置窄列的插件
  用于发出每行状态信号。
- Thumbnail：新增 `showRemoveOn` prop——`'hover'`（默认）在悬停或键盘聚焦时显示移除按钮，并在触摸时保持可见；`'always'` 在静止时显示它。
- Table 树：新增可选的展开全部/折叠全部表头控件（#4142）
  `useTableTreeState` 现在返回聚合 `isAllExpanded` 状态（`true` / `false` / `'indeterminate'`）并将 `expandAll` / `collapseAll` 传入 `treeConfig`。`useTableTreeData` 新增 `hasExpandAllControl` prop：设置后，在树列标题中渲染展开全部/折叠全部切换，连接到该状态，因此消费者不再需要手工编写外部按钮。扁平数据仍是完全无操作。这是两个树插件收敛过程中从 `useTableRowExpansion` 折叠进来的第一个功能。
- TreeList：为展开/折叠切换新增专用的 `astryx-tree-list-chevron` 主题目标，使消费者可以通过 `defineTheme` 为主题化 chevron（颜色、按打开/关闭状态）设置主题，而无需通过功能性的 `[data-tree-toggle]` 属性访问它。以 `data-state` 属性（`expanded`/`collapsed`）反映打开/关闭状态；功能性 `data-tree-toggle` 钩子不变。
- TreeList：在层级导线（连接）线元素上新增稳定的 `astryx-tree-list-guide` 主题目标，使消费者可以通过 `defineTheme` 重新着色或隐藏导线（例如 `backgroundColor`，或 `display: 'none'` 隐藏它们），而无需隐藏内置连接器并用未分层 CSS 重新实现。
- TreeList：在条目标签文本上新增专用的 `astryx-tree-list-item-label` 主题目标，使消费者可以通过 `defineTheme` 仅为主题标签设置主题（例如将选中项的标签加粗），而无需脆弱的 `button:not([data-tree-toggle]) > span` 结构选择器。在标签上以 `data-selected` 属性反映行的 `selected` 状态。

#### 问题修复

- AvatarStatusDot：将每个变体与不同的内置形状配对——success 保持实心圆点，neutral 渲染为环，error 获得减号条——因此状态不再仅依赖颜色（WCAG 2.1 SC 1.4.1，#4143）。渲染的 `icon` 在图标适合的尺寸下替换形状字形；主题可以定位新的稳定 `astryx-avatar-status-dot-glyph` 类及其 `data-shape` 属性——一个从圆点 `currentColor` 绘制的描边内联 `<svg>`。
- Button：链接渲染的按钮（`href`）现在在加载时暴露 `aria-busy`，与 `<button>` 分支一致。此前可中断的加载链接显示 spinner 并播报 "Loading"，但不携带机器可读的忙碌状态。
- Calendar 仅将当月日期单元格标记为今天，防止多月视图中的重复今天指示器。
- Carousel：幻灯片现在暴露 APG 幻灯片语义（role=group、aria-roledescription="slide"、"Slide N of M" 标签），而不是匿名 div。
- 在 ChatToolCalls（chevron 旋转、展开/折叠）、ChatLayoutScrollButton（胶囊显示/隐藏）和 ChatDictationButton（均衡器条）中尊重 `prefers-reduced-motion`。
- Chat/useChatStreamScroll：滚动跟随弹簧现在尊重 `prefers-reduced-motion`——锁定跟随、`scrollToBottom()` 和 `lock()` 回退到现有的即时跳转，因此转录仍跟踪底部而无需动画移动。#3800 中承诺的后续。
- Chat：composer 抽屉切换现在通过 aria-controls 引用其展开的内容，因此辅助技术可以从切换导航到抽屉。
- ChatSendButton 现在将 `className`、`style` 和透传属性（`data-*`、`aria-*` 和其他 rest props）转发到渲染的按钮。此前这些被静默丢弃。（#4190）
- Chat：工具调用错误详情现在暴露给屏幕阅读器和键盘用户，而不是仅存在于悬停才显示的 title 属性中。
- CheckboxInput：不确定标记现在使用 `--radius-full` token 而不是硬编码半径，以保持 token 一致性。无视觉变化。
- CheckboxList：具有丰富（非字符串）标签的项现在可以提供 accessibleLabel，使其复选框不再播报为字面 "Checkbox"。
- CodeBlock：折叠的代码区域现在为惰性，因此键盘焦点在折叠时不再落在不可见的滚动容器上。
- CommandPalette：将 BaseProps 透传属性（className、style、xstyle、data-_、aria-_）转发到底层 Dialog。此前这些被静默丢弃。
- CommandPalette：搜索输入（role=combobox）现在默认具有可访问名称，来自新的 label prop 或可见占位符。此前屏幕阅读器播报无名组合框。
- DateTimeInput：日期字段中的 ArrowDown（以及 Alt+ArrowDown）现在从键盘打开日历弹层，与 DateInput 和宣传的组合框模式一致。
- Dialog：模态框现在通过 aria-labelledby 自动以其 DialogHeader 标题标记，与 AlertDialog 一致。未命名的打开对话框在开发中发出警告。
- Dialog：入口动画在 prefers-reduced-motion 下禁用，与 Layer 动画防护一致。
- 修复 Divider 的 rest-prop 展开顺序，使消费者传递的 HTML 属性无法覆盖组件的 `role="separator"` 或 `aria-orientation`。
- FieldLabel 现在将 className、style、xstyle 和透传属性（data-_、aria-_、事件处理程序）转发到渲染的元素。此前这些被类型接受但静默丢弃。
- Field/FieldStatus：状态和错误消息现在通过持久 live region 播报，因此无论它们何时出现，屏幕阅读器都能可靠读取。
- FileInput：触发器的可访问名称现在包含选中的文件名，因此屏幕阅读器用户在重新聚焦控件时可以查看已附加的内容。
- 防止 PowerSearch 编辑弹层在通过 Enter 选择多选选项时关闭（#4245）
- Selector/MultiSelector：PageUp/PageDown 现在在搜索时将活动选项跳转到第一个/最后一个匹配项，补充保持文本光标移动的 Home/End。
- HoverCard：当设置新的 label prop 时，弹层现在暴露命名对话框，否则使用诚实的组语义。此前每个悬停卡片都播报为未命名对话框。
- Item：aria-selected 现在仅在条目的 role 允许时（option、tab、treeitem、grid 单元格）发出，从普通列表项中移除无效 ARIA。
- MobileNav：切换按钮现在暴露 `aria-expanded` 并通过 `aria-controls` 引用导航抽屉，因此屏幕阅读器用户可以判断抽屉是否打开以及按钮控制什么。（#3721）
- MultiSelector：在选项弹层内搜索现在向屏幕阅读器播报匹配结果数量（"3 results" / "No results found"），与 Selector 和 Typeahead 一致。此前过滤是静默的。
- SideNav/TopNav：折叠标题弹层不再将其菜单包裹在模态对话框中，标题按钮不再是菜单的无效子元素。
- Slider 现在在定位滑块和暴露 ARIA 值之前将受控值钳制到其最小值和最大值。
- Slider：必填滑块现在通过滑块的可访问描述向屏幕阅读器传达必填状态（aria-required 在 slider role 上无效）。
- 使 CLI 的 `.mjs` 源完全严格类型可检查（checkJs + JSDoc）
  为整个 CLI 包添加注解，使 `tsconfig.strict.json`（对 `src`、`bin`、`scripts`、`docs` 和发出的 `templates` 进行完整 `strict` `checkJs`）报告零错误——从 1717 降下来。修复仅限 JSDoc：无运行时逻辑变化，`.mjs` 保持 `.mjs`。严格检查还发现并纠正了几处类型契约漂移：`upgrade.run` 响应类型（声明了命令从未发出的 `depsUpdated` 字段，并省略了真实的 `integrations`/`filesChanged`/`transformsApplied`/`errors`），在 `--json` 信封联合中注册了发出的 `theme.list`/`theme.add`/`layout.*` 响应类型，并在 core 的文档类型中为 `ReferenceSection` 添加了 `category?`（参考文档已经发出它）。
- Table：选择插件接受 getRowLabel，因此行复选框播报它们选择哪一行，而不是无差别的 "Select row"。
- Text：显式 `size` 现在会覆盖主题化 `type` 的字号。`size` 类位于比主题按类型字号规则（`astryx-theme`）更低的级联层（`astryx-base`）中，因此 `<Text type="supporting" size="xsm">` 会静默保留类型的尺寸。主题现在在主题层重新发出尺寸类，使 `size` 按文档所述获胜。
- Thumbnail：用 ClickableCard 和 SelectableCard 使用的相同 `::after` 覆盖处理替换交互式磁贴上的悬停盒阴影。三者现在都在悬停时用 `--color-overlay-hover`（按下时用 `--color-overlay-pressed`）着色，因此交互反馈在卡片系列中一致。
- Thumbnail/TopNavMegaMenuFeaturedCard：没有 alt 文本的图像现在明确为装饰性，而不是静默空 alt，与 Avatar 的处理一致。
- Thumbnail：覆盖的移除按钮现在使用固定的 `--color-overlay` 遮罩和 `--color-on-dark` 图标，而不是适应图像亮度，因此它在任何图像上都有可靠对比度。
- Tokenizer：添加和移除 token（包括空输入上的 Backspace）现在向屏幕阅读器播报。此前 token 出现和消失是静默的。
- TopNav：TopNavMegaMenu 触发器现在暴露 aria-controls，面板是带标签的组，而不是无效的 modal-dialog 包装菜单。
- TopNav：TopNavMenu 弹层现在暴露正确的菜单语义（无模态对话框包装），具有完整的 APG 键盘模式（游走 tabindex、方向键、typeahead）。

#### 文档

- docs(Tokenizer, PowerSearch)：记录并测试现有的 startIcon prop
  两个组件都已提供可用的 `startIcon?: ReactNode | IconType` prop 一段时间（`PowerSearch` 将其逐字转发给内部 `Tokenizer`，并且已在 Storybook 中练习），但两者的 `.doc.mjs` 都没有记录它，也没有测试覆盖——因此它对 `astryx component <Name> --dense`、docsite props 表以及任何依赖这些作为真相来源的人（人类或 AI）都不可见。无行为变化；添加缺失的 props 表条目（en/zh/dense）和同位测试，确认图标正确渲染和转发。

#### 其他变更

- 紧凑的逐行状态信号（错误、警告、未读等），无需
  专用状态列：默认是彩色状态点，或提供图标时使用图标。
- `getStatus(item)` 将行映射到 `{color, icon?, label?}`，或映射到 `null` 表示无
  指示器。`color` 接受语义状态名（`success`/`error`/`warning`/`accent`/`red`/`green`/等）映射到主题 token，或原始 CSS 颜色作为逃生舱。
- `icon` 将状态渲染为形状指示器而不是圆点，当多个状态共存时，
  这比仅颜色更具可访问性。`label` 提供可访问名称。
- 使用 `useCallback` 记忆化 `getStatus` 以获得稳定的插件身份。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @bhamodi
- @cixzhang
- @ejc3
- @freddymeta
- @HelloOjasMutreja
- @humbertovirtudes
- @josephfarina
- @kentonquatman
- @Kevinjohn
- @saadpocalypse
- @yyq1025

---

# 0.1.8

#### 破坏性变更

- Avatar 和 AvatarGroup 采用 Icon 的缩写尺寸刻度——`size` 现在接受 `xsm`/`sm`/`md`/`lg`/`xl`，而不是 `tiny`/`xsmall`/`small`/`medium`/`large`。像素值不变（20/24/36/48/128px），默认值现在是 `md`（仍为 36px，原为 `small`）。Avatar 的层级保持大于 Icon，因为头像与媒体对齐而非字形。运行 `astryx upgrade` 迁移调用点。（#2672）

#### 新功能

- Collapsible：内容区域现在锚定正文排版（字体系列、大小、字重、行高），而不是从周围环境继承，并暴露稳定的 `astryx-collapsible-content` 主题目标，以便显示文本可以在外部设置主题。
- Collapsible：新增 `isDisabled` prop 以禁用单个项。禁用项的触发器无法切换并变暗；遵循系统范围的禁用约定，它使用 `aria-disabled`（不是原生 `disabled` 属性）并退出 Tab 顺序，保持对辅助技术可感知。禁用不会折叠已打开的项。可独立使用及在 CollapsibleGroup 内使用。
- `@astryxdesign/core` 的 `docs.mjs` 现在重定向到 CLI，使代理汇聚到单个文档入口点（`astryx docs` / `astryx init`），而不是一个大型独立脚本。（#4207）
- DropdownMenu 可选项：新增 `DropdownMenuCheckboxItem`（独立切换，`role="menuitemcheckbox"`）和 `DropdownMenuRadioGroup` + `DropdownMenuRadioItem`（单选，`role="menuitemradio"`）。控件尺寸派生自菜单的条目尺寸，并在触摸时切换到行的内联结束位置。它们也在 `ContextMenu` 内工作（重新导出为 `ContextMenuCheckboxItem` / `ContextMenuRadioGroup` / `ContextMenuRadioItem`）。两个菜单的键盘/typeahead/激活现在识别可选中 role，并且菜单上下文（`DropdownMenuContext`、`useDropdownMenuContext`、`DropdownMenuSize`）被导出用于构建自定义菜单项。参见 #3829。
- Icon：新增可选的 `label` prop 用于可访问名称。设置它使独立图标有意义（`role="img"` + `aria-label`，无 `aria-hidden`），将旧的三属性舞蹈折叠为一个 prop；省略它（或传递 `''`）保持装饰性默认（`aria-hidden`）。
- "Foolproof init"：`@astryxdesign/core` 和 `@astryxdesign/cli` 现在都打印安装后提示，指向 `npx @astryxdesign/cli init`，`astryx` 命令会提示你完成设置直到 init 运行，并且 `astryx init` 以非交互方式运行（无需 TTY），因此可在 CI 和代理环境中工作。（#4147、#4153、#4154、#4155）
- Outline：键盘导航、导航回调以及滚动作用域 props（#2527）
  将 #2746 中推迟的公共 API 分层到已发布的 scroll-spy 引擎和点击锁定上。无视觉变化。
- Table：新增树数据插件——`useTableTreeState` 和 `useTableTreeData`——用于渲染和管理分层（父/子）行、展开状态和扁平化。从 `@astryxdesign/core/Table` 导出。（#3789）

#### 问题修复

- `AvatarGroupOverflow` 现在对较长的 `+N` 计数生长为胶囊，因此数字永远不会被裁剪。
  指示器是固定尺寸的圆，因此宽计数（例如 `+4912`）会溢出并挤占边缘。现在使用等于头像尺寸加水平内边距的最小宽度：短计数（`+5`）保持完美圆形，而较长的计数水平生长为体育场/胶囊形状并保持可读。没有新的公共 props。
- Carousel 现在在按住 Shift 滚动鼠标滚轮时水平滚动。触控板用户已经免费获得水平滚动；这使用既定的 Shift + 滚轮惯例为标准鼠标（仅垂直滚轮）用户带来同等体验。原生触控板水平滚动和上一页/下一页按钮不变。
- Citation：非交互引用（无 `source.url`）现在保持默认光标而不是显示指针，因此只有链接引用看起来可点击。指针光标与现有的悬停处理一起应用于 `label` 和 `number` 变体（#4134）。
- 停止在 CLI 安装前建议裸 `npx astryx`——它在 npm 注册表上解析为不相关的包。
  CLI 现在在每次打印命令时发出感知安装的调用：
- Icon：尺寸变体（`xsm`/`sm`/`md`/`lg`）现在使用 `rem` 而不是硬编码 `px`，因此当文档/根 `font-size` 变化时，图标会随文本同步缩放——与设计系统其余基于 rem 的字体刻度匹配。修复 #4092。
- 防护 useTableRowExpansionState 树遍历中的循环数据（#3971）
  `depthMap`、扁平化 `data` 和 `allExpandableKeys` 遍历现在跟踪当前路径上的祖先键，并跳过指向祖先的边，因此自引用或循环行数据会终止而不是溢出堆栈。
- 将 Table 可排序插件的表头按钮 aria-label（"Sort by …"、"… sorted …"、"… priority … of …"）通过 `useTranslator()` 路由，使用新的 `@astryx.table.sort.sortBy` / `sortedBy` / `sortedByWithPriority` / `direction.*` catalog 键，因此它们像排序菜单标签一样本地化（#3618，跟踪器 #3636）。方向词通过其自己的键解析，而不是插值原始枚举值。英文输出不变。
- Table：树行展开器的 `aria-label` 现在通过 `useTranslator()` 本地化，而不是硬编码英文字符串，因此展开/折叠控件以应用的语言播报。（#4149）
- TabList `hasDivider` 预留间隙，使悬停胶囊和相邻按钮不再接触下划线
  有分隔线的 TabList 现在在标签页和分隔线轨道之间预留 4px。悬停高亮与下划线保持距离，与标签页并排放置的相同尺寸 Button 对齐到标签页基线而不是紧贴轨道——因此 `md` 标签条与 `md` 按钮配对。选中指示器仍停留在轨道上。无分隔线的标签列表不变。`Toolbar` 内带 `dividers={['bottom']}` 的 TabList 通过工具栏自身的间距获得相同对齐。
- TreeList：聚焦父行不再将 focus-visible 轮廓泄漏到其后代行——每行的环现在从自己最近的 treeitem 解析，而不是匹配任何聚焦祖先（#4130）

#### 文档

- DropdownMenu 和 DropdownMenuItem：播种 playground 默认值，使 docsite 属性标签预览渲染真实内容而不是空触发器。

#### 其他变更

- 已安装 / 全局 / dev 运行建议 `<pm> astryx <cmd>`（例如 `pnpm exec astryx …`），不变。
- 一次性运行（通过 `npx`/`pnpm dlx`/`yarn dlx`/`bunx` 启动）建议使用作用域包 `<dlx> @astryxdesign/cli <cmd>`，它始终解析到我们。
- 改进发布英文 catalog（`packages/core/locales/en.json`）描述中的翻译器上下文。精炼了约 172 个条目——添加了仅屏幕阅读器说明、ICU 组合示例、多义警告和集合配对说明——因此在 Crowdin 中工作的翻译者获得更好的上下文。`defaultMessage` 值、键或运行时 API 无变化。
- **Keyboard navigation**——大纲现在是一个 Tab 停留点（通过 `useListFocus` 的游走 tabindex），按 WAI-ARIA 位于 _活动_ 标题上，因此在阅读第 7 节时 Tab 进入目录会落在第 7 节，而不是将读者送回第 1 节。方向键在标题之间移动，Home/End 跳到两端，Enter/Space 激活。40 个标题的目录只需一次 Tab 按键而不是 40 次，Tab 仍然一次离开大纲。
- **`onNavigateStart(id)` / `onNavigateEnd(id)`**——在点击或键盘激活启动的平滑滚动前后触发，因此应用可以驱动到达效果。`onNavigateEnd` 在支持时在 `scrollend` 上解析，在不支持时（Safari）通过稳定超时解析，因此当 reduced motion 将滚动折叠为即时跳转时也能正确触发。它恰好为每个 `onNavigateStart` 触发一次——包括用户中断滚动时——因此"导航中"状态永远不会泄漏。
- **`offset`**——覆盖在滚动根顶部的固定头部的高度。它将激活线 **和** 滚动落点按相同量移动，因此标题恰好在导航到它的位置激活：在头部下方，而不是隐藏在其下。它与每个标题自己的 `scroll-margin-top` 组合（先头部，然后下方呼吸空间）而不是替换它——当没有内容覆盖时，将 `offset` 保留为 0，让 `scroll-margin-top` 发挥作用，因为浏览器已经尊重它。
- **`scrollContainerRef`**——将滚动跟踪限定到特定容器，而不是自动检测最近的可滚动祖先。修复了在拆分窗格、模态框或仪表板面板中高亮从未移动的目录。默认（视口）路径不变。
- **`hasScrollOnClick`**（默认 `true`）——设置为 `false` 以自己拥有滚动；大纲仍更新活动项、hash 和导航回调。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @cixzhang
- @ernestt
- @is-jain
- @joeyfarina
- @josephfarina
- @MeGaurav4
- @nynexman4464

---

# 0.1.7

#### 破坏性变更

- Table 插件 render-prop 接口（`TableRenderProps`、`HeaderRowRenderProps`、`HeaderCellRenderProps`、`BodyRowRenderProps`、`BodyCellRenderProps`、`ScrollWrapperRenderProps`）和 `scrollWrapper` 组件契约将其 StyleX 数组字段 `styles` → `xstyle` 重命名，匹配子组件接收它的 prop 名称。自定义插件作者：在 transform 函数中重命名 `props.styles` 读取和 `styles:` 写入（#3679）
  **Codemod：** `npx astryx upgrade --codemod rename-table-renderprops-styles-to-xstyle`

#### 新功能

- 从 `@astryxdesign/core` 导出创作工厂：`createConfig` 位于 `@astryxdesign/core/config`，以及 `createIntegration`/`createPageTemplate`/`createBlockTemplate`/`createComponentDoc`/`createFunctionDoc`/`createDoc` 位于 `@astryxdesign/core/authoring`。编写配置或集成不再需要依赖 CLI。现有 `@astryxdesign/cli/*` 导入通过重新导出继续工作。
- Button：遵循输入字段宽度约定的新 `width` prop（`SizeValue`：数字为像素，字符串按原样使用）。`width="100%"` 消除了认证表单、对话框和移动布局中全宽 CTA 需要 `width: '100%'` xstyle 覆盖或拉伸布局包装器的需要（#2600）。
- **Astryx 组件现在可翻译。** 将应用包裹在 `<InternationalizationProvider locale="...">` 中并传递一个或多个 locale catalog，以你选择的语言渲染 astryx UI；在你的组件内调用 `useTranslator()` 以根据活动 locale 翻译消费者字符串。Astryx 提供英文 catalog，具有 BCP 47 区域回退（例如 `pt-BR` → `pt` → `en`），因此从未渲染 provider 的消费者看到的仍是今天的英文字符串，不变。
- **翻译覆盖现在跨越完整组件集**——PowerSearch（UI chrome、值编辑器标签/占位符、21 个内置操作符标签和 ICU 复数化结果计数），以及 AlertDialog、AppShell、Banner、Breadcrumbs、Calendar、Chat、CommandPalette、ContextMenu、日期/时间输入、Dialog、DropdownMenu、Lightbox、Link、Markdown、移动/侧/顶部导航、Outline、Popover、Resizable、Selector/MultiSelector、Table（及其过滤/选择/排序插件）、Toast、Tokenizer、Typeahead 和相关交互功能。使用 `...` 的占位符字符串在英文 catalog 中规范化为 `…`（U+2026）；对精确三点形式进行快照测试的消费者会看到差异，而传递显式 `placeholder` 的消费者不受影响。
- 两项 i18n 相关的 **类型精化**（对现有用法源兼容）：`PowerSearchOperator` 现在是可辨识联合——`{key, value, label}`（原始文本）或 `{key, value, i18nKey}`（astryx 翻译）；传递 `label` 可编译且行为不变，而裸 `{key, value}`（既无 `label` 也无 `i18nKey`）成为编译时错误。`Markdown.renderBlock` 获得从顶层 `Markdown` 线程化的 `t: TranslatorFn` 参数；直接 `renderBlock` 消费者传递翻译器。
- `@astryx/eslint-plugin-astryx` 中的新 ESLint 规则（`astryx.configs.strict` / `recommended`）：`@astryx/i18n-key-format` 强制 `@astryx.*` catalog 键使用 camelCase 路径段，`@astryx/no-hardcoded-i18n-string` 标记用户面向 props 上的硬编码英文字符串字面量——现在也涵盖三元、逻辑表达式和模板字面量（例如 `aria-label={isOpen ? 'Close' : 'Open'}`）。两者都与文件系统无关；下游包可以使用标准 `files` / `ignores` 模式启用它们，升级后会看到更多违规被标记。

#### 问题修复

- 修复 Banner chevron 过渡以尊重 `prefers-reduced-motion: reduce`。
- 圆化最后一个 ButtonGroup 成员的尾部圆角，即使它渲染图层（#2508）
  ButtonGroup 的尾部 border-radius 基于 `:last-child`。但几个成员在其按钮 _之后_ 渲染不可见图层元素——带 `tooltip` 的 `Button` 返回 `button + tooltip layer`，`DropdownMenu` 返回 `trigger + popover`，两者都由 `useLayer` 内联渲染而非 portal。图层占据了 `:last-child` 槽，因此真正的尾部按钮静默保留方形外角，组以平边短桩结束。
- Calendar：月份导航现在通过礼貌 live region 向屏幕阅读器播报新可见的月份（例如 "March 2026"）。此前网格静默改变。（#3724）
- Chat：打开已有内容的对话（历史、重放、会话切换）不再从顶部弹簧滚动——首次填充即时定位，无论内容是挂载时存在还是异步到达。后续增长（流式）像之前一样弹簧。`useChatStreamScroll` 的 `scrollToBottom` 接受 `{behavior: 'instant'}` 用于一帧程序化跳转，镜像 DOM 的 `scrollTo({behavior})`。导出 `ChatScrollToBottomOptions` 类型。（#3795）
- CheckboxInput/Switch：当标签视觉隐藏时，描述仍通过 aria-describedby 链接，而不是在 DOM 中孤立。
- CodeBlock 在启用 `isWrapped` 时保持行号与换行对齐
- 在 Dialog 和 DialogHeader 中转发 rest props。DialogHeader 现在透传 data-testid、aria-* 和其他属性。Dialog 的内联路径转发所有 rest props。标准路径在契约 props 之前展开 rest，因此 onClick、onCancel、aria-modal 和 role 无法被覆盖。
- 将 --dense / --zh 文档覆盖层锚定到其基础章节（#2182）
  压缩和翻译的参考文档 **按数组位置** 合并到基础文档中，因此章节顺序不同——或省略了一个章节——的覆盖层会将每个标题嫁接到错误的正文上。
- FileInput：不要在拖过 dropzone 子元素时丢失拖入高亮
  将文件拖过 dropzone 自己的图标/文本会在容器上触发 dragleave 并清除拖入状态，因此 "Drop files here" 高亮在拖动中途闪烁。relatedTarget 仍在 dropzone 内的 dragleave 现在被忽略；只有真正离开 dropzone 才结束拖入状态。
- 修复消费者 rest props 在 ButtonGroup、Calendar 和 Carousel 中覆盖组件契约 props
  在其根元素上设置 `role`、`aria-roledescription` 或 `onKeyDown` 的组件现在在这些 props 之前展开 `{...rest}`，因此消费者无法意外覆盖组件的语义契约。`onKeyDown` 通过 `composeEventHandlers` 组合，因此消费者和组件的处理程序都会触发。
- Kbd：透传 props 不再覆盖计算出的 role 和口述可访问名称（rest-spread 优先级已纠正，与 Avatar 一致）。
- Layer：视口边缘附近的居中图层不再渲染被裁剪（#3671）。翻转回退对居中对齐是无操作，因此居中放置现在附加基于 span 的 `position-try-fallbacks`，沿其对齐轴滑动图层。
- Link：禁用链接不再携带活动 href/onClick——程序化焦点或 AT 激活不再能触发导航。
- Selector：在选项弹层内搜索现在向屏幕阅读器播报匹配结果数量（"3 results" / "No results found"），与 Typeahead 一致。此前过滤是静默的。（#3725）
- Table 现在遵守标准根样式 props：`className`、`style`、`xstyle`、`id`、`aria-*`、`data-*` 和其他 HTML 属性到达根 `<table>` 元素，而不是被静默丢弃。`tableProps` 已弃用（仍有效，冲突时输给直接 props）；计算出的列最小宽度仍胜过消费者的 `style.minWidth`，但不再在列未计算任何值时覆盖它（#3679）
- Timestamp：绝对时间 tooltip 现在可通过键盘访问——附加 tooltip 时时间戳可聚焦，符合 WCAG 悬停内容要求。
- TopNav：`<nav>` 地标现在在省略 `label` prop 时默认其可访问名称为 "Top navigation"，与 SideNav（"Side navigation"）、Breadcrumbs 和 Pagination 一致。此前省略 `label` 会发布未命名导航地标，使屏幕阅读器用户在组合 SideNav + TopNav + Breadcrumbs 的页面上看到多个无法区分的 "navigation" 地标。显式 `label` 仍获胜。

#### 文档

- 从 core README 指向 AI 代理 CLI。
  `@astryxdesign/core` 的 README 现在以提示开头，告诉 AI 代理先运行 `npx astryx init`，它将 CLI 的组件索引安装到 `AGENTS.md`/`CLAUDE.md`。在隔离的冷启动测试中，这使代理从 0/5 提升到 4/5 的发现和使用 CLI（匹配 AGENTS.md 上限）；仅首次运行提示为 0/5。
- 在组件文档中展示联合类型的字面量值（#1645）
  Prop 文档命名其联合类型但从未展示其背后的值——`gap: SpacingStep`、`align: GridAlignment`、`sort: TableSortState<TSortKey>`、`status: InputStatus`。没有 IDE 的读者（尤其是代理）不得不猜测，而且猜错了：`gap={16}`（像素，不是刻度步长）、`direction: 'desc'`（类型是 `'descending'`）。

#### 其他变更

- 将重复的 charts/lab 颜色解析器迁移到共享 `@astryxdesign/core/utils/color` 模块：新增 `toGLFloats(rgba)` 用于 RGBA→GL 浮点转换，具有中性的非 NaN 回退，取代四个 `hexToGL` 副本，并在 `parseHex`/`formatHex`/`parseColor`/`formatColor` 上重建 `lerpHex`/`hexAlpha`（#3739）

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @arham766
- @bhamodi
- @cixzhang
- @ejhammond
- @jiunshinn
- @joeyfarina
- @nynexman4464
- @yyq1025
- @zeroryu

---

# 0.1.6

#### 新功能

- 新增 `useTableGroupedRows`——将扁平数据数组分组为可折叠的分区行。每个不同的 `groupBy` 值成为一个全宽分区标题行，带有 chevron 切换、组标签和成员计数；折叠会隐藏该组的行而保留标题。镜像 `useTableRowExpansionState`：消费者拥有 `collapsedGroups` 集，hook 返回 `{data, plugin, idKey}`（传递给 `Table` data / plugins / idKey）。支持 `renderGroupHeader` 和 `groupOrder`。（#3763）
- 新增 `useTableRowIndex`——一个前置右对齐、等宽行号列的插件。编号遵循渲染的 `data` 顺序，因此反映当前排序 / 过滤 / 分页视图（传递排序/分页后的数组）。提供 `getRowKey` 用于稳定键查找，以及 `label` 和 `startFrom` 自定义表头和起始序号。（#3756）

#### 问题修复

- 将 core 包的 `displayName` 从 "XDS Core" 重命名为 "Astryx Core"
  core 包的 `displayName` 仍读作 "XDS Core"。它在 docsite 包侧边栏和着陆卡片中作为友好包标签出现，因此将其重命名为 "Astryx Core" 以匹配 Astryx 迁移。仅元数据——包的 `name` 和公共 API 不变。
- 使用生产 JSX 变换编译 dist——0.1.5 发布了 `jsxDEV`，这会让每个在生产中渲染的消费者崩溃
  `@babel/preset-react` 8 从 Babel env 名称（`api.env(env => env === 'development')`）派生其 `development` 选项，而 Babel 在 `NODE_ENV`/`BABEL_ENV` 未设置时回退到 `"development"`。因此从 7.29.7 升级到 8.0.1 在没有任何配置更改的情况下将发布的构建翻转为开发 JSX 变换：`@astryxdesign/core@0.1.5` 的 `dist` 中 479 个文件有 193 个导入 `react/jsx-dev-runtime` 并调用 `jsxDEV`，而 React 的生产构建不导出它。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @ejhammond
- @fatwang2
- @humbertovirtudes

---

# 0.1.5

#### 新功能

- AspectRatio：新增 `fit` prop（`'cover' | 'contain' | 'center'`），让组件自行调整尺寸并定位其子元素，而无需每个消费者在子元素上手动编写 `width`/`height`/`objectFit`。`cover`/`contain` 以零特异性基线规则的形式随 `reset.css` 提供，基于组件设置在子元素直接父元素上的 `data-astryx-aspect-ratio-override` 标记（直接子元素选择器，不依赖内部结构或主题表面），因此子元素自身的样式始终优先，自定尺寸的子元素保持不变；`center` 从组件的包装元素将子元素以其自然尺寸居中。省略 `fit` 时，子元素保持无样式，保留现有契约（#2753）
- CodeBlock：新增 `syntaxTheme` prop，用于按实例覆盖语法主题。它是将单个代码块包裹在 `<SyntaxTheme theme={...}>` 中的简写——接受来自 `@astryxdesign/core/theme/syntax` 的预设，或用 `defineSyntaxTheme()` 创建的主题（#3360）。
- CollapsibleGroup：新增 `hasDividers` prop（布尔值，默认 `false`），让 FAQ 风格的折叠面板获得内置的行分隔细线，而无需手工编写边框；另新增 `density` prop（`'compact' | 'balanced' | 'spacious'`）控制行内边距。启用分隔线时，组会渲染一个包装 div（`astryx-collapsible-group`），条目默认使用 `'balanced'` 密度；没有分隔线时，组保持其无 DOM 的契约，现有渲染不变。边框使用主题化的 `--border-width`/`--color-border` token，嵌套的折叠面板永远不会继承行装饰（#3487）。
- 新增 `incident-console` 页面模板：一个值班事件响应控制台，展示了 frame-first tracker 原型——分组的密集事件行（StatusDot 严重性、Token 状态）、PowerSearch 过滤、状态分段控件，以及一个可调整大小、带元数据和时间线的检查器面板。新增 `Tools - Incident Console` 模板分类。
- useLayer：新增 `positioning: 'custom'` 上下文渲染选项，供自行编写定位样式的消费者使用（显式 `anchor()` 内边距、`anchor-size()` 覆盖）。保留 popover 行为和 `position-anchor` 接线，但不根据 `placement`/`alignment` 派生任何定位样式——包括自动 RTL 镜像，这变成消费者的责任（#3389）。
- 新增 `messaging-shell` 页面模板：Slack 风格的列式框架（rail | sidebar | stream | thread panel），构建于 Chat 组件家族之上——密集行，零卡片。新增 `Shell - Messaging` 模板分类。
- Pagination：`dots` 变体现在可通过共享的 useListFocus 原语进行键盘导航。聚焦某个圆点时，左/右方向键在圆点间移动，Home/End 跳到第一个/最后一个，活动页跟随焦点（roving tabindex），上/下方向键留给浏览器，因此垂直滚动不受影响。（#3681）
- Switch：将 labelSpacing 的 `"default"` 值重命名为 `"hug"`；`"default"` 仍作为已弃用的别名工作。运行 `astryx upgrade` 自动迁移调用点。（#2889）
- 新增 `useHotkeys` hook，用于全局键盘快捷键。每个 hook 实例注册一个 window `keydown` 监听器，处理程序保存在 ref 中（重新渲染不会重新订阅）。组合键如 `'mod+k'` 或 `'escape'`——`mod` 在 Apple 平台映射为 ⌘（与 Kbd 相同的检测），其他平台为 Ctrl。跳过输入目标（input/textarea/select/contenteditable），除非 `allowInInputs`；跳过 `defaultPrevented` 事件；匹配时调用 `preventDefault()`。SSR 安全。

#### 问题修复

- 将派生的 accent token 作为 var(--color-accent) 引用发出（#3495）
  生成的主题现在将 `--color-text-accent` 和 `--color-icon-accent` 作为 `var(--color-accent)` 发出，将 `--color-accent-muted` 作为对同一引用的 `color-mix()` 发出，而不是烘焙解析后的十六进制字面量。在任何作用域覆盖 `--color-accent` 都会在运行时重新着色整个子树——无需第二次主题构建，无需逐 token 覆盖。`--color-on-accent` 保持解析状态，因为它是 CSS 无法表达的对比度计算。
- adjustTime 防护非有限差值并用 O(1) 包裹负数（#3583）
  此前非有限的 deltaMinutes 会让环绕循环永远旋转（-Infinity——标签页冻结），或产生损坏的字符串 "NaN:NaN"（NaN），并可能通过 DateTimeInput 的 timeIncrement 路径提交到消费者表单状态。非有限差值现在返回输入时间不变，负值环绕使用双重取模而不是循环。
- 在 AlertDialog 和 AppShell 上转发 rest props，使消费者的 `data-*`、`aria-*` 和 `id` 属性到达 DOM（#3876）
- 将 CommandPalette 搜索更新包裹在 `startTransition` 中以解决 React 19 警告（#3815）
- 从 BaseProps 派生 DropdownMenuItem 逃生舱，使其接受 `xstyle`、`className` 和 `style`（#3687）
- 在 Item 和 InputGroup 上将 rest 展开顺序放在显式 ARIA props 之前，使消费者设置的 ARIA 属性不再被覆盖（#3751）
- Avatar：在加载错误后重试已更改的 src/fallbackSrc
  加载失败的图像会锁存一个永不重置的布尔错误标志，因此将 `src`（或 `fallbackSrc`）更新为有效 URL 后仍会永远渲染首字母回退。错误状态现在跟踪失败的确切 URL，因此更改后的源会获得新的加载尝试。
- Banner：展开/折叠切换现在通过 `aria-controls` 链接到其内容区域，完善了披露模式（切换此前已暴露 `aria-expanded`）。（#3719）
- Calendar：用 `aria-current="date"` 标记今天的日期单元格。此前“今天”仅通过视觉传达，因此屏幕阅读器用户无法识别当前日期（WAI-ARIA 日期选择器模式）。（#3708）
- Calendar：将 aria-selected 从日期按钮移到其 gridcell 包装元素上。普通按钮（隐式角色 "button"）不允许 aria-selected，会触发 axe aria-allowed-attr 规则；在 ARIA grid 中，选中状态属于 gridcell 角色。（#3343）
- Calendar / DateInput / DateTimeInput：在运行时防御性地将 `numberOfMonths` 钳制为其 `1 | 2` 类型。超出范围的值（例如 `0` 什么都不渲染，`1000` 在 `Array.from({length})` 中锁死页面）回退为单个月份。DateInput 和 DateTimeInput 继承该保护，因为它们将 prop 转发给 `<Calendar>`（#2704）
- Calendar：月份导航箭头现在在 `dir="rtl"` 下镜像，因此“上个月”指向外侧（视觉右侧），“下个月”指向左侧，而不是两者都向内指向月份标签。镜像是一个仅 CSS 的 StyleX 条件变换，以 `dir` 属性为键；DOM 顺序、标签和处理程序不变。还修复了 DateInput、DateRangeInput 和 DateTimeInput 中的嵌入式日历（#3388）。
- Card：将 `default` 变体的边框绘制在其内边距内，并移除其他变体的不可见边框，使卡片的总内缩（边框 + 内边距）与间距 token 完全匹配，而不是每边大 1px。（#3712）
- Carousel：使水平滚动容器可键盘聚焦（`tabIndex={0}`），使仅键盘用户可以用方向键滚动它。此前可滚动区域没有键盘访问（axe：scrollable-region-focusable）。（#3343）
- Chat 组件转发透传 props（data-_、aria-_、id）到 DOM
  `ChatDictationButton`、`ChatLayoutScrollButton`、`ChatMessageMetadata`、`ChatSystemMessage` 和 `ChatTokenizedText` 声明了 `BaseProps` 但静默丢弃了 `data-*`、`aria-*` 和 `id`：它们从未捕获 `...rest` 也未将其展开到渲染的元素上。它们现在捕获 `...rest` 并在合并的 className/style 之后展开到其主要元素上，组件拥有的属性（例如 `role`）在其后设置，因此仍然优先。
- Chat：工具调用行和工具调用组标题现在暴露完整的披露语义——可展开的调用行播报 `aria-expanded` 并通过 `aria-controls` 引用其详情面板，组标题引用其内容区域。此前可展开的调用行被播报为普通按钮，没有任何打开内容的指示。（#3720）
- ChatComposerInput 在子级 onChange 存在时保留 composer 提交（#2330）
- CheckboxInput 现在将 rest props（包括 `data-testid`）转发到底层 `<input>`。此前组件使用封闭的解构列表，没有 `...rest` 捕获，因此任何未显式命名的 prop——`data-testid`、其他 `data-*` 属性等——都会被静默丢弃，尽管 `CheckboxInputProps`（通过 `BaseProps`）将其类型定义为有效。每个兄弟输入组件（TextInput、Selector、Slider、Button、Badge）都已转发 rest props；CheckboxInput 是唯一的例外。Rest 在 `<input>` 上先于组件自身的命名属性展开，因此它不能覆盖 `checked`、`disabled`、`type` 或任何其他显式设置的 prop。
- ClickableCard：移除无边框变体（除 `default` 之外的所有变体）上隐约的悬停“环”，方法是去掉它们的不可见边框。`default` 变体现在将边框绘制在内边距内，使各变体的外部尺寸保持一致，其边框颜色在悬停时强调。（#3712）
- CodeBlock：使用复制按钮时通过礼貌 live region 播报“Copied”。此前成功仅通过交换按钮的 `aria-label` 来提示，屏幕阅读器无法可靠播报。（#3709）
- CodeBlock：在快速重复复制时重新启动已复制指示器计时器
  每次复制点击都会启动一个独立的 2s 重置计时器，因此在窗口内再次复制会让第一次点击的计时器提前还原“Copied”指示器。计时器现在在每次复制时重新启动，并在卸载时清除。
- CodeBlock：完善可折叠标题的披露模式。它现在在 `:focus-visible` 上显示标准的 accent 焦点环——此前它没有定义焦点样式，回退到浏览器默认轮廓，与系统的其他披露控件（Collapsible、TabMenu）不同——并通过 `aria-controls` 链接到它显示/隐藏的代码区域（标题已暴露 `aria-expanded`）。折叠时该区域保持挂载（CSS grid 动画），因此 `aria-controls` 是一个始终可解析的引用。（#3723）
- Collapsible：用 `aria-controls` 将触发器链接到其内容区域，并给内容区域一个匹配的 `id`。完善披露模式，使辅助技术可以从触发按钮移动到它显示/隐藏的区域（此前只设置了 `aria-expanded`）。（#3707）
- Collapsible：触发按钮现在在通过键盘聚焦时显示可见的焦点环。触发器的 `all: unset` 重置移除了浏览器的默认轮廓却没有恢复替代品，导致键盘焦点不可见（WCAG 2.4.7）。（#3722）
- 在非受控且具有 onOpenChange 时保持 Collapsible 自行切换（#3785）
  `useCollapsible` 将 `onOpenChange` 的存在视为组件受控的信号：其 `toggle` 处理程序触发回调但跳过内部状态更新，因此仅给定 `onOpenChange`（没有 `isOpen`）的非受控 Collapsible 看起来卡住了——回调触发但内容从未打开或关闭。控制现在仅由是否提供 `isOpen` 决定，与 `isOpen` 的派生方式一致。非受控用法驱动内部状态*并*触发 `onOpenChange`；受控用法仍然完全推迟给父级。
- SegmentedControlItem 现在转发消费者的 onClick，并新增 composeEventHandlers
  消费者在 `SegmentedControlItem` 上的 `onClick` 被静默丢弃——内部选择处理程序覆盖了它。它现在与选择一起运行（调用 `preventDefault()` 选择退出）。新的 `composeEventHandlers` 工具按顺序链接处理程序，并在其中一个阻止默认时停止，因此拥有交互的组件也可以在同一事件上尊重消费者的处理程序。
- ContextMenu 现在将菜单锚定到相对于其上下文的右键点击点，因此它随内容滚动并在视口边缘自动翻转，而不是停留在固定的屏幕位置（#3465）。
- DateTimeInput：嵌入式时间输入现在像日期输入一样携带 `aria-describedby` 和 `aria-busy`，因此屏幕阅读器用户在聚焦时间部分时仍可访问字段描述、状态消息和禁用消息。（#3716）
- DateTimeInput：`timeIncrement` 现在类型化为合理增量的字面量联合（`1 | 5 | 10 | 15 | 30`），而不是开放的 `number`，因此负数、小数和荒谬值在类型层面被拒绝，而不是被静默接受。新增导出的 `DateTimeInputTimeIncrement` 类型（#2725）
- focusableSelector：只匹配真实链接（`a[href]`、`area[href]`），而不是任何具有 href 属性的元素。此前携带 href 的不可聚焦元素可能被 useFocusTrap 视为 tab 停靠点。（#3714）
- useFocusTrap：当 trap 停用时焦点现在返回到先前聚焦的元素，因此关闭 Popover（Escape 或轻触消失）不再将键盘焦点丢到页面 body。已经自行恢复焦点的组件不受影响——trap 仅在焦点否则会丢失时恢复。（#3732）
- 在 SegmentedControl、CheckboxListItem 和 SideNavCollapseButton 中转发消费者事件处理程序
  这些组件在展开 `{...rest}` 之后设置自己的 `onClick` / `onKeyDown` / `onFocus` / `onBlur`（或解构了消费者的处理程序却从未使用），因此消费者为同一事件提供的处理程序被静默丢弃。它们现在通过 `composeEventHandlers` 将消费者的处理程序与内置处理程序组合，消费者优先——消费者的处理程序会运行，并可调用 `preventDefault()` 选择退出内置行为。
- Grid：使用 `columns={{minWidth, max}}` 时，存在的列现在在适配的列数少于 `max` 时填满行。此前 `max` 上限应用于每个轨道的最大尺寸，因此折叠为单列的布局（例如在移动端）会在右侧留下空白，而不是拉伸到全宽。上限现在限制列数，同时让存在的列达到 `1fr`。（#3391）
- Icon：允许字符串（注册表）图标变得有意义。`aria-hidden="true"` 现在在 prop 展开之前应用，因此消费者可以覆盖它（例如 `aria-hidden={false}` + `role="img"` + `aria-label`）用于独立的提示性图标。此前注册表模式图标在展开之后硬编码 `aria-hidden`，无法覆盖——与已经允许覆盖的组件模式图标不一致。默认行为（装饰性、隐藏）不变。（#3710）
- Layer/Popover：锚点定位的 popover 现在在 RTL 下镜像。`placement`/`alignment` 的 `start`/`end` 是逻辑值（inline-start/inline-end），因此 DropdownMenu、Selector、Typeahead、日期输入和所有其他上下文模式 popover 在 RTL 下通过 CSS 自动向正确的一侧打开。LTR 行为不变（#3389）。
- Lightbox：在图像之间导航现在通过礼貌 live region 向屏幕阅读器播报新图像及其位置（例如 "Sunset over the bay, 3 of 12"）。此前只有视觉计数器更新。（#3727）
- MobileNav 转发透传属性并应用消费者的 className/style
  MobileNav 声明了 `BaseProps` 但静默丢弃了 `className`/`style`（解构到未使用的变量）并丢弃了所有其他透传属性（`id`、`aria-*`、除 `data-testid` 之外的 `data-*`、事件处理程序）。它现在合并 `className`/`style` 并将剩余 props 展开到 `<dialog>` 上，并通过 `composeEventHandlers` 将消费者的 `onClick` 与背景关闭处理程序组合。
- 将未处理的透传属性（`data-testid`、`aria-*`、`id` 等）转发到 Switch、Pagination、RadioListItem、SideNavSection、TableHeader/TableBody/TableFooter 和 TopNavMegaMenuFeaturedCard 的主要渲染元素。这些组件此前丢弃未显式消费的属性，因此测试钩子和无障碍属性静默消失。
- 具有 hasClear 的 NumberInput 在从键盘清除时提交 null（#3599）
  删除文本并模糊（或按 Enter）会静默恢复到先前的值——只有 X 按钮遵守可清除契约。现在，当设置了 hasClear 时，清空的输入会在 blur/Enter 时提交 onChange(null)；不可清除的输入保持恢复行为。
- paginateData 钳制无效页码而不是从末尾切片（#3593）
  负页码向 Array.slice 提供负起始索引，这会从数据末尾开始计数——页码 -1 返回数据集的尾部伪装成一页——而小数页码返回跨越两页的切片。page 现在获得与 #3380 中 pageSize 相同的强制转换。
- PowerSearch：可见结果计数的变化现在通过礼貌 live region 播报给屏幕阅读器，与 Typeahead 的措辞一致。此前计数仅视觉更新。（#3726）
- ProgressBar：将非有限的 value/max 视为空进度
  NaN `value`（例如上游 `loaded / total * 100` 且 total 为 0）会将字面字符串 "NaN" 泄漏到 `aria-valuenow`、值标签和填充宽度样式中。非有限的 `value`/`max` 现在走与 `max={0}` 相同的空进度处理。
- ProgressBar：防护值标签免受零 max 影响
  当 `max` 为 `0`（或负数）时，默认值标签格式化程序产生 `NaN%`（`0/0`）或 `Infinity%`。该字符串被视觉渲染并写入 `aria-valuetext`，因此屏幕阅读器播报 "NaN percent"。像填充百分比已经做的那样防护它（`max > 0 ? … : 0`）。
- Resizable：键盘调整大小现在可用。keydown 处理程序附加到分隔符的不可聚焦子元素上，因此 Arrow/Home/End 键对键盘用户从不触发；它现在按照 WAI-ARIA 窗口拆分器模式位于可聚焦的 `role="separator"` 元素上。（#3729）
- ResizeHandle：在拖拽中途卸载时释放 window 拖拽监听器
  手柄卸载时正在进行的拖拽永远不会收到 pointerup，因此 window 的 pointermove/pointerup/pointercancel 监听器泄漏——每次后续指针移动都继续调整仍在挂载的区域的大小，body 的 cursor/user-select 覆盖也卡住。卸载现在会拆除进行中的拖拽的监听器并恢复 body 样式。
- `useTheme()` / `resolveThemeTokens()` 现在将引用其他 token 的派生 token（例如 `--color-text-accent: var(--color-accent)`）迭代地解析为具体的原始值，跟随引用链。支持的 CSS 颜色函数（`color-mix(in srgb, …)`）根据这些值求值，因此 canvas/SVG/数据可视化消费者获得可用的颜色，而不是 `var(...)` 或 `color-mix(...)` 字符串（#3697）。
  还在 `@astryxdesign/core/utils` 下新增共享的颜色解析/格式化原语（`parseHex`、`parseRgb`、`parseColor`、`formatHex`、`formatColor`），统一了此前在主题层中重复的颜色解析器。
- SegmentedControl：Tab 键切换不再重写值（#3597）
  当 value 不匹配任何启用项（初始空状态、过期的服务器值或所选项目被禁用）时，游走 tab 停靠点回退到第一个启用的单选按钮，selection-follows-focus 随之触发 onChange——键盘用户仅通过 Tab 键经过控件就改变了表单。现在选择仅跟随组内的焦点移动（方向键/Home/End）；进入焦点是纯粹的焦点移动，点击选择不变。
- SegmentedControl 和 SegmentedControlItem 将 data-testid 转发到 DOM
  两个组件都声明了 `BaseProps`（因此 `data-testid` 和其他 `data-*` 属性可以通过类型检查）但静默丢弃了它们：两者都没有捕获 `...rest` 也没有将剩余 props 展开到其渲染元素上，因此该属性从未到达 DOM。它们现在捕获 `...rest` 并将其展开到 radiogroup `<div>` / radio `<button>` 上（与 #3738 中对 `CheckboxInput` 应用的相同 rest 展开修复），放在组件自己的 `role`/`aria-*` 之前，因此这些不能被覆盖。
- SideNav：当 `collapsible.hasButton` 为 false 时不要渲染空的粘性底部容器。此前只要侧边栏可折叠，页脚容器就会渲染——即使内置按钮被选择退出且没有 `footer`/`footerIcons`——在导航底部留下一个空的带边框容器。容器现在仅在有可见内容（页脚、页脚图标或内置折叠按钮）时渲染。（#3603）
- Markdown/useStreamingText：流式文本现在尊重 `prefers-reduced-motion`——逐字符显示会直接跳到全文，入场淡入对偏好减少动态效果的用户禁用，与 Spinner、Skeleton、ProgressBar 和 Chat 已经使用的约定一致。（#3730）
- Table：始终在列调整大小手柄上渲染数值 aria-valuenow。可聚焦的调整大小分隔符在测量宽度之前省略了 aria-valuenow，这未通过 axe aria-required-attr 规则（可聚焦的 role="separator" 需要 aria-valuenow）；它现在回退到列 minWidth。（#3343）
- 当从行对象中删除字段时表行会重新渲染（#3595）
  行 memo 仅比较新项的键，因此通过省略清除的字段（乐观更新、服务器响应）永远不会使 memo 失效，单元格会无限期地继续渲染已删除的值。键计数检查现在会捕获被移除的属性。
- Table 选择：全选不再在空过滤表上读取选中状态（#3591）
  在行被选中且过滤器不匹配任何内容时，基于并集的全选检查将不可见的选中项视为“全选”：表头复选框在空表上渲染为选中，取消全选是无效操作，因为隐藏键被视为冻结。现在零可操作行被读取为未全选；冻结选择保留本身不变。
- Table 排序：将 NaN 单元格与 null 分组，而不是破坏顺序（#3585）
  NaN 单元格命中 defaultCompare 中的数值快路径，而 NaN 比较器结果对 Array.sort 来说读作“相等”——使比较器不一致并静默地错误排列其他有效行。NaN 现在与 null/undefined 一起排到末尾。
- Table：列标题现在使用 `scope="col"` 渲染，使屏幕阅读器正确地将数据单元格与列标题关联。通过列标题 props 提供的消费者 scope 仍然优先。（#3715）
- TabList：溢出标签菜单现在使用游走 tabindex——一个 tab 停靠点，项目之间用方向键导航——而不是使每个溢出项成为单独的 tab 停靠点。（#3728）
- 记录完整的 themeProps() 选择器表面并防止其漂移（#3741）
  `theming.targets` 是组件文档化的 CSS 表面——它渲染的稳定 `astryx-*` 类以及它反映为 data 属性的视觉 props。它是手工编写的，而真相存在于源码中的 `themeProps()` 调用中，没有什么保持两者一致，因此它漂移了两次（#3652、#3680）并再次漂移。
- Thumbnail：为带标签的根提供 group 角色，使其可访问名称有效。此前文件名通过 aria-label 设置在无角色的普通 div 上，axe 将其标记为 aria-prohibited-attr（严重），因为通用元素不能携带名称。（#3343）
- TimeInput：类型无效的输入（例如超出范围的时间，将在模糊时恢复）现在设置 `aria-invalid` 并通过断言式 live region 播报 "Invalid time"，与 DateInput、NumberInput 和 DateTimeInput 一致。此前只有视觉红色边框提示无效状态。（#3718）
- Timestamp：对无法解析的值渲染空而不是崩溃
  无法解析的 `value`（格式错误的日期字符串，或来自缺失数据的 NaN 时间戳）会产生 Invalid Date，其格式化会抛出 "Invalid time value"，使整个树崩溃。无效值现在渲染空并改为记录控制台警告。
- Timestamp：将相对时间保持在其自己的层级内
  相对时间层级用 `<` 防护原始差值，但用 `Math.round` 显示计数，因此刚好在边界之下会渲染 "60 minutes ago" / "24 hours ago" 而不是 "1 hour ago" / "1 day ago"（未来方向同样）。对每个层级的计数向下取整，使其永远不会到达下一层级。
- Toast 回退视口解析应用的主题模式而不是操作系统偏好（#3743）
  回退通过 createRoot() 在断开连接的树上挂载，因此 Toast 的 useTheme() 无法看到 ThemeContext 并回退到 prefers-color-scheme——当它与 `<Theme mode>` 不一致时，toast 的反色表面文本/图标可能计算为与其自身背景相同的颜色。useToast 的回退容器现在直接镜像 `<html data-theme>` 和 `data-astryx-theme`（通过 MutationObserver 保持实时），而 useTheme() 本身在没有可达的 ThemeContext 祖先时先回退到读取 `<html data-theme>` 再假设操作系统偏好——这是真正为像这样的断开连接的树解析 Toast 的 JS 计算模式的机制。
- Toast：onHide 恰好触发一次，暂停的自动隐藏计时器在视口重新渲染后仍存活（#3589）
  在退出过渡期间第二次关闭（双击、自动计时器加手动 dismiss()）会双重触发 onHide；而且因为计时器 effect 依赖于视口每次渲染的 onDismiss 标识，任何其他 toast 的到达或离开都会静默重启——并取消暂停——每个已挂载 toast 的自动隐藏计时器。退出的 toast 现在在 onHide 触发前记录在 ref 中，计时器通过 ref 读取 onDismiss，因此它仅在真正的 duration 变化时重启并尊重暂停状态。
- Typeahead/Tokenizer 丢弃乱序的异步搜索结果（#3587）
  每次搜索现在都声明一个新代次，因此被放弃查询的慢响应不再能覆盖当前查询的结果（此前最后解析的响应总是获胜，Enter 可能选择用户已经替换的查询中的项）。

#### 文档

- 纠正 Carousel 文档漂移并翻译其中文用法块（#3532）
  Carousel 文档描述了组件不具备的行为：项目上没有滚动驱动的缩放效果，上一页/下一页按钮由每边的溢出驱动（当内容可以朝该方向滚动时每个按钮出现），而不是由悬停或平台驱动。描述现在与源码一致。还翻译了 docsZh 用法块，它仍然是英文。
- DialogHeader：添加属性编辑器默认值和示例块（#2719）
  DialogHeader 文档站页面渲染了空预览，因为属性编辑器没有默认 prop 值，也没有示例块。添加 playground 默认值（title、subtitle、divider），使预览开箱即有意义，并添加涵盖基本标题、带关闭按钮的标题和带 start/end 内容的标题的示例块。
- 纠正 useInteractiveRole isDisabled 关于禁用 href 的文档（#3786）
  `isDisabled` JSDoc 声称禁用的 `href` “回退到 button”。并非如此：禁用的 `href` 在链接步骤被跳过并由剩余的优先级检查解析，因此在没有 `onClick` 且没有交互上下文时它落在 `'inert'` 上——正如 `Token` 已经依赖的那样用于禁用链接。`isDisabled` 文档、第 1 步内联注释和优先级摘要现在描述实际行为。仅文档；无运行时变化。
- 记录 playground.overlay 何时适用：无内联包含的组件（MobileNav、Lightbox）使用它，而 Dialog、AlertDialog 和 CommandPalette 有意保留其包含的 isInline 预览，使旋钮保持可用。新增回归测试守护两种形态（#3657）
- Lightbox Properties 预览显示覆盖层打开触发器，而不是空舞台（playground.overlay）
- 在组件主题化目标中记录完整的 `themeProps()` 选择器表面。对所有 `themeProps()` 调用与 `theming.targets` 条目进行扫描，发现 16 个组件中有 19 处缺口，某个视觉 prop 或状态没有文档化的 `data-*` 选择器，因此 CLI 主题化表隐藏了部分可主题化表面：缺失的目标条目（Citation、ToggleButton、Banner content、OverlayScrim、NavHeadingMenu、NavHeadingMenuItem）以及现有条目上缺失的 `visualProps`/`states`（Chat 消息密度、Checkbox、Code color、CodeBlock container、DropdownMenu item size、SegmentedControl item、SelectableCard variant、SideNav item、Timestamp format、Tokenizer status、TopNav item selected、TreeList item density、Typeahead size）。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @arham766
- @arman-luthra
- @bhamodi
- @cixzhang
- @dmitriy-bty
- @durvesh1992
- @Geervan
- @jiunshinn
- @josephfarina
- @kentonquatman
- @let-sunny
- @raphaelroshanM
- @syntaxsawdust
- @thedjpetersen

---

# 0.1.4

#### 新功能

- Code：新增 `color` 和 `size` props。`color` 接受 `'primary' | 'secondary' | 'inherit'`，现在默认 `'primary'`（镜像 Text 的颜色子集）；此前颜色被隐式继承。`size="inherit"` 使内联代码采用周围文本的 `font-size` 和 `line-height`。导出 `CodeColor` 和 `CodeSize` 类型（#2846）
- Markdown：支持 CommonMark 链接引用定义。引用式“页脚”链接——完整 `[text][label]`、折叠式 `[text][]` 和快捷式 `[text]`（及其 `![alt]` 图像形式）——现在针对 `[label]: destination "title"` 块解析，该块从输出中剥离而不是作为可见段落泄漏。标签大小写不敏感匹配并折叠空白；顶层定义在整个文档中收集（因此引用可以出现在其定义之前，包括在流式/增量解析器中，其已结算块缓存会在定义变化时失效）。脚注（`[^1]`）有意保持不动。已知限制：嵌套在块引用/列表内的定义在该容器内解析，但尚未在文档范围内暴露。（#3621）
- 通过 htmlName 实现自定义输入的原生表单参与（#3343）
  Switch、CheckboxInput、RadioList、Slider、Selector、MultiSelector 和 Tokenizer 现在接受 TextInput 和 NumberInput 已有的相同 `htmlName` prop，因此它们序列化到原生表单提交中。具有真实原生输入的组件（Switch、CheckboxInput、RadioList）转发名称；合成控件渲染隐藏输入以镜像原生语义——MultiSelector/Tokenizer 每个值一个条目（像多选），Slider 为字符串值（范围模式下两个条目），禁用时从 FormData 中排除。
- 新增 `useTableRowExpansion`——内联展开/折叠树行。

#### 问题修复

- Button：当 ghost 按钮同时具有 tooltip 时保持边缘补偿工作。tooltip 现在通过 tooltip hook 附加而不是包装元素，因此按钮保持为其容器的直接子元素——没有额外的 DOM 节点，没有布局偏移，容器（Toolbar、Banner）仍通过其直接子元素 `:has()` 选择器检测边缘补偿标记并将按钮拉到光学边缘。（#2578）
- Calendar：停止范围高亮相邻月份（外部）日期，并在范围高亮遇到禁用或相邻月份日期时截断范围高亮。在两个月范围视图中同一日期在两个窗格中渲染，因此相邻月份窗格上的溢出副本被绘制为选择的一部分；外部日期现在永远不会接收选择、范围或预览状态。高亮日期旁边是禁用或外部日期时现在获得圆角端帽，使连续段读作正确终止，而不是方边延伸到空隙中。（#2715）
- Code 和 CommandPaletteEmpty 现在正确转发 props（#3620）
  `Code` 将 rest props（`aria-*`、`role`、事件处理程序）展开到 DOM 元素上。`CommandPaletteEmpty` 应用 `xstyle`/`className`/`style` 逃生舱和主题 props。
- DateRangeInput：为触发字段使用标签字号 token。触发器读取的是正文尺寸/行高 token（`--text-body-size`/`--text-body-leading`）而不是标签 token（`--text-label-size`/`--text-label-leading`），因此其文本渲染得比其他日期输入大一级。（#3655）
- Spinner：将 canvas 提升到自己的合成层（`willChange: transform`），使旋转在 WebKit 上保持流畅——修复 Safari 和 Tauri WebView 中的抖动旋转。（#3628）
- Text：将文档化的 `size` prop 应用为字号覆盖（#3615）
  `Text` 现在在主题 props 中反映 `size`，并在其基于类型的基线样式之后应用相应的排版尺寸 token。覆盖改变字号，同时保留所选文本类型的行高、字重和字族行为。

#### 文档

- MobileNav 使用打开的触发器预览而不是空舞台：为全视口覆盖组件新增 playground.overlay，内联子组件可以声明自己的 playground（#3616）

#### 其他变更

- 继承列模式：子行使用与其父级相同的列，按深度缩进。注入一个 chevron 列；单击（或右键 → "Expand/Collapse row"）切换行的子级。
- Headless：消费者拥有 `expandedKeys` 状态；插件提供 UI。与 `useTableRowExpansionState` 配对以将树展平为可见行。
- 通过 `isAllExpanded` + `onToggleExpandAll` 可选展开全部表头切换。
- 可选的 `expandOnRowClick`，通过单击行中任意位置来切换。
- 通过 `contextMenuActions` 系统贡献展开/折叠的上下文菜单操作。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @ahfoysal
- @arham766
- @cixzhang
- @durvesh1992
- @humbertovirtudes
- @jiunshinn
- @lexs
- @MeGaurav4

---

# 0.1.3

#### 破坏性变更

- DropdownMenu、ContextMenu、MoreMenu：移除了 `hasAutoFocus` prop。菜单现在在打开时总是聚焦其第一个项目（正确的 APG 菜单按钮行为）。此前 `hasAutoFocus={false}` 使菜单键盘不可达且无法关闭——该 prop 仅作为文档预览的逃生舱存在，而文档预览不再需要它。

#### 新功能

- Calendar：`weekStartsOn` 现在除了数字 `0`–`6` 之外还接受三字母的星期名称（`'sun'`–`'sat'`，大小写不敏感），因此起始日在调用点自文档化（例如 `weekStartsOn="mon"`）。数字保持原样工作。新增导出的 `DayOfWeekName` 类型和一个 `normalizeDayOfWeek` 辅助函数（#2843）
- CheckboxInput/Switch/Slider/RadioList/CheckboxList/SegmentedControl/Tokenizer/PowerSearch：disabledMessage prop 显示解释禁用状态的 tooltip（#3509）
- DateInput 现在可在 InputGroup 内使用，共享附加样式以及组的 label/description/status ARIA 接线（#3520）。
- DateTimeInput：新增 `timePlaceholder` prop 以自定义时间部分的占位符（此前硬编码为 "Select a time" 且无法覆盖）。`placeholder` 继续控制日期部分；聚焦时的键入提示（例如 "e.g., 2:30 PM"）不变（#2729）
- Toolbar、TabList 和 SegmentedControl 现在在首次键盘聚焦时显示一个短暂的 "← → to navigate" 提示，教会视力正常的用户方向键在组内导航。新增一个展示块和 useKeyboardHint 的 Storybook 故事。
- 从 `@astryxdesign/core/utils` 导出 `themeProps`（及其 `ThemeProps`/`ClassProps`/`ClassValue`/`ThemeDataAttributes` 类型），使构建在 core 之上的包可以通过公共 API 生成稳定的 astryx 类 + `data-*` 属性表面，而不是深入 core 内部。
- MultiSelector 现在可在 InputGroup 内作为装饰的单行控件使用，共享组标签、描述、状态和连接边框处理（#3520）。
- Typeahead、DateInput、DateRangeInput、DateTimeInput 和 TimeInput：`disabledMessage` prop 在悬停和键盘聚焦时显示解释禁用状态的 tooltip，通过 `aria-disabled` 保持控件可聚焦，同时激活仍被阻止（#3509）
- Popover：暴露 hasLightDismiss 并新增 hasEscapeDismiss，使消费者可以为显式关闭的表面（如 onboarding coachmarks）选择退出外部点击和 Escape 关闭。usePopover 接受相同的新 hasEscapeDismiss 选项；关闭它时，共享 Escape 栈上不注册处理程序，因此按键原样穿透（#3287）
- Selector/MultiSelector：disabledMessage prop 显示解释禁用状态的 tooltip（#3347）
- Selector 现在可在 InputGroup 内作为装饰的单行控件使用，共享组标签、描述、状态和连接边框处理（#3520）。
- Stack/HStack/VStack：新增 `padding`、`paddingInline`、`paddingBlock`（间距刻度的内边距）和 `isScrollable`（`overflow: auto`）props；StackItem 也获得 `isScrollable`。这些与 `Card`、`LayoutContent` 和 `LayoutPanel` 上现有的 `padding`/`isScrollable` props 匹配，因此常见框架布局不再需要内联 `style={{}}` 来实现内边距或 flex 滚动区域模式。
- 标准化布局组件的尺寸 props。为 `Stack`、`Grid` 和 `Center` 新增 `maxWidth`/`minHeight`（与 `Section`/`Card` 匹配），将 `Layout`/`LayoutHeader`/`LayoutFooter`/`LayoutPanel` 的尺寸迁移到共享的 `SizeValue` 类型，并移除 `Stack`、`StackItem` 和 `Layout` 上冗余的 `xstyle`/`className`/`style` 重复声明。无运行时行为变化。
- 为 `Table` 新增插件贡献的右键上下文菜单系统。右键单击列标题或行会显示一个菜单，其操作聚合自每个启用的插件（而不是浏览器的通用菜单）。
- TabList 现在是一个 tab 停靠点，标签之间用方向键导航（roving tabindex）——方向键移动焦点，Home/End 跳到两端，跳过禁用标签，焦点循环。这不改变语义角色（仍然是 `<nav>`/`aria-current`）；完整的 tablist/tab/tabpanel 转换在 #3335 中单独跟踪。参考（#3343）。
- TextInput/NumberInput/TextArea/FileInput：disabledMessage prop 显示解释禁用状态的 tooltip（#3509）
- 为 TimeInput 新增 InputGroup 兼容性（#3520）
- TreeList 现在实现完整的 WAI-ARIA APG Tree View 键盘模式。游走 tabindex 在 treeitem 行上放置单个 tab 停靠点（默认为选中项或第一个启用行），方向键按可见顺序移动焦点：ArrowDown/ArrowUp 在可见行之间步进（跳过禁用），ArrowRight 展开折叠的父级然后进入其第一个子级，ArrowLeft 折叠展开的父级或移动到父行，Home/End 跳到第一个/最后一个可见行。Enter 和 Space 激活行的操作（或切换没有自己操作的父级），typeahead 将焦点移动到标签匹配键入字符的下一行。每个 treeitem 现在还暴露 `aria-level`、`aria-posinset` 和 `aria-setsize`。构建于（#3344）中的临时键盘可展开切换之上。无障碍与键盘管理计划的一部分（#3343）。
- 为 Typeahead 新增 InputGroup 支持（#3520）
- 新增 `useAnnounce`——一个无障碍 hook，通过持久挂载、视觉隐藏的礼貌/断言式 live region 向屏幕阅读器说出消息。由于区域只创建一次（不与内容一起创建），播报是可靠的。接入 `Typeahead`/`BaseTypeahead` 以在搜索期间播报结果计数和“未找到结果”，此前这些是静默的（#3343）。
- 新增 `useKeyboardHint`——当复合控件首次接收键盘焦点时，显示一个短暂的 "← → to navigate" 徽章，锚定到聚焦项。教会视力正常的键盘用户方向键在游走 tabindex 组内导航。在顶层渲染（`popover="manual"`），使用 CSS 锚点定位，因此永远不会被溢出容器裁剪。在首次方向键按下、超时或模糊时自动关闭；该实例不会再次显示。`aria-hidden`（仅视觉；屏幕阅读器用户已经听到角色）。
- 新增 `useTypeahead`——一个首字符（键入聚焦）搜索 hook，并接入 `DropdownMenu`。键入字母会跳到标签以该字母开头的下一个菜单项；重复按同一字母会在匹配项之间循环；缓冲区在 750ms 后重置；跳过禁用项。该 hook 是增量的且与集合无关（通过 `onMatch` 与 `useListFocus`/`useGridFocus` 组合），因此菜单/列表框获得 astryx 此前缺失的 APG typeahead（menus-11、infra-14）（#3343）。
- `useListFocus` 获得可选的游走 tabindex 所有权（`hasRovingTabIndex`）、感知插入符的方向键处理（将按键留给嵌套文本输入和 contenteditable，`hasCaretGuard`）、RTL 水平导航（`isRtl`）、`hasHomeEnd` 切换，以及用于四方向导航的 `orientation: 'both'`。`Toolbar` 现在使用它——它是单个 tab 停靠点，不再从工具栏文本输入或 composer 窃取插入符（#3343）。
- 新增 `VisuallyHidden`——一个无障碍原语，在无障碍树中渲染内容同时在视觉上隐藏它。用于图标仅控件的可访问名称、`aria-live` 播报区域和补充的屏幕阅读器上下文。默认渲染 `<span>`；使用 `as` 用于块级/live region 元素（#3338）。

#### 问题修复

- 通过 live region hook 播报文件选择、页面变化和多选计数（#3343）
  FileInput 现在播报成功的文件选择，Pagination 播报页面变化，MultiSelector 播报选择计数变化，全部通过共享的视觉隐藏礼貌 live region，使这些此前静默的表面对于屏幕阅读器用户可听。
- Avatar：没有 `name` 或 `alt` 的头像现在是装饰性的（`role="presentation"` + `aria-hidden`），而不是用无意义的通用名称 "Avatar" 播报。具名时，内部 `<img>` 使用空 `alt`，因此可访问名称不会被播报两次（一次由 `role="img"` 包装器，一次由图像）（#3343）。
- Breadcrumbs：自动检测的当前面包屑现在将 `aria-current="page"` 放在条目的内容元素（链接/按钮/span）上，与显式 `isCurrent` 路径匹配，而不是放在外部 `<li>` 上。当最后一个面包屑是链接时，锚点本身现在携带 `aria-current`，因此屏幕阅读器将其播报为当前页面（#3343）。
- Breadcrumbs：BreadcrumbItem 现在将剩余的 BaseProps（id、aria-_、role、事件处理程序、data-_）转发到底层 `<li>` 元素。此前这些 props 被 TypeScript 接受但在运行时静默丢弃。
- ButtonGroup：从 `role="group"` 元素移除无效的 `aria-orientation` 属性，它被 axe 标记（aria-allowed-attr）。方向仍通过 `data-orientation` 反映并驱动键盘导航和样式，因此行为不变。还修复了内部重用 ButtonGroup 的 Schedule。
- Calendar：跨月键盘导航现在从机器可读的 `data-date` 属性解析聚焦日期，而不是用 `new Date()` 解析本地化的 `aria-label`。此前，在标签无法解析的非英语区域设置（例如 fr-FR、ja-JP）中，月份边界的箭头键和 PageUp/PageDown 会静默停止工作（#3343）。
- Calendar：月份视图现在使用有效的 ARIA grid 结构——星期名称是 `grid` 内的 `columnheader` 单元格，每周是一个 `row`，其直接子级是 `gridcell`，周数单元格是 `rowheader`。当某些日期被禁用（通过 `min`/`max`/`dateConstraints`）时，方向键导航现在落在正确日期上：上/下移动保持真实的 7 列几何并跳到同一星期几的禁用日期，而不是移动到错误的星期几。（#3343）
- Carousel、Lightbox：键盘焦点不再困在不可见或已卸载的边缘控件上。Carousel 的向左/向右滚动按钮在到达耗尽边缘（或没有溢出）时用 `opacity: 0`/`pointer-events: none` 隐藏但仍留在 tab 顺序中，因此键盘用户可以聚焦不可见控件（WCAG 2.4.7）；它们现在在该状态下为 `disabled`（仍挂载，从 tab 顺序和无障碍树中移除）。按钮驱动的滚动现在也尊重 `prefers-reduced-motion`（使用 `behavior: 'auto'` 而不是硬编码的 `'smooth'`）。在 Lightbox 画廊模式下，上一页/下一页按钮此前在范围端点卸载，因此前进到第一/最后一项会移除聚焦控件并将焦点丢到 `<body>`，使键盘导航陷入死胡同；它们现在保持挂载并在边界处变为 `disabled`，使焦点留在对话框内且方向键导航继续工作（#3343）
- Chat composer：当配置了触发器（提及、斜杠命令）时，消息输入现在使用 `role="combobox"`，否则保持普通 `role="textbox"`。组合框属性（`aria-expanded`、`aria-haspopup`、`aria-controls`、`aria-activedescendant`）仅在组合框上有效，因此将它们应用于文本框会被 axe 标记（aria-allowed-attr）。（#3343）
- ChatMessageList：新增 `isStreaming` prop，在助手消息流式传入时将 `role="log"` 区域标记为 `aria-busy`。此前礼貌 live region 会在每个 token 上重新播报累积的部分文本；在整个流期间设置 `isStreaming` 后，屏幕阅读器等待并一次性播报完成的消息（#3343）。
- CheckboxInput：停止为不确定状态在原生的 `<input type="checkbox">` 上设置冗余的 `aria-checked="mixed"`。原生 `indeterminate` DOM 属性（浏览器已经映射为 `aria-checked="mixed"`）是权威的；额外属性可能与原生状态失步或覆盖它（#3343）。
- CheckboxList：复选框现在被包裹在由字段标签通过 `aria-labelledby` 命名的 `role="group"` 中（并与描述/错误关联），而不是带有孤立标签 `htmlFor` 的扁平列表。屏幕阅读器用户现在听到组的名称和上下文（#3343）。
- CheckboxListItem：从列表行移除无效的 `aria-checked`。`role="listitem"` 上不允许 `aria-checked`（axe：aria-allowed-attr）；选中状态已由行内复选框传达。这也修复了通过 CheckboxListItem 渲染任务项的 Markdown 任务列表。（#3343）
- Citation：链接的数字变体徽章保持其 accent-muted 背景（此前渲染为透明），徽章现在使用次要文本颜色（#3508）
- Citation：仅在链接（锚点）形式应用 `role="doc-noteref"`。在普通无链接 span 上不允许该角色（axe：aria-allowed-role），因此在那里省略，而 `aria-label` 仍然命名引用。（#3343）
- Selector/MultiSelector/Typeahead：高亮的选项现在在键盘导航期间滚动到视图中，因此方向键不再在长列表中将高亮移出屏幕（与 CommandPalette 匹配）（#3343）。
- CommandPalette：当在已经为空的搜索中继续键入字符时，空状态（"No results"）不再闪烁。空状态在待处理搜索的整个持续时间内保持挂载，而不是短暂卸载并重新出现。
- ContextMenu：现在即使菜单在没有自动聚焦的情况下打开（例如表行菜单），Escape 也会关闭菜单，通过文档级 Escape 监听器而不是仅在焦点位于菜单内时触发的监听器。关闭时焦点也会恢复到先前聚焦的元素，而不是落到 `<body>`。IME 组合期间的 Escape 被忽略（#3343）。
- ContextMenu：现在可以通过触摸（长按）和键盘打开。长按（500ms，10px 手指移动取消）在触摸点打开菜单——此前上下文菜单在 iOS Safari 上不可达，因为长按从不触发 `contextmenu`。键盘发起的 `contextmenu`（Shift+F10 / Menu 键），其坐标为 (0,0)，现在将菜单锚定到触发器的盒子而不是视口角落（#3343）。
- DateInput/DateTimeInput：日期字段的日历 popover 现在可以通过 `ArrowDown` / `Alt+ArrowDown` 从键盘打开（APG 组合框），而不仅仅是点击。DateTimeInput 的时间输入不再使用硬编码的英文 `aria-label="Time"`——它默认为 `"{label} time"`（绑定到字段标签且可本地化）并接受显式的 `timeLabel` prop（#3343）。
- DateRangeInput：预设侧边栏现在是带标签的 `role="group"` 操作按钮，而不是 `role="option"` 按钮的 `role="listbox"`。listbox/option 角色播报了一个单 tab 停靠点的列表框，与实际按钮之间 Tab 的交互相矛盾（不存在 listbox 键盘模型）。当前应用的预设用 `aria-current` 标记，而不是 `aria-selected`（#3343）。
- docs.mjs：用 fileURLToPath 解析包目录，使组件文档在 Windows 上工作，那里 URL.pathname 产生像 /D:/... 这样的驱动器号路径，导致 --list 静默打印空内容，单组件查找因 ENOENT 崩溃（#3331）
- DropdownMenu：在打开的菜单中按 Tab 现在会关闭它（APG 菜单按钮模式）并将焦点返回触发器，而不是在菜单保持打开时将焦点泄漏到页面（#3343）。
- Escape 现在只关闭最顶层的打开层，而不是一次关闭所有打开的层——嵌套在 Dialog 内的 popover 或菜单不再单次 Escape 同时关闭两者。还防护 IME 组合：在 Dialog 或 popover 内按 Escape 取消 CJK/IME 组合不再关闭覆盖层（#3343）。
- 在 `FieldLabel` 中垂直居中可选/必填指示器。
  `label` 和 `optionalRequired` 样式从未设置显式 `lineHeight`，因此两者都回退到 `line-height: normal`（约 1.2），产生不匹配的行框（14px 标签约 16.8px，而 12px "∙ Required" 文本约 14.4px）。使用 `alignItems: center` 时，较小的指示器在其较短盒子内居中，相对于标签视觉上偏高。
- FileInput：`aria-describedby`、`aria-required` 和 `aria-invalid` 现在位于可聚焦的 `role="button"` 控件上，而不是从未接收焦点的视觉隐藏 `tabIndex={-1}` 文件输入上。屏幕阅读器用户现在听到字段的帮助文本、必填状态和错误状态。隐藏的原生输入也标记为 `aria-hidden`，因为它不可聚焦（#3343）。
- useFocusTrap：可聚焦元素检测现在包括 `contenteditable`、带 `controls` 的媒体、`iframe`，以及打开的 `<details>` 的 `<summary>`，并排除通过 `display:none`/`visibility:hidden` 隐藏或位于 `inert`/`hidden` 子树内的元素。此前，一个 trap 表面如果其唯一交互内容（例如）是 contenteditable composer，可能让 Tab 逃逸（infra-8）。
- Grid 不再将 `grid-template-columns`/`grid-auto-rows` 写为原始内联样式。轨道模板现在使用 StyleX 动态样式（CSS 变量间接），因此消费者的 `xstyle` 覆盖——包括响应式 `@media` 覆盖——生效，而不是被内联样式击败。
- NumberInput、DateInput 和 DateTimeInput 现在设置 `aria-invalid="true"` 并通过视觉隐藏的 `role="alert"` live region 播报短消息（例如 "Invalid number" / "Invalid date" / "Invalid time"），在键入的输入无法解析时，而不是仅使文本颜色变暗然后在模糊时静默恢复值。屏幕阅读器用户现在得到输入被拒绝的反馈而不是沉默，无效状态不再仅由颜色信号（WCAG 3.3.1 错误识别、1.4.1 色彩使用）。模糊时恢复的行为不变。（#3343）
- InputGroup：分组的 TextInput 和 NumberInput 控件现在在输入名称中包含组标签和自己的标签，同时保留组的描述和状态关联（#3343）。
- InputGroup：组现在通过 `aria-labelledby` 由字段标签命名，而不是重复的 `aria-label`，标签不再携带孤立的 `htmlFor`（其 `inputId` 从未交给子级）。使用 `Field` 的 `isGroupLabel`/`labelID` 支持（#3343）。
- Kbd：组件不再完全 `aria-hidden`。它现在暴露一个口语化的可访问名称（例如 "Command + K"），由屏幕阅读器友好的按键标签构建，而视觉字形（⌘、⇧、↵、…）对辅助技术隐藏。此前任何仅通过 `Kbd` 传达的快捷键——包括 CommandPalette 的页脚提示——对屏幕阅读器用户不可见（#3343）。
- 使用 Kbd 作为方向键导航提示，并将提示与聚焦控件隔得更远，使轮廓保持可见。
- Layer/popover 入场动画现在尊重 `prefers-reduced-motion`。共享的层滑动/缩放关键帧（由 DropdownMenu、Popover、HoverCard、Tooltip、Selector 和其他 popover 表面使用）和 `useEntryAnimation` 预设会在 `prefers-reduced-motion: reduce` 下禁用关键帧动画，因此层立即出现而不是平移/缩放进入（#3343）。
- useLayer：当层元素分离或处理程序标识变化（新的 `onHide`）时，popover 的 `toggle` 事件监听器现在会被移除，而不是在同一元素上累积过时的闭包监听器。这防止在层的生命周期内重复/过时触发 `onHide`（#3343）。
- Link：悬停现在通过悬停色调（与 `--color-tint-hover` 的 `color-mix`，与 Slider/Switch/RadioList 匹配）改变链接颜色。这为始终带下划线的链接（`hasUnderline`）提供了此前缺失的可见悬停提示——它们的下划线从不变化——而不改变默认链接的悬停时下划线行为（#2852）
- Link：外部链接（`isExternalLink`）现在包含视觉隐藏的 "(opens in new tab)" 文本，使屏幕阅读器和认知负荷用户被告知新标签页上下文变化——此前只有装饰性的 `aria-hidden` 图标提示它。该文本可通过新的 `newTabLabel` prop 覆盖以进行本地化（#3343）。
- DropdownMenu/ContextMenu：`role="menu"` 容器现在有可访问名称——DropdownMenu 从触发器标签命名，ContextMenu 暴露 `menuLabel` prop（默认 "Context menu"）。ContextMenu 也不再在其无角色、不可聚焦的触发器包装上放置 `aria-haspopup="menu"`，在那里它对辅助技术没有传达任何有用的信息（menus-13、menus-15）。
- NavHeadingMenu：仅 `onClick` 的项（渲染时没有 `href`）现在在 Enter 和 Space 上激活。此前这些 `role="menuitem"` 元素没有键盘激活，因此键盘和屏幕阅读器用户可以聚焦但不能触发它们（#3333）
- Pagination：将 pageSize 强制转换为正整数，使 0/NaN/负值不再使 dots 变体崩溃（RangeError: Invalid array length）或渲染 Infinity/NaN 页数；Table 分页插件应用相同的保护，因为它独立计算 totalPages（#3372）
- usePopover：新增 `role`（`'dialog' | 'none'`）和 `isModal` 选项，使 listbox 和菜单弹出层不再播报虚假的模态对话框。Selector、MultiSelector、BaseTypeahead、PowerSearch、DropdownMenu、TabMenu 和 Chat 提及菜单现在暴露自己的 `listbox`/`menu` 角色，而不是在焦点留在触发器上时被包裹在 `role="dialog" aria-modal="true"` 中。真正的对话框 popover 不变（#3343）。
- ProgressBar：确定性进度现在使用 `role="progressbar"` 而不是 `role="meter"`。`meter` 用于静态仪表（磁盘使用、电池），屏幕阅读器不将其视为实时更新的任务指示器；进度条传达任务完成并应在更新时播报。不确定进度已经是 `progressbar`（#3343）。
- RadioList：给未选中的单选组一个确定性的键盘 tab 停靠点。当焦点进入没有选中值的组时，组现在规范化入口点——向前 Tab 时第一个单选，向后 Tab 时最后一个单选——匹配 ARIA 单选组模式。选中的值保持其原生 tab 停靠点，组内单选之间移动永远不会被重定向。（#3390）
- RadioList：组现在通过指向字段标签元素的 `aria-labelledby` 命名，标签不再携带孤立的 `htmlFor`（它指向没有单选使用的 id，因此点击它什么都不做，且组被双重标记）。`Field`/`FieldLabel` 获得可选的 `labelID` 和 `isGroupLabel` props 以支持分组控件（#3343）。
- Table、CodeBlock 和 Markdown：键盘可聚焦的滚动容器现在使用 `role="group"` 而不是 `role="region"`。`region` 是地标，因此一页上多个同名滚动区域（例如多个标为 "Table" 的表格）会触发 axe `landmark-unique`。`group` 保持标签和键盘可聚焦性而不创建重复地标。（#3343）
- CodeBlock/Table/Markdown：溢出的滚动区域现在可键盘聚焦（`tabIndex`、`role="region"`），因此键盘用户可以滚动长代码和宽表格。CodeBlock 的复制按钮点击时不再折叠代码块，也不再嵌套在可折叠标题的 `role="button"` 内（#3343）。
- SegmentedControl：禁用的分段（包括整个控件禁用时）不再是键盘 tab 停靠点。此前选中的分段在禁用时保持 `tabIndex={0}`，因此可聚焦但静默失效——方向键和激活什么都不做（#3343）。
- SegmentedControl：即使当前 `value` 不匹配任何项（或选中项被禁用），radiogroup 也保持可通过 Tab 到达。此前过时/不匹配的值使每个分段都处于 `tabIndex={-1}`，因此整个控件从 tab 顺序中掉出。第一个启用的分段现在被提升为 tab 停靠点（#3343）。
- Selector/MultiSelector：设置 `hasClear` 时，`Delete` 和 `Backspace` 现在从聚焦的触发器清除值，因此清除选择不再仅限鼠标。清除按钮已经可键盘到达；这增加了键盘快捷键路径（#3343）。
- Selector/MultiSelector（`hasSearch`）：弹出层的搜索输入现在是组合框——它携带 `role="combobox"`、`aria-expanded`、`aria-autocomplete="list"`、`aria-controls` 和 `aria-activedescendant`，因此屏幕阅读器在 ArrowUp/Down 移动时播报高亮的选项。此前搜索输入是裸 `searchbox`，而 `aria-activedescendant` 留在（现在未聚焦的）触发器上，使高亮变化静默。在 `hasSearch` 模式下，触发器是打开列表框的普通按钮，而不是第二个组合框（#3343）。
- Selector、MultiSelector：组合框触发器现在可键盘聚焦（启用时 `tabIndex=0`）。此前是 `tabIndex=-1`，因此键盘和屏幕阅读器用户无法在默认（非搜索）模式下打开或操作控件。清除按钮现在也可键盘到达（#3320）
- useLayer：在特性检查后防护 `showPopover()`/`hidePopover()`，使覆盖层优雅降级而不是在没有 Popover API 的浏览器（Safari <17、Firefox <125）上抛出 TypeError（#3343）。
- SideNavItem：对于拆分操作项（具有自己链接/操作的可折叠项），`aria-current="page"` 现在位于可聚焦链接上，而不是非交互包装 `<div>` 上，因此屏幕阅读器在实际导航元素上播报当前页面（#3343）。
- SideNavHeading：用标题文本标记产品图标链接，使其有可访问名称。当 superheadingHref、headingHref 和菜单都设置时，指向标题 href 的图标链接渲染时没有文本或 aria-label，因此 axe 将其标记为 link-name，屏幕阅读器播报未标记链接。（#3343）
- Skeleton：加载占位符现在默认 `aria-hidden`（它是装饰性的——周围区域传达加载/忙碌状态），其脉冲动画在 `prefers-reduced-motion: reduce` 下禁用。`aria-hidden` 默认值可被消费者覆盖（#3343）。
- Spinner：旋转动画现在在 `prefers-reduced-motion: reduce` 下大幅减慢（与 ProgressBar 匹配），而不是无条件旋转。`role="status"` 的 "Loading" 播报仍然传达忙碌状态（#3343）。
- Table：proportional() 和 pixel() 在从 React Server Component 调用时不再抛出。Table 的 barrel 带有 'use client' 指令，将纯列工具标记为客户端函数；该指令现在仅存在于组件模块上，Table.doc.mjs 记录数据驱动 API 的哪些部分在服务器端安全（#3457）
- TabList：停止在 nav 元素上渲染 aria-orientation。aria-orientation 不是 navigation 角色允许的属性，因此触发关键的 axe aria-allowed-attr 违规（也通过重用相同 DOM 的 Toolbar 和 ToolbarEdgeCompensation 故事暴露）。orientation prop 仍然驱动方向键导航和键盘提示。（#3343）
- TimeInput/DateTimeInput：正确解析带点的 meridiem。"2:30 p.m." 此前被静默接受为 02:30，"12 a.m." 被接受为中午，因为 meridiem 检测正则不允许 AM/PM 正则接受的点的存在；hasMeridiem 现在从这些正则派生，因此它们不会漂移（#3462）
- Toast：键盘用户现在可以到达和管理通知。按 `F6` 将焦点跳入 toast 视口（最新 toast 的第一个控件，或容器）。关闭持有焦点的 toast 现在将焦点交给剩余的 toast——或恢复进入视口前聚焦的元素——而不是丢到 `<body>`。自动隐藏计时器在窗口模糊时暂停并在聚焦时恢复，因此 toast 不再在你处于另一个窗口或标签页时静默过期（#3343）
- Toast：从通知视口移除无效的 `aria-modal` 属性。`aria-modal` 仅在 `role="dialog"` / `alertdialog` 上有效，因此在 `role="region"` 视口上声明它被 axe 标记（`aria-allowed-attr`）。因为视口在每个页面渲染，这在整个应用中暴露了违规（#3343）。
- Tooltip：满足 WCAG 1.4.13（悬停或聚焦时的内容）。tooltip 现在可以在可见时用 `Escape` 关闭，并且当指针从触发器移到 tooltip 表面时保持打开（短暂悬停桥）。`useLayer` 上下文渲染 props 在层容器上获得 `onMouseEnter`/`onMouseLeave` 以支持可悬停的覆盖层。
- TopNavHeading：当徽标链接到目标时为其提供可访问名称。徽标图像是装饰性的，因此包裹在 `headingHref` 中的徽标产生未命名链接（axe：link-name）。它现在从 `heading` 标记（或新的可选 `logoLabel` prop 用于仅徽标标题）。（#3343）
- TreeList：父行现在可以从键盘展开和折叠。任何有子级的项渲染一个真正可聚焦的切换按钮，带有 `aria-expanded`，因此展开不再需要鼠标——此前没有 `onClick`/`href` 的项根本没有可聚焦控件（#3343）。
- Typeahead/Tokenizer：当焦点离开输入时（例如 Tab 离开）关闭结果下拉菜单，与现有的外部点击和 Escape 关闭匹配。此前菜单可能在触发器失去焦点后保持打开。
- ContextMenu 和 NavMenu 标题菜单现在支持首字符 typeahead（键入字母跳到匹配项），通过共享的 `useTypeahead` hook——与 DropdownMenu 匹配。MoreMenu 通过 DropdownMenu 继承它（#3343）。
- useListFocus（菜单/工具栏键盘导航）：方向键、Home 和 End 现在跳过禁用项，而不是在 `.focus()` 静默无操作的项目上停滞。这在存在禁用控件时解冻 NavHeadingMenu 和 Toolbar/ButtonGroup 中的键盘导航。默认项选择器现在也匹配 `menuitemradio`/`menuitemcheckbox`（#3343）。

#### 文档

- 记录 Carousel 的 hasEdgeFade 和 padding props，组件支持但 props 表、docsZh 和 docsDense 中缺失（与之前为 Text 的 justify 和 ToggleButton 的 isIconOnly 修复的相同遗漏）。还将 Fade 边缘剖析行更正为可选，因为蒙版可通过 hasEdgeFade 抑制（#3332）
- 修复 core README 中的过时引用：将 "XDS CLI" 部分重命名为 "Astryx CLI"，将组件名称更正为其当前裸导出（Layout、AppShell、TopNav、SideNav），并将剩余的 XDS 品牌提及更新为 Astryx。
- Link：记录内联链接的 `type="inherit"`。该值已支持（转发给 `Text`，渲染 `font-size`/`line-height: inherit`）但未记录——澄清了 `type` prop 的 JSDoc，添加了内联链接示例，并添加了覆盖继承/默认正文行为的回归测试（#2927）
- MetadataListItem：其文档页面预览现在在 MetadataList 包装器内渲染，并带有逼真的默认值（#3318）

#### 其他变更

- 将 5 个内联视觉隐藏样式块合并到共享的 VisuallyHidden 原语（Button、Link、ProgressBar、Switch、TextArea）；无行为变化。
- 将 Field 的 `labelElementID` prop 重命名为 `labelID`，与兄弟 props（`inputID`、`descriptionID`、`messageID`）使用的 `(part)ID` 命名约定匹配。“应用于标签元素的 id”与 `inputID`（“标签指向的控件”）之间的歧义现在存在于 prop JSDoc 而不是名称中。还在 FieldLabel 上重命名并更新了 RadioList/CheckboxList/InputGroup 消费者。无行为变化。（#3343）
- `useGridFocus` 获得 `hasRovingTabIndex`、`handleFocus` 和 `isRtl`，与 `useListFocus` API 匹配。Calendar 现在使用 `useGridFocus` 拥有其游走 tab 停靠点，移除了未发布的 `useCalendarRovingTabindex` hook。
- SegmentedControl 现在使用共享的 useListFocus 游走 tabindex 原语，而不是其内联键盘处理程序和 tab 停靠点修复 effect；无行为变化。
  组件约 60 行的内联 ArrowLeft/Right/Home/End 处理程序和 useIsomorphicLayoutEffect tab 停靠点修复被 useListFocus({hasRovingTabIndex: true, wrap: true, orientation: 'horizontal'}) 替换，它拥有单个游走 tab 停靠点、跳过禁用单选、循环、处理 Home/End，并在挂载/禁用时修复停靠点。通过容器 onFocus 处理程序选择聚焦单选的值，保留了 selection-follows-focus（APG 单选组）。
- 将 `@stylexjs/stylex` 从 `dependencies` 移到必需的 `peerDependency`（`^0.18.3`）。自己编写 StyleX 的消费者现在与 astryx 共享单个运行时——在浏览器和 Node 中解析都去重到他们自己的安装——而不是在版本漂移时静默获得第二份副本。不兼容的 StyleX 版本现在在安装时被标记（npm 报错，pnpm/yarn 警告），而不是静默解析。不编写 StyleX 的消费者不受影响：运行时仍是渲染 astryx 组件所必需的，并由 npm 7+ 和 pnpm 自动安装。
- 新的 `TableContextAction` 类型以及 `HeaderCellRenderProps` / `BodyCellRenderProps` 上可选的 `contextMenuActions` 字段。插件在现有的 `transformHeaderCell` / `transformBodyCell` 转换中追加其操作；表格跨插件连接它们（从不覆盖），与 `styles` 的合并方式相同。
- 单元格组件（`TableHeaderCell` / `TableCell`）拥有菜单包装器，并通过 `ContextMenuActions` prop 围绕自己的内容渲染它，因此单元格控制包装器与内边距/内容尺寸的交互——而且行菜单无需无效的 `<tr>` 嵌套即可工作。操作使用分隔线分组，并为活动项显示复选标记；当没有贡献时，原生浏览器菜单透传。
- `contextMenuActions` 接受数组或 getter（`() => TableContextAction[]`）；getter 在菜单打开时惰性解析，因此具有状态派生操作的插件不会在每次渲染时构建数组。`useTableSortable` 使用 getter，因此其检查/清除状态始终反映最新排序。
- 第一个贡献者：`useTableSortable` 在可排序表头上添加 "Sort ascending / Sort descending / Clear sort"。
- TabList 现在使用 `useListFocus` 内置的游走 tabindex 支持（`hasRovingTabIndex`），而不是手工编写的 tab 停靠点修复 effect。hook 拥有单个 tab 停靠点——标记 tabindex 0/-1，在挂载时以及停靠点挂载/卸载或切换禁用时修复它，并通过 nav 上的 `handleFocus` 在点击/程序化聚焦后保持同步。单个 Tab 仍渲染 `tabIndex={isSelected ? 0 : -1}` 作为初始真相来源，hook 的修复会保留它。无行为变化。
- useTreeFocus 获得 `hasRovingTabIndex` + `handleFocus` 用于内部 tab 停靠点管理；TreeList 放弃其内联 `activeId` 状态，让 hook 拥有游走 tab 停靠点（#3488）。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @arham766
- @athz
- @cixzhang
- @durvesh1992
- @ejhammond
- @humbertovirtudes
- @IFAKA
- @imdreamrunner
- @thedjpetersen

---

# 0.1.2

#### 破坏性变更

- `Text`、`Heading`、`Link` 和 `Timestamp` 将 `color="active"` 值重命名为 `color="accent"`，现在映射到专用的 `--color-text-accent` token（可读的 accent 文本墨色），而不是 `--color-accent`。运行 `astryx upgrade` 自动迁移调用点。（#2863）

#### 新功能

- Button：新增 `isInterruptible`，在 `clickAction` 待处理时保持按钮可点击——spinner 和 `aria-busy` 仍然显示，但按钮不被禁用或去重，因此再次点击会中断进行中的操作。ToggleButton 的异步切换现在通过此路径运行，保持可中断。
- 新增预构建的 UMD bundle（`dist/astryx.umd.js`，全局 `Astryx`）以及 `unpkg`/`jsdelivr` 字段，使库通过 `<script>` 标签直接从 CDN 工作，无需打包器。React/ReactDOM 保持为 peer 全局变量；StyleX 运行时被打包进去。
- 新增 `useTableStickyColumns`——用累积偏移和滚动感知的投影将一段连续的 `Table` 列固定到起始和/或结束边缘。使用 `{ startKeys, endKeys }` 配置；空配置是有效的无操作。

#### 问题修复

- AvatarGroupOverflow 现在将 rest props（data-_、aria-_、事件处理程序、id、role、tabIndex）转发到渲染元素，与 Avatar 和 AvatarGroup 的行为匹配。
- 修复在 SSR Client Component 内使用 HoverCard 时的 SSR hydration 不匹配（#3107）。浮动层现在内联渲染而不是 portal 到 `document.body`，因此服务器和客户端标记匹配。无 API 变化。
- Kbd：使用 `--color-border-emphasized` token 作为其底部边框，而不是 `--color-border`（#2850）
- useLayer 现在将 `anchor-name` 视为逗号分隔的列表，因此多个层可以锚定到同一元素（例如一个导航中的两个 TopNavMegaMenu），而不会互相覆盖锚点。此前第二个菜单丢失其锚点并渲染在导航之上。
- 修复移动端导航抽屉关闭后无法重新打开的问题（#3091）
  AppShell 移动抽屉将 `MobileNav` 挂载在 `<Activity>` 内，当抽屉关闭时切换到 `mode="hidden"`。关闭时，React 运行抽屉 effect 的清理（带有过时的 `isOpen`），而不是用 `isOpen=false` 重新运行 effect，因此延迟的 `dialog.close()` 从未触发，原生 `<dialog>` 在隐藏子树中保持 `open`。下一次打开然后跳过 `showModal()`（对话框已经打开），因此抽屉可以打开和关闭一次但永远无法重新打开。effect 清理现在会关闭仍然打开的对话框，保持原生对话框状态同步，使后续打开干净地再次调用 `showModal()`。
- 核心组件（`Banner`、`EmptyState`、`Markdown`）现在默认不渲染 `<p>`——它们渲染 `<div>`（外观不变）。这避免了块内容落入 `<p>` 时的 hydration 不匹配。`Markdown` 段落使用 `role="paragraph"`；传递 `components={{paragraph: 'p'}}` 以选择回到 `<p>`。
- `Pagination` 的 `changeAction` 现在可中断——页面变化在带有乐观页面状态的 transition 中运行，因此快速上一页/下一页点击会推进页面而不是被丢弃。`Button` 的 `clickAction` 保留其单次触发保护。
- 使 `Slider` 默认轨道颜色在柔和背景上可见
  背景轨道使用 `--color-background-muted` 绘制——与柔和表面填充使用的相同 token——因此轨道在柔和背景上消失。轨道现在使用专用的 `--color-track` 通道 token，设计为在正文/柔和表面上保持可读。
- 润色 `useTableStickyColumns` 固定单元格背景，使其与行的其余部分匹配：
- Table：表头行不再拾取 `hasHover` 行高亮——悬停（和条纹）样式现在仅应用于表体行。在行组件上新增内部 `isHeaderRow` 标志，使 `<thead>` 中的表头行选择退出（#2734）
- `Timestamp` 现在将当前时间（以及最多约 30 秒的未来小时钟偏差）渲染为 "now" 而不是 "in a few seconds"（#3099）。
- ToggleButton onPressedChange 接收点击事件以选择退出 preventDefault
  `onPressedChange` 现在接收原始点击事件作为第二个参数。调用 `event.preventDefault()` 会跳过 `pressedChangeAction`，因此消费者可以完全在 `onPressedChange` 中处理切换而不触发操作——与 `Switch` 的 `onChange` 和 `Button` 的 `onClick` 已经门控其操作 props 的方式匹配。现有的 `(isPressed) => void` 处理程序继续工作；事件是添加的尾部参数。
- Tokenizer/PowerSearch：将结束内容（清除按钮、resultCount）与字段的内联内边距对齐，而不是紧贴边框（约 3px）。它现在使用 spacing-2（8px）以匹配文本/起始图标的内缩（#2849）
- Tooltip 和 HoverCard：为浮动层添加 ARIA 角色——Tooltip 上的 `role="tooltip"`（完善 ARIA tooltip 模式；触发器已通过 `aria-describedby` 链接）和 HoverCard 上的 `role="dialog"`。通过层渲染 props 上新的可选 `role` 输送。（#3240；Popover 已暴露 `role="dialog"`。）

#### 文档

- 记录 Banner 的 `defaultIsExpanded` prop，它控制可折叠内容区域是否初始展开，但在文档站属性标签页中缺失
- 将 ClickableCard 和 SelectableCard 示例重命名为遵循 "Component — Variant" 标题约定（`Clickable Card — Nested Button`、`Selectable Card — Multi-select`），并为两个卡片文档添加 playground 默认值，使其文档站预览显示逼真的卡片内容（#2877）
- 为 Chat 子组件声明 playground 脚手架，使其在逼真宽度下预览（ChatComposer 和 ChatComposerDrawer 包裹在尺寸容器中，抽屉种子默认内容），并从 ChatComposerDrawer 的 "With Progress" 示例中删除冗余的可见值标签，同时保留可访问标签（#2877）
- 记录文档站属性标签页中缺失的两个公共 props：List 的 `start`（有序列表计数器起点）和 CheckboxInput 的 `isReadOnly`
- 恢复文档站上的 Icon 和 Skeleton 属性标签页预览。Icon 现在种子默认 `icon`（它是必需的、不可生成的 prop），Skeleton 使用具体预览尺寸渲染，而不是在 `100%` 处塌陷（#2848、#2875）
- 记录 Heading 的 `justify` prop，组件支持但在文档站属性标签页中缺失（#2847）
- OverflowList：通过 playground 默认值种子示例项，使文档站属性标签页预览渲染真实列表而不是空容器（#2872）
- 记录 Section 的 `paddingBlock` prop（块轴内边距覆盖），组件支持但在文档站属性标签页中缺失
- 给 `Skeleton` 属性标签页示例显式尺寸使其可见
  `Skeleton` 文档没有 `playground` 配置，因此交互式属性标签页预览回退到 `width: '100%'` / `height: '100%'` 的 prop 默认值。没有尺寸父级时，骨架塌陷为零尺寸（不可见）元素。文档现在设置 `playground.defaults` 为 `width: 320` / `height: 80`，使微光占位符可见地渲染。
- 将过时的 `facebookexperimental/xds` 文档/JSDoc 链接更新为当时当前的 `facebook/astryx` 命名空间（theme/syntax `@see` 引用）。旧组织 301 重定向，因此这些没有损坏——只是过时——这与其他地方使用的规范组织匹配
- 记录 Table 的 `verticalAlign` 和 `textOverflow` props，组件支持但在文档站属性标签页中缺失
- 记录 TabList 的 `layout` prop（'hug' | 'fill'）用于标签尺寸，组件支持但在文档站属性标签页中缺失
- 记录 Text 的 `justify` prop，组件支持但在文档站属性标签页中缺失（与之前 Heading 修复的相同遗漏）（#2847-adjacent）
- 恢复文档站上的 Timestamp 属性标签页预览。`value` 是必需 prop 且没有语义默认值，因此预览渲染 "Invalid time value"；它现在种子有效的 ISO 8601 日期（#2877）
- 记录 ToggleButton 的 `isIconOnly` prop，它是支持的公共 prop 但在文档站属性标签页中缺失
- 使 Toolbar 的 "Table Filter" 示例为其 Status 和 Priority 过滤器使用真正的 Selector 控件，而不是样式化为下拉菜单的按钮，并向 Toolbar 文档添加有意义的 playground 默认值和更丰富的插槽选项（按钮、图标按钮、标签页、分段控件、选择器）（#2877）。

#### 其他变更

- 固定单元格通过可覆盖的 `--table-sticky-background` 变量（默认 `--color-background-card`）绘制不透明基底，修复 `surface !== card` 的主题/模式（例如中性暗色）中的灰色不匹配。处于不同背景的消费者覆盖该变量。
- 行的覆盖层（条纹和/或悬停）通过 background-image 渐变在固定单元格上重放。`TableRow` 将其当前覆盖层颜色发布为可继承的 `--table-row-overlay` 变量，因此固定列精确镜像行——表格条纹时条纹，启用时悬停，否则无（无幽灵条纹）——与行同步过渡。
- `background-clip: padding-box` 保持行分隔线在固定单元格上可见。
- 新的 `transformScrollWrapper` hook（+ `ScrollWrapperRenderProps`）让插件将 `ref` 附加到水平滚动容器并在之前/之后注入装饰。
- `transformHeaderCell` / `transformBodyCell` 现在接收 `columnIndex` 和完整有序的 `columns` 列表（也在渲染 props 上暴露），启用位置感知插件（如固定列）。现有插件不受影响——新参数和方法是增量且可选的。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @durvesh1992
- @ernesttien
- @humbertovirtudes

---

# 0.1.1

#### 破坏性变更

- 将 `xdsTokenDefaults` 导出重命名为 `tokenDefaults`
  令牌默认常量从 `xdsTokenDefaults` 重命名为 `tokenDefaults`（从 `@astryxdesign/core/theme` 导出）。相应地更新导入。从公共 API 中移除 xds 命名的一部分。

#### 问题修复

- 当显示标签时增加 `ChatLayoutScrollButton` 的尾部内边距
  带有标签（例如 "New messages"）时，chevron 图标位于前缘，文本位于后缘。对称的内联内边距使标签文本紧贴药丸的圆角。现在在有标签时加宽尾部内联内边距，给文本与圆角边缘之间舒适的呼吸空间。图标仅（折叠）状态不变并保持平衡。
- 防止 `DateInput` 在键入不完整日期时使页面崩溃。键入前导 `0` 或 `1`（例如开始输入 `01` 表示一月）可能将进行中的值强制转换为年份为 `0` 的无效日期，进而抛出 `RangeError` 并使周围页面崩溃。不完整、尚未完成的输入现在被视为不完整而不是解析为日期，因此字段在键入时保持可用。
- 移除 `Selector` 上双重的焦点环。内部组合框按钮在包装器的 `:focus-within` 环上绘制自己的 `:focus-visible` 轮廓，在选择一个选项或用键盘导航后，在触发器上产生堆叠的圆角轮廓。按钮现在服从包装器的焦点环，与 `TextInput` 和 `NumberInput` 匹配。
- `<Layout>…</Layout>` 不再渲染空白页面。`Layout` 是插槽驱动的（`content`/`header`/`start`/`end`/`footer`），自然的嵌套形式 `<Layout><LayoutContent /></Layout>` 此前类型检查并通过构建，却在运行时丢弃其子级——一个空壳。子级现在渲染为 `content` 插槽的简写（`<Layout>{main}</Layout>` 等价于 `<Layout content={main} />`），与 `Card` 和 `Section` 接受内容的方式匹配；当两者都提供时显式 `content` prop 仍然优先。
- ToggleButton 在可中断的 transition 中以乐观状态运行 pressedChangeAction
  `pressedChangeAction` 作为未 await 的 promise 触发，因此文档化的加载 spinner 从未出现，切换忽略操作的生命周期。它现在在带有乐观按下状态的 transition 内运行，与 `Switch` 匹配：

#### 其他变更

- 乐观按下状态在点击时立即翻转；spinner 被去抖，因此快速操作显示新状态而不会有 spinner 闪烁。
- 操作是可中断的——在待处理时再次点击会以下一个乐观状态开始新的 transition（例如 true -> false -> true），而不是被丢弃或防护掉。
- 同步处理程序也受支持：同步触发挂起更新（例如在数据上挂起的路由器导航）的 `pressedChangeAction`（或 `onPressedChange`）也会驱动待处理状态。`pressedChangeAction` 现在接受 `void | Promise<void>`。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @ejhammond
- @josephfarina

---

# 0.1.0

#### 破坏性变更

- 将主题 token 辅助函数从 XDS 名称中重命名
  `@xds/core/theme` token 辅助函数重命名：`resolveXDSThemeTokens` ->
  `resolveThemeTokens`、`resolveXDSThemeToken` -> `resolveThemeToken`、
  `xdsTokenVar` -> `tokenVar`、`xdsTokenVars` -> `tokenVars`，以及选项类型
  `ResolveXDSThemeToken(s)Options` -> `ResolveThemeToken(s)Options`。更新从
  `@xds/core/theme` / `@xds/core/theme/tokens` 的导入。从公共 API 中移除 `xds` 命名的一部分。
- 移除 XDS 前缀兼容层——astryx 现在是唯一的公共表面
  此版本从公共 API 中抹去所有 `xds` 命名；没有兼容窗口。消费者必须迁移（我们在 OSS 之前拥有所有消费者）：
- 移除 daily、brutalist 和 default 主题；neutral 是新的基线
  三个主题包从仓库中移除，将不再发布：

#### 新功能

- 在 Markdown 组件中默认给链接加下划线
  Markdown 链接现在渲染持久下划线，而不是仅在悬停时下划线，使链接与周围文本清晰区分并提高无障碍性。accent 颜色不变。

#### 问题修复

- Markdown：使用 `)` 标记分隔符解析有序列表，而不仅仅是 `.`（#2994）
  CommonMark 5.2 允许有序列表标记以 `.` 或 `)` 结尾（例如 `1)`），但解析器只匹配 `\d+\. `，因此 `1) First` 列表渲染为字面段落文本。列表现在捕获其分隔符——`.` → `)` 的变化开始新列表，包括跨流式块——段落中断遵循 CommonMark（只有标记值为 1，包括像 `01.` 这样的零填充，可以中断）。

#### 其他变更

- **组件名称：** `XDS*` 别名已移除——使用裸名称（`Button` 而非
  `XDSButton`，`useTheme` 而非 `useXDSTheme`，`ButtonProps` 而非 `XDSButtonProps`）。
  `drop-xds-prefix-imports` codemod 自动化此操作。
- **CSS 类：** 组件只发出 `.astryx-*`（双 `.xds-*` 类已移除）。
  更新自定义 CSS 选择器 `.xds-button` -> `.astryx-button`（prop/状态值类
  如 `.primary`/`.sm` 不变）。
- **data 属性：** 仅写入 `data-astryx-theme` / `data-astryx-media`；更新
  自定义选择器和 SSR 根属性，脱离 `data-xds-*`。
- **CSS 层：** `@layer xds-base` / `xds-theme` 重命名为 `astryx-base` /
  `astryx-theme`；更新你的 `@layer` 顺序行和任何 PostCSS `layersBefore` 配置。
  `@astryxdesign/build` 的默认库层现在是 `astryx-base`。
- **预编译样式表：** `@astryxdesign/core/xds.css` 导出已移除——导入
  `@astryxdesign/core/astryx.css`。
- **CSS 自定义属性：** `--xds-*` 内边距回退已移除；设置 `--astryx-*`。
- **CLI 配置键：** `@astryxdesign/cli` 读取 package.json 的 `"astryx"` 字段（原为 `"xds"`）。
  重命名该块；过时的 `"xds"` 键会静默将包从发现中丢弃。
- `@astryxdesign/theme-daily`
- `@astryxdesign/theme-brutalist`
- `@astryxdesign/theme-default`
- import {defaultTheme} from '@astryxdesign/theme-default/built';
  - import {neutralTheme} from '@astryxdesign/theme-neutral/built';
- <Theme theme={defaultTheme}>...</Theme>
  - <Theme theme={neutralTheme}>...</Theme>

  ```

  ```

- 将 npm 包作用域从 `@xds/*` 重命名为 `@astryxdesign/*`
  所有已发布的包移动到新的 `@astryxdesign` 作用域（例如 `@xds/core` → `@astryxdesign/core`），连同 workspace lockfile、构建/运行时作用域目录扫描和文档站 slug 派生。消费者必须更新其导入和依赖名称。内部 ESLint 插件命名空间（`@xds/*` 规则）有意保持不动并单独跟踪。现有的 `@xds/*` codemod 继续针对旧作用域，因此仍在 `@xds/*` 上的项目可以迁移。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @ejhammond
- @kentonquatman
- @lexs

---

# 0.0.15

此版本将**裸组件名称规范化**：`Button`、`Stack`、`useTheme` 等现在是一等公民，`XDS*` / `useXDS*` 名称成为兼容别名。现有带前缀代码通过别名层继续工作——准备好时使用下面的 codemod 迁移。它还落地了若干 prop/组件重命名以实现跨组件一致性，每个都有自己的 codemod。

#### 破坏性变更

- **去前缀迁移——裸名称是规范名称**——每个 `XDS*` 组件、hook 和类型现在都有裸别名（`XDSButton` → `Button`、`useXDSTheme` → `useTheme`，约 634 个标识符分布在 100 个 barrel）。带前缀名称在兼容窗口期间仍作为别名工作，因此如果你什么都不做这是非破坏性的——但裸名称是文档、发现和新代码的新默认。（#2941）
  **Codemod：** `npx astryx upgrade --codemod drop-xds-prefix-imports`
- **`@xds/core` 去前缀**——`XDSMetaAppShell` → `MetaAppShell` 及相关 meta-app 导出去掉 `XDS` 前缀。（#2957）
- **DatePicker 组件重命名为 Input**——`XDSDateTimePicker` → `XDSDateTimeInput`，`XDSDateRangePicker` → `XDSDateRangeInput`（以及它们的 props、size 和小时格式类型），以与 `DateInput`/`TextInput`/`NumberInput` 保持一致。（#2276）
  **Codemod：** `npx astryx upgrade --codemod rename-date-picker-to-input`
- **Stack `element` → `as`**——`XDSStack`、`XDSHStack`、`XDSVStack` 和 `XDSStackItem` 使用 `as` 而不是 `element`，与其他多态组件匹配。（#2441）
  **Codemod：** `npx astryx upgrade --codemod rename-stack-element-to-as`
- **Chat `isStreaming` → `isStopShown`**——在 `XDSChatComposer` 和 `XDSChatSendButton` 上，控制停止按钮 affordance 的 prop 被重命名以描述其行为，而不是暗示流式状态。（在 `XDSMarkdown`/`XDSChatReasoning` 上不变。）（#2333）
  **Codemod：** `npx astryx upgrade --codemod rename-isStreaming-to-isStopShown`
- **命令式 handle 移到 `handleRef`**——`XDS*` 组件为根 DOM 元素保留 `ref`。暴露命令式 handle 的组件（`XDSCalendar`、`XDSChatComposerInput`、`XDSPowerSearch`、`XDSTokenizer`、`XDSChartStreamGL`）现在通过 `handleRef` 暴露它；`XDSSideNavCollapseButton` 的 `sideNavRef` 也重命名为 `handleRef`。（#2363）
  **Codemod：** `npx astryx upgrade --codemod rename-imperative-ref-to-handleRef`
- **Menu/Selector 尾部内容：`children` → `endContent`**——`XDSDropdownMenuItem`、`XDSContextMenuItem` 和 `XDSSelectorOption` 使用 `endContent` 表示尾部徽章、状态图标、快捷键和其他末端对齐内容；先前的尾部内容 `children` prop 已移除。（#2802）
  **Codemod：** `npx astryx upgrade --codemod migrate-item-children-to-endcontent`
- **Selector 自定义渲染：函数 children → `renderOption`**——`XDSSelector` 和 `XDSMultiSelector` 使用 `renderOption` prop 进行自定义选项渲染；先前的函数作为 children 的渲染器已移除。（#2821）
  **Codemod：** `npx astryx upgrade --codemod migrate-selector-children-to-render-option`
- **CheckboxList 加载现在是逐项的**——`XDSCheckboxList` 上的组级 `isLoading` 被移除，改为 `XDSCheckboxListItem` 上的 `isLoading`。在集合模式下，切换的项在其 `changeAction` 待处理时自动显示 spinner。（#2903）
- **Chat `messageGap` → `gap`**——`XDSChat` 将 `messageGap` 重命名为 `gap`。（#2325）
- **FileInput `onChangeAction` → `changeAction`**——使 `XDSFileInput` 与整个系统使用的 React 19 action-prop 约定对齐。（#2288）
- **PowerSearch 预设类型 → `*FilterPreset`**——预设类型导出重命名以提高清晰度。（#2925）
- **`CenterAxis` → `XDSCenterAxis`，`DateRange` 去前缀**——类型导出命名清理以保持一致。（#2289、#2922）
- **Stepper 移到 `@xds/lab`**——`XDSStepper`/`XDSStep` 在 API 重做期间移到 lab 包；从 `@xds/lab` 导入。（#2335）

#### 升级

```bash

npx astryx upgrade --apply

```

这会按顺序运行发布 codemod。裸名称迁移（`drop-xds-prefix-imports`）和主题 data 属性迁移（`migrate-theme-selectors-to-data-attrs`）是可选的——准备好时显式运行它们，例如：

```bash

npx astryx upgrade --codemod drop-xds-prefix-imports --codemod-only --apply

```

#### 新组件

- **XDSLightbox**——带覆盖层呈现的图像/媒体灯箱。（#2298）
- **XDSItem**——共享条目原语，具有 `compact`/`balanced`/`spacious` 密度和 `startContent`/`endContent` 插槽，现在由 `XDSListItem` 组合。（#2259）
- **XDSOutline**——滑动指示器轮廓/导航，具有密度变体和 CSS 锚点定位。（#2347、#2746）
- **useXDSInteractiveRole / XDSInteractiveRoleContext**——协调嵌套组件之间的交互角色语义。（#2399）

#### 新功能

- **裸名称子路径导出**——`@xds/core/Heading`、`@xds/core/Code`、`@xds/core/HStack`、`@xds/core/VStack` 作为便利子路径提供。（#2420）
- **Field `width` prop**——基于 Field 的组件接受 `width`（`SizeValue`）应用于外部 `XDSField`，使标签、控件和状态一起调整尺寸并保持对齐。增量和向后兼容。影响 `XDSTextInput`、`XDSTextArea`、`XDSNumberInput`、`XDSDateInput`、`XDSDateRangeInput`、`XDSDateTimeInput`、`XDSTimeInput`、`XDSFileInput`、`XDSSelector`、`XDSMultiSelector`、`XDSTypeahead`、`XDSTokenizer`、`XDSSlider`、`XDSCheckboxInput`、`XDSCheckboxList`、`XDSRadioList`、`XDSSwitch` 和 `XDSField`。（#2755）
- **所有输入组件的 `lg` 尺寸**——输入获得大尺寸选项。（#2324）
- **Markdown `autolink="gfm"`**——`XDSMarkdown` 获得可选的 `autolink` prop，启用 GitHub Flavored Markdown 自动链接字面量规则（裸 `https?://…`、`www.…`、`<scheme:url>`、`<email>`、`user@host`），跳过代码 span、现有链接和图像 alt 文本。还通过新的 `ParseOptions` 参数在 `parseMarkdown`、`parseInline` 和 `parseMarkdownIncremental` 上暴露；现有的位置签名保留。默认行为不变。（#2394）
- **Markdown `display="inline"`**——渲染继承周围排版的内联 markdown span，用于文档文本和表格单元格，无需块级包装器。
- **视觉 props 反映为 data 属性**——组件为其变体/状态轴（例如 `data-variant`、`data-size`）双重发出 `data-*` 属性，同时保留旧的裸变体类，为主题提供稳定的选择器表面。（#2792）
- **Spinner `shade="inherit"`**——从继承的 `currentColor`（带半透明轨道）绘制环，因此无论主题或变体如何，它始终匹配父级的解析前景色。
- **Text/Heading `justify` prop**——`XDSText` 和 `XDSHeading` 上的两端对齐文本。（#2438）
- **AspectRatio `isCircle`**——通过 `XDSAspectRatio` 实现圆形容器。（#2632）
- **Link 在 `href` 未定义时渲染按钮**——`XDSLink` 为没有 href 的操作链接生成语义 `<button>`。（#2507）
- **Carousel `hasEdgeFade` + padding props**——边缘淡出 affordance 和内边距控制；缩放动画已移除。（#2566）
- **Tab `isLabelHidden`**——图标仅标签页省略空标签节点，使选中指示器与可见图标对齐。
- **菜单放置选项**——菜单表面的额外放置控制。（#2770）

#### 问题修复

- **Button/Spinner 加载对比度**——修复主题变体上加载 spinner 对比度差的问题；spinner 继承真实变体前景色，标签在 destructive 上正确隐藏。（#2717）
- **Spinner 居中**——修复 `XDSSpinner` 在分数设备像素比下在图标仅 `XDSButton` 加载状态内偏离中心渲染；加载覆盖层和包装器使用 `display: grid` + `place-items: center`。
- **ChatComposer 插入符**——`XDSChatComposerInput` 在父级更新受控 `value` 时保留插入符，修复斜杠命令选择后插入符跳到偏移 0 的问题。
- **图标插槽**——`renderIconSlot` 通过 `XDSIcon` 渲染语义图标名称字符串；新的 `getIconRegistry()` 让工具从同一注册表派生图标名称选项。
- **CommandPalette 内联滚动**——`XDSCommandPaletteItem` 在初始挂载于内联对话框内时不再将高亮项滚动到视图中，防止文档页面滚动跳动。
- **文档站自动聚焦**——`XDSDialogHeader` 在 `XDSDialog isInline` 内跳过标题自动聚焦；`XDSCommandPaletteInput` 读取共享的对话框内联上下文。
- **HoverCard 字体**——将主题正文字体 token 应用于 XDS 层根，使 portal 的 HoverCard 内容继承配置的字族。
- **Info 状态图标**——默认 `info` 状态图标使用实心填充（与 `success`/`error`/`warning` 匹配）以提高小尺寸下的可见性。
- **List/Item 密度**——`XDSListItem` 将密度（`compact`/`balanced`/`spacious`）传递给共享的 `XDSItem`，修复 `balanced`/`spacious` 塌陷为相同内边距的问题。
- **Markdown 松散列表**——将空行分隔的相同样式列表项连接为单个松散列表（CommonMark §5.3），并将非默认 `start` 转发到渲染的 `<ol>` 以供辅助技术和复制粘贴使用。
- **AppShell 移动导航**——修复仅标题 `XDSTopNav` 的移动导航；移除 `useXDSSlotPresence`。（#2243）
- **主题 CSS 正文回归**——修复去前缀迁移后破坏文档站 Markdown 排版的构建主题 CSS（标题丢失块边距）。`astryx theme build` 现在使用单一 CSS 生成路径（`@xds/core` 的生成器），失败的 `@xds/core/theme` 导入是硬构建错误而不是静默回退。（#2964）
- **逃生舱与基础 prop 卫生**——许多组件移除了冗余的 `xstyle`/`className`/`style` 重复声明，现在一致地扩展 `XDSBaseProps`、转发逃生舱并暴露 `displayName`（require-base-props / require-ref-prop lint 规则）。（#2300、#2310、#2835、#2858）
- **Toast barrel 导出**——从 `@xds/core` barrel 导出 `XDSToast` 及其 props，使文档站 playground 预览解析 Toast 示例。
- **Typeahead 无 id 行**——`XDSBaseTypeahead` 对没有 `id` 值的搜索结果使用共享键回退，因此无 id 行不再全部渲染为选中。
- **SelectableCard 过渡 token 化；ResizeHandle 获得 `className`。**（#2966）

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @czarandy
- @ejhammond
- @ernestt
- @imdreamrunner
- @josephfarina
- @kentonquatman
- @lexs
- @nynexman4464
- @rubyycheung

---

# 0.0.14

#### 破坏性变更

- **`on*Action` → `*Action`（React 19 约定）**——`onChangeAction` → `changeAction`、`onClickAction` → `clickAction`、`onPressedChangeAction` → `pressedChangeAction`、`onScrollToTopAction` → `scrollToTopAction`。与 React 19 action prop 命名对齐。（#1942）
  **Codemod：** `npx astryx upgrade --codemod rename-action-props`
- **状态命名：`positive`/`negative` → `success`/`error`**——在所有组件中收敛状态变体命名。（#2175）
  **Codemod：** `npx astryx upgrade --codemod rename-status-variants`
- **Section `wash` → `muted`**——重命名变体以与 XDSCard 保持一致。（#2063）
  **Codemod：** `npx astryx upgrade --codemod rename-section-wash-to-muted`
- **Stack `direction` 默认为 `vertical`**——`XDSStack` 不再要求显式 `direction` prop；省略它给出垂直布局。（#1945）
- **Table `textOverflow` 默认改为 `truncate`**——原为 `wrap`，现在默认截断并在悬停时显示 tooltip。（#2096）
- **移除已弃用的 `*Raw` token 别名**——将任何 `*Raw` 用法迁移到标准 token。（#2095）
- **从 `defineTheme` 移除运行时字体加载**——字体现在仅在 CSS 层处理。（#2226）

#### 升级

```bash

npx astryx upgrade --apply

```

这会按顺序运行所有三个 codemod（`rename-action-props`、`rename-status-variants`、`rename-section-wash-to-muted`）。

#### 新组件

- **XDSAvatarGroup**——用于团队和列表的堆叠头像显示（#2183）
- **XDSInputGroup**——将多个输入组合为单个视觉组（#2207）
- **XDSStepper / XDSStep**——多步流程和进度指示器（#2206）
- **XDSButtonGroup**——分组相关按钮并共享样式（#2202）
- **XDSContextMenu**——带嵌套项的右键上下文菜单（#2195）
- **XDSFileInput**——带拖放支持的文件上传（#2184）
- **XDSDateRangePicker**——带日历 UI 的日期范围选择（#2201）
- **XDSDateTimePicker**——组合日期和时间输入（#2199）
- **XDSBlockquote**——样式化块引用组件（#2198）
- **XDSOverlay**——带 CSS 优先悬停和触摸支持的遮罩 + 媒体主题覆盖层（#1912）
- **XDSNavHeadingMenu**——带尺寸和键盘导航的容器组件（#1999）

#### 新功能

- **Link `to` prop**——与 `href` 一起传递 `to` 以兼容路由器（#2237）
- **Selector `hasSearch`**——在选择器选项内启用过滤/搜索（#2142）
- **CodeBlock `container` prop**——控制代码块的宽度和边框（#2132）
- **Heading `display` 类型变体**——用于 hero 区域的大号展示标题（#2054）
- **Text 自定义主题定义类型**——支持来自主题的任意文本类型（#1840）
- **Table 结构化 children 模式**——使用带 JSX children 的 `<XDSTable>` + Markdown 集成（#2098）
- **Table 内容感知列宽**——children 模式的自动布局（#2105）
- **Table 响应式水平滚动**——默认列宽最小值（#2043）
- **TabList 轮播溢出**——溢出标签页的箭头导航（#1978）
- **PowerSearch `components` map**——按类型的 token 和编辑器覆盖（#2076）
- **Markdown `components` map**——自定义组件注入 + XDSCitation 提取（#2073）
- **Markdown `inlinePlugins`**——自定义文本模式渲染（#1917）
- **SideNav 内置调整大小**——直接集成 `useXDSResizable`（#1877）
- **Resizable 药丸放置偏移**——自动折叠翻转（#1876）
- **Theme `--color-track` token**——Spinner 使用它实现完全 token 化的轨道（#2170）
- **服务器安全工具子路径导出**——用于 RSC 的 `@xds/core/server`（#1981）
- **XDSLinkProvider 采用**——所有链接渲染组件现在使用 provider（#1906）

#### 问题修复

- **Chat composer 粘贴**——修复没有转发 ref 时静默丢弃粘贴（#2179）
- **Citation**——防止 rest 展开覆盖无障碍 props；扩展 XDSBaseProps（#2217、#2092）
- **Field**——中性灰色悬停阴影、输入聚焦边框、水平标签网格、z-index 包含、包装器点击聚焦（#2157、#2059、#1890、#1839）
- **FormLayout**——通过 CSS Grid 实现等宽水平子级（#2058）
- **Link `label`**——使其可选；aria-label 会损害文本链接上的 AT（#2031）
- **TopNav**——停止标题链接上的点击传播，移除悬停延迟，将选中状态添加到 xdsClassName（#2135、#2133、#1997）
- **Spinner**——用 useXDSTheme 简化颜色解析（#2124）
- **Markdown 表格**——重置容器内边距、对齐和宽度修复（#2121、#2109）
- **Calendar**——为日期单元格容器添加隔离（#2001）
- **CommandPalette/MultiSelector**——防止 iOS 输入聚焦时缩放（#1993）
- **Dialog**——原生弹出层兼容的基于目标 backdrop 检测（#1892）
- **Typeahead**——传播泛型类型；防止选择后空 popover（#2014、#1943）
- **Selector/MultiSelector**——解决嵌套按钮 HTML 违规（#1853）
- **ClickableCard**——将调用者 xstyle 与内部交互样式合并（#1893）
- **RadioList**——扩展 XDSBaseProps 用于标准 prop 继承；修复排版 token（#2093、#1902）
- **Tokenizer**——将状态添加到 xdsClassName 用于主题定位（#1995）
- **List**——为 flex 父级将标题 + 列表包裹在列容器中（#2017）
- **Section**——将显式内边距传播到嵌套 section（#1972）
- **AppShell**——在粘性 sidenav 容器上匹配 flex 布局属性（#1850）
- **菜单悬停**——在 `(hover: hover)` 媒体查询后门控（#2046）
- **ResizeObserver**——将所有用法迁移到共享单例以提高性能（#1990）
- **Layout**——通过 :has() 实现容器驱动的边缘补偿（#1987）
- **缺失的 `xdsClassName` 钩子**——添加到使用边框 token 的组件（#2244）
- **ProgressBar**——将 xdsClassName 添加到轨道用于主题定位（#2079）
- **z-index 隔离**——为有泄漏 z-index 的组件添加隔离（#2004）
- **`use client` 指令**——添加到 CommandPalette barrel、CodeBlock、ClickableCard 等（#2069、#2048、#1833）
- **Thumbnail**——焦点环被 overflow hidden 裁剪（#2264）
- **DropdownMenu**——触摸浏览器上的轻触关闭 + 点击切换竞态（#2186）
- **Theme**——基线媒体主题 color-scheme 翻转，独立主题文本样式修复（#1921、#1831）

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @czarandy
- @ernestt
- @josephfarina
- @kentonquatman
- @lexs
- @marie-lucas
- @nynexman4464
- @rubyycheung
- @rumble
- @saivazian
- @tedmcdo
- @thedjpetersen
- @zurfyx
- @imdreamrunner

---

# 0.0.13

#### 破坏性变更

- **Toolbar `density` → `size`**——`XDSToolbar` 用 `size` 替换 `density` prop，为子组件添加 `XDSSizeContext` 级联。（#1448）
- **图标重命名：`checkCircle`/`xCircle` → `success`/`error`**——默认图标注册表重命名以提高语义清晰度。（#1503）
- **`XDSChatComposerAttachments` → `XDSChatComposerDrawer`**——为清晰起见重命名。（#1714）
- **移除已弃用的 `XDSSelectorItem`**——内部化 `XDSSelectorOption`；直接使用 `XDSSelector`。（#1582）
- **收紧 `XDSBaseProps`**——省略 `title` 和晦涩 HTML 属性；添加 `data-*` 索引签名。（#1505、#1502）

#### 新功能

- **XDSClickableCard 和 XDSSelectableCard**，带 `useClickableContainer` hook（#1707）
- **useResizable hook + XDSResizeHandle**——面板和侧边栏的拖拽调整大小（#1754）
- **AlertDialog**——专用确认对话框组件（#1370）
- **Dialog、AlertDialog 和 CommandPalette 上的 `isInline` prop** 用于嵌入式用法（#1676）
- **Card `transparent` 变体**（#1655）
- **XDSTooltip 和 XDSHoverCard 上的 `defaultOpen` prop**（#1672）
- **Stack `width`、`height`、`align`、`justify` props**——HStack、VStack、Stack 上的便利别名（#1778、#1703）
- **Text `type` 默认为 `'body'`**——不再必需（#1702）
- **Carousel**——内容可滚动时始终显示导航按钮（#1772）
- **AppShell `defaultIsMobile`** 用于 SSR 安全的移动导航检测（#1755）
- **SideNav/TopNav 悬停打开菜单** 通过 `useXDSMenuHover`（#1419）
- **DropdownMenu 复合组件模式**（#1372）
- **MobileNav 根据触发器位置自动检测抽屉侧**（#1395）
- **Dialog `padding` prop**（#1169）
- **Grid 统一响应式列** API（#1422）
- **Selector/Typeahead/Tokenizer** 尺寸级联到下拉列表项（#1442）
- **图标插槽标准化为 `ReactNode`** 跨所有组件（#1746）
- **Tailwind v4 主题桥**（#1649）
- **Theme `expandColorScale`**——从单个 accent hex 派生完整颜色 token 渐变（#1452）
- **Theme 派生 var 展开**——CSS 属性到内部变量（#1467）
- **Table 列对齐和行垂直对齐**（#1362）
- **TabList 视觉润色**——幽灵悬停、主色、分隔线重叠；移除 density prop（#1357、#1418）
- **TreeList 视觉润色**（#1367）
- **SideNav/TopNav 标题图标切换**（#1371）
- **CodeBlock 高亮范围**——基于范围的高亮支持（#1470）
- **页面和块模板系统**，带 100+ 组件展示块（#1393）

#### 问题修复

- 截断：使用 Range API 进行多行检测（#1816）
- PowerSearch：添加 `xdsClassName` 用于主题定位（#1813）
- ToggleButton：修复主题化 + Chat barrel 导出（#1812）
- 组件审计：AppShell BaseProps、AspectRatio RTL、Badge 标题（#1748）
- 组件审计：BaseTypeahead 上的 data-autofocus、TreeListBranches 上的 displayName（#1692）
- 组件审计：SegmentedControl、Slider 扩展 XDSBaseProps（#1519）
- 组件审计：PowerSearch token、RadioList 导出（#1359）
- 加固审计：AlertDialog BaseProps、CheckboxList className、Table xdsClassName、use-client 指令（#1518）
- 从公共 API 移除仅内部导出（#1603）
- 为 StackAlignment 类型添加 XDS 前缀，修复 StatusDot 标题（#1561）
- SSR：用 SSR 安全替代方案替换 `useLayoutEffect`（#1721）
- 焦点：轮廓使用 `:focus-visible` 而不是 `:focus-within`（#1511）
- 焦点：从过渡中移除 `outline` 以防止黑色闪烁（#1731）
- iOS Safari：防止输入聚焦时自动缩放（#1468）
- Dialog/MobileNav：用 prop 驱动的打开样式替换 `:where([open])`（#1652）
- `stylex.props` 展开导致的 className/style 覆盖 + lint 规则（#1462）
- Collapsible：移除触发器内边距，为标签添加 capsize（#1770）
- Breadcrumbs：仅 onClick 项匹配链接颜色（#1773）
- Grid：通过 track-max 限制列数（#1761）
- Tokens：从 DSP 颜色渐变更新调色板边框颜色（#1760）
- Slider：在滑块拖拽期间保持 tooltip 可见（#1751）
- AppShell：粘性包装器上的目标类名（#1764），通过存在注册检测空插槽（#1377）
- Icon：输入 startIcon 插槽使用次要颜色（#1765），默认 `inherit`（#1588）
- SideNav：section 自定义样式、项可折叠+操作拆分（#1666）、拖拽手柄过渡的设计 token（#1381）
- Table：容器内边距改为方向变量（#1621）
- Toast 视口：重置 UA popover 背景（#1644）
- Selector：从 XDSBaseProps 转发额外 HTML 属性（#1444）
- TextArea/TimeInput：a11y 和输入一致性修复（#1443）
- Token：添加 `'use client'` 指令，TopNav 上下文命名约定（#1465）
- Chat：将触发器菜单锚定到光标位置（#1354）
- Banner、Breadcrumbs、Spinner、StatusDot、TabList、Text、TextArea、TimeInput：扩展 XDSBaseProps（#1780、#1640、#1405）
- CodeBlock：Safari span 回退、逐行 token 性能（#1487、#1369）
- TextInput/TextArea：默认值为空字符串（#1439）
- MobileNav：导航项激活时关闭抽屉（#1438）
- Divider：从标签移除不透明背景（#1426）
- Field：将描述移入 XDSFieldLabel（#1458）
- Theme：为根 provider 将 `data-xds-theme` 同步到 `<html>`（#1587）
- 为工具栏重新设计边缘补偿模型（#1539）

#### 性能

- CodeBlock：范围模式的内容可见性分块，消除样式表变更（#1457）

#### 升级

Codemods 可用于此版本的所有破坏性变更：

```sh

npx astryx upgrade --apply --to 0.0.13

```

先预览变更（dry run）：`npx astryx upgrade --to 0.0.13`
运行特定 codemod：`npx astryx upgrade --apply --codemod toolbar-density-to-size`
列出所有可用 codemod：`npx astryx upgrade --list`

---

# 0.0.12

#### 破坏性变更

- **Button 图标仅模式需要 `isIconOnly`**——`XDSButton` 和 `XDSToggleButton` 现在需要显式 `isIconOnly` 才能进行图标仅渲染。（#1257）

#### 新功能

- **XDSThumbnail** 组件（#1255）
- **XDSChatLayout**，带固定 composer 停靠和容器查询（#1249）
- **XDSToast** 通知系统（#1194）
- **Chat reasoning 组件**——Reasoning、ToolCall、ToolCallGroup（#1192）
- **useXDSImperativeDialog**——无需状态管理的显示/隐藏（#1239）
- **主题语法系统**，带 11 个社区预设 + `defineTheme({ syntax })`（#1217、#1219）
- **XDSMediaTheme** 用于反色表面主题化（#1211）
- **Card 背景颜色变体**（#1213）
- **Daily 主题**，带 Figtree 字体、Lucide 图标（#1201）
- **SideNav/TopNav 菜单 popover 和标题变体**（#1272）
- **TextInput `onEnter` prop** 以与 NumberInput 保持一致（#1223）
- **Button `isPressed` prop** 用于切换状态（#1202）
- **CLI 编程 API**——`@xds/cli/api`（#1208）
- **ChatComposer `headerActions` + `headerContext`** 替换 `contextToolbar`（#1242）
- **Chat 触发器菜单系统** 用于 ComposerInput（#1193）

#### 问题修复

- Dialog：重置继承的边缘信号，防止幽灵按钮边距偏移（#1237）
- CodeBlock：滚动时缺失语法高亮 + 性能改进（#1221）
- Chat：加固气泡、滚动按钮、抽屉动画、状态（#1245）
- Chat：消息气泡背景使用 `color-neutral`（#1271）
- SegmentedControl：sm 尺寸的一致边框圆角（#1206）
- 从 XDSBaseProps 省略 `children`——需要显式选择加入（#1246）
- Theme：发布构建的主题模块以防止双重 CSS 注入（#1247）
- Theme：在 `parseStyleKey` 中支持裸状态键（#1233）
- ProgressBar/Section：迁移到 XDSBaseProps，修复 RadioList 双重应用（#1253）
- CodeBlock：md 尺寸使用语义 `--text-code-size` token（#1273）
- Input：通过 `...rest` 展开转发原生事件处理程序（#1259、#1291）

#### 升级

Codemods 可用于此版本的所有破坏性变更：

```sh

npx astryx upgrade --apply --to 0.0.12

```

先预览变更（dry run）：`npx astryx upgrade --to 0.0.12`
运行特定 codemod：`npx astryx upgrade --apply --codemod add-is-icon-only`
列出所有可用 codemod：`npx astryx upgrade --list`

---

# 0.0.11

#### 补丁变更

- 版本升级和发布基础设施修复
- 无破坏性变更

---

# 0.0.10

#### 破坏性变更

- **StatusDot 和 ProgressBar 单一尺寸**——两个组件现在都有单一固定尺寸（8px）。`size` prop 已移除。（#966）

#### 新功能

- **Layout `defaultHasDividers`**——通过上下文实现容器控制的分隔线（#969）
- **Button `href` 支持**——链接样式按钮（#935）

#### 问题修复

- Dialog：通过 `--container-max-height` 将 `maxHeight` 传播到布局（#965）
- Popover：将表面样式嵌入 `useXDSPopover` hook（#964）
- Dialog：在 iOS Safari 上锁定 body 滚动（#948）
- Dialog：可滚动内容、移动可见性、容器样式（#942）
- 菜单组件：图标尺寸、项密度、section 标题（#946）
- Avatar 状态点尺寸 + 图标非语义颜色（#944）
- Table：用省略号截断溢出单元格文本（#933）
- AppShell：默认变体为 "elevated"（#934）
- DialogHeader：通过视觉调整重新添加 capsize（#956）
- 加固清扫（#968）

#### 升级

Codemods 可用于此版本的所有破坏性变更：

```sh

npx astryx upgrade --apply --to 0.0.10

```

先预览变更（dry run）：`npx astryx upgrade --to 0.0.10`
运行特定 codemod：`npx astryx upgrade --apply --codemod remove-size-props`
列出所有可用 codemod：`npx astryx upgrade --list`

---

# 0.0.8

#### 破坏性变更

- **Button `endSlot` → `endContent`**——在 XDSButton 和转发的对象字面量上重命名（例如 XDSDropdownMenu 的 button prop）。（#895）
- **Token 重命名**——v0.0.6 的中间 token 名称按 token 规范重命名为最终 v0.0.8 约定。

#### 问题修复

- 使 cyan、pink 和 yellow token 颜色与 WWW 对齐（#907）
- Dialog 加固（#775）
- ListItem：支持 description 的 ReactNode，修复 whiteSpace nowrap 破坏 line-clamp（#896）
- Table：比例列的默认 minWidth（#891）
- Button：防止文本换行，添加省略号截断（#892）
- ListItem：固定内联内边距（#887）
- Slider 加固——样式覆盖、a11y、指针处理（#882）
- TextArea 加固——计数器 a11y、软 maxLength、禁用状态（#849）
- Field 加固——a11y、自动 ID、禁用样式（#848）
- Calendar 加固——a11y、键盘导航、日期约束（#837）
- CheckboxInput、Button、Switch 加固（#765、#768、#769）
- DateInput、FormLayout 加固（#771、#772）
- 分发路径主题化的 CSS 层排序（#806）
- 将 `@layer xds-reset` 重命名为 `@layer reset`（#833）
- Tokenizer 截断行为（#880）
- 纠正各组件中的中性灰色 token 语义（#852）
- 正式化容器内边距 token，防止内部 var 访问（#847）

#### 升级

Codemods 可用于此版本的所有破坏性变更：

```sh

npx astryx upgrade --apply --to 0.0.8

```

先预览变更（dry run）：`npx astryx upgrade --to 0.0.8`
运行特定 codemod：`npx astryx upgrade --apply --codemod rename-endslot-to-endcontent`
列出所有可用 codemod：`npx astryx upgrade --list`

---

# 0.0.7

#### 破坏性变更

- **Banner `variant` → `container`**——将 XDSBanner 上的 `variant` prop 重命名为 `container`。类型引用 `XDSBannerVariant` → `XDSBannerContainer` 和 `XDSBannerVariantMap` → `XDSBannerContainerMap`。（#814）

#### 升级

Codemods 可用于此版本的所有破坏性变更：

```sh

npx astryx upgrade --apply --to 0.0.7

```

先预览变更（dry run）：`npx astryx upgrade --to 0.0.7`
运行特定 codemod：`npx astryx upgrade --apply --codemod rename-banner-variant-to-container`
列出所有可用 codemod：`npx astryx upgrade --list`

---

# 0.0.6

#### 破坏性变更

- **Token 重命名**——设计 token 按命名审计重命名：`positive` → `success`、`negative` → `error`、`divider` → `border` 等（`migrate-token-names`）
- **阴影 token**——Elevation token 重命名为 `shadow-base`/`shadow-menu`/`shadow-hover`/`shadow-dialog` + `insetshadow-border-*`（`migrate-shadow-tokens`）
- **`XDSCollapse` → `XDSCollapsible`**——组件和 prop 重命名（`migrate-collapse-to-collapsible`）
- **圆角 token**——语义圆角 token 重命名为数字刻度（`migrate-radius-tokens`、`migrate-skeleton-radius`）
- **Badge `children` → `label`**——作为 children 传递的内容现在使用 `label` prop（`migrate-badge-children-to-label`）

#### 新功能

- **动态主题原语：** `defineTheme` 中的 `radiusScale`、`motionScale`、`typeScale`
- **动效 token：** 持续时间、缓动，以及组件迁移到基于 token 的过渡
- **基于比例的字体刻度**，在 `defineTheme` 中使用 `typeScale` 并吸附 4px 网格
- **移动响应式 AppShell：** 响应式移动导航 API、`autoMobileTopBar`、入场动画
- **TopNav 移动渲染：** 响应式菜单、MegaMenu 组合 children API + 移动抽屉
- **SideNav：** 可折叠侧边栏（`isCollapsible` prop）、带拖拽手柄的可调整大小侧边栏
- **PowerSearch：** 带嵌套过滤器的过滤实现
- **TreeList** 组件
- **NavItem** 组件
- 共享主题 CSS 生成，移除 XDSFontWrapper

#### 问题修复

- Badge：硬编码高度 → 间距 token；添加 `label` prop 以保持 API 一致性（#709）
- CheckboxInput 和 Switch：焦点环 + 不确定 aria（#723）
- Kbd：mod 键的平台检测（#722）
- MegaMenu：统一边框圆角、TopNav 菜单定位/键盘/焦点捕获
- Popover：背景透明度、DropdownMenu elevation token
- Collapsible：硬编码 fontSize/transition → token
- AppShell：硬编码间距 → 间距 token
- 分发 CSS 层从 `@layer xds` 重命名为 `@layer xds.core.base`
- reset.css 中的 `color-scheme` 以兼容 lightningcss light-dark()
- 同步 package.json 导出（NavItem，移除过时的 typography.css）
- Type-scale：在 computeLeading 中使用 Math.round 进行 4px 网格吸附

#### 升级

Codemods 可用于此版本的所有破坏性变更：

```sh

npx astryx upgrade --apply --to 0.0.6

```

先预览变更（dry run）：`npx astryx upgrade --to 0.0.6`
列出所有可用 codemod：`npx astryx upgrade --list`

---

# 0.0.5

> **注意：** v0.0.5 是已发布的版本。此版本的 codemod 在 CLI 中注册在 v0.0.6 下。使用 `--to 0.0.6` 运行它们。

见上文 0.0.6 了解破坏性变更和升级说明。

---

# 0.0.4

#### 新组件

- **XDSTreeList**——带展开/折叠的层级树列表组件（#609）
- **XDSPowerSearch**——带结果计数、过滤的高级搜索组件（#561、#593）

#### 功能

- **AppShell 变体系统**——新的 `variant` prop（#597）
- **AppShell contentPadding**——新的 `contentPadding` prop（#612）
- **AppShell 自动高度模式**——Sidenav 和粘性背景（#615）
- **startIcon** 支持（#584）

#### 问题修复

- 从 Card 和 Section 移除已弃用的 `isFullBleed` prop（#610、#598）
- Layout：`padding={0}` 视为等价于 `isFullBleed`（#595）
- SideNav：一致的内边距（#601）
- Nav：一致的间隙和标题文本尺寸（#616）

#### 重构

- Popover、HoverCard、Tooltip 移到顶层目录（#557）

---

# 0.0.3

#### 补丁变更

- 打包 StyleX 运行时——消费者不再需要 @stylexjs/stylex 作为 peer 依赖（#545）
- 在 @xds/core/tokens 添加稳定的 token 导出路径（#544）
- 用显式值替换 null 样式覆盖，添加 lint 规则（#547）
- 修复主题包通过 tsup 产生正确的 JS/TS 模块输出（#541）
- 同步 package.json 导出映射
- 添加 verify-exports CI 检查（#537）

---

# 0.0.2

#### 破坏性变更

- 基于 CSS 的主题化取代 StyleX 主题系统——`defineTheme()` API
- 所有组件上的 `className` 和 `style` props
- `padding` 和 `gap` 的数字间距刻度
- RSC 兼容的图标注册表（`registerIcons`/`getIcon`）
- React 19 ref prop 迁移
- 重命名：TopNavTitle → TopNavHeading，SideNavHeader → SideNavHeading，useXDSIcon → getIcon
- `gap="space4"` → `gap={4}`，`isFullBleed` → `padding={0}`
- Badge 点 → StatusDot

#### 升级

Codemods 可用于此版本的所有破坏性变更：

```sh

npx astryx upgrade --apply --to 0.0.2

```

先预览变更（dry run）：`npx astryx upgrade --to 0.0.2`
列出所有可用 codemod：`npx astryx upgrade --list`

包含 12 个 codemod：

- `rename-selector-items-to-options` — Selector `items` → `options`
- `unify-visibility-to-onOpenChange` — onHide/onClose/onShow/onToggle → `onOpenChange`
- `unify-uncontrolled-to-defaultX` — initialIsOpen/initialIsExpanded → defaultX
- `rename-banner-endButton-to-endContent` — Banner `endButton` → `endContent`
- `rename-form-tooltip-startIcon` — Form `tooltip` → `labelTooltip`，`startIcon` → `labelIcon`
- `rename-isShown-to-isOpen` — Dialog/Popover `isShown` → `isOpen`
- `rename-topnav-title-to-heading` — TopNav `title` → `heading`，TopNavTitle → TopNavHeading
- `rename-sidenav-header-to-heading` — SideNav header → heading，SideNavHeader → SideNavHeading
- `migrate-useXDSIcon-to-getIcon` — `useXDSIcon()` → `getIcon()`
- `migrate-gap-to-numeric` — `gap="space4"` → `gap={4}`
- `migrate-isFullBleed-to-padding` — `isFullBleed` → `padding={0}`
- `migrate-badge-dot-to-statusdot` — Badge `shape="dot"` → StatusDot

---

# 0.0.1

- 初始版本
