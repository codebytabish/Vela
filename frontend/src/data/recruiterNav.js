export const recruiterNav = [
  {
    label: 'Overview',
    items: [{ to: '/recruiter', label: 'Dashboard', end: true }],
  },
  {
    label: 'Jobs',
    items: [
      { to: '/recruiter/create', label: 'Create job' },
      { to: '/recruiter/manage', label: 'Manage Jobs' },
    ],
  },
  {
    label: 'Candidates',
    items: [
      { to: '/recruiter/ranking', label: 'AI ranking' },
      { to: '/recruiter/profile', label: 'Candidate profile' },
    ],
  },
  {
    label: 'Pipeline',
    items: [
      { to: '/recruiter/pipeline', label: 'Pipeline board' },
      { to: '/recruiter/scheduling', label: 'Interview scheduling' },
    ],
  },
  {
    label: 'Insights',
    items: [{ to: '/recruiter/analysis', label: 'Analytics' }],
  },

  {
    label: 'Account',

     label: 'Account',
    items: [
      { to: '/recruiter/messages', label: 'Messages' },
      { to: '/recruiter/settings', label: 'Settings' },
    ],
  },
]