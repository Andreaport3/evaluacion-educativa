import { PrismaClient } from '@prisma/client'
import { mockTeachers } from '../src/data/mockData.js'

const prisma = new PrismaClient()

async function main() {
  for (const teacher of mockTeachers) {
    const university = await prisma.university.upsert({
      where: { name: teacher.universidad },
      update: {},
      create: { name: teacher.universidad },
    })

    const professor = await prisma.professor.upsert({
      where: {
        universityId_name: {
          universityId: university.id,
          name: teacher.nombre,
        },
      },
      update: {},
      create: {
        id: teacher.professorId,
        name: teacher.nombre,
        universityId: university.id,
      },
    })

    const course = await prisma.course.upsert({
      where: {
        universityId_name: {
          universityId: university.id,
          name: teacher.materia,
        },
      },
      update: {},
      create: {
        id: teacher.courseId,
        name: teacher.materia,
        universityId: university.id,
      },
    })

    await prisma.professorCourse.upsert({
      where: {
        professorId_courseId: {
          professorId: professor.id,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        professorId: professor.id,
        courseId: course.id,
      },
    })
  }
}

main()
  .catch((error: unknown) => {
    console.error('Error al cargar los datos iniciales:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
