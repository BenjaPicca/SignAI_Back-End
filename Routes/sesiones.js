import Router from "express";
import SesionesControllers from "../Controllers/sesiones.js";
import { verifyAdmin,verifyToken } from "../middelware/middelware.js";


const router = Router();

router.get("/getToken/:id", verifyToken, verifyAdmin, SesionesControllers.getTokenbyId)
router.post("/postToken", verifyToken, SesionesControllers.postToken)
router.post("/CrearVideo", verifyToken, upload.single("video"), SesionesControllers.CrearVideo)
router.delete("/EliminarConver/:id", verifyToken, SesionesControllers.deleteConversaciónById)
router.put("/:id/UpdateFeed", verifyToken, SesionesControllers.updateFeedback)
router.put("/:id/texto", SesionesControllers.textoEntregado)
router.get("/:id/getTexto",verifyToken,SesionesControllers.getTexto)

export default router;