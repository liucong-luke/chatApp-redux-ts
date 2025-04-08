import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { TimeAgo } from '@/components/TimeAgo'
import { allNotificationsRead, selectAllNotifications } from './notificationsSlice'
import { PostAuthor } from '../posts/PostAuthor'
import { useLayoutEffect } from 'react'
import classNames from 'classnames'

export const NotificationsList = () => {
  const notifications = useAppSelector(selectAllNotifications)
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderedNotifications = notifications.map((notification) => {
    const notificationClassname = classNames('notification', { new: notification.isNew })
    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>
            <PostAuthor userId={notification.user} showPrefix={true} />
          </b>{' '}
          {notification.message}
        </div>
        <TimeAgo timestamp={notification.date} />
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
