import express from "express";
import {client} from "./.dbconfig.js"
// Creamos el servidor de Express con la configuración estándar básica
const app = express();


app.get("/", (req, res) => {
    // Esto envía el texto "Hello World!" como respuesta a la HTTP request
    res.send("Hello World!");
});

app.get("/chau", (req, res) => {
    // Esto envía el texto "Hello World!" como respuesta a la HTTP request
    res.send("CHAU");
});

app.post("/insertar", async (req, res) => {
    await client.query('INSERT INTO public."Usuario" ("Nombre", "Apellido", "NombreUsuario", "Mail", "Contraseña") VALUES ($1, $2, $3, $4, $5)',
        ["Benjamin", "Piccagli", "BenjaPicca", "benjapiccagli@gmail.com", "labruna9"]);
    res.send("Se ha insertado Correctamente")
})

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});