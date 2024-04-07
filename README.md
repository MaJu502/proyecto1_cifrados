# Proyecto 1 – Comunicaciones Seguras

## Descripción del Proyecto
El proyecto tiene como objetivo diseñar e implementar un sistema de comunicaciones seguras donde los usuarios puedan registrarse, intercambiar mensajes cifrados y participar en chats individuales o grupales de manera segura. Cada usuario se registrará en el servidor proporcionando su nombre de usuario y generando un par de claves pública y privada. La clave pública se compartirá a través de una API para que otros usuarios la utilicen al enviar mensajes cifrados. La comunicación se realizará utilizando cifrado asimétrico para garantizar la confidencialidad de los mensajes. Además, se permitirá la creación y gestión de grupos de chat, donde los mensajes grupales estarán protegidos mediante cifrado simétrico AES-128. El proyecto incorporará conceptos de criptografía simétrica y asimétrica, autenticación segura, almacenamiento seguro de claves y una interfaz de usuario HTML para facilitar la interacción entre los usuarios y el sistema.

## Requerimientos del Sistema
### Tecnologías Utilizadas
- Angular 17.3.0
- Node.js 18.17.0
- PostgreSQL

### Instalación de Requerimientos
Asegúrese de tener instalado Node.js y PostgreSQL antes de continuar.

Para instalar las dependencias de Angular, ejecute el siguiente comando:
```
npm install -g @angular/cli@17.3.0
```
Para instalar las dependencias de Node.js, ejecute el siguiente comando:
```
npm install node@18.17.0
```
Para instalar la biblioteca `node-forge`, ejecute el siguiente comando:
```
npm install node-forge
```

### Base de Datos
Se utilizarán tablas de base de datos para almacenar la información del proyecto, que pueden ser relacionales o no relacionales.

#### Usuarios
- Registra los nuevos usuarios que se registren al chat.
- Almacena una llave pública en base64.
- Almacena el username.
- Almacena la fecha de creación.

#### Mensajes
- Almacena cada una de las conversaciones que se realizan entre usuarios.
- Almacena el mensaje cifrado con la llave pública del usuario.
- Almacena el nombre del usuario destino.
- Almacena el usuario de origen.

#### Grupos
- Crea una conversación grupal entre un grupo de usuarios.
- Almacena un nombre que lo identifique.
- Almacena un listado de usuarios que pertenecen al grupo.
- Almacena una contraseña cifrada en AES, que permite autorizar eliminar el grupo.
- Almacena una clave simétrica en AES que sirve de comunicación general para todos los integrantes del grupo para poder descifrar los mensajes cifrados.

#### Mensajes de Grupos
- Almacena cada uno de los mensajes que se generen dentro del grupo.
- Almacena el autor del mensaje y el mensaje cifrado.

### API
#### GET
- `/users/{user}/key`: Obtiene la llave pública del usuario en base 64.
- `/users`: Obtiene el listado de usuarios registrados en el servidor.
- `/messages/{user_origen}/users/{user_destino}`: Obtiene el listado de mensajes entre 2 usuarios.
- `/groups`: Obtiene el listado de grupos disponibles.
- `/messages/groups/{group}`: Obtiene el listado de mensajes que pertenecen al grupo.

#### POST
- `/users`: Almacena/registra un nuevo usuario con su llave pública.
- `/messages/{user_destino}`: Guarda un mensaje para el usuario destino.
- `/groups`: Guarda un nuevo grupo.
- `/messages/groups`: Guarda un mensaje para el grupo destino.

#### PUT
- `/users/{user}/key`: Actualiza la llave pública del usuario en base 64.

#### DELETE
- `/users/{user}/key`: Elimina la llave del usuario.
- `/users/{user}`: Elimina al usuario.
- `/groups/{group}`: Elimina el grupo completo, validando la contraseña.

## Interfaz de Usuario
El aplicativo puede realizarse en cualquier tecnología que permita el intercambio de datos por medio de HTTPS/Rest API. Para esto necesitará desarrollar lo siguiente:

1. Iniciar sesión (registrarse generando nuevas claves o utilizar una existente).
2. Visualizar un listado de usuarios.
3. Seleccionar un usuario:
   - Ver los mensajes enviados al usuario (cifrarlos con llave pública).
   - Ver los mensajes que fueron enviados a su usuario (desencriptar usando la llave privada).
4. Visualizar un listado de grupos:
   - Crear un grupo.
   - Crear un chat grupal.

Es necesario tener la llave privada en un sitio seguro para poder descifrar los mensajes que reciba. En este caso se descarga un archivo.txt con la llave privada y esta se solicita en el login, junto con el username. La llave simétrica utilizada para los grupos se genera automáticamente al crear un grupo y esta es proporcionada al usuario.

### Levantar el Proyecto con Docker
Para levantar el proyecto utilizando Docker, siga estos pasos:

1. Asegúrese de tener Docker instalado en su máquina.
2. Clone el repositorio del proyecto en su computadora.
3. Abra una terminal y navegue hasta el directorio raíz del proyecto.
4. Ejecute el siguiente comando para construir y levantar los contenedores Docker:
```
docker-compose up
```
Esto construirá y levantará los contenedores para la base de datos, el frontend y la API según las especificaciones definidas en el archivo `docker-compose.yml`.

5. Una vez que los contenedores estén en funcionamiento, puede acceder al frontend en `http://localhost:4200` y a la API en `http://localhost:3000` (con todas las rutas mencionadas anteriormente).

**Nota:** Cualquier cambio realizado en el código se hará efectivo al eliminar los contenedores, imágenes y volúmenes, y luego levantar todo de nuevo usando el comando anterior.

## Desarrolladores
### Equipo de Desarrollo
- Marco Jurado - Desarrollador Frontend
- Christopher García - Desarrollador Backend / Docker
- Gabriel Vicente - Desarrollador Backend
- Yong Park - Administrador de Base de Datos / Docker

