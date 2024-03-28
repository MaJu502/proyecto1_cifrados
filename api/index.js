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
    const user = req.params.user
    
    try {
        const userKey = await userService.getUserKey(user)
        res.send(userKey); 
    } catch (error) {
        console.error("Error al obtener la clave del usuario:", error)
        res.status(500).json({ error: 'Internal Server Error' })
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
app.get('/groups', async (req, res) => {
    const grupos = await userService.getAllGroups()
    res.json(grupos)
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
        const { key, username } = req.body;
        const result = await userService.saveUser(key, username);
        res.status(201).json({ message: result });

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
        res.status(201).json({ message: result });
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
        res.status(201).send('Nuevo grupo agregado exitosamente');

    } catch (error) {
        console.error("Error al agregar un nuevo grupo:", error);
        res.status(500).send('Error interno al agregar un nuevo grupo');
    }
});

// Guarda mensajes de grupos
app.post('/messages/groups', async (req, res) => {
    try {
        const { group, author, mensaje_cifrado } = req.body;
        await userService.saveGroupMessage(group, author, mensaje_cifrado);
        res.status(201).send('Mensaje de grupo guardado exitosamente');
    } catch (error) {
        console.error("Error al guardar el mensaje del grupo:", error);
        res.status(500).send('Error interno al guardar el mensaje del grupo');
    }
});

