import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const signature = req.headers.get('x-razorpay-signature')

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
        }

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body)
            .digest('hex')

        if (expectedSignature !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
        }

        const event = JSON.parse(body)

        if (event.event === 'payment.captured') {
            const payment = event.payload.payment.entity

            await prisma.payment.create({
                data: {
                    amount: payment.amount,
                    currency: payment.currency,
                    status: 'paid',
                    providerSession: payment.order_id || payment.id,
                    metadata: JSON.stringify(payment),
                },
            })

            if (payment.notes && payment.notes.userId) {
                await prisma.user.update({
                    where: { id: parseInt(payment.notes.userId) },
                    data: { isSubscribed: true }
                })
            }
        }

        return NextResponse.json({ received: true })
    } catch (err: any) {
        console.error('Razorpay webhook error:', err)
        return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
    }
}
