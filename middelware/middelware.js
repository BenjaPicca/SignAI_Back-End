import jwt from "jsonwebtoken";
import { pool } from "../dbconfig.js";
import Usuario from "../Services/Usuario.js"
import bcrypt from "bcryptjs/dist/bcrypt.js";

export const verifyToken = async (req, res, next) => {
    try {
        const header_token = req.headers['authorization']
        console.log(header_token)
        if(!header_token){
            return res.status(401).json({ message : "Token necesario" })
        }
        const tokenPartsAcess = header_token.split(' ');
        const refreshToken = req.headers['x-refresh-token'];
        if (tokenPartsAcess[0] !== 'Bearer' || tokenPartsAcess.length !== 2) {
            return res.status(400).json({ message: "Formato del token no válido" });
        }
        const token = tokenPartsAcess[1];
    
        const secret= process.env.SECRET_TOKEN
        console.log(token);
        const decoded = jwt.verify(token,secret)
        const {id} = decoded
        const usuario= await pool.query('SELECT * FROM public."Usuario" WHERE "Mail" = $1',[id])
        if (usuario){
            console.log(id)
            req.id=id
            next()
        }
        else{
            return res.status(400).json({ message: "ID no válido" });
        }
    } catch (error) {
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
