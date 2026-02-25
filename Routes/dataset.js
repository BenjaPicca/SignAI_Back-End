import Router from "express";
import datasetControllers from "../Controllers/dataset.js";
import { verifyAdmin,verifyToken } from "../middelware/middelware.js";
import { upload } from "../multer.js";

const router = Router();


router.get("/getimagebyId/:id",verifyToken,datasetControllers.getImagebyID)
router.post("/insertimage",upload.single('image'), verifyToken, datasetControllers.insertImage)
router.get("/getimagebyPalabra",verifyToken,datasetControllers.getImagebyPalabra)
router.get("/all", verifyToken, datasetControllers.getAll)

export default router;