import BookingForm from '@/components/booking/booking-form'
import { getCurrentUser } from '@/lib/auth'

export const metadata = {
    title: 'Reserve Table',
}

export default async function WidgetPage() {
    const user = await getCurrentUser()

    if (user && !user.isSubscribed && user.trialEndsAt && new Date() > user.trialEndsAt) {
        return (
            <div className="bg-background text-foreground p-6 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-rose-500 mb-2">Unavailable</h2>
                    <p className="text-sm text-muted-foreground">Reservations are currently paused for this restaurant.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-background text-foreground p-6 min-h-screen">
            <div className="space-y-2 text-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Reserve a Table</h2>
                <p className="text-sm text-muted-foreground">
                    Fill in the details below to request your booking.
                </p>
            </div>
            <div className="mx-auto max-w-sm">
                <BookingForm />
            </div>
        </div>
    )
}
