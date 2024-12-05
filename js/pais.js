class Pais{
    constructor(nombre,capital,circuito,poblacion,forma_gobierno,coordenadas_circuito,religion){
        this.nombre=nombre;
        this.capital=capital;
        this.poblacion=poblacion;
        this.circuito=circuito;
        this.forma_gobierno=forma_gobierno;
        this.coordenadas_circuito=coordenadas_circuito;
        this.religion=religion;
    }

    setInfoBasica(nombre,capital,poblacion){
        this.nombre=nombre;
        this.capital=capital;
        this.poblacion=poblacion;
    }
    
    setInfoAdiccional(circuito,forma_gobierno,coordenadas_circuito,religion){
        this.circuito=circuito;
        this.forma_gobierno=forma_gobierno;
        this.coordenadas_circuito=coordenadas_circuito;
        this.religion=religion;
    }

    getNombre(){
        return this.nombre;
    }

    getCapital(){
        return this.capital;
    }

    getInfoSecundaria(){
        return "<ul>"+
        "<li>Circuito: "+this.circuito+"</li>"+
        "<li>Poblacion:"+this.poblacion+"</li>"+
        "<li>Forma de Gobierno: "+this.forma_gobierno+"</li>"+
        "<li>Religión: "+this.religion+"</li>"+
        "</ul>"
    }

    writeCoordenadas(){
        document.write("<p>Coordenadas Circuito: "+this.coordenadas_circuito+"</p>");
    }

    mostrarTiempo(){
        var coord = this.coordenadas_circuito.split(",");
        var latitud=coord[0];
        var longitud=coord[1];
        var key="63cbeef64cd79027a5fe00f63181d23e";
        var url="https://api.openweathermap.org/data/2.5/forecast?lat="+latitud+"&lon="+longitud+"&appid="+key+"&units=metric&lang=es&mode=json";

        $.ajax({
            dataType: "json", // Cambiado a JSON
            url: url,
            method: 'GET',
            success: function(datos) {
                // Agrupar pronósticos por día
                $("body").append("<section></section>");
                datos.list.forEach(function(item) {
                    var fecha = new Date(item.dt_txt);
    
                    // Filtrar solo pronósticos de las 09:00
                    var hora = fecha.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });
                    if (hora === "09:00") {
                        // Obtén el nombre del día
                        var dia = fecha.toLocaleDateString("es-ES", {  weekday: 'long',day: 'numeric', month: 'numeric' });
    
                        // Extraer datos del clima
                        var temperatura = item.main.temp;
                        var tempMin = item.main.temp_min ;
                        var tempMax = item.main.temp_max ;
                        var humedad = item.main.humidity + "%";
                        var lluvia=  item.rain && item.rain["3h"] ? item.rain["3h"] :0;
                        var icono = item.weather[0].icon;
    
                        // Crear contenido HTML
                        var contenidoHTML = "<article>";
                        contenidoHTML += "<h3>" + dia + "</h3>";
                        contenidoHTML += "<img src='https://openweathermap.org/img/wn/" + icono + "@2x.png' />";
                        contenidoHTML += "<p>Temperatura: " + temperatura + " ºC</p>";
                        contenidoHTML += "<p>Temperatura Mínima: " + tempMin + " ºC</p>";
                        contenidoHTML += "<p>Temperatura Máxima: " + tempMax + " ºC</p>";
                        contenidoHTML += "<p>Humedad: " + humedad + "</p>";
                        contenidoHTML += "<p>Lluvia: " + lluvia + " L/m&sup2</p>";
                        contenidoHTML += "</article>";
    
                        $("section").append(contenidoHTML);
                    }
                });
            },
            error: function(xhr, status, error) {
                console.log("Error en la solicitud:", status, error);
                $("body").append("<h3>¡Tenemos problemas! No puedo obtener datos de <a href='http://openweathermap.org'>OpenWeatherMap</a></h3>");
            }
        });
            /*
            success: function(datos){
                
                
                    //Presentación del archivo XML en modo texto
                    //$("h5").text((new XMLSerializer()).serializeToString(datos));
                
                    //Extracción de los datos contenidos en el XML
                    

                  
                    var temperatura           = $('temperature',datos).attr("value");
                    var temperaturaMin        = $('temperature',datos).attr("min");
                    var temperaturaMax        = $('temperature',datos).attr("max");
                    var temperaturaUnit       = $('temperature',datos).attr("unit");
                    var humedad               = $('humidity',datos).attr("value");
                    var humedadUnit           = $('humidity',datos).attr("unit");
                    var precipitacionValue    = $('precipitation',datos).attr("value");
                    var precipitacionMode     = $('precipitation',datos).attr("mode");
                    
                    var stringDatos =  "<ul>";
                        stringDatos += "<li>Temperatura: " + temperatura + " grados Celsius</li>";
                        stringDatos += "<li>Temperatura mínima: " + temperaturaMin + " grados Celsius</li>";
                        stringDatos += "<li>Temperatura máxima: " + temperaturaMax + " grados Celsius</li>";
                        stringDatos += "<li>Temperatura (unidades): " + temperaturaUnit + "</li>";
                        stringDatos += "<li>Humedad: " + humedad + " " + humedadUnit + "</li>";
                        stringDatos += "<li>Precipitación valor: " + precipitacionValue + "</li>";
                        stringDatos += "<li>Precipitación modo: " + precipitacionMode + "</li>";
                    
                    $("p:last").html(stringDatos);                  
                },
            error:function(){
                $("h3").html("¡Tenemos problemas! No puedo obtener XML de <a href='http://openweathermap.org'>OpenWeatherMap</a>"); 
                $("h4").remove();
                $("h5").remove();
                $("p").remove();
                }
                */
        
    }
}