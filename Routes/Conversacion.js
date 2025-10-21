import { Router } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";

import ConversacionControllers from "../Controllers/Conversacion.js";
import { verifyAdmin, verifyToken } from "../middelware/middelware.js";

const router = Router();

router.get("/GetFeedback/:id", verifyToken, verifyAdmin, ConversacionControllers.selectFeedbackById);
router.post("/CrearFeedback", verifyToken, ConversacionControllers.insertFeedback);
router.delete("/EliminarConver/:id", verifyToken, ConversacionControllers.deleteConversaciónById);
router.put("/:id/UpdateFeed", verifyToken, ConversacionControllers.updateFeedback);
router.put("/:id/texto", ConversacionControllers.textoEntregado);
router.get("/:id/getTexto", verifyToken, ConversacionControllers.getTexto);
router.get("/tradByMail/:mail", verifyToken, ConversacionControllers.obtenerTraduccionesByMail);

//CHUNK
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB
  fileFilter: (req, file, cb) => {
    if ((file.mimetype || "").startsWith("video/")) return cb(null, true);
    cb(new Error("Solo se permiten archivos de video"));
  },
});
router.post("/CrearVideo", verifyToken, upload.single("video"), ConversacionControllers.CrearVideo);

export default router;
