
const { inicializarTablaUsuarios, inicializarSuperAdmin } = require('../models/usuarios.model');
const { inicializarTablaProductos } = require('../models/productos.model');


async function inicializarDB() {
  try {
    await inicializarTablaUsuarios();
    console.log('✅ Tabla Usuarios verificada o creada');

    await inicializarTablaProductos();
    console.log('✅ Tabla Productos verificada o creada');

    await inicializarSuperAdmin();
    console.log('✅ SuperAdmin creado por defecto' );

  } catch (error) {
    console.error('Error al inicializar base de datos:', error);

  }
}

module.exports = { inicializarDB };
