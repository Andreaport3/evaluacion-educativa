import { Button } from '@/components/ui/button'
import { setAdminSession } from '@/app/admin/evaluaciones/actions'

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#f6f8f6] px-5 py-14 text-[#183b56]">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d9499]">
          Moderación
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Acceso de administrador</h1>
        <p className="mt-3 text-[#607b72]">
          Introduce el acceso de moderación para revisar evaluaciones pendientes.
        </p>

        <form action={setAdminSession} className="mt-6">
          <Button type="submit" className="w-full rounded-xl bg-[#183b56] text-white hover:bg-[#275875]">
            Entrar al panel
          </Button>
        </form>
      </div>
    </main>
  )
}
