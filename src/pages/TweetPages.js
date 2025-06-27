import React, { useEffect, useState } from 'react';
import TweetForm from '../components/TweetForm';
import TweetList from '../components/TweetList';
import axios from 'axios';

function TweetPage() {
  const [tweets, setTweets] = useState([]);

  // Tweet'leri yükle
  const fetchTweets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tweet', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTweets(res.data);
    } catch (err) {
      console.error('Tweetleri çekerken hata:', err);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tweet Sayfası</h1>
      <TweetForm onTweetSent={fetchTweets} />
      <TweetList tweets={tweets} />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f8fa',
    borderRadius: '8px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#1da1f2',
  },
};

export default TweetPage;
