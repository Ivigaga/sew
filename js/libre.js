
function dragstartHandler(ev) {
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
}
function dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}
function dropHandler(ev) {
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const data = ev.dataTransfer.getData("text/plain");
    if ("s_" + data == ev.target.id)
        ev.target.appendChild(document.getElementById(data));
    else if (ev.target.parentElement && "s_" + data == ev.target.parentElement.id)
        ev.target.parentElement.appendChild(document.getElementById(data));

    article = document.querySelector("article:last-of-type");
    if (article.children.length <= 0) {
        document.querySelector("body").removeChild(article);
        playAudio();
        drawMessage();
        window.onresize = function() {
            drawMessage(); // Redibujar el mensaje después de cambiar el tamaño
        };
    }
}

const audioFileName = 'mi_audio.mp3'; // Cambia esto al nombre de tu archivo MP3
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer = null; // Buffer para almacenar el audio cargado
let sourceNode = null; // Nodo fuente para reproducir el audio

function canPlayFormat(format) {
    const audio = new Audio();
    return audio.canPlayType(`audio/${format}`).replace(/^no/, '') !== '';
}

async function loadAudio() {
    try {
        var response;
        // Verificar si el navegador soporta MP3, si no, usar WAV
        if (canPlayFormat('mpeg')) {
            response = await fetch("multimedia/audio/completado.mp3"); // Descargar el archivo
        } else if (canPlayFormat('wav')) {
            response = await fetch("multimedia/audio/completado.wav"); // Descargar el archivo
        } else {
            throw new Error('Ningún formato de audio compatible encontrado');
        }

        const arrayBuffer = await response.arrayBuffer(); // Convertir a ArrayBuffer
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer); // Decodificar
    } catch (error) {
        console.error('Error al cargar el archivo de audio:', error);
    }
}

// Función para reproducir el audio
function playAudio() {
    // Crear el nodo fuente y asignar el buffer
    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;

    // Conectar el nodo fuente al destino de audio (altavoces)
    sourceNode.connect(audioContext.destination);

    // Iniciar la reproducción
    sourceNode.start();
}

function drawMessage() {
    var canvas = document.querySelector('body canvas');
    canvas.width = window.innerWidth-100;
    var canvas1 = canvas.getContext('2d');
    
    canvas1.font = 'italic 5vh sans-serif';
    canvas1.strokeStyle = "rgba(255, 0, 0, 1)";

    var message = "¡Has Ganado!";

    // Medir el ancho del texto
    var textWidth = canvas1.measureText(message).width;

    // Calcular la posición X y Y para centrar el texto
    var x = (canvas.width - textWidth) / 2; // Centrado horizontal
    var y = canvas.height / 2; // Centrado vertical (puedes ajustar esto si quieres un desplazamiento distinto)

    // Dibujar el texto centrado
    canvas1.strokeText(message, x, y);
}
