import { Router, type IRouter } from "express";
import healthRouter from "./health";
import coursesRouter from "./lms/courses";
import lessonsRouter from "./lms/lessons";
import exercisesRouter from "./lms/exercises";
import progressRouter from "./lms/progress";
import vocabularyRouter from "./lms/vocabulary";
import grammarRouter from "./lms/grammar";
import dashboardRouter from "./lms/dashboard";
import achievementsRouter from "./lms/achievements";
import usersRouter from "./lms/users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(coursesRouter);
router.use(lessonsRouter);
router.use(exercisesRouter);
router.use(progressRouter);
router.use(vocabularyRouter);
router.use(grammarRouter);
router.use(dashboardRouter);
router.use(achievementsRouter);
router.use(usersRouter);

export default router;
