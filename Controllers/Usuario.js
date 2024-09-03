import bcryptjs from "bcryptjs";
import { client } from "../.dbconfig.js"

const insertUsuario = async (req, res) => {
    const {
        Mail,
        NombreUsuario,
        Contraseña
    } = req.body;
    if (!Mail ||!NombreUsuario || !Contraseña) {
        return res.status(400).send("Todos los campos tienen que estar completos");
    }

    try {

        await client.query('INSERT INTO public."Usuario" ("NombreUsuario", "Mail", "Contraseña") VALUES ($1, $2, $3)',
            [ NombreUsuario, Mail, Contraseña]);
        res.send("Se ha insertado Correctamente");
    }
    catch (err){
        res.status(500).send("Error al insertar en la base de datos: " + err.message)
    }
}

const selectUsuario = async (req, res) => {
    const Mail = req.params.mail;
    
    try
    {const { rows } = await client.query('SELECT "Mail", "NombreUsuario" FROM public."Usuario" WHERE "Mail"=$1', [Mail])
    res.json(rows[0])}
    catch(err){
        res.status(500).send("Error"+ err.message)
    }
}

const deleteUsuario = async (req, res) => {
    const Mail = req.params.Mail;
    
    const { rows } = await client.query('SELECT "Mail" FROM public."Usuario" WHERE "Mail"=$1', [Mail])

    if (rows.length === 0) {
        res.status(404).send("El mail ingreseado no existe");
        return;
    }

    await client.query('DELETE FROM public."Usuario" WHERE "Mail"=$1', [Mail])
    res.send("Se ha eliminado el usuario correctamente")
}

const updateUsuarioByMail = async (req, res) => {
    const {
        Mail,
        NombreUsuario,
        Contraseña
    } = req.body;
    if (!Mail) {
        res.status(400).send('No hay un mail ingresado')
        return;
    }
    const { rows } = await client.query('SELECT "Mail" FROM public."Usuario" WHERE "Mail"=$1', [Mail])

    if (rows.length === 0) {
        res.status(404).send("El mail ingreseado no existe");
        return;
    }

    await client.query('UPDATE public."Usuario" SET "NombreUsuario"=$1, "Contraseña"=$2 WHERE "Mail"=$3 ', [NombreUsuario, Contraseña, Mail])
    res.send("Se modificó correctamente")
}
export default {
    updateUsuarioByMail,
    deleteUsuario,
    selectUsuario,
    insertUsuario
}