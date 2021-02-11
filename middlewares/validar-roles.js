const { response, request } = require("express")

const esAdminRole = (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'No existe el usuario en la request'
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - Permiso denegado`
        });
    }

    next();

}

const tieneRole = (...roles) => {


    return (req = request, res = response, next) => {
        console.log(roles);

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'No existe el usuario en la request'
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El usuario no es alguno de estos roles ${ roles } - Permiso denegado`
            });
        }
        next();
    }
}


module.exports = {
    esAdminRole,
    tieneRole
}