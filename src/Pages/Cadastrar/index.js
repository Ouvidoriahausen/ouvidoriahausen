import './cadastrar.css';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Box, Button, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export default function Cadastrar() {
  const [nomeUsuario, setNomeUsuario] = useState("")
  const email = `${nomeUsuario}@hausen.com`;
  const [senha, setSenha] = useState("")

  const { Cadastrar, signed, loadingAuth } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (signed) {
      navigate("/meus-chamados")
    }
  }, [signed]);


  async function handleRegister(e) {
    e.preventDefault()

    if (nomeUsuario !== "" && email !== "" && senha !== "") {
      await Cadastrar(email, senha, nomeUsuario)
    }
    else {
      toast.error("Preencha todos os campos!")
    }
  }

  return (
    <div className="container-center">
      <Box className="form-cadastro" component="form" onSubmit={handleRegister}>
        <h2>Faça seu cadastro</h2>

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

        {nomeUsuario.length !== 0 && <span style={{ color: "red" }}>Para preservação do sigilo, evite colocar dados pessoais.</span>}

        {loadingAuth ? (
          <LoadingButton loading size="large" className="cadastrar-btn" variant='contained'>Cadastrar</LoadingButton>
        ) : (
          <Button size="large" type="submit" className="cadastrar-btn" variant='contained'>Cadastrar</Button>
        )}

        <div className="noLoginContainer">
          <span>Já tem uma conta ? <Link to="/login" className="noLogin">Faça login</Link></span>
        </div>
      </Box>
    </div>
  );
}