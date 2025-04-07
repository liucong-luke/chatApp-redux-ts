import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { Link } from 'react-router-dom'
import { selectAllPosts, fetchPosts, selectPostsStatus, selectPostsError, type Post } from './postsSlice'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import React, { useEffect } from 'react'

import { Spinner } from '@/components/Spinner'
import { TimeAgo } from '@/components/TimeAgo'

const PostExcerpt = ({ post }: { post: Post }) => {
  return (
    <article className="post-excerpt">
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <PostAuthor userId={post.user} />
      <TimeAgo timestamp={post.date} />
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  )
}

export const PostsList = () => {
  const dispatch = useAppDispatch()
  const posts = useAppSelector(selectAllPosts)
  const postsStatus = useAppSelector(selectPostsStatus)
  const postsError = useAppSelector(selectPostsError)

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [dispatch, postsStatus])

  let content: React.ReactNode

  if (postsStatus === 'pending') {
    content = <Spinner text="Loading..." />
  } else if (postsStatus === 'succeeded') {
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    content = orderedPosts.map((post) => <PostExcerpt post={post} key={post.id} />)
  } else if (postsStatus === 'failed') {
    content = <div>{postsError}</div>
  }

  // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
  // const renderedPosts = orderedPosts.map((post) => (
  //   <article className="post-excerpt" key={post.id}>
  //     <h3>
  //       <Link to={`/posts/${post.id}`}>{post.title}</Link>
  //     </h3>
  //     <PostAuthor userId={post.user} />
  //     <TimeAgo timestamp={post.date} />
  //     <p className="post-content">{post.content.substring(0, 100)}</p>
  //     <ReactionButtons post={post} />
  //   </article>
  // ))

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {/* {renderedPosts} */}
      {content}
    </section>
  )
}
