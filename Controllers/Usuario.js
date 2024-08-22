
import { client } from "../.dbconfig.js"

const insertUsuario = async (req, res) => {
    const {
        Mail,
        Nombre,
        Apellido,
        NombreUsuario,
        Contraseña
    } = req.body;
    if (!Mail || !Nombre || !Apellido || !NombreUsuario || !Contraseña) {
        return res.status(400).send("Todos los campos tienen que estar completos");
    }

    try {

        await client.query('INSERT INTO public."Usuario" ("Nombre", "Apellido", "NombreUsuario", "Mail", "Contraseña") VALUES ($1, $2, $3, $4, $5)',
            [Nombre, Apellido, NombreUsuario, Mail, Contraseña]);
        res.send("Se ha insertado Correctamente");
    }
    catch (err){
        res.status(500).send("Error al insertar en la base de datos: " + err.message)
    }
}

const selectUsuario = async (req, res) => {
    const Mail = req.params.mail;
    const { rows } = await client.query('SELECT "Nombre","Apellido", "Mail", "NombreUsuario" FROM public."Usuario" WHERE "Mail"=$1', [Mail])
    res.json(rows[0])
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
        Nombre,
        Apellido,
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

    await client.query('UPDATE public."Usuario" SET "Nombre" =$1, "Apellido"=$2, "NombreUsuario"=$3, "Contraseña"=$4 WHERE "Mail"=$5 ', [Nombre, Apellido, NombreUsuario, Contraseña, Mail])
    res.send("Se modificó correctamente")
}
export default {
    updateUsuarioByMail,
    deleteUsuario,
    selectUsuario,
    insertUsuario
}