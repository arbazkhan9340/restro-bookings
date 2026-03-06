import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Table Booking System'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for plain text version
    })

    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error: String(error) }
  }
}

// Email templates
export const emailTemplates = {
  reservationConfirmation: (data: {
    customerName: string
    restaurantName: string
    date: string
    time: string
    partySize: number
    notes?: string
  }) => ({
    subject: `Reservation Confirmed - ${data.restaurantName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reservation Confirmed! 🎉</h2>
        <p>Dear ${data.customerName},</p>
        <p>Your table reservation has been confirmed at <strong>${data.restaurantName}</strong>.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #495057;">Reservation Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Date:</strong> ${data.date}</li>
            <li><strong>Time:</strong> ${data.time}</li>
            <li><strong>Party Size:</strong> ${data.partySize} guests</li>
            ${data.notes ? `<li><strong>Special Notes:</strong> ${data.notes}</li>` : ''}
          </ul>
        </div>
        
        <p>Please arrive 5-10 minutes before your reservation time.</p>
        <p>If you need to cancel or modify your reservation, please contact us.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #6c757d; font-size: 14px;">
            Thank you for choosing ${data.restaurantName}!
          </p>
        </div>
      </div>
    `,
  }),

  newReservationAlert: (data: {
    customerName: string
    customerEmail?: string
    customerPhone?: string
    date: string
    time: string
    partySize: number
    notes?: string
  }) => ({
    subject: `New Reservation Alert - ${data.customerName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d63384;">New Reservation Received! 📅</h2>
        <p>You have a new table reservation:</p>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #856404;">Customer Information:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Name:</strong> ${data.customerName}</li>
            ${data.customerEmail ? `<li><strong>Email:</strong> ${data.customerEmail}</li>` : ''}
            ${data.customerPhone ? `<li><strong>Phone:</strong> ${data.customerPhone}</li>` : ''}
            <li><strong>Date:</strong> ${data.date}</li>
            <li><strong>Time:</strong> ${data.time}</li>
            <li><strong>Party Size:</strong> ${data.partySize} guests</li>
            ${data.notes ? `<li><strong>Special Notes:</strong> ${data.notes}</li>` : ''}
          </ul>
        </div>
        
        <p>Please prepare the table and ensure everything is ready for their arrival.</p>
        
        <div style="margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/owner/dashboard" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View All Reservations
          </a>
        </div>
      </div>
    `,
  }),

  reservationCancelled: (data: {
    customerName: string
    restaurantName: string
    date: string
    time: string
    reason?: string
  }) => ({
    subject: `Reservation Cancelled - ${data.restaurantName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Reservation Cancelled</h2>
        <p>Dear ${data.customerName},</p>
        <p>Your reservation at <strong>${data.restaurantName}</strong> has been cancelled.</p>
        
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #721c24;">Cancelled Reservation Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Date:</strong> ${data.date}</li>
            <li><strong>Time:</strong> ${data.time}</li>
            ${data.reason ? `<li><strong>Reason:</strong> ${data.reason}</li>` : ''}
          </ul>
        </div>
        
        <p>If this was a mistake or you'd like to make a new reservation, please visit our website.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #6c757d; font-size: 14px;">
            We hope to see you soon at ${data.restaurantName}!
          </p>
        </div>
      </div>
    `,
  }),
}
