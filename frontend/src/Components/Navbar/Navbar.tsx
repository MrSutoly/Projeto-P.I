import { Navbar_dados } from './Navbar_dados';
import './Navbar_style.css';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const [clicked, setClicked] = useState(false);
  const { token, logout, user } = useAuth();

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <div className="navbar-header">
      <nav id="navbar" className={clicked ? "active" : ""}>
        <div className="navbar-top">
          <div id="mobile" onClick={handleClick}>
            <i id="bar" className={clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
          </div>
          <div id="titulo-header">Doutores Ambientais Mirins</div>
        </div>

        {clicked && <div className="overlay" onClick={handleClick}></div>}

        <ul className="navbarLista">
          {Navbar_dados
            .filter(val => !val.userType || val.userType === user?.role)
            .map((val, key) => (
              <li key={key} className='item' onClick={() => {window.location.pathname = val.link}}>
                <div id='icone'>{val.icone}</div>
                <div id='nome'>{val.nome}</div>
              </li>
            ))}
          {token && (
            <li className='item' onClick={logout} style={{color: 'red', fontWeight: 'bold', cursor: 'pointer'}}>
              <div id='icone'><i className="fa-solid fa-right-from-bracket"></i></div>
              <div id='nome'>Sair</div>
            </li>
          )}
        </ul>

      </nav>
    </div>
  );
}

export default Navbar