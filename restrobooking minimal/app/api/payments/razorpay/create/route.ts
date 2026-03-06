import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const amountInUSD = parseFloat(body.amount || '49.00')
        const amountInINR = Math.round(amountInUSD * 83 * 100) // Convert USD to INR (approximate rate) and then to paise

        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        })

        const options = {
            amount: amountInINR, // amount in the smallest currency unit
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: user.id.toString()
            }
        }

        const order = await razorpay.orders.create(options)

        if (!order) {
            throw new Error('Failed to create Razorpay order')
        }

        return NextResponse.json(order, { status: 201 })
    } catch (err: any) {
        console.error('Create Razorpay order error:', err)
        return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
    }
}
