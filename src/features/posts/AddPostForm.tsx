import React, { useState } from 'react'
import { nanoid } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
// import { type Post, postAdded, type ReactionName } from './postsSlice'
import { addNewPost } from './postsSlice'
import { selectAllUsers, selectCurrentUser } from '../users/usersSlice'
import { selectCurrentUsername } from '../auth/authSlice'
import { useAddNewPostMutation } from '../api/apiSlice'

interface AddPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
  // postAuthor: HTMLSelectElement
}

interface AddPostFormElements extends HTMLFormElement {
  elements: AddPostFormFields
}

export const AddPostForm = () => {
  // const dispatch = useAppDispatch()
  const userId = useAppSelector(selectCurrentUsername)!

  // 这个方法返回一个包含两个值的数组，第一个是触发函数，第二个是触发函数请求后返回的对象
  const [addNewPost, { isLoading }] = useAddNewPostMutation()
  const users = useAppSelector(selectAllUsers)
  // const [addRequestStatus, setAddRequestStatus] = useState<'idle' | 'pending'>('idle')

  const handleSubmit = async (e: React.FormEvent<AddPostFormElements>) => {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value
    const form = e.currentTarget
    // const reactions = {
    //   thumbsUp: 0,
    //   tada: 0,
    //   heart: 0,
    //   rocket: 0,
    //   eyes: 0,
    // }
    try {
      // setAddRequestStatus('pending')
      // await dispatch(addNewPost({ title, content, user: userId })).unwrap()
      await addNewPost({ title, content, user: userId }).unwrap()
      form.reset()
    } catch (error) {
      console.error('Failed to save the post: ', error)
    }
    // finally {
    //   setAddRequestStatus('idle')
    // }

    // const userId = elements.postAuthor.value

    // const newPost: Post = {
    //   id: nanoid(),
    //   title,
    //   content,
    //   user: userId,
    // }
    // dispatch(postAdded(newPost))  // 使用原始的 postAdded
    // dispatch(postAdded(title, content, userId, reactions)) // 使用自定义的 postAdded

    // console.log('Values: ', { title, content })

    // e.currentTarget.reset()
  }

  const UsersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        {/* <label htmlFor="postAuthor">Author:</label>
        <select name="postAuthor" id="postAuthor" required>
          <option value=""></option>
          {UsersOptions}
        </select> */}
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id="postTitle" defaultValue="" required />
        <label htmlFor="postContent">Post Content:</label>
        <textarea name="postContent" id="postContent" defaultValue="" required></textarea>
        {/* <button disabled={addRequestStatus === 'pending' ? true : false}>Save Post</button> */}
        <button disabled={isLoading}>Save Post</button>
      </form>
    </section>
  )
}
