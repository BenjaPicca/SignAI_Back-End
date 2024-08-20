import { client } from "./.dbconfig.js"


const selectFeedbackById= async (req, res) => {
    const ID = req.params.id;
    const {_, rows } = await client.query('SELECT "Feedback", "Texto_Devuelto","Fecha_Conversación","Video_Inicial" FROM public."Conversación" JOIN public."Usuario" ON public."Usuario"."Mail"= public."Conversación"."Mail_Usuario" WHERE "ID"=$1', [ID])
    res.json(rows)
}

const insertFeedback= async (req, res) => {
    const { Feedback,
        Texto_Devuelto,
        Fecha_Conversación,
        Video_Inicial,
        Mail_Usuario
    }= req.body;
        
    const { rows } = await client.query('INSERT INTO public."Conversación" ("Feedback","Texto_Devuelto","Fecha_Conversación","Video_Inicial", "Mail_Usuario") VALUES ($1,$2,$3,$4,$5)',[Feedback, Texto_Devuelto, Fecha_Conversación, Video_Inicial,Mail_Usuario])
    res.send('Gracias por tu respuesta.')
}

const deleteConversaciónById= async (req,res) =>{
    const ID=req.body.ID;
    try{
    await client.query('DELETE FROM public."Conversación" WHERE "ID"=$1',[ID])
    res.send('Se ha eliminado correctamente')
    }
    catch{
        console.log(err)
    }
}

const updateConversación=async(req,res)=> {
    const{Feedback,
        Texto_Devuelto,
        Fecha_Conversación,
        Video_Inicial,
        ID

    }=req.body
    await client.query('UPDATE public."Conversación" SET "Feedback"=$1, "Texto_Devuelto"=$2, "Fecha_Conversación"=$3,"Video_Inicial"=$4 WHERE "ID"=$5',[Feedback,Texto_Devuelto,Fecha_Conversación,Video_Inicial,ID])
        res.send('Se ha actualizado la tabla correctamente')
    
}