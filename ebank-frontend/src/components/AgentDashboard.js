import React, { useState } from 'react';
import Header from './Header';
import AjouterClient from './AjouterClient';
import CreerCompte from './CreerCompte';
import ConsultationComptes from './ConsultationComptes';
import SuiviTransactions from './SuiviTransactions';

function AgentDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('client');

  return (
    <>
      <Header onLogout={onLogout} />
      <div className="container">
        <div className="card">
          <h2>Espace Agent Guichet</h2>
          
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'client' ? 'active' : ''}`}
              onClick={() => setActiveTab('client')}
            >
              Ajouter un client
            </button>
            <button 
              className={`nav-tab ${activeTab === 'compte' ? 'active' : ''}`}
              onClick={() => setActiveTab('compte')}
            >
              Créer un compte
            </button>
            <button 
              className={`nav-tab ${activeTab === 'consultation' ? 'active' : ''}`}
              onClick={() => setActiveTab('consultation')}
            >
              📊 Consulter les comptes
            </button>
            <button 
              className={`nav-tab ${activeTab === 'suivi' ? 'active' : ''}`}
              onClick={() => setActiveTab('suivi')}
            >
              📈 Suivi des transactions
            </button>
          </div>

          {activeTab === 'client' && <AjouterClient />}
          {activeTab === 'compte' && <CreerCompte />}
          {activeTab === 'consultation' && <ConsultationComptes />}
          {activeTab === 'suivi' && <SuiviTransactions />}
        </div>
      </div>
    </>
  );
}

export default AgentDashboard;
