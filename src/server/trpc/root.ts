import { router } from "./trpc";
import { projectRouter } from "./routers/project.router";
import { userRouter } from "./routers/user.router";
import { authRouter } from "./routers/auth.router";
import { requestRouter } from "./routers/request.router";
import { commentRouter } from "./routers/comment.router";
import { fileRouter } from "./routers/file.router";
import { activityRouter } from "./routers/activity.router";
import { featureRouter } from "./routers/feature.router";
import { specificationRouter } from "./routers/specification.router";

export const appRouter = router({
  project: projectRouter,
  user: userRouter,
  auth: authRouter,
  request: requestRouter,
  comment: commentRouter,
  file: fileRouter,
  activity: activityRouter,
  feature: featureRouter,
  specification: specificationRouter,
});

export type AppRouter = typeof appRouter;
