import { pool } from "../.dbconfig.js"
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";

const selectFeedbackById = async (req, res) => {
    const ID = req.params.id;

    if(!ID){
        res.status(404).json({message:'no hay ningun id'})
    }
    const { _, rows } = await pool.query('SELECT "Feedback", "Texto_Devuelto","Fecha_Conversación","Video_Inicial" FROM public."Conversación" JOIN public."Usuario" ON public."Usuario"."Mail"= public."Conversación"."Mail_Usuario" WHERE "ID"=$1', [ID])
    return res.json(rows)
}

const insertFeedback = async (req, res) => {
    const { Feedback,
        Mail_Usuario
    } = req.body;
    if(!Mail_Usuario){
        res.status(404).json({message:'No hay ningun Mail'})
    }

    const { rows } = await pool.query('INSERT INTO public."Conversación" ("Feedback","Mail_Usuario") VALUES ($1,$2)', [Feedback, Mail_Usuario])
   return res.json({message:'Gracias por tu respuesta.'})
}

const CrearVideo = async (req, res) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_SECRET
    });

    // Subir el video a Cloudinary
    cloudinary.uploader.upload(req.file.path,
        { resource_type: "video" },
        async function (error, result) {
            if (error) {
                console.error("Error al subir el video:", error);
            } else {
                console.log(result);
                console.log("Video subido correctamente:", result.public_id);

                const public_id = result.public_id;

                // Usa la URL del video result.secure_url para el siguiente paso
                try {
                    await pool.query('INSERT INTO public."Conversación"("Video_Inicial","Fecha_Conversación") VALUES ($1,$2)', [public_id, new Date()])
                    return res.status(200).json({message:'Video insertado'})
                } catch (e) {
                    console.error(e);
                }
            }
        }
    );
}

const deleteConversaciónById = async (req, res) => {
    const ID = req.params.ID;
    if(!ID){
        res.status(404).json({message:'No hay Id'})
    }
    try {
        await pool.query('DELETE FROM public."Conversación" WHERE "ID"=$1', [ID])

        return res.status(200).json({message:'Se ha eliminado correctamente'})
    }
    catch(err) {
        return res.status(500).json({message:'Error al eliminar usuario'})
    }
}

const updateConversación = async (req, res) => {
    const { Feedback,
        ID
    } = req.body
    if(!ID){
        res.status(404)({message:'No hay ningún Id'})
    }
    await pool.query('UPDATE public."Conversación" SET "Feedback"=$1, WHERE "ID"=$2', [Feedback, ID])
    return res.status(200).json({message:'Se ha actualizado la tabla correctamente'})

}

export default {
    updateConversación,
    deleteConversaciónById,
    insertFeedback,
    selectFeedbackById,
    CrearVideo
}