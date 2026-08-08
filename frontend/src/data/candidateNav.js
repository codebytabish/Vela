export const candidateNav = [
  {
    label: 'Overview',
    items: [{ to: '/candidate', label: 'Dashboard', end: true }],
  },
  {
    label: 'Resume',
    items: [
      { to: '/candidate/builder', label: 'Builder' },
      { to: '/candidate/upload', label: 'Upload & parse' },
      { to: '/candidate/improve', label: 'AI improvement' },
      { to: '/candidate/score', label: 'ATS score' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { to: '/candidate/skills', label: 'Skills graph' },
      { to: '/candidate/portfolio', label: 'Portfolio' },
      { to: '/candidate/advice', label: 'Career advice' },
    ],
  },
  {
    label: 'Jobs',
    items: [
      { to: '/candidate/search', label: 'Recommendations' },
      { to: '/candidate/detail', label: 'Job detail' },
      { to: '/candidate/applications', label: 'Applications' },
    ],
  },
  {
    label: 'Account',
    items: [{ to: '/candidate/settings', label: 'Settings' }],
  },
]