import Puntaje from "../Services/Puntaje.js";
import { enviarMail } from "../Services/mailer.js";

const sendWeeklyProgress = async (req, res) => {
    const authHeader = req.headers["authorization"];
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ message: "No autorizado" });
    }

    try {
        const usuarios = await Puntaje.getWeeklyProgressAllUsers();
        const resultados = [];

        for (const usuario of usuarios) {
            const puntos = Number(usuario.puntos_semana);
            try {
                await enviarMail({
                    to: usuario.mail,
                    subject: "Tu progreso semanal en Sign AI",
                    html: `
                        <h2>Hola ${usuario.nombre || ""}!</h2>
                        <p>Esta semana sumaste <strong>${puntos}</strong> puntos practicando lenguaje de señas en Sign AI.</p>
                        <p>¡Seguí practicando para mejorar tu puntaje la próxima semana!</p>
                    `,
                });
                resultados.push({ mail: usuario.mail, enviado: true });
            }
            catch (err) {
                console.log("Error enviando mail a", usuario.mail, err);
                resultados.push({ mail: usuario.mail, enviado: false });
            }
        }

        return res.status(200).json({ message: "Proceso de envío finalizado", resultados });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error al procesar el envío semanal" });
    }
};

export default {
    sendWeeklyProgress,
};
