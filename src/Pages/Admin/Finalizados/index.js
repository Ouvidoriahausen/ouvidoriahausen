import "../adminChamados.css"
import { useContext, useEffect } from 'react'
import { Content } from '../../../components/layout/Content'
import Admin, { AdminGlobal } from '..'
import { Button, TextField } from '@mui/material'
import { useLoadChamados } from "../utils/loadChamadosNaoRespondidos"

export default function Finalizados() {

    const { resposta, setResposta, handleRespond } = useContext(AdminGlobal)

    const { chamadosNaoRespondidos, loadChamadosNaoRespondidos } = useLoadChamados();

    const statusPage = "Finalizado"
    useEffect(() => {
        loadChamadosNaoRespondidos(statusPage)
    }, [loadChamadosNaoRespondidos, statusPage]);


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
                            <Button onClick={() => handleRespond(chamado.id, resposta)}>Enviar</Button>
                        </div>
                    ))}
                </section>
            </Content>
        </Admin>
    )
}
