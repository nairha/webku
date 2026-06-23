"use client";

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './KinaChatWidget.module.scss';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

const FALLBACK_MESSAGE: Message = {
  id: 'init-1',
  role: 'ai',
  content: `Memuat pesan...`
};

export const KinaChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([FALLBACK_MESSAGE]);
  
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/chat-mock?type=starter')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setMessages([
            {
              id: 'init-1',
              role: 'ai',
              content: data.content
            }
          ]);
        }
      })
      .catch(console.error);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    
    const isWhoAmI = newUserMsg.content.toLowerCase().includes('siapa kamu');
    const apiType = isWhoAmI ? 'keqing' : 'response-1';

    // Simulasi respons AI (Membaca file Markdown yang sesuai)
    setTimeout(() => {
      fetch(`/api/chat-mock?type=${apiType}`)
        .then(res => res.json())
        .then(data => {
          if (data.content) {
            const aiResponse: Message = {
              id: (Date.now() + 1).toString(),
              role: 'ai',
              content: data.content
            };
            setMessages(prev => [...prev, aiResponse]);
          }
        })
        .catch(console.error);
    }, 1000);
  };

  const handleClearChat = () => {
    fetch('/api/chat-mock?type=starter')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setMessages([
            {
              id: 'init-1',
              role: 'ai',
              content: data.content
            }
          ]);
        }
      })
      .catch(console.error);
  };

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  return (
    <>
      {/* Sidebar Panel */}
      <div className={`${styles.chatSidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.chatHeader}>
          <h3>
            <img 
              src="/images/keqing.jpg" 
              alt="Keqing Avatar" 
              style={{ 
                width: 28, 
                height: 28, 
                borderRadius: '50%', 
                objectFit: 'cover',
                backgroundColor: 'var(--surface-background-elevated, #2c2c2e)',
                border: '1px solid var(--border-neutral, #333)'
              }} 
            />
            Keqing
          </h3>
          <div className={styles.headerActions}>
            <button 
              className={styles.clearBtn} 
              onClick={handleClearChat} 
              aria-label="Hapus Percakapan"
              title="Hapus Percakapan"
            >
              <TrashIcon />
            </button>
            <button 
              className={styles.closeBtn} 
              onClick={toggleChat} 
              aria-label="Tutup Panel"
              title="Tutup Panel"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        
        <div className={styles.chatBody} ref={chatBodyRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.message} ${styles[msg.role]}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({node, ...props}) => (
                    <div className={styles.tableWrapper}>
                      <table {...props} />
                    </div>
                  )
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          ))}
        </div>
        
        <div className={styles.chatFooter}>
          <input 
            type="text" 
            placeholder="Ketik pertanyaan Anda..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className={styles.sendBtn} onClick={() => handleSend()}>
            <SendIcon />
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        className={`${styles.toggleBtn} ${isOpen ? styles.hidden : ''}`} 
        onClick={toggleChat} 
        aria-label="Toggle Kina AI"
      >
        Ask
      </button>
    </>
  );
};
