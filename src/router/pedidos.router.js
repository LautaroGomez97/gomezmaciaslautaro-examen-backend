const express = require('express');
const router = express.Router();

const {
  crearPedido,
  listarMisPedidos,
  obtenerPedido,
  listarUsuariosConPedidos,
  listarPedidosConDetalles,
} = require('../controllers/pedidos.controller');

const { verificarToken } = require('../middleware/autenticacion');
const { tieneRol } = require('../middleware/roles');


router.post('/', verificarToken, crearPedido);
router.get('/', verificarToken, listarMisPedidos);
router.get('/:id', verificarToken, obtenerPedido);


router.get('/usuarios', verificarToken, tieneRol('superAdmin'), listarUsuariosConPedidos);
router.get('/detalles', verificarToken, tieneRol('superAdmin'), listarPedidosConDetalles);




module.exports = router;