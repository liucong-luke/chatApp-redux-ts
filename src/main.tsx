import React from 'react'
import { createRoot } from 'react-dom/client'

import { Provider } from 'react-redux'
import { store } from './app/store'
// import { fetchUsers } from './features/users/usersSlice'

import App from './App'

import { worker } from './api/server'

import './primitiveui.css'
import './index.css'
import { apiSlice } from '@/features/api/apiSlice'
import { apiSliceWithUsers } from './features/users/usersSlice'

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: 'bypass' })
  // store.dispatch(fetchUsers()) //使用RTK Query
  // store.dispatch(apiSlice.endpoints.getUsers.initiate('Pikachu')) // 有参数的写法
  // store.dispatch(apiSlice.endpoints.getUsers.initiate())

  // 使用 apiUserSlice模块
  store.dispatch(apiSliceWithUsers.endpoints.getUsers.initiate())

  const root = createRoot(document.getElementById('root')!)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  )
}

start()
