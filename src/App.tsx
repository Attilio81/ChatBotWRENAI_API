import { useChat } from './hooks/useChat';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import { AgentSelector } from './components/AgentSelector';
import { QuickQuestions } from './components/QuickQuestions';
import type { Agent } from './types';
import './styles/global.css';

function App() {
  const {
    messages,
    inputText,
    setInputText,
    isLoading,
    sessionId,
    isTestMode,
    setIsTestMode,
    selectedAgent,
    setSelectedAgent,
    sendMessage,
    resetChat,
    updateMessage
  } = useChat();

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    resetChat(); // Azzera la chat quando si seleziona un nuovo agente
  };

  const handleBackToSelection = () => {
    setSelectedAgent(null);
    resetChat(); // Azzera la chat anche quando si torna alla selezione
  };

  if (!selectedAgent) {
    return (
      <AgentSelector
        onSelectAgent={handleSelectAgent}
      />
    );
  }

  return (
    <div className="chat-container">
      <ChatHeader
        sessionId={sessionId}
        isTestMode={isTestMode}
        selectedAgent={selectedAgent}
        onToggleMode={() => setIsTestMode(!isTestMode)}
        onBackToSelection={handleBackToSelection}
      />
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        onUpdateMessage={updateMessage}
      />
      {selectedAgent.type === 'wren' && (
        <QuickQuestions onSelectQuestion={sendMessage} />
      )}
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />
    </div>
  )
}

export default App
