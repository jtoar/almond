import { db } from 'src/lib/db'
import { toMonthIndex } from 'common/common'

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

export const dayByProjectDate = ({ project, date }) => {
  return db.day.findOne({
    where: {
      projectName_date: {
        projectName: project,
        date,
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

export const toggleHasEntry = async ({ project, date }) => {
  const { hasEntry } = await db.day.findOne({
    where: {
      projectName_date: {
        projectName: project,
        date,
      },
    },
  })

  return db.day.update({
    where: {
      projectName_date: {
        projectName: project,
        date,
      },
    },
    data: {
      hasEntry: !hasEntry,
    },
  })
}

export const Day = {
  project: (_obj, { root }) =>
    db.day.findOne({ where: { id: root.id } }).project(),
}
