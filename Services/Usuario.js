import pkg from "pg";
import { pool } from "../dbconfig.js"
import "dotenv/config";
const {Pool}=pkg

const insertUsuario = async(usuario)=>{
    const Client= new Pool(pool);
    await Client.connect();

    try{
        const rows= await Client.query(`
        INSERT INTO public."Usuario"
         ("NombreUsuario", "Mail", "Contraseña",admin)
          VALUES ($1, $2, $3,$4)`,
          [usuario.nombre,usuario.mail,usuario.contraseña,usuario.admin])
        await Client.end();
          return rows;
        }
        catch(err){
            await Client.end();
            throw new Error;
        }
}

const getByMail = async(mail)=>{
const Client= new Pool(pool);
await Client.connect();

try{
    const rows= await pool.query(`
    SELECT "Mail", "NombreUsuario"
         FROM public."Usuario" 
         WHERE "Mail"=$1`,
         [mail])
         await Client.end();
         return rows;
}
catch(err){
    await Client.end();
    throw new Error;
}
}
const getAllByMail = async(usuario)=>{
    const Client= new Pool(pool);
    await Client.connect();
    
    try{
        const rows= await Client.query(`
        SELECT *
             FROM public."Usuario" 
             WHERE "Mail"=$1`,
             [usuario.mail])
             await Client.end();
             return rows;
    }
    catch(err){
        await Client.end();
        throw new Error;
    }
    }

const deleteUsuario= async(mail)=>{
    const Client = new Pool(pool);
    await Client.connect();

    try{
        const rows= await Client.query(`
        DELETE FROM public."Usuario" 
        WHERE "Mail"=$1`,[mail])

        await Client.end();
        return rows;
    }
    catch(err){
        await Client.end();
        throw new Error;
    }
}
const updateUsuario= async(mail)=>{
    const Client= new Pool(pool);
    await Client.connect();

    try{
        const rows= await Client.query(`
        UPDATE public."Usuario"
         SET "NombreUsuario"=$1, "Contraseña"=$2, admin=$4 
         WHERE "Mail"=$3 `,[NombreUsuario, Contraseña, mail, admin]);

         await Client.end();
         return res.status(200).json({message:'Usuario actualizado'})
    }
    catch(err){
        await Client.end();
        return res.status(500).json({message:'Error al actualizar usuario'})
    }
}





export default {
insertUsuario,
getByMail,
getAllByMail,
deleteUsuario,
updateUsuario,


}