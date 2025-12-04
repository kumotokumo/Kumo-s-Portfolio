// [GIT_VERSION: FINAL_V11_GIT_FORCE]
import { Project } from './types';

// CONFIGURATION: 7 Projects Total
// 2 UI/UX, 2 WEB, 1 VISUAL, 1 PRACTICE, 1 ILLUSTRATION

export const INITIAL_PROJECTS: Project[] = [
  // --- 1. UI/UX DESIGN (2 Projects) ---
  {
    id: 'clackyai-ui',
    category: 'UI/UX',
    title: 'ClackyAI SaaS',
    subtitle: 'AI Coding Assistant',
    description: 'A comprehensive 0-1 product architecture for an AI-powered coding assistant. This project involved deep user research, interaction design for complex AI workflows, and defining the user experience architecture.',
    tags: ['AI Coding Assistant SaaS', '0-1 Product Architecture', 'AI Interaction Design', 'UX Architecture'],
    role: 'Lead Product Designer',
    coverImage: 'https://i.imgur.com/Mxzz4cv.jpeg',
    detailImages: ['https://picsum.photos/seed/clackyui1/1200/800', 'https://picsum.photos/seed/clackyui2/1200/800'],
    year: '2025'
  },
  {
    id: 'showmebug-ui',
    category: 'UI/UX',
    title: 'ShowMeBug',
    subtitle: 'Technical Assessment Platform',
    description: 'Experience reconstruction for a B-side product. Implemented a dual-core design system and handled complex interactions for real-time collaborative coding interviews.',
    tags: ['B-End Product Experience', 'Complex Interaction', 'Dual-Core Design System', 'Experience Refactoring'],
    role: 'Senior UX Designer',
    coverImage: 'https://i.imgur.com/Xpyg30N.jpeg',
    detailImages: ['https://picsum.photos/seed/smbui1/1200/800'],
    year: '2025'
  },
  
  // --- 2. WEB DESIGN (2 Projects) ---
  {
    id: 'clackyai-web',
    category: 'WEB',
    title: 'ClackyAI Official',
    subtitle: 'Brand Website',
    description: 'Strategic visual construction for the ClackyAI brand. Focused on responsive design and high-fidelity interaction prototypes to demonstrate the power of the AI tool.',
    tags: ['Brand Visual Construction', 'Design Strategy', 'Interaction Prototype', 'Responsive Design'],
    role: 'Art Director',
    coverImage: 'https://i.imgur.com/Lc6CKPy.jpeg',
    detailImages: ['https://picsum.photos/seed/clackyweb1/1200/800'],
    year: '2025'
  },
  {
    id: 'showmebug-web',
    category: 'WEB',
    title: 'ShowMeBug Web',
    subtitle: 'Corporate Portal Renewal',
    description: 'A complete brand renewal and official website reshaping. Driven by growth metrics, focusing on scenario-based value transmission to enterprise clients.',
    tags: ['Official Site Reshape', 'Brand Upgrade', 'Growth Driven', 'Brand Renewal', 'Scenario Value'],
    role: 'Visual Designer',
    coverImage: 'https://i.imgur.com/AL1MJk1.jpeg',
    detailImages: ['https://picsum.photos/seed/smbweb1/1200/800'],
    year: '2025'
  },

  // --- 3. VISUAL DESIGN (1 Project Only) - UPDATED CONTENT ---
  {
    id: 'marketing-visual',
    category: '视觉设计',
    title: '宣传海报',
    subtitle: '市场营销视觉',
    description: '为展会、活动及线上传播打造系统化视觉方案，通过展架、折页、信息长图与营销海报等触点，构建高效的信息动线与品牌叙事，提升传达效率与用户参与度。',
    tags: ['运营海报', '市场营销设计', '关键视觉'],
    role: '视觉设计师',
    coverImage: 'https://i.imgur.com/fHlvpqV.jpeg',
    detailImages: [
      'https://i.imgur.com/iuIflT3.jpeg', 
      'https://i.imgur.com/m4bZQBg.jpeg', 
      'https://i.imgur.com/UbnL0z2.jpeg'
    ],
    year: '2025'
  },

  // --- 4. DESIGN IN PRACTICE (1 Project) ---
  {
    id: 'methodology',
    category: 'PRACTICE',
    title: 'Design Thinking',
    subtitle: 'Methodology & Tools',
    description: 'Exploration of design thinking methodologies, implementation of Figma as a primary tool across teams, and validation of design proposals.',
    tags: ['Figma Implementation', 'Design Thinking Decoding', 'Proposal Validation'],
    role: 'Design Lead',
    coverImage: 'background:#000',
    detailImages: ['https://picsum.photos/seed/practice1/1200/800'],
    year: '2025'
  },

  // --- 5. ILLUSTRATION (1 Project) ---
  {
    id: 'illustration-series',
    category: 'ILLUSTRATION',
    title: 'Flat illustration',
    subtitle: 'Flat illustration design',
    description: '运用极简的视觉语言，通过抽象的几何形状、流畅的线条与和谐的色块组合，融合了细微颗粒感、柔和渐变与抽象元素的现代风格。',
    tags: ['Digital Illustration', 'Concept Art', 'Atmospheric Lighting', 'Cyberpunk Style'],
    role: 'Illustrator',
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
  }
];