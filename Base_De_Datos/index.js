import express from "express";
import { client } from "./.dbconfig.js"
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
    const {
        Mail,
        Nombre,
        Apellido,
        NombreUsuario,
        Contraseña
    } = req.body;

    await client.query('INSERT INTO public."Usuario" ("Nombre", "Apellido", "NombreUsuario", "Mail", "Contraseña") VALUES ($1, $2, $3, $4, $5)',
        [Nombre, Apellido, NombreUsuario, Mail, Contraseña]);
    res.send("Se ha insertado Correctamente")
})

app.get("/prueba", async (req, res) => {
    const Mail = req.body.Mail;
    const { rows } = await client.query('SELECT "Nombre", "Mail", "NombreUsuario" FROM public."Usuario" WHERE "Mail"=$1', [Mail])
    res.json(rows[0])
})

app.delete("/delUsuario", async (req, res) => {
    const Mail = req.body.Mail;
    await client.query('DELETE * FROM public."Usuario" WHERE "Mail"=$1', [Mail])
    res.send("Se ha eliminado", { Mail })
})

app.put("/Update", async (req, res) => {
    const {
        mail,
        Nombre,
        Apellido,
        NombreUsuario,
        Contraseña
    } = req.body;
    const { rows } = await client.query('UPDATE public."Usuario" SET "Nombre" =$1, "Apellido"=$2, "NombreUsuario"=$3, "Contraseña"=$4 WHERE "Mail"=$5 ', [Nombre, Apellido, NombreUsuario, Contraseña, mail])
    res.json(rows)
})
app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});