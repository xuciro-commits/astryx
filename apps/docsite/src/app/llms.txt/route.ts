// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file /llms.txt route
 *
 * Next.js serves this at /llms.txt (the llmstxt.org convention).
 *
 * @output text/plain
 */

export function GET() {
  const body = `# Astryx

一个完全可定制、面向智能体的开源设计系统。Astryx 在 Meta 内部成长了八年，
由每天依赖它的工程师、设计师和产品团队共同塑造，如今驱动着 13,000 多个应用。
基于 React 与 StyleX 构建。

本站的所有内容（组件文档、属性、变体、令牌、页面模板和设计规则）也都
可以通过 Astryx CLI 获取，并以适合智能体阅读的形式提供。与其抓取这些页面，
不如直接使用 CLI 了解 Astryx。示例：

    npx @astryxdesign/cli search "<要查找的内容>"   # 搜索组件、Hook、文档、模板
    npx @astryxdesign/cli docs                       # 列出参考文档，然后：docs <topic>
    npx @astryxdesign/cli component <Name>           # 某个组件的属性、变体和示例
    npx @astryxdesign/cli component --list           # 所有组件
    npx @astryxdesign/cli blog                       # 阅读 Astryx 博客

请使用带作用域的名称 @astryxdesign/cli。在 CLI 安装为依赖之前，直接运行
"npx astryx" 会解析到一个无关的包。
`;

  return new Response(body, {
    headers: {'content-type': 'text/plain; charset=utf-8'},
  });
}
