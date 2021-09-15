const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = ( files , extensionesValidas = [ 'png' , 'jpg' , 'jpeg' , 'gif' ] , carpeta = '' ) => {

    return new Promise ( (resolve , reject) => {

            // Tomar extensión
            const { archivo } = files;
            const nombreCortado = archivo.name.split('.'); 
            const extension = nombreCortado[ nombreCortado.length - 1 ]; // Para tomar la ultima posicion del arreglo
        
        
            // Validar la extensión
            if ( !extensionesValidas.includes( extension ) ){
                return reject(`La extensión ${ extension } no es permitida - ${ extensionesValidas }`);
            }
            
        
            // Cagar el archivo en una dirname
            const nombreTemp = uuidv4() + '.' + extension; //Para generar un nombre aleatorio al archivo y que no se repita nunca.
            const uploadPath = path.join( __dirname , '../uploads/' , carpeta , nombreTemp );
        
            archivo.mv(uploadPath, ( err ) =>  {
                if (err) {
                    reject( err );
                }
                resolve( nombreTemp ); // El archivo se subio
            });

    } )

}


module.exports = {
    subirArchivo
}