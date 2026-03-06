import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { XCircle } from 'lucide-react'

export const metadata = {
  title: 'Payment Cancelled - TableBook',
}

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mb-4 flex justify-center">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold">Payment Cancelled</h1>
        
        <p className="mt-4 text-muted-foreground">
          Your subscription process was cancelled. No charges have been made to your account.
        </p>

        <div className="mt-8 space-y-3">
          <Link href="/owner/checkout">
            <Button size="lg" className="w-full">
              Try Again
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          If you need help, contact our support team.
        </p>
      </div>
    </div>
  )
}
