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
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-black">Forgot Password</h1>
      <p className="mt-2 text-sm text-muted-foreground">Enter your account email to receive a one-time code to reset your password.</p>

      {step === 'email' && (
        <div className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded border-2 border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
          <div className="flex items-center justify-between">
            <Button onClick={sendOtp} className="bg-primary text-primary-foreground">Send OTP</Button>
            <Link to="/login" className="text-sm font-medium text-primary hover:underline">Back to login</Link>
          </div>
        </div>
      )}

      {step === 'otp' && (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to <strong>{email}</strong></p>

          <div className="mt-4 flex gap-2">
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
                className="h-12 w-12 text-center rounded border-2 border-border bg-background text-lg font-bold outline-none focus:border-primary"
              />
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button onClick={verifyOtp} className="bg-primary text-primary-foreground">Verify code</Button>
            <button onClick={resend} className="text-sm text-muted-foreground hover:underline">Resend</button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="mt-6 space-y-4">
          <p className="text-sm">Code verified. You can now reset your password.</p>
          <Link to="/login" className="inline-block">
            <Button className="bg-primary text-primary-foreground">Back to login</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
