const pedidosModelo = require('../models/pedidos.model');
const pedidoProductoModelo = require('../models/pedidos_productos.model');


async function crearPedido(req, res) {
  try {
    const { productos } = req.body;
    
 
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        mensaje: 'Debe proporcionar al menos un producto'
      });
    }

    const nuevoPedido = await pedidosModelo.crearPedido(req.usuario.id);
    
    await pedidoProductoModelo.agregarProductosAPedido(nuevoPedido.id, productos);

    const detalles = await pedidoProductoModelo.obtenerDetallesPedido(nuevoPedido.id);
    
    res.status(201).json({
      mensaje: 'Pedido creado exitosamente',
      pedido: {
        id: nuevoPedido.id,
        fecha: nuevoPedido.fecha,
        productos: detalles.productos,
        total: detalles.total
      }
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ 
      mensaje: 'Error del servidor al crear el pedido' 
    });
  }
}


async function listarMisPedidos(req, res) {
  try {
    const pedidos = await pedidosModelo.listarPedidosPorUsuario(req.usuario.id);

    const pedidosConDetalles = [];
    for (const pedido of pedidos) {
      const detalles = await pedidoProductoModelo.obtenerDetallesPedido(pedido.id);
      pedidosConDetalles.push({
        ...pedido,
        productos: detalles.productos,
        total: detalles.total
      });
    }
    
    res.status(200).json({
      mensaje: `Tienes ${pedidos.length} pedido${pedidos.length !== 1 ? 's' : ''}`,
      pedidos: pedidosConDetalles
    });
  } catch (error) {
    console.error('Error al listar pedidos:', error);
    res.status(500).json({ 
      mensaje: 'Error del servidor al listar pedidos' 
    });
  }
}


async function obtenerPedido(req, res) {
  try {
    const { id } = req.params;
    const pedido = await pedidosModelo.obtenerPedido(id, req.usuario.id);
    if (!pedido) {
      return res.status(404).json({
        mensaje: 'Pedido no encontrado o no tienes permiso para verlo'
      });
    }
    

    const detalles = await pedidoProductoModelo.obtenerDetallesPedido(id);
    
    res.status(200).json({
      mensaje: 'Detalles del pedido',
      pedido: {
        id: pedido.id,
        fecha: pedido.fecha,
        productos: detalles.productos,
        total: detalles.total
      }
    });
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ 
      mensaje: 'Error del servidor al obtener el pedido' 
    });
  }
}


async function listarUsuariosConPedidos(req, res) {
  try {
    const usuarios = await pedidosModelo.listarUsuariosConPedidos();
    res.status(200).json({
      mensaje: `Reporte de usuarios y pedidos: ${usuarios.length} usuarios encontrados`,
      usuarios
    });
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({ 
      mensaje: 'Error del servidor al generar el reporte' 
    });
  }
}


async function listarPedidosConDetalles(req, res) {
  try {
    const pedidos = await pedidoProductoModelo.listarPedidosConDetalles();
    res.status(200).json({
      mensaje: `Reporte de pedidos: ${pedidos.length} pedidos encontrados`,
      pedidos
    });
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({ 
      mensaje: 'Error del servidor al generar el reporte' 
    });
  }
}



module.exports = {
  crearPedido,
  listarMisPedidos,
  obtenerPedido,
  listarUsuariosConPedidos,
  listarPedidosConDetalles
};