import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Payment Successful - Resmio.in',
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        
        <p className="mt-4 text-muted-foreground">
          Your subscription to the Professional plan has been activated. You now have access to all features.
        </p>

        <div className="mt-8 space-y-3">
          <Link href="/owner/dashboard">
            <Button size="lg" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  )
}
