Números (Numbers)
* no muchos tipos de datos numeros solo 1
let a = 2;									//									
let b = new Number(1); 						// contructor de number
let c = 7.19;
let d = "5.6";
console.log(a, b);
console.log(c.toFixed(5)); 					// determina la cantidd de decimales que va tener un valor (1)		
console.log(parseInt(c));
console.log(parseFloat(c));
console.log(typeof c, typeof d);
console.log(a + b);
console.log(c + parseInt(d);
console.log(c + parseFloat(d));
console.log(c + Number.parseInt(d));
console.log(c + Number.parseFloat(d));