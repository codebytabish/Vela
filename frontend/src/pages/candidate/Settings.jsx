/**
 * pages/candidate/Settings.jsx
 * ----------------------------
 * Account settings with five tabs: Profile | Notifications | Privacy | Connected accounts | Billing.
 *
 * Two copies of the data are kept in state:
 *   data  = what the server last saved (the truth)
 *   draft = what the form currently shows (changes while you type)
 * "Save changes" is enabled only when draft differs from data. Each tab saves just its own
 * section (profile / links / notifications / privacy) with PATCH /settings.
 * The password form is separate and uses POST /settings/password.
 */
import React, { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

// ---------- styling shortcuts ----------
const card = 'bg-white border border-[#DBDCD3] rounded-md p-6'
const inputClass =
  'w-full px-3 py-2.5 border border-[#DBDCD3] rounded-[5px] text-[13.5px] text-[#0F1A2B] bg-[#EEF0EC] focus:outline-none focus:border-[#C98A3E] transition-colors'
const labelClass = 'block text-[11.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-1.5'
const btnPrimary =
  'cursor-pointer bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-4 text-sm text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

const TABS = ['Profile', 'Notifications', 'Privacy', 'Connected accounts', 'Billing']

// Which part of the saved data each tab edits.
const SECTION_OF = {
  Profile: 'profile',
  Notifications: 'notifications',
  Privacy: 'privacy',
  'Connected accounts': 'links',
}

// Keep only the editable sections from a server response.
const pickSections = (d) => ({
  profile: d.profile,
  links: d.links,
  notifications: d.notifications,
  privacy: d.privacy,
})

// An on/off switch with a title and a hint under it.
const Toggle = ({ checked, onChange, label, hint }) => (
  <div className='flex items-start justify-between gap-6 py-4 border-b border-[#DBDCD3] last:border-b-0'>
    <div>
      <div className='text-[13.5px] font-semibold text-[#0F1A2B]'>{label}</div>
      <div className='text-xs text-[#3C4A5E] mt-0.5'>{hint}</div>
    </div>
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full shrink-0 transition-colors cursor-pointer ${checked ? 'bg-[#5C7A6E]' : 'bg-[#DBDCD3]'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`} />
    </button>
  </div>
)

const Settings = () => {
  const { setUser } = useAuth() // used to refresh the name shown in the app after saving

  const [tab, setTab] = useState('Profile')
  const [data, setData] = useState(null)     // last saved version
  const [draft, setDraft] = useState(null)   // what the form shows right now
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null) // { section, type: 'ok' | 'error', text }

  // password form (kept separate from the other settings)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwStatus, setPwStatus] = useState(null)
  const [pwBusy, setPwBusy] = useState(false)

  // Load everything once.
  useEffect(() => {
    api('/settings')
      .then((d) => { setData(d); setDraft(pickSections(d)) })
      .catch((e) => setError(e.message || 'Could not load your settings'))
      .finally(() => setLoading(false))
  }, [])

  // setField('profile', 'name') returns an onChange handler for a text input.
  const setField = (section, field) => (e) =>
    setDraft((d) => ({ ...d, [section]: { ...d[section], [field]: e.target.value } }))

  // For toggles: set a true/false value.
  const setFlag = (section, field) => (value) =>
    setDraft((d) => ({ ...d, [section]: { ...d[section], [field]: value } }))

  // Has this section been changed but not saved yet?
  const dirty = (section) => JSON.stringify(draft[section]) !== JSON.stringify(data[section])

  // Save one section.
  const save = async (section) => {
    setSaving(true)
    setStatus(null)
    try {
      const d = await api('/settings', { method: 'PATCH', body: { [section]: draft[section] } })
      setData(d)
      setDraft(pickSections(d))
      // Update the name/email the rest of the app shows (greeting, header).
      if (section === 'profile' && setUser) {
        setUser((u) => ({ ...u, name: d.profile.name, email: d.profile.email }))
      }
      setStatus({ section, type: 'ok', text: 'Saved ✓' })
    } catch (e) {
      setStatus({ section, type: 'error', text: e.message || 'Could not save' })
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    setPwStatus(null)
    if (pw.next.length < 8) return setPwStatus({ type: 'error', text: 'New password must be at least 8 characters' })
    if (pw.next !== pw.confirm) return setPwStatus({ type: 'error', text: 'The new passwords do not match' })

    setPwBusy(true)
    try {
      await api('/settings/password', { method: 'POST', body: { currentPassword: pw.current, newPassword: pw.next } })
      setPw({ current: '', next: '', confirm: '' })
      setPwStatus({ type: 'ok', text: 'Password updated ✓' })
    } catch (e) {
      setPwStatus({ type: 'error', text: e.message || 'Could not change password' })
    } finally {
      setPwBusy(false)
    }
  }

  // The "Save changes" button plus its "Saved ✓" / error message.
  const saveBar = (section) => (
    <div className='flex items-center gap-3 mt-6'>
      <button onClick={() => save(section)} disabled={saving || !dirty(section)} className={btnPrimary}>
        {saving ? 'Saving…' : 'Save changes'}
      </button>
      {status?.section === section && (
        <span className={`text-xs ${status.type === 'ok' ? 'text-[#5C7A6E]' : 'text-[#A6503E]'}`}>{status.text}</span>
      )}
    </div>
  )

  if (loading) return <div className='p-5 text-sm text-[#3C4A5E]'>Loading settings…</div>
  if (!data) return <div className='p-5 text-sm text-[#A6503E]'>{error || 'Could not load settings'}</div>

  return (
    <div className='p-5'>
      <div className='mb-5 border-b border-[#DBDCD3] pb-5'>
        <h1 className='text-2xl font-serif font-bold text-[#0F1A2B]'>Settings</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Manage your account and preferences</p>
      </div>

      {/* tab buttons */}
      <div className='flex gap-1.5 mb-4 flex-wrap'>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setStatus(null) }}
            className={`text-xs px-3.5 py-2 rounded-full border transition-colors cursor-pointer ${
              tab === t ? 'bg-[#0F1A2B] text-white border-[#0F1A2B]' : 'border-[#DBDCD3] text-[#3C4A5E] hover:border-[#0F1A2B]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className={`${card} max-w-2xl`}>

        {/* ---------- Profile ---------- */}
        {tab === 'Profile' && (
          <>
            <h2 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Profile</h2>
            <div className='flex flex-col gap-4'>
              <div>
                <label className={labelClass}>Full name</label>
                <input className={inputClass} value={draft.profile.name} onChange={setField('profile', 'name')} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type='email' className={inputClass} value={draft.profile.email} onChange={setField('profile', 'email')} />
              </div>
              <div>
                <label className={labelClass}>Headline</label>
                <input
                  className={inputClass}
                  value={draft.profile.headline}
                  onChange={setField('profile', 'headline')}
                  placeholder='e.g. MERN stack developer looking for an internship'
                />
              </div>
            </div>
            {saveBar('profile')}
          </>
        )}

        {/* ---------- Notifications ---------- */}
        {tab === 'Notifications' && (
          <>
            <h2 className='font-serif text-base font-semibold text-[#0F1A2B] mb-1'>Notifications</h2>
            <Toggle
              label='New job matches'
              hint='Alert me when a role scores above 85%'
              checked={draft.notifications.jobMatches}
              onChange={setFlag('notifications', 'jobMatches')}
            />
            <Toggle
              label='Application updates'
              hint='Recruiter replies and status changes'
              checked={draft.notifications.applicationUpdates}
              onChange={setFlag('notifications', 'applicationUpdates')}
            />
            <Toggle
              label='Weekly digest'
              hint='Summary of activity and new matches'
              checked={draft.notifications.weeklyDigest}
              onChange={setFlag('notifications', 'weeklyDigest')}
            />
            <p className='text-xs text-[#3C4A5E] mt-3'>
              Your choices are saved. Email delivery is not set up yet, so no alerts are sent for now.
            </p>
            {saveBar('notifications')}
          </>
        )}

        {/* ---------- Privacy (+ password) ---------- */}
        {tab === 'Privacy' && (
          <>
            <h2 className='font-serif text-base font-semibold text-[#0F1A2B] mb-1'>Privacy</h2>
            <Toggle
              label='Visible to recruiters'
              hint='Recruiters can find your profile and resume'
              checked={draft.privacy.visibleToRecruiters}
              onChange={setFlag('privacy', 'visibleToRecruiters')}
            />
            <Toggle
              label='Show my portfolio'
              hint='Recruiters can see your case studies next to your resume'
              checked={draft.privacy.showPortfolio}
              onChange={setFlag('privacy', 'showPortfolio')}
            />
            {saveBar('privacy')}

            <div className='mt-8 pt-6 border-t border-[#DBDCD3]'>
              <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Change password</h3>
              <div className='flex flex-col gap-4'>
                <div>
                  <label className={labelClass}>Current password</label>
                  <input type='password' autoComplete='current-password' className={inputClass} value={pw.current}
                    onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>New password (min 8 characters)</label>
                  <input type='password' autoComplete='new-password' className={inputClass} value={pw.next}
                    onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Confirm new password</label>
                  <input type='password' autoComplete='new-password' className={inputClass} value={pw.confirm}
                    onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
                </div>
              </div>
              <div className='flex items-center gap-3 mt-4'>
                <button onClick={changePassword} disabled={pwBusy || !pw.current || !pw.next} className={btnPrimary}>
                  {pwBusy ? 'Updating…' : 'Update password'}
                </button>
                {pwStatus && (
                  <span className={`text-xs ${pwStatus.type === 'ok' ? 'text-[#5C7A6E]' : 'text-[#A6503E]'}`}>{pwStatus.text}</span>
                )}
              </div>
            </div>
          </>
        )}

        {/* ---------- Connected accounts (profile links) ---------- */}
        {tab === 'Connected accounts' && (
          <>
            <h2 className='font-serif text-base font-semibold text-[#0F1A2B] mb-1'>Connected accounts</h2>
            <p className='text-xs text-[#3C4A5E] mb-4'>
              Add links to your profiles so recruiters can find your work. These are saved as links, not logins.
            </p>
            <div className='flex flex-col gap-4'>
              <div>
                <label className={labelClass}>GitHub</label>
                <input className={inputClass} value={draft.links.github} onChange={setField('links', 'github')} placeholder='github.com/your-username' />
              </div>
              <div>
                <label className={labelClass}>LinkedIn</label>
                <input className={inputClass} value={draft.links.linkedin} onChange={setField('links', 'linkedin')} placeholder='linkedin.com/in/your-name' />
              </div>
            </div>
            {saveBar('links')}
          </>
        )}

        {/* ---------- Billing ---------- */}
        {tab === 'Billing' && (
          <>
            <h2 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Billing</h2>
            <div className='flex items-center justify-between border border-[#DBDCD3] rounded-md p-4'>
              <div>
                <div className='text-[13.5px] font-semibold text-[#0F1A2B]'>Current plan</div>
                <div className='text-xs text-[#3C4A5E] mt-0.5'>Everything in Vela is available on this plan.</div>
              </div>
              <span className='font-mono text-xs px-3 py-1 rounded-full bg-[#E4EAE6] text-[#5C7A6E] uppercase'>{data.plan}</span>
            </div>
            <p className='text-xs text-[#3C4A5E] mt-3'>Paid plans and invoices will appear here once billing is added.</p>
          </>
        )}
      </div>
    </div>
  )
}

export default Settings