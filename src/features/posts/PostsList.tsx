import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { Link } from 'react-router-dom'
import {
  selectAllPosts,
  fetchPosts,
  selectPostsStatus,
  selectPostsError,
  type Post,
  selectPostIds,
  selectPostById,
} from './postsSlice'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import React, { useEffect } from 'react'

import { Spinner } from '@/components/Spinner'
import { TimeAgo } from '@/components/TimeAgo'

interface PostExcerptProps {
  postId: string
}

function PostExcerpt({ postId }: PostExcerptProps) {
  const post = useAppSelector((state) => selectPostById(state, postId))
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

// 使用 React.memo 来防止父组件更新时，但是数据没有改变，这个组件也跟着更新
// PostExcerpt = React.memo(PostExcerpt)

export const PostsList = () => {
  const dispatch = useAppDispatch()
  const orderedPostIds = useAppSelector(selectPostIds)
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
    // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    // content = orderedPosts.map((post) => <PostExcerpt postId={post.id} key={post.id} />)
    content = orderedPostIds.map((postId) => <PostExcerpt key={postId} postId={postId} />)
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
