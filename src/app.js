require('dotenv').config();
const express = require('express');
require('./config/db');

const usuariosRutas = require('./router/usuarios.router');
const productosRutas = require('./router/productos.router');
const pedidosRutas = require('./router/pedidos.router');

const { inicializarDB } = require('./config/init');

const app = express();
app.use(express.json());


app.use('/usuarios', usuariosRutas);
app.use('/productos', productosRutas);
app.use('/pedidos', pedidosRutas);


inicializarDB()
  .then(() => console.log('Inicialización de DB completa'))
  .catch(err => console.error('Error inicializando DB:', err));

const puerto = process.env.PORT || 3000;
app.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${puerto}`);
});
