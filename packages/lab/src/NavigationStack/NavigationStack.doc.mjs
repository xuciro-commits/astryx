// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'NavigationStack',
  displayName: 'Navigation Stack',
  category: 'Navigation',
  keywords: [
    'navigationstack',
    'navigation stack',
    'stack navigator',
    'drill down',
    'push',
    'pop',
    'back swipe',
    'navigation controller',
    'master detail',
    'mobile navigation',
  ],
  description:
    'Drill-down navigation for phone layouts: each screen pushes the next on top, and Back, the back swipe from the screen edge or from anywhere in the content returns to the previous one. Pushes, pops and the back swipe move like iOS: the new screen slides in from the trailing edge over the old one, which slides a third as far under a light dimming, and a released swipe finishes or springs back depending on how far and how fast it went. A push never waits for its animation: the new screen is usable as soon as it starts sliding in. With Reduce Motion the screens cross-fade instead. Experimental: lands in lab first.',
  components: [
    {
      name: 'NavigationStack',
      displayName: 'Navigation Stack',
      description:
        "The navigator. You own the path: pass the entries pushed on the root screen and update them in onPathChange. The stack renders the root screen and one screen per entry, the top one last, keeps covered screens and their scroll positions alive, and makes them inert. The bar shows the top screen's title, its end content and a round Back button with a chevron, named by the screen it returns to. A push moves focus to the new screen's title; a pop returns it to the control that pushed the screen. Under a finger the bar paints no background and no hairline, as iOS 26's does. Once a screen's content has moved 10px under the bar, a veil of the body colour fades in at the top of that screen. Each screen keeps its own veil through a push, a pop or a back swipe. With a mouse the bar keeps its surface and hairline.",
      props: [
        {
          name: 'root',
          type: 'ReactElement<NavigationScreenProps>',
          description:
            'The root screen, a NavigationScreen. It has no Back button.',
          required: true,
        },
        {
          name: 'path',
          type: 'ReadonlyArray<T>',
          description:
            'The entries pushed on the root, bottom first. Adding one at the end pushes its screen; removing the last pops it; removing several pops straight back to the new top.',
          required: true,
        },
        {
          name: 'onPathChange',
          type: '(path: T[]) => void',
          description:
            'Called with the new path when a screen pushes or pops (useNavigationStack), Back is pressed, or a back swipe is released past the point of no return.',
          required: true,
        },
        {
          name: 'renderScreen',
          type: '(entry: T, index: number) => ReactElement<NavigationScreenProps>',
          description: 'Renders the screen for an entry: a NavigationScreen.',
          required: true,
        },
        {
          name: 'getKey',
          type: '(entry: T, index: number) => string | number',
          description:
            "A stable key per entry, so a screen keeps its state while others are pushed on it. Defaults to the entry's position.",
        },
        {
          name: 'isInteractivePopEnabled',
          type: 'boolean',
          description:
            "Whether the back swipe pops: a sideways drag anywhere in the content, under any pointer (a finger, a pen or a mouse drag), and in a web app opened from the home screen also a finger's swipe from the leading screen edge. In a browser tab that edge stays the browser's own back swipe, and on Android the system back owns both screen edges.",
          default: 'true',
        },
        {
          name: 'label',
          type: 'string',
          description: 'Accessible name of the navigator region.',
        },
      ],
    },
    {
      name: 'NavigationScreen',
      displayName: 'Navigation Screen',
      description:
        "One screen of a NavigationStack: its title, the title Back shows on the screen pushed after it, its end content and its content. Returned by NavigationStack's root and renderScreen; it renders nothing on its own.",
      props: [
        {
          name: 'title',
          type: 'string',
          description:
            'Shown in the bar while the screen is on top, and read first when it arrives.',
          required: true,
        },
        {
          name: 'backTitle',
          type: 'string',
          description:
            'What Back reads on the screen pushed on top of this one. Defaults to title.',
        },
        {
          name: 'titleDisplayMode',
          type: "'large' | 'inline'",
          description:
            "How the title shows. 'large' puts it above the content in a large bold type, scrolling with the content; once it has scrolled under the bar, the bar shows the title instead. Use it for a top-level screen, as iOS does.",
          default: "'inline'",
        },
        {
          name: 'endContent',
          type: 'ReactNode',
          description:
            'Content at the end of the bar while the screen is on top.',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description:
            "The screen's content. It scrolls on its own and keeps its scroll position while covered.",
        },
      ],
    },
  ],
  usage: {
    description:
      'Use NavigationStack for hierarchical drill-down on phones: lists of settings, folders, a list and its detail. Call push from a row with useNavigationStack inside a screen.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Keep the path in the app's state (or the URL) and give entries stable keys, so screens keep their state as the stack changes.",
      },
      {
        guidance: true,
        description:
          "Push from the control the person activated (a row's onClick): focus returns to it when the screen is popped.",
      },
      {
        guidance: false,
        description:
          "Don't use it for top-level sections that people switch between; those are tabs or a sidebar, which keep each section's own stack.",
      },
    ],
  },
};

