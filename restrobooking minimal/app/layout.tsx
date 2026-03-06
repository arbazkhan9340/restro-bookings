import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'TableBook - Restaurant Table Booking System',
  description: 'Transform reservation inquiries into confirmed bookings with TableBook. Professional table booking system for restaurants with unlimited reservations, real-time syncing, and advanced analytics.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/resmio-logo.png',
      },
    ],
    apple: '/resmio-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
