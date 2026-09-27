import React, { useState } from 'react'

const settingsNav = ['Platform', 'Admin roles', 'API & integrations', 'Audit log']

const Settings = () => {
  const [activeSection, setActiveSection] = useState('Platform')

  const [config, setConfig] = useState({
    supportEmail: 'support@vela.app',
    retention: '90 days after last activity',
  })
  const setField = (field) => (e) => setConfig({ ...config, [field]: e.target.value })

  const [moderation, setModeration] = useState({
    autoFlagListings: true,
    autoFlagPlagiarism: true,
    requireDomainVerification: true,
    maintenanceMode: false,
  })
  const toggle = (key) => setModeration({ ...moderation, [key]: !moderation[key] })

  const inputClass = 'w-full px-3 py-2.5 border border-[#DBDCD3] rounded-[5px] text-[13.5px] text-[#0F1A2B] bg-[#EEF0EC] focus:outline-none focus:border-[#C98A3E] transition-colors'
  const labelClass = 'block text-[11.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-1.5'

  const ToggleRow = ({ title, description, checked, onToggle }) => (
    <div className='flex justify-between items-center py-3.5 border-b border-[#DBDCD3] last:border-b-0'>
      <div>
        <div className='text-[13.5px] font-semibold text-[#0F1A2B]'>{title}</div>
        <div className='text-xs text-[#3C4A5E] mt-0.5'>{description}</div>
      </div>
      <button
        onClick={onToggle}
        className={`w-[38px] h-[22px] rounded-full relative shrink-0 transition-colors ${
          checked ? 'bg-[#5C7A6E]' : 'bg-[#DBDCD3]'
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-[3px] w-[16px] h-[16px] rounded-full bg-white transition-all ${
            checked ? 'left-[19px]' : 'left-[3px]'
          }`}
        />
      </button>
    </div>
  )

  return (
    <div className='p-5'>

      <div className='mb-5'>
        <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Admin settings</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Platform-level configuration</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6'>

        <div className='flex flex-col gap-0.5'>
          {settingsNav.map((item) => (
            <button
              key={item}
              onClick={() => setActiveSection(item)}
              className={`text-left text-sm px-3 py-2.5 rounded transition-colors ${
                activeSection === item
                  ? 'bg-white border border-[#DBDCD3] text-[#0F1A2B] font-semibold'
                  : 'text-[#3C4A5E] hover:bg-white/60'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>

          {activeSection === 'Platform' && (
            <>
              <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Platform configuration</h3>
              <div className='mb-4'>
                <label className={labelClass}>Support email</label>
                <input className={inputClass} value={config.supportEmail} onChange={setField('supportEmail')} />
              </div>
              <div className='mb-6'>
                <label className={labelClass}>Default resume retention</label>
                <select className={inputClass} value={config.retention} onChange={setField('retention')}>
                  <option value='90 days after last activity'>90 days after last activity</option>
                  <option value='1 year'>1 year</option>
                  <option value='Indefinite'>Indefinite</option>
                </select>
              </div>

              <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-2'>Moderation</h3>
              <div>
                <ToggleRow
                  title='Auto-flag suspicious job listings'
                  description='Salary/role mismatch and unverified companies'
                  checked={moderation.autoFlagListings}
                  onToggle={() => toggle('autoFlagListings')}
                />
                <ToggleRow
                  title='Auto-flag plagiarized resumes'
                  description='Similarity threshold: 85%+'
                  checked={moderation.autoFlagPlagiarism}
                  onToggle={() => toggle('autoFlagPlagiarism')}
                />
                <ToggleRow
                  title='Require company domain verification'
                  description='New company accounts must verify a business domain'
                  checked={moderation.requireDomainVerification}
                  onToggle={() => toggle('requireDomainVerification')}
                />
                <ToggleRow
                  title='Maintenance mode'
                  description='Show a maintenance banner platform-wide'
                  checked={moderation.maintenanceMode}
                  onToggle={() => toggle('maintenanceMode')}
                />
              </div>

              <div className='flex justify-end mt-5'>
                <button className='bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-3.5 text-sm text-white font-medium transition-colors'>
                  Save changes
                </button>
              </div>
            </>
          )}

          {(activeSection === 'Admin roles' || activeSection === 'API & integrations' || activeSection === 'Audit log') && (
            <div className='text-sm text-[#3C4A5E] py-8 text-center'>
              {activeSection} — coming soon
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Settings