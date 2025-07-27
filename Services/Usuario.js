import pkg from "pg";
import { pool } from "../dbconfig.js"
import "dotenv/config";
const { Pool } = pkg

const insertUsuario = async (usuario) => {
  try {
    const rows = await pool.query(`
      INSERT INTO public."Usuario"
      ("NombreUsuario", "Mail", "Contraseña", admin)
      VALUES ($1, $2, $3, $4)`,
      [usuario.nombre, usuario.mail, usuario.contraseña, usuario.admin]);
    return rows;
  } catch (err) {
    if (err.code === '23505') {
      
      throw new Error('Ya existe un usuario con ese mail');
    }
    throw err; 
  }
};


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
const getAllByMail = async (mail) => {


    try {
        const result = await pool.query(`
        SELECT *
             FROM public."Usuario" 
             WHERE "Mail"=$1`,
            [mail])
        console.log(result.rows)
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