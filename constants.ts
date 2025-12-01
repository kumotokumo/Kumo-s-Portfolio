import { Project } from './types';

export const INITIAL_PROJECTS: Project[] = [
  // 1. UI/UX DESIGN
  {
    id: 'clackyai-ui',
    category: 'UI/UX',
    title: 'ClackyAI SaaS',
    subtitle: 'AI Coding Assistant',
    description: 'A comprehensive 0-1 product architecture for an AI-powered coding assistant. This project involved deep user research, interaction design for complex AI workflows, and defining the user experience architecture.',
    tags: ['AI Coding Assistant SaaS', '0-1 Product Architecture', 'AI Interaction Design', 'UX Architecture'],
    role: 'Lead Product Designer',
    coverImage: 'https://picsum.photos/seed/clackyui/800/600',
    detailImages: ['https://picsum.photos/seed/clackyui1/1200/800', 'https://picsum.photos/seed/clackyui2/1200/800'],
    year: '2023'
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
  
  // 2. WEB DESIGN
  {
    id: 'clackyai-web',
    category: 'WEB',
    title: 'ClackyAI Official',
    subtitle: 'Brand Website',
    description: 'Strategic visual construction for the ClackyAI brand. Focused on responsive design and high-fidelity interaction prototypes to demonstrate the power of the AI tool.',
    tags: ['Brand Visual Construction', 'Design Strategy', 'Interaction Prototype', 'Responsive Design'],
    role: 'Art Director',
    coverImage: 'https://picsum.photos/seed/clackyweb/800/500',
    detailImages: ['https://picsum.photos/seed/clackyweb1/1200/800'],
    year: '2023'
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

  // 3. VISUAL DESIGN
  {
    id: 'offline-visual',
    category: 'VISUAL',
    title: 'Event Materials',
    subtitle: 'Offline Touchpoints',
    description: 'Physical brand materials including exhibition stands and brochures designed to create a cohesive offline brand experience.',
    tags: ['Exhibition Stand', 'Brochures', 'Print Design'],
    role: 'Graphic Designer',
    coverImage: 'https://picsum.photos/seed/visual1/800/1000',
    detailImages: ['https://picsum.photos/seed/visual1a/1200/800'],
    year: '2021'
  },
  {
    id: 'infographic',
    category: 'VISUAL',
    title: 'Data Viz',
    subtitle: 'Information Visualization',
    description: 'Long-form infographic design for marketing campaigns, translating complex data into engaging visual narratives.',
    tags: ['Activity Long Chart', 'Data Visualization', 'Information Design'],
    role: 'Visual Designer',
    coverImage: 'https://picsum.photos/seed/visual2/800/1200',
    detailImages: ['https://picsum.photos/seed/visual2a/800/2000'],
    year: '2021'
  },
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

  // 4. DESIGN IN PRACTICE
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
  }
];