const fs = require('fs');
const path = require('path');
const { response } = require("express");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require("../helpers");
const { Usuario } = require("../models");
const { Producto } = require('../models');

const cargarArchivo = async(req, res = response) => {

    try {

        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            nombre
        });
    } catch (error) {
        return res.status(400).json({
            msg: error
        });
    }

}

const actualizarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                res.status(400).json({
                    msg: `No existe el usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                res.status(400).json({
                    msg: `No existe el producto con el id ${id}`
                });
            }
            break;

        default:
            res.status(500).json({
                msg: 'Iternal Server Error'
            });
            break;
    }

    try {


        if (modelo.img) {

            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre;

        await modelo.save();

        res.json(modelo);

    } catch (error) {
        res.status(500).json({
            msg: 'Error' + error
        });
    }
}

const mostrarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                res.status(400).json({
                    msg: `No existe el usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                res.status(400).json({
                    msg: `No existe el producto con el id ${id}`
                });
            }
            break;

        default:
            res.status(500).json({
                msg: 'Iternal Server Error'
            });
            break;
    }

    try {

        if (modelo.img) {

            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }

        const noImagenPath = path.join(__dirname, '../assets', 'no-image.jpg');
        return res.sendFile(noImagenPath);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Iternal Server Error' + error
        });
    }

}



const actualizarImagenCloudinary = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                res.status(400).json({
                    msg: `No existe el usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                res.status(400).json({
                    msg: `No existe el producto con el id ${id}`
                });
            }
            break;

        default:
            res.status(500).json({
                msg: 'Iternal Server Error'
            });
            break;
    }

    try {


        if (modelo.img) {
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id] = nombre.split('.');

            cloudinary.uploader.destroy(public_id);
        }

        const { tempFilePath } = req.files.archivo;

        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        modelo.img = secure_url;

        await modelo.save();

        res.json(modelo);

    } catch (error) {
        res.status(500).json({
            msg: 'Error' + error
        });
    }
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}