const { response } = require("express");
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');

const login = async(req, res = response) => {
    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        // Verificar si el usuario está activo en la BBDD
        const usuario = await Usuario.findOne({ correo });

        if (!usuario || !usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos.'
            });
        }

        // Verificar la contraseña

        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos.'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salió mal'
        });
    }


}


module.exports = {
    login
}