import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '@/app/store'
import { selectCurrentUsername } from '../auth/authSlice'
import { client } from '@/api/client'
import { createAppAsyncThunk } from '@/app/hooks'

interface User {
  id: string
  name: string
}

const userAdapter = createEntityAdapter<User>()
const initialState = userAdapter.getInitialState()

export const fetchUsers = createAppAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get<User[]>('/fakeApi/users')
  return response.data
})

// const initialState: User[] = [
//   { id: '0', name: 'Tianna Jenkins' },
//   { id: '1', name: 'Kevin Grant' },
//   { id: '2', name: 'Madison Price' },
// ]
// const initialState: User[] = []

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, userAdapter.setAll)
  },
  // selectors: {
  //   selectAllUsers: (usersState) => usersState,
  //   selectUserById: (usersState, id: string) => usersState.find((user) => user.id === id),
  //   selectCurrentUser: (state: RootState) => {
  //     const currentUsername = selectCurrentUsername(state)
  //     return selectUserById(state, currentUsername)
  //   },
  // },
})

export default userSlice.reducer

// export const { selectAllUsers, selectUserById, selectCurrentUser } = userSlice.selectors

// 另一种 selector 写法
// export const selectAllUsers = (state: RootState) => state.users

// export const selectUserById = (state: RootState, userId: string | null) =>
//   state.users.find((user) => user.id === userId)
export const { selectAll: selectAllUsers, selectById: selectUserById } = userAdapter.getSelectors(
  (state: RootState) => state.users,
)

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  if (!currentUsername) {
    return
  }
  return selectUserById(state, currentUsername)
}
