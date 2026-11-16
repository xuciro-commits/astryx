// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {Card} from '@astryxdesign/core/Card';
import {VStack} from '@astryxdesign/core/Layout';
import {Theme, useTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';
import {useThemeMode} from '../../app/providers';
import {AnchorHeading} from './AnchorHeading';
import {
  ColorTokenTable,
  SpacingTokenTable,
  SizeTokenTable,
  RadiusTokenTable,
  BorderTokenTable,
  ElevationTokenTable,
  DurationTokenTable,
  EasingTokenTable,
  TypographyTokenTable,
  FontFamilyTokenTable,
  FontWeightTokenTable,
  FontSizeTokenTable,
} from '../tokens';
import {ReferenceDocView} from './ReferenceDocView';
import {ContentBlockRenderer} from './ContentBlockRenderer';
import type {DocSection} from '../../generated/docsRegistry';
import type {TokenTableProps} from '../tokens';
import type {ComponentType} from 'react';

// ---------------------------------------------------------------------------
// Map section titles to token table components per topic
// ---------------------------------------------------------------------------

type TableComponent = ComponentType<TokenTableProps>;

const TOPIC_SECTION_OVERRIDES: Record<
  string,
  Record<string, TableComponent>
> = {
  tokens: {
    'Color Tokens': ColorTokenTable,
    '颜色令牌': ColorTokenTable,
    'Spacing Tokens': SpacingTokenTable,
    '间距令牌': SpacingTokenTable,
    'Size Tokens': SizeTokenTable,
    '尺寸令牌': SizeTokenTable,
    'Border Tokens': BorderTokenTable,
    '边框令牌': BorderTokenTable,
    'Radius Tokens': RadiusTokenTable,
    '圆角令牌': RadiusTokenTable,
    'Shadow Tokens': ElevationTokenTable,
    '阴影令牌': ElevationTokenTable,
    'Duration Tokens': DurationTokenTable,
    '时长令牌': DurationTokenTable,
    'Easing Tokens': EasingTokenTable,
    '缓动令牌': EasingTokenTable,
    'Font Family Tokens': FontFamilyTokenTable,
    '字体系列令牌': FontFamilyTokenTable,
    'Font Size Tokens': FontSizeTokenTable,
    '字号令牌': FontSizeTokenTable,
    'Font Weight Tokens': FontWeightTokenTable,
    '字重令牌': FontWeightTokenTable,
    'Type Scale Tokens': TypographyTokenTable,
    '字体刻度令牌': TypographyTokenTable,
  },
  color: {
    'Color Tokens': ColorTokenTable,
    '颜色令牌': ColorTokenTable,
  },
  elevation: {
    'Elevation Scale': ElevationTokenTable,
    '高度阶梯': ElevationTokenTable,
  },
  motion: {
    Duration: DurationTokenTable,
    Easing: EasingTokenTable,
    '时长': DurationTokenTable,
    '缓动': EasingTokenTable,
  },
  shape: {
    'Radius Scale': RadiusTokenTable,
    '半径阶梯': RadiusTokenTable,
  },
  spacing: {
    Scale: SpacingTokenTable,
    '刻度': SpacingTokenTable,
  },
  typography: {
    'Font Families': FontFamilyTokenTable,
    '字体家族': FontFamilyTokenTable,
    'Font Sizes': FontSizeTokenTable,
    '字号': FontSizeTokenTable,
    'Font Weights': FontWeightTokenTable,
    '字重': FontWeightTokenTable,
    'Type Scale': TypographyTokenTable,
    '字体比例': TypographyTokenTable,
  },
};

// ---------------------------------------------------------------------------
// TokenSection — renders prose blocks from the section + the table component
// ---------------------------------------------------------------------------

function TokenSection({
  section,
  id,
  Table,
  theme,
}: {
  section: DocSection;
  id: string;
  Table: TableComponent;
  theme: TokenTableProps['theme'];
}) {
  const {mode} = useThemeMode();
  const prose = section.content.filter(block => block.type !== 'table');
  return (
    <VStack gap={4}>
      <AnchorHeading id={id} level={3} type="display-3">
        {section.title}
      </AnchorHeading>
      {prose.map((block, i) => (
        <ContentBlockRenderer key={i} block={block} />
      ))}
      <Card>
        {/* Resolve swatches against the canonical neutralTheme (the base theme
            we ship), not the docsite's astryx brand skin. The resolver reads
            from ThemeContext, so the nested Theme is what redirects it. */}
        <Theme theme={neutralTheme} mode={mode}>
          <Table theme={theme} />
        </Theme>
      </Card>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// TokensDocView
// ---------------------------------------------------------------------------

export function TokensDocView({
  title,
  description,
  sections,
  topic,
}: {
  title: string;
  description: string;
  sections: DocSection[];
  topic: string;
}) {
  const theme = useTheme();
  const overrideMap = TOPIC_SECTION_OVERRIDES[topic] ?? {};

  const sectionOverrides: Record<
    string,
    (section: DocSection, id: string) => React.ReactNode
  > = {};
  for (const [sectionTitle, Table] of Object.entries(overrideMap)) {
    sectionOverrides[sectionTitle] = (section: DocSection, id: string) => (
      <TokenSection section={section} id={id} Table={Table} theme={theme} />
    );
  }

  return (
    <ReferenceDocView
      title={title}
      description={description}
      sections={sections}
      sectionOverrides={sectionOverrides}
    />
  );
}
