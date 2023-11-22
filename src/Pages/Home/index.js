import { useState, useEffect } from "react";
import './style.css'; // Importe um arquivo de estilo CSS
import { Link } from 'react-router-dom';
import imagemOuvidoria from '../../assets/ouvidoriaa.png'; // Qualquer nome de variável válido

function Home() {
  const prefix = "Bem vindo(a) a ouvidoria do grupo ";
  const name = "Hausen";
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false); // Estado para controlar a visibilidade dos botões

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (index < prefix.length) {
        setDisplayText((prevText) => prevText + prefix[index]);
        setIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(typingInterval);
        // Quando o texto estiver totalmente digitado, mostre os botões
        setShowButtons(true);
      }
    }, 70);

    return () => {
      clearInterval(typingInterval);
    };
  }, [index]);

  return (
    <div className="container">
      <h1 className="texto-ouvidoria">
        {displayText}<span id="orange-texto">{name}</span>
      </h1>

      <img src={imagemOuvidoria} alt="Imagem da Ouvidoria" />

      {showButtons && (
        <>
          <a className="saiba-mais" href="#" target="_blank">
            Saiba mais
          </a>

          <Link to="/Login">
            <a className="contato" target='_blank'>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              ACESSAR
            </a>
          </Link>
        </>
      )}
    </div>
  );
}

export default Home;