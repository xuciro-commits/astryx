// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * Page type: blog index
 * Grid of posts with horizontal type filters and no sidebar.
 * Data comes from the build-time generated blog registry.
 */

import type {Metadata} from 'next';
import {blogPosts, blogTypes} from '../../generated/blogRegistry';
import {BlogIndex} from '../../components/blog/BlogIndex';

const BLOG_TITLE = '博客';
const BLOG_DESCRIPTION =
  '记录 Astryx 的建设历程——版本发布、指南、故事，以及为人类与智能体设计系统的思考。';

// Next.js shallow-merges metadata: a child route that declares `openGraph`/
// `twitter` REPLACES the root object wholesale (images are not inherited), so
// we re-state the default social image here.
export const metadata: Metadata = {
  // Renders as "Blog · Astryx" via the root layout title template.
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  openGraph: {
    type: 'website',
    title: `${BLOG_TITLE} · Astryx`,
    description: BLOG_DESCRIPTION,
    url: '/blog',
    images: ['/images/Astryx-Banner.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BLOG_TITLE} · Astryx`,
    description: BLOG_DESCRIPTION,
    images: ['/images/Astryx-Banner.png'],
  },
};

export default function BlogPage() {
  return <BlogIndex posts={blogPosts} availableTypes={blogTypes} />;
}
