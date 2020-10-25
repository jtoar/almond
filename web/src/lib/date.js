export const getCurrentMonth = () =>
  Intl.DateTimeFormat('en-US', { month: 'long' })
    .format(new Date())
    .toLowerCase()

export const toMonthIndex = (month) =>
  new Date(`${new Date().getFullYear()} ${month}`).getMonth()

export const isToday = (date) => {
  const today = new Date()
  return (
    date.getTime() ===
    new Date(2020, today.getMonth(), today.getDate()).getTime()
  )
}
