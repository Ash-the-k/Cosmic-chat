// components/WelcomeScreen.jsx
function WelcomeScreen({ mode, modeMeta, onSuggestionClick }) {
  const suggestions = {
    default: [
      "What can you help me with?",
      "Tell me a fun fact",
      "How does AI work?",
      "Give me a productivity tip"
    ],
    writer: [
      "Help me write a poem",
      "Edit this paragraph",
      "Give me story ideas",
      "How to improve my writing?"
    ],
    coder: [
      "Explain React hooks",
      "Debug this code",
      "Best Python practices",
      "Create a simple API"
    ],
    study: [
      "Explain quantum physics simply",
      "Help me study for exams",
      "Math problem help",
      "Create a study schedule"
    ]
  };

  // Mode icons as SVGs
  const getModeIcon = () => {
    switch(mode) {
      case 'writer':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"/>
          </svg>
        );
      case 'coder':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <path d="M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6ZM14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6Z"/>
          </svg>
        );
      case 'study':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3ZM18 9L12 12.18L6 9L12 5.82L18 9ZM6 15V12.5L12 16L18 12.5V15L12 18.5L6 15Z"/>
          </svg>
        );
      default:
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" opacity="0.3"/>
            <circle cx="12" cy="12" r="4"/>
          </svg>
        );
    }
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div 
          className="welcome-icon"
          style={{ background: modeMeta.color }}
        >
          {getModeIcon()}
        </div>
        
        <h1>
          Chat with <span style={{ color: modeMeta.color }}>{modeMeta.label}</span>
        </h1>
        
        <p className="welcome-description">
          {modeMeta.description}
        </p>

        <div className="suggestions">
          <h3>Try asking:</h3>
          <div className="suggestion-grid">
            {suggestions[mode].map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-chip"
                onClick={() => onSuggestionClick(suggestion)}
                style={{
                  '--hover-color': modeMeta.color
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="features">
          <div className="feature">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z"/>
            </svg>
            <span>Smart responses</span>
          </div>
          <div className="feature">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 7H11V13H13V7ZM13 15H11V17H13V15Z"/>
            </svg>
            <span>Real-time streaming</span>
          </div>
          <div className="feature">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 16H13V18H11V16ZM11 6H13V14H11V6Z"/>
            </svg>
            <span>Switch modes anytime</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .welcome-screen {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: white;
        }

        .welcome-content {
          max-width: 600px;
          text-align: center;
        }

        .welcome-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        h1 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1f2937;
        }

        .welcome-description {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .suggestions {
          margin-bottom: 40px;
        }

        .suggestions h3 {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .suggestion-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .suggestion-chip {
          padding: 14px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          color: #1f2937;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          font-weight: 400;
        }

        .suggestion-chip:hover {
          border-color: var(--hover-color);
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .features {
          display: flex;
          justify-content: center;
          gap: 24px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .suggestion-grid {
            grid-template-columns: 1fr;
          }

          .features {
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }

          h1 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}

export default WelcomeScreen;