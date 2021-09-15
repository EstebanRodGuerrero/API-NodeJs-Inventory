const { request , response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


    // Login
    const login = async ( req = request , res = response ) => {

        const { correo , password } = req.body;

        try {
            const usuario = await Usuario.findOne({ correo });

            // Verificar si encontro el email Usuario ---------
                if( !usuario ) {
                    return res.status(400).json({
                        msg: 'Usuario no es correctos'
                    });
                }

            // Si el usuario está activo ---------
                if( !usuario ) {
                    return res.status(400).json({
                        msg: 'Usuario / Password no está activo | estado: false'
                    });
                }

            // Validar la contraseña  ----------
                const validPassword = bcryptjs.compareSync( password , usuario.password ); // Compara la contraseña que estan enviando con la que esta en la BD.

                if( !validPassword ) {
                    return res.status(400).json({
                        msg: 'La password es incorrecta'
                    });
                }

            // Generar el JWT  ---------------- Encargado del login propiamente tal
                const token = await generarJWT( usuario.id );

                
            res.json({
                msg: 'Login ok',
                usuario,
                token
            })


        } catch ( error ) {
            console.log( error );
            return res.status(500).json({
                msg: 'Hable con el administrador'
            })
        }

    }


    // Controlador google sign-in
    const googleSignin = async ( req , res ) => {
    
        const { id_token } = req.body; // Traemos el token del body

        try {

            // CREAR USUARIO VIA GOOGLE-SIGN-IN ---
                const { nombre , correo , img } = await googleVerify( id_token ); // Usamos google verify
                
                let usuario = await Usuario.findOne({ correo }) // Buscamos un usuario en la BD por su correo
                
                // Si no existe
                    if( !usuario ) {
                        // Tengo que crearlo
                        const data = {
                            nombre,
                            correo,
                            password: 'cualquiercosajjjaa',
                            img,
                            google: true
                        }

                        usuario = new Usuario( data );

                        await usuario.save();

                    } // else {  ... TODO: Si existe UPDATE datos ***



            // Si el Usuario está bloqueado 
            if ( !usuario.estado ) {
                return res.status(401).json({
                    msg: 'Hable con el administrador. Usuario bloqueado'
                })
            }

            // Generar el JWT  
             const token = await generarJWT( usuario.id );

            

            res.json({
                msg: 'Todo Ok! Google Sign-in',
                usuario,
                token
            })

        
        } catch (error) {

            res.status(400).json({
                msg: 'Token de Google no válido'
            })
        }
        
        

    }


module.exports = {
    login,
    googleSignin
}