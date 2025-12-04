// [GIT_VERSION: FINAL_V11_GIT_FORCE]
import { Project } from './types';

// CONFIGURATION: 7 Projects Total
// 2 UI/UX, 2 WEB, 1 VISUAL, 1 PRACTICE, 1 ILLUSTRATION

export const INITIAL_PROJECTS: Project[] = [
  // --- 1. ClackyAI ---
  {
    id: 'clackyai-ui',
    category: 'UI/UX',
    title: 'ClackyAI',
    subtitle: 'AI 编程助手',
    description: '一个全面的 0-1 产品架构，专为 AI 驱动的编程助手打造。该项目涉及深入的用户研究、复杂 AI 工作流的交互设计，以及用户体验架构的定义。',
    tags: ['AI 编码助手 SaaS', '0-1产品体系化搭建', 'AI 交互设计', '用户体验架构'],
    role: 'UI/UX 设计师',
    coverImage: 'https://i.imgur.com/Mxzz4cv.jpeg',
    detailImages: [
      'https://i.imgur.com/geEKXSq.jpeg',
      'https://i.imgur.com/0hAZzdc.jpeg',
      'https://i.imgur.com/MIf3msu.jpeg',
      'https://i.imgur.com/2Izf9qe.jpeg',
      'https://i.imgur.com/oYxx5MJ.jpeg',
      'https://i.imgur.com/hJ0sPRD.jpeg',
      'https://i.imgur.com/h3xh3W2.jpeg',
      'https://i.imgur.com/93jGCrl.jpeg',
      'https://i.imgur.com/tSpD6k3.jpeg',
      'https://i.imgur.com/4jePuNd.jpeg',
      'https://i.imgur.com/t5oEE2Y.jpeg',
      'https://i.imgur.com/aKerCiK.jpeg',
      'https://i.imgur.com/xK7jvBQ.jpeg',
      'https://i.imgur.com/rxSEI6N.jpeg',
      'https://i.imgur.com/MgMF67d.jpeg',
      'https://i.imgur.com/vqaGbdw.jpeg',
    ],
    year: '2025'
  },
  
  // --- 2. ClackyAI Official ---
  {
    id: 'clackyai-web',
    category: 'WEB',
    title: 'ClackyAI Official',
    subtitle: '品牌官网',
    description: 'ClackyAI 品牌的战略视觉构建。专注于响应式设计和高保真交互原型，以展示 AI 工具的强大功能。',
    tags: ['品牌视觉构建', '设计策略主导', '交互原型演绎', '响应式设计'],
    role: 'UI/UX 设计师',
    coverImage: 'https://i.imgur.com/Lc6CKPy.jpeg',
    detailImages: [
      'https://i.imgur.com/Niws2Ns.jpeg',
      'https://i.imgur.com/vAFwkeD.jpeg',
      'https://i.imgur.com/rLCtv45.jpeg',
      'https://i.imgur.com/jPxx1qk.jpeg',
      'https://i.imgur.com/2cpcNMf.jpeg',
      'https://i.imgur.com/gAzw7NT.jpeg',
      'https://i.imgur.com/BjZ3pQ3.jpeg',
      'https://i.imgur.com/9mVBuA5.jpeg',
      'https://i.imgur.com/MG5wWtu.jpeg',
      'https://i.imgur.com/DQW6MoX.jpeg',
      'https://i.imgur.com/6OIojki.jpeg',
    ],
    year: '2025'
  },
  
  // --- 3. ShowMeBug ---
  {
    id: 'showmebug-ui',
    category: 'UI/UX',
    title: 'ShowMeBug',
    subtitle: '技术评估平台',
    description: 'B 端产品的体验重构。实施了双核设计系统，并处理了实时协作编程面试的复杂交互。',
    tags: ['B端产品体验体系', '复杂交互', '双核设计系统', '体验重构'],
    role: 'UI/UX 设计师',
    coverImage: 'https://i.imgur.com/Xpyg30N.jpeg',
    detailImages: [
      'https://i.imgur.com/FtY4pxk.jpeg',
      'https://i.imgur.com/uqsAyxG.jpeg',
      'https://i.imgur.com/X9Cze2Q.jpeg',
      'https://i.imgur.com/ajaDgjN.jpeg',
      'https://i.imgur.com/09P9YXr.jpeg',
      'https://i.imgur.com/GB4pFFr.jpeg',
      'https://i.imgur.com/inFYwhC.jpeg',
      'https://i.imgur.com/hXeP403.jpeg',
      'https://i.imgur.com/pxvgKje.jpeg',
      'https://i.imgur.com/MOw8qxQ.jpeg',
      'https://i.imgur.com/kY8KbdI.jpeg',
      'https://i.imgur.com/OdDsYag.jpeg',
    ],
    year: '2025'
  },
  
  // --- 4. ShowMeBug Official ---
  {
    id: 'showmebug-web',
    category: 'WEB',
    title: 'ShowMeBug Official',
    subtitle: '企业门户更新',
    description: '完整的品牌更新和官网重塑。以增长指标为驱动，专注于面向企业客户的场景化价值传递。',
    tags: ['官网重塑', '品牌升级', '增长导向设计', '品牌焕新', '场景化价值传递'],
    role: 'UI/UX 设计师',
    coverImage: 'https://i.imgur.com/AL1MJk1.jpeg',
    detailImages: [
      'https://i.imgur.com/mU1cNr3.jpeg',
      'https://i.imgur.com/aoWWEcq.jpeg',
      'https://i.imgur.com/OF1SUP7.jpeg',
      'https://i.imgur.com/m9ouGWg.jpeg',
      'https://i.imgur.com/aRbXnLJ.jpeg',
      'https://i.imgur.com/nOJ68kX.jpeg',
      'https://i.imgur.com/B3DaUjn.jpeg',
      'https://i.imgur.com/2nUijUe.jpeg',
      'https://i.imgur.com/mnvER3v.jpeg',
    ],
    year: '2025'
  },

  // --- 5. Posters ---
  {
    id: 'marketing-visual',
    category: 'VISUAL',
    title: 'Marketing Posters',
    subtitle: '市场营销视觉设计',
    description: '为展会、活动及线上传播打造系统化视觉方案，通过展架、折页、信息长图与营销海报等触点，构建高效的信息动线与品牌叙事，提升传达效率与用户参与度。',
    tags: ['营销海报', '市场营销设计'],
    role: 'UI/UX 设计师',
    coverImage: 'https://i.imgur.com/fHlvpqV.jpeg',
    detailImages: [
      'https://i.imgur.com/iuIflT3.jpeg', 
      'https://i.imgur.com/m4bZQBg.jpeg', 
      'https://i.imgur.com/UbnL0z2.jpeg'
    ],
    year: '2025'
  },

  // --- 6. Flat Illustration ---
  {
    id: 'illustration-series',
    category: 'ILLUSTRATION',
    title: 'Flat illustration',
    subtitle: '扁平插画设计',
    description: '运用极简的视觉语言，通过抽象的几何形状、流畅的线条与和谐的色块组合，融合了细微颗粒感、柔和渐变与抽象元素的现代风格。',
    tags: ['数字插画', '概念插画', '扁平风格'],
    role: 'UI/UX 设计师',
    coverImage: 'https://i.imgur.com/YwQOLpm.jpeg',
    detailImages: [
      'https://i.imgur.com/qZIqegB.jpeg', 
      'https://i.imgur.com/CIVhxDw.jpeg', 
      'https://i.imgur.com/L78DzAq.jpeg', 
      'https://i.imgur.com/QJMf4j9.jpeg', 
      'https://i.imgur.com/qr8cqye.jpeg',
      'https://i.imgur.com/ognC9TH.jpeg',
      'https://i.imgur.com/7jf9VLP.jpeg',
    ],
    year: '2025'
  },

  // --- 7. Design Thinking ---
  {
    id: 'methodology',
    category: 'PRACTICE',
    title: 'Design Thinking',
    subtitle: '方法论与工具',
    description: '探索设计思维方法论，将 Figma 作为跨团队的主要工具实施，并验证设计提案。',
    tags: ['Figma 工具的推行', '探索设计思维的拆解', '设计提案的验证'],
    role: 'UI/UX 设计师',
    coverImage: 'background:#000',
    detailImages: [
      'https://i.imgur.com/TP2E5CJ.jpeg',
      'https://i.imgur.com/v1U5Aau.jpeg',
    ],
    year: '2025'
  }
];