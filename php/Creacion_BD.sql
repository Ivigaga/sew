-- Eliminar la base de datos y tablas si existen
DROP DATABASE IF EXISTS Carreras;

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS Carreras CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Usar la base de datos recién creada
USE Carreras;

-- Eliminar las tablas si existen
DROP TABLE IF EXISTS podios;
DROP TABLE IF EXISTS pilotos;
DROP TABLE IF EXISTS carreras;
DROP TABLE IF EXISTS escuderias;
DROP TABLE IF EXISTS temporadas;

-- Crear las tablas
CREATE TABLE IF NOT EXISTS temporadas (
    ID INT PRIMARY KEY,
    Year YEAR(4) NOT NULL
);

CREATE TABLE IF NOT EXISTS carreras (
    ID INT PRIMARY KEY,
    Fecha DATE NOT NULL,
    Circuito VARCHAR(32) NOT NULL,
    TemporadaID INT NOT NULL,
    FOREIGN KEY (TemporadaID) REFERENCES temporadas(ID)
);

CREATE TABLE IF NOT EXISTS escuderias (
    ID INT PRIMARY KEY,
    Nombre VARCHAR(32) NOT NULL,
    Pais VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS pilotos (
    ID INT PRIMARY KEY,
    Nombre VARCHAR(32) NOT NULL,
    EscuderiaID INT NOT NULL,
    Nacionalidad VARCHAR(32) NOT NULL,
    FOREIGN KEY (EscuderiaID) REFERENCES escuderias(ID)
);

CREATE TABLE IF NOT EXISTS podios (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    CarreraID INT NOT NULL,
    PilotoID INT NOT NULL,
    Posicion ENUM('1','2','3') NOT NULL,
    FOREIGN KEY (CarreraID) REFERENCES carreras(ID),
    FOREIGN KEY (PilotoID) REFERENCES pilotos(ID)
);

-- Insertar valores predeterminados para las temporadas
INSERT INTO temporadas (`ID`, `Year`) VALUES
(1, '2024');

-- Insertar valores predeterminados para las escuderías
INSERT INTO escuderias (`ID`, `Nombre`, `Pais`) VALUES
(1, 'Ferrari', 'Italia'),
(2, 'Red Bull', 'Austria'),
(3, 'Mercedes', 'Alemania'),
(4, 'McLaren', 'Reino Unido'),
(5, 'Williams', 'Reino Unido'),
(6, 'Visa CashApp RB', 'Italiana'),
(7, 'Alpine', 'Francia'),
(8, 'Aston Martin', 'Reino Unido'),
(9, 'Haas', 'Estados Unidos'),
(10, 'Sauber', 'Suiza');

-- Insertar valores predeterminados para los pilotos
INSERT INTO pilotos (`ID`, `Nombre`, `EscuderiaID`, `Nacionalidad`) VALUES
(1, 'Charles Leclerc', 1, 'Monegasca'),
(2, 'Max Verstappen', 2, 'Neerlandesa'),
(3, 'Lewis Hamilton', 3, 'Británica'),
(4, 'Franco Colapinto', 5, 'Argentina'),
(5, 'Daniel Ricciardo', 6, 'Australiana'),
(6, 'Lando Norris', 4, 'Británica'),
(7, 'Pierre Gasly', 7, 'Francesa'),
(8, 'Sergio Pérez', 2, 'Mejicana'),
(9, 'Fernando Alonso', 8, 'Española'),
(10, 'Lance Stroll', 8, 'Canadiense'),
(11, 'Kevin Magnussen', 9, 'Danesa'),
(12, 'Yuki Tsunoda', 6, 'Japonesa'),
(13, 'Alexander Albon', 5, 'Británica'),
(14, 'Guanyu Zou', 10, 'China'),
(15, 'Niko Hülkenberg', 9, 'Alemana'),
(16, 'Esteban Ocon', 7, 'Francesa'),
(17, 'Carlos Sainz', 1, 'Española'),
(18, 'George Russell', 3, 'Británica'),
(19, 'Valtteri Botas', 10, 'Finlandesa'),
(20, 'Oscar Piastri', 4, 'Australiana');

-- Insertar valores predeterminados para las carreras
INSERT INTO carreras (`ID`, `Fecha`, `Circuito`, `TemporadaID`) VALUES
(1, '2024-03-02', 'Bahrain International Circuit', 1),
(2, '2024-03-09', 'Jeddah Corniche Circuit', 1),
(3, '2024-03-24', 'Albert Park Grand Prix Circuit', 1),
(4, '2024-04-07', 'Suzuka Circuit', 1),
(5, '2024-04-21', 'Shanghai International Circuit', 1),
(6, '2024-05-05', 'Miami International Autodrome', 1),
(7, '2024-05-19', 'Autodromo Enzo e Dino Ferrari', 1),
(8, '2024-05-26', 'Circuit de Monaco', 1),
(9, '2024-06-09', 'Circuit Gilles-Villeneuve', 1),
(10, '2024-06-23', 'Circuit de Barcelona-Catalunya', 1),
(11, '2024-06-30', 'Red Bull Ring', 1),
(12, '2024-07-07', 'Silverstone Circuit', 1),
(13, '2024-07-21', 'Hungaroring', 1),
(14, '2024-07-28', 'Circuit de Spa-Francorchamps', 1),
(15, '2024-08-25', 'Circuit Zandvoort', 1),
(16, '2024-09-01', 'Autodromo Nazionale Monza', 1),
(17, '2024-09-15', 'Baku City Circuit', 1),
(18, '2024-09-22', 'Marina Bay Street Circuit', 1),
(19, '2024-10-20', 'Circuit of The Americas', 1),
(20, '2024-10-27', 'Autódromo Hermanos Rodríguez', 1),
(21, '2024-11-03', 'Autódromo José Carlos Pace', 1),
(22, '2024-11-24', 'Las Vegas Strip Circuit', 1),
(23, '2024-12-01', 'Lusail International Circuit', 1),
(24, '2024-12-08', 'Yas Marina Circuit', 1);

-- Insertar valores predeterminados para los podios
INSERT INTO podios (`ID`, `CarreraID`, `PilotoID`, `Posicion`) VALUES
(2, 1, 2, '1'),
(3, 1, 8, '2'),
(4, 1, 17, '3'),
(5, 2, 2, '1'),
(6, 2, 8, '2'),
(7, 2, 1, '3'),
(8, 3, 17, '1'),
(9, 3, 1, '2'),
(10, 3, 6, '3'),
(11, 4, 2, '1'),
(12, 4, 8, '2'),
(13, 4, 17, '3'),
(14, 5, 2, '1'),
(15, 5, 6, '2'),
(16, 5, 8, '3'),
(17, 6, 6, '1'),
(18, 6, 2, '2'),
(19, 6, 1, '3'),
(20, 7, 2, '1'),
(21, 7, 6, '2'),
(22, 7, 1, '3'),
(23, 8, 1, '1'),
(24, 8, 20, '2'),
(25, 8, 17, '3'),
(26, 9, 2, '1'),
(27, 9, 6, '2'),
(28, 9, 18, '3'),
(29, 10, 2, '1'),
(30, 10, 6, '2'),
(31, 10, 3, '3'),
(32, 11, 18, '1'),
(33, 11, 20, '2'),
(34, 11, 17, '3'),
(35, 12, 3, '1'),
(36, 12, 2, '2'),
(37, 12, 6, '3'),
(38, 13, 20, '1'),
(39, 13, 6, '2'),
(40, 13, 3, '3'),
(41, 14, 3, '1'),
(42, 14, 20, '2'),
(43, 14, 1, '3'),
(44, 15, 6, '1'),
(45, 15, 2, '2'),
(46, 15, 1, '3'),
(47, 16, 1, '1'),
(48, 16, 20, '2'),
(49, 16, 6, '3'),
(50, 17, 20, '1'),
(51, 17, 1, '2'),
(52, 17, 18, '3'),
(53, 18, 6, '1'),
(54, 18, 2, '2'),
(55, 18, 20, '3'),
(56, 19, 1, '1'),
(57, 19, 17, '2'),
(58, 19, 2, '3'),
(59, 20, 17, '1'),
(60, 20, 6, '2'),
(61, 20, 1, '3'),
(62, 21, 2, '1'),
(63, 21, 16, '2'),
(64, 21, 7, '3'),
(65, 22, 18, '1'),
(66, 22, 3, '2'),
(67, 22, 17, '3'),
(68, 23, 2, '1'),
(69, 23, 1, '2'),
(70, 23, 20, '3'),
(71, 24, 6, '1'),
(72, 24, 17, '2'),
(73, 24, 1, '3');