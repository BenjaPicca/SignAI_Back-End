import pkg from "pg";
import { pool } from "../dbconfig.js"
import "dotenv/config";

const postToken = async (body)=>{
    console.log(body,"anmmmanbhsdchgsdbfvh")
    console.log(body.mail)
    try{
        const result= await pool.query(`INSERT INTO public."sesiones"
        ("mailusuario","refreshtoken","fecha") VALUES ($1,$2,$3)`,
        [body.mail, body.RefreshToken, new Date()])

        return result
    }

    catch(err){
        console.log(err)
        throw new Error;
    }

}



export default{
    postToken,
    
}