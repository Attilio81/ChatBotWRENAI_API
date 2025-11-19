import type { Agent } from '../types';
import './ChatHeader.css';

interface ChatHeaderProps {
  sessionId: string;
  isTestMode: boolean;
  selectedAgent: Agent;
  onToggleMode: () => void;
  onBackToSelection: () => void;
}

export const ChatHeader = ({
  sessionId,
  isTestMode,
  selectedAgent,
  onToggleMode,
  onBackToSelection
}: ChatHeaderProps) => {
  return (
    <div className="chat-header">
      <div className="header-top">
        <button
          className="back-button"
          onClick={onBackToSelection}
          title="Torna alla selezione agenti"
        >
          ← Cambia Agente
        </button>

        <div className="agent-info">
          <span className="agent-icon">{selectedAgent.icon}</span>
          <div className="agent-details">
            <h2 className="agent-name">{selectedAgent.name}</h2>
            <p className="agent-description">{selectedAgent.description}</p>
          </div>
        </div>

        <div className="mode-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isTestMode}
              onChange={onToggleMode}
            />
            <span className="slider"></span>
          </label>
          <span className="mode-label">
            {isTestMode ? '🧪 Test Mode' : '🚀 Production Mode'}
          </span>
        </div>
      </div>
    </div>
  );
};