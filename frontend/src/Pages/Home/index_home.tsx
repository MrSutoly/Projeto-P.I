import './home_styles.css';

import Conteudo_home from '../../Components/Conteudo_Home/Conteudo_home';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';

function Home() {
  return (
    <div className="Home">
      <Navbar />
      <main className="Main">
        <Conteudo_home />
      </main>
      <Footer />
    </div>
  );
}


export default Home
