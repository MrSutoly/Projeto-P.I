import "./QuemSomos.css";
import imagem_foto_beta from '../../Imagens/imagem_foto_beta.png';
import fotoAna from "./Fotos_Pessoas/Ana.png";
import fotoBianca from "./Fotos_Pessoas/Bianca.png";
import fotoElizandra from "./Fotos_Pessoas/Elizandra.png";
import fotoGeyziane from "./Fotos_Pessoas/Geyziane.png";
import fotoJhenyffer from "./Fotos_Pessoas/Jhenyffer.png";
import fotoLucas from "./Fotos_Pessoas/Lucas.png";
import fotoMarla from "./Fotos_Pessoas/Marla.png";
import fotoNayara from "./Fotos_Pessoas/Nayara.png";

interface PessoaProps {
  foto: string;
  nome: string;
  cargo: string;
  descricao: string;
}

function Pessoas({ foto, nome, cargo, descricao }: PessoaProps) {
  return (
    <div> 
      <div className="foto">
        <img src={foto} alt={`Foto de ${nome}`} />
        <p>
          <strong>{nome}</strong><br />
          {cargo}
        </p>
      </div>
      <div className="foto-texto">
        {descricao}
      </div>
    </div>
  );
}

function Equipe() {
  return (
    <div className="container-equipe">

      <div className="grupo">
        <h2>Bolsistas</h2>
        <div className="grupo-pessoas">
          <Pessoas 
            foto={fotoBianca} 
            nome="Bianca" 
            cargo="Bolsista" 
            descricao="Bianca Tais Bortolanza, 19 anos, residente da cidade de Santa Helena. Graduanda em engenharia agronômica, responsável pela gravação do documentário sobre os perfurocortantes, atua nas ações de educação ambiental nas escolas." 
          />
          <Pessoas 
            foto={fotoLucas} 
            nome="Lucas" 
            cargo="Bolsista" 
            descricao="Lucas Paranhos da Silva, 22 anos, reside na cidade de Santa Helena - Pr. Aluno do curso de Licenciatura em Ciências Biológicas pela Universidade Tecnológica Federal do Paraná. No projeto, o aluno é responsável pelo embasamento teórico, feito a partir de artigos científicos sobre a temática do projeto em andamento. Atua também nas aplicações das atividades desenvolvidas, tanto na escola com as crianças do ensino fundamental I quanto na Usina de reciclagem com os coletores." 
          />
          <Pessoas 
            foto={fotoGeyziane} 
            nome="Geyziane" 
            cargo="Bolsista" 
            descricao="Geyziane Paula Antunes,32 anos, residente na cidade de Santa Helena - Paraná, Graduanda em Licenciatura em Ciências Biológicas. Atua na criação de materiais para desenvolvimento de ações em educação saúde para os agentes ambientais,aplicação de educação ambiental nas escolas e atua diretamente na usina de reciclagem coletando amostras de descarte indevido de perfurocortantes." 
          />
          <Pessoas 
            foto={fotoElizandra} 
            nome="Elizandra" 
            cargo="Bolsista" 
            descricao="Elizandra Paloma Pereira, 30 anos,reside na cidade de Santa Helena-Paraná, e cursa Licenciatura em Ciências Biológicas na Universidade Tecnológica Federal do Paraná (UTFPR). Atua no desenvolver do documentário, sobre descarte correto, na forma de animação para as crianças. Vai atuar na colaboração das filmagens e das entrevistas do documentário. Atua também na colaboração nas aplicação das ações. Atua na colaboração das mídias sociais." 
          />
        </div>
      </div>

      <div className="grupo">
        <h2>Voluntários</h2>
        <div className="grupo-pessoas">
          <Pessoas 
            foto={fotoMarla} 
            nome="Marla" 
            cargo="Voluntária" 
            descricao="Marla Letícia Back Frantz, 20 anos, reside em Entre Rios do Oeste, Paraná, e cursa Licenciatura em Ciências Biológicas na Universidade Tecnológica Federal do Paraná (UTFPR). No projeto, atua como responsável pela coleta de dados de saúde dos agentes ambientais, auxilia nas entrevistas e nas aplicações de educação em saúde com a Associação de Agentes Ambientais de Santa Helena." 
          />
          <Pessoas 
            foto={fotoJhenyffer} 
            nome="Jhenyffer" 
            cargo="Voluntária" 
            descricao="Jhenyffer, 19 anos. Natural de Belém- PA. Graduanda em Licenciatura em Ciências Biológicas. No projeto Doutores Ambientais Mirins atuo como no apoio e na aplicação dos materiais" 
          />
          <Pessoas 
            foto={fotoAna} 
            nome="Ana" 
            cargo="Voluntária" 
            descricao="Ana Luiza Noveli, 20 anos, residente em Santa Helena, Paraná, é graduanda do curso de Licenciatura em Ciências Biológicas. Atua no desenvolvimento de materiais didáticos, com ênfase na elaboração de recursos visuais e artísticos." 
          />
          <Pessoas 
            foto={fotoNayara} 
            nome="Nayara" 
            cargo="Voluntária" 
            descricao="Nayara Rodrigues de Souza, 22 anos, reside em Santa Helena, Paraná, e cursa Licenciatura em Ciências Biológicas na Universidade Tecnológica Federal do Paraná (UTFPR). No projeto, atua como responsável pela coordenação das mídias sociais." 
          />
        </div>
      </div>

      <div className="grupo">
        <h2>Coordenação</h2>
        <div className="grupo-pessoas">
          <Pessoas 
            foto={imagem_foto_beta} 
            nome="Professora Natalia" 
            cargo="Coordenadora do Projeto" 
            descricao="Coordenadora geral do projeto Doutores Ambientais Mirins, responsável pela orientação e supervisão de todas as atividades desenvolvidas pela equipe." 
          />
        </div>
      </div>

    </div>
  );
}

export default Equipe; 