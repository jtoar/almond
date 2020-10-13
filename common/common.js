const toMonthIndex = (month) =>
  new Date(`${new Date().getFullYear()} ${month}`).getMonth()

module.exports = { toMonthIndex }
