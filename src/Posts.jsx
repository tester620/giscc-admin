import React, { useEffect, useState } from 'react'
import { axiosInstance } from './axios'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, FileText, Loader2, ImageOff } from 'lucide-react'
import Layout from './Layout'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get('/admin/blogs')
      setPosts(res.data)
    } catch {
      console.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const filtered = posts.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Blog Posts</h1>
            <p className="text-slate-500 text-sm mt-1">
              {loading ? 'Loading...' : `${posts.length} post${posts.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
          <button
            onClick={() => navigate('/add-post')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts by title or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">
              {search ? 'No posts match your search' : 'No posts yet'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/add-post')}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Create your first post
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <Link
                to={`/post/${post._id}`}
                key={post._id}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="h-44 bg-slate-100 overflow-hidden">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-slate-800 mb-1.5 line-clamp-2">{post.title}</h2>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-blue-600 text-xs font-medium">
                    View details <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Posts
