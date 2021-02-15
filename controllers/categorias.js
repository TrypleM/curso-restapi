const { response, request } = require("express");
const { Categoria } = require('../models');

// obtener categorias

const obtenerCategorias = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).populate('usuario', 'nombre').skip(Number(desde)).limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}

// obtenerCategoria populate

const obtenerCategoria = async(req = request, res = response) => {

    const query = { estado: true };
    const { id } = req.params;

    try {

        const categoria = await Categoria.findById(id, {}, query).populate('usuario', 'nombre');

        if (!categoria) {
            return res.status(400).json({
                msg: 'La categoria no existe'
            });
        }

        res.json({
            categoria
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }


}

// Crear categoría

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${ nombre } ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    // Guardar en DB
    await categoria.save();

    res.status(201).json({
        categoria
    });
}

// Actualizar categoria

const actualizarCategoria = async(req, res = response) => {

    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();
    const userId = req.usuario._id;

    try {
        const categoria = await Categoria.findByIdAndUpdate(id, { nombre, usuario: userId }, { new: true }).populate('usuario', 'nombre');

        if (!categoria) {
            return res.status(400).json({
                msg: 'No se ha podido actualizar la categoria'
            });
        }

        res.json({
            categoria
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }


}

// Borrar categoria - estado: false -


const eliminarCategoria = async(req, res = response) => {

    const { id } = req.params;

    try {
        const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.json({
            categoria
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }


}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria
}