import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Ticket, AlertCircle, CheckCircle, 
  Clock, Activity, ChevronRight, Signal, SignalLow, 
  BarChart3, Zap, User, Mail, Building2
} from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, abertos: 0 });
  const [recentes, setRecentes] = useState([]);
  const [ping, setPing] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStats = await axios.get('http://localhost:5226/api/Chamados/stats');
        setStats(resStats.data);

        const resRecentes = await axios.get('http://localhost:5226/api/Chamados');
        const ordenados = resRecentes.data.sort((a, b) => b.id - a.id);
        setRecentes(ordenados.slice(0, 5));

        const start = Date.now();
        await axios.get('http://localhost:5226/api/Chamados/stats'); 
        setPing(Date.now() - start);
      } catch (err) {
        console.error("Erro na sincronização:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, []);

  const resolvidos = stats.total - stats.abertos;
  const taxaResolucao = stats.total > 0 ? ((resolvidos / stats.total) * 100).toFixed(1) : 0;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerInfo}>
          <div style={styles.iconCircle}>
             <LayoutDashboard size={32} color="#3b82f6" />
          </div>
          <div>
            <h1 style={styles.title}>Painel de Controle</h1>
            <p style={styles.subtitle}>Gestão de incidentes em tempo real</p>
          </div>
        </div>
        <div style={styles.dateTag}>
            <Clock size={18} />
            {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
        </div>
      </header>

      <div style={styles.grid}>
        <StatCard icon={<Ticket size={28} color="#3b82f6"/>} label="Total Acumulado" value={stats.total} color="#3b82f6" />
        <StatCard icon={<AlertCircle size={28} color="#ef4444"/>} label="Aguardando Suporte" value={stats.abertos} color="#ef4444" />
        <StatCard icon={<Zap size={28} color="#10b981"/>} label="Taxa de Eficiência" value={`${taxaResolucao}%`} color="#10b981" />
        <StatCard icon={<CheckCircle size={28} color="#f59e0b"/>} label="Resolvidos" value={resolvidos} color="#f59e0b" />
      </div>

      <div style={styles.contentSection}>
        <div style={styles.mainContent}>
          <div style={styles.sectionHeader}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <Activity size={24} color="#3b82f6" />
              <h3 style={{margin: 0, fontSize: '20px'}}>Fluxo Recente</h3>
            </div>
            <button style={styles.viewAllBtn} onClick={() => navigate('/chamados')}>Ver todos</button>
          </div>
          
          <div style={styles.activityList}>
            {recentes.length > 0 ? recentes.map(item => (
              <div key={item.id} style={styles.activityItem} onClick={() => navigate(`/corretivas/${item.id}`)}>
                <div style={styles.activityLeft}>
                  <div style={{
                    ...styles.priorityIndicator, 
                    backgroundColor: item.prioridade === 'Alta' ? '#ef4444' : item.prioridade === 'Media' ? '#f59e0b' : '#10b981'
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.activityTitle}>{item.titulo}</div>
                    <div style={styles.activityDesc}>{item.descricao}</div>
                    
                    <div style={styles.activityMeta}>
                       <span style={styles.sectorBadge}>
                           <Building2 size={12} /> {item.setor || 'TI'}
                       </span>
                       <span style={styles.metaUser}><User size={14}/> {item.usuario_nome || 'Sistema'}</span>
                       {item.usuario_email && <span style={styles.metaEmail}><Mail size={14}/> {item.usuario_email}</span>}
                    </div>
                  </div>
                </div>
                <div style={styles.activityRight}>
                    <span style={{
                        ...styles.statusTag, 
                        color: item.status === 'Aberto' ? '#ef4444' : '#10b981',
                        borderColor: item.status === 'Aberto' ? '#ef444444' : '#10b98144'
                    }}>
                        {item.status?.toUpperCase()}
                    </span>
                    <ChevronRight size={24} color="#334155" />
                </div>
              </div>
            )) : <p style={{color: '#4b5563', textAlign: 'center', padding: '40px', fontSize: '18px'}}>Nenhum chamado pendente.</p>}
          </div>
        </div>

        <div style={styles.sideContent}>
          <div style={styles.sideCard}>
            <h3 style={styles.sideTitle}><BarChart3 size={20} /> Infraestrutura</h3>
            <div style={styles.systemBox}>
              <div style={styles.systemStatus}>
                <div style={styles.pulseContainer}>
                   <span style={styles.statusDotLive}></span>
                   <span style={styles.statusPulse}></span>
                </div>
                <span style={styles.systemLabel}>API Gateway</span>
              </div>
              <span style={styles.onlineTag}>ESTÁVEL</span>
            </div>
            <div style={styles.systemBox}>
              <div style={styles.systemStatus}>
                {ping < 100 ? <Signal size={20} color="#10b981"/> : <SignalLow size={20} color="#f59e0b"/>}
                <span style={styles.systemLabel}>Latência SQL</span>
              </div>
              <span style={{...styles.onlineTag, color: ping > 150 ? '#ef4444' : '#10b981', fontSize: '14px'}}>
                  {ping > 0 ? `${ping}ms` : '---'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 70% { transform: scale(2.5); opacity: 0; } 100% { transform: scale(1); opacity: 0; } }`}</style>
    </div>
  );
}

const StatCard = ({ icon, label, value, color }) => (
  <div style={{...styles.card, borderLeft: `6px solid ${color}`}}>
    <div style={styles.cardHeader}>
      <div style={{...styles.iconBox, backgroundColor: `${color}15`}}>{icon}</div>
      <span style={styles.label}>{label}</span>
    </div>
    <p style={{...styles.value, color: '#fff'}}>{value}</p>
  </div>
);

const styles = {
  container: { padding: '50px', backgroundColor: '#050505', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' },
  headerInfo: { display: 'flex', alignItems: 'center', gap: '20px' },
  iconCircle: { width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1f1f1f' },
  title: { fontSize: '32px', color: '#fff', fontWeight: '800', margin: 0 },
  subtitle: { fontSize: '16px', color: '#64748b', margin: '6px 0 0 0' },
  dateTag: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#0f0f0f', padding: '12px 20px', borderRadius: '12px', fontSize: '15px', color: '#94a3b8', border: '1px solid #1f1f1f' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginBottom: '45px' },
  card: { backgroundColor: '#0f0f0f', padding: '30px', borderRadius: '16px', border: '1px solid #1f1f1f' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  iconBox: { width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: '13px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },
  value: { fontSize: '42px', fontWeight: '900', margin: 0 },
  contentSection: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' },
  mainContent: { backgroundColor: '#0f0f0f', padding: '35px', borderRadius: '24px', border: '1px solid #1f1f1f' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  viewAllBtn: { background: 'rgba(59, 130, 246, 0.1)', border: 'none', color: '#3b82f6', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  activityList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  activityItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#0a0a0a', borderRadius: '16px', border: '1px solid #1f1f1f', cursor: 'pointer' },
  activityLeft: { display: 'flex', alignItems: 'center', gap: '20px', flex: 1 },
  priorityIndicator: { width: '6px', height: '60px', borderRadius: '3px' },
  activityTitle: { fontSize: '18px', fontWeight: '700', color: '#fff' },
  activityDesc: { fontSize: '14px', color: '#94a3b8', margin: '4px 0 10px 0', display: '-webkit-box', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  activityMeta: { display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' },
  sectorBadge: { fontSize: '11px', backgroundColor: '#1e293b', color: '#3b82f6', padding: '3px 10px', borderRadius: '6px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase' },
  metaUser: { fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '5px' },
  metaEmail: { fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' },
  activityRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  statusTag: { padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', border: '1px solid' },
  sideContent: { display: 'flex', flexDirection: 'column', gap: '20px' },
  sideCard: { backgroundColor: '#0f0f0f', padding: '30px', borderRadius: '24px', border: '1px solid #1f1f1f' },
  sideTitle: { fontSize: '18px', color: '#fff', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontWeight: '700' },
  systemBox: { backgroundColor: '#0a0a0a', padding: '20px', borderRadius: '16px', border: '1px solid #1f1f1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  systemStatus: { display: 'flex', alignItems: 'center', gap: '12px' },
  systemLabel: { fontSize: '15px', color: '#94a3b8', fontWeight: '600' },
  pulseContainer: { position: 'relative', width: '10px', height: '10px' },
  statusDotLive: { position: 'absolute', width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%', zIndex: 2 },
  statusPulse: { position: 'absolute', width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite', zIndex: 1 },
  onlineTag: { fontSize: '12px', fontWeight: '800', color: '#10b981', letterSpacing: '1px' }
};

export default Dashboard;