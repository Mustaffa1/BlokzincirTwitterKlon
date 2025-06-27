import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    country: '',
  });
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, surname, username, email, password } = form;
    if (!name || !surname || !username || !email || !password) {
      setStatus('Lütfen gerekli tüm alanları doldurun.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Kayıt başarılı!');
      navigate('/');
    } catch (err) {
      setStatus(err.response?.data?.error || 'Sunucu hatası');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Kayıt Ol</h2>
        <form onSubmit={handleRegister}>
          <input name="name" placeholder="Ad" value={form.name} onChange={handleChange} style={styles.input} required />
          <input name="surname" placeholder="Soyad" value={form.surname} onChange={handleChange} style={styles.input} required />
          <input name="username" placeholder="Kullanıcı Adı" value={form.username} onChange={handleChange} style={styles.input} required />
          <input name="email" type="email" placeholder="E-posta" value={form.email} onChange={handleChange} style={styles.input} required />
          <input name="password" type="password" placeholder="Şifre" value={form.password} onChange={handleChange} style={styles.input} required />
          <input name="phone" placeholder="Telefon" value={form.phone} onChange={handleChange} style={styles.input} />
          <input name="country" placeholder="Ülke" value={form.country} onChange={handleChange} style={styles.input} />
          <button type="submit" style={styles.button}>Kayıt Ol</button>
        </form>
        {status && <p style={styles.status}>{status}</p>}
        <p style={{ marginTop: 12 }}>
          Zaten hesabınız var mı?{' '}
          <span onClick={() => navigate('/')} style={styles.link}>Giriş yapın</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '80px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '30px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#1da1f2',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  status: {
    color: '#e0245e',
    marginTop: '10px',
  },
  link: {
    color: '#1da1f2',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Register;
