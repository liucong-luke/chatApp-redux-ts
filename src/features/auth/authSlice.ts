import { RootState } from '@/app/store'
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '@/api/client'
import { createAppAsyncThunk } from '@/app/hooks'

interface AuthState {
  username: string | null
}

const initialState: AuthState = {
  username: null,
}

export const login = createAppAsyncThunk('auth/login', async (username: string) => {
  await client.post('/fakeApi/login', { username })
  return username
})

export const logout = createAppAsyncThunk('auth/logout', async () => {
  await client.post('/fakeApi/logout', {})
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // userLoggedIn(state, action: PayloadAction<string>) {
    //   state.username = action.payload
    // },
    // userLoggedOut(state) {
    //   state.username = null
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.username = action.payload
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.username = null
      })
  },

  // 这儿类型会报错，暂时不知道什么原因 //TODO
  // selectors: {
  //   selectCurrentUsername: (state: RootState) => state.auth.username,
  // },
})

// export const { userLoggedIn, userLoggedOut } = authSlice.actions

// export const { selectCurrentUsername } = authSlice.selectors

export const selectCurrentUsername = (state: RootState) => state.auth.username

export default authSlice.reducer
