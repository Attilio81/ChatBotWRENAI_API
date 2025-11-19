import type { Agent } from '../types';
import './AgentSelector.css';

interface AgentSelectorProps {
  onSelectAgent: (agent: Agent) => void;
}

const AVAILABLE_AGENTS: Agent[] = [
  {
    id: 'wren-ai',
    name: 'WREN AI Assistant',
    description: 'Analisi dati e query in linguaggio naturale',
    icon: '🧠',
    testWebhook: '', // Not used for WREN
    prodWebhook: '', // Not used for WREN
    type: 'wren'
  }
];

export const AgentSelector = ({ onSelectAgent }: AgentSelectorProps) => {
  return (
    <div className="agent-selector">
      <div className="agent-selector-header">
        <h1>Seleziona il tuo Agente Virtuale</h1>
        <p>Scegli l'agente specializzato per le tue esigenze</p>

      </div>

      <div className="agents-grid">
        {AVAILABLE_AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="agent-card"
            onClick={() => onSelectAgent(agent)}
          >
            <div className="agent-icon">{agent.icon}</div>
            <h3 className="agent-name">{agent.name}</h3>
            <p className="agent-description">{agent.description}</p>
            <div className="agent-card-footer">
              <button className="select-button">
                Seleziona Agente
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};