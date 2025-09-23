const pool = require('../config/db');

async function inicializarTablaPedidoProducto() {
  const query = `
    CREATE TABLE IF NOT EXISTS pedido_producto (
      idPedido INT UNSIGNED NOT NULL,
      idProducto INT UNSIGNED NOT NULL,
      cantidad INT UNSIGNED NOT NULL DEFAULT 1,
      PRIMARY KEY (idPedido, idProducto),
      FOREIGN KEY (idPedido) REFERENCES pedidos(id) ON DELETE CASCADE,
      FOREIGN KEY (idProducto) REFERENCES productos(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await pool.execute(query);
}


async function agregarProductosAPedido(idPedido, productos) {
  const consultas = productos.map(producto => [
    'INSERT INTO pedido_producto (idPedido, idProducto, cantidad) VALUES (?, ?, ?)',
    [idPedido, producto.idProducto, producto.cantidad]
  ]);

  for (const [consulta, params] of consultas) {
    await pool.execute(consulta, params);
  }
}

async function obtenerDetallesPedido(idPedido) {
  const query = `
    SELECT 
      productos.id,
      productos.nombre,
      productos.precio,
      pedido_producto.cantidad,
      (productos.precio * pedido_producto.cantidad) AS subtotal
    FROM pedido_producto
    INNER JOIN productos ON pedido_producto.idProducto = productos.id
    WHERE pedido_producto.idPedido = ?;
  `;
  const [productos] = await pool.execute(query, [idPedido]);
  
  let total = 0;
  productos.forEach(producto => {
    producto.subtotal = producto.precio * producto.cantidad;
    total += producto.subtotal;
   });
  
  return {
    productos,
    total
  };
}

async function listarPedidosConDetalles() {
  const query = `
    SELECT 
      usuarios.id AS idUsuario,
      usuarios.nombre AS nombreUsuario,
      pedidos.id AS idPedido,
      pedidos.fecha,
      productos.id AS idProducto,
      productos.nombre AS nombreProducto,
      productos.precio,
      pedido_producto.cantidad
    FROM pedidos
    INNER JOIN usuarios ON pedidos.idUsuario = usuarios.id
    INNER JOIN pedido_producto ON pedidos.id = pedido_producto.idPedido
    INNER JOIN productos ON pedido_producto.idProducto = productos.id
    ORDER BY pedidos.fecha DESC;
  `;
  const [filas] = await pool.execute(query);
  return filas;
}

module.exports = {
  inicializarTablaPedidoProducto,
  agregarProductosAPedido,
  obtenerDetallesPedido,
  listarPedidosConDetalles
};