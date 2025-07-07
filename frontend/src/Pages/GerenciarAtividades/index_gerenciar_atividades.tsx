import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import './gerenciar_atividades_style.css';

interface Atividade {
  id?: number;
  titulo: string;
  descricao: string;
  tipo: 'quiz' | 'texto' | 'imagem';
  ordem: number;
  data: string;
  horario: string;
  status: 'bloqueada' | 'disponivel' | 'concluida';
  pontos: number;
  created_at?: string;
}

const GerenciarAtividades: React.FC = () => {
  const navigate = useNavigate();
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAtividade, setEditingAtividade] = useState<Atividade | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: 'quiz' as 'quiz' | 'texto' | 'imagem',
    ordem: 1,
    data: '',
    horario: '',
    pontos: 0
  });

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

      const response = await fetch('http://localhost:3333/api/management/atividades', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAtividades(data);
      } else {
        console.error('Erro ao carregar atividades:', response.status);
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
      const url = editingAtividade 
        ? `http://localhost:3333/api/management/atividades/${editingAtividade.id}`
        : 'http://localhost:3333/api/management/atividades';
      
      const method = editingAtividade ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingAtividade(null);
        setFormData({
          titulo: '',
          descricao: '',
          tipo: 'quiz',
          ordem: 1,
          data: '',
          horario: '',
          pontos: 0
        });
        loadData();
        alert(editingAtividade ? 'Atividade atualizada com sucesso!' : 'Atividade criada com sucesso!');
      } else {
        const errorData = await response.json();
        alert(`Erro ao salvar atividade: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao salvar atividade:', error);
      alert('Erro ao salvar atividade');
    }
  };

  const handleEdit = (atividade: Atividade) => {
    setEditingAtividade(atividade);
    setFormData({
      titulo: atividade.titulo,
      descricao: atividade.descricao,
      tipo: atividade.tipo,
      ordem: atividade.ordem,
      data: atividade.data,
      horario: atividade.horario,
      pontos: atividade.pontos
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta atividade?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3333/api/management/atividades/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          loadData();
          alert('Atividade excluída com sucesso!');
        } else {
          const errorData = await response.json();
          alert(`Erro ao excluir atividade: ${errorData.message || 'Erro desconhecido'}`);
        }
      } catch (error) {
        console.error('Erro ao excluir atividade:', error);
        alert('Erro ao excluir atividade');
      }
    }
  };

  const handleChangeStatus = async (id: number, novoStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3333/api/management/atividades/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: novoStatus })
      });

      if (response.ok) {
        loadData();
        alert('Status da atividade atualizado com sucesso!');
      } else {
        const errorData = await response.json();
        alert(`Erro ao atualizar status: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const liberarProximaAtividade = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3333/api/management/atividades/liberar-proxima', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        loadData();
        alert('Próxima atividade liberada com sucesso!');
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao liberar próxima atividade:', error);
      alert('Erro ao liberar próxima atividade');
    }
  };

  const openModal = () => {
    setEditingAtividade(null);
    setFormData({
      titulo: '',
      descricao: '',
      tipo: 'quiz',
      ordem: atividades.length + 1,
      data: '',
      horario: '',
      pontos: 0
    });
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'bloqueada': { label: 'Bloqueada', class: 'status-bloqueada' },
      'disponivel': { label: 'Disponível', class: 'status-disponivel' },
      'concluida': { label: 'Concluída', class: 'status-concluida' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="gerenciar-atividades-container">
      <div className="login-top-bar">
        <div className="login-top-content">
          <h1>Doutores Ambientais Mirins</h1>
        </div>
      </div>

      <Navbar />
      
      <div className="conteudo">
        <div className="conteudo-header">
          <h2 className="conteudo-titulo">Gerenciar Atividades</h2>
          <div className="header-actions">
            <button className="btn-liberar" onClick={liberarProximaAtividade}>
              🔓 Liberar Próxima
            </button>
            <button className="btn-adicionar" onClick={openModal}>
              + Adicionar Atividade
            </button>
          </div>
        </div>

        <div className="atividades-list">
          {atividades.length === 0 ? (
            <p className="no-data">Nenhuma atividade cadastrada ainda.</p>
          ) : (
            <table className="atividades-table">
              <thead>
                <tr>
                  <th>Ordem</th>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Pontos</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {atividades.sort((a, b) => a.ordem - b.ordem).map(atividade => (
                  <tr key={atividade.id}>
                    <td>{atividade.ordem}</td>
                    <td>{atividade.titulo}</td>
                    <td>{atividade.tipo}</td>
                    <td>{new Date(atividade.data).toLocaleDateString('pt-BR')}</td>
                    <td>{atividade.horario}</td>
                    <td>{atividade.pontos} pts</td>
                    <td>{getStatusBadge(atividade.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(atividade)}
                        >
                          ✏️
                        </button>
                        <select 
                          className="status-select"
                          value={atividade.status}
                          onChange={(e) => handleChangeStatus(atividade.id!, e.target.value)}
                        >
                          <option value="bloqueada">Bloqueada</option>
                          <option value="disponivel">Disponível</option>
                          <option value="concluida">Concluída</option>
                        </select>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete(atividade.id!)}
                        >
                          🗑️
                        </button>
                      </div>
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
              <h3>{editingAtividade ? 'Editar Atividade' : 'Nova Atividade'}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="titulo">Título:</label>
                  <input
                    type="text"
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tipo">Tipo:</label>
                  <select
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value as 'quiz' | 'texto' | 'imagem'})}
                  >
                    <option value="quiz">Quiz</option>
                    <option value="texto">Texto</option>
                    <option value="imagem">Imagem</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição:</label>
                <textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  required
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ordem">Ordem:</label>
                  <input
                    type="number"
                    id="ordem"
                    value={formData.ordem}
                    onChange={(e) => setFormData({...formData, ordem: parseInt(e.target.value)})}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pontos">Pontos:</label>
                  <input
                    type="number"
                    id="pontos"
                    value={formData.pontos}
                    onChange={(e) => setFormData({...formData, pontos: parseInt(e.target.value)})}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="data">Data:</label>
                  <input
                    type="date"
                    id="data"
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="horario">Horário:</label>
                  <input
                    type="time"
                    id="horario"
                    value={formData.horario}
                    onChange={(e) => setFormData({...formData, horario: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit">
                  {editingAtividade ? 'Atualizar' : 'Criar'}
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

export default GerenciarAtividades; 