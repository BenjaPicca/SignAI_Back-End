import { Pool } from "pg"
import "dotenv/config"
import { pool } from "../.dbconfig";

const SelectFeedById= async(ID)=>{
    const pool =new Pool(config);
    await pool.connect();

    try{
        const rows= await pool.query
        (` SELECT "Feedback", "Texto_Devuelto","Fecha_Conversación","Video_Inicial" 
        FROM public."Conversación" 
        JOIN public."Usuario" ON public."Usuario"."Mail"= public."Conversación"."Mail_Usuario"
         WHERE "ID"=$1`,
            [ID])
        if (rows.length < 1) throw new Error("Conversación no encontrada.");

        await pool.end();
    }
    catch(error){
        await pool.end();
        throw new error;
    }

}

const CreateFeed= async(mailusuario,feedback)=>{
    const pool= new Pool(config);
    await pool.connect();

    try{
        const rows= await pool.query
        (
            `INSERT INTO public."Conversación" ("Feedback","Mail_Usuario","Fecha_Conversación") VALUES ($1,$2,$3)`,
            [feedback, mailusuario, new Date()]);
           
            if (rows.length<1) throw new Error("Error al crear feed")

            
            return res.status(200).json({message:"Gracias por responder."})

    }
    catch(error){
        return res.status(500)
    }
}