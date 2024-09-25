import express from "express";
import cors from "cors";
const app = express();
const port = 3000;

import Conversacion from "./Controllers/Conversacion.js";
import Usuario from "./Controllers/Usuario.js";
import { upload } from "./multer.js";
import { verifyAdmin, verifyToken } from "./middelware/middelware.js";

app.post("/fields/single", upload.single('video'), (req, res) => {
    console.log(req.file)
    res.send('Termino')
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
app.post("/login",Usuario.login)
app.get("/Selector/:mail",verifyToken,verifyAdmin, Usuario.selectUsuario)
app.delete("/delUsuario/:Mail", Usuario.deleteUsuario)
app.put("/Update", Usuario.updateUsuarioByMail)

//Conversación
app.get("/GetFeedback/:id",verifyToken,verifyAdmin, Conversacion.selectFeedbackById)
app.post("/CrearFeedback",verifyToken, Conversacion.insertFeedback)
app.post("/CrearVideo",verifyToken, upload.single("video"), Conversacion.CrearVideo)
app.delete("/EliminarConver/:id",verifyToken, Conversacion.deleteConversaciónById)
app.put("/UpdateConver",verifyToken, Conversacion.updateConversación)

app.listen(port, () => {
    console.log("Escuchando ando")
})