export const docsZh = {
  "name": "NavigationStack",
  "displayName": "Navigation Stack",
  "description": "面向手机布局的逐层下钻导航：每个屏幕将下一个屏幕压入顶部，Back、从屏幕边缘或内容任意位置开始的返回滑动都会回到上一个屏幕。压入、弹出和返回滑动的动作与 iOS 一致：新屏幕从尾随边缘滑入并覆盖旧屏幕，旧屏幕在轻微变暗下移动三分之一距离，释放的滑动会根据距离和速度完成或弹回。压入从不等待其动画：新屏幕一开始滑入即可使用。开启减少动态效果时，屏幕改为交叉淡化。实验性：先进入 lab。",
  "usage": {
    "description": "在手机上为层级式下钻使用 NavigationStack：设置列表、文件夹、列表及其详情。在屏幕内的行中通过 useNavigationStack 调用 push。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将路径保存在应用状态（或 URL）中，并为条目提供稳定键，使屏幕在栈变化时保持其状态。"
      },
      {
        "guidance": true,
        "description": "从用户激活的控件（行的 onClick）发起 push：屏幕弹出时焦点会返回该控件。"
      },
      {
        "guidance": false,
        "description": "不要将其用于人们在顶级区块之间切换；那些是选项卡或侧边栏，它们各自保留区块自己的栈。"
      }
    ]
  },
  "components": [
    {
      "name": "NavigationStack",
      "description": "导航器。你拥有路径：传入压入根屏幕的条目，并在 onPathChange 中更新它们。栈渲染根屏幕和每个条目对应的一个屏幕，最上面的最后渲染，保持被覆盖屏幕及其滚动位置存活，并使其惰性。栏显示顶部屏幕的标题、其 endContent 和一个带尖角符号的圆形 Back 按钮，按钮以它返回的屏幕命名。压入会将焦点移到新屏幕的标题；弹出会将其返回到压入该屏幕的控件。手指操作时，栏不绘制背景和细线，就像 iOS 26 那样。一旦屏幕内容在栏下移动 10px，该屏幕顶部会淡入一层正文颜色面纱。每个屏幕在压入、弹出或返回滑动期间都保留自己的面纱。使用鼠标时，栏保留其表面和细线。",
      "propDescriptions": {
        "root": "根屏幕，一个 NavigationScreen。它没有 Back 按钮。",
        "path": "压入根屏幕的条目，底部在前。在末尾添加一个会压入其屏幕；移除最后一个会弹出它；移除多个会直接弹回到新的顶部。",
        "onPathChange": "当屏幕压入或弹出（useNavigationStack）、按下 Back，或返回滑动在越过不可返回点后释放时，以新路径调用。",
        "renderScreen": "为条目渲染屏幕：一个 NavigationScreen。",
        "getKey": "每个条目的稳定键，使屏幕在其他屏幕压入其上时保持其状态。默认为条目的位置。",
        "isInteractivePopEnabled": "返回滑动是否弹出：在内容任意位置横向拖动，适用于任何指针（手指、笔或鼠标拖动），在从主屏幕打开的 Web 应用中，还包括手指从起始屏幕边缘的滑动。在浏览器标签页中，该边缘保留给浏览器自己的返回滑动；在 Android 上，系统返回拥有两个屏幕边缘。",
        "label": "导航器区域的无障碍名称。"
      }
    },
    {
      "name": "NavigationScreen",
      "description": "NavigationStack 的一个屏幕：其标题、Back 在压入其上的屏幕上显示的标题、其 endContent 及其内容。由 NavigationStack 的 root 和 renderScreen 返回；它本身不渲染任何内容。",
      "propDescriptions": {
        "title": "屏幕位于顶部时显示在栏中，并在其到达时首先被朗读。",
        "backTitle": "在压入此屏幕之上的屏幕上，Back 所朗读的内容。默认为 title。",
        "titleDisplayMode": "标题如何显示。'large' 将标题以大号粗体字放在内容上方，并随内容滚动；一旦标题滚动到栏下，栏会改为显示标题。像 iOS 那样，将其用于顶级屏幕。",
        "endContent": "屏幕位于顶部时栏末端的内容。",
        "children": "屏幕内容。它自行滚动，并在被覆盖时保持其滚动位置。"
      }
    }
  ]
};
