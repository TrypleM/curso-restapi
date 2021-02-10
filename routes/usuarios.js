const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPost, usuariosPut, usuarioDelete, usuarioPatch } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos')
const { esRoleValido, emailExiste, existeUsuarioId } = require('../helpers/db-validators');


const router = Router();

router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio.').notEmpty(),
    check('password', 'El password debe de tener una longitud mayor a 5.').isLength({ min: 6 }),
    check('correo', 'El correo no es válido.').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);


router.delete('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
], usuarioDelete);


module.exports = router;