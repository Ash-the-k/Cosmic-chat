// components/Sidebar.jsx
import { useState } from "react";

function Sidebar({
  modes,
  currentMode,
  onModeSelect,
  isOpen,
  onToggle,
  onClearChat,
  onExportChat,
  onClearAllChats, // New prop
  messageCount,
}) {
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const handleClearAll = () => {
    if (
      window.confirm(
        "⚠️ Are you sure? This will delete ALL chat histories for ALL modes. This cannot be undone!",
      )
    ) {
      onClearAllChats();
      setShowClearAllConfirm(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" fill="url(#cosmicGradient)" />
              {/* Central star */}
              <path
                d="M12 5L13.8 10.2L19 12L13.8 13.8L12 19L10.2 13.8L5 12L10.2 10.2L12 5Z"
                fill="white"
                fillOpacity="0.98"
              />
              {/* Small surrounding stars */}
              <circle cx="7" cy="8" r="0.6" fill="white" fillOpacity="0.6" />
              <circle cx="17" cy="7" r="0.6" fill="white" fillOpacity="0.6" />
              <circle cx="16" cy="16" r="0.6" fill="white" fillOpacity="0.6" />
              <circle cx="8" cy="16" r="0.6" fill="white" fillOpacity="0.6" />
              <defs>
                <linearGradient
                  id="cosmicGradient"
                  x1="2"
                  y1="2"
                  x2="22"
                  y2="22"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6366f1" />
                  <stop offset="0.5" stopColor="#a855f7" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <h2>Cosmic Chat</h2>
          </div>
          <button className="close-sidebar" onClick={onToggle}>
            ×
          </button>
        </div>

        <div className="modes-list">
          {Object.entries(modes).map(([key, meta]) => (
            <button
              key={key}
              className={`mode-item ${currentMode === key ? "active" : ""}`}
              onClick={() => onModeSelect(key)}
              style={{
                "--mode-color": meta.color,
              }}
            >
              <span className="mode-icon">
                {key === "default" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                  </svg>
                )}
                {key === "writer" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {key === "coder" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6ZM14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {key === "study" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3ZM18 9L12 12.18L6 9L12 5.82L18 9ZM6 15V12.5L12 16L18 12.5V15L12 18.5L6 15Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </span>
              <div className="mode-info">
                <span className="mode-name">{meta.label}</span>
                <span className="mode-description">{meta.description}</span>
              </div>
              {currentMode === key && (
                <span className="active-indicator">●</span>
              )}
            </button>
          ))}
        </div>

        {messageCount > 0 && (
          <div className="sidebar-footer">
            <button
              className="sidebar-action export"
              onClick={onExportChat}
              title="Export current chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                  fill="currentColor"
                />
              </svg>
              Export
            </button>
            <button
              className="sidebar-action clear"
              onClick={onClearChat}
              title="Clear current chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                  fill="currentColor"
                />
              </svg>
              Clear
            </button>
          </div>
        )}

        {/* Clear All Chats Button - Always visible */}
        <div className="clear-all-section">
          <button
            className="clear-all-button"
            onClick={handleClearAll}
            title="Delete all chat histories for all modes"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                fill="currentColor"
              />
            </svg>
            <span>Clear All Chats</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="user-info">
            <div className="user-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="5" fill="white" fillOpacity="0.9" />
                <path
                  d="M19 20H5V19C5 15.1 8.1 13 12 13C15.9 13 19 15.1 19 19V20Z"
                  fill="white"
                  fillOpacity="0.9"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="11"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              </svg>
            </div>
            <div className="user-details">
              <span className="user-name">Cosmic Explorer</span>
              <span className="user-status">
                <span className="status-dot"></span>
                Online
              </span>
            </div>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 280px;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
          z-index: 1000;
        }

        .sidebar:not(.open) {
          transform: translateX(-100%);
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 999;
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar-overlay {
            display: block;
          }
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo h2 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .close-sidebar {
          display: none;
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .close-sidebar {
            display: block;
          }
        }

        .modes-list {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mode-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
          position: relative;
        }

        .mode-item:hover {
          background: #f9fafb;
        }

        .mode-item.active {
          background: #f3f4f6;
          border-left: 3px solid var(--mode-color);
        }

        .mode-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--mode-color);
        }

        .mode-info {
          flex: 1;
        }

        .mode-name {
          font-weight: 500;
          font-size: 14px;
          color: #1f2937;
          display: block;
        }

        .mode-description {
          font-size: 11px;
          color: #6b7280;
          margin-top: 2px;
          display: block;
        }

        .active-indicator {
          color: var(--mode-color);
          font-size: 8px;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 8px;
        }

        .sidebar-action {
          flex: 1;
          padding: 8px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          color: #4b5563;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .sidebar-action:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .sidebar-action.clear:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        /* Clear All Section */
        .clear-all-section {
          padding: 12px 16px;
          border-top: 1px solid #e5e7eb;
        }

        .clear-all-button {
          width: 100%;
          padding: 10px;
          border: 1px solid #ef4444;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: #ef4444;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .clear-all-button:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        .sidebar-bottom {
          padding: 20px 16px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 12px;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          animation: float 3s ease-in-out infinite;
          color: white;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          font-size: 14px;
          color: #1f2937;
          display: block;
          margin-bottom: 2px;
        }

        .user-status {
          font-size: 11px;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
        @media (min-width: 769px) {
          .sidebar {
            transform: translateX(0) !important;
          }
          .sidebar-overlay {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default Sidebar;
