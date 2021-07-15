---------------------- COMPONENTES ------------------------
--------------- jonmircha curso react CAP4 ----------------

- los datos fluyen en una sola direccion de padre a hijo

- los datos se pasan por Props

- es recomendable al nombre del archivo en la carpeta 
  de componentes empezarlos con OperCamelCase
  
- para usar los componentes en otros archivos
	import Componente from "./components/Componente";

- la etiqueta del componente debe ir dentro de la etiqueta <section>(despues de la etiqueta header)
- <Componente nmPropiedad="hola" /> //paso de propiedades desde el App.js

import React, { Component } from "react"; // aplica a todos los ejemplos

- componente basado en clases casi ya no se usa // ejemplo 1
	class Componente extends Component { 
	render() {
	return <h2>{this.props.msg}</h2>;
	}
	}
	export default Componente; // se puede llamar sin la destructuracion

- componente funcional // ejemplo 2
	function Componente(props) { 
	return <h2>{props.msg}</h2>;
	}
	export default Componente; // se puede llamar sin la destructuracion

- componente funcion expresada
	const Componente = (props) => <h2>{props.msg}</h2>; // (props) =>(arrows funtion que recibe la props, y tiene edentro un return implicito)
	export default Componente; // se puede llamar sin la destructuracion

