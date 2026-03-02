function MessageBubble({ role, text, botLabel }) {
  return (
    <p>
      <b>{role === "bot" ? botLabel : "User"}:</b> {text}
    </p>
  );
}

export default MessageBubble;