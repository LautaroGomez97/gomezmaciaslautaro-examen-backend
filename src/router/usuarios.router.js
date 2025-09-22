const express = require('express');
const router = express.Router();



const {registrarUsuario, iniciarSesion,listarUsuariosConPedidos,eliminarUsuario, listarUsuarios} = require('../controllers/usuarios.controller');    
const {verificarToken} = require('../middleware/autenticacion');
const {tieneRol} = require('../middleware/roles');

router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);


router.get('/', verificarToken, tieneRol('superAdmin'), listarUsuariosConPedidos);
router.get('/', verificarToken, tieneRol('superAdmin'), listarUsuarios);
router.delete('/:id', verificarToken, tieneRol('superAdmin'), eliminarUsuario);

router.get('/perfil', verificarToken, (req, res) => {
    res.json({mensaje: 'Acceso al perfil', usuario: req.usuario});
  });

module.exports = router;
