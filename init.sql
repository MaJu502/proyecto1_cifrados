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
    username_origen TEXT REFERENCES Usuario(username)
);

CREATE TABLE Grupos (
    id SERIAL PRIMARY KEY,
    nombre TEXT,
    usuarios TEXT[],
    contraseña TEXT,
    clave_simetrica TEXT
);

CREATE TABLE Mensajes_Grupos (
    id_grupo INTEGER REFERENCES Grupos(id),
    author TEXT,
    mensaje_cifrado TEXT
);

-- docker build -t cifrados .

-- docker run --name cifrados2024 -e POSTGRES_PASSWORD=uvg2024 -d -p 5432:5432 cifrados

-- docker exec -it cifrados2024 bash

-- psql -U postgres

-- \c postgres
-- \dt

-- \d tabla

-- \q

-- exit