import { pool } from "../dbconfig.js"
import "dotenv/config"
import dataset from "../Services/dataset.js";
import { v2 as cloudinary} from "cloudinary";



const insertImage= (req,res)=>{
    const palabra= req.body.palabra
    console.log(palabra)

    if(!palabra){
        return res.status(404).json({message: 'No hay palabra'})
    }

    try{
        const result = dataset.insertImage(palabra,image)
        console.log(result)
        return res.status(200).json({message:'Imagen subida con éxito'})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:err})
    }
}


const getImagebyID = (req,res)=>{
    const id= req.params;
    console.log(id)

    if(!id){
        return res.status(404).json({message: 'No hay id'})
    }

    try{
        const result=dataset.getImagebyID(id);
        return res.status(200).json({result})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:err})
    }
}





export default{
    insertImage,
    getImagebyID
}