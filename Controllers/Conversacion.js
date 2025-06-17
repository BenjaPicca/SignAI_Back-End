import { pool } from "../dbconfig.js"
import "dotenv/config"
import Conversacion from "../Services/Conversacion.js";

const selectFeedbackById = async (req, res) => {
    const ID = req.params.id;

    if (!ID) {
        res.status(404).json({ message: 'no hay ningun id' })
    }
    try {
         await Conversacion.SelectFeedById(ID);
        return res.status(200).json({message:'Seleccion de Feed exitosa'})
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'No se pudo seleccionar Feed.' })
    }
}

const insertFeedback = async (req, res) => {
    const conversacion = req.body;
    console.log(conversacion.mailusuario)
    console.log(conversacion.mailusuario);
    if (!conversacion.mailusuario) {
        return res.status(404).json({ message: 'No hay ningun Mail' })
    }

    try {
        await Conversacion.insertFeedback(conversacion);
        return res.status(200).json({ message: 'Gracias por tu respuesta.' }
        )
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al insertar feedback' })
    }
}

const CrearVideo = async (req, res) => {
    const  mailusuario  = req.body.mailusuario;
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
        await Conversacion.deleteConversaciónById(id);
        return res.status(200).json({ message: 'Se ha eliminado correctamente' })
    }
    catch (err) {
        return res.status(500).json({ message: 'Error al eliminar usuario' })
    }
}

const updateFeedback = async (req, res) => {
    const { id } = req.params;
    const Feedback = req.body.Feedback

    console.log(id);
    console.log(Feedback);
    if (!id) {
        return res.status(404)({ message: 'No hay ningún Id' })
    }
    if(!Feedback){
        return res.status(404)({ message: 'Ingresar Feedback' })
    }

    try {
       const query=await Conversacion.updateFeed(id,Feedback)
        return res.status(200).json({ message: 'Se ha actualizado la tabla correctamente' });
    }
    catch (err) {
        console.log(err)
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
    catch(err){
        console.log(err);
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