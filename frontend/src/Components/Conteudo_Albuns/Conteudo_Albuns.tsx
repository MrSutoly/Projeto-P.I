import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import './Conteudo_Albuns.css';
import LogoDoutoresAmbientais from '../../Imagens/LogoDoutoresAmbientais.png';

interface Album {
  id: number;
  titulo: string;
  descricao: string;
  imagemUrl: string;
  turma: string;
  data: string;
  tipo: 'foto' | 'video' | 'documento';
}

interface CreateAlbumRequest {
  titulo: string;
  descricao: string;
  imagemUrl: string;
  turma: string;
  data: string;
  tipo: 'foto' | 'video' | 'documento';
}

const Conteudo_Albuns: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [, setAlbuns] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [albumsPorTurma, setAlbunsPorTurma] = useState<Record<string, Album[]>>({});
  const [formData, setFormData] = useState<CreateAlbumRequest>({
    titulo: '',
    descricao: '',
    imagemUrl: '',
    turma: '',
    data: '',
    tipo: 'foto'
  });

  const isTeacherOrAdmin = user?.role === 'professor' || user?.role === 'admin';

  useEffect(() => {
    fetchAlbuns();
  }, []);

  const fetchAlbuns = async () => {
    setLoading(true);
    try {
      const response = await api.get('/management/albums');
      setAlbuns(response.data);
      
      // Organizar álbuns por turma
      const organizados = (response.data as Album[]).reduce<Record<string, Album[]>>((acc, album) => {
        if (!acc[album.turma]) {
          acc[album.turma] = [];
        }
        acc[album.turma].push(album);
        return acc;
      }, {});
      
      setAlbunsPorTurma(organizados);
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/management/albums', formData);
      setShowForm(false);
      setFormData({
        titulo: '',
        descricao: '',
        imagemUrl: '',
        turma: '',
        data: '',
        tipo: 'foto'
      });
      fetchAlbuns();
    } catch (error) {
      console.error('Erro ao criar álbum:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="sec-albuns">
      {/* Barra superior azul padrão */}
      <div className="login-top-bar">
        <div className="login-title">ÁLBUNS</div>
        <img src={LogoDoutoresAmbientais} alt="Logo Doutores Ambientais" className="login-logo-top" />
      </div>

      <div className="conteudo">
        <div className="conteudo-header">
          <div className="conteudo-titulo">Veja aqui os álbuns organizados por turma</div>
          {isTeacherOrAdmin && (
            <button 
              className="btn-adicionar"
              onClick={() => setShowForm(!showForm)}
            >
              <span className="btn-icon">+</span>
              {showForm ? 'Cancelar' : 'Adicionar Álbum'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-container">
            <form onSubmit={handleSubmit} className="album-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="titulo">Título:</label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="turma">Turma:</label>
                  <input
                    type="text"
                    id="turma"
                    name="turma"
                    value={formData.turma}
                    onChange={handleInputChange}
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
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="tipo">Tipo:</label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="foto">Foto</option>
                    <option value="video">Vídeo</option>
                    <option value="documento">Documento</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="imagemUrl">URL da Imagem:</label>
                <input
                  type="url"
                  id="imagemUrl"
                  name="imagemUrl"
                  value={formData.imagemUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição:</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <button type="submit" className="btn-submit">Criar Álbum</button>
            </form>
          </div>
        )}

        <div className="albuns-content">
          {Object.keys(albumsPorTurma).length === 0 ? (
            <p>Nenhum álbum encontrado.</p>
          ) : (
            Object.entries(albumsPorTurma).map(([turma, albumsTurma]) => (
              <div key={turma} className="turma-section">
                <h3 className="turma-title">{turma}</h3>
                <div className="albuns-grid">
                  {albumsTurma.map((album) => (
                    <div key={album.id} className="album-card">
                      <div className="album-image-container">
                        <img 
                          src={album.imagemUrl} 
                          alt={album.titulo}
                          className="album-image"
                        />
                        <div className="album-type-badge">
                          {album.tipo}
                        </div>
                      </div>
                      <div className="album-info">
                        <h4 className="album-title">{album.titulo}</h4>
                        <p className="album-description">{album.descricao}</p>
                        <p className="album-date">{new Date(album.data).toLocaleDateString('pt-BR')}</p>
                        <button className="btn-acessar">
                          Visualizar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Conteudo_Albuns; 