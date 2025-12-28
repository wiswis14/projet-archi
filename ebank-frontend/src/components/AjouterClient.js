import React, { useState } from 'react';
import { agentService } from '../api/services';

function AjouterClient() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numeroIdentite: '',
    dateAnniversaire: '',
    email: '',
    adressePostale: '',
    login: '',
    password: ''
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
      const response = await agentService.ajouterClient(formData);
      setMessage({
        type: 'success',
        text: response.message || 'Client créé avec succès'
      });
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        numeroIdentite: '',
        dateAnniversaire: '',
        email: '',
        adressePostale: '',
        login: '',
        password: ''
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erreur lors de la création du client'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Ajouter un nouveau client</h3>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom *</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Prénom *</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Numéro d'identité *</label>
          <input
            type="text"
            name="numeroIdentite"
            value={formData.numeroIdentite}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date d'anniversaire *</label>
          <input
            type="date"
            name="dateAnniversaire"
            value={formData.dateAnniversaire}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Adresse postale *</label>
          <textarea
            name="adressePostale"
            value={formData.adressePostale}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label>Nom d'utilisateur (login) *</label>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            placeholder="ex: jean.dupont"
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Au moins 8 caractères"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Création en cours...' : 'Créer le client'}
        </button>
      </form>
    </div>
  );
}

export default AjouterClient;
