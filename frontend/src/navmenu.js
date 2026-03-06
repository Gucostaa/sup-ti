import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ticket, UserPlus, Settings, LogOut, PlusCircle, Wrench } from 'lucide-react';

function NavMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav style={styles.nav}>
      {/* Container Superior (Logo e Links) */}
      <div style={styles.topSection}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>TI</div>
          <h2 style={styles.logoText}>Suporte Central</h2>
        </div>
        
        <ul style={styles.ul}>
          <MenuItem 
            to="/dashboard" 
            icon={<LayoutDashboard size={20}/>} 
            label="Dashboard" 
            active={isActive('/dashboard')} 
          />
          
          <MenuItem 
            to="/ticket" 
            icon={<PlusCircle size={20}/>} 
            label="Novo Ticket" 
            active={isActive('/ticket')} 
          />

          <MenuItem 
            to="/chamados" 
            icon={<Ticket size={20}/>} 
            label="Chamados" 
            active={isActive('/chamados')} 
          />

          <MenuItem 
            to="/corretivas/lista" 
            icon={<Wrench size={20}/>} 
            label="Corretivas" 
            active={isActive('/corretivas')} 
          />

          <MenuItem 
            to="/cadastro" 
            icon={<UserPlus size={20}/>} 
            label="Cadastro" 
            active={isActive('/cadastro')} 
          />
          
          <MenuItem 
            to="/config" 
            icon={<Settings size={20}/>} 
            label="Configurações" 
            active={isActive('/config')} 
          />
        </ul>
      </div>

      {/* Container Inferior (Botão Sair) */}
      <div style={styles.bottomSection}>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={20}/> 
          <span>Sair do Sistema</span>
        </button>
      </div>
    </nav>
  );
}

const MenuItem = ({ to, icon, label, active }) => (
  <li style={{ marginBottom: '4px' }}>
    <Link to={to} style={{
      ...styles.link,
      backgroundColor: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      color: active ? '#3b82f6' : '#94a3b8',
      borderRight: active ? '3px solid #3b82f6' : '3px solid transparent'
    }}>
      {icon}
      <span style={{ fontWeight: active ? '600' : '400' }}>{label}</span>
    </Link>
  </li>
);

const styles = {
  nav: { 
    width: '260px', 
    backgroundColor: '#050505', 
    height: '100vh', 
    position: 'fixed', 
    display: 'flex', 
    flexDirection: 'column', 
    borderRight: '1px solid #1f1f1f',
    zIndex: 1000 
  },
  topSection: {
    padding: '24px 16px',
    flex: 1, 
    overflowY: 'auto' 
  },
  logoContainer: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    marginBottom: '40px', 
    padding: '0 8px' 
  },
  logoIcon: { 
    backgroundColor: '#3b82f6', 
    color: '#fff', 
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px', 
    fontWeight: 'bold',
    fontSize: '12px'
  },
  logoText: { 
    fontSize: '16px', 
    color: '#fff', 
    margin: 0, 
    fontWeight: '700',
    letterSpacing: '0.5px' 
  },
  ul: { listStyle: 'none', padding: 0, margin: 0 },
  link: { 
    textDecoration: 'none', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    padding: '12px 16px', 
    fontSize: '14px', 
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    marginRight: '8px'
  },
  bottomSection: {
    padding: '16px',
    borderTop: '1px solid #1f1f1f', 
    backgroundColor: '#050505'
  },
  logoutBtn: { 
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
    color: '#ef4444', 
    border: '1px solid rgba(239, 68, 68, 0.2)', 
    borderRadius: '8px',
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: '10px', 
    padding: '12px', 
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  }
};

export default NavMenu;