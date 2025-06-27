import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import TweetList from './TweetList';
import axios from 'axios';
import FollowButton from '../components/FollowButton';

function Profile() {
  const [activeTab, setActiveTab] = useState('tweets');
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

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
      localStorage.removeItem('token');
      navigate('/');
    }
  }, [navigate]);

  const fetchTweets = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const tweetRes = await axios.get(`http://localhost:5000/api/tweet/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTweets(tweetRes.data);
    } catch (err) {
      console.error('Tweetler alınamadı:', err);
    }
  };

  const fetchFollowersAndFollowing = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const [followersRes, followingRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/follow/${userId}/followers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5000/api/follow/${userId}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setFollowers(followersRes.data.followers);
      setFollowing(followingRes.data.following);
    } catch (err) {
      console.error('Takip verileri alınamadı:', err);
    }
  };

  useEffect(() => {
    const fetchProfileAndTweets = async () => {
      try {
        const token = localStorage.getItem('token');
        let currentUser;

        if (!id) {
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          currentUser = res.data.user;
          setUser(currentUser);
          setIsOwnProfile(true);
        } else {
          const res = await axios.get(`http://localhost:5000/api/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          currentUser = res.data.user;
          setUser(currentUser);

          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const myId = tokenData.userId;
          setIsOwnProfile(myId === currentUser._id.toString());
        }

        await fetchTweets(currentUser._id);
        await fetchFollowersAndFollowing(currentUser._id);
      } catch (err) {
        console.error('Profil veya tweetler alınamadı:', err);
      }
    };

    fetchProfileAndTweets();
  }, [id, location.pathname]);

  const handleEditProfile = () => navigate('/edit-profile');

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/auth/update-avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error('Avatar güncellenemedi:', err);
    }
  };

  if (!user) return <p style={{ padding: '30px' }}>Profil yükleniyor...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.banner}></div>
      <div style={styles.profileSection}>
        <label htmlFor="avatarUpload">
          <img src={user.avatar} alt="Profil" style={styles.avatar} title="Avatar değiştir" />
        </label>
        {isOwnProfile && (
          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        )}

        {isOwnProfile ? (
          <button style={styles.editButton} onClick={handleEditProfile}>Profili Düzenle</button>
        ) : (
          <FollowButton targetUserId={user._id} onFollowChange={() => fetchFollowersAndFollowing(user._id)} />
        )}

        <h2 style={styles.name}>{user.name} {user.surname}</h2>
        <p style={styles.username}>@{user.username}</p>
        <p style={styles.bio}>{user.bio || 'Henüz biyografi girilmemiş.'}</p>

        <div style={styles.infoRow}>
          <span>🌍 {user.country || 'Ülke yok'}</span>
        </div>

        <div style={styles.followRow}>
          <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('following')}>
            <strong>{following.length}</strong> Takip edilen
          </span>
          &nbsp;&nbsp;
          <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('followers')}>
            <strong>{followers.length}</strong> Takipçi
          </span>
        </div>

        <div style={styles.tabs}>
          {['tweets', 'likes', 'saved'].map(tab => (
            <span
              key={tab}
              style={activeTab === tab ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab(tab)}
            >
              {{ tweets: 'Tweetler', likes: 'Beğeniler', saved: 'Kaydedilenler' }[tab]}
            </span>
          ))}
        </div>
      </div>

      <div style={styles.tweetsContainer}>
        {renderTabContent()}
      </div>
    </div>
  );

  function renderTabContent() {
    switch (activeTab) {
      case 'tweets':
        return (
          <TweetList
            tweets={tweets}
            onDelete={() => fetchTweets(user._id)}
            currentUserId={user._id}
          />
        );
      case 'likes':
        return <p>Beğenilen tweetler burada gösterilecek (yakında)</p>;
      case 'saved':
        return <p>Kaydedilen tweetler burada gösterilecek (yakında)</p>;
      case 'followers':
        return (
          <ul>
            {followers.map((u) => (
              <li key={u._id}>
                <Link to={`/dashboard/profile/${u._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={u.avatar} alt="avatar" width="30" style={{ borderRadius: '50%', marginRight: '10px' }} />
                  {u.name} @{u.username}
                </Link>
              </li>
            ))}
          </ul>
        );
      case 'following':
        return (
          <ul>
            {following.map((u) => (
              <li key={u._id}>
                <Link to={`/dashboard/profile/${u._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={u.avatar} alt="avatar" width="30" style={{ borderRadius: '50%', marginRight: '10px' }} />
                  {u.name} @{u.username}
                </Link>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  }
}

const styles = {
  container: {
    backgroundColor: '#fff',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  banner: {
    height: '200px',
    backgroundColor: '#1da1f2',
  },
  profileSection: {
    padding: '20px',
    position: 'relative',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '4px solid white',
    position: 'absolute',
    top: '-50px',
    left: '20px',
    cursor: 'pointer',
  },
  editButton: {
    float: 'right',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid #1da1f2',
    backgroundColor: '#fff',
    color: '#1da1f2',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  name: {
    marginTop: '60px',
    marginBottom: '4px',
    fontSize: '20px',
  },
  username: {
    marginBottom: '10px',
    color: '#657786',
  },
  bio: {
    marginBottom: '10px',
  },
  infoRow: {
    display: 'flex',
    gap: '15px',
    fontSize: '14px',
    color: '#657786',
    marginBottom: '10px',
  },
  followRow: {
    fontSize: '14px',
    color: '#14171a',
    marginBottom: '15px',
  },
  tabs: {
    display: 'flex',
    gap: '30px',
    borderBottom: '1px solid #e1e8ed',
    paddingBottom: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  tab: {
    color: '#555',
  },
  activeTab: {
    borderBottom: '2px solid #1da1f2',
    paddingBottom: '5px',
    color: '#1da1f2',
  },
  tweetsContainer: {
    padding: '20px',
  },
};

export default Profile;
