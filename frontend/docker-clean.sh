#!/bin/bash
cd ..
# Detener y eliminar todos los contenedores
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
# Eliminar todas las imágenes no utilizadas
docker image prune -af
# Eliminar todos los volúmenes no utilizados
docker volume prune -f
# Moverse a la raíz del proyecto (cambia "/ruta/a/la/raiz" por la ruta adecuada)
# Levantar los contenedores utilizando docker-compose
docker-compose up