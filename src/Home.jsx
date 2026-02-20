import React from 'react'
import { FileText, Plus, User, TrendingUp, Eye, Edit3, BarChart2, ArrowRight, CalendarDays, Images } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Layout from './Layout'

const StatCard = ({ icon, label, value, color, bg }) => {
  const Icon = icon
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  )
}

const QuickAction = ({ icon, title, description, onClick, color }) => {
  const Icon = icon
  return (
  <button
    onClick={onClick}
    className="group bg-white rounded-xl border border-slate-200 p-5 text-left hover:border-blue-300 hover:shadow-md transition-all shadow-sm"
  >
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-500">{description}</p>
    <div className="flex items-center gap-1 mt-3 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
      Go <ArrowRight className="w-3 h-3" />
    </div>
  </button>
  )
}

const Home = () => {
  const navigate = useNavigate()

  const quickActions = [
    {
      icon: Plus,
      title: 'Create New Post',
      description: 'Write and publish a new blog post',
      onClick: () => navigate('/add-post'),
      color: 'bg-blue-600',
    },
    {
      icon: FileText,
      title: 'Manage Posts',
      description: 'View, edit or delete existing posts',
      onClick: () => navigate('/posts'),
      color: 'bg-violet-600',
    },
    {
      icon: User,
      title: 'Account Settings',
      description: 'Update your admin credentials',
      onClick: () => navigate('/account'),
      color: 'bg-emerald-600',
    },
    {
      icon: CalendarDays,
      title: 'Manage Events',
      description: 'View, add or edit upcoming events',
      onClick: () => navigate('/events'),
      color: 'bg-orange-600',
    },
    {
      icon: Images,
      title: 'Manage Gallery',
      description: 'Upload and organize gallery images',
      onClick: () => navigate('/gallery'),
      color: 'bg-pink-600',
    },
  ]

  return (
    <Layout>
      <div className="p-6 md:p-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, Admin. Here's what's happening.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={FileText} label="Total Posts" value="—" color="text-blue-600" bg="bg-blue-50" />
          <StatCard icon={Eye} label="Total Views" value="—" color="text-violet-600" bg="bg-violet-50" />
          <StatCard icon={TrendingUp} label="This Month" value="—" color="text-emerald-600" bg="bg-emerald-50" />
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <QuickAction key={i} {...action} />
            ))}
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-blue-200 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold">Garvita Infrastructure Admin Panel</p>
              <p className="text-blue-200 text-sm">Manage your blog content and settings from one place.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/posts')}
            className="hidden sm:flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg transition flex-shrink-0"
          >
            View Posts <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default Home
