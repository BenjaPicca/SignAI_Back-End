import express from "express";
import { client } from "./.dbconfig.js"
// Creamos el servidor de Express con la configuración estándar básica
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    // Esto envía el texto "Hello World!" como respuesta a la HTTP request
    res.send("Hello World!");
});

app.get("/chau", (req, res) => {
    // Esto envía el texto "Hello World!" como respuesta a la HTTP request
    res.send("CHAU");
});

app.post("/insertar", async (req, res) => {
    const {
        Mail,
        Nombre,
        Apellido,
        NombreUsuario,
        Contraseña
    } = req.body;
    try {
        await client.query('INSERT INTO public."Usuario" ("Nombre", "Apellido", "NombreUsuario", "Mail", "Contraseña") VALUES ($1, $2, $3, $4, $5)',
            [Nombre, Apellido, NombreUsuario, Mail, Contraseña]);
        res.send("Se ha insertado Correctamente");
    }
    catch {
        res.send(err)
    }
})

app.get("/prueba", async (req, res) => {
    const Mail = req.body.Mail;
    const { rows } = await client.query('SELECT "Nombre", "Mail", "NombreUsuario" FROM public."Usuario" WHERE "Mail"=$1', [Mail])
    res.json(rows[0])
})

app.delete("/delUsuario", async (req, res) => {
    const Mail = req.body.Mail;
    await client.query('DELETE FROM public."Usuario" WHERE "Mail"=$1', [Mail])
    res.send("Se ha eliminado el usuario correctamente")
})

app.put("/Update", async (req, res) => {
    const {
        Mail,
        Nombre,
        Apellido,
        NombreUsuario,
        Contraseña
    } = req.body;
    await client.query('UPDATE public."Usuario" SET "Nombre" =$1, "Apellido"=$2, "NombreUsuario"=$3, "Contraseña"=$4 WHERE "Mail"=$5 ', [Nombre, Apellido, NombreUsuario, Contraseña, Mail])
    res.send("Se modificó correctamente")
})

app.get("/GetFeedback", async (req, res) => {
    const ID = req.body.ID;
    const {_, rows } = await client.query('SELECT "Feedback", "Texto_Devuelto","Fecha_Conversación","Video_Inicial" FROM public."Conversación" WHERE "ID"=$1', [ID])
    res.json(rows)
})
app.post("/CrearFeedback", async (req, res) => {
    const { Feedback,
        Texto_Devuelto,
        Fecha_Conversación,
        Video_Inicial,
    }
        = req.body;
    const { rows } = await client.query('INSERT INTO public."Conversación" ("Feedback","Texto_Devuelto","Fecha_Conversación","Video_Inicial") VALUES ($1,$2,$3,$4)',[Feedback, Texto_Devuelto, Fecha_Conversación, Video_Inicial])
    res.send('Gracias por tu respuesta.')
})

app.delete("/EliminarConversación", async (req,res) =>{
    const ID=req.body.ID;
    try{
    await client.query('DELETE FROM public."Conversación" WHERE "ID"=$1',[ID])
    res.send('Se ha eliminado correctamente')
    }
    catch{
        console.log(err)
    }
})

app.put("/UpdateConver",async(req,res)=> {
    const{Feedback,
        Texto_Devuelto,
        Fecha_Conversación,
        Video_Inicial,
        ID

    }=req.body
    await client.query('UPDATE public."Conversación" SET "Feedback"=$1, "Texto_Devuelto"=$2, "Fecha_Conversación"=$3,"Video_Inicial"=$4 WHERE "ID"=$5',[Feedback,Texto_Devuelto,Fecha_Conversación,Video_Inicial,ID])
        res.send('Se ha actualizado la tabla correctamente')
    
})
app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});