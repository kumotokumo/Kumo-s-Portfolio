import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, ArrowDown, Lock, Unlock, ChevronRight, Plus, Trash2, ArrowUp, Download } from 'lucide-react';
import { CustomCursor } from './components/CustomCursor';
import { EditableImage } from './components/EditableImage';
import { INITIAL_PROJECTS } from './constants';
import { Project, ViewState } from './types';
import { getProjectsFromDB, saveProjectsToDB } from './utils/db';

export default function App() {
  const [activeView, setActiveView] = useState<ViewState>('HOME');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  
  // Admin Mode State
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Back to Top State
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedProjects = await getProjectsFromDB();
        if (storedProjects && storedProjects.length > 0) {
          setProjects(storedProjects);
        } else {
          // Initialize DB with constants if empty
          await saveProjectsToDB(INITIAL_PROJECTS);
          setProjects(INITIAL_PROJECTS);
        }
      } catch (e) {
        console.error("DB Load Error:", e);
        // Fallback
        setProjects(INITIAL_PROJECTS);
      }
    };
    loadData();
  }, []);

  // Global Scroll Listener for Back to Top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const saveProjects = async (newProjects: Project[]) => {
    // Optimistic update
    setProjects(newProjects);
    if (selectedProject) {
      const updatedSelected = newProjects.find(p => p.id === selectedProject.id);
      if (updatedSelected) {
        setSelectedProject(updatedSelected);
      }
    }
    
    // Save to DB
    try {
      await saveProjectsToDB(newProjects);
    } catch (e) {
      console.error("Save error", e);
      alert("Failed to save to database.");
    }
  };

  // Export Data Feature
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "project-data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // 1. Text Field Updates
  const handleUpdateProjectText = (projectId: string, field: keyof Project, value: any) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, [field]: value };
      }
      return p;
    });
    saveProjects(updatedProjects);
  };

  // 2. Image Updates
  const handleUpdateProjectImage = (projectId: string, imageType: 'cover' | 'detail', base64: string, detailIndex?: number) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        if (imageType === 'cover') {
          return { ...p, coverImage: base64 };
        } else if (imageType === 'detail' && typeof detailIndex === 'number') {
          const newDetails = [...p.detailImages];
          newDetails[detailIndex] = base64;
          return { ...p, detailImages: newDetails };
        }
      }
      return p;
    });
    saveProjects(updatedProjects);
  };

  // 3. Add new detail image
  const handleAddDetailImage = (projectId: string, base64: string) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, detailImages: [...p.detailImages, base64] };
      }
      return p;
    });
    saveProjects(updatedProjects);
  };

  // 4. Delete detail image
  const handleDeleteDetailImage = (projectId: string, index: number) => {
    if (!window.confirm("Delete this image?")) return;
    
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const newDetails = [...p.detailImages];
        newDetails.splice(index, 1);
        return { ...p, detailImages: newDetails };
      }
      return p;
    });
    saveProjects(updatedProjects);
  };

  const navigateTo = (view: ViewState, project?: Project) => {
    setIsMenuOpen(false);
    // Instant scroll reset if switching projects directly
    if (activeView === 'PROJECT_DETAIL' && view === 'PROJECT_DETAIL') {
       window.scrollTo({top: 0, behavior: 'instant'});
    }
    
    setTimeout(() => {
      if (project) {
        setSelectedProject(project);
        setActiveView('PROJECT_DETAIL');
        if (activeView !== 'PROJECT_DETAIL') window.scrollTo(0,0);
      } else {
        setActiveView(view);
        window.scrollTo(0,0);
      }
    }, 100); 
  };

  const toggleAdmin = () => {
    if (!isAdmin) {
      const password = prompt("Enter Admin Password (default: admin):");
      if (password === 'admin') {
        setIsAdmin(true);
      }
    } else {
      setIsAdmin(false);
    }
  };

  return (
    <div className="bg-background min-h-screen text-primary font-sans">
      <CustomCursor />

      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center mix-blend-difference border-b border-white/10 bg-background/50 backdrop-blur-sm">
        <div 
          onClick={() => navigateTo('HOME')} 
          className="h-16 md:h-20 px-6 md:px-10 flex items-center border-r border-white/10 clickable cursor-pointer hover:bg-white hover:text-black transition-colors duration-300"
        >
          <span className="font-display font-bold text-2xl tracking-tighter">KUMO©</span>
        </div>

        <button 
          onClick={() => setIsMenuOpen(true)}
          className="h-16 md:h-20 px-8 md:px-12 flex items-center gap-4 clickable hover:bg-white hover:text-black transition-colors duration-300 border-l border-white/10"
        >
          <span className="hidden sm:block font-mono text-xs uppercase tracking-widest">Menu</span>
          <Menu size={20} strokeWidth={1.5} />
        </button>
      </header>

      {/* FULL SCREEN MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-background z-[60] flex flex-col pt-32 px-6 md:px-20 pb-12"
          >
             <div className="absolute inset-0 pointer-events-none opacity-10 flex justify-between px-20">
                <div className="w-px h-full bg-white"></div>
                <div className="w-px h-full bg-white"></div>
                <div className="w-px h-full bg-white"></div>
             </div>

            <div className="absolute top-0 right-0 p-0">
               <button 
                onClick={() => setIsMenuOpen(false)}
                className="h-16 md:h-20 px-8 md:px-12 flex items-center gap-4 clickable hover:bg-white hover:text-black transition-colors duration-300 bg-background border-l border-b border-white/10"
              >
                <span className="font-mono text-xs uppercase tracking-widest">Close</span>
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center gap-2 relative z-10">
              {['HOME', 'PORTFOLIO', 'ABOUT', 'CONTACT'].map((item, i) => (
                <motion.div
                    key={item}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="border-b border-white/10 group"
                  >
                  <button
                    onClick={() => navigateTo(item as ViewState)}
                    className="clickable w-full text-left py-4 md:py-8 flex items-baseline gap-8 hover:pl-10 transition-all duration-300"
                  >
                    <span className="font-mono text-xs text-secondary group-hover:text-accent">0{i+1}</span>
                    <span className="font-display text-6xl md:text-8xl font-bold uppercase tracking-tighter text-transparent text-stroke group-hover:text-white group-hover:text-stroke-0 transition-all duration-300">
                      {item}
                    </span>
                  </button>
                </motion.div>
              ))}
            </nav>

            <div className="flex justify-between items-end border-t border-white/10 pt-6 relative z-10">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-secondary uppercase mb-2">Contact</span>
                <a href="mailto:hello@kumo.design" className="font-sans text-xl hover:underline decoration-1 underline-offset-4">hello@kumo.design</a>
              </div>
              <div className="flex gap-6">
                 {['IG', 'LN', 'TW'].map(social => (
                   <span key={social} className="font-mono text-xs hover:bg-white hover:text-black px-2 py-1 cursor-pointer transition-colors border border-white/20">{social}</span>
                 ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="min-h-screen pt-20">
        <AnimatePresence mode="wait">
          
          {/* VIEW: HOME */}
          {activeView === 'HOME' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <section className="h-[85vh] flex flex-col justify-end px-6 md:px-10 pb-12 relative border-b border-white/10 overflow-hidden">
                 <div className="relative z-10">
                    <motion.div 
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h1 className="font-display text-[14vw] leading-[0.8] font-bold tracking-tight text-white uppercase">
                        Product
                      </h1>
                    </motion.div>
                    <motion.div 
                       initial={{ y: 100, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                       className="flex items-center gap-4 md:gap-12"
                    >
                      <span className="hidden md:block w-32 h-[1px] bg-white"></span>
                      <h1 className="font-display text-[14vw] leading-[0.8] font-bold tracking-tight text-secondary/30 uppercase">
                        Designer
                      </h1>
                    </motion.div>
                 </div>

                 <div className="absolute top-0 right-0 w-1/3 h-full border-l border-white/5 bg-white/[0.02]"></div>
                 <div className="absolute bottom-12 right-12 flex flex-col items-end text-right">
                    <p className="font-mono text-xs max-w-[200px] mb-4 text-secondary">
                       SPECIALIZING IN AI INTERFACES, SAAS SYSTEMS & BRUTALIST AESTHETICS.
                    </p>
                    <ArrowDown className="animate-bounce text-white" />
                 </div>
              </section>

              <section className="py-24 px-6 md:px-10">
                 <div className="flex items-end justify-between mb-12 border-b border-white/30 pb-4">
                    <h2 className="font-display text-4xl uppercase">Selected Works</h2>
                    <button 
                      onClick={() => navigateTo('PORTFOLIO')}
                      className="font-mono text-xs uppercase hover:bg-white hover:text-black px-4 py-2 border border-white/20 transition-colors"
                    >
                      View Full Index
                    </button>
                 </div>
                 
                 <div className="flex flex-col">
                    {projects.slice(0, 3).map((project, index) => (
                       <ProjectListItem 
                          key={project.id} 
                          project={project} 
                          index={index} 
                          onClick={() => navigateTo('PROJECT_DETAIL', project)}
                          isAdmin={isAdmin}
                          onUpdateImage={handleUpdateProjectImage}
                       />
                    ))}
                 </div>
              </section>
            </motion.div>
          )}

          {/* VIEW: PORTFOLIO INDEX */}
          {activeView === 'PORTFOLIO' && (
             <motion.div
                key="portfolio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-6 md:px-10 py-12"
             >
                <div className="pt-12 mb-20 border-b border-white/10 pb-8">
                   <h1 className="font-display text-[10vw] leading-none uppercase text-white">Index</h1>
                </div>

                <div className="flex flex-wrap gap-4 mb-16">
                  {['ALL', 'UI/UX', 'WEB', 'VISUAL', 'PRACTICE'].map((cat) => (
                    <button
                      key={cat}
                      className="font-mono text-xs uppercase border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="border-t border-white/20">
                    <div className="grid grid-cols-12 py-4 border-b border-white/20 font-mono text-xs uppercase text-secondary">
                       <div className="col-span-1">No.</div>
                       <div className="col-span-6 md:col-span-5">Project Name</div>
                       <div className="col-span-3 md:col-span-4 text-right md:text-left">Category</div>
                       <div className="col-span-2 text-right">Year</div>
                    </div>

                    {projects.map((project, index) => (
                       <ProjectListItem 
                          key={project.id} 
                          project={project} 
                          index={index} 
                          onClick={() => navigateTo('PROJECT_DETAIL', project)}
                          isAdmin={isAdmin}
                          onUpdateImage={handleUpdateProjectImage}
                       />
                    ))}
                </div>
             </motion.div>
          )}

          {/* VIEW: PROJECT DETAIL */}
          {activeView === 'PROJECT_DETAIL' && selectedProject && (
             <ProjectDetail 
                project={selectedProject} 
                allProjects={projects}
                onBack={() => navigateTo('PORTFOLIO')}
                onNext={(p) => navigateTo('PROJECT_DETAIL', p)}
                isAdmin={isAdmin}
                onUpdateImage={handleUpdateProjectImage}
                onAddImage={handleAddDetailImage}
                onDeleteImage={handleDeleteDetailImage}
                onUpdateText={handleUpdateProjectText}
             />
          )}

          {/* VIEW: ABOUT */}
          {activeView === 'ABOUT' && (
             <motion.div
                key="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-6 md:px-10 py-12"
             >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-l border-white/10">
                   {/* Col 1 - Image */}
                   <div className="md:col-span-5 border-r border-b border-white/10 p-10 md:min-h-screen flex flex-col justify-between">
                      <div className="w-full aspect-[3/4] overflow-hidden bg-neutral-900 mb-8 relative group">
                         <img src="https://picsum.photos/seed/profile/800/1200" className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700" alt="Profile" />
                         <div className="absolute bottom-0 left-0 w-full p-2 bg-black text-white font-mono text-[10px] uppercase text-center border-t border-white/20">
                            Shanghai / CN
                         </div>
                      </div>
                      <div>
                         <h2 className="font-display text-4xl uppercase mb-2">Kumo Design</h2>
                         <p className="font-mono text-xs text-secondary">EST. 2019</p>
                      </div>
                   </div>

                   {/* Col 2 - Content */}
                   <div className="md:col-span-7 border-r border-b border-white/10">
                      <div className="p-10 md:p-20 border-b border-white/10">
                         <h3 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] mb-12">
                            Merging Strategy <br/>
                            <span className="text-secondary">With Brutalism.</span>
                         </h3>
                         <div className="grid grid-cols-2 gap-8 font-light text-secondary leading-relaxed max-w-2xl">
                            <p>I am a Senior Product Designer focused on creating systems that are not only functional but visually compelling. I believe in the power of "Anti-Design" — stripping away the unnecessary to reveal the core structure.</p>
                            <p>My work spans across complex SaaS platforms, AI-driven tools, and brand identity systems that demand a strong, unforgettable presence.</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2">
                         <div className="p-10 border-b md:border-b-0 md:border-r border-white/10">
                            <h4 className="font-mono text-xs uppercase mb-8 flex items-center gap-2">
                               <span className="w-2 h-2 bg-white"></span> Experience
                            </h4>
                            <ul className="space-y-8">
                               <li>
                                  <span className="block font-display text-xl uppercase">Senior Designer</span>
                                  <span className="block text-secondary text-sm mb-1">Tech Corp / 2022-Present</span>
                                  <p className="text-xs text-secondary/60">Lead AI product architecture.</p>
                               </li>
                               <li>
                                  <span className="block font-display text-xl uppercase">UI/UX Designer</span>
                                  <span className="block text-secondary text-sm mb-1">Agency / 2019-2022</span>
                                  <p className="text-xs text-secondary/60">Brand system development.</p>
                               </li>
                            </ul>
                         </div>
                         <div className="p-10">
                             <h4 className="font-mono text-xs uppercase mb-8 flex items-center gap-2">
                               <span className="w-2 h-2 bg-white"></span> Capabilities
                            </h4>
                            <div className="flex flex-wrap gap-2">
                               {['Design Systems', 'UX Architecture', 'React/Next.js', 'WebGL', 'Figma', 'Protopie'].map(skill => (
                                  <span key={skill} className="border border-white/10 px-3 py-1 font-mono text-xs hover:bg-white hover:text-black cursor-default transition-colors">
                                     {skill}
                                  </span>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          )}

          {/* VIEW: CONTACT */}
          {activeView === 'CONTACT' && (
             <motion.div
                key="contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center"
             >
                <h1 className="font-display text-[15vw] leading-[0.8] font-bold uppercase mix-blend-difference">
                   Get In <br/> Touch
                </h1>
                
                <div className="mt-12 flex flex-col items-center gap-8">
                   <a href="mailto:hello@kumo.design" className="font-mono text-xl md:text-2xl border-b border-white hover:bg-white hover:text-black hover:border-transparent transition-all px-2">
                      hello@kumo.design
                   </a>
                   <div className="flex gap-8">
                      {['Instagram', 'LinkedIn', 'Twitter'].map(social => (
                         <a key={social} href="#" className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-white transition-colors">
                            {social}
                         </a>
                      ))}
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="px-6 md:px-10 py-8 border-t border-white/10 flex justify-between items-end relative z-[100]">
         <div>
            <span className="font-display font-bold text-xl uppercase">KUMO©</span>
         </div>
         <div className="flex gap-4 items-center">
             {/* EXPORT DATA BUTTON - ONLY VISIBLE WHEN ADMIN */}
             {isAdmin && (
               <button 
                  onClick={handleExportData} 
                  className="font-mono text-[10px] text-black bg-yellow-400 hover:bg-yellow-300 px-3 py-1 flex items-center gap-2 uppercase font-bold transition-colors"
               >
                  <Download size={12} />
                  Export Data
               </button>
             )}
            {isAdmin && <span className="font-mono text-[10px] text-green-500 bg-green-900/10 px-1">ADMIN ENABLED</span>}
            <button onClick={toggleAdmin} className="text-secondary hover:text-white transition-colors p-2">
               {isAdmin ? <Unlock size={14} /> : <Lock size={14} />}
            </button>
            <span className="font-mono text-[10px] text-secondary">ALL RIGHTS RESERVED 2024</span>
         </div>
      </footer>

      {/* GLOBAL BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showTopBtn && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-24 right-6 md:right-10 z-[999] w-12 h-12 bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
            >
              <ArrowUp size={24} />
            </motion.button>
        )}
      </AnimatePresence>

      {/* ADMIN FLOATING BADGE (LEFT) */}
      {isAdmin && (
        <div className="fixed bottom-6 left-6 bg-green-500 text-black px-4 py-2 font-mono text-xs uppercase font-bold z-[999] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            Editing Mode Active
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// SUB-COMPONENTS
// -----------------------------------------------------------------------------

const ProjectListItem: React.FC<{
   project: Project;
   index: number;
   onClick: () => void;
   isAdmin: boolean;
   onUpdateImage: (id: string, type: 'cover' | 'detail', b64: string) => void;
}> = ({ project, index, onClick, isAdmin, onUpdateImage }) => {
   const [isHovered, setIsHovered] = useState(false);

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ delay: index * 0.05 }}
         className="relative group border-b border-white/20"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
         <div 
            onClick={onClick}
            className="grid grid-cols-12 py-8 items-baseline clickable cursor-pointer relative z-10 mix-blend-difference"
         >
            <div className="col-span-1 font-mono text-xs text-secondary group-hover:text-white transition-colors">
               {String(index + 1).padStart(2, '0')}
            </div>
            <div className="col-span-6 md:col-span-5">
               <h3 className="font-display text-3xl md:text-5xl uppercase font-bold text-white group-hover:translate-x-4 transition-transform duration-300">
                  {project.title}
               </h3>
               <p className="font-sans text-xs text-secondary mt-1 md:hidden">{project.subtitle}</p>
            </div>
            <div className="col-span-3 md:col-span-4 hidden md:flex gap-2">
               {project.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="border border-white/10 px-2 py-1 font-mono text-[10px] uppercase text-secondary">
                     {tag}
                  </span>
               ))}
            </div>
            <div className="col-span-5 md:col-span-2 text-right font-mono text-xs text-secondary group-hover:text-white transition-colors flex justify-end items-center gap-2">
               {project.year} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
         </div>

         {/* HOVER IMAGE REVEAL */}
         <AnimatePresence>
            {isHovered && (
               <motion.div
                  initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-10 top-1/2 -translate-y-1/2 w-[300px] h-[200px] z-20 pointer-events-none hidden lg:block overflow-hidden border border-white/20 bg-neutral-900"
               >
                  <EditableImage 
                     currentSrc={project.coverImage} 
                     alt={project.title}
                     onUpload={(b64) => onUpdateImage(project.id, 'cover', b64)}
                     isAdmin={isAdmin}
                     className="w-full h-full object-cover"
                  />
               </motion.div>
            )}
         </AnimatePresence>
      </motion.div>
   );
}

const ProjectDetail: React.FC<{
  project: Project;
  allProjects: Project[];
  onBack: () => void;
  onNext: (p: Project) => void;
  onUpdateImage: (id: string, type: 'cover' | 'detail', b64: string, index: number) => void;
  onAddImage: (id: string, b64: string) => void;
  onDeleteImage: (id: string, index: number) => void;
  onUpdateText: (id: string, field: keyof Project, value: any) => void;
  isAdmin: boolean;
}> = ({ project, allProjects, onBack, onNext, onUpdateImage, onAddImage, onDeleteImage, onUpdateText, isAdmin }) => {
   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleAddClick = () => {
      fileInputRef.current?.click();
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         if (file.size > 50 * 1024 * 1024) { 
            alert("File is too large! Please upload images under 50MB.");
            e.target.value = '';
            return;
         }

        const reader = new FileReader();
        reader.onloadend = () => {
          onAddImage(project.id, reader.result as string);
          if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.onerror = () => {
           alert("Failed to read file.");
           if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsDataURL(file);
      }
    };

    // Calculate Next Project
    const currentIndex = allProjects.findIndex(p => p.id === project.id);
    const nextIndex = (currentIndex + 1) % allProjects.length;
    const nextProject = allProjects[nextIndex];

    // Helper to render editable input
    const renderEditable = (
        field: keyof Project, 
        value: string, 
        className: string, 
        multiline: boolean = false
    ) => {
        if (!isAdmin) {
            return multiline ? <p className={className}>{value}</p> : <span className={className}>{value}</span>;
        }

        const commonInputClass = `${className} bg-transparent border-b border-dashed border-white/30 text-white outline-none focus:border-white focus:bg-white/5 transition-all p-1 w-full block z-[50] relative`;

        if (multiline) {
            return (
                <textarea 
                    value={value}
                    onChange={(e) => onUpdateText(project.id, field, e.target.value)}
                    className={`${commonInputClass} min-h-[100px] resize-y`}
                />
            );
        }
        return (
            <input 
                type="text"
                value={value}
                onChange={(e) => onUpdateText(project.id, field, e.target.value)}
                className={commonInputClass}
            />
        );
    };

   return (
      <div className="min-h-screen bg-background pb-20">
         {/* Large Header Image */}
         <div className="h-[60vh] md:h-[80vh] w-full relative group">
            <EditableImage 
               currentSrc={project.coverImage}
               alt="Hero"
               onUpload={(b64) => onUpdateImage(project.id, 'cover', b64, -1)} 
               isAdmin={isAdmin}
               className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none"></div>
            
            <button 
               onClick={onBack}
               className="absolute top-32 right-6 md:right-10 z-50 w-12 h-12 bg-white text-black flex items-center justify-center clickable hover:scale-110 transition-transform"
            >
               <X size={20} />
            </button>

            {/* Z-index increased to ensure clickability over potential image overlaps */}
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full z-40">
               {/* EDITABLE TITLE */}
               <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="mb-6"
               >
                   {renderEditable('title', project.title, "font-display text-[10vw] md:text-[12vw] leading-[0.8] uppercase font-bold text-white bg-transparent outline-none w-full")}
               </motion.div>

               <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/20 pt-6">
                  <div className="flex gap-8 font-mono text-xs uppercase tracking-widest w-full md:w-auto">
                     <div className="flex flex-col flex-1">
                        <span className="text-secondary mb-1">Client</span>
                        {renderEditable('subtitle', project.subtitle, "")}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-secondary mb-1">Year</span>
                        {renderEditable('year', project.year, "")}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-secondary mb-1">Category</span>
                        {renderEditable('category', project.category, "")}
                     </div>
                  </div>
                  <div className="mt-4 md:mt-0 font-mono text-xs text-secondary hidden md:block">
                     SCROLL TO READ
                  </div>
               </div>
            </div>
         </div>

         <div className="px-6 md:px-10 max-w-[1400px] mx-auto mt-24">
            <div className="flex flex-col gap-16">
               
               {/* 1. Brief & Scope (Top) */}
               <div className="w-full max-w-4xl border-b border-white/10 pb-16 relative z-30">
                  <span className="font-mono text-xs uppercase text-secondary mb-4 block">Brief</span>
                  {/* EDITABLE BRIEF (Description) */}
                  {renderEditable('description', project.description, "font-sans text-lg md:text-2xl font-light leading-relaxed text-gray-200 w-full", true)}
                  
                  <div className="mt-12 flex flex-col md:flex-row gap-8 md:gap-24">
                     <div className="flex-1">
                        {/* CONDITIONAL SCOPE LABEL - FIXED */}
                        <span className="font-mono text-xs uppercase text-secondary mb-4 block">
                           Scope {isAdmin && "(Comma separated)"}
                        </span>
                        {isAdmin ? (
                            <input 
                                type="text"
                                value={project.tags.join(', ')}
                                onChange={(e) => onUpdateText(project.id, 'tags', e.target.value.split(',').map(t => t.trim()))}
                                className="font-mono text-sm text-gray-400 bg-transparent border-b border-dashed border-white/30 w-full outline-none p-2"
                            />
                        ) : (
                            <ul className="flex flex-wrap gap-x-6 gap-y-2">
                            {project.tags.map((tag, i) => (
                                <li key={i} className="font-mono text-sm text-gray-400 relative">
                                    <span className="text-secondary mr-2">/</span>
                                    {tag}
                                </li>
                            ))}
                            </ul>
                        )}
                     </div>
                     <div className="flex-1">
                        <span className="font-mono text-xs uppercase text-secondary mb-4 block">Role</span>
                         {/* EDITABLE ROLE */}
                         {renderEditable('role', project.role || 'Lead Product Designer', "font-mono text-sm text-gray-400")}
                     </div>
                  </div>
               </div>

               {/* 2. Images (Bottom) */}
               <div className="w-full space-y-32">
                  {project.detailImages.map((img, idx) => (
                     <div key={idx} className="space-y-4 relative group/item">
                        <div className="w-full bg-neutral-900 border border-white/5 relative">
                           <EditableImage 
                              currentSrc={img} 
                              alt={`Detail ${idx}`}
                              onUpload={(b64) => onUpdateImage(project.id, 'detail', b64, idx)}
                              isAdmin={isAdmin}
                              className="w-full h-auto"
                           />
                           
                           {isAdmin && (
                              <button 
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteImage(project.id, idx);
                                 }}
                                 className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 z-30 opacity-0 group-hover/item:opacity-100 transition-opacity"
                              >
                                 <Trash2 size={16} />
                              </button>
                           )}
                        </div>
                        <div className="flex justify-between font-mono text-[10px] text-secondary uppercase border-t border-white/10 pt-2">
                           <span>Figure 0{idx+1}</span>
                           <span>{project.category} Exploration</span>
                        </div>
                     </div>
                  ))}

                  {/* ADD NEW IMAGE AREA (Admin Only) */}
                  {isAdmin && (
                     <div 
                        onClick={handleAddClick}
                        className="w-full h-64 border border-dashed border-white/20 hover:border-white/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center cursor-pointer text-secondary hover:text-white gap-4 group mt-12"
                     >
                        <Plus size={32} className="group-hover:scale-110 transition-transform"/>
                        <span className="font-mono text-xs uppercase tracking-widest">Add New Detail Image</span>
                        <input 
                           type="file" 
                           ref={fileInputRef}
                           className="hidden"
                           accept="image/*"
                           onChange={handleFileChange}
                        />
                     </div>
                  )}
               </div>
            </div>
         </div>
         
         {/* NEXT PROJECT PREVIEW SECTION - NEW! */}
         <div className="mt-32 w-full">
            <button 
               onClick={() => {
                  onNext(nextProject);
               }}
               className="w-full relative group border-t border-b border-white/20 h-[400px] flex flex-col justify-between p-6 md:p-10 transition-all hover:border-white/50 clickable overflow-hidden bg-transparent"
            >
               {/* HOVER IMAGE BACKGROUND */}
               <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none">
                  <img src={nextProject.coverImage} className="w-full h-full object-cover grayscale-[20%]" alt="Next Project" />
                  <div className="absolute inset-0 bg-black/40"></div>
               </div>

               {/* TOP ROW */}
               <div className="w-full flex justify-between items-start relative z-10">
                  <span className="font-mono text-xs uppercase tracking-widest text-secondary group-hover:text-white transition-colors">Next Project</span>
                  <ChevronRight size={32} className="text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
               </div>

               {/* BOTTOM CONTENT (Right Aligned) */}
               <div className="w-full flex flex-col items-end relative z-10 text-right">
                  <h2 className="font-display text-5xl md:text-8xl uppercase font-bold text-white mb-2 leading-[0.9] mix-blend-difference group-hover:mix-blend-normal">
                     {nextProject.title}
                  </h2>
                  <div className="flex gap-2">
                     {nextProject.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="font-mono text-xs text-secondary group-hover:text-gray-200 uppercase border border-transparent group-hover:border-white/20 px-2 py-1">
                           {tag}
                        </span>
                     ))}
                  </div>
               </div>
            </button>
         </div>
      </div>
   );
}