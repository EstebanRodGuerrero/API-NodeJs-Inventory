const { Router } = require('express'); // Extraimos una funcion de express llamada Router
const { check } = require('express-validator');

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos-controller');
const { existeCategoria , existeProducto } = require('../helpers/db-validators');

const { validarCampos , validarJWT, esAdmin } = require('../middlewares');



const router = Router();

/**
 * {{url}}/api/productos
 */


    // OBTENER todos los productos - publico
    router.get( '/' , 
        [
            check('id').custom( existeCategoria )
        ] 
            , obtenerProductos );



    // OBJETENER un producto por id - publico
    router.get( '/:id' , 
        [
            check('id').custom( existeCategoria ),
            check('id').custom( existeProducto ),
            validarCampos
        ] ,
            obtenerProducto);



    // CREAR producto - privado - Cualquier persona con un token válido
    router.post( '/' , 
        [
            validarJWT,
            check('nombre' , 'El nombre es obligatorio').not().isEmpty(),
            validarCampos
        ] ,
            crearProducto );



    // ACTUALIZAR producto - privado - cualquiera con un token válido
    router.put( '/:id' , 
        [
            validarJWT,
            esAdmin,
            check('id').custom( existeProducto ),
            validarCampos
        ] ,
            actualizarProducto);



    // BORRAR producto - Admi
    router.delete( '/:id' ,
        [
            validarJWT,
            // esAdmin,
            // check('id' , 'No es un ID valido por mongo').isMongoId(),
            // check('id').custom( existeCategoria ),
            // validarCampos
        ] ,
            borrarProducto );



module.exports = router;