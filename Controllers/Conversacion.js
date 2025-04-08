import { pool } from "../.dbconfig.js"
import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config"
import fetch from 'node-fetch';
import Conversacion from "../Services/Conversacion.js";

const selectFeedbackById = async (req, res) => {
    const ID = req.params.id;

    if (!ID) {
        res.status(404).json({ message: 'no hay ningun id' })
    }
    try {
        const { _, rows } = await pool.query(`SELECT "Feedback", "Texto_Devuelto","Fecha_Conversación","Video_Inicial" 
        FROM public."Conversación" 
        JOIN public."Usuario" ON public."Usuario"."Mail"= public."Conversación"."Mail_Usuario"
         WHERE "ID"=$1`,
            [ID])
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
    const { mailusuario } = req.body;
    console.log("mail usuario", mailusuario);
    if(!mailusuario){
        return res.status(404).json({message:'Inicia sesión'})
    }
    try{
        await Conversacion.CreateVideo(mailusuario)
        return res.status(200).json({message:'Video subid con exito.'})
    }
    catch(err){
        return res.status(500).json({message:'Error al subir video.'})
    }
    
   
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
    const { translation} = req.body;

    console.log(id);
    console.log(translation);
    if (!translation) {
        return res.status(404).json({ message: 'No llego ningún texto.' })
    }
    if (!id) {
        return res.status(404).json({ message: 'No se encuentra el id ingresado' })
    }
    try {
        if (translation === "Error") {
            return res.status(200).json({ message: 'Fail Translator' })
        }
        await pool.query(`UPDATE public."Conversación" 
        SET "Texto_Devuelto" = $1, "Fecha_Conversación" = $3, estado = 'entregado'
         WHERE "ID" = $2 `,
         [translation, id, new Date()])
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
            if(rows.length<1){
                return res.status(404).json({message:"No hay ningun texto"})
            }
             
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