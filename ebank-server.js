// Simple EBank API Server (Node.js)
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

const JWT_SECRET = '5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437';

// In-memory database
const users = [
  {
    id: 1,
    login: 'agent',
    password: 'agent123',
    nom: 'Admin',
    prenom: 'Agent',
    email: 'agent@ebank.com',
    role: 'AGENT_GUICHET'
  },
  {
    id: 2,
    login: 'client',
    password: 'client123',
    nom: 'Ziad',
    prenom: 'Idriss',
    email: 'client@ebank.com',
    role: 'CLIENT'
  },
  {
    id: 3,
    login: 'sophia.martin',
    password: 'sophia123',
    nom: 'Martin',
    prenom: 'Sophia',
    email: 'sophia.martin@ebank.com',
    role: 'CLIENT'
  }
];

const comptes = [
  {
    id: 1,
    userId: 2,
    rib: '1234567890123456',
    solde: 15000.00,
    type: 'COURANT',
    dateCreation: '2024-01-15'
  },
  {
    id: 2,
    userId: 3,
    rib: '9876543210987654',
    solde: 25000.00,
    type: 'COURANT',
    dateCreation: '2024-02-20'
  }
];

const operations = [];

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { login, password } = req.body;
  const user = users.find(u => u.login === login && u.password === password);
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, login: user.login, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      login: user.login,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { login, password, nom, prenom, email } = req.body;
  
  if (users.find(u => u.login === login)) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  const newUser = {
    id: users.length + 1,
    login,
    password,
    nom,
    prenom,
    email,
    role: 'CLIENT'
  };
  
  users.push(newUser);
  res.json({ success: true, user: newUser });
});

// Client endpoints
app.get('/api/client/dashboard', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  const userComptes = comptes.filter(c => c.userId === user.id);
  
  const totalSolde = userComptes.reduce((sum, c) => sum + c.solde, 0);
  const totalComptes = userComptes.length;
  
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email
      },
      totalSolde,
      totalComptes,
      comptes: userComptes
    }
  });
});

app.get('/api/client/comptes', authenticateToken, (req, res) => {
  const userComptes = comptes.filter(c => c.userId === req.user.id);
  res.json({ success: true, data: userComptes });
});

app.get('/api/client/operations/:compteId', authenticateToken, (req, res) => {
  const { compteId } = req.params;
  const compte = comptes.find(c => c.id == compteId && c.userId === req.user.id);
  
  if (!compte) {
    return res.status(404).json({ success: false, message: 'Compte not found' });
  }
  
  const compteOps = operations.filter(o => o.compteId == compteId);
  res.json({ success: true, data: compteOps });
});

app.post('/api/client/virement', authenticateToken, (req, res) => {
  const { compteSourceId, compteDestId, montant, description } = req.body;
  
  const compteSource = comptes.find(c => c.id == compteSourceId && c.userId === req.user.id);
  const compteDest = comptes.find(c => c.id == compteDestId);
  
  if (!compteSource) {
    return res.status(404).json({ success: false, message: 'Source compte not found' });
  }
  
  if (!compteDest) {
    return res.status(404).json({ success: false, message: 'Destination compte not found' });
  }
  
  if (compteSource.solde < montant) {
    return res.status(400).json({ success: false, message: 'Insufficient balance' });
  }
  
  compteSource.solde -= montant;
  compteDest.solde += montant;
  
  const operation = {
    id: operations.length + 1,
    compteId: compteSourceId,
    type: 'VIREMENT',
    montant,
    description,
    dateOperation: new Date()
  };
  
  operations.push(operation);
  
  res.json({ success: true, message: 'Transfer successful', operation });
});

// Agent endpoints
app.post('/api/agent/creer-client', authenticateToken, (req, res) => {
  if (req.user.role !== 'AGENT_GUICHET') {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }
  
  const { login, password, nom, prenom, email } = req.body;
  const newUser = {
    id: users.length + 1,
    login,
    password,
    nom,
    prenom,
    email,
    role: 'CLIENT'
  };
  
  users.push(newUser);
  res.json({ success: true, user: newUser });
});

app.post('/api/agent/creer-compte', authenticateToken, (req, res) => {
  if (req.user.role !== 'AGENT_GUICHET') {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }
  
  const { userId, rib, soldeInitial } = req.body;
  const newCompte = {
    id: comptes.length + 1,
    userId,
    rib,
    solde: soldeInitial || 0,
    type: 'COURANT',
    dateCreation: new Date()
  };
  
  comptes.push(newCompte);
  res.json({ success: true, compte: newCompte });
});

// Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

app.listen(8081, () => {
  console.log('✅ EBank API Server running on http://localhost:8081');
  console.log('\nTest credentials:');
  console.log('Agent: agent / agent123');
  console.log('Client: client / client123');
  console.log('Client 2: sophia.martin / sophia123');
});
