import { pool } from "../dbconfig.js";
import "dotenv/config";

const insertPuntaje = async (mail, puntos, motivo) => {
    try {
        const result = await pool.query(`
        INSERT INTO public."Puntaje" ("Mail_Usuario","Puntos","Motivo","Fecha")
        VALUES ($1,$2,$3,$4)`,
            [mail, puntos, motivo, new Date()]);
        return result;
    }
    catch (err) {
        console.log(err);
        throw new Error;
    }
};

const getTotalByMail = async (mail) => {
    try {
        const result = await pool.query(`
        SELECT COALESCE(SUM("Puntos"),0) AS total
        FROM public."Puntaje"
        WHERE "Mail_Usuario"=$1`, [mail]);
        return result.rows[0];
    }
    catch (err) {
        console.log(err);
        throw new Error;
    }
};

const getWeeklyByMail = async (mail) => {
    try {
        const result = await pool.query(`
        SELECT COALESCE(SUM("Puntos"),0) AS total
        FROM public."Puntaje"
        WHERE "Mail_Usuario"=$1 AND "Fecha" >= NOW() - INTERVAL '7 days'`, [mail]);
        return result.rows[0];
    }
    catch (err) {
        console.log(err);
        throw new Error;
    }
};

const getWeeklyProgressAllUsers = async () => {
    try {
        const result = await pool.query(`
        SELECT u."Mail" AS mail, u."NombreUsuario" AS nombre,
               COALESCE(SUM(p."Puntos"),0) AS puntos_semana
        FROM public."Usuario" u
        LEFT JOIN public."Puntaje" p
            ON p."Mail_Usuario" = u."Mail" AND p."Fecha" >= NOW() - INTERVAL '7 days'
        GROUP BY u."Mail", u."NombreUsuario"`);
        return result.rows;
    }
    catch (err) {
        console.log(err);
        throw new Error;
    }
};

export default {
    insertPuntaje,
    getTotalByMail,
    getWeeklyByMail,
    getWeeklyProgressAllUsers,
};
