import { OAuth2Client } from ('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import Usuario from "../Services/Usuario.js";
import { verifyToken } from "../middelware/middelware.js";

const loginConGoogle = async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await verifyToken.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); 
    const email = payload.email;
    const nombre = payload.name;

    
    const usuario = await Usuario.getByMail(email);

    
    if (!usuario) {
      usuario = {
        mail: email,
        nombre,
        contraseña: null,
        admin: false
      };
      await Usuario.insertUsuario(usuario);
    }

   
    const token = generarJWT({ id: usuario.mail, admin: usuario.admin });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token de Google inválido' });
  }
};

module.exports = { loginConGoogle };
