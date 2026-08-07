function AlertMessage({ message }) {
  if (!message) return null;

  return (
    <p className={message.startsWith("✅") ? "success" : "error"}>
      {message}
    </p>
  );
}

export default AlertMessage;