import bcrypt from "bcryptjs";
import { pool } from "../.dbconfig.js"
import jwt from "jsonwebtoken";

const insertUsuario = async (req, res) => {

    let {
        Mail,
        NombreUsuario,
        Contraseña
    } = req.body;
    console.log(req.body);
    if (!Mail || !NombreUsuario || !Contraseña) {
        return res.status(400).json({message:"Todos los campos tienen que estar completos"});
    }

    try {

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(Contraseña, salt)
        console.log(hash)

        Contraseña = hash;
        console.log(Mail, NombreUsuario, Contraseña)
        await pool.query('INSERT INTO public."Usuario" ("NombreUsuario", "Mail", "Contraseña") VALUES ($1, $2, $3)',
            [NombreUsuario, Mail, Contraseña]);
        return res.status(200).json({ message: "Se ha insertado Correctamente" });
    }
    catch (err) {
        return res.status(500).json({message:'Error al insertar en base de datos'})
    }
}

const selectUsuario = async (req, res) => {
    const Mail = req.params.Mail;

    if (!Mail) {
        res.status(404).json({ message: 'No hay ningún Mail' })
    }
    try {
        const { rows } = await pool.query('SELECT "Mail", "NombreUsuario" FROM public."Usuario" WHERE "Mail"=$1', [Mail])
        return res.json(rows[0])
    }
    catch (err) {
        return res.status(500).json({message:'Error en selección de usuario'})
    }
}

const deleteUsuario = async (req, res) => {
    const Mail = req.params.Mail;

    if (!Mail) {
        res.status(404).json({ message: 'No hay ningún Mail' })
    }
    const { rows } = await pool.query('SELECT "Mail" FROM public."Usuario" WHERE "Mail"=$1', [Mail])

    if (rows.length === 0) {
        res.status(404).json({message:"El mail ingreseado no existe"});
        return;
    }

    await pool.query('DELETE FROM public."Usuario" WHERE "Mail"=$1', [Mail])
    return res.status(200).json({message:"Se ha eliminado el usuario correctamente"})
}

const updateUsuarioByMail = async (req, res) => {
    const {
        Mail,
        NombreUsuario,
        Contraseña
    } = req.body;
    if (!Mail) {
        res.status(400).json({message:'No hay un mail ingresado'})
        return;
    }
    const { rows } = await pool.query('SELECT "Mail" FROM public."Usuario" WHERE "Mail"=$1', [Mail])

    if (rows.length === 0) {
        res.status(404).json({message:"El mail ingreseado no existe"});
        return;
    }
    try{
    await pool.query('UPDATE public."Usuario" SET "NombreUsuario"=$1, "Contraseña"=$2 WHERE "Mail"=$3 ', [NombreUsuario, Contraseña, Mail])
    return res.status(200).json({message:"Se modificó correctamente"})
    }
    catch(err){
        return res.status(500).json({message:'Error en actualización de usuario'})
    }
}
const login = async (req, res) => {
    const usuario = req.body;

    console.log(usuario)
    console.log(usuario.Mail)
    console.log(usuario.Contraseña)

    if (!usuario.Mail || !usuario.Contraseña) {
        return res.status(404).json({ message: error.message })
    }
    

    try {
        const { rows } = await pool.query(
            'SELECT * FROM public."Usuario" WHERE "Mail" = $1',
            [usuario.Mail])
            

        console.log(rows);

        if (rows.length < 1) {
            return res.status(400).json({ message: "No hay un usuario asociado a ese mail" })
        }

        const usuario_db = rows[0];
        console.log(usuario_db);

        const password = usuario_db.Contraseña
        
        const secret = "Holaa"

        const comparison = bcrypt.compareSync(usuario.Contraseña, password)
        console.log(comparison)
        if (comparison) {
            const token = jwt.sign({ id: usuario_db.Mail }, secret, { expiresIn: 30000 * 60000 });
            return res.status(200).json({
                token: token, usuario: {
                    Mail: usuario_db.Mail,
                    Contraseña: usuario_db.Contraseña,
                    NombreUsuario: usuario_db.NombreUsuario
                }
            })
        }
        if (!comparison) {
            return res.status(400).json({ message: "Contraseña incorrecta" })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export default {
    updateUsuarioByMail,
    deleteUsuario,
    selectUsuario,
    insertUsuario,
    login
}