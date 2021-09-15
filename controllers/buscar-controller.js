const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');



const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'roles',
    'productos'
]


    const buscarUsuarios = async ( termino = '' , res = response ) => {

        const esMongoID = ObjectId.isValid( termino ); // TRUE si es que el termino es un mongoID 

        if( esMongoID ) {
            const usuario = await Usuario.findById( termino );
            return res.json({
                results: ( usuario ) ? [ usuario ] : []   //Si encuentra un usuario: lo envia. Si no: envia un arreglo vacio
            });
        }

        const regex = new RegExp( termino , 'i' ); // RegExp: Busqueda de caracteres flexible
        const usuarios = await Usuario.find({ // Tambien podemos usar
            $or: [{ nombre: regex } , { correo: regex }], // Expresiones regulares RegExp
            $and: [{ estado: true }]
        }); 

        res.json({
            results: usuarios
        })
    }


    const buscarCategorias = async ( termino = '' , res = response ) => {

        const esMongoID = ObjectId.isValid( termino );

        if( esMongoID ) {
            const categoria = await Categoria.findById( termino );
            return res.json({
                results: ( categoria ) ? [ categoria ] : []
            });
        }

        const regex = new RegExp( termino , 'i' );
        const categorias = await Categoria.find({
            $or: [{ nombre: regex }],
            $and: [{ estado: true }]
        })

        res.json({
            results: categorias
        })
    }


    const buscarProductos = async ( termino = '' , res = response ) => {

        const esMongoID = ObjectId.isValid( termino );

        if( esMongoID ) {
            const producto = await Producto.findById( termino )
                                            .populate('categoria','nombre');
            return res.json({
                results: ( producto ) ? [ producto ] : []
            });
        }

        const regex = new RegExp( termino , 'i' );
        const productos = await Producto.find({
            $or: [{ nombre: regex }],
            $and: [{ estado: true }]
        }).populate('categoria','nombre');

        res.json({
            results: productos
        })

    }


    const buscar = ( req , res = response ) => {
        
        const { coleccion , termino } = req.params;

        // Validacion colecciones que permitimos
        if ( !coleccionesPermitidas.includes( coleccion ) ) {
            return res.status(400).json({
                msg: `Las colecciones permitidas son ${ coleccionesPermitidas }`
            });
        }


        switch ( coleccion ) {

            case 'usuarios':
                buscarUsuarios( termino , res );
            break;

            case 'categorias':
                buscarCategorias( termino , res )
            break;

            case 'productos':
                buscarProductos( termino , res )
            break;

            default:
                res.status(500).json({
                    msg:'Se me olvido hacer esta busqueda'
                })
        }


    }

    module.exports = {
        buscar
    }