import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

const sanitizeFileName = (name) =>
  name.replace(/[^\w.-]/g, "_"); 

const UMBRAL_UPLOAD_LARGE = 10 * 1024 * 1024; 

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "video" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const recibirChunk = async (req, res) => {
  const { fileName, chunkIndex, totalChunks } = req.body;

  console.log(`Recibiendo chunk ${chunkIndex} de ${totalChunks} para archivo ${fileName}`);
  console.log("req.file:", req.file);
  console.log("uploadDir:", uploadDir);

  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Carpeta uploads creada");
    }

    const safeFileName = sanitizeFileName(fileName);
    const chunkPath = path.join(uploadDir, `${safeFileName}.part${chunkIndex}`);

   
    fs.writeFileSync(chunkPath, req.file.buffer);
    console.log(`Chunk ${chunkIndex} guardado en: ${chunkPath}`);
    console.log("¿Existe el chunk?", fs.existsSync(chunkPath));

    if (parseInt(chunkIndex) + 1 === parseInt(totalChunks)) {
      
      const finalPath = path.join(uploadDir, safeFileName);
      const writeStream = fs.createWriteStream(finalPath);

      for (let i = 0; i < totalChunks; i++) {
        const partPath = path.join(uploadDir, `${safeFileName}.part${i}`);
        const data = fs.readFileSync(partPath);
        writeStream.write(data);
      }

      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
        writeStream.end();
      });

      console.log("Archivo ensamblado en:", finalPath);
      console.log("¿Existe después de writeStream?", fs.existsSync(finalPath));

      let buffer;
      try {
        buffer = fs.readFileSync(finalPath);
        console.log("Archivo leído para subida, tamaño:", buffer.length);
      } catch (err) {
        console.error("No se pudo leer archivo ensamblado:", err);
        return res.status(500).json({ error: "Error leyendo archivo ensamblado" });
      }

     
      const stats = fs.statSync(finalPath);
      const fileSize = stats.size;
      console.log("Tamaño archivo ensamblado (bytes):", fileSize);

      try {
        let result;
        if (fileSize > UMBRAL_UPLOAD_LARGE) {
          console.log("Archivo grande, uso upload_stream con buffer");
          result = await uploadFromBuffer(buffer);
        } else {
          console.log("Archivo chico, uso upload simple");
          result = await cloudinary.uploader.upload(finalPath, {
            resource_type: "video",
          });
        }

        console.log("Subida completada:", result.secure_url);

        
        fs.unlinkSync(finalPath);

        
        for (let i = 0; i < totalChunks; i++) {
          const partPath = path.join(uploadDir, `${safeFileName}.part${i}`);
          try {
            fs.unlinkSync(partPath);
          } catch (err) {
            console.warn("No se pudo borrar chunk:", partPath, err.message);
          }
        }

        return res.status(200).json({
          message: "Upload exitoso",
          url: result.secure_url,
        });
      } catch (err) {
        console.error("Error Cloudinary:", err);
        return res.status(500).json({ error: "Fallo al subir a Cloudinary" });
      }
    } else {
      return res.json({ message: `Chunk ${chunkIndex} recibido` });
    }
  } catch (err) {
    console.error("Error procesando chunk:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
