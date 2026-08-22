export const recruiterNav = [
  {
    label: 'Overview',
    items: [{ to: '/recruiter', label: 'Dashboard', end: true }],
  },
  {
    label: 'Jobs',
    items: [
      { to: '/recuiter/create', label: 'Create job' },
      { to: '/recuiter/manage', label: 'Manage Jobs' },
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
      { to: '/recuiter/pipeline', label: 'Pipeline board' },
      { to: '/recuiter/scheduling', label: 'Interview scheduling' },
    ],
  },
  {
    label: 'Insights',
    items: [{ to: '/recruiter/analysis', label: 'Analytics' }],
  },

  {
    label: 'Account',
    items: [{ to: '/recruiter/messages', label: 'Messages' }],
    items: [{ to: '/recruiter/settings', label: 'Settings' }],
  },
]