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