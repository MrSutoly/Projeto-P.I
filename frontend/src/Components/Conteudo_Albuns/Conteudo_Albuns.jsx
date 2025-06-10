import Logo from '../Logo/Logo';
import './Conteudo_Albuns.css';
import imagem_foto_beta from '../../Imagens/imagem_foto_beta.png';
import Botao_engrenagem from './Botao_engrenagem';

const Conteudo_Albuns = () => {
  return (
    <div>
        <Logo/>
        <header className="header">
            ÁLBUNS
        </header>

        <div className="conteudo">
            <div className="conteudo-titulo"># ÁLBUNS</div>
            <div className='conteudo-section'>
                <div className="foto">
                    <img src={imagem_foto_beta} alt="" />
                    <p>Turma 2025</p>                    
                </div>

                <div className="foto">
                    <img src={imagem_foto_beta} alt="" />
                    <p>Turma 2016</p>                    
                </div>

                <div className="foto">
                    <img src={imagem_foto_beta} alt="" />
                    <p>Turma 2025</p>                    
                </div>

                <div className="foto">
                    <img src={imagem_foto_beta} alt="" />
                    <p>Turma 2016</p>                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default Conteudo_Albuns