const { Router } = require('express'); // Extraimos una funcion de express llamada Router
const { check } = require('express-validator');

const { validarCampos,
        validarJWT,
        esAdmin,
        tieneRol } = require('../middlewares'); // TODO esto solo es para importar una carpeta completa en una sola importacion...

const { esRoleValido , mailExiste , usuarioExiste } = require('../helpers/db-validators');

const { usuariosGET, 
        usuariosPOST, 
        usuariosPUT, 
        usuariosPATCH, 
        usuariosDELETE } = require('../controllers/usuarios-controller');




const router = Router(); 



// Leer
    /**
     * @swagger
     * /usuarios:
     *  get:
     *      summary: Get * Usuarios
     *      tags: [Usuario]
     *      description: Use to request all customers
     *      responses:
     *          '200':
     *              description: A successful response
     */
    router.get( '/' , usuariosGET );


// Crear user
    /**
     * @swagger
     * /usuarios:
     *  post:
     *      summary: Crea un Usuario
     *      tags: [Usuario]
     *      description: Use to request all customers
     *      responses:
     *          '200':
     *              description: A successful response
     */
    router.post( '/' , 
        [
            // ---- Validaciones -----
            check('nombre'),
            check('password' , 'Password de minimo 6 caracteres').isLength({ min: 6}),
            check('correo' , 'El correo no es válido').isEmail(),
            check('correo').custom( mailExiste ),
            check('rol').custom( esRoleValido ),
                // ESTO VA!: check('rol' , 'No es un rol válido').isIn([ 'ADMIN_ROLE', 'USER_ROLE' ]),
            validarCampos
        ] , 
            usuariosPOST );

            
  
// Actualizar   
   /**
     * @swagger
     * /usuarios:
     *  Actualizar:
     *      summary: Actualiza un Usuario
     *      tags: [Usuario]
     *      description: Use to request all customers
     *      responses:
     *          '200':
     *              description: A successful response
     */
    router.put( '/:id' , // :id express recoje este valor que viene en la URL para poder utilizarlo.
        [
            // Aqui checkeamos todos los datos que queramos validar
            check('id' , 'No es un ID valido por mongo').isMongoId(),
            check('id').custom( usuarioExiste ), 
            validarCampos
        ] , 
            usuariosPUT ); 



    router.patch( '/' , usuariosPATCH );



// Borrar
    /**
     * @swagger
     * /usuarios:
     *  delete:
     *      summary: Elimina un Usuario
     *      tags: [Usuario]
     *      description: Use to request all customers
     *      responses:
     *          '200':
     *              description: A successful response
     */
    router.delete( '/:id' ,
        [
            validarJWT,
            //esAdmin, ----> Validacion ADMIN aquí
            tieneRol('ADMIN_ROLE' , 'VENTAS_ROLE'), // Validacion X roles.
            check('id' , 'No es un ID valido por mongo').isMongoId(),
            check('id').custom( usuarioExiste ), 
            validarCampos
        ] , 
            usuariosDELETE );
               




module.exports = router;