import { Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TeacherAvatar } from '@/src/components/TeacherAvatar'
import { mockTeachers } from '@/src/data/mockData'

type Professor = (typeof mockTeachers)[number]

type ProfessorCardProps = {
  professor: Professor
  index: number
  onEvaluate: (professor: Professor) => void
}

export function ProfessorCard({
  professor,
  index,
  onEvaluate,
}: ProfessorCardProps) {
  return (
    <article className="flex min-h-[218px] flex-col justify-between rounded-2xl border border-[#dfe8e3] bg-white p-6 shadow-[0_8px_24px_rgba(24,59,86,0.045)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(24,59,86,0.09)]">
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

        <h3 className="mt-5 text-lg font-semibold">{professor.nombre}</h3>

        <p className="mt-1 text-sm text-[#6f838a]">
          {professor.universidad}
        </p>

        <p className="mt-3 inline-flex rounded-full bg-[#eef5f1] px-3 py-1 text-xs font-medium text-[#397061]">
          {professor.materia}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#edf1ef] pt-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`size-4 ${
                star <= Math.round(professor.puntuacionPromedio)
                  ? 'fill-[#e3a84b] text-[#e3a84b]'
                  : 'text-[#d5ddda]'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={() => onEvaluate(professor)}
          className="rounded-xl bg-[#183b56] px-5 text-sm text-white hover:bg-[#275875]"
        >
          Evaluar
        </Button>
      </div>
    </article>
  )
}
