'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckSquare, Mail, ArrowLeft, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'

const OTP_EXPIRY = 60 // seconds
const MAX_WRONG_ATTEMPTS = 2

export default function VerifyEmail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const name = searchParams.get('name') || ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(OTP_EXPIRY)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [expired, setExpired] = useState(false)
  const [editEmail, setEditEmail] = useState(false)
  const [newEmail, setNewEmail] = useState(email)
  const [showResend, setShowResend] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setExpired(true)
      setShowResend(true)
      return
    }
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setExpired(true)
          setShowResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // only keep last digit

    setOtp(newOtp)

    // Auto-move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits filled
    if (newOtp.every((d) => d !== '') && value) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      const newOtp = pasted.split('')
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
      handleVerify(pasted)
    }
  }

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('')
    if (code.length !== 6) {
      toast.error('Please enter the 6-digit OTP')
      return
    }

    if (expired) {
      toast.error('OTP has expired. Please request a new one.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: code,
        type: 'signup',
      })

      if (error) {
        const newAttempts = wrongAttempts + 1
        setWrongAttempts(newAttempts)
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()

        if (newAttempts >= MAX_WRONG_ATTEMPTS) {
          setShowResend(true)
          toast.error('Wrong OTP twice! Please resend a new code.')
        } else {
          toast.error(`Wrong OTP! ${MAX_WRONG_ATTEMPTS - newAttempts} attempt left.`)
        }
        return
      }

      toast.success('Email verified! Welcome to Exam Builder! 🎉')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    const targetEmail = editEmail ? newEmail : email
    if (!targetEmail) return

    setResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
      })

      if (error) throw error

      // Reset everything
      setOtp(['', '', '', '', '', ''])
      setTimer(OTP_EXPIRY)
      setExpired(false)
      setWrongAttempts(0)
      setShowResend(false)
      setEditEmail(false)
      inputRefs.current[0]?.focus()
      toast.success(`New OTP sent to ${targetEmail}!`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  const formatTimer = () => {
    const mins = Math.floor(timer / 60)
    const secs = timer % 60
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0f1923' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold">
            <span className="text-white">Exam</span>
            <span className="text-blue-400">Builder</span>
          </span>
        </div>

        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-gray-400 text-sm">
              We sent a 6-digit OTP to
            </p>
            <p className="text-blue-400 font-medium mt-1">{email}</p>
          </div>

          {/* OTP Inputs */}
          <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading || expired}
                className={`w-12 h-14 text-center text-xl font-bold rounded-lg border-2 bg-gray-900 text-white focus:outline-none transition-all
                  ${digit ? 'border-blue-500' : 'border-gray-600'}
                  ${expired ? 'opacity-50 cursor-not-allowed' : 'focus:border-blue-400'}
                  ${wrongAttempts >= MAX_WRONG_ATTEMPTS ? 'border-red-500' : ''}
                `}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            {!expired ? (
              <div className="flex items-center justify-center gap-2">
                <div className={`text-sm font-medium ${timer <= 10 ? 'text-red-400' : 'text-gray-400'}`}>
                  OTP expires in{' '}
                  <span className={`font-bold text-lg ${timer <= 10 ? 'text-red-400' : 'text-blue-400'}`}>
                    {formatTimer()}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-red-400 text-sm font-medium">⏰ OTP has expired</p>
            )}
          </div>

          {/* Wrong attempts warning */}
          {wrongAttempts > 0 && wrongAttempts < MAX_WRONG_ATTEMPTS && !showResend && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 text-center">
              <p className="text-yellow-400 text-sm">
                ⚠️ Wrong OTP! You have <strong>1 attempt</strong> left before you need to resend.
              </p>
            </div>
          )}

          {/* Verify Button */}
          {!showResend && (
            <button
              onClick={() => handleVerify()}
              disabled={loading || otp.some((d) => d === '') || expired}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>
          )}

          {/* Resend Section */}
          {showResend && (
            <div className="bg-gray-900/60 border border-gray-600 rounded-xl p-4 mb-4">
              <p className="text-gray-300 text-sm text-center mb-4">
                {wrongAttempts >= MAX_WRONG_ATTEMPTS
                  ? '❌ Too many wrong attempts.'
                  : '⏰ OTP expired.'}{' '}
                Request a new code.
              </p>

              {/* Edit email option */}
              {editEmail ? (
                <div className="mb-4">
                  <label className="text-gray-400 text-xs mb-1 block">Change email address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Enter new email"
                  />
                </div>
              ) : (
                <button
                  onClick={() => setEditEmail(true)}
                  className="w-full text-blue-400 text-sm hover:text-blue-300 mb-3 underline"
                >
                  Use a different email address?
                </button>
              )}

              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {resending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Resend OTP
                  </>
                )}
              </button>
            </div>
          )}

          {/* Back link */}
          <div className="text-center">
            <Link
              href="/auth/signup"
              className="text-gray-500 text-sm hover:text-gray-400 flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign Up
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          Didn't receive the email? Check your spam folder.
        </p>
      </div>
    </div>
  )
}
