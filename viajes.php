<!DOCTYPE HTML>

<html lang="es">
<?php
class Carrusel{
    public function __construct($pais,$capital){
        $this->pais=$pais;
        $this->capital=$capital;
    }

    public function generatePhotos(){
        $url="https://www.flickr.com/services/feeds/photos_public.gne?";
        $url.='&tags='. $this->pais;
        $url.= '&per_page=10';
        $url.= '&format=json';
        $url.= '&nojsoncallback=1';
        $respuesta = file_get_contents($url);
        return json_decode($respuesta);
    }
}

class Moneda{
    public function __construct($local,$cambio){
        $this->local=$local;
        $this->cambio=$cambio;
    }

    public function obtenerCambioDeMoneda(){
        $key="cb32e2e3f50dd6ae22f0b25c";
        $url="https://v6.exchangerate-api.com/v6/";
        $url.=$key;
        $url.="/pair";
        $url.="/".$this->cambio;
        $url.="/".$this->local;
        $response_json = file_get_contents($url);
        $response = json_decode($response_json);
        print "<h3> Cambio de Moneda </h3>";
        print "<p> 1 ".$this->cambio ." --> " . $response->conversion_rate. " " .$this->local." </p>";
    }
}
    
?>
<head>
    <meta name="author" content="Iván García García" />
    <meta name="description" content="Viajes" />
    <meta name="keywords" content="F1,viajes" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Datos que describen el documento -->
    <link rel="icon" href="multimedia/imagenes/icono.ico" sizes="48x48" type="image/vnd.microsoft.icon">
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/carrusel.css" />
    <meta charset="UTF-8" />
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script 
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU" async defer></script>
    <script src="js/viajes.js"></script>
    <title>F1 Desktop: Viajes</title>
</head>

<body>
    <header>
        <!-- Datos con el contenidos que aparece en el navegador -->
        <h1><a title="Inicio" href="index.html">F1 Desktop</a></h1>
        <nav>
            <a title="Inicio" href="index.html">Inicio</a>
            <a title="Piloto" href="piloto.html">Piloto</a>
            <a title="Notocias" href="noticias.html">Noticias</a>
            <a title="Calendario" href="calendario.html">Calendario</a>
            <a title="Meteorología" href="meteorologia.html">Meteorología</a>
            <a title="Circuito" href="circuito.html">Circuito</a>
            <a title="Viajes" class="active" href="viajes.php">Viajes</a>
            <a title="Juegos" href="juegos.html">Juegos</a>
        </nav>
    </header>
    <p>Estás en <a title="Inicio" href="index.html">Inicio</a> | Viajes </p>
    <h2>Viajes</h2>
    <?php
        $moneda=new Moneda('EUR','USD');
        $moneda->obtenerCambioDeMoneda();
    ?>
    <h3>Mapas</h3>
    <button onclick="viajes.getMapaEstaticoGoogle()">Mostrar mapa estático</button>
    <button onclick="viajes.initMap()">Mostrar mapa interactivo</button>
    <div id="mapa" ></div>
    <article>
        <?php
        $carrusel=new Carrusel("Spain","Madrid");
        $fotos=$carrusel->generatePhotos();
        print "<article>";
        print "<h3>Carrusel de Imágenes</h3>";
        for($i=0;$i<10;$i++){
            $imgSrc = $fotos->items[$i]->media->m;
            print "<img alt='Imagen de España' src=\"$imgSrc\" />";
        } 
        print "</article>";
        ?>
        <button> &gt; </button>
        <button> &lt; </button>
    </article>
    
    <script>
        // Inicializamos la clase Viajes
        var viajes = new Viajes();
        viajes.createCarrusel();
    </script>
    
</body>
</html>