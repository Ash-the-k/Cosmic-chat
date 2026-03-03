# Backend Guide — Gemini Multi-Mode Chatbot

## Purpose

This backend exposes a streaming AI chat API powered by Gemini. It supports:

* multi-mode system behavior
* per-request conversation context
* retry handling for transient failures
* clean service/controller separation

The system is intentionally **stateless** and **frontend-agnostic**.

---

## Architecture Overview

Client → Express Route → Controller → Gemini Service → Gemini API

### Responsibilities

* **Routes**: HTTP wiring
* **Controller**: request validation and streaming setup
* **Service**: Gemini interaction and retry logic
* **Config**: client initialization

> ⚠️ Note: Internal structure may evolve as long as the external API contract remains stable.

---

## Project Structure

```
backend/
├── config/
│   └── geminiClient.js
├── controllers/
│   └── chatController.js
├── routes/
│   └── chatRoutes.js
├── services/
│   └── geminiService.js
├── server.js
└── .env
```

---

## Environment Variables

Required in `.env`:

```
GEMINI_API_KEY=your_api_key_here
 
```

### Rules

* Do not commit real API keys
* Do not expose the key to the frontend
* All Gemini calls must go through the backend

---

## API Contract

### Endpoint

```
POST /chat
```

---

### Request Body

```json
{
  "message": "string",
  "history": [
    {
      "role": "user" | "model",
      "parts": [{ "text": "previous message" }]
    }
  ],
  "mode": "default | writer | coder | study"
}
```

### Validation Rules

* `message` must be non-empty
* `history` must follow Gemini format
* `mode` must match MODE_INSTRUCTIONS keys

---

## Response

**Content-Type:** `text/plain`
**Transfer-Encoding:** `chunked`

The response is streamed progressively.

> ⚠️ Important: This endpoint does not return JSON during normal operation.

---

## Mode System

The backend supports multiple AI personas via system instructions.

### Current Modes

* `default`
* `writer`
* `coder`
* `study`

Each mode maps to a detailed system instruction.

### Design Principle

Modes modify **behavior**, not **conversation memory**.
Conversation memory is supplied by the frontend through `history`.

---

## Streaming Pipeline

### Flow

1. Controller validates the request
2. Controller sets streaming headers
3. Service calls Gemini streaming API
4. Chunks are written via `res.write()`
5. Stream ends with `res.end()`

---

### Key Notes

* Streaming uses `generateContentStream`
* Text is forwarded chunk-by-chunk
* No response buffering
* Designed for low perceived latency

> ⚠️ Once streaming begins, the HTTP status code can no longer be modified.

---

## Retry and Resilience

The service includes exponential backoff retry for transient failures.

### Retry Conditions

Retries occur when Gemini returns:

* 503 — model overloaded
* 429 — rate limited

---

### Retry Strategy

* Maximum attempts: 3
* Backoff: exponential (1s → 2s → 4s)
* Retries occur **before the stream begins**

> ⚠️ Once streaming starts, retries are not attempted.

---

## Error Handling

### Pre-stream errors

If Gemini fails before streaming:

* retry if retryable
* otherwise return HTTP 500

### Mid-stream errors

If failure occurs during streaming:

* the stream is terminated safely
* the connection is closed

---

## Stateless Design

The backend does not store conversations.

* The frontend sends full history each request
* Enables horizontal scaling
* Simplifies deployment
* Avoids server-side session complexity

---

## Performance Considerations

Current optimizations:

* streaming responses
* no server-side session storage
* minimal validation overhead
* lightweight Express setup

Potential future improvements:

* rate limiting
* structured logging
* monitoring hooks
* response caching

---

## Health Check

### Endpoint

```
GET /
```

### Response

```
Gemini Chatbot Backend Running
```

Useful for deployment checks and uptime monitoring.

---

## Local Development

### Install

```
npm install
```

### Run

```
nodemon server.js
```

The server starts on the configured port.

---

## Stability Requirements

The following must remain stable:

* streaming headers
* chunked response behavior
* mode key consistency
* environment variable usage
* service/controller separation

---

## Mental Model

Frontend: owns UI and conversation state
Backend: owns AI execution and streaming

As long as the API contract remains stable, internal backend structure may evolve.

---

## Current Capability

The system currently provides:

* multi-mode AI behavior
* streaming responses
* retry resilience
* stateless scaling
* modular backend architecture

