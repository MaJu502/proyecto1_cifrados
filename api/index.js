import express from 'express'
import cors from 'cors'

const app = express();
const port = 3000

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Server listening at http://127.0.0.1:${port}`)
  })