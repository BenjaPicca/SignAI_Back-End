# Sign AI

Sign AI is a project aimed at facilitating communication for people who use sign language. Through a web page, users can translate what they want to say into written text and even autocomplete with the help of Gemini or OpenAI APIs. The sign detection is done through artificial intelligence that processes videos uploaded by the user.

## Objective

The main objective of Sign AI is to provide an accessible and efficient tool for translating American Sign Language (ASL) into text. This platform is designed to be intuitive and easy to use, allowing users to simply point their cameras at their sign gestures while the AI interprets and converts these gestures into written text.

### Note

This repository only contains the code to the Back-End section. To see the AI / Machine Learning repository go to [AI / MACHINE LEARNING REPOSITORY](https://github.com/MatiasGrynfeld/SignAI-ML). Also you can see the Front-End section in this repository [FRONT-END REPOSITORY](https://github.com/tomasgrinstein/SignAI-FrontEnd).

## Sistema de puntaje y progreso semanal

Cada vez que se entrega una traducción (`PUT /conversacion/:id/texto`) se suman puntos al usuario en la tabla `Puntaje`. Estos endpoints exponen el puntaje:

- `GET /puntaje/:mail` — puntaje total del usuario.
- `GET /puntaje/:mail/semanal` — puntos sumados en los últimos 7 días.

Antes de desplegar, ejecutar el script `sql/puntaje.sql` contra la base de datos para crear la tabla `Puntaje`.

Un Cron Job de Vercel (configurado en `vercel.json`) llama todos los lunes a las 9:00 UTC al endpoint `GET /cron/weekly-progress`, que envía por mail a cada usuario su progreso de la semana.

### Variables de entorno nuevas

| Variable | Descripción |
| --- | --- |
| `SMTP_HOST` | Host del servidor SMTP (ej. `smtp.gmail.com`) |
| `SMTP_PORT` | Puerto SMTP (ej. `587` o `465`) |
| `SMTP_USER` | Usuario/cuenta de email que envía los correos |
| `SMTP_PASS` | Contraseña o App Password de esa cuenta |
| `SMTP_FROM` | (Opcional) Remitente a mostrar; si no se define se usa `SMTP_USER` |
| `CRON_SECRET` | Secreto que Vercel envía automáticamente como `Authorization: Bearer <CRON_SECRET>` al disparar el cron; protege el endpoint de envíos masivos |

Estas variables deben configurarse en el proyecto de Vercel (Settings → Environment Variables) y en el `.env` local para desarrollo.
