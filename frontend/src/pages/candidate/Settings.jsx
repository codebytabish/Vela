import React, { useState } from 'react'

const settingsNav = ['Profile', 'Notifications', 'Privacy', 'Connected accounts', 'Billing']

const Settings = () => {
  const [activeSection, setActiveSection] = useState('Profile')

  const [profile, setProfile] = useState({
    name: 'Marisol Ferreira',
    email: 'marisol.f@email.com',
    headline: 'Senior Product Designer · Healthcare & SaaS',
  })
  const setProfileField = (field) => (e) => setProfile({ ...profile, [field]: e.target.value })

  const [notifications, setNotifications] = useState({
    newMatches: true,
    applicationUpdates: true,
    weeklyDigest: false,
  })
  const toggleNotification = (key) =>
    setNotifications({ ...notifications, [key]: !notifications[key] })

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
        <h1 className='text-2xl md:text-3xl font-medium text-[#0F1A2B]'>Settings</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Manage your account and preferences</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6'>

        {/* settings nav */}
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

        {/* content */}
        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>

          {activeSection === 'Profile' && (
            <>
              <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Profile</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4'>
                <div>
                  <label className={labelClass}>Full name</label>
                  <input className={inputClass} value={profile.name} onChange={setProfileField('name')} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input className={inputClass} value={profile.email} onChange={setProfileField('email')} />
                </div>
              </div>
              <div className='mb-6'>
                <label className={labelClass}>Headline</label>
                <input className={inputClass} value={profile.headline} onChange={setProfileField('headline')} />
              </div>

              <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-2'>Notifications</h3>
              <div>
                <ToggleRow
                  title='New job matches'
                  description='Alert me when a role scores above 85%'
                  checked={notifications.newMatches}
                  onToggle={() => toggleNotification('newMatches')}
                />
                <ToggleRow
                  title='Application updates'
                  description='Recruiter replies and status changes'
                  checked={notifications.applicationUpdates}
                  onToggle={() => toggleNotification('applicationUpdates')}
                />
                <ToggleRow
                  title='Weekly digest'
                  description='Summary of activity and new matches'
                  checked={notifications.weeklyDigest}
                  onToggle={() => toggleNotification('weeklyDigest')}
                />
              </div>

              <div className='flex justify-end mt-5'>
                <button className='bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-3.5 text-sm text-white font-medium transition-colors'>
                  Save changes
                </button>
              </div>
            </>
          )}

          {activeSection === 'Notifications' && (
            <>
              <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-2'>Notifications</h3>
              <div>
                <ToggleRow
                  title='New job matches'
                  description='Alert me when a role scores above 85%'
                  checked={notifications.newMatches}
                  onToggle={() => toggleNotification('newMatches')}
                />
                <ToggleRow
                  title='Application updates'
                  description='Recruiter replies and status changes'
                  checked={notifications.applicationUpdates}
                  onToggle={() => toggleNotification('applicationUpdates')}
                />
                <ToggleRow
                  title='Weekly digest'
                  description='Summary of activity and new matches'
                  checked={notifications.weeklyDigest}
                  onToggle={() => toggleNotification('weeklyDigest')}
                />
              </div>
            </>
          )}

          {(activeSection === 'Privacy' || activeSection === 'Connected accounts' || activeSection === 'Billing') && (
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