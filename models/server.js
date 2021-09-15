const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { dbConnection } = require('../database/config');




class Server {

    
    constructor() {
        // Aqui para convertir cualquier cosa en una variable que queramos utilizar en muchos lados por ejemplo:
        this.app    = express();
        this.port   = process.env.PORT;

        // Paths
        this.authPath       = '/api/auth';
        this.buscarPath     = '/api/buscar';
        this.cargarPath     = '/api/cargar';
        this.categoriasPath = '/api/categorias';
        this.productosPath  = '/api/productos';
        this.usuariosPath   = '/api/usuarios';

        // FORMA de reutilizar mas el codigo
        // this.paths  = {
        //     auth :       '/api/auth',
        //     buscar :     '/api/buscar',
        //     categorias : '/api/categorias',
        //     productos :  '/api/productos',
        //     usuarios :   '/api/usuarios',
        //     cargar :     '/api/cargar',
        // }
       
        
       
    
        // Ejecuta ConectarBD
        this.conectarDB();

        // Ejecuta Swaggers
        this.swagger();

        // Ejecuta Middlewares
        this.middlewares();

        // Ejecuta las rutas de mi aplicación
        this.routes();
        
    }



    // Conectar DB
    async conectarDB() {
        // <--- Aquí podemos crear mas conexiones para, POR EJEMPLO: si estamos en PRODUCCIÓN utilizar una BD y otra si estamos en DESARROLLO.
        await dbConnection();
    }


    // Swagger
    swagger() {
        // Extends: https://swagger.io/specification/#infoObject
        const swaggerOptions = {
            swaggerDefinition: {
                info: {
                    title: 'Customer API',
                    description: "Customer API Informacion",
                    contact: {
                        name: "Esteban Guerrero"
                    },
                    servers: ["http://localhost:8080"]
                }
            },
            apis: ['./routes/*.js']
        };

        const swaggerDocs = swaggerJsDoc( swaggerOptions );
        this.app.use( "/api-docs" , swaggerUi.serve , swaggerUi.setup( swaggerDocs ) );

    }

    
    // Middlewares de express necesarios en el server
    middlewares() {

        // CORS: Restringe el acceso a la API, nosotros elegimos que sitios pueden acceder a este backend.
        this.app.use( cors() );

        // Directorio Publico
        this.app.use( express.static('public') );

        // FileUpload - Carga de Archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true // Si en el metodo de cargar especificamos una carpeta y esta no existe, la crea.
        }));

        // Lectura y parseo del body
        //this.app.use( express.json() );

    }


    // Rutas
    routes() {
        this.app.use( this.authPath       , express.json() , require('../routes/auth-routes') );
        this.app.use( this.buscarPath     , express.json() , require('../routes/buscar-routes') );
        this.app.use( this.cargarPath     , express.json() , require('../routes/cargar-routes') );
        this.app.use( this.categoriasPath , express.json() , require('../routes/categorias-routes') );
        this.app.use( this.productosPath  , express.json() , require('../routes/productos-routes') );
        this.app.use( this.usuariosPath   , express.json() , require('../routes/usuarios-routes') );
        
        // FORMA de reutilizar mas el codigo
        // this.app.use( this.paths.auth , require('../routes/auth-routes') );
        // this.app.use( this.paths.buscar , require('../routes/buscar-routes') );
        // this.app.use( this.paths.categorias , require('../routes/categorias-routes') );
        // this.app.use( this.paths.productos , require('../routes/productos-routes') );
        // this.app.use( this.paths.usuarios , require('../routes/usuarios-routes') );
        // this.app.use( this.paths.cargar , require('../routes/cargar-routes') );
    }


    // Escuchar puertos
    listen() {
        this.app.listen( this.port , () => {
            console.log('Servidor corriendo en el puerto: ', process.env.PORT );
        } );
    }
    
}

module.exports = Server;