// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * Per-theme content for the /themes showcase (the theme-showcase template
 * rendered by ThemePackagePage).
 *
 * The template ships with a generic "Studio" store (minimalist watch, wireless
 * headphones, etc.) as its defaults. Some themes read better with bespoke
 * products that match their personality — e.g. Matcha shows a matcha café menu
 * instead of gadgets. This registry supplies those overrides; the template
 * falls back to its own neutral defaults for any theme not listed here.
 *
 * Keyed by theme slug (the `<slug>` in `@astryxdesign/theme-<slug>` / /themes?theme=<slug>).
 *
 * The photos load through the image optimizer. As PNG files they are 0.5 to
 * 1.2 MB each, and a theme switch loads six of them.
 */

import type {
  ProductSpec,
  InventoryRow,
} from '../../../../packages/cli/assets/templates/pages/theme-showcase/page';

import {optimizedImageUrl} from '../lib/optimizedImageUrl.mjs';

// A product card shows its photo up to about 400 CSS pixels wide. Most of the
// photos are 700 pixels wide, so this width keeps their pixel size.
export const SHOWCASE_PHOTO_WIDTH = 828;

function photo(path: string): string {
  return optimizedImageUrl(path, SHOWCASE_PHOTO_WIDTH);
}

export interface ThemeShowcaseContent {
  images: Record<string, string>;
  products: ProductSpec[];
  inventory: InventoryRow[];
}

// Matcha café — matcha-drink photos.
const MATCHA_IMAGES: Record<string, string> = {
  watch: photo('/images/matcha/preview-watch.png'),
  headphones: photo('/images/matcha/preview-headphones.png'),
  backpack: photo('/images/matcha/preview-backpack.png'),
  wallet: photo('/images/matcha/preview-wallet.png'),
  tumbler: photo('/images/matcha/preview-tumbler.png'),
  throw_: photo('/images/matcha/preview-throw.png'),
};

const MATCHA_CONTENT: ThemeShowcaseContent = {
  images: MATCHA_IMAGES,
  products: [
    {
      name: 'Matcha',
      description: '石磨仪式级抹茶搭配冰牛奶。',
      badge: '经典',
      badgeVariant: 'green',
    },
    {
      name: '草莓抹茶',
      description: '新鲜草莓果泥与明亮抹茶层层交融。',
      badge: '季节限定',
      badgeVariant: 'orange',
    },
    {
      name: '紫薯抹茶',
      description: '绵密紫薯与抹茶，甜香中带着泥土气息。',
      badge: '新品',
      badgeVariant: 'blue',
    },
  ],
  inventory: [
    {
      id: 'a',
      name: 'Matcha',
      meta: '仪式级，可选燕麦奶或全脂奶',
      available: 64,
      location: '吧台 1',
      tags: [{label: '经典', variant: 'green'}],
      imageKey: 'watch',
      thumbnailFallback: 'M',
      selected: false,
    },
    {
      id: 'b',
      name: '草莓抹茶',
      meta: '真实果泥，不加糖浆',
      available: 38,
      location: '吧台 2',
      tags: [{label: '季节限定', variant: 'orange'}],
      imageKey: 'headphones',
      thumbnailFallback: 'S',
      selected: true,
    },
    {
      id: 'c',
      name: '紫薯抹茶',
      meta: '紫薯奶油，双份浓缩',
      available: 51,
      location: '吧台 2',
      tags: [{label: '新品', variant: 'blue'}],
      imageKey: 'backpack',
      thumbnailFallback: 'U',
      selected: false,
    },
    {
      id: 'd',
      name: '香草抹茶',
      meta: '马达加斯加香草荚',
      available: 12,
      location: '吧台 3',
      tags: [{label: '顺滑', variant: 'yellow'}],
      imageKey: 'wallet',
      thumbnailFallback: 'V',
      selected: true,
    },
    {
      id: 'e',
      name: '榛果抹茶',
      meta: '烘烤榛果，顶部奶油',
      available: 27,
      location: '吧台 3',
      tags: [{label: '浓郁', variant: 'green'}],
      imageKey: 'tumbler',
      thumbnailFallback: 'H',
      selected: false,
    },
    {
      id: 'f',
      name: '抹茶摩卡',
      meta: '单一产地黑巧克力',
      available: 19,
      location: '吧台 4',
      tags: [{label: '大胆', variant: 'orange'}],
      imageKey: 'throw_',
      thumbnailFallback: 'M',
      selected: true,
    },
  ],
};

