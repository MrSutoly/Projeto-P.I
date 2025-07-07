import React, { useState } from 'react';
import './setup_styles.css';
import Logo from '../../Imagens/LogoDoutoresAmbientais.png';
import api from '../../services/api';

const InitialSetup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [adminCredentials, setAdminCredentials] = useState<any>(null);

  const createInitialAdmin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/admin/create-initial-admin');
      setAdminCredentials(response.data.credentials);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar administrador inicial');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <div className="setup-header">
          <img src={Logo} alt="Logo Doutores Ambientais" className="setup-logo" />
          <h1>Configuração Inicial</h1>
          <p>Sistema Doutores Ambientais Mirins</p>
        </div>

        {!success ? (
          <div className="setup-content">
            <div className="setup-info">
              <h2>🚀 Bem-vindo ao Sistema!</h2>
              <p>
                Para começar a usar o sistema, precisamos criar a primeira conta de administrador.
                Esta conta terá acesso completo para gerenciar professores, alunos e todas as 
                funcionalidades do sistema.
              </p>
              
              <div className="setup-features">
                <div className="feature-item">
                  <span className="feature-icon">👤</span>
                  <div>
                    <strong>Gerenciar Usuários</strong>
                    <p>Criar e gerenciar contas de professores e alunos</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <span className="feature-icon">🏫</span>
                  <div>
                    <strong>Administrar Turmas</strong>
                    <p>Organizar alunos em turmas e atribuir professores</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <div>
                    <strong>Relatórios e Estatísticas</strong>
                    <p>Acompanhar o progresso dos alunos e atividades</p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <strong>❌ Erro:</strong> {error}
              </div>
            )}

            <div className="setup-actions">
              <button 
                onClick={createInitialAdmin} 
                disabled={loading}
                className="btn-create-admin"
              >
                {loading ? '⏳ Criando...' : '🔧 Criar Administrador Inicial'}
              </button>
            </div>

            <div className="setup-note">
              <p><strong>Nota:</strong> Esta ação só pode ser executada uma vez. Se já existe um administrador no sistema, esta opção não funcionará.</p>
            </div>
          </div>
        ) : (
          <div className="setup-success">
            <div className="success-icon">✅</div>
            <h2>Administrador Criado com Sucesso!</h2>
            
            <div className="credentials-card">
              <h3>🔑 Credenciais de Acesso</h3>
              <div className="credential-item">
                <strong>Email:</strong>
                <code>{adminCredentials.email}</code>
              </div>
              <div className="credential-item">
                <strong>Senha:</strong>
                <code>{adminCredentials.password}</code>
              </div>
            </div>

            <div className="security-warning">
              <h4>⚠️ Importante - Segurança</h4>
              <ul>
                <li>Anote estas credenciais em um local seguro</li>
                <li>Faça login e altere a senha imediatamente</li>
                <li>Não compartilhe estas informações com terceiros</li>
                <li>Esta é a única vez que a senha será exibida</li>
              </ul>
            </div>

            <button onClick={goToLogin} className="btn-go-login">
              🚪 Ir para o Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InitialSetup; 