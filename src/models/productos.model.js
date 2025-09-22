const pool = require('../config/db');

const inicializarTablaProductos = async () => {
    const tablaProducto = ` 
    CREATE TABLE IF NOT EXISTS productos (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,   
        precio DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await pool.execute(tablaProducto);
}

async function crearProducto({ nombre, precio, stock }){
    const query = 'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)';
    const [resultado] = await pool.execute(query,[nombre, precio, stock]);
    return { id: resultado.insertId, nombre, precio, stock}
}

async function buscarProductoPorId(id){
    const query = 'SELECT * FROM productos WHERE id = ?';
    const [filas] = await pool.execute(query, [id]);
    return filas[0];
}

async function listarProductos(){
    const query = 'SELECT id, nombre, precio, stock, fecha FROM productos';
    const [filas] = await pool.execute(query);
    return filas;
}

async function actualizarProducto(id, { nombre, precio, stock }){
    const query = 'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?';
    await pool.execute(query, [nombre, precio, stock, id]);
    return { id, nombre, precio, stock };
}

async function eliminarProducto(id){
    const query = 'DELETE FROM productos WHERE id = ?';
    const [resultado] = await pool.execute(query, [id]);
    return resultado.affectedRows > 0;  
}

module.exports = { 
    inicializarTablaProductos,
    crearProducto,
    buscarProductoPorId,
    listarProductos,
    actualizarProducto,
    eliminarProducto
}