import './Conteudo_Materiais.css';
import rato1_materiais from '../../Imagens/rato1_materiais.png';
import rato2_materiais from '../../Imagens/rato2_materiais.png';
import LogoDoutoresAmbientais from '../../Imagens/LogoDoutoresAmbientais.png';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Material {
  id: number;
  titulo: string;
  semana: number;
  topico: string;
  data: string;
  link: string;
  tipo: string;
}

const Conteudo_Materiais = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    semana: 1,
    topico: '',
    data: '',
    link: '',
    tipo: 'slide'
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchMateriais();
  }, []);

  const fetchMateriais = async () => {
    setLoading(true);
    try {
      const response = await api.get('/management/materials');
      setMateriais(response.data);
    } catch (err) {
      setErro('Erro ao buscar materiais.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/management/materials', formData);
      setShowForm(false);
      setFormData({
        titulo: '',
        semana: 1,
        topico: '',
        data: '',
        link: '',
        tipo: 'slide'
      });
      fetchMateriais();
    } catch (err) {
      setErro('Erro ao adicionar material.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Agrupar materiais por semana
  const materiaisPorSemana = materiais.reduce((acc: Record<number, Material[]>, material) => {
    const semana = material.semana;
    if (!acc[semana]) {
      acc[semana] = [];
    }
    acc[semana].push(material);
    return acc;
  }, {});

  // Ordenar semanas
  const semanasOrdenadas = Object.keys(materiaisPorSemana).sort((a, b) => Number(a) - Number(b));



  return (
    <div className="sec-materiais">
      <div className="login-top-bar">
        <div className="login-title">MATERIAIS</div>
        <img src={LogoDoutoresAmbientais} alt="Logo Doutores Ambientais" className="login-logo-top" />
      </div>

      <div className="conteudo">
        <div className="conteudo-header">
          <div className="conteudo-titulo">Veja aqui os materiais de cada semana</div>
          {(user?.role === 'professor' || user?.role === 'admin') && (
            <button 
              className="btn-adicionar"
              onClick={() => setShowForm(!showForm)}
            >
              <span className="btn-icon">+</span>
              Adicionar Materiais
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-container">
            <form onSubmit={handleSubmit} className="material-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Semana:</label>
                  <select
                    name="semana"
                    value={formData.semana}
                    onChange={handleInputChange}
                    required
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Semana {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo:</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="slide">Slide</option>
                    <option value="apostila">Apostila</option>
                    <option value="video">Vídeo</option>
                    <option value="documento">Documento</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Tópico:</label>
                <input
                  type="text"
                  name="topico"
                  value={formData.topico}
                  onChange={handleInputChange}
                  placeholder="Ex: Introdução ao meio ambiente"
                  required
                />
              </div>

              <div className="form-group">
                <label>Título:</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ex: Slides - Semana 1"
                  required
                />
              </div>

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
                <label>Link:</label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="form-buttons">
                <button type="button" onClick={() => setShowForm(false)} className="btn-cancelar">
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar">
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="cont-lista">
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : erro ? (
            <div className="erro">{erro}</div>
          ) : semanasOrdenadas.length === 0 ? (
            <div className="sem-materiais">Nenhum material encontrado.</div>
          ) : (
            semanasOrdenadas.map(semana => (
              <div key={semana} className="semana-section">
                <h3 className="semana-titulo">Semana - {semana}</h3>
                <ul className="materiais-lista">
                  {materiaisPorSemana[Number(semana)].map((material: Material) => (
                    <li key={material.id} className="material-item">
                      <div className="material-info">
                        <strong>{material.titulo}</strong>
                        <span className="material-topico">{material.topico}</span>
                        <span className="material-data">{new Date(material.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <a 
                        href={material.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="material-link"
                      >
                        Acessar
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="imagens">
          <div className="img1">
            <img src={rato1_materiais} alt="" />
          </div>
          <div className="img2">
            <img src={rato2_materiais} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Conteudo_Materiais