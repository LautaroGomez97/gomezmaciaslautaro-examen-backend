const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuariosModelo = require('../models/usuarios.model');

const SECRETO_JWT = process.env.JWT_SECRET || 'secreto_de_prueba'



async function registrarUsuario(req, res) {
    try {
        const { nombre, email, contrasena, rol } = req.body;

        if (!nombre || !email || !contrasena) {
            return res.status(400).json({ mensaje: 'Faltan datos: nombre, email y contraseña son obligatorios' });
        }

        const usuarioExistente = await usuariosModelo.buscarUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(409).json({ mensaje: 'El email ya está registrado' });
        }

        let rolFinal = rol || 'usuario';
        if (!req.usuario && rol === 'superAdmin') {
            rolFinal = 'superAdmin';
        }

        const hashContrasena = await bcrypt.hash(contrasena, 10);
        const nuevoUsuario = await usuariosModelo.crearUsuario({
            nombre,
            email,
            password: hashContrasena,
            rol: rolFinal
        });
        return res.status(201).json({
            mensaje: `Usuario creado como ${rolFinal}`,
            usuario: nuevoUsuario
        });
    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({ mensaje: 'Error del servidor', error });
    }
}

async function iniciarSesion(req, res) {
    try {
        const { email, contrasena } = req.body;
        if (!email || !contrasena) {
            return res.status(400).json({ mensaje: 'Faltan datos: email y constraseña son obligatorios' });
        }

        const usuario = await usuariosModelo.buscarUsuarioPorEmail(email);

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Usuario incorrecto' });
        }
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.password);

        if (!contrasenaValida) {
            return res.status(401).json({ mensaje: ' Contraseña incorrecta' });
        }

        const carga = { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol };

        const token = jwt.sign(carga, SECRETO_JWT, { expiresIn: '8h' });
        return res.status(200).json({ mensaje: 'Login exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesion:', error);
        return res.status(500).json({ mensaje: 'Error del servidor' });
    }
}

async function listarUsuarios(req, res) {
    try {
        const usuarios = await usuariosModelo.listarUsuarios();
        return res.status(200).json({
            mensaje: `Lista de usuarios: ${usuarios.length} encontrados`,
            usuarios
        });
    } catch (error) {
        console.error('Error al listar usuarios: ', error);
        return res.status(500).json({ mensaje: 'Error del servidor:', error });
    }
}

async function listarUsuariosConPedidos(req, res) {
    try {
        const usuarios = await usuariosModelo.listarUsuariosConPedidos();
        return res.status(200).json({
            mensaje: `Lista de usuarios con sus pedidos: ${usuarios.length} encontrados`,
            usuarios
        });
    } catch (error) {
        console.error('Error al listar usuarios: ', error);
        return res.status(500).json({ mensaje: 'Error del servidor:', error });
    }

}

async function eliminarUsuario(req, res) {
    try {
        const { id } = req.params;

        if (id == req.usuario.id) {
            return res.status(400).json({ mensaje: 'No puedes eliminar tu propio usuario' });
        }

        const usuarioExistente = await usuariosModelo.buscarUsuarioPorId(id);
        if (!usuarioExistente) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const eliminado = await usuariosModelo.eliminarUsuario(id);
        if (eliminado) {
            return res.status(200).json({ mensaje: 'Usuario eliminado correctamente', usuario: usuarioExistente });
        } else {
            return res.status(500).json({ mensaje: 'No se pudo eliminar el usuario' });
        }
    } catch (error) {
        console.error('Error al eliminar usuario: ', error);
        return res.status(500).json({ mensaje: 'Error del servidor' });
    }

}

module.exports = { registrarUsuario, iniciarSesion, eliminarUsuario, listarUsuariosConPedidos, listarUsuarios };