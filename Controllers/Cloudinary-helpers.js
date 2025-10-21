
import fs from "fs";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";


export const uploadLargeFromFsPath = (filePath, opts = {}) =>
  new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_large_stream(
      {
        resource_type: "video",
        chunk_size: 6 * 1024 * 1024, // 6 MB por chunk; podés subir a 20–50 MB si tu red lo banca
        ...opts,                    
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    fs.createReadStream(filePath).pipe(upload);
  });

// Sube en chunks streameando desde memoria (req.file.buffer)
export const uploadLargeFromBuffer = (buffer, opts = {}) =>
  new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_large_stream(
      {
        resource_type: "video",
        chunk_size: 6 * 1024 * 1024,
        ...opts,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(upload);
  });
