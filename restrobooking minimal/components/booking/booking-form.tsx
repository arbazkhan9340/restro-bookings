'use client'

import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'

type FormValues = {
  name: string
  phone?: string
  date: string
  time: string
  partySize: number
  notes?: string
}

export default function BookingForm() {
  const { register, handleSubmit, reset } = useForm<FormValues>()
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')

  const onSubmit = async (values: FormValues) => {
    setStatus('pending')
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        setStatus('success')
        reset()
        toast({
          title: 'Reservation Successful',
          description: 'Your reservation has been submitted! We will confirm shortly.',
        })
      } else {
        setStatus('error')
        toast({
          title: 'Reservation Failed',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (e) {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input className="input" placeholder="Name" {...register('name', { required: true })} />
        <input className="input" placeholder="Phone (optional)" {...register('phone')} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <input type="date" className="input" {...register('date', { required: true })} />
        <input type="time" className="input" {...register('time', { required: true })} />
        <input type="number" min={1} className="input" defaultValue={2} {...register('partySize', { valueAsNumber: true })} />
      </div>

      <textarea className="input h-24" placeholder="Notes (optional)" {...register('notes')} />

      <div>
        <Button type="submit" size="lg">{status === 'pending' ? 'Submitting...' : 'Request Reservation'}</Button>
      </div>

      {status === 'success' && <p className="text-sm text-primary">Reservation submitted! We'll confirm shortly.</p>}
      {status === 'error' && <p className="text-sm text-rose-500">Something went wrong. Please try again.</p>}
    </form>
  )
}
