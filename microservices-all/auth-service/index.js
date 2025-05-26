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

app.post('/login', (req, res) => {
  const { usuario, clave } = req.body;
  const sql = "SELECT * FROM usuarios WHERE usuario = ? AND clave = ?";
  db.query(sql, [usuario, clave], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length > 0) {
      res.status(200).json({ success: true, usuario });
    } else {
      res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }
  });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Auth service corriendo en http://localhost:${PORT}`);
});
