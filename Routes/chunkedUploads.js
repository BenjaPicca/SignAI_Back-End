import { Router } from "express";
import multer from "multer";
import { recibirChunk } from "../Controllers/chunkedUploads.js"

const router = Router();

const storage = multer.memoryStorage(); // guardamos temporalmente en RAM
const upload = multer({ storage });

router.post("/upload-chunk", upload.single("chunk"), recibirChunk);

export default router;