// Butter bakery — butter/breakfast photos. Only five Butter assets exist, so
// the croissant is reused for the sixth slot.
const BUTTER_IMAGES: Record<string, string> = {
  watch: photo('/images/butter/preview-watch.png'),
  headphones: photo('/images/butter/preview-headphones.png'),
  backpack: photo('/images/butter/preview-backpack.png'),
  wallet: photo('/images/butter/preview-wallet.png'),
  tumbler: photo('/images/butter/preview-tumbler.png'),
  throw_: photo('/images/butter/preview-throw.png'),
};

const BUTTER_CONTENT: ThemeShowcaseContent = {
  images: BUTTER_IMAGES,
  products: [
    {
      name: '黄油可颂',
      description: '层层酥脆，每天早晨烤至金黄。',
      badge: '新鲜',
      badgeVariant: 'yellow',
    },
    {
      name: '松饼',
      description: '高高叠起，搭配融化的黄油。',
      badge: '人气',
      badgeVariant: 'orange',
    },
    {
      name: '比利时华夫饼',
      description: '深格纹，正好盛住糖浆与黄油。',
      badge: '新品',
      badgeVariant: 'green',
    },
  ],
  inventory: [
    {
      id: 'a',
      name: '黄油可颂',
      meta: '纯黄油，27 层',
      available: 64,
      location: '柜台 1',
      tags: [{label: '新鲜', variant: 'yellow'}],
      imageKey: 'watch',
      thumbnailFallback: 'C',
      selected: false,
    },
    {
      id: 'b',
      name: '松饼',
      meta: '三层叠放',
      available: 38,
      location: '煎烤台',
      tags: [{label: '人气', variant: 'orange'}],
      imageKey: 'headphones',
      thumbnailFallback: 'P',
      selected: true,
    },
    {
      id: 'c',
      name: '比利时华夫饼',
      meta: '列日风格，珍珠糖',
      available: 51,
      location: '煎烤台',
      tags: [{label: '新品', variant: 'green'}],
      imageKey: 'backpack',
      thumbnailFallback: 'W',
      selected: false,
    },
    {
      id: 'd',
      name: '黄油吐司',
      meta: '酸种面包，厚切',
      available: 12,
      location: '柜台 2',
      tags: [{label: '经典', variant: 'yellow'}],
      imageKey: 'wallet',
      thumbnailFallback: 'T',
      selected: true,
    },
    {
      id: 'e',
      name: '发酵黄油',
      meta: '欧式，含盐',
      available: 27,
      location: '冷藏柜',
      tags: [{label: '常备', variant: 'orange'}],
      imageKey: 'tumbler',
      thumbnailFallback: 'B',
      selected: false,
    },
    {
      id: 'f',
      name: '杏仁可颂',
      meta: '杏仁奶油馅',
      available: 19,
      location: '柜台 1',
      tags: [{label: '限量', variant: 'green'}],
      imageKey: 'throw_',
      thumbnailFallback: 'A',
      selected: true,
    },
  ],
};

// Stone homeware — stoneware photos on stone plinths.
const STONE_IMAGES: Record<string, string> = {
  watch: photo('/images/stone/preview-watch.png'),
  headphones: photo('/images/stone/preview-headphones.png'),
  backpack: photo('/images/stone/preview-backpack.png'),
  wallet: photo('/images/stone/preview-wallet.png'),
  tumbler: photo('/images/stone/preview-tumbler.png'),
  throw_: photo('/images/stone/preview-throw.png'),
};

