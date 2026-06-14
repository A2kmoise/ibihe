import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email')
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (step === 'otp') {
      inputsRef.current[0]?.focus()
    }
  }, [step])

  const sendOtp = async () => {
    if (!email) return toast.error('Enter an email')
    // TODO: call API to send OTP. For now simulate.
    toast.success('OTP sent to ' + email)
    setStep('otp')
  }

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < inputsRef.current.length - 1) {
      inputsRef.current[idx + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
    }
  }

  const verifyOtp = async () => {
    const code = otp.join('')
    if (code.length !== 6) return toast.error('Enter full 6-digit code')
    // TODO: verify via API
    toast.success('OTP verified')
    setStep('success')
  }

  const resend = () => {
    // TODO: call resend API
    toast('OTP resent')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-lg p-10 rounded-2xl glass shadow-modern-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold">Forgot Password</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose mx-auto">Enter your account email and we'll send a one-time code to reset your password.</p>
        </div>

        <div className="mt-8">
          {step === 'email' && (
            <div className="space-y-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border-2 border-border bg-background px-4 py-4 text-lg font-medium outline-none focus:border-primary"
              />

              <div className="flex items-center justify-between">
                <Button onClick={sendOtp} className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold">Send OTP</Button>
                <Link to="/login" className="text-sm font-medium text-primary hover:underline">Back to login</Link>
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6 text-center">
              <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to <strong>{email}</strong></p>

              <div className="mt-4 flex justify-center gap-3">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={v}
                    onChange={(e) => handleOtpChange(i, e.target.value.replace(/\s/g, ''))}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="h-14 w-14 text-center rounded-lg border-2 border-border bg-background text-2xl font-extrabold outline-none focus:border-primary"
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center justify-center gap-4">
                <Button onClick={verifyOtp} className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold">Verify code</Button>
                <button onClick={resend} className="text-sm text-muted-foreground hover:underline">Resend</button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4 text-center">
              <p className="text-sm">Code verified. You can now reset your password.</p>
              <Link to="/login" className="inline-block">
                <Button className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold">Back to login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
