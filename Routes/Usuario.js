import { Router } from "express";
import UsuarioControllers from "../Controllers/Usuario.js";
import { verifyAdmin,verifyToken } from "../middelware/middelware.js";

const router = Router();

router.get("/Selector/:mail", verifyToken, verifyAdmin, UsuarioControllers.selectUsuario)
router.get("/:mail",UsuarioControllers.selectUsuario);
router.post("/insertar", UsuarioControllers.insertUsuario)
router.post("/login", UsuarioControllers.login)
router.delete("/delUsuario/:mail", verifyToken,verifyAdmin, UsuarioControllers.deleteUsuario)
router.put("/Update", UsuarioControllers.updateUsuarioByMail)

export default router;