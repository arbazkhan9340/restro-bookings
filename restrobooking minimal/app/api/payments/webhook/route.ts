import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const baseUrl =
    process.env.PAYPAL_MODE === 'live'
      ? 'https://api.paypal.com'
      : 'https://api.sandbox.paypal.com'

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}

// Verify a subscription or capture an order
export async function PUT(req: Request) {
  try {
    const { orderId, subscriptionId } = await req.json()

    if (!orderId && !subscriptionId) {
      return NextResponse.json({ error: 'Order ID or Subscription ID required' }, { status: 400 })
    }

    const accessToken = await getPayPalAccessToken()
    const baseUrl =
      process.env.PAYPAL_MODE === 'live'
        ? 'https://api.paypal.com'
        : 'https://api.sandbox.paypal.com'

    // Handle Subscription Approval
    if (subscriptionId) {
      const response = await fetch(`${baseUrl}/v1/billing/subscriptions/${subscriptionId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('PayPal subscription verify error:', data)
        return NextResponse.json(
          { error: data.message || 'Failed to verify subscription' },
          { status: response.status }
        )
      }

      if (data.status === 'ACTIVE' || data.status === 'APPROVED') {
        try {
          await prisma.payment.create({
            data: {
              amount: undefined, // Subscriptions don't have a single amount in this object context
              currency: 'usd',
              status: 'active',
              providerSession: subscriptionId,
              metadata: JSON.stringify(data || {}),
            },
          })

          const user = await getCurrentUser()
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { isSubscribed: true }
            })
          }
        } catch (e) {
          console.error('Failed to create payment record:', e)
        }

        return NextResponse.json(
          { id: subscriptionId, status: 'COMPLETED' },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { error: 'Subscription is not active' },
          { status: 400 }
        )
      }
    }

    // Legacy Order Catch (for razorpay passing or manual tests)
    const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('PayPal capture error:', data)
      return NextResponse.json(
        { error: data.message || 'Failed to capture order' },
        { status: response.status }
      )
    }

    // Create payment record
    try {
      const purchaseUnit = data.purchase_units?.[0]
      const amount = purchaseUnit?.payments?.captures?.[0]?.amount
      const status = data.status || 'unknown'

      await prisma.payment.create({
        data: {
          amount: amount?.value ? Math.round(parseFloat(amount.value) * 100) : undefined,
          currency: (amount?.currency_code || 'USD').toLowerCase(),
          status: status.toLowerCase(),
          providerSession: orderId,
          metadata: JSON.stringify(data || {}),
        },
      })

      // Update the user to subscribed
      const user = await getCurrentUser()
      if (user && status.toLowerCase() === 'completed') {
        await prisma.user.update({
          where: { id: user.id },
          data: { isSubscribed: true }
        })
      }

      console.log('Payment record created:', orderId)
    } catch (e) {
      console.error('Failed to create payment record:', e)
    }

    return NextResponse.json(
      { id: data.id, status: data.status },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('Verify error:', err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

// Optional: Handle PayPal webhooks (if configured in PayPal dashboard)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('PayPal webhook received:', body.event_type)

    // Optional: Verify webhook signature here
    // For now, just log it

    return NextResponse.json({ status: 'success' }, { status: 200 })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

