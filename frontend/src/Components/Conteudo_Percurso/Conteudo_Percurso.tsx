import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import './Conteudo_Percurso.css';
import Logo from '../../Imagens/LogoDoutoresAmbientais.png';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

// Importar componente de Quiz
import Quiz from '../../Pages/Quiz/index_quiz';

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
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAtividade, setSelectedAtividade] = useState<Atividade | null>(null);
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

  const fetchAtividades = async () => {
    try {
      const response = await api.get('/management/atividades');
      const atividadesData = response.data;
      
      // Ordenar atividades por ordem
      const atividadesOrdenadas = atividadesData.sort((a: Atividade, b: Atividade) => a.ordem - b.ordem);
      
      setAtividades(atividadesOrdenadas);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
      setAtividades([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAtividades();
  }, []);

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

  const handleAtividadeClick = async (atividade: Atividade) => {
    if (atividade.status === 'bloqueada') {
      alert('Esta atividade ainda não está disponível!');
      return;
    }

    if (atividade.status === 'concluida') {
      alert('Você já concluiu esta atividade!');
      return;
    }

    // Marcar atividade como concluída
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3333/api/management/atividades/${atividade.id}/concluir`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Atualizar lista local
      setAtividades(prev => prev.map(a => 
        a.id === atividade.id ? {...a, status: 'concluida'} : a
      ));

      alert(`Parabéns! Você concluiu a atividade "${atividade.titulo}" e ganhou ${atividade.pontos} pontos!`);
    } catch (error) {
      console.error('Erro ao concluir atividade:', error);
      alert('Erro ao marcar atividade como concluída');
    }
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    setSelectedAtividade(null);
    // Aqui você pode adicionar lógica para atualizar o status da atividade
    fetchAtividades();
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
    return (
      <div className="percurso-container">
        <div className="loading-message">
          <div className="loading-spinner">🔄</div>
          <p>Carregando atividades...</p>
        </div>
      </div>
    );
  }

  // Se estiver mostrando o quiz, renderizar apenas o componente Quiz
  if (showQuiz && selectedAtividade) {
    return <Quiz onComplete={handleQuizComplete} atividade={selectedAtividade} />;
  }

  return (
    <div className="percurso-container">
      <div className="login-top-bar">
        <div className="login-top-content">
          <h1 className="login-title">Doutores Ambientais Mirins</h1>
          <img 
            className="login-logo-top" 
            src={Logo} 
            alt="Logo" 
          />
        </div>
      </div>

      <Navbar />

      <div className="conteudo">
        <div className="conteudo-header">
          <h2 className="conteudo-titulo">Percurso de Aprendizagem</h2>
        </div>

        {atividades.length === 0 ? (
          <div className="no-atividades-container">
            <div className="no-atividades-icon">🌱</div>
            <h3 className="no-atividades-title">Ainda não há atividades disponíveis</h3>
            <p className="no-atividades-description">
              Seu professor ainda não criou nenhuma atividade.<br/>
              Volte mais tarde para começar sua jornada ambiental! 🌿
            </p>
          </div>
        ) : (
          <>
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
                      width: atividades.length > 0 ? `${(atividades.filter(a => a.status === 'concluida').length / atividades.length) * 100}%` : '0%'
                    }}
                  ></div>
                </div>
                <div className="progress-percentage">
                  {atividades.length > 0 ? Math.round((atividades.filter(a => a.status === 'concluida').length / atividades.length) * 100) : 0}%
                </div>
              </div>

              {/* Lista de atividades */}
              <div className="atividades-lista">
                {atividades.map((atividade, index) => {
                  const isLast = index === atividades.length - 1;
                  
                  return (
                    <div key={atividade.id} className="atividade-item">
                      <div 
                        className={`atividade-circulo ${atividade.status}`}
                        onClick={() => handleAtividadeClick(atividade)}
                      >
                        <div className="atividade-numero">{atividade.ordem}</div>
                        <div className="atividade-icon">
                          {atividade.status === 'concluida' ? '✅' : 
                           atividade.status === 'disponivel' ? '🌱' : '🔒'}
                        </div>
                      </div>
                      
                      <div className="atividade-info">
                        <h3 className="atividade-titulo">{atividade.titulo}</h3>
                        <p className="atividade-descricao">{atividade.descricao}</p>
                        <div className="atividade-detalhes">
                          <span className="atividade-tipo">{atividade.tipo}</span>
                          <span className="atividade-pontos">{atividade.pontos} pontos</span>
                          <span className="atividade-data">
                            {new Date(atividade.data).toLocaleDateString('pt-BR')} às {atividade.horario}
                          </span>
                        </div>
                        <div className={`atividade-status ${atividade.status}`}>
                          {atividade.status === 'bloqueada' ? 'Bloqueada' :
                           atividade.status === 'disponivel' ? 'Disponível' : 'Concluída'}
                        </div>
                      </div>

                      {!isLast && <div className="atividade-linha"></div>}
                    </div>
                  );
                })}
              </div>

              <div className="percurso-titulo final">🎓 Parabéns! Você é um Doutor Ambiental!</div>
            </div>

            {/* Estatísticas */}
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-number">{atividades.filter(a => a.status === 'concluida').length}</div>
                <div className="stat-label">Atividades Concluídas</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{atividades.filter(a => a.status === 'disponivel').length}</div>
                <div className="stat-label">Atividades Disponíveis</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{atividades.reduce((total, a) => total + (a.status === 'concluida' ? a.pontos : 0), 0)}</div>
                <div className="stat-label">Pontos Conquistados</div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Conteudo_Percurso; 