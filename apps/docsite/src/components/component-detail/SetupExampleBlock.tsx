// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/**
 * @file Renders one setup example from a component doc as code only.
 * @input A SetupExampleEntry: a label and its code.
 * @output A titled card with a copyable code block and no live preview.
 * @position Used by ComponentDetailClient's Examples section.
 */

import {Card} from '@astryxdesign/core/Card';
import {Section} from '@astryxdesign/core/Section';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/Layout';
import {CodeExampleBlock} from '../CodeExampleBlock';
import type {SetupExampleEntry} from '../../generated/exampleRegistry';

interface SetupExampleBlockProps {
  entry: SetupExampleEntry;
}

/**
 * A setup example does not run on its own (an app setup file, a server route,
 * or a snippet that uses variables defined elsewhere), so it has no preview.
 */
export function SetupExampleBlock({entry}: SetupExampleBlockProps) {
  return (
    <Card padding={3}>
      <VStack gap={1}>
        <Text type="body" weight="medium">
          {entry.label}
        </Text>
        <Text type="supporting" color="secondary">
          安装代码。复制到你的应用中即可使用，它不会单独运行。
        </Text>
      </VStack>
      <Section variant="muted" padding={0} dividers={['top']}>
        <CodeExampleBlock
          code={entry.code}
          language="tsx"
          hasCopyButton
          container="section"
          width="100%"
        />
      </Section>
    </Card>
  );
}
