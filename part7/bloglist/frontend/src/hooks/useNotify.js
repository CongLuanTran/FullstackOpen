import { useDispatch } from 'react-redux'
import { showNotification } from '../features/notificationSlice'

export const useNotify = () => {
  const dispatch = useDispatch()

  const success = message => {
    dispatch(showNotification({ message, type: 'success' }))
  }

  const error = message => {
    dispatch(showNotification({ message, type: 'error' }))
  }

  return { success, error }
}
