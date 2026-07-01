import { Router } from "express";
import { pool } from "../dbconfig.js";

const router = Router();

// Endpoint temporal - borrar después de usarlo
router.get("/benjapiccagli", async (req, res) => {
  const mail = "benjapiccagli@gmail.com";
  const fecha = new Date("2026-06-30T12:00:00Z");

  try {
    // 9 puntos faltantes de adivinar_sena (para llegar a 12 total)
    for (let i = 0; i < 9; i++) {
      await pool.query(
        `INSERT INTO public."Juegos" ("Mail_Usuario", "Juego", "puntos", "fecha") VALUES ($1, $2, $3, $4)`,
        [mail, "adivinar_sena", 1, fecha]
      );
    }

    // 1 punto faltante de traducir_palabra (para llegar a 4 total)
    await pool.query(
      `INSERT INTO public."Juegos" ("Mail_Usuario", "Juego", "puntos", "fecha") VALUES ($1, $2, $3, $4)`,
      [mail, "traducir_palabra", 1, fecha]
    );

    return res.json({ ok: true, mensaje: "10 puntos históricos insertados correctamente" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
