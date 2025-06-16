import './QuemSomos.css';
import Imagem from '../../Imagens/LogoDoutoresAmbientais.png';
import imagem_foto_beta from '../../Imagens/imagem_foto_beta.png';
import rato_quemSomos1 from '../../Imagens/rato_quemSomos1.png';
import rato_quemSomos2 from '../../Imagens/rato_quemSomos2.png';
import React from 'react';

const QuemSomos: React.FC = () => {
  return (
    <div className="sec-quem-somos">
        {/* Barra superior azul padrão */}
        <div className="login-top-bar">
            <div className="login-title">QUEM SOMOS</div>
            <img src="/logo.png" alt="Logo Doutores Ambientais" className="login-logo-top" />
        </div>

        <div className="conteudo">
            <div className="conteudo-titulo">Veja aqui um pouco sobre nosso projeto!</div>

            <div className='conteudo-subtitulo'>
                <img className='imagem-subtitulo' src={rato_quemSomos1} alt="" />
                <div className='tit'>Doutores Ambientais Mirins</div>
                <img className='imagem-subtitulo' src={rato_quemSomos2} alt="" />
            </div>
            <div className="divider-line"></div>

            <div className='conteudo-texto'>
                O projeto "Doutores Ambientais Mirins" é uma iniciativa inovadora que visa formar jovens 
                cidadãos conscientes sobre as questões ambientais. Nossa missão é educar e sensibilizar 
                crianças e adolescentes sobre a importância da preservação do meio ambiente, desenvolvendo 
                neles o senso de responsabilidade ecológica através de atividades lúdicas e educativas.
            </div>
            
            <div className='conteudo-imagem'>
                <img src={Imagem} alt="imagem-doutores-ambientais-mirins" />
            </div>

            <div className='conteudo-texto'>
                Através de uma plataforma interativa e gamificada, os participantes embarcam em uma jornada 
                de aprendizado sobre temas como biodiversidade, sustentabilidade, poluição e mudanças climáticas. 
                Cada atividade concluída os aproxima mais de se tornarem verdadeiros "Doutores Ambientais", 
                preparados para fazer a diferença em suas comunidades e no mundo.
            </div>
            
            <div className='conteudo-subtitulo'>
                Nossa Equipe
            </div>
            <br />
            <div className="foto">
                <img src={imagem_foto_beta} alt="Coordenadora do projeto" />
                <p><strong>Professora Natalia</strong><br/>Coordenadora do Projeto</p>                    
            </div>

            <div className='conteudo-texto'>
                Nossa equipe é formada por educadores especializados em educação ambiental, pedagogos e 
                desenvolvedores comprometidos com a formação de uma nova geração mais consciente e responsável. 
                Trabalhamos em parceria com escolas e instituições para ampliar o alcance do projeto e formar 
                cada vez mais "Doutores Ambientais Mirins" preparados para os desafios do futuro.
            </div>
        </div>
    </div>
  );
};

export default QuemSomos; 