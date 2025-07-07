import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import './cadastro_alunos_style.css';

interface Aluno {
  id: number;
  nome: string;
  email: string;
  role: string;
  turma_id: number;
  turma?: {
    id: number;
    nome: string;
  };
}

interface Turma {
  id: number;
  nome: string;
  codigo: string;
}

const CadastroAlunos: React.FC = () => {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
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

      // Buscar todas as turmas disponíveis
      const turmasResponse = await fetch('http://localhost:3333/api/management/classes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (turmasResponse.ok) {
        const turmasData = await turmasResponse.json();
        console.log('Turmas carregadas:', turmasData);
        setTurmas(turmasData);
      } else {
        console.error('Erro ao carregar turmas:', turmasResponse.status);
      }

      // Buscar todos os alunos
      const alunosResponse = await fetch('http://localhost:3333/api/management/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (alunosResponse.ok) {
        const alunosData = await alunosResponse.json();
        // Filtrar apenas alunos
        const alunosFiltrados = alunosData.filter((usuario: any) => usuario.role === 'aluno');
        setAlunos(alunosFiltrados);
      } else {
        console.error('Erro ao carregar alunos:', alunosResponse.status);
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
      const url = editingAluno 
        ? `http://localhost:3333/api/management/users/${editingAluno.id}`
        : 'http://localhost:3333/api/management/users';
      
      const method = editingAluno ? 'PUT' : 'POST';
      
      const bodyData: any = {
        nome: formData.nome,
        email: formData.email,
        role: 'aluno',
        turma_id: parseInt(formData.turma_id)
      };

      // Só incluir senha se não estiver editando ou se foi fornecida uma nova senha
      if (!editingAluno || formData.senha) {
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
        setEditingAluno(null);
        setFormData({ nome: '', email: '', senha: '', turma_id: '' });
        loadData();
        alert(editingAluno ? 'Aluno atualizado com sucesso!' : 'Aluno cadastrado com sucesso!');
      } else {
        const errorData = await response.json();
        alert(`Erro ao salvar aluno: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      alert('Erro ao salvar aluno');
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingAluno(aluno);
    setFormData({
      nome: aluno.nome,
      email: aluno.email,
      senha: '',
      turma_id: aluno.turma_id.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
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
          alert('Aluno excluído com sucesso!');
        } else {
          const errorData = await response.json();
          alert(`Erro ao excluir aluno: ${errorData.message || 'Erro desconhecido'}`);
        }
      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        alert('Erro ao excluir aluno');
      }
    }
  };

  const openModal = () => {
    setEditingAluno(null);
    setFormData({ nome: '', email: '', senha: '', turma_id: '' });
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="cadastro-alunos">
      <Navbar />
      <div className="container">
        <h1>Cadastro de Alunos</h1>
        
        <div className="actions">
          <button className="btn-primary" onClick={openModal}>
            Novo Aluno
          </button>
        </div>

        <div className="tabela-container">
          <table className="tabela-alunos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Turma</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map(aluno => (
                <tr key={aluno.id}>
                  <td>{aluno.id}</td>
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                  <td>
                    {turmas.find(t => t.id === aluno.turma_id)?.nome || 'N/A'}
                  </td>
                  <td>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(aluno)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(aluno.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingAluno ? 'Editar Aluno' : 'Novo Aluno'}</h2>
              <form onSubmit={handleSubmit}>
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
                  <label>Senha {editingAluno ? '(deixe em branco para não alterar)' : ''}:</label>
                  <input
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({...formData, senha: e.target.value})}
                    required={!editingAluno}
                  />
                </div>

                <div className="form-group">
                  <label>Turma:</label>
                  <select
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

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingAluno ? 'Atualizar' : 'Cadastrar'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CadastroAlunos; 