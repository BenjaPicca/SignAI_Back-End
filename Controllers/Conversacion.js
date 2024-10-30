import { pool } from "../.dbconfig.js"
import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";
import fetch from 'node-fetch';

const selectFeedbackById = async (req, res) => {
    const ID = req.params.id;

    if (!ID) {
        res.status(404).json({ message: 'no hay ningun id' })
    }
    try {
        const { _, rows } = await pool.query('SELECT "Feedback", "Texto_Devuelto","Fecha_Conversación","Video_Inicial" FROM public."Conversación" JOIN public."Usuario" ON public."Usuario"."Mail"= public."Conversación"."Mail_Usuario" WHERE "ID"=$1', [ID])
        return res.json(rows)
    }
    catch (error) {
        return res.status(500).json({ message: 'No se pudo seleccionar.' })
    }
}

const insertFeedback = async (req, res) => {
    const { Feedback,
        Mail_Usuario
    } = req.body;
    console.log(Mail_Usuario)
    console.log(Feedback);
    if (!Mail_Usuario) {
        return res.status(404).json({ message: 'No hay ningun Mail' })
    }

    try {
        await pool.query('INSERT INTO public."Conversación" ("Feedback","Mail_Usuario","Fecha_Conversación") VALUES ($1,$2,$3)',
            [Feedback, Mail_Usuario, new Date()]);
        return res.status(200).json({ message: 'Gracias por tu respuesta.' }
        )
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al insertar feedback' })
    }
}

const CrearVideo = async (req, res) => {
    const { Mail_Usuario } = req.body;
    console.log("mail usuario", Mail_Usuario);
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_SECRET
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
                console.log("Video subido correctamente:", result.public_id);

                const public_id = result.public_id;
                try {
                    await pool.query(`INSERT INTO public."Conversación"("Video_Inicial","Fecha_Conversación","Mail_Usuario",estado) VALUES ($1,$2,$3,'pendiente')`,
                        [public_id, new Date(), Mail_Usuario])

                    const body = {
                        id: result.public_id,
                        url: result.url
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
                        })

                    return res.status(200).json({ message: 'Video agregado.' })
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error al agregegar video' });
                }
            }
        }
    );
}

const deleteConversaciónById = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    if (!id) {
        return res.status(404).json({ message: 'No hay Id' })
    }
    try {
        await pool.query('DELETE FROM public."Conversación" WHERE "ID"=$1', [id])

        return res.status(200).json({ message: 'Se ha eliminado correctamente' })
    }
    catch (err) {
        return res.status(500).json({ message: 'Error al eliminar usuario' })
    }
}

const updateFeedback = async (req, res) => {
    const { id } = req.params;
    const Feedback
        = req.body.Feedback

    console.log(id);
    console.log(Feedback);
    if (!id) {
        return res.status(404)({ message: 'No hay ningún Id' })
    }

    try {
        await pool.query('UPDATE public."Conversación" SET "Feedback"=$1, "Fecha_Conversación"=$3 WHERE "ID"=$2',
            [Feedback, id, new Date()]);
        return res.status(200).json({ message: 'Se ha actualizado la tabla correctamente' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error al actualizar conversación.' })
    }

}

const textoEntregado = async (req, res) => {
    const { id } = req.params;
    const { Texto_Devuelto, estado } = req.body;

    console.log(id);
    console.log(Texto_Devuelto);
    if (!Texto_Devuelto) {
        return res.status(404).json({ message: 'No llego ningún texto.' })
    }
    if (!id) {
        return res.status(404).json({ message: 'no se encuentra el id ingresado' })
    }
    try {
        await pool.query(`UPDATE public."Conversación" SET "Texto_Devuelto"=$1, "Fecha_Conversación"=$3, estado = 'entregado' WHERE "ID"=$2`,
            [Texto_Devuelto, id, new Date(),])
        return res.status(200).json({ message: 'Texto entregado' })
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const getTexto= async(req,res)=>{
    const {id}= req.params;
    if(!id){
        return res.status(404).json({message:"No se encuentra ningún id ingresado."})
    }

    try{
        const {_,rows} = await pool.query('SELECT "Texto_Devuelto" FROM public."Conversación" WHERE "ID"=$1',
            [id])
            return res.status(200).json(rows[0])
    }
    catch(error){
        return res.status(500).json({message:error.message})
    }
}



export default {
    updateFeedback,
    deleteConversaciónById,
    insertFeedback,
    selectFeedbackById,
    CrearVideo,
    textoEntregado,
    getTexto
}