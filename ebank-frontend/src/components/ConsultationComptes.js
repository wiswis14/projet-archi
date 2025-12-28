import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function ConsultationComptes() {
  const [comptes, setComptes] = useState([]);
  const [selectedCompte, setSelectedCompte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchRib, setSearchRib] = useState('');

  useEffect(() => {
    chargerComptes();
  }, []);

  const chargerComptes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/agent/comptes/all');
      setComptes(response.data);
      setSelectedCompte(null);
    } catch (err) {
      setError('Erreur lors du chargement des comptes: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const chargerCompteParRib = async () => {
    if (!searchRib.trim()) {
      setError('Veuillez entrer un RIB');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/agent/comptes/rib/${searchRib}`);
      setComptes([response.data]);
      setSelectedCompte(response.data);
    } catch (err) {
      setError('Compte non trouvé: ' + (err.response?.data?.message || err.message));
      setComptes([]);
    } finally {
      setLoading(false);
    }
  };

  const afficherDetails = (compte) => {
    setSelectedCompte(compte);
  };

  const fermerDetails = () => {
    setSelectedCompte(null);
  };

  return (
    <div className="consultation-container">
      <h3>📊 Consultation des Comptes</h3>
      
      {error && <div className="error-message">{error}</div>}

      {/* Barre de recherche */}
      <div className="search-section">
        <input 
          type="text"
          placeholder="Rechercher par RIB..."
          value={searchRib}
          onChange={(e) => setSearchRib(e.target.value)}
          className="search-input"
        />
        <button onClick={chargerCompteParRib} className="btn btn-search">
          🔍 Rechercher
        </button>
        <button onClick={chargerComptes} className="btn btn-secondary">
          🔄 Tous les comptes
        </button>
      </div>

      {loading ? (
        <p className="loading">Chargement en cours...</p>
      ) : (
        <>
          {/* Liste des comptes */}
          {!selectedCompte && (
            <div className="comptes-list">
              {comptes.length === 0 ? (
                <p>Aucun compte trouvé</p>
              ) : (
                <div className="comptes-grid">
                  {comptes.map((compte) => (
                    <div key={compte.id} className="compte-card">
                      <div className="compte-info">
                        <h4>{compte.nomClient} {compte.prenomClient}</h4>
                        <p><strong>RIB:</strong> {compte.rib}</p>
                        <p><strong>Solde:</strong> <span className="solde">{compte.solde.toFixed(2)} MAD</span></p>
                        <p><strong>Statut:</strong> <span className={`statut ${compte.statut.toLowerCase()}`}>{compte.statut}</span></p>
                        <p><strong>Email:</strong> {compte.emailClient}</p>
                        <p><strong>Numéro d'identité:</strong> {compte.numeroIdentiteClient}</p>
                        <p><strong>Ouvert le:</strong> {new Date(compte.dateCreation).toLocaleDateString('fr-FR')}</p>
                        {compte.dateDerniereOperation && (
                          <p><strong>Dernière opération:</strong> {new Date(compte.dateDerniereOperation).toLocaleDateString('fr-FR')}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => afficherDetails(compte)}
                        className="btn btn-primary"
                      >
                        Voir les opérations
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Détails du compte sélectionné */}
          {selectedCompte && (
            <div className="compte-details">
              <button onClick={fermerDetails} className="btn btn-secondary btn-close">
                ← Retour
              </button>
              
              <div className="details-header">
                <h3>{selectedCompte.nomClient} {selectedCompte.prenomClient}</h3>
                <p className="rib-label">RIB: {selectedCompte.rib}</p>
              </div>

              <div className="details-grid">
                <div className="detail-box">
                  <h5>Informations du compte</h5>
                  <p><strong>Solde:</strong> <span className="solde-large">{selectedCompte.solde.toFixed(2)} MAD</span></p>
                  <p><strong>Statut:</strong> {selectedCompte.statut}</p>
                  <p><strong>Email:</strong> {selectedCompte.emailClient}</p>
                  <p><strong>Numéro d'identité:</strong> {selectedCompte.numeroIdentiteClient}</p>
                  <p><strong>Créé le:</strong> {new Date(selectedCompte.dateCreation).toLocaleDateString('fr-FR')}</p>
                </div>

                <div className="detail-box">
                  <h5>📋 Opérations récentes ({selectedCompte.operations.length})</h5>
                  {selectedCompte.operations.length === 0 ? (
                    <p>Aucune opération</p>
                  ) : (
                    <div className="operations-list">
                      {selectedCompte.operations.map((op) => (
                        <div key={op.id} className={`operation-item ${op.type.toLowerCase()}`}>
                          <div className="op-main">
                            <span className="op-intitule">{op.intitule}</span>
                            <span className="op-type">{op.type}</span>
                          </div>
                          <div className="op-details">
                            <span className="op-montant">{op.montant.toFixed(2)} MAD</span>
                            <span className="op-date">{new Date(op.dateOperation).toLocaleDateString('fr-FR')}</span>
                          </div>
                          {op.motif && <p className="op-motif">Motif: {op.motif}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .consultation-container {
          padding: 20px;
          background: rgba(255, 140, 0, 0.05);
          border-radius: 10px;
          margin-top: 20px;
        }

        .search-section {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 10px 15px;
          border: 2px solid #ff8c00;
          border-radius: 5px;
          font-size: 14px;
          background: rgba(255, 255, 255, 0.9);
        }

        .search-input:focus {
          outline: none;
          background: white;
          box-shadow: 0 0 10px rgba(255, 140, 0, 0.3);
        }

        .btn {
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-search,
        .btn-primary {
          background: linear-gradient(135deg, #ff8c00 0%, #e67e00 100%);
          color: white;
          border: 2px solid #ff8c00;
        }

        .btn-search:hover,
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 140, 0, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 140, 0, 0.1);
          color: #ff8c00;
          border: 2px solid #ff8c00;
        }

        .btn-secondary:hover {
          background: rgba(255, 140, 0, 0.2);
        }

        .btn-close {
          margin-bottom: 15px;
        }

        .error-message {
          background: #fee;
          border-left: 4px solid #f00;
          padding: 12px;
          border-radius: 5px;
          margin-bottom: 15px;
          color: #c00;
        }

        .loading {
          text-align: center;
          padding: 20px;
          color: #ff8c00;
          font-weight: 600;
        }

        .comptes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }

        .compte-card {
          background: white;
          border: 2px solid #ff8c00;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .compte-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(255, 140, 0, 0.2);
        }

        .compte-info h4 {
          margin: 0 0 10px 0;
          color: #0a0e27;
          font-size: 18px;
        }

        .compte-info p {
          margin: 8px 0;
          font-size: 14px;
          color: #333;
        }

        .solde {
          color: #ff8c00;
          font-weight: 700;
          font-size: 16px;
        }

        .statut {
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 600;
        }

        .statut.ouvert {
          background: #d4edda;
          color: #155724;
        }

        .compte-details {
          background: white;
          border: 2px solid #ff8c00;
          border-radius: 10px;
          padding: 25px;
          margin-top: 20px;
        }

        .details-header {
          border-bottom: 2px solid #ff8c00;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }

        .details-header h3 {
          margin: 0 0 10px 0;
          color: #0a0e27;
        }

        .rib-label {
          color: #666;
          margin: 0;
          font-size: 14px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr;
          }
        }

        .detail-box {
          background: rgba(255, 140, 0, 0.05);
          border: 2px solid #ff8c00;
          border-radius: 8px;
          padding: 15px;
        }

        .detail-box h5 {
          margin: 0 0 15px 0;
          color: #ff8c00;
          border-bottom: 2px solid #ff8c00;
          padding-bottom: 10px;
        }

        .detail-box p {
          margin: 10px 0;
          color: #333;
          font-size: 14px;
        }

        .solde-large {
          color: #ff8c00;
          font-weight: 700;
          font-size: 24px;
        }

        .operations-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 400px;
          overflow-y: auto;
        }

        .operation-item {
          background: white;
          border: 1px solid #ff8c00;
          border-radius: 5px;
          padding: 10px;
          border-left: 4px solid #ff8c00;
        }

        .operation-item.debit {
          border-left-color: #dc3545;
        }

        .operation-item.credit {
          border-left-color: #28a745;
        }

        .op-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }

        .op-intitule {
          font-weight: 600;
          color: #0a0e27;
        }

        .op-type {
          font-size: 12px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 3px;
        }

        .operation-item.debit .op-type {
          background: #ffe0e0;
          color: #dc3545;
        }

        .operation-item.credit .op-type {
          background: #e0ffe0;
          color: #28a745;
        }

        .op-details {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .op-montant {
          font-weight: 600;
          color: #0a0e27;
        }

        .op-motif {
          margin: 5px 0 0 0;
          font-size: 12px;
          color: #666;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

export default ConsultationComptes;
