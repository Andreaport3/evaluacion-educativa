'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { Check, Star, X } from 'lucide-react'
import { Header } from '@/src/components/Header'
import { SearchBar } from '@/src/components/SearchBar'
import { ProfessorCard } from '@/src/components/ProfessorCard'

import { Button } from '@/components/ui/button'
import { TeacherAvatar } from '@/src/components/TeacherAvatar'
import { evaluationCriteria } from '@/src/utils/teacher'
import {
  getDashboardProfessors,
  type DashboardProfessor,
  submitEvaluation,
} from '@/app/actions/evaluaciones'

type Professor = DashboardProfessor

function Stars({
  rating,
  interactive = false,
  onChange,
}: {
  rating: number
  interactive?: boolean
  onChange?: (value: number) => void
}) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} estrella${star === 1 ? '' : 's'}`}
          aria-pressed={interactive ? rating === star : undefined}
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={
            interactive
              ? 'rounded-sm p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183b56]'
              : 'cursor-default'
          }
        >
          <Star
            className={`size-4 ${
              star <= rating
                ? 'fill-[#e3a84b] text-[#e3a84b]'
                : 'text-[#d2d8d5]'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export default function Page() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Professor | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comment, setComment] = useState('')
  const [anonymous, setAnonymous] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let ignore = false

    startTransition(async () => {
      try {
        const data = await getDashboardProfessors()
        if (!ignore) setProfessors(data)
      } catch {
        if (!ignore) setProfessors([])
      } finally {
        if (!ignore) setIsLoading(false)
      }
    })

    return () => {
      ignore = true
    }
  }, [])

  const filteredProfessors = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return professors

    return professors.filter(({ nombre, materia, universidad }) =>
      `${nombre} ${materia} ${universidad}`.toLowerCase().includes(query),
    )
  }, [search, professors])

  const selectedIndex = selected
    ? professors.findIndex((professor) => professor.professorId === selected.professorId)
    : -1

  useEffect(() => {
    if (!selected) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelected(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selected])

  function openEvaluation(professor: Professor) {
    setSelected(professor)
    setSubmitted(false)
    setSubmissionError('')
    setRatings(
      Object.fromEntries(evaluationCriteria.map(({ id }) => [id, 0])),
    )
    setComment('')
    setAnonymous(true)
  }

  function closeEvaluation() {
    setSelected(null)
  }

  function handleSubmitEvaluation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selected || isPending) return

    const values = evaluationCriteria.map(({ id }) => ratings[id] ?? 0)

    if (values.some((rating) => rating < 1 || rating > 5)) return

    startTransition(async () => {
      const result = await submitEvaluation({
        professorId: selected.professorId,
        courseId: selected.courseId,
        ratings,
        comment,
        isAnonymous: anonymous,
      })

      if (!result.success) {
        setSubmissionError(result.error)
        return
      }

      setSubmissionError('')
      setSubmitted(true)
    })
  }

  return (
    <main className="min-h-screen bg-[#f6f8f6] text-[#183b56]">
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Header />
        <SearchBar value={search} onChange={setSearch} />

        <div className="mt-12 flex items-end justify-between gap-4 border-b border-[#dfe7e3] pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d9499]">
              Directorio
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              Profesores destacados
            </h2>
          </div>
          <span className="text-sm text-[#71868d]">
            {filteredProfessors.length} resultados
          </span>
        </div>

        {isLoading ? (
          <p className="mt-12 text-center text-[#71868d]">
            Cargando profesores...
          </p>
        ) : filteredProfessors.length > 0 ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {filteredProfessors.map((professor, index) => (
              <ProfessorCard
                key={professor.id}
                professor={professor}
                index={index}
                onEvaluate={openEvaluation}
              />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-[#71868d]">
            No encontramos profesores con esa búsqueda.
          </p>
        )}
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#183b56]/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEvaluation()
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="evaluation-title"
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <TeacherAvatar
                  nombre={selected.nombre}
                  index={Math.max(selectedIndex, 0)}
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d9499]">
                    Nueva evaluación
                  </p>
                  <h2
                    id="evaluation-title"
                    className="mt-2 text-2xl font-semibold"
                  >
                    {selected.nombre}
                  </h2>
                  <p className="mt-1 text-sm text-[#71868d]">
                    {selected.materia} · {selected.universidad}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeEvaluation}
                aria-label="Cerrar ventana"
                className="rounded-full p-2 text-[#71868d] hover:bg-[#f1f5f3] hover:text-[#183b56]"
              >
                <X className="size-5" />
              </button>
            </div>

            {submitted ? (
              <div className="mt-10 rounded-2xl bg-[#eef7f2] p-7 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#4b907c] text-white">
                  <Check className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  ¡Gracias por evaluar!
                </h3>
                <p className="mt-2 text-sm text-[#607b72]">
                  Tu evaluación ha sido recibida y será publicada tras ser
                  revisada por un moderador.
                </p>
                <Button
                  onClick={closeEvaluation}
                  className="mt-6 rounded-xl bg-[#183b56] text-white hover:bg-[#275875]"
                >
                  Cerrar
                </Button>
              </div>
            ) : (
              <form
                className="mt-7 flex flex-col gap-6"
                onSubmit={handleSubmitEvaluation}
              >
                <div className="flex flex-col gap-4">
                  {evaluationCriteria.map(({ id, label }) => (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-sm font-medium text-[#405b64]">
                        {label}
                      </span>
                      <Stars
                        rating={ratings[id] ?? 0}
                        interactive
                        onChange={(value) =>
                          setRatings((current) => ({
                            ...current,
                            [id]: value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label
                    htmlFor="comment"
                    className="mb-2 block text-sm font-medium text-[#405b64]"
                  >
                    Comentario breve{' '}
                    <span className="font-normal text-[#99a8ab]">
                      (opcional)
                    </span>
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    maxLength={300}
                    rows={4}
                    placeholder="¿Qué destacarías de sus clases?"
                    className="w-full resize-none rounded-xl border border-[#d9e2de] px-4 py-3 text-sm outline-none placeholder:text-[#a3b0b2] focus:border-[#8caea6] focus:ring-4 focus:ring-[#dceee8]"
                  />
                  <p className="mt-1 text-right text-xs text-[#829398]">
                    {comment.length}/300
                  </p>
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm text-[#60727b]">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(event) => setAnonymous(event.target.checked)}
                    className="size-4 accent-[#183b56]"
                  />
                  Evaluación anónima
                </label>

                {submissionError && (
                  <p role="alert" className="text-sm text-red-700">
                    {submissionError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={
                    isPending ||
                    evaluationCriteria.some(({ id }) => !ratings[id])
                  }
                  className="h-12 rounded-xl bg-[#183b56] font-semibold text-white hover:bg-[#275875] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? 'Enviando...' : 'Enviar evaluación'}
                </Button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
