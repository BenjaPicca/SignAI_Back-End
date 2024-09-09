import express from "express";
import cors from "cors";
const app = express();
const port = 3000;
const multer= require('multer');

const upload = multer({ dest: 'uploads/' })


import Conversacion from "./Controllers/Conversacion.js";
import Usuario from "./Controllers/Usuario.js";

app.use("/fields/single",upload.single('Video'),(req,res)=>{
    console.log(req.file)
    res.send('Ter,ino')
})

app.use(express.json())

app.use(cors({
    origin: '*', // Origen permitido
    methods: ['GET', 'POST', 'OPTIONS'], // Métodos permitidos
    // allowedHeaders : ['Content-Type'], // Cabeceras permitidas
    // credentials : true // Permitir credenciales
}))

app.get("/", (req, res) => {
    res.send("API working");
})

//Usuario
app.post("/insertar", Usuario.insertUsuario)
app.get("/Selector/:mail", Usuario.selectUsuario)
app.delete("/delUsuario/:Mail", Usuario.deleteUsuario)
app.put("/Update", Usuario.updateUsuarioByMail)

//Conversación
app.get("/GetFeedback/:id", Conversacion.selectFeedbackById)
app.post("/CrearFeedback", Conversacion.insertFeedback)
app.post("/CrearVideo",Conversacion.CrearVideo)
app.delete("/EliminarConver/:id", Conversacion.deleteConversaciónById)
app.put("/UpdateConver", Conversacion.updateConversación)

app.listen(port, () => {
    console.log("Escuchando ando")
})