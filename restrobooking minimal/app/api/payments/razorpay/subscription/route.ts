import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Replace with your actual Razorpay plan_id
        const plan_id = process.env.RAZORPAY_PLAN_ID
        if (!plan_id) {
            return NextResponse.json({ error: 'Missing Razorpay plan_id' }, { status: 400 })
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        })

        const subscription = await razorpay.subscriptions.create({
            plan_id,
            customer_notify: 1,
            total_count: 12, // 12 months
            quantity: 1,
            notes: {
                userId: user.id.toString()
            }
        })

        if (!subscription) {
            throw new Error('Failed to create Razorpay subscription')
        }

        return NextResponse.json(subscription, { status: 201 })
    } catch (err: any) {
        console.error('Create Razorpay subscription error:', err)
        return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
    }
}
