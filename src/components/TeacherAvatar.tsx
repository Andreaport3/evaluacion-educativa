import { getTeacherInitials } from '@/src/utils/teacher'

const avatarColors = ['bg-[#dceee8]', 'bg-[#e8e1f5]', 'bg-[#f7e5cf]', 'bg-[#dce9f3]']

export function TeacherAvatar({ nombre, index }: { nombre: string; index: number }) {
  return (
    <div
      className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${avatarColors[index % avatarColors.length]} text-sm font-semibold text-[#183b56]`}
      aria-hidden="true"
    >
      {getTeacherInitials(nombre)}
    </div>
  )
}
