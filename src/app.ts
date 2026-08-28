import express from "express";
import cors from "cors";
import helmet from "helmet";

import eventRoutes from "./routes/event.routes.js";
import magazineRoutes from "./routes/magazine.route.js";
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
app.use("/api/magazines",magazineRoutes);
export default app;