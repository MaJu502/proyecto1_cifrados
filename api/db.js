import conn from './connection.js'

export async function getUserKey(username) {
    try {
        const query = 'SELECT public_key FROM Usuario WHERE username = $1';
        const result = await conn.query(query, [username]);

        if (result.rows.length > 0) {
            return result.rows[0].public_key;
        } else {
            throw new Error(`El usuario '${username}' no existe.`);
        }
    } catch (error) {
        console.error("Error al obtener la clave del usuario:", error);
        throw error;
    }
}

export async function getAllUsers() {
    try {
        const info = await conn.query('SELECT * FROM Usuario')
        return info.rows

    } catch (e) {
        console.log(e)
        return e
    }
}

export async function getMessages(origin, dest) {
    try {
        const query = 'SELECT * FROM Mensaje WHERE (username_origen = $1 AND username_destino = $2) OR (username_origen = $2 AND username_destino = $1)';
        const result = await conn.query(query, [origin, dest]);

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            return 'No hay mensajes';
        }
    } catch (error) {
        console.error("Error interno:", error);
        throw error;
    }
}

export async function getAllGroups() {
    try {
        const info = await conn.query('SELECT G.id, G.nombre, G.clave_simetrica, array_agg(U.username) AS usuarios FROM Grupos G JOIN  Usuario_Grupo UG ON G.id = UG.id_grupo JOIN Usuario U ON UG.id_usuario = U.id GROUP BY G.id')
        return info.rows

    } catch (e) {
        console.log(e)
        return e
    }
}

export async function getGroupMessages(group) {
    try {
        const query = 'SELECT * FROM Mensajes_Grupos WHERE id_grupo = $1';
        const result = await conn.query(query, [group]);

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            return 'No hay mensajes';
        }
    } catch (error) {
        console.error("Error interno:", error);
        throw error;
    }
}

export async function saveUser(key, user) {
    try {
        const query = 'INSERT INTO Usuario (public_key, username, fecha_creacion) VALUES ($1, $2, NOW())'
        await conn.query(query, [key, user]);
        return 'Usuario agregado exitosamente';
    } catch (error) {
        if (error.code === '23505') {
            throw new Error('El nombre de usuario ya existe');
        } else {
            console.error("Error interno:", error);
            throw error;
        }
    }
}

export async function saveMessage(encrypt_message, dest, origin) {
    try {
        const query = 'INSERT INTO Mensaje (mensaje_cifrado, username_destino, username_origen) VALUES ($1, $2, $3)'
        await conn.query(query, [encrypt_message, dest, origin]);
        return 'Mensaje agregado exitosamente';
    } catch (error) {
        console.error("Error interno:", error);
        throw error;
    }
}

export async function insertNewGroup(nombre, contraseña, clave_simetrica, username) {
    try {
        const query = `
            INSERT INTO Grupos (nombre, contraseña, clave_simetrica)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;

        const result = await conn.query(query, [nombre, contraseña, clave_simetrica]);
        const nuevoGrupoId = result.rows[0].id;

        const queryUsuario = `
            SELECT id
            FROM Usuario
            WHERE username = $1;
        `;

        const resultUsuario = await conn.query(queryUsuario, [username]);
        const usuarioId = resultUsuario.rows[0].id;

        const queryInsertUsuarioGrupo = `
            INSERT INTO Usuario_Grupo (id_usuario, id_grupo)
            VALUES ($1, $2);
        `;

        await conn.query(queryInsertUsuarioGrupo, [usuarioId, nuevoGrupoId]);
    } catch (error) {
        throw error;
    }
}

export async function saveGroupMessage(group, author, mensaje_cifrado) {
    try {
        const query = `
            WITH grupo AS (
                SELECT id FROM Grupos WHERE nombre = $1
            )
            INSERT INTO Mensajes_Grupos (id_grupo, author, mensaje_cifrado)
            VALUES ((SELECT id FROM grupo), $2, $3);
        `;
        await conn.query(query, [group, author, mensaje_cifrado]);

    } catch (error) {
        throw error;
    }
}

export async function updateUserPublicKey(user, key) {
    try {
        const query = `
            UPDATE Usuario
            SET public_key = $1
            WHERE username = $2;
        `;
        await conn.query(query, [key, user]);
    } catch (error) {
        throw error;
    }
}

export async function clearUserPublicKey(user) {
    try {
        const query = `
            UPDATE Usuario
            SET public_key = NULL
            WHERE username = $1;
        `;
        await conn.query(query, [user]);
    } catch (error) {
        throw error;
    }
}

export async function deleteUser(user) {
    try {
        const query = `
            DELETE FROM Usuario
            WHERE username = $1;
        `;
        await conn.query(query, [user]);
    } catch (error) {
        throw error;
    }
}

export async function deleteGroup(group) {
    try {
        const query = `
            DELETE FROM Grupos
            WHERE nombre = $1;
        `;
        await conn.query(query, [group]);
    } catch (error) {
        throw error;
    }
}
