agregar ejercicios de asignar valores a las variables de react zulu cap03

- var(variables de ambito global no hace validaciones de duplicidad), pertenecen al objeto window

- let(variables de bloque) 

- const(valores fijos cuando son primitivos y modificables cuando son compuestos)

- valores primitivos(string, number, boolean, null, undefined, NaN)

- valores compuestos(object={}, array=[], function(){}, class{})

- agregar propiedades a los objetos {

let objeto = {
	nombre: "Jon",
	edad: 35
	}
console.log(objeto);
objeto.correo = "jonmircha@gmail.com";
console.log(objeto);
	
}	

- agregar valor a los array {

let colores = ["blanco", "negro", "azul");
console.log(colores);
colores.push("anaranjado");
console.log(colores);
	
}

- const su estado puede cambiar cuando su valor es compuesto, por que
  son una referencia 
  
- funcion normal {
	
	function sum(a, b) {
		return a + b
	}
	console.log(sum (3, 6))
	
}

- funcion flecha {
	
	function sum = (a, b) => {
		return a + b
	}
	console.log(sum (3, 6))

	//-------------------------------------------------------------------

	const materials = [
		'Hydrogen',
		'Helium',
		'Lithium',
		'Beryllium'
	  ];
	  
	  console.log(materials.map(material => material.length));
	  // expected output: Array [8, 6, 7, 9]
	
}

- template string {
	
	const sum = (a, b) => {
		return a + b
	}
	const a = 13
	const b = 26
	const result = sum(a, b)
	console.log(`La suma de: ${a} + ${b} = ${result}`)
	
}

--------------------------------------------------------------------------

console.log(numero);
console.log(typeof(numero));
numero = '7';
console.log(numero);
console.log(typeof(numero));
var x, y;																		// declarar mas variables en una linea
var a = 1, b = 'JavaScript';								// asiganar valores a las multiples variables en la misma linea
// console.log(window.numero);
var break;