const { OAuth2Client } = require('google-auth-library');




    // Crea Cliente de Google
     const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

     
     const googleVerify = async ( idToken = '' ) => {

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });

        const { name: nombre, 
                picture: img, 
                email: correo } = ticket.getPayload(); // Extraemos estos datos que nos sirven del Usuario, del login de google.
        
        return { nombre , img , correo };

    }



     module.exports = {
         googleVerify
     }