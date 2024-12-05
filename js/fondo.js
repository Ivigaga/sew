class Fondo {
    constructor(pais, capital, circuito) {
        this.pais = pais;
        this.capital = capital;
        this.circuito = circuito;
    }

    obtenerImagen() {
        //"https://api.flickr.com/services/";
        (function () {
            var flickrAPI = "https://www.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
            $.getJSON(flickrAPI,
                {
                    tags: "montmelo,panorama,circuit",
                    tagmode: "all",
                    format: "json"
                })
                .done(function (data) {
                    // Accede directamente al primer elemento de data.items
                    const primeraImagen = data.items[0];
                    if (primeraImagen) {
                        $('body').css({
                            'background-image': 'url(' + primeraImagen.media.m.replace("_m","_b") + ')',
                            'background-repeat': 'no-repeat',
                            'background-size': 'cover',
                            'background-position': 'center center',
                            'height': '100vh'
                        });
                    }
                });
        })();
    }

}