import React, { useEffect, useRef } from 'react';
import { FaMicrophone, FaTimes, FaTrash } from 'react-icons/fa';
import { useVoice } from '../context/VoiceContext';
import './VoiceAssistant.css';

const VoiceAssistant = () => {
  const {
    isListening,
    isProcessing,
    chatHistory,
    isChatOpen,
    startListening,
    stopListening,
    clearChat,
    toggleChat
  } = useVoice();

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <>
      {/* Floating Voice Button */}
      <button
        className={`floating-voice-btn ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}
        onClick={isListening ? stopListening : startListening}
        title="Voice Assistant"
      >
        <FaMicrophone />
        {isListening && <span className="pulse-ring"></span>}
      </button>

      {/* Chat Panel */}
      {isChatOpen && (
        <div className="voice-chat-panel">
          <div className="chat-header">
            <div className="chat-title">
              <FaMicrophone /> AI Voice Assistant
            </div>
            <div className="chat-actions">
              <button onClick={clearChat} title="Clear Chat">
                <FaTrash />
              </button>
              <button onClick={toggleChat} title="Close">
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="chat-body">
            {chatHistory.length === 0 ? (
              <div className="chat-welcome">
                <FaMicrophone size={50} />
                <h3>Hi! I'm your AI shopping assistant</h3>
                <p>Click the microphone button below to start talking!</p>
                <div className="voice-commands">
                  <h4>Try saying:</h4>
                  <ul>
                    <li>"Show me laptops under 50000"</li>
                    <li>"Recommend best smartphones"</li>
                    <li>"Add to cart"</li>
                    <li>"Show my cart"</li>
                    <li>"What are the trending products?"</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="chat-messages">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.sender}`}>
                    <div className="message-bubble">
                      {msg.message}
                    </div>
                    <div className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="chat-message ai">
                    <div className="message-bubble processing">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          <div className="chat-footer">
            <button
              className={`voice-record-btn ${isListening ? 'listening' : ''}`}
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
            >
              <FaMicrophone />
              <span>{isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Click to Speak'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
