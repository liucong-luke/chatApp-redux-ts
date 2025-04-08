import { createSlice } from '@reduxjs/toolkit'
import { client } from '@/api/client'
import { createAppAsyncThunk } from '@/app/hooks'

import { type RootState } from '@/app/store'

export interface ServerNotification {
  id: string
  date: string
  message: string
  user: string
}

export interface ClientNotification extends ServerNotification {
  isNew: boolean
  read: boolean
}

const initialState: ClientNotification[] = []

export const fetchNotifications = createAppAsyncThunk('notifications/fetchNotifications', async (_unused, thunkApi) => {
  const allNotifications = selectAllNotifications(thunkApi.getState())
  // 使用数组解构方法获取allNotifications数组里面的第一个元素
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification ? latestNotification.date : ''
  const response = await client.get<ServerNotification[]>(`/fakeApi/notifications?since=${latestTimestamp}`)
  return response.data
})

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      state.forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const notificationsWithMetadata: ClientNotification[] = action.payload.map((notification) => ({
        ...notification,
        isNew: true,
        read: false,
      }))
      state.forEach((notification) => {
        notification.isNew = !notification.read
      })
      state.push(...notificationsWithMetadata)
      // 以时间排序
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  },
})

export const { allNotificationsRead } = notificationSlice.actions

export const selectAllNotifications = (state: RootState) => state.notifications

export const selectUnreadNotificationsCount = (state: RootState) => {
  const allNotifications = selectAllNotifications(state)
  const unreadNotifications = allNotifications.filter((notification) => !notification.read)
  return unreadNotifications.length
}

export default notificationSlice.reducer
