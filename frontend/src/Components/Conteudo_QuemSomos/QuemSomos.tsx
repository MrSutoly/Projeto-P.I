import './QuemSomos.css';
import Pessoas from './Pessoas';
import Logo from '../../Imagens/LogoDoutoresAmbientais.png';
import rato_quemSomos1 from '../../Imagens/rato_quemSomos1.png';
import rato_quemSomos2 from '../../Imagens/rato_quemSomos2.png';

function QuemSomos() {
  return (
    <div className="quem-somos-container">
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

      <div className="quem-somos-content">
        <div className="quem-somos-header">
          <h2 className="quem-somos-titulo">Quem Somos</h2>
          <p className="quem-somos-subtitulo">
            Conheça a equipe por trás do projeto Doutores Ambientais Mirins
          </p>
        </div>

        <div className="quem-somos-intro">
          <p className="intro-texto">
            Somos uma equipe multidisciplinar comprometida com a educação ambiental de crianças e jovens. 
            Nosso projeto visa formar pequenos doutores ambientais através de atividades interativas e educativas.
          </p>
        </div>

        <Pessoas />

        <div className="quem-somos-mission">
          <h3>Nossa Missão</h3>
          <p>
            Despertar a consciência ambiental nas crianças através de metodologias inovadoras e interativas, 
            formando futuros cidadãos responsáveis pelo meio ambiente.
          </p>
        </div>

        <div className="quem-somos-vision">
          <h3>Nossa Visão</h3>
          <p>
            Ser referência em educação ambiental infantil, criando uma geração de jovens comprometidos 
            com a sustentabilidade e preservação do planeta.
          </p>
        </div>

        <div className="quem-somos-decoracao">
          <img src={rato_quemSomos1} alt="Rato 1" className="rato-decoracao rato-1" />
          <img src={rato_quemSomos2} alt="Rato 2" className="rato-decoracao rato-2" />
        </div>
      </div>
    </div>
  );
}

export default QuemSomos; 