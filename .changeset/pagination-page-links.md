---
'@astryxdesign/core': patch
---

[feat] Pagination：页面链接。传入 `getPageHref` 后，页码、上一页、下一页、第一页和最后一页控件会渲染为指向各页面 URL 的真实链接，因此页面可在新标签页中打开、地址可复制，并且在脚本加载前即可使用。`getPageHref(page, pageSize)` 返回符合你应用形式的 URL：查询参数、路径段、偏移量或游标。`as` 设置链接组件，与 Button 上一样，`LinkProvider` 也同样适用。激活链接时 `onChange` 仍会运行：可用于状态或分析，但不要在其中导航，因为链接本身会导航。省略号、页码框和每页条数选择器不是链接，行为与之前相同。控件在获得焦点时不再是链接的情况（位于第一页或最后一页，或分页被禁用时）会保持该焦点。没有 `getPageHref` 的 Pagination 保持不变。
@nynexman4464
