class Viajes {
    constructor() {
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }
    getPosicion(posicion) {
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;
        this.precision = posicion.coords.accuracy;
        this.altitud = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo = posicion.coords.heading;
        this.velocidad = posicion.coords.speed;
        this.pos=posicion;
    }
    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "El usuario no permite la petición de geolocalización"
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "Información de geolocalización no disponible"
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de geolocalización ha caducado"
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido"
                break;
        }
    }
    getMapaEstaticoGoogle() {

        var img = document.createElement("img");
        var apiKey = "&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU";
        var url = "https://maps.googleapis.com/maps/api/staticmap?";
        var centro = "center=" + this.latitud + "," + this.longitud;
        var zoom = "&zoom=15";
        var tamaño = "&size=800x600";
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
        var sensor = "&sensor=false";

        var imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
        img.setAttribute("src", imagenMapa);  // Usando setAttribute para src
        img.setAttribute("alt", 'mapa estático google');
        document.querySelector("body ").querySelector("div").insertAdjacentElement("afterend",img);
        document.querySelector('body').removeChild(document.querySelector('button'));
    }

    initMap() {
        const centro={lat: this.latitud, lng: this.longitud};
        // Inicializar el mapa de Google Maps
        const mapaGeoposicionado = new google.maps.Map(document.getElementById('mapa'), {
            zoom: 8,
            center: centro, 
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        const infoWindow = new google.maps.InfoWindow; 
        infoWindow.setPosition({lat: this.latitud, lng: this.longitud});
        infoWindow.setContent("Localización encontrada");
        infoWindow.open(mapaGeoposicionado);
        mapaGeoposicionado.setCenter(centro);
    }

    handleLocationError(browserHasGeolocation, infoWindow, pos, mapaGeoposicionado) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            "Error: Ha fallado la geolocalización" :
            "Error: Su navegador no soporta geolocalización");
        infoWindow.open(mapaGeoposicionado);
    }

    createCarrusel(){
        var slides=document.querySelectorAll("img");
        var nextSlide = document.querySelector("article button:first-of-type");
        var prevSlide = document.querySelector("article button:last-of-type");
        // current slide counter
        let curSlide = 3;
        // maximum number of slides
        let maxSlide = slides.length - 1;
        nextSlide.addEventListener("click", function () {
            // check if current slide is the last and reset current slide
            if (curSlide === maxSlide) {
              curSlide = 0;
            } else {
              curSlide++;
            }
          
            //   move slide by -100%
            slides.forEach((slide, indx) => {
                var trans = 100 * (indx - curSlide);
              $(slide).css('transform', 'translateX(' + trans + '%)')
            });
          });

          prevSlide.addEventListener("click", function () {
            // check if current slide is the first and reset current slide to last
            if (curSlide === 0) {
              curSlide = maxSlide;
            } else {
              curSlide--;
            }
          
            //   move slide by 100%
            slides.forEach((slide, indx) => {
                var trans = 100 * (indx - curSlide);
              $(slide).css('transform', 'translateX(' + trans + '%)')
            });
          });
    }
        
}

