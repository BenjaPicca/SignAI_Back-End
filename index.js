import express from "express";
import cors from "cors";
const app = express();
const port = 3000;

import ConversacionRouters from "./Routes/Conversacion.js";
import UsuarioRouters from "./Routes/Usuario.js";
import SesionesRouters from "./Routes/sesiones.js";
import datasetRouters from "./Routes/dataset.js";
import googleRouters from "./Routes/google.js";
import { upload } from "./multer.js";


app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


app.post("/fields/single", upload.single('video'), (req, res) => {
    console.log(req.file);
    res.send('Termino');
});

app.get("/", (req, res) => {
    res.send("API working");
});

app.use("/usuario", UsuarioRouters);
app.use("/conversacion", ConversacionRouters);
app.use("/sesiones", SesionesRouters);
app.use("/dataset", datasetRouters);
app.use('/api/auth', googleRouters);

app.listen(port, () => {
    console.log("Escuchando ando");
});

export default app;
