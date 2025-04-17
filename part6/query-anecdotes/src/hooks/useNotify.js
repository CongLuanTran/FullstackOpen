import { useNotificationDispatch } from './useNotificationDispatch'

let timeoutId = null

export const useNotify = () => {
  const dispatch = useNotificationDispatch()

  const notify = (message) => {
    if (timeoutId) clearTimeout(timeoutId)
    dispatch({ type: 'SHOW', content: message })

    timeoutId = setTimeout(() => {
      dispatch({ type: 'CLEAR' })
      timeoutId = null
    }, 5000)
  }

  return notify
}
