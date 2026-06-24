-- Tabla de puntajes para el sistema de progreso semanal
CREATE TABLE IF NOT EXISTS public."Puntaje" (
    "ID" SERIAL PRIMARY KEY,
    "Mail_Usuario" VARCHAR(255) NOT NULL,
    "Puntos" INTEGER NOT NULL,
    "Motivo" VARCHAR(100),
    "Fecha" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_puntaje_mail_fecha
    ON public."Puntaje" ("Mail_Usuario", "Fecha");
