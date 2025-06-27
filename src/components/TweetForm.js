import React, { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

function TweetForm({ onTweetSent }) {
  const [text, setText] = useState('');
  const MAX_LENGTH = 280;
  const { currentUser } = useOutletContext(); // ✅ Avatar bilgisi burada

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tweet', { text }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setText('');
      if (typeof onTweetSent === 'function') onTweetSent(); //  Listeyi yenile

    } catch (err) {
      console.error('Tweet gönderme hatası:', err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <img
            src={currentUser?.avatar || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'}
            alt="avatar"
            style={styles.avatar}
          />
          <form onSubmit={handleSubmit} style={{ flex: 1 }}>
            <textarea
              placeholder="Neler oluyor?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={MAX_LENGTH}
              style={styles.textarea}
            />
            <div style={styles.footer}>
              <span>{text.length}/{MAX_LENGTH}</span>
              <button type="submit" style={styles.button}>Tweetle</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '40px',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    gap: '10px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
  },
  textarea: {
    width: '100%',
    resize: 'none',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    outline: 'none',
    marginBottom: '10px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#1da1f2',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default TweetForm;
