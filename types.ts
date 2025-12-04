export type Category = 'UI/UX' | 'WEB' | 'VISUAL' | 'PRACTICE' | 'ILLUSTRATION' | '视觉设计';

export interface Project {
  id: string;
  category: Category; // kept as string compatible for editing
  title: string;
  subtitle: string; // Used as "Client"
  description: string; // Used as "Brief"
  tags: string[]; // Used as "Scope"
  role: string; // New field
  coverImage: string;
  detailImages: string[];
  year: string;
}

export type ViewState = 'HOME' | 'PORTFOLIO' | 'ABOUT' | 'CONTACT' | 'PROJECT_DETAIL';

// For the admin upload interaction
export interface EditableImageProps {
  currentSrc: string;
  onUpload: (base64: string) => void;
  isAdmin: boolean;
  className?: string;
  alt: string;
}