


<!DOCTYPE html>
<html lang="es">
<?php
// Clase para la gestión de la base de datos y archivos CSV
class Database {
    

    public function __construct() {
        $this->servername = "localhost";
        $this->username = "DBUSER2024";
        $this->password = "DBPSWD2024";
        $this->sqlFile = 'Creacion_BD.sql'; // Ruta del archivo SQL para crear la base de datos y tablas
        $this->databaseName = "carreras";
    }

    public function createDatabase() {
        $db = new mysqli($this->servername, $this->username, $this->password);

        // Leer el archivo SQL
        $sqlFile = 'Creacion_BD.sql'; // Ruta al archivo SQL
        if (!file_exists($sqlFile)) {

        }

        $sql = file_get_contents($sqlFile);
        if ($sql === false) {

        }

        // Ejecutar las sentencias SQL
        $queries = explode(";", $sql);
        foreach ($queries as $query) {
            $query = trim($query);
            if (!empty($query)) {
                if (!$db->query($query)) {
                }
            }
        }

        $db->close();
    }

    public function importCSV($csvFile) {
        $db = new mysqli($this->servername, $this->username, $this->password, $this->databaseName);

        // Verificar conexión
        if ($db->connect_error) {
           
        }

        // Leer el archivo CSV
        if (($handle = fopen($csvFile, "r")) !== FALSE) {
            $currentTable = null;
            $columns = [];

            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                // Identificar el nombre de la tabla en la línea de cabecera
                if (count($data) > 1 && in_array($data[0], ['Carreras', 'Escuderias', 'Pilotos', 'Podios', 'Temporadas'])) {
                    $currentTable = strtolower($data[0]); // Convertir a minúsculas para evitar problemas de sintaxis
                    $columns = array_slice($data, 1); // Guardar los nombres de las columnas
                    continue;
                }

                // Insertar datos en la tabla correspondiente
                if ($currentTable && !empty($columns)) {
                    $placeholders = implode(",", array_fill(0, count($columns), "?"));
                    $insertQuery = "INSERT INTO $currentTable (" . implode(",", $columns) . ") VALUES ($placeholders)";

                    $stmt = $db->prepare($insertQuery);

                    if ($stmt) {
                        $types = str_repeat("s", count($data)); // Asumimos que todos los datos son cadenas
                        $stmt->bind_param($types, ...$data);

                        if (!$stmt->execute()) {
                            
                        }

                        $stmt->close();
                    } else {
                       
                    }
                }
            }

            fclose($handle);
        } else {
           
        }

        $db->close();
    }
    
    // Función para insertar los datos en la tabla
    private function insertDataIntoTable($db, $table, $columns, $values) {
        $insertQuery = "INSERT INTO $table (" . implode(",", $columns) . ") VALUES " . implode(",", $values);
    }
    

    public function exportCSV($csvFile) {
        $db = new mysqli($this->servername, $this->username, $this->password, $this->databaseName);

        // Verificar conexión
        if ($db->connect_error) {
            
        }

        $tables = ['carreras', 'escuderias', 'pilotos', 'podios', 'temporadas'];
        $output = fopen($csvFile, 'w');

        foreach ($tables as $table) {
            // Obtener los datos de la tabla
            $result = $db->query("SELECT * FROM $table");

            if ($result) {
                // Escribir el encabezado con el nombre de la tabla
                $columns = array_keys($result->fetch_assoc());
                fputcsv($output, array_merge([ucfirst($table)], $columns));

                // Reiniciar el puntero del resultado y escribir los datos
                $result->data_seek(0);
                while ($row = $result->fetch_assoc()) {
                    fputcsv($output, array_values($row));
                }

                $result->close();
            } else {
               
            }
        }

        fclose($output);
        $db->close();
    }

    public function getPodiumStatsByPilot() {
        $db = new mysqli($this->servername, $this->username, $this->password, $this->databaseName);
    
        // Query para obtener todos los pilotos y contar sus podios, incluso si no tienen
        $totalPodiosQuery = "
            SELECT 
                p.ID AS PilotoID, p.Nombre AS Piloto, 
                COUNT(po.ID) AS TotalPodios
            FROM 
                pilotos p
            LEFT JOIN podios po ON p.ID = po.PilotoID
            LEFT JOIN carreras c ON po.CarreraID = c.ID
            LEFT JOIN temporadas t ON c.TemporadaID = t.ID
            WHERE 
                t.Year = (SELECT MAX(Year) FROM temporadas)
            GROUP BY 
                p.ID
            ORDER BY 
                TotalPodios DESC
        ";
    
        $resultTotal = $db->query($totalPodiosQuery);
        if (!$resultTotal) {
            die("Error en la consulta de total podios: " . $db->error);
        }
    
        $totalPodios = [];
        // Inicializamos a todos los pilotos con 0 podios, victorias, segundos y terceros
        while ($row = $resultTotal->fetch_assoc()) {
            $totalPodios[$row['PilotoID']] = [
                'Piloto' => $row['Piloto'],
                'TotalPodios' => $row['TotalPodios'],
                'Victorias' => 0,
                'Segundos' => 0,
                'Terceros' => 0
            ];
        }
    
        $resultTotal->close();
    
        // Ahora, para obtener victorias, segundos y terceros, usamos LEFT JOIN para incluir a los pilotos sin podios
        $posicionesQueries = [
            'Victorias' => "'1'",
            'Segundos' => "'2'",
            'Terceros' => "'3'"
        ];
    
        foreach ($posicionesQueries as $key => $posicion) {
            $queryPos = "
                SELECT 
                    p.ID AS PilotoID, COUNT(po.ID) AS {$key}
                FROM 
                    pilotos p
                LEFT JOIN podios po ON p.ID = po.PilotoID
                LEFT JOIN carreras c ON po.CarreraID = c.ID
                LEFT JOIN temporadas t ON c.TemporadaID = t.ID
                WHERE 
                    t.Year = (SELECT MAX(Year) FROM temporadas) AND po.Posicion = {$posicion}
                GROUP BY 
                    p.ID
            ";
    
            $resultPos = $db->query($queryPos);
            if (!$resultPos) {
              
            }
    
            while ($row = $resultPos->fetch_assoc()) {
                // Actualizamos las estadísticas de cada piloto
                $totalPodios[$row['PilotoID']][$key] = $row[$key];
            }
    
            $resultPos->close();
        }
    
        $db->close();
        return $totalPodios;
    }
    
    

    public function displayPodiumStats() {
        // Obtener las estadísticas de podios por piloto
        $podiumStats = $this->getPodiumStatsByPilot();
    
        echo "<table id='estadisticas-podios'>";
        echo "<thead><tr><th></th><th scope='col' id='podios'>Total Podios</th><th scope='col' id='victorias'>Victorias</th><th scope='col' id='segundos'>Segundos</th><th scope='col' id='terceros'>Terceros</th></tr></thead>";
        echo "<tbody>";

        foreach ($podiumStats as $id => $stat) {
            // Reemplazar espacios por guiones bajos en el nombre del piloto
            $formattedName = str_replace(' ', '_', $stat['Piloto']);
            
            echo "<tr>";
            echo "<th id='" . $formattedName . "' scope='row'>" . $stat['Piloto'] . "</th>";
            echo "<td headers='" . $formattedName . " podios' >" . $stat['TotalPodios'] . "</td>";
            echo "<td headers='" . $formattedName . " victorias' >" . $stat['Victorias'] . "</td>";
            echo "<td headers='" . $formattedName . " segundos' >" . $stat['Segundos'] . "</td>";
            echo "<td headers='" . $formattedName . " terceros' >" . $stat['Terceros'] . "</td>";
            echo "</tr>";
        }
    
        // Cerrar la tabla HTML
        echo '</table>';
    }
    
    
}

// Ejemplo de uso del código

try {
    // Crear una instancia de la clase Database
    $dataBase = new Database();
    
    $dataBase->createDatabase();
    if (count($_POST) > 0) {
            if (isset($_POST['csv_import'])) {
                $csvFile = $_POST['csv_import'];
                $dataBase->importCSV($csvFile);
            }

            // Exportar base de datos a CSV
            if (isset($_POST['export_csv'])) {
                $csvFile = 'export.csv'; // Ruta donde guardar el archivo exportado
                $dataBase->exportCSV("db.csv");
            }

            $_POST = array(); // Limpiar $_POST
        }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>

<head>
    <meta name="author" content="Iván García García" />
    <meta name="description" content="Podios" />
    <meta name="keywords" content="F1,Estadísticas" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Datos que describen el documento -->
    <link rel="icon" href="multimedia/imagenes/icono.ico" sizes="48x48" 
        type="image/vnd.microsoft.icon">
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <meta charset="UTF-8" />
    <title>F1 Desktop: Podios</title>
</head>
<body>
<header>
        <!-- Datos con el contenidos que aparece en el navegador -->
        <h1><a title="Inicio" href="../index.html">F1 Desktop</a></h1>
        <nav>
            <a title="Inicio" href="../index.html">Inicio</a>
            <a title="Piloto" href="../piloto.html">Piloto</a>
            <a title="Notocias" href="../noticias.html">Noticias</a>
            <a title="Calendario" href="../calendario.html">Calendario</a>
            <a title="Meteorología" href="../meteorologia.html">Meteorología</a>
            <a title="Circuito" href="../circuito.html">Circuito</a>
            <a title="Viajes" href="../viajes.php">Viajes</a>
            <a title="Juegos" class="active" href="../juegos.html">Juegos</a>
        </nav>
    </header>
    <p>Estás en <a title="Inicio" href="../index.html">Inicio</a> | <a title="Juegos" href="../juegos.html">Juegos</a>  | Podios</p>
    <h2>Podios</h2>
    <ul>
        <li><a title="Memoria" href="../memoria.html">Memoria</a></li>
        <li><a title="Semáforo" href="../semaforo.php">Semáforo</a></li>
        <li><a title="Unión" href="../union.html">Unión</a></li>
        <li><a title="Podios" href="podios.php">Podios</a></li>
    </ul>
    <!-- Formulario para importar CSV -->
    <h3>Importar CSV</h3>
    <form action="#" method="POST">
        <label for="csv_import">Selecciona un archivo CSV para importar:</label>
        <input type="file" name="csv_import" id="csv_import" accept=".csv" required>
        <button type="submit">Importar CSV</button>
    </form>


    <!-- Formulario para exportar la base de datos a CSV -->
    <h3>Exportar Base de Datos a CSV</h3>
    <form action="#" method="POST">
        <button type="submit" name="export_csv">Exportar Base de Datos a CSV</button>
    </form>
    <h3>Podios Pilotos</h3>
    <?php
       $databse= new Database();
       $dataBase->displayPodiumStats();
    ?>

</body>
</html>