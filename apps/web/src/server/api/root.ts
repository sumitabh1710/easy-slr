import { projectRouter } from "./routers/project";
import { taskRouter } from "./routers/task";
import { teamRouter } from "./routers/team";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  project: projectRouter,
  user: userRouter,
  team: teamRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;