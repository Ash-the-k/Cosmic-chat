import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send("🚀 Gemini Chatbot Backend Running");
});

// routes
app.use("/", chatRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});