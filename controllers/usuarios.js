const { response, request } = require('express');

const usuariosGet = (req = request, res = response) => {

    const { q, nombre } = req.query;
    res.json({
        message: 'get api - controlador',
        q,
        nombre
    });
}

const usuariosPost = (req = request, res = response) => {

    const { nombre, edad } = req.body;
    res.json({
        message: 'post api - controlador',
        nombre,
        edad
    });
}

const usuariosPut = (req = request, res = response) => {

    const id = req.params.id;
    res.json({
        message: 'put api - controlador',
        id
    });
}

const usuarioPatch = (req = request, res = response) => {
    res.json({
        message: 'put patch - controlador'
    });
}

const usuarioDelete = (req = request, res = response) => {
    res.json({
        message: 'put api - controlador'
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuarioDelete,
    usuarioPatch
}