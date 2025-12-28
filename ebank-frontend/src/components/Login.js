import React, { useState } from 'react';
import { authService } from '../api/services';
import Logo from './Logo';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          login: response.login,
          roles: response.roles
        }));
        onLogin();
      } else {
        setError(response.message || 'Login ou mot de passe erronés');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login ou mot de passe erronés');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Logo size="large" />
          </div>
          <p className="login-subtitle">
            Accédez à votre espace bancaire sécurisé
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Login</label>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
              placeholder="Entrez votre login"
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Entrez votre mot de passe"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? '⏳ Connexion en cours...' : '🔐 Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
