'use client'

import { useState } from 'react'

const services = [
  {
    id: 'renovations',
    num: '01',
    title: 'RENOVATIONS & ALTERATIONS',
    desc: 'Complete architectural overhauls. We strip back the old and build the extraordinary. Precision-engineered kitchens, bathrooms, and structural additions.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop'
  },
  {
    id: 'decks',
    num: '02',
    title: 'ARCHITECTURAL DECKS',
    desc: 'Engineered hardwood and composite decking. Built for the harsh New Zealand climate, structurally sound and backed by a 10-year guarantee.',
    image: 'https://images.unsplash.com/photo-1599553755498-8ea873db054a?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'new-builds',
    num: '03',
    title: 'NEW BUILDS & EXTENSIONS',
    desc: 'From vacant lot to dream home. We handle the consent, the engineering, and the execution with zero compromises on quality.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'fencing',
    num: '04',
    title: 'FENCING & BOUNDARIES',
    desc: 'Horizontal slat privacy fencing, pool compliance, retaining walls, and automated gates. Built to last and designed to enhance property value.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop'
  }
]

export function PrimaryFeatures() {
  const [activeService, setActiveService] = useState(services[0].id)
  const [isHoveringList, setIsHoveringList] = useState(false)

  return (
    <section id="services" className="relative bg-white py-32 border-b border-slate-200 overflow-hidden">
      
      {/* 
        Agent 1: Extreme Minimalism 
        Agent 2: Subtraction Strategy (No cards, pure typography)
        Agent 3: Bespoke UI (Drafting Overlay)
      */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 min-h-[600px]">
          
          {/* Left Side: Brutalist Typographic List */}
          <div 
            className="lg:col-span-5 flex flex-col justify-center"
            onMouseEnter={() => setIsHoveringList(true)}
            onMouseLeave={() => setIsHoveringList(false)}
          >
            <div className="mb-16">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                // CAPABILITIES
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tighter text-slate-900 leading-[0.9]">
                Engineered <br />
                Solutions.
              </h2>
            </div>

            <div className="relative border-t border-slate-200">
              {services.map((service) => (
                <div 
                  key={service.id}
                  onMouseEnter={() => setActiveService(service.id)}
                  className="group relative cursor-pointer border-b border-slate-200 py-6 transition-all"
                >
                  {/* Dynamic Hover Line */}
                  <div 
                    className={`absolute bottom-0 left-0 h-px bg-slate-900 transition-all duration-500 ease-out ${
                      activeService === service.id ? 'w-full' : 'w-0'
                    }`} 
                  />

                  <div className="flex items-start gap-6">
                    <span className={`font-mono text-sm font-bold transition-colors duration-300 ${
                      activeService === service.id ? 'text-slate-900' : 'text-slate-300'
                    }`}>
                      {service.num}
                    </span>
                    <div>
                      <h3 className={`font-display text-2xl font-bold uppercase tracking-tight transition-colors duration-300 ${
                        activeService === service.id ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'
                      }`}>
                        {service.title}
                      </h3>
                      {/* Accordion-style description reveal without a box */}
                      <div 
                        className={`overflow-hidden transition-all duration-500 ease-out ${
                          activeService === service.id ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                        }`}
                      >
                        <p className="text-sm font-medium leading-relaxed text-slate-500 max-w-sm">
                          {service.desc}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="h-px w-6 bg-slate-900" />
                          <a href="#contact" className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-900 hover:text-amber-500 transition-colors">
                            Request Quote
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: The Drafting Board Viewport */}
          <div className="lg:col-span-7 relative h-[500px] lg:h-auto overflow-hidden bg-slate-50">
            
            {/* The Drafting Grid Texture (Always visible base) */}
            <div 
              className="absolute inset-0 z-0 opacity-[0.15]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #0ea5e9 1px, transparent 1px),
                  linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
                `,
                backgroundSize: '32px 32px',
              }}
            />

            {/* Render all images, toggle opacity based on active service */}
            {services.map((service) => (
              <div
                key={`img-${service.id}`}
                className={`absolute inset-4 z-10 transition-all duration-700 ease-in-out ${
                  activeService === service.id 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div 
                  className="w-full h-full bg-cover bg-center grayscale-[10%]"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                
                {/* 
                  The "Blueprint" Overlay Effect 
                  When hovering the list, it looks like a blueprint. 
                  When not hovering, it looks like the finished photo.
                */}
                <div 
                  className={`absolute inset-0 bg-blue-600 mix-blend-color transition-opacity duration-700 ${
                    isHoveringList ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <div 
                  className={`absolute inset-0 bg-slate-900 mix-blend-multiply transition-opacity duration-700 ${
                    isHoveringList ? 'opacity-40' : 'opacity-0'
                  }`}
                />
              </div>
            ))}

            {/* Drafting board measurement markers */}
            <div className="absolute top-0 left-4 right-4 h-4 border-l border-r border-slate-300" />
            <div className="absolute bottom-0 left-4 right-4 h-4 border-l border-r border-slate-300" />
            <div className="absolute left-0 top-4 bottom-4 w-4 border-t border-b border-slate-300" />
            <div className="absolute right-0 top-4 bottom-4 w-4 border-t border-b border-slate-300" />
            
          </div>

        </div>
      </div>
    </section>
  )
}
