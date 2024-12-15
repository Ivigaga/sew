import xml.etree.ElementTree as ET

def obtenerPuntos(entrada):
    try:

        arbol = ET.parse(entrada)

    except IOError:
        print ('No se encuentra el archivo ', entrada)
        exit()

    except ET.ParseError:
        print("Error procesando en el archivo XML = ", entrada)
        exit()

    raiz=arbol.getroot()
    ns = '{http://www.uniovi.es}'
    puntos=[]

    distancia=50

    altitud=raiz.find(ns+"coordenadas/"+ns+"altitud")
    als=altitud.text
    puntos.append((distancia,int(als)))

    for tramo in raiz.findall(ns+"tramos/"+ns+"tramo"):

        largo=tramo.find(ns+"largo")
        altitud=tramo.find(ns+"coordenadas_tramo/"+ns+"altitud_tramo")
        distancia+=float(largo.text)
        als=altitud.text
        puntos.append((round(distancia,2),int(als)))
    altitud=raiz.find(ns+"coordenadas/"+ns+"altitud")
    als=altitud.text

    print(puntos)
    return puntos


def puntosSVG(salida,entrada):
    puntos = obtenerPuntos(entrada)
    min_distancia = min([punto[0] for punto in puntos])-1
    min_altitud = min([punto[1] for punto in puntos])
    # Calcular la altitud mínima de todos los puntos
    max_altitud = max([punto[1] for punto in puntos])+1

    # Aplicar escalas fijas: 20 para distancia y 5 para altitud
    for punto in puntos:
        distancia_escalada = (punto[0]-min_distancia) * 100
        altitud_escalada = (-punto[1]+max_altitud) * 15
        salida.write(f"{distancia_escalada},{altitud_escalada} ")

    # Después de dibujar los puntos originales, cerrar la polilínea hacia abajo:
    # 1. Añadir un punto con la misma distancia que el último, pero con la altitud mínima (base inferior)
    ultima_distancia = (puntos[-1][0]-min_distancia) * 100
    salida.write(f"{ultima_distancia},{(-min_altitud+max_altitud+1) * 15} ")

    # 2. Añadir un punto con la misma distancia que el primer punto, y con la altitud mínima (base inferior)
    primera_distancia = (puntos[0][0]-min_distancia) * 100
    salida.write(f"{primera_distancia},{(-min_altitud+max_altitud+1) * 15} ")

    # 3. Finalmente, cerrar el polígono regresando al primer punto (completar el ciclo)
    salida.write(f"{primera_distancia},{(-puntos[0][1]+max_altitud) * 15} ")

def prologoSVG(salida):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""

    salida.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    salida.write('<svg xmlns="http://www.w3.org/2000/svg" version="2.0" height="50" width="150">\n')
    salida.write('<polyline points=\n')
    salida.write('"')

def epilogoSVG(salida):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""

    salida.write('"\n')
    salida.write('style="fill:white;stroke:red;stroke-width:4" />\n')
    salida.write('</svg>')

def main():
   nombreArchivo = "circuitoEsquema.xml"

   try:
        archivo = open(nombreArchivo,'r')
   except IOError:
        print ('No se encuentra el archivo ', nombreArchivo)
        exit()


   nombreSalida  = "altimetria.svg"

   try:
        salida = open(nombreSalida,'w')
   except IOError:
        print ('No se puede crear el archivo ', nombreSalida)
        exit()

    # Procesamiento y generación del archivo kml

   nLinea=0

    # Lectura de la cabecera
   cabecera=archivo.readline()

    # Escribe la cabecera del archivo de salida
   prologoSVG(salida)

   puntosSVG(salida,nombreArchivo)

   epilogoSVG(salida)
   salida.close()

if __name__ == "__main__":
    main()