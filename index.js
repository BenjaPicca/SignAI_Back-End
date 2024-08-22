import express from "express";
const app = express();
const port = 3000;

import Conversacion from "./Controllers/Conversacion.js";
import Usuario from "./Controllers/Usuario.js";

app.use(express.json())

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
app.delete("/EliminarConversación/:id", Conversacion.deleteConversaciónById)
app.put("/UpdateConver", Conversacion.updateConversación)

app.listen(port, () => {
    console.log("Escuchando ando")
})