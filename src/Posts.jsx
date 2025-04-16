import React, { useEffect, useState } from 'react'
import { axiosInstance } from './axios'
import { Link } from 'react-router-dom'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get('/admin/blogs')
      setPosts(res.data)
    } catch (error) {
      console.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-[90px] py-8 bg-gray-50 px-4">
      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            to={`/post/${post._id}`}
            key={post.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden border hover:shadow-md transition hover:-translate-y-1 duration-200"
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
              <p className="text-sm text-gray-600">
                {post.description.length > 20
                  ? post.description.slice(0, 20) + '...'
                  : post.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Posts
