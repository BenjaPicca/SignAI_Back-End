import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../Services/Usuario.js"

const insertUsuario = async (req, res) => {

    const {usuario} = req.body;
    console.log(usuario);
    if (!usuario.mail || !usuario.nombre || !usuario.contraseña) {
        return res.status(400).json({ message: "Todos los campos tienen que estar completos" });
    }

    try {

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(Contraseña, salt)
        console.log(hash)

        Contraseña = hash;
        console.log(usuario.mail, usuario.nombre, usuario.contraseña, usuario.admin)
        await Usuario.insertUsuario(usuario);
         res.status(200).json({ message: "Se ha insertado Correctamente" });
    }
    catch (err) {
         res.status(500).json({ message: 'Error al insertar en base de datos' })
    }
}

const selectUsuario = async (req, res) => {
    const {mail} = req.params;
    console.log(mail)

    if (!mail) {
        return res.status(404).json({ message: 'No hay ningún Mail' })
    }
    try {
        const { rows } = await Usuario.getByMail(mail);
         res.json(rows[0])
    }
    catch (err) {
        console.log(err)
         res.status(500).json({ message: 'Error en selección de usuario' })
    }
}

const deleteUsuario = async (req, res) => {
    const mail = req.params.mail;

    if (!mail) {
        return res.status(404).json({ message: 'No hay ningún Mail' })
    }
    const { rows } = await Usuario.getByMail(mail);

    if (rows.length === 0) {
        res.status(404).json({ message: "El mail ingreseado no existe" });
        return;
    }

    try{
        await Usuario.deleteUsuario(mail);
         res.status(200).json({ message: "Se ha eliminado el usuario correctamente" })
    }
    catch(err){
         res.status(500).json({message:'No se pudo eliminar al usuario'})
    }
}

const updateUsuarioByMail = async (req, res) => {
    const {
        mail,
        NombreUsuario,
        Contraseña,
        admin
    } = req.body;
    if (!mail) {
        res.status(400).json({ message: 'No hay un mail ingresado' })
        return;
    }
    const { rows } = await Usuario.getByMail(mail);

    if (rows.length === 0) {
        res.status(404).json({ message: "El mail ingreseado no existe" });
        return;
    }
    try {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(Contraseña, salt)
        console.log(hash)

        Contraseña = hash;
        console.log(mail, NombreUsuario, Contraseña, admin)
        await Usuario.updateUsuario(mail);
         res.status(200).json({ message: "Se modificó correctamente" })
    }
    catch (err) {
         res.status(500).json({ message: 'Error en actualización de usuario' })
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
        const { rows } = await Usuario.getAllByMail(usuario.mail);
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