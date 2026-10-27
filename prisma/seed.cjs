const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const teachers = [
  {
    name: 'Dra. Ana Martínez',
    university: 'Universidad Nacional',
    course: 'Cálculo Diferencial',
  },
  {
    name: 'Dr. Carlos Ramírez',
    university: 'Instituto Tecnológico',
    course: 'Programación Web',
  },
  {
    name: 'Mtra. Laura Gómez',
    university: 'Universidad del Valle',
    course: 'Diseño de Interfaces',
  },
  {
    name: 'Dr. Miguel Torres',
    university: 'Universidad Metropolitana',
    course: 'Física General',
  },
]

async function main() {
  for (const teacher of teachers) {
    const university = await prisma.university.upsert({
      where: { name: teacher.university },
      update: {},
      create: { name: teacher.university },
    })

    const professor = await prisma.professor.upsert({
      where: {
        universityId_name: { universityId: university.id, name: teacher.name },
      },
      update: {},
      create: { name: teacher.name, universityId: university.id },
    })

    const course = await prisma.course.upsert({
      where: {
        universityId_name: { universityId: university.id, name: teacher.course },
      },
      update: {},
      create: { name: teacher.course, universityId: university.id },
    })

    await prisma.professorCourse.upsert({
      where: {
        professorId_courseId: {
          professorId: professor.id,
          courseId: course.id,
        },
      },
      update: {},
      create: { professorId: professor.id, courseId: course.id },
    })
  }

  console.log('Profesores y materias iniciales listos.')
}

main()
  .catch((error) => {
    console.error('No se pudieron cargar los datos iniciales.', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
