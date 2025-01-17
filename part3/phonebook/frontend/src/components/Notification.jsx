export const Notification = ({ message }) => {
  if (message.content == null) {
    return null;
  }

  return <div className={message.type}>{message.content}</div>;
};
