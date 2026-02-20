import React, { useState } from 'react'
import { axiosInstance } from './axios'
import toast from 'react-hot-toast'
import { Loader2, X, ImagePlus, Type, Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Layout from './Layout'

const CATEGORIES = ['general', 'events', 'projects', 'team']

const AddGallery = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image must be smaller than 10MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(file)
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageRemove = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      toast.error('Please select an image')
      return
    }

    setLoading(true)
    const reader = new FileReader()
    reader.readAsDataURL(image)
    reader.onloadend = async () => {
      try {
        await axiosInstance.post('/admin/gallery', {
          image: reader.result,
          title: title || undefined,
          category: category || undefined,
        })
        toast.success('Image added to gallery')
        navigate('/gallery')
      } catch {
        toast.error('Failed to add image')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Layout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Add Gallery Image</h1>
          <p className="text-slate-500 text-sm mt-1">Upload an image to the gallery</p>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Image upload */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <ImagePlus className="w-4 h-4 text-slate-400" />
                  <label className="text-sm font-medium text-slate-700">Image <span className="text-red-500">*</span></label>
                </div>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-52 object-cover" />
                    <button
                      type="button"
                      onClick={handleImageRemove}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-600 p-1.5 rounded-full shadow-sm transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                      {image?.name}
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
                    <ImagePlus className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-sm text-slate-400">Click to upload image</p>
                    <p className="text-xs text-slate-300 mt-1">PNG, JPG, GIF up to 10MB</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Type className="w-4 h-4 text-slate-400" />
                  <label className="text-sm font-medium text-slate-700">Title <span className="text-slate-400 font-normal">(optional)</span></label>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter image title…"
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm transition"
                />
              </div>

              {/* Category */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <label className="text-sm font-medium text-slate-700">Category <span className="text-slate-400 font-normal">(optional)</span></label>
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm transition"
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate('/gallery')}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                ) : (
                  'Add to Gallery'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default AddGallery
