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
        name: 'korean',
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
        notes: 'some notes',
      },
    })

    await db.day.create({
      data: {
        project: {
          connect: {
            name: 'korean',
          },
        },
        date: new Date(2020, 3, 3).toISOString(),
        notes: 'some earlier notes',
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
