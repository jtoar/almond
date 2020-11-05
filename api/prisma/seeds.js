/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client')
const dotenv = require('dotenv')
const d3 = require('d3-time')

dotenv.config()
const db = new PrismaClient()

async function main() {
  const projects = await db.project.findMany()

  if (!projects.length) {
    await db.project.create({
      data: {
        name: 'hello',
      },
    })
    await db.project.create({
      data: {
        name: 'korean',
      },
    })
    await db.project.create({
      data: {
        name: 'youth',
      },
    })
    await db.project.create({
      data: {
        name: 'redwood',
      },
    })
    await db.project.create({
      data: {
        name: 'calmond',
      },
    })
  }

  console.log(projects)

  const days = await db.day.findMany()

  if (!days.length) {
    await db.day.create({
      data: {
        project: {
          connect: {
            name: 'korean',
          },
        },
        date: d3.timeDay().toISOString(),
        notes: 'lingq',
      },
    })
  }

  console.log(days)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.$disconnect()
  })
