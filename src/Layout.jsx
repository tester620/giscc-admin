import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default Layout
