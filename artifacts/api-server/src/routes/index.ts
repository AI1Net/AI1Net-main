import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import aiRouter from "./ai";
import usageRouter from "./usage";
import tokensRouter from "./tokens";
import rewardsRouter from "./rewards";
import stakesRouter from "./stakes";
import governanceRouter from "./governance";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use("/health", healthRouter);
router.use("/users", usersRouter);
router.use("/ai", aiRouter);
router.use("/usage", usageRouter);
router.use("/tokens", tokensRouter);
router.use("/rewards", rewardsRouter);
router.use("/stakes", stakesRouter);
router.use("/governance", governanceRouter);
router.use("/dashboard", dashboardRouter);

export default router;
