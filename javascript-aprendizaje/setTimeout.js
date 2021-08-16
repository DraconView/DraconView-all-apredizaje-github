* es una funcion que espera el tiempo indicado antes de ejecutar
ese callBack
* recurso para verificar asincronia
latentflip.com

http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D



	setTimeout(function() { 		// funcion anonima
	console.log("me tarde 2s");		// sale de segundo en pantalla
	},2000);

	console.log("Ejecutado");		// sale de primero en pantalla
	
	
	asi se le asigna nombre
	setTimeout(function nmFuncion() { 	
	console.log("me tarde 2s");		
	},2000);

	console.log("Ejecutado");
	
	nmFuncion();