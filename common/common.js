const isToday = (date) => {
  const today = new Date()
  return (
    date.getTime() ===
    new Date(2020, today.getMonth(), today.getDate()).getTime()
  )
}

const toMonthIndex = (month) =>
  new Date(`${new Date().getFullYear()} ${month}`).getMonth()

module.exports = { isToday, toMonthIndex }
