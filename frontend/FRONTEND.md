# Cosmic Chat - Frontend Architecture

## Overview
Cosmic Chat is a multi-mode AI chatbot built with React that maintains separate conversations for different AI personalities (General, Writer, Coder, Study). It features real-time streaming responses, persistent storage, and a cosmic-themed UI.

---

## Core Architecture

### 1. App.js - The Brain
The main container that orchestrates everything:

```javascript
// Key State Management
const [messagesByMode, setMessagesByMode] = useState({...}); // Stores ALL chats
const [mode, setMode] = useState("default"); // Current active mode
const messages = messagesByMode[mode]; // Derived current chat
```

**How it works:**
- `messagesByMode` is an object with separate arrays for each mode
- When switching modes, we just pull the relevant array
- All modes' histories are preserved simultaneously
- Each message has `{ role: "user" | "bot", text: "content" }`

### 2. Persistence Magic (LocalStorage)
```javascript
useEffect(() => {
  localStorage.setItem("chatMessages", JSON.stringify(messagesByMode));
}, [messagesByMode]);
```
- Automatically saves after EVERY message
- Survives server restarts, browser closes, page refreshes
- Loads on initial boot: `const saved = localStorage.getItem("chatMessages")`

### 3. Mode Configuration
```javascript
const MODE_META = {
  default: { label: "GeneralBot", color: "#6366f1" },
  writer: { label: "WriterBot", color: "#8b5cf6" },
  coder: { label: "CoderBot", color: "#ec4899" },
  study: { label: "StudyBot", color: "#14b8a6" },
};
```

---

## Message Flow

### 1. Sending a Message
```javascript
const sendMessage = async () => {
  // 1. Add user message to UI immediately
  setMessagesByMode(prev => ({
    ...prev,
    [mode]: [...prev[mode], userMsg]
  }));
  
  // 2. Send to backend with history (Gemini format)
  const res = await fetch(`${API_URL}/chat`, {
    body: JSON.stringify({ 
      message: input, 
      history: history.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      })), 
      mode 
    })
  });
  
  // 3. Create empty bot message for streaming
  setMessagesByMode(prev => ({
    ...prev,
    [mode]: [...prev[mode], { role: "bot", text: "" }]
  }));
  
  // 4. Stream response character by character
  const reader = res.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    // ... streaming logic with 5ms delay between chars
  }
}
```

### 2. Streaming Effect
The typing effect is achieved through:
- 5ms delay between characters
- Real-time state updates for each character
- Creates natural "bot is typing" feel
- Uses `TextDecoder` for chunk processing

---

## Component Breakdown

### Sidebar.jsx - Navigation & Controls
The navigation and control center:
- **Mode buttons** - Switch between AI personalities with icons
- **Export button** - Save current chat as JSON
- **Clear button** - Delete current mode's chat
- **Clear All** - Nuke ALL chats (with warning confirmation)
- **User profile** - Cosmic-themed avatar with animated status dot
- **Mobile responsiveness** - Collapsible with overlay

### ChatWindow.jsx - Message Container
Simple container that:
- Maps messages to MessageBubbles
- Handles auto-scrolling with `useRef`
- Passes bot metadata to each bubble

### MessageBubble.jsx - The Heart
Most complex component with multiple responsibilities:

#### a) Markdown Parsing
Custom parser that handles:
```javascript
// Headers (H1 to H6)
# H1, ## H2, ### H3, #### H4, ##### H5, ###### H6

// Text formatting
**bold text** → <strong>
`inline code` → <code>

// Lists
* bullet points
- bullet points
1. numbered lists
2. second item

// Code blocks with language
```python
print("hello")```

// Horizontal rules
---, ***, ___
```

#### b) Typing Indicator
- Shows animated dots while bot is "thinking"
- Only appears on latest bot message with empty text
- Uses bot's color for dots

#### c) Copy Button
- Appears on hover over message
- Copies raw markdown text to clipboard
- Shows checkmark when copied (resets after 2s)
- Positioned next to message bubble

#### d) Dynamic Icons
Each bot has its own SVG icon based on `botLabel`:
- GeneralBot → Circle icon
- WriterBot → Pen icon
- CoderBot → Code brackets icon
- StudyBot → Book icon
- User → Cosmic astronaut icon

#### e) Message Alignment
- Bot messages: Left-aligned with avatar
- User messages: Right-aligned with avatar
- Consistent even during typing
- Avatar colors match mode colors

### WelcomeScreen.jsx - Empty State
Shows when no messages exist:
- Mode-specific greeting with icon
- Suggestion chips for quick starts
- Feature highlights with icons
- Dynamic suggestions based on mode

### ChatInput.jsx - Text Input
- Auto-expanding textarea (up to 120px)
- Enter to send, Shift+Enter for new line
- Disabled during streaming
- Visual focus states with glow
- Loading animation during streaming

### ModeSelector.jsx - Mobile Tabs
Alternative navigation for mobile:
- Horizontal scrollable tabs
- Shows only icons on very small screens
- Used when sidebar is closed

---

## Data Flow

```
User Action
    ↓
ChatInput (sendMessage)
    ↓
App.js (update messagesByMode)
    ↓
LocalStorage (auto-save)
    ↓
ChatWindow re-renders
    ↓
MessageBubble displays with formatting
```

---

## Key Features Explained

### Mode Isolation
Each mode maintains its own history:
```javascript
messagesByMode = {
  default: [{role: "user", text: "Hi"}, {role: "bot", text: "Hello"}],
  writer: [],  // Empty, never started
  coder: [{role: "user", text: "Help with React"}], // Has history
  study: []
}
```
Switching modes is instant because all data is already in memory.

