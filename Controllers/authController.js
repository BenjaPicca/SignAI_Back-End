// Controller: auth/google
import { OAuth2Client } from 'google-auth-library';
import { generarJWT } from '../middelware/middelware.js';
import Usuario from '../Services/Usuario.js';
import dotenv from 'dotenv';
dotenv.config();

const allowedAudiences = [
  process.env.GOOGLE_CLIENT_ID_WEB,
  process.env.GOOGLE_CLIENT_ID_IOS,
  process.env.GOOGLE_CLIENT_ID_ANDROID,
].filter(Boolean);

const client = new OAuth2Client();

export const googleAuth = async (req, res) => {
  const { id_token } = req.body;
  if (!id_token)
    return res.status(400).json({ message: 'id_token es requerido' });

  try {
    // ✅ Verificamos sin pasar audience
    const ticket = await client.verifyIdToken({ idToken: id_token });
    const payload = ticket.getPayload();

    // 🔍 Validar manualmente si el aud está entre los permitidos
    if (!allowedAudiences.includes(payload.aud)) {
      console.error('❌ aud no permitido:', payload.aud);
      return res
        .status(401)
        .json({ message: 'Token de Google con audiencia no válida' });
    }

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
    console.error('❌ googleAuth error:', error?.message || error);

    try {
      const parts = id_token.split('.');
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      console.log('👉 aud del token recibido:', payload.aud);
    } catch (e) {
      console.error('No se pudo leer el aud del token:', e.message);
    }

    return res.status(401).json({ message: 'Token de Google inválido' });
  }
};
