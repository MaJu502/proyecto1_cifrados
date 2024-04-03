#!/bin/bash

cd ..

# Detener y eliminar todos los contenedores
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# Eliminar todas las imágenes no utilizadas
docker image prune -af

# Eliminar todos los volúmenes no utilizados
docker volume prune -f

# Levantar los contenedores utilizando docker-compose
docker-compose up 
