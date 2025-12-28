import React, { useState, useEffect } from 'react';
import Header from './Header';
import { clientService } from '../api/services';
import VirementModal from './VirementModal';
import ChangePasswordModal from './ChangePasswordModal';

function ClientDashboard({ onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVirementModal, setShowVirementModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async (rib = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientService.getDashboard(rib);
      setDashboard(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleCompteChange = (e) => {
    const rib = e.target.value;
    if (rib) {
      loadDashboard(rib);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(montant);
  };

  if (loading) {
    return (
      <>
        <Header onLogout={onLogout} />
        <div className="container">
          <div className="card">
            <p>Chargement...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header onLogout={onLogout} />
        <div className="container">
          <div className="alert alert-error">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header onLogout={onLogout} />
      <div className="container">
        {/* Sélection du compte */}
        {dashboard?.autresComptes?.length > 0 && (
          <div className="card">
            <div className="form-group">
              <label>Sélectionner un compte</label>
              <select onChange={handleCompteChange} defaultValue={dashboard.rib}>
                <option value={dashboard.rib}>
                  {dashboard.rib} - {formatMontant(dashboard.solde)}
                </option>
                {dashboard.autresComptes.map((compte) => (
                  <option key={compte.id} value={compte.rib}>
                    {compte.rib} - {formatMontant(compte.solde)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Carte Solde */}
        <div className="solde-card">
          <div>RIB: {dashboard?.rib}</div>
          <div className="solde-amount">
            {formatMontant(dashboard?.solde || 0)}
          </div>
          <div style={{ marginTop: '1rem' }}>Solde disponible</div>
        </div>

        {/* Actions rapides */}
        <div className="card">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              onClick={() => setShowVirementModal(true)}
            >
              Nouveau virement
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowPasswordModal(true)}
            >
              Changer mot de passe
            </button>
          </div>
        </div>

        {/* Dernières opérations */}
        <div className="card">
          <h2>Dernières opérations</h2>
          {dashboard?.dernieresOperations?.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Intitulé</th>
                  <th>Type</th>
                  <th>Montant</th>
                  <th>Motif</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.dernieresOperations.map((operation) => (
                  <tr key={operation.id}>
                    <td>{formatDate(operation.dateOperation)}</td>
                    <td>{operation.intitule}</td>
                    <td>
                      <span className={`badge badge-${operation.type.toLowerCase()}`}>
                        {operation.type}
                      </span>
                    </td>
                    <td>
                      {operation.type === 'DEBIT' ? '-' : '+'}
                      {formatMontant(operation.montant)}
                    </td>
                    <td>{operation.motif || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucune opération pour le moment</p>
          )}
        </div>
      </div>

      {showVirementModal && (
        <VirementModal
          ribSource={dashboard?.rib}
          onClose={() => setShowVirementModal(false)}
          onSuccess={() => {
            setShowVirementModal(false);
            loadDashboard(dashboard.rib);
          }}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => setShowPasswordModal(false)}
        />
      )}
    </>
  );
}

export default ClientDashboard;
