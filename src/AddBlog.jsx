import React, { useState } from 'react'
import { axiosInstance } from './axios'
import toast from 'react-hot-toast'
import { Loader2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AddBlog = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
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
    if (!title || !description || !image) {
      toast.error('All fields are required')
      return
    }

    setLoading(true)
    setButtonDisabled(true)

    const reader = new FileReader()
    reader.readAsDataURL(image)

    reader.onloadend = async () => {
      const base64Image = reader.result
      const data = {
        title,
        description,
        image: base64Image,
      }

      try {
        await axiosInstance.post('/admin/blogs', data)
        toast.success('Post added successfully')
        navigate('/posts')
      } catch (err) {
        toast.error('Failed to add post')
      } finally {
        setLoading(false)
        setButtonDisabled(false)
      }
    }
  }

  return (
    <div className="min-h-screen pt-[90px] px-4 py-10 bg-gray-50">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 space-y-8">
        <h2 className="text-2xl font-semibold text-gray-800">Add New Blog Post</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Enter blog title"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-md border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Enter blog description"
              rows="4"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
            {imagePreview && (
              <div className="relative mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-[200px] object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-2 right-2 text-white bg-red-600 p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || buttonDisabled}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin inline-block" />
              ) : (
                'Add Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBlog
