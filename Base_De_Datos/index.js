import express from "express";
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


app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});