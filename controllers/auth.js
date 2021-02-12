const { response, json } = require("express");
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require("../helpers/google-verify");
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

const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;


    try {
        const { correo, nombre, img } = await googleVerify(id_token);

        // Verificar si el correo ya existe
        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // Creamos el usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // El usuario en BD
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario no existe'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario._id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Token de google no válido'
        });
    }


}


module.exports = {
    login,
    googleSignin
}