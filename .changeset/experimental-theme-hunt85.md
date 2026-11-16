---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme`：在 `preview add`、`preview remove` 或 `preview app` 期间停止（Ctrl-C、SIGTERM）现在会以“已停止”结束命令，并用一行说明更改处于什么状态，绝不再输出 `[ok]` 并以退出码 0 结束；编辑器在 60 秒上限处停止的浏览器会被说明为超时，Chrome 的启动警告不再被当作图片失败的原因，无法写入的主题文件夹会被指出，而不是浏览器；Chrome 获得自己的配置文件夹，无论运行如何结束都会被删除；针对 Next 不提供服务的应用内预览，`see` 给出的修复方案是可行的（`preview remove --path …`，然后 `preview add`，或在 pageExtensions 中加入 "tsx"）；从子文件夹运行 `preview app` 会打印一个文件夹并从那里 `cd` 执行工作，其规则和文档将项目文件夹命名为界限；从子文件夹运行时，图片说明会用完整路径命名每一张图片。

@josephfarina
