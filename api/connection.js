import pg from 'pg';
const { Client } = pg;

const conn = new Client({
  user: 'postgres',
  host: 'db',
  password: 'uvg2024'
});

conn.connect()
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

export default conn;