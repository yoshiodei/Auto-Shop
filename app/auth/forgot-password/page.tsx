'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { resetPassword } from '@/lib/firebase/auth'
import { validateEmail } from '@/lib/validation'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validationError, setValidationError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (validationError) setValidationError('')
    if (error) setError('')
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setValidationError('')
    setSuccess(false)

    // Validate email
    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      await resetPassword(email)
      setSuccess(true)
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
      console.log('[v0] Password reset error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/auth/signin">
          <button className="flex items-center gap-2 text-[#FF6B7A] hover:text-[#FF5566] font-medium mb-8">
            <ArrowLeft className="w-5 h-5" />
            Back to Sign In
          </button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/main">
            <button className="flex items-center gap-2 justify-center mx-auto mb-6 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-[#FF6B7A] rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <span className="text-2xl font-bold text-gray-900">AUTO WORLD</span>
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">Enter your email to receive a password reset link</p>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-700 font-medium">Check your email</p>
                  <p className="text-green-600 text-sm mt-1">We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the link to reset your password.</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {!success ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="kwame@email.com"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B7A] ${
                      validationError ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {validationError && (
                  <p className="text-red-500 text-xs mt-1">{validationError}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6B7A] hover:bg-[#FF5566] disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 text-center">
                If you don&apos;t see the email in your inbox, please check your spam folder.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="w-full bg-[#FF6B7A] hover:bg-[#FF5566] text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Try Another Email
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Need help?</span>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-gray-600 text-sm">
            Contact our support team at{' '}
            <a href="mailto:support@autoworld.com" className="text-[#FF6B7A] hover:text-[#FF5566] font-medium">
              support@autoworld.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
