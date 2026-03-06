import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Wrench, CheckCircle, ArrowLeft, ClipboardList,
    AlertTriangle, FileText, Loader2, Calendar, User, Building2
} from 'lucide-react';

function ManutencaoCorretiva() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [chamado, setChamado] = useState(null);
    const [listaPendentes, setListaPendentes] = useState([]);
    const [solucao, setSolucao] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            try {
                if (id && id !== 'lista' && !isNaN(id)) {
                    const res = await axios.get(`http://localhost:5226/api/Chamados/${id}`);
                    setChamado(res.data);
                    if (res.data.solucao) setSolucao(res.data.solucao);
                } else {
                    const res = await axios.get(`http://localhost:5226/api/Chamados`);
                    const pendentes = res.data.filter(c =>
                        c.status?.toLowerCase() !== 'resolvido' &&
                        c.status?.toLowerCase() !== 'concluido'
                    );
                    setListaPendentes(pendentes);
                }
            } catch (err) {
                console.error("Erro ao carregar:", err);
            } finally {
                setLoading(false);
            }
        };
        carregarDados();
    }, [id]);

    const finalizarCorretiva = async (e) => {
        if(e) e.preventDefault();
        setSaving(true);
        try {
            const dadosParaAtualizar = {
                ...chamado,
                solucao: solucao,
                status: "Resolvido",
                data_fechamento: new Date().toISOString()
            };
            await axios.put(`http://localhost:5226/api/Chamados/${chamado.id}`, dadosParaAtualizar);
            alert("✅ Sucesso!");
            navigate('/dashboard');
        } catch (err) {
            alert("Erro ao salvar.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={styles.loading}><Loader2 className="spin" /></div>;

    // --- LISTA DE CHAMADOS (FILA) ---
    if (!id || id === 'lista') {
        return (
            <div style={styles.container}>
                <div style={styles.titleRow}>
                    <Wrench size={28} color="#3b82f6" />
                    <h2 style={styles.title}>Fila de Correção</h2>
                </div>
                <div style={styles.listContainer}>
                    {listaPendentes.map(item => (
                        <div key={item.id} style={styles.listItem} onClick={() => navigate(`/corretivas/${item.id}`)}>
                            <div style={styles.listInfo}>
                                <div style={{...styles.prioBadge, color: item.prioridade === 'Alta' ? '#ef4444' : '#f59e0b'}}>
                                    {item.prioridade}
                                </div>
                                <div>
                                    <h4 style={styles.itemTitle}>{item.titulo}</h4>
                                    <div style={styles.itemSub}>
                                        <User size={12} /> {item.usuario_nome || "Usuário"} 
                                        <span style={{ margin: '0 8px', color: '#334155' }}>|</span>
                                        <Building2 size={12} /> Setor: <strong style={{color: '#94a3b8'}}>{item.setor || 'Geral'}</strong>
                                    </div>
                                </div>
                            </div>
                            <button 
                                style={styles.btnSelect}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/corretivas/${item.id}`);
                                }}
                            >
                                Resolver Agora
                            </button>
                        </div>
                    ))}
                    {listaPendentes.length === 0 && <p style={styles.itemSub}>Nenhuma corretiva pendente.</p>}
                </div>
            </div>
        );
    }

    // --- FORMULÁRIO DE RESOLUÇÃO ---
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <button onClick={() => navigate('/corretivas/lista')} style={styles.backBtn}>
                    <ArrowLeft size={18} /> Voltar
                </button>
                <h2 style={styles.title}>Ticket #{id} - {chamado?.titulo}</h2>
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                    <p style={styles.itemSub}><User size={14} /> Solicitante: {chamado?.usuario_nome || "Usuário"}</p>
                    <p style={styles.itemSub}><Building2 size={14} /> Setor: <span style={{color: '#fff', fontWeight: 'bold'}}>{chamado?.setor}</span></p>
                </div>
            </header>

            <div style={styles.grid}>
                <div style={styles.infoCard}>
                    <h3 style={styles.sectionTitle}><ClipboardList size={18} /> Descrição do Incidente</h3>
                    <p style={styles.descValue}>{chamado?.descricao}</p>
                </div>

                <form onSubmit={finalizarCorretiva} style={styles.formCard}>
                    <h3 style={styles.sectionTitle}><FileText size={18} /> Relatório de Solução</h3>
                    <textarea
                        style={styles.textarea}
                        placeholder="Descreva detalhadamente o que foi feito para resolver o problema..."
                        value={solucao}
                        onChange={(e) => setSolucao(e.target.value)}
                        required
                    />
                    <button type="submit" style={styles.submitBtn} disabled={saving}>
                        {saving ? <Loader2 className="spin" size={20} /> : "Finalizar e Concluir"}
                    </button>
                </form>
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const styles = {
    container: { padding: '40px', backgroundColor: '#050505', minHeight: '100vh', color: '#e2e8f0' },
    titleRow: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' },
    title: { fontSize: '24px', color: '#fff', margin: 0 },
    header: { marginBottom: '30px' },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#0f0f0f', borderRadius: '12px', border: '1px solid #1f1f1f', cursor: 'pointer', transition: '0.2s' },
    listInfo: { display: 'flex', alignItems: 'center', gap: '20px' },
    itemTitle: { margin: 0, color: '#fff', fontSize: '16px' },
    itemSub: { color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' },
    prioBadge: { fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', width: '60px' },
    btnSelect: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    infoCard: { backgroundColor: '#0f0f0f', padding: '25px', borderRadius: '15px', border: '1px solid #1f1f1f' },
    formCard: { backgroundColor: '#0f0f0f', padding: '25px', borderRadius: '15px', border: '1px solid #1f1f1f' },
    sectionTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', color: '#fff', marginBottom: '15px' },
    descValue: { backgroundColor: '#161616', padding: '15px', borderRadius: '10px', lineHeight: '1.6', minHeight: '100px' },
    textarea: { width: '100%', backgroundColor: '#161616', border: '1px solid #222', borderRadius: '10px', padding: '15px', color: '#fff', minHeight: '150px', marginBottom: '20px', outline: 'none' },
    submitBtn: { width: '100%', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', padding: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#050505', color: '#fff' },
    backBtn: { background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '10px', padding: 0 }
};

export default ManutencaoCorretiva;