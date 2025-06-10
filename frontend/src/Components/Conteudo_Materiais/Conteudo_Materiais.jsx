import './Conteudo_Materiais.css';
import rato1_materiais from '../../Imagens/rato1_materiais.png';
import rato2_materiais from '../../Imagens/rato2_materiais.png';
import Logo from '../Logo/Logo';

const Conteudo_Materiais = () => {
  return (
    <div>
        <Logo/>
        <header className="header">
            MATERIAIS
        </header>

        <div className="conteudo">
            <div className="conteudo-titulo"># Slides</div>
            <div className="cont-lista">
                <ul>
                    <li>
                        Semana 1 
                        <a href="http://bit.ly/4joMsd8">http://bit.ly/4joMsd8</a>
                    </li>
                    <li>
                        Semana 2
                        <a href="http://bit.ly/4jkNO8z">http://bit.ly/4jkNO8z</a>
                    </li>
                    <li>
                        Apostila
                        <a href="http://bit.ly/44XtF53">http://bit.ly/44XtF53</a>
                    </li>
                </ul>
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