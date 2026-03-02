import { useState } from "react";
import ModeSelector from "./components/ModeSelector";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

// 🔹 Single source of truth for bot display names
const MODE_META = {
  default: { label: "GeneralBot" },
  writer: { label: "WriterBot" },
  coder: { label: "CoderBot" },
  study: { label: "StudyBot" },
};

function App() {
  const [input, setInput] = useState("");

  // 🧠 Per-mode chat memory
  const [messagesByMode, setMessagesByMode] = useState({
    default: [],
    writer: [],
    coder: [],
    study: [],
  });

  const [mode, setMode] = useState("default");

  // ⭐ derived messages for current mode
  const messages = messagesByMode[mode];

  // 🔄 mode switch (NO reset)
  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };

    // ✅ update only current mode messages
    const updatedMessages = [...messages, userMsg];

    setMessagesByMode((prev) => ({
      ...prev,
      [mode]: updatedMessages,
    }));

    // ✅ build history
    const history = updatedMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: input,
            history,
            mode,
          }),
        }
      );

      // 🟢 create empty bot message first
      let displayText = "";

      setMessagesByMode((prev) => ({
        ...prev,
        [mode]: [...prev[mode], { role: "bot", text: "" }],
      }));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        // ⭐ smooth typing effect
        for (let i = 0; i < chunk.length; i++) {
          displayText += chunk[i];

          setMessagesByMode((prev) => {
            const updated = [...prev[mode]];
            updated[updated.length - 1] = {
              role: "bot",
              text: displayText,
            };

            return {
              ...prev,
              [mode]: updated,
            };
          });

          // tiny delay = smooth feel
          await new Promise((r) => setTimeout(r, 8));
        }
      }
    } catch (err) {
      console.error(err);
    }

    setInput("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gemini Chatbot</h2>

      <ModeSelector mode={mode} setMode={handleModeChange} />

      <ChatWindow
        messages={messages}
        botLabel={MODE_META[mode].label}
      />

      <ChatInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default App;