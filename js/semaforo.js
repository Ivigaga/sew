class Semaforo {
    levels = [0.2, 0.5, 0.8];
    lights = 4;
    unload_moment = null;
    click_moment = null;

    constructor() {
        this.dificulty = this.levels[Math.floor(Math.random() * this.levels.length)];
        this.createStructure();
    }

    createStructure() {
        var main = document.querySelector('main');
        var titulo = document.createElement('h2');
        titulo.innerText = "Juego del Semáforo";
        main.appendChild(titulo);
        for (let i = 0; i < this.lights; i++) {
            var light = document.createElement("div");
            main.appendChild(light);
        }
        var btIniciar = document.createElement("button");
        btIniciar.innerText = "Iniciar";
        btIniciar.onclick = () => {
            this.initSequence();
        }
        var btParar = document.createElement("button");
        btParar.innerText = "Reacción";
        btParar.disabled = true;
        btParar.onclick = () => {
            this.stopReaction();
        }
        main.appendChild(btIniciar);
        main.appendChild(btParar);
        var parrafo=document.createElement("p");
        document.querySelector('main').appendChild(parrafo);
    }

    initSequence() {
        document.querySelector('main').classList.add('load');
        document.querySelector('main button:first-of-type').disabled = true;
        setTimeout(() => {
            this.unload_moment = new Date();
            this.endSequence();
        }, (this.dificulty * 100) + 2000);
    }

    endSequence() {

        document.querySelector('main').classList.add('unload');
        document.querySelector('main button:last-of-type').disabled = false;
    }

    stopReaction() {
        this.click_moment=new Date();
        var reactionTime = this.click_moment - this.unload_moment;
        var parrafo=document.querySelector("main p:last-of-type");
        document.querySelector('main').classList.remove('load');
        document.querySelector('main').classList.remove('unload');
        document.querySelector('main button:first-of-type').disabled = false;
        document.querySelector('main button:last-of-type').disabled = true;
        parrafo.innerText = "Tiempo de reacción: "+reactionTime+" ms";
        this.createRecordForm(reactionTime);
        
    }

    createRecordForm(time){
        var formulario="<form action='#' method= 'post' name='formulario'>";
        formulario+="<input type='text' name='nombre'/>";
        formulario+="<input type='text' name='apellido' />";
        formulario+="<input type='text' readonly name='dificultad' value="+this.dificulty+" />";
        formulario+="<input type='text' readonly name='tiempo' value="+time/1000+" />";
        formulario+="<input type='submit' value='Registrar'/>";
        $("main").append(formulario);
    }

}