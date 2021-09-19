
FUNCIONES NORMALES:

* cuando se necesita trabajar con varias líneas es que se abren las llaves

* function saludo() {console.log("como estas")}
	saludo()
	salida: como estas

* function saludar2(a){console.log(`hola como estas ${a}`)}
	saludar2("perro")
	salida: hola como estas perro

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

* function sumar(a,b){let recibe = a +b; console.log(`la suma de a y b es ${recibe}`)};
	sumar(5,6)
	salida: la suma de a y b es 11

------------------------------------------------------------------------------------
FUNCIONES FLECHA:

* let newFunction = (a,b) => {suma=a+b; console.log(`la suma es ${suma}`)}

* const funcionFlecha = () => { 		// multilinea
		return "hola";
	}
	salida: hola

* const funcionFlecha = () => "hola" 	// una linea
