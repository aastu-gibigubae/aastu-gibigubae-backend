import 'dotenv/config';
import express from "express";
import cors from "cors";
import helmet from "helmet";

import eventRoutes from "./routes/event.routes.js";
import leaderRouter from "./routes/leader.routes.js";
import magazineRoutes from "./routes/magazine.route.js";
import kiflatRoutes from "./routes/kiflat.route.js";
import subKiflatRoutes from "./routes/subKiflat.route.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/api/events", eventRoutes);
app.use("/api/leaders", leaderRouter);
app.use("/api/magazines", magazineRoutes);
app.use("/api/kiflats", kiflatRoutes);
app.use("/api/sub-kiflats", subKiflatRoutes);

// Must be registered AFTER all routes - Express identifies error handlers by their 4 arguments
app.use(errorHandler);

export default app;
