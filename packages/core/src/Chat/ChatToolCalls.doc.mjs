// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatToolCalls',
  displayName: 'Chat Tool Calls',
  group: 'Chat',
  category: 'Chat',

  keywords: ['tool', 'function', 'call', 'invocation', 'llm', 'agent', 'bash', 'edit', 'read', 'search', 'status', 'running', 'error', 'complete', 'diff', 'stats'],

  usage: {
    description:
      'ChatToolCalls displays tool or function call invocations from an LLM response. Pass an array of calls and the component handles the rest: a single call renders inline, while multiple calls collapse into a summary with the latest call visible at the surface. Use it anywhere an AI agent shows what actions it took.',
    bestPractices: [
      {guidance: true, description: 'Include a target string on every call so the user can see what the tool acted on: a file path, a shell command, or a search query.'},
      {guidance: true, description: 'Show a duration on completed calls so users can judge which tools are slow and understand why a response took time.'},
      {guidance: true, description: 'Provide a group label when the automatic count does not explain what the calls represent.'},
      {guidance: true, description: 'Provide resultDetail with a code block for calls that produce output (diffs for edits, terminal output for shell commands) so users can inspect results inline.'},
      {guidance: true, description: 'Set a unique key on each call item when streaming so React can animate additions without re-mounting completed rows.'},
      {guidance: false, description: "Don't omit the status field. Without it the call defaults to complete, which is misleading for calls that are still running or have failed."},
      {guidance: false, description: "Don't display tool calls outside a chat message context; they are designed to sit inside an assistant message, not as standalone UI."},
      {guidance: false, description: "Don't use custom wrappers around individual calls; the component handles single vs. grouped layout automatically based on the array length."},
    ],
    anatomy: [
      {name: 'Status icon', required: true, description: 'A themed semantic success/error icon, or a spinner while the call is pending or running.'},
      {name: 'Tool name', required: true, description: 'The function or tool name displayed in monospace: bash, edit, read, web_search, etc.'},
      {name: 'Node badge', required: false, description: 'A neutral pill badge showing which sandbox or environment ran the tool, like cli:remote-server or workspace.'},
      {name: 'Target label', required: false, description: 'The target of the action (a file path, command, or search query) shown after the tool name.'},
      {name: 'Diff stats', required: false, description: 'Green additions and red deletions counts for edit operations, displayed inline after the target.'},
      {name: 'Duration', required: false, description: 'Execution time shown on the trailing edge for completed calls.'},
      {name: 'Group header', required: false, description: 'A wrench icon with a call count, shown when multiple calls are present. Clicking toggles between the summary and the full list.'},
    ],
  },

  playground: {
    defaults: {
      calls: [
        {name: 'read_file', status: 'complete', target: 'Button.tsx', duration: '120ms'},
        {name: 'run_tests', status: 'complete', target: 'yarn test', duration: '1.2s', additions: 12, deletions: 3},
      ],
    },
  },

  props: [
    {
      name: 'calls',
      type: 'ChatToolCallItem[]',
      description:
        "Array of tool call data. Each item has name, status, target, duration, node, additions, deletions, stats, errorMessage, resultDetail, key, and data. status is one of 'pending', 'running', 'complete', or 'error' (defaults to 'complete').",
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Custom summary label shown for an expanded group. The translated call count is used when omitted.',
    },
    {
      name: 'isExpanded',
      type: 'boolean',
      description: 'Controlled expanded state for the group.',
    },
    {
      name: 'defaultIsExpanded',
      type: 'boolean',
      description:
        'Default expanded state when uncontrolled.',
      default: 'false',
    },
    {
      name: 'onExpandedChange',
      type: '(isExpanded: boolean) => void',
      description: 'Callback fired when the expanded state changes.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "ChatToolCalls 显示 LLM 响应中的工具或函数调用。传入调用数组，组件会处理其余部分：单个调用内联渲染，多个调用则折叠为摘要，并在表面显示最新的调用。可在 AI 代理展示其执行了哪些操作的任何位置使用。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为每个调用包含 `target` 字符串，让用户看到工具作用于什么：文件路径、shell 命令或搜索查询。"
      },
      {
        "guidance": true,
        "description": "在已完成的调用上显示时长，让用户判断哪些工具较慢，并理解为什么响应耗时较长。"
      },
      {
        "guidance": true,
        "description": "当自动计数无法说明这些调用代表什么时，提供组标签。"
      },
      {
        "guidance": true,
        "description": "为产生输出的调用提供 `resultDetail` 和代码块（编辑的差异、shell 命令的终端输出），让用户可以直接检查结果。"
      },
      {
        "guidance": true,
        "description": "在流式传输时，为每个调用项设置唯一的 `key`，以便 React 可以动画添加而无需重新挂载已完成的行。"
      },
      {
        "guidance": false,
        "description": "不要省略 `status` 字段。缺少它时调用默认为 `complete`，这对仍在运行或已失败的调用具有误导性。"
      },
      {
        "guidance": false,
        "description": "不要在聊天消息上下文之外显示工具调用；它们设计用于助手消息内部，而不是独立 UI。"
      },
      {
        "guidance": false,
        "description": "不要在单个调用外使用自定义包装器；组件会根据数组长度自动处理单个与分组布局。"
      }
    ],
    "anatomy": [
      {
        "name": "状态图标",
        "required": true,
        "description": "主题化的语义成功/错误图标，或在调用待处理或运行期间显示加载转圈。"
      },
      {
        "name": "工具名称",
        "required": true,
        "description": "以等宽字体显示的函数或工具名称：bash、edit、read、web_search 等。"
      },
      {
        "name": "节点徽章",
        "required": false,
        "description": "一个中性胶囊徽章，显示运行该工具的沙箱或环境，例如 cli:remote-server 或 workspace。"
      },
      {
        "name": "目标标签",
        "required": false,
        "description": "操作的目标（文件路径、命令或搜索查询），显示在工具名称之后。"
      },
      {
        "name": "差异统计",
        "required": false,
        "description": "编辑操作的绿色新增和红色删除计数，内联显示在目标之后。"
      },
      {
        "name": "时长",
        "required": false,
        "description": "已完成调用在尾部边缘显示的执行时间。"
      },
      {
        "name": "组标题",
        "required": false,
        "description": "带有调用计数的扳手图标，在存在多个调用时显示。点击可在摘要和完整列表之间切换。"
      }
    ]
  },
  "propDescriptions": {
    "calls": "工具调用数据的数组。每一项包含 `name`、`status`、`target`、`duration`、`node`、`additions`、`deletions`、`stats`、`errorMessage`、`resultDetail`、`key` 和 `data`。`status` 为 `'pending'`、`'running'`、`'complete'` 或 `'error'` 之一（默认为 `'complete'`）。",
    "label": "展开组时显示的自定义摘要标签。省略时使用翻译后的调用计数。",
    "isExpanded": "组的受控展开状态。",
    "defaultIsExpanded": "非受控时的默认展开状态。",
    "onExpandedChange": "展开状态变化时触发的回调。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值，而不是 `style={{}}` 这样的内联样式对象。"
  },
  "name": "ChatToolCalls",
  "displayName": "Chat Tool Calls"
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'tool/function call display from LLM response; single=inline, multiple=collapsible summary w/ latest at surface',
  usage: {
    description:
      'Displays tool or function call invocations from an LLM response. Single call renders inline; multiple calls collapse into a summary. Use inside assistant messages.',
    bestPractices: [
      {guidance: true, description: 'Include target on every call: file path, command, or search query.'},
      {guidance: true, description: 'Show duration on completed calls so users understand timing.'},
      {guidance: true, description: 'Provide group label when count alone is ambiguous.'},
      {guidance: true, description: 'Provide resultDetail with code blocks for calls that produce output.'},
      {guidance: true, description: 'Set unique key on each call item when streaming for stable animations.'},
      {guidance: false, description: "Don't omit status; defaults to complete, misleading for running/failed calls."},
      {guidance: false, description: "Don't display outside chat message context; designed for assistant messages."},
      {guidance: false, description: "Don't wrap individual calls; component handles single vs. grouped layout automatically."},
    ],
  },
  propDescriptions: {
    calls: 'tool call data array; name+status+target+duration+node+additions+deletions+resultDetail',
    label: 'custom summary label; auto from count if omitted',
    isExpanded: 'controlled expanded state',
    defaultIsExpanded: 'default expanded state (uncontrolled)',
    onExpandedChange: 'expanded state change callback',
  },
};
