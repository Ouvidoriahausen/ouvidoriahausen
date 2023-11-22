import React, { useContext, useEffect, useState } from 'react';
import './loginesenha.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

function Loginesenha() {

  const [mensagemErro, setMensagemErro] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState("")
  const email = `${nomeUsuario}@seuapp.com`; // Mantém o domínio fictício
  const [senha, setSenha] = useState("")

  const { FazerLogin, signed } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (signed) {
      navigate("/MeusTickets")
    }
  }, [signed]);


  async function handleLogin(e) {
    e.preventDefault()

    if (email !== "" && senha !== "") {
      await FazerLogin(email, senha)
    } else {
      toast.error("Preencha todos os campos!")
    }
  }

  return (
    <div>
      <Link to="/" className="voltarinicio">
        Voltar para home
      </Link>

      <form className="loginesenha" onSubmit={handleLogin}>
        <h2>Login</h2>

        <div className="box">
          <label htmlFor="nome">Usuário</label>
          <input
            type="text"
            name="usuario"
            required
            maxLength="15"
            value={nomeUsuario}
            onChange={(e) => setNomeUsuario(e.target.value)}
          />
        </div>

        <div className="box">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            name="senha"
            required
            maxLength="13"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        {mensagemErro && <p className="mensagem-erro error-text">{mensagemErro}</p>}

        <button type="submit" className="entrar">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          ENTRAR
        </button>
      </form>
    </div>
  );
}

export default Loginesenha;