import { db } from 'src/lib/db'

const toMonthIndex = (month) =>
  new Date(`${new Date().getFullYear()} ${month}`).getMonth()

export const daysByProjectMonth = ({ project, month }) => {
  return db.day.findMany({
    where: {
      projectName: project,
      date: {
        gte: new Date(2020, toMonthIndex(month)),
        lte: new Date(2020, toMonthIndex(month) + 1, 0),
      },
    },
  })
}

export const createDay = ({ project, date }) => {
  return db.day.create({
    data: {
      project: {
        connect: {
          name: project,
        },
      },
      date,
    },
  })
}

export const createDayWithNotes = ({ project, date, notes }) => {
  return db.day.create({
    data: {
      project: {
        connect: {
          name: project,
        },
      },
      date,
      hasEntry: false,
      notes,
    },
  })
}

export const toggleHasEntry = async ({ project, date }) => {
  let day = await db.day.findOne({
    where: {
      projectName_date: {
        projectName: project,
        date,
      },
    },
  })

  if (day) {
    return db.day.update({
      where: {
        projectName_date: {
          projectName: project,
          date,
        },
      },
      data: {
        hasEntry: !day.hasEntry,
      },
    })
  }

  return createDay({ project, date })
}

export const updateNotes = ({ project, date, notes }) => {
  return db.day.update({
    where: {
      projectName_date: {
        projectName: project,
        date,
      },
    },
    data: {
      notes,
    },
  })
}

export const Day = {
  project: (_obj, { root }) =>
    db.day.findOne({ where: { id: root.id } }).project(),
}
