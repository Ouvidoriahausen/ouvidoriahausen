import './home.css';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useState } from 'react';
import { LuFileText } from "react-icons/lu";

export default function Home() {

  const [terms, setTerms] = useState(true);

  return (
    <>
      {terms && 
  <section className="terms-container">
    <div className="terms-content">
      <div>
        <LuFileText size={100} />
        <h2>Nossos Termos</h2>
      </div>
      <div className="scrollable-content">
        <p>
          Prezados(a), <br></br> 
          Bem-vindo ao canal de Ouvidoria do Grupo Hausen! 
          <br></br>
          
          Esse canal foi criado para melhor atendê-lo.
          <br></br>
          
          Importante ressaltar que a Ouvidoria foi criada com o escopo de resguardar o sigilo e o anonimato dos nossos colaboradores, parceiros, fornecedores e clientes, uma vez que, neste ambiente você estará seguro para apresentar suas demandas, sem, contudo, ter de se identificar quando de seu cadastro. <br></br>
          Quanto a sua funcionalidade, a Ouvidoria se destina à representação de queixas e denúncias correlatas a fatos que envolvam o cotidiano da empresa e de seus colaboradores, oportunidade em que ao apresentar sua demanda, o colaborador poderá anexar arquivos que contenham fotografias e vídeos caso entenda que esses elementos possam ser utilizados para comprovar ou justificar sua reclamação/denúncia. <br></br>
          Para que o colaborador tenha acesso a plataforma da ouvidoria deverá, em primeiro momento, criar um cadastro. Ainda, ao escolher o seu login e a sua senha é importante que o reclamante anote os respectivos dados em lugar seguro, uma vez que não há possibilidade de resgate desses dados  por qualquer outro meio. Ademais, estas informações serão solicitadas todas as vezes em que o reclamante tenha o interesse de acompanhar o andamento de sua reclamação/denúncia. <br></br>
         Principalmente, caso o colaborador queira manter o anonimato quando de sua reclamação, não deverá, em NENHUMA HIPÓTESE, permitir, ao criar seu login, elementos que levem a sua identificação, tais como a utilização de seu nome, sobrenome, idade, características físicas, vulgos, apelidos e afins. Ex: Thaís27, Aninha42, Moreira33. <br></br>
         Após  a criação de um cadastro, o usuário terá acesso a página da Ouvidoria, local em que poderá, livremente, descrever todas as suas demandas e reclamações por intermédio de campo próprio destinado a respectiva finalidade. Além disso, nesse momento, o colaborador deverá <span>fazer o upload</span>  de todos os arquivos que entender necessários para a elucidação de seus apontamentos. <br></br>
          Finalizado o envio do relato, bem como dos documentos (opcionais) que o acompanham, o Setor de Ouvidoria terá um prazo máximo de 05 (cinco) dias úteis para, visualizar o relato do reclamante, momento em que a solicitação passará a ser considerada um processo administrativo, recebendo, inclusive, numeração própria.  <br></br>
          Importante mencionar que, em momento anterior a visualização do relato, caso o usuário entenda pela improcedência de seus apontamentos, poderá deletar integralmente sua reclamação/denúncia, assim como as fotografias e vídeos que acompanham o relato. <br></br>
           Lado outro, após a visualização do relato pelo Setor de Ouvidoria, o status da reclamação/denúncia deixará de ser “EM ABERTO” e passará a ser “EM ANDAMENTO”. A partir desse momento, o processo será obrigatoriamente analisado, ainda que o reclamante manifeste o desinteresse em prosseguir com sua reclamação/denúncia. <br></br>
          Importante que o reclamante relate suas demandas com o máximo de detalhes que sejam pertinentes a situação apontada. Isso porque, nos casos de ausência de informações necessárias, será aberto novo prazo para que o reclamante proceda o envio de informações complementares, com o objetivo de auxiliar na elucidação dos fatos apontados na reclamação/denúncia. A insistência de relatos que não contenham informações mínimas que possibilitem uma análise da situação poderá desencadear na finalização do processo administrativo, sem, contudo, apresentar uma decisão que contenha análise do mérito. <br></br>
          Para os casos em que o relato contenha todas as informações necessárias, o Setor de Ouvidoria terá prazo de até 90 (noventa) dias úteis, prorrogáveis, apenas uma vez, por igual período, para proceder uma investigação interna e apresentar uma resposta a demanda previamente apresentada, ocasião em que o status da reclamação/denúncia passará a ser “FINALIZADA”. <br></br>
          Perpassado  o período de 15 (quinze) dias corridos, sem que o reclamante  se manifeste quanto a resposta apresentada, o processo será arquivado definitivamente, passando a apresentar o status “ARQUIVADO”. <br></br>
          Ressalta-se que a Ouvidoria deve ser utilizada nos casos em que as reclamações/denúncias apresentem nível elevado de gravidade, não devendo ser confundida com ferramentas de pesquisas, como: pesquisa de clima, ou mesmo um Reclame Aqui. Outrossim, as mencionadas ferramentas serão disponibilizadas para nossos colaboradores em canal diverso. <br></br>
          Por fim, frisa-se que o corpo técnico responsável pela condução da Ouvidoria preza pela imparcialidade, transparência e confidencialidade, razão pela qual todas as informações utilizadas ao longo dos processos administrativos serão mantidas em absoluto sigilo. <br></br>
        </p>
      </div>
      <Button variant="contained" fullWidth color="thirty" size="large" onClick={() => setTerms(false)}>Aceitar</Button>
    </div>
  </section>
}
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

          <Link className="saiba-mais" to="/Saiba">
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