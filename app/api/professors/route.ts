import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const professors = await prisma.professor.findMany({
      where: { status: 'ACTIVE' },
      include: {
        university: true,
        courses: {
          include: {
            course: true,
            evaluations: {
              where: { status: 'PUBLISHED' },
              include: { ratings: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    const directory = professors.flatMap((professor) =>
      professor.courses.map((professorCourse) => {
        const scores = professorCourse.evaluations.flatMap((evaluation) =>
          evaluation.ratings.map((rating) => rating.score),
        )

        return {
          id: professor.id,
          courseId: professorCourse.courseId,
          nombre: professor.name,
          universidad: professor.university.name,
          materia: professorCourse.course.name,
          puntuacionPromedio: scores.length
            ? Number(
                (
                  scores.reduce((sum, score) => sum + score, 0) /
                  scores.length
                ).toFixed(2),
              )
            : 0,
          totalEvaluaciones: professorCourse.evaluations.length,
        }
      }),
    )

    return Response.json(directory)
  } catch (error) {
    console.error('No se pudo cargar el directorio de profesores.', error)
    return Response.json(
      { error: 'No se pudo cargar el directorio de profesores.' },
      { status: 500 },
    )
  }
}
