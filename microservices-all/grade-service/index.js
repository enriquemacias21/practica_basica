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

app.get('/notas', (req, res) => {
  db.query("SELECT * FROM notas", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/notas', (req, res) => {
  const { estudiante_id, materia, nota } = req.body;
  const sql = "INSERT INTO notas (estudiante_id, materia, nota) VALUES (?, ?, ?)";
  db.query(sql, [req.body.estudiante_id, req.body.materia, req.body.nota], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, estudiante_id, materia, nota });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
