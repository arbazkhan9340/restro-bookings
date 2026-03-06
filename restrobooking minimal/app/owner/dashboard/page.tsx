'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Payment = {
  id: number
  amount: number | null
  currency: string | null
  status: string
  providerSession: string
  createdAt: string
}

type Reservation = {
  id: number
  name: string
  phone: string | null
  dateTime: string
  partySize: number
  notes: string | null
  createdAt: string
}

type Notification = {
  id: number
  message: string
  read: boolean
  createdAt: string
}

export default function DashboardPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
    const fetchData = async () => {
      try {
        const [paymentsRes, reservationsRes, notificationsRes] = await Promise.all([
          fetch('/api/payments/list'),
          fetch('/api/reservations'),
          fetch('/api/notifications'),
        ])

        const paymentsData = await paymentsRes.json()
        const reservationsData = await reservationsRes.json()
        const notificationsData = await notificationsRes.json()

        setPayments(paymentsData.payments || [])
        setReservations(reservationsData.reservations || [])
        setNotifications(notificationsData.notifications || [])
      } catch (e) {
        console.error('Failed to fetch data:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalRevenue = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0) / 100

  // Notification UI
  const unreadNotifications = notifications.filter((n) => !n.read)

  // ...existing code...

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Owner Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage reservations and payments</p>
          </div>
          <div className="space-x-3">
            <Link href="/owner/checkout">
              <Button>Upgrade Plan</Button>
            </Link>
            {/* <Link href="/">
              <Button variant="outline">Home</Button>
            </Link> */}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Reservations</p>
            <p className="mt-2 text-3xl font-bold">{reservations.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Payments</p>
            <p className="mt-2 text-3xl font-bold">{payments.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Revenue (Paid)</p>
            <p className="mt-2 text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Active Status</p>
            <p className="mt-2 text-3xl font-bold text-green-500">Active</p>
          </Card>
        </div>

        {/* Widget Section */}
        <div className="mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">Embed Booking Widget</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Add the reservation form directly to your website or Google Business Profile. For your website, paste the HTML snippet. For Google, use the direct link.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Website HTML Embed:</label>
                <div className="mt-1">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs font-mono text-muted-foreground select-all">
                    {`<iframe src="${origin}/widget" width="100%" height="550" frameborder="0" style="border:none; border-radius: 8px;"></iframe>`}
                  </pre>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold">Google Business / Social Media Link:</label>
                <div className="mt-1">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs font-mono text-muted-foreground select-all">
                    {`${origin}/reserve`}
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Payments Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Recent Payments</h2>
          {loading ? (
            <Card className="p-6">
              <p className="text-muted-foreground">Loading...</p>
            </Card>
          ) : payments.length === 0 ? (
            <Card className="p-6">
              <p className="text-muted-foreground">No payments yet</p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Session ID</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="px-4 py-3 font-semibold">
                        ${((payment.amount || 0) / 100).toFixed(2)} {payment.currency?.toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${payment.status === 'paid'
                              ? 'bg-green-500/20 text-green-700'
                              : 'bg-yellow-500/20 text-yellow-700'
                            }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{payment.providerSession.slice(0, 20)}...</td>
                      <td className="px-4 py-3 text-xs">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reservations Section */}
        <div>
          <h2 className="mb-4 text-2xl font-bold">Recent Reservations</h2>
          {reservations.length === 0 ? (
            <Card className="p-6">
              <p className="text-muted-foreground">No reservations yet</p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Date & Time</th>
                    <th className="px-4 py-2 text-left">Party Size</th>
                    <th className="px-4 py-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((res) => (
                    <tr key={res.id} className="border-b">
                      <td className="px-4 py-3 font-semibold">{res.name}</td>
                      <td className="px-4 py-3 text-xs">{res.phone || '-'}</td>
                      <td className="px-4 py-3 text-xs">
                        {new Date(res.dateTime).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">{res.partySize}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{res.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
