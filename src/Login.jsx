import React, { useState } from 'react'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { axiosInstance } from './axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axiosInstance.post('/auth/login', { email, password })
      toast.success('Login successful')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel - hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900" />
        <div className="relative z-10 text-center">
          <img src="/Logo.png" alt="Logo" className="w-24 h-24 rounded-full object-cover mx-auto mb-6 ring-4 ring-blue-500/30" />
          <h1 className="text-3xl font-bold text-white mb-2">Garvita Infrastructure</h1>
          <p className="text-slate-400 text-lg mb-8">Admin Control Panel</p>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Secure admin access only</span>
          </div>
        </div>
        {/* decorative circles */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-600/10" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-600/10" />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/Logo.png" alt="Logo" className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
            <h1 className="text-xl font-bold text-slate-800">Garvita Infrastructure</h1>
            <p className="text-slate-500 text-sm">Admin Control Panel</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
            <p className="text-slate-500 text-sm mb-8">Sign in to your admin account</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-slate-50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-11 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-slate-50 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            © 2025 Garvita Infrastructure. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
