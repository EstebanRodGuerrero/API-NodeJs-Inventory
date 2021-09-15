const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');


    /**
     * Validaciones de USUARIO
     */

    // Si el rol existe en la BD
    const esRoleValido = async ( rol = '' ) => {
        const existeRol = await Role.findOne({ rol });
        if( !existeRol ) {
            throw new Error(`El rol ${ rol } no esta registrado en la BD.`);
        }
    }

    // Verificar si el correo existe en BD
    const mailExiste = async ( correo = '' ) => {
        const existeEmail = await Usuario.findOne({ correo });
        if ( existeEmail ) {
            throw new Error(`El correo: ${ correo }, ya esta registrado.`);
        }
    }

    // Validar si existe el Usuario
    const usuarioExiste = async ( id ) => {
        const existeID = await Usuario.findById( id );
        if ( !existeID ) {
            throw new Error(`El Usuario con id: ${ id }, no esta registrado en la BD.`);
        }
    }

/**
 * Validaciones de CATEGORIA
 */
    const existeCategoria = async ( id ) => {
        const existeID = await Categoria.findById( id );
        if ( !existeID ) {
            throw new Error(`La Categoria con id: ${ id }, no esta registrado en la BD.`);
        }
    }


/**
 * Validaciones de PRODUCTOS
 */
 const existeProducto = async( id ) => {
    const existeID = await Producto.findById( id );
    if ( !existeID ) {
        throw new Error(`El Producto con id: ${ id }, no esta registrado en la BD.`);
    }
}

/**
 *  Validacion de COLECCIONES
 */
 const coleccionesPermitidas = ( coleccion = '' , permitidas = [] ) => {
    const incluida = permitidas.includes( coleccion );
    if( !incluida ) {
        throw new Error( `La coleccion ${ coleccion } no es permitida, las permitidas son: ${ permitidas }` );
    }
    return true;
 }



module.exports = {
    esRoleValido,
    mailExiste,
    usuarioExiste,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}