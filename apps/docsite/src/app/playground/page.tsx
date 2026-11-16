// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {Metadata} from 'next';
import {Suspense} from 'react';
import {PlaygroundClient} from './PlaygroundClient';

export const metadata: Metadata = {
  title: 'Astryx 演练场',
  description: '用于 Astryx 组件的交互式代码演练场',
};

export default function PlaygroundPage() {
  return (
    <Suspense fallback={null}>
      <PlaygroundClient />
    </Suspense>
  );
}
