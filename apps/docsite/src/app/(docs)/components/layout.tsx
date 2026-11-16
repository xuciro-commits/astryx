// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * Supplies metadata for the /components gallery index. That page is a client
 * component ('use client'), which cannot export metadata, so this server layout
 * provides it. The dynamic /components/[name] pages set their own per-component
 * metadata via generateMetadata, which overrides the defaults declared here.
 */

import type {Metadata} from 'next';
import {pageMetadata} from '../../../lib/pageMetadata';
import {SITE_NAME} from '../../../lib/siteConfig';

export const metadata: Metadata = {
  ...pageMetadata({
    title: '组件',
    description:
      '浏览 Astryx 的全部组件，每个变体、状态和模式都附带可直接复制的示例。',
    path: '/components',
  }),
  // Brand the per-component page titles (e.g. "Button · Astryx") so browser
  // tabs are distinguishable. A plain string title at this layout segment was
  // shadowing the root title template for the dynamic /components/[name] pages,
  // so re-declare the template here; `default` titles the gallery index.
  title: {
    default: '组件',
    template: `%s · ${SITE_NAME}`,
  },
};

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
