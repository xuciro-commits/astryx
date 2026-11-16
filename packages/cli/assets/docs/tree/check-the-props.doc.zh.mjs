// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for check-the-props.doc.mjs.
export const docsZh = {
  "title": "检查属性表",
  "description": "将每个属性表与组件的 TypeScript 属性进行比对，然后修正文档或代码。",
  "sections": [
    {
      "section": "Run the props check",
      "title": "运行属性检查",
      "content": [
        {
          "type": "prose",
          "text": "`doctor integration components` 会将组件文档中的每个属性表（包括隐藏文档和每个家族条目）与组件 TypeScript 声明的属性进行比对。更改组件或其文档后，请在包中运行它。"
        },
        null,
        null,
        {
          "type": "list",
          "items": [
            "文档自身的 `props` 描述其 `name` 所指的导出。在家族文档中，每个条目描述自己的导出。Hook 条目记录参数和返回值，因此不参与比对。",
            "它使用包中安装的 `typescript` 读取属性，并像 `tsc -p` 一样读取包的 `tsconfig.json`。它查找 TypeScript 的方式与文档检查相同，包括 TypeScript 7（{@link generic:check-your-docs}）。如果没有可用的 TypeScript，它会打印 `[skip] Props not compared` 及原因。",
            "发现的问题为警告，退出码保持为 0。发布前请阅读它们。使用 `--json` 时，它们位于 `data.propDrift.findings` 中。"
          ]
        }
      ]
    },
    {
      "section": "Fix each finding",
      "title": "修复每项发现",
      "content": [
        {
          "type": "prose",
          "text": "每个发现的 `kind` 说明差异所在。修正文档；如果文档是对的，则修正代码。"
        },
        {
          "type": "table",
          "headers": [
            "类型",
            "含义",
            "修复"
          ],
          "rows": [
            [
              "`not_in_code`",
              "文档列出了一个组件属性中不存在的属性",
              "从文档中删除它，或将其添加到代码中。索引签名接受的名称（例如 `data-*`）视为存在"
            ],
            [
              "`not_in_doc`",
              "你的包声明了文档未列出的属性，或用映射类型构建了一个属性，例如 `Partial<Record<'sm' | 'md', string>>`",
              "为它编写文档。来自 React、DOM 或其他包的属性不会被要求，由其他包定义键的属性（`keyof CSSProperties`，无论是否通过别名）、`className`、`style`、`xstyle`、`data-testid`、`ref`、`key`，以及 JSDoc 中带有 `@internal` 的属性也不会被要求。已弃用的属性仍然是属性：在移除之前请为它编写文档。如果映射类型从检查无法追踪的键（例如模板字面量）构建属性，则会改列在 `[info] Props not checked for a doc entry` 下"
            ],
            [
              "`required_mismatch`",
              "`required` 与代码不一致",
              "仅当每个调用方都必须传入该属性时，才设置 `required: true`。由 `defaultProps` 填充的属性视为可选（对 JSX 调用方而言如此），联合类型中只有部分成员要求的属性也视为可选，因为调用方可以省略它：请在描述中说明哪些变体需要它。一个条目若命名了多个属性（`value / onChange`），则对每个属性作出相同声明：若它们不同，请分别为它们建立条目"
            ],
            [
              "`type_mismatch`",
              "记录的 `type` 与代码中的不同，且双方都能精确读取",
              "从源码复制类型，或修正代码。下一节说明会判定哪些类型"
            ],
            [
              "`default_mismatch`",
              "记录的 `default` 与组件在属性解构中写出的字面量默认值不同，例如 `size = 'md'`",
              "从源码复制默认值，并以代码形式引用：`default: \"'md'\"`。引号和空格会被忽略，任何一方不是字面量的默认值（常量、调用、文字描述）都不参与比对"
            ]
          ]
        }
      ]
    },
    {
      "section": "Write types the check can judge",
      "title": "编写检查可判定的类型",
      "content": [
        {
          "type": "prose",
          "text": "对于包中声明的属性，检查还会比对记录的 `type`，但仅在双方都能精确读取时才比对。它从不猜测，因此无法判定的类型会被列出，而不是被报告。它需要 TypeScript 4.8 或更高版本：版本较旧时会打印 `[skip] Prop types not judged`，并且不判定任何类型。"
        },
        null,
        {
          "type": "list",
          "items": [
            "按源码的写法书写类型，例如 `ReactNode[]` 或 `(index: number) => void`。参数名、成员顺序、引号和空白可以不同。写了 `readonly` 的文本必须完全匹配（包括参数名），只有空白可以不同。`React.X` 指的是声明该属性处的 React 自身的 `X`，因此只有当该名称属于 React 时才能匹配裸 `X`：`React.KeyboardEvent` 不是 DOM 的 `KeyboardEvent`。",
            "类型应按声明该属性的文件中的名称书写，因此在该文件中重命名的导入（`Item as BaseItem`）应按该文件的写法书写。字段（`cfg.level`）采用其属性所在文件的命名，即使字段自身的类型声明在另一个文件中也是如此。",
            "以其他方式书写的类型，只有在双方都由精确部件构成时才会判定：`string`、`number` 等原始类型，字符串、数字和布尔字面量，字符串枚举成员，上述类型的数组和联合，以及代表它们的类型名。联合成员可以按任意顺序出现，被另一个成员覆盖的成员不增加任何内容，因为 TypeScript 在那里会放行：`undefined` 与 `void` 并列，或 `string[]` 与 `(string | number)[]` 并列。",
            "可变数组类型可以匹配只读类型，因为调用方可以传入它。为可变数组记录只读类型则是错误匹配。",
            "当属性的各个变体为同一字段提供不同类型时（例如 `{value: string} | {value: number}`），请记录每个变体的类型（`string | number`）。只列出了部分变体的类型：该属性的变体为这个字段提供了不同类型。变体类型超过六种时，其他任何类型也会被列出。",
            "要命名别名并展示其取值，请写 `AcmeSize = 'sm' | 'md'` 或 `AcmeSize ('sm' | 'md')`。两个部分都必须匹配。",
            "可选属性的 `undefined` 在双方都会被忽略。使用 `exactOptionalPropertyTypes` 时，仅当代码声明它时，文档才显示 `undefined`。",
            "其他任何类型都不参与比对，例如对象、元组、带参数的泛型、`keyof`、交叉类型，或以其他方式书写的映射类型或条件类型。"
          ]
        },
        {
          "type": "prose",
          "text": "检查会打印它判定了多少个记录的类型，然后按原因列出其余类型：不是检查能精确判定的形式、属性变体为字段提供了不同类型、标准属性，或在包外声明的属性。使用 `--json` 时，它们位于 `data.propDrift.typesNotCompared` 中。"
        },
        null
      ]
    },
    {
      "section": "When a component is not compared",
      "title": "组件未被比较时",
      "content": [
        {
          "type": "prose",
          "text": "当检查无法精确读取组件的属性时，它会在 `[info] Props not compared` 下列出该组件及原因，而不是报告可能错误的发现。"
        },
        null,
        {
          "type": "table",
          "headers": [
            "原因",
            "修复"
          ],
          "rows": [
            [
              "它依赖编译器无法解析的包或文件",
              "安装该包的依赖，然后再次运行检查"
            ],
            [
              "它依赖编译器无法推断的类型",
              "先让类型通过 `{@pm exec tsc --noEmit}` 编译，然后再次运行检查"
            ],
            [
              "包的 TypeScript 配置有错误",
              "修正 `tsconfig.json`，直到 `{@pm exec tsc -p .}` 能读取它"
            ],
            [
              "其属性被标注为 `any`",
              "为组件提供属性类型"
            ],
            [
              "部分属性名来自类型参数",
              "无需修复：渲染由调用方选择元素的组件，其属性只在被使用的地方才能确定"
            ],
            [
              "文件中没有文档 `name` 指定的导出",
              "更改 `name` 或导出，使二者一致"
            ]
          ]
        }
      ]
    }
  ]
};
