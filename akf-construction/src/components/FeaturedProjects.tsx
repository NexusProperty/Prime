const projects = [
  {
    id: 'east-tamaki-extension',
    title: 'East Tāmaki Extension',
    subtitle: 'Home extension & renovation',
    location: 'East Tāmaki, Auckland',
    stats: { size: '+45m²', duration: '14 Weeks', status: 'Completed' },
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
  },
  {
    id: 'litten-road',
    title: 'Litten Road Add-On',
    subtitle: 'Second storey addition',
    location: 'Flat Bush, Auckland',
    stats: { size: '+120m²', duration: '22 Weeks', status: 'Completed' },
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'beachlands',
    title: 'Beachlands Clifftop',
    subtitle: 'Extension & landscaping',
    location: 'Beachlands, Auckland',
    stats: { size: '+80m²', duration: '18 Weeks', status: 'Completed' },
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
  },
]

export function FeaturedProjects() {
  return (
    <section id="projects" className="bg-white py-32 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Minimalist Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-24 border-b border-slate-200 pb-8">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
              // RECENT WORK
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tighter text-slate-900 sm:text-5xl">
              Constructed <br />
              Reality.
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-slate-900" />
            <a href="#contact" className="font-mono text-xs font-bold uppercase tracking-widest text-slate-900 hover:text-amber-500 transition-colors">
              View All Projects
            </a>
          </div>
        </div>

        {/* 
          Stark Portfolio List (Subtraction Strategy: No cards, no grid gaps)
          Just massive typography, hover reveals, and stark lines. 
        */}
        <div className="flex flex-col">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="group relative flex flex-col lg:flex-row lg:items-center justify-between py-12 border-b border-slate-200 cursor-pointer"
            >
              {/* Image Reveal on Hover (Desktop only) */}
              <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[300px] z-10 opacity-0 pointer-events-none transition-all duration-500 group-hover:opacity-100 group-hover:-translate-x-8 hidden lg:block grayscale-[50%]"
                style={{
                  backgroundImage: `url(${project.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              
              {/* Title & Location */}
              <div className="flex-1 lg:pr-8">
                <div className="flex items-center gap-6 mb-4">
                  <span className="font-mono text-xs font-bold text-slate-300 group-hover:text-slate-900 transition-colors">
                    0{index + 1}
                  </span>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-amber-500 transition-colors">
                    {project.location}
                  </p>
                </div>
                <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tighter text-slate-300 group-hover:text-slate-900 transition-colors duration-500">
                  {project.title}
                </h3>
              </div>

              {/* Stats & Description (Mobile visible, Desktop hidden until hover) */}
              <div className="mt-8 lg:mt-0 flex-1 lg:max-w-sm flex flex-col gap-6 lg:opacity-0 lg:-translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 transition-all duration-500 z-20">
                <p className="text-sm font-medium leading-relaxed text-slate-500 bg-white/80 backdrop-blur-xs lg:p-4">
                  {project.subtitle}
                </p>
                <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-4 bg-white/80 backdrop-blur-xs lg:p-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Scale</p>
                    <p className="font-mono text-sm font-bold text-slate-900 mt-1">{project.stats.size}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Time</p>
                    <p className="font-mono text-sm font-bold text-slate-900 mt-1">{project.stats.duration}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Status</p>
                    <p className="font-mono text-sm font-bold text-slate-900 mt-1">{project.stats.status}</p>
                  </div>
                </div>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
