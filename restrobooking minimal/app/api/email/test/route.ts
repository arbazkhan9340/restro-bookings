import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json()

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, message' },
        { status: 400 }
      )
    }

    const result = await sendEmail({
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email</h2>
          <p>${message}</p>
          <hr style="margin: 20px 0;">
          <p style="color: #6c757d; font-size: 14px;">
            This is a test email from your Table Booking System.
          </p>
        </div>
      `,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
