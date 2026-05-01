import { cookies } from 'next/headers'
import { checkAdminCredentials, signAdminToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!checkAdminCredentials(email, password)) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await signAdminToken()
    const cookieStore = await cookies()

    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Login failed' }, { status: 500 })
  }
}
