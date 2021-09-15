const { response , request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


    // Leer la BD ------------------------------------------------------------------
    const usuariosGET = async ( req = request , res = response ) => {
        
                                                                                                // URL de ejemplo :  http://localhost:8080/api/usuarios?q=hola&name=stebe&page=20&limit=5
                                                                                                
                                                                                                //          Asi se recojen los parametros opcionales de la URL:
                                                                                                //          const { q , name = 'No Name', page = 1 , limit } = req.params;
                                                                                            //                              |            |
                                                                                            //                              ---- --- -----> Si no nos envian dichos valores, se le podemos poner un valor por defecto.
                                                                                            //                                                -------------- DESESTRUCTURACIÓN -----------


        // Limitar resultados 
            const { limite = 5 , desde = 0 } = req.query; 
            const estadoActivo = { estado: true };
            
    /*    const usuarios = await Usuario.find( estadoActivo )
                    .skip( Number( desde ) )
                    .limit( Number( limite ) );

            const total = await Usuario.countDocuments( estadoActivo ); // Cuantos registros hay en la BD
    */

    // Lo convertimos en lo siguiente, uniendo ambas en esta promesa gigante (coleccion de promesas).
            const [ total, usuarios ] = await Promise.all([ // Desestructuracion de arreglos: Le asignamos un nombre al resultado de la primera promesa(total), y lo mismo con la segunda(usuarios). En orden.
                Usuario.countDocuments( estadoActivo ),
                Usuario.find( estadoActivo )
                    .skip( Number( desde ) )
                    .limit( Number( limite ) )
            ])

            
    res.json({              
        msg: 'get API - controlador',
        total,
        usuarios
    });

    }


    // Crear un Usuario en la BD -------------------------------------------------
    const usuariosPOST = async ( req = request , res = response ) => {


                                        /*  const body = req.body;                  ----> Si quisieramos guardar todo el objeto
                                            const usuario = new Usuario( body );

                                            const { nombre ...rest }                ----> O tamben asi
                                            const usuario = new Usuario( rest );
                                        */

        const { nombre, correo, password, rol } = req.body; // Elegimos que informacion queremos guardar en la BD, a modo de VALIDACIÓN.
        const usuario = new Usuario( { nombre, correo, password, rol } );    // ¡ Hay que instansear el modelo del usuario !         
                           

        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(10);
        usuario.password = bcryptjs.hashSync( password , salt );
        
        // Guardar en DB                                                   
        await usuario.save(); // mongoose guarda en la bd el modelo del usuario ya lleno con la info.

        res.json({           
        //  body
            msg: 'post API - controlador',
            usuario
        });
        
    }


    const usuariosPUT = async ( req = request , res = response ) => {

        const { id } = req.params;
        const { _id, password, google, correo, ...resto } = req.body; // Excluimos _id, pass, google, etc y enviamos el resto de datos para que se actualicen

        if( password ) { // Se trabaja la contraseña, ya que esta debe encriptarse SIEMPRE
            // Encriptar la contraseña
            const salt = bcryptjs.genSaltSync(10);
            resto.password = bcryptjs.hashSync( password , salt );
        }

        const usuario = await Usuario.findOneAndUpdate( id , resto );

        res.json({              
            msg: 'put API - controlador',
            usuario
        });
    }


    const usuariosPATCH = ( req = request , res = response ) => {
        res.json({              
            msg: 'patch API - controlador'
        });
    }


    const usuariosDELETE = async ( req = request , res = response ) => {

        const { id } = req.params;

                // Borramos usuario de la BD (NO RECOMEDABLE) ***
                //      const usuario = await Usuario.findByIdAndDelete( id )

        // Cambiamos el estado del usuario
            const usuario = await Usuario.findByIdAndUpdate( id , { estado: false } );

        // Ver que usuario es el que esta autenticado
            const usuarioAutenticado = req.usuario;     // req.usuario: Lo genera validarJWT
            
        res.json({              
            msg: 'delete API - controlador',
            usuario,
            usuarioAutenticado
        });
    }


module.exports = {
    usuariosGET,
    usuariosPOST,
    usuariosPUT,
    usuariosPATCH,
    usuariosDELETE
}