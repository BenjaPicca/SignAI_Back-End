import { Router } from "express";
import WeeklyEmailControllers from "../Controllers/weeklyEmail.js";

const router = Router();

router.get("/weekly-progress", WeeklyEmailControllers.sendWeeklyProgress);

export default router;
