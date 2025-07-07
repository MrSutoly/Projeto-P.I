import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import './admin_styles.css';
import Logo from '../../Imagens/LogoDoutoresAmbientais.png';
import api from '../../services/api';

interface UserStats {
  total: number;
  admins: number;
  professors: number;
  students: number;
}

interface User {
  id: number;
  nome: string;
  email: string;
  role: 'admin' | 'professor' | 'aluno';
  created_at?: string;
  turma_id?: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<UserStats>({ total: 0, admins: 0, professors: 0, students: 0 });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'professors' | 'students' | 'admins'>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'professor' | 'student' | 'admin'>('professor');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    turma_id: ''
  });

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (err: any) {
      setError('Erro ao carregar estatísticas');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err: any) {
      setError('Erro ao carregar usuários');
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = modalType === 'professor' ? '/admin/professors' : 
                     modalType === 'student' ? '/admin/students' : '/admin/admins';
      
      const userData = modalType === 'student' && formData.turma_id 
        ? { ...formData, turma_id: Number(formData.turma_id) }
        : { nome: formData.nome, email: formData.email, password: formData.password };

      await api.post(endpoint, userData);
      
      setShowModal(false);
      setFormData({ nome: '', email: '', password: '', turma_id: '' });
      fetchStats();
      fetchUsers();
      alert(`${modalType === 'professor' ? 'Professor' : modalType === 'student' ? 'Aluno' : 'Administrador'} criado com sucesso!`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao criar usuário');
    }
  };

  const handleDeleteUser = async (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o usuário "${nome}"?`)) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchStats();
        fetchUsers();
        alert('Usuário deletado com sucesso!');
      } catch (err: any) {
        alert(err.response?.data?.message || 'Erro ao deletar usuário');
      }
    }
  };

  const openModal = (type: 'professor' | 'student' | 'admin') => {
    setModalType(type);
    setShowModal(true);
  };

  const filteredUsers = users.filter(user => {
    if (activeTab === 'professors') return user.role === 'professor';
    if (activeTab === 'students') return user.role === 'aluno';
    if (activeTab === 'admins') return user.role === 'admin';
    return true;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="login-top-bar">
          <div className="login-title">Painel de Administração</div>
          <img src={Logo} alt="Logo Doutores Ambientais" className="login-logo-top" />
        </div>

        <div className="admin-content">
          <div className="admin-header">
            <h1>Dashboard Administrativo</h1>
            <p>Gerencie usuários, professores e alunos do sistema</p>
          </div>

          {/* Navegação por abas */}
          <div className="admin-tabs">
            <button 
              className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`tab ${activeTab === 'professors' ? 'active' : ''}`}
              onClick={() => setActiveTab('professors')}
            >
              👨‍🏫 Professores
            </button>
            <button 
              className={`tab ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              👨‍🎓 Alunos
            </button>
            <button 
              className={`tab ${activeTab === 'admins' ? 'active' : ''}`}
              onClick={() => setActiveTab('admins')}
            >
              👤 Administradores
            </button>
          </div>

          {/* Conteúdo baseado na aba ativa */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              <div className="stats-grid">
                <div className="stat-card total">
                  <div className="stat-number">{stats.total}</div>
                  <div className="stat-label">Total de Usuários</div>
                </div>
                <div className="stat-card admins">
                  <div className="stat-number">{stats.admins}</div>
                  <div className="stat-label">Administradores</div>
                </div>
                <div className="stat-card professors">
                  <div className="stat-number">{stats.professors}</div>
                  <div className="stat-label">Professores</div>
                </div>
                <div className="stat-card students">
                  <div className="stat-number">{stats.students}</div>
                  <div className="stat-label">Alunos</div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="users-management">
              <div className="users-header">
                <h3>
                  {activeTab === 'professors' ? 'Gerenciar Professores' :
                   activeTab === 'students' ? 'Gerenciar Alunos' : 'Gerenciar Administradores'}
                </h3>
                <button 
                  className="btn-create-user"
                  onClick={() => openModal(activeTab as 'professor' | 'student' | 'admin')}
                >
                  + Criar {activeTab === 'professors' ? 'Professor' : 
                          activeTab === 'students' ? 'Aluno' : 'Administrador'}
                </button>
              </div>

              <div className="users-table-container">
                {filteredUsers.length === 0 ? (
                  <div className="no-users">
                    <p>Nenhum usuário encontrado nesta categoria.</p>
                  </div>
                ) : (
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Papel</th>
                        <th>Data de Criação</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.nome}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role === 'admin' ? 'Administrador' :
                               user.role === 'professor' ? 'Professor' : 'Aluno'}
                            </span>
                          </td>
                          <td>
                            {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                          </td>
                          <td>
                            <button 
                              className="btn-delete"
                              onClick={() => handleDeleteUser(user.id, user.nome)}
                            >
                              🗑️ Deletar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Modal para criar usuário */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Criar {modalType === 'professor' ? 'Professor' : 
                          modalType === 'student' ? 'Aluno' : 'Administrador'}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="form-group">
                  <label>Nome:</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Senha:</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                {modalType === 'student' && (
                  <div className="form-group">
                    <label>ID da Turma (opcional):</label>
                    <input
                      type="number"
                      value={formData.turma_id}
                      onChange={(e) => setFormData({...formData, turma_id: e.target.value})}
                    />
                  </div>
                )}
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit">Criar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard; 