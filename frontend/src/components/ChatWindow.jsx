import MessageBubble from "./MessageBubble";

function ChatWindow({ messages, botLabel }) {
  return (
    <div style={{ minHeight: "300px" }}>
      {messages.map((msg, i) => (
        <MessageBubble
          key={i}
          role={msg.role}
          text={msg.text}
          botLabel={botLabel}
        />
      ))}
    </div>
  );
}

export default ChatWindow;
