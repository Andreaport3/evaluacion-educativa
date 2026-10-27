'use server'

import { revalidatePath } from 'next/cache'
import {
  EvaluationCriterion,
  EvaluationStatus,
} from '@prisma/client'
import { prisma } from '@/lib/prisma'

const criterionByInput = {
  calidadClase: EvaluationCriterion.CLASS_QUALITY,
  actitud: EvaluationCriterion.ATTITUDE,
  puntualidad: EvaluationCriterion.PUNCTUALITY,
  dominioTema: EvaluationCriterion.SUBJECT_MASTERY,
} as const

type CriterionInput = keyof typeof criterionByInput

type EvaluationSubmission = {
  professorId: string
  courseId: string
  ratings: Record<CriterionInput, number>
  comment: string
  isAnonymous: boolean
}

type SubmissionResult = { success: true } | { success: false; error: string }

export type DashboardProfessor = {
  id: string
  professorId: string
  courseId: string
  nombre: string
  universidad: string
  materia: string
  puntuacionPromedio: number
  totalEvaluaciones: number
}

function isEvaluationSubmission(value: unknown): value is EvaluationSubmission {
  if (!value || typeof value !== 'object') return false

  const submission = value as Record<string, unknown>
  const ratings = submission.ratings

  return (
    typeof submission.professorId === 'string' &&
    submission.professorId.length > 0 &&
    typeof submission.courseId === 'string' &&
    submission.courseId.length > 0 &&
    typeof submission.comment === 'string' &&
    submission.comment.length <= 300 &&
    typeof submission.isAnonymous === 'boolean' &&
    !!ratings &&
    typeof ratings === 'object' &&
    Object.keys(criterionByInput).every((criterion) => {
      const score = (ratings as Record<string, unknown>)[criterion]
      return (
        typeof score === 'number' &&
        Number.isInteger(score) &&
        score >= 1 &&
        score <= 5
      )
    })
  )
}

export async function getDashboardProfessors(): Promise<DashboardProfessor[]> {
  const professors = await prisma.professor.findMany({
    where: { status: 'ACTIVE' },
    include: {
      university: { select: { name: true } },
      courses: {
        include: { course: { select: { name: true } } },
      },
    },
    orderBy: { name: 'asc' },
  })

  const professorRows = await Promise.all(
    professors.map(async (professor) => {
      const evaluations = await prisma.evaluation.findMany({
        where: {
          professorId: professor.id,
          status: EvaluationStatus.PUBLISHED,
        },
        include: { ratings: true },
      })

      const course = professor.courses[0]?.course
      const totalEvaluaciones = evaluations.length
      const totalScore = evaluations.reduce(
        (sum, evaluation) =>
          sum + evaluation.ratings.reduce((ratingSum, rating) => ratingSum + rating.score, 0),
        0,
      )
      const average =
        totalEvaluaciones > 0
          ? Number((totalScore / (totalEvaluaciones * 4)).toFixed(2))
          : 0

      return {
        id: professor.id,
        professorId: professor.id,
        courseId: professor.courses[0]?.courseId ?? '',
        nombre: professor.name,
        universidad: professor.university.name,
        materia: course?.name ?? 'Sin materia',
        puntuacionPromedio: average,
        totalEvaluaciones,
      }
    }),
  )

  return professorRows
}

export async function submitEvaluation(
  value: unknown,
): Promise<SubmissionResult> {
  if (!isEvaluationSubmission(value)) {
    return {
      success: false,
      error: 'Revisa las calificaciones y el comentario antes de enviar.',
    }
  }

  try {
    const professorCourse = await prisma.professorCourse.findUnique({
      where: {
        professorId_courseId: {
          professorId: value.professorId,
          courseId: value.courseId,
        },
      },
      select: {
        professor: { select: { status: true } },
        course: { select: { status: true } },
      },
    })

    if (
      !professorCourse ||
      professorCourse.professor.status !== 'ACTIVE' ||
      professorCourse.course.status !== 'ACTIVE'
    ) {
      return {
        success: false,
        error: 'No se encontró el profesor o curso seleccionado.',
      }
    }

    await prisma.evaluation.create({
      data: {
        professorId: value.professorId,
        courseId: value.courseId,
        comment: value.comment.trim() || null,
        isAnonymous: value.isAnonymous,
        status: EvaluationStatus.PENDING_REVIEW,
        ratings: {
          create: [
            {
              criterion: EvaluationCriterion.CLASS_QUALITY,
              score: value.ratings.calidadClase,
            },
            {
              criterion: EvaluationCriterion.ATTITUDE,
              score: value.ratings.actitud,
            },
            {
              criterion: EvaluationCriterion.PUNCTUALITY,
              score: value.ratings.puntualidad,
            },
            {
              criterion: EvaluationCriterion.SUBJECT_MASTERY,
              score: value.ratings.dominioTema,
            },
          ],
        },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('No se pudo guardar la evaluación.', error)
    return {
      success: false,
      error: 'No se pudo enviar la evaluación. Inténtalo de nuevo más tarde.',
    }
  }
}

export async function approveEvaluation(evaluationId: string) {
  await prisma.evaluation.update({
    where: { id: evaluationId },
    data: {
      status: EvaluationStatus.PUBLISHED,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin/evaluaciones')
}

export async function rejectEvaluation(evaluationId: string) {
  await prisma.evaluation.update({
    where: { id: evaluationId },
    data: {
      status: EvaluationStatus.HIDDEN,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin/evaluaciones')
}
