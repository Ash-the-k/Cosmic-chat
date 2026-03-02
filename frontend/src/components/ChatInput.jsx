function ChatInput({ input, setInput, sendMessage }) {
  return (
    <>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </>
  );
}

export default ChatInput;