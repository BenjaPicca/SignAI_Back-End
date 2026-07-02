import Router from "express";
import SesionesControllers from "../Controllers/sesiones.js";
import { verifyAdmin,verifyToken, refreshToken } from "../middelware/middelware.js";


const router = Router();


router.post("/postToken", verifyToken, SesionesControllers.postToken)
router.post("/refresh", refreshToken)

export default router;