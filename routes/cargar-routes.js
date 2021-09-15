const { Router } = require('express'); // Extraimos una funcion de express llamada Router
const { check } = require('express-validator');

const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/cargar-controller');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos , validarArchivoSubir } = require('../middlewares');


const router = Router();

    // Subir Archivo
    router.post( '/' , validarArchivoSubir , cargarArchivo );


    // Actualizar Img
    router.put( '/:coleccion/:id' , 
        [
            validarArchivoSubir,
            check( 'id', 'El id debe ser de mongo' ).isMongoId(),
            check( 'coleccion' ).custom( c => coleccionesPermitidas( c , [ 'usuarios' , 'productos' ] ) ),
            validarCampos
        ] 
            , actualizarImagenCloudinary );

            
    // Get Imagen o Archivo
    router.get( '/:coleccion/:id' , 
        [
            check( 'id', 'El id debe ser de mongo' ).isMongoId(),
            check( 'coleccion' ).custom( c => coleccionesPermitidas( c , [ 'usuarios' , 'productos' ] ) ),
            validarCampos
        ] 
            , mostrarImagen );


module.exports = router;