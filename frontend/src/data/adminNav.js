export const adminNav = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Platform dashboard', end: true }],
  },
  {
    label: 'Platform',
    items: [
      { to: '/admin/users', label: 'User management' },
      { to: '/admin/companies', label: 'Company management' },
    ],
  },
  {
    label: 'Trust & safety',
    items: [{ to: '/admin/moderation', label: 'Content moderation' }],
  },
  {
    label: 'Insights',
    items: [
      { to: '/admin/analytics', label: 'Platform analytics' },
      { to: '/admin/health', label: 'System & AI health' },
    ],
  },
  {
    label: 'Account',
    items: [{ to: '/admin/settings', label: 'Admin settings' }],
  },
]