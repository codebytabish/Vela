import React from 'react'
import { useState } from 'react'
    const labelClass = "block text-[11.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-1.5"
        const inputClass = "w-full px-3 py-2.5 border border-[#DBDCD3] rounded-[5px] text-[13.5px] text-[#0F1A2B] bg-[#EEF0EC] focus:outline-none focus:border-[#C98A3E] transition-colors"



const CreateJobs = () => {
      const [formData, setFormData] = useState({
        title:"Senior Product Designer",
        department:"Design",
        location:"Remote (US)",
        salary:"$145,000 – $170,000",
        employment:"Full-Time",
        description:"Lead end-to-end design for our patient scheduling platform. Partner with engineering and clinical ops, run discovery research, and own our design system.",
        skills:"Figma, Design systems, 5+ years product design"
      })

          const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value })


          const [weights, setWeights] = useState({
  skillsMatch: 70,
  yearsExperience: 50,
  domainRelevance: 50,
})



  return (
    <div className='p-5'>
         <div className='flex justify-between items-center sticky top-0 z-10 pb-5 border-b border-[#DBDCD3] bg-[#EEF0EC]  mb-5'>
        <div>
          <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Create job</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>Vela will start ranking candidates as soon as it's published</p>
        </div>
         <div className='flex gap-2.5'>
        <button className=' cursor-pointer border bg-[#FFFFFF]  border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2 px-3.5 text-sm text-[#0F1A2B] transition-colors'>
                        Save draft
         </button>
         <button className='text-sm text-white bg-[#C98A3E] hover:bg-[#B67B33] cursor-pointer rounded py-2 px-3.5 transition-colors font-semibold'>
          Publish Role
        </button>
        </div>
    </div>


            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        <div className='bg-white border border-[#DBDCD3] rounded-md p-5'>

                             <div>
                                                        <h1 className='font-medium pb-4'>Role Details</h1>
                                                    </div>

                                                    <form>
                                                 <div className='mb-4'  >   
                                      <label className={labelClass}>JOb TITLE</label>
                                      <input className={inputClass} value={formData.title} onChange={set('title')}/>
                                      </div>


                           <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4'>
                                    <div>
                                        <label className={labelClass}>DEPARTMENT</label>
                                        <input className={inputClass} value={formData.department} onChange={set('department')} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Location</label>
                                        <input className={inputClass} value={formData.location} onChange={set('location')} />
                                    </div>
                                </div>



                                 <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4'>
                                    <div>
                                        <label className={labelClass}>SALARY RANGE</label>
                                        <input className={inputClass} value={formData.salary} onChange={set('salary')}  />
                                    </div>
                                    <div>
                                        <label className={labelClass}>EMPLOYMENT TYPE</label>
                                        <input className={inputClass} value={formData.employment} onChange={set('employment')}/>
                                    </div>
                                </div>


                                <div className='mb-4'>
                                  <label className={labelClass}>DESCRIPTION</label>
                                  <textarea
                                  value={formData.description}
                                  className={`${inputClass} min-h-[70px] resize-y`}
                                  onChange={set('description')}
                                  />

                                </div>

                                <div className='mb-4'>
                                  <label className={labelClass}>Required Skill</label>
                                    <input className={inputClass} value={formData.skills} onChange={set('skills')} />
                                        
                                </div>





                                      

                                                    </form>
                            
                        </div>

                                                <div className='bg-white border border-[#DBDCD3] rounded-md p-5'>
                                                    <div>
                                                        <h1 className='font-fraunces text-[16px] text-[#0F1A2B] font-semibold mb-4'>Ranking Weights</h1>
                                                        <p className='text-[13px] text-[#3C4A5E] mb-4'>
                                                          Tune how the AI weighs each factor when ranking applicants for this role.
                                                        </p>
                                                            
                                                    </div>
                                                        <div className='mb-4'>
                                                          <div className='mb-1.5'>
                                                          <label className='text-[#3C4A5E] font-jetbrains mb-4'>   Skills match </label>
                                                              </div>
                                                             <input type='range'
                                                          className='w-full accent-[#094dee] [#EEF0EC] mb-4'
                                                           value={weights.skillsMatch}/>
                                                        </div>
                                                        


                                                        
                                                           

                                                             <div className='mb-4'>
                                                              <div className='mb-1.5'>
                                                          <label className='text-[#3C4A5E] font-jetbrains'> Years of experience </label>
                                                           </div>
                                                          <input type='range'
                                                          className='w-full accent-[#094dee]  mb-4'
                                                           value={weights.yearsExperience}/>
                                                        </div>
                                                      


                                                        <div className='mb-4'>
                                                          <div className='mb-1.5'>
                                                          <label className='text-[#3C4A5E] font-jetbrains'>Domain relevance </label>
                                                         </div>

                                                           <input type='range'
                                                          className='w-full accent-[#094dee] bg-white mb-4'
                                                           value={weights.domainRelevance}/>
                                                        </div>
                                                      
                                                           
                                                    </div>


                </div>






    </div>
  )
}

export default CreateJobs