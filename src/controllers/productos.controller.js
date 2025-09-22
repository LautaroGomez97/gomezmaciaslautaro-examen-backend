const productosModelo = require('../models/productos.model');

async function crearProducto(req, res) {
    try {
        const { nombre, precio, stock } = req.body;
        if (!nombre || typeof precio !== 'number' || typeof stock !== 'number') {
            return res.status(400).json({ mensaje: 'Faltan datos: nombre, precio y stock son obligatorios' });
        }
        const nuevoProducto = await productosModelo.crearProducto({ nombre, precio, stock });
        res.status(201).json({ mensaje: 'Producto creado', producto: nuevoProducto });

    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
}

async function buscarProductoPorId(req, res) {
    try {
        const { id } = req.params;
        const producto = await productosModelo.buscarProductoPorId(id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.status(200).json({ mensaje: 'Producto encontrado', producto });
    } catch (error) {
        console.error('Error al buscar producto:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
}


async function listarProductos(req, res) {
    try {
        const productos = await productosModelo.listarProductos();
        res.status(200).json({
            mensaje: `Lista de productos: ${productos.length} encontrados`,
            productos
        });

    } catch (error) {
        console.error('Error al listar productos:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
}

async function actualizarProducto(req, res) {

    try {
        const { id } = req.params;
        const { nombre, precio, stock } = req.body;

        if (!nombre || precio == null || stock == null) {
            return res.status(400).json({ mensaje: 'Faltan datos: nombre, precio y stock son obligatorios' });
        }

        const productoExistente = await productosModelo.buscarProductoPorId(id);
        if (!productoExistente) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        const productoActualizado = await productosModelo.actualizarProducto(id, { nombre, precio, stock });
        res.status(200).json({ mensaje: 'Producto actualizado', producto: productoActualizado });

    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
}

async function eliminarProducto(req, res) {
    try {
        const { id } = req.params;
        const productoExistente = await productosModelo.buscarProductoPorId(id);
        if (!productoExistente) {
            return res.status(404).json({ mensaje: 'No se encuentra el producto' })
        }
        const productoEliminado = await productosModelo.eliminarProducto(id);
        if (productoEliminado) {
            return res.status(200).json({ mensaje: 'Producto eliminado', producto: productoExistente });
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }

}

module.exports = { crearProducto, listarProductos, buscarProductoPorId, actualizarProducto, eliminarProducto } 