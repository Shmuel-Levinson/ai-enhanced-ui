import React, { useRef, useEffect } from 'react';
import './Chatbot.css';

interface Message {
  id: string | number;
  role: 'assistant' | 'user';
  content: string;
  pythonWriter?: {
    script?: string;
    result?: unknown;
  };
}

interface ChatbotProps {
  messages: Message[];
  isTyping: boolean;
  onSubmit: (inputText: string) => void;
  inputText: string;
  setInputText: (text: string) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ messages, isTyping, onSubmit, inputText, setInputText }) => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus();
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
    
    // Focus input after bot responds (when isTyping changes from true to false)
    if (!isTyping && messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      inputRef.current?.focus();
    }
  }, [messages, isTyping]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If Enter is pressed without Shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (new line)
      handleSubmit(e);
    }
    // If Shift+Enter is pressed, let the default behavior happen (new line)
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    
    if (!inputText?.trim()) return;
    
    // Call the onSubmit function passed from parent
    onSubmit(inputText);
    setInputText('');
  };
  return (
    <>
      <div style={{display: "flex", flexDirection: "column", height: "100%", maxWidth: "800px", width: "100%"}}>
        <div className="">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3></h3>
          </div>

        </div>
        <div className="messages-container"
             style={{marginTop: '10px', flexGrow: 1, overflowY: 'auto', maxWidth:"800px", paddingInline:10}}>
          {messages.map(message => (
            <div
              key={message.id}
              className={`message ${message.role === 'assistant' ? 'bot-message' : 'user-message'}`}
            >
              <div className="message-content">
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}/>
        </div>
        <div className="chatbot-suggestions">
          {/*<p>Try asking:</p>*/}
          <div className="suggestion-buttons">
            {/*<button onClick={() => setInputText("What can you help me with?")}>Capabilities</button>*/}
            {/*<button onClick={() => setInputText("Tell me a fun fact")}>Fun Fact</button>*/}
            {/*<button onClick={() => setInputText("How does AI work?")}>About AI</button>*/}
            {/*<button onClick={() => setInputText("What's the weather like today?")}>Weather</button>*/}
          </div>
        </div>
        <form style={{marginTop: "auto"}} className="chatbot-input" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="How can I help?"
            disabled={isTyping}
            style={{
              width: "100%",
              // outline: "none",
              // border: "none",
              // maxHeight: 80,
              resize: "none",
            }}
          />
          <div style={{height:"100%", display:"flex",}}>
            <button style={{marginTop:"auto",height:"3rem",width:"3rem"}} type="submit" disabled={isTyping || !inputText.trim()}>
              <span className="send-icon">➤</span>
            </button>
          </div>
        </form>
      </div>
    </>
  )
};

export default Chatbot; 