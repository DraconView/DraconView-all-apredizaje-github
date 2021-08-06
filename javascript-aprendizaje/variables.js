agregar ejercicios de asignar valores a las variables de react zulu cap03

- var(variables globales no hace validaciones de duplicidad)

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