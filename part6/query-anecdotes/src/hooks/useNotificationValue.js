import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}
