import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function OwnerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/sign-in')
    }

    // Allow access to checkout page (and success/cancel) regardless of subscription status
    // We'll enforce the trial logic inside the dashboard and reserve flows
    return <>{children}</>
}
