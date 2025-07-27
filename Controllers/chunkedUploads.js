import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

export const recibirChunk = async (req, res) => {
  const { originalname } = req.file;
  const { fileName, chunkIndex, totalChunks } = req.body;

  try {
    const chunkPath = path.join(uploadDir, `${fileName}.part${chunkIndex}`);
    fs.writeFileSync(chunkPath, req.file.buffer);

    console.log(` Chunk ${chunkIndex} guardado`);

    if (parseInt(chunkIndex) + 1 === parseInt(totalChunks)) {
      // Ensamblar
      const finalPath = path.join(uploadDir, fileName);
      const writeStream = fs.createWriteStream(finalPath);

      for (let i = 0; i < totalChunks; i++) {
        const partPath = path.join(uploadDir, `${fileName}.part${i}`);
        const data = fs.readFileSync(partPath);
        writeStream.write(data);
        fs.unlinkSync(partPath);
      }

      writeStream.end();

      writeStream.on("finish", async () => {
        console.log(" Archivo ensamblado, subiendo a Cloudinary");

        try {
          const result = await cloudinary.uploader.upload_large(finalPath, {
            resource_type: "video",
            chunk_size: 6000000, // 6 MB
          });

          fs.unlinkSync(finalPath);

          res.status(200).json({
            message: " Upload exitoso",
            url: result.secure_url,
          });
        } catch (err) {
          console.error(" Error Cloudinary:", err);
          res.status(500).json({ error: "Fallo al subir a Cloudinary" });
        }
      });
    } else {
      res.json({ message: ` Chunk ${chunkIndex} recibido` });
    }
  } catch (err) {
    console.error(" Error procesando chunk:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
