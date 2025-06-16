import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import './Conteudo_Percurso.css';

interface Atividade {
  id: number;
  titulo: string;
  descricao: string;
  tipo: 'quiz' | 'texto' | 'imagem';
  ordem: number;
  data: string;
  horario: string;
  status: 'bloqueada' | 'disponivel' | 'concluida';
  pontos: number;
}

// interface Pergunta {
//   id: number;
//   atividade_id: number;
//   texto: string;
//   tipo: 'multipla_escolha' | 'verdadeiro_falso' | 'dissertativa';
//   ordem: number;
//   opcoes: Opcao[];
// }

// interface Opcao {
//   id: number;
//   pergunta_id: number;
//   texto: string;
//   correta: boolean;
//   ordem: number;
// }

interface CreateAtividadeRequest {
  titulo: string;
  descricao: string;
  tipo: 'quiz' | 'texto' | 'imagem';
  ordem: number;
  data: string;
  horario: string;
  pontos: number;
  perguntas: CreatePerguntaRequest[];
}

interface CreatePerguntaRequest {
  texto: string;
  tipo: 'multipla_escolha' | 'verdadeiro_falso' | 'dissertativa';
  ordem: number;
  opcoes: CreateOpcaoRequest[];
}

interface CreateOpcaoRequest {
  texto: string;
  correta: boolean;
  ordem: number;
}

