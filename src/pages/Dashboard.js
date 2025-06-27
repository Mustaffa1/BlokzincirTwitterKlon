import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Outlet } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now();
      const expiryTime = payload.exp * 1000;

      if (currentTime >= expiryTime) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (err) {
      console.error('JWT çözümleme hatası:', err);
      localStorage.removeItem('token');
      navigate('/');
    }
  }, [navigate]);

  const fetchTweets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tweet/feed', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTweets(res.data);
    } catch (err) {
      console.error('Tweetleri alırken hata:', err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data.user);
    } catch (err) {
      console.error('Kullanıcı bilgisi alınamadı:', err);
    }
  };

  useEffect(() => {
    fetchTweets();
    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setSuggestions([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/user/search?q=${encodeURIComponent(value)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredResults = res.data.filter((user) => user._id !== currentUser?._id);
      setSuggestions(filteredResults);
    } catch (err) {
      console.error('Arama hatası:', err);
    }
  };

  const handleSuggestionClick = (userId) => {
    setQuery('');
    setSuggestions([]);
    navigate(`/dashboard/profile/${userId}`);
  };

  return (
    <div style={styles.container}>
      {/* Sol Menü */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>twitter</h2>
        <button style={styles.navButton} onClick={() => navigate('/dashboard')}>🏠 Anasayfa</button>
        <button style={styles.navButton} onClick={() => navigate('/dashboard/messages')}>💬 Mesajlar</button>
        <button style={styles.navButton} onClick={() => navigate('/dashboard/search')}>🔍 Ara</button>
        <button style={styles.navButton} onClick={() => navigate('/dashboard/profile')}>👤 Profil</button>
        <div style={{ flexGrow: 1 }}></div>
        <button style={styles.logoutButton} onClick={handleLogout}>Çıkış Yap</button>
      </aside>

      {/* Orta İçerik */}
      <main style={styles.main}>
        <div style={styles.searchBarContainer}>
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            value={query}
            onChange={handleSearchChange}
            style={styles.searchBar}
          />
          {suggestions.length > 0 && (
            <div style={styles.suggestionBox}>
              {suggestions.map((user) => (
                <div
                  key={user._id}
                  style={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(user._id)}
                >
                  <img
                    src={user.avatar || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'}
                    alt="avatar"
                    style={styles.avatar}
                  />
                  {user.name} {user.surname} (@{user.username})
                </div>
              ))}
            </div>
          )}
        </div>

        <Outlet context={{ currentUser, fetchTweets, tweets }} />
      </main>

      {/* Sağ Panel */}
      <aside style={styles.rightPanel}>
        <div style={styles.panelBox}>
          <h4 style={styles.panelTitle}>🔥 Trendler</h4>
          <ul>
            <li>#FıratÜniversitesi</li>
            <li>#BilgisayarMühendisliği</li>
            <li>#17Şubat</li>
          </ul>
        </div>
        <div style={styles.panelBox}>
          <h4 style={styles.panelTitle}>👥 Arkadaş Önerileri</h4>
          <ul>
            <li>@Dr.Öğr.Üys.HasanYETİŞ</li>
            <li>@AhmetBerhanCANLI</li>
            <li>@MustafaKOPARAL</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f5f8fa' },
  sidebar: {
    width: '220px', padding: '20px', backgroundColor: '#ffffff',
    borderRight: '1px solid #e1e8ed', display: 'flex', flexDirection: 'column', gap: '12px'
  },
  logo: { fontSize: '32px', color: '#1da1f2', marginBottom: '24px', textAlign: 'center' },
  navButton: {
    padding: '10px 15px', backgroundColor: '#1da1f2', color: '#fff',
    border: 'none', borderRadius: '10px', fontSize: '16px', textAlign: 'left',
    cursor: 'pointer', fontWeight: 'bold'
  },
  logoutButton: {
    marginTop: 'auto', padding: '10px 15px', backgroundColor: '#1da1f2',
    color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'
  },
  main: { flex: 1, padding: '30px' },
  searchBarContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '20px'
  },
  searchBar: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    width: '250px'
  },
  suggestionBox: {
    position: 'absolute',
    top: '42px',
    right: '0',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '10px',
    width: '250px',
    zIndex: 10
  },
  suggestionItem: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%'
  },
  rightPanel: {
    width: '250px', padding: '20px', backgroundColor: '#ffffff',
    borderLeft: '1px solid #e1e8ed', display: 'flex', flexDirection: 'column', gap: '20px'
  },
  panelBox: { backgroundColor: '#f0f8ff', borderRadius: '10px', padding: '15px' },
  panelTitle: { marginBottom: '10px', fontWeight: 'bold' }
};

export default Dashboard;
