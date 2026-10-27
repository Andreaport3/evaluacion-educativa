'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  approveEvaluation as approvePendingEvaluation,
  rejectEvaluation as rejectPendingEvaluation,
} from '@/app/actions/evaluaciones'
import { ADMIN_SESSION_TOKEN } from '@/lib/admin-session'

export async function setAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set('admin_session', ADMIN_SESSION_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  redirect('/admin/evaluaciones')
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  revalidatePath('/admin/evaluaciones')
  redirect('/admin/login')
}

export async function approveEvaluation(evaluationId: string) {
  await approvePendingEvaluation(evaluationId)
  revalidatePath('/admin/evaluaciones')
  revalidatePath('/')
}

export async function rejectEvaluation(evaluationId: string) {
  await rejectPendingEvaluation(evaluationId)
  revalidatePath('/admin/evaluaciones')
  revalidatePath('/')
}
