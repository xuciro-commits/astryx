# @astryxdesign/charts

Astryx charts——一个基于 d3 构建的配置模型数据可视化库。

```tsx
import {Chart, bar, line} from '@astryxdesign/charts';

<Chart data={data} xKey="month" series={[bar('revenue'), line('trend')]} />;
```

标记（Mark）是工厂函数（`bar`、`line`、`area`、`dot`、`band`、`candlestick`、`errorBar`、`referenceLine` 以及 WebGL 变体），返回通过 `series` 属性传入的配置对象。图表根节点拥有**唯一**一组 x/y 比例尺，每个标记、坐标轴和网格线都读取它，因此它们永远不会不一致。它直接使用 `@astryxdesign/core` 的主题令牌（StyleX 构建与 `@astryxdesign/lab` 相同）。

它**仅以 `@canary` dist-tag 发布**到 npm——目前从不会有稳定版（`latest`）发布。

> 注意：本包是实验性 `Chart`（原为 `ChartV2`）的后继者，后者曾位于 `@astryxdesign/lab`；该代码已迁移至此，d3 是直接依赖。（取代了 bootstrap 脚手架最初“对等引擎之上的薄封装”这一表述。）

## 状态

正在积极开发中。配置模型图表及其标记与 chrome 已就位；API 和视觉效果仍在完善。计划、设计研究、就绪审核和验证清单见 [`docs/`](https://github.com/meta/astryx/tree/main/packages/charts/docs)。

## 用法

在 monorepo 内（storybook/sandbox），导入通过 pnpm workspaces 解析：

```tsx
import {Chart, bar, line, ChartGrid, ChartAxis} from '@astryxdesign/charts';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/charts/charts.css';
```

### 在自己的项目中试用 charts（canary）

`@astryxdesign/charts` **仅**以 `@canary` dist-tag 发布，因此你必须显式请求该标签。没有 `latest` 版本可供安装。

```bash
npm install @astryxdesign/charts@canary @astryxdesign/core@canary
```

> Canary 构建跟随 `main` 的最新提交，最多每小时发布一次，也可按需发布（`0.x.y-canary.<sha>`）。任意两个版本之间都可能出现破坏——如果需要稳定性，请固定到确切版本。

## 为什么没有稳定版本？

`package.json` 保留 `"private": true` 以及 `"astryx": { "canaryOnly": true }` 标记。发布工作流的稳定版（`latest`）任务会跳过 private 和 `canaryOnly` 包，而 canary 任务仅在其临时 CI 检出中移除 `private`（绝不在 git 中移除）以发布 `@canary` 标签。已提交的 `private: true` 是 npm 的硬性保证，确保永远不会发生稳定版发布——**请勿移除它。**
