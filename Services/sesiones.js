import pkg from "pg";
import { pool } from "../dbconfig.js"
import "dotenv/config";

const postToken = async (body)=>{

    try{
        const result= await pool.query(`INSERT INTO public."sesiones"
        ("mailusuario","refreshtoken","fecha","estadotoken") VALUES ($1,$2,$3,$4)`,
        [body.mailusuario,body.refreshtoken, new Date(), body.estadotoken])

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