import pkg from "pg";
import { pool } from "../dbconfig.js"
import "dotenv/config";
const { Pool } = pkg

const insertUsuario = async (usuario) => {
<<<<<<< Updated upstream
console.log(usuario,"aasgab")
    try {
        const rows = await pool.query(`
        INSERT INTO public."Usuario"
         ("NombreUsuario", "Mail", "Contraseña",admin)
          VALUES ($1, $2, $3,$4)`,
            [usuario.nombre, usuario.mail, usuario.contraseña, usuario.admin])
            console.log(rows)
        return rows;
    }
    catch (err) {
=======
  try {
    const rows = await pool.query(`
      INSERT INTO public."Usuario"
      ("NombreUsuario", "Mail", "Contraseña", admin)
      VALUES ($1, $2, $3, $4)`,
      [usuario.nombre, usuario.mail, usuario.contraseña, usuario.admin]);
    return rows;
  } catch (err) {
    throw err; 
  }
};
>>>>>>> Stashed changes

        throw new Error;
    }
}


const getByMail = async (mail) => {

    console.log(mail,'lkj')

    try {
        const rows = await pool.query(`
    SELECT "Mail", "NombreUsuario"
         FROM public."Usuario" 
         WHERE "Mail"=$1`,
            [mail])
            console.log(rows)
        return rows;
    }
    catch (err) {

        throw new Error;
    }
}
const getAllByMail = async (usuario) => {


    try {
        const result = await pool.query(`
        SELECT *
             FROM public."Usuario" 
             WHERE "Mail"=$1`,
            [usuario.mail])
        console.log(result)
        return result.rows;
    }
    catch (err) {

        throw new Error;
    }
}

const deleteUsuario = async (mail) => {

    try {
        const result = await pool.query(`
        DELETE FROM public."Usuario" 
        WHERE "Mail"=$1`, [mail])
        console.log(result,"aaaa")
        return result.rows;
    }
    catch (err) {

        throw new Error;
    }
}
const updateUsuario = async (usuario) => {


    try {
        const rows = await pool.query(`
        UPDATE public."Usuario"
         SET "NombreUsuario"=$1, "Contraseña"=$2, admin=$4 
         WHERE "Mail"=$3 `, [usuario.nombreusuario, usuario.contraseña, usuario.mail, usuario.admin]);

        return rows
    }
    catch (err) {

        throw new Error;
    }
}





export default {
    insertUsuario,
    getByMail,
    getAllByMail,
    deleteUsuario,
    updateUsuario,


}