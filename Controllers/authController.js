import { OAuth2Client } from 'google-auth-library';
import { generarJWT } from '../middelware/middelware.js'; 
import Usuario from '../Services/Usuario.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const googleAuth = async (req, res) => {
  const { id_token } = req.body;

  console.log(id_token)
  if (!id_token) {
    return res.status(400).json({ message: 'id_token es requerido' });
  }

  try {
    
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience:'407408718192.apps.googleusercontent.com', // SOLO PARA TESTEO,
    });

    
    const payload = ticket.getPayload();
    console.log(payload,'SEBASTIAN')
    const mail = payload.email;
    const nombre = payload.name;

   
    let usuarios = await Usuario.getAllByMail(mail);
    let usuario = usuarios.length ? usuarios[0] : null;

    
    if (!usuario) {
      usuario = {
        mail: mail,
        nombre: nombre,
        contraseña: null, 
        admin: false,
      };
      
      await Usuario.insertUsuario(usuario);
    }

    const token = generarJWT({ id: usuario.mail, admin: usuario.admin || false });

    res.status(200).json({
      message: usuario ? 'Login con Google exitoso' : 'Registro con Google exitoso',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token de Google inválido' });
  }
};
