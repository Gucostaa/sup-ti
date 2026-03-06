import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, ArrowLeft, Loader2, Tag, ShieldAlert, AlignLeft, ChevronDown } from 'lucide-react';

function EditarChamado() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ titulo: '', descricao: '', prioridade: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadTicket = async () => {
            try {
                const res = await axios.get(`http://localhost:5226/api/Chamados/${id}`);
                setForm({
                    titulo: res.data.titulo || res.data.Titulo || '',
                    descricao: res.data.descricao || res.data.Descricao || '',
                    prioridade: res.data.prioridade || res.data.Prioridade || 'Media'
                });
            } catch (err) {
                alert("Erro ao carregar dados.");
            } finally {
                setLoading(false);
            }
        };
        loadTicket();
    }, [id]);

    const getPriorityColor = () => {
        switch (form.prioridade) {
            case 'Alta': return '#ef4444'; 
            case 'Media': return '#f59e0b'; 
            case 'Baixa': return '#10b981'; 
            default: return '#4b5563';
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`http://localhost:5226/api/Chamados/${id}`, {
                ...form,
                id: parseInt(id), 
                usuario_id: 1,    
                status: "Aberto"  
            });
            alert("Ticket atualizado com sucesso!");
            navigate('/chamados');
        } catch (err) {
            alert("Erro ao atualizar chamado.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <Loader2 className="spin" color="#3b82f6" size={48} />
                <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <header style={styles.header}>
                    <button onClick={() => navigate('/chamados')} style={styles.backBtn}>
                        <ArrowLeft size={18} /> Voltar para a Lista
                    </button>
                    <h2 style={styles.title}>Editar Chamado #{id}</h2>
                    <p style={styles.subtitle}>Modifique as informações necessárias do ticket.</p>
                </header>
                
                <form onSubmit={handleSave} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Título do Incidente</label>
                        <div style={styles.inputWrapper}>
                            <Tag size={18} style={styles.icon} />
                            <input 
                                style={styles.input} 
                                value={form.titulo} 
                                onChange={e => setForm({...form, titulo: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Urgência Atual</label>
                        <div style={styles.inputWrapper}>
                            <ShieldAlert size={18} style={{...styles.icon, color: getPriorityColor()}} />
                            <select 
                                style={{
                                    ...styles.select, 
                                    borderColor: `${getPriorityColor()}44`,
                                    color: getPriorityColor() 
                                }}
                                value={form.prioridade}
                                onChange={e => setForm({...form, prioridade: e.target.value})}
                            >
                                <option value="Baixa">● Baixa Prioridade</option>
                                <option value="Media">● Média Prioridade</option>
                                <option value="Alta">● Alta Prioridade</option>
                            </select>
                            <ChevronDown size={20} style={{...styles.chevron, color: getPriorityColor()}} />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Descrição do Problema</label>
                        <div style={styles.inputWrapper}>
                            <AlignLeft size={18} style={{...styles.icon, top: '22px'}} />
                            <textarea 
                                style={styles.textarea}
                                value={form.descricao}
                                onChange={e => setForm({...form, descricao: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        style={{
                            ...styles.button, 
                            backgroundColor: saving ? '#1e293b' : '#f59e0b', 
                            boxShadow: saving ? 'none' : `0 4px 12px rgba(245, 158, 11, 0.3)`
                        }}
                        disabled={saving}
                    >
                        {saving ? <Loader2 size={22} className="spin" /> : (
                            <>
                                <Save size={20} style={{marginRight: '8px'}} /> 
                                Salvar Alterações
                            </>
                        )}
                    </button>
                </form>
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const styles = {
    container: { 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#050505', 
        padding: '40px',
        marginLeft: '260px' 
    },
    card: { 
        width: '100%', 
        maxWidth: '650px', 
        backgroundColor: '#0f0f0f', 
        padding: '45px', 
        borderRadius: '24px', 
        border: '1px solid #1f1f1f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    header: { width: '100%', marginBottom: '35px' },
    backBtn: { background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '15px', fontSize: '15px', fontWeight: '600', padding: 0 },
    title: { fontSize: '28px', color: '#fff', fontWeight: '800', margin: 0 },
    subtitle: { fontSize: '16px', color: '#64748b', marginTop: '8px' },
    form: { width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '25px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
    label: { fontSize: '12px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },
    inputWrapper: { position: 'relative', width: '100%' },
    icon: { position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563' },
    input: { width: '100%', padding: '15px 15px 15px 50px', borderRadius: '12px', backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
    select: { width: '100%', padding: '15px 15px 15px 50px', borderRadius: '12px', backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', appearance: 'none', fontSize: '15px', outline: 'none', cursor: 'pointer', fontWeight: '700', boxSizing: 'border-box' },
    chevron: { position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
    textarea: { width: '100%', padding: '15px 15px 15px 50px', borderRadius: '12px', backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', color: '#fff', fontSize: '15px', height: '140px', resize: 'none', outline: 'none', boxSizing: 'border-box' },
    button: { width: '100%', padding: '16px', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '17px', fontWeight: '800', cursor: 'pointer', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s' }
};

export default EditarChamado;