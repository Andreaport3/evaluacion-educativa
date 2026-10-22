'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Star, X } from 'lucide-react'
import { Header } from '@/src/components/Header'
import { SearchBar } from '@/src/components/SearchBar'
import { Button } from '@/components/ui/button'
import { TeacherAvatar } from '@/src/components/TeacherAvatar'
import { mockTeachers } from '@/src/data/mockData'
import { evaluationCriteria } from '@/src/utils/teacher'

type Professor = (typeof mockTeachers)[number]

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
  const [professors, setProfessors] = useState<Professor[]>(mockTeachers)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Professor | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comment, setComment] = useState('')
  const [anonymous, setAnonymous] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  const filteredProfessors = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return professors

    return professors.filter(({ nombre, materia, universidad }) =>
      `${nombre} ${materia} ${universidad}`.toLowerCase().includes(query),
    )
  }, [search, professors])

  const selectedIndex = selected
    ? professors.findIndex((professor) => professor.id === selected.id)
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
    setRatings(
      Object.fromEntries(evaluationCriteria.map(({ id }) => [id, 0])),
    )
    setComment('')
    setAnonymous(true)
  }

  function closeEvaluation() {
    setSelected(null)
  }

  function submitEvaluation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selected) return

    const values = evaluationCriteria.map(({ id }) => ratings[id] ?? 0)

    if (values.some((rating) => rating < 1 || rating > 5)) return

    const evaluationAverage =
      values.reduce((sum, rating) => sum + rating, 0) / values.length

    setProfessors((current) =>
      current.map((professor) => {
        if (professor.id !== selected.id) return professor

        const newTotal = professor.totalEvaluaciones + 1
        const newAverage =
          (professor.puntuacionPromedio * professor.totalEvaluaciones +
            evaluationAverage) /
          newTotal

        return {
          ...professor,
          totalEvaluaciones: newTotal,
          puntuacionPromedio: Number(newAverage.toFixed(2)),
        }
      }),
    )

    setSubmitted(true)
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

        {filteredProfessors.length > 0 ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {filteredProfessors.map((professor, index) => (
              <article
                key={professor.id}
                className="flex min-h-[218px] flex-col justify-between rounded-2xl border border-[#dfe8e3] bg-white p-6 shadow-[0_8px_24px_rgba(24,59,86,0.045)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(24,59,86,0.09)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <TeacherAvatar nombre={professor.nombre} index={index} />

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Star className="size-4 fill-[#e3a84b] text-[#e3a84b]" />
                        <span className="text-lg font-semibold">
                          {professor.puntuacionPromedio.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#829398]">
                        {professor.totalEvaluaciones} evaluaciones
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {professor.nombre}
                  </h3>
                  <p className="mt-1 text-sm text-[#6f838a]">
                    {professor.universidad}
                  </p>
                  <p className="mt-3 inline-flex rounded-full bg-[#eef5f1] px-3 py-1 text-xs font-medium text-[#397061]">
                    {professor.materia}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#edf1ef] pt-4">
                  <Stars rating={Math.round(professor.puntuacionPromedio)} />
                  <Button
                    onClick={() => openEvaluation(professor)}
                    className="rounded-xl bg-[#183b56] px-5 text-sm text-white hover:bg-[#275875]"
                  >
                    Evaluar
                  </Button>
                </div>
              </article>
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
                  Tu opinión ayuda a otros estudiantes.
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
                onSubmit={submitEvaluation}
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

                <Button
                  type="submit"
                  disabled={evaluationCriteria.some(
                    ({ id }) => !ratings[id],
                  )}
                  className="h-12 rounded-xl bg-[#183b56] font-semibold text-white hover:bg-[#275875] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Enviar evaluación
                </Button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
