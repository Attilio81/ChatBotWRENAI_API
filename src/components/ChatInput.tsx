import type { KeyboardEvent } from 'react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import './ChatInput.css';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  isLoading: boolean;
  onSendMessage: () => void;
}

export const ChatInput = ({
  inputText,
  setInputText,
  isLoading,
  onSendMessage
}: ChatInputProps) => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    const newText = inputText + (inputText ? ' ' : '') + transcript;
    setInputText(newText);
  };

  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
    error
  } = useVoiceRecognition(handleVoiceTranscript);

  const toggleVoiceRecognition = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="chat-input">
      {error && (
        <div className="voice-error">
          {error}
        </div>
      )}
      <div className="input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Scrivi il tuo messaggio..."
          disabled={isLoading}
          className="message-input"
          rows={1}
        />
        {isSupported && (
          <button
            onClick={toggleVoiceRecognition}
            disabled={isLoading}
            className={`voice-button ${isListening ? 'listening' : ''}`}
            title={isListening ? 'Ferma registrazione' : 'Inizia registrazione vocale'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z"
                fill="currentColor"
              />
              <path
                d="M17 11C17 14.76 14.76 17 11 17H13C16.31 17 19 14.31 19 11H17Z"
                fill="currentColor"
              />
              <path
                d="M11 19V22H13V19H11Z"
                fill="currentColor"
              />
              <path
                d="M9 22H15V20H9V22Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
        <button
          onClick={onSendMessage}
          disabled={isLoading || !inputText.trim()}
          className="send-button"
        >
          {isLoading ? (
            <div className="loading-spinner" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 12L22 2L13 21L11 13L2 12Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};