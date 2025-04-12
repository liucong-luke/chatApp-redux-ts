import { createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import { sub } from 'date-fns'
import { logout } from '../auth/authSlice'
import { client } from '@/api/client'
import { createAppAsyncThunk } from '@/app/hooks'
import { AppStartListening } from '@/app/listenerMiddleware'
import { apiSlice } from '../api/apiSlice'

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

export type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>
export type NewPost = Pick<Post, 'title' | 'content' | 'user'>

export const addNewPost = createAppAsyncThunk('posts/addNewPost', async (initialPost: NewPost) => {
  const response = await client.post<Post>('/fakeApi/posts', initialPost)
  return response.data
})

interface PostsState extends EntityState<Post, string> {
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

const postsAdapter = createEntityAdapter<Post>({
  // 排序
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

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

// getInitialState 返回 {ids: [], entities: {}} 对象，然后这里加上我们自定义的字段
const initialState: PostsState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
})

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
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postUpdated(state, action: PayloadAction<PostUpdate>) {
      const { id, title, content } = action.payload
      // 使用 updateOne 方法简化下面注释的代码
      postsAdapter.updateOne(state, { id, changes: { title, content } })
      // const existingPost = state.entities[id]
      // if (existingPost) {
      //   existingPost.title = title
      //   existingPost.content = content
      // }
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
        // state.posts.push(...action.payload)
        postsAdapter.setAll(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unknown Error'
      })
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
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
// export const selectAllPosts = (state: RootState) => state.posts.posts

// export const selectPostById = (state: RootState, id: string) => state.posts.posts.find((post) => post.id === id)

// export const selectPostsByUser = (state: RootState, userId: string) => {
//   const allPosts = selectAllPosts(state)
//   return allPosts.filter((post) => post.user === userId)
// }

// 使用解构的方法重命名getSelectors方法提供的函数(selectAll, selectById, selectIds)
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts)

// 性能优化版本
// 详情看https://redux.js.org/tutorials/essentials/part-6-performance-normalization
// Memorizing Selector Functions
export const selectPostsByUser = createSelector(
  // 这里的输出作为后面的输入
  [selectAllPosts, (state: RootState, userId: string) => userId],
  // 这里取前面的输出 selectAllPosts返回posts 后面又返回了userId
  (posts, userId) => posts.filter((post) => post.user === userId),
)

export const selectPostsStatus = (state: RootState) => state.posts.status

export const selectPostsError = (state: RootState) => state.posts.error

export const addPostsListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    // actionCreator: addNewPost.fulfilled, // 使用matcher来监听
    matcher: apiSlice.endpoints.addNewPost.matchFulfilled,
    effect: async (action, listenerApi) => {
      const { toast } = await import('react-tiny-toast')

      const toastId = toast.show('New Post Added!', {
        variant: 'success',
        position: 'bottom-right',
        pause: true,
      })

      await listenerApi.delay(3000)
      toast.remove(toastId)
    },
  })
}
