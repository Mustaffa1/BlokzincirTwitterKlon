import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TweetList({ tweets = [], onDelete, currentUserId }) {
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tweet/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (typeof onDelete === 'function') onDelete();
    } catch (err) {
      console.error('Tweet silme hatası:', err);
    }
  };

  if (!tweets.length) return null;

  return (
    <div style={styles.container}>
      {tweets.map((tweet) => (
        <div key={tweet._id} style={styles.tweet}>
          <Link to={`/dashboard/profile/${tweet.userId?._id}`}>
            <img
              src={tweet.userId?.avatar || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'}
              alt="avatar"
              style={styles.avatar}
            />
          </Link>
          <div style={{ flex: 1 }}>
            <div style={styles.header}>
              <strong>{tweet.userId?.name || 'Kullanıcı'}</strong>
              <span style={styles.username}>@{tweet.userId?.username || 'anonim'}</span>
              <span style={styles.dot}>·</span>
              <span>{new Date(tweet.createdAt).toLocaleString('tr-TR')}</span>
              {currentUserId === tweet.userId?._id && (
                <button onClick={() => handleDelete(tweet._id)} style={styles.deleteBtn}>🗑️</button>
              )}
            </div>
            <p style={styles.content}>{tweet.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '20px',
    padding: '0 20px',
  },
  tweet: {
    display: 'flex',
    gap: '12px',
    padding: '16px 0',
    borderBottom: '1px solid #e1e8ed',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#555',
  },
  username: {
    color: '#657786',
  },
  dot: {
    margin: '0 4px',
  },
  content: {
    fontSize: '15px',
    marginTop: '4px',
  },
  deleteBtn: {
    marginLeft: 'auto',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#e0245e',
  }
};

export default TweetList;
