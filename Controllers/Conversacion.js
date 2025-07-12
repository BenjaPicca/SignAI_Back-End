import { pool } from "../dbconfig.js"
import "dotenv/config"
import Conversacion from "../Services/Conversacion.js";
import { v2 as cloudinary} from "cloudinary";
import { Query } from "pg";

const selectFeedbackById = async (req, res) => {
    const ID = req.params.id;
    console.log(ID)

    if (!ID) {
        res.status(404).json({ message: 'no hay ningun id' })
    }
    
    try {
         const rows = await Conversacion.SelectFeedById(ID);
         console.log(rows)
         if(rows<1){
            return res.status(404).json({message:'Ese feedback no existe'})
         }
         
        else{
            return res.status(200).json({message:'Seleccion de Feed exitosa'})
        }
        
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'No se pudo seleccionar Feed.' })
    }
}

const insertFeedback = async (req, res) => {
    const conversacion = req.body;
    console.log(conversacion.mailusuario);
    if (!conversacion.mailusuario|| !conversacion.feedback) {
        console.log(conversacion.mailusuario,conversacion.feedback)
        return res.status(404).json({ message: 'No hay ningun Mail o Feedback' })
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
    const mailusuario = req.body.mailusuario;
    console.log("mail usuario: ", mailusuario);
    console.log(req.file)
    console.log("✅ ENV CHECK", {
        API_KEY: process.env.API_KEY,
        API_SECRET: process.env.API_SECRET ? 'CARGADA' : '❌',
        CLOUD_NAME: process.env.CLOUD_NAME
      });
      if (req.file.mimetype !== 'video/mp4') {
  return res.status(400).json({ message: 'Archivo no válido, debe ser obligatoriamente un .mp4' });
}
      
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });

    if (!mailusuario || mailusuario === undefined) {
        return res.status(404).json({ message: 'No se encontró el mail.' });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'No se recibió ningún archivo.' });
    }

    cloudinary.uploader.upload(
        req.file.path,
        { resource_type: "video" },
        async function (error, result) {
            if (error) {
                console.error("Error al subir el video:", error);
            } else {
                console.log(result);
                console.log("Video subido correctamente:", result.url, result.public_id);

                const url = result.url;
                if (!mailusuario) {
                    return res.status(404).json({ message: 'Inicia sesión' });
                }

                try {
                    const translation = await Conversacion.CreateVideo(mailusuario, url);
                    return res.status(200).json({message: 'Video subido con éxito.',
                        translation: translation});

                } catch (err) {
                    console.log(err);
                    return res.status(500).json({ message: 'Error al subir video.' });
                }
            }
        }
    );
};


const deleteConversaciónById = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    if (!id) {
        return res.status(404).json({ message: 'No hay Id' })
    }
    const result = await Conversacion.SelectallById(id)
    console.log(result)
        if(!result){
            return res.status(404).json({message:'No existe feedback con es ID'})
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

    const result = await Conversacion.SelectallById(id)

   
    

    if(result.length<1){
        return res.status(404).json({message:'Id ingresado no existe'})
    }
    if (!id || !Feedback) {
        return res.status(404)({ message: 'No hay ningún Id o ningún feed' })
    }
    try {
       const rows=await Conversacion.updateFeed(id,Feedback)
       console.log(rows)
        return res.status(200).json({ message: 'Se ha actualizado la Feed correctamente' });
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
        return res.status(200).json({ message: 'Texto entregado', translation })
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
        const {rows} = await Conversacion.getTexto(id);
           
        if(rows.length<1){
            return res.status(404).json({message:"No hay ningun texto"})
        }
             console.log(rows)
             console.log(rows[0])
            return res.status(200).json(rows[0])
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:err.message})
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