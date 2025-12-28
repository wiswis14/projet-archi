import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

function SuiviTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('global');
  const [selectedCompteId, setSelectedCompteId] = useState(null);
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [limit, setLimit] = useState(50);

  const chargerComptes = useCallback(async () => {
    try {
      const response = await api.get('/agent/comptes/all');
      setComptes(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des comptes', err);
    }
  }, []);

  const chargerTransactionsGlobales = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/agent/transactions/globale?limit=${limit}`);
      setTransactions(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des transactions: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    chargerComptes();
  }, [chargerComptes]);

  useEffect(() => {
    if (filterType === 'global') {
      chargerTransactionsGlobales();
    }
  }, [filterType, chargerTransactionsGlobales]);

  const chargerTransactionsCompte = useCallback(async (compteId) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/agent/transactions/compte/${compteId}`);
      setTransactions(response.data);
      setSelectedCompteId(compteId);
    } catch (err) {
      setError('Erreur lors du chargement des transactions: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (type) => {
    setFilterType(type);
    setSelectedCompteId(null);
  };

  const handleCompteSelect = (compteId) => {
    chargerTransactionsCompte(compteId);
  };

  const getTransactionIcon = (type) => {
    switch(type.toUpperCase()) {
      case 'DEBIT':
        return '📤';
      case 'CREDIT':
        return '📥';
      case 'VIREMENT':
        return '💸';
      default:
        return '📊';
    }
  };

  const getStatusBadge = (statut) => {
    return <span className="status-badge">{statut}</span>;
  };

  return (
    <div className="suivi-container">
      <h3>📈 Suivi des Transactions et Traçabilité</h3>
      
      {error && <div className="error-message">{error}</div>}

      {/* Filtres */}
      <div className="filters-section">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'global' ? 'active' : ''}`}
            onClick={() => handleFilterChange('global')}
          >
            🌐 Tous les comptes
          </button>
          <button
            className={`filter-btn ${filterType === 'compte' ? 'active' : ''}`}
            onClick={() => handleFilterChange('compte')}
          >
            🔍 Par compte
          </button>
        </div>

        {filterType === 'global' && (
          <div className="limit-selector">
            <label>Afficher les dernières:</label>
            <select 
              value={limit} 
              onChange={(e) => setLimit(Number(e.target.value))}
              className="select-limit"
            >
              <option value={10}>10 transactions</option>
              <option value={25}>25 transactions</option>
              <option value={50}>50 transactions</option>
              <option value={100}>100 transactions</option>
            </select>
            <button onClick={chargerTransactionsGlobales} className="btn btn-refresh">
              🔄 Actualiser
            </button>
          </div>
        )}

        {filterType === 'compte' && (
          <div className="compte-selector">
            <select 
              value={selectedCompteId || ''} 
              onChange={(e) => handleCompteSelect(Number(e.target.value))}
              className="select-compte"
            >
              <option value="">Sélectionner un compte...</option>
              {comptes.map((compte) => (
                <option key={compte.id} value={compte.id}>
                  {compte.nomClient} {compte.prenomClient} - RIB: {compte.rib}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <p className="loading">Chargement des transactions...</p>
      ) : (
        <>
          <div className="transactions-header">
            <h4>
              {filterType === 'global' 
                ? `📋 ${transactions.length} dernières transactions de tous les comptes`
                : `📋 ${transactions.length} transactions du compte`}
            </h4>
          </div>

          {transactions.length === 0 ? (
            <p className="no-data">Aucune transaction trouvée</p>
          ) : (
            <div className="transactions-list">
              {transactions.map((transaction) => (
                <div key={transaction.operationId} className={`transaction-card ${transaction.typeOperation.toLowerCase()}`}>
                  <div className="transaction-header">
                    <div className="transaction-icon">
                      {getTransactionIcon(transaction.typeOperation)}
                    </div>
                    <div className="transaction-main">
                      <h5>{transaction.intitule}</h5>
                      <p className="client-name">
                        {transaction.clientName} | RIB: {transaction.compteSourceRib}
                      </p>
                    </div>
                    <div className="transaction-amount">
                      <span className={`amount ${transaction.typeOperation.toLowerCase()}`}>
                        {transaction.typeOperation === 'DEBIT' ? '-' : '+'}{transaction.montant.toFixed(2)} MAD
                      </span>
                      {getStatusBadge(transaction.statut)}
                    </div>
                  </div>

                  <div className="transaction-details">
                    <div className="detail-item">
                      <strong>Type:</strong>
                      <span className={`type-badge ${transaction.typeOperation.toLowerCase()}`}>
                        {transaction.typeOperation}
                      </span>
                    </div>
                    <div className="detail-item">
                      <strong>Date:</strong>
                      <span>{new Date(transaction.dateOperation).toLocaleDateString('fr-FR')} à {new Date(transaction.dateOperation).toLocaleTimeString('fr-FR')}</span>
                    </div>
                    {transaction.compteDestinationRib && (
                      <div className="detail-item">
                        <strong>RIB Destination:</strong>
                        <span>{transaction.compteDestinationRib}</span>
                      </div>
                    )}
                    {transaction.motif && (
                      <div className="detail-item">
                        <strong>Motif:</strong>
                        <span>{transaction.motif}</span>
                      </div>
                    )}
                  </div>

                  <div className="transaction-id">
                    ID Opération: <code>{transaction.operationId}</code>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .suivi-container {
          padding: 20px;
          background: rgba(255, 140, 0, 0.05);
          border-radius: 10px;
          margin-top: 20px;
        }

        .filters-section {
          background: white;
          border: 2px solid #ff8c00;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .filter-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 15px;
          border: 2px solid #ff8c00;
          background: white;
          color: #ff8c00;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #ff8c00 0%, #e67e00 100%);
          color: white;
        }

        .filter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 10px rgba(255, 140, 0, 0.3);
        }

        .limit-selector,
        .compte-selector {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .limit-selector label,
        .compte-selector label {
          font-weight: 600;
          color: #333;
        }

        .select-limit,
        .select-compte {
          padding: 8px 12px;
          border: 2px solid #ff8c00;
          border-radius: 5px;
          background: white;
          color: #333;
          font-size: 14px;
          cursor: pointer;
          flex: 1;
          min-width: 200px;
        }

        .select-limit:focus,
        .select-compte:focus {
          outline: none;
          box-shadow: 0 0 8px rgba(255, 140, 0, 0.3);
        }

        .btn-refresh {
          padding: 8px 15px;
          background: linear-gradient(135deg, #ff8c00 0%, #e67e00 100%);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-refresh:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 10px rgba(255, 140, 0, 0.3);
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
          padding: 30px;
          color: #ff8c00;
          font-weight: 600;
          font-size: 16px;
        }

        .transactions-header {
          margin-bottom: 15px;
        }

        .transactions-header h4 {
          margin: 0;
          color: #0a0e27;
          font-size: 18px;
          border-bottom: 2px solid #ff8c00;
          padding-bottom: 10px;
        }

        .no-data {
          text-align: center;
          padding: 30px;
          color: #999;
          font-style: italic;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .transaction-card {
          background: white;
          border: 2px solid #ff8c00;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border-left: 5px solid #ff8c00;
        }

        .transaction-card.debit {
          border-left-color: #dc3545;
        }

        .transaction-card.credit {
          border-left-color: #28a745;
        }

        .transaction-card:hover {
          box-shadow: 0 5px 20px rgba(255, 140, 0, 0.2);
          transform: translateY(-2px);
        }

        .transaction-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 12px;
        }

        .transaction-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .transaction-main {
          flex: 1;
          min-width: 0;
        }

        .transaction-main h5 {
          margin: 0 0 5px 0;
          color: #0a0e27;
          font-size: 16px;
        }

        .client-name {
          margin: 0;
          font-size: 13px;
          color: #666;
        }

        .transaction-amount {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
          flex-shrink: 0;
        }

        .amount {
          font-weight: 700;
          font-size: 18px;
        }

        .amount.debit {
          color: #dc3545;
        }

        .amount.credit {
          color: #28a745;
        }

        .status-badge {
          background: #fff3cd;
          color: #856404;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 600;
        }

        .transaction-details {
          background: rgba(255, 140, 0, 0.05);
          border: 1px solid rgba(255, 140, 0, 0.2);
          border-radius: 5px;
          padding: 10px;
          margin-bottom: 10px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 10px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-size: 13px;
        }

        .detail-item strong {
          color: #ff8c00;
          font-weight: 600;
        }

        .detail-item span {
          color: #333;
          word-break: break-word;
        }

        .type-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 600;
          max-width: fit-content;
        }

        .type-badge.debit {
          background: #f8d7da;
          color: #721c24;
        }

        .type-badge.credit {
          background: #d4edda;
          color: #155724;
        }

        .type-badge.virement {
          background: #d1ecf1;
          color: #0c5460;
        }

        .transaction-id {
          font-size: 12px;
          color: #999;
          border-top: 1px solid rgba(255, 140, 0, 0.1);
          padding-top: 8px;
        }

        .transaction-id code {
          background: rgba(255, 140, 0, 0.1);
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          color: #ff8c00;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .transaction-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .transaction-amount {
            align-items: flex-start;
          }

          .transaction-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default SuiviTransactions;
