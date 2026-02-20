import React, { useEffect, useState } from 'react'
import { axiosInstance } from './axios'
import { useNavigate } from 'react-router-dom'
import { Plus, Images, Loader2, ImageOff, Search } from 'lucide-react'
import Layout from './Layout'

const CATEGORIES = ['All', 'general', 'events', 'projects', 'team']

const Gallery = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const fetchGallery = async (cat) => {
    setLoading(true)
    try {
      const params = cat && cat !== 'All' ? { category: cat } : {}
      const res = await axiosInstance.get('/admin/gallery', { params })
      setItems(res.data)
    } catch {
      console.error('Failed to fetch gallery')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGallery(category)
  }, [category])

  const filtered = items.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Gallery</h1>
            <p className="text-slate-500 text-sm mt-1">
              {loading ? 'Loading...' : `${items.length} image${items.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => navigate('/add-gallery')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Images className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">
              {search ? 'No images match your search' : 'No images yet'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/add-gallery')}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Upload your first image
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || 'Gallery image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                </div>
                {(item.title || item.category) && (
                  <div className="p-3">
                    {item.title && (
                      <p className="text-sm font-medium text-slate-700 line-clamp-1">{item.title}</p>
                    )}
                    {item.category && (
                      <span className="mt-1 inline-block text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Gallery
