// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file useTableInfiniteScroll.doc.mjs
 * @input Controlled Table loading configuration
 * @output Consumer documentation for useTableInfiniteScroll
 * @position Discoverable Table plugin documentation
 */

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'useTableInfiniteScroll',
  displayName: 'useTableInfiniteScroll',
  subComponentOf: 'Table',
  description:
    'Incrementally load flat Table data with one shared automatic/manual request lifecycle. Returns a stable TablePlugin<T>. A localized Load more Button stays available while hasMore is true; IntersectionObserver adds automatic loading when the end sentinel is visible. The Button remains mounted and focusable while busy and owns the loading announcement.',
  usage: {
    description:
      'Call useTableInfiniteScroll<T>({hasMore, isLoading, onLoadMore}) and pass the result to <Table plugins={{infiniteScroll: plugin}} />. Keep accumulated rows in your own state. onLoadMore must return a Promise<void> that settles when the batch work completes. A fulfilled request finishes after settlement and a subsequent committed isLoading=false; a true loading phase is not required. Visible short batches can automatically request again in a later task, so update hasMore when the source is exhausted. A resolved request that appends no rows must not incorrectly claim endless more data. Throws, rejections and invalid non-Promise results pause automatic loading; the manual Button can retry once controlled loading is false. The hook does not render product errors or cancel transport. For a new dataset, key and remount the component owning both the hook and its Table, not only the Table child; prevent stale responses from committing caller data yourself. Children mode and unsupported row models do not load and emit a deduplicated development warning. Body modifiers must declare compatible rowModel: flat. Observation uses the Table scroll area while the Table windows its rows, and the browser viewport otherwise, with zero look-ahead and no ancestor discovery. Without IntersectionObserver, the same manual command works.',
  },
  props: [
    {
      name: 'hasMore',
      type: 'boolean',
      required: true,
      description:
        'Whether the source can provide another batch. False removes loading chrome and observation. Only a focused removed command hands focus to the shared Table viewport, without scrolling.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      required: true,
      description:
        'Caller-controlled loading. Blocks requests while true. The outstanding request latch also keeps the Button busy through Promise settlement and the next false commit.',
    },
    {
      name: 'onLoadMore',
      type: '() => Promise<void>',
      required: true,
      description:
        'Fetch and append the next batch, returning its completion Promise. Rows, cursors, errors and stale-response suppression stay caller-owned. Callback identity changes do not reset pending work or failure pause.',
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Stable flat-data TablePlugin<T>. Three controlled fields: hasMore, isLoading, onLoadMore():Promise<void>. Always-available manual Button; visible sentinel adds automatic loads. Shared latch and post-settlement false commit gate completion. Failure pauses automatic loads; manual retry recovers. Reset by remounting the hook owner and Table together.',
  propDescriptions: {
    hasMore:
      'Allow another batch. False removes observation/chrome and hands off only owned Button focus.',
    isLoading:
      'Controlled busy flag; pending Promise and its completion commit also block requests.',
    onLoadMore:
      'Return batch completion Promise; append rows and suppress stale product responses yourself.',
  },
};

export const docsZh = {
  "name": "useTableInfiniteScroll",
  "description": "以共享的自动/手动请求生命周期增量加载扁平 Table 数据。返回稳定的 TablePlugin<T>。当 hasMore 为 true 时，本地化的“加载更多”按钮保持可用；当末尾哨兵可见时，IntersectionObserver 会增加自动加载。忙碌时按钮保持挂载且可聚焦，并负责加载公告。",
  "usage": {
    "description": "调用 useTableInfiniteScroll<T>({hasMore, isLoading, onLoadMore})，并将结果传给 <Table plugins={{infiniteScroll: plugin}} />。将累积的行保留在你自己的状态中。onLoadMore 必须返回一个 Promise<void>，在批次工作完成时落定。已完成的请求会在落定之后、随后提交 isLoading=false 时结束；不需要真正的加载阶段。可见的短批次可能会在后续任务中自动再次请求，因此当数据源耗尽时更新 hasMore。已解决但不追加任何行的请求不得错误地声称还有无限更多数据。抛出异常、拒绝和无效的非 Promise 结果会暂停自动加载；一旦受控加载为 false，手动按钮可以重试。该 Hook 不渲染产品错误，也不取消传输。对于新数据集，请为同时拥有该 Hook 及其 Table 的组件设置 key 并重新挂载，而不仅仅是 Table 子元素；请自行防止过期响应提交调用方数据。Children 模式和不支持的行模型不会加载，并会发出去重的开发警告。正文修饰符必须声明兼容的 rowModel: flat。当 Table 窗口化其行时，观察使用 Table 滚动区域，否则使用浏览器视口，零前瞻且不发现祖先。没有 IntersectionObserver 时，相同的手动命令仍然有效。"
  },
  "propDescriptions": {
    "hasMore": "数据源是否可以提供另一批次。False 会移除加载界面和观察。只有已聚焦的已移除命令会将焦点交给共享的 Table 视口，且不会滚动。",
    "isLoading": "调用方控制的加载状态。为 true 时阻止请求。未完成请求的锁存还会让按钮在 Promise 落定和下一次 false 提交期间保持忙碌。",
    "onLoadMore": "获取并追加下一批次，返回其完成 Promise。行、游标、错误和过期响应抑制仍由调用方负责。回调标识变化不会重置待处理工作或失败暂停。"
  }
};
