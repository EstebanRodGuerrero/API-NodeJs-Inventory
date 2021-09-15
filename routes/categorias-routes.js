const { Router } = require('express'); // Extraimos una funcion de express llamada Router
const { check } = require('express-validator');

const { crearCategoria , 
        obtenerCategorias , 
        obtenerCategoria , 
        actualizarCategoria,  
        borrarCategoria} = require('../controllers/categorias-controller');
const { existeCategoria } = require('../helpers/db-validators');

const { validarCampos , validarJWT, esAdmin } = require('../middlewares');



const router = Router();

/**
 * {{url}}/api/categorias
 */


    // OBTENER todas las categorias - publico
    router.get( '/' , 
        [
            check('id').custom( existeCategoria )
        ] , 
            obtenerCategorias , 
        (req , res) => {
            res.json('Todo ok');
        });



    // OBJETENER una categoria por id - publico
    router.get( '/:id' , 
        [
            check('id').custom( existeCategoria ),
            validarCampos
        ] , 
            obtenerCategoria );



    // CREAR categoria - privado - Cualquier persona con un token válido
    router.post( '/' , 
        [
            validarJWT,
            check('nombre' , 'El nombre es obligatorio').not().isEmpty(),
            validarCampos
        ] , 
            crearCategoria );



    // ACTUALIZAR categoría - privado - cualquiera con un token válido
    router.put( '/:id' , 
        [
            validarJWT,
            esAdmin,
            check('id').custom( existeCategoria ),
            validarCampos
        ] , 
            actualizarCategoria );



    // BORRAR categoría - Admi
    router.delete( '/:id' , 
        [
            validarJWT,
            esAdmin,
            check('id' , 'No es un ID valido por mongo').isMongoId(),
            check('id').custom( existeCategoria ),
            validarCampos
        ] , 
            borrarCategoria );



module.exports = router;