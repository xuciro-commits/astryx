// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useImageMode',
  displayName: 'useImageMode',
  keywords: ['image', 'dark', 'light', 'mode', 'luminance', 'color', 'detect', 'theme', 'media', 'apca', 'contrast'],
  params: [
    {
      name: 'src',
      type: 'string | null | undefined',
      description: 'Image source URL to analyze. When null/undefined, returns the fallback value.',
      required: true,
    },
    {
      name: 'options',
      type: 'UseImageModeOptions',
      description: 'Optional configuration for image analysis.',
      required: false,
    },
    {
      name: 'options.region',
      type: 'ImageSampleRegion',
      description: 'Region to sample within the image using normalized 0-1 coordinates ({ x, y, width, height }). Defaults to the full image.',
      required: false,
    },
    {
      name: 'options.threshold',
      type: 'number',
      description: 'Luminance threshold for the dark/light split. Below = dark, above = light.',
      default: '0.5',
      required: false,
    },
    {
      name: 'options.fallback',
      type: "'dark' | 'light' | null",
      description: 'Fallback value while loading or on error.',
      default: 'null',
      required: false,
    },
  ],
  returns: [
    {
      name: 'mode',
      type: "'dark' | 'light' | null",
      description: "Detected luminance mode of the image. Returns null while loading or if src is null/undefined.",
    },
  ],
  usage: {
    description:
      'Detects whether an image is predominantly dark or light by sampling pixels via OffscreenCanvas. Uses APCA perceptual lightness (sRGB linearization + power curve) for accurate detection, especially on saturated colors. Runs entirely off the paint path: no visible canvas, no layout thrash. Supports regional sampling for detecting luminance where text overlays will appear. Returns null while loading and falls back gracefully on CORS or network errors.',
    bestPractices: [
      { guidance: true, description: 'Pair with MediaTheme to automatically adapt text color over dynamic background images.' },
      { guidance: true, description: 'Use the region option to sample only the area where text overlays will appear for more accurate results.' },
      { guidance: false, description: 'Use for images that change rapidly (e.g., video frames); each src change triggers a new fetch and analysis.' },
    ],
  },
  relatedComponents: ['MediaTheme'],
  relatedHooks: ['useMediaQuery'],
  importPath: '@astryxdesign/core/hooks',
  category: 'media',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Detects whether image is predominantly dark / light by sampling pixels via OffscreenCanvas. Uses APCA perceptual lightness (sRGB linearization + power curve) for accurate detection, esp. on saturated colors. Runs entirely off paint path: no visible canvas, no layout thrash. Supports regional sampling for detecting luminance where text overlays will appear. Returns null while loading + falls back gracefully on CORS / network errors.',
  paramDescriptions: {
    src: 'image source URL to analyze. When null/undefined, returns fallback value.',
    options: 'optional config for image analysis.',
    'options.region': 'region to sample within image using normalized 0-1 coordinates ({ x, y, width, height }). Defaults to full image.',
    'options.threshold': 'luminance threshold for dark/light split. Below = dark, above = light.',
    'options.fallback': 'fallback value while loading / on error.',
  },
  returnDescriptions: {
    mode: 'detected luminance mode of image. Returns null while loading / if src null/undefined.',
  },
  usage: {
    description:
      'Detects whether image is predominantly dark / light by sampling pixels via OffscreenCanvas. Uses APCA perceptual lightness (sRGB linearization + power curve) for accurate detection, esp. on saturated colors. Runs entirely off paint path: no visible canvas, no layout thrash. Supports regional sampling for detecting luminance where text overlays will appear. Returns null while loading + falls back gracefully on CORS / network errors.',
    bestPractices: [
      { guidance: true, description: 'Pair w/ MediaTheme to automatically adapt text color over dynamic background images.' },
      { guidance: true, description: 'Use region option to sample only area where text overlays will appear for more accurate results.' },
      { guidance: false, description: 'Use for images that change rapidly (e.g. video frames); each src change triggers new fetch + analysis.' },
    ],
  },
};

export const docsZh = {
  "name": "useImageMode",
  "usage": {
    "description": "通过 OffscreenCanvas 采样像素，检测图像整体偏暗还是偏亮。使用 APCA 感知亮度（sRGB 线性化 + 幂曲线）进行准确检测，尤其在饱和颜色上。完全在绘制路径之外运行：无可见画布、无布局抖动。支持区域采样，以检测文本叠加层将出现的区域的亮度。加载中返回 `null`，在 CORS 或网络错误时优雅回退。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "与 MediaTheme 搭配，在动态背景图像上自动调整文本颜色。"
      },
      {
        "guidance": true,
        "description": "使用 `region` 选项仅采样文本叠加层将出现的区域，以获得更准确的结果。"
      },
      {
        "guidance": false,
        "description": "不要用于快速变化的图像（例如视频帧）；每次 `src` 变化都会触发新的获取和分析。"
      }
    ]
  },
  "paramDescriptions": {
    "src": "要分析的图像源 URL。为 null/undefined 时，返回回退值。",
    "options": "图像分析的可选配置。",
    "options.region": "使用归一化 0-1 坐标（{ x, y, width, height }）在图像内采样的区域。默认为整张图像。",
    "options.threshold": "暗/亮划分的亮度阈值。低于 = 暗，高于 = 亮。",
    "options.fallback": "加载中或出错时的回退值。"
  },
  "returnDescriptions": {
    "mode": "检测到的图像亮度模式。加载中或 `src` 为 null/undefined 时返回 `null`。"
  }
};
