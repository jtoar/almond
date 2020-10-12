import { db } from 'src/lib/db'

const toMonthIndex = (month) => {
  return new Date(`${new Date().getFullYear()} ${month}`).getMonth()
}

export const days = ({ projectName, month }) => {
  return db.day.findMany({
    where: {
      projectName,
      date: {
        gte: new Date(2020, toMonthIndex(month)),
        lte: new Date(2020, toMonthIndex(month) + 1, 0),
      },
    },
  })
}

export const day = ({ projectName, date }) => {
  return db.day.findOne({
    where: {
      projectName_date: {
        projectName,
        date,
      },
    },
  })
}

export const createDay = ({ input }) => {
  const { projectName, ...rest } = input

  return db.day.create({
    data: {
      project: {
        connect: {
          name: projectName,
        },
      },
      ...rest,
    },
  })
}

export const updateDay = ({ id, input }) => {
  return db.day.update({
    data: input,
    where: { id },
  })
}

export const deleteDay = ({ id }) => {
  return db.day.delete({
    where: { id },
  })
}

export const Day = {
  project: (_obj, { root }) =>
    db.day.findOne({ where: { id: root.id } }).project(),
}
