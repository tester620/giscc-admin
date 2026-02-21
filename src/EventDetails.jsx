import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { axiosInstance } from './axios'
import { Pencil, Loader2, Save, Trash2, X, ArrowLeft, ImageOff, MapPin, Calendar } from 'lucide-react'
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
          <h3 className="text-lg font-semibold text-slate-800">Delete this event?</h3>
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

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [venue, setVenue] = useState('')
  const [isActive, setIsActive] = useState(true)

  const fetchEvent = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await axiosInstance.get(`/admin/events/${id}`)
      const e = res.data
      setEvent(e)
      setTitle(e.title)
      setDescription(e.description)
      setDate(e.date ? e.date.slice(0, 10) : '')
      setVenue(e.venue || '')
      setIsActive(e.isActive ?? true)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      await axiosInstance.put(`/admin/events/${id}`, {
        title,
        description,
        date,
        venue: venue || undefined,
        isActive,
      })
      toast.success('Event updated successfully')
      setIsEditing(false)
      fetchEvent()
    } catch {
      toast.error('Failed to update event')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await axiosInstance.delete(`/admin/events/${id}`)
      toast.success('Event deleted successfully')
      navigate('/events')
    } catch {
      toast.error('Failed to delete event')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    )
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
          <p className="text-slate-600">Event not found.</p>
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </button>
        </div>
      </Layout>
    )
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setTitle(event.title)
    setDescription(event.description)
    setDate(event.date ? event.date.slice(0, 10) : '')
    setVenue(event.venue || '')
    setIsActive(event.isActive ?? true)
  }

  return (
    <Layout>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} />
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Events
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
                  onClick={cancelEdit}
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

        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="aspect-video bg-slate-100">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
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
                <h2 className="mt-1.5 text-xl font-bold text-slate-800">{event.title}</h2>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Date & Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</label>
                </div>
                {isEditing ? (
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm"
                  />
                ) : (
                  <p className="text-slate-700 text-sm">{event.date ? new Date(event.date).toLocaleDateString() : '—'}</p>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Venue</label>
                </div>
                {isEditing ? (
                  <input
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Enter venue…"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm"
                  />
                ) : (
                  <p className="text-slate-700 text-sm">{event.venue || '—'}</p>
                )}
              </div>
            </div>

            {/* isActive */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</label>
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              ) : (
                <span className={`text-xs px-2 py-0.5 rounded-full ${event.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {event.isActive ? 'Active' : 'Inactive'}
                </span>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none min-h-[160px] text-sm"
                />
              ) : (
                <p className="mt-1.5 text-slate-600 text-sm leading-relaxed whitespace-pre-line">{event.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default EventDetails
