import { db } from 'src/lib/db'

export const projects = () => {
  return db.project.findMany()
}

export const createProject = ({ name }) => {
  return db.project.create({
    data: { name },
  })
}

export const Project = {
  days: (_obj, { root }) =>
    db.project.findOne({ where: { id: root.id } }).days(),
}
