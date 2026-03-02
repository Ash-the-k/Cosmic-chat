
function ModeSelector({ mode, setMode }) {
  const modes = [
    { key: "default", label: "General" },
    { key: "writer", label: "Writer" },
    { key: "coder", label: "Coder" },
    { key: "study", label: "Study" },
  ];

  return (
    <div style={{ marginBottom: "15px" }}>
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => setMode(m.key)}
          style={{
            marginRight: "8px",
            padding: "6px 12px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            backgroundColor: mode === m.key ? "#333" : "#fff",
            color: mode === m.key ? "#fff" : "#000",
            cursor: "pointer",
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

export default ModeSelector;