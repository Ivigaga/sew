class Noticias {

    constructor() {
        this.doesApiWork = window.File && window.FileReader && window.FileList && window.Blob;
        this.self = this;
    }

    readInputFile(files) {
        var s = this.self;
        if (this.doesApiWork) {
            var file = files[0];
            var tipoTexto = /text.*/;
            if (file.type.match(tipoTexto)) {
                var lector = new FileReader();

                lector.onload = function (evento) {
                    var texto = lector.result;
                    var noticias = texto.split("\n");

                    // Llama al método mostrarNoticias aquí
                    s.mostrarNoticias(noticias);
                }
                lector.readAsText(file);
            }
            else {
                errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
            }
        }
    }

    mostrarNoticias(noticias) {
        noticias.forEach(noticia => {
            var partes = noticia.split("_");
            var articulo = "<article>"
            for (let i = 0; i < partes.length; i++) {
                if (i == 0) {
                    articulo += "<h4>" + partes[i] + "</h4>";
                } else {
                    articulo += "<p>" + partes[i] + "</p>";
                }

            }
            articulo += "</article>"
            $("section").append(articulo);
        });
    }

    addNews() {
        var titulo = $('body p:nth-of-type(3) input').val();  // Campo Título
        var autor = $('body p:nth-of-type(4) input').val();    // Campo Autor
        var contenido = $('body textarea').val();  // Campo Contenido

        if (titulo.trim() != "" && autor.trim() != "" && contenido.trim() != "") {
            var noticia = [titulo+"_"+contenido+"_"+autor];
            this.mostrarNoticias(noticia);
        }
    }
}