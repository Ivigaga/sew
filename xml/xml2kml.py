import xml.etree.ElementTree as ET

def obtenerCoordenadas(archivo):
    try:

        arbol = ET.parse(archivo)

    except IOError:
        print ('No se encuentra el archivo ', archivo)
        exit()

    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivo)
        exit()

    raiz=arbol.getroot()
    ns = '{http://www.uniovi.es}'
    coordenadas=[]
    longitud=raiz.find(ns+"coordenadas/"+ns+"longitud")
    latitud=raiz.find(ns+"coordenadas/"+ns+"latitud")
    altitud=raiz.find(ns+"coordenadas/"+ns+"altitud")
    ls=longitud.text
    las=latitud.text
    als=altitud.text
    coordenadas.append((float(ls),float(las),int(als)))
    for tramo in raiz.findall(ns+"tramos/"+ns+"tramo"):

        longitud=tramo.find(ns+"coordenadas_tramo/"+ns+"longitud_tramo")
        latitud=tramo.find(ns+"coordenadas_tramo/"+ns+"latitud_tramo")
        altitud=tramo.find(ns+"coordenadas_tramo/"+ns+"altitud_tramo")
        ls=longitud.text
        las=latitud.text
        als=altitud.text
        coordenadas.append((float(ls),float(las),int(als)))

    return coordenadas

def coordenadasKML(archivo,nombre):
    coordenadas=obtenerCoordenadas(nombre)
    for coordenada in coordenadas:
        archivo.write(f"{coordenada[0]},{coordenada[1]},{coordenada[2]}\n")

def prologoKML(archivo, nombre):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""

    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document>\n")
    archivo.write("<Placemark>\n")
    archivo.write("<name>"+nombre+"</name>\n")
    archivo.write("<LineString>\n")
    #la etiqueta <extrude> extiende la línea hasta el suelo
    archivo.write("<extrude>1</extrude>\n")
    # La etiqueta <tessellate> descompone la línea en porciones pequeñas
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")

def epilogoKML(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo KML"""

    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write("<Style> id='lineaRoja'>\n")
    archivo.write("<LineStyle>\n")
    archivo.write("<color>#ff0000ff</color>\n")
    archivo.write("<width>5</width>\n")
    archivo.write("</LineStyle>\n")
    archivo.write("</Style>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n")

def main():
   nombreArchivo = "circuitoEsquema.xml"

   try:
        archivo = open(nombreArchivo,'r')
   except IOError:
        print ('No se encuentra el archivo ', nombreArchivo)
        exit()


   nombreSalida  = "circuito.kml"

   try:
        salida = open(nombreSalida,'w')
   except IOError:
        print ('No se puede crear el archivo ', nombreSalida + ".kml")
        exit()

    # Lectura de la cabecera
   cabecera=archivo.readline()

    # Escribe la cabecera del archivo de salida
   prologoKML(salida, nombreArchivo)

   coordenadasKML(salida,nombreArchivo)

   epilogoKML(salida)
   salida.close()

if __name__ == "__main__":
    main()
