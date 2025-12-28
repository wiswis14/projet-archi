import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../api/services';

function ProtectedRoute({ children, requiredRole }) {
  const isAuthenticated = authService.isAuthenticated();
  const hasRequiredRole = requiredRole ? authService.hasRole(requiredRole) : true;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!hasRequiredRole) {
    return (
      <div className="container">
        <div className="alert alert-error">
          Vous n'avez pas le droit d'accéder à cette fonctionnalité. 
          Veuillez contacter votre administrateur.
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
