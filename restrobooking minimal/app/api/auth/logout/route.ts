import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth'

export async function POST() {
  try {
    await destroySession()
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

