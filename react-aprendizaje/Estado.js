* conjunto de variables que intervienen en los componente
segun lo que entiendo setState() toma lo que hay en la variable y le agrega 

import React, { Component } from "react";

function EstadoAHijo(props) {
  return (
    <div>
      <h3>{props.contadorHijo}</h3>
    </div>
  );
}

export default class Estado extends Component { // los componentes basados en clases necesitan su metodo render
  constructor(props) { // aqui en donde se definen los estados en las clases 
    super(props); // contructor del cual hereda 
    this.state = {  // aqui se crea el objeto del estado
      contador: 0,
    };

    /* setInterval(() => {
      //this.state.contador += 1;
      this.setState({
        contador: this.state.contador + 1,
      });
    }, 1000); */
  }

  render() {
    return (
      <div>
        <h2>El State</h2>
        <p>{this.state.contador}</p>
        <EstadoAHijo contadorHijo={this.state.contador} />
      </div>
    );
  }
}

-----------------------------------------------------
ESTADO CON CLASES => canal HolaMundo
import React from 'react'; 
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
	state = { 				// se define estado que contiene las variables
	contador: 0, 			// inicializa en 0
	}
	incrementar = () => { 	// método que actualiza la variable contador
	this.setState({ contador: this.state.contador + 1 })
	}
	
render() {
const { contador } = this.state

return (
<div className="App">
<header className="App-header">
<img src={logo} className="App-logo" alt="logo" />
<p>
{contador} // contador Se imprime dentro de la etiqueta P
</p>
<button onclick={this.incrementar}>Incrementar</button> // ejecuta incrementar() 
</header>
</div>
);
}
}
export default App;

	/* 	cambiando propiedad de clase a un método el valor del this no va a ser el mismo
	incrementar() { 	
	this.setState({ contador: this.state.contador + 1 })
	} 
	es mejor implementar el componente como función abajo se explica
	*/

-----------------------------------------------------
ESTADO CON funciones => canal HolaMundo 

import React, { useState } from 'react'; // se agregó user useState
import logo from './logo.svg';
import './App.css';

	function App() {
	const [contador, setContador] = useState(0) // valor inicial en 0, useState retorna un arreglo,contador(el primero es el valor que contiene el estado) ,setContador(el segundo contiene una función que permite actualizar el estado anterior)

	const incrementar = () => {
	setContador(contador + 1)
	}
	return (
	<div className="App">
		<header className="App-header">
			<img src={logo} className="App-logo" alt="logo" />
			<p>
			{contador}
			</p>
			<button onclick={incrementar}>Incrementar</button>
		</header>
	</div>
);
}
export default App;

---------------------------------------------------------------

import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const useContador = () => {
	const [contador, setContador] = useState(0)
	const incrementar = () => {
	setContador(contador + 1)
	}
	return { contador, incrementar }
}

// extrayendo valores para pasarlos a la función app

function App() {
	const { contador, incrementar } = useContador()
	
	return (
		<div className="App">
		<header className="App-header">
		<img src={logo} className="App-logo" alt="logo" />
		<p>
		{ contador}
		</p>
		<button onclick={incrementar}>Incrementar</button>
		</header>
		</div>
	);
}
export default App;

-----------------------------------------------------------
 Pasar valores externos a la función
 
 
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const useContador = inicial => { // se inserto inicial
	const [contador, setContador] = useState(inicial) // se inserto inicial
	const incrementar = () => {
	setContador(contador + 1)
	}
	return { contador, incrementar }
}

// extrayendo valores para pasarlos a la función app

function App() {
	const { contador, incrementar } = useContador(0) // se defivio en 0 
	
	return (
		<div className="App">
		<header className="App-header">
		<img src={logo} className="App-logo" alt="logo" />
		<p>
		{ contador}
		</p>
		<button onclick={incrementar}>Incrementar</button>
		</header>
		</div>
	);
}
export default App;

