import { addListener, createListenerMiddleware } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from './store'
import { addPostsListeners } from '@/features/posts/postsSlice'

export const listenerMiddleware = createListenerMiddleware()
export const startAppListening = listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()
export type AppStartListening = typeof startAppListening

export const AddAppListener = addListener.withTypes<RootState, AppDispatch>()
export type AppAddListener = typeof AddAppListener

addPostsListeners(startAppListening)
