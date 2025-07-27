import "dotenv/config"
import { pool } from "../dbconfig.js"
import fetch from "node-fetch"
import { response } from "express"



const SelectFeedById= async(ID)=>{
console.log(ID)
    try{
         const result = await pool.query(
        `SELECT "Feedback"
        FROM public."Conversación"
        WHERE "ID" = $1`,
        [ID]
    );
        console.log(result.rows)
        return result.rows;


    }
    catch(err){
        console.log(err)
        throw new Error;
    }

}

const SelectallById= async(id)=>{
console.log(id)
    try{
         const result = await pool.query(
        `SELECT *
        FROM public."Conversación"
        WHERE "ID" = $1`,
        [id]
    );
        console.log(result.rows,'gg')
        return result.rows;


    }
    catch(err){
        console.log(err)
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
const CreateVideo = async (mailusuario, url) => {
  try {
    const result = await pool.query(
      `INSERT INTO public."Conversación"("Video_Inicial","Fecha_Conversación","Mail_Usuario",estado) 
       VALUES ($1,$2,$3,'pendiente') RETURNING "ID"`,
      [url, new Date(), mailusuario]
    );

    if (!result || !result.rows || result.rows.length === 0) {
      console.error(" Error al insertar en la base", result);
      throw new Error("Fallo en INSERT de conversación");
    }

    const ID = result.rows[0].ID;
    console.log("Video insertado con ID:", ID);

    try {
      const response = await fetch(`https://signai.fdiaznem.com.ar/predict_gemini?video_url=${url}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(" Error en predict_gemini:", response.status, errorText);
        throw new Error(`predict_gemini falló: ${response.status}`);
      }

      const data = await response.json();
      const translation = data.translation;

      const updateResponse = await fetch(`https://sign-ai-web.vercel.app/conversacion/${ID}/texto`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translation })
      });

      const updateResult = await updateResponse.json();
      console.log("Texto actualizado:", updateResult);
      return translation;

    } catch (err) {
      console.error("Error en fetch predict_gemini o update:", err);
      throw err;
    }

  } catch (err) {
    console.error("Error general en CreateVideo:", err);
    throw err;
  }
};


  
const deleteConversaciónById= async(id)=>{
   

    try{
        const rows =await pool.query(
            `DELETE FROM public."Conversación" WHERE "ID"=$1`, [id]
        )
       console.log(rows)
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
        const result = await pool.query(`
            SELECT "Texto_Devuelto" FROM public."Conversación" WHERE "ID"=$1`,[id])
            console.log(result,'bvc')
            console.log(result.rows.Texto_devuelto,'lok')
            
            return (result)
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
 insertFeedback,
 SelectallById

}