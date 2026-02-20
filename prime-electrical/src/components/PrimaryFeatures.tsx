'use client'

import { useState } from 'react'

const features = [
  {
    id: 'solar',
    title: 'SOLAR // HYBRID',
    desc: 'SEANZ-certified solar arrays and battery storage systems. We calculate exact ROI based on roof vector and household consumption data.',
    points: ['Tesla Powerwall Integration', 'Enphase Microinverters', 'Grid-tied & Off-grid Systems'],
    color: 'emerald',
    metrics: { efficiency: '98.5%', output: '12kW peak' }
  },
  {
    id: 'infrastructure',
    title: 'MAINS // SWITCHBOARD',
    desc: 'Complete power foundation upgrades. We replace outdated infrastructure with high-capacity, legally compliant switchboards designed for modern loads.',
    points: ['3-Phase Power Upgrades', 'Thermal Imaging Scans', 'AS/NZS 3000 Compliance'],
    color: 'blue',
    metrics: { capacity: '100A per phase', safety: 'RCD/MCB Protected' }
  },
  {
    id: 'automation',
    title: 'SMART // AUTOMATION',
    desc: 'Frictionless intelligent environments. Integrated lighting, security, and climate control via centralized or distributed processing.',
    points: ['Control4 & KNX Systems', 'DALI Protocol Lighting', 'Automated Access Control'],
    color: 'violet',
    metrics: { latency: '<10ms', protocols: 'DALI, KNX, Zigbee' }
  }
]

export function PrimaryFeatures() {
  const [activeTab, setActiveTab] = useState(features[0].id)

  return (
    <section id="services" className="bg-slate-50 py-32 border-b border-slate-200">
      
      {/* 
        Agent 1: Extreme Minimalism 
        Agent 3: Bespoke UI (Terminal Interface & Conductive Trace Lines)
      */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Minimalist Section Header */}
        <div className="mb-20 flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
              // ENGINEERING CAPABILITIES
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tighter text-slate-900 sm:text-5xl">
              System <br />
              Architecture.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-1 w-1 bg-blue-500 rounded-full animate-ping" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600">
              All Systems Nominal
            </span>
          </div>
        </div>

        {/* The Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left: Terminal Interface / Selector */}
          <div className="lg:col-span-5 flex flex-col justify-start relative">
            
            {/* The Conductive Trace Line linking options */}
            <div className="absolute left-3 top-4 bottom-4 w-px bg-slate-200" aria-hidden="true" />

            <div className="space-y-2">
              {features.map((feature) => {
                const isActive = activeTab === feature.id
                return (
                  <button
                    key={feature.id}
                    onClick={() => setActiveTab(feature.id)}
                    className={`group relative flex w-full items-center gap-6 px-4 py-6 text-left transition-all ${
                      isActive ? 'bg-slate-100' : 'hover:bg-slate-100/50'
                    }`}
                  >
                    {/* The Active "Node" on the trace line */}
                    <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center bg-slate-50 border border-slate-300">
                      <div className={`h-2 w-2 transition-all duration-300 ${
                        isActive 
                          ? feature.color === 'emerald' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' 
                            : feature.color === 'blue' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' 
                            : 'bg-violet-500 shadow-[0_0_10px_#8b5cf6]'
                          : 'bg-transparent'
                      }`} />
                    </div>

                    <div className="flex-1">
                      <h3 className={`font-mono text-sm font-bold tracking-widest transition-colors duration-300 ${
                        isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'
                      }`}>
                        {feature.title}
                      </h3>
                      {isActive && (
                         <div className="mt-2 text-xs font-mono text-slate-400 flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                            <span>[ACT LOAD: 100%]</span>
                            <span>[STATUS: OPTIMAL]</span>
                         </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: The Data Display Panel */}
          <div className="lg:col-span-7">
            {features.map((feature) => (
              <div 
                key={`data-${feature.id}`}
                className={`transition-all duration-500 ease-in-out ${
                  activeTab === feature.id 
                    ? 'opacity-100 translate-y-0 relative z-10' 
                    : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
                }`}
              >
                <div className="bg-slate-900 p-8 sm:p-12 border-l-4" style={{ 
                  borderColor: feature.color === 'emerald' ? '#10b981' : feature.color === 'blue' ? '#3b82f6' : '#8b5cf6' 
                }}>
                  
                  {/* Internal Panel Header */}
                  <div className="flex items-start justify-between mb-8 border-b border-slate-800 pb-6">
                    <div>
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em]">
                        COMPONENT SPECIFICATION
                      </span>
                      <h4 className="mt-2 font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                        {feature.title.split(' // ')[0]} <br/>
                        <span className={`text-${feature.color}-400`}>{feature.title.split(' // ')[1]}</span>
                      </h4>
                    </div>
                    {/* Abstract Data Chart Icon */}
                    <svg aria-hidden="true" className="h-10 w-10 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M3 3v18h18" strokeLinecap="square" />
                      <path d="M18 9l-5 5-4-4-4 4" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  </div>

                  <p className="text-sm font-medium leading-relaxed text-slate-400 mb-8 max-w-lg">
                    {feature.desc}
                  </p>

                  {/* The Technical "Metrics" Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {Object.entries(feature.metrics).map(([key, value]) => (
                      <div key={key} className="bg-slate-950 border border-slate-800 p-4">
                        <span className="block font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-1">{key}</span>
                        <span className="font-mono text-sm font-bold text-white">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bullet Points as "System Parameters" */}
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2 block">
                      SYSTEM PARAMETERS
                    </span>
                    {feature.points.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className={`h-1.5 w-1.5 rounded-full bg-${feature.color}-500`} />
                        <span className="font-mono text-xs text-slate-300 uppercase tracking-wide">{point}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hard-edged action */}
                  <div className="mt-12 pt-8 border-t border-slate-800">
                    <a 
                      href="#contact" 
                      className={`inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-${feature.color}-400 hover:text-white transition-colors`}
                    >
                      <span className={`bg-${feature.color}-500 text-slate-900 px-2 py-0.5`}>&gt;</span>
                      Load Full Schematic
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
