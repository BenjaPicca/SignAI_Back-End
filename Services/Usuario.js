import pkg from "pg";
import "dotenv/config";
const {Pool}=pkg
import { config } from "../.dbconfig";

const insertUsuario = async(usuario)=>{
    const pool= new Pool(config);
    await pool.connect();

    try{
        const rows= await pool.query(`
        INSERT INTO public."Usuario"
         ("NombreUsuario", "Mail", "Contraseña",admin)
          VALUES ($1, $2, $3,$4)`,
          [usuario.nombre,usuario.mail,usuario.contraseña,usuario.admin])
        await pool.end();
          return rows;
        }
        catch(err){
            await pool.end();
            throw new Error;
        }
}

const getByMail = async(mail)=>{
const pool= new Pool(config);
await pool.connect();

try{
    const rows= await pool.query(`
    SELECT "Mail", "NombreUsuario"
         FROM public."Usuario" 
         WHERE "Mail"=$1`,
         [mail])
         await pool.end();
         return rows;
}
catch(err){
    await pool.end();
    throw new Error;
}
}

const deleteUsuario= async(mail)=>{
    const pool = new Pool(config);
    await pool.connect();

    try{
        const rows= await pool.query(`
        DELETE FROM public."Usuario" 
        WHERE "Mail"=$1`,[mail])

        await pool.end();
        return rows;
    }
    catch(err){
        await pool.end();
        throw new Error;
    }
}





export default {
insertUsuario,
getByMail,
deleteUsuario,

}