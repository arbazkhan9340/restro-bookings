'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export default function EmailSettings() {
  const [emailTest, setEmailTest] = useState({
    to: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleTestEmail = async () => {
    if (!emailTest.to || !emailTest.subject || !emailTest.message) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailTest),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Test email sent successfully!',
        })
        setEmailTest({ to: '', subject: '', message: '' })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to send email',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send test email',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
        <CardDescription>
          Test your email configuration and send test emails
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="to">Recipient Email</Label>
            <Input
              id="to"
              type="email"
              placeholder="test@example.com"
              value={emailTest.to}
              onChange={(e) => setEmailTest({ ...emailTest, to: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Test Email Subject"
              value={emailTest.subject}
              onChange={(e) => setEmailTest({ ...emailTest, subject: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            className="w-full p-3 border rounded-md resize-none"
            rows={4}
            placeholder="Type your test message here..."
            value={emailTest.message}
            onChange={(e) => setEmailTest({ ...emailTest, message: e.target.value })}
          />
        </div>

        <Button 
          onClick={handleTestEmail} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Sending...' : 'Send Test Email'}
        </Button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Email Configuration Status</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p>• SMTP Host: {process.env.NEXT_PUBLIC_SMTP_HOST || 'Configured'}</p>
            <p>• SMTP Port: {process.env.NEXT_PUBLIC_SMTP_PORT || 'Configured'}</p>
            <p>• From Email: {process.env.NEXT_PUBLIC_SMTP_USER || 'Configured'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
