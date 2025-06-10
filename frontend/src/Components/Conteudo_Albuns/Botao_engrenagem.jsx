import React, { useState } from 'react';
import './Botao_engrenagem.css';

const SettingsMenu = () => {
  const [Aberto, setAberto] = useState(false);

  const toggleMenu = () => setAberto(prev => !prev);

  return (
    <div className="div-botao">
      <button onClick={toggleMenu} className='botao-menu' aria-label="Abrir menu de configurações" /* className="p-2 rounded-full hover:bg-gray-200 focus:outline-none" */>
            <i className="fa-solid fa-gear text-xl"></i>
      </button>

      {Aberto && (
        // <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-10">
        <div className="menu">
          <ul className="">
            <li className="">
                <a href="#">Editar</a>
            </li>
            <li className="">
                <a href="#">Sair</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
