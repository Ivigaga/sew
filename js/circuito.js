class Circuito {
  constructor() {
    this.doesApiWork = window.File && window.FileReader && window.FileList && window.Blob;
    this.self = this;
  }

  leerArchivoTexto(files) {
    var s = this.self;
    var archivo = files[0];
    var nombreXML = "kml";
    var extension = archivo.name.split(".").pop();

    var areaVisualizacion = document.querySelector("body p:last-of-type");
    areaVisualizacion.innerText = "";
    var div = document.querySelector("body div");
    div.innerHTML = "";

    var svg = document.querySelector("body svg");
    if (svg != null) {
      document.querySelector("body").removeChild(svg);
    }

    var article = document.querySelector("body article");
    if (article != null) {
      document.querySelector("body").removeChild(article);
    }
    //Solamente admite archivos de tipo texto
    var tipoTexto = /text.*/;
    var tipoSVG = /svg.*/;
    if (this.doesApiWork) {
      if (archivo.type.match(tipoTexto)) {
        var lector = new FileReader();
        lector.onload = function (evento) {
          const xmlString = lector.result;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlString, "text/xml");
          var xmlFormated = s.formatXML(xmlDoc);

        }
        lector.readAsText(archivo);
      }
      else if (extension == nombreXML) {
        var lector = new FileReader();
        lector.onload = function (evento) {
          var texto = lector.result;
          s.readKml(texto);
        }
        lector.readAsText(archivo);
      }
      else if (archivo.type.match(tipoSVG)) {
        var lector = new FileReader();
        lector.onload = function (evento) {
          const svgContent = lector.result; // Contenido del archivo SVG
          // Limpiar contenido previo y agregar el SVG
          svg = document.createElement("svg");
          svg.innerHTML = svgContent;
          document.querySelector("body").insertBefore(svg, document.querySelector("body div"));
        }
        lector.readAsText(archivo);
      }
      else {
        areaVisualizacion.innerText = "Error : ¡¡¡ Archivo no válido !!!";
      }
    }
  };


  readKml(texto) {
    var lineas = texto.split("\r\n");
    var areCoordinates = false;
    var coordenadas = [];
    for (let i = 0; i < lineas.length; i++) {
      if (lineas[i] == "<coordinates>") {
        areCoordinates = true;
      }
      if (lineas[i] == "</coordinates>") {
        areCoordinates = false;
      }
      if (areCoordinates && lineas[i] != "<coordinates>") {
        var puntos = lineas[i].split(",");
        coordenadas.push({ lat: parseFloat(puntos[1]), lng: parseFloat(puntos[0]) });
      }
    }
    this.initMap(coordenadas);
  }


  initMap(coordinates) {
    const map = new google.maps.Map(document.querySelector("body div"), {
      zoom: 15,
      center: coordinates[0],
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });
    const flightPlanCoordinates = coordinates;
    const flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    flightPath.setMap(map);
  }

  formatXML(xml) {
    var s = this.self;
    var texto = "";
    var nodes = xml.documentElement.children;
    var nodes = xml.documentElement.children;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      texto += s.formatNodes(node, 3);
    }
    var a = document.createElement("article");
    a.innerHTML = texto;
    document.querySelector("body").insertBefore(a, document.querySelector("body div"));

  }


  formatNodes(node, cabecera) {
    var s = this.self;
    var text = "";
    
    if (node.children.length > 0) {
      text += "<h" + (cabecera ) + ">" + node.nodeName + "</h" + (cabecera ) + ">";
      var childs = node.children;

      for (var i = 0; i < childs.length; i++) {
        text += s.formatNodes(childs[i], cabecera + 1);
      }
    }else{
      if(node.nodeName=="foto"){
        text+="<img src=xml/"+node.attributes[0].textContent+" />"
      }else if(node.nodeName=="video"){
        text+="<video controls preload='auto'>";
        text+="<source src=xml/"+node.attributes[0].textContent;
        text+=" type='video/mp4' />";
        text+="</video>";
      }else if(node.nodeName=="referecia"){
        text+="<p><a href=node.textContent" +" >"+node.textContent+"</a></p>";
      }else{
        text+="<p>"+node.nodeName+": "+node.textContent;
        if(node.attributes.length>0){
          for (var i = 0; i < node.attributes.length; i++) {
            text += " "+node.attributes[i].textContent;
          }
        }
        text+="</p>";
      }
      
    }
    return text;
  }
}