import LogoDoutoresAmbientais from '../../Imagens/LogoDoutoresAmbientais.png';
import mouse1 from '../../Imagens/mouse1.png';
import mouse2 from '../../Imagens/mouse2.png';

import './Conteudo_home_style.css';

const Main = () => {
  return (
    <div className='sec-home'>
      <div className="login-top-bar">
        <div className="login-title">Home</div>
        <img src={LogoDoutoresAmbientais} alt="Logo Doutores Ambientais" className="login-logo-top" />
      </div>
      <div className="container-principal">
        <h1 className="titulo-principal">DOUTORES<br/>AMBIENTAIS MIRINS</h1>
        
        <div className="logo-circular">
          <img src={LogoDoutoresAmbientais} alt="Logo Doutores Ambientais" />
        </div>

        <div className="conteudo-principal">
          <div className="caixa-texto primeira-caixa">
            <p>
              Doutores Ambientais Mirins é um projeto que mostra, de 
              forma bem direta, como a cidade de Santa Helena (PR) lida 
              com o descarte de lixo, especialmente resíduos 
              perfurocortantes. Envolvendo crianças do Ensino 
              Fundamental I e agentes ambientais, a iniciativa acompanha o 
              trabalho diário de coleta e separação dos materiais na 
              usina de reciclagem, evidenciando a importância de destinar 
              agulhas, vidros, lâminas e seringas de maneira adequada 
              para evitar acidentes.
            </p>
          </div>

          <div className="caixa-texto segunda-caixa">
            <p>
              O projeto foi criado após constatar que, apesar de toda a rotina de coleta, o descarte incorreto 
              de objetos pontiagudos e contaminados continuava acontecendo, colocando em risco quem lida com o 
              lixo. A resposta foi elaborar ações educativas e campanhas de conscientização, cobrando da 
              comunidade uma atitude responsável para que esses acidentes deixem de ocorrer de vez.
            </p>
          </div>
        </div>

        <div className='imagens-ratos'>
          <img className='rato-esquerda' src={mouse1} alt="Rato 1" />
          <img className='rato-direita' src={mouse2} alt="Rato 2" />
        </div>
      </div>
    </div>
  )
}

export default Main