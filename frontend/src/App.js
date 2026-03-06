import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavMenu from './navmenu';
import Login from './login';
import Dashboard from './dashboard';
import Cadastro from './cadastro';
import Chamados from './Chamados';
import Ticket from './ticket'; 
import EditarChamado from './editarchamado'; 
import ManutencaoCorretiva from './corretivas'; 

function AppContent() {
  const location = useLocation();
  
  const fullScreenPages = ['/', '/cadastro'];
  const isFullScreenPage = fullScreenPages.includes(location.pathname);

  return (
    <div style={styles.appWrapper}>
      {!isFullScreenPage && <NavMenu />}
      
      <main style={{ 
        ...styles.mainContent,
        marginLeft: isFullScreenPage ? '0' : '260px', 
      }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/chamados" element={<Chamados />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/editar/:id" element={<EditarChamado />} />
          
          <Route path="/corretivas/:id" element={<ManutencaoCorretiva />} />

          <Route path="/config" element={
            <div style={styles.placeholderPage}>
              <h1 style={styles.title}>Configurações</h1>
              <p style={styles.subtitle}>Gerencie as preferências do sistema</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const styles = {
  appWrapper: { display: 'flex', backgroundColor: '#0a0a0a', minHeight: '100vh', width: '100vw', color: '#e2e8f0', overflowX: 'hidden' },
  mainContent: { flex: 1, minHeight: '100vh', transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative' },
  placeholderPage: { padding: '40px', display: 'flex', flexDirection: 'column', gap: '10px' },
  title: { fontSize: '24px', color: '#fff', fontWeight: '800', margin: 0 },
  subtitle: { fontSize: '14px', color: '#64748b' }
};

export default App;