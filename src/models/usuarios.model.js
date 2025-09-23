const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function inicializarTablaUsuarios() {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      rol ENUM('superAdmin','admin','usuario') NOT NULL DEFAULT 'usuario',
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await pool.execute(query);
}
async function inicializarSuperAdmin() {
  const email = 'superadmin@utn.com';
  const password = 'super1234';            

  const [filas] = await pool.execute(
    'SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]
  );

  if (filas.length === 0) {
    const hashed = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      ['Super Admin', email, hashed, 'superAdmin']
    );
    console.log('SuperAdmin creado automáticamente');
  } 
}


async function crearUsuario({nombre, email, password, rol='usuario'}) {
  const query = 'INSERT INTO usuarios (nombre, email, password,rol) VALUES (?, ?, ?,?)';
  const [resultado] = await pool.execute(query,
    [nombre, email, password, rol]
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
    const query = 'SELECT id, nombre, email , rol FROM usuarios';
    const [filas] = await pool.execute(query);
    return filas;
}



async function eliminarUsuario(id){
    const query = 'DELETE FROM usuarios WHERE id = ?';
    const [resultado] = await pool.execute(query, [id]);
    return resultado.affectedRows > 0;  
}

async function listarUsuariosConPedidos() {
  const query = `
    SELECT usuario.id, usuario.nombre, usuario.email, COUNT(pedido.id) AS total_pedidos
    FROM usuarios AS usuario
    LEFT JOIN pedidos AS pedido ON usuario.id = pedido.idUsuario
    GROUP BY usuario.id
    ORDER BY total_pedidos DESC;
  `;
  const [filas] = await pool.execute(query);
  return filas;
}


module.exports = {
    crearUsuario,
    buscarUsuarioPorEmail,
    listarUsuarios,
    inicializarTablaUsuarios,
    buscarUsuarioPorId,
    listarUsuariosConPedidos,
    eliminarUsuario,
    inicializarSuperAdmin
}

