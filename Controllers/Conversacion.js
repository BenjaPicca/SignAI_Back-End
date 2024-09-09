import { pool } from "../.dbconfig.js"
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';
 
const selectFeedbackById = async (req, res) => {
    const ID = req.params.id;
    const { _, rows } = await pool.query('SELECT "Feedback", "Texto_Devuelto","Fecha_Conversación","Video_Inicial" FROM public."Conversación" JOIN public."Usuario" ON public."Usuario"."Mail"= public."Conversación"."Mail_Usuario" WHERE "ID"=$1', [ID])
    res.json(rows)
}

const insertFeedback = async (req, res) => {
    const { Feedback,
        Texto_Devuelto,
        Fecha_Conversación,
        Video_Inicial,
        Mail_Usuario
    } = req.body;

    const { rows } = await pool.query('INSERT INTO public."Conversación" ("Feedback","Texto_Devuelto","Fecha_Conversación","Video_Inicial", "Mail_Usuario") VALUES ($1,$2,$3,$4,$5)', [Feedback, Texto_Devuelto, Fecha_Conversación, Video_Inicial, Mail_Usuario])
    res.send('Gracias por tu respuesta.')
}

const CrearVideo = async (req, res) => {


    cloudinary.config({
        cloud_name: 'dn2hwzynj',
        api_key: '966768427936784',
        api_secret: 'yRu2TC3_mZfQV12s4kl5kDN8fDY'
    });

    // Subir el video a Cloudinary
    cloudinary.uploader.upload("https://sign-ai-web.vercel.app/CrearVideo", { resource_type: "video" }),
        async function (error, result) {
            if (error) {
                console.error("Error al subir el video:", error);
            } else {
                console.log("Video subido correctamente:", result.secure_url);
                // Usa la URL del video result.secure_url para el siguiente paso
                try {
                    await pool.query('INSERT INTO public."Conversación"("Video_Inicial") VALUES ($1)', [result.secure_url])
                } catch (e) {
                    console.error(e);

                }
            }
        }

        ;
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
        Texto_Devuelto,
        Fecha_Conversación,
        Video_Inicial,
        ID

    } = req.body
    await pool.query('UPDATE public."Conversación" SET "Feedback"=$1, "Texto_Devuelto"=$2, "Fecha_Conversación"=$3,"Video_Inicial"=$4 WHERE "ID"=$5', [Feedback, Texto_Devuelto, Fecha_Conversación, Video_Inicial, ID])
    res.send('Se ha actualizado la tabla correctamente')

}

export default {
    updateConversación,
    deleteConversaciónById,
    insertFeedback,
    selectFeedbackById,
    CrearVideo
}