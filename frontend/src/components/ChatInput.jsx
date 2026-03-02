// components/ChatInput.jsx
import { useState, useRef, useEffect } from "react";

function ChatInput({ input, setInput, sendMessage, isStreaming, placeholder }) {
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming) {
        sendMessage();
      }
    }
  };

  return (
    <div className={`chat-input-container ${isFocused ? "focused" : ""}`}>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder || "Type a message..."}
        rows={1}
        disabled={isStreaming}
      />

      <button
        onClick={sendMessage}
        disabled={!input.trim() || isStreaming}
        className="send-button"
      >
        {isStreaming ? (
          <span className="sending-dots">
            <span></span>
            <span></span>
            <span></span>
          </span>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
            />
          </svg>
        )}
      </button>

      <style jsx>{`
        .chat-input-container {
          display: flex;
          gap: 12px;
          background: white;
          border: 2px solid #eaeef5;
          border-radius: 16px;
          padding: 8px 8px 8px 16px;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .chat-input-container.focused {
          border-color: #6366f1;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
        }

        textarea {
          flex: 1;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 15px;
          line-height: 1.5;
          resize: none;
          max-height: 120px;
          padding: 12px 0;
          color: #1a1f36;
          background: transparent;
        }

        textarea::placeholder {
          color: #9ca3af;
        }

        textarea:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .send-button {
          width: 48px;
          height: 48px;
          border: none;
          border-radius: 12px;
          background: #6366f1;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          align-self: flex-end;
        }

        .send-button:hover:not(:disabled) {
          background: #4f52e0;
          transform: scale(1.02);
        }

        .send-button:active:not(:disabled) {
          transform: scale(0.98);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #a5a8f1;
        }

        .sending-dots {
          display: flex;
          gap: 3px;
          align-items: center;
          justify-content: center;
        }

        .sending-dots span {
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: sending 1.4s infinite;
        }

        .sending-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .sending-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes sending {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }

        @media (max-width: 768px) {
          .input-wrapper {
            padding: 16px;
            padding-left: 70px; /* Make room for menu button */
          }
        }
      `}</style>
    </div>
  );
}

export default ChatInput;
