/*

Pasos para implementar el algoritmo:
1. Configuración básica
2. Determinar el ganador
3. IA Básica y notificar el ganador
4. Algoritmo de Minimax

*/

/*
Matriz que se encargara de ver que hay
en cada cuadro del tablero, si se trata
de una X, O o nada.

*/
var tableroOriginal;


//Jugador
const jugador = 'O';

//Inteligencia
const inteligencia = 'X';

/*
Creacion de una matriz que va a tener
las combinaciones ganadoras en el 
tablero.
Dentro de aquí cada uno va a ser una 
matriz por lo que es un conjunto
completo de matrices.
*/

const CombosGanadores = [
	[0, 1, 2], 
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

/* Haremos la consulta de todos los 
cuadros que tienen la clase cell*/
const cells = document.querySelectorAll('.cell');

//Funcion para iniciar el juego
iniciarJuego();

//Definición de la función
function iniciarJuego(){
	document.querySelector(".finJuego").style.display= "none";
	tableroOriginal = Array.from(Array(9).keys());
	//console.log(tableroOriginal);
	
	//Pondremos las celdas vacias.
	for (var i = 0; i < cells.length;i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		
		cells[i].addEventListener('click', turnClick, false);
	}
}

//Obtenemos el id de nuestro cuadro en el tablero
//Y le vamos a asignar el valor del jugador en la casilla
function turnClick(square){
	if (typeof tableroOriginal[square.target.id] == 'number'){
		turn(square.target.id, jugador); 
		if (!revisarEmpate()) turn(bestSpot(), inteligencia);

	}


}

//Definicion de la función turn para el jugador la cual
// Pondrá el valor del jugador en la casilla cuando se de clic
function turn(squareId, jugador){
	tableroOriginal[squareId] = jugador;
	document.getElementById(squareId).innerText = jugador;
	let juegoGanado = revisarGanador(tableroOriginal, jugador);

	if (juegoGanado) {
		gameOver(juegoGanado);
	}
}

function revisarGanador(tablero, jugador){
	/* 
		Funcion para encontrar todos los lugares del
		tablero que ya se han seleccionado
	*/
	let jugadas = tablero.reduce((a, e, i) => 
		(e === jugador) ? a.concat(i): a, []);
	let juegoGanado = null;
	
	/*Con un buble, comparo las casillas seleccionadas
	del jugador con las combinaciones ganadoras
	*/
	for(let [index, ganador] of CombosGanadores.entries()){
		if (ganador.every(elem => jugadas.indexOf(elem) > -1)){
			juegoGanado = {index: index, jugador: jugador};
			break;

		} 
	}

	return juegoGanado;
}


function gameOver(juegoGanado){
	for(let index of CombosGanadores[juegoGanado.index]){
		document.getElementById(index).style.backgroundColor = 
		juegoGanado.jugador == jugador ? "blue" : "red";
	}

	for(var i = 0; i < cells.length; i++){	
		cells[i].removeEventListener('click', turnClick, false);
	}

	declararGanador(juegoGanado.jugador == jugador ? "Has ganado humano!" : "Has perdido humano, no mereces ser llamado vivir");
}

function declararGanador(quien){
	document.querySelector(".finJuego").style.display = "block";
	document.querySelector(".finJuego .texto").innerText = quien;
}


function cuadrosVacios(){
	return tableroOriginal.filter(s => typeof s == 'number');
}

function bestSpot(){
	return cuadrosVacios()[0];
}

function revisarEmpate(){
	if (cuadrosVacios().length == 0) {
		for(var i =0; i < cells.length; i++){
			cells[i].style.backgroundColor = "orange";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declararGanador("Empate!");
		return true;
	}	
	return false;
}