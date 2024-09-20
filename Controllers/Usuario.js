import bcrypt from "bcryptjs";
import { pool } from "../.dbconfig.js"

const insertUsuario = async (req, res) => {
    
    const {
        Mail,
        NombreUsuario,
        Contraseña
    } = req.body;
    console.log(req.body);
    if (!Mail ||!NombreUsuario || !Contraseña) {
        return res.status(400).send("Todos los campos tienen que estar completos");
    }
    const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(Contraseña, salt)
        console.log(hash)

        Contraseña = hash;
        console.log(Mail,NombreUsuario,Contraseña)

    try {

        await pool.query('INSERT INTO public."Usuario" ("NombreUsuario", "Mail", "Contraseña") VALUES ($1, $2, $3)',
             [NombreUsuario, Mail, Contraseña]);
        return res.json({message: "Se ha insertado Correctamente"});
    }
    catch (err){
        return res.status(500).send("Error al insertar en la base de datos: " + err.message)
    }
}

const selectUsuario = async (req, res) => {
    const Mail = req.params.mail;
    
    if(!Mail){
        res.status(404).json({message:'No hay ningún Mail'})
    }
    try
    {const { rows } = await pool.query('SELECT "Mail", "NombreUsuario" FROM public."Usuario" WHERE "Mail"=$1', [Mail])
     return res.json(rows[0])}
    catch(err){
        return res.status(500).send("Error"+ err.message)
    }
}

const deleteUsuario = async (req, res) => {
    const Mail = req.params.Mail;
    
    if(!Mail){
        res.status(404).json({message:'No hay ningún Mail'})
    }
    const { rows } = await pool.query('SELECT "Mail" FROM public."Usuario" WHERE "Mail"=$1', [Mail])

    if (rows.length === 0) {
        res.status(404).send("El mail ingreseado no existe");
        return;
    }

    await pool.query('DELETE FROM public."Usuario" WHERE "Mail"=$1', [Mail])
    return res.send("Se ha eliminado el usuario correctamente")
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
    const { rows } = await pool.query('SELECT "Mail" FROM public."Usuario" WHERE "Mail"=$1', [Mail])

    if (rows.length === 0) {
        res.status(404).send("El mail ingreseado no existe");
        return;
    }

    await pool.query('UPDATE public."Usuario" SET "NombreUsuario"=$1, "Contraseña"=$2 WHERE "Mail"=$3 ', [NombreUsuario, Contraseña, Mail])
    return res.send("Se modificó correctamente")
}
const login= async(req,res)=>{
const {Mail,Contraseña}=req.body;
       
       if(!Mail||!Contraseña){
           return res.status(404).json({message:error.message})
       }
       
       try{
            const usuario_db= await pool.query(
                'SELECT * FROM public."Usuario" WHERE Mail = $1',
                [Mail])
            if(!usuario){
                return res.status(400).json({message:"No hay un usuario asociado a ese mail"})
            }
            const password=usuario_db.Contraseña
            const secret=""
            
            const comparison=bcrypt.compareSync(usuario.password,password)
            console.log(comparison)
            if(comparison){
                const token = jwt.sign({ id: usuario_db.id}, secret, { expiresIn: 30000 * 60000 });
                return res.status(200).json({token:token})
            }
            if(!comparison){
                return res.status(400).json({message:"Contraseña incorrecta"})
            }
       }
       catch(err){
          return res.status(500).json({message:err.message})
       }
}

export default {
    updateUsuarioByMail,
    deleteUsuario,
    selectUsuario,
    insertUsuario,
    login
}