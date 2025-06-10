import './login_style.css';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import Logo from '../../Imagens/LogoDoutoresAmbientais.png';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  //const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro('Preencha todos os campos para entrar.');
      return;
    }
    setErro('');
    // Implementação futura do back
  };

  return (
    <>
      <div className="login-bg">
        <Navbar />
        <div className="login-top-bar">
          <div className="login-title">Login</div>
          <img src={Logo} alt="Logo Doutores Ambientais" className="login-logo-top" />
        </div>
        <div className="login-center-area">
          <div className="login-yellow-box">
        <img src={Logo} alt="Logo Doutores Ambientais" className="login-logo-center" />
            <form className="login-form-new" onSubmit={handleLogin}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="aluno@escola.edu.br"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="login-input-new"
              />
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                placeholder="Data de Nascimento"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="login-input-new"
              />
              {erro && <div className="login-erro-new">{erro}</div>}
              <button type="submit" className="login-btn-new" disabled={!email || !senha}>
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;