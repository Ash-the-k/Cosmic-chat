// components/ChatWindow.jsx
import MessageBubble from "./MessageBubble";
import { useEffect, useRef } from 'react';

function ChatWindow({ messages, botLabel, botIcon, botColor }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.map((msg, i) => (
        <MessageBubble
          key={i}
          role={msg.role}
          text={msg.text}
          botLabel={botLabel}
          botIcon={botIcon}
          botColor={botColor}
          isLatest={i === messages.length - 1}
        />
      ))}
      <div ref={messagesEndRef} />

      <style jsx>{`
        .chat-window {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #ffffff;
        }

        @media (max-width: 768px) {
          .chat-window {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatWindow;