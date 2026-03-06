import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const date = data.date
    const time = data.time
    const dateTime = date && time ? new Date(`${date}T${time}`) : new Date()

    const reservation = await prisma.reservation.create({
      data: {
        name: data.name || user.name || 'Guest',
        phone: data.phone || null,
        dateTime,
        partySize: Number(data.partySize) || 1,
        notes: data.notes || null,
        userId: user.id,
      },
    })

    // Create notification for owner (user)
    await prisma.notification.create({
      data: {
        userId: user.id,
        message: `New reservation from ${reservation.name} for ${reservation.partySize} on ${reservation.dateTime.toLocaleString()}`,
      },
    })

    // Send email notifications
    try {
      // Send confirmation email to customer
      if (user.email) {
        const customerEmail = emailTemplates.reservationConfirmation({
          customerName: reservation.name,
          restaurantName: 'Table Booking System',
          date: reservation.dateTime.toLocaleDateString(),
          time: reservation.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          partySize: reservation.partySize,
          notes: reservation.notes || undefined,
        })
        
        await sendEmail({
          to: user.email,
          ...customerEmail,
        })
      }

      // Send alert email to restaurant owner/admin
      const ownerEmail = emailTemplates.newReservationAlert({
        customerName: reservation.name,
        customerEmail: user.email || undefined,
        customerPhone: reservation.phone || undefined,
        date: reservation.dateTime.toLocaleDateString(),
        time: reservation.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        partySize: reservation.partySize,
        notes: reservation.notes || undefined,
      })

      // Send to admin email (you can set this in env)
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          ...ownerEmail,
        })
      }
    } catch (emailError) {
      console.error('Failed to send email notifications:', emailError)
      // Don't fail the reservation if email fails
    }

    return NextResponse.json({ success: true, reservation }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ reservations })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
