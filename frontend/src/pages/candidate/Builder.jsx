import React, { useState } from 'react'

const tabs = ['Profile', 'Experience', 'Education', 'Skills']

const Builder = () => {
    const [activeTab, setActiveTab] = useState('Profile')


   // experience tab

    const [experienceList, setExperienceList] = useState([
    { id: 1, company: 'Vantage Labs', role: 'Senior Product Designer', dates: '2022-Present', description: 'Led end to end product design for' },
])

const updateExperienceItem = (id, field) => (e) => {
    setExperienceList(experienceList.map((exp) =>
        exp.id === id ? { ...exp, [field]: e.target.value } : exp
    ))
}

const addExperienceItem = () => {
    setExperienceList([...experienceList, { id: Date.now(), company: '', role: '', dates: '', description: '' }])
}

const removeExperienceItem = (id) => {
    setExperienceList(experienceList.filter((exp) => exp.id !== id))
}


//   education tab

    const [education, setEducation] = useState([
        { id: 1, school: 'UC Davis', degree: 'B.A. Design', dates: '2015–2019' },
    ])
    const updateEducation = (id, field) => (e) => {
        setEducation(education.map((edu) =>
            edu.id === id ? { ...edu, [field]: e.target.value } : edu
        ))
    }
    const addEducation = () => {
        setEducation([...education, { id: Date.now(), school: '', degree: '', dates: '' }])
    }
    const removeEducation = (id) => {
        setEducation(education.filter((edu) => edu.id !== id))
    }


    //skill tab

const [skillsList, setSkillsList] = useState([
    { id: 1, name: 'Figma' },
    { id: 2, name: 'Prototyping' },
    { id: 3, name: 'User Research' },
])
   


const updateSkillItem = (id) => (e) => {
    setSkillsList(skillsList.map((skill) =>
        skill.id === id ? { ...skill, name: e.target.value } : skill
    ))
}

const addSkillItem = () => {
    setSkillsList([...skillsList, { id: Date.now(), name: '' }])
}

const removeSkillItem = (id) => {
    setSkillsList(skillsList.filter((skill) => skill.id !== id))
}




    const [formData, setFormData] = useState({
        name: 'Marisol Ferreira',
        title: 'Senior Product Designer',
        location: 'San Francisco, CA',
        summary: 'Product designer with 6 years leading end-to-end design for healthcare and SaaS platforms, partnering closely with engineering on scalable design systems.',
        email: 'marisol.f@email.com',
        portfolio: 'marisolferreira.design',
        experience: 'Senior Product Designer, Vantage Labs — 2022–Present Led end-to-end product design for a healthcare scheduling platform, partnering with engineering and clinica',
        skills: 'Figma, Prototyping, User Research, Design Systems, Cross-functional Collaboration'
    })
    const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value })

    const inputClass = "w-full px-3 py-2.5 border border-[#DBDCD3] rounded-[5px] text-[13.5px] text-[#0F1A2B] bg-[#EEF0EC] focus:outline-none focus:border-[#C98A3E] transition-colors"
    const labelClass = "block text-[11.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-1.5"

    return (
        <div className='p-5'>

            <div className='flex justify-between items-center mb-5 border-b border-[#DBDCD3]   pb-5'>
                <div>
                    <h1 className='text-2xl  font-serif font-bold text-[#0F1A2B]'>Resume builder</h1>
                    <p className='text-sm text-[#3C4A5E]/70 mt-1'>Editing "Product Design — Master"</p>
                </div>
                <div className='flex gap-2.5'>
                    <button className=' cursor-pointer border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2 px-3.5 text-sm text-[#0F1A2B] transition-colors'>
                        Save draft
                    </button>
                    <button className='cursor-pointer bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-3.5 text-sm text-white font-medium transition-colors'>
                        Save & score
                    </button>
                </div> 
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

                {/* left — form */}
                <div>
                    <div className='flex gap-1.5 mb-4 flex-wrap'>
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-xs px-3.5 py-2 rounded-full border transition-colors ${activeTab === tab
                                        ? 'bg-[#0F1A2B] text-white border-[#0F1A2B]'
                                        : 'border-[#DBDCD3] text-[#3C4A5E] hover:border-[#0F1A2B]'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
                        {activeTab === 'Profile' && (
                            <>
                                <div className='mb-4'>
                                    <label className={labelClass}>Full name</label>
                                    <input className={inputClass} value={formData.name} onChange={set('name')} />
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4'>
                                    <div>
                                        <label className={labelClass}>Title</label>
                                        <input className={inputClass} value={formData.title} onChange={set('title')} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Location</label>
                                        <input className={inputClass} value={formData.location} onChange={set('location')} />
                                    </div>

                                </div>


                                <div className='mb-4'>
                                    <label className={labelClass}>EXPERIENCE</label>
                                    <textarea
                                        className={`${inputClass} min-h-[90px] resize-y`}
                                        value={formData.experience}
                                        onChange={set('eperience')}
                                    />
                                </div>

                                <div className='mb-4'>
                                    <label className={labelClass}>Skills</label>
                                    <textarea
                                        className={`${inputClass} min-h-[90px] resize-y`}
                                        value={formData.skills}
                                        onChange={set('skills')}
                                    />
                                </div>
                                <div className='mb-4'>
                                    <label className={labelClass}>Summary</label>
                                    <textarea
                                        className={`${inputClass} min-h-[90px] resize-y`}
                                        value={formData.summary}
                                        onChange={set('summary')}
                                    />
                                </div>


                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
                                    <div>
                                        <label className={labelClass}>Email</label>
                                        <input className={inputClass} value={formData.email} onChange={set('email')} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Portfolio URL</label>
                                        <input className={inputClass} value={formData.portfolio} onChange={set('portfolio')} />
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'Experience' && (
    <div className='flex flex-col gap-5'>
        {experienceList.map((exp, i) => (
            <div key={exp.id} className={i !== 0 ? 'pt-5 border-t border-[#DBDCD3]' : ''}>
                <div className='flex justify-between items-center mb-3'>
                    <span className='text-[11px] font-mono text-[#3C4A5E] uppercase tracking-wide'>Role {i + 1}</span>
                    {experienceList.length > 1 && (
                        <button onClick={() => removeExperienceItem(exp.id)} className='text-[11px] text-[#A6503E] hover:underline'>
                            Remove
                        </button>
                    )}
                </div>
                <div className='mb-3.5'>
                    <label className={labelClass}>Company</label>
                    <input className={inputClass} value={exp.company} onChange={updateExperienceItem(exp.id, 'company')} placeholder='Vantage Labs' />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5'>
                    <div>
                        <label className={labelClass}>Role</label>
                        <input className={inputClass} value={exp.role} onChange={updateExperienceItem(exp.id, 'role')} placeholder='Senior Product Designer' />
                    </div>
                    <div>
                        <label className={labelClass}>Dates</label>
                        <input className={inputClass} value={exp.dates} onChange={updateExperienceItem(exp.id, 'dates')} placeholder='2022–Present' />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                        className={`${inputClass} min-h-[70px] resize-y`}
                        value={exp.description}
                        onChange={updateExperienceItem(exp.id, 'description')}
                        placeholder='Led end-to-end product design for...'
                    />
                </div>
            </div>
        ))}
        <button onClick={addExperienceItem} className='text-sm font-medium text-[#C98A3E] hover:text-[#B67B33] text-left'>
            + Add another role
        </button>
    </div>
)}
                        {activeTab === 'Education' && (
                            <div className='flex flex-col gap-5'>
                                {education.map((edu, i) => (
                                    <div key={edu.id} className={i !== 0 ? 'pt-5 border-t border-[#DBDCD3]' : ''}>
                                        <div className='flex justify-between items-center mb-3'>
                                            <span className='text-[11px] font-mono text-[#3C4A5E] uppercase tracking-wide'>School {i + 1}</span>
                                            {education.length > 1 && (
                                                <button onClick={() => removeEducation(edu.id)} className='text-[11px] text-[#A6503E] hover:underline'>
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className='mb-3.5'>
                                            <label className={labelClass}>School</label>
                                            <input className={inputClass} value={edu.school} onChange={updateEducation(edu.id, 'school')} placeholder='UC Davis' />
                                        </div>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
                                            <div>
                                                <label className={labelClass}>Degree</label>
                                                <input className={inputClass} value={edu.degree} onChange={updateEducation(edu.id, 'degree')} placeholder='B.A. Design' />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Dates</label>
                                                <input className={inputClass} value={edu.dates} onChange={updateEducation(edu.id, 'dates')} placeholder='2015–2019' />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addEducation} className='text-sm font-medium text-[#C98A3E] hover:text-[#B67B33] text-left'>
                                    + Add another school
                                </button>
                            </div>
                        )}
                       {activeTab === 'Skills' && (
    <div className='flex flex-col gap-3'>
        {skillsList.map((skill, i) => (
            <div key={skill.id} className='flex items-center gap-2.5'>
                <input
                    className={inputClass}
                    value={skill.name}
                    onChange={updateSkillItem(skill.id)}
                    placeholder='e.g. Figma'
                />
                {skillsList.length > 1 && (
                    <button onClick={() => removeSkillItem(skill.id)} className='text-[11px] text-[#A6503E] hover:underline shrink-0'>
                        Remove
                    </button>
                )}
            </div>
        ))}
        <button onClick={addSkillItem} className='text-sm font-medium text-[#C98A3E] hover:text-[#B67B33] text-left mt-1'>
            + Add another skill
        </button>
    </div>
)}
                </div>
                </div>

                {/* right — live preview */}
                <div className='bg-white border border-[#DBDCD3] rounded-md p-8 lg:sticky lg:top-5 h-fit'>
                    <h2 className='font-serif text-xl font-semibold text-[#0F1A2B]'>{formData.name}</h2>
                    <p className='text-[12.5px] text-[#3C4A5E] mb-4'>{formData.title} · {formData.location}</p>
                    <p className='text-[13px] text-[#2B333F] leading-relaxed'>{formData.summary}</p>


                    <div className='text-[10.5px] font-mono uppercase tracking-wide text-[#C98A3E] mt-5 mb-2'>
                        EXPERIENCE
                    </div>
                    <p className='text-[13px] text-[#2B333F] leading-relaxed'>{formData.experience}</p>

                    <div className='text-[10.5px] font-mono uppercase tracking-wide text-[#C98A3E] mt-5 mb-2'>
                        Skills
                    </div>
                    <p className='text-[13px] text-[#2B333F] leading-relaxed'>{formData.skills}</p>

                </div>

            </div>
            </div>
    ) 
}     

export default Builder