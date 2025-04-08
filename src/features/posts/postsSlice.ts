import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import { sub } from 'date-fns'
import { logout } from '../auth/authSlice'
import { client } from '@/api/client'
import { createAppAsyncThunk } from '@/app/hooks'

export interface Reactions {
  thumbsUp: number
  tada: number
  heart: number
  rocket: number
  eyes: number
}
export type ReactionName = keyof Reactions

export interface Post {
  id: string
  title: string
  content: string
  user: string
  date: string
  reactions: Reactions
}

type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>
type NewPost = Pick<Post, 'title' | 'content' | 'user'>

export const addNewPost = createAppAsyncThunk('posts/addNewPost', async (initialPost: NewPost) => {
  const response = await client.post<Post>('/fakeApi/posts', initialPost)
  return response.data
})

interface PostsState {
  posts: Post[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialReactions: Reactions = {
  thumbsUp: 0,
  tada: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
}

export const fetchPosts = createAppAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await client.get<Post[]>('/fakeApi/posts')
    return response.data
  },
  {
    condition(arg, thunkApi) {
      const postsStatus = selectPostsStatus(thunkApi.getState())
      if (postsStatus !== 'idle') {
        return false
      }
    },
  },
)

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null,
}

// const initialState: Post[] = [
//   {
//     id: '1',
//     title: 'First Post!',
//     content: 'Hello!',
//     user: '0',
//     date: sub(new Date(), { minutes: 10 }).toISOString(),
//     reactions: initialReactions,
//   },
//   {
//     id: '2',
//     title: 'Second Post',
//     content: 'More text',
//     user: '2',
//     date: sub(new Date(), { minutes: 5 }).toISOString(),
//     reactions: initialReactions,
//   },
// ]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // postAdded(state, action: PayloadAction<Post>) {
    //   state.push(action.payload)
    // },

    // 自定义 postAdded 函数，实现返回复杂的 action
    // postAdded: {
    //   reducer(state, action: PayloadAction<Post>) {
    //     state.posts.push(action.payload)
    //   },
    //   prepare(title: string, content: string, userId: string, reactions: Reactions) {
    //     return {
    //       payload: { id: nanoid(), date: new Date().toISOString(), title, content, user: userId, reactions },
    //     }
    //   },
    // },
    reactionAdded(state, action: PayloadAction<{ postId: string; reaction: ReactionName }>) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postUpdated(state, action: PayloadAction<PostUpdate>) {
      const { id, title, content } = action.payload
      const existingPost = state.posts.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        return initialState
      })
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'pending'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts.push(...action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unknown Error'
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload)
      })
  },
  // selectors: {
  //   selectAllPosts: (postsState) => postsState,
  //   selectPostById: (postsState, postId: string) => {
  //     return postsState.posts.find((post) => post.id === postId)
  //   },
  // },
})

export const { /* postAdded, */ postUpdated, reactionAdded } = postsSlice.actions
// export const { selectAllPosts, selectPostById } = postsSlice.selectors

export default postsSlice.reducer

// 另外一种定义 selector 的方法
export const selectAllPosts = (state: RootState) => state.posts.posts

export const selectPostById = (state: RootState, id: string) => state.posts.posts.find((post) => post.id === id)

export const selectPostsByUser = (state: RootState, userId: string) => {
  const allPosts = selectAllPosts(state)
  return allPosts.filter((post) => post.user === userId)
}

export const selectPostsStatus = (state: RootState) => state.posts.status

export const selectPostsError = (state: RootState) => state.posts.error
