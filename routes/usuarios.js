const { Router } = require('express');
const { usuariosGet, usuariosPost, usuariosPut, usuarioDelete, usuarioPatch } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);

router.post('/', usuariosPost);

router.put('/:id', usuariosPut);

router.patch('/', usuarioPatch);

router.delete('/', usuarioDelete);


module.exports = router;