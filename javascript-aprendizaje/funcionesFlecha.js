* cuando se necesita trabajar con varias líneas es que se abren las llaves

* function saludo() {console.log("como estas")}
	saludo()
	salida: como estas

* const funcionFlecha = () => { 		// multilinea
		return "hola";
	}
	salida: hola

* const funcionFlecha = () => "hola" 	// una linea

* function saludar2(a){console.log(`hola como estas ${a}`)}
	saludar2("perro")
	salida: hola como estas perro

* function sumar(a,b){let recibe = a +b; console.log(`la suma de a y b es ${recibe}`)};
	sumar(5,6)
	salida: la suma de a y b es 11

* funciones anidadas o alcanze funcional

	function funcion1() {
		var a = 2;

		function funcion3(){
			var b = 5;

			function funcion5() {
				console.log(a, b);
		}
			}
	}