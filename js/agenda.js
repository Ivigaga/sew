class Agenda {
    constructor() {
        this.url = "https://api.jolpi.ca/ergast/f1/current";
    }

    mostrarCarreras() {
        $.ajax({
            dataType: "json", // Cambiado a JSON
            url: this.url,
            method: 'GET',
            success: function (datos) {
                $("body").append("<table><caption>Agenda Temporada Actual</caption></table>");
                $("table").append("<tr></tr>");
                $("table tr").append("<th scope='col' id='carreras'>Carreras</th>");
                $("table tr").append("<th scope='col' id='circuito'>Circuito</th>");
                $("table tr").append("<th scope='col' id='latitud'>Latitud</th>");
                $("table tr").append("<th scope='col' id='longitud'>Longitud</th>");
                $("table tr").append("<th scope='col' id='día'>Día</th>");
                $("table tr").append("<th scope='col' id='hora'>Hora</th>");

                datos.MRData.RaceTable.Races.forEach(function (race) {
                    var name = race.raceName;
                    var circuit = race.Circuit;
                    var cName = circuit.circuitName;
                    var lat = circuit.Location.lat;
                    var long = circuit.Location.long;

                    // Convertir la fecha y hora al formato español
                    var date = new Date(race.date + "T" + race.time);
                    var day = date.toLocaleDateString("es-ES"); // Formato "día/mes/año"
                    var hour = date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }); // Formato "hh:mm"

                    var row = "<tr>";
                    var id = name.replace(/\s/g, "");

                    row += "<th scope='row' id='" + id + "'>" + name + "</th>";
                    var header = id + " circuito";
                    row += "<td headers='" + header + "'>" + cName + "</td>";
                    header = id + " latitud";
                    row += "<td headers='" + header + "'>" + lat + "</td>";
                    header = id + " longitud";
                    row += "<td headers='" + header + "'>" + long + "</td>";
                    header = id + " día";
                    row += "<td headers='" + header + "'>" + day + "</td>";
                    header = id + " hora";
                    row += "<td headers='" + header + "'>" + hour + "</td></tr>";

                    $("table").append(row);
                });
                $("button").attr("disabled","disabled");
            }
            
        });
    }
}

// Crear una instancia de la clase Agenda y almacenarla en una variable global
const agenda = new Agenda();
