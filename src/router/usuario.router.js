const express = require('express');

const router = express.Router();

const {registrarUsuario, iniciarSesion} = require('../controllers/usuarios.controller');    
const {verificarToken} = require('../middleware/autenticacion');

router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);

router.get('/perfil', verificarToken, (req, res) => {
    res.json({mensaje: 'Acceso al perfil', usuario: req.usuario});
  });

module.exports = router;
