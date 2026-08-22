import React, { useState } from 'react'

const initialProjects = [
  {
    id: 1,
    title: 'Scheduling platform redesign',
    description: 'End-to-end redesign of patient scheduling flow, reducing booking time 40%.',
    tag: 'Healthcare',
    tagColor: 'bg-[#E4EAE6] text-[#5C7A6E]',
  },
  {
    id: 2,
    title: 'Design system: Meridian',
    description: 'Built and scaled a component library adopted across 4 product teams.',
    tag: 'Systems',
    tagColor: 'bg-[#F5E7D2] text-[#8A5D22]',
  },
]

const ProjectIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' className='w-10 h-10 opacity-50'>
    <rect x='3' y='4' width='18' height='14' rx='1.5' stroke='#0F1A2B' strokeWidth='1.4' />
    <path d='M3 16l5-5 4 4 5-6 4 5' stroke='#0F1A2B' strokeWidth='1.4' />
  </svg>
)

const Portfolio = () => {
  const [projects, setProjects] = useState(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [newProject, setNewProject] = useState({ title: '', description: '', tag: '' })

  const setField = (field) => (e) => setNewProject({ ...newProject, [field]: e.target.value })

  const handleAddProject = () => {
    if (!newProject.title.trim()) return
    setProjects([
      ...projects,
      {
        id: Date.now(),
        title: newProject.title,
        description: newProject.description,
        tag: newProject.tag || 'Project',
        tagColor: 'bg-[#EEF0EC] text-[#3C4A5E]',
      },
    ])
    setNewProject({ title: '', description: '', tag: '' })
    setShowForm(false)
  }

  const removeProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id))
  }

  const inputClass = 'w-full px-3 py-2 border border-[#DBDCD3] rounded-[5px] text-[13px] text-[#0F1A2B] bg-[#EEF0EC] focus:outline-none focus:border-[#C98A3E] transition-colors'

  return (
    <div className='p-5'>

      <div className='flex justify-between items-center mb-5 pb-5 border-b border-[#DBDCD3]'>
        <div>
          <h1 className='text-2xl md:text-3xl font-medium text-[#0F1A2B]'>Portfolio</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>Case studies recruiters see alongside your resume</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className='bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-3.5 text-sm text-white font-medium transition-colors'
        >
          + Add project
        </button>
      </div>

      {/* inline add-project form */}
      {showForm && (
        <div className='bg-white border border-[#DBDCD3] rounded-md p-6 mb-5'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>New project</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5'>
            <input
              className={inputClass}
              placeholder='Project title'
              value={newProject.title}
              onChange={setField('title')}
            />
            <input
              className={inputClass}
              placeholder='Tag (e.g. Healthcare, Systems)'
              value={newProject.tag}
              onChange={setField('tag')}
            />
          </div>
          <textarea
            className={`${inputClass} min-h-[70px] resize-y mb-3.5`}
            placeholder='Short description of the project'
            value={newProject.description}
            onChange={setField('description')}
          />
          <div className='flex gap-2.5'>
            <button
              onClick={handleAddProject}
              className='bg-[#0F1A2B] hover:bg-[#1C2C45] rounded py-2 px-3.5 text-sm text-white font-medium transition-colors'
            >
              Save project
            </button>
            <button
              onClick={() => setShowForm(false)}
              className='border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2 px-3.5 text-sm text-[#0F1A2B] transition-colors'
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* project grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>

        {projects.map((p) => (
          <div key={p.id} className='bg-white border border-[#DBDCD3] rounded-md overflow-hidden group'>
            <div className='h-[120px] bg-gradient-to-br from-[#E4EAE6] to-[#F5E7D2] relative flex items-center justify-center'>
              <ProjectIcon />
              <button
                onClick={() => removeProject(p.id)}
                className='absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 text-[#A6503E] text-xs opacity-0 group-hover:opacity-100 transition-opacity'
                aria-label={`Remove ${p.title}`}
              >
                ×
              </button>
            </div>
            <div className='p-4'>
              <h4 className='text-sm font-semibold text-[#0F1A2B] mb-1'>{p.title}</h4>
              <p className='text-xs text-[#3C4A5E] leading-relaxed mb-2.5'>{p.description}</p>
              <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full ${p.tagColor}`}>
                {p.tag}
              </span>
            </div>
          </div>
        ))}

        {/* add-project placeholder tile */}
        <button
          onClick={() => setShowForm(true)}
          className='border-[1.5px] border-dashed border-[#DBDCD3] hover:border-[#C98A3E] rounded-md min-h-[210px] flex flex-col items-center justify-center gap-2 text-[#3C4A5E] text-sm transition-colors'
        >
          <svg width='28' height='28' viewBox='0 0 24 24' fill='none'>
            <path d='M12 5v14M5 12h14' stroke='#3C4A5E' strokeWidth='1.6' />
          </svg>
          Add a case study
        </button>

      </div>
    </div>
  )
}

export default Portfolio