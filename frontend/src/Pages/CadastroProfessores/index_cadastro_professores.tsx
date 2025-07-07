import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import './cadastro_professores_style.css';

interface Professor {
  id: number;
  nome: string;
  email: string;
  turma_id: number;
  created_at: string;
}

interface Turma {
  id: number;
  nome: string;
}

const CadastroProfessores: React.FC = () => {
  const navigate = useNavigate();
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    turma_id: ''
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Buscar professores
      const professoresResponse = await fetch('http://localhost:3333/api/management/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (professoresResponse.ok) {
        const professoresData = await professoresResponse.json();
        // Filtrar apenas professores
        const professoresFiltrados = professoresData.filter((usuario: any) => usuario.role === 'professor');
        setProfessores(professoresFiltrados);
      }

      // Buscar turmas disponíveis
      const turmasResponse = await fetch('http://localhost:3333/api/management/classes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (turmasResponse.ok) {
        const turmasData = await turmasResponse.json();
        setTurmas(turmasData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingProfessor 
        ? `http://localhost:3333/api/management/users/${editingProfessor.id}`
        : 'http://localhost:3333/api/management/users';
      
      const method = editingProfessor ? 'PUT' : 'POST';
      
      const bodyData: any = {
        nome: formData.nome,
        email: formData.email,
        role: 'professor'
      };

      // Só incluir senha se não estiver editando ou se foi fornecida uma nova senha
      if (!editingProfessor || formData.senha) {
        bodyData.password = formData.senha;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingProfessor(null);
        setFormData({ nome: '', email: '', senha: '', turma_id: '' });
        loadData();
        alert(editingProfessor ? 'Professor atualizado com sucesso!' : 'Professor cadastrado com sucesso!');
      } else {
        const errorData = await response.json();
        alert(`Erro ao salvar professor: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao salvar professor:', error);
      alert('Erro ao salvar professor');
    }
  };

  const handleEdit = (professor: Professor) => {
    setEditingProfessor(professor);
    setFormData({
      nome: professor.nome,
      email: professor.email,
      senha: '',
      turma_id: professor.turma_id.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3333/api/management/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          loadData();
          alert('Professor excluído com sucesso!');
        } else {
          const errorData = await response.json();
          alert(`Erro ao excluir professor: ${errorData.message || 'Erro desconhecido'}`);
        }
      } catch (error) {
        console.error('Erro ao excluir professor:', error);
        alert('Erro ao excluir professor');
      }
    }
  };

  const openModal = () => {
    setEditingProfessor(null);
    setFormData({ nome: '', email: '', senha: '', turma_id: '' });
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="cadastro-professores-container">
      <div className="login-top-bar">
        <div className="login-top-content">
          <h1>Doutores Ambientais Mirins</h1>
        </div>
      </div>

      <Navbar />
      
      <div className="conteudo">
        <div className="conteudo-header">
          <h2 className="conteudo-titulo">Gerenciar Professores</h2>
          <button className="btn-adicionar" onClick={openModal}>
            + Adicionar Professor
          </button>
        </div>

          <div className="professores-list">
            {professores.length === 0 ? (
              <p className="no-data">Nenhum professor cadastrado ainda.</p>
            ) : (
              <table className="professores-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Turma Responsável</th>
                    <th>Data de Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {professores.map(professor => (
                    <tr key={professor.id}>
                      <td>{professor.nome}</td>
                      <td>{professor.email}</td>
                      <td>{turmas.find(t => t.id === professor.turma_id)?.nome || 'N/A'}</td>
                      <td>{new Date(professor.created_at).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(professor)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete(professor.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProfessor ? 'Editar Professor' : 'Novo Professor'}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="nome">Nome:</label>
                <input
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  required={!editingProfessor}
                  placeholder={editingProfessor ? 'Deixe em branco para manter a senha atual' : ''}
                />
              </div>

              <div className="form-group">
                <label htmlFor="turma_id">Turma Responsável:</label>
                <select
                  id="turma_id"
                  value={formData.turma_id}
                  onChange={(e) => setFormData({...formData, turma_id: e.target.value})}
                  required
                >
                  <option value="">Selecione uma turma</option>
                  {turmas.map(turma => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit">
                  {editingProfessor ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CadastroProfessores; 