import './Logo.css';
import Logo_imagem from '../../Imagens/LogoDoutoresAmbientais.png';
import React from 'react';

interface LogoProps {
  esconderImagem?: boolean;
}

const Logo: React.FC<LogoProps> = ({ esconderImagem = false }) => {
  return (
    <div id="Logo">
      <div id="Logo_texto">
        DOUTORES <br /> AMBIENTAIS MIRINS

        {!esconderImagem && (
          <div id="Logo_Imagem">
            <img src={Logo_imagem} alt="Logo" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo; 