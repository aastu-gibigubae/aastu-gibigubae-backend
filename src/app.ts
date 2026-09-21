import 'dotenv/config';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "../config/config.js";

import eventRoutes from "./routes/event.routes.js";
import leaderRouter from "./routes/leader.routes.js";
import magazineRoutes from "./routes/magazine.route.js";
import kiflatRoutes from "./routes/kiflat.route.js";
import subKiflatRoutes from "./routes/subKiflat.route.js";
import announcementRoutes from "./routes/announcement.routes.js";
import adminScopeRoutes from "./routes/adminScope.routes.js";
import galleryRouter from "./routes/gallery.routes.js";
import alehuBewereRoutes from "./routes/alehuBewere.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import devRoutes from "./routes/dev.routes.js";

const app = express();

app.use(helmet());

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(globalLimiter);

app.use(
  cors({
    origin: config.ALLOWED_ORIGINS,
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
app.use("/api/announcements", announcementRoutes);
app.use("/api/admin/sub-admins", adminScopeRoutes);
app.use("/api/gallery", galleryRouter);
app.use("/api/alehu-bewere", alehuBewereRoutes);
app.use("/api/dev", devRoutes);

// Must be registered AFTER all routes - Express identifies error handlers by their 4 arguments
app.use(errorHandler);

export default app;