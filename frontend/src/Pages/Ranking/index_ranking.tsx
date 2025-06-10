import './ranking_styles.css'
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Logo from '../../Imagens/LogoDoutoresAmbientais.png';

function Ranking() {
  return (
    <>
      <Navbar />
      <div className="ranking-container">
      <div className="login-top-bar">
          <div className="login-title">Ranking</div>
          <img src={Logo} alt="Logo Doutores Ambientais" className="login-logo-top" />
        </div>
        <div className="ranking-classificacao">
          <div className="ranking-table-container">
            <div className="ranking-school-title">Colégio Castelo Branco</div>
            <table className="ranking-table">
              <tbody> {/* Isso aqui deve ser ligado ao banco, esses dados são ilistrativos*/}  
                <tr>
                  <td>5° ano</td>
                  <td>69.00</td>
                </tr>
                <tr>
                  <td>4° ano</td>
                  <td>50.00</td>
                </tr>
                <tr>
                  <td>3° ano</td>
                  <td>48.00</td>
                </tr>
                <tr>
                  <td>2° ano</td>
                  <td>40.00</td>
                </tr>
                <tr>
                  <td>1° ano</td>
                  <td>39.00</td>
                </tr>
                <tr>
                  <td>Turmas</td>
                  <td>0.0</td>
                </tr>
                <tr>
                  <td>Turmas</td>
                  <td>0.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Ranking;
