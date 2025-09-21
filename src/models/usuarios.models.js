const pool = require('../config/db');


async function inicializarTablaUsuarios() {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('superAdmin','admin','usuario') NOT NULL DEFAULT 'usuario',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await pool.execute(query);
}

async function crearUsuario({nombre, email, hashContrasena, rol='user'}) {
  const query = 'INSERT INTO usuarios (nombre, email, password,role) VALUES (?, ?, ?,?)';
  const [resultado] = await pool.execute(query,
    [nombre, email, hashContrasena, rol]
  );
  return {id:resultado.insertId, nombre, email, rol};
}

async function buscarUsuarioPorEmail(email) {
  const query = 'SELECT * FROM usuarios WHERE email = ?';
  const [filas] = await pool.execute(query, [email]);
  return filas[0];
}
async function buscarUsuarioPorId(id) {
  const query = 'SELECT * FROM usuarios WHERE id = ?';
  const [filas] = await pool.execute(query, [id]);
  return filas[0];
}

async function listarUsuarios(){
    const query = 'SELECT id, nombre, email , role FROM usuarios';
    const [filas] = await pool.execute(query);
    return filas;
}



module.exports = {
    crearUsuario,
    buscarUsuarioPorEmail,
    listarUsuarios,
    inicializarTablaUsuarios,
    buscarUsuarioPorId
}

