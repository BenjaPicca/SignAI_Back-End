import pkg from "pg"
import "dotenv/config"
const {Pool}= pkg
import { config } from "../.dbconfig";
import { v2 as cloudinary} from "cloudinary";



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

const CreateVideo= async(mailusuario)=>{
    const pool= new Pool(config);
    await pool.connect();

    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });
    if (!Mail_Usuario || Mail_Usuario === undefined) {
        return res.status(404).json({ message: 'No se encontró el mail.' })
    }
    cloudinary.uploader.upload(req.file.path,
        { resource_type: "video" },
        async function (error, result) {
            if (error) {
                console.error("Error al subir el video:", error);
            } else {
                console.log(result);
                console.log("Video subido correctamente:", result.url, result.public_id);

                const url = result.url;
                try {
                    const result= await pool.query(`INSERT INTO public."Conversación"("Video_Inicial","Fecha_Conversación","Mail_Usuario",estado) VALUES ($1,$2,$3,'pendiente') RETURNING "ID"`,
                        [url, new Date(), mailusuario])
                        console.log(result);
                        const ID=result.rows[0].ID;
                       
                    const body = {
                        id: ID,
                        url: url
                    } //Aca va el node-fetch
                    fetch('http://127.0.0.1:8000/translate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);

                            if (data.message === "received") {
                                console.log("Video enviado:", data);
                            } else {
                                // Muestra un mensaje de error
                                console.log("Error: " + data.message);
                            }
                            res.status(200).json({ message: 'Video agregado.',ID})
                        })

                     
                } catch (err) {
                    console.error(err);
                    await pool.end();
                    return res.status(500).json({ message: 'Error al agregegar video' });
                }
            }
        }
    );
}

const deleteConversaciónById= async(id)=>{
    const pool= new Pool(config);
    await pool.connect();

    try{
        await pool.query(
            `DELETE FROM public."Conversación" WHERE "ID"=$1`, [id]
        )
        await pool.end();
        return res.status(200).json({ message: 'Se ha eliminado correctamente' })
    }
    catch (err) {
        await pool.end();
        return res.status(500).json({ message: 'Error al eliminar usuario' })
    }
}

const updateFeed = async(id)=>{
    const pool= new Pool(config);
    await pool.connect();

    try{
        await pool.query(`
           UPDATE public."Conversación" SET "Feedback"=$1, "Fecha_Conversación"=$3 WHERE "ID"=$2
            `[Feedback, id, new Date()])

        await pool.end();
        return res.status(200).json({message:'Se ha actualizado la tabla correctamente'})
    }
    catch(err){
        await pool.end();
        return res.status(500).json({message:'Error al actualizar FeedBack'})
    }
}
const textoEntregado= async(id,translation)=>{
    const pool= new Pool(config);
    await pool.connect();

    try{
        if (translation === "Error") {
            return res.status(200).json({ message: 'Fail Translator' })
        }
        await pool.query(`
           UPDATE public."Conversación" 
        SET "Texto_Devuelto" = $1, "Fecha_Conversación" = $3, estado = 'entregado'
         WHERE "ID" = $2 `[translation, id, new Date()])
         await pool.end();
         return res.status(200).json({ message: 'Texto entregado' })
    }
    catch(err){
        await pool.end();
        return res.status(500).json({ message: err.message })
    }
}

const getTexto= async(id)=>{
    const pool=new Pool(config);
    await pool.connect();

    try{
        const rows= await pool.query(`
            SELECT "Texto_Devuelto" FROM public."Conversación" WHERE "ID"=$1`[id])
            if(rows.length<1){
                await pool.end();
                return res.status(404).json({message:"No hay ningun texto"})
            }
             await pool.end();
            return res.status(200).json(rows[0])
    }
    catch(err){
        await pool.end();
        return res.status(500).json({message:'No se pudo encontrar el texto'})
    }
}

export default{
 SelectFeedById,
 CreateFeed,
 CreateVideo,
 deleteConversaciónById,
 updateFeed,
 textoEntregado,
 getTexto

}