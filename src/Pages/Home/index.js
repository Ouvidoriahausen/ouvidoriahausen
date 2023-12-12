import './home.css';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import Terms from '../Terms';

export default function Home() {
  return (
    <>
      <Terms />

      <div className="container-center home-container">
        <section>
          <span className="trace"></span>
          <h1>Ouvidoria</h1>

          <h2>Bem-vindo(a) a ouvidoria do grupo <span className="hausenTxt">Hausen</span></h2>
          
        </section>

        <div className="home-btns">
          <Link to="/login">
            <Button fullWidth size="large" variant="contained">Acessar</Button>
          </Link>

          <Link className="saiba-mais" to="#">
            Saiba mais
          </Link>
        </div>

        <div className="traces">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </>
  );
}