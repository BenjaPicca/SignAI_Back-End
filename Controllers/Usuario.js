import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../Services/Usuario.js"
import Sesiones from "../Services/sesiones.js"

const insertUsuario = async (req, res) => {

    const usuario = req.body;
    console.log(usuario);
    if (!usuario.mail || !usuario.nombre || !usuario.contraseña) {
        return res.status(404).json({ message: "Todos los campos tienen que estar completos" });
    }

    try {

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(usuario.contraseña, salt)
        console.log(hash)

        usuario.contraseña = hash;
        console.log(usuario.mail, usuario.nombre, usuario.contraseña, usuario.admin)
        await Usuario.insertUsuario(usuario);
         res.status(200).json({ message: "Se ha insertado Correctamente" });
    }
    catch (err) {
        console.log(err)
         res.status(500).json({ message: 'Error al insertar en base de datos' })
    }
}

const selectUsuario = async (req, res) => {
    const {mail} = req.params;
    console.log(mail)

    
    console.log(req.params.length,"aaa")
    if(req.params.mail=== undefined){
        console.log(req.params,"bbbb")
        return res.status(400).json({message: 'No hay ningún Mail'})
    }
    
    try {
        const { rows } = await Usuario.getByMail(mail);
        console.log(rows[0],"anahbabvavva")
        res.status(200).json(rows[0])
    }
    catch (err) {
        console.log(err)
         res.status(500).json({ message: 'Error en selección de usuario' })
    }
}

const deleteUsuario = async (req, res) => {
    const mail = req.params.mail;
    console.log(mail,"vigi")
    console.log(req.params.mail.length,"abenha")
    if (!mail|| req.params.mail.length<1) {
        return res.status(400).json({ message: 'No hay ningún Mail' })
    }
    const  {rows} = await Usuario.getByMail(mail);
    console.log(rows)
    

    if (rows.length<1) {
        res.status(404).json({ message: "El mail ingreseado no existe" });
        return;
    }

    try{
       const rest= await Usuario.deleteUsuario(mail);

       console.log(rest)
       if(rest.rows.length<1){
           return res.status(404).json({message:"Error al entrar a la eliminación"})
       }
       else{
         return res.status(200).json({ message: "Se ha eliminado el usuario correctamente" })
    }
}
    catch(err){
         res.status(500).json({message:'No se pudo eliminar al usuario'})
    }
}

const updateUsuarioByMail = async (req, res) => {
    const usuario = req.body;
    if (!usuario.mail) {
        res.status(400).json({ message: 'No hay un mail ingresado' })
        return;
    }
    const { rows } = await Usuario.getByMail(usuario);

    if (rows.length === 0) {
        res.status(404).json({ message: "El mail ingreseado no existe" });
        return;
    }
    try {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(usuario.contraseña, salt)
        console.log(hash)

        usuario.contraseña = hash;
        console.log(usuario.mail, usuario.nombreusuario, usuario.contraseña, usuario.admin)
        await Usuario.updateUsuario(usuario);
         res.status(200).json({ message: "Se modificó correctamente" })
    }
    catch (err) {
        console.log(err)
         res.status(500).json({ message: 'Error en actualización de usuario' })
    }
}
const login = async (req, res) => {
    const usuario = req.body;

    console.log(usuario)
    console.log(usuario.mail)
    console.log(usuario.contraseña)

    if (!usuario.mail || !usuario.contraseña) {
        return res.status(404).json({ message: "Tienen que estar todos los campos completados." })
    }


    try {
        const  {rows}  = await Usuario.getAllByMail(usuario);
        console.log(rows);

        if (rows.length < 1) {
            return res.status(400).json({ message: "No hay un usuario asociado a ese mail" })
        }

        const usuario_db = rows[0];
        console.log(usuario_db);

        const password = usuario_db.Contraseña

        const secret = process.env.SECRET_TOKEN;
        const secretRefresh= process.env.SECRET_REFRESHTOKEN;

        const comparison = bcrypt.compareSync(usuario.contraseña, password)
        console.log(comparison)
        if (comparison) {
            const token = jwt.sign({ id: usuario_db.Mail }, secret, { expiresIn: '5m' });
            const RefreshToken = jwt.sign({id:usuario_db.Mail}, secretRefresh, {expiresIn : '30d'})
            console.log("accestoken:" + token);
            console.log( "refreshtoken:" +RefreshToken);
            const agregorefreshtoken= await Sesiones.postToken({mail: usuario_db.Mail, RefreshToken})
            console.log(agregorefreshtoken)
            
            res.cookie('RefreshToken' , RefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
              });
            res.status(200).json({
                token: token, usuario: {
                    Mail: usuario_db.mail,
                    Contraseña: usuario_db.contraseña,
                    NombreUsuario: usuario_db.NombreUsuario
                }

            })
            return
           
        }
        if (!comparison) {
            return res.status(401).json({ message: "Contraseña incorrecta" })
        }
    }
    catch (err) {
        console.log(err);
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