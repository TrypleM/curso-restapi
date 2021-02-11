const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_KEY);

        const usuario = await Usuario.findById(uid);

        // Verificar el estado del usuario
        if (!usuario || !usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }
        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

}


module.exports = {
    validarJWT
}