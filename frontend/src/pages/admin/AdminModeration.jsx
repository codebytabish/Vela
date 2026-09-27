import React, { useState } from 'react'

const initialFlags = [
  {
    id: 1,
    title: 'Job listing flagged — "Remote Data Entry, $85/hr"',
    subtitle: 'Posted by unverified account · reported 3x for suspected scam',
    reason: 'Auto-flag reason: salary-to-role mismatch, no company verification on file.',
    priority: 'High',
    actionLabel: 'Remove',
  },
  {
    id: 2,
    title: 'Resume flagged for suspected plagiarism',
    subtitle: 'Candidate account · matched against 2 other profiles',
    reason: 'Auto-flag reason: 91% text similarity to an existing profile in the database.',
    priority: 'High',
    actionLabel: 'Suspend',
  },
  {
    id: 3,
    title: 'Message reported by candidate',
    subtitle: 'Recruiter account, Loom & Co. · reported for inappropriate contact',
    reason: 'Reporter note: "Recruiter asked for payment to \'guarantee\' an interview."',
    priority: 'High',
    actionLabel: 'Suspend',
  },
  {
    id: 4,
    title: 'Company profile pending verification',
    subtitle: '"Apex Consulting Group" · new account, no verified domain',
    reason: 'Auto-flag reason: domain does not match a registered business record.',
    priority: 'Medium',
    actionLabel: 'Verify',
  },
]

const priorityStyle = {
  High: 'bg-[#F2E0DC] text-[#A6503E]',
  Medium: 'bg-[#F5E7D2] text-[#8A5D22]',
}

const Moderation = () => {
  const [flags, setFlags] = useState(initialFlags)

  const dismiss = (id) => setFlags(flags.filter((f) => f.id !== id))

  const highCount = flags.filter((f) => f.priority === 'High').length

  return (
    <div className='p-5'>

      <div className='flex justify-between items-center mb-5'>
        <div>
          <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Content moderation</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>{flags.length} items pending review</p>
        </div>
        <span className='inline-flex items-center gap-1.5 text-[11px] font-mono bg-[#F2E0DC] text-[#A6503E] rounded-full px-2.5 py-1'>
          <span className='w-1.5 h-1.5 rounded-full bg-[#A6503E]' />
          {highCount} high priority
        </span>
      </div>

      <div className='flex flex-col gap-3'>
        {flags.map((flag) => (
          <div key={flag.id} className='bg-white border border-[#DBDCD3] rounded-md p-5 flex flex-col sm:flex-row sm:justify-between gap-4'>
            <div className='flex-1'>
              <div className='font-semibold text-[13.5px] text-[#0F1A2B]'>{flag.title}</div>
              <div className='text-xs text-[#3C4A5E] mt-1'>{flag.subtitle}</div>
              <div className='text-xs text-[#3C4A5E] mt-2.5 p-2.5 bg-[#EEF0EC] rounded-[5px]'>{flag.reason}</div>
            </div>
            <div className='flex gap-2 shrink-0 items-start'>
              <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full shrink-0 ${priorityStyle[flag.priority]}`}>
                {flag.priority}
              </span>
              <button
                onClick={() => dismiss(flag.id)}
                className='text-xs border border-[#DBDCD3] hover:border-[#0F1A2B] rounded px-3 py-1.5 text-[#0F1A2B] transition-colors'
              >
                Dismiss
              </button>
              <button
                onClick={() => dismiss(flag.id)}
                className='text-xs bg-[#A6503E] hover:bg-[#8C4232] rounded px-3 py-1.5 text-white font-medium transition-colors'
              >
                {flag.actionLabel}
              </button>
            </div>
          </div>
        ))}

        {flags.length === 0 && (
          <div className='bg-white border border-[#DBDCD3] rounded-md p-10 text-center text-sm text-[#3C4A5E]'>
            Queue is clear — nothing pending review.
          </div>
        )}
      </div>

    </div>
  )
}

export default Moderation