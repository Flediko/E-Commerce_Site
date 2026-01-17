import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const VoiceContext = createContext();

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within VoiceProvider');
  }
  return context;
};

export const VoiceProvider = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true; // Show interim results for better UX
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => {
        setIsListening(true);
        addToChatHistory('system', '🎤 Listening... Speak now!');
      };

      recognitionInstance.onresult = async (event) => {
        // Get the latest result
        const last = event.results.length - 1;
        const speechResult = event.results[last][0].transcript;
        
        // Only process if it's a final result
        if (event.results[last].isFinal) {
          setTranscript(speechResult);
          await processCommand(speechResult);
        } else {
          // Show interim results
          setTranscript(speechResult + '...');
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = 'Sorry, I didn\'t catch that. Please try again.';
        if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please try again.';
        } else if (event.error === 'audio-capture') {
          errorMessage = 'Microphone not found. Please check your microphone.';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Microphone access denied. Please allow microphone access.';
        }
        
        addToChatHistory('system', errorMessage);
        speak(errorMessage);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      return recognitionInstance;
    }
    return null;
  }, []);

  // Start listening
  const startListening = () => {
    let recog = recognition;
    if (!recog) {
      recog = initSpeechRecognition();
    }
    
    if (recog) {
      try {
        recog.start();
        addToChatHistory('system', 'Listening...');
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Process voice command
  const processCommand = async (command) => {
    setIsProcessing(true);
    addToChatHistory('user', command);

    try {
      const { data } = await axios.post('/api/ai/voice-command', {
        command,
        context: {
          page: window.location.pathname
        }
      });

      const aiResponse = data.response || 'I didn\'t understand that.';
      setResponse(aiResponse);
      addToChatHistory('ai', aiResponse);
      speak(aiResponse);

      // Handle actions with full data object
      if (data.action) {
        handleAction(data.action, data);
      }

    } catch (error) {
      console.error('Error processing command:', error);
      const errorMsg = 'Sorry, I encountered an error. Please try again.';
      setResponse(errorMsg);
      addToChatHistory('ai', errorMsg);
      speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-to-speech
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Add to chat history
  const addToChatHistory = (sender, message) => {
    setChatHistory(prev => [...prev, {
      sender,
      message,
      timestamp: new Date()
    }]);
  };

  // Handle actions from AI
  const handleAction = (action, data) => {
    switch (action) {
      case 'NAVIGATE':
        if (data.url) {
          window.location.href = data.url;
        }
        break;
        
      case 'SEARCH_CATEGORY':
        if (data.products && data.products.length > 0) {
          sessionStorage.setItem('voiceSearchResults', JSON.stringify(data.products));
          sessionStorage.setItem('voiceSearchQuery', data.category || '');
          window.location.href = '/products';
        }
        break;
        
      case 'SEARCH_PRICE':
      case 'SEARCH_PRICE_RANGE':
        if (data.products && data.products.length > 0) {
          sessionStorage.setItem('voiceSearchResults', JSON.stringify(data.products));
          sessionStorage.setItem('voiceSearchQuery', 'Price filtered results');
          window.location.href = '/products';
        }
        break;
        
      case 'SHOW_PRODUCTS':
      case 'SHOW_RESULTS':
        if (data.products && data.products.length > 0) {
          sessionStorage.setItem('voiceSearchResults', JSON.stringify(data.products));
          window.dispatchEvent(new Event('voiceSearchResults'));
        }
        break;
        
      case 'VIEW_CART':
        window.location.href = '/cart';
        break;
        
      case 'CHECKOUT':
        window.location.href = '/checkout';
        break;
        
      default:
        break;
    }
  };

  // Clear chat
  const clearChat = () => {
    setChatHistory([]);
    setTranscript('');
    setResponse('');
  };

  // Toggle chat panel
  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  const value = {
    isListening,
    isProcessing,
    transcript,
    response,
    chatHistory,
    isChatOpen,
    startListening,
    stopListening,
    speak,
    clearChat,
    toggleChat
  };

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};
