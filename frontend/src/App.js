// App.js
import { useState, useEffect, useRef } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import Sidebar from "./components/Sidebar";
import WelcomeScreen from "./components/WelcomeScreen";
import "./styles/App.css";

// 🔹 Single source of truth for bot display names
const MODE_META = {
  default: {
    label: "GeneralBot",
    description: "Friendly AI for general conversations",
    color: "#6366f1", // Indigo
  },
  writer: {
    label: "WriterBot",
    description: "Creative writing and editing assistant",
    color: "#f59e0b", // Amber (Distinct from Indigo, keeps the same vibrancy)
  },
  coder: {
    label: "CoderBot",
    description: "Programming help and code review",
    color: "#ec4899", // Pink
  },
  study: {
    label: "StudyBot",
    description: "Academic tutor and study helper",
    color: "#14b8a6", // Teal
  },
};

function App() {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  // 🧠 Per-mode chat memory
  const [messagesByMode, setMessagesByMode] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved
      ? JSON.parse(saved)
      : {
          default: [],
          writer: [],
          coder: [],
          study: [],
        };
  });

  const [mode, setMode] = useState("default");

  // ⭐ derived messages for current mode
  const messages = messagesByMode[mode];

  // 💾 Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messagesByMode));
  }, [messagesByMode]);

  // 📜 Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔄 mode switch with smooth transition
  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  // 🗑️ Clear current mode's chat
  const handleClearChat = () => {
    if (window.confirm("Clear all messages in this chat?")) {
      setMessagesByMode((prev) => ({
        ...prev,
        [mode]: [],
      }));
    }
  };

  // 📤 Export current chat
  const handleExportChat = () => {
    const chatData = {
      mode,
      botLabel: MODE_META[mode].label,
      timestamp: new Date().toISOString(),
      messages: messages,
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${mode}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg = { role: "user", text: input };
    const updatedMessages = [...messages, userMsg];

    setMessagesByMode((prev) => ({
      ...prev,
      [mode]: updatedMessages,
    }));

    // Build history in Gemini format
    const history = updatedMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history,
          mode,
        }),
      });

      // Create empty bot message
      setMessagesByMode((prev) => ({
        ...prev,
        [mode]: [...prev[mode], { role: "bot", text: "" }],
      }));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let displayText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        // Stream character by character for smooth typing effect
        for (let i = 0; i < chunk.length; i++) {
          displayText += chunk[i];

          setMessagesByMode((prev) => {
            const updated = [...prev[mode]];
            updated[updated.length - 1] = {
              role: "bot",
              text: displayText,
            };
            return { ...prev, [mode]: updated };
          });

          // Small delay for natural typing feel
          await new Promise((r) => setTimeout(r, 5));
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      // Show error message in chat
      setMessagesByMode((prev) => {
        const updated = [...prev[mode]];
        if (
          updated[updated.length - 1]?.role === "bot" &&
          !updated[updated.length - 1].text
        ) {
          updated[updated.length - 1] = {
            role: "bot",
            text: "Sorry, I encountered an error. Please try again.",
          };
        } else {
          updated.push({
            role: "bot",
            text: "Sorry, I encountered an error. Please try again.",
          });
        }
        return { ...prev, [mode]: updated };
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleClearAllChats = () => {
    setMessagesByMode({
      default: [],
      writer: [],
      coder: [],
      study: [],
    });
    // Also clear from localStorage
    localStorage.removeItem("chatMessages");
  };

  return (
    <div className="app">
      {/* Hamburger menu button - visible when sidebar is closed */}
      {!sidebarOpen && (
        <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}

      <Sidebar
        modes={MODE_META}
        currentMode={mode}
        onModeSelect={handleModeChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onClearChat={handleClearChat}
        onExportChat={handleExportChat}
        onClearAllChats={handleClearAllChats}
        messageCount={messages.length}
      />

      <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="chat-container">
          {messages.length === 0 ? (
            <WelcomeScreen
              mode={mode}
              modeMeta={MODE_META[mode]}
              onSuggestionClick={(suggestion) => {
                setInput(suggestion);
                setTimeout(() => sendMessage(), 100);
              }}
            />
          ) : (
            <ChatWindow
              messages={messages}
              botLabel={MODE_META[mode].label}
              botIcon={MODE_META[mode].icon}
              botColor={MODE_META[mode].color}
            />
          )}
          <div ref={messagesEndRef} />

          <div className="input-wrapper">
            <ChatInput
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              isStreaming={isStreaming}
              placeholder={`Message ${MODE_META[mode].label}...`}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
