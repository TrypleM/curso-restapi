const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProducto, crearProducto, obtenerProductos, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoriaId, existeProductoId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();



router.get('/', obtenerProductos);

router.get('/:id', [
        check('id').isMongoId(),
        check('id').custom(existeProductoId),
        validarCampos
    ],
    obtenerProducto);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('estado', 'El estado es obligatorio').notEmpty(),
    check('categoria', 'La categoria es obligatoria').notEmpty(),
    check('categoria').custom(existeCategoriaId),
    validarCampos
], crearProducto);

router.put('/:id', [
    validarJWT,
    check('id').isMongoId(),
    check('id').custom(existeProductoId),
    check('categoria', 'La categoria es obligatoria').notEmpty(),
    check('categoria').custom(existeCategoriaId),
    validarCampos
], actualizarProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], borrarProducto)





module.exports = router;