import express from "express";
import cors from "cors";
const app = express();
const port = 3000;

import ConversacionRouters from "./Routes/Conversacion.js";
import UsuarioRouters from "./Routes/Usuario.js";
import { upload } from "./multer.js";

app.post("/fields/single", upload.single('video'), (req, res) => {
    console.log(req.file)
    res.send('Termino')
})

app.use(express.json())

app.use(cors({
    origin: '*', // Origen permitido
    methods: ['GET', 'POST','PUT', 'OPTIONS'], // Métodos permitidos
     allowedHeaders : ['Content-Type','Authorization'], // Cabeceras permitidas
     credentials : true // Permitir credenciales
}))

app.get("/", (req, res) => {
    res.send("API working");
})

//Usuario
app.use("/usuario" , UsuarioRouters);

//Conversación
app.use("/conversacion" , ConversacionRouters);

app.listen(port, () => {
    console.log("Escuchando ando")
})
