import React, { useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import LogoDoutoresAmbientais from '../../Imagens/LogoDoutoresAmbientais.png';
import '../../Components/Conteudo_Percurso/Conteudo_Percurso.css';

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

interface QuizProps {
  onComplete?: () => void;
  atividade?: Atividade;
}

const alternativasCores = [
  'red',    // Resposta 1
  'blue',   // Resposta 2
  'yellow', // Resposta 3
  'lime',   // Resposta 4
];

const alternativasTextos = [
  'Resposta 1',
  'Resposta 2',
  'Resposta 3',
  'Resposta 4',
];

const perguntasExemplo = [
  {
    pergunta: 'Pergunta da atividade',
    alternativas: alternativasTextos,
  },
  // Adicione mais perguntas conforme necessário
];

const QuizAluno: React.FC<QuizProps> = ({ onComplete, atividade }) => {
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<(number | null)[]>(Array(perguntasExemplo.length).fill(null));

  const handleSelecionar = (indice: number) => {
    const novasRespostas = [...respostas];
    novasRespostas[perguntaAtual] = indice;
    setRespostas(novasRespostas);
  };

  const avancar = () => {
    if (perguntaAtual < perguntasExemplo.length - 1) {
      setPerguntaAtual(perguntaAtual + 1);
    }
  };

  const finalizar = () => {
    // Aqui você pode implementar lógica para salvar as respostas
    alert('Quiz finalizado! Retornando ao percurso...');
    if (onComplete) {
      onComplete();
    }
  };

  const voltar = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1);
    }
  };

  return (
    <div className="sec-percurso">
      <Navbar />
      {/* Barra superior padrão */}
      <div className="login-top-bar">
        <div className="login-title">Quiz</div>
        <img src={LogoDoutoresAmbientais} alt="Logo Doutores Ambientais" className="login-logo-top" />
      </div>
      <div className="conteudo">
        <div className="conteudo-header">
          <div className="conteudo-titulo"># {atividade?.titulo || 'Nome da atividade'}</div>
        </div>
        <div style={{ textAlign: 'center', margin: '30px 0 10px 0', fontSize: '2rem' }}>
          {perguntasExemplo[perguntaAtual].pergunta}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: 500, height: 150, margin: 10 }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
          {perguntasExemplo[perguntaAtual].alternativas.map((alt, idx) => (
            <button
              key={idx}
              style={{
                background: alternativasCores[idx],
                color: idx === 2 ? '#333' : '#fff',
                border: respostas[perguntaAtual] === idx ? '4px solid #333' : 'none',
                borderRadius: 12,
                fontSize: 22,
                fontWeight: 500,
                width: 220,
                height: 60,
                margin: 10,
                cursor: 'pointer',
                outline: 'none',
                boxShadow: respostas[perguntaAtual] === idx ? '0 0 0 2px #45B9AB' : 'none',
                transition: 'all 0.2s',
              }}
              onClick={() => handleSelecionar(idx)}
            >
              {alt}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
          <button className="btn-adicionar" onClick={voltar} disabled={perguntaAtual === 0}>
            Voltar
          </button>
          <span style={{ alignSelf: 'center', fontSize: 18 }}>
            Questão {perguntaAtual + 1} de {perguntasExemplo.length}
          </span>
          {perguntaAtual === perguntasExemplo.length - 1 ? (
            <button className="btn-adicionar" onClick={finalizar}>
              Finalizar
            </button>
          ) : (
            <button className="btn-adicionar" onClick={avancar}>
              Avançar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAluno; 