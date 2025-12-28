import React, { useState } from 'react';
import { clientService } from '../api/services';

function ChangePasswordModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    ancienMotDePasse: '',
    nouveauMotDePasse: ''
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await clientService.changerMotDePasse(formData);
      setMessage({
        type: 'success',
        text: response.message || 'Mot de passe changé avec succès'
      });
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erreur lors du changement de mot de passe'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Changer le mot de passe</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ancien mot de passe *</label>
            <input
              type="password"
              name="ancienMotDePasse"
              value={formData.ancienMotDePasse}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Nouveau mot de passe *</label>
            <input
              type="password"
              name="nouveauMotDePasse"
              value={formData.nouveauMotDePasse}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Changement...' : 'Changer le mot de passe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
