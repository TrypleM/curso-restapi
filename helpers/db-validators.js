const { Categoria, Usuario, Role, Producto } = require('../models');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no es un rol válido`);
    }
}

const emailExiste = async(correo) => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe`);
    }
}

const existeUsuarioId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

const existeCategoriaId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`Èl id ${id} no existe`);
    }
}

const existeProductoId = async(id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`Èl id ${id} no existe`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioId,
    existeCategoriaId,
    existeProductoId
}