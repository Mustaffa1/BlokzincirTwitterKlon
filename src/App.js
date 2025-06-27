import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Search from './pages/Search';
import Messages from './pages/Messages';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Giriş ve Kayıt Sayfaları */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Profil düzenleme sayfası */}
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        {/* Ana korumalı alan: Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="search" element={<Search />} />
          <Route path="messages" element={<Messages />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
