import "../adminChamados.css"
import { useEffect, useState } from 'react'
import { Content } from '../../../components/layout/Content'
import Admin from '..'
import { Button, TextField } from '@mui/material'
import { useLoadChamados } from "../utils/loadChamadosNaoRespondidos"
import useHandleRespond from "../utils/useHandleRespond"

export default function EmAberto() {

    const [resposta, setResposta] = useState("")
    const { handleRespond } = useHandleRespond()
    const { chamadosNaoRespondidos, loadChamadosNaoRespondidos } = useLoadChamados();

    const statusPage = "Aberto"
    useEffect(() => {
        loadChamadosNaoRespondidos(statusPage)
    }, [loadChamadosNaoRespondidos, statusPage]);

    const handleResponder = (chamadoID) => {
        handleRespond(chamadoID, resposta, setResposta)
    }

    return (
        <Admin>
            <Content className="chamados-container">
                <section className="cards-chamados-container">
                    {chamadosNaoRespondidos && chamadosNaoRespondidos.map((chamado) => (
                        <div key={chamado.id}>
                            <h3>{chamado.titulo}</h3>
                            <p>{chamado.descricao}</p>
                            <TextField
                                type="text"
                                placeholder="Resposta"
                                value={resposta}
                                onChange={(e) => setResposta(e.target.value)}
                            />
                            {chamado.fileURLs && chamado.fileURLs.map((image, index) => (
                                <div key={index}>
                                    <img src={image} width={100} alt='Chamado' />
                                </div>
                            ))}
                            <Button onClick={() => handleResponder(chamado.id)}>Enviar</Button>
                        </div>
                    ))}
                </section>
            </Content>
        </Admin>
    )
}
