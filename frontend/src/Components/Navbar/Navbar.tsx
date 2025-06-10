import { Navbar_dados } from './Navbar_dados';
import './Navbar_style.css';
import { Component } from 'react';

class Navbar extends Component {
  state = {clicked: false};

  handleClick = () => {
    this.setState({clicked:!this.state.clicked})
  }

  render(){
    return (
          <div className="navbar-header">
            <nav id="navbar" className={this.state.clicked ? "active" : ""}>
              <div className="navbar-top">
                <div id="mobile" onClick={this.handleClick}>
                  <i id="bar" className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <div id="titulo-header">Doutores Ambientais Mirins</div>
              </div>

              {this.state.clicked && <div className="overlay" onClick={this.handleClick}></div>}

              <ul className="navbarLista">
                {Navbar_dados.map((val, key) => (
                  <li key={key} className='item' onClick={() => {window.location.pathname = val.link}}>
                    <div id='icone'>{val.icone}</div>
                    <div id='nome'>{val.nome}</div>
                  </li>
                ))}
              </ul>

            </nav>
          </div>
    )
  }
}

export default Navbar