import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import { Toaster } from 'react-hot-toast'
import Posts from './Posts'
import PostDetails from './PostDetails'
import Account from './Account'
import AddBlog from './AddBlog'
import Events from './Events'
import AddEvent from './AddEvent'
import EventDetails from './EventDetails'
import Gallery from './Gallery'
import AddGallery from './AddGallery'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/account" element={<Account />} />
        <Route path="/add-post" element={<AddBlog />} />
        <Route path="/events" element={<Events />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/add-gallery" element={<AddGallery />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  )
}

export default App
