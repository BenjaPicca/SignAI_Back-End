import jwt from "jsonwebtoken";
import { pool } from "../.dbconfig.js";
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
        const {id}=decoded
        const usuario= await pool.query('SELECT * FROM public."Usuario" WHERE "Mail" = $1',[id])
        if (usuario){
            console.log(id)
            req.id=id
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

   const id=req.id
   const {rows} = await pool.query('SELECT * FROM public."Usuario" WHERE "Mail" = $1',[id])
   if(rows.length<1){
        return res.status(404).json({message:'No se encontro nada en la seleccion con ese Mail.'})
   }
   console.log(id)
   const usuario = rows[0];
   console.log(usuario)
   console.log(usuario.admin)
   if(usuario.admin===true){
    next();
   }
   else{
    return res.status(403).json({ message: "Unauthorized" })
   }
    
};
