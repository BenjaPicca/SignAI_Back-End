import Router from "express";
import ConversacionControllers from "../Controllers/Conversacion";
import { verifyAdmin,verifyToken } from "../middelware/middelware";

const router = Router();

router.get("/GetFeedback/:id", verifyToken, verifyAdmin, ConversacionControllers.selectFeedbackById)
router.post("/CrearFeedback", verifyToken, ConversacionControllers.insertFeedback)
router.post("/CrearVideo", verifyToken, upload.single("video"), ConversacionControllers.CrearVideo)
router.delete("/EliminarConver/:id", verifyToken, ConversacionControllers.deleteConversaciónById)
router.put("/:id/UpdateFeed", verifyToken, ConversacionControllers.updateFeedback)
router.put("/:id/texto", ConversacionControllers.textoEntregado)
router.get("/:id/getTexto",verifyToken,ConversacionControllers.getTexto)

export default router;