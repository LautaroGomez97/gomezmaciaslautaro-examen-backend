    function tieneRol(...rolesPermitidos){
        return (req, res, next) => {
            const usuario = req.usuario;

            if(!usuario)return res.status(401).json({mensaje: 'No autorizado'});
            if(!rolesPermitidos.includes(usuario.rol)){
                return res.status(403).json({ mensaje: `Acceso denegado` });
            }
            next();
        }
    }

    module.exports = { tieneRol };