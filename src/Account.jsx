import React, { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, Shield, KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { axiosInstance } from './axios'
import Layout from './Layout'

const PasswordField = ({ label, value, onChange, show, onToggle, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 pr-11 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
)

const Account = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await axiosInstance.put('/admin/update-password', {
        currentPassword: oldPassword,
        newPassword,
      })
      toast.success('Password changed successfully')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your admin account and security</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Profile card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="font-semibold text-slate-800">Profile Information</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Admin Email</label>
              <input
                value="admin@giscc.in"
                readOnly
                className="w-full px-4 py-2.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-600 text-sm cursor-not-allowed"
              />
              <p className="mt-1.5 text-xs text-slate-400">Email address cannot be changed</p>
            </div>
          </div>

          {/* Security card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-violet-600" />
              </div>
              <h2 className="font-semibold text-slate-800">Change Password</h2>
            </div>

            <div className="space-y-4">
              <PasswordField
                label="Current Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                show={showOld}
                onToggle={() => setShowOld(!showOld)}
                placeholder="Enter current password"
              />
              <PasswordField
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                show={showNew}
                onToggle={() => setShowNew(!showNew)}
                placeholder="Enter new password (min. 6 characters)"
              />
              <PasswordField
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                show={showConfirm}
                onToggle={() => setShowConfirm(!showConfirm)}
                placeholder="Confirm new password"
              />

              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Account
