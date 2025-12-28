import React, { useState } from 'react';
import { agentService } from '../api/services';

function CreerCompte() {
  const [formData, setFormData] = useState({
    rib: '',
    numeroIdentite: ''
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
      const response = await agentService.creerCompte(formData);
      setMessage({
        type: 'success',
        text: response.message || 'Compte créé avec succès'
      });
      
      // Réinitialiser le formulaire
      setFormData({
        rib: '',
        numeroIdentite: ''
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erreur lors de la création du compte'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Créer un nouveau compte bancaire</h3>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>RIB *</label>
          <input
            type="text"
            name="rib"
            value={formData.rib}
            onChange={handleChange}
            placeholder="16 à 24 chiffres"
            required
          />
          <small style={{ color: '#666' }}>
            Le RIB doit contenir entre 16 et 24 chiffres
          </small>
        </div>

        <div className="form-group">
          <label>Numéro d'identité du client *</label>
          <input
            type="text"
            name="numeroIdentite"
            value={formData.numeroIdentite}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Création en cours...' : 'Créer le compte'}
        </button>
      </form>
    </div>
  );
}

export default CreerCompte;
