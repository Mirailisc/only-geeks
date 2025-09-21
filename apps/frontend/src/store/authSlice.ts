import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface User {
  email: string
  firstName: string
  lastName: string
  isAdmin: boolean
}

interface AuthState {
  user: User | null
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = action.payload.user
    },
    clearUser: (state) => {
      state.user = null
    },
  },
})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer
