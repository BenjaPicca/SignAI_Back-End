import pkg from "pg";
import "dotenv/config";
const {Pool}=pkg

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
const getAllByMail = async(usuario)=>{
    const pool= new Pool(config);
    await pool.connect();
    
    try{
        const rows= await pool.query(`
        SELECT *
             FROM public."Usuario" 
             WHERE "Mail"=$1`,
             [usuario.mail])
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
const updateUsuario= async(mail)=>{
    const pool= new Pool(config);
    await pool.connect();

    try{
        const rows= await pool.query(`
        UPDATE public."Usuario"
         SET "NombreUsuario"=$1, "Contraseña"=$2, admin=$4 
         WHERE "Mail"=$3 `,[NombreUsuario, Contraseña, mail, admin]);

         await pool.end();
         return res.status(200).json({message:'Usuario actualizado'})
    }
    catch(err){
        await pool.end();
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