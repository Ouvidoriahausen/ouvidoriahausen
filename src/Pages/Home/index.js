import './home.css';
import { Link } from 'react-router-dom';
import imagemOuvidoria from '../../assets/ouvidoria.png';
import { Button } from '@mui/material';

export default function Home() {
  const prefix = "Bem-vindo(a) a ouvidoria do grupo";
  const name = "Hausen";

  return (
    <div className="container-center">
      <h1 className="texto-ouvidoria">
        {prefix} <span>{name}</span>
      </h1>

      <img src={imagemOuvidoria} alt="Imagem da Ouvidoria" />

      <div className="home-btns">
        <Link to="/login">
          <Button size="large" variant='contained'>Acessar</Button>
        </Link>
        
        <Link className="saiba-mais" to="#">
          Saiba mais
        </Link>
      </div>

    </div>
  );
}