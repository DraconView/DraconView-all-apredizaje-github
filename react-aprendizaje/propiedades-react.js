-------------------- Propiedades - jonmircha CAP5 ----------------------
- string se pasan entre comillas dobles
- numeros se pasan entre llaves {}
- bolean se pasan entre llaves {}
- arreglos se pasan entre llaves {[1,2,3]}
- objetos se pasan entre dobles llaves {{nombre:"jon",correo:"xx"}}
- elementos elementoReact={<i>elemento react</i>}
- funcion = {(num) => num * num} en el componente {props.arreglo.map(props.funcion).join(", ")}

pasar un atributo name al componente
<Welcome name="Jon" />
<Welcome name="Irma" />

props se recibidas en el constructor de la clase:
class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <h1>{this.props.name}</h1>;
  }
}

en una función, las props se reciben como un parámetro de la función:
const Welcome = (props) => {
  return <h1>{props.name}</h1>;
};

---------------------------------------------------------------------

import React from "react";
import PropTypes from "prop-types";

export default function Propiedades(props) { // aqui props(recibe los parametros)
  return (
    <div>
      <h2>{props.porDefecto}</h2>
      <ul>
        <li>{props.cadena}</li>
        <li>{props.numero}</li>
        <li>{props.booleano ? "Verdadero" : "Falso"}</li>
        <li>{props.arreglo.join(", ")}</li>
        <li>{props.objeto.nombre + " - " + props.objeto.correo}</li>
        <li>{props.arreglo.map(props.funcion).join(", ")}</li>
        <li>{props.elementoReact}</li>
        <li>{props.componenteReact}</li>
      </ul>
    </div>
  );
}

Propiedades.defaultProps = {
  porDefecto: "Las Props",
};

Propiedades.propTypes = {
  numero: PropTypes.number.isRequired,
};