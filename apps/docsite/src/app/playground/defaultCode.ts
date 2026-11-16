// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file defaultCode.ts
 * @output The default TSX source shown in the playground's Monaco editor.
 * @position Playground — the initial example users see and edit.
 *
 * A minimal, self-contained Card example (header, body text, footer button)
 * that runs in the preview sandbox (see playground/preview/runner.ts).
 * Kept as a string because the playground edits/compiles it as user code rather
 * than importing it.
 */

export const DEFAULT_CODE = `import {Card} from '@astryxdesign/core/Card';
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  LayoutFooter,
  HStack,
} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';

export default function Example() {
  return (
    <Card width={400} padding={4}>
      <Layout
        header={
          <LayoutHeader hasDivider>
            <Heading level={2}>欢迎</Heading>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <Text type="body" color="secondary">
              在代码编辑器中试用组件，打开现成模板，
              并在主题编辑器中打造自己的主题——一切都在同一个地方。
            </Text>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack hAlign="end">
              <Button label="开始使用" variant="primary" />
            </HStack>
          </LayoutFooter>
        }
      />
    </Card>
  );
}`;
