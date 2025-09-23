  const pool = require('../config/db');

  async function inicializarTablaPedidos() {
    const query = `
      CREATE TABLE IF NOT EXISTS pedidos (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        idUsuario INT UNSIGNED NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (idUsuario) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await pool.execute(query);
  }

  async function crearPedido(idUsuario) {
    const query = 'INSERT INTO pedidos (idUsuario) VALUES (?)';
    const [resultado] = await pool.execute(query, [idUsuario]);
    return { id: resultado.insertId, idUsuario, fecha: new Date() };
  }


  async function obtenerPedido(idPedido, idUsuario) {
    const query = `
      SELECT id, idUsuario, fecha 
      FROM pedidos 
      WHERE id = ? AND idUsuario = ?;
    `;
    const [filas] = await pool.execute(query, [idPedido, idUsuario]);
    return filas[0] || null;
  }


  async function listarPedidosPorUsuario(idUsuario) {
    const query = `
      SELECT id, fecha 
      FROM pedidos 
      WHERE idUsuario = ? 
      ORDER BY fecha DESC;
    `;
    const [filas] = await pool.execute(query, [idUsuario]);
    return filas;
  }


  async function listarUsuariosConPedidos() {
    const query = `
      SELECT 
        usuarios.id, 
        usuarios.nombre, 
        usuarios.email, 
        COUNT(pedidos.id) AS totalPedidos
      FROM usuarios
      LEFT JOIN pedidos ON usuarios.id = pedidos.idUsuario
      GROUP BY usuarios.id
      ORDER BY totalPedidos DESC;
    `;
    const [filas] = await pool.execute(query);
    return filas;
  }

  module.exports = {
    inicializarTablaPedidos,
    crearPedido,
    obtenerPedido,
    listarPedidosPorUsuario,
    listarUsuariosConPedidos
  };