import { db } from 'src/lib/db'

export const days = () => {
  return db.day.findMany()
}

export const day = ({ id }) => {
  return db.day.findOne({
    where: { id },
  })
}

export const createDay = ({ input }) => {
  return db.day.create({
    data: input,
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
