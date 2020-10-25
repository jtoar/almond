export const getCurrentMonth = () =>
  Intl.DateTimeFormat('en-US', { month: 'long' })
    .format(new Date())
    .toLowerCase()
