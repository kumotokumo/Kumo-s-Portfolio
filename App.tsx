// [GIT_VERSION: FINAL_V11_GIT_FORCE]
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, ArrowDown, ChevronRight, Plus, Trash2, ArrowUp, Layers, Brain, Users, Zap } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { CustomCursor } from './components/CustomCursor';
import { EditableImage } from './components/EditableImage';
import { INITIAL_PROJECTS } from './constants';
import { Project, ViewState } from './types';
import { getProjectsFromDB, saveProjectsToDB } from './utils/db';
import { getImageUrl } from './utils/image';

export default function App() {
  const [activeView, setActiveView] = useState<ViewState>('HOME');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  
  // Filter State
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  
  // Admin Mode disabled
  const isAdmin = false;
  
  // Back to Top State
  const [showTopBtn, setShowTopBtn] = useState(false);
  
  // Copyright tooltip state for profile photo
  const [profileTooltip, setProfileTooltip] = useState<{ visible: boolean; x: number; y: number } | null>(null);

  // Auto-hide profile tooltip after 1.5 seconds
  useEffect(() => {
    if (profileTooltip?.visible) {
      const timer = setTimeout(() => setProfileTooltip(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [profileTooltip]);

  // Always use constants.ts data, sync to IndexedDB for consistency
  useEffect(() => {
    const loadData = async () => {
      try {
        // Always use INITIAL_PROJECTS from constants.ts
        setProjects(INITIAL_PROJECTS);
        // Sync to IndexedDB to keep it in sync
        await saveProjectsToDB(INITIAL_PROJECTS);
      } catch (e) {
        console.error("DB Load Error:", e);
        // Fallback to constants
        setProjects(INITIAL_PROJECTS);
      }
    };
    loadData();
  }, []);

  // Add noindex meta tag for ABOUT page
  useEffect(() => {
    let noindexMeta: HTMLMetaElement | null = null;
    if (activeView === 'ABOUT') {
      noindexMeta = document.createElement('meta');
      noindexMeta.name = 'robots';
      noindexMeta.content = 'noindex, nofollow';
      document.head.appendChild(noindexMeta);
    }
    return () => {
      if (noindexMeta) {
        document.head.removeChild(noindexMeta);
      }
    };
  }, [activeView]);

  // Global Scroll Listener for Back to Top (throttled for performance)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowTopBtn(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const saveProjects = useCallback(async (newProjects: Project[]) => {
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
  }, [selectedProject]);

  // 1. Text Field Updates
  const handleUpdateProjectText = useCallback((projectId: string, field: keyof Project, value: any) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, [field]: value };
      }
      return p;
    });
    saveProjects(updatedProjects);
  }, [projects, saveProjects]);

  // 2. Image Updates
  const handleUpdateProjectImage = useCallback((projectId: string, imageType: 'cover' | 'detail', base64: string, detailIndex?: number) => {
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
  }, [projects, saveProjects]);

  // 3. Add new detail image
  const handleAddDetailImage = useCallback((projectId: string, base64: string) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, detailImages: [...p.detailImages, base64] };
      }
      return p;
    });
    saveProjects(updatedProjects);
  }, [projects, saveProjects]);

  // 4. Delete detail image
  const handleDeleteDetailImage = useCallback((projectId: string, index: number) => {
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
  }, [projects, saveProjects]);

  const navigateTo = (view: ViewState, project?: Project) => {
    // Smart delay: only delay if menu is open to allow animation
    const delay = isMenuOpen ? 500 : 0;
    
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
    }, delay); 
  };

  // FILTER LOGIC (memoized for performance)
  const filteredProjects = useMemo(() => {
    return filterCategory === 'ALL' 
      ? projects 
      : projects.filter(p => p.category === filterCategory);
  }, [projects, filterCategory]);

  return (
    <div className="bg-background min-h-screen text-primary font-sans">
      <CustomCursor />

      {/* FIXED HEADER */}
      <header 
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center border-b border-white/10 md:mix-blend-difference"
      >
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
            className="fixed inset-0 bg-background z-[9999] flex flex-col pt-32 px-6 md:px-20 pb-12"
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
                    <p className="font-mono text-xs max-w-[200px] mb-4 text-secondary uppercase">
                       SPECIALIZING IN AI INTERFACES & SAAS SYSTEMS DESIGN
                    </p>
                    <ArrowDown className="animate-bounce text-white" />
                 </div>
              </section>

              <section className="py-24 px-6 md:px-10">
                 <div className="flex items-end justify-between mb-12 border-b border-white/30 pb-4">
                    <h2 className="font-display text-4xl uppercase">Selected Works</h2>
                 </div>
                 
                 <div className="flex flex-col">
                    {(() => {
                       // Define the order of selected works
                       const selectedWorkIds = [
                          'clackyai-ui',      // ClackyAI
                          'showmebug-ui',      // ShowMeBug
                          'clackyai-web',      // ClackyAI Official
                          'showmebug-web'      // ShowMeBug Official
                       ];
                       
                       const selectedWorks = selectedWorkIds
                          .map(id => projects.find(p => p.id === id))
                          .filter((p): p is Project => p !== undefined);
                       
                       return selectedWorks.map((project, index) => (
                          <ProjectListItem 
                             key={project.id} 
                             project={project} 
                             index={index} 
                             onClick={() => navigateTo('PROJECT_DETAIL', project)}
                             isAdmin={isAdmin}
                             onUpdateImage={handleUpdateProjectImage}
                          />
                       ));
                    })()}
                 </div>
                 
                 <div className="mt-12 flex justify-center">
                    <button 
                      onClick={() => navigateTo('PORTFOLIO')}
                      className="font-mono text-xs uppercase hover:bg-white hover:text-black px-6 py-3 border border-white/20 transition-colors clickable"
                    >
                      VIEW FULL INDEX
                    </button>
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

                {/* FILTER BUTTONS: INCLUDES ILLUSTRATION */}
                <div className="flex flex-wrap gap-4 mb-16">
                  {['ALL', 'UI/UX', 'WEB', 'VISUAL', 'PRACTICE', 'ILLUSTRATION'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`font-mono text-xs uppercase border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors ${filterCategory === cat ? 'bg-white text-black border-transparent' : ''}`}
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

                    {filteredProjects.length > 0 ? (
                       filteredProjects.map((project, index) => (
                          <ProjectListItem 
                             key={project.id} 
                             project={project} 
                             index={index} 
                             onClick={() => navigateTo('PROJECT_DETAIL', project)}
                             isAdmin={isAdmin}
                             onUpdateImage={handleUpdateProjectImage}
                          />
                       ))
                    ) : (
                       <div className="py-20 text-center font-mono text-secondary uppercase">
                          No projects found in this category.
                       </div>
                    )}
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
                className="px-6 md:px-10"
             >
                {/* Introduction Section */}
                <div className="max-w-[1400px] mx-auto border-l border-r border-white/10 px-6 md:px-10 py-12">
                   <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      <div className="md:col-span-7">
                         <h1 className="font-display text-[7vw] md:text-[6vw] leading-[1.1] uppercase font-bold mb-8 text-white">
                            <span className="block">您好，</span>
                            <span className="block mt-2 md:mt-3">我是郭意如</span>
                         </h1>
                         <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl">
                            9年体验设计经验，专注SaaS和互联网产品，全流程设计，推动产品体验优化。
                         </p>
                      </div>
                      <div className="md:col-span-5 flex justify-end">
                         <div 
                            className="w-full max-w-[400px] aspect-[3/4] overflow-hidden bg-neutral-900 relative cursor-pointer select-none flex items-center justify-center"
                            onContextMenu={(e) => {
                               e.preventDefault();
                               setProfileTooltip({
                                  visible: true,
                                  x: e.clientX,
                                  y: e.clientY
                               });
                            }}
                         >
                            <LazyLoadImage 
                               src={getImageUrl('images/about/about-kumo.jpg')} 
                               className="w-full h-full object-contain pointer-events-none"
                               alt="Profile"
                               draggable="false"
                               effect="opacity"
                               threshold={1000}
                               loading="eager"
                               delayMethod="throttle"
                               delayTime={0}
                            />
                            {/* Copyright Tooltip */}
                            <AnimatePresence>
                               {profileTooltip?.visible && (
                                  <motion.div
                                     initial={{ opacity: 0, scale: 0.9 }}
                                     animate={{ opacity: 1, scale: 1 }}
                                     exit={{ opacity: 0 }}
                                     transition={{ duration: 0.2 }}
                                     style={{ 
                                       position: 'fixed',
                                       left: profileTooltip.x, 
                                       top: profileTooltip.y,
                                       zIndex: 9999
                                     }}
                                     className="pointer-events-none bg-white text-black border border-white/20 px-3 py-1"
                                  >
                                     <span className="font-mono text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">
                                       © kumo
                                     </span>
                                  </motion.div>
                               )}
                            </AnimatePresence>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Personal Soft Skills Section */}
                <div className="max-w-[1400px] mx-auto border-l border-r border-white/10 px-6 md:px-10 py-12">
                   <p className="font-mono text-xs text-secondary uppercase mb-8">/ Personal Skills /</p>
                   <p className="font-sans text-sm text-gray-400 mb-12">推动团队、优化流程、并为业务带来实质影响</p>
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start mb-20 md:mb-[60px]">
                      {/* Skill Card 1 */}
                      <div className="border border-white/10 p-8 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex flex-col">
                        <div className="w-12 h-12 mb-6 flex items-center justify-center">
                          <Layers size={32} className="text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-display text-xl uppercase mb-4">问题框架构建力</h3>
                        <p className="font-sans text-xs text-gray-400 leading-relaxed">
                            面对模糊需求或复杂场景，能快速定位核心矛盾，将业务目标转化为清晰的设计框架，确保执行不偏离方向。
                        </p>
                      </div>
                      {/* Skill Card 2 */}
                      <div className="border border-white/10 p-8 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex flex-col">
                        <div className="w-12 h-12 mb-6 flex items-center justify-center">
                          <Brain size={32} className="text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-display text-xl uppercase mb-4">动机洞察共情力</h3>
                        <p className="font-sans text-xs text-gray-400 leading-relaxed">
                            不止于界面表现，能深入理解用户行为背后的决策逻辑与真实动机，使方案精准匹配深层需求。
                        </p>
                      </div>
                      {/* Skill Card 3 */}
                      <div className="border border-white/10 p-8 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex flex-col">
                        <div className="w-12 h-12 mb-6 flex items-center justify-center">
                          <Users size={32} className="text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-display text-xl uppercase mb-4">跨域协同推动力</h3>
                        <p className="font-sans text-xs text-gray-400 leading-relaxed">
                            擅用原型、图示等可视化语言打破沟通壁垒，主动对齐多方认知，化解分歧，确保设计意图完整落地。
                        </p>
                      </div>
                      {/* Skill Card 4 */}
                      <div className="border border-white/10 p-8 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex flex-col">
                        <div className="w-12 h-12 mb-6 flex items-center justify-center">
                          <Zap size={32} className="text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-display text-xl uppercase mb-4">全局优化驱动意识</h3>
                        <p className="font-sans text-xs text-gray-400 leading-relaxed">
                            习惯从流程和系统层面发现改进点，主动推进体验优化或协同效率提升，不局限于单次任务执行。
                        </p>
                      </div>
                   </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-l border-r border-white/10 max-w-[1400px] mx-auto">
                   {/* Col 1 - Basic Info */}
                   <div className="md:col-span-4 border-r border-t border-b border-white/10 p-10">
                      <h3 className="font-mono text-xs uppercase mb-8 flex items-center gap-2">
                         <span className="w-2 h-2 bg-white"></span> 基本信息
                      </h3>
                      <div className="space-y-6">
                         <div>
                            <span className="font-mono text-xs text-secondary block mb-1">电话/微信</span>
                            <span className="font-sans text-sm">136-4224-0336</span>
                         </div>
                         <div>
                            <span className="font-mono text-xs text-secondary block mb-1">邮箱</span>
                            <a href="mailto:kumogyr@gmail.com" className="font-sans text-sm hover:underline">kumogyr@gmail.com</a>
                         </div>
                         <div>
                            <span className="font-mono text-xs text-secondary block mb-1">期望职位</span>
                            <span className="font-sans text-sm">UI/UX 设计师</span>
                         </div>
                         <div>
                            <span className="font-mono text-xs text-secondary block mb-1">期望行业</span>
                            <span className="font-sans text-sm">AI、人工智能、企业服务等</span>
                         </div>
                      </div>
                   </div>

                   {/* Col 2 - Work Experience & Skills */}
                   <div className="md:col-span-8 border-t border-b border-white/10">
                      {/* Work Experience */}
                      <div className="p-10 border-b border-white/10">
                         <h4 className="font-mono text-xs uppercase mb-8 flex items-center gap-2">
                            <span className="w-2 h-2 bg-white"></span> 工作经历
                         </h4>
                         <ul className="space-y-10">
                            <li>
                               <div className="flex justify-between items-start mb-2">
                                  <span className="block font-display text-xl uppercase">UI/UX 设计师</span>
                                  <span className="block text-secondary text-sm font-mono">2021.03 - 2025.05</span>
                               </div>
                               <span className="block text-secondary text-sm mb-3">深圳至简天成科技有限公司 | 产品部</span>
                               <ul className="space-y-2 text-xs text-gray-400">
                                  <li className="flex items-start gap-2">
                                     <span className="text-secondary">•</span>
                                     <span>主导 SaaS 产品（ShowMeBug、ClackyAI）全流程设计</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                     <span className="text-secondary">•</span>
                                     <span>提升设计效率与协作流程</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                     <span className="text-secondary">•</span>
                                     <span>优化用户体验，跨职能协作</span>
                                  </li>
                               </ul>
                            </li>
                            <li>
                               <div className="flex justify-between items-start mb-2">
                                  <span className="block font-display text-xl uppercase">UI 设计师</span>
                                  <span className="block text-secondary text-sm font-mono">2018.04 - 2020.09</span>
                               </div>
                               <span className="block text-secondary text-sm mb-3">广州蚁块链网络科技有限公司 | 产品部</span>
                               <ul className="space-y-2 text-xs text-gray-400">
                                  <li className="flex items-start gap-2">
                                     <span className="text-secondary">•</span>
                                     <span>核心 APP 产品体验设计</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                     <span className="text-secondary">•</span>
                                     <span>营销物料设计</span>
                                  </li>
                               </ul>
                            </li>
                         </ul>
                      </div>

                      {/* Professional Skills */}
                      <div className="grid grid-cols-1 md:grid-cols-2">
                         <div className="p-10 border-b md:border-b-0 md:border-r border-white/10">
                            <h4 className="font-mono text-xs uppercase mb-8 flex items-center gap-2">
                               <span className="w-2 h-2 bg-white"></span> 项目经验
                            </h4>
                            <div className="flex flex-wrap gap-2">
                               {['后端系统设计', '数据可视化', '信息架构', '权限设计', '任务流程优化', '组件库应用', '视觉设计'].map(skill => (
                                  <span key={skill} className="border border-white/10 px-3 py-1 font-mono text-xs hover:bg-white hover:text-black cursor-default transition-colors">
                                     {skill}
                                  </span>
                               ))}
                            </div>
                         </div>
                         <div className="p-10">
                            <h4 className="font-mono text-xs uppercase mb-8 flex items-center gap-2">
                               <span className="w-2 h-2 bg-white"></span> 软件技能
                            </h4>
                            <div className="flex flex-wrap gap-2">
                               {['Figma', 'Illustrator', 'Photoshop', 'XD', 'Protopie'].map(skill => (
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
                   <a href="mailto:kumogyr@gmail.com" className="font-mono text-xl md:text-2xl border-b border-white hover:bg-white hover:text-black hover:border-transparent transition-all px-2 cursor-pointer relative z-10">
                      kumogyr@gmail.com
                   </a>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="px-6 md:px-10 py-8 flex justify-between items-end relative z-[100]">
         <div>
            <span className="font-display font-bold text-xl uppercase">KUMO©</span>
         </div>
         <div className="flex gap-4 items-center">
            <span className="font-mono text-[10px] text-secondary">ALL RIGHTS RESERVED 2025</span>
         </div>
      </footer>

      {/* GLOBAL BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showTopBtn && !isMenuOpen && (
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

      {/* ADMIN FLOATING BADGE REMOVED */}
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

// Image name mapping for each project
const getImageName = (projectId: string, index: number): string => {
   const imageNames: Record<string, string[]> = {
      'clackyai-ui': [
         '项目概览',
         '设计定位与策略',
         '品牌塑造',
         '设计原则',
         '设计令牌架构',
         '基础规范',
         '基础规范',
         '组件库',
         '组件概览',
         '核心用户流程',
         '界面呈现',
         '界面呈现',
         'AI 对话系统',
         '业务组件',
         '项目总结',
         '页面概览'
      ],
      'clackyai-web': [
         '项目介绍',
         '设计挑战与目标',
         '设计过程与推导',
         '品牌风格定义',
         '颜色、字体与网格',
         '首页概览',
         '首页设计说明',
         '页面概览',
         '页面概览',
         '移动端页面概览',
         '项目复盘'
      ],
      'showmebug-ui': [
         '项目介绍',
         '产品架构模型',
         '面试用户体验地图',
         '笔试用户体验地图',
         '设计系统策略',
         '色彩与字体',
         '图标库',
         '交互案例/评卷体验',
         '交互案例/技能树方案解析',
         '交互案例/技能树页面产出',
         '控制台页面概览',
         '编码 IDE 页面概览',
         '项目总结'
      ],
      'showmebug-web': [
         '项目介绍',
         '项目概述',
         '用户体验地图',
         '品牌升级',
         '首页解析',
         '产品方案页解析',
         '核心价值页解析',
         '页面概览',
         '项目总结'
      ],
   };
   
   const names = imageNames[projectId];
   return names && names[index] ? names[index] : `Figure ${index + 1}`;
};

// Image Index Item Component
const ImageIndexItem: React.FC<{
   index: number;
   isActive: boolean;
   onClick: () => void;
   projectId: string;
}> = ({ index, isActive, onClick, projectId }) => {
   const [isHovered, setIsHovered] = useState(false);
   const shouldHighlight = isActive || isHovered;
   const imageName = getImageName(projectId, index);

   return (
      <div
         className="relative flex items-center justify-end group"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
         {/* Hover Tooltip */}
         {isHovered && (
            <motion.div
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0 }}
               className="absolute right-full mr-3 whitespace-nowrap bg-white text-black px-2 py-1 pointer-events-none z-50 flex items-center justify-center"
            >
               <span className="font-mono text-[8px] uppercase tracking-wider font-medium leading-none">
                  {imageName}
               </span>
            </motion.div>
         )}
         
         <button
            onClick={onClick}
            className="flex items-center justify-end cursor-pointer transition-all py-2 px-2 -mx-2"
            aria-label={`Go to ${imageName}`}
         >
            <div
               className={`transition-all duration-300 ${
                  shouldHighlight
                     ? 'w-10 bg-white'
                     : 'w-5 bg-gray-600'
               } h-[1px]`}
            />
         </button>
      </div>
   );
};

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
   const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
   const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
   const [showIndex, setShowIndex] = useState(false);
   const [showCloseButton, setShowCloseButton] = useState(true);

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

    // Scroll to image handler
    const scrollToImage = (index: number) => {
      const ref = imageRefs.current[index];
      if (ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Track active image on scroll and show/hide index
    useEffect(() => {
      let ticking = false;
      
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            const scrollY = window.scrollY;
            
            // Hide close button when scrolled past header (header height is approximately 64px on mobile, 80px on desktop)
            const headerHeight = window.innerWidth >= 768 ? 80 : 64;
            setShowCloseButton(scrollY < headerHeight);
            
            // Check if we've scrolled to the top of the first detail image and not past the bottom of the last image
            let shouldShowIndex = false;
            if (imageRefs.current[0]) {
              const firstImageRef = imageRefs.current[0];
              const firstRect = firstImageRef.getBoundingClientRect();
              const firstImageTop = firstRect.top + window.scrollY;
              
              // Check if the last image is still visible in viewport
              const lastImageIndex = imageRefs.current.length - 1;
              if (imageRefs.current[lastImageIndex]) {
                const lastImageRef = imageRefs.current[lastImageIndex];
                const lastRect = lastImageRef.getBoundingClientRect();
                const lastImageBottom = lastRect.bottom + window.scrollY;
                
                // Index disappears when scrolled past the bottom of the last image
                // Check if scroll position has passed the bottom of the last image
                const hasPassedLastImage = window.scrollY + window.innerHeight >= lastImageBottom;
                
                // Show index when: 
                // 1. Scroll position reaches the top of first image
                // 2. Has not scrolled past the bottom of the last image
                shouldShowIndex = window.scrollY >= firstImageTop && !hasPassedLastImage;
              } else {
                shouldShowIndex = window.scrollY >= firstImageTop;
              }
            }
            
            setShowIndex(shouldShowIndex);
            
            // Track active image
            for (let i = 0; i < imageRefs.current.length; i++) {
              const ref = imageRefs.current[i];
              if (ref) {
                const rect = ref.getBoundingClientRect();
                const elementTop = rect.top + window.scrollY;
                const elementBottom = elementTop + rect.height;
                
                if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
                  setActiveImageIndex(i);
                  break;
                }
              }
            }
            
            ticking = false;
          });
          
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial check
      
      return () => window.removeEventListener('scroll', handleScroll);
    }, [project.detailImages.length]);

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
         <div className="h-[60vh] md:h-[80vh] w-full relative group overflow-hidden">
            <EditableImage 
               currentSrc={project.coverImage}
               alt="Hero"
               onUpload={(b64) => onUpdateImage(project.id, 'cover', b64, -1)} 
               isAdmin={isAdmin}
               className="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 bg-black/50 pointer-events-none z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none z-20"></div>
            <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20"></div>
            
            <motion.button 
               onClick={onBack}
               initial={{ opacity: 1 }}
               animate={{ opacity: showCloseButton ? 1 : 0, pointerEvents: showCloseButton ? 'auto' : 'none' }}
               transition={{ duration: 0.3 }}
               className="absolute top-32 right-6 md:right-10 z-50 w-12 h-12 bg-white text-black flex items-center justify-center clickable hover:scale-110 transition-transform"
            >
               <X size={20} />
            </motion.button>

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
               <div className="w-full space-y-16 md:space-y-32 relative">
                  {/* Right Side Index Navigation */}
                  {project.detailImages.length > 0 && (
                     <div 
                        className={`fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 transition-opacity duration-300 ${
                           showIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                     >
                        {project.detailImages.map((_, idx) => {
                           const isActive = activeImageIndex === idx;
                           return (
                              <ImageIndexItem
                                 key={idx}
                                 index={idx}
                                 isActive={isActive}
                                 onClick={() => scrollToImage(idx)}
                                 projectId={project.id}
                              />
                           );
                        })}
                     </div>
                  )}

                  {project.detailImages.map((img, idx) => (
                     <div 
                        key={idx} 
                        ref={(el) => { imageRefs.current[idx] = el; }}
                        className="space-y-4 relative group/item"
                     >
                        <div className="w-full bg-neutral-900 border border-white/5 relative overflow-hidden" style={{ lineHeight: 0 }}>
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
         
         {/* NEXT PROJECT PREVIEW SECTION - RESIZED & HORIZONTAL */}
         <div className="mt-32 w-full">
            <button 
               onClick={() => {
                  onNext(nextProject);
               }}
               className="w-full relative group border-t border-b border-white/20 h-[150px] flex flex-row items-center justify-between px-6 md:px-10 transition-all hover:border-white/50 clickable overflow-hidden bg-transparent"
            >
               {/* HOVER IMAGE BACKGROUND */}
               <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none">
                  <LazyLoadImage 
                    src={getImageUrl(nextProject.coverImage)} 
                    className="absolute inset-0 w-full h-full object-cover grayscale-[20%]" 
                    alt="Next Project" 
                    effect="opacity"
                    style={{ objectPosition: '50% 50%', objectFit: 'cover' }}
                    threshold={800}
                    delayMethod="throttle"
                    delayTime={0}
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
               </div>

               {/* LEFT SIDE: LABEL */}
               <div className="relative z-10 flex items-center gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-secondary group-hover:text-white transition-colors">Next Project</span>
               </div>

               {/* RIGHT SIDE: INFO & ARROW */}
               <div className="flex items-center gap-8 relative z-10 text-right">
                  <div className="flex flex-col items-end">
                     <h2 className="font-display text-3xl md:text-5xl uppercase font-bold text-white leading-none mix-blend-difference group-hover:mix-blend-normal">
                        {nextProject.title}
                     </h2>
                     <div className="flex gap-2 mt-2">
                        {nextProject.tags.slice(0, 2).map((tag, i) => (
                           <span key={i} className="font-mono text-[10px] text-secondary group-hover:text-gray-200 uppercase border border-transparent group-hover:border-white/20 px-2 py-0.5">
                              {tag}
                           </span>
                        ))}
                     </div>
                  </div>
                  <ChevronRight size={24} className="text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
               </div>
            </button>
         </div>
      </div>
   );
}