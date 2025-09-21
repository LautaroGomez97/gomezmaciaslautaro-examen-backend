const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuariosModelo = require('../models/usuarios.models');

const SECRETO_JWT = process.env.JWT_SECRET || 'secreto_de_prueba'

async function registrarUsuario(req, res){
    try{
        const { nombre , email, contrasena} = req.body;

        if(!nombre || !email || !contrasena) {
            return res.status(400).json({mensaje: 'Faltan datos: nombre, email y constraseña son obligatorios'});
        }
        const usuarioExistente = await usuariosModelo.buscarUsuarioPorEmail(email);
        if(usuarioExistente)  return res.status(409).json({mensaje: 'El email ya esta registrado'});

        const hashContrasena = await bcrypt.hash(contrasena, 10);
        const nuevoUsuario = await usuariosModelo.crearUsuario({
            nombre,
            email,
            hashContrasena,
            rol: 'usuario'
        });
        return res.status(201).json({mensaje: 'Usuario creado', usuario: nuevoUsuario });
    
    }catch (error){
        console.error('Error detallado:', error);
        res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
    }
}

async function iniciarSesion(req, res){
    try{
        const {email,contrasena} = req.body;
        if(!email || !contrasena) {
            return res.status(400).json({mensaje: 'Faltan datos: email y constraseña son obligatorios'});
        }

        const usuario = await usuariosModelo.buscarUsuarioPorEmail(email);

        if (!usuario){
            return res.status(401).json({mensaje: 'Credenciales invalidas'});
        }

        const contrasenaValida = await bcrypt.compare(contrasena, usuario.password);
        if(!contrasenaValida){
            return res.status(401).json({mensaje: 'Credenciales invalidas'});
        }
        
        const carga = { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol };

        const token = jwt.sign(carga, SECRETO_JWT, { expiresIn: '8h'});
        return res.status(200).json({mensaje: 'Login exitoso', token});
    }catch (error){
        console.error('Error al iniciar sesion:', error);
        return res.status(500).json({mensaje: 'Error del servidor'});
    }
}

module.exports = { registrarUsuario, iniciarSesion }