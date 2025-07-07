import './Conteudo_Percurso.css';
import React, { useState, useEffect } from 'react';
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

const Conteudo_Percurso: React.FC = () => {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAtividade, setSelectedAtividade] = useState<Atividade | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    fetchAtividades();
  }, []);

  const fetchAtividades = async () => {
    try {
      const token = localStorage.getItem('token');
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
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
    } finally {
      setLoading(false);
    }
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

  if (showQuiz && selectedAtividade) {
    return (
      <Quiz 
        onComplete={handleQuizComplete}
        atividade={selectedAtividade}
      />
    );
  }

  if (loading) {
    return (
      <div className="percurso-loading">
        <div className="loading-spinner">Carregando atividades...</div>
      </div>
    );
  }

  return (
    <div className="percurso-container">
      <div className="percurso-header">
        <h1>Percurso de Aprendizagem</h1>
        <p>Complete as atividades em ordem para avançar no curso!</p>
      </div>

      <div className="percurso-content">
        <div className="atividades-trilha">
          {atividades.map((atividade, index) => (
            <div 
              key={atividade.id}
              className={`atividade-item ${atividade.status}`}
              onClick={() => handleAtividadeClick(atividade)}
            >
              <div className="atividade-numero">{index + 1}</div>
              <div className="atividade-info">
                <h3>{atividade.titulo}</h3>
                <p>{atividade.descricao}</p>
                <div className="atividade-meta">
                  <span className="pontos">⭐ {atividade.pontos} pontos</span>
                  <span className={`status ${atividade.status}`}>
                    {atividade.status === 'concluida' ? '✅ Concluída' :
                     atividade.status === 'disponivel' ? '🎮 Disponível' :
                     '🔒 Bloqueada'}
                  </span>
                </div>
              </div>
              {index < atividades.length - 1 && (
                <div className="trilha-conectora"></div>
              )}
            </div>
          ))}
        </div>

        {atividades.length === 0 && (
          <div className="percurso-empty">
            <h3>Nenhuma atividade disponível</h3>
            <p>As atividades serão liberadas pelo professor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conteudo_Percurso; 