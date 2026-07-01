import Puntaje from "../Services/Puntaje.js";

const getTotal = async (req, res) => {
    const { mail } = req.params;
    if (!mail) {
        return res.status(400).json({ message: "Falta el mail" });
    }
    try {
        const data = await Puntaje.getTotalByMail(mail);
        return res.status(200).json({ mail, total: Number(data.total) });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error al obtener el puntaje" });
    }
};

const getSemanal = async (req, res) => {
    const { mail } = req.params;
    if (!mail) {
        return res.status(400).json({ message: "Falta el mail" });
    }
    try {
        const data = await Puntaje.getWeeklyByMail(mail);
        return res.status(200).json({ mail, puntosSemana: Number(data.total) });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error al obtener el puntaje semanal" });
    }
};

const addScore = async (req, res) => {
    const { mail, juego, puntos, fecha } = req.body;
    if (!mail || !juego || puntos === undefined) {
        return res.status(400).json({ message: "Faltan campos: mail, juego o puntos" });
    }
    try {
        await Puntaje.insertPuntaje(mail, puntos, juego);
        return res.status(200).json({ message: "Puntaje registrado" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error al registrar el puntaje" });
    }
};

export default {
    getTotal,
    getSemanal,
    addScore,
};
