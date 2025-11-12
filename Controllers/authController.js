import { OAuth2Client } from 'google-auth-library';
import { generarJWT } from '../middelware/middelware.js';
import Usuario from '../Services/Usuario.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new OAuth2Client();

export const googleAuth = async (req, res) => {
  const { id_token } = req.body;
  if (!id_token)
    return res.status(400).json({ message: 'id_token es requerido' });

  // ✅ Todos los posibles client IDs
  const allowedAudiences = [
    process.env.GOOGLE_CLIENT_ID_WEB,
    process.env.GOOGLE_CLIENT_ID_IOS,
    process.env.GOOGLE_CLIENT_ID_ANDROID,
  ].filter(Boolean);

  console.log('✅ allowedAudiences =', allowedAudiences);

  let payload = null;

  try {
    for (const aud of allowedAudiences) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: id_token,
          audience: aud,
        });
        payload = ticket.getPayload();
        console.log('✅ Token válido con audience =', aud);
        break; // sale del loop
      } catch (err) {

        console.log(`❌ Token no válido para audience: ${aud}`);
      }
    }

    
    if (!payload) {
      return res.status(401).json({ message: 'Token de Google con audiencia no válida' });
    }

    console.log('👉 aud del token recibido:', payload.aud);

    const mail = payload.email;
    const nombre = payload.name;

    let usuarios = await Usuario.getAllByMail(mail);
    let usuario = usuarios.length ? usuarios[0] : null;

    if (!usuario) {
      usuario = { mail, nombre, contraseña: null, admin: false };
      await Usuario.insertUsuario(usuario);
    }

    const token = generarJWT({ id: usuario.mail, admin: !!usuario.admin });

    return res.status(200).json({
      message: usuarios.length
        ? 'Login con Google exitoso'
        : 'Registro con Google exitoso',
      token,
    });
  } catch (error) {
    console.error('googleAuth error:', error.message || error);
    return res.status(401).json({ message: 'Token de Google inválido' });
  }
};
