export const evaluationCriteria = [
  { id: 'calidadClase', label: 'Calidad de la clase' },
  { id: 'actitud', label: 'Actitud' },
  { id: 'puntualidad', label: 'Puntualidad' },
  { id: 'dominioTema', label: 'Dominio del tema' },
] as const

export function getTeacherInitials(nombre: string) {
  return nombre
    .replace(/^(Dra?\.|Mtra?\.)\s*/, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
