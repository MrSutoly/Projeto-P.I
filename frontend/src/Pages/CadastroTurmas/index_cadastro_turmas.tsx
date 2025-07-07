import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import './cadastro_turmas_style.css';

interface Turma {
  id: number;
  nome: string;
  codigo: string;
  professor_id?: number;
  pontos?: number;
  created_at: string;
}

const CadastroTurmas: React.FC = () => {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    codigo: ''
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

      // Buscar todas as turmas
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
      
      const url = editingTurma 
        ? `http://localhost:3333/api/management/classes/${editingTurma.id}`
        : 'http://localhost:3333/api/management/classes';
      
      const method = editingTurma ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: formData.nome,
          codigo: formData.codigo
        })
      });

      if (response.ok) {
        setShowModal(false);
        setEditingTurma(null);
        setFormData({ nome: '', codigo: '' });
        loadData();
        alert(editingTurma ? 'Turma atualizada com sucesso!' : 'Turma cadastrada com sucesso!');
      } else {
        const errorData = await response.json();
        alert(`Erro ao salvar turma: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao salvar turma:', error);
      alert('Erro ao salvar turma');
    }
  };

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma);
    setFormData({
      nome: turma.nome,
      codigo: turma.codigo
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta turma?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3333/api/management/classes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          loadData();
          alert('Turma excluída com sucesso!');
        } else {
          const errorData = await response.json();
          alert(`Erro ao excluir turma: ${errorData.message || 'Erro desconhecido'}`);
        }
      } catch (error) {
        console.error('Erro ao excluir turma:', error);
        alert('Erro ao excluir turma');
      }
    }
  };

  const openModal = () => {
    setEditingTurma(null);
    setFormData({ nome: '', codigo: '' });
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="cadastro-turmas-container">
      <div className="login-top-bar">
        <div className="login-top-content">
          <h1>Doutores Ambientais Mirins</h1>
        </div>
      </div>

      <Navbar />
      
      <div className="conteudo">
        <div className="conteudo-header">
          <h2 className="conteudo-titulo">Gerenciar Turmas</h2>
          <button className="btn-adicionar" onClick={openModal}>
            + Adicionar Turma
          </button>
        </div>

        <div className="turmas-list">
          {turmas.length === 0 ? (
            <p className="no-data">Nenhuma turma cadastrada ainda.</p>
          ) : (
            <table className="turmas-table">
              <thead>
                <tr>
                  <th>Nome da Turma</th>
                  <th>Código</th>
                  <th>Data de Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {turmas.map(turma => (
                  <tr key={turma.id}>
                    <td>{turma.nome}</td>
                    <td>{turma.codigo}</td>
                    <td>{new Date(turma.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(turma)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(turma.id)}
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
              <h3>{editingTurma ? 'Editar Turma' : 'Nova Turma'}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="nome">Nome da Turma:</label>
                <input
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: 4° Ano - A"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="codigo">Código da Turma:</label>
                <input
                  type="text"
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                  placeholder="Ex: 4A2024"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit">
                  {editingTurma ? 'Atualizar' : 'Cadastrar'}
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

export default CadastroTurmas;