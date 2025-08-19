import React, { useRef, useEffect } from 'react';
import './Chatbot.css';
import { Loader } from './Loader';
import {IMessage} from "../types.ts";



interface ChatbotProps {
  messages: IMessage[];
  isWorking: boolean;
  onSubmit: (inputText: string) => void;
  inputText: string;
  setInputText: (text: string) => void;
  clearMessages: () => void;
}

const COMPLEX_REQUEST = `Go to transactions, set filters amount between 50 and 100 and show only august transactions. then go to dashboard
and add a pie chart breakdown by payment method and a barchart breakdown by category and also i want to switch to dark theme`

const Chatbot: React.FC<ChatbotProps> = ({ messages, isWorking, onSubmit, inputText, setInputText, clearMessages }) => {
  const messagesEndRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  
  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollToBottom();
    
    // Focus input after bot responds (when isWorking changes from true to false)
    if (!isWorking && messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      inputRef.current?.focus();
    }
  }, [messages, isWorking]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
            <button onClick={clearMessages} className="clear-button">Clear</button>
          </div>

        </div>
        <div className="messages-container"
             style={{marginTop: '10px', flexGrow: 1, overflowY: 'auto', maxWidth:"800px", paddingInline:10}}>
          {messages.map((message,i) => (
            <div
              key={`message-${i}`}
              className={`message ${message.role === 'assistant' ? 'bot-message' : 'user-message'}`}
            >
              <div className="message-content">
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef}/>
        </div>
        <div className="chatbot-suggestions">
          <Loader isLoading={isWorking}/>
          <p>Try these</p>
          <div className="suggestion-buttons">
            <button onClick={() => setInputText("What can you help me with?")}>What can you help me with?</button>
            <button onClick={() => setInputText("Go to dashboard")}>Go to dashboard</button>
            <button onClick={() => setInputText("Show me only cash transactions")}>Show me only cash transactions</button>
            <button onClick={() => setInputText("Add a text widget to the dashboard")}>Add a text widget to the dashboard</button>
            <button onClick={() => setInputText(COMPLEX_REQUEST)}>Complex request</button>
          </div>
        </div>
        {<form style={{marginTop: "auto"}} className="chatbot-input" onSubmit={handleSubmit}>
          <textarea
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="How can I help?"
              disabled={isWorking}
              style={{
                width: "100%",
                // outline: "none",
                // border: "none",
                // maxHeight: 80,
                resize: "none",
              }}
          />
          <div style={{height: "100%", display: "flex",}}>
            <button style={{marginTop: "auto", height: "3rem", width: "3rem"}} type="submit"
                    disabled={isWorking || !inputText.trim()}>
              <span className="send-icon">➤</span>
            </button>
          </div>
        </form>}
      </div>
    </>
  )
};

export default Chatbot; 