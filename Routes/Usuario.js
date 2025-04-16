import { Router } from "express";
import UsuarioControllers from "../Controllers/Usuario";
import { verifyAdmin,verifyToken } from "../middelware/middelware";

const router = Router();

router.get("/",UsuarioControllers.selectUsuario);
router.post("/insertar", UsuarioControllers.insertUsuario)
router.post("/login", UsuarioControllers.login)
router.get("/Selector/:mail", verifyToken, verifyAdmin, UsuarioControllers.selectUsuario)
router.delete("/delUsuario/:mail", verifyToken,verifyAdmin, UsuarioControllers.deleteUsuario)
router.put("/Update", UsuarioControllers.updateUsuarioByMail)

export default router;