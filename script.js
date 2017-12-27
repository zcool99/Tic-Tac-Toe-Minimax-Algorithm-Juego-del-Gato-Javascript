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
const hujugador = 'O';

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
	console.log(tableroOriginal);
	
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
		turn(square.target.id, hujugador); 
		if (!revisarEmpate(tableroOriginal, hujugador) && !revisarEmpate()) turn(bestSpot(), inteligencia);
	}


}

//Definicion de la función turn para el jugador la cual
// Pondrá el valor del jugador en la casilla cuando se de clic
function turn(squareId, player){
	tableroOriginal[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let juegoGanado = revisarGanador(tableroOriginal, player);

	if (juegoGanado) {
		gameOver(juegoGanado);
	}
}

function revisarGanador(tablero, jugadorh){
	/* 
		Funcion para encontrar todos los lugares del
		tablero que ya se han seleccionado
	*/
	let jugadas = tablero.reduce((a, e, i) => 
		(e === jugadorh) ? a.concat(i): a, []);
	let juegoGanado = null;
	
	/*Con un buble, comparo las casillas seleccionadas
	del jugador con las combinaciones ganadoras
	*/
	for(let [index, ganador] of CombosGanadores.entries()){
		if (ganador.every(elem => jugadas.indexOf(elem) > -1)){
			juegoGanado = {index: index, jugador: jugadorh};
			break;

		} 
	}

	return juegoGanado;


}


function gameOver(juegoGanado){
	for(let index of CombosGanadores[juegoGanado.index]){
		document.getElementById(index).style.backgroundColor = 
		juegoGanado.jugador == hujugador ? "blue" : "red";
	}

	for(var i = 0; i < cells.length; i++){	
		cells[i].removeEventListener('click', turnClick, false);
	}

	declararGanador(juegoGanado.jugador == hujugador ? "Has ganado humano!" : "Has perdido humano, no mereces vivir");
}

function declararGanador(quien){
	document.querySelector(".finJuego").style.display = "block";
	document.querySelector(".finJuego .texto").innerText = quien;
}


function cuadrosVacios(){
	return tableroOriginal.filter(s => typeof s == 'number');
}

function bestSpot(){
	return minimax(tableroOriginal, inteligencia).index;

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


function minimax(nuevoTablero, player) {
	//Obtendremos los puntos disponibles en el tablero
	var puntosDisponible = cuadrosVacios(nuevoTablero);

	/* Comparamos los estados terminales, y devolvemos los 
	valores 
	Si tira el humano el valor será -10
	si tira la IA el valor será positivo 10
	o si ya no tenemos más casillas el valor será 0
	*/
	if (revisarGanador(nuevoTablero, hujugador)) {
		return {score: -10};
	} else if (revisarGanador(nuevoTablero, inteligencia)) {
		return {score: 10};
	} else if (puntosDisponible.length === 0) {
		return {score: 0};
	}

	//Capturamos los datos obtenidos
	var movimientos = [];
	//Hacemos el recorrido de cada punto obtenido
	for (var i = 0; i < puntosDisponible.length; i++) {
		var move = {};
		move.index = nuevoTablero[puntosDisponible[i]];
		nuevoTablero[puntosDisponible[i]] = player;

		if (player == inteligencia) {
			//Recursividad de minimax
			var resultado = minimax(nuevoTablero, hujugador);
			move.score = resultado.score;
		} else {
			//Recursividad de minimax
			var resultado = minimax(nuevoTablero, inteligencia);
			move.score = resultado.score;
		}

		nuevoTablero[puntosDisponible[i]] = move.index;

		movimientos.push(move);
	}

	var mejorMovimiento;

	if(player === inteligencia) {
		var mejorPunto = -10000;
		for(var i = 0; i < movimientos.length; i++) {
			if (movimientos[i].score > mejorPunto) {
				mejorPunto = movimientos[i].score;
				mejorMovimiento = i;
			}
		}
	} else {
		var mejorPunto = 10000;
		for(var i = 0; i < movimientos.length; i++) {
			if (movimientos[i].score < mejorPunto) {
				mejorPunto = movimientos[i].score;
				mejorMovimiento = i;
			}
		}
	}
	//Devolvemos el mejor movimiento
	return movimientos[mejorMovimiento];
}

