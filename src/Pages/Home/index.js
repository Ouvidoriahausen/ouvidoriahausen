import './home.css';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useState } from 'react';
import { LuFileText } from "react-icons/lu";

export default function Home() {

  const [terms, setTerms] = useState(true);

  return (
    <>
      {terms && <section className="terms-container">
        <div className="terms-content">
          <div>
            <LuFileText size={100} />
            <h2>Nossos Termos</h2>
          </div>
          <p>Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.</p>
          <Button variant="contained" fullWidth color="thirty" size="large" onClick={() => setTerms(false)}>Aceitar</Button>
        </div>
      </section>}

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