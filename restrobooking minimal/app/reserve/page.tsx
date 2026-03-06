import BookingForm from '@/components/booking/booking-form'
import { Card } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export const metadata = {
  title: 'Reserve - Resmio.in',
}

export default async function ReservePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/sign-in?callbackUrl=/reserve')
  }

  const isTrialExpired = !user.isSubscribed && user.trialEndsAt && new Date() > user.trialEndsAt;

  if (isTrialExpired) {
    redirect('/owner/checkout?reason=trial-expired')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold">Request a Reservation</h1>
          <p className="text-muted-foreground">
            Fill in the details below and we&apos;ll confirm availability.
          </p>
        </div>

        <div className="mt-8">
          <Card className="p-6">
            <BookingForm />
          </Card>
        </div>
      </div>
    </div>
  )
}
