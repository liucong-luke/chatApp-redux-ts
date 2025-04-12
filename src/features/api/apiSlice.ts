import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { type Post, type NewPost, type PostUpdate } from '@/features/posts/postsSlice'
import { type User } from '@/features/users/usersSlice'
export { type Post }

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    // 如果某个端点不需要参数，则可以使用void类型
    getPosts: builder.query<Post[], void>({
      // 可以通过返回对象的形式修改为POST 等 { url: '/posts', method: 'POST', body: newPost }
      query: () => '/posts', // 默认 get，所以端点名称是 getPosts
      // providesTags: ['Post'], // 表示这个请求提供的是 Post 标签，以便后面请求可以更新这个请求
      providesTags: (result = [], error, arg) => ['Post', ...result.map(({ id }) => ({ type: 'Post', id }) as const)],
    }),
    getPost: builder.query<Post, string>({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, arg) => [{ type: 'Post', id: arg }],
    }),
    addNewPost: builder.mutation<Post, NewPost>({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: ['Post'], // 表示请求了addNewPost后会自动请求一次提供Post标签的方法，这里就是getPosts
    }),
    editPost: builder.mutation<Post, PostUpdate>({
      query: (post) => ({
        url: `/posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),

    getUsers: builder.query<User[], void>({
      query: () => '/users',
    }),
  }),
})

// 导出的方法名称由来：use(hook名称前缀)GetPosts(端点名称：首字母大写)Query(端点类型：Query 或 Mutation)
export const { useGetPostsQuery, useGetPostQuery, useAddNewPostMutation, useEditPostMutation, useLazyGetUsersQuery } =
  apiSlice
