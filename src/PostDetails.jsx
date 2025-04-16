import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { axiosInstance } from './axios'
import { Pencil, Loader2, Save, Trash2, X, Check, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const ConfirmDialog = ({ open, onClose, onConfirm }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Delete this post?</h3>
        <p className="text-sm text-gray-600">This action cannot be undone. Are you sure you want to proceed?</p>
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
          >
            <Check className="w-4 h-4" /> Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

const PostDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const fetchPost = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await axiosInstance.get(`/admin/blogs/${id}`)
      setPost(res.data)
      setTitle(res.data.title)
      setDescription(res.data.description)
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      await axiosInstance.put(`/admin/blogs/${id}`, { title, description })
      toast.success('Post updated successfully')
      setIsEditing(false)
      fetchPost()
    } catch (err) {
      toast.error('Failed to update post')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await axiosInstance.delete(`/admin/blogs/${id}`)
      toast.success('Post deleted successfully')
      navigate('/posts')
    } catch (err) {
      toast.error('Failed to delete post')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-lg text-gray-700">Blog post not found.</p>
        <button
          onClick={() => navigate('/posts')}
          className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-[90px] px-4 py-10 bg-gray-50">
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} />
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6 space-y-8">
        <div className="aspect-video overflow-hidden rounded-xl">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            {isEditing ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-semibold px-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-black focus:outline-none"
              />
            ) : (
              <h2 className="text-2xl font-semibold">{post.title}</h2>
            )}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-md flex items-center gap-2 transition disabled:opacity-50"
                >
                  {updating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-md flex items-center gap-2 transition"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            )}
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={updating || deleting}
              className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md flex items-center gap-2 transition disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
          </div>
        </div>

        <div>
          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-gray-100 min-h-[180px] focus:ring-2 focus:ring-black focus:outline-none"
            />
          ) : (
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {post.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetails
