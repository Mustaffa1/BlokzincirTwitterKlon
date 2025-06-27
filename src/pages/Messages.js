import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyFriends = [
  { id: 1, name: 'User2', avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png' },
  { id: 2, name: 'User3', avatar: 'https://i.pravatar.cc/50?img=2' },
  { id: 3, name: 'User4', avatar: 'https://i.pravatar.cc/50?img=3' },
];

const dummyMessages = {
  1: [{ sender: 'me', text: 'Merhaba ' }, { sender: 'User2', text: 'Merhaba' }],
  2: [{ sender: 'me', text: 'Nasılsın User3?' }],
  3: [],
};

function Messages() {
  const [activeFriendId, setActiveFriendId] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const messages = dummyMessages[activeFriendId] || [];

  const navigate = useNavigate();

  // ✅ JWT geçerlilik kontrolü
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now();
      if (now >= payload.exp * 1000) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (err) {
      console.error('Token kontrolü başarısız:', err);
      localStorage.removeItem('token');
      navigate('/');
    }
  }, [navigate]);

  const handleSend = () => {
    if (newMessage.trim()) {
      dummyMessages[activeFriendId].push({ sender: 'me', text: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div style={styles.container}>
      {/* Sol Panel: Arkadaş Listesi */}
      <div style={styles.friendsList}>
        <h3>Arkadaşlar</h3>
        {dummyFriends.map((friend) => (
          <div
            key={friend.id}
            style={{
              ...styles.friend,
              backgroundColor: friend.id === activeFriendId ? '#e1e8ed' : 'transparent',
            }}
            onClick={() => setActiveFriendId(friend.id)}
          >
            <img src={friend.avatar} alt={friend.name} style={styles.avatar} />
            <span>{friend.name}</span>
          </div>
        ))}
      </div>

      {/* Sağ Panel: Mesajlaşma */}
      <div style={styles.chatArea}>
        <div style={styles.messages}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
              <p style={styles.message}>{msg.text}</p>
            </div>
          ))}
        </div>
        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Mesaj yaz..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSend} style={styles.sendButton}>Gönder</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f5f8fa',
  },
  friendsList: {
    width: '30%',
    padding: '20px',
    borderRight: '1px solid #ccc',
    backgroundColor: '#fff',
  },
  friend: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '20px',
  },
  message: {
    display: 'inline-block',
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: '#1da1f2',
    color: 'white',
    margin: '5px 0',
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
  },
  sendButton: {
    padding: '10px 20px',
    borderRadius: '20px',
    backgroundColor: '#1da1f2',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Messages;
