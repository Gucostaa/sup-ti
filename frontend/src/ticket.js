import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Tag, ShieldAlert, AlignLeft, Loader2, ChevronDown, ArrowLeft, Building2 } from 'lucide-react';

function NovoChamado() {
    const [form, setForm] = useState({ 
        titulo: '', 
        descricao: '', 
        prioridade: 'Media',
        setor: 'TI' 
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getPriorityColor = () => {
        switch (form.prioridade) {
            case 'Alta': return '#ef4444';
            case 'Media': return '#f59e0b';
            case 'Baixa': return '#10b981';
            default: return '#4b5563';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));
        const idParaEnviar = usuarioLogado ? usuarioLogado.id : 1;

        try {
            await axios.post('http://localhost:5226/api/Chamados', {
                ...form,
                usuario_id: idParaEnviar,
                status: "Aberto"
            });
            alert("Ticket aberto com sucesso!");
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar chamado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <header style={styles.header}>
                    <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
                        <ArrowLeft size={18} /> Voltar ao Painel
                    </button>
                    <h2 style={styles.title}>Abrir Novo Ticket</h2>
                    <p style={styles.subtitle}>Preencha as informações para iniciar o atendimento.</p>
                </header>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>O que está acontecendo?</label>
                        <div style={styles.inputWrapper}>
                            <Tag size={18} style={styles.icon} />
                            <input
                                style={styles.input}
                                placeholder="Resumo do problema"
                                onChange={e => setForm({ ...form, titulo: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Novo Campo: Setor */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Setor Solicitante</label>
                        <div style={styles.inputWrapper}>
                            <Building2 size={18} style={styles.icon} />
                            <select
                                style={styles.select}
                                value={form.setor}
                                onChange={e => setForm({ ...form, setor: e.target.value })}
                            >
                                <option value="TI">TI / Tecnologia</option>
                                <option value="RH">Recursos Humanos</option>
                                <option value="Vendas">Vendas</option>
                                <option value="Financeiro">Financeiro</option>
                                <option value="Logistica">Logística</option>
                            </select>
                            <ChevronDown size={20} style={styles.chevron} />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Nível de Urgência</label>
                        <div style={styles.inputWrapper}>
                            <ShieldAlert
                                size={18}
                                style={{ ...styles.icon, color: getPriorityColor() }}
                            />
                            <select
                                style={{
                                    ...styles.select,
                                    borderColor: `${getPriorityColor()}44`,
                                    color: getPriorityColor()
                                }}
                                value={form.prioridade}
                                onChange={e => setForm({ ...form, prioridade: e.target.value })}
                            >
                                <option value="Baixa" style={{ color: '#10b981' }}>● Baixa</option>
                                <option value="Media" style={{ color: '#f59e0b' }}>● Média</option>
                                <option value="Alta" style={{ color: '#ef4444' }}>● Alta</option>
                            </select>
                            <ChevronDown size={20} style={{ ...styles.chevron, color: getPriorityColor() }} />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Descrição Detalhada</label>
                        <div style={styles.inputWrapper}>
                            <AlignLeft size={18} style={{ ...styles.icon, top: '22px' }} />
                            <textarea
                                style={styles.textarea}
                                placeholder="Descreva os detalhes do incidente..."
                                onChange={e => setForm({ ...form, descricao: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            backgroundColor: loading ? '#1e293b' : '#3b82f6',
                            boxShadow: loading ? 'none' : `0 4px 12px rgba(59, 130, 246, 0.3)`
                        }}
                        disabled={loading}
                    >
                        {loading ? <Loader2 size={22} className="spin" /> : "Criar Chamado"}
                    </button>
                </form>
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#050505', padding: '40px' },
    card: { width: '100%', maxWidth: '650px', backgroundColor: '#0f0f0f', padding: '45px', borderRadius: '24px', border: '1px solid #1f1f1f', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    header: { width: '100%', marginBottom: '35px' },
    backBtn: { background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '15px', fontSize: '15px', fontWeight: '600', padding: 0 },
    title: { fontSize: '28px', color: '#fff', fontWeight: '800', margin: 0 },
    subtitle: { fontSize: '16px', color: '#64748b', marginTop: '8px' },
    form: { width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '25px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
    label: { fontSize: '12px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },
    inputWrapper: { position: 'relative', width: '100%' },
    icon: { position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563', zIndex: 1 },
    input: { width: '100%', padding: '15px 15px 15px 50px', borderRadius: '12px', backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
    select: { width: '100%', padding: '15px 15px 15px 50px', borderRadius: '12px', backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', appearance: 'none', fontSize: '15px', outline: 'none', cursor: 'pointer', fontWeight: '700', boxSizing: 'border-box', color: '#fff' },
    chevron: { position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#4b5563' },
    textarea: { width: '100%', padding: '15px 15px 15px 50px', borderRadius: '12px', backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', color: '#fff', fontSize: '15px', height: '120px', resize: 'none', outline: 'none', boxSizing: 'border-box' },
    button: { width: '100%', padding: '16px', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '17px', fontWeight: '800', cursor: 'pointer', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s' }
};

export default NovoChamado;