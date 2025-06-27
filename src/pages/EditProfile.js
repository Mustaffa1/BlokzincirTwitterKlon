import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    phone: '',
    country: '',
    bio: '',
    avatar: ''
  });
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm(res.data.user);
      } catch (err) {
        console.error('Profil getirilemedi:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/update', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profil güncellendi!');
      navigate('/dashboard');
    } catch (err) {
      setStatus('Güncelleme başarısız');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Profili Düzenle</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ad"
            style={styles.input}
          />
          <input
            name="surname"
            value={form.surname}
            onChange={handleChange}
            placeholder="Soyad"
            style={styles.input}
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Telefon"
            style={styles.input}
          />
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Ülke"
            style={styles.input}
          />
          <input
            name="avatar"
            value={form.avatar}
            onChange={handleChange}
            placeholder="Profil Fotoğrafı URL"
            style={styles.input}
          />
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Biyografi"
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>Kaydet</button>
        </form>
        {status && <p style={styles.status}>{status}</p>}
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Profile Dön
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '60px',
    fontFamily: `'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#1da1f2',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    height: '100px',
    resize: 'none',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#1da1f2',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  status: {
    color: '#e0245e',
    marginTop: '10px',
    textAlign: 'center',
  },
  backButton: {
    marginTop: '20px',
    backgroundColor: '#e6ecf0',
    color: '#1da1f2',
    border: 'none',
    borderRadius: '20px',
    padding: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
};

export default EditProfile;
