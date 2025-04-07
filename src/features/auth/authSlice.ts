import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  username: string | null
}

const initialState: AuthState = {
  username: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn(state, action: PayloadAction<string>) {
      state.username = action.payload
    },
    userLoggedOut(state) {
      state.username = null
    },
  },

  // 这儿类型会报错，暂时不知道什么原因 //TODO
  // selectors: {
  //   selectCurrentUsername: (state: RootState) => state.auth.username,
  // },
})

export const { userLoggedIn, userLoggedOut } = authSlice.actions

// export const { selectCurrentUsername } = authSlice.selectors

export const selectCurrentUsername = (state: RootState) => state.auth.username

export default authSlice.reducer
