import { Search, X } from 'lucide-react'

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative mx-auto mt-8 max-w-xl">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#76909a]"
      />

      <label htmlFor="search" className="sr-only">
        Buscar profesor o materia
      </label>

      <input
        id="search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Busca por nombre o materia..."
        className="h-14 w-full rounded-2xl border border-[#d9e2de] bg-white pl-12 pr-12 text-[15px] shadow-[0_8px_24px_rgba(24,59,86,0.05)] outline-none transition placeholder:text-[#9aa9ad] focus:border-[#8caea6] focus:ring-4 focus:ring-[#dceee8]"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#76909a] hover:bg-[#eef5f1]"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
