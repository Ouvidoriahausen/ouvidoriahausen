import React, { useState, useEffect, useContext } from 'react';
import './cadastrar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

function Cadastrar() {
  const [mensagemUsuario, setMensagemUsuario] = useState('');
  const [mensagemSenha, setMensagemSenha] = useState('');

  const [nomeUsuario, setNomeUsuario] = useState("")
  const email = `${nomeUsuario}@seuapp.com`;
  const [senha, setSenha] = useState("")

  const { Cadastrar, signed } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (signed) {
      navigate("/ticket")
    }
  }, [signed]);


  const mostrarMensagemUsuario = () => {
    setMensagemUsuario('*Lembre-se de guardar seu usuário e senha para logins futuros');
  };

  const mostrarMensagemSenha = () => {
    setMensagemSenha('*Lembre-se de guardar seu usuário e senha para logins futuros');
  };

  async function handleRegister(e) {
    e.preventDefault()

    if (nomeUsuario !== "" && email !== "" && senha !== "") {
      await Cadastrar(email, senha, nomeUsuario)
    }
    else {
      toast.error("Preencha todos os campos!")
    }
  }

  useEffect(() => {
    const handlePopState = () => {
      // Redireciona para a página do Ticket se o usuário tentar voltar para a tela de login
      if (window.location.pathname.includes('/Login')) {
        navigate('/Ticket');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // Intercepta as mudanças de histórico e substitui a entrada no histórico para evitar a navegação
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.returnValue = true;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <Link to="/" className="voltarinicio">
        Voltar para home
      </Link>

      <form className="Cadastro" onSubmit={handleRegister}>
        <h2>Cadastre-se</h2>

        <div className="box">
          <label htmlFor="nome">Digite seu usuário</label>
          <input
            type="text"
            name="usuario"
            required
            maxLength="15"
            onFocus={mostrarMensagemUsuario}
            onBlur={() => setMensagemUsuario('')}
            value={nomeUsuario}
            onChange={(e) => setNomeUsuario(e.target.value)}
          />
          <p className="mensagem">{mensagemUsuario}</p>
        </div>

        <div className="box">
          <label htmlFor="senha">Digite sua senha</label>
          <input
            type="password"
            name="senha"
            required
            maxLength="13"
            onFocus={mostrarMensagemSenha}
            onBlur={() => setMensagemSenha('')}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <p className="mensagem">{mensagemSenha}</p>
        </div>

        <button type="submit" className="cadastrar">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          CADASTRAR
        </button>

      </form>
    </div>
  );
}

export default Cadastrar;