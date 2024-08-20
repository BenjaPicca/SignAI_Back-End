
import { client } from "./.dbconfig.js.js"


app.get("/", (req, res) => {
    // Esto envía el texto "Hello World!" como respuesta a la HTTP request
    res.send("Hello World!");
});

app.get("/chau", (req, res) => {
    // Esto envía el texto "Hello World!" como respuesta a la HTTP request
    res.send("CHAU");
});

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
    catch {
        res.status(500).send("Error al insertar en la base de datos: " + err.message)
    }
}

const selectUsuario=async (req, res) => {
    const Mail = req.body.Mail;
    const { rows } = await client.query('SELECT "Nombre","Apellido", "Mail", "NombreUsuario" FROM public."Usuario" WHERE "Mail"=$1', [Mail])
    res.json(rows[0])
}

const deleteUsuario= async (req, res) => {
    const Mail = req.body.Mail;

    
    if(!Mail){
        res.status(400).send("No es posible no ingresar nada porfavor ingrese un Mail.")
        return;
    }

    const {rows} = await client.query('SELECT "Mail" FROM public."Usuario" WHERE "Mail"=$1', [Mail])
    
    if(rows.length === 0){
        res.status(404).send("El mail ingreseado no existe");
        return;
    }

    await client.query('DELETE FROM public."Usuario" WHERE "Mail"=$1', [Mail])
    res.send("Se ha eliminado el usuario correctamente")
}

const updateUsuarioByMail=async(req, res) => {
    const {
        Mail,
        Nombre,
        Apellido,
        NombreUsuario,
        Contraseña
    } = req.body;
    if(!Mail){
        res.status(400).send('No hay un mail ingresado')
        return;
    }
    const {rows} = await client.query('SELECT "Mail" FROM public."Usuario" WHERE "Mail"=$1', [Mail])
     
    if(rows.length === 0){
        res.status(404).send("El mail ingreseado no existe");
        return;
    }
    
    await client.query('UPDATE public."Usuario" SET "Nombre" =$1, "Apellido"=$2, "NombreUsuario"=$3, "Contraseña"=$4 WHERE "Mail"=$5 ', [Nombre, Apellido, NombreUsuario, Contraseña, Mail])
    res.send("Se modificó correctamente")
}


app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});