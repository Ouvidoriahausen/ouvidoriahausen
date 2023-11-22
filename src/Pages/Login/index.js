import './style.css'
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';


function Login(){
    return(
        <div>
      
        <form className='login'>
          <h2>Fale conosco</h2>
          <FaUserCircle className='icon' />
          <div className='btns'>

          <Link to="/Loginesenha">
          <a className="botao_login" target="_blank" >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
            FAZER LOGIN
          </a>
          </Link>


          <Link to="/Cadastrar">
          <a className="botao_login" target="_blank">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
           CADASTRE-SE
          </a>
          </Link> 
       

          </div>
        
          
        </form>
      </div>
    )
}

export default Login