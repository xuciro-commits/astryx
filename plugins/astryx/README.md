# Astryx 智能体插件

一个由 Claude Code 和 Codex 插件共用的技能，用于告诉编码智能体：Astryx
可通过 `astryx` 命令使用、何时使用它，以及从哪里开始。它与全局安装写入
`~/.agents/skills/astryx/SKILL.md` 的指导相同。它不包含组件文档，也不指定
版本；这些由 CLI 回答。它由 `packages/cli/foundation/agent-docs/computer-agent-text.mjs` 中的
`renderComputerAgentText` 生成：`pnpm generate:agent-plugin-skill` 会重写它，而 `pnpm check:agent-plugin-skill`
（`check:repo` 的一部分）会在它漂移时失败。

Claude Code：

```sh
claude plugin marketplace add meta/astryx
claude plugin install astryx@astryx
```

Codex：将 `meta/astryx` 添加为 marketplace，并启用 `astryx@astryx`。

在 Claude Marketplace 上架是一个单独的手动步骤，位于
[Connectors and plugins](https://claude.com/marketplace/connectors-plugins)。只有能够
推送该上架信息的人才能操作；本仓库为其提供插件文件。