### Streaming with Character Delay
```javascript
for (let i = 0; i < chunk.length; i++) {
  displayText += chunk[i];
  setMessagesByMode(...); // Update with each character
  await new Promise(r => setTimeout(r, 5)); // 5ms delay
}
```
Creates smooth typing animation without overwhelming React.

### Markdown Parsing Strategy
The custom parser:
1. Splits text into lines
2. Detects code blocks (```) and handles them separately
3. Checks each line for headers, lists, HR
4. Parses inline formatting (**bold**, `code`)
5. Returns React elements directly

**Inline Formatting Algorithm:**
```javascript
// Step 1: Find all **bold** text
// Step 2: Split into parts (text + bold elements)
// Step 3: Process each text part for `inline code`
// Step 4: Combine everything preserving order
```

### Copy Button Implementation
```javascript
const handleCopy = () => {
  navigator.clipboard.writeText(text); // Raw markdown, not HTML
  setCopied(true);
  setTimeout(() => setCopied(false), 2000); // Auto-reset
};
```

---

## Storage Strategy

### LocalStorage Schema
```javascript
{
  "default": [/* messages */],
  "writer": [/* messages */],
  "coder": [/* messages */],
  "study": [/* messages */]
}
```

### Persistence Lifecycle
1. **Initial Load**: Check localStorage for existing chats
2. **Every Update**: Auto-save to localStorage via useEffect
3. **Clear Current**: Remove only current mode's messages
4. **Clear All**: Remove from both state AND localStorage
5. **Export**: Convert current mode's array to downloadable JSON

---

## UI/UX Decisions

### Color Coding
Each mode has its own color scheme:
- General: `#6366f1` (Indigo)
- Writer: `#8b5cf6` (Purple)
- Coder: `#ec4899` (Pink)
- Study: `#14b8a6` (Teal)

### Visual Feedback
- Typing dots during streaming
- Hover effects on all buttons
- Copy button fades in on hover
- Status dot pulses for "online"
- Send button animates on click
- Focus states with glow effects

### Mobile Responsiveness
- Sidebar transforms into slide-out panel
- Hamburger menu to reopen closed sidebar
- Input padding adjusted for menu button
- Message bubbles take 95% width on mobile
- ModeSelector shows as tabs when sidebar closed

---

## Security Considerations

1. **No API keys in frontend** - All calls go through backend
2. **Environment variables** - API URL from `.env`
3. **No direct Gemini calls** - Backend proxy only
4. **Input sanitization** - DOMPurify would be used if using innerHTML

---

## Performance Optimizations

1. **Derived state** - `messages = messagesByMode[mode]` not duplicate storage
2. **useRef for scrolling** - Prevents re-renders
3. **Conditional rendering** - WelcomeScreen only when empty
4. **Character streaming** - Small updates prevent UI freeze
5. **Memoization potential** - MessageBubble could be memoized for long chats

---

## File Structure
```
src/
├── App.js                 # Main orchestrator
├── App.css                # Global styles
├── components/
│   ├── Sidebar.jsx        # Navigation & controls
│   ├── ChatWindow.jsx     # Message container
│   ├── MessageBubble.jsx  # Individual message + markdown
│   ├── ChatInput.jsx      # Text input with auto-resize
│   ├── WelcomeScreen.jsx  # Empty state with suggestions
│   └── ModeSelector.jsx   # Mode tabs (mobile)
```

---

## State Management Summary

| State | Location | Purpose |
|-------|----------|---------|
| `messagesByMode` | App.js | Source of truth for all chats |
| `mode` | App.js | Currently selected mode |
| `input` | App.js | Current message being typed |
| `isStreaming` | App.js | Prevents double-sends |
| `sidebarOpen` | App.js | Mobile sidebar state |
| `copied` | MessageBubble | Copy button feedback |
| `isTyping` | MessageBubble | Shows typing indicator |
| `displayText` | MessageBubble | Progressive text during streaming |

---

## Error Handling

1. **Streaming errors** → Show error message in chat bubble
2. **Empty messages** → Block send
3. **LocalStorage failures** → Graceful degradation
4. **Network issues** → User-friendly error bubble
5. **API failures** → Console error + user notification

---

## Unique Implementation Details

### Character-by-Character Streaming
Not just for show - creates anticipation and feels more natural than sudden text dumps. The 5ms delay is barely perceptible but creates a smooth animation.

### Per-Mode History
Each bot has its own personality and memory - switching feels like talking to different assistants. All histories are preserved simultaneously.

### Custom Markdown Parser
Built from scratch to avoid heavy dependencies:
- Lightweight (~200 lines)
- Full control over styling
- Handles mixed formatting (`**bold with `code`**`)
- Extensible for future needs

### Hover-to-Copy
Clean UI pattern that doesn't clutter the interface. Only appears when needed, with visual feedback.

### Cosmic Theme
Consistent space-themed design language:
- Floating animations
- Gradient backgrounds
- Star motifs in icons
- Glowing effects

---

## Testing Checklist

- [ ] Messages persist after refresh
- [ ] Each mode maintains separate history
- [ ] Streaming works smoothly with typing effect
- [ ] Markdown renders correctly (headers, bold, code, lists)
- [ ] Copy button copies raw text
- [ ] Clear All removes everything with confirmation
- [ ] Export creates valid JSON file
- [ ] Mobile responsive with sidebar toggle
- [ ] No memory leaks during long streams
- [ ] Error states show properly
- [ ] Bullet points render with formatting
- [ ] Code blocks show language tags
- [ ] Mode switching preserves scroll position

---

## Environment Variables

```bash
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

This architecture balances simplicity with functionality, making it easy to maintain while providing a polished user experience.