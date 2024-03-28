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
        const info = await conn.query('SELECT id, username FROM Usuario')
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

