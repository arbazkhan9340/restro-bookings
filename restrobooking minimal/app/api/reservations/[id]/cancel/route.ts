import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const reservationId = parseInt(params.id)
    if (isNaN(reservationId)) {
      return NextResponse.json({ success: false, error: 'Invalid reservation ID' }, { status: 400 })
    }

    // Get reservation details before deleting
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        userId: user.id, // Ensure user owns this reservation
      },
    })

    if (!reservation) {
      return NextResponse.json({ success: false, error: 'Reservation not found' }, { status: 404 })
    }

    // Delete the reservation
    await prisma.reservation.delete({
      where: { id: reservationId },
    })

    // Send cancellation email
    try {
      if (user.email) {
        const cancellationEmail = emailTemplates.reservationCancelled({
          customerName: reservation.name,
          restaurantName: 'Table Booking System',
          date: reservation.dateTime.toLocaleDateString(),
          time: reservation.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })

        await sendEmail({
          to: user.email,
          ...cancellationEmail,
        })
      }

      // Notify admin about cancellation
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER
      if (adminEmail) {
        const adminNotification = emailTemplates.newReservationAlert({
          customerName: reservation.name,
          customerEmail: user.email || undefined,
          customerPhone: reservation.phone || undefined,
          date: reservation.dateTime.toLocaleDateString(),
          time: reservation.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          partySize: reservation.partySize,
          notes: `CANCELLED: ${reservation.notes || 'No notes provided'}`,
        })

        await sendEmail({
          to: adminEmail,
          subject: `Reservation CANCELLED - ${reservation.name}`,
          html: adminNotification.html.replace('New Reservation Received!', 'Reservation CANCELLED!'),
        })
      }
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError)
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        message: `Reservation for ${reservation.name} on ${reservation.dateTime.toLocaleString()} has been cancelled`,
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Reservation cancelled successfully' 
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
