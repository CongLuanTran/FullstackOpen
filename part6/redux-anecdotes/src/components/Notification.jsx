import { useDispatch, useSelector } from 'react-redux'
import { notify } from '../reducers/notificationReducer'

// timeoutId need to be hear so that it is not reset every rendering
let timeoutId = null

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  const showNotification = (notification) => {
    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      dispatch(notify(null))
      timeoutId = null
    }, 5000)

    return notification
  }

  if (notification !== null) {
    return (
      <div style={style}>
        {showNotification(notification)}
      </div>
    )
  }
}

export default Notification
