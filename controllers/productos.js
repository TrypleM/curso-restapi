const { response, request } = require("express");
const Producto = require('../models/producto');

const obtenerProductos = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    try {
        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query).populate('usuario', 'nombre').populate('categoria', 'nombre').skip(Number(desde)).limit(Number(limite))
        ]);

        res.json({
            total,
            productos
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }

}

// Obtener producto por el id
const obtenerProducto = async(req = request, res = response) => {

    const { id } = req.params;

    try {
        const producto = await Producto.findById(id, {}, { estado: true }).populate('usuario', 'nombre').populate('categoria', 'nombre');

        if (!producto) {
            return res.status(400).json({
                msg: 'Producto no encontrado'
            });
        }

        res.json({
            producto
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }

}

// Crear producto

const crearProducto = async(req = request, res = response) => {

    let { nombre, estado, precio, disponible, descripcion, categoria } = req.body;
    nombre = nombre.toUpperCase();


    try {

        const productoDB = await Producto.findOne({ nombre });

        if (productoDB) {
            return res.status(400).json({
                msn: 'El producto ya existe'
            });
        }

        const data = {
            nombre,
            estado,
            precio,
            disponible,
            descripcion,
            categoria,
            usuario: req.usuario._id
        }

        const producto = new Producto(data);

        await producto.save();

        return res.status(201).json({
            producto
        });



    } catch (error) {
        res.status(500).json({
            msn: 'Internal server error'
        });
    }

}

// Actualizar un producto

const actualizarProducto = async(req = request, res = response) => {

    const { id } = req.params;

    const { usuario, estado, _id, ...data } = req.body;

    try {

        if (data.nombre) {
            data.nombre = data.nombre.toUpperCase();
        }
        const producto = await Producto.findByIdAndUpdate(id, data, { new: true }).populate('usuario', 'nombre').populate('categoria', 'nombre');

        if (!producto) {
            return res.status(400).json({
                msg: 'No existe el producto'
            });
        }

        res.json({
            producto
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }


}

// Borrar producto


const borrarProducto = async(req = request, res = response) => {

    const { id } = req.params;

    try {

        const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true }).populate('usuario', 'nombre').populate('categoria', 'nombre');

        if (!producto) {
            return res.status(400).json({
                msg: 'No existe el producto'
            });
        }

        res.json({
            producto
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }


}






module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}