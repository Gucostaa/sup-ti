import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5226/api/Auth/login', { email, senha });
            localStorage.setItem('usuario', JSON.stringify(response.data));
            navigate('/dashboard');
        } catch (error) {
            alert("Usuário ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginCard}>
                <div style={styles.header}>
                    <div style={styles.logoBox}>
                        <ShieldCheck size={32} color="#3b82f6" />
                    </div>
                    <h1 style={styles.title}>Suporte TI</h1>
                    <p style={styles.subtitle}>Entre com suas credenciais para acessar o painel</p>
                </div>

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>E-mail Institucional</label>
                        <div style={styles.inputWrapper}>
                            <Mail size={18} style={styles.icon} />
                            <input 
                                type="email" 
                                placeholder="exemplo@empresa.com" 
                                style={styles.input} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Senha de Acesso</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.icon} />
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                style={styles.input} 
                                onChange={(e) => setSenha(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? <Loader2 size={20} className="spin" /> : "Acessar Sistema"}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>Esqueceu a senha? <span style={styles.link}>Contate o administrador</span></p>
                </div>
            </div>

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                input:focus { border-color: #3b82f6 !important; outline: none; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
            `}</style>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#050505',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #111 0%, #050505 100%)',
    },
    loginCard: {
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: '#0f0f0f',
        borderRadius: '24px',
        border: '1px solid #222',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    logoBox: {
        width: '60px',
        height: '60px',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 16px',
        border: '1px solid rgba(59, 130, 246, 0.2)',
    },
    title: {
        fontSize: '24px',
        color: '#fff',
        fontWeight: '800',
        margin: 0,
        letterSpacing: '-0.5px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#64748b',
        marginTop: '8px',
        lineHeight: '1.5',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '12px',
        color: '#4b5563',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        left: '14px',
        color: '#4b5563',
    },
    input: {
        width: '100%',
        padding: '14px 14px 14px 45px',
        borderRadius: '12px',
        backgroundColor: '#161616',
        border: '1px solid #262626',
        color: '#fff',
        fontSize: '15px',
        transition: 'all 0.2s ease',
    },
    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#3b82f6',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'transform 0.1s active',
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        marginTop: '30px',
        textAlign: 'center',
    },
    footerText: {
        fontSize: '13px',
        color: '#4b5563',
    },
    link: {
        color: '#3b82f6',
        cursor: 'pointer',
        fontWeight: '600',
    }
};

export default Login;