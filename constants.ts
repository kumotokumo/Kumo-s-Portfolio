import { Project } from './types';

// UPDATED: 7 Projects Total
// Structure: UI/UX (2), WEB (2), VISUAL (1), PRACTICE (1), ILLUSTRATION (1)

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
    coverImage: 'https://i.imgur.com/99HmQ6X.jpeg',
    detailImages: ['https://imgur.com/J3qRdxI', 'https://imgur.com/8VpbNqJ', 'https://imgur.com/nfVA9kw', 'https://imgur.com/kJTtFHt', 'https://imgur.com/l91I0ki', 'https://imgur.com/s5suK4U', 'https://imgur.com/wLqqsnX', 'https://imgur.com/FL3xao4', 'https://imgur.com/cFUJG1V', 'https://imgur.com/uLg4ZkC', 'https://imgur.com/YDVT6T1', 'https://imgur.com/dS8qGEC'],
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
    coverImage: 'https://picsum.photos/seed/smbui/800/1000',
    detailImages: ['https://picsum.photos/seed/smbui1/1200/800'],
    year: '2022'
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
    coverImage: 'https://i.imgur.com/99HmQ6X.jpeg',
    detailImages: ['https://imgur.com/J3qRdxI', 'https://imgur.com/8VpbNqJ', 'https://imgur.com/nfVA9kw', 'https://imgur.com/kJTtFHt', 'https://imgur.com/l91I0ki', 'https://imgur.com/s5suK4U', 'https://imgur.com/wLqqsnX', 'https://imgur.com/FL3xao4', 'https://imgur.com/cFUJG1V', 'https://imgur.com/uLg4ZkC', 'https://imgur.com/YDVT6T1', 'https://imgur.com/dS8qGEC'],
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
    coverImage: 'https://picsum.photos/seed/smbweb/800/800',
    detailImages: ['https://picsum.photos/seed/smbweb1/1200/800'],
    year: '2022'
  },

  // --- 3. VISUAL DESIGN (1 Project) ---
  {
    id: 'marketing-visual',
    category: 'VISUAL',
    title: 'Campaign Posters',
    subtitle: 'Marketing Visuals',
    description: 'High-impact operational posters and key visuals for various digital marketing campaigns.',
    tags: ['Operational Posters', 'Marketing Design', 'Key Visuals'],
    role: 'Visual Designer',
    coverImage: 'https://picsum.photos/seed/visual3/800/600',
    detailImages: ['https://picsum.photos/seed/visual3a/1200/800'],
    year: '2022'
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
    coverImage: 'https://picsum.photos/seed/practice/800/600',
    detailImages: ['https://picsum.photos/seed/practice1/1200/800'],
    year: '2023'
  },

  // --- 5. ILLUSTRATION (1 Project - NEW) ---
  {
    id: 'illustration-series',
    category: 'ILLUSTRATION',
    title: 'Cyber Horizons',
    subtitle: 'Digital Art Series',
    description: 'A personal exploration of cyberpunk aesthetics through digital illustration. Focusing on atmospheric lighting, neon cityscapes, and futuristic character designs.',
    tags: ['Digital Illustration', 'Concept Art', 'Atmospheric Lighting', 'Cyberpunk Style'],
    role: 'Illustrator',
    coverImage: 'https://picsum.photos/seed/illustration1/800/600',
    detailImages: ['https://picsum.photos/seed/illustration1a/1200/800'],
    year: '2024'
  }
];
