'use client'

import { useState } from 'react'
import { Container } from '@/components/Container'

const systems = [
  {
    id: 'solar',
    label: 'Solar // Hybrid',
    statusLabel: 'ACT LOAD: 100%',
    statusNote: 'STATUS: OPTIMAL',
    title: 'Solar Hybrid',
    description:
      'SEANZ-certified solar arrays and battery storage systems. We calculate exact ROI based on roof vector and household consumption data.',
    metrics: [
      { label: 'efficiency', value: '98.5%' },
      { label: 'output', value: '12kW peak' },
    ],
    params: [
      'Tesla Powerwall Integration',
      'Enphase Microinverters',
      'Grid-tied & Off-grid Systems',
    ],
  },
  {
    id: 'mains',
    label: 'Mains // Switchboard',
    statusLabel: null,
    statusNote: null,
    title: 'Mains Switchboard',
    description:
      'Complete power foundation upgrades. We replace outdated infrastructure with high-capacity, legally compliant switchboards designed for modern loads.',
    metrics: [
      { label: 'capacity', value: '100A per phase' },
      { label: 'safety', value: 'RCD/MCB Protected' },
    ],
    params: [
      '3-Phase Power Upgrades',
      'Thermal Imaging Scans',
      'AS/NZS 3000 Compliance',
    ],
  },
  {
    id: 'automation',
    label: 'Smart // Automation',
    statusLabel: null,
    statusNote: null,
    title: 'Smart Automation',
    description:
      'Frictionless intelligent environments. Integrated lighting, security, and climate control via centralized or distributed processing.',
    metrics: [
      { label: 'latency', value: '<10ms' },
      { label: 'protocols', value: 'DALI, KNX, Zigbee' },
    ],
    params: [
      'Control4 & KNX Systems',
      'DALI Protocol Lighting',
      'Automated Access Control',
    ],
  },
]

export function PrimaryFeatures() {
  const [activeId, setActiveId] = useState(systems[0].id)
  const active = systems.find((s) => s.id === activeId) ?? systems[0]

  return (
    <section
      id="services"
      aria-label="Engineering Capabilities"
      className="relative bg-slate-950 py-20 sm:py-32"
    >
      {/* Subtle circuit-board grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <Container className="relative">
        {/* Header */}
        <div className="mb-2 flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
            All Systems Nominal
          </span>
        </div>

        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          System Architecture.
        </h2>

        {/* System selector tabs */}
        <div className="mt-10 flex flex-wrap gap-2">
          {systems.map((sys) => (
            <button
              key={sys.id}
              onClick={() => setActiveId(sys.id)}
              className={`flex items-center gap-2 border px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors focus:outline-none ${
                activeId === sys.id
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
              }`}
            >
              {sys.label}
              {sys.statusLabel && activeId === sys.id && (
                <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] text-blue-400">
                  {sys.statusLabel}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Data display panel */}
        <div className="mt-6 border border-slate-800 bg-slate-900 p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left — component spec */}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                Component Specification
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-white">
                {active.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                {active.description}
              </p>

              {/* Metric readouts */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {active.metrics.map((m) => (
                  <div key={m.label} className="border border-slate-800 px-4 py-3">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                      {m.label}
                    </p>
                    <p className="mt-1 font-mono text-lg font-bold text-blue-400">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — system parameters */}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                System Parameters
              </p>
              <ul className="mt-4 space-y-3">
                {active.params.map((param) => (
                  <li key={param} className="flex items-center gap-3">
                    <span className="font-mono text-blue-500">{'>'}</span>
                    <span className="font-mono text-sm text-slate-300">{param}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-2 border border-blue-600 px-5 py-2 font-mono text-xs font-bold uppercase tracking-widest text-blue-400 transition-colors hover:bg-blue-600 hover:text-white"
              >
                {'>'} Load Full Schematic
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
