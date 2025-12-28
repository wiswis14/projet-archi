import React, { useState } from 'react';
import { clientService } from '../api/services';

function VirementModal({ ribSource, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    ribSource: ribSource,
    ribDestinataire: '',
    montant: '',
    motif: ''
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
      const response = await clientService.effectuerVirement(formData);
      setMessage({
        type: 'success',
        text: response.message || 'Virement effectué avec succès'
      });
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erreur lors du virement'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nouveau virement</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>RIB source</label>
            <input
              type="text"
              name="ribSource"
              value={formData.ribSource}
              disabled
            />
          </div>

          <div className="form-group">
            <label>RIB destinataire *</label>
            <input
              type="text"
              name="ribDestinataire"
              value={formData.ribDestinataire}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Montant (MAD) *</label>
            <input
              type="number"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Motif *</label>
            <textarea
              name="motif"
              value={formData.motif}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Traitement...' : 'Effectuer le virement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VirementModal;
