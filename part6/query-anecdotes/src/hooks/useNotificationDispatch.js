import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}
