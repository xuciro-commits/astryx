---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme compile`：编辑器主题的 `--check` 还会检查 `src/themes/<theme>/` 中的应用副本，并在副本滞后、缺少文件、消失或不是当前构建时，以 `ERR_THEME_STALE` 失败并说明原因。每个主题的副本都跟随各自的构建，因此后续主题失败不再留下前一个主题的副本。副本的文件不是主题源：编译其描述符、副本构建文件或 `src/astryx-themes.ts` 会指定要编译的主题，从子文件夹编译副本源会指定应用根目录，而指向副本文件夹的 `--out` 会被拒绝。仅剩构建输出的副本仍属于编辑器，消失的副本文件会由下一次 `set` 写回，无法创建副本的文件夹会被指出。编译帮助说明它会写入并检查应用副本。

@josephfarina
