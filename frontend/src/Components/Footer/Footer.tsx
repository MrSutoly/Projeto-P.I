import "./Footer_style.css";

import LogoItaipu from "../../Imagens/LogoItaipu.png";
import LogoUtfpr from "../../Imagens/LogoUtfpr.png";


const Footer = () => {
  return (
    <div className="footer">
        <div className="imagem-logo">
            <img src={LogoUtfpr} alt="" />
            <img src={LogoItaipu} alt="" />
        </div>
    </div>
  )
}

export default Footer;