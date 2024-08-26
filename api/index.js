import express from 'express'
import cors from 'cors'
import * as userService from './db.js'

const app = express();
const port = 3000

app.use(express.json());
app.use(cors())

app.listen(port, () => {
    console.log(`Server listening at http://127.0.0.1:${port}`)
})

app.get('/', (req, res) => {
    res.send('Status UP')
});

// Devuelve un string
app.get('/users/:user/key', async (req, res) => {
    const user = req.params.user;
    const secretKey = 'your-secret-key';

    try {
        const userKey = await userService.getUserKey(user);

        // Encriptar la clave pública antes de enviarla
        const encryptedUserKey = CryptoJS.AES.encrypt(userKey, secretKey).toString();

        res.send(encryptedUserKey);
    } catch (error) {
        console.error("Error al obtener la clave del usuario:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Devuelve un json
app.get('/users', async (req, res) => {
    const users = await userService.getAllUsers()
    res.json(users)
})

// Devuelve un json
app.get('/messages/:origin/users/:dest', async (req, res) => {
    const origin = req.params.origin
    const dest = req.params.dest

    try {
        const messages = await userService.getMessages(origin, dest)
        res.send(messages);
    } catch (error) {
        console.error("Error al obtener mensajes", error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

// Devuelve un json
app.get('/messages/:dest', async (req, res) => {
    const dest = req.params.dest

    try {
        const messages = await userService.getUserMessages(dest)
        res.send(messages);
    } catch (error) {
        console.error("Error al obtener mensajes", error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

// Devuelve un json
app.get('/groups', async (req, res) => {
    const grupos = await userService.getAllGroups()
    res.json(grupos)
})

// Devuelve un json
app.get('/groupsKey/:group', async (req, res) => {
    const group = req.params.group

    try {
        const groupKey = await userService.getGroupKey(group)
        res.send(groupKey);
    } catch (error) {
        console.error("Error al obtener la clave del grupo:", error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Devuelve un json
app.get('/messages/groups/:group', async (req, res) => {
    const group = req.params.group

    try {
        const messages = await userService.getGroupMessages(group)
        res.send(messages);
    } catch (error) {
        console.error("Error al obtener mensajes", error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

// Guarda usuarios
app.post('/users', async (req, res) => {
    try {
        const secretKey = 'your-secret-key';

        // Desencriptar los datos recibidos
        const decryptedPublicKey = CryptoJS.AES.decrypt(req.body.public_key, secretKey).toString(CryptoJS.enc.Utf8);
        const decryptedUsername = CryptoJS.AES.decrypt(req.body.username, secretKey).toString(CryptoJS.enc.Utf8);

        // Procesar los datos desencriptados
        const result = await userService.saveUser(decryptedPublicKey, decryptedUsername);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error al agregar un nuevo usuario:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Guarda mensajes
app.post('/messages/:dest', async (req, res) => {
    const dest = req.params.dest
    const { message, origin } = req.body;

    try {
        const result = await userService.saveMessage(message, dest, origin)
        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error al guardar mensaje:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Guarda grupos
app.post('/groups', async (req, res) => {
    try {
        const { nombre, contraseña, clave_simetrica, username } = req.body;
        await userService.insertNewGroup(nombre, contraseña, clave_simetrica, username);
        res.status(200).send('Nuevo grupo agregado exitosamente');

    } catch (error) {
        console.error("Error al agregar un nuevo grupo:", error);
        res.status(500).send('Error interno al agregar un nuevo grupo');
    }
});

// Guarda mensajes de grupos
app.post('/groupMessages/groups', async (req, res) => {
    try {
        const { id_grupo, author, mensaje_cifrado } = req.body;
        await userService.saveGroupMessage(id_grupo, author, mensaje_cifrado);
        res.status(200).send('Mensaje de grupo guardado exitosamente');
    } catch (error) {
        console.error("Error al guardar el mensaje del grupo:", error);
        res.status(500).send('Error interno al guardar el mensaje del grupo');
    }
});

//Actualiza la llave publica del usuario
app.put('/users/:user/key', async (req, res) => {
    try {
        const { user } = req.params;
        const { key } = req.body;
        await userService.updateUserPublicKey(user, key);
        res.status(200).send('Clave pública actualizada exitosamente');
    } catch (error) {
        console.error("Error al actualizar la clave pública del usuario:", error);
        res.status(500).send('Error interno al actualizar la clave pública del usuario');
    }
})

// Endpoint para limpiar la clave pública de un usuario
app.put('/users/:user/key', async (req, res) => {
    try {
        const { user } = req.params;
        await userService.clearUserPublicKey(user);
        res.status(200).send('Clave pública del usuario eliminada exitosamente');
    } catch (error) {
        console.error("Error al limpiar la clave pública del usuario:", error);
        res.status(500).send('Error interno al limpiar la clave pública del usuario');
    }
});

app.delete('/users/:user', async (req, res) => {
    try {
        const { user } = req.params;
        await userService.deleteUser(user);
        res.status(200).send('Usuario eliminado exitosamente');
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).send('Error interno al eliminar el usuario');
    }
});

app.delete('/groups/:group', async (req, res) => {
    try {
        const { group } = req.params;
        const { contraseña } = req.body;

        if (!contraseña) {
            return res.status(400).send('La contraseña es requerida');
        }

        await userService.deleteGroup(group, contraseña);
        res.status(200).send('Grupo eliminado exitosamente');
    } catch (error) {
        console.error("Error al eliminar el grupo:", error);
        res.status(500).send('Error interno al eliminar el grupo');
    }
});
