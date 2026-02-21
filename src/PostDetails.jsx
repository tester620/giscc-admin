import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { axiosInstance } from './axios'
import { Pencil, Loader2, Save, Trash2, X, Check, ArrowLeft, ImageOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Layout from './Layout'

const ConfirmDialog = ({ open, onClose, onConfirm }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800">Delete this post?</h3>
          <p className="text-sm text-slate-500 mt-1">This action cannot be undone.</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
          >
            Delete
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

  const fetchPost = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await axiosInstance.get(`/admin/blogs/${id}`)
      setPost(res.data)
      setTitle(res.data.title)
      setDescription(res.data.description)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      await axiosInstance.put(`/admin/blogs/${id}`, { title, description })
      toast.success('Post updated successfully')
      setIsEditing(false)
      fetchPost()
    } catch {
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
    } catch {
      toast.error('Failed to delete post')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    )
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
          <p className="text-slate-600">Blog post not found.</p>
          <button
            onClick={() => navigate('/posts')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Posts
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} />
      <div className="p-6 md:p-8">
        {/* Back + actions bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate('/posts')}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Posts
          </button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
                <button
                  onClick={() => { setIsEditing(false); setTitle(post.title); setDescription(post.description) }}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
            )}
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={updating || deleting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete
            </button>
          </div>
        </div>

        {/* Post card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Image */}
          <div className="aspect-video bg-slate-100">
            {post.image ? (
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageOff className="w-12 h-12 text-slate-300" />
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</label>
              {isEditing ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full text-xl font-semibold px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                />
              ) : (
                <h2 className="mt-1.5 text-xl font-bold text-slate-800">{post.title}</h2>
              )}
            </div>

            {/* Divider */}
            <hr className="border-slate-100" />

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none min-h-[200px] text-sm"
                />
              ) : (
                <p className="mt-1.5 text-slate-600 text-sm leading-relaxed whitespace-pre-line">{post.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PostDetails
