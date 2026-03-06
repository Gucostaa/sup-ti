import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, Mail, Lock, User, ShieldCheck, 
  ArrowLeft, Loader2, ChevronDown, Eye, EyeOff, CheckCircle2 
} from 'lucide-react';

function Cadastro() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', tipo: 'usuario' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const isPasswordStrong = form.senha.length >= 6;

  const handleCadastro = async (e) => {
    e.preventDefault();
    if (!isPasswordStrong) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5226/api/Auth/register', form);
      alert("✨ Conta criada com sucesso!");
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Erro ao realizar cadastro. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <header style={styles.header}>
          <div style={styles.iconContainer}>
            <UserPlus size={28} color="#3b82f6" />
          </div>
          <h2 style={styles.title}>Criar Conta</h2>
          <p style={styles.subtitle}>Junte-se ao sistema de suporte técnico</p>
        </header>

        <form onSubmit={handleCadastro} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome Completo</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.fieldIcon} />
              <input
                type="text"
                placeholder="Ex: Gustavo Silva"
                style={styles.input}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>E-mail Corporativo</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.fieldIcon} />
              <input
                type="email"
                placeholder="gustavo@empresa.com"
                style={styles.input}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Senha de Acesso</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.fieldIcon} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="No mínimo 6 caracteres"
                style={styles.input}
                onChange={e => setForm({ ...form, senha: e.target.value })}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {form.senha && (
              <div style={{...styles.passStrength, color: isPasswordStrong ? '#10b981' : '#ef4444'}}>
                {isPasswordStrong ? <CheckCircle2 size={12} /> : '○'} 
                {isPasswordStrong ? ' Senha segura' : ' Curta demais'}
              </div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nível de Acesso</label>
            <div style={styles.inputWrapper}>
              <ShieldCheck size={18} style={styles.fieldIcon} />
              <select
                style={styles.select}
                value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value })}
              >
                <option value="usuario">👤 Usuário Comum</option>
                <option value="tecnico">🛠️ Técnico de Suporte</option>
                <option value="gestor">💼 Gestor de TI</option>
              </select>
              <ChevronDown size={18} style={styles.chevron} />
            </div>
          </div>

          <button
            type="submit"
            style={{ 
              ...styles.button, 
              backgroundColor: loading ? '#1e293b' : '#3b82f6',
              cursor: loading ? 'not-allowed' : 'pointer' 
            }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={20} className="spin" />
            ) : "Concluir Cadastro"}
          </button>
        </form>

        <footer style={styles.footer}>
          <button onClick={() => navigate('/')} style={styles.backButton}>
            <ArrowLeft size={16} /> Já tenho uma conta
          </button>
        </footer>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        input:focus, select:focus { border-color: #3b82f6 !important; background: #1a1a1a !important; }
      `}</style>
    </div>
  );
}

const styles = {
  page: { 
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    height: '100vh', backgroundColor: '#050505', color: '#fff' 
  },
  card: { 
    padding: '40px', backgroundColor: '#0f0f0f', borderRadius: '28px', 
    border: '1px solid #1f1f1f', width: '100%', maxWidth: '420px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },
  header: { textAlign: 'center', marginBottom: '32px' },
  iconContainer: { 
    backgroundColor: 'rgba(59, 130, 246, 0.1)', width: '64px', height: '64px', 
    borderRadius: '20px', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(59, 130, 246, 0.2)'
  },
  title: { fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: '#64748b', marginTop: '6px' },
  form: { display: 'flex', flexDirection: 'column', gap: '4px' },
  formGroup: { marginBottom: '18px' },
  label: { fontSize: '11px', color: '#94a3b8', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  fieldIcon: { position: 'absolute', left: '16px', color: '#4b5563', zIndex: 2 },
  input: { 
    width: '100%', padding: '14px 16px 14px 48px', borderRadius: '14px', 
    backgroundColor: '#161616', border: '1px solid #262626', color: '#fff', 
    fontSize: '15px', transition: 'all 0.2s', outline: 'none'
  },
  eyeButton: {
    position: 'absolute', right: '12px', background: 'none', border: 'none', 
    color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center'
  },
  passStrength: { fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' },
  select: { 
    width: '100%', padding: '14px 16px 14px 48px', borderRadius: '14px', 
    backgroundColor: '#161616', border: '1px solid #262626', color: '#fff', 
    fontSize: '15px', appearance: 'none', cursor: 'pointer', outline: 'none'
  },
  chevron: { position: 'absolute', right: '16px', color: '#4b5563', pointerEvents: 'none' },
  button: { 
    width: '100%', padding: '16px', border: 'none', borderRadius: '14px', 
    color: '#fff', fontWeight: '700', fontSize: '16px', marginTop: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    transition: 'transform 0.2s, filter 0.2s'
  },
  footer: { marginTop: '24px', textAlign: 'center', borderTop: '1px solid #1f1f1f', paddingTop: '20px' },
  backButton: { 
    background: 'none', border: 'none', color: '#64748b', fontSize: '14px', 
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%'
  }
};

export default Cadastro;