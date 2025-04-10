import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { Link } from 'react-router-dom'

// 带有 RTK 的表示修改为 RTK Query 方式
// import {
//   selectAllPosts,
//   fetchPosts,
//   selectPostsStatus,
//   selectPostsError,
//   type Post,
//   selectPostIds,
//   selectPostById,
// } from './postsSlice'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import React, { useEffect, useMemo } from 'react'

import { Spinner } from '@/components/Spinner'
import { TimeAgo } from '@/components/TimeAgo'

import { Post, useGetPostsQuery } from '@/features/api/apiSlice'
import classnames from 'classnames'

interface PostExcerptProps {
  // RTK
  // postId: string
  post: Post
}

// RTK
// function PostExcerpt({ postId }: PostExcerptProps) {
function PostExcerpt({ post }: PostExcerptProps) {
  // RTK
  // const post = useAppSelector((state) => selectPostById(state, postId))
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
  // RTK
  // const dispatch = useAppDispatch()
  // const orderedPostIds = useAppSelector(selectPostIds)
  // const posts = useAppSelector(selectAllPosts)
  // const postsStatus = useAppSelector(selectPostsStatus)
  // const postsError = useAppSelector(selectPostsError)

  // useEffect(() => {
  //   if (postsStatus === 'idle') {
  //     dispatch(fetchPosts())
  //   }
  // }, [dispatch, postsStatus])

  // let content: React.ReactNode

  // if (postsStatus === 'pending') {
  //   content = <Spinner text="Loading..." />
  // } else if (postsStatus === 'succeeded') {
  //   // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
  //   // content = orderedPosts.map((post) => <PostExcerpt postId={post.id} key={post.id} />)
  //   content = orderedPostIds.map((postId) => <PostExcerpt key={postId} postId={postId} />)
  // } else if (postsStatus === 'failed') {
  //   content = <div>{postsError}</div>
  // }

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

  // 调用useGetPostsQuery方法会自动请求数据
  // data: posts = []将服务器返回的 data 更名为 posts 并设置为空数组
  // 里面有一个refetch函数，可以手动触发重新请求数据的操作
  const { data: posts = [], isLoading, isSuccess, isError, error, isFetching, refetch } = useGetPostsQuery()

  // 使用memo缓存结果，避免重新渲染
  const sortedPosts = useMemo(() => {
    // 先复制一份，像不能修改 state 一样，不能直接改变原数组!!!
    const sortedPosts = posts.slice()
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  let content: React.ReactNode
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    // content = sortedPosts.map((post) => <PostExcerpt key={post.id} post={post} />)
    const renderedPosts = sortedPosts.map((post) => <PostExcerpt key={post.id} post={post} />)
    const containerClassname = classnames('posts-container', { disabled: isFetching })
    content = <div className={containerClassname}>{renderedPosts}</div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }
  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {/* {renderedPosts} */}
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}
