export const Notification = ({
  message,
  setMessage,
  messageType,
  setMessageType,
}) => {
  if (message == null || messageType == null) {
    return null;
  }

  setTimeout(() => {
    setMessage(null);
    setMessageType(null);
  }, 3000);

  return <div className={messageType}>{message}</div>;
};
