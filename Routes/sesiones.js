import Router from "express";
import SesionesControllers from "../Controllers/sesiones.js";
import { verifyAdmin,verifyToken } from "../middelware/middelware.js";


const router = Router();


router.post("/postToken", verifyToken, SesionesControllers.postToken)

export default router;