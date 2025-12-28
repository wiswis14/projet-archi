import React from 'react';
import { authService } from '../api/services';
import Logo from './Logo';

function Header({ onLogout }) {
  const user = authService.getCurrentUser();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <Logo size="medium" />
        </div>
        <div className="header-user">
          <div className="user-info">
            <div className="user-avatar">
              {user?.login?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>{user?.login}</div>
              <div style={{ fontSize: '0.85rem', opacity: '0.9' }}>
                {user?.roles?.includes('AGENT_GUICHET') ? '👔 Agent Guichet' : '👤 Client'}
              </div>
            </div>
          </div>
          <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '0.7rem 1.2rem' }}>
            🚪 Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
