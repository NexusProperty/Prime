// Compatible alternative — not native to Salient template
// Solid Build "Featured Projects" portfolio grid pattern
// Replace gradient placeholder cards with next/image project photos when available

const projects = [
  {
    id: 'east-tamaki-extension',
    title: 'East Tāmaki Extension',
    subtitle: 'Home extension & renovation',
    location: 'East Tāmaki, Auckland',
    description:
      'A stunning whole-home extension adding 45m² of open-plan living space with a new master suite, updated kitchen, and seamless indoor-outdoor flow to a new deck.',
    tags: ['Extension', 'Renovation', 'Deck'],
    gradient: 'from-stone-700 via-stone-800 to-slate-900',
    featured: true,
  },
  {
    id: 'litten-road',
    title: 'Litten Road Add-On',
    subtitle: 'Second storey addition',
    location: 'Flat Bush, Auckland',
    description:
      'Complete second-storey addition with three new bedrooms, two bathrooms, and a home office. Managed council consent and structural engineering end-to-end.',
    tags: ['Add-on', 'New Build', 'Consent'],
    gradient: 'from-slate-700 via-slate-800 to-slate-950',
    featured: false,
  },
  {
    id: 'beachlands',
    title: 'Beachlands Clifftop',
    subtitle: 'Extension & landscaping',
    location: 'Beachlands, Auckland',
    description:
      'A stunning clifftop home extension with full landscaping renovation, new hardwood deck, retaining walls, and panoramic outdoor entertaining area.',
    tags: ['Extension', 'Landscaping', 'Deck'],
    gradient: 'from-amber-800 via-stone-800 to-slate-900',
    featured: false,
  },
]

export function FeaturedProjects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="bg-slate-900 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
              Our work
            </p>
            <h2
              id="projects-title"
              className="mt-3 font-display text-3xl tracking-tight text-white sm:text-4xl"
            >
              Featured projects.
            </h2>
            <p className="mt-3 max-w-xl text-lg text-slate-400">
              Every project tells a story. Here&apos;s a sample of the homes
              we&apos;ve transformed across Auckland.
            </p>
          </div>
          <a
            href="#contact"
            className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors sm:flex"
          >
            Start your project
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

        {/* Project grid — Solid Build 3-card layout */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`group relative overflow-hidden rounded-3xl bg-linear-to-br ${project.gradient} cursor-pointer transition hover:scale-[1.01] hover:shadow-2xl ${
                project.featured ? 'lg:col-span-2' : ''
              }`}
              style={{ minHeight: project.featured ? '480px' : '360px' }}
            >
              {/* Decorative texture */}
              <div
                className="absolute inset-0 opacity-5"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(-45deg, transparent, transparent 15px, rgba(255,255,255,0.3) 15px, rgba(255,255,255,0.3) 16px)',
                }}
              />

              {/* Placeholder "photo" area — centered icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <svg aria-hidden="true" className="h-32 w-32 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>

              {/* Tags — top right */}
              <div className="absolute top-5 right-5 flex flex-wrap gap-2 justify-end">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Gradient overlay at bottom */}
              <div
                className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/80 via-black/40 to-transparent"
                aria-hidden="true"
              />

              {/* Card content */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                  {project.location}
                </p>
                <h3 className="mt-1.5 font-display text-2xl font-semibold text-white">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-300">
                  {project.subtitle}
                </p>
                <p
                  className={`mt-3 text-sm leading-relaxed text-slate-400 transition-all duration-300 ${
                    project.featured
                      ? 'max-h-24 opacity-100'
                      : 'max-h-0 overflow-hidden opacity-0 group-hover:max-h-24 group-hover:opacity-100'
                  }`}
                >
                  {project.description}
                </p>
                <a
                  href="#contact"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 opacity-0 transition group-hover:opacity-100"
                >
                  Start a similar project
                  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center text-sm text-slate-600">
          Photos coming soon — project portfolio in progress.{' '}
          <a href="#testimonials" className="text-amber-500 hover:text-amber-400 underline transition-colors">
            Read client reviews
          </a>{' '}
          while we build the gallery.
        </p>
      </div>
    </section>
  )
}
