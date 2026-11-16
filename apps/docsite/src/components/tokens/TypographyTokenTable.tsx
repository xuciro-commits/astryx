// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import * as stylex from '@stylexjs/stylex';
import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Table, proportional, pixel} from '@astryxdesign/core/Table';
import type {TextType} from '@astryxdesign/core';
import type {HeadingLevel} from '@astryxdesign/core/Text';
import type {TokenTableProps} from './types';
import {resolveToken} from './helpers';

const styles = stylex.create({
  sample: {
    overflow: 'hidden',
    whiteSpace: 'nowrap' as const,
    textOverflow: 'ellipsis',
    display: 'block',
  },
});

const HEADING_LEVELS: HeadingLevel[] = [1, 2, 3, 4, 5, 6];
const TEXT_TYPES: TextType[] = [
  'display-1',
  'display-2',
  'display-3',
  'large',
  'body',
  'label',
  'code',
  'supporting',
];

const STYLE_LABEL: Record<string, string> = {
  'display-1': '展示 1',
  'display-2': '展示 2',
  'display-3': '展示 3',
  'heading-1': 'H1',
  'heading-2': 'H2',
  'heading-3': 'H3',
  'heading-4': 'H4',
  'heading-5': 'H5',
  'heading-6': 'H6',
  body: '正文',
  large: '大号',
  label: '标签',
  code: '代码',
  supporting: '辅助',
};

const SAMPLE_TEXT: Record<string, string> = {
  'display-1': '$12,450',
  'display-2': '98.7%',
  'display-3': '欢迎',
  'heading-1': '页面标题',
  'heading-2': '章节标题',
  'heading-3': '卡片标题',
  'heading-4': '小节标题',
  'heading-5': '分组标签',
  'heading-6': '上标文字',
  body: '用于阅读的正文文本',
  large: '引导段落',
  label: '表单标签',
  code: 'const x = 42;',
  supporting: '辅助文字',
};

const FONT_FAMILY_MAP: Record<string, string> = {
  'heading-1': '--font-family-heading',
  'heading-2': '--font-family-heading',
  'heading-3': '--font-family-heading',
  'heading-4': '--font-family-heading',
  'heading-5': '--font-family-heading',
  'heading-6': '--font-family-heading',
  body: '--font-family-body',
  large: '--font-family-body',
  label: '--font-family-body',
  supporting: '--font-family-body',
  code: '--font-family-code',
  'display-1': '--font-family-heading',
  'display-2': '--font-family-heading',
  'display-3': '--font-family-heading',
};

export function TypographyTokenTable({theme}: TokenTableProps) {
  const entries = [
    ...HEADING_LEVELS.map(level => `heading-${level}`),
    ...TEXT_TYPES,
  ];

  const data = entries.map(name => {
    const sizeToken = `--text-${name}-size`;
    const weightToken = `--text-${name}-weight`;
    const leadingToken = `--text-${name}-leading`;
    const fontFamilyToken = FONT_FAMILY_MAP[name] ?? '--font-family-body';

    const fontSize = resolveToken(theme, sizeToken);
    const fontWeight = resolveToken(theme, weightToken);
    const leading = resolveToken(theme, leadingToken);
    const fontFamily = resolveToken(theme, fontFamilyToken);

    const px =
      fontSize && leading
        ? Math.round(parseFloat(leading) * parseFloat(fontSize))
        : null;

    return {
      name,
      label: STYLE_LABEL[name] ?? name,
      sampleText: SAMPLE_TEXT[name] ?? name,
      fontFamily,
      fontSize,
      fontWeight,
      leading: px ? `${leading} (${px}px)` : leading,
    };
  });

  return (
    <Table
      data={data as Record<string, unknown>[]}
      columns={[
        {
          key: 'label',
          header: '示例',
          width: pixel(200),
          renderCell: (item: Record<string, unknown>) => (
            <span
              {...stylex.props(styles.sample)}
              style={{
                fontFamily: item.fontFamily as string,
                fontSize: item.fontSize as string,
                fontWeight: item.fontWeight as string,
                lineHeight: (item.leading as string)?.split(' ')[0],
              }}>
              {item.label as string}
            </span>
          ),
        },
        {
          key: 'tokens',
          header: '令牌',
          width: proportional(1, {minWidth: 280}),
          renderCell: (item: Record<string, unknown>) => (
            <VStack gap={1}>
              <Text type="code" color="secondary">
                {item.fontSize as string} ·{' '}
                {(item.fontFamily as string)?.split(',')[0]?.trim()}
              </Text>
              <Text type="code" color="secondary">
                {item.fontWeight as string} · {item.leading as string}
              </Text>
            </VStack>
          ),
        },
      ]}
      density="spacious"
      dividers="rows"
    />
  );
}
