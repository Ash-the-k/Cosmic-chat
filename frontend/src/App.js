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

  // 🔄 mode switch (NO reset now)
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

    // ✅ build history from correct mode
    const history = updatedMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history,
          mode,
        }),
      });

      const data = await res.json();

      const botMsg = { role: "bot", text: data.reply };

      // ✅ append bot message to correct mode
      setMessagesByMode((prev) => ({
        ...prev,
        [mode]: [...prev[mode], botMsg],
      }));
    } catch (err) {
      console.error(err);
    }

    setInput("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gemini Chatbot</h2>

      <ModeSelector mode={mode} setMode={handleModeChange} />

      <ChatWindow messages={messages} botLabel={MODE_META[mode].label} />

      <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
    </div>
  );
}

export default App;
