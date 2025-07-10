import pkg from "pg";
import { pool } from "../dbconfig.js"
import "dotenv/config";
const { Pool } = pkg


const insertImage = async (image, palabra) => {
  try {
    const rows = await pool.query(
      `INSERT INTO public."dataset"("image", "palabra") VALUES ($1, $2)`,
      [image, palabra]
    );
    return rows;
  } catch (err) {
    console.log(err);
    throw new Error("Error al insertar imagen");
  }
};



const getImagebyPalabra = async(palabra)=>{
    try{
        const result= (` SELECT "image"
        FROM public."dataset" 
         WHERE "palabra"=$1`,
            [palabra]
        );
        console.log(result)
        return result;
    }
    catch(err){
        console.log(err);
        throw new Error;
    }
}

const getImagebyId = async (id) => {
  try {
    const result = await pool.query(
      `SELECT "image" FROM public."dataset" WHERE "id" = $1`,
      [id]
    );
    console.log(result.rows[0], 'aa');
    return result.rows[0]; 
  } 
  catch (err) {
    console.log(err);
    throw new Error('Error al obtener la imagen');
  }
};

export default{
    getImagebyId,
    getImagebyPalabra,
    insertImage
}