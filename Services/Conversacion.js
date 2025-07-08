import "dotenv/config"
import { pool } from "../dbconfig.js"
import fetch from "node-fetch"
import { response } from "express"



const SelectFeedById= async(ID)=>{
console.log(ID)
    try{
        const rows= await pool.query
        (` SELECT "Feedback", "Texto_Devuelto","Fecha_Conversación","Video_Inicial" 
        FROM public."Conversación" 
        JOIN public."Usuario" ON public."Usuario"."Mail"= public."Conversación"."Mail_Usuario"
         WHERE "ID"=$1`,
            [ID])
        console.log(rows,'asw')
        if (rows[0].length < 1) throw new Error("Conversación no encontrada.");
        return rows

    }
    catch(err){
        throw new Error;
    }

}
const insertFeedback= async (conversacion)=>{
    
    try{
        const rows= await pool.query(`INSERT INTO public."Conversación"
             ("Feedback","Mail_Usuario","Fecha_Conversación") VALUES ($1,$2,$3)`,
        [conversacion.feedback, conversacion.mailusuario, new Date()]);
        return rows
    }
    catch(err){
        throw new Error;
    }
}
const CreateVideo= async(mailusuario,url)=>{
    try {
        const result = await pool.query(
            `INSERT INTO public."Conversación"("Video_Inicial","Fecha_Conversación","Mail_Usuario",estado) 
             VALUES ($1,$2,$3,'pendiente') RETURNING "ID"`,
            [url, new Date(), mailusuario]
        );
        console.log(result);
        const ID = result.rows[0].ID;
    
        
    
        fetch(`https://signai.fdiaznem.com.ar/predict_gemini?video_url=${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
    
            if (data.message === "received") {
                console.log("Video enviado:", data);
            } else {
                console.log("Error: " + data.message);
            }
            const translation= await response.json();

            
            return translation
        });
        fetch(`https://sign-ai-web.vercel.app/conversacion/${ID}/texto`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ translation })
  });
    
    
    } catch (err) {
        console.error(err);
        throw new error;
    }
}    
const deleteConversaciónById= async(id)=>{
   

    try{
        const rows =await pool.query(
            `DELETE FROM public."Conversación" WHERE "ID"=$1`, [id]
        )
       
       return rows
    }
    catch (err) {
        
       throw new Error;
    }
}

const updateFeed = async(id,Feedback)=>{
   console.log(id,Feedback)
    try{
        const rows = await pool.query(`
           UPDATE public."Conversación" SET "Feedback"=$1, "Fecha_Conversación"=$3 WHERE "ID"=$2
            `,[Feedback, id, new Date()])
            console.log(Feedback,id,"aaa")
        return rows
    }
    catch(err){
        console.log(err)
        throw new Error;
    }
}
const textoEntregado= async(id,translation)=>{
    
    try{
        if (translation === "Error") {
            return res.status(200).json({ message: 'Fail Translator' })
        }
       const result =  await pool.query(`
           UPDATE public."Conversación" 
        SET "Texto_Devuelto" = $1, "Fecha_Conversación" = $3, estado = 'entregado'
         WHERE "ID" = $2 `[translation, id, new Date()])
        
        return result
    }
    catch(err){
        console.log(err)
       throw new Error;
    }
}

const getTexto= async(id)=>{

    try{
        const rows = await pool.query(`
            SELECT "Texto_Devuelto" FROM public."Conversación" WHERE "ID"=$1`,[id])
            if(rows.length<1){
                return res.status(404).json({message:"No hay ningun texto"})
            }
            console.log(rows)
            console.log(rows[0])
            return (rows)
    }
    catch(err){
        console.log(err)
        throw new Error;
    }
}

export default{
 SelectFeedById,
 CreateVideo,
 deleteConversaciónById,
 updateFeed,
 textoEntregado,
 getTexto,
 insertFeedback

}