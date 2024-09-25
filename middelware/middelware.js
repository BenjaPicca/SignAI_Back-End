import jwt from "jsonwebtoken";
import Conversacion from "../Controllers/Conversacion.js";
import Usuario from "../Controllers/Usuario.js";

export const verifyToken = async (req, res, next) => {
    // --------------- COMPLETAR ---------------
    /*

        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar si hay un token en los headers de autorización
            2. Verificar que el token esté en el formato correcto (Bearer <token>)
            3. Verificar que el token sea válido (utilizando la librería jsonwebtoken)
            4. Verificar que tenga un id de usuario al decodificarlo
    
        Recordar también que si sucede cualquier error en este proceso, deben devolver un error 401 (Unauthorized)
    */
    const header_token = req.headers['authorization']
    console.log(header_token)
    if(!header_token){
        return res.status(400).json({ message : "Token necesario" })
    }
    const tokenParts = header_token.split(' ');
    if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
        return res.status(400).json({ message: "Formato del token no válido" });
    }
    const token = tokenParts[1];
    try{
        const secret="Holaa"
        const decoded = jwt.verify(token,secret)
        const mail=decoded.mail
        console.log(mail)
        const usuario= Usuario.selectUsuario(mail)
        if (usuario){
            console.log(mail)
            req.mail=mail
            next()
        }
        else{
            return res.status(400).json({ message: "ID no válido" });
        }
    }
    catch(error){
        
        return res.status(500).json({ message: error.message });
    }
};

export const verifyAdmin = async (req, res, next) => {
    // --------------- COMPLETAR ---------------
    /*

        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar que el id de usuario en la request es un administrador (utilizando el servicio de usuarios)
            2. Si no lo es, devolver un error 403 (Forbidden)
    
    */
   const mail=req.mail
   const usuario= await Usuario.selectUsuario(mail)
   console.log(usuario)
   console.log(usuario.admin)
   if(usuario.admin===true){
    next()
   }
   else{
    return res.status(403).json({ message: "Unauthorized" })
   }
    
};
