import './ranking_styles.css'
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Logo from '../../Imagens/LogoDoutoresAmbientais.png';
import { useEffect, useState } from 'react';
import api from '../../services/api';

interface RankingData {
  turma: string;
  pontos: number;
}

function Ranking() {
  const [dados, setDados] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        // Ajuste o endpoint conforme o backend
        const response = await api.get('/management/ranking');
        setDados(response.data);
      } catch (err: any) {
        setErro(err.response?.data?.message || 'Erro ao buscar ranking.');
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

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
            <div className="ranking-school-title">Colégio Castelo Branco</div>
            {loading ? (
              <div>Carregando...</div>
            ) : erro ? (
              <div style={{color: 'red'}}>{erro}</div>
            ) : (
              <table className="ranking-table">
                <tbody>
                  {dados.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.turma}</td>
                      <td>{item.pontos.toFixed(2)}</td>
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
