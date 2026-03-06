import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (user && !user.isSubscribed && user.trialEndsAt && new Date() > user.trialEndsAt) {
        redirect('/owner/checkout?reason=trial-expired')
    }

    return <>{children}</>
}
