import { Router } from "express";
import PuntajeControllers from "../Controllers/Puntaje.js";
import { verifyToken } from "../middelware/middelware.js";

const router = Router();

router.get("/:mail/semanal", verifyToken, PuntajeControllers.getSemanal);
router.get("/:mail", verifyToken, PuntajeControllers.getTotal);

export default router;
