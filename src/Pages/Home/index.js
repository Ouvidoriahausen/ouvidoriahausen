import './home.css';
import { Link } from 'react-router-dom';
import imagemOuvidoria from '../../assets/ouvidoriaa.png';

function Home() {
  const prefix = "Bem vindo(a) a ouvidoria do grupo ";
  const name = "Hausen";

  return (
    <div className="container">
      <h1 className="texto-ouvidoria">
        {prefix}
        <span>{name}</span>
      </h1>

      <img src={imagemOuvidoria} alt="Imagem da Ouvidoria" />

      <div className="home-btns">
        <Link className="acessar login-btn" to="/login">
          Acessar
        </Link>

        <Link className='acessar cadastro-btn' to="/cadastrar">
          Ou faça seu cadastro
        </Link>

      </div>
      <Link className="saiba-mais" href="#" target="_blank">
        Saiba mais
      </Link>

    </div>
  );
}

export default Home;