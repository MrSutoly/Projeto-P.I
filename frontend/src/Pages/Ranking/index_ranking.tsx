import './ranking_styles.css'
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Logo from '../../Imagens/LogoDoutoresAmbientais.png';
import { useEffect, useState } from 'react';
import api from '../../services/api';

interface RankingData {
  id: number;
  nome: string;
  pontos: number;
  posicao?: number;
}

function Ranking() {
  const [dados, setDados] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        console.log('Buscando ranking...');
        const response = await api.get('/management/ranking');
        console.log('Resposta da API:', response.data);
        setDados(response.data);
      } catch (err: any) {
        console.error('Erro ao buscar ranking:', err);
        setErro(err.response?.data?.message || err.message || 'Erro ao buscar ranking.');
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  const getTrofeuIcon = (posicao: number) => {
    switch (posicao) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🏆';
    }
  };

  const getClasseDestaque = (posicao: number) => {
    switch (posicao) {
      case 1:
        return 'primeiro-lugar';
      case 2:
        return 'segundo-lugar';
      case 3:
        return 'terceiro-lugar';
      default:
        return '';
    }
  };

  return (
    <>
      <Navbar />
      <div className="ranking-container">
        <div className="login-top-bar">
          <div className="login-title">Ranking</div>
          <img src={Logo} alt="Logo Doutores Ambientais" className="login-logo-top" />
        </div>
        <div className="ranking-classificacao">
          <div className="ranking-table-container">
            <div className="ranking-school-title">Ranking das Turmas</div>
            {loading ? (
              <div className="loading-message">Carregando ranking...</div>
            ) : erro ? (
              <div className="erro-message">
                <strong>Erro:</strong> {erro}
                <br />
                <small>Verifique se o servidor está rodando na porta 3000</small>
              </div>
            ) : dados.length === 0 ? (
              <div className="no-data-message">
                <p>Nenhuma turma encontrada.</p>
                <small>Cadastre turmas primeiro para visualizar o ranking.</small>
              </div>
            ) : (
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th>Posição</th>
                    <th>Turma</th>
                    <th>Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((item) => (
                    <tr key={item.id} className={getClasseDestaque(item.posicao || 0)}>
                      <td className="posicao-cell">
                        <span className="trofeu-icon">{getTrofeuIcon(item.posicao || 0)}</span>
                        <span className="posicao-numero">{item.posicao}º</span>
                      </td>
                      <td className="nome-turma">{item.nome}</td>
                      <td className="pontos-cell">{item.pontos.toFixed(2)} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Ranking;