const Conteudo_Percurso: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateAtividadeRequest>({
    titulo: '',
    descricao: '',
    tipo: 'quiz',
    ordem: 1,
    data: '',
    horario: '',
    pontos: 10,
    perguntas: [
      {
        texto: '',
        tipo: 'multipla_escolha',
        ordem: 1,
        opcoes: [
          { texto: '', correta: false, ordem: 1 },
          { texto: '', correta: false, ordem: 2 },
          { texto: '', correta: false, ordem: 3 },
          { texto: '', correta: false, ordem: 4 }
        ]
      }
    ]
  });

  const isTeacherOrAdmin = user?.role === 'professor' || user?.role === 'admin';

  useEffect(() => {
    fetchAtividades();
  }, []);

  const fetchAtividades = async () => {
    setLoading(true);
    try {
      const response = await api.get('/management/atividades');
      setAtividades(response.data);
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/management/atividades', formData);
      setShowForm(false);
      // Reset form
      setFormData({
        titulo: '',
        descricao: '',
        tipo: 'quiz',
        ordem: atividades.length + 1,
        data: '',
        horario: '',
        pontos: 10,
        perguntas: [
          {
            texto: '',
            tipo: 'multipla_escolha',
            ordem: 1,
            opcoes: [
              { texto: '', correta: false, ordem: 1 },
              { texto: '', correta: false, ordem: 2 },
              { texto: '', correta: false, ordem: 3 },
              { texto: '', correta: false, ordem: 4 }
            ]
          }
        ]
      });
      fetchAtividades();
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpcaoChange = (perguntaIndex: number, opcaoIndex: number, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      perguntas: prev.perguntas.map((pergunta, pIndex) =>
        pIndex === perguntaIndex
          ? {
              ...pergunta,
              opcoes: pergunta.opcoes.map((opcao, oIndex) =>
                oIndex === opcaoIndex
                  ? { ...opcao, [field]: value }
                  : opcao
              )
            }
          : pergunta
      )
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida':
        return '⭐';
      case 'disponivel':
        return '🎮';
      case 'bloqueada':
        return '🔒';
      default:
        return '🎯';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'atividade-concluida';
      case 'disponivel':
        return 'atividade-disponivel';
      case 'bloqueada':
        return 'atividade-bloqueada';
      default:
        return '';
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="sec-percurso">
      {/* Barra superior azul padrão */}
      <div className="login-top-bar">
        <div className="login-title">Percurso</div>
        <img src="/logo.png" alt="Logo Doutores Ambientais" className="login-logo-top" />
      </div>

      <div className="conteudo">
        {!showForm ? (
          <>
            {/* Header com botão adicionar */}
            <div className="conteudo-header">
              <div className="conteudo-titulo">Siga o percurso e complete as atividades aqui em baixo!</div>
              {isTeacherOrAdmin && (
                <button 
                  className="btn-adicionar"
                  onClick={() => setShowForm(true)}
                >
                  <span className="btn-icon">+</span>
                  Adicionar Atividade
                </button>
              )}
            </div>

            {/* Percurso visual */}
            <div className="percurso-content">
              <div className="percurso-titulo">Início</div>
              <div className="motivational-message">
                🌍 Complete as atividades e torne-se um verdadeiro Doutor Ambiental! 🌟
              </div>
              
              {/* Contador de progresso */}
              <div className="progress-container">
                <div className="progress-text">
                  Progresso: {atividades.filter(a => a.status === 'concluida').length} de {atividades.length} atividades
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{
                      width: `${(atividades.filter(a => a.status === 'concluida').length / atividades.length) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="progress-points">
                  🏆 Total de pontos: {atividades.filter(a => a.status === 'concluida').reduce((total, a) => total + a.pontos, 0)}
                </div>
              </div>
              <div className="percurso-trilha">
                {atividades.map((atividade, index) => (
                  <div key={atividade.id} className="atividade-container"
                    data-tooltip={
                      atividade.status === 'concluida' ? `✅ ${atividade.titulo} - Concluída! (+${atividade.pontos} pontos)` : 
                      atividade.status === 'disponivel' ? `🎯 ${atividade.titulo} - Clique para começar!` : 
                      `🔒 ${atividade.titulo} - Complete a atividade anterior`
                    }
                  >
                    <div 
                      className={`atividade-circulo ${getStatusClass(atividade.status)}`}
                      onClick={() => atividade.status === 'disponivel' && alert(`Iniciando atividade: ${atividade.titulo}`)}
                    >
                      <span className="atividade-icon">{getStatusIcon(atividade.status)}</span>
                    </div>
                    {index < atividades.length - 1 && (
                      <div className="atividade-linha"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Header do formulário */}
            <div className="conteudo-header">
              <div className="conteudo-titulo">#Adicionar Atividades</div>
            </div>

            {/* Formulário de criação */}
            <div className="form-container">
              <form onSubmit={handleSubmit} className="atividade-form">
                {/* Informações básicas da atividade */}
                <div className="form-section">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Questão:</label>
                      <textarea
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleInputChange}
                        placeholder="Digite a questão principal..."
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Data:</label>
                      <input
                        type="date"
                        name="data"
                        value={formData.data}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Horário:</label>
                      <input
                        type="text"
                        name="horario"
                        value={formData.horario}
                        onChange={handleInputChange}
                        placeholder="Ex: 09h - 12h"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Opções das perguntas */}
                <div className="form-section">
                  <h3>Opções</h3>
                  {formData.perguntas[0]?.opcoes.map((opcao, opcaoIndex) => (
                    <div key={opcaoIndex} className="opcao-container">
                      <div className="opcao-input-container">
                        <input
                          type="text"
                          value={opcao.texto}
                          onChange={(e) => handleOpcaoChange(0, opcaoIndex, 'texto', e.target.value)}
                          placeholder={`Opção ${opcaoIndex + 1}`}
                          required
                        />
                        <label className="opcao-checkbox">
                          <input
                            type="checkbox"
                            checked={opcao.correta}
                            onChange={(e) => handleOpcaoChange(0, opcaoIndex, 'correta', e.target.checked)}
                          />
                          Correta
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Indicador de perguntas */}
                <div className="perguntas-indicator">
                  <span>Perguntas:</span>
                  <div className="perguntas-dots">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="pergunta-dot active"></div>
                    ))}
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="form-buttons">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-voltar">
                    Voltar
                  </button>
                  <button type="button" className="btn-adicionar-pergunta">
                    Adicionar
                  </button>
                  <button type="submit" className="btn-salvar">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Conteudo_Percurso; 