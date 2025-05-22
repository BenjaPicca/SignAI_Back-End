import { pool } from "../dbconfig.js"
import "dotenv/config"
import Sesiones from "../Services/sesiones.js"

const postToken = async (req,res)=>{
    const body= req.body
    console.log(body)

    if(!body){
        return res.status(400).json({message:"Error al crear token(Campo/s vacio/s)"})
    }
    try{

        await Sesiones.postToken(body)
        return res.status(200).json({message:"Refresh Token creado con exito"})

    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Error al crear token"})
    }
}
export default{
    postToken,
}