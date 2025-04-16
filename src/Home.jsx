import React from 'react'
import { FileText, User, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const sections = [
    {
      title: 'Manage Posts',
      icon: <FileText size={28} />,
      onClick: () => navigate('/posts'),
    },
    {
      title: 'Account Details',
      icon: <User size={28} />,
      onClick: () => navigate('/account'),
    },
    {
      title: 'Add New Post',
      icon: <Plus size={28} />,
      onClick: () => navigate('/add-post'),
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        {sections.map((section, index) => (
          <div
            key={index}
            onClick={section.onClick}
            className="cursor-pointer border rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition"
          >
            <div className="mb-3 text-black">{section.icon}</div>
            <h3 className="text-lg font-semibold">{section.title}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
