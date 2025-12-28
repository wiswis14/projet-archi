import api from './axios';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user?.roles?.includes(role);
  }
};

export const agentService = {
  ajouterClient: async (clientData) => {
    const response = await api.post('/agent/clients', clientData);
    return response.data;
  },

  creerCompte: async (compteData) => {
    const response = await api.post('/agent/comptes', compteData);
    return response.data;
  }
};

export const clientService = {
  getDashboard: async (rib = null) => {
    const url = rib ? `/client/dashboard?rib=${rib}` : '/client/dashboard';
    const response = await api.get(url);
    return response.data;
  },

  effectuerVirement: async (virementData) => {
    const response = await api.post('/client/virement', virementData);
    return response.data;
  },

  changerMotDePasse: async (passwordData) => {
    const response = await api.put('/client/change-password', passwordData);
    return response.data;
  }
};