const STONE_CONTENT: ThemeShowcaseContent = {
  images: STONE_IMAGES,
  products: [
    {
      name: '斑点碗',
      description: '手工拉坯炻器，保留原始陶土圈足。',
      badge: '新品',
      badgeVariant: 'blue',
    },
    {
      name: '陶瓷杯',
      description: '日常杯碟套装，触感细腻。',
      badge: '人气',
      badgeVariant: 'green',
    },
    {
      name: '炻器盘',
      description: '反应釉哑光质感，柔和橄榄色调。',
      badge: '限量',
      badgeVariant: 'yellow',
    },
  ],
  inventory: [
    {
      id: 'a',
      name: '斑点碗',
      meta: '炻器，16 厘米',
      available: 64,
      location: '货架 1',
      tags: [{label: '新品', variant: 'blue'}],
      imageKey: 'watch',
      thumbnailFallback: 'B',
      selected: false,
    },
    {
      id: 'b',
      name: '陶瓷杯',
      meta: '杯 + 碟，8 盎司',
      available: 38,
      location: '货架 2',
      tags: [{label: '人气', variant: 'green'}],
      imageKey: 'headphones',
      thumbnailFallback: 'C',
      selected: true,
    },
    {
      id: 'c',
      name: '炻器盘',
      meta: '反应釉，22 厘米',
      available: 51,
      location: '货架 1',
      tags: [{label: '限量', variant: 'yellow'}],
      imageKey: 'backpack',
      thumbnailFallback: 'P',
      selected: false,
    },
    {
      id: 'd',
      name: '餐碗',
      meta: '双色，24 厘米',
      available: 15,
      location: '货架 3',
      tags: [{label: '餐具', variant: 'orange'}],
      imageKey: 'wallet',
      thumbnailFallback: 'S',
      selected: true,
    },
    {
      id: 'e',
      name: '炻器茶壶',
      meta: '哑光陶土，700 毫升',
      available: 27,
      location: '货架 2',
      tags: [{label: '厨房', variant: 'green'}],
      imageKey: 'tumbler',
      thumbnailFallback: 'T',
      selected: false,
    },
    {
      id: 'f',
      name: '小花瓶',
      meta: '橄榄釉，18 厘米',
      available: 19,
      location: '货架 1',
      tags: [{label: '小批量', variant: 'orange'}],
      imageKey: 'throw_',
      thumbnailFallback: 'V',
      selected: true,
    },
  ],
};

// Y2K trinkets — iridescent/holo objects.
const Y2K_IMAGES: Record<string, string> = {
  watch: photo('/images/y2k/preview-watch.png'),
  headphones: photo('/images/y2k/preview-headphones.png'),
  backpack: photo('/images/y2k/preview-backpack.png'),
  wallet: photo('/images/y2k/preview-wallet.png'),
  tumbler: photo('/images/y2k/preview-tumbler.png'),
  throw_: photo('/images/y2k/preview-throw.png'),
};

const Y2K_CONTENT: ThemeShowcaseContent = {
  images: Y2K_IMAGES,
  products: [
    {
      name: '手机',
      description: '虹彩翻盖机身，配彩虹屏幕。',
      badge: '复古',
      badgeVariant: 'blue',
    },
    {
      name: '夜光星星套装',
      description: '夜光星星，三件装。',
      badge: '人气',
      badgeVariant: 'green',
    },
    {
      name: '蝴蝶',
      description: '柔彩镜面闪光贴纸。',
      badge: '新品',
      badgeVariant: 'purple',
    },
  ],
  inventory: [
    {
      id: 'a',
      name: '手机',
      meta: '虹彩，彩虹液晶屏',
      available: 64,
      location: '收纳箱 1',
      tags: [{label: '复古', variant: 'blue'}],
      imageKey: 'watch',
      thumbnailFallback: 'P',
      selected: false,
    },
    {
      id: 'b',
      name: '夜光星星套装',
      meta: '夜光，3 件装',
      available: 38,
      location: '收纳箱 2',
      tags: [{label: '人气', variant: 'green'}],
      imageKey: 'headphones',
      thumbnailFallback: 'S',
      selected: true,
    },
    {
      id: 'c',
      name: '蝴蝶',
      meta: '贴纸，柔彩镜面',
      available: 51,
      location: '收纳箱 2',
      tags: [{label: '新品', variant: 'purple'}],
      imageKey: 'backpack',
      thumbnailFallback: 'B',
      selected: false,
    },
    {
      id: 'd',
      name: '蓬松爱心挂件',
      meta: '软弹，全息质感',
      available: 12,
      location: '收纳箱 3',
      tags: [{label: '经典', variant: 'pink'}],
      imageKey: 'wallet',
      thumbnailFallback: 'H',
      selected: true,
    },
    {
      id: 'e',
      name: '雏菊挂件',
      meta: '全息，夹扣式',
      available: 27,
      location: '收纳箱 3',
      tags: [{label: '可爱', variant: 'pink'}],
      imageKey: 'tumbler',
      thumbnailFallback: 'D',
      selected: false,
    },
    {
      id: 'f',
      name: '充气沙发',
      meta: '透明粉色，双人座',
      available: 19,
      location: '收纳箱 1',
      tags: [{label: '限量', variant: 'pink'}],
      imageKey: 'throw_',
      thumbnailFallback: 'C',
      selected: true,
    },
  ],
};

