import express from 'express'
import cors from 'cors'
import { getAllUsers, getUserKey, getAllGroups, getMessages, getGroupMessages } from './db.js'

const app = express();
const port = 3000

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
});

// Devuelve un string
app.get('/users/:user/key', async (req, res) => {
    const user = req.params.user
    
    try {
        const userKey = await getUserKey(user)
        res.send(userKey); 
    } catch (error) {
        console.error("Error al obtener la clave del usuario:", error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

// Devuelve un json
app.get('/users', async (req, res) => {
    const users = await getAllUsers()
    res.json(users)
})

// Devuelve un json
app.get('/messages/:origin/users/:dest', async (req, res) => {
    const origin = req.params.origin
    const dest = req.params.dest
    
    try {
        const messages = await getMessages(origin, dest)
        res.send(messages); 
    } catch (error) {
        console.error("Error al obtener mensajes", error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

// Devuelve un json
app.get('/groups', async (req, res) => {
    const grupos = await getAllGroups()
    res.json(grupos)
})

// Devuelve un json
app.get('/messages/groups/:group', async (req, res) => {
    const group = req.params.group
    
    try {
        const messages = await getGroupMessages(group)
        res.send(messages); 
    } catch (error) {
        console.error("Error al obtener mensajes", error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://127.0.0.1:${port}`)
})