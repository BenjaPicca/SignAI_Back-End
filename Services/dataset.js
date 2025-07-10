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
        const rows= (` SELECT "image"
        FROM public."dataset" 
         WHERE "palabra"=$1`,
            [palabra]
        );
        return rows
    }
    catch(err){
        console.log(err);
        throw new Error;
    }
}

const getImagebyID= async(id)=>{
    try{
         const rows= (` SELECT "image"
        FROM public."dataset" 
         WHERE "id"=$1`,
            [id]
        );
        return rows
    }
    catch(err){
        console.log(err);
        throw new Error;
    }
}

export default{
    getImagebyID,
    getImagebyPalabra,
    insertImage
}