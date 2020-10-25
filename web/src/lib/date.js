export const getCurrentMonth = () =>
  Intl.DateTimeFormat('en-US', { month: 'long' })
    .format(new Date())
    .toLowerCase()

export const toMonthIndex = (month) =>
  new Date(`${new Date().getFullYear()} ${month}`).getMonth()
