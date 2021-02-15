const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { existeCategoriaId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas las categorias
router.get('/', obtenerCategorias);

// Una categoria por id
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
], obtenerCategoria);


// Crear categoria PRIVADO cualquier persona con un token válido

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], crearCategoria);

// Actualizar el registro por el id privado por token valido

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('id').custom(existeCategoriaId),
    validarCampos
], actualizarCategoria);

// Borrar una categoria - Admin

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
], eliminarCategoria);

module.exports = router;