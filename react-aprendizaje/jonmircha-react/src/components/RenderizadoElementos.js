import React, { Component } from "react";   //fijo 
import data from "../helpers/data.json";    //fijo cuando se impòrta data de un json 
// * cuando se renderizan elementos de manera dinamica se le debe asignar una llave unica(key)

function ElementoLista(props) {
  return (
    <li>
      <a href={props.el.web} target="_blank">
        {props.el.name}
      </a>
    </li>
  );
}

export default class RenderizadoElementos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seasons: ["Primavera", "Verano", "Otoño", "Invierno"],
    };
  }
  render() {
    //console.log(data);
    return ( // en este return hay 2 ejemplos   
      <div>
        <h2>Renderizado de Elementos</h2>
        <h3>Estaciones del Año</h3>
        <ol>
          {this.state.seasons.map((el, index) => (
            <li key={index}>{el}</li>
          ))}
        </ol>
        <h3>Frameworks Frontend JavaScript</h3>
        <ul>
          {data.frameworks.map((el) => ( //renderiza la data
            <ElementoLista key={el.id} el={el} /> //aqui se le pasa como key el id que tenga asignado el objeto sino se utiliza index(el numero de la posicion que ocupa por defecto ) 
          ))}
        </ul>
      </div>
    );
  }
}