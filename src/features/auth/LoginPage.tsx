import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { selectAllUsers } from '../users/usersSlice'
import { login } from './authSlice'

interface LoginPageFormFields extends HTMLFormControlsCollection {
  username: HTMLSelectElement
}

interface LoginPageFormElements extends HTMLFormElement {
  readonly elements: LoginPageFormFields
}

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectAllUsers)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<LoginPageFormElements>) => {
    e.preventDefault()
    const username = e.currentTarget.elements.username.value
    await dispatch(login(username))
    navigate('/posts')
  }

  const userOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Welcome to Tweeter!</h2>
      <h3>Please Login:</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Users:</label>
        <select name="username" id="username" required>
          <option value=""></option>
          {userOptions}
        </select>
        <button>Login</button>
      </form>
    </section>
  )
}
