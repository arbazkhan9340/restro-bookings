import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import prisma from './prisma'

const SESSION_COOKIE_NAME = 'session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 days

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: number) {
  const token = randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  await prisma.session.create({
    data: {
      id: token,
      userId,
      expiresAt,
    },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { id: token },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } })
    }
    cookieStore.delete(SESSION_COOKIE_NAME)
    return null
  }

  return session.user
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return

  await prisma.session.deleteMany({ where: { id: token } })
  cookieStore.delete(SESSION_COOKIE_NAME)
}

