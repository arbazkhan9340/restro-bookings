import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, createSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
        trialEndsAt,
      },
    })

    await createSession(user.id)

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('signup error:', error)
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : message },
      { status: 500 },
    )
  }
}

