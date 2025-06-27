import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus('E-posta ve şifre gereklidir.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setStatus(err.response?.data?.error || 'Sunucu hatası');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Giriş Yap</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Giriş Yap</button>
        </form>
        {status && <p style={styles.status}>{status}</p>}
        <p style={{ marginTop: 12 }}>
          Hesabınız yok mu?{' '}
          <span onClick={() => navigate('/register')} style={styles.link}>Kayıt olun</span>
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
    marginBottom: '16px',
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

export default Login;
