import { db } from 'src/lib/db'

export const projects = () => {
  return db.project.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  })
}

export const createProject = ({ name }) => {
  return db.project.create({
    data: { name },
  })
}

export const updateProjectNameByName = ({ name, newName }) => {
  return db.project.update({
    where: {
      name,
    },
    data: {
      name: newName,
    },
  })
}

export const deleteProjectByName = async ({ name }) => {
  await db.day.deleteMany({
    where: {
      projectName: name,
    },
  })

  return db.project.delete({
    where: {
      name,
    },
  })
}

export const Project = {
  days: (_obj, { root }) =>
    db.project.findOne({ where: { id: root.id } }).days(),
}
