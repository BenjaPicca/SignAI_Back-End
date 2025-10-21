import { pool } from "../dbconfig.js"
import "dotenv/config"
import Conversacion from "../Services/Conversacion.js";
import { v2 as cloudinary} from "cloudinary";
import { uploadLargeFromFsPath, uploadLargeFromBuffer } from "./Cloudinary-helpers.js"
import fs from "fs";

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
         
        
            return res.status(200).json({message:'Seleccion de Feed exitosa'})
        
        
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
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const CrearVideo = async (req, res) => {
  const { mailusuario } = req.body;

  if (!mailusuario) {
    return res.status(400).json({ message: "Falta mailusuario" });
  }
  if (!req.file){
    return res.status(400).json({ message: "No se recibió ningún archivo" })
    }

  try {
    const cloudinaryOpts = {
      folder: "signai/videos", 
    };

    let result;

    if (req.file.path) {
      
      result = await uploadLargeFromFsPath(req.file.path, cloudinaryOpts);

    
      try { fs.unlinkSync(req.file.path); } catch {}

    } else if (req.file.buffer) {
     
      result = await uploadLargeFromBuffer(req.file.buffer, cloudinaryOpts);

    } else {
      return res.status(400).json({ message: "Formato de archivo no soportado" });
    }

    const url = result.secure_url;

   
    const { ID } = await Conversacion.CreateVideo(mailusuario, url);

    return res.status(200).json({
      message: "Video subido con éxito en modo chunked; traducción en proceso",
      id: ID,
      url,
    });

  } catch (error) {
    console.error("Error en CrearVideo (chunked):", error);
    return res.status(500).json({ message: "Error al subir el video a Cloudinary" });
  }
};

const RegisterVideo = async (req, res) => {
  const { mailusuario, url } = req.body;

  if (!mailusuario || !url) {
    return res.status(400).json({ message: "Falta mailusuario o url" });
  }

  try {
    // Registrás el video en tu base de datos y disparás el proceso de traducción
    const { ID } = await Conversacion.CreateVideo(mailusuario, url);

    return res.status(200).json({
      message: "Video registrado correctamente; traducción en proceso",
      id: ID,
      url,
    });
  } catch (e) {
    console.error("Error en RegisterVideo:", e);
    return res.status(500).json({ message: "Error registrando video" });
  }
};

const obtenerTraduccion = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Conversacion.GetTraduccion(id);
    return res.status(200).json(data);
  } catch (err) {
    console.error("Error obteniendo traducción:", err);
    if (err.message === "Conversación no encontrada") {
      return res.status(404).json({ message: err.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const obtenerTraduccionesByMail = async (req, res) => {
  const { mail } = req.params;

  
  try {
    const data = await Conversacion.GetTraduccionesByMail(mail);

    if(!data|| data === null){
      return res.status(400).json({message:'no hay ninguna traduccion'})
    }
    return res.status(200).json(data)
    
  } catch (err) {
    console.error("Error obteniendo traducciones:", err);
    if (err.message === "Conversación no encontrada") {
      return res.status(404).json({ message: err.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
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
    if (!id ) {
        return res.status(404).json({ message: 'No hay ningún Id.' })
       
    }
    if(!Feedback){
        return res.status(404).json({ message: 'No hay ningún Feedback.' })
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

const getTexto = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Falta el parámetro ID." });
  }

  const rta = await Conversacion.SelectallById(id);

  if (!rta.length) {
    return res.status(400).json({ message: "El ID no existe en la base de datos." });
  }

  try {
    const { rows } = await Conversacion.getTexto(id);

    if (!rows.length || rows[0].Texto_Devuelto === null) {
      return res.status(404).json({ message: `No se encontró texto para el ID ${id}` });
    }

    return res.status(200).json(rows[0]);

  } catch (error) {
    console.error('Error en getTexto:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};




export default {
    updateFeedback,
    deleteConversaciónById,
    insertFeedback,
    selectFeedbackById,
    CrearVideo,
    textoEntregado,
    getTexto,
    obtenerTraduccion,
    obtenerTraduccionesByMail,
    RegisterVideo
}