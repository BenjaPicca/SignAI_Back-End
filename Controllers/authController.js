import { OAuth2Client } from 'google-auth-library';
import { generarJWT } from '../middelware/middelware.js';
import Usuario from '../Services/Usuario.js';
import dotenv from 'dotenv';
dotenv.config();

// Podés aceptar uno o varios client IDs
const allowedAudiences = [
  process.env.GOOGLE_CLIENT_ID_WEB,  // Web client ID (principal)
  // process.env.GOOGLE_CLIENT_ID_IOS, // iOS client ID (opcional)
].filter(Boolean);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_WEB);

export const googleAuth = async (req, res) => {
  const { id_token } = req.body;
  if (!id_token) {
    return res.status(400).json({ message: 'id_token es requerido' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      // podés pasar string o array:
      audience: allowedAudiences.length === 1 ? allowedAudiences[0] : allowedAudiences,
    });

    const payload = ticket.getPayload();
    const mail = payload.email;
    const nombre = payload.name;

    let usuarios = await Usuario.getAllByMail(mail);
    let usuario = usuarios.length ? usuarios[0] : null;

    if (!usuario) {
      usuario = {
        mail,
        nombre,
        contraseña: null,
        admin: false,
      };
      await Usuario.insertUsuario(usuario);
    }

    const token = generarJWT({ id: usuario.mail, admin: !!usuario.admin });

    return res.status(200).json({
      message: usuarios.length ? 'Login con Google exitoso' : 'Registro con Google exitoso',
      token,
    });
  } catch (error) {
    console.error('googleAuth error:', error?.message || error);
    return res.status(401).json({ message: 'Token de Google inválido' });
  }
};
