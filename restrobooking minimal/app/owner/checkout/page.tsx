'use client'

import { useEffect, useState, Suspense } from 'react'
import { Card } from '@/components/ui/card'
import Script from 'next/script'
import { useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    paypal?: any
    Razorpay?: any
  }
}

function CheckoutContent() {
  // const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')

  // PayPal logic removed for India-only (Razorpay only)

  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      alert('Razorpay SDK failed to load. Are you online?')
      return
    }

    try {
      const res = await fetch('/api/payments/razorpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: '49.00' }),
      })

      if (!res.ok) throw new Error('Failed to create Razorpay order')

      const orderData = await res.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TableBook',
        description: 'Professional Plan Subscription',
        order_id: orderData.id,
        handler: function (response: any) {
          window.location.href = '/owner/success'
        },
        theme: {
          color: '#000000',
        },
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (err: any) {
      console.error('Razorpay Error:', err)
      alert(err.message)
    }
  }

  // PayPal button effect removed for India-only

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* PayPal script removed for India-only */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => console.error('Failed to load Razorpay SDK')}
      />

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center">
          {reason === 'trial-expired' ? (
            <div className="bg-rose-500/10 text-rose-500 p-4 rounded-lg mb-6">
              <h2 className="font-bold">Your Free Trial Has Expired</h2>
              <p className="text-sm">Please subscribe to the Professional plan to unlock your dashboard and continue receiving reservations.</p>
            </div>
          ) : null}

          <h1 className="text-2xl font-bold">Owner Subscription</h1>
          <p className="text-muted-foreground">
            Subscribe to the Professional plan for access to all features.
          </p>
        </div>

        <div className="mt-8">
          <Card className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold">
                ₹1,499<span className="text-base">/month</span>
              </p>
              <p className="mt-2 text-muted-foreground">Billed monthly in INR. Cancel anytime.</p>

              <div className="mt-6 flex flex-col gap-4">
                {/* PayPal button removed for India-only */}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!razorpayLoaded}
                  onClick={handleRazorpayPayment}
                  className="w-full rounded-md bg-[#3395FF] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#2b80db] disabled:opacity-50"
                >
                  {razorpayLoaded ? 'Pay with Razorpay' : 'Loading Razorpay...'}
                </button>
              </div>

              <ul className="mt-8 space-y-3 text-left text-sm text-muted-foreground">
                <li>✓ Unlimited reservations</li>
                <li>✓ Embedded booking widget</li>
                <li>✓ Table management dashboard</li>
                <li>✓ Real-time syncing</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function OwnerCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}


