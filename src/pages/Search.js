import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Token kontrolü
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now();
      if (now >= payload.exp * 1000) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/');
    }
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/user/search?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data);
    } catch (err) {
      console.error('Kullanıcı arama hatası:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔍 Kullanıcı Ara</h2>
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          placeholder="Kullanıcı adı veya isim..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Ara</button>
      </form>

      {/* Arama Sonuçları */}
      <div style={styles.results}>
        {results.length > 0 ? (
          results.map((user) => (
            <Link to={`/dashboard/profile/${user._id}`} key={user._id} style={styles.resultBox}>
              <img
                src={user.avatar || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'}
                alt="avatar"
                style={styles.avatar}
              />
              <div>
                <div style={styles.name}>{user.name} {user.surname}</div>
                <div style={styles.username}>@{user.username}</div>
              </div>
            </Link>
          ))
        ) : (
          <p style={styles.noResults}>🔎 Arama sonucu yok</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#1da1f2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  results: {
    marginTop: '20px',
  },
  resultBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#f5f8fa',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '10px',
    textDecoration: 'none',
    color: '#000',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
  },
  name: {
    fontWeight: 'bold',
  },
  username: {
    color: '#657786',
    fontSize: '14px',
  },
  noResults: {
    color: '#888',
    fontStyle: 'italic',
  },
};

export default Search;