// Gothic botanicals — moody single-stem floral photos.
const GOTHIC_IMAGES: Record<string, string> = {
  watch: photo('/images/gothic/preview-watch.png'),
  headphones: photo('/images/gothic/preview-headphones.png'),
  backpack: photo('/images/gothic/preview-backpack.png'),
  wallet: photo('/images/gothic/preview-wallet.png'),
  tumbler: photo('/images/gothic/preview-tumbler.png'),
  throw_: photo('/images/gothic/preview-throw.png'),
};

const GOTHIC_CONTENT: ThemeShowcaseContent = {
  images: GOTHIC_IMAGES,
  products: [
    {
      name: '海冬青',
      description: '一支保留的蓟草，带着钢铁般冷冽的花。',
      badge: '新品',
      badgeVariant: 'blue',
    },
    {
      name: '花园玫瑰',
      description: '一朵蜜桃色玫瑰，每天清晨现剪。',
      badge: '人气',
      badgeVariant: 'red',
    },
    {
      name: '花毛茛',
      description: '柔和淡紫的层叠花瓣。',
      badge: '限量',
      badgeVariant: 'purple',
    },
  ],
  inventory: [
    {
      id: 'a',
      name: '海冬青',
      meta: '保留花材，单支',
      available: 64,
      location: '冷藏柜 1',
      tags: [{label: '新品', variant: 'blue'}],
      imageKey: 'watch',
      thumbnailFallback: 'S',
      selected: false,
    },
    {
      id: 'b',
      name: '花园玫瑰',
      meta: '现剪，蜜桃色',
      available: 38,
      location: '冷藏柜 2',
      tags: [{label: '人气', variant: 'red'}],
      imageKey: 'headphones',
      thumbnailFallback: 'R',
      selected: true,
    },
    {
      id: 'c',
      name: '花毛茛',
      meta: '现剪，淡紫色',
      available: 51,
      location: '冷藏柜 2',
      tags: [{label: '限量', variant: 'purple'}],
      imageKey: 'backpack',
      thumbnailFallback: 'R',
      selected: false,
    },
    {
      id: 'd',
      name: '珊瑚罂粟',
      meta: '现剪，单支',
      available: 15,
      location: '冷藏柜 3',
      tags: [{label: '季节限定', variant: 'orange'}],
      imageKey: 'wallet',
      thumbnailFallback: 'P',
      selected: true,
    },
    {
      id: 'e',
      name: '粉色郁金香',
      meta: '现剪，单支',
      available: 27,
      location: '冷藏柜 2',
      tags: [{label: '春季', variant: 'pink'}],
      imageKey: 'tumbler',
      thumbnailFallback: 'T',
      selected: false,
    },
    {
      id: 'f',
      name: '干黑种草果荚',
      meta: '保留花材，单枝',
      available: 19,
      location: '冷藏柜 1',
      tags: [{label: '小批量', variant: 'green'}],
      imageKey: 'throw_',
      thumbnailFallback: 'N',
      selected: true,
    },
  ],
};

const CONTENT_BY_THEME: Record<string, ThemeShowcaseContent> = {
  matcha: MATCHA_CONTENT,
  butter: BUTTER_CONTENT,
  stone: STONE_CONTENT,
  y2k: Y2K_CONTENT,
  gothic: GOTHIC_CONTENT,
};

/**
 * Every bespoke showcase photo. The /themes page loads them ahead of a theme
 * switch (themeShowcaseWarmup.ts).
 */
export const THEME_SHOWCASE_PHOTOS: ReadonlyArray<string> = Object.values(
  CONTENT_BY_THEME,
).flatMap(content => Object.values(content.images));

/**
 * Resolve bespoke showcase content for a theme slug, or `undefined` when the
 * theme has no override (the template then renders its neutral defaults).
 */
export function getThemeShowcaseContent(
  slug: string,
): ThemeShowcaseContent | undefined {
  return CONTENT_BY_THEME[slug];
}
