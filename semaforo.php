<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta name="author" content="Iván García García" />
    <meta name="description" content="Juego de Memoria" />
    <meta name="keywords" content="F1,juegos, semáforo" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Datos que describen el documento -->
    <link rel="icon" href="multimedia/imagenes/icono.ico" sizes="48x48" 
        type="image/vnd.microsoft.icon">
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/semaforo.css" />
    <meta charset="UTF-8" />
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src="js/semaforo.js"></script>
    <title>F1 Desktop: Semáforo</title>
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
            <a title="Viajes" href="viajes.php">Viajes</a>
            <a title="Juegos" class="active" href="juegos.html">Juegos</a>
        </nav>
    </header>
    <p>Estás en <a title="Inicio" href="index.html">Inicio</a> | <a title="Juegos" href="juegos.html">Juegos</a>  | Semáforo</p>
    <ul>
        <li><a title="Memoria" href="memoria.html">Memoria</a></li>
        <li><a title="Semáforo" href="semaforo.php">Semáforo</a></li>
    </ul>
    <main>
    <script>
        var semaforo=new Semaforo();
    </script>
    
    </main>
<?php
class Record {
    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";
    }
}

if (count($_POST) > 0) {
    $record = new Record();
    $db = new mysqli($record->server, $record->user, $record->pass, $record->dbname);

    // Comprobar si ya existe el registro
    $consultaCheck = $db->prepare("SELECT * FROM registro WHERE nombre = ? AND apellidos = ? ");
    $consultaCheck->bind_param('ss', $_POST["nombre"], $_POST["apellido"]);
    $consultaCheck->execute();
    $resultado = $consultaCheck->get_result();
    $already_in=false;
    if ($resultado->num_rows >= 1) {
        
        while ($row = $resultado->fetch_array()) {
           if($row['nivel']==$_POST["dificultad"] && $row['tiempo']==$_POST["tiempo"]){
                $already_in=true;
                break;
           }
        }
    }
    $consultaCheck->close();
    if ($already_in==false) {
        // Si no existe, insertar el registro
        $consultaInsert = $db->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?,?,?,?)");
        $consultaInsert->bind_param('ssdd', $_POST["nombre"], $_POST["apellido"], $_POST["dificultad"], $_POST["tiempo"]);
        $consultaInsert->execute();
        $consultaInsert->close();
    }

    // Consultar el ranking
    $consultaRanking = $db->prepare("SELECT * FROM registro WHERE nivel = ? ORDER BY tiempo asc LIMIT 10");
    $consultaRanking->bind_param('d', $_POST["dificultad"]);
    $consultaRanking->execute();
    $resultadoRanking = $consultaRanking->get_result();

    if ($resultadoRanking->num_rows >= 1) {
        echo("<h3>Ranking</h3>");
        echo("<ol>");
        while ($row = $resultadoRanking->fetch_array()) {
            echo("<li> Nombre: " . $row['nombre'] . " Apellidos: " . $row['apellidos'] . " Dificultad: " . $row['nivel'] . " Tiempo: " . $row['tiempo'] . "s </li>");
        }
        echo("</ol>");
    }
    $consultaRanking->close(); // Cerrar la consulta
    $db->close();
}
?>

</body>
</html>