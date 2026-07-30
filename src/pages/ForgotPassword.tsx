import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email')
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (step === 'otp') {
      inputsRef.current[0]?.focus()
    }
  }, [step])

  const sendOtp = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }
    setError('')
    setLoading(true)
    try {
      // TODO: call API to send OTP. For now simulate.
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('OTP sent to ' + email)
      setStep('otp')
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    setError('')
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
    if (code.length !== 6) {
      setError('Please enter the full 6-digit code')
      return
    }
    setError('')
    setLoading(true)
    try {
      // TODO: verify via API
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('OTP verified successfully')
      setStep('success')
    } catch (err) {
      setError('Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resend = () => {
    setOtp(Array(6).fill(''))
    setError('')
    sendOtp()
  }

  const goBack = () => {
    setStep('email')
    setOtp(Array(6).fill(''))
    setError('')
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Hero Image */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-emerald-600">
          <img
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=1200&fit=crop"
            alt="Reset Password"
            className="h-full w-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2">
            <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
              <path d="M2 2l7.586 7.586"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
            <Link to="/" className="text-4xl font-black text-primary-foreground">
              menya<span className="text-white">.</span>
            </Link>
          </div>
          <div className="max-w-md">
            <h2 className="text-4xl font-black text-primary-foreground">Reset Your Password</h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Don't worry, we'll help you regain access to your account securely.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
              <path d="M2 2l7.586 7.586"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
            <Link to="/" className="text-3xl font-black">
              menya<span className="text-primary">.</span>
            </Link>
          </div>

          {step === 'email' && (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-black">Reset Password</h1>
                <p className="mt-2 text-muted-foreground">Enter your email and we'll send you a verification code</p>
              </div>

              <div className="space-y-5">
                {error && (
                  <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-muted-foreground">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    placeholder="your@email.com"
                    className="h-12 w-full rounded-xl border-2 border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <Button
                  onClick={sendOtp}
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-primary font-bold text-primary-foreground shadow-modern transition-modern hover:scale-105 disabled:scale-100 disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Send Verification Code'}
                </Button>

                <div className="flex items-center gap-2">
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              </div>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-black">Verify Code</h1>
                <p className="mt-2 text-sm text-muted-foreground">Enter the 6-digit code sent to <strong className="text-foreground">{email}</strong></p>
              </div>

              <div className="space-y-5">
                {error && (
                  <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-4 block text-sm font-medium text-muted-foreground">Verification Code</label>
                  <div className="flex justify-center gap-2">
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
                        className="h-14 w-12 rounded-lg border-2 border-border bg-background text-center text-2xl font-extrabold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-primary font-bold text-primary-foreground shadow-modern transition-modern hover:scale-105 disabled:scale-100 disabled:opacity-50"
                >
                  {loading ? 'Verifying…' : 'Verify Code'}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button onClick={goBack} className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
                    <ArrowLeft className="h-4 w-4" />
                    Change email
                  </button>
                  <button onClick={resend} className="font-medium text-primary hover:underline">
                    Resend code
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="flex justify-center mb-8">
                <CheckCircle2 className="h-16 w-16 text-emerald-500" />
              </div>
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-black">Code Verified</h1>
                <p className="mt-2 text-muted-foreground">You can now reset your password</p>
              </div>

              <div className="space-y-4">
                <Link to="/login" className="block">
                  <Button className="h-12 w-full rounded-xl bg-primary font-bold text-primary-foreground shadow-modern transition-modern hover:scale-105">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
