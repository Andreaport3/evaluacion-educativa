import { EvaluationCriterion } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const criteria = {
  calidadClase: EvaluationCriterion.CLASS_QUALITY,
  actitud: EvaluationCriterion.ATTITUDE,
  puntualidad: EvaluationCriterion.PUNCTUALITY,
  dominioTema: EvaluationCriterion.SUBJECT_MASTERY,
} as const

const blockedTerms = ['idiota', 'estupido', 'imbecil', 'inutil', 'no sirves', 'pendejo']


function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(/\s+/)
}

function containsBlockedTerm(value: string) {
  const words = normalizeText(value)

  return blockedTerms.some((term) => {
    const blockedWords = normalizeText(term)

    return words.some((_, index) =>
      blockedWords.every((word, offset) => words[index + offset] === word),
    )
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'El contenido enviado no es válido.' }, { status: 400 })
  }

  if (!isRecord(body)) {
    return Response.json({ error: 'El contenido enviado no es válido.' }, { status: 400 })
  }

  const { professorId, courseId, ratings, comment, isAnonymous } = body
  const criterionIds = Object.keys(criteria)

  if (
    typeof professorId !== 'string' ||
    typeof courseId !== 'string' ||
    !isRecord(ratings) ||
    criterionIds.some(
      (criterion) =>
        !Number.isInteger(ratings[criterion]) ||
        (ratings[criterion] as number) < 1 ||
        (ratings[criterion] as number) > 5,
    ) ||
    Object.keys(ratings).some((criterion) => !criterionIds.includes(criterion)) ||
    (comment !== null &&
      comment !== undefined &&
      (typeof comment !== 'string' || comment.length > 300)) ||
    typeof isAnonymous !== 'boolean'
  ) {
    return Response.json(
      { error: 'Revisa las calificaciones y los datos de la evaluación.' },
      { status: 400 },
    )
  }

  if (typeof comment === 'string' && containsBlockedTerm(comment)) {
    return Response.json(
      {
        error:
          'El comentario contiene palabras no permitidas. La evaluación no se guardó.',
      },
      { status: 400 },
    )
  }

  const professorCourse = await prisma.professorCourse.findFirst({
    where: {
      professorId,
      courseId,
      professor: { status: 'ACTIVE' },
      course: { status: 'ACTIVE' },
    },
  })

  if (!professorCourse) {
    return Response.json(
      { error: 'No se encontró el profesor o la materia seleccionada.' },
      { status: 404 },
    )
  }

  try {
    await prisma.evaluation.create({
      data: {
        professorId,
        courseId,
        comment: typeof comment === 'string' && comment.trim() ? comment.trim() : null,
        isAnonymous,
        status: 'PUBLISHED',
        ratings: {
          create: criterionIds.map((criterion) => ({
            criterion: criteria[criterion as keyof typeof criteria],
            score: ratings[criterion] as number,
          })),
        },
      },
    })

    return Response.json({ message: 'La evaluación se guardó correctamente.' }, { status: 201 })
  } catch (error) {
    console.error('No se pudo guardar la evaluación.', error)
    return Response.json(
      { error: 'No se pudo guardar la evaluación. Inténtalo de nuevo.' },
      { status: 500 },
    )
  }
}
