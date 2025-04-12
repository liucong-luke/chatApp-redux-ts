import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// import { useAppDispatch, useAppSelector } from '@/app/hooks'
// import { postUpdated, selectPostById } from './postsSlice'
import { useEditPostMutation, useGetPostQuery } from '../api/apiSlice'

interface EditPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}

interface EditPostFormElements extends HTMLFormElement {
  elements: EditPostFormFields
}

export const EditPostForm = () => {
  const { postId } = useParams()

  // const post = useAppSelector((state) => selectPostById(state, postId!))
  const { data: post } = useGetPostQuery(postId!)
  const [updatePost, { isLoading }] = useEditPostMutation()

  // const dispatch = useAppDispatch()
  const navigate = useNavigate()

  if (!post) {
    return (
      <section>
        <h3>Post not found!</h3>
      </section>
    )
  }

  const onSavePostClicked = async (e: React.FormEvent<EditPostFormElements>) => {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    if (title && content) {
      // dispatch(postUpdated({ id: post.id, title, content }))
      await updatePost({ id: post.id, title, content })
      navigate(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={onSavePostClicked}>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" defaultValue={post.title} id="postTitle" name="postTitle" />
        <label htmlFor="postContent">Post Content:</label>
        <textarea name="postContent" id="postContent" defaultValue={post.content}></textarea>
        <button>Save Post</button>
      </form>
    </section>
  )
}
