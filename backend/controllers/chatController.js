import { streamChatReply } from "../services/geminiService.js";

export const chatHandler = async (req, res) => {
  const startTime = Date.now();

  try {
    const { message, history, mode } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("📩 User message:", message);

    const contents = [
      ...(history || []),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    // ✅ MUST set headers BEFORE streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    // ✅ ONLY ONE CALL — pass res
    await streamChatReply(contents, mode, res);

    const duration = Date.now() - startTime;
    console.log(`⏱️ Response time: ${duration} ms`);
  } catch (error) {
    console.error("❌ Chat error:", error?.message || error);
    res.status(500).json({ error: "Failed to generate response" });
  }
};