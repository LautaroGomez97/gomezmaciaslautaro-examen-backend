require('dotenv').config();

const express = require('express');
require('./config/db');

const usuariosRutas = require('./router/usuario.router');
const conexion  = require('./config/db');

const app = express();
app.use(express.json());

app.use('/usuarios', usuariosRutas);
 

const { inicializarTablaUsuarios } = require('./models/usuarios.models');

inicializarTablaUsuarios()
  .then(() => console.log('✅ Tabla Usuarios verificada o creada'))
  .catch(err => console.error('❌ Error al crear tabla Usuarios:', err));


  
const puerto = process.env.PORT || 3000;
app.listen(puerto, () =>{
    console.log('Servidor corriendo en el puerto 3000');
})
