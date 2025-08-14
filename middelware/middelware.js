import jwt from "jsonwebtoken";
import Usuario from "../Services/Usuario.js"


export const generarJWT = (usuario) => {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.SECRET_TOKEN,
    { expiresIn: '1h' }
  );
};



export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado o formato inválido' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

    const { id } = decoded;
    const usuario = await Usuario.getAllByMail(id);

    if (!usuario.length) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = {
      id,
      admin: usuario[0].admin
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado', detalle: error.message });
  }
};
export const refreshToken = (req, res) => {
  const refreshToken = req.headers['x-refresh-token'];

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token faltante' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_RT);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.SECRET_TOKEN,
      { expiresIn: '15m' } 
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Refresh token inválido o expirado' });
  }
};

export const verifyAdmin = async (req, res, next) => {

   const id=req.id
   const {rows} = await Usuario.getAllByMail(id);
   if(rows.length<1){
        return res.status(404).json({message:'No se encontro nada en la seleccion con ese Mail.'})
   }
   console.log(id)
   const usuario = rows[0];
   console.log(usuario)
   console.log(usuario.admin)
   if(usuario.admin===true){
    next();
   }
   else{
    return res.status(403).json({ message: "Unauthorized" })
   }
    
};
