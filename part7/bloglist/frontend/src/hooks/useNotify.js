import { useNotificationDispatch } from '../context/NotificationContext'

const useNotify = () => {
  const dispatch = useNotificationDispatch()

  const notify = (message, type = 'success') => {
    dispatch({ type: 'SET', payload: { message, type } })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return notify
}

export default useNotify
