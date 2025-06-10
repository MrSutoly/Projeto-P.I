import './QuemSomos.css';
import Logo from '../Logo/Logo';
import Imagem from '../../Imagens/LogoDoutoresAmbientais.png';
import imagem_foto_beta from '../../Imagens/imagem_foto_beta.png';
import rato_quemSomos1 from '../../Imagens/rato_quemSomos1.png';
import rato_quemSomos2 from '../../Imagens/rato_quemSomos2.png';

const QuemSomos = () => {
  return (
    <div>
        <Logo/>
        <header className="header">
            QUEM SOMOS
        </header>

        <div className="conteudo">
            <div className="conteudo-titulo"># SOBRE NÓS</div>

            <div className='conteudo-subtitulo'>
                <img className='imagem-subtitulo' src={rato_quemSomos1} alt="" />
                <div className='tit'>Doutores Ambientais Mirins</div>
                <img className='imagem-subtitulo' src={rato_quemSomos2} alt="" />
                
            </div>
            <hr style={{ border: '3px solid #A7625B', width: '90%' }} />

            <div className='conteudo-texto'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac sapien quis turpis placerat 
                tincidunt. Vivamus euismod purus at sapien posuere, ut sollicitudin nulla porta. Proin sit amet 
                nunc vel neque ultrices vehicula. Sed quis diam vitae justo cursus pulvinar. Fusce nec malesuada 
                odio. Nulla facilisi.
            </div>
            
            <div className='conteudo-imagem'>
                <img src={Imagem} alt="imagem-doutores-ambientais-mirins" />
            </div>

            <div className='conteudo-texto'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac sapien quis turpis placerat 
                tincidunt. Vivamus euismod purus at sapien posuere, ut sollicitudin nulla porta. Proin sit amet 
                nunc vel neque ultrices vehicula. Sed quis diam vitae justo cursus pulvinar. Fusce nec malesuada 
                odio. Nulla facilisi.
            </div>
            
            <div className='conteudo-subtitulo'>
                Nossos tutores
            </div>
            <br />
            <div className="foto">
                <img src={imagem_foto_beta} alt="" />
                <p>Natalia</p>                    
            </div>

            <div className='conteudo-texto'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac sapien quis turpis placerat 
                tincidunt. Vivamus euismod purus at sapien posuere, ut sollicitudin nulla porta. Proin sit amet 
                nunc vel neque ultrices vehicula. Sed quis diam vitae justo cursus pulvinar. Fusce nec malesuada 
                odio. Nulla facilisi.
            </div>
        </div>
    </div>
  )
}

export default QuemSomos