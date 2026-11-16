// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for export-template-assets.doc.mjs.
export const docsZh = {
  "title": "导出模板和资源",
  "description": "确保发布的包包含并公开被复制模板导入的所有内容。",
  "sections": [
    {
      "section": "Keep the generated template export",
      "title": "保留生成的模板导出",
      "content": [
        {
          "type": "prose",
          "text": "`integration verify` 会通过不带文件扩展名的公开包路径（例如 `./templates/acme-dashboard`）解析每个模板，并在该路径缺失时失败。"
        },
        {
          "type": "code",
          "label": "package.json"
        },
        {
          "type": "list",
          "items": [
            "当 `package.json` 有 `exports` 映射时，`integration add` 会写入此条目（{@link generic:start-a-template}）。没有映射时它不会写入任何内容，因为创建映射会使现有的深层导入变为私有。请自行添加映射，然后添加条目。",
            "公开路径保持不带 `.tsx`。只有目标文件以 `.tsx` 结尾。",
            "不要将该条目指向会丢失模板默认导出的桶文件（barrel file）。"
          ]
        }
      ]
    },
    {
      "section": "Export package-owned support files",
      "title": "导出包自有的支持文件",
      "content": [
        {
          "type": "prose",
          "text": "为被复制源码导入的每个包自有组件、辅助工具、图标或样式表添加公开路径。仅实现使用的文件保持私有。"
        },
        {
          "type": "code",
          "label": "相关的 package.json 条目"
        },
        {
          "type": "prose",
          "text": "如果区块还要作为实时 `.tsx` 预览直接加载，请添加保留扩展名的模式，例如 `\"./templates/*.tsx\": \"./templates/*.tsx\"`。同时保留生成的条目；`integration verify` 会通过它解析模板。"
        }
      ]
    },
    {
      "section": "Include every file",
      "title": "包含每个文件",
      "content": [
        {
          "type": "prose",
          "text": "导出可能指向 npm 遗漏的文件。当 `package.json#files` 存在时，请列出集成清单、templates 目录以及被复制文件依赖的每个目录。"
        },
        {
          "type": "code",
          "label": "package.json"
        },
        {
          "type": "list",
          "items": [
            "当 `files` 列表已存在时，`integration add` 会追加清单和 templates 目录。其他目录请自行添加。",
            "如果 `package.json` 设置了 `sideEffects`，请像上面那样将 CSS 包含在内，以便打包器保留有副作用的样式表导入。",
            "运行 `{@pm-only npm \"the tarball the registry receives\" pack --dry-run}`，读取真实的文件列表，而不是根据工作区进行推断。"
          ]
        }
      ]
    },
    {
      "section": "Declare what the copied file imports",
      "title": "声明被复制文件的导入",
      "content": [
        {
          "type": "prose",
          "text": "应用会导入被复制的文件，因此应用必须安装这些文件所导入的每个包。按 {@link generic:versioning} 中的说明声明 Astryx peer。对于其他包："
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "用途"
          ],
          "rows": [
            [
              "`peerDependencies`",
              "被复制源码导入的库，例如图标库。也要将它们列入 `devDependencies`，以便包本身能够构建。"
            ],
            [
              "`dependencies`",
              "仅由包自有模块使用的运行时包，它们应随集成一起分发"
            ],
            [
              "`devDependencies`",
              "构建和测试集成本身所需的一切"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "只使用你测试过的版本范围。仅因工作区提升而解析到的包不算已声明。"
        }
      ]
    }
  ]
};
