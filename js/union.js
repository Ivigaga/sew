class Union {
    constructor() {
        this.sourceNode = null; // Nodo fuente para reproducir el audio
        this.audioContext = null;
        this.audioBuffer = null;

        // Inicializamos la clase y los eventos
        this.init();
    }

    init() {
        // Asignar eventos táctiles y de arrastre a los elementos
        this.assignDragAndDropEvents();
    }

    assignDragAndDropEvents() {
        const draggableItems = document.querySelectorAll("article h4");
        const droppableSections = document.querySelectorAll("article section");

        // Asignamos eventos para dispositivos táctiles y de mouse
        draggableItems.forEach(item => {
            item.addEventListener('dragstart', (ev) => this.dragstartHandler(ev));
            item.addEventListener('touchstart', (ev) => this.touchstartHandler(ev)); // Para táctiles
        });

        droppableSections.forEach(section => {
            section.addEventListener('dragover', (ev) => this.dragoverHandler(ev));
            section.addEventListener('drop', (ev) => this.dropHandler(ev));
            section.addEventListener('touchmove', (ev) => this.touchmoveHandler(ev)); // Para táctiles
            section.addEventListener('touchend', (ev) => this.touchendHandler(ev)); // Para táctiles
        });
    }

    dragstartHandler(ev) {
        if (this.audioBuffer == null) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        ev.dataTransfer.setData("text/plain", ev.target.id);
        ev.dataTransfer.effectAllowed = "move";
    }

    dragoverHandler(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }

    dropHandler(ev) {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("text/plain");
        if ("s_" + data == ev.target.id) {
            var encabezado = ev.target.querySelector("h4");
            if (encabezado != null) ev.target.removeChild(encabezado);
            ev.target.appendChild(document.getElementById(data));
        } else if (ev.target.parentElement && "s_" + data == ev.target.parentElement.id) {
            ev.target.parentElement.appendChild(document.getElementById(data));
            var encabezado = ev.target.parentElement.querySelector("h4");
            if (encabezado != null) ev.target.parentElement.removeChild(encabezado);
        }

        this.checkAndPlayAudio();
    }

    // Eventos táctiles
    touchstartHandler(ev) {
        ev.preventDefault();
        const targetId = ev.target.id;
        this.draggedElement = document.getElementById(targetId);
    }

    touchmoveHandler(ev) {
        ev.preventDefault();
        if (this.draggedElement) {
            let touch = ev.touches[0];
            this.draggedElement.style.position = 'absolute';
            this.draggedElement.style.left = `${touch.pageX - this.draggedElement.offsetWidth / 2}px`;
            this.draggedElement.style.top = `${touch.pageY - this.draggedElement.offsetHeight / 2}px`;
        }
    }

    touchendHandler(ev) {
        ev.preventDefault();
        const touch = ev.changedTouches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);

        if (target && target.matches('section')) {
            target.appendChild(this.draggedElement);
        }
        this.draggedElement.style.position = 'static'; // Restaurar la posición
        this.checkAndPlayAudio();
    }

    checkAndPlayAudio() {
        let article = document.querySelector("body article:last-of-type");
        if (article.children.length <= 0) {
            document.querySelector("body").removeChild(article);
            this.playAudio();
            this.drawMessage();
            window.onresize = () => {
                this.drawMessage(); // Redibujar el mensaje después de cambiar el tamaño
            };
        }
    }

    canPlayFormat(format) {
        const audio = new Audio();
        return audio.canPlayType(`audio/${format}`).replace(/^no/, '') !== '';
    }

    loadAudioFromElement() {
        const audioElement = document.querySelector("body audio");
        if (!audioElement) {
            console.error("Elemento <audio> no encontrado.");
            return;
        }

        const mediaElementSource = this.audioContext.createMediaElementSource(audioElement);
        mediaElementSource.connect(this.audioContext.destination);

        console.log("Audio listo para reproducir.");
    }

    playAudio() {
        const audioElement = document.querySelector("body audio");
        if (!audioElement) {
            console.error("Elemento <audio> no encontrado.");
            return;
        }

        if (this.audioContext.state === "suspended") {
            this.audioContext.resume();
        }

        audioElement.play().catch((error) => {
            console.error("Error al reproducir el audio:", error);
        });
    }

    drawMessage() {
        const canvas = document.querySelector('body canvas');
        canvas.width = window.innerWidth - 100;
        const canvas1 = canvas.getContext('2d');

        canvas1.font = 'italic 5vh sans-serif';
        canvas1.strokeStyle = "rgba(255, 0, 0, 1)";

        const message = "¡Has Ganado!";

        const textWidth = canvas1.measureText(message).width;
        const x = (canvas.width - textWidth) / 2;
        const y = canvas.height / 2;

        canvas1.strokeText(message, x, y);
    }
}
