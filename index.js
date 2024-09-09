import express from "express";
import cors from "cors";
const app = express();
const port = 3000;

//https://console.cloudinary.com/pm/c-061dcdfee81a13b9d53f5f072b04b8/getting-started     Con el archivo ya descargado

//


import Conversacion from "./Controllers/Conversacion.js";
import Usuario from "./Controllers/Usuario.js";

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
app.delete("/EliminarConver/:id", Conversacion.deleteConversaciónById)
app.put("/UpdateConver", Conversacion.updateConversación)

app.listen(port, () => {
    console.log("Escuchando ando")
})