require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'siga'
});

db.connect(err => {
  if (err) throw err;
  console.log("Conectado a la base de datos MySQL");
});

app.get('/docentes', (req, res) => {
  db.query("SELECT * FROM docentes", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/docentes', (req, res) => {
  const { nombre, especialidad } = req.body;
  const sql = "INSERT INTO docentes (nombre, especialidad) VALUES (?, ?)";
  db.query(sql, [req.body.nombre, req.body.especialidad], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, nombre, especialidad });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
