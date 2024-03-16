CREATE TABLE Usuario (
    id SERIAL PRIMARY KEY,
    public_key TEXT,
    username TEXT UNIQUE,
    fecha_creacion TIMESTAMP
);

CREATE TABLE Mensaje (
    id SERIAL PRIMARY KEY,
    mensaje_cifrado TEXT,
    username_destino TEXT,
    username_origen TEXT REFERENCES Usuario(username) ON DELETE CASCADE
);

CREATE TABLE Grupos (
    id SERIAL PRIMARY KEY,
    nombre TEXT,
    contraseña TEXT,
    clave_simetrica TEXT
);

CREATE TABLE Usuario_Grupo (
    id_usuario INTEGER REFERENCES Usuario(id) ON DELETE CASCADE,
    id_grupo INTEGER REFERENCES Grupos(id) ON DELETE CASCADE,
    PRIMARY KEY (id_usuario, id_grupo)
);

CREATE TABLE Mensajes_Grupos (
    id_grupo INTEGER REFERENCES Grupos(id),
    author TEXT REFERENCES Usuario(username) ON DELETE CASCADE,
    mensaje_cifrado TEXT
);


-- Insertar datos en la tabla Usuario
INSERT INTO Usuario (public_key, username, fecha_creacion) VALUES ('clave_publica1', 'usuario1', CURRENT_TIMESTAMP);
INSERT INTO Usuario (public_key, username, fecha_creacion) VALUES ('clave_publica2', 'usuario2', CURRENT_TIMESTAMP);

-- Insertar datos en la tabla Mensaje
INSERT INTO Mensaje (mensaje_cifrado, username_destino, username_origen) VALUES ('mensaje_cifrado1', 'usuario2', 'usuario1');
INSERT INTO Mensaje (mensaje_cifrado, username_destino, username_origen) VALUES ('mensaje_cifrado2', 'usuario1', 'usuario2');

-- Insertar datos en la tabla Grupos
INSERT INTO Grupos (nombre, contraseña, clave_simetrica) VALUES ('grupo1', 'contraseña1', 'clave_simetrica1');

-- Insertar datos en la tabla Usuario_Grupo
-- Nota: Asegúrate de que los id de los usuarios y los grupos existan antes de insertar en Usuario_Grupo.
INSERT INTO Usuario_Grupo (id_usuario, id_grupo) VALUES (1, 1);
INSERT INTO Usuario_Grupo (id_usuario, id_grupo) VALUES (2, 1);

-- Insertar datos en la tabla Mensajes_Grupos
-- Nota: Asegúrate de que el id_grupo exista en la tabla Grupos antes de insertar un mensaje en Mensajes_Grupos.
INSERT INTO Mensajes_Grupos (id_grupo, author, mensaje_cifrado) VALUES (1, 'usuario1', 'mensaje_cifrado_grupo1');

-- docker build -t cifrados .

-- docker run --name cifrados2024 -e POSTGRES_PASSWORD=uvg2024 -d -p 5432:5432 cifrados

-- docker exec -it cifrados2024 bash

-- psql -U postgres

-- \c postgres
-- \dt

-- \d tabla

-- \q

-- exit