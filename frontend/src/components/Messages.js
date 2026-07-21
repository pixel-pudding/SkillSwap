import React, { useState, useEffect, useRef, useCallback } from 'react';
import API_BASE from '../api';

const Messages = ({ setView, selectedReceiver }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !selectedReceiver?.id) return;
    try {
      const response = await fetch(`${API_BASE}/messages?with=${selectedReceiver.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  }, [selectedReceiver?.id]);

  useEffect(() => {
    if (selectedReceiver?.id) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [selectedReceiver?.id, fetchMessages]);

  const handleSend = async () => {
    if (!message.trim() || !selectedReceiver) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId: selectedReceiver.id, message })
      });
      setMessage('');
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedReceiver?.id) {
    return (
      <article style={{ maxWidth: '800px', margin: '0 auto' }} className="fade-in">
        <h1>My Messages</h1>
        <p>Select a user to start chatting.</p>
        <button onClick={() => setView('explore')}>Back to Explore</button>
      </article>
    );
  }

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto' }} className="fade-in">
      <h1>Chat with {selectedReceiver?.name}</h1>
      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: 'white', marginBottom: '20px' }}>
        {messages.map((msg) => {
          const isSent = msg.senderId._id === localStorage.getItem('userId');
          return (
            <div key={msg._id} style={{ marginBottom: '10px', textAlign: isSent ? 'right' : 'left' }}>
              <div style={{ display: 'inline-block', padding: '10px', borderRadius: '8px', background: isSent ? '#e0e0e0' : '#f0f0f0', maxWidth: '70%' }}>
                <p style={{ margin: 0 }}>{msg.message}</p>
                <small style={{ color: '#666' }}>{new Date(msg.timestamp).toLocaleTimeString()}</small>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{ width: '70%', marginRight: '10px' }}
        />
        <button type="submit">Send</button>
      </form>
    </article>
  );
};

export default Messages;