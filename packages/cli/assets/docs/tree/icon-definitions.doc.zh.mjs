// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for icon-definitions.doc.mjs.
export const docsZh = {
  "title": "图标定义",
  "summary": "所有图标定义：每个图标所代表的含义，以及各图标集为其图标映射的共享名称。",
  "slots": {
    "definitions": {
      "title": "定义"
    }
  },
  "blocks": [
    {
      "i": 0,
      "type": "prose",
      "text": "图标定义是图标所代表的一项含义，例如 `close` 或 `delete`。每个图标集都会在其数据文件的 `map` 中按定义注册图标，模板也是按定义编写的，因此切换图标集的项目会从新图标集中获得相同的定义。标记为 [built-in] 的内置定义是 Core 渲染的共享名称（即 `astryx docs icons` 中的语义图标名称）；每个图标集都必须映射这些定义，否则 `integration check` 会失败。其余定义是可选的：请映射你的图标库绘制的每一个定义。`map` 以定义的 camelCase 名称作为键，该名称显示在 id 之后（`eyeSlash`）；`experimental icon map` 和 `--pairs` 接受两种拼写。图标集可以添加自己的定义；在设置了 `experimental.iconSet` 的项目中，这些定义会连同提供它们的包一起列在这里。`astryx experimental icon <definition>` 会查找每个已安装图标集为该定义绘制的图标。图标定义属于实验性功能：它们可能在补丁版本中变更或移除。"
    }
  ],
  "sections": []
};
