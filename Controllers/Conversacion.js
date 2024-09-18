import { pool } from "../.dbconfig.js"
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";

const selectFeedbackById = async (req, res) => {
    const ID = req.params.id;
    const { _, rows } = await pool.query('SELECT "Feedback", "Texto_Devuelto","Fecha_Conversación","Video_Inicial" FROM public."Conversación" JOIN public."Usuario" ON public."Usuario"."Mail"= public."Conversación"."Mail_Usuario" WHERE "ID"=$1', [ID])
    res.json(rows)
}

const insertFeedback = async (req, res) => {
    const { Feedback,
        Mail_Usuario
    } = req.body;

    const { rows } = await pool.query('INSERT INTO public."Conversación" ("Feedback","Mail_Usuario") VALUES ($1,$2)', [Feedback, Mail_Usuario])
    res.send('Gracias por tu respuesta.')
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
                } catch (e) {
                    console.error(e);
                }
            }
        }
    );
}

const deleteConversaciónById = async (req, res) => {
    const ID = req.params.ID;
    try {
        await pool.query('DELETE FROM public."Conversación" WHERE "ID"=$1', [ID])

        res.send('Se ha eliminado correctamente')
    }
    catch {
        console.log(err)
    }
}

const updateConversación = async (req, res) => {
    const { Feedback,
        ID
    } = req.body
    await pool.query('UPDATE public."Conversación" SET "Feedback"=$1, WHERE "ID"=$2', [Feedback, ID])
    res.send('Se ha actualizado la tabla correctamente')

}

export default {
    updateConversación,
    deleteConversaciónById,
    insertFeedback,
    selectFeedbackById,
    CrearVideo
}