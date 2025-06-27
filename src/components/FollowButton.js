import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FollowButton = ({ targetUserId, onFollowChange }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/follow/is-following/${targetUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error('Takip durumu alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };

    if (targetUserId) {
      fetchFollowStatus();
    }
  }, [targetUserId]);

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = isFollowing
        ? `http://localhost:5000/api/follow/unfollow/${targetUserId}`
        : `http://localhost:5000/api/follow/${targetUserId}`;

      await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsFollowing(!isFollowing);
      onFollowChange?.();
    } catch (err) {
      console.error('Takip işlemi başarısız:', err.response?.data || err.message);
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={handleFollowToggle}
      style={{
        float: 'right',
        padding: '6px 12px',
        borderRadius: '20px',
        border: '1px solid #1da1f2',
        backgroundColor: isFollowing ? '#fff' : '#1da1f2',
        color: isFollowing ? '#1da1f2' : '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px',
      }}
    >
      {isFollowing ? 'Takibi Bırak' : 'Takip Et'}
    </button>
  );
};

export default FollowButton;
