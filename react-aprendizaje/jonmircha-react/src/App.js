import logo from './logo.svg';
import './App.css';
import Componente from './components/Componente';
import Propiedades from './components/Propiedades';
import Estado from "./components/Estado";
import RenderizadoCondicional from "./components/RenderizadoCondicional";
import RenderizadoElementos from "./components/RenderizadoElementos";

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <section>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Componente msg="Hola soy un Componente Funcional Expresado desde una prop" />
        <Propiedades
          cadena="esto es una cadena"
          numero={19}
          booleano={true}
          arreglo={[1,2,3]}
          objeto={{nombre:"jon",correo:"xx"}}
          elementoReact={<i>elemento react</i>}
          funcion = {(num) => num * num}
          componenteReact={
            <Componente msg="Soy un componente pasado como Prop" />
          }
        />
         <hr />
          <Estado />
          <hr />
          <RenderizadoCondicional />
          <hr />
          <RenderizadoElementos />
          <hr />
        </section>
      </header>
      <section>
        
        
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </section>
    </div>
  );
}

export default App; 
