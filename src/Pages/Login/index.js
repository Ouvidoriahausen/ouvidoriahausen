import './login.css';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Box, Button, TextField } from '@mui/material';
import { LoadingButton } from "@mui/lab"

export default function Login() {

  const [nomeUsuario, setNomeUsuario] = useState("")
  const email = `${nomeUsuario}@hausen.com`; // Mantém o domínio fictício
  const [senha, setSenha] = useState("")

  const { FazerLogin, signed, loadingAuth } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (signed) {
      navigate("/meus-chamados")
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
    <div className="container-center">
      <Box className="form-login" component="form" onSubmit={handleLogin}>
        <h2>Faça seu login</h2>

        <TextField
          type="text"
          label="Nome de usuário"
          required
          variant="standard"
          value={nomeUsuario}
          fullWidth
          onChange={(e) => setNomeUsuario(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          variant="standard"
          required
          value={senha}
          fullWidth
          onChange={(e) => setSenha(e.target.value)}
        />

        {loadingAuth ?
          <LoadingButton loading size="large" type="submit" className="acessar-btn" variant='contained'>Acessar</LoadingButton>
          :
          <Button size="large" type="submit" className="acessar-btn" variant='contained'>Acessar</Button>
        }
        <div className="noLoginContainer">
          <span>Não tem uma conta ? <Link to="/cadastrar" className="noLogin">Faça seu cadastro</Link></span>
        </div>
      </Box>
    </div>
  );
}