export const Notification = ({ message, setErrorMessage }) => {
  if (message == null) {
    return null;
  }

  setTimeout(() => {
    setErrorMessage(null);
  }, 3000);

  return (
    <div className='error'>
      {message}
    </div>
  );
};
