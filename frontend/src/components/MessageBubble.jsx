// components/MessageBubble.jsx
import { useState, useEffect } from "react";

function MessageBubble({ role, text, botLabel, botColor, isLatest }) {
  const isBot = role === "bot";
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isBot && isLatest && text === "") {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [isBot, isLatest, text]);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse markdown-like syntax
  const parseMessage = (content) => {
    if (!content) return null;

    const lines = content.split("\n");
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeContent = [];
    const elements = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for code block start/end
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          // Start of code block
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
          codeContent = [];
        } else {
          // End of code block
          inCodeBlock = false;
          elements.push(
            <div key={`code-${i}`} className="code-block-wrapper">
              {codeLanguage && (
                <div className="code-language">{codeLanguage}</div>
              )}
              <pre className="code-block">
                <code>{codeContent.join("\n")}</code>
              </pre>
            </div>,
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        continue;
      }

      // Parse inline formatting
      if (line.trim() === "") {
        elements.push(<br key={`br-${i}`} />);
        continue;
      }

      // Check for headers (###### to #)
      if (line.startsWith("###### ")) {
        elements.push(
          <h6 key={i} className="markdown-h6">
            {parseInlineFormatting(line.slice(7))}
          </h6>,
        );
        continue;
      }
      if (line.startsWith("##### ")) {
        elements.push(
          <h5 key={i} className="markdown-h5">
            {parseInlineFormatting(line.slice(6))}
          </h5>,
        );
        continue;
      }
      if (line.startsWith("#### ")) {
        elements.push(
          <h4 key={i} className="markdown-h4">
            {parseInlineFormatting(line.slice(5))}
          </h4>,
        );
        continue;
      }
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="markdown-h3">
            {parseInlineFormatting(line.slice(4))}
          </h3>,
        );
        continue;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="markdown-h2">
            {parseInlineFormatting(line.slice(3))}
          </h2>,
        );
        continue;
      }
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} className="markdown-h1">
            {parseInlineFormatting(line.slice(2))}
          </h1>,
        );
        continue;
      }

      // Check for horizontal rule
      if (
        line.startsWith("---") ||
        line.startsWith("***") ||
        line.startsWith("___")
      ) {
        elements.push(<hr key={`hr-${i}`} className="markdown-hr" />);
        continue;
      }

      // Check for bullet points
      // In parseMessage function - Update the bullet point section

      // Check for bullet points
      if (line.startsWith("* ") || line.startsWith("- ")) {
        // Get the content after the bullet marker
        const content = line.slice(2);
        // Parse the content which might contain **bold** or `code`
        const parsedContent = parseInlineFormatting(content);

        elements.push(
          <div key={i} className="bullet-point">
            <span className="bullet">•</span>
            <span className="bullet-content">{parsedContent}</span>
          </div>,
        );
        continue;
      }

      // Check for numbered lists
      // Check for numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (numberedMatch) {
        const content = numberedMatch[2];
        const parsedContent = parseInlineFormatting(content);

        elements.push(
          <div key={i} className="numbered-point">
            <span className="number">{numberedMatch[1]}.</span>
            <span className="numbered-content">{parsedContent}</span>
          </div>,
        );
        continue;
      }

      // Regular paragraph with inline formatting
      elements.push(
        <p key={i} className="markdown-paragraph">
          {parseInlineFormatting(line)}
        </p>,
      );
    }

    return elements;
  };

  // Parse inline formatting (bold, code, etc.)
  // In MessageBubble.jsx - Complete fixed parseInlineFormatting function

  // In MessageBubble.jsx - Fix the parseInlineFormatting function

  // Parse inline formatting (bold, code, etc.)
  const parseInlineFormatting = (text) => {
    if (!text) return text;

    // First handle **bold** text
    const parts = [];
    let lastIndex = 0;
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add bold text
      parts.push(<strong key={`bold-${match.index}`}>{match[1]}</strong>);

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    // Now process each part for inline code
    const finalParts = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (typeof part === "string") {
        // Process string parts for inline code
        const codeRegex = /`(.*?)`/g;
        const codeParts = [];
        let codeLastIndex = 0;

        while ((match = codeRegex.exec(part)) !== null) {
          if (match.index > codeLastIndex) {
            codeParts.push(part.slice(codeLastIndex, match.index));
          }
          codeParts.push(
            <code key={`${i}-code-${match.index}`} className="inline-code">
              {match[1]}
            </code>,
          );
          codeLastIndex = match.index + match[0].length;
        }

        if (codeLastIndex < part.length) {
          codeParts.push(part.slice(codeLastIndex));
        }

        if (codeParts.length > 1) {
          // This part had code blocks
          finalParts.push(...codeParts);
        } else {
          // No code blocks, add the original string
          finalParts.push(part);
        }
      } else {
        // This is already a React element (bold text)
        finalParts.push(part);
      }
    }

    return finalParts.length > 1 ? finalParts : finalParts[0] || text;
  };

  // Bot icon based on label
  const BotIcon = () => {
    if (botLabel === "GeneralBot") {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" fill="white" />
        </svg>
      );
    } else if (botLabel === "WriterBot") {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
            fill="white"
          />
        </svg>
      );
    } else if (botLabel === "CoderBot") {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6ZM14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6Z"
            fill="white"
          />
        </svg>
      );
    } else if (botLabel === "StudyBot") {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3ZM18 9L12 12.18L6 9L12 5.82L18 9ZM6 15V12.5L12 16L18 12.5V15L12 18.5L6 15Z"
            fill="white"
          />
        </svg>
      );
    } else {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
            fill="white"
          />
        </svg>
      );
    }
  };

  // User Icon
  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="5" fill="currentColor" fillOpacity="0.9" />
      <path
        d="M19 20H5V19C5 15.1 8.1 13 12 13C15.9 13 19 15.1 19 19V20Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <circle
        cx="12"
        cy="12"
        r="11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
    </svg>
  );

  return (
    <div className={`message-row ${isBot ? "bot-row" : "user-row"}`}>
      <div className="message-container">
        {isBot && (
          <div className="avatar" style={{ background: botColor }}>
            <BotIcon />
          </div>
        )}

        <div className="message-content">
          <div className="message-header">
            <span className="sender-name">{isBot ? botLabel : "You"}</span>
            <span className="message-time">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className={`message-bubble-wrapper`}>
            <div
              className={`message-bubble ${isBot ? "bot-bubble" : "user-bubble"}`}
              style={!isBot ? { background: botColor } : {}}
            >
              {isTyping ? (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                <div className="message-text">{parseMessage(displayText)}</div>
              )}
            </div>

            {/* Copy button */}
            {!isTyping && displayText && (
              <button
                className={`copy-button ${copied ? "copied" : ""}`}
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {!isBot && (
          <div
            className="avatar"
            style={{ background: "#e5e7eb", color: "#4b5563" }}
          >
            <UserIcon />
          </div>
        )}
      </div>

      <style jsx>{`
        .message-row {
          width: 100%;
          display: flex;
          margin-bottom: 20px;
        }

        .bot-row {
          justify-content: flex-start;
        }

        .user-row {
          justify-content: flex-end;
        }

        .message-container {
          display: flex;
          gap: 12px;
          max-width: 85%;
          align-items: flex-start;
        }

        .bot-row .message-container {
          flex-direction: row;
        }

        .user-row .message-container {
          flex-direction: row-reverse;
        }

        @media (max-width: 768px) {
          .message-container {
            max-width: 95%;
          }
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .message-content {
          flex: 1;
        }

        .bot-row .message-content {
          text-align: left;
        }

        .user-row .message-content {
          text-align: right;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .bot-row .message-header {
          justify-content: flex-start;
        }

        .user-row .message-header {
          justify-content: flex-end;
        }

        .sender-name {
          font-weight: 600;
          font-size: 13px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .message-time {
          font-size: 11px;
          color: #9ca3af;
        }

        .message-bubble-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .bot-row .message-bubble-wrapper {
          flex-direction: row;
        }

        .user-row .message-bubble-wrapper {
          flex-direction: row-reverse;
        }

        .message-bubble {
          padding: 14px 18px;
          border-radius: 18px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          max-width: 100%;
          word-wrap: break-word;
        }

        .bot-bubble {
          background: #f3f4f6;
          color: #1f2937;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 18px;
        }

        .user-bubble {
          color: white;
          border-bottom-left-radius: 18px;
          border-bottom-right-radius: 4px;
        }

        .message-text {
          line-height: 1.6;
          font-size: 14px;
        }

        /* Markdown Styles */
        .markdown-h1 {
          font-size: 1.8em;
          font-weight: 700;
          margin: 0.5em 0 0.3em;
        }

        .markdown-h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.5em 0 0.3em;
        }

        .markdown-h3 {
          font-size: 1.3em;
          font-weight: 600;
          margin: 0.4em 0 0.2em;
        }

        .markdown-h4 {
          font-size: 1.1em;
          font-weight: 600;
          margin: 0.3em 0 0.2em;
        }

        .markdown-hr {
          border: none;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          margin: 1em 0;
        }

        .markdown-paragraph {
          margin: 0.5em 0;
          line-height: 1.6;
        }

        .bullet-point {
          display: flex;
          gap: 8px;
          margin: 0.3em 0;
          line-height: 1.5;
        }

        .bullet {
          color: inherit;
          font-weight: bold;
        }

        .numbered-point {
          display: flex;
          gap: 8px;
          margin: 0.3em 0;
          line-height: 1.5;
        }

        .number {
          font-weight: 600;
          min-width: 24px;
        }

        .code-block-wrapper {
          margin: 12px 0;
          border-radius: 8px;
          overflow: hidden;
          background: #1e1e2e;
        }

        .code-language {
          background: #2d2d3a;
          color: #a0a0b0;
          padding: 6px 12px;
          font-size: 12px;
          font-family: monospace;
          text-transform: uppercase;
          border-bottom: 1px solid #3d3d4a;
        }

        .code-block {
          margin: 0;
          padding: 16px;
          overflow-x: auto;
          font-family: "Fira Code", "Courier New", monospace;
          font-size: 13px;
          line-height: 1.5;
          color: #e4e4e7;
        }

        .code-block code {
          font-family: inherit;
        }

        .inline-code {
          background: rgba(0, 0, 0, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: "Fira Code", monospace;
          font-size: 13px;
          color: ${isBot ? "#d14" : "rgba(255, 255, 255, 0.9)"};
        }

        .user-bubble .inline-code {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        strong {
          font-weight: 700;
          color: inherit;
        }

        /* Copy button */
        .copy-button {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          opacity: 0;
          flex-shrink: 0;
        }

        .message-bubble-wrapper:hover .copy-button {
          opacity: 1;
        }

        .copy-button:hover {
          background: #e5e7eb;
          color: #4b5563;
        }

        .copy-button.copied {
          opacity: 1;
          color: #10b981;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 8px 4px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: ${botColor};
          border-radius: 50%;
          opacity: 0.4;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }

        .markdown-h4 {
          font-size: 1.2em;
          font-weight: 600;
          margin: 0.4em 0 0.2em;
          color: inherit;
        }

        .markdown-h5 {
          font-size: 1.1em;
          font-weight: 600;
          margin: 0.3em 0 0.2em;
          color: inherit;
        }

        .markdown-h6 {
          font-size: 1em;
          font-weight: 600;
          margin: 0.2em 0;
          color: inherit;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        /* Add to your styles */
        .bullet-content {
          display: inline;
          line-height: 1.5;
        }

        .bullet-content strong {
          font-weight: 700;
          color: inherit;
        }
      `}</style>
    </div>
  );
}

export default MessageBubble;
