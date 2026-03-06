import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { List, Clock, CheckCircle, Search, Filter, RefreshCw, Edit3, Trash2, Eye, Plus, User, Building2 } from 'lucide-react';

function Chamados() {
    const [chamados, setChamados] = useState([]);
    const [filteredChamados, setFilteredChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchChamados = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5226/api/Chamados');
            const data = Array.isArray(res.data) ? res.data : [];
            setChamados(data);
            setFilteredChamados(data);
        } catch (err) {
            console.error("Erro ao buscar chamados:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchChamados(); }, []);

    useEffect(() => {
        const results = chamados.filter(c =>
            (c.titulo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.id || "").toString().includes(searchTerm) ||
            (c.usuario_nome || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.setor || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredChamados(results);
    }, [searchTerm, chamados]);

    const getPriorityColor = (p) => {
        const priority = (p || "").toLowerCase();
        if (priority === 'alta') return '#ef4444';
        if (priority === 'media') return '#f59e0b';
        return '#10b981';
    };

    const getStatusBadge = (status) => {
        const isAberto = status?.toLowerCase() === 'aberto';
        return (
            <span style={{
                ...styles.badge,
                backgroundColor: isAberto ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: isAberto ? '#ef4444' : '#10b981',
                border: `1px solid ${isAberto ? '#ef444433' : '#10b98133'}`
            }}>
                {isAberto ? <Clock size={12} /> : <CheckCircle size={12} />}
                {status}
            </span>
        );
    };

    const handleExcluir = async (id) => {
        if (window.confirm(`Tem certeza que deseja excluir o chamado #${id}?`)) {
            try {
                await axios.delete(`http://localhost:5226/api/Chamados/${id}`);
                const novaLista = chamados.filter(c => (c.id || c.Id) !== id);
                setChamados(novaLista);
                alert("Chamado removido com sucesso!");
            } catch (err) {
                alert("Erro ao excluir o chamado.");
            }
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={styles.iconHeader}><List size={32} color="#3b82f6" /></div>
                    <div>
                        <h1 style={styles.title}>Gerenciar Chamados</h1>
                        <p style={styles.subtitle}>Consulte, edite e finalize tickets de suporte técnico.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={fetchChamados} style={styles.refreshBtn} disabled={loading}>
                        <RefreshCw size={20} className={loading ? "spin" : ""} />
                    </button>
                    <button onClick={() => navigate('/ticket')} style={styles.newTicketBtn}>
                        <Plus size={20} /> Novo Ticket
                    </button>
                </div>
            </header>

            <div style={styles.filterBar}>
                <div style={styles.searchWrapper}>
                    <Search size={20} color="#64748b" />
                    <input
                        style={styles.searchInput}
                        placeholder="Pesquisar por ID, título, nome ou setor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.th, width: '250px' }}>Solicitante / Setor</th>
                            <th style={styles.th}>Ticket / Assunto</th>
                            <th style={{ ...styles.th, width: '140px' }}>Prioridade</th>
                            <th style={{ ...styles.th, width: '140px' }}>Status</th>
                            <th style={{ ...styles.th, width: '180px', textAlign: 'center' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChamados.map(c => {
                            const id = c.id || c.Id;
                            return (
                                <tr key={id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={styles.userInfo}>
                                            <User size={14} color="#3b82f6" />
                                            <span>{c.usuario_nome || "Sistema"}</span>
                                        </div>
                                        <div style={styles.sectorInfo}>
                                            <Building2 size={14} color="#64748b" />
                                            <span>{c.setor || "Geral"}</span>
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.tituloText}>
                                            <span style={{ color: '#3b82f6', marginRight: '8px' }}>#{id}</span>
                                            {c.titulo}
                                        </div>
                                        <div style={styles.descText}>
                                            {c.descricao}
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: getPriorityColor(c.prioridade), fontSize: '14px', fontWeight: '700' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: getPriorityColor(c.prioridade) }}></div>
                                            {c.prioridade}
                                        </div>
                                    </td>
                                    <td style={styles.td}>{getStatusBadge(c.status)}</td>
                                    <td style={styles.tdActions}>
                                        <div style={styles.actionsContainer}>
                                            <button onClick={() => navigate(`/corretivas/${id}`)} style={{ ...styles.actionBtn, color: '#3b82f6' }} title="Visualizar"><Eye size={18} /></button>
                                            <button onClick={() => navigate(`/editar/${id}`)} style={{ ...styles.actionBtn, color: '#f59e0b' }} title="Editar"><Edit3 size={18} /></button>
                                            <button onClick={() => handleExcluir(id)} style={{ ...styles.actionBtn, color: '#ef4444' }} title="Excluir"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const styles = {
    container: { padding: '50px', backgroundColor: '#050505', minHeight: '100vh', color: '#e2e8f0' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    iconHeader: { backgroundColor: '#0f0f0f', padding: '15px', borderRadius: '18px', border: '1px solid #1f1f1f' },
    title: { fontSize: '32px', color: '#fff', margin: 0, fontWeight: '800' },
    subtitle: { fontSize: '16px', color: '#64748b', margin: '6px 0 0 0' },
    refreshBtn: { backgroundColor: '#0f0f0f', border: '1px solid #1f1f1f', color: '#94a3b8', padding: '12px', borderRadius: '12px', cursor: 'pointer' },
    newTicketBtn: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' },
    filterBar: { display: 'flex', gap: '20px', marginBottom: '30px' },
    searchWrapper: { flex: 1, display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#0f0f0f', padding: '0 20px', borderRadius: '16px', border: '1px solid #1f1f1f' },
    searchInput: { backgroundColor: 'transparent', border: 'none', color: '#fff', width: '100%', padding: '18px 0', outline: 'none', fontSize: '16px' },
    tableWrapper: { backgroundColor: '#0f0f0f', borderRadius: '24px', border: '1px solid #1f1f1f', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '22px 25px', backgroundColor: '#0a0a0a', color: '#4b5563', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '800' },
    tr: { borderBottom: '1px solid #1f1f1f' },
    td: { padding: '25px', verticalAlign: 'top' },
    userInfo: { display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: '600', fontSize: '14px' },
    sectorInfo: { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '12px', marginTop: '4px' },
    tdActions: { padding: '25px', verticalAlign: 'top' },
    actionsContainer: { display: 'flex', justifyContent: 'center', gap: '12px' },
    tituloText: { color: '#fff', fontWeight: '700', fontSize: '15px', marginBottom: '4px' },
    descText: { color: '#475569', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' },
    actionBtn: { background: '#050505', border: '1px solid #1f1f1f', padding: '8px', borderRadius: '8px', cursor: 'pointer' }
};

export default Chamados;