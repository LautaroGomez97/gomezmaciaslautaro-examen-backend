const jwt = require('jsonwebtoken');
const usuarioModelado = require('../models/usuarios.models');

const SECRETO_JWT = process.env.JWT_SECRET || 'secreto_de_prueba';


async function verificarToken(req, res, next){
    const bearer = req.headers['authorization'];
    console.log(bearer);
    if(!bearer){
        return res.status(401).json({mensaje: 'No se proporciono token de autenticacion'});
    }

    const token = bearer.split(' ')[1];

    if(!token){
        return res.status(401).json({mensaje: 'Formato de token invalido'});
    }

    try{
        const carga = jwt.verify(token, SECRETO_JWT);
        console.log('Token decodificado:', carga);  
        const usuario = await usuarioModelado.buscarUsuarioPorId(carga.id);
        console.log('Usuario encontrado:', usuario);
        if(!usuario){
            return res.status(401).json({mensaje: 'Token invalido'});
        }
        req.usuario = usuario;
        next();
    } catch (error){
        return res.status(401).json({mensaje: 'Token invalido o expirado'});
    }
}

module.exports = { verificarToken };