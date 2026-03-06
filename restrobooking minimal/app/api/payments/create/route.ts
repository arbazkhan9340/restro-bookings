import { NextResponse } from 'next/server'

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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const accessToken = await getPayPalAccessToken()
    const baseUrl =
      process.env.PAYPAL_MODE === 'live'
        ? 'https://api.paypal.com'
        : 'https://api.sandbox.paypal.com'

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: body.amount || '49.00',
            },
            description: 'TableBook Professional Plan - Monthly Subscription',
          },
        ],
        application_context: {
          brand_name: 'TableBook',
          locale: 'en-US',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/owner/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/owner/cancel`,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('PayPal error:', data)
      return NextResponse.json(
        { error: data.message || 'Failed to create PayPal order' },
        { status: response.status }
      )
    }

    return NextResponse.json({ id: data.id }, { status: 201 })
  } catch (err: any) {
    console.error('Create order error:', err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

