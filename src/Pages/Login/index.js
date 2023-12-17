import './login.css';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from "@mui/lab"
import { IoClose } from "react-icons/io5";
import { useUserType } from '../../hooks/useUserType';

export default function Login() {

  const [nomeUsuario, setNomeUsuario] = useState("")
  const email = `${nomeUsuario}@hausen.com`; // Mantém o domínio fictício
  const [senha, setSenha] = useState("")

  const [displayOverlay, setDisplayOverlay] = useState(true)
  const { FazerLogin, signed, loadingAuth } = useContext(AuthContext)
  const navigate = useNavigate()
  const userType = useUserType()

  useEffect(() => {
    if (signed) {
      if (userType === "comum") {
        navigate("/chamados")
      } else if (userType === "admin" || "master") {
        navigate("/admin")
      }
    }
  }, [signed, userType]);


  const closeOverlay = () => {
    setDisplayOverlay(false);
  };

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

      {displayOverlay && (
        <div className='overlay'>
          <span className="overlay-close-bg" onClick={closeOverlay} />
          <div className='overlay-content'>
            <p>Sinta-se seguro ao fazer seu relato, você está totalmente anônimo e protegido.</p>

            <IconButton color="error" size="large" onClick={closeOverlay} className="close-button">
              <IoClose size={20} />
            </IconButton>
          </div>
        </div>
      )}

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