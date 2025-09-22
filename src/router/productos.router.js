const express = require('express');
const router = express.Router();
const { crearProducto, listarProductos,actualizarProducto, eliminarProducto } = require('../controllers/productos.controller');
const { verificarToken } = require('../middleware/autenticacion');
const { tieneRol } = require('../middleware/roles');

router.get('/',verificarToken, listarProductos);

router.post('/',verificarToken,tieneRol('admin', 'superAdmin'), crearProducto);

router.put('/:id',verificarToken, tieneRol('admin', 'superAdmin'),actualizarProducto);
router.delete('/:id',verificarToken,tieneRol('admin', 'superAdmin'), eliminarProducto);

module.exports = router;