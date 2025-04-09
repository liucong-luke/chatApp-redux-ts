import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { Navbar } from './components/Navbar'

import { useAppSelector } from './app/hooks'
import { selectCurrentUsername } from './features/auth/authSlice'

import { PostsMainPage } from './features/posts/PostsMainPage'
import { SinglePostPage } from './features/posts/SinglePostPage'
import { EditPostForm } from './features/posts/EditPostForm'
import { LoginPage } from './features/auth/LoginPage'
import { UserList } from './features/users/UserList'
import { UserPage } from './features/users/UserPage'

import React from 'react'
import { NotificationsList } from './features/notifications/NotificationsList'
import { ToastContainer } from 'react-tiny-toast'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const username = useAppSelector(selectCurrentUsername)
  if (!username) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/posts" element={<PostsMainPage />}></Route>
                  <Route path="/posts/:postId" element={<SinglePostPage />}></Route>
                  <Route path="/editPost/:postId" element={<EditPostForm />}></Route>
                  <Route path="/users" element={<UserList />}></Route>
                  <Route path="/users/:userId" element={<UserPage />}></Route>
                  <Route path="/notifications" element={<NotificationsList />}></Route>
                </Routes>
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  )
}

export default App
