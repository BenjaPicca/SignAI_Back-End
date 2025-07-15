import { pool } from "../dbconfig.js"
import "dotenv/config"
import dataset from "../Services/dataset.js";
import { v2 as cloudinary} from "cloudinary";



const insertImage = (req, res) => {
  const palabra = req.body.palabra;
  console.log(palabra);

  console.log("✅ ENV CHECK", {
        API_KEY: process.env.API_KEY,
        API_SECRET: process.env.API_SECRET ? 'CARGADA' : '❌',
        CLOUD_NAME: process.env.CLOUD_NAME
      });
      
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });
  if (!palabra) {
    return res.status(404).json({ message: 'No hay palabra' });
  }

  cloudinary.uploader.upload(
    req.file.path,
    { resource_type: "image" },
    async function (error, result) {
      if (error) {
        console.error("Error al subir el imagen:", error);
        return res.status(500).json({ message: 'Error al subir el imagen' });
      } else {
        console.log("imagen subido correctamente:", result.url, result.public_id);

        const url = result.url;

        try {
          const dbResult = await dataset.insertImage(url, palabra);
          console.log(dbResult);
          return res.status(200).json({ message: 'Imagen subida con éxito',url,palabra });
        } catch (err) {
          console.log(err);
          return res.status(500).json({ message: 'Error al insertar en la base de datos' });
        }
      }
    }
  );
};



const getImagebyID = (req,res)=>{
    const {id}= req.params;
    console.log(id)

    if(!id){
        return res.status(404).json({message: 'No hay id'})
    }

   
         try{
        const result= await dataset.getImagebyId(id);
        return res.status(200).json({result})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'eRROR '})
    }
    }
  


const getImagebyPalabra = (req,res)=>{
    const {palabra}= req.body
    console.log(palabra)

    if(!palabra){
        return res.status(404).json({message: 'No hay palabra'})
    }
async function esperortaa(){
    try{
        const result = await dataset.getImagebyPalabra(palabra);
        return res.status(200).json({result})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:err})
    }
}
    esperortaa();
}


export default{
    insertImage,
    getImagebyID,
    getImagebyPalabra
}