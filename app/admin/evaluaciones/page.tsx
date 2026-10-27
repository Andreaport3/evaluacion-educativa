import { cookies } from 'next/headers'
import Link from 'next/link'
import { EvaluationStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ADMIN_SESSION_TOKEN } from '@/lib/admin-session'
import { Button } from '@/components/ui/button'
import { approveEvaluation, rejectEvaluation, setAdminSession } from './actions'

async function getPendingEvaluations() {
  return prisma.evaluation.findMany({
    where: { status: EvaluationStatus.PENDING_REVIEW },
    orderBy: { createdAt: 'desc' },
    include: {
      professorCourse: {
        include: {
          professor: { select: { name: true } },
          course: { select: { name: true } },
        },
      },
      ratings: true,
    },
  })
}

export default async function AdminEvaluationsPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value

  if (session !== ADMIN_SESSION_TOKEN) {
    return (
      <main className="min-h-screen bg-[#f6f8f6] px-5 py-12 text-[#183b56]">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d9499]">
            Moderación
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Acceso restringido</h1>
          <p className="mt-3 text-[#607b72]">
            Esta vista solo está disponible para administradores.
          </p>

          <form action={setAdminSession} className="mt-6">
            <Button type="submit" className="rounded-xl bg-[#183b56] text-white hover:bg-[#275875]">
              Entrar como administrador
            </Button>
          </form>

          <Link href="/" className="mt-5 inline-block text-sm font-medium text-[#183b56] underline underline-offset-4">
            Volver al inicio
          </Link>
        </div>
      </main>
    )
  }

  const evaluations = await getPendingEvaluations()

  return (
    <main className="min-h-screen bg-[#f6f8f6] px-5 py-10 text-[#183b56]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d9499]">
              Panel administrativo
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Moderación de evaluaciones</h1>
          </div>

          <div className="flex gap-3">
            <Link href="/" className="inline-flex items-center rounded-xl border border-[#dfe7e3] bg-white px-4 py-2 text-sm font-medium text-[#183b56] hover:bg-[#eef4f1]">
              Volver al dashboard
            </Link>
          </div>
        </div>

        {evaluations.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-[#d6dfde] bg-white p-8 text-center">
            <p className="text-lg font-medium">No hay evaluaciones pendientes.</p>
            <p className="mt-2 text-[#607b72]">Cuando llegue una nueva reseña, aparecerá aquí.</p>
          </section>
        ) : (
          <div className="space-y-4">
            {evaluations.map((evaluation) => {
              const average =
                evaluation.ratings.length > 0
                  ? Number(
                      (
                        evaluation.ratings.reduce((sum, rating) => sum + rating.score, 0) /
                        evaluation.ratings.length
                      ).toFixed(1),
                    )
                  : 0

              return (
                <article key={evaluation.id} className="rounded-3xl border border-[#dfe7e3] bg-white p-6 shadow-[0_8px_24px_rgba(24,59,86,0.045)]">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d9499]">
                          Evaluación pendiente
                        </p>
                        <h2 className="mt-2 text-xl font-semibold">
                          {evaluation.professorCourse.professor.name}
                        </h2>
                      </div>

                      <div className="flex flex-wrap gap-2 text-sm text-[#607b72]">
                        <span className="rounded-full bg-[#eef5f1] px-3 py-1 font-medium text-[#2d5d59]">
                          {evaluation.professorCourse.course.name}
                        </span>
                        <span className="rounded-full bg-[#f1f5f3] px-3 py-1">
                          {evaluation.isAnonymous ? 'Anónima' : 'Identificada'}
                        </span>
                        <span className="rounded-full bg-[#f1f5f3] px-3 py-1">
                          {average}/5 promedio
                        </span>
                      </div>

                      <div className="grid gap-2 text-sm text-[#405b64] sm:grid-cols-2">
                        {evaluation.ratings.map((rating) => (
                          <div key={rating.id} className="rounded-xl bg-[#f7f9f8] px-3 py-2">
                            <span className="font-medium">
                              {rating.criterion.replace('_', ' ').toLowerCase()}
                            </span>
                            <span className="ml-2 text-[#183b56]">{rating.score}/5</span>
                          </div>
                        ))}
                      </div>

                      {evaluation.comment && (
                        <div className="rounded-2xl border border-[#edf1ef] bg-[#fafcfb] p-4 text-sm leading-6 text-[#405b64]">
                          “{evaluation.comment}”
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                      <form action={approveEvaluation.bind(null, evaluation.id)}>
                        <Button type="submit" className="w-full rounded-xl bg-[#1d7a56] text-white hover:bg-[#1a6448]">
                          Aprobar
                        </Button>
                      </form>

                      <form action={rejectEvaluation.bind(null, evaluation.id)}>
                        <Button type="submit" variant="outline" className="w-full border-[#dfe7e3] text-[#183b56] hover:bg-[#eef4f1]">
                          Rechazar
                        </Button>
                      </form>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
