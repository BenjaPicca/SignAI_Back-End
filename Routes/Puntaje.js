import { Router } from "express";
import PuntajeControllers from "../Controllers/Puntaje.js";
import { verifyToken } from "../middelware/middelware.js";

const router = Router();

router.post("/add", verifyToken, PuntajeControllers.addScore);
router.get("/:mail/semanal", verifyToken, PuntajeControllers.getSemanal);
router.get("/:mail/juegos", verifyToken, PuntajeControllers.getByJuego);
router.get("/:mail", verifyToken, PuntajeControllers.getTotal);

export default router;
