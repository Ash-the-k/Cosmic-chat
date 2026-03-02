// components/ModeSelector.jsx
function ModeSelector({ mode, setMode }) {
  const modes = [
    { key: "default", label: "General", icon: "🤖" },
    { key: "writer", label: "Writer", icon: "✍️" },
    { key: "coder", label: "Coder", icon: "💻" },
    { key: "study", label: "Study", icon: "📚" },
  ];

  return (
    <div className="mode-selector">
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => setMode(m.key)}
          className={`mode-btn ${mode === m.key ? 'active' : ''}`}
        >
          <span className="mode-icon">{m.icon}</span>
          <span className="mode-label">{m.label}</span>
        </button>
      ))}

      <style jsx>{`
        .mode-selector {
          display: flex;
          gap: 8px;
          padding: 4px;
          background: #f0f2f5;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .mode-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: #4b5563;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-btn:hover {
          background: rgba(255, 255, 255, 0.7);
          color: #1a1f36;
        }

        .mode-btn.active {
          background: white;
          color: #6366f1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .mode-icon {
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .mode-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default ModeSelector